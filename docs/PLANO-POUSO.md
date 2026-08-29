# O pouso — o avião aterrissa na mão do Gabriel

Plano, não execução. Pedido do Gabriel em 29/08: o aviãozinho que desce a home
inteira deveria **pousar na mão dele**, na dobra 06 (`Quem assina`), e a mão
deveria subir para recebê-lo conforme a pessoa rola.

Nada disto está implementado. O que está escrito aqui é o caminho, o que ele
custa, e as três decisões que dependem do Gabriel.

---

## 1. A descoberta que muda o plano

O Gabriel propôs **gravar um vídeo** e escrubá-lo pela rolagem ("o vídeo vai e
volta"). O plano dele parte de uma premissa que a dobra 06 não tem: que a peça
é uma foto.

`volume/assets/gabriel-recorte.webp` (1086×1448) **não é foto — é ilustração a
traço**, corpo inteiro, uma mão atrás da nuca e a outra caída ao lado do corpo
(a ~72% da largura, ~52% da altura do arquivo). Existe uma foto de verdade no
repositório (`gabriel-foto.webp`), mas a dobra 06 não usa ela.

Isso derruba o vídeo por dois motivos, e os dois são bons:

- **De linguagem.** Um vídeo de pessoa real entrando no meio de uma dobra
  desenhada não é upgrade, é remendo: metade da dobra passa a ser de outro
  material. E a ilustração é uma decisão já tomada e já aprovada.
- **De custo.** Vídeo escrubado por rolagem precisa de todos os quadros
  ancoráveis (all-keyframe) para não travar ao voltar. Um clipe de 3s a 30fps
  em 1080p, assim codificado, dá 15–25MB; como sequência de imagens, ~90
  arquivos e ~3,6MB. O hero inteiro do site pesa 1,1MB. Some a isso que o
  `seek` por rolagem é irregular no Safari do iPhone, que é metade do público.

**A troca:** em vez de um vídeo, **um segundo desenho** — o mesmo boneco com o
braço direito estendido, palma para cima. Ou, se o Gabriel quiser o movimento
que ele descreveu, **3 a 5 quadros** do braço subindo, que é flipbook e é
exatamente o vocabulário de um portfólio em forma de volume. Cada quadro é um
WebP de ~120KB, e cinco deles pesam menos que meio segundo de vídeo.

O "vai e volta" que ele pediu continua existindo: quem escruba é a rolagem, e
rolar para trás desce o braço de novo. Só que o quadro é um `<img>` trocado por
índice, não um `currentTime`.

---

## 2. A mecânica do pouso

O voo hoje é **um caminho só** (`offset-path`) montado em pixel a partir da
caixa do corpo claro, e a rolagem controla a ALTURA do avião, não a distância
de arco (`tabelaPorAltura` em `site/motion.js`). Para pousar, quatro peças:

### 2.1 Um alvo que exista no DOM

Não vale coordenada fixa: a dobra muda de tamanho em cada ponto de virada da
escala. Entra um elemento vazio dentro da moldura da ilustração:

```jsx
<span className="v2-sobre-pouso" aria-hidden="true" />
```

posicionado em **porcentagem da caixa da foto** (`left: 72%; top: 52%` é onde a
mão está no arquivo atual; com o braço estendido o número muda e sai do desenho
novo). Ele é medido pelo mesmo `dentro()` que `useVoo` já usa para achar a
caixa da declaração — a função existe e não precisa de ref novo.

### 2.2 O caminho termina no alvo

`rotaDoVoo` ganha um argumento a mais, o ponto de pouso. A última repetição da
`costura` para de mirar em `em(1.1, 1.0)` e passa a mirar no alvo, com os dois
últimos pontos **quase na mesma altura**: `offset-rotate: auto` inclina o avião
pela tangente, então aproximação horizontal é o que faz ele pousar nivelado em
vez de espetar a mão.

### 2.3 O alvo não pode estar se mexendo na hora do pouso

Este é o detalhe que estraga tudo se passar batido. A ilustração da dobra 06
**escala de 0.55 a 1 e translada de +6% a −6%** ao longo da própria dobra
(`Sobre` em `site/Home.jsx`). Se o avião chegar no meio disso, a mão está num
lugar na medição e em outro na tela.

Regra: **o pouso acontece depois de 60% do progresso da dobra**, que é onde a
escala já travou em 1. O braço sobe entre 25% e 55%, o avião chega entre 60% e
75%, e o resto da dobra é o avião pousado.

### 2.4 Pousado é pousado

Depois do último ponto, `offset-distance` fica em 100% e o avião para no alvo.
Como o alvo é filho da moldura, ele passa a rolar JUNTO com a dobra em vez de
continuar preso na altura da tela — que é exatamente a leitura certa: ele pousou
num lugar, e o lugar sobe quando a página sobe.

Isso pede uma troca no fim do percurso: o avião do `offset-path` apaga no quadro
do toque e um segundo avião, `position: absolute` no alvo, acende — senão a
camada `.v2-voo` continua mandando nele. A troca é invisível porque acontece com
os dois exatamente na mesma posição.

---

## 3. O que muda no celular

Duas contas separadas, e nenhuma delas é "diminuir tudo":

- **Onde a mão está.** A ilustração é cortada diferente no celular (a moldura
  muda de proporção), então o `left/top` do alvo precisa de um segundo par de
  porcentagens abaixo de 900px. Mede-se uma vez, no navegador, e vira token.
- **Como o avião chega.** Depois da mudança de 29/08 o voo repete a partitura
  até 4 vezes em tela estreita (`densidade`, em `motion.js`). A última repetição
  é a que pousa; as anteriores continuam iguais. Isso já está resolvido.

---

## 4. Reduced motion

Hoje, com `prefers-reduced-motion`, o voo simplesmente não existe. Com o pouso,
ele passa a existir parado: **o avião nasce já pousado na mão**, e o braço já
está no quadro final. A dobra continua contando a mesma coisa sem um pixel se
mexendo, que é a regra do site.

---

## 5. O que depende do Gabriel

1. **O desenho.** Um quadro só (braço já estendido) ou três a cinco (o braço
   subindo)? Um quadro é uma tarde; cinco são o mesmo trabalho vezes cinco, e
   dão o "vai e volta" que ele descreveu.
2. **Qual mão.** A que hoje está caída ao lado do corpo (direita do desenho) é a
   mais barata: sobe pouco e não cruza o rosto. A outra está atrás da nuca.
3. **Se o pouso encerra o voo.** Se o avião pousa na dobra 06, ele não sai mais.
   A dobra 07 (as peças) e o rodapé ficam sem ele. Alternativa: ele pousa,
   descansa uma dobra e **decola de novo** no fim — mais bonito, mais uma
   partitura para escrever.

---

## 6. Alternativa sem desenho novo, se ele quiser ver funcionando amanhã

Logo abaixo da ilustração existe a **assinatura à mão** (`Assinatura`, que se
escreve com `useEscrita`). O avião pode pousar no primeiro traço do "G" e a
assinatura escrever-se a partir de onde ele encostou.

Custo: zero asset novo, e usa duas peças que já existem. Não é o que ele pediu,
mas é o mesmo gesto — o avião chega e alguém assina — e serve de teste da
mecânica das seções 2.1 a 2.4 antes de encomendar desenho.
