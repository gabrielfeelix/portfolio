# O blog: como publicar, e por que ele é assim

Escrito em 2026-08-29, quando o blog entrou. Vale como manual e como registro
de decisão. Método do repositório: cada afirmação aqui tem número medido, no
código das referências ou no nosso.

## Como publicar um texto

Três passos, e nenhum deles mexe em JavaScript.

**1. O arquivo.** Um `.md` em `conteudo/blog/`, com data no nome:

```
conteudo/blog/2026-09-02-por-que-o-print-mente.md
```

O prefixo de data existe só para a pasta ficar em ordem no editor. Ele **não
entra na URL**: esse arquivo responde em `/blog/por-que-o-print-mente`.

**2. O frontmatter.** O bloco entre `---` no topo:

```
---
titulo: Por que o print mente
data: 2026-09-02
tag: oficio
resumo: Um print prova que a tela existe. Não prova que ela funciona.
capa: capa.webp
capaAlt: Print de um dashboard com dados de demonstração
formato: normal
destaque: true
publicado: true
---
```

| campo | obrigatório | o que faz |
|---|---|---|
| `titulo` | sim | |
| `data` | sim | `AAAA-MM-DD`, e o build recusa outro formato |
| `tag` | sim | `oficio`, `bastidor` ou `carreira` |
| `resumo` | sim | duas linhas; aparece no card, no hover e na prévia de link |
| `capa` | não | nome do arquivo dentro da pasta do post |
| `capaAlt` | não | cai no título se faltar |
| `formato` | não | aceito e **ignorado** desde 01/09; ver abaixo |
| `destaque` | não | aceito e **ignorado** desde 01/09; ver abaixo |
| `publicado` | não | `false` = escrito e fora do ar; aparece só em `npm run dev` |

**Não existe campo de tempo de leitura.** Ele é contado no build por palavra,
a 200 por minuto. O site só serve número medido, e um "5 min" digitado à mão
seria a única exceção.

**3. As imagens.** Em `volume/assets/blog/<slug>/`:

```
volume/assets/blog/por-que-o-print-mente/capa.webp
volume/assets/blog/por-que-o-print-mente/01.webp
```

No texto, o nome solto basta — `capa.webp`, `01.webp`. O prefixo é montado
sozinho. Caminho começando com `/` e URL passam intactos.

Depois: `npm run dev` para ver, `npm run build` para publicar.

## As três diretivas

Markdown comum funciona (`##`, `**negrito**`, `[link](/sobre)`, listas,
citação, código). O que ele não sabe dizer são as três formas de mídia do
site, e por isso existem três diretivas, e continuam sendo três:

```
::figura src=01.webp alt="Descrição obrigatória" largura=sangra
Legenda, opcional.
::

::margem
Vai para a coluna de 300px ao lado do texto, fora do fluxo de leitura.
Abaixo de 1281px ela volta para o corpo, com régua à esquerda.
::

::destaque
A frase que vira pull-quote.
::
```

`largura` aceita `medida` (padrão, 640px), `larga` (1240px, passa dos dois
lados) e `sangra` (de borda a borda da janela).

`alt` em `::figura` é **obrigatório** e o build falha sem ele. Imagem que
ninguém consegue ler não entra num site cujo dono desenha para gente.

## O que o build faz com isso

`blog.mjs`, chamado por `build.mjs` antes do bundle. Sai em dois artefatos:

| artefato | o que tem | por quê |
|---|---|---|
| `site/posts.gerado.js` | o índice, sem o corpo | entra no bundle: a listagem precisa de tudo para filtrar e buscar sem ida ao servidor |
| `dist/conteudo/blog/<slug>.json` | o corpo de um post | buscado quando alguém abre aquele post |

Junto, o corpo de todos os posts no bundle faria a home carregar artigo que
ninguém pediu, e cresceria para sempre.

`site/posts.gerado.js` é gerado a cada build e está no `.gitignore`. Não
edite: edite o `.md`.

### A pasta é `/conteudo/blog/` e não `/blog/`

Medido em 29/08: com os JSONs em `dist/blog/`, a rota `/blog` passou a
devolver **302** — o servidor via um diretório com aquele nome e redirecionava
para `/blog/` antes de qualquer fallback de SPA. A listagem inteira sumia
atrás de um redirect. Dado e rota não dividem endereço.

## A forma de 01/09: dois em dois, sem capa grande

Pedido do Gabriel, com uma quarta referência:
`~/dev/refs/taylordesigner.framer.website` (blog e um post). O que mudou:

- **A capa de destaque saiu.** A listagem abria com um post ocupando a janela
  inteira (100vw por 2.0), e ele não quis "uma capa muito grande para um
  post". A página abre direto na grade. O campo `destaque` continua sendo
  lido para nenhum `.md` quebrar, mas não faz nada.
- **A grade é de dois em dois**, simétrica, como a fileira de casos da home.
  Medido na referência: `repeat(2, minmax(50px, 1fr))` com 20px de vão, e
  card de 500 por 368 de capa (1.36). Aqui a capa é **3:2**, a proporção em
  que o arquivo é servido, então o card mostra a foto inteira. O `largo` saiu
  junto (o campo `formato` também é lido e ignorado): grade simétrica não tem
  onde pôr um card de duas colunas sem abrir buraco.
- **O hover é só o zoom da capa** (1.035 em 900ms, o mesmo da capa cheia dos
  casos na home). O véu escuro com o resumo por cima saiu; o resumo mora
  embaixo do título, em duas linhas, onde é lido em vez de adivinhado.
- **A abertura do post é alinhada à esquerda**, título grande e resumo como
  subtítulo, com a capa larga dentro da dobra em 16:9 (3:2 no celular). Era
  centrada, com a capa sangrando a janela a 72vh.
- **O fim do post usa os mesmos dois cards da listagem**, com capa. A
  referência fecha o artigo com "Next Article" e duas capas; o cartão só de
  texto que ficava ali não se parecia com nada que o leitor tivesse visto.

O card e a capa moram em `site/PostCard.jsx`, porque agora são usados em duas
páginas.

O que ficou de fora, de propósito: o corpo do post da referência não é uma
coluna só (imagem pequena à esquerda com texto à direita, imagem larga, texto
encostado à direita, frase grande). Fazer isso aqui pede uma diretiva nova no
markdown e reescrever os três posts com ela. Fica para quando houver imagem
própria para pôr nesses lugares.

## As decisões de desenho de 29/08, e o que foi medido

Boa parte do que está abaixo foi substituído em 01/09 (grade, destaque,
abertura do post). Fica como registro do que foi tentado e por quê.

Referências usadas: `viper-template`, `bungee`, `launchfolio`, em
`~/dev/refs`. A `isabella-pires` **não** é referência deste site.

| | viper | bungee | launchfolio |
|---|---|---|---|
| grade | 3 col | 3 → 2 → 1 | 3 → 2 |
| capa | `aspect-ratio: 1` | 1, 0.699, 1.152 | 1, 1.333, 1.778 |
| card | img → título → data → tag | img → data → título | img → título → data → autor → resumo |
| destaque | não tem | não tem | carrossel |
| filtro | não tem | não tem | pills de categoria |
| busca | **nenhuma das três tem** | | |
| medida do post | 809px | 809px | 580px |

**A busca não foi copiada de lugar nenhum**, porque não havia de onde. Ela é
uma régua de 1px com rótulo na mono, que é como o resto do site marca o que
está ativo.

**Proporção variando por card foi tentada e reprovada.** A ideia era imitar o
bungee, que serve 1, 0.699 e 1.152 na mesma página. Numa grade de três
colunas alinhadas não funciona: a linha tem a altura do item mais alto, e um
retrato ao lado de dois quadrados abriu dois buracos de ~180px a 1440. A
variação que sobrou é `largo`, que ocupa duas colunas das três com a capa em
2.1 — 894px de largura por 2.1 dão 426px de altura, a mesma dos quadrados ao
lado, e a linha fecha sozinha.

**A coluna de leitura mede 720px e é CENTRADA.** A primeira versão usava os
640px da página de caso, encostados na goteira esquerda, e deixava 680px de
branco morto à direita numa página de 1360. Reprovado por print em 29/08, e com
razão: aquilo não lia como decisão de espaço, lia como componente que ninguém
posicionou. A página de caso pode usar 640 encostado porque ela tem coluna de
rótulo à esquerda disputando a largura; o post é só texto. A 720px com corpo de
16px, o parágrafo fica em ~78 caracteres por linha.

A abertura do post (ficha, título e resumo) é centrada; o corpo é centrado como
bloco e alinhado à esquerda como texto, que é o único jeito de ler prosa longa.

**Sem barra de progresso.** Ela saiu da página de caso em `88c355e` por
decisão do Gabriel, e não volta pela porta dos fundos só porque a página é
nova.

**Post sem capa não vira card mutilado.** Ele cai na chapa escura com o
assunto na mono e o número em display, a mesma resposta que `/processo` dá para
passo sem print honesto.

**A capa é servida em 3:2, 2400×1600, e isso não é gosto.** É a única proporção
que sobrevive aos TRÊS recortes que o site aplica no mesmo arquivo: 1:1 no card
da grade, 2.1 no card largo e 2.0 no destaque. Todos partem do centro, então o
assunto tem que estar no meio do quadro.

O destaque nasceu em **2.4** e foi corrigido para **2.0** em 29/08: num frame de
2.4 o corte come 37% da altura de uma foto 3:2 e o assunto começa a sair pela
borda; em 2.0 come 25%. Faixa larga só compensa quando a imagem foi feita para
ela — servir 3:2 dentro de 2.4 é pedir para a foto quebrar, e foi o que
aconteceu.

**As capas são foto de banco, e a primeira tentativa não era.** Os três posts
estrearam com capa em SVG: gráfico do dado de cada texto, desenhado na paleta do
site. Reprovado por print. Dois motivos, e os dois são reais: diagrama tem texto
perto da borda, então todo recorte cortava palavra pela metade, e três chapas de
gráfico seguidas na grade leem como slide de relatório, não como blog. Foto
aguenta corte porque não tem informação nas bordas. Origem e tratamento em
`volume/assets/blog/CREDITOS.md`.

## Filtro e busca aparecem por contagem

Decidido com o Gabriel em 29/08. Os dois existem no código desde o primeiro
dia, mas só aparecem quando têm o que fazer:

- **filtro**: a partir de **5 posts** e ao menos **2 tags**
- **busca**: a partir de **8 posts**

Barra de busca sobre três posts é moldura, e moldura vazia é exatamente o que
faz uma página parecer template. Passados os números, a barra nasce sozinha,
sem segunda obra. Os limites moram em `site/blog.js`, em `MIN_FILTRO` e
`MIN_BUSCA`.

## O menu do celular

Entrou junto, como pré-requisito. Abaixo de 860px a nav escondia os três links
(`.v2-nav-links { display: none }`) e não existia caminho para `/processo`,
`/sobre` ou `/blog` a não ser digitar a URL. Não era regressão — era como a V2
sempre esteve — e virou bloqueio quando o blog entrou, porque texto longo se
lê no telefone.

Hambúrguer à direita, na mesma fileira de "Gabriel Felix". O painel é chapa
escura de borda a borda, com os links numerados na mono, e-mail, social e
carimbo. A numeração é o mesmo `Cromo` que abre toda dobra: bungee numera o
menu (`( _01 ) Home`) e viper faz o mesmo do outro lado (`Home 01`), então o
menu não estreia vocabulário nenhum.

O pill "Falar comigo" sai da barra no celular e vira o e-mail no pé do menu:
dois caminhos para a mesma coisa dentro de 390px era o que fazia a barra
parecer cheia sem oferecer navegação.

## Portão de qualidade, medido em 29/08

- `axe` **0** em `/blog` e `/blog/<slug>`, a 1440 e 390, e com o menu aberto
- `axe` **0** sem regressão em `/`, `/processo`, `/sobre` e `/case/pcyes`
- **zero** overflow horizontal nas quatro telas
- zero erro de JS além de `/_vercel/*`, que é 404 esperado fora da Vercel

Duas coisas que o axe pegou e foram corrigidas: a listagem não tinha `h1`
(o `Titulo` do kit ganhou a prop `como`), e o índice mono do menu estava a 45%
de branco sobre `#0B0B0C`, que reprova em 12px — passou para 60%, que dá
7.06:1.

## O que falta

- **imagem própria.** As capas de hoje são foto de banco, que é solução de
  partida. O que separa esta listagem de um blog qualquer é capa que só este
  site poderia ter: gravação de tela do protótipo, recorte de uma tela real,
  foto do trabalho acontecendo.
- **`og:image` por post** já é trocado em `site/app.jsx`, mas só quando o post
  tem capa. Sem capa, a prévia de link cai na imagem da home.
