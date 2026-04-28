# Central de Garantias + Raya IA

Sistema HTML para leitura e organização de documentos de seguro garantia.

## O que está incluso

- Upload de documentos PDF, PNG e JPG
- Área de Upload do Analista
- Painel de Controle protegido por senha
- Dashboard protegido por senha
- Raya IA protegida por senha interna
- Integração com Cloudflare Worker
- Chamada para Gemini via rota `/api/gemini`
- Exportação de relatório em XLSX

## Senhas

Senha padrão das áreas restritas:

```txt
Operações321
```

## Como publicar no GitHub Pages

1. Suba os arquivos deste projeto para o repositório.
2. Renomeie/garanta que o arquivo principal seja `index.html`.
3. Vá em `Settings > Pages`.
4. Selecione:
   - Source: Deploy from branch
   - Branch: main
   - Folder: /root
5. Salve e aguarde o link ficar disponível.

## Como usar com Cloudflare Worker

Na aba Raya, cole a URL base do Worker, por exemplo:

```txt
https://seu-worker.workers.dev
```

O HTML enviará a leitura para:

```txt
https://seu-worker.workers.dev/api/gemini
```

## Importante

A chave do Gemini deve ficar configurada no Cloudflare Worker, não dentro do HTML.
Isso evita expor sua API Key no código público do GitHub.

## Arquivos

- `index.html`: sistema principal
- `README.md`: instruções do projeto
- `.gitignore`: arquivos ignorados
