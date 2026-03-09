import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, phone } = await req.json();
    if (!name || !phone) {
      return new Response(
        JSON.stringify({ error: "Name and phone are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Upsert visitor by IP
    const { error: dbError } = await supabase
      .from("visitors")
      .upsert(
        { name, phone, ip_address: clientIp },
        { onConflict: "ip_address" }
      );

    if (dbError) throw dbError;

    // Send Feishu notification
    const FEISHU_WEBHOOK_URL = Deno.env.get("FEISHU_WEBHOOK_URL");
    if (FEISHU_WEBHOOK_URL) {
      const now = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
      await fetch(FEISHU_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          msg_type: "interactive",
          card: {
            header: {
              title: { tag: "plain_text", content: "👤 新访客登录通知" },
              template: "green",
            },
            elements: [
              {
                tag: "div",
                fields: [
                  { is_short: true, text: { tag: "lark_md", content: `**姓名**\n${name}` } },
                  { is_short: true, text: { tag: "lark_md", content: `**手机号**\n${phone}` } },
                  { is_short: true, text: { tag: "lark_md", content: `**IP地址**\n${clientIp}` } },
                  { is_short: true, text: { tag: "lark_md", content: `**时间**\n${now}` } },
                ],
              },
            ],
          },
        }),
      }).catch((e) => console.error("Feishu notify failed:", e));
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("register-visitor error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});