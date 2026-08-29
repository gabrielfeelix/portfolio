# Handoff: a V2

Reescrito em 2026-08-29. Substitui a versão de 28/08. Cole isto numa sessão
nova e não traga a antiga junto.

## Antes de tudo

1. Invoque a skill `token-hygiene` e siga na tarefa inteira.
2. Leia só: este arquivo, `docs/PENDENCIAS-V2.md` e `docs/ANALISE-REFS.md`.
3. Não vasculhe transcript. O que é verdade está no repo e no `git log`.

## Onde está

Repositório `/home/gabfelix/dev/portfolio`, branch **`main`**, em dia com o
`origin`.

**A V2 está no ar**, em `4yu.com.br/v2`, desde `990e853`. O `vercel.json` roda
o build com `BUILD_V2=1` e reescreve `/v2` e `/v2/*` para `dist/v2/index.html`,
antes do coringa que manda todo o resto para a V1. Sem essa primeira regra,
`/v2/case/pcyes` cai na home da V1.

A V1 continua sendo a home de `/` e não mudou: comparados os md5 dos 165
arquivos de produção com e sem a flag, zero diferença. A V2 só acrescenta
arquivos dentro de `dist/v2/`.

## Como rodar e conferir

```bash
BUILD_V2=1 npm run build
cd dist && python3 -m http.server 8793 --bind 127.0.0.1   # home em /v2/
```

O servidor não faz fallback de rota: `/v2/case/pcyes` dá 404. Abra `/v2/` e
clique num card, que é o que os scripts de verificação fazem.

**Portão, antes de dizer que está bom:** axe 0 em 1440 / 1280 / 390, zero erro
de JS, zero overflow horizontal, reduced-motion sem dobra invisível, e as
quatro páginas de caso abrindo. Tudo isso passa em `193096f`.

Espere **3 segundos** depois de rolar antes de rodar o axe: com menos, as
entradas ainda estão correndo e o axe acusa contrastes reprovados que não
existem. `npm i --no-save axe-core`.

Playwright: não tem caminho fixo, descubra como `tools/home-v2.mjs` faz.

## O que foi feito em 29/08

Tudo commitado e no ar. Não refaça nada disto sem pedir.

- **As quatro capas dos casos são arte pronta**, sangrando no quadro, em
  `v2/copy.js` → `CAPAS_CHEIAS`. Some a chapa de cor, o degradê, a marca no
  canto e a tela flutuante. O mapa mora na V2 de propósito: `volume/data.jsx`
  é o arquivo que a V1 publica e não pode mudar por um campo que só a V2 lê.
  Formato do cartão: **16/11**, e o cartão renderiza no máximo 848x583, então
  a arte alvo é 1696x1166.
- **Hover na capa cheia:** zoom de 3,5% em 900ms. Ela só escala, não sobe: quem
  sobe 8px é a tela flutuante, que é objeto pousado numa chapa.
- **A dobra 05 virou coluna presa** (`Presa`, no kit): cabeçalho parado à
  esquerda com a marca da empresa que está na altura da leitura, empresas
  rolando à direita. A marca troca sozinha e vem em cor, por `LOGOS_COR` em
  `v2/copy.js`. Quem não tem arquivo entra em wordmark, que é o caso da TT&T.
  Em `motion.js` entrou `useNaAltura`, IntersectionObserver com faixa de
  decisão no meio da janela.
- **A escala tipográfica anda na grade.** Espaço e display de 8 em 8, texto
  pequeno no meio-degrau de 4. Cromo 12, corpo 16, lead 24, hero 144. E a
  escala deixou de ser fluida: `clamp` com `vw` interpola e servia 97,92px e
  21,6px. Agora são degraus fixos com quatro pontos de virada (560, 900, 1280,
  1600) que valem para a escala inteira.
- **O hero da página de caso é a capa em tela cheia**, com véu diagonal, e o
  mockup 4:5 que ficava ao lado do título saiu. Contraste medido do branco
  contra cada arte, no pior ponto: PCYES 11,50:1, ODEX 7,01:1, Locar Mais
  6,09:1, Oderço 4,96:1.
- **Parallax na capa do caso**, 80px na primeira tela, e no celular a capa
  vira faixa no alto em vez de fundo.

## O que fazer agora

`docs/PENDENCIAS-V2.md` tem as nove frentes ditadas por ele, com o que está
aprovado e o que está morto anotado junto. As mais urgentes, na ordem dele:

1. a dobra 04 (método), aberta desde a terceira recusa;
2. o design da página de caso, que ele chama de "jogado";
3. as capas dedicadas por caso, que dependem de ele gerar a arte.

## Decisões fechadas, não reabra

- **Grafismo desenhado está morto.** Traço, laço, moldura, campo de pontos:
  "odiei esses traços". A dobra 04 se resolve com componente, tipografia ou
  foto, nunca com desenho.
- **O quiz clicável saiu** e não volta. "Vergonhoso", palavras dele.
- **Ilustração de conceito, uma por passo, saiu.** "Forçado".
- **O avião vermelho está aprovado e ele amou.** Não mexa sem pedir.
- **A revelação por desfoque da dobra 01** está aprovada: "amei, amei mesmo".
- **A coluna presa da dobra 05 está aprovada:** "eu ADOREEEEEEEEEEEEEEI".
- **Assinatura: Bad Script**, monolinear. A Ephesis foi recusada. Continua
  placeholder até o SVG dele chegar.
- **Gravação de tela é assunto de página de caso, não da home.**
- **"2+ Anos em produto"** a 128px na dobra 03: item 2 de
  `docs/PENDENCIAS-TEXTO.md` diz que o número argumenta contra ele em vaga de
  pleno. Ele sabe do argumento e ainda não decidiu.

## Arquivos

```
v2/Home.jsx          dobras da home; Processo() é a dobra 04, OndeEstive() a 05
v2/Case.jsx          a página de caso; CasoHero() é a capa em tela cheia
v2/Kit.jsx           gramática: Dobra, Cromo, Cabecalho, Titulo, DuasCores,
                     Presa, Quebra, Contador
v2/motion.js         primitivas; useVoo (avião), usePalavra, useNaAltura
v2/copy.js           textos, CAPAS_CHEIAS, LOGOS_COR
v2/tokens.css        escala em degraus, cores, espaço
v2/home.css v2/case.css v2/kit.css v2/shell.css
docs/PENDENCIAS-V2.md  as nove frentes abertas
docs/ANALISE-REFS.md   a base de direção, não é opcional
```

## Armadilhas que custaram tempo

- `npm run build` **não** emite `dist/v2/` sozinho. Use `BUILD_V2=1`.
- `dist/` é apagado inteiro a cada build. Arte nova entra em `uploads/` na raiz
  e depois em `volume/assets/`.
- `overflow` diferente de `visible` num `<svg>` **zera o IntersectionObserver
  dos filhos**: `whileInView` nunca dispara e nada aparece, sem erro no
  console. Mesma coisa com `overflow: hidden` em qualquer ancestral.
- **Parallax não funciona com `useScroll({ target })` dentro de seção
  `sticky`**: a caixa para de andar em relação à janela e o progresso congela.
  No hero do caso o parallax sai da rolagem da página inteira.
- **`align-self: start` é obrigatório na coluna presa.** Numa grade o filho
  estica para a altura da linha, e um bloco esticado não tem para onde grudar:
  o `sticky` simplesmente não faz nada.
- `clipPath` e valor dentro de `mask-image` não interpolam por `whileInView` no
  motion v13. Use `useInView` + `animate`.
- Meça posição com `offsetLeft`/`offsetTop`, não `getBoundingClientRect`, se o
  elemento tem animação de entrada com `translate`.
- `offset-distance` anda em **comprimento de arco**, não em altura. Ver a
  tabela em `useVoo`.
- Antes de criar classe, `grep` o nome: `.v2-marca` já existia e o
  `padding-inline` dela vazou para um svg novo.
- `pkill -f chromium` mata o próprio shell. Use `pkill -f "[h]eadless_shell"`.
- **NUNCA commitar `empresas-para-o-portfolio.md`.** Tem salário e o repo é
  público. Já vazou uma vez. Está no `.gitignore`, confira o `git status`
  assim mesmo.

## Regras de conteúdo

- Zero travessões (—) em texto do site. Dois-pontos, vírgula ou ponto; em
  título, "·". Em comentário de código pode.
- Não invente número, resultado nem história de emprego. Sai de
  `volume/data.jsx` e do GA4.
- Paleta: branco, preto, vermelho e cinza. Cor de produto tem dois lugares e só
  dois: a chapa do quadro do caso e a chapa da empresa atual.
- Raio 0 em tudo, com uma exceção declarada: os 10px da tela flutuante dentro
  do quadro do caso, que é o desenho de uma janela de navegador.
- Tamanho de fonte na grade: múltiplo de 4, e de 8 no display. As duas exceções
  declaradas estão comentadas no CSS (o `®` do título e a amostra de escala da
  página de caso, onde o tamanho é conteúdo).
- Commits em português, no tom dos anteriores, terminando com
  `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.

## Como ele decide

Por comparação de print, nunca por descrição. É designer, fala português. Se
mudar algo visual, mostre. Para movimento, print não basta: mande a URL local e
um filmstrip de quadros. Quando houver mais de um caminho possível, monte um
artefato com as versões lado a lado, no tipo e na paleta do site: foi assim que
a dobra 05 saiu do lugar depois de três recusas.
