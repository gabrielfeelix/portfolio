# Análise das referências: o que faz elas serem bonitas, e o que falta na V2

Escrito em 2026-08-28, depois da recusa da home V2 (ver `docs/HANDOFF-V2.md`).
Este arquivo é a base de direção do redesenho. Ele não descreve gosto: cada
afirmação tem número medido no código da referência ou no nosso.

Método: as refs estão baixadas em `~/dev/refs/` (Framer, HTML com CSS inline).
Extração do fluxo de seções com um script de strip de tags; escala tipográfica,
espaço, raio e cor por `grep -oE` no `index.html` de cada uma. Bungee foi baixada
nesta sessão com a skill `clonar-site` (modo A).

Refs analisadas: `viper-template`, `bungee`, `launchfolio`, `porto-template`,
`tabfolio`, `td-maxfolio`.

---

## 1. O diagnóstico do Gabriel, na íntegra

Palavras dele, sem interpretar:

- quer "a mesma agradabilidade e satisfação" do viper, da seção **Featured
  Portfolio em diante**;
- o que ele elogia lá: título, descrição de duas linhas, CTA, logos, projetos
  "quase full width, QUASE", bullet points, a seção de resultados, o Pro
  Services, depois imagem;
- "é um LEGO, muitas coisas se encaixam lá";
- da V1 e da V2: "estão CRUAS, parece que fomos pegando uns componentes prontos,
  jogando e pronto. Nada se amarra de verdade. Não tem storytelling, um motivo
  da ordem. Não tem criatividade, você não sente uma experiência UAU";
- o que ele queria e não veio: ritmo, imagem, componente, navegabilidade, "dando
  pra entender que mudei de seção", suavidade de motion;
- a segunda seção entregue: "um único parágrafo seco feio, podia ter dividido em
  metade metade, começa na esquerda e depois rolando a outra metade fica
  alinhada à direita".

Resumo dele, que está correto: **1)** as refs sabem trabalhar com imagem,
**2)** às vezes com vídeo, **3)** sabem criar componentes interessantes,
**4)** têm motion e componentes animados.

---

## 2. Os sete mecanismos

### M1. Camada de cromo tipográfico

Uma segunda voz tipográfica minúscula, que não é conteúdo e sim moldura,
repetida no mesmo slot em toda seção.

| Ref | Cromo |
|---|---|
| viper | toda seção abre com nome + índice + ano: `Featured Works` `(CQ® — 03)` `©2025` |
| bungee | `( _01 )` no menu, `( _©25 )` ao lado de "Latest Projects.", `( 001 )` nos serviços, relógio vivo `( 00:00:00 NY )` |
| porto | `01` + `//Approach` + `Three Phases`; `LOCAL/ 13:39:59` |
| launchfolio | FAQ numerada `01` a `05`; badge "Available for August'25" |

Bungee separa por fonte: **Chivo Mono** para o cromo, Inter Display para o
conteúdo (`grep font-family` em `bungee/index.html`).

Função: costura seções sem relação entre si num sistema só, e responde sozinho
"mudei de seção?". É o "LEGO" que o Gabriel descreve.

**V2 hoje: zero.** `grep -cE 'olho|eyebrow|rotulo|v2-label' v2/home.css
v2/Home.jsx` retorna 0. Uma fonte só, do hero de 128px ao label de 14px.

### M2. Contraste tipográfico extremo, sem miolo

`viper/index.html`, contagem real de `font-size`:

- display: 82 (13x), 128 (6x), 80, 88, 90, 110, 148, 200, 260
- rótulo: 11 (9x), 12 (2x), 10, 13, 14
- corpo: 15, 16, 17, 18
- entre 20 e 80: quase nada (48, 56, 30, 32, 40, isolados e em contextos secundários)

Tracking do display: `-10px` em 128px = **-0.078em**. Entrelinha 90/82 = 1.10;
148/128 = 1.16.

Nossa escala (`v2/tokens.css`): hero 128, dado 128, painel 72, manifesto 64,
frase 44, corpo 17, label 14. **Temos um miolo inteiro (44 a 72) que a referência
não tem**, o rótulo de 14px é grande demais para ler como cromo, e
`--v2-track-display: -0.032em` é menos da metade do aperto deles.

Miolo tipográfico é a assinatura visual de "componente pronto jogado ali".

### M3. Raio zero ou raio extremo, nunca médio

- viper: `border-radius: 0px` domina (28 ocorrências); cards são retos.
- bungee: `0px` domina (11); o que é redondo é `500px` (as colunas em arco do
  hero) ou `40px`.

V2: `--v2-r-card: 20px`, `--v2-r-media: 24px`, `--v2-r-secao: 28px`. Tudo
médio-arredondado, que é o sinal número um de template padrão.

### M4. Imagem é o conteúdo, não enfeite

- **bungee**: a primeira coisa depois da logo é uma fileira full-bleed de nove
  colunas em arco (`border-radius: 500px` no topo), misturando `.mp4` e `.png`,
  sangrando nas duas bordas e cortada embaixo pela dobra. Sem card, sem moldura.
- **viper**: entre seções entram quebras de imagem puras: no fluxo aparece
  `[SECTION] [IMG] [SECTION]`, sem uma palavra de texto.
- **tabfolio**, página de caso: três `.mp4` como prova principal do trabalho, mais
  vídeo no "Explore more" do rodapé.
- **porto**, seção `//Who Am I`: a foto cresce e passa por cima da tipografia,
  revelando ela. É a seção que o Gabriel mais elogiou.

V2: print dentro de painel cinza com raio 24. O "foto em largura total" que ele
pediu morreu quando o formato de card foi escolhido depois.

### M5. Motion como estado, não como enfeite

- viper anima contadores de 0 a N (o DOM serve `0 +` parado, prova de contador em
  JS) e barras de progresso 25% / 60% / 100%.
- launchfolio: o hero desce e **cria** os projetos embaixo.
- porto: escala de imagem cruzando o texto.
- blocos repetidos 3 e 4 vezes no DOM de porto e launchfolio são trilhos
  infinitos (marquee).

V2 tem motion (revelação por palavra, pilha grudando, marquee), mas cada peça é
uma ilha; não existe vocabulário repetido que o olho aprenda.

### M6. Enfeites de personalidade, custo quase zero

`Clivelle *`, `Bungee®`, `greyola©`, `THINGS®`, `ZYPHER®`; datas como `07.25`,
`_©25`, `2013 - 2025`; relógio com cidade; assinatura à mão; o verbo girando no
rodapé do launchfolio ("Lets **design / build / create** incredible work
together"); o nome gigante como marca d'água no rodapé.

Respondem por boa parte do "dá pra sentir o cuidado por trás".

### M7. Cabeçalho de seção é componente, e a ordem tem argumento

O bloco que o Gabriel dissecou (viper, Featured Portfolio) tem cinco partes fixas:

```
olho pequeno            "Portfolio"
título grande com ®     "Feartured Portfolio®"
descrição de 2 linhas
CTA                     "View portfolio"
linha secundária + logos "Also work with these international partners:"
↓ só então os cards
```

Ordem do viper, que defende uma tese: intro → método → trabalho → números →
serviços → benefícios → depoimento. Cada seção responde a dúvida que a anterior
levantou.

Ordem da V2 hoje: hero → declaração → casos → marcas → processo → onde estive →
peças. Marcas entre casos e processo é arbitrário, e processo depois do trabalho
é ao contrário para quem avalia contratação.

---

## 3. Tabela de lacuna, medida

| | Refs | V2 hoje |
|---|---|---|
| Fontes | 2 (display + mono) | 1 (Switzer) |
| Cromo de seção | em toda seção | nenhum |
| Raio | 0 ou 500 | 20 / 24 / 28 |
| Vídeo | bungee e tabfolio usam | **0 arquivos** no repositório |
| Imagem sangrando | sim, e entre seções | não |
| Medida de texto | 600 a 809px | 1000px |
| Rótulo | 10 a 12px | 14px |
| Tracking display | -0.078em | -0.032em |
| Contador de números | viper e porto têm | não temos |
| Container | 1800px (viper), 1520px (bungee) | 1800px (já corrigido) |

Detalhe importante do espaço branco: viper trava o **container** em 1800px mas a
**medida de texto** em 600 a 809px. É esse contraste (página larga, texto
estreito) que faz o branco parecer decisão em vez de sobra. Nossa `--v2-medida`
está em 1000px, larga demais para ler como medida.

---

## 4. O bloqueio que não é código

Bungee e viper são bonitos em parte porque os assets são arte de banco: render
3D, moda, gradiente, macro de folha. Portfólio de UX tem dashboard e tela de
sistema.

Inventário real do repositório: PCYES 33 imagens, Locarmais 16 (sem capa),
portfolio 7, Odex 6, Oderço 5, marcas 18, certs 6. **Zero `.mp4`, zero `.webm`.**

Copiar o tratamento sem o material dá moldura bonita em volta de foto chata. A
saída não é "arranjar foto", é transformar tela em arte:

1. recorte sem moldura de device;
2. zoom grande em um detalhe (um gráfico, um estado de erro, uma célula);
3. **gravação de tela curta em loop** do protótipo interagindo.

Um `.mp4` de 4 segundos de fluxo funcionando vale mais que dez prints, e é o que
o tabfolio faz na página de caso. Gabriel confirmou em 2026-08-28 que consegue
gravar, mas depois de ver a estrutura pronta.

---

## 5. Direção acordada

Ordem invertida em relação à tentativa que falhou: **a gramática vem antes das
seções.** Montar seção sem kit foi o que produziu a coleção de componentes soltos.

**Etapa A, o kit.** Segunda fonte mono para o cromo; escala sem miolo (rótulo
11px com tracking positivo, display a -0.07em); política de raio (0 para
conteúdo, extremo para acento); cabeçalho de seção como componente de cinco
partes; vocabulário de motion com três primitivas repetidas.

**Etapa B, a home remontada** com o kit, em ordem que defende uma tese:

```
01  hero escuro, relógio/local em mono, terminando numa fita de mídia
    full-bleed sangrando (bungee), não num corte limpo
02  declaração partida: metade à esquerda, metade à direita ao rolar
    (ideia do Gabriel), com as logos das marcas embaixo
03  trabalho selecionado, com o cabeçalho de cinco partes do viper
04  quebra de imagem pura, sem texto
05  números: anos, projetos, empresas, sessões de usuário assistidas,
    contador animado a 128px
06  sobre mim no modelo do porto: foto crescendo por cima do texto,
    frase na voz dele, assinatura
07  peças (a fita atual, que sobrevive)
08  rodapé escuro com "GABRIEL" gigante e verbo girando
```

**Etapa C, material.** Stock temporário para provar a tese em print; depois
gravação de tela dos protótipos (PCYES primeiro, é o caso com mais material) e
uma imagem de abertura por caso que aguente largura total.

## 6. O que sobrevive da tentativa recusada

Decidido por print, não por gosto do agente, e continua valendo:

- Switzer e a escala que veio com ela (como base, a ser recalibrada por M2);
- peças extras fora da hierarquia principal;
- processo em três frases;
- rodapé escuro;
- container em 1800px.
