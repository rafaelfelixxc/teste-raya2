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
      return json({
        ok: true,
        service: "Raya Worker",
        message: "Worker conectado com sucesso.",
        endpoint: "/api/gemini"
      }, 200, corsHeaders);
    }

    if (request.method === "POST" && url.pathname === "/api/gemini") {
      try {
        const apiKey = env.GEMINI_API_KEY;

        if (!apiKey) {
          return json({
            error: "GEMINI_API_KEY não configurada no Cloudflare.",
            message: "Adicione a variável GEMINI_API_KEY em Settings > Variables."
          }, 500, corsHeaders);
        }

        const body = await request.json();
        const parts = Array.isArray(body.parts) ? body.parts : [];

        if (!parts.length) {
          return json({
            error: "Nenhuma parte enviada para análise.",
            message: "Envie { parts: [...] } no corpo da requisição."
          }, 400, corsHeaders);
        }

        const model = body.model || "gemini-1.5-flash";

        const geminiPayload = {
          contents: [
            {
              role: "user",
              parts
            }
          ],
          generationConfig: {
            temperature: 0.1,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 8192
          }
        };

        const geminiUrl =
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const geminiResponse = await fetch(geminiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(geminiPayload)
        });

        const responseText = await geminiResponse.text();

        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch {
          responseData = { raw: responseText };
        }

        if (!geminiResponse.ok) {
          return json({
            error: "Erro ao chamar Gemini.",
            status: geminiResponse.status,
            details: responseData
          }, geminiResponse.status, corsHeaders);
        }

        return json(responseData, 200, corsHeaders);
      } catch (error) {
        return json({
          error: "Erro interno no Worker.",
          message: error.message || String(error)
        }, 500, corsHeaders);
      }
    }

    return json({
      error: "Rota não encontrada.",
      routes: [
        "GET /",
        "POST /api/gemini"
      ]
    }, 404, corsHeaders);
  }
};

function json(data, status = 200, corsHeaders = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders
    }
  });
}
