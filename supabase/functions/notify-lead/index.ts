import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { contact_person, company_name, contact_info, requirements } = await req.json();

    const FEISHU_WEBHOOK_URL = Deno.env.get("FEISHU_WEBHOOK_URL");
    if (!FEISHU_WEBHOOK_URL) {
      throw new Error("FEISHU_WEBHOOK_URL is not configured");
    }

    const now = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });

    const res = await fetch(FEISHU_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        msg_type: "interactive",
        card: {
          header: {
            title: { tag: "plain_text", content: "📋 新需求线索通知" },
            template: "blue",
          },
          elements: [
            {
              tag: "div",
              fields: [
                { is_short: true, text: { tag: "lark_md", content: `**联系人**\n${contact_person}` } },
                { is_short: true, text: { tag: "lark_md", content: `**公司名称**\n${company_name || "未填写"}` } },
                { is_short: true, text: { tag: "lark_md", content: `**联系方式**\n${contact_info || "未填写"}` } },
                { is_short: true, text: { tag: "lark_md", content: `**提交时间**\n${now}` } },
              ],
            },
            {
              tag: "div",
              text: { tag: "lark_md", content: `**需求描述**\n${requirements || "未填写"}` },
            },
          ],
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Feishu webhook failed [${res.status}]: ${body}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("notify-lead error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});