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

    // Send email notification
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (RESEND_API_KEY) {
      const now = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "鲲腾能科通知 <onboarding@resend.dev>",
          to: "s15202136096@mail.com",
          subject: `【新访客登录】${name} - ${phone}`,
          html: `
            <h2>新访客登录通知</h2>
            <table style="border-collapse:collapse;width:100%;max-width:400px">
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">姓名</td><td style="padding:8px;border:1px solid #ddd">${name}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">手机号</td><td style="padding:8px;border:1px solid #ddd">${phone}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">IP地址</td><td style="padding:8px;border:1px solid #ddd">${clientIp}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">时间</td><td style="padding:8px;border:1px solid #ddd">${now}</td></tr>
            </table>
          `,
        }),
      }).catch((e) => console.error("Email send failed:", e));
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
