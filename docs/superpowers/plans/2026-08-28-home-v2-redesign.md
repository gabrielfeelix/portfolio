# Home da V2, redesenho — plano de implementação

> **Para quem executa:** os passos usam checkbox (`- [ ]`). Marque conforme avança.

**Goal:** reescrever a home da V2 para que ela alterne escala, tenha os casos em
largura cheia numa pilha grudada e termine num fecho, em vez de quatro listas
seguidas com o mesmo gesto.

**Architecture:** `v2/Home.jsx` e `v2/home.css` são refeitos. `v2/motion.js` ganha
duas primitivas (`usePilha`, `usePalavra`). `v2/tokens.css` troca a família
tipográfica e reafere a escala. Nada em `volume/` (a V1) é tocado; `v2/Case.jsx` e
`v2/case.css` só são conferidos no fim, porque a troca de fonte muda a métrica deles.

**Tech Stack:** React 18 + `motion/react` v13 (esbuild bundle IIFE), CSS puro com
custom properties, Playwright headless para verificação.

**Spec:** `docs/superpowers/specs/2026-08-28-home-v2-redesign-design.md`

## Global Constraints

- Fonte: **Switzer**, servida pela Fontshare em
  `https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&display=swap`,
  fallback `system-ui, -apple-system, Segoe UI, Roboto, sans-serif`.
- Fundo **branco** (`--v2-paper: #FFFFFF`). Nunca creme.
- **Sem grade de fundo atrás de texto.** Textura só dentro de painel de mídia
  (`.v2-textura`); marcação de régua só nas pontas (`.v2-cruz`).
- **Sem travessão em copy** (nem `—` nem `–`). Ponto, vírgula ou dois-pontos.
- Todo movimento respeita `useReducedMotion`. Sem motion, a pilha vira lista
  vertical e a declaração aparece inteira.
- Nenhum arquivo novo de CSS: `build.mjs:216` concatena uma lista fixa
  (`tokens.css, shell.css, home.css, case.css`). Regra nova entra em `home.css`.
- Bloco escuro no meio da página precisa de `data-escuro-corpo` para a nav
  inverter (`v2/app.jsx:66`).
- Build: `BUILD_V2=1 npm run build` (sem a variável o build não emite `dist/v2/`, ver `build.mjs:41`). Servir: `cd dist && python3 -m http.server 8793 --bind 127.0.0.1`.
  Rota da home da V2: `http://127.0.0.1:8793/v2/`.
- Antes e depois de cada medição: `pkill -f "[c]hromium" || true`. Headless acumulado
  já travou a máquina.
- Um commit por tarefa, mensagem em português, no formato dos commits existentes
  (`feat(home):`, `fix(a11y):`).

---

### Task 1: Ferramenta de verificação da home

Sem harness, cada tarefa vira print manual e a comparação se perde. Esta tarefa
entrega o instrumento que todas as outras usam.

**Files:**
- Create: `tools/home-v2.mjs`

**Interfaces:**
- Produz: `node tools/home-v2.mjs prints [porta]` grava
  `/tmp/home-v2/<viewport>-<posicao>.png`; `node tools/home-v2.mjs medidas [porta]`
  imprime, em JSON, altura da página, quantidade de painéis da pilha, e a família
  computada do `h1`.

- [ ] **Step 1: Escrever a ferramenta**

```js
#!/usr/bin/env node
/* Verificação da home da V2. Complementa tools/medir.mjs, que mede a V1.

     npm run build
     cd dist && python3 -m http.server 8793 --bind 127.0.0.1
     node tools/home-v2.mjs medidas
     node tools/home-v2.mjs prints

   Print aqui é para o Gabriel comparar, não para o agente concluir sozinho:
   a pilha é scroll-linked e um print pega um quadro do meio da transição. */

import { chromium } from "/home/gabrielbarbosa/.claude/node_modules/playwright/index.mjs";
import { mkdirSync } from "node:fs";

const [, , CMD = "medidas", PORTA = "8793"] = process.argv;
const URL = `http://127.0.0.1:${PORTA}/v2/`;
const SAIDA = "/tmp/home-v2";
const VIEWPORTS = [
  { nome: "desktop", width: 1440, height: 900 },
  { nome: "laptop-baixo", width: 1280, height: 620 },
  { nome: "celular", width: 390, height: 844 },
];

async function abrir(b, vp) {
  const p = await b.newPage({ viewport: { width: vp.width, height: vp.height } });
  await p.goto(URL, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(600);
  return p;
}

async function medidas() {
  const b = await chromium.launch();
  const p = await abrir(b, VIEWPORTS[0]);
  const r = await p.evaluate(() => ({
    alturaPagina: Math.round(document.documentElement.scrollHeight),
    paineis: document.querySelectorAll(".v2-painel").length,
    fonteH1: getComputedStyle(document.querySelector("h1")).fontFamily,
    secoes: [...document.querySelectorAll("main > * > section, main > section")].map(
      (s) => s.id || s.className.split(" ")[0]
    ),
  }));
  console.log(JSON.stringify(r, null, 2));
  await b.close();
}

async function prints() {
  mkdirSync(SAIDA, { recursive: true });
  const b = await chromium.launch();
  for (const vp of VIEWPORTS) {
    const p = await abrir(b, vp);
    const alt = await p.evaluate(() => document.documentElement.scrollHeight);
    const passos = 6;
    for (let i = 0; i < passos; i++) {
      const y = Math.round((alt - vp.height) * (i / (passos - 1)));
      await p.evaluate((v) => window.scrollTo(0, v), y);
      await p.waitForTimeout(700);
      await p.screenshot({ path: `${SAIDA}/${vp.nome}-${String(i).padStart(2, "0")}.png` });
    }
    await p.close();
  }
  await b.close();
  console.log("prints em " + SAIDA);
}

if (CMD === "prints") await prints();
else await medidas();
```

- [ ] **Step 2: Rodar contra a home atual, para ter a linha de base**

```bash
pkill -f "[c]hromium" || true
BUILD_V2=1 npm run build
(cd dist && python3 -m http.server 8793 --bind 127.0.0.1 &) && sleep 2
node tools/home-v2.mjs medidas
```

Esperado: JSON com `paineis: 0` (a pilha ainda não existe), `fonteH1` contendo
`Hanken Grotesk`, e a lista de seções atual (`v2-hero`, `sobre`, `v2-marquee-secao`,
`processo`, `casos`, `pecas`, `onde`).

- [ ] **Step 3: Commit**

```bash
git add tools/home-v2.mjs
git commit -m "chore(v2): ferramenta de verificação da home"
```

---

### Task 2: Switzer e a escala tipográfica

**Files:**
- Modify: `v2/index.template.html:16-19`
- Modify: `v2/tokens.css:34` e o bloco de escala (linhas 40 a 61)

**Interfaces:**
- Produz: `--v2-font` apontando para Switzer. Todas as tarefas seguintes herdam a
  métrica nova.

- [ ] **Step 1: Trocar o carregamento da fonte**

Em `v2/index.template.html`, substituir as três linhas de `fonts.googleapis.com`
por:

```html
<link rel="preconnect" href="https://api.fontshare.com" crossorigin>
<link rel="stylesheet"
      href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&display=swap">
```

- [ ] **Step 2: Trocar a família e reaferir a escala**

Em `v2/tokens.css`:

```css
  --v2-font: "Switzer", system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
```

Switzer tem altura de x maior e avanço menor que Hanken: no mesmo `font-size` ela
lê maior e ocupa menos linha. A escala desce um pouco e o tracking aperta:

```css
  --v2-t-hero:      clamp(2.5rem, 8.2vw, 8rem);
  --v2-t-manifesto: clamp(1.75rem, 4.6vw, 4rem);
  --v2-t-painel:    clamp(2rem, 5vw, 4.5rem);   /* título do painel de caso */
  --v2-t-frase:     clamp(1.5rem, 3.4vw, 2.75rem); /* as três frases do processo */
```

E, no mesmo arquivo, junto dos tokens de tipografia:

```css
  --v2-track-display: -0.032em;   /* hero, título de painel */
  --v2-track-titulo:  -0.02em;    /* manifesto, frase */
```

Aplicar `letter-spacing: var(--v2-track-display)` onde hoje o hero usa valor
literal, em `home.css`, e o mesmo para os títulos.

- [ ] **Step 3: Conferir que a fonte carregou de verdade**

```bash
pkill -f "[c]hromium" || true
BUILD_V2=1 npm run build
(cd dist && python3 -m http.server 8793 --bind 127.0.0.1 &) && sleep 2
node tools/home-v2.mjs medidas
```

Esperado: `fonteH1` contém `Switzer`. Se vier só `system-ui`, a Fontshare não
respondeu: conferir a URL, que usa `f[]` com colchetes e precisa ficar sem escape
no HTML.

- [ ] **Step 4: Conferir a página de caso, que não é reescrita nesta fase**

```bash
node tools/home-v2.mjs prints
```

Abrir `http://127.0.0.1:8793/v2/case/pcyes` e olhar se algum título estourou a
coluna de 640px. Se estourou, ajustar só o token da escala do caso em
`tokens.css` (`--v2-t-caso-hero`, `--v2-t-caso-ato`), nunca o layout de `case.css`.

- [ ] **Step 5: Commit**

```bash
git add v2/index.template.html v2/tokens.css v2/home.css
git commit -m "feat(v2): Switzer no lugar da Hanken Grotesk"
```

---

### Task 3: As duas primitivas de motion

**Files:**
- Modify: `v2/motion.js` (acrescentar ao fim, seguindo a numeração de primitivas
  já usada nos comentários do arquivo)

**Interfaces:**
- Consome: `useScroll`, `useTransform`, `useReducedMotion` de `motion/react`.
- Produz:
  - `usePilha()` → `{ ref, escala, veu }` onde `ref` vai no invólucro de altura
    cheia (não no painel grudado), `escala` é um `MotionValue` de 1 a 0.94 e `veu`
    é um `MotionValue` de 0 a 0.38.
  - `usePalavra(total)` → `{ ref, opacidades, quieto }` onde `opacidades` é um
    array de `MotionValue`, um por palavra, de 0.16 a 1. Array, e não uma função
    `opacidade(i)`: `useTransform` é hook, e chamar hook dentro do `map` do JSX
    depende da ordem de renderização se a frase mudar de tamanho.

- [ ] **Step 1: Escrever `usePilha`**

```js
/* 8. Pilha grudada. O painel é `position: sticky`, então o retângulo dele não
   se move e não serve para medir progresso. Quem mede é o INVÓLUCRO, que rola
   normalmente: enquanto ele sai da tela, o painel seguinte está subindo por
   cima. É esse mesmo intervalo que encolhe e escurece o painel coberto. */
export function usePilha() {
  const ref = useRef(null);
  const quieto = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const escala = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const veu = useTransform(scrollYProgress, [0, 1], [0, 0.38]);
  const um = useMotionValue(1);
  const zero = useMotionValue(0);
  return quieto
    ? { ref, escala: um, veu: zero }
    : { ref, escala, veu };
}
```

`useRef`, `useScroll`, `useTransform`, `useMotionValue` e `useReducedMotion`
precisam estar no import do topo de `motion.js`.

- [ ] **Step 2: Escrever `usePalavra`**

```js
/* 9. Revelação por palavra. A frase inteira é legível desde o início (opacidade
   mínima 0.16, não 0), porque texto invisível que só aparece no scroll quebra
   leitor de tela e busca. O que o scroll faz é acender, não revelar. */
export function usePalavra(total) {
  const ref = useRef(null);
  const quieto = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.3"],
  });
  // Array fixo de MotionValues. `total` vem de uma constante de copy, então a
  // quantidade de hooks nunca muda entre renders.
  const opacidades = [];
  for (let i = 0; i < total; i++) {
    opacidades.push(useTransform(scrollYProgress, [i / total, (i + 1) / total], [0.16, 1]));
  }
  return { ref, opacidades, quieto };
}
```

- [ ] **Step 3: Conferir que o bundle compila**

```bash
BUILD_V2=1 npm run build
```

Esperado: `✓ v2 → dist/v2/` sem erro. Se o esbuild reclamar de export
duplicado, é porque `useRef` já estava importado: unificar o import, não
duplicar a linha.

- [ ] **Step 4: Commit**

```bash
git add v2/motion.js
git commit -m "feat(v2): primitivas de pilha grudada e revelação por palavra"
```

---

### Task 4: A declaração no lugar do manifesto

**Files:**
- Modify: `v2/Home.jsx` (função `Manifesto`, linhas 95 a 121)
- Modify: `v2/copy.js` (acrescentar `DECLARACAO`)
- Modify: `v2/home.css`

**Interfaces:**
- Consome: `usePalavra` da Task 3.
- Produz: componente `Declaracao`, usado por `Home` na posição 2.

- [ ] **Step 1: Escrever a copy**

Em `v2/copy.js`, acrescentar. Sem travessão, sem palavra da moda:

```js
export const DECLARACAO =
  "Eu desenho para tirar o produto do slide. Objetivo primeiro, protótipo navegável em dias, e o que sobrevive ao contato com o usuário vai para o ar.";
```

Os dois parágrafos de `MANIFESTO.colunas` continuam em `copy.js`: eles migram
para `/sobre` numa fase futura, e apagar agora perderia texto já aprovado.

- [ ] **Step 2: Escrever o componente**

Substituir a função `Manifesto` inteira por:

```jsx
/* A declaração é uma frase só, acesa palavra a palavra conforme a dobra sobe.
   Ela é o silêncio entre o hero e a pilha: coluna estreita, nada em volta. */
function Declaracao() {
  const palavras = DECLARACAO.split(" ");
  const { ref, opacidades, quieto } = usePalavra(palavras.length);
  return (
    <section className="v2-declaracao-secao" id="sobre">
      <p className="v2-declaracao" ref={ref}>
        {palavras.map((w, i) => (
          <motion.span
            key={i}
            className="v2-declaracao-w"
            style={quieto ? undefined : { opacity: opacidades[i] }}
          >
            {w}{" "}
          </motion.span>
        ))}
      </p>
    </section>
  );
}
```

Trocar o import de `copy.js` no topo do arquivo para incluir `DECLARACAO`, e o
de `motion.js` para incluir `usePalavra`.

- [ ] **Step 3: Escrever o CSS**

Em `v2/home.css`, no lugar das regras de `.v2-manifesto` e `.v2-manifesto-cols`:

```css
/* Coluna estreita e muito branco: a única dobra da home sem régua e sem label. */
.v2-declaracao-secao {
  padding: var(--v2-s7) var(--v2-gutter);
  display: flex;
  justify-content: center;
}
.v2-declaracao {
  max-width: 900px;
  font-size: var(--v2-t-manifesto);
  line-height: 1.12;
  letter-spacing: var(--v2-track-titulo);
  font-weight: 500;
  text-wrap: balance;
}
.v2-declaracao-w { display: inline-block; }
```

- [ ] **Step 4: Conferir**

```bash
pkill -f "[c]hromium" || true
BUILD_V2=1 npm run build
(cd dist && python3 -m http.server 8793 --bind 127.0.0.1 &) && sleep 2
node tools/home-v2.mjs prints
```

Esperado nos prints de `desktop`: a segunda dobra é uma frase grande centrada,
sem label à esquerda e sem régua. Nenhuma palavra pode aparecer invisível no
print do topo da dobra: a opacidade mínima é 0.16, então todas devem estar
legíveis, só que apagadas.

- [ ] **Step 5: Commit**

```bash
git add v2/Home.jsx v2/copy.js v2/home.css
git commit -m "feat(home): o manifesto de duas colunas vira uma declaração"
```

---

### Task 5: A pilha grudada de casos

A tarefa central. Substitui `CasoLinha` e `Casos`.

**Files:**
- Modify: `v2/Home.jsx` (linhas 195 a 238)
- Modify: `v2/home.css`

**Interfaces:**
- Consome: `usePilha` (Task 3), `useParallax` (já existe), `casos()` de
  `content.js`, `pieceLink` não se aplica aqui.
- Produz: componentes `Painel` e `Pilha`, usados por `Home` na posição 3.

- [ ] **Step 1: Escrever os componentes**

```jsx
/* Pilha grudada, no padrão medido no viper-template: cada painel gruda num
   `top` maior que o anterior, então o topo do painel coberto continua à mostra
   como uma lombada. O invólucro é quem rola; o painel é quem gruda. */
const PILHA_TOPO = 84;    /* a nav flutuante tem 72px, mais 12 de respiro */
const PILHA_PASSO = 22;   /* a lombada visível de cada painel coberto */

function Painel({ caso, i, ir }) {
  const { ref, escala, veu } = usePilha();
  const { ref: refFoto, style: estiloFoto } = useParallax(8);
  const cap = caso.chap;
  const cover = cap.cover || (caso.proj && caso.proj.cover);
  const href = `/v2/case/${caso.id}`;
  return (
    <div className="v2-painel-inv" ref={ref}>
      <motion.article
        className="v2-painel"
        data-escuro-corpo="1"
        style={{
          top: PILHA_TOPO + i * PILHA_PASSO,
          zIndex: i + 1,
          scale: escala,
        }}
      >
        <a
          className="v2-painel-link"
          href={href}
          onClick={(e) => { e.preventDefault(); ir(href); }}
          aria-label={`${cap.title}, ${cap.descriptor}`}
        >
          <span className="v2-painel-media" ref={refFoto}>
            {cover ? (
              <motion.img
                className="v2-painel-foto"
                style={estiloFoto}
                src={cover}
                alt=""
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            ) : null}
            <motion.span className="v2-painel-veu" style={{ opacity: veu }} aria-hidden="true" />
          </span>

          <span className="v2-painel-texto">
            <span className="v2-painel-n">{cap.num}</span>
            <h2 className="v2-painel-t">{cap.title}</h2>
            <span className="v2-painel-d">{cap.descriptor}</span>
            <span className="v2-painel-dom">{cap.domain}</span>
          </span>
        </a>
      </motion.article>
    </div>
  );
}

function Pilha({ ir }) {
  const lista = casos();
  return (
    <section className="v2-pilha" id="casos" aria-label="Casos">
      {lista.map((c, i) => (
        <Painel key={c.id} caso={c} i={i} ir={ir} />
      ))}
    </section>
  );
}
```

- [ ] **Step 2: Escrever o CSS**

```css
/* O invólucro tem a altura que o painel consome de scroll. Ele NÃO é sticky:
   é ele que rola, e é medindo a saída dele que a primitiva sabe o quanto o
   painel já foi coberto. */
.v2-pilha { padding: 0 0 var(--v2-s7); }
.v2-painel-inv { height: 92vh; position: relative; }

.v2-painel {
  position: sticky;
  height: 88vh;
  margin: 0 var(--v2-gutter);
  border-radius: var(--v2-r-media);
  overflow: hidden;
  background: var(--v2-card);
  transform-origin: center 18%;
  will-change: transform;
}
.v2-painel-link { position: absolute; inset: 0; display: block; color: #fff; text-decoration: none; }

.v2-painel-media { position: absolute; inset: 0; overflow: hidden; }
.v2-painel-foto { width: 100%; height: 112%; object-fit: cover; display: block; }
.v2-painel-veu { position: absolute; inset: 0; background: #000; }

/* O texto senta no rodapé do painel, sobre um degradê que garante contraste
   sem escurecer a imagem inteira. */
.v2-painel-texto {
  position: absolute;
  inset: auto 0 0 0;
  display: grid;
  gap: var(--v2-s1);
  padding: var(--v2-s6) var(--v2-s5) var(--v2-s5);
  background: linear-gradient(to top, rgba(0,0,0,.72), rgba(0,0,0,0));
}
.v2-painel-n { font-size: var(--v2-t-label); letter-spacing: .12em; opacity: .8; }
.v2-painel-t {
  font-size: var(--v2-t-painel);
  line-height: 1.02;
  letter-spacing: var(--v2-track-display);
  font-weight: 600;
}
.v2-painel-d { font-size: var(--v2-t-corpo); opacity: .86; max-width: 46ch; }
.v2-painel-dom { font-size: var(--v2-t-label); letter-spacing: .12em; opacity: .7; }

.v2-painel-link:focus-visible { outline: 3px solid #fff; outline-offset: -6px; }

/* Tela baixa: a pilha desliga. Em 620px de altura útil o texto do painel
   colide com a imagem e a lombada some. Vira lista vertical normal. */
@media (max-height: 700px), (max-width: 720px) {
  .v2-painel-inv { height: auto; }
  .v2-painel { position: relative; height: 62vh; min-height: 420px; margin-bottom: var(--v2-s4); }
}
@media (prefers-reduced-motion: reduce) {
  .v2-painel-inv { height: auto; }
  .v2-painel { position: relative; height: 62vh; min-height: 420px; margin-bottom: var(--v2-s4); }
}
```

- [ ] **Step 3: Trocar `<Casos />` por `<Pilha />` em `Home`**

Na função `Home`, na composição final, `<Casos ir={ir} />` vira `<Pilha ir={ir} />`.
Apagar `CasoLinha` e `Casos` e as regras `.v2-caso*` de `home.css`, que ficam órfãs.

- [ ] **Step 4: Conferir**

```bash
pkill -f "[c]hromium" || true
BUILD_V2=1 npm run build
(cd dist && python3 -m http.server 8793 --bind 127.0.0.1 &) && sleep 2
node tools/home-v2.mjs medidas
node tools/home-v2.mjs prints
```

Esperado em `medidas`: `paineis: 4`. Esperado nos prints de `desktop`: em
posições intermediárias, mais de um painel visível ao mesmo tempo, com a lombada
do anterior aparecendo acima do atual. Esperado em `laptop-baixo` e `celular`:
painéis empilhados verticalmente, sem grudar.

Se os quatro painéis aparecerem soltos no desktop, o `top` não está sendo
aplicado: `position: sticky` só funciona se nenhum ancestral tiver `overflow`
diferente de `visible`. Conferir `.v2-corpo-claro` em `home.css`.

- [ ] **Step 5: Commit**

```bash
git add v2/Home.jsx v2/home.css
git commit -m "feat(home): os casos viram uma pilha grudada em largura cheia"
```

---

### Task 6: O processo em três frases

**Files:**
- Modify: `v2/Home.jsx` (linhas 157 a 193)
- Modify: `v2/copy.js`
- Modify: `v2/home.css`

**Interfaces:**
- Consome: `useRise` (já existe).
- Produz: componente `Processo` reescrito. `PROCESSO()` de `content.js` continua
  intocado e com as seis etapas, para `/processo` usar depois.

- [ ] **Step 1: Escrever a copy**

Em `v2/copy.js`. As três frases condensam as seis etapas de `volume/data.jsx:876`
sem inventar processo novo:

```js
export const PROCESSO_CURTO = [
  "Começo pelo objetivo, não pela lista de telas, e caço o que já funciona antes de desenhar.",
  "Do objetivo ao protótipo clicável em dias, para a mesa tocar em vez de imaginar.",
  "Mostro cedo, corto o que não serve, e o protótipo vira produto no ar.",
];
```

- [ ] **Step 2: Escrever o componente**

```jsx
/* Seis etapas numeradas eram um índice disfarçado de conteúdo. Três frases
   grandes dizem a mesma coisa e ocupam um terço da altura. Sem numeral, sem
   régua entre elas: a quebra de linha já separa. */
function Processo() {
  const rise = useRise();
  return (
    <section className="v2-wrap" id="processo">
      <Regua />
      <div className="v2-duas">
        <Label>Como eu trabalho</Label>
        <div className="v2-frases">
          {PROCESSO_CURTO.map((f, i) => (
            <motion.p key={i} className="v2-frase" {...rise(i)}>{f}</motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
```

Apagar `ProcessoLinha`. Trocar o import de `content.js` (`PROCESSO` sai da home) e
acrescentar `PROCESSO_CURTO` ao import de `copy.js`.

- [ ] **Step 3: Escrever o CSS**

Substituir as regras `.v2-proc*` por:

```css
.v2-frases { display: grid; gap: var(--v2-s5); max-width: var(--v2-medida); }
.v2-frase {
  font-size: var(--v2-t-frase);
  line-height: 1.18;
  letter-spacing: var(--v2-track-titulo);
  font-weight: 400;
  text-wrap: pretty;
}
```

- [ ] **Step 4: Conferir**

```bash
pkill -f "[c]hromium" || true
BUILD_V2=1 npm run build
(cd dist && python3 -m http.server 8793 --bind 127.0.0.1 &) && sleep 2
node tools/home-v2.mjs prints
```

Esperado: três frases, nenhum numeral, nenhuma régua entre elas. A dobra tem que
caber numa tela de 900px de altura.

- [ ] **Step 5: Commit**

```bash
git add v2/Home.jsx v2/copy.js v2/home.css
git commit -m "feat(home): o processo cai de seis etapas para três frases"
```

---

### Task 7: As peças em fita

**Files:**
- Modify: `v2/Home.jsx` (linhas 240 a 344)
- Modify: `v2/home.css`

**Interfaces:**
- Consome: `pieceProjects`, `pieceLink` de `content.js`.
- Produz: componente `Fita`, usado por `Home` na posição 7. `PecaComFoto` e
  `Pecas` deixam de existir.

- [ ] **Step 1: Escrever o componente**

```jsx
/* Peça extra num portfólio de UX não pode ter tratamento de caso. Sai a grade
   de cards, sai a lista atrás de botão, entram duas fitas correndo em direções
   opostas. Quem quiser olhar de perto abre a lista completa no link abaixo. */
function FitaTrilho({ itens, invertida }) {
  const trilho = itens.map((p) => {
    const capa = p.cover || (p.shots && p.shots[0]);
    const href = pieceLink(p);
    const Tag = href ? "a" : "span";
    return (
      <Tag
        key={p.id}
        className="v2-fita-item"
        href={href || undefined}
        target={href ? "_blank" : undefined}
        rel={href ? "noopener noreferrer" : undefined}
        title={p.title}
      >
        <img src={capa} alt={p.title} loading="lazy" decoding="async" />
      </Tag>
    );
  });
  return (
    <div className={"v2-fita" + (invertida ? " is-invertida" : "")}>
      <div className="v2-fita-trilho">
        <div className="v2-fita-grupo">{trilho}</div>
        {/* a segunda cópia existe só para o loop não ter costura */}
        <div className="v2-fita-grupo" aria-hidden="true">
          {itens.map((p) => {
            const capa = p.cover || (p.shots && p.shots[0]);
            return <span className="v2-fita-item" key={"b" + p.id}><img src={capa} alt="" loading="lazy" /></span>;
          })}
        </div>
      </div>
    </div>
  );
}

function Fita() {
  const lista = pieceProjects().filter((p) => p.cover || (p.shots && p.shots[0]));
  if (!lista.length) return null;
  const meio = Math.ceil(lista.length / 2);
  return (
    <section className="v2-fita-secao" id="pecas" aria-label="Outras peças">
      <FitaTrilho itens={lista.slice(0, meio)} />
      <FitaTrilho itens={lista.slice(meio)} invertida />
    </section>
  );
}
```

- [ ] **Step 2: Escrever o CSS**

```css
.v2-fita-secao { display: grid; gap: var(--v2-s2); padding: var(--v2-s6) 0; overflow: hidden; }
.v2-fita { overflow: hidden; }
.v2-fita-trilho { display: flex; width: max-content; gap: var(--v2-s2); animation: v2-fita-anda 46s linear infinite; }
.v2-fita.is-invertida .v2-fita-trilho { animation-direction: reverse; }
.v2-fita-grupo { display: flex; gap: var(--v2-s2); }
.v2-fita-item { display: block; width: 280px; height: 176px; border-radius: var(--v2-r-card); overflow: hidden; background: var(--v2-card); }
.v2-fita-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
@keyframes v2-fita-anda { from { transform: translate3d(0,0,0); } to { transform: translate3d(-50%,0,0); } }
@media (prefers-reduced-motion: reduce) {
  .v2-fita-trilho { animation: none; }
  .v2-fita { overflow-x: auto; }
}
```

- [ ] **Step 3: Trocar `<Pecas />` por `<Fita />` em `Home`, e apagar as regras `.v2-peca*` e `.v2-pecas*` de `home.css`**

- [ ] **Step 4: Conferir**

```bash
pkill -f "[c]hromium" || true
BUILD_V2=1 npm run build
(cd dist && python3 -m http.server 8793 --bind 127.0.0.1 &) && sleep 2
node tools/home-v2.mjs prints
```

Esperado: duas faixas de imagem de 176px de altura, sem título, sem grade, sem
botão. Se uma das fitas ficar com um vão no fim, a lista tem poucos itens com
foto: duplicar o grupo mais uma vez em vez de esticar o item.

- [ ] **Step 5: Commit**

```bash
git add v2/Home.jsx v2/home.css
git commit -m "feat(home): as peças extras viram fita, não grade"
```

---

### Task 8: O fecho e a ordem final

**Files:**
- Modify: `v2/Home.jsx` (função `Home`, linhas 381 em diante)
- Modify: `v2/home.css`

**Interfaces:**
- Consome: `CONTATO` de `content.js`.
- Produz: componente `Fecho`. Ordem final da home fixada.

- [ ] **Step 1: Escrever o componente**

```jsx
/* A home terminava na timeline, que é um fim por acidente. O fecho escuro
   fecha o par com o hero e é onde o contato mora. */
function Fecho() {
  const linha = useMaskLine();
  const c = CONTATO();
  const canais = [c.whatsapp, c.email, c.linkedin].filter(Boolean);
  return (
    <section className="v2-fecho" data-escuro-corpo="1" id="contato">
      <div className="v2-wrap">
        <h2 className="v2-fecho-h">
          <motion.span {...linha(0)}>Tem um produto travado no slide?</motion.span>
        </h2>
        <ul className="v2-fecho-canais">
          {canais.map((x) => (
            <li key={x.href}>
              <a className="v2-fecho-link" href={x.href} target="_blank" rel="noopener noreferrer">
                <span className="v2-fecho-rot">{x.label}</span>
                <span className="v2-fecho-val">{x.display}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

`CONTATO` ainda não está no import de `content.js` no topo de `Home.jsx`:
acrescentar à lista, ao lado de `COMPANIES`.

- [ ] **Step 2: Escrever o CSS**

```css
.v2-fecho { background: var(--v2-ink); color: #fff; padding: var(--v2-s7) 0; }
.v2-fecho-h {
  font-size: var(--v2-t-manifesto);
  line-height: 1.06;
  letter-spacing: var(--v2-track-titulo);
  font-weight: 500;
  max-width: 16ch;
}
.v2-fecho-canais { list-style: none; display: grid; gap: 0; margin-top: var(--v2-s6); }
.v2-fecho-link {
  display: flex; justify-content: space-between; align-items: baseline; gap: var(--v2-s3);
  padding: var(--v2-s3) 0; border-top: 1px solid rgba(255,255,255,.18);
  color: #fff; text-decoration: none;
}
.v2-fecho-canais li:last-child .v2-fecho-link { border-bottom: 1px solid rgba(255,255,255,.18); }
.v2-fecho-rot { font-size: var(--v2-t-label); letter-spacing: .12em; opacity: .64; }
.v2-fecho-val { font-size: var(--v2-t-bloco); }
.v2-fecho-link:hover .v2-fecho-val { opacity: .7; }
```

- [ ] **Step 3: Fixar a ordem final**

```jsx
export default function Home({ ir }) {
  const rolar = () => {
    const alvo = document.getElementById("casos");
    if (alvo) alvo.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Hero paraCasos={rolar} />
      <div className="v2-corpo-claro" data-clara="1">
        <Declaracao />
        <Pilha ir={ir} />
        <Marquee />
        <Processo />
        <OndeEstive />
        <Fita />
        <Fecho />
      </div>
    </>
  );
}
```

- [ ] **Step 4: Conferir**

```bash
pkill -f "[c]hromium" || true
BUILD_V2=1 npm run build
(cd dist && python3 -m http.server 8793 --bind 127.0.0.1 &) && sleep 2
node tools/home-v2.mjs medidas
node tools/home-v2.mjs prints
```

Esperado em `medidas`: `secoes` na ordem `sobre`, `casos`, marquee, `processo`,
`onde`, `pecas`, `contato`. Esperado no print do fim: bloco escuro com a nav
invertida por cima dele.

- [ ] **Step 5: Commit**

```bash
git add v2/Home.jsx v2/home.css
git commit -m "feat(home): fecho escuro com contato e ordem final das dobras"
```

---

### Task 9: Regressão de acessibilidade e de tela

**Files:**
- Modify: `v2/home.css` (só se a conferência achar problema)

- [ ] **Step 1: Teclado**

Servir, dar `Tab` desde o topo e conferir, em ordem: pular para o conteúdo, links
da nav, botão do hero, os quatro painéis da pilha (um `Tab` cada, não quatro),
links da fita, links do fecho. Nenhum foco pode ficar invisível: `.v2-painel-link`
tem `outline` branco de 3px, a fita e o fecho herdam o `:focus-visible` de
`shell.css`.

- [ ] **Step 2: Movimento reduzido**

```bash
node -e '
import("/home/gabrielbarbosa/.claude/node_modules/playwright/index.mjs").then(async ({chromium}) => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport:{width:1440,height:900}, reducedMotion:"reduce" });
  await p.goto("http://127.0.0.1:8793/v2/", { waitUntil:"networkidle" });
  await p.waitForTimeout(800);
  await p.screenshot({ path:"/tmp/home-v2/reduzido.png", fullPage:false });
  console.log(await p.evaluate(() => getComputedStyle(document.querySelector(".v2-painel")).position));
  await b.close();
});'
```

Esperado: imprime `relative`, não `sticky`. A declaração aparece com todas as
palavras em opacidade 1.

- [ ] **Step 3: Contraste do texto sobre a foto**

O texto do painel senta sobre um degradê de `rgba(0,0,0,.72)`. Conferir com axe:

```bash
npm i --no-save axe-core
node -e '
import("/home/gabrielbarbosa/.claude/node_modules/playwright/index.mjs").then(async ({chromium}) => {
  const fs = await import("node:fs");
  const b = await chromium.launch();
  const p = await b.newPage({ viewport:{width:1440,height:900} });
  await p.goto("http://127.0.0.1:8793/v2/", { waitUntil:"networkidle" });
  await p.addScriptTag({ content: fs.readFileSync("node_modules/axe-core/axe.min.js","utf8") });
  const r = await p.evaluate(async () => (await axe.run()).violations.map(v => v.id + " x" + v.nodes.length));
  console.log(r.join("\n") || "sem violação");
  await b.close();
});'
```

Esperado: sem violação de `color-contrast` na home. Se aparecer, escurecer o
degradê do `.v2-painel-texto` para `rgba(0,0,0,.82)`, nunca clarear o texto.

- [ ] **Step 4: Limpeza**

```bash
pkill -f "[c]hromium" || true
pkill -f "[h]ttp.server 8793" || true
```

- [ ] **Step 5: Commit, se houve ajuste**

```bash
git add v2/home.css
git commit -m "fix(a11y): contraste e foco na home nova"
```

---

## Depois do plano

Atualizar `docs/HANDOFF-V2.md` e `docs/STATE.md` com a home nova, citando os
commits. O spec `2026-08-28-home-v2-redesign-design.md` é a fonte das decisões H1
a H8 e não deve ser reescrito, só referenciado.

---

## Desvios registrados na execução

1. **Task 5, formato dos casos.** A pilha de painéis de foto sangrando em `88vh`
   foi implementada, vista em print e recusada por Gabriel, que preferiu o
   tratamento do `viper-template`: linhas de dois cards claros, com a linha
   inteira grudando. Refeita nesse formato. O spec H3 foi corrigido.
2. **Task 5, estrutura do sticky.** A primeira versão dava um invólucro por
   painel; sticky só gruda dentro do bloco que o contém, então painel de 88vh
   em invólucro de 92vh não grudava (medido: tops negativos). Os elementos
   grudados passaram a ser filhos diretos da seção.
3. **Task 7, uma fita e não duas.** Só sete peças têm foto, e três por fita não
   enchem 1440px: o loop mostraria o vão da costura. Ficou uma fita de sete,
   duplicada, mais uma linha de texto com as sete peças sem imagem.
4. **Task 9, piso da declaração.** O piso de opacidade 0.16 reprovou em
   contraste no axe. Subiu para 0.45, que é o mínimo que dá 3:1 em texto grande.
5. **Build.** `npm run build` sozinho não emite `dist/v2/`: precisa de
   `BUILD_V2=1` (`build.mjs:41`). Os comandos do plano foram corrigidos.
6. **Bug de renderização.** A declaração saía sem espaço entre palavras: espaço
   no fim de um `inline-block` é descartado. O espaço passou para fora do span.
