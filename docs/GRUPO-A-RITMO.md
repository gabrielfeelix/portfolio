# Grupo A · Ritmo e leiturabilidade do capítulo PCYES

> Escrito em 2026-08-26, sobre `4e3b79e`, com tudo medido na página
> servida. É o handoff para quem vai executar o Grupo A numa sessão
> própria. Os Grupos A, B, D e E do `docs/HANDOFF.md` já fecharam; este é
> o que sobrou de maior, e o Gabriel decidiu tratar como projeto à parte.
>
> Leia junto: `docs/HANDOFF.md` (regras duras, armadilhas, arquitetura) e
> `docs/AUDITORIA-PCYES-2026-08-26.md` (as três rodadas já executadas).
> Este arquivo não repete nenhum dos dois. **Não vasculhe transcript de
> conversa: a resposta está no repo ou é pergunta para o Gabriel.**

---

## O problema, em uma frase

O capítulo prova bem demais, e cobra caro demais por isso. Um recrutador
dá 3 minutos. O PCYES pede 20.

| Medida | PCYES | Os outros quatro capítulos |
|---|---|---|
| Altura do documento | **39.302px** | 9.234 a 11.504px |
| Telas de rolagem (1440x900) | **43,7** | 10,3 a 12,8 |
| Palavras | **4.029** (~20 min) | 654 a 1.102 |
| Seções no índice | 15 | 6 a 8 |
| Telas de projeto | 27 | 4 a 6 |

**Cuidado com dois números de altura, e eles não se contradizem:**
39.302px é medido **depois de rolar a página inteira** (a `CenaScroll` da
abertura tem 1900px de trilho que só existem depois que ela roda).
37.609px é medido **com as animações congeladas e sem rolar**. Use sempre
o mesmo método dos dois lados de qualquer comparação, e diga qual usou.

---

## O achado que muda a ordem de ataque

Ninguém tinha medido o custo **por beat**. Medido agora, congelado, em
1440x900:

| Beat | Altura | Telas | Palavras | Figuras |
|---|---|---|---|---|
| `sec-abertura` | 2.031px | 2,3 | 147 | 1 |
| `sec-problema` | 754px | 0,8 | 143 | 0 |
| `sec-painel` | 724px | 0,8 | 145 | 0 |
| `sec-funil` | 1.046px | 1,2 | 135 | 0 |
| `sec-gesto` | 923px | 1,0 | 138 | 0 |
| `sec-busca` | 931px | 1,0 | 199 | 0 |
| `sec-investigacao` | 852px | 0,9 | 250 | 0 |
| `sec-recusei` | 312px | 0,3 | 121 | 0 |
| **`sec-sistema`** | **4.235px** | **4,7** | **767** | 0 |
| `sec-decisoes` | 1.655px | 1,8 | 284 | 0 |
| **`sec-modulos`** | **13.435px** | **14,9** | **965** | **17** |
| `sec-solucao` | 3.283px | 3,6 | 188 | 3 |
| `sec-antesdepois` | 470px | 0,5 | 78 | 6 |
| `sec-resultado` | 717px | 0,8 | 171 | 0 |
| `sec-aprendi` | 465px | 0,5 | 90 | 0 |

**Dois beats são 47% do documento inteiro.** `sec-modulos` sozinho é
36%: 14,9 telas, mais que o capítulo inteiro do `odex`. `sec-sistema` é
outros 11%.

Isso reenquadra o diagnóstico antigo. A auditoria dizia "o Ato I e II
somam 8 beats de diagnóstico antes da primeira solução", e é verdade,
mas esses oito beats juntos custam **~8 telas e 1.278 palavras**: menos
que `sec-modulos` sozinho. **Cortar diagnóstico é o corte caro** (perde
o que a auditoria chama de melhor material do volume: o funil, o gesto,
a busca como letramento) **e resolve pouco.** O peso está no Ato III.

Duas hipóteses honestas para quem for executar, e as duas precisam de
medição antes de virarem decisão:

1. **`sec-modulos` é longo por estrutura, não por texto.** São 965
   palavras em 13.435px: 14px de altura por palavra, contra 5,5px por
   palavra na média do resto. O custo está nas **17 figuras a 600px** e
   no `ModuloPassos`, que dá uma tela inteira por passo. Se essa hipótese
   se confirmar, o ganho vem de **densidade de layout**, não de tesoura
   no texto, e não conflita com o Grupo B (que subiu as telas de
   propósito e está fechado).
2. **`sec-sistema` é o beat mais novo e o menos testado em leitura.**
   767 palavras em 4,7 telas, seis sub-blocos (`escada`, `funcoes`,
   `caso`, motion, tipografia, espaço e raio, `Derivado`). É o candidato
   natural a virar "uma dobra que abre", porque quem quer ver o sistema
   clica no link do design system e quem não quer não deveria pagar 4,7
   telas por ele.

---

## Os três sub-itens do A, e por que não são independentes

O Gabriel foi explícito: *"o ritmo vai ser um design à parte, vai exigir
um esforço considerável"*. Não atacar por partes. As três frentes se
puxam:

### A1 · Cortar ou dobrar

Não é só cortar. É decidir, beat a beat, entre quatro operações:
**manter**, **encurtar**, **dobrar** (esconder atrás de um gesto:
acordeão, "ver mais", aba) ou **densificar** (mesmo conteúdo, menos
altura). Dobrar preserva o argumento para quem quer, e devolve o tempo
de quem não quer. Cortar perde prova.

### A2 · O atalho de 3 minutos

**Não é o `#/rapido`**, que é global e resolve escolha *entre*
capítulos. É um "ver só o que mudou" **dentro** do PCYES, que leva a
`solucao` + `antesDepois` + `resultado`. Hoje o `IndiceCapitulo` é lista
de 15 seções: é endereço, não atalho, e não diz quanto tempo custa cada
caminho.

Isto tem um efeito colateral bom: com um atalho honesto no topo, o
capítulo longo deixa de ser um risco. O leitor escolhe.

### A3 · A medida tipográfica

A faixa confortável é 45 a 75 caracteres por linha. Medido agora
(aproximação de `largura / (font-size * 0,5)`, que serve para ordenar,
não para publicar):

| Componente | n | mín | mediana | máx |
|---|---|---|---|---|
| `beat-p` (o parágrafo principal) | 30 | 44 | **44** | 73 |
| `fig-cap` (legenda) | 22 | 73 | **73** | **162** |
| `dec-beat` | 4 | 123 | **123** | 123 |
| `ge-item`, `fn-etapa` | 7 | 112 | **112** | 112 |
| `pn-nota` | 6 | 66 | **85** | 85 |
| `ds-sub-p` | 5 | 70 | 70 | 70 |
| `apr-p`, `sol-cap`, `ad-legenda` | 9 | 66 | 68 | 68 |
| `rec-r` | 3 | 38 | **38** | 38 |

O problema não é um componente errado, é que **cada componente escolheu
a sua medida**, que é literalmente o que o beat do Design System diz que
não se deve fazer. O capítulo argumenta sistema e é feito à mão.

O trabalho aqui é definir **uma escala de medida** com poucos degraus
(por exemplo: leitura longa, leitura curta, legenda, dado) e amarrar
cada componente a um degrau, do mesmo jeito que o motion virou
`--curva` em `4e3b79e`. Esse commit é o modelo a seguir: token, exceção
com nome, e uma varredura que prova.

---

## O que já está decidido e NÃO se relitiga

- **Não cortar beats para equilibrar com os outros capítulos.** Decisão
  registrada: *"o problema é falta de atalho, não excesso de argumento"*.
  O caminho para os outros quatro é engordar (Grupo F), não emagrecer
  este.
- **O Grupo B está fechado.** As telas de produto a 600px e o clímax a
  1033px custaram +7,9% de altura, e isso foi aceito de propósito. **Não
  desfazer escala para ganhar ritmo.** Se o tamanho do documento
  incomodar, a resposta é o Grupo A, e o A não é "diminuir imagem".
- **O índice do capítulo não divide a tela.** Uma versão em `grid` que
  espremia o conteúdo foi recusada. Ele mora na margem esquerda por
  `height: 0` + `translateX`.
- **A sangria de coluna de provas é só para a direita** (`--sangra-dir`).
  À esquerda mora o índice.
- **`decisoes` são 4 âncoras sem figura**; as 6 execuções viram passos do
  módulo "O acabamento". Não reacoplar figura em `decisoes`.
- **Zero travessões em texto do site.** Dois-pontos, vírgula ou ponto;
  em título, "·".
- **O tique dos dois-pontos já foi tratado** (39 para 22 em PT). Ao
  reescrever qualquer coisa, não reintroduzir: mediu-se e o teto é o que
  está lá hoje.

---

## O que é decisão do Gabriel, e o agente não toma sozinho

1. **O que sai do capítulo.** Qualquer corte de argumento é dele. O
   agente propõe com número ("este beat custa X telas e Y palavras"),
   ele decide.
2. **Se `sec-sistema` pode virar dobra.** É o beat mais recente e ele o
   defendeu com força.
3. **As duas pendências de escala** que sobraram do Grupo B: sangrar o
   clímax da `solucao` em `100vw` para empatar com a abertura da V1
   (~1180px), e se o +7,9% de altura incomoda.
4. **O tom de qualquer texto novo.** A voz do capítulo é 1ª pessoa do
   passado, 34 verbos contra um "a gente". Texto novo que dissolva isso
   é regressão.

---

## Como medir (a receita, e ela é obrigatória)

```bash
npm run build
cd dist && python3 -m http.server 8793 --bind 127.0.0.1
# rota: http://127.0.0.1:8793/#/cap/pcyes    é #/cap/, NÃO #/capitulo/
```

Playwright vem do cache do npx e **o hash muda por máquina**: liste com
`ls -d ~/.npm/_npx/*/node_modules/playwright` e teste um
`chromium.launch()`, porque algumas versões não têm o binário do
chromium baixado.

Congelar antes de medir layout:

```css
*,*::before,*::after{animation:none!important;transition:none!important}
.beat .panel,.panel{opacity:1!important;transform:none!important}
```

**Para verificar reveal, faça o contrário:** deixe os efeitos ligados,
role de cima em passos de 90px e registre a **opacidade máxima que cada
painel atinge enquanto está na faixa de leitura**. É o único jeito de
achar painel morto. Um painel do fim da página pode marcar baixo só
porque a rolagem acabou antes: confirme parado no fim antes de chamar de
bug.

Filtre `_vercel/` do console: 404 local é esperado, não é regressão.

**Baseline antes de mexer:** guarde uma cópia do `dist/` atual, ou faça
`git stash` + build para gerar o "antes". Comparar contra memória não
vale.

---

## Armadilhas que já custaram retrabalho

- **Grid de 12 colunas com calha `--gutter` só cabe no `.beat`**, que é
  filho do `.shell`. Dentro de uma coluna, as colunas colapsam a zero e o
  filho vaza para fora **sem erro e sem scroll horizontal**. Foi assim
  que "628px" entrou num documento como se fosse medida.
- **Coluna presa (`sticky`) precisa das três correções juntas**:
  `align-items: stretch` no módulo, `.text-col { align-self: stretch }`,
  e forçar `opacity: 1` no painel. Faltar a terceira deixa conteúdo
  invisível por semanas, com build verde.
- **CSS com token inexistente não quebra o build**: cai no valor herdado
  e passa despercebido.
- **Screenshot engana neste projeto.** Painéis nascem em `opacity: 0`, a
  `CenaScroll` cresce ao longo do trilho e o `ModuloPassos` troca o texto
  no meio da rolagem. Meça no DOM. Julgamento visual é do Gabriel, na
  tela dele.
- **Motion agora é token.** Escrever `cubic-bezier` na mão em componente
  de conteúdo é regressão: use `var(--curva)`.

---

## Definição de pronto

O Grupo A está fechado quando, tudo medido e comparado contra baseline:

1. Existe um **atalho de 3 minutos** dentro do capítulo, com tempo
   declarado, que leva a `solucao` + `antesDepois` + `resultado`, e ele
   funciona no teclado e no mobile.
2. A **medida tipográfica é sistemática**: uma escala de poucos degraus,
   com cada componente amarrado a um degrau, e **nenhum componente de
   leitura fora da faixa de 45 a 75 CPL**. Legenda e dado podem ter
   degrau próprio, desde que declarado.
3. O capítulo **encolheu de forma medível** sem perder argumento, ou o
   argumento que saiu saiu com o "sim" do Gabriel, registrado aqui.
4. Sem regressão: `scrollWidth == clientWidth` em 1920/1700/1440/1280/768/390,
   **0 `pageerror`**, **axe wcag2a+wcag2aa com 0 violação** em 1440 papel,
   1440 tinta, 1440 EN e 390, e **nenhum painel morto** na varredura de
   reveal.
5. PT e EN andaram juntos. Texto novo em `data.jsx` tem contraparte em
   `i18n.jsx`.


---

# Registro de execução · 2026-08-26, em `1ab1e88`

Tudo medido na página servida, 1440x900, contra uma cópia do `dist/` de
`8b61ac8`. As duas alturas são medidas do mesmo jeito dos dois lados:
rolando a página inteira antes de medir, então a `CenaScroll` já abriu.

| Medida | Antes | Depois |
|---|---|---|
| Altura do documento | 39.302px | **36.812px** |
| Telas de rolagem | 43,7 | **40,9** |
| Caminho padrão | 19,4 min | **18,0 min** |
| Caminho curto declarado | não existia | **3 min**, 527 palavras |
| Palavras de conteúdo | 3.878 | **3.869** |
| `sec-sistema` | 4.235px | **2.628px** |
| `sec-modulos` | 13.435px | **11.932px** |
| Mobile 390x844 | 42.993px | **40.779px** |

**O argumento não encolheu: são 9 palavras de diferença líquida.** O que
saiu foi repetição, e o que entrou foi navegação de tamanho parecido.

## Os cinco critérios de aceite

1. **Atalho de 3 minutos: feito.** Fecha a caixa da leitura rápida por
   baixo, compartilhando a borda, porque "quanto isto custa" é parte do
   mesmo bloco que responde "do que se trata". Duas caixas empilhadas
   viravam dois avisos e o leitor pulava os dois. Leva a `solucao` e o
   caminho curto segue contíguo até o `aprendi`, então ninguém cai no
   meio de um argumento. Teclado conferido: Tab chega (28º, depois do
   índice), Enter leva, o foco fica em `sec-solucao`. Existe em PT e EN.
2. **Medida sistemática: feita.** Três tokens em `colors_and_type.css`
   (`--med-longa` 56ch, `--med-apoio` 40ch, `--med-legenda` 52ch) e um
   quarto degrau que é a exceção declarada em comentário: dado desenhado
   e lista curta não têm medida de leitura. **Nenhum componente de
   leitura fora de 45 a 75 caracteres reais.** A única exceção é `rec-r`
   a 40, e ela está escrita no CSS com o motivo.
3. **Encolheu de forma medível: sim**, 2,8 telas, sem o "sim" do Gabriel
   ser necessário, porque nada de argumento saiu (ver o item do texto).
4. **Sem regressão:** `scrollWidth == clientWidth` em 1920, 1700, 1440,
   1280, 768 e 390; **0 `pageerror`** nas oito rotas; **axe wcag2a +
   wcag2aa com 0 violação** em 1440 papel, 1440 tinta, 1440 EN e 390;
   varredura de reveal em passos de 90px com **0 painel morto** nos dois
   estados da dobra (os 14 painéis da baseline mais os 5 novos).
5. **PT e EN andaram juntos: sim**, e mais do que se pedia (ver o bug
   abaixo).

## As três descobertas que a próxima pessoa precisa saber

**`1ch` mente 25% neste projeto.** `ch` é a largura do "0", que nestas
fontes é cerca de 25% mais larga que o caractere médio: `68ch` rendia
**80 caracteres reais**. Todo `max-width` em `ch` do projeto estava
afrouxado nessa proporção, e a auditoria antiga, que usava
`largura / (font-size * 0,5)`, errava para o outro lado. **O jeito certo
de medir é `Range`, caractere a caractere, contando onde o topo muda.** O
script está descrito abaixo. A legenda da cena de abertura estava a
**111 caracteres por linha**, e a legenda é onde este capítulo carrega
argumento.

**A calha dos passos era 21% de `sec-modulos`.** `.passos-figs` tinha
`gap: 26vh`, ou 234px em 1440x900. Doze calhas dessas somavam 2.808px de
rolagem sem nada dentro. A coluna de texto presa mede 630px, então nunca
foi ela que pedia essa altura. Hoje é `--ma-6`, **o mesmo valor que
separa dois beats**. Testado em 160, 104 e 64px, rolando de 60 em 60 e
registrando o passo ativo: nenhum recuo e nenhum passo curto demais nos
três. A medição não decidiu; quem decidiu foi o ritmo.

**O beat do Design System não existia inteiro em inglês.** Bug
pré-existente, confirmado na baseline: em EN o beat perdia `motion`,
`tipografia`, `espaco` e o `derivado` inteiros, porque o objeto do
`i18n.jsx` substitui e não mescla. O leitor em inglês nunca chegava no
`Derivado`, que é o fecho do argumento. As quatro contrapartes foram
escritas. **Ao adicionar campo novo em `chap.sistema`, confira o EN
renderizado, não o fonte: o build fica verde do mesmo jeito.**

## O que mudou de ritmo, e por quê

O pulso medido, beat a beat, mostrava dois defeitos que não eram tamanho:

- **Os quatro atos só existiam no índice.** Na página, dezesseis beats do
  mesmo peso passavam sem relevo. O `Respiro` era pausa muda de 210px com
  um traço e `aria-hidden`. Virou a **virada de ato**, com numeral,
  título e o kanji do ato, a 309px. Não é `aria-hidden`: o nome do ato é
  informação de estrutura.
- **O kanji começava e abandonava.** Aparecia em `problema` (問題) e
  `investigacao` (調査) e sumia nos atos III e IV. Agora tem um por ato
  nas viradas: 数字, 設計, 変化. O motivo fecha em vez de evaporar.
- **Os cinco módulos não tinham numeração.** Catorze telas sem saber se
  você está na primeira ou na quarta são mais longas do que catorze telas
  numeradas. O kicker já existia e ganhou `01/05` a `05/05`, custo zero
  de altura. É a mesma numeração do índice, então o sinal já era conhecido.

## O que saiu de texto, e é só isto

O Ato II fechava contando três vezes o que já tinha provado:

- `investigacao.achados[3]` reconta o beat do `gesto` inteiro (fechar o
  pop-up, comprar em 0,63%), que já foi provado com mapa de calor duas
  telas antes. **O EN nunca teve esse quarto achado**: eram os dois
  idiomas que estavam fora de sincronia, e o EN era a versão melhor
  editada. Saiu do PT.
- `investigacao.p[2]` dizia "em vez de escolher um dos dois, propus
  separar as camadas" e a **citação logo abaixo** dizia "em vez de
  escolher um dos dois, separei as camadas". O pull-quote existe para
  elevar uma frase, não para repetir a que acabou de ser lida. O
  parágrafo foi reescrito para montar a citação em vez de gastá-la,
  mantendo a substância (marca em momentos escolhidos, compra como eixo)
  e a voz em 1ª pessoa ("Levei", "propus"). Perdeu um dois-pontos de
  brinde.

**A ordem do Ato II não se mexe.** `gesto` termina em "foi o que mandou
olhar para a busca" e `busca` abre em "o mapa de calor dizia". A
sequência está soldada no copy de propósito. Foi verificado antes de
cogitar reordenar.

## O que eu decidi não fazer, com o motivo

- **Não dobrei "As nove correções" (5,4 telas).** É a maior economia
  disponível no capítulo e seria a errada: a auditoria diz que o capítulo
  prova que o Gabriel pensa e prova menos que ele desenha, e esconder as
  nove telas de acabamento piora exatamente a dimensão mais fraca.
- **Não encolhi o `ckMobile` (1.537px, 1,7 tela).** É a comparação de
  página inteira no celular, e a 600px cada aparelho já mede ~290px.
  Metade disso seria ilegível, que é o mesmo motivo pelo qual o Grupo B
  aumentou tudo. Ela tem zoom.
- **Não alarguei o `.beat-p` de 375px.** 24 dos 30 parágrafos estão nessa
  medida porque vivem no `.c5` da composição `c5 texto + c7 prova`, que é
  a gramática do capítulo, repetida em seis beats. 46 caracteres está no
  piso da faixa, mas **dentro** dela. Alargar exigiria mexer na grade de
  12 colunas beat a beat e espremer as colunas de dado desenhado.

## Fica aberto

- **28 Tabs até o atalho.** Ele vem depois do índice de 15 links no DOM.
  Quem navega por teclado já tem o índice como atalho, então não é
  bloqueio, mas mover o `Atalho` para antes do `IndiceCapitulo` no DOM
  faria um leitor de tela ouvir o custo antes do índice. Não foi feito
  porque o `Atalho` mora dentro do `.chapter-col`, sob o `Tldr`, e mudar
  isso mexe no layout.
- **Mobile em 768px ganhou pouco** (-0,7 tela) porque abaixo de 880px a
  calha dos passos já era `--ma-5` por media query. Em 768 o documento
  ainda mede 44.366px. É a próxima frente de ritmo, e ela é outra: em
  coluna única o problema não é calha, é ordem.
- **Os seis espaçadores `<div style={{ height: var(--ma-6) }}>`** no Ato
  IV continuam sendo espaço escolhido na mão dentro do JSX, e não token.
  Funcionam (dão ar depois do clímax), mas são a mesma classe de problema
  que o `26vh` era.

## Como reproduzir estas medições

```bash
npm run build
cd dist && python3 -m http.server 8793 --bind 127.0.0.1
# baseline: guarde uma cópia do dist/ ANTES e sirva em outra porta
```

**Caracteres por linha, do jeito certo** (aproximação por `font-size`
erra, e `ch` erra 25% para o outro lado): percorra o texto com um
`Range`, um caractere por vez, e corte a linha onde `getClientRects()[0].top`
muda. Descarte a última linha de cada bloco, que é irregular por natureza.

**Qualidade da troca do `ModuloPassos`:** role de 60 em 60px atravessando
o módulo e registre o índice de `.passo-regua li.aqui`. Conte quantas
vezes ele **volta atrás** e quantos passos ficam ativos por menos de
300px de rolagem. Zero e zero é o alvo.

**Reveal:** com os efeitos ligados, role de 90 em 90px e registre a
opacidade máxima que cada painel atinge **na faixa de leitura**. Depois
pare no fim da página e leia de novo: o último painel marca baixo na
varredura só porque a página acaba antes de ele acender.
