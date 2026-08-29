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
Ela é foto de banco (macro de lanterna de carro, StockSnap CC0) e está em
upscale de 960 para 1600.

O que ele quer: criar uma capa própria, com texto no meio e algum efeito
dentro dela, funcionando como passagem para a dobra seguinte, e não como
banner mudo.

Arquivo: `volume/assets/stock/capa-quebra.webp`, usado em `v2/Home.jsx`.

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

### 9. Páginas "Sobre" e "Processo" · ABERTA

Não existem na V2. Precisam ser desenhadas. A nav já linka para elas.

## Como ele avalia

Por comparação de print, nunca por descrição. Para movimento, print não basta:
URL local mais filmstrip de quadros. Ele é designer e fala português. Odeia
resposta longa: responda curto, com o número medido.
