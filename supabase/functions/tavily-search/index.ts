import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, maxResults = 5 } = await req.json();
    
    const TAVILY_API_KEY = Deno.env.get("TAVILY_MCP_URL");
    if (!TAVILY_API_KEY) {
      throw new Error("TAVILY API KEY is not configured");
    }

    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query: query,
        max_results: maxResults,
        search_depth: "advanced",
        include_answer: true,
        topic: "news"
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Tavily API error:", response.status, errorText);
      throw new Error(`Tavily search failed [${response.status}]: ${errorText}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({ 
        success: true, 
        answer: data.answer || "",
        results: (data.results || []).slice(0, maxResults).map((r: any) => ({
          title: r.title,
          url: r.url,
          content: r.content?.slice(0, 300),
          publishedDate: r.published_date
        }))
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (e) {
    console.error("Tavily search error:", e);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: e instanceof Error ? e.message : "Search failed" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
