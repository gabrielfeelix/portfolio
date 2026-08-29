# Versão legado — V1 (“Volume”)

Este é o portfólio anterior: o que era lido como um volume de mangá, com boot
animado, modo tinta, painel de tweaks, capítulos, páginas de empresa e leitura
rápida. Ele foi o site de `/` até **29/08/2026**, quando a versão nova passou a
responder na raiz.

**Nada aqui entra em build.** `build.mjs` não olha para esta pasta, o
`vercel.json` não serve nenhuma rota dela, e o site publicado não carrega um
byte deste diretório. Está no repositório como registro, não como código vivo.

## O que ficou de fora daqui, de propósito

`volume/` continua existindo e **não é legado**:

- `volume/data.jsx` e `volume/i18n.jsx` — o conteúdo editorial. Continuam sendo
  scripts clássicos que publicam tudo em `window`, e o site novo lê de lá por
  `site/content.js`. Todo texto de caso vive nesses dois arquivos.
- `volume/assets/` e `volume/fonts/` — a mídia. O endereço público
  `/volume/assets/...` está dentro do conteúdo, em preview de link já
  compartilhado e em print enviado por aí. Renomear isso quebraria coisa fora
  do meu alcance.

Ou seja: o que morreu foi a **casca** da V1 (as telas e o CSS dela), não o
conteúdo que ela mostrava.

## As rotas que ela tinha

| Rota da V1 | Hoje |
| --- | --- |
| `/` | a home nova |
| `/cap/pcyes`, `/cap/odex`, `/cap/oderco-revenda`, `/cap/locarmais-conciliacao` | redirect 308 para `/case/<id>` |
| `/cap/portfolio` (o capítulo-manifesto) | redirect para `/` — não tem equivalente |
| `/empresa/<id>` | redirect para `/` — não tem equivalente |
| `/rapido` (leitura rápida) | redirect para `/` — não tem equivalente |
| `/sobre`, `/processo` | existem, com o conteúdo novo |

Os redirects estão em `vercel.json`. Link antigo com hash de rota
(`#/cap/pcyes`) é traduzido no boot, em `site/app.jsx` — o `#` nunca chega ao
servidor, então redirect não alcança esse caso.

Três páginas da V1 não têm equivalente no site novo: o capítulo-manifesto do
próprio portfólio, as páginas de empresa e a leitura rápida. Se alguma delas
fizer falta, o conteúdo continua inteiro em `volume/data.jsx` — o que falta é
tela.

## Rodar a V1 de novo

Não tem caminho pronto. Seria preciso devolver a `SCRIPTS` de `build.mjs` a
lista de `.jsx` daqui, voltar a concatenar os cinco CSS
(`colors_and_type.css`, `kit.css`, `chapter.css`, `app.css`, `organic.css`)
em `volume/volume.css`, e gerar o HTML a partir de `index.template.html` desta
pasta. O commit anterior a essa mudança tem tudo isso funcionando.
