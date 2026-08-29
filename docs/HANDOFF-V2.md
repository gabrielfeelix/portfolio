# Handoff: a V2

Reescrito em 2026-08-29, no fim do dia. Substitui a versão da manhã. Cole isto
numa sessão nova e não traga a antiga junto.

## Antes de tudo

1. Invoque a skill `token-hygiene` e siga nela a tarefa inteira.
2. Leia só: este arquivo, `docs/PENDENCIAS-V2.md` e `docs/ANALISE-REFS.md`.
3. Não vasculhe transcript. O que é verdade está no repo e no `git log`.

## Onde está

Repositório `/home/gabfelix/dev/portfolio`, branch **`main`**.

**A V2 está no ar**, em `4yu.com.br/v2`. O `vercel.json` roda o build com
`BUILD_V2=1` e reescreve `/v2` e `/v2/*` para `dist/v2/index.html`, antes do
coringa que manda todo o resto para a V1. Sem essa primeira regra,
`/v2/case/pcyes` cai na home da V1.

A V1 continua sendo a home de `/` e não mudou. A V2 só acrescenta arquivos
dentro de `dist/v2/`.

## Como rodar e conferir

```bash
BUILD_V2=1 npm run build
cd dist && setsid python3 -m http.server 8793 --bind 127.0.0.1 &
```

O servidor não faz fallback de rota: `/v2/case/pcyes` dá 404 direto. Abra
`/v2/` e navegue por `history.pushState` mais um `popstate`, que é o que os
scripts de verificação fazem.

**Portão, antes de dizer que está bom:** axe 0 em 1440 / 1280 / 390, zero erro
de JS, zero overflow horizontal, e as quatro páginas de caso abrindo. Passa em
`9091ddd`.

Espere **3 segundos** depois de rolar antes de rodar o axe: com menos, as
entradas ainda estão correndo e o axe acusa contrastes reprovados que não
existem. `npm i --no-save axe-core` (já está instalado).

Playwright: não tem caminho fixo, descubra como `tools/home-v2.mjs` faz.

**Se o gate falhar com altura 144 e 404 no console, é o servidor, não a
página.** O `http.server` do Python é de uma linha só e engasga com doze
sessões seguidas de Chromium. Mate e suba de novo com `setsid`.

## O que foi feito em 29/08

Tudo commitado. Não refaça nada disto sem pedir.

### As capas dedicadas por caso (pendência 8, fechada)

`CAPAS_CASO` em `v2/copy.js` manda no hero da página de caso; quem não estiver
lá cai em `CAPAS_CHEIAS`, que é a capa do cartão da home. Os quatro casos têm
arte própria. Formato: **16/9 em 2560x1440**, zona segura entre 20% e 85% na
horizontal e 8% e 80% na vertical, canto inferior esquerdo (45% x 40%) livre
de aparelho, porque é onde o título gigante entra.

**Como preparar a arte**, que é o que deu o ganho medido: o webp não era o
gargalo (a q86 o arquivo já estava em 40,83 dB de PSNR contra o PNG, e nem
lossless passa de 43,31, porque webp com perda faz subamostragem de croma). O
que pesava era o navegador esticando 1672px para 1883px. Receita:

```python
from PIL import Image, ImageFilter
src = Image.open('uploads/capa-pagina-X.png').convert('RGB')
c = src.resize((2560,1440), Image.LANCZOS)
c = c.filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=3))
c.save('volume/assets/projetos/X/capa-caso.webp','WEBP',quality=86,method=6)
```

Nitidez medida na vitrine dentro da tela do laptop, variância do laplaciano do
quadro renderizado: **605 antes, 1232 depois**, sem halo.

### O véu do hero de caso

A segunda camada era chapa uniforme de `.12` e cobrava o mesmo preço em cima e
embaixo. Virou degradê vertical, transparente no topo e `.16` no pé; a
diagonal abriu a ponta clara de `.30`/`.14` para `.24`/`.04`.

Contraste medido por diferença de quadro, com e sem texto, só nos pixels onde
a tinta cai, abaixo do header:

| | 1440 | 1280 | 390 |
|---|---|---|---|
| PCYES | 6,79:1 | 5,74:1 | 14,77:1 |
| ODEX | 4,89:1 | 4,95:1 | 5,41:1 |
| Oderço | 6,54:1 | 4,11:1 | 6,22:1 |
| Locarmais | 8,90:1 | 4,77:1 | 5,34:1 |

O 4,11 do Oderço são 14 pixels numa coluna só, dentro da premissa, que é de
24px e conta como texto grande: o limite ali é 3:1.

### O redesenho da página de caso (pendência 7, tratamento A)

Ver `docs/PENDENCIAS-V2.md` item 7 para o que ficou de fora. O que entrou:

- **`CapaCapitulo`** substitui `Movimento`. Chapa escura sangrando de borda a
  borda, meia tela. Sangra por **não usar `.v2-wrap`**: o pai
  `.v2-corpo-claro` já é largura cheia, então nada de margem negativa;
- **`Abas`**, peça nova, usada em `Modulos` e em `Sistema`;
- **mídia que sangra**, com a gramática por contagem descrita abaixo;
- a escala perdeu o miolo de 32px, e `--v2-t-caso-manifesto` foi removido de
  `tokens.css` por ter ficado sem nenhum usuário;
- **`OutrosCasos`** substitui `Proximo`: os outros três casos com as capas da
  home, quadro 16/11, título embaixo, zoom de hover de 3,5% em 900ms.

**A gramática de mídia, por contagem de figuras do bloco:**

| n | forma |
|---|---|
| 0 | dobra tipográfica: o número em display ocupa o lugar da imagem |
| 1 | sangra de borda a borda |
| 2 | par lado a lado, meia e meia (`.v2-figs-2`) |
| 3 | tríptico: âncora larga em cima, duas embaixo (`.v2-sol-grade`) |
| 4+ do mesmo assunto | `Abas` |
| pares antes/depois | comparador, que já existia |

Larguras de mídia: **três, e só três** (sangra, meia, terço). Antes eram cinco
no mesmo caso: 932, 559, 438, 430 e 263px.

Inventário que sustenta isso: 18 das 30 figuras dos quatro casos são 16:10,
então par e tríptico fecham sem sobra de proporção.

**Medido no PCYES a 1440: 34.182px (38 telas) → 24.737px (27 telas).**

### A barra de progresso saiu

`Progresso()` foi removido por inteiro: componente, uso, CSS e os imports
órfãos. Ele pediu.

## Arquivos

```
v2/Home.jsx          dobras da home; Processo() é a dobra 04, OndeEstive() a 05
v2/Case.jsx          a página de caso; CasoHero, CapaCapitulo, Abas, OutrosCasos
v2/Kit.jsx           gramática: Dobra, Cromo, Cabecalho, Titulo, DuasCores,
                     Presa, Quebra, Contador
v2/motion.js         primitivas; useVoo (avião), usePalavra, useNaAltura
v2/copy.js           textos, CAPAS_CHEIAS (cartão da home), CAPAS_CASO (hero
                     do caso), LOGOS_COR
v2/tokens.css        escala em degraus, cores, espaço
v2/app.jsx           roteamento, useSobreEscuro (a nav), --v2-barra
v2/home.css v2/case.css v2/kit.css v2/shell.css
docs/PENDENCIAS-V2.md  as nove frentes, com o estado de cada uma
docs/ANALISE-REFS.md   a base de direção, não é opcional
```

## Armadilhas que custaram tempo

- `npm run build` **não** emite `dist/v2/` sozinho. Use `BUILD_V2=1`.
- `dist/` é apagado inteiro a cada build. Arte nova entra em `uploads/` na raiz
  e depois em `volume/assets/`.
- **A nav observa `data-escuro-corpo`, não `data-escuro`.** Um bloco escuro sem
  esse atributo deixa a nav preta sobre chapa preta. Ver `useSobreEscuro` em
  `app.jsx`.
- **Faixa sem fundo dentro do corpo claro deixa o hero `sticky` aparecer.** O
  `Aprendi` e o `Proximo` estavam fora de `.v2-corpo-claro` e sobravam 168px e
  104px transparentes. Se um bloco tem chapa própria, ele pode morar dentro do
  corpo claro do mesmo jeito.
- **`margin-inline: calc(50% - 50vw)` não sangra de dentro de uma `Dobra`**: a
  grade já deslocou a coluna pela largura do label, então os 50% não são o meio
  da página. Deu 130px de overflow. Sangre saindo do wrap no JSX.
- `--v2-barra` (medido em `app.jsx`) existe porque `100vw` conta a barra de
  rolagem e `%` não. **Não resolva overflow com `overflow: hidden` ou `clip`
  em ancestral**: ancestral com overflow diferente de `visible` mata o
  IntersectionObserver dos filhos, e a página inteira depende de `whileInView`.
- **Esconder um `h3` por CSS deixa o `h4` seguinte órfão** e o axe acusa
  `heading-order`. Tire do DOM e promova o nível.
- `box-sizing: content-box` num elemento com `padding-inline` grande vaza no
  celular. Vazou 48px no 390.
- **Parallax não funciona com `useScroll({ target })` dentro de seção
  `sticky`**: a caixa para de andar em relação à janela e o progresso congela.
- **`align-self: start` é obrigatório na coluna presa.**
- `clipPath` e valor dentro de `mask-image` não interpolam por `whileInView` no
  motion v13. Use `useInView` + `animate`.
- Meça posição com `offsetLeft`/`offsetTop`, não `getBoundingClientRect`, se o
  elemento tem animação de entrada com `translate`. Uma figura que ainda não
  animou mede 24px fora do lugar.
- Antes de criar classe, `grep` o nome.
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
  do quadro do caso.
- Tamanho de fonte na grade: múltiplo de 4, e de 8 no display. Se um componente
  pedir um degrau novo, o degrau escolhido está errado; não falta degrau.
- Commits em português, no tom dos anteriores, terminando com
  `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.

## Como ele decide

Por comparação de print, nunca por descrição. É designer, fala português.
**Odeia resposta longa**: responda curto, com o número medido, sem repetir o
que ele acabou de ler. Se mudar algo visual, mostre. Para movimento, print não
basta: mande a URL local e um filmstrip de quadros. Quando houver mais de um
caminho possível, monte um artefato com as versões lado a lado, no tipo e na
paleta do site: foi assim que a dobra 05 e o tratamento da página de caso
saíram do lugar.

Switzer vem do Fontshare, que o CSP do artefato bloqueia. Baixe os woff2 de
`https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700` e embuta como
data URI, senão o artefato sai na fonte errada e ele não reconhece o site.
