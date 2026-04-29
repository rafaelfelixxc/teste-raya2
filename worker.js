export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return new Response(JSON.stringify({
        ok: true,
        service: "Raya Worker",
        message: "Worker conectado com sucesso.",
        endpoint: "/api/gemini"
      }, null, 2), {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders }
      });
    }

    if (request.method === "POST" && url.pathname === "/api/gemini") {
      try {
        if (!env.GEMINI_API_KEY) {
          return new Response(JSON.stringify({
            error: "GEMINI_API_KEY não configurada no Cloudflare."
          }, null, 2), {
            status: 500,
            headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders }
          });
        }

        const body = await request.json();
        const parts = Array.isArray(body.parts) ? body.parts : [];

        if (!parts.length) {
          return new Response(JSON.stringify({
            error: "Nenhum conteúdo enviado para análise."
          }, null, 2), {
            status: 400,
            headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders }
          });
        }

        const model = body.model || "gemini-1.5-flash";

        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts }],
              generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 8192
              }
            })
          }
        );

        const text = await geminiResponse.text();

        return new Response(text, {
          status: geminiResponse.status,
          headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders }
        });
      } catch (error) {
        return new Response(JSON.stringify({
          error: "Erro interno no Worker.",
          message: error.message || String(error)
        }, null, 2), {
          status: 500,
          headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders }
        });
      }
    }

    return new Response(JSON.stringify({
      error: "Rota não encontrada.",
      routes: ["GET /", "POST /api/gemini"]
    }, null, 2), {
      status: 404,
      headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders }
    });
  }
};
