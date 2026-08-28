# Handoff: portfólio V2, depois das Fases 6, 7 e 8

Reescrito em 2026-08-28, depois das Fases 6 a 8 entregues. Substitui a versão
anterior e substitui qualquer necessidade de ler transcript.

## Antes de tudo

1. Invoque a skill `token-hygiene` e siga as regras dela na tarefa inteira.
2. Leia o spec: `docs/superpowers/specs/2026-08-28-portfolio-v2-design.md`. Ele é a
   fonte das decisões D1 a D8.
3. Não leia transcripts. O repositório, o spec e este arquivo têm tudo.

## Postura

Você é um UI designer sênior acostumado a layout de agência: grade larga, respiro
generoso, tipografia grande e confiante, motion contínuo e discreto. A V2 tem que
parecer trabalho de estúdio, não template preenchido. Onde o gosto conflitar com
legibilidade, hierarquia ou acessibilidade, vence a legibilidade, e você diz que
divergiu.

Gabriel decide o visual por comparação de print, não por descrição.

## Estado do código

Fases 0 a 8 entregues. As Fases 0 a 5 foram aprovadas pelo Gabriel; as 6, 7 e 8
foram feitas de uma vez, a pedido dele, e **ainda não passaram pelo print de
aprovação**. É a primeira coisa a fazer na próxima sessão.

Commits: `9f2ff22` (Fase 6), `d59fc19` (Fase 7), e o commit da Fase 8 logo acima
deste arquivo.

Arquivos: `v2/{app.jsx, Home.jsx, Case.jsx, Shell.jsx, content.js, copy.js,
motion.js, tokens.css, shell.css, home.css, case.css, index.template.html}`.

### O que mudou nas Fases 6 a 8

**A grade de fundo saiu.** `.v2-grade` não existe mais em lugar nenhum. Ela era
seis linhas de `#E6E6E8` sobre branco atravessando parágrafo. No lugar dela:

- a cruz saiu do meio da régua e foi para as duas pontas (`.v2-cruz`, em
  `shell.css`), onde não precisa de retângulo de papel mascarando a linha;
- a textura de 5px foi para dentro do painel de mídia (`.v2-textura`, tile SVG
  gerado em `tokens.css`), nunca na página.

**A página de caso tem UMA grade.** `label 220 · leitura 640 · nota marginal 300`,
somando 1240, centrada no container. Toda dobra usa a mesma, então todo label
começa no mesmo x. `fonte`, `nota` e `leitura`, que competiam com o argumento
dentro da coluna de leitura, foram para a coluna da direita (`Dobra` ganhou as
props `topo` e `aside`).

**Existe um componente de dado e só um.** `Dado` em `Case.jsx`: número → régua de
1px → rótulo, empilhado, sem caixa. Quando o dado tem proporção, quem a carrega é
a própria régua. Usado pelas cinco etapas do funil, pelos cinco itens do mapa de
calor, pela taxa de conversão, pelo achado da busca, pelo ritmo e pelos raios do
design system.

**`--v2-card` significa uma coisa só: mídia.** Figura, comparador e palco da
coluna presa. Para o cromo (pill, chip de código) existe `--v2-superficie`.

**Dezoito dobras viraram quatro movimentos.** `Movimento` abre cada um em largura
cheia, sem label, com a única régua com cruz da página. Não é índice: não navega,
não fica preso na tela e não numera seção (D7 continua valendo).

**A home perdeu a repetição.** A tríade de vitrine saiu (mostrava três dos quatro
casos que a lista logo abaixo já mostra). As catorze peças viraram sete na grade,
só as que têm foto, e as outras sete numa lista de texto atrás de um botão.

**O header perdeu os maneirismos.** Sem sobrescritos `⁰¹ ⁰² ⁰³` e sem o ponto
accent depois do nome. O que separa os links agora é espaço, peso e um traço que
cresce no hover.

**O pill tem comportamento.** O círculo accent cresce até virar a pílula inteira
(`.v2-pill-filler`) e a fita de duas setas troca de seta na janela de 12px.

## Números medidos a 2026-08-28

Todos com Playwright em `deviceScaleFactor: 1`, depois de rolar a página inteira e
esperar as animações assentarem.

| | antes (Fase 5) | agora |
|---|---|---|
| altura da página de caso a 1440 | 29.583px | 35.263px |
| labels de seção no caso | 18 | 14 |
| réguas no caso | 23 | 10 |
| vazio assimétrico à direita do parágrafo | 500px em 40 parágrafos | 80px na maioria, 220px no pior caso |
| altura da home a 1440 | 8.260px | 7.182px |
| peças na grade da home | 14 (7 sem imagem) | 7, todas com foto |

A página ficou mais alta porque os quatro movimentos e o vão entre dobras entraram
no lugar das réguas. O ganho não é comprimento, é hierarquia.

O pior caso de 220px é a coluna presa da ponte (`.v2-preso-passo .v2-corpo`), que
tem 52ch dentro de uma coluna de 52% ao lado da mídia presa. É composição, não
sobra.

### Fase 8, verificado

- **axe-core**: zero violação nas duas páginas, a 1440. Duas foram corrigidas nesta
  rodada: `heading-order` (`.v2-proc-t` virou `h2`, `.v2-preso-t` virou `h3`) e
  `color-contrast` em `.v2-par-tema`, que herdava a cor do token demonstrado e
  ainda levava `opacity: .7` (2,93:1). Agora é tinta de legenda.
- **Sem overflow horizontal** em 2560, 1920, 1600, 1440, 1280, 1100, 900, 810, 768,
  600, 480, 390 e 360, nas duas páginas.
- **Zero erro de console** em todas essas larguras.
- **`prefers-reduced-motion: reduce`**: nenhum elemento revelado carrega `transform`
  residual; só opacidade se move.
- **Comparador com teclado**, idêntico nos dois modos: seta 2%, Shift 10%, Home 0,
  End 100, `role="slider"` com `aria-valuetext`.
- **`node build.mjs` sem `BUILD_V2` não gera `dist/v2/`.**
- Peso local (dev, sem minificar): `app.js` 473KB, `v2.css` 37,9KB. A home carrega
  9 requisições e 837KB; o caso, 10 e 1.125KB. Nós do DOM: 404 na home, 1.049 no
  caso. Imagens: 28 na home, todas `lazy`; 38 no caso, 37 `lazy` (a capa do hero é
  a única ansiosa, e é a que está acima da dobra).
- **Lighthouse não rodou**: não está instalado nesta máquina e instalar puxaria
  dependência para o repositório. Os números acima cobrem o que ele mediria de
  útil aqui. `axe-core` foi instalado fora do repositório, em scratchpad.

## Regras que já custaram tempo

- `volume/*` é **congelado**. Não edite nada lá. A V2 só lê `window`.
- React não é bundlado: `react` e `react-dom/client` resolvem para `window.React` e
  `window.ReactDOM` via plugin em `build.mjs`. A lista de exports é gerada de
  `Object.keys(require("react"))`; escrita à mão ela quebra.
- `buildV2()` só roda com `--serve` ou `BUILD_V2=1`. Produção não emite `dist/v2/`.
  Não mexa em `vercel.json` e não publique.
- Sem travessão em texto de site. Sem venda de IA. Ver a memória `gabriel-copy-rules`.
- Nunca `pkill -f "node build.mjs"` nem `pkill -f headless_shell`: o padrão casa com
  a própria linha de comando do shell e mata a sessão. Pare pelo PID ou pela porta.
- O CSS da V2 é concatenado à mão em `buildV2Css()`. **Arquivo `.css` novo em `v2/`
  precisa entrar na lista `ordem`** dentro de `build.mjs`, senão ele nunca é servido.
- **Só um servidor de dev por vez.** Antes de subir servidor, rode
  `ps -eo pid,args | grep '[b]uild.mjs'` e mate os órfãos por PID.
- **`IntersectionObserver` conta interseção de área zero como interseção.** Por isso
  `useSobreEscuro` em `app.jsx` é listener de scroll com faixa fixa de 72px. Bloco
  escuro no meio da página se declara com `data-escuro-corpo`.
- **Imagem no fluxo dentro de dobra de altura fixa impõe a altura intrínseca dela.**
  A capa do hero é `position: absolute` dentro de um container `relative`.
- **`useScroll` congela dentro de elemento `sticky`.** Nada de parallax dentro do
  hero preso.
- **Medir contraste com axe exige esperar a animação.** A entrada agora dura 1,2s;
  medindo antes disso o axe pega o texto em opacidade parcial e acusa 44 violações
  de contraste que não existem. Espere 3s depois de rolar.
- **Especificidade de classe composta não cai sozinha em media query.**
  `.v2-dados.is-funil` sobrevivia ao `.v2-dados { grid-template-columns: 1fr }` do
  mobile e estourava a página a 390. Toda variante composta precisa da própria
  linha no breakpoint.

## As referências, medidas

Todas em `~/dev/refs/`, clonadas com a skill `clonar-site`. São templates pagos:
**nada delas entra no repositório**. Você lê para entender medida e técnica, e
escreve o seu do zero. Não leia `framerusercontent.com` nem `updates.framer.com`:
são centenas de MB de asset.

O que já foi extraído e aplicado (não precisa medir de novo):

- **viper.** Container 1800. Contador 128px `lh 148` `ls -10px`. A cruz de 9×9 na
  ponta do separador, com a linha em `flex: 1 0 0` e `opacity: .65`. `BG Pattern`
  de 5px dentro do card, `opacity: .25`. Spring `stiffness 200`, damping 60 e 70.
  O pill com `Filler` que vai a 95% e duas setas empilhadas numa janela de 18px.
  Componente de dado: número → régua → rótulo, sem borda, sem fundo, sem raio.
- **porto.** Botão com camada que varre a partir da borda. Não usado: a V2 ficou
  com o filler da viper, que é o mesmo gesto melhor resolvido.
- **launchfolio.** Tween `[0.4, 0, 0.2, 1]` com atrasos longos. Aplicado no pé do
  hero da home (`useTardio`).
- **maxfolio.** Painel de vidro sobre a mídia: `backdrop-filter: blur(9px)`, borda
  de 1px. Aplicado no botão "Abrir" que aparece no hover dos cards de peça.
- **tabfolio.** Stagger de 0.1 em seis passos, duração 1.1. Virou o stagger global
  de 0.12 e a duração de 1.2.

As duas conclusões que continuam valendo:

1. Nenhuma das cinco referências deixa vazio à direita da coluna de texto.
2. Nenhuma das cinco põe um bloco de número dentro de uma caixa.

## O que fazer agora

1. **Print para o Gabriel aprovar.** As Fases 6 a 8 não passaram por isso. Os
   pontos que ele mais provavelmente vai olhar: a fileira de cinco dados do funil,
   a virada de movimento, o pill no hover, e a dobra de peças fechada.
2. Se ele aprovar, a decisão seguinte é de escopo, não de código: publicar `/v2`
   exige rever D6 e `vercel.json`, e isso é decisão dele.

## Dívidas conhecidas

- **Não existe vídeo nem gif de protótipo.** Confirmado com Gabriel em 2026-08-28:
  pretende gravar um do fluxo inteiro mais tarde. Quando aparecer, entra no lugar
  dos prints parados do módulo "O acabamento", com `loop`, `playsinline`, mudo e
  `preload="metadata"`.
- **`v2/copy.js` duplica texto.** O hero mora em `volume/Capa.jsx` e o manifesto em
  `volume/Posfacio.jsx`, congelados, que não publicam nada em `window`. As strings
  foram copiadas literalmente com a origem anotada. Some no dia em que `data.jsx`
  publicar essas chaves.
- **Quatro peças não têm imagem no repositório** (dropchina, 4yu, remoctrl, traxium).
  Hoje elas vivem na lista de texto fechada. Se as capas aparecerem, elas sobem
  sozinhas para a grade, sem mudança de código: o filtro é `p.cover || p.shots[0]`.
- **`painel` e `notaSuporte` do pcyes não estão na página.** Ficaram de fora porque
  `funil` dá o mesmo dado com mais detalhe. Se Gabriel pedir, é meia hora.
- **`sticky` está no teto.** O spec permite duas aparições: a linha do tempo da home
  e a ponte da V1.2 no caso. Uma terceira precisa de decisão do Gabriel.
- **As primitivas de hero moram em `home.css`** e são usadas também pelo caso
  (`.v2-hero`, `.v2-hero-in`, `.v2-hero-topo`, `.v2-hero-h`, `.v2-hero-linha`). Se
  uma terceira página usar, mova para `shell.css`.
- **O funil cai um degrau de tamanho.** É o único lugar da página onde o número do
  componente de dado sai da escala: cinco etapas em fileira não cabem em 128px, e
  quebrá-las em duas linhas destrói o argumento do despencar.

## Como rodar e verificar

```bash
cd /home/gabrielbarbosa/dev/gabriel/portfolio
ps -eo pid,args | grep '[b]uild.mjs'   # mate órfãos por PID antes de subir
PORT=5190 node build.mjs --serve       # / é a V1, /v2 é a V2
BUILD_V2=1 node build.mjs              # build único com V2
node build.mjs                         # produção: não deve gerar dist/v2
```

Print (o caminho que funciona nesta máquina):

```js
import pkg from '/home/gabrielbarbosa/.claude/node_modules/playwright/index.js';
const { chromium } = pkg;   // é CommonJS: import nomeado falha
```

Rode com `LD_LIBRARY_PATH=$HOME/.local/chromedeps/usr/lib/x86_64-linux-gnu`, salve em
jpeg qualidade 72 com `deviceScaleFactor: 1`, e feche o browser no fim do script.
Para print de uma dobra específica, role por seletor (`getBoundingClientRect().top`)
e não por coordenada fixa: a página carrega imagem com `loading="lazy"` e as
coordenadas mudam entre execuções.

## Pronto quando

Tudo abaixo está verificado hoje, e é o que a próxima sessão precisa manter:

- `/v2` e `/v2/case/pcyes` rodam sem erro de console de 360 a 2560.
- Nenhuma linha de fundo atravessa parágrafo.
- Nenhum parágrafo sobra com mais de 220px de vazio assimétrico à direita.
- Todo número da página usa o mesmo componente de dado, e o painel cinza significa
  só mídia.
- O botão tem preenchimento e troca de seta no hover.
- A V1 continua idêntica e `node build.mjs` sem `BUILD_V2` não gera `dist/v2/`.
- Com `prefers-reduced-motion: reduce`, só opacidade se move.
- A página de caso não tem índice.
- axe-core sem violação nas duas páginas.

O único item em aberto: **Gabriel ainda não aprovou o print das Fases 6 a 8.**
