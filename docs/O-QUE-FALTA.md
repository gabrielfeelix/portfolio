# O que falta no volume

> Escrito em 2026-08-26, sobre `1604128`, com tudo medido na página
> servida em 1440x900 depois de rolar a página inteira. Este é **o**
> arquivo de pendência: a seção "Pendente" do `docs/HANDOFF.md` aponta
> para cá.
>
> Leia junto, e nesta ordem: `docs/HANDOFF.md` (arquitetura, regras duras,
> armadilhas), este arquivo (o que falta), e só se precisar do histórico,
> `docs/AUDITORIA-PCYES-2026-08-26.md` e `docs/GRUPO-A-RITMO.md`.
>
> **Não vasculhe transcript de conversa.** A resposta está no repo, sai de
> `git log`, ou é pergunta para o Gabriel.

---

## Onde o volume está hoje

| Capítulo | Altura | Telas | Palavras | Leitura | Imagens | Com zoom |
|---|---|---|---|---|---|---|
| **pcyes** | 36.812px | 40,9 | 3.593 | **18,0 min** | 27 | 21 |
| locarmais-conciliacao | 13.249px | 14,7 | 1.012 | 5,1 min | 4 | 4 |
| portfolio | 11.373px | 12,6 | 565 | 2,8 min | 5 | 5 |
| odex | 10.563px | 11,7 | 640 | 3,2 min | 4 | 2 |
| oderco-revenda | 10.495px | 11,7 | 689 | 3,4 min | 3 | 3 |

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

## 2 · Os outros quatro capítulos · **o desequilíbrio que sobrou**

O volume hoje é um capítulo de 18 minutos ao lado de quatro de 3 a 5.
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

## 3 · O ritmo no mobile · **a frente que ninguém abriu**

Todo o Grupo A foi medido em 1440. No celular a conta é outra e é pior:

| | 390x844 | 1440x900 |
|---|---|---|
| Altura do PCYES | 40.779px | 36.812px |
| **Telas de rolagem** | **48,3** | 40,9 |

Os beats mais altos em 390, medidos: `modulos` 13.007px (15,4 telas),
`sistema` 4.214px (5,0), `decisoes` 2.396px (2,8), `abertura` 2.218px
(2,6), `solucao` 1.955px (2,3), `busca` 1.500px (1,8).

**E o problema ali é outro, não repita o remédio de desktop.** Em 390 a
coluna mede 350px, 26 das 27 imagens ocupam 344px (a coluna inteira, que
é o certo), e a calha dos passos já era `--ma-5` por media query desde
antes. Não sobra vão morto para cortar. O que existe é **ordem**: sem as
duas colunas, texto e prova viram uma pilha só, o `ModuloPassos` solta o
sticky e cada passo carrega o próprio texto acima da figura. É aí que a
próxima rodada tem que olhar, e a pergunta é de sequência, não de espaço.

O 768px ganhou só 0,7 tela na rodada do ritmo, pelo mesmo motivo, e ainda
mede 44.366px.

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
- **A ordem do Ato II não se mexe.** `gesto` termina em "foi o que mandou
  olhar para a busca" e `busca` abre em "o mapa de calor dizia". A
  sequência está soldada no copy de propósito, e isso foi verificado.
