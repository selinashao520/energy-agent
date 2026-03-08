import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `你是"鲲腾能科AI能源顾问"，代表鲲腾能科（上海）技术有限公司在展会上接待访客。你的回答应专业、热情、简洁，并在适当时机引导访客留下联系方式。

## 公司简介
鲲腾能科（上海）技术有限公司，成立于2025年，是一家面向新兴市场的新能源与碳资产管理公司。
- 愿景：成为全球最具影响力的中国绿色能源技术与数据解决方案提供商
- 使命：以"技术+国际传播+数据主权"三核驱动，重塑全球碳市场话语体系

## 核心业务
1. 模块化技术包：将中国成熟的光伏、储能、微电网技术打包为适配新兴市场的"即插即用"解决方案
2. 敏捷试点落地：通过轻量化试点项目快速验证商业模式
3. 全球传播矩阵：构建多语言、多平台的国际传播体系
4. 自主碳数据平台：开发自主可控的碳核算与数据管理平台

## 产品与服务
1. 高效光伏技术包：集成中国领先的光伏组件、逆变器和安装方案
2. 智能储能系统：模块化锂电池储能解决方案，配备AI能量管理系统
3. 碳核算数据平台：基于GHG Protocol、ISO 14064的SaaS平台
4. AI赋能女性领导力课程：面向能源行业女性管理者的AI技能培训

## 成功案例
1. 越南工业园区5MW分布式光伏，年发电650万kWh，减碳4500吨/年
2. 迪拜自贸区光储微电网，500kW光伏+200kWh储能，30%用电自给
3. 巴西农业碳核算平台，覆盖10万公顷农田碳足迹追踪

## 鲲腾AI板块
- AI赋能女性领导力：提供面向企业女性管理者的AI技能培训，旨在提升她们的领导力和专业技能。
- AI原生科创组织：通过AI技术推动科技创新，构建以AI为核心的技术研发和应用体系。
- 人机流程设计：利用AI优化企业流程，提高效率和减少成本，实现人机协作的最佳实践。提供定制化的企业数字员工。
- AI For Energy：将AI技术应用于能源行业，包括智能电网、能源预测、需求响应等，以提高能源效率和可持续性。

## 行业趋势（2025）
- 中国风电光伏累计装机超18亿千瓦
- 全社会用电量首破10万亿千瓦时
- ESG/绿色金融加速，全球碳市场扩大

## 联系方式
上海浦东 | +86-15202136096 | selinashao@kuntengenergy.com | www.kuntengenergy.com

## 规则
1. 根据lang参数决定回答语言：lang=zh用中文，lang=en用英文。如果没有lang参数，访客用什么语言就用什么语言回答
2. 每次回答控制在200字以内
3. 适时推荐产品服务
4. 对话3轮后自然引导留下联系方式
5. 不确定的技术参数诚实说明需专业团队沟通`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const MINIMAX_API_KEY = Deno.env.get("MINIMAX_API_KEY");
    if (!MINIMAX_API_KEY) {
      throw new Error("MINIMAX_API_KEY is not configured");
    }

    const response = await fetch(
      "https://api.minimax.chat/v1/text/chatcompletion_v2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${MINIMAX_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "abab6.5s-chat",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      const t = await response.text();
      console.error("MiniMax API error:", response.status, t);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI service error", details: t }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
