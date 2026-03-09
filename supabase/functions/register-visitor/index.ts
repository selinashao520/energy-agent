import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6.9.7";

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

    // Send QQ Mail notification
    const SMTP_USER = Deno.env.get("SMTP_USER");
    const SMTP_PASS = Deno.env.get("SMTP_PASS");
    
    if (SMTP_USER && SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.qq.com",
          port: 465,
          secure: true,
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
        });

        const now = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
        
        await transporter.sendMail({
          from: `"能源AI助手" <${SMTP_USER}>`,
          to: SMTP_USER,
          subject: "👤 新访客注册通知",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .info-row { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
                .label { font-weight: bold; color: #667eea; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">👤 新访客注册</h1>
                </div>
                <div class="content">
                  <p>您好！有新访客完成注册：</p>
                  <div class="info-row">
                    <span class="label">姓名：</span>${name}
                  </div>
                  <div class="info-row">
                    <span class="label">手机号：</span>${phone}
                  </div>
                  <div class="info-row">
                    <span class="label">IP地址：</span>${clientIp}
                  </div>
                  <div class="info-row">
                    <span class="label">注册时间：</span>${now}
                  </div>
                </div>
                <div class="footer">
                  此邮件由能源AI助手系统自动发送
                </div>
              </div>
            </body>
            </html>
          `,
        });
        
        console.log("Visitor registration email sent successfully");
      } catch (emailError) {
        console.error("Failed to send visitor registration email:", emailError);
        // Don't fail the whole registration if email fails
      }
    }

    // Send Feishu notification (keep existing functionality)
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