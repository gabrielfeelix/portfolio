---
titulo: O que eu medi em seis sites bonitos
data: 2026-08-28
tag: bastidor
resumo: Recusei a primeira versão da minha home e fui atrás do motivo no lugar
  certo. Baixei seis portfólios que eu achava bonitos e contei o CSS deles. Três
  números explicaram o resto.
capa: capa.webp
capaAlt: Tipos móveis de madeira espalhados sobre uma superfície de trabalho
formato: largo
publicado: true
---

Refiz este site em agosto. A primeira versão da home foi recusada, e quem
recusou fui eu.

O que eu consegui dizer na hora foi isto:

> Está cru. Parece que a gente foi pegando componente pronto, jogando na página
> e pronto. Nada se amarra de verdade.

::frase
"Cru" não é diagnóstico. Serve para reprovar e não serve para consertar.
::

Então eu baixei seis portfólios que eu achava bonitos e parei de descrever o
que sentia olhando para eles. Contei o CSS.

Três números explicaram o resto.

## 1. Raio médio é a assinatura de template pronto

Rodei uma contagem de `border-radius` em cada um:

- **viper:** `0px` domina, **28 ocorrências**. Não existe raio médio em lugar
  nenhum. Os cards são retos.
- **bungee:** mesma escolha por outro caminho. `0px` domina, e o que é redondo
  é `500px`, o arco no topo das colunas do hero.
- **o meu:** `20px` no card, `24px` na mídia, `28px` na seção.

::coluna pos=direita
Ou zero, ou extremo. Eu tinha três valores médios, todos diferentes entre si, e
nenhum deles escolhido por um motivo que eu soubesse explicar.

Eles vieram junto com os componentes, e é exatamente essa a denúncia: raio
médio em tudo é o que sobra quando ninguém decidiu nada sobre forma.
::

::margem
A regra que saiu daí: conteúdo é reto, redondo só onde é acento. Os tokens de
card e de mídia foram para zero no mesmo commit.
::

## 2. A escala não tem miolo. A minha era só miolo.

Contei todos os `font-size` do viper. O resultado tem um buraco no meio:

| Faixa | Tamanhos encontrados |
|---|---|
| **Display** | 82 (13×), 128 (6×), 80, 88, 90, 110, 148, 200, 260 |
| **Rótulo** | 11 (9×), 12 (2×), 10, 13, 14 |
| **Corpo** | 15, 16, 17, 18 |
| **Entre 20 e 80** | quase nada. Uns 32, 40 e 48 soltos, todos em contexto secundário |

A minha escala era hero 128, dado 128, painel 72, manifesto 64, frase 44, corpo
17, rótulo 14.

**Um miolo inteiro entre 44 e 72**, que é justamente a faixa que a referência
não usa.

Tem um segundo número no mesmo lugar, e ele é mais sutil. O viper aperta
`-10px` num display de 128px, o que dá **-0,078em**. O meu apertava
**-0,032em**: menos da metade. É parte do motivo de o título grande ler mole na
tela mesmo estando no tamanho certo.

Miolo tipográfico é a assinatura visual de componente encaixado sem conversa.
Um bloco pede 44, outro pede 56, ninguém compara os dois, e a página acaba com
sete tamanhos que não formam escada nenhuma.

## 3. Página larga, texto estreito

O viper trava duas coisas em lugares bem distantes:

- **container:** 1800px
- **medida do texto:** 809px

O meu travava o container em 1440 e a medida em 1000. São dois erros na mesma
direção, e eles se somam:

- numa tela de 1920, o conteúdo dele ocupa 1800 e o meu ocupava 1440. Daí vinha
  a sensação de caixa estreita no meio do monitor;
- e o parágrafo dele para em 809 enquanto o meu ia até 1000, então **o texto
  lia largo dentro de uma página estreita.**

::destaque
Espaço em branco não convence por ser muito. Convence quando a página é larga,
o texto é estreito, e a diferença entre os dois é visivelmente escolhida.
::

::coluna pos=esquerda
Com container estreito e texto largo, o branco vira o que não coube.
::

## O que a medição não resolve

Bungee e viper são bonitos em parte por um motivo que não está no CSS: **os
assets são arte de banco.** Render 3D, moda, gradiente, macro de folha.

Portfólio de UX tem dashboard e tela de sistema.

Copiar o tratamento sem ter o material dá moldura bonita em volta de foto
chata, e eu tinha que escrever isso antes de começar, senão ia gastar uma
semana chegando na mesma conclusão pelo caminho caro.

A saída que sobra é transformar tela em imagem:

1. **recorte sem moldura de device**, encostando no conteúdo;
2. **zoom grande num detalhe** — um gráfico, um estado de erro, uma célula;
3. **gravação curta de tela em loop**, com o protótipo sendo usado de verdade.

Quatro segundos de fluxo funcionando valem mais que dez prints.

## A ordem em que eu refiz

A tentativa recusada foi montada seção por seção, cada uma resolvendo o próprio
problema. Foi isso que produziu a coleção de componentes soltos.

Na segunda vez **a gramática veio antes das seções:**

- segunda fonte, mono, só para o cromo de seção;
- escala sem miolo, cinco degraus e mais nenhum;
- política de raio, zero ou extremo;
- cabeçalho de seção como componente fixo de cinco partes;
- três primitivas de motion que se repetem a página inteira.

Só depois disso eu montei dobra.

## Os três números que esta página produziu sozinha

O blog que você está lendo entrou no ar hoje, e rendeu mais três medições que
eu não teria achado no olho:

**302.** A pasta dos JSONs dos posts se chamava `blog`, igual à rota. O servidor
via um diretório com aquele nome e redirecionava antes de qualquer fallback. A
listagem inteira sumia atrás de um redirect.

**180px.** Na grade de três colunas, um card retrato ao lado de dois quadrados
abria esse tanto de buraco na linha, porque linha de grade tem a altura do item
mais alto. A proporção variando por card, que era a ideia bonita copiada do
bungee, morreu aí.

**4,57:1.** O índice numerado do menu do celular estava a 45% de branco sobre
`#0B0B0C`. Reprovou no axe em 12px. A 60% dá 7,06:1 e passa com folga.

Nenhum dos três aparece olhando para a tela.

::frase
Medir não é o contrário de ter gosto. É o que faz o gosto virar um argumento que
sobrevive a uma reunião, e a uma segunda leitura na terça-feira seguinte.
::
