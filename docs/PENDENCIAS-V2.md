# Pendências da V2

Ditadas pelo Gabriel em 2026-08-29, depois das capas cheias, da escala na
grade e do hero de caso com parallax. Veredito geral dele sobre a home: "já
está muito bonita, muito bonita mesmo". O que está aqui é o que falta para
"nota dez barra dez".

Ordem de leitura: primeiro a home, dobra a dobra, depois as páginas internas.
Nada aqui está começado, a não ser onde disser o contrário.

## Home

### 1. Hero, a dobra 01

"Extremamente simples." Falta uma capa de verdade: vídeo de fundo, uma arte
forte ou um componente trazido de referência. Hoje é tipografia sobre chapa
escura, e é a primeira coisa que a pessoa vê.

Aprovado e intocável dentro dela: a revelação por desfoque, e o avião vermelho
que nasce na dobra da tese.

### 2. Declaração partida, a dobra 02

O desenho está aprovado ("gostei bastante do design disso"). O texto não: as
duas metades hoje cortam a frase no meio e a leitura se perde, do tipo "logo
que chega imagem tática" e a metade de baixo continua a mesma oração.

O que ele quer: **cada metade se fecha em si**. A da esquerda termina a
informação dela, a da direita entrega a dela. Duas ideias inteiras, não uma
frase partida em duas.

Arquivo: `v2/copy.js`, `DECLARACAO`.

### 3. A quebra de imagem antes de "O que já saiu da mesa"

A capa grande que separa os casos dos números "ainda não faz muito sentido".
Ela é foto de banco (macro de lanterna de carro, StockSnap CC0) e está em
upscale de 960 para 1600.

O que ele quer: criar uma capa própria, com texto no meio e algum efeito
dentro dela, funcionando como passagem para a dobra seguinte, e não como
banner mudo.

Arquivo: `volume/assets/stock/capa-quebra.webp`, usado em `v2/Home.jsx`.

### 4. Método, a dobra 04

Continua aberta, e é a terceira recusa. Ele viu cinco tratamentos no artefato
de comparação e escolheu o E (coluna presa), mas o E virou a dobra 05, então a
04 precisa de outra forma. As duas vivas são a B (três painéis, um preto) e a
D (três telas reais do PCYES, uma por passo).

Recusadas e mortas: escada com ilustração por passo, quiz clicável, índice
tipográfico puro, e qualquer grafismo desenhado ("odiei esses traços").

### 5. Peças, os outros projetos

Gostou da dobra, mas falta material e falta interação:

- **um mockup por peça.** Vários são aplicativo, então pede mockup de celular;
- **no hover**, escurecer a peça e mostrar uma descrição curta do projeto, para
  a pessoa decidir se clica;
- o link é externo, e isso precisa ficar claro no componente.

### 6. Rodapé

"Bonito, mas meio sem sal." O que ele já gosta: ocupar a tela inteira.

O que falta: buscar referência e encorpar. Ideia dele, solta: logo das
empresas ali dentro.

## Páginas internas

### 7. Página de caso, o design

A informação e a cronologia estão boas, e isso ele repetiu. O design é que
"ainda está jogado". Os pontos, nas palavras dele:

- aproveitar melhor o espaço;
- rever tamanho de letra e alocação de texto;
- o texto não está bem posicionado em relação à imagem;
- falta padrão e senso de ritmo, então dá impressão de coisa espalhada.

Ele quer referências novas antes de mexer, e o alvo é "brutal, muito bonito".

Já resolvido nesta frente, para não refazer: o hero da página agora é a capa
cheia do caso em tela cheia, com parallax na descida e faixa no celular
(commits `ddbd041` e `0ffaafb`).

### 8. Capas próprias por caso

As quatro capas de hoje são as mesmas da home. Ele quer arte dedicada para o
hero de cada caso: dispositivo menor, cena mais rica, às vezes dois aparelhos
(desktop e tablet encostados, por exemplo).

As regras de formato já estão definidas e medidas: 16:9 em 2560x1440, zona
segura entre 20% e 85% na horizontal e 8% e 80% na vertical, e o canto
inferior esquerdo (45% por 40%) livre de aparelho, porque é onde o título
gigante entra.

### 9. Páginas "Sobre" e "Processo"

Não existem na V2. Precisam ser desenhadas.

## Como ele avalia

Por comparação de print, nunca por descrição. Para movimento, print não basta:
URL local mais filmstrip de quadros. Ele é designer e fala português.
