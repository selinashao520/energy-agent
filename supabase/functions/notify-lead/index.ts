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

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const now = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "鲲腾能科通知 <onboarding@resend.dev>",
        to: "s15202136096@mail.com",
        subject: `【新需求线索】${contact_person}${company_name ? ` - ${company_name}` : ""}`,
        html: `
          <h2>新需求线索通知</h2>
          <table style="border-collapse:collapse;width:100%;max-width:500px">
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">联系人</td><td style="padding:8px;border:1px solid #ddd">${contact_person}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">公司名称</td><td style="padding:8px;border:1px solid #ddd">${company_name || "未填写"}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">联系方式</td><td style="padding:8px;border:1px solid #ddd">${contact_info}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">需求描述</td><td style="padding:8px;border:1px solid #ddd">${requirements || "未填写"}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">提交时间</td><td style="padding:8px;border:1px solid #ddd">${now}</td></tr>
          </table>
        `,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Resend API failed [${res.status}]: ${body}`);
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
