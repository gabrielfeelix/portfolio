# O que falta no volume

> Reescrito em 2026-08-27, sobre `07c9382`, com tudo medido na página
> servida depois de rolar a página inteira. Este é **o** arquivo de
> pendência: a seção "Pendente" do `docs/HANDOFF.md` aponta para cá.
>
> Leia junto, e nesta ordem: `docs/HANDOFF.md` (arquitetura, regras duras,
> armadilhas), este arquivo (o que falta), e só se precisar do histórico,
> `docs/AUDITORIA-PCYES-2026-08-26.md` e `docs/GRUPO-A-RITMO.md`.
>
> **Não vasculhe transcript de conversa.** A resposta está no repo, sai de
> `git log`, ou é pergunta para o Gabriel.

---

## Onde o volume está hoje

| Capítulo | Altura (1440) | Telas | Palavras | Leitura | Imagens |
|---|---|---|---|---|---|
| **pcyes** | 35.293px | 39,2 | 3.544 | **17,7 min** | 29 |
| locarmais-conciliacao | 13.719px | 15,2 | 834 | 4,2 min | 4 |
| portfolio | 11.710px | 13,0 | 323 | 1,6 min | 5 |
| odex | 11.114px | 12,3 | 587 | 2,9 min | 4 |
| oderco-revenda | 10.911px | 12,1 | 641 | 3,2 min | 3 |

O PCYES em outras larguras: **36.856px (43,7 telas) em 390** e 39.178px
(46,4 telas) em 768. O celular deixou de ser 4 telas mais caro que o
desktop e passou a ser 4,5, mas em números absolutos caiu: media 40.779px
antes da rodada do ritmo.

Seis grupos fecharam (a Rodada A, e os Grupos A, B, D e E). O que resta
está abaixo, em ordem de impacto.

---

## 1 · O print do pop-up · **o passo dorme até ele chegar**

**Três dos quatro prints chegaram em 2026-08-26** e já estão no ar:
`buscaMouse` e `buscaMause` no beat da busca, `buscaV2` como passo 1 de
"O acabamento". Convertidos a webp q92, 1600px de largura, proporção
real declarada no `ar`.

**Falta só o `popup`** (a V2 mostrando o pop-up depois de 15% de
rolagem). O passo "A chegada" do módulo "O acabamento" está **oculto**
(comentado em `data.jsx` e `i18n.jsx`, com a nota `PENDENTE` no lugar), e
o módulo diz "oito correções" enquanto isso. Quando o print chegar:

1. Salvar como `volume/assets/projetos/pcyes/busca-popup.webp` (ou
   similar), boa qualidade, e apontar o `src` na figura `popup` de
   `data.jsx` com o `ar` real do arquivo.
2. Descomentar o passo "A chegada" em `data.jsx` E em `i18n.jsx`.
3. Voltar "oito" para "nove" no título e no corpo do módulo, nos dois
   idiomas.
4. `npm run build`, conferir a régua com 9 traços, commit.

A âncora de `decisoes` sobre o pop-up continua no ar: é argumento, não
prova. E o achado do mapa de calor (182 cliques fechando) idem.

## 1b · Os dados do capítulo · **trocados em `3e7dda7`, com um número a conferir**

Os números saíram da amostra de 3 dias do Clarity e passaram a vir do GA4
do trimestre (166.267 sessões). O Clarity **não saiu**: ficou com o mapa
de calor e a gravação, que é o que ele mede bem. Usar cada ferramenta no
que ela mede é parte do argumento.

O funil mudou a conclusão do capítulo. A amostra dizia "de 63 que entram,
uma chega ao checkout" e apontava para o checkout; o trimestre mostra que
quem chega lá converte a **25%** (223 de 896) e que o gargalo está um
passo antes, em transformar quem abre um produto em quem põe no carrinho
(de 62, uma). É o que a V2 ataca com o botão de comprar no card e na
visualização rápida.

**O número a conferir, e é com o Gabriel:** o funil **sobe** de 808
(`add_to_cart`) para 896 (`begin_checkout`). Há nota no `data.jsx`
explicando por compra rápida e carrinho recuperado, o que é plausível,
mas se a marcação de `add_to_cart` estiver furada o dado está errado e é
o tipo de coisa que um avaliador atento pergunta. Vale validar no GA4.

**Decisões fechadas aqui, não relitigar:**

- o mix desktop/mobile publicado é **70/30 do Q2** (116.530 contra
  50.352). O bruto de 12 meses dá 73,6/26,2, mas junho e julho têm um
  pico de desktop que cheira a tráfego não humano.
- a nota do suporte fala **só de desktop**. Ela já teve uma versão
  argumentando a favor do celular (conversão 0,17% contra 0,14%) e isso
  se contradizia com a própria função do bloco, que é justificar prints
  de desktop. O dado do celular existe e é real, mas não é ali que entra.
- **as logos do GA4 e do Clarity não podem ser usadas.** A política da
  Microsoft é explícita ("our logos, app and product icons... can never be
  used without an express license") e a do Google só abre exceção para
  matéria jornalística e material didático. Citar o **nome em texto** é
  uso nominativo e é permitido nas duas. Os selos ao lado das linhas de
  fonte são desenho próprio (`SeloFonte` em `Capitulo.jsx`), e é para
  continuarem assim.

## 2 · Os outros quatro capítulos · **o desequilíbrio que sobrou**

O volume hoje é um capítulo de quase 18 minutos ao lado de quatro entre
1,6 e 4,2 (ver a tabela acima; `minutos: 18` no `data.jsx` continua
honesto, a medição dá 17,7).
Cada um dos quatro mostra **3 a 5 telas de projeto**. Para portfólio de
UI, isso é pouco, e o Grupo B já deu a régua a eles (a `solucao` a
1033px, com zoom).

**Isto não se resolve cortando o PCYES**, e essa decisão está fechada: o
problema é falta de atalho, não excesso de argumento, e o atalho existe
desde `1ab1e88`. Resolve-se engordando os outros, e isso depende de
material que o Gabriel tem.

Aberto e não decidido: **quanto** engordar, e com o quê. Uma referência
honesta: se cada um chegasse a 8 ou 10 telas de projeto, o volume deixava
de ter um capítulo e quatro apêndices.

**O que já herdaram de graça e não precisa refazer:** a régua de escala, o
zoom, a curva única de motion, os degraus de medida tipográfica, a virada
de ato no `Respiro` (odex e locarmais mostram 3 atos, oderco e portfolio
mostram 2, porque o marcador vem de `indiceDo` e ato sem seção some).

**O que NÃO herdaram, de propósito:** o `Atalho`. Ele só aparece em
capítulo com `minutos` declarado no `data.jsx`, e só o PCYES tem. Um
atalho de 3 minutos num capítulo de 3 minutos seria mentira. Se algum
capítulo passar de uns 8 minutos, declare `minutos` nele **com o número
medido** e o atalho aparece sozinho.

## 3 · O ritmo no mobile · **fechado em `030b1c3`, com uma ressalva**

A rodada foi feita e o mobile encolheu 1,7 tela em 390 e 1,9 em 768, com
o desktop intacto (33.989px nos dois builds, byte a byte). O que sobrou
está no item 3b abaixo.

**O diagnóstico anterior deste arquivo estava pela metade.** Ele dizia
"não sobra vão morto para cortar, o problema é ordem, não espaço". A
medição mostrou que era espaço também, em dois lugares que ninguém tinha
olhado:

- a escala `--ma-*` era a mesma em 390 e em 1440. O respiro de 104px
  entre dois beats foi calibrado para uma coluna de 1040px e estava sendo
  aplicado a uma de 350px: dezenove beats somavam 1.976px. Os três
  degraus grandes agora encolhem sob 880px (`--ma-5` 64→40, `--ma-6`
  104→56, `--ma-7` 160→80). Os pequenos não mexem: são padding dentro de
  componente e apertariam texto contra moldura.
- o vão entre provas do `ModuloPassos` estava pagando por um mecanismo
  **desligado** no celular. O gap grande existe no desktop para dar tempo
  do texto trocar na coluna presa; sob 880px `passos-cola` é `static`,
  `passo-vivo` e `passo-regua` somem e cada passo já carrega o próprio
  texto. Virou `--ma-4`.

**A parte de "ordem" continua de pé e não foi tocada**, e é o que resta:
sem as duas colunas, texto e prova viram uma pilha só. A pergunta é de
sequência, e ela segue aberta.

## 3b · As imagens horizontais no celular · **levantado, não resolvido**

Em 390 a coluna mede 350px e as imagens ocupam 344px, que é o certo para
a largura. O problema é a altura: são prints de tela **desktop**, então
em 390 cada um vira uma faixa baixa e larga onde não se lê interface
nenhuma. A lupa resolve para quem toca, mas o primeiro contato é a faixa.

As duas saídas conhecidas são recortar cada print para o trecho que
importa, ou deixar a imagem rolar na horizontal dentro da moldura. As
duas mexem em 27 imagens e nas duas quem decide o enquadramento é o
Gabriel: **não fazer por conta própria.**

## 4 · Duas decisões visuais que continuam com o Gabriel

1. **Sangrar o clímax da `solucao` em `100vw`.** A abertura da V1 é uma
   `CenaScroll` que abre em 82% da tela (perto de 1180px) e o clímax da V2
   para em 1033px. Para empatar de vez, as telas da `solucao` teriam que
   sangrar em `100vw` como a cena da V1 sangra. É o que segura a nota de
   "apresentação do design" em 7,5 e não em 9. Não foi feito por conta
   própria, e continua não sendo.
2. **O piso tipográfico.** Depois da Rodada A nada ficou abaixo de 12px
   (eram 133 elementos). Restam 264 elementos entre 12 e 14px. Subir o
   piso para 13px é possível e mexe em `app.css`, `chapter.css` e
   `kit.css`. Não é urgente e ninguém reclamou.

## 5 · As três miudezas que o Grupo A deixou abertas

- **28 Tabs até o atalho.** Ele vem depois do `IndiceCapitulo`, que tem 15
  links, na ordem do DOM. Quem navega por teclado já tem o índice como
  atalho, então não bloqueia. Mover o `<Atalho>` para antes do
  `<IndiceCapitulo>` faria um leitor de tela ouvir o custo antes do
  índice, mas o `Atalho` mora dentro do `.chapter-col`, sob o `Tldr`, e
  tirar de lá mexe no layout.
- **Os seis `<div style={{ height: "var(--ma-6)" }}>`** do Ato IV, em
  `Capitulo.jsx`. Funcionam (dão ar depois do clímax) mas são espaço
  escolhido na mão dentro do JSX, que é a mesma classe de problema que o
  `gap: 26vh` era. Viraram alvo natural de uma classe com nome.
- **`rec-r` a 40 caracteres por linha**, abaixo da faixa de 45 a 75. É
  **exceção declarada em comentário no CSS**: são três recusas em três
  colunas, e alargar exigiria desfazer o trio. Só mexa se desfizer a
  composição de propósito.

## 6 · Opcionais, e nenhum deles é urgente

- **Antes/depois de um componente real:** card de produto da V1 ao lado
  do da V2. Não há documentação de token da V1, então o enquadramento
  honesto é "a V1 não tinha sistema". **Não inventar número.**
- **Quais artefatos do FigJam mudaram uma decisão.** A resposta é do
  Gabriel. O critério **não se relitiga**: o artefato entra só se mudou
  uma decisão, e entra junto da decisão que mudou. Os que não entram viram
  **uma figura só** em `investigacao` (vista do FigJam inteiro), com
  legenda que argumenta ("dez artefatos antes da primeira tela"). **Não
  despejar os 10.**
- **Print do Traxium** (ele tem em casa) e **logo do IMMO**
  (`logo: null` em `data.jsx`).
- **Quirk pré-existente, fora de escopo:** ao navegar para um capítulo a
  partir de uma posição rolada, a pill do nav começa escondida até rolar
  para cima. O Nav é comportamento sensível.

---

## Como medir, sem reescrever nada

A instrumentação está no repo desde `1604128`, em **`tools/medir.mjs`**.
Ela acha o Playwright sozinho (o hash do cache do npx muda por máquina) e
já vem com as receitas que custaram retrabalho para descobrir.

```bash
npm run build
cd dist && python3 -m http.server 8793 --bind 127.0.0.1
cd -
node tools/medir.mjs beats       # custo de cada batida, com barra de pulso
node tools/medir.mjs cpl         # caracteres por linha REAIS, via Range
node tools/medir.mjs reveal      # painel que nunca acende
node tools/medir.mjs passos      # a troca do ModuloPassos lê limpo?
node tools/medir.mjs regressao   # viewports, oito rotas e axe
node tools/medir.mjs diff 8794 8793   # antes contra depois

ROTA=odex node tools/medir.mjs beats   # qualquer capítulo
npm i --no-save axe-core               # o axe não é dependência do site
```

**Guarde a baseline antes de mexer:** copie o `dist/` atual para outro
lugar e sirva numa segunda porta. Comparar contra memória não vale.

---

## Armadilhas que já morderam · leia antes de mexer em CSS ou reveal

- **`useReveal` já quebrou por altura lida no mount** (`cdd318f`). O
  gatilho depende de `offsetHeight`, que no mount é quase sempre 0
  (imagem sem carregar, fonte sem trocar). Com altura 0 a proteção para
  elemento gigante não ativava e um beat de 3.000px exigia 660px de si na
  tela: rolando rápido, **3 beats e 9 figuras** nunca revelavam em 1440 e
  **7 e 10** em 390, aparecendo só quando o leitor subia. Hoje a altura é
  lida ao observar, um `ResizeObserver` religa quando ela muda e quem
  passou batido conta como visto. **Ao mexer ali, meça rolando rápido**
  (salto de 1400px por frame), não devagar: em passo lento o bug não
  reproduz.
- **Nome de classe colide entre `app.css` e `chapter.css`**, que entram
  concatenados no mesmo arquivo. `.db-n` e `.db-v` já eram do `.dec-beat`
  e puseram a legenda de um bloco novo em **83px de Cinzel**, com build
  verde. Antes de criar um prefixo curto, `grep` nos cinco CSS.
- **`height: %` numa barra pendurada direto em flex-item resolve contra
  `auto`**: duas barras de 100% e 70,6% saíam do mesmo tamanho. Precisa
  de uma faixa com altura própria em px.
- **Superfície vermelha usa cores literais**, nunca `--paper`/`--ink`: o
  modo tinta inverte esses tokens e põe tipo quase preto sobre o vermelho.
  E o `--vermilion` (#E4231B) **reprova em AA** com creme (4,16, mínimo
  4,5); quem passa é o `--vermilion-ink` (#B01510), com 6,40.
- **`ContaAte` devolve um `<span>`**: sufixo escrito fora dele fica solto
  e quebra para a linha de baixo. Use a prop `sufixo`.
- **O i18n substitui o ramo inteiro** (`Object.assign` raso). Campo
  numérico e de layout tem que viajar dentro do objeto EN, senão some em
  inglês com build verde. Já mordeu em `figuras`, em `gesto`/`busca` e no
  `funil`.

## O que parece pendência e NÃO é · não procurar de novo

- **As 6 imagens sem lupa são o antes/depois.** É slider, está a 976px, e
  é assim de propósito. As outras 21 abrem em tamanho cheio.
- **Nenhuma figura está órfã.** A figura `marca` é a régua do funil,
  consumida por `Funil` via `dados.marca`.
- **Os `[assim]` não renderizam.** Moram só em `synthChapter`, o fallback
  de projeto sem capítulo autoral, e os cinco `CASE_IDS` têm capítulo.
  É código morto.
- **Nenhuma imagem está sem `alt`.** Os dois `bp-logo` têm `alt=""` dentro
  de `<span aria-hidden="true">`, que é o padrão **correto** para imagem
  decorativa. Varredura que conta string vazia como ausente dá falso
  positivo aqui.
- **Contraste está resolvido.** 0 violação real. As duas que uma varredura
  acusa são os kanji decorativos em `rgba(0,0,0,0)`.
- **`calendario` não é beat.** É desenhado dentro de `Resultado`, no slot
  de arte (`c7`).
- **`ChapterBlock` / `ChapterList` em `Capa.jsx` são código morto.** Quem
  desenha a lista de capítulos da home é `RevealImageMask` /
  `RevealChapters` em `RevealMask.jsx`.
- **O `.view` é CSS órfão.** A regra foi corrigida em `4e3b79e` mas o
  elemento não existe mais no DOM.
- **As 3 figuras que uma varredura acusa como "sem revelar" não são
  figuras.** São os `<span className="fig">` de altura 0, que não usam
  `useReveal`. As `<figure>` de prova revelam todas, medido rolando até o
  fim.
- **A ordem do Ato II não se mexe.** `gesto` termina em "foi o que mandou
  olhar para a busca" e `busca` abre em "o mapa de calor dizia". A
  sequência está soldada no copy de propósito, e isso foi verificado.
