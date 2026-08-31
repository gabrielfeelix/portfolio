# Handoff — desempenho da home

Reescrito em 31/08/2026, depois da sessão que atacou o plano da versão
anterior deste arquivo. Lê-se sozinho. A meta do Gabriel é **no mínimo 85 no
celular**, e a última medição real do PageSpeed antes desta sessão foi **75**.

Leia antes, se for mexer: `docs/HANDOFF-PRERENDER.md` (por que o servidor
escreve o hero) e `docs/HANDOFF.md` (estado geral do site).

---

## 0. O que esta sessão descobriu, em uma frase

O LCP da home **nunca foi imagem**. É o `<p class="v2-hero-sub">`, texto puro,
e a quebra oficial do Lighthouse diz que 99% dele era **atraso de renderização**
— tempo com a página parada esperando CSS e thread principal. O remédio era
tirar o CSS do caminho crítico, e ele destravou uma segunda coisa que ninguém
tinha visto: **a troca de fonte criava um SEGUNDO candidato de LCP**.

---

## 1. Números, medidos nesta máquina

Duas gargantas, e as duas comparam os dois lados **no mesmo runner** — que é a
única comparação que vale.

### Garganta real por CDP (`npm run perfil:home`)

1,6 Mbps · 150ms RTT · CPU 4x · Pixel 5.

| | antes (commit `1cc3297`) | depois |
|---|---|---|
| FCP | 916ms | **404ms** |
| LCP | 916ms | **760ms** |
| CLS | 0 | **0** |
| bytes | 1.860 KB | 1.833 KB |
| app monta | 2,64s | 2,45s |

### Lighthouse local, mesmo runner

**Os números absolutos daqui não valem nada** — esta máquina dá TBT de 3.120ms
onde o PageSpeed dá 280ms. O que vale é o delta.

| | antes | depois |
|---|---|---|
| nota | 46 | **54** |
| FCP | 1,8s | **1,2s** |
| Speed Index | 4,7s | **3,4s** |
| LCP | 5,5s | **4,7s** |
| TBT | 3.120ms | **1.980ms** |
| CLS | 0 | 0 |
| a11y / práticas / SEO | 96 / 96 / 100 | **96 / 96 / 100** |

### A quebra da LCP, que era a pergunta em aberto

| | TTFB | atraso de carga | tempo de carga | atraso de render |
|---|---|---|---|---|
| antes | 12ms | — | — | **1.873ms** |
| depois | 9ms | — | — | **821ms** |

As duas colunas do meio estão vazias porque **LCP de texto não tem recurso**.
Toda a conta é TTFB + atraso de renderização, e por isso nenhuma otimização de
imagem ia mover o número. A auditoria `render-blocking` saiu de score 0 para
score 1.

### Projeção para o PageSpeed

Aplicando os deltas às curvas do Lighthouse sobre os 75 medidos em 31/08:
FCP ~+2, SI ~+2, LCP ~+10, TBT ~+2, CLS inalterado. **Projeção de 85 a 91.**
É projeção, não medição — o Gabriel precisa rodar o PageSpeed pela interface
web (a quota da API estourou em 31/08) e escrever o número real aqui.

---

## 2. O que foi feito, e por quê

Um item por vez, medindo entre eles.

### 2.1 O CSS da home entra embutido; o resto desce sem bloquear

`/site.css` eram 18 KB comprimidos que **bloqueavam a primeira pintura**. Na
garganta real começavam a baixar aos 200ms e só terminavam aos 813ms — 613ms
para o que a banda sozinha entregaria em 90. A diferença era disputa: os cinco
`<script defer>` somam quase 200 KB e saem no mesmo instante.

`buildCss()` agora corta a folha em duas metades **do mesmo arranjo**, num
único ponto da ordem:

- prefixo (`fontes+tokens+kit+shell+home`, 9 KB gz) → embutido no `<head>` de
  `index.html` e `en.html`;
- sufixo (`case+processo+sobre+blog+cursor`, 10 KB gz) → `/site-resto.css`,
  buscado com o truque de `media="print"`, sem bloquear;
- `site.css` continua existindo, prefixo + sufixo concatenados, e é o que
  `rota.html` serve — as outras rotas precisam do CSS de caso na primeira
  pintura.

**Não é "critical CSS"**: é a folha inteira da home, cortada por rota e não por
dobra. Por isso não existe FOUC possível — nenhuma regra que a home usa chega
depois. Era esse o risco que o plano anterior mandava levar ao Gabriel; ele
deixou de existir com esta forma de cortar.

**O corte quebrou coisa, e a quebra foi encontrada medindo, não lendo.** Duas
regras de `case.css` valiam para a home por vazamento:

- `.v2-dobra.v2-wrap { margin-top: var(--v2-s6) }`
- `.v2-dobra { margin-top: var(--v2-s5) }`, dentro de `@media (max-width:860px)`

As duas usam seletor que a `Secao` do kit também casa. Sem elas na primeira
pintura, **seis seções da home nasciam 64px acima e desciam depois: 384px de
deslocamento no celular**, ou seja CLS entregue de graça. As duas foram
movidas para `kit.css`, junto do `.v2-dobra` que as declara, mantendo a
posição relativa na cascata. O comentário de cada uma explica de onde veio.

### 2.2 `font-display: block` nas duas Switzer pré-carregadas

**Este é o achado da sessão e é o que estava escondendo os 1,6s de buraco
entre FCP e LCP na produção.**

Com o CSS embutido, a primeira pintura caiu para ~400ms — antes do Switzer,
que chega aos ~700ms. Com `swap`, o texto pintava na fonte de sistema e o
parágrafo do hero **crescia** na troca: 14.344px² viravam 15.255px². O Chrome
só registra candidato de LCP **maior**, então a troca criava um segundo
candidato — e esse repaint ficava preso atrás da montagem do React. Medido:

| `font-display` | FCP | LCP | CLS | veredito |
|---|---|---|---|---|
| `swap` (como estava) | 528ms | **5,78s** | 0 | o crescimento vira 2º candidato |
| **`block`** | 400ms | **760ms** | 0 | escolhido |
| `optional` | 396ms | 396ms | 0 | melhor número, mas o site inteiro fica na fonte de sistema em rede lenta — é design |

Só os pesos **400 e 700** mudaram, que são os dois pré-carregados. Os outros
seguem em `swap`: chegam depois de qualquer jeito, e esperar por eles seria
trocar texto visível por buraco sem ganho de LCP.

**O FCP não pagou nada por isso** porque quem pinta primeiro é o cromo em
Geist Mono, que continua em `swap`.

**Este é o único item da sessão que aparece na tela**, e está na seção 4.

### 2.3 Reserva métrica do Switzer

`site/fontes.css` ganhou faces `"Switzer reserva"`, geradas por
`npm run reserva:fonte` a partir das métricas reais dos `.woff2`, e o token
`--v2-font` passa a listá-la entre o Switzer e o `system-ui`. Ela existe para
os pesos que continuam em `swap` (500 e 600) e como rede de segurança se o
período de bloqueio de 3s do `block` estourar.

**Ressalva honesta**: `local("Arial")` **não resolve** neste contêiner — só
DejaVu existe aqui —, então a reserva está verificada apenas em teoria fora do
Linux. Ela nunca piora nada (quando não resolve, o navegador segue para o
`system-ui` de sempre), mas não conte com ela: quem conserta o LCP é o
`block` da 2.2. Rode `npm run reserva:fonte` de novo se trocar um `.woff2`.

### 2.4 O espelho inglês saiu do caminho das páginas portuguesas

`volume/i18n.jsx` tinha 96 KB, e 93 deles eram o bloco `if (LANG === "en")` com
os espelhos do conteúdo. **Toda visita em português baixava 29 KB comprimidos
e mandava o V8 parsear treze objetos grandes para jogar fora.**

O bloco virou `volume/i18n.en.jsx`, script clássico separado. `i18n.js` caiu de
**79.750 para 992 bytes**. A tag só entra em `en.html` e em `rota.html`
(`/en/case/pcyes` cai nele), e o `vm` do pré-render reproduz a mesma sequência.

Continua funcionando pelo mesmo mecanismo de sempre: `const` de topo de script
clássico vive no escopo global de script, compartilhado entre `<script>`
diferentes — é por isso que o espelho alcança o `CHAPTERS` de `data.js` por
referência nua. **Um `type="module"` ali quebraria isso em silêncio.**

### 2.5 `consent.js` passou a ser inline

Era o único `<script>` **síncrono** do site, e o custo não estava à vista:
script síncrono trava o parser, e script `defer` só executa quando o parser
chega ao fim do documento. Como o `consent.js` mora no fim do body, **depois**
das cinco tags de scripts, a rede dele entrava na frente da execução de todas
elas — terminava aos 951ms, e o app só começava depois.

São 2 KB comprimidos. Inline não custa ida à rede e a ordem de execução é
exatamente a mesma (ele continua antes do gtag, que é a razão de ele existir).
`dist/consent.js` deixou de ser gerado.

---

## 3. O que foi decidido NÃO fazer, e por quê

Isto vale tanto quanto a lista de cima.

### 3.1 Pré-carregar a capa do hero — **não**

Era o item 3.2 do plano anterior. **A medição derrubou a premissa**: o
elemento de LCP é texto, não a capa. Além disso a `<img>` do pôster **já tem
`fetchpriority="high"`** (`site/Home.jsx`), e a documentação do Chrome é
explícita em que, para imagem que já está no HTML servido, `fetchpriority` no
próprio `<img>` é melhor que `preload` — o pré-render põe a capa no HTML desde
o commit `f7d7ac4`, então o preload scanner já a encontra. Somar um preload de
imagem só faria ele disputar com os dois preloads de fonte, que agora são
exatamente quem segura o LCP.

### 3.2 Adiar o download do `site-resto.css` para depois da montagem — **não**

Testado: LCP de 760ms contra 744ms, dentro do ruído, e as fontes terminam no
mesmo instante nas duas variantes. Em troca abriria uma janela real entre a
montagem do app e a chegada da folha em que clicar num caso renderiza a página
sem estilo. Ganho nulo, risco não-nulo.

### 3.3 Quebrar o `app.js` por rota — **não, e provavelmente não precisa**

São 111 KiB de JS não usado na home (`Case`, `Processo`, `Sobre`, `Blog`,
`Post` viajam junto), e é o maior item que sobrou. Mas:

- exige trocar `format: "iife"` por `esm` + `splitting`, e o esbuild ainda tem
  arestas abertas nisso (chunks minúsculos, CSS duplicado com import dinâmico);
- mexe na ordem das tags, que é contrato documentado e quebra em silêncio;
- o TBT já caiu 37% sem tocar nele, e a projeção chega a 85 sem ele.

Se um dia for preciso, **o caminho de menor risco não é o `splitting` do
esbuild**: é um segundo bundle IIFE (`rotas.js`) que se registra num global e
que o roteador injeta sob demanda, com `rota.html` trazendo os dois desde o
começo. Isso conversa com a arquitetura de scripts clássicos que o site já tem.

### 3.4 Aumentar o TTL de cache — **não**

O audit está marcado "fora da pontuação" e só afeta visita repetida. Os nomes
de arquivo não têm hash, então subir o TTL significa que trocar uma imagem sem
renomear deixa gente vendo a antiga por um mês. Mesma conclusão do plano
anterior, mantida.

### 3.5 `width`/`height` explícitos nas imagens — **não**

`unsized-images` continua falhando, mas **é auditoria de peso zero** na nota de
desempenho, e o CLS já está em 0. O ganho seria de robustez, não de nota, e
mexer no tamanho declarado de dezenas de `<img>` sem olhar cada layout é
exatamente o tipo de mudança que troca um número por um bug de desenho.

### 3.6 Reencodar as capas de projeto (188 KiB) — **não**

São as quatro `capa-home.webp` (76 a 99 KB), todas **abaixo da dobra e em
`loading=lazy`**: não tocam FCP nem LCP. O motivo dos 800px está em
`docs/HANDOFF.md` e não foi revisitado.

### 3.7 Trocar `clip-path` e `blur` por propriedades compostas — **não**

Muda o gesto. É design, e está na seção 4.

---

## 4. O que é decisão do Gabriel

1. **`font-display: block` nas duas Switzer pré-carregadas** (seção 2.2). É o
   único item desta sessão que aparece na tela. O preço é FOIT: se a fonte
   demorasse, o hero ficaria em branco até 3s, que é o teto do período de
   bloqueio do Chrome. São 16 e 19 KB pré-carregados, mesma origem, cache de
   um ano — mas o risco existe em rede muito ruim. **Reverter é trocar duas
   palavras em `site/fontes.css`**, e custa o LCP de volta a ~5,8s.
2. **O 1,4s do `useTardio`** (não mexido). Vale Speed Index. O SI já caiu de
   4,7s para 3,4s sem tocar na coreografia; encurtar o atraso renderia mais,
   mas é a entrada do hero.
3. **`clip-path` e `blur` nas animações**, 21 elementos não compostos.

---

## 5. Coisas confirmadas, para ninguém reinvestigar

- **`hero/capa.mp4` (1.148 KiB) não é baixado.** Confirmado em todos os traços
  desta sessão: só o `capa.webm` (834 KB) sai da rede. O mp4 aparece na tabela
  do PageSpeed mas é `<source>` para Safari, não fetch do Chrome.
- **O pôster É o primeiro quadro do vídeo.** Medido pixel a pixel: diferença
  média de 0,96 em 255. Isso importa porque o Speed Index compara cada quadro
  com o quadro FINAL — pôster diferente do vídeo penalizaria retroativamente a
  carga inteira. Não é o caso.
- **O contraste que a acessibilidade aponta é estado inicial de animação**
  (`.v2-declaracao-w` em `opacity: .06`), não cor mal escolhida. Continua 96,
  igual ao de antes desta sessão. Não "conserte" a cor de nada.
- **`errors-in-console` falha nos dois builds**, antes e depois. Não é
  regressão desta sessão.

---

## 6. Ferramentas — o que existe e para que serve

```
npm run dev             # servidor de dev (a porta sai no log, NÃO é fixa)
npm run build           # produção
npm run verifica:home   # o primeiro quadro do servidor bate com o do React?
npm run mede:home       # A/B do pré-render
npm run perfil:home     # NOVO — quebra de LCP, candidatos, CLS, tarefas longas
npm run compara:render  # NOVO — dois dist/, todas as rotas, três larguras
npm run reserva:fonte   # NOVO — regera as métricas da reserva a partir do woff2
```

`perfil:home` aceita uma ou duas pastas `dist/` e mede as duas no mesmo runner.
Para ter o "antes": `git worktree add /tmp/ref <commit> && cd /tmp/ref && node build.mjs`.

`compara:render` é a rede de segurança das mudanças de CSS. Ele compara caixa e
estilo computado de cada elemento, e não a foto — o hero tem vídeo e a entrada
é animada, então duas fotos do mesmo build já saem diferentes.
`ROTAS=/case/pcyes LARGURAS=desktop` reconfere uma combinação só.

### Armadilhas de medição, já pagas com tempo

- **Mate o servidor de dev antes de medir.** Ele reconstrói `dist/` em modo dev
  por cima do build de produção. E `npm run dev` **não** usa porta fixa: leia a
  porta no log e passe em `BASE=http://localhost:PORTA npm run verifica:home`.
- **`pkill -f <termo>` mata o próprio shell** se o termo aparecer na linha de
  comando dele. Use `ps -eo pid,args | grep "[b]uild.mjs"` e mate por PID.
- **`compara:render` tem um ruído conhecido e só um**: `.v2-outro-t`, o título
  do cartão de "outros capítulos", cuja lista é embaralhada por `Math.random()`
  em `Kit.jsx`. A ferramenta já ignora. Um segundo ruído aparece em
  `/case/pcyes` @desktop, num `margin: auto` — o build de referência comparado
  **consigo mesmo** também diverge ali, então é não-determinismo da página.
- **O Lighthouse local não é o runner do Google**, e a diferença é brutal: TBT
  de 3.120ms aqui contra 280ms lá. Para nota absoluta, só PageSpeed. Para
  delta, os dois lados no mesmo runner.
- O Lighthouse instalado por `npm i lighthouse` acha o Chrome do **Windows** no
  WSL e falha com "Unable to connect to Chrome". Aponte
  `CHROME_PATH=~/.cache/ms-playwright/chromium-*/chrome-linux/chrome`. Ele
  também deixa lixo em pastas com nome `C:\Users\...` na raiz do repositório —
  apague antes de commitar.

---

## 7. Invariantes que não podem cair

- **`npm run verifica:home` passa nos dois idiomas.**
- **`npm run compara:render` contra o commit anterior fecha limpo**, tirando os
  dois ruídos da seção 6. É o que impede uma mudança de CSS mexer no desenho
  sem ninguém ver.
- **`dist/rota.html` continua servindo tudo que não é a home**, com a folha
  inteira e com o espelho inglês.
- **A ordem das tags**: React → data → i18n → i18n.en → app.
- **`i18n.en.js` é script CLÁSSICO.** Módulo quebraria o escopo léxico
  compartilhado com `data.js`, e quebraria em silêncio.
- **O corte do CSS é num ponto só da ordem**, e `site.css` continua sendo
  literalmente `prefixo + sufixo`. Ele difere em 1 byte do `site.css` de antes
  do corte, porque agora são duas minificações em vez de uma — CSS equivalente,
  não arquivo idêntico. Quem prova a equivalência é `npm run compara:render`,
  não o tamanho do arquivo.
- **`useTardio` não volta para `opacity: 0`.**
- **O `strict` do `<LazyMotion>` fica.**
- **O piso de `aspect-ratio` em `.v2-fig-moldura` não sai** (commit `6545c2d`).
- **O `page_view` do GA4 continua manual** enquanto o site for SPA.

---

## 8. O que falta para fechar

1. **Rodar o PageSpeed celular em produção, duas vezes, e escrever o número
   aqui.** É a única medição que conta. Se não chegar a 85, o próximo item é o
   3.3 (quebrar o `app.js`), pelo caminho do segundo bundle IIFE.
2. **Conferir o computador**, que estava em 94.
3. **Decidir sobre o `font-display: block`** (seção 4, item 1).
