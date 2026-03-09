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
    
    const TAVILY_MCP_URL = Deno.env.get("TAVILY_MCP_URL");
    if (!TAVILY_MCP_URL) {
      throw new Error("TAVILY_MCP_URL is not configured");
    }

    // Call Tavily MCP server with tools/call for search
    const mcpRequest = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: "tavily_search",
        arguments: {
          query: query,
          max_results: maxResults,
          search_depth: "advanced",
          include_answer: true,
          topic: "news"
        }
      }
    };

    const response = await fetch(TAVILY_MCP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
      },
      body: JSON.stringify(mcpRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Tavily MCP error:", response.status, errorText);
      throw new Error(`Tavily search failed [${response.status}]: ${errorText}`);
    }

    const result = await response.json();
    
    // Extract search results from MCP response
    let searchResults = [];
    let answer = "";
    
    if (result.result?.content) {
      for (const item of result.result.content) {
        if (item.type === "text") {
          try {
            const parsed = JSON.parse(item.text);
            if (parsed.answer) answer = parsed.answer;
            if (parsed.results) searchResults = parsed.results;
          } catch {
            // If not JSON, use as is
            answer = item.text;
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        answer,
        results: searchResults.slice(0, maxResults).map((r: any) => ({
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
