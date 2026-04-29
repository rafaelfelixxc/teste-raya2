# Raya Cloudflare Worker

Estrutura correta para deploy no Cloudflare:

```txt
index.html
worker.js
wrangler.toml
README.md
```

## Configuração obrigatória

No Cloudflare, adicione a variável:

```txt
GEMINI_API_KEY
```

## Teste

Depois do deploy, acesse:

```txt
https://SEU-WORKER.workers.dev/
```

Se aparecer `Worker conectado com sucesso`, está certo.
