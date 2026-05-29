# Portfólio — Gabriel Felix Barbosa

Portfólio em forma de volume de mangá. SPA React, estático, sem backend.

## Desenvolvimento
```bash
npm install
npm run dev      # http://localhost:5173 (watch + serve)
npm run build    # gera dist/
```

## Deploy (Vercel)
Importe o repositório na Vercel. O `vercel.json` já define
`buildCommand` e `outputDirectory: dist`. Ative **Web Analytics** e
**Speed Insights** no dashboard do projeto.

### Microsoft Clarity (heatmap / gravação de sessão)
1. Crie um projeto em https://clarity.microsoft.com
2. Adicione a env var `CLARITY_ID` na Vercel (Settings → Environment Variables)
3. Redeploy. Sem a env, o site funciona normal e o Clarity fica desativado.

## Estrutura
- `volume/*.jsx` — componentes React (escopo global compartilhado via window)
- `build.mjs` — transpila, vendoriza React, copia assets, gera `dist/index.html`
- `uploads/` — imagens
- `docs/superpowers/` — spec + plano

## Conteúdo
Textos dos projetos usam placeholders `[assim]` — a preencher.
