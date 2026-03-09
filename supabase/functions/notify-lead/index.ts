import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

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

    const SMTP_USER = Deno.env.get("SMTP_USER");
    const SMTP_PASS = Deno.env.get("SMTP_PASS");

    if (!SMTP_USER || !SMTP_PASS) {
      throw new Error("SMTP credentials not configured");
    }

    const now = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });

    const client = new SmtpClient();
    await client.connectTLS({
      hostname: "smtp.qq.com",
      port: 465,
      username: SMTP_USER,
      password: SMTP_PASS,
    });

    await client.send({
      from: SMTP_USER,
      to: SMTP_USER,
      subject: "📋 新需求线索通知",
      content: `
新需求线索已提交，详情如下：

联系人：${contact_person}
公司名称：${company_name || "未填写"}
联系方式：${contact_info || "未填写"}
需求描述：${requirements || "未填写"}
提交时间：${now}
      `.trim(),
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
  <h2 style="color: #1a56db; border-bottom: 2px solid #1a56db; padding-bottom: 10px;">📋 新需求线索通知</h2>
  <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
    <tr style="background: #f8fafc;">
      <td style="padding: 10px 12px; font-weight: bold; width: 120px; color: #555;">联系人</td>
      <td style="padding: 10px 12px;">${contact_person}</td>
    </tr>
    <tr>
      <td style="padding: 10px 12px; font-weight: bold; color: #555;">公司名称</td>
      <td style="padding: 10px 12px;">${company_name || "未填写"}</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 10px 12px; font-weight: bold; color: #555;">联系方式</td>
      <td style="padding: 10px 12px;">${contact_info || "未填写"}</td>
    </tr>
    <tr>
      <td style="padding: 10px 12px; font-weight: bold; color: #555;">提交时间</td>
      <td style="padding: 10px 12px;">${now}</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 10px 12px; font-weight: bold; color: #555; vertical-align: top;">需求描述</td>
      <td style="padding: 10px 12px; white-space: pre-wrap;">${requirements || "未填写"}</td>
    </tr>
  </table>
</div>
      `,
    });

    await client.close();

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
