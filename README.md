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
- `site/` — **o site**. App React com import/export e bundle próprio.
  `app.jsx` roteia `/`, `/processo`, `/sobre` e `/case/<id>`; o CSS é
  concatenado na ordem de `build.mjs` e sai como `/site.css`.
- `volume/` — o conteúdo e a mídia, não uma versão. `data.jsx` e `i18n.jsx`
  são scripts clássicos que publicam tudo em `window`, e `site/content.js` lê
  de lá; `assets/` e `fonts/` são servidos em `/volume/...`, que é o endereço
  público que já circula.
- `legado-v1/` — o portfólio anterior, o que era lido como volume de mangá.
  Fora do build e fora do ar desde 29/08/2026. Ver `legado-v1/README.md`.
- `build.mjs` — transpila o conteúdo, empacota o app, vendoriza React,
  sincroniza a mídia e gera `dist/index.html`.
- `uploads/` — favicon e imagens soltas
- `tools/` — verificação com Chromium headless (medidas, prints, axe)
- `docs/superpowers/` — spec + plano

Os endereços da V1 (`/cap/<id>`, `/empresa/<id>`, `/rapido`) são
redirecionados em `vercel.json`.

## Conteúdo
Textos dos projetos usam placeholders `[assim]` — a preencher.
