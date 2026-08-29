# Pendências da V2

Ditadas pelo Gabriel em 2026-08-29. Atualizado no fim do mesmo dia, depois das
capas dedicadas e do redesenho da página de caso. Veredito dele sobre a home:
"já está muito bonita, muito bonita mesmo". O que está aqui é o que falta para
"nota dez barra dez".

Ordem de leitura: primeiro a home, dobra a dobra, depois as páginas internas.

## Home

### 1. Hero, a dobra 01 · ABERTA

"Extremamente simples." Falta uma capa de verdade: vídeo de fundo, uma arte
forte ou um componente trazido de referência. Hoje é tipografia sobre chapa
escura, e é a primeira coisa que a pessoa vê.

Aprovado e intocável dentro dela: a revelação por desfoque, e o avião vermelho
que nasce na dobra da tese.

### 2. Declaração partida, a dobra 02 · ABERTA

O desenho está aprovado ("gostei bastante do design disso"). O texto não: as
duas metades hoje cortam a frase no meio e a leitura se perde.

O que ele quer: **cada metade se fecha em si**. A da esquerda termina a
informação dela, a da direita entrega a dela. Duas ideias inteiras, não uma
frase partida em duas.

Arquivo: `v2/copy.js`, `DECLARACAO`.

### 3. A quebra de imagem antes de "O que já saiu da mesa" · ABERTA

A capa grande que separa os casos dos números "ainda não faz muito sentido".
A foto de banco (macro de lanterna de carro, StockSnap CC0, em upscale de 960
para 1600) saiu em 29/08. O arquivo foi apagado.

No lugar entrou arte própria: o aviãozinho de papel vermelho do próprio site,
sozinho no escuro, voando para uma luz distante. Arquivo:
`volume/assets/stock/capa-quebra-aviao.webp`, 2400x1120.

O formato é 2.14:1 e não 2.4:1 de propósito — 2.4 é a janela (`.v2-quebra`,
74vh) e `.v2-quebra-in` tem 112% de altura, então a folga vertical é o curso
do `useParallax(12)`. O fundo da janela virou `--v2-ink`, senão pisca um cinza
claro de 74vh antes da imagem `lazy` entrar. No móvel o `cover` corta pela
largura e não pela altura: em 390x844 os 52vh antigos mostravam 37% da largura
e comiam o bico do avião, então há regras em 560 e 900 que baixam a altura e
deslocam o `object-position`.

**Ainda aberta**, e por dois motivos que o Gabriel levantou em 29/08:

1. O avião apontando para a direita, no centro-superior, subindo na diagonal,
   é o mesmo desenho do `AVIAO_D` que o `CampoDeVoo` já repete em todas as
   páginas. Vira enjoativo.
2. Falta o texto e a passagem. Esta entrada sempre pediu "capa própria, com
   texto no meio, funcionando como passagem para a dobra seguinte, e não como
   banner mudo" — e a arte atual ainda é banner mudo.

Direção nova, dele: um campo de noite, com morros de grama, em duas ou mais
camadas com velocidades de parallax diferentes (profundidade real, não
translação de uma foto chapada), o avião pequeno dentro da paisagem, e uma
frase.

Atenção ao montar: isto contradiz `docs/ANALISE-REFS.md`, que prescreve
"04 quebra de imagem pura, sem texto". Esta entrada é de 29/08 e a ANALISE-REFS
é de 28/08, então esta manda; mas a ANALISE-REFS precisa ser corrigida junto,
senão as duas ficam brigando.

### 4. Método, a dobra 04 · ABERTA, terceira recusa

Ele viu cinco tratamentos no artefato de comparação e escolheu o E (coluna
presa), mas o E virou a dobra 05, então a 04 precisa de outra forma. As duas
vivas são a B (três painéis, um preto) e a D (três telas reais do PCYES, uma
por passo).

Recusadas e mortas: escada com ilustração por passo, quiz clicável, índice
tipográfico puro, e qualquer grafismo desenhado ("odiei esses traços").

### 5. Peças, os outros projetos · ABERTA

Gostou da dobra, mas falta material e falta interação:

- **um mockup por peça.** Vários são aplicativo, então pede mockup de celular;
- **no hover**, escurecer a peça e mostrar uma descrição curta do projeto;
- o link é externo, e isso precisa ficar claro no componente.

### 6. Rodapé · ABERTA

"Bonito, mas meio sem sal." O que ele já gosta: ocupar a tela inteira.

O que falta: buscar referência e encorpar. Ideia dele, solta: logo das
empresas ali dentro.

## Páginas internas

### 7. Página de caso, o design · EM ANDAMENTO, tratamento A escolhido

Ele escolheu o tratamento **A** no artefato de comparação (capítulos com
superfície), com a instrução de que a mídia se compõe pela contagem: dois
prints ficam lado a lado, quatro do mesmo assunto viram peça navegável, sempre
mantendo padrão de leitura e sem variar tamanho de letra à toa.

**Feito** (`286d15d`, `4da4c21`, `9091ddd`):

- a virada de movimento virou **capa de capítulo**: chapa escura sangrando de
  borda a borda, meia tela, cromo em Geist Mono. Quatro por caso;
- **peça de abas**, usada nos módulos e no sistema, que empilhados valiam 36%
  da página. Painéis inativos ficam no DOM com `hidden`, setas e Home/End
  navegam;
- **mídia que sangra**, primeira das quatro formas da gramática;
- a **escala perdeu o miolo**: sai o degrau de 32px e o 88px órfão. Em 1440
  restam 12 / 16 / 24 / 40 / 72 / 96 / 112;
- o hero deixou de vazar por trás do "O que eu aprendi";
- a lista de decisões deixou de ter o número por cima do título;
- o fim da página virou **os outros três casos**, com as capas da home.

Medido no PCYES a 1440: de **34.182px (38 telas) para 24.737px (27 telas)**.

**Falta:**

- a dobra "Antes da V2 · a V1.2" tem 5 figuras e 2.375px, e é a última
  candidata a abas;
- o par e o tríptico existem com a forma certa (`figs-2`, `sol-grade`) mas
  ainda não passaram por revisão de largura caso a caso;
- o 88px de `.v2-rodape-chamada` mora em `shell.css` e vale para a home, que
  está aprovada. Não foi tocado de propósito.

### 8. Capas próprias por caso · FECHADA

Os quatro casos têm arte dedicada no hero, em `CAPAS_CASO` (`v2/copy.js`).
Commits `9f4817b`, `05661a0`, `1e2393a`, `0b813a5`.

### 9. Páginas "Sobre" e "Processo"

**"Processo" · FECHADA.** Existe em `/v2/processo`, em `v2/Processo.jsx` e
`v2/processo.css`. A nav passou a rotear para ela (`rota: true` em `LINKS`,
`v2/Shell.jsx`); "Sobre" continua sendo âncora até a página dela existir.

A gramática da página de caso virou kit: `DobraCaso`, `Figura`,
`CapaCapitulo` e `GradeCasos` saíram de `v2/Case.jsx` e moram em `v2/Kit.jsx`,
importados pelas duas páginas. A página de caso não mudou de forma nenhuma:
PCYES continua medindo 24.737px.

Como ela está montada: hero escuro com o registro dos seis passos na mono
(índice e grafismo na mesma peça, e o método inteiro antes de rolar uma
linha), ficha, uma dobra de abertura com o "de relance" na margem, três capas
de capítulo com dois passos cada, fecho escuro e os quatro casos em dois por
dois. 9.296px a 1440, que são 10,3 telas.

O número do passo em display é o grafismo da página, e é a resposta da
gramática de mídia por contagem: quatro dos seis passos não têm print honesto,
e zero figuras já significava "o número ocupa o lugar da imagem". Ele entra
por `content: attr(data-n)`, não como texto do DOM, porque em 13% de tinta o
axe reprovava contraste em cima de uma coisa que ninguém lê.

**Texto novo, e é só ele:** os dois parágrafos de `ABERTURA` no topo de
`v2/Processo.jsx`. O resto é verbatim: as seis etapas saem de `PROCESSO`
(volume/data.jsx), o título e a premissa do hero saem de `volume/Processo.jsx`
(a mesma página na V1), os nomes dos três movimentos saem de `PROCESSO_CURTO`.

Duas repetições foram cortadas na revisão: a frase de movimento saiu das capas
escuras (ela condensa os dois passos que vêm logo abaixo, então a capa
anunciava a dobra seguinte palavra por palavra), e o fecho perdeu "Protótipo
vira produto", que o passo 06 já diz uma tela acima.

Portão passando: axe 0 em 1440 / 1280 / 390, zero erro de JS, zero overflow
horizontal, e as quatro páginas de caso sem regressão.

**Achado que ficou de fora, e foi resolvido em 29/08:** abaixo de 860px a nav
escondia os três links (`.v2-nav-links { display: none }`, `site/shell.css`).
No celular não existia caminho para /processo a não ser pela URL. Não era
regressão daquela tarefa, era como a V2 sempre esteve. Virou bloqueio quando o
blog entrou — texto longo se lê no telefone — e o menu foi feito junto com
ele. Ver `docs/BLOG.md`.

**"Sobre" · ABERTA.** Não existe. A nav ainda aponta para a dobra 06 da home.

## Como ele avalia

Por comparação de print, nunca por descrição. Para movimento, print não basta:
URL local mais filmstrip de quadros. Ele é designer e fala português. Odeia
resposta longa: responda curto, com o número medido.

## Blog · 29/08

Existe em `/blog` e `/blog/<slug>`. Estrutura, decisões medidas e o manual de
como publicar estão em **`docs/BLOG.md`** — o que segue é só o que falta.

### 10. Os três primeiros posts · FECHADA

No ar, um por tag, o que já dá sentido ao filtro quando ele aparecer:

- **Ofício** — "Ver alguém travar numa tela que eu achava óbvia", sobre teste
  com usuário real, a planilha paralela do financeiro e as gravações de sessão
  que viraram a reunião do PCYES;
- **Bastidor** — "O que eu medi em seis sites bonitos", a análise das refs com
  os números de raio, escala e medida;
- **Carreira** — "Todo case do meu portfólio termina antes do número", a
  auditoria de triagem e o que ela achou.

Todo número citado sai de `volume/data.jsx`, de `docs/ANALISE-REFS.md` ou do
relatório de auditoria. Nada foi inventado.

**Ainda aberto:** o post da **recomendação de teste de usabilidade** (o e-mail,
com foto) que o Gabriel pediu. Falta o texto do e-mail e a imagem.

### 11. Capa própria por post · ABERTA

Os três posts têm capa, e as três são **foto de banco** (Unsplash, licença
comercial, registro em `volume/assets/blog/CREDITOS.md`). Isso segura a página e
não é o destino.

O que falta é capa que só este site poderia ter: gravação de tela do protótipo,
recorte de uma tela real, foto do trabalho acontecendo. É a mesma pendência de
material que a pendência 3 já registra para a home.

Antes da foto de banco, as capas eram SVG com o gráfico do dado de cada post.
Reprovado por print: diagrama tem texto perto da borda e todo recorte cortava
palavra, e três chapas de gráfico seguidas leem como slide de relatório.

### 12. Filtro e busca ainda não aparecem · POR DESENHO

Filtro entra com 5 posts e 2 tags; busca entra com 8. Os dois já estão no
código e testados com 5 posts de teste (grade, filtro e as três diretivas
passaram). Não é pendência, é o combinado — está aqui só para ninguém achar
que sumiu.
