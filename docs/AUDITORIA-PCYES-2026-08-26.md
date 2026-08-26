# Auditoria do capítulo PCYES

> Feita em 2026-08-26 sobre `b78bd4a`, **calibrada para mid** (escolha do
> Gabriel). Complementa `AUDITORIA-PORTFOLIO.md`, que é do volume inteiro:
> esta olha um capítulo só, e olha craft, motion, leiturabilidade e
> apresentação do design, que a outra explicitamente deixou de fora.
>
> Tudo aqui foi **medido na página servida** (`dist/` em
> `python3 -m http.server`), com Playwright, em 1440x900 e 390x844. Nada
> foi julgado por print de estado de transição. Onde a medição contrariou
> a primeira impressão, vale a medição.

## Nota

**7,4 / 10 para mid.** Passa numa triagem com folga. O pensamento está
acima do nível; o acabamento e a escala das imagens estão abaixo dele.

| Dimensão | Nota | Uma linha |
|---|---|---|
| Evidência e rigor | 9,5 | Comportamento contra auto-relato, procedência em tudo, honestidade sobre limite de amostra. |
| Voz e ownership | 9,0 | 34 verbos em 1ª pessoa do passado contra **um** "a gente". |
| Narrativa e estrutura | 8,0 | Os quatro atos funcionam. Perde por não ter atalho de 3 min e por 4 h2 burocráticos. |
| Acessibilidade | 7,5 | Contraste, foco e reduced-motion bem resolvidos. Perde nos 264 elementos < 14px. |
| Motion | 6,5 | Bem construído. Perde por 5 curvas contra a própria tese, e por um reveal que não dispara. |
| Ritmo e esforço do leitor | 4,5 | 41 telas, 3.995 palavras, ~20 min, 35 CPL. |
| Acabamento e consistência | 4,5 | Título invisível, "seis" com nove passos, duas molduras vazias abrindo um módulo. |
| Apresentação do design final | 4,0 | A V1 aparece a 976px e a V2 a 282px. O clímax não tem zoom. |

## Os números que sustentam tudo

Medidos em 1440x900, com os reveals forçados a `opacity: 1` para não
medir estado de transição.

| Medida | PCYES | Outros capítulos |
|---|---|---|
| Altura do documento | **37.030px** | 9.234 a 11.504px |
| Telas de rolagem | **41,1** | 10,3 a 12,8 |
| Palavras | **3.995** (~20 min) | 654 a 1.102 |
| h2 | 19 | 6 a 8 |
| Telas de projeto | 27 | **4 a 6** |

**Escala das 27 imagens de projeto** (viewport 1440):

| Onde | Largura | % da tela |
|---|---|---|
| `s4`, `s2` dentro de `solucao` (o clímax) | **282px** | 20% |
| `prevenda`, `contador`, `sidecart`, `points` | **240px** | 17% |
| Maioria das telas da V2 | 543px | 38% |
| **`v1-home`** (a V1 criticada) | **988px** | 69% |
| **`v1-vitrine`**, **`v1-carrinho`** | **976px** | 68% |

> **O achado central:** a V1 que o capítulo critica é mostrada em 976 a
> 988px; a V2 que o Gabriel desenhou é mostrada em 240 a 543px. A régua
> está invertida.

**Leiturabilidade**: `.beat-p`, o parágrafo principal, mede **295px com
fonte de 17px = ~35 caracteres por linha**, e é usado 19 vezes. Mediana
do capítulo: 40 CPL, com 25 de 46 blocos abaixo de 45. A faixa
confortável é 45 a 75. O `line-height` (1,62) está certo; a largura não.
No mobile a mediana cai para 32 CPL.

**Tipografia miúda**: 264 elementos de texto visíveis abaixo de 14px.
Distribuição: 9,5px (1), 10px (26), 10,5px (24), **11px (80)**, 12px
(53), 12,5px (22), 13px (37), 13,5px (15).

**Motion**: 5 curvas de easing em uso (`ease` na camada decorativa
`organic`, `0.2,0.9,0.1,1` em 129 elementos, `0.16,1,0.3,1` em 42,
`0.72,0.02,0.28,1` em 29, `0.4,0,0.2,1` em 1) num capítulo cujo beat de
Design System argumenta **"uma curva só, para tudo que se move"**. A
curva defendida é a quarta mais usada.

## O que é bom e não se mexe

- **Comportamento contradizendo auto-relato**: 182 cliques em fechar
  contra 5 em comprar. O sinal senior mais escasso que existe.
- **O reenquadramento da busca como letramento**, não como bug de motor.
  É tese sobre o usuário. Melhor parágrafo do volume.
- **Ownership**: 34 verbos em 1ª pessoa ("assisti", "levei", "propus",
  "recusei", "fui atrás") contra 1 "a gente". Quase todo portfólio
  dissolve a pessoa no "nós"; este não.
- **"O que eu recusei"**: trade-off nomeado.
- **Honestidade sobre evidência**: "prefiro não apresentar número que não
  existe".
- **Dado desenhado, não printado**, com `fonte` e `nota` em cada painel.
- **Acessibilidade de base**: 0 falha real de contraste na varredura;
  focus ring de 2 a 3px visível nos 14 primeiros Tabs; skip link;
  `prefers-reduced-motion` tratado em 14 pontos do CSS.

**Sobre "cara de IA": não tem.** 0 travessões, 0 construções "não é X, é
Y", frase média de 18,6 palavras, vocabulário idiomático. O que existe é
um **maneirismo**: 60 dois-pontos explicativos em ~250 frases, mais
"deixou de / passou a" 14 vezes e "em vez de" 10 vezes. Não é máquina, é
tique, e ele fica previsível no Ato III.

## O que está fraco, por impacto

### 1. A abertura do Design System não renderiza (DEFEITO)

Varredura da página inteira em passos de 180px, registrando a opacidade
máxima que cada painel atinge **enquanto está na faixa de leitura**:
13 dos 14 painéis chegam a 1,0. **O painel 6 chega a 0,0.**

Some o kicker "ANTES DAS TELAS", o h2 "A V1 tinha cores. A V2 tem um
sistema que sabe o que cada cor faz" e os dois parágrafos. O leitor cai
direto numa tabela de swatches sem explicação, com o terço esquerdo da
tela vazio.

Causa: é a armadilha nº 3 do HANDOFF. O pai é `.c5 .text-col` (coluna
presa), a faixa de reveal já passou quando ela gruda, e `.in` nunca
chega. Os outros módulos forçam `opacity: 1`; `sistema` não forçava.

### 2. A régua de tamanho está invertida, e o clímax não tem zoom

Ver a tabela de escala acima. Agravante medido: das 27 imagens, 18 abrem
em zoom. Das 9 que não abrem, 6 são o antes/depois (é slider, e está a
976px, tudo bem). **As outras 3 são exatamente as telas da `solucao`** —
as menores do capítulo e as únicas de conteúdo sem lupa nenhuma.

E a lupa tem `font-size: 10px` com **`opacity: 0` em repouso**: só existe
no hover, e não tem `tabindex` nem `role`. O recurso é bom; a descoberta
dele depende de um gesto que ninguém garante.

> Registro de correção de rumo: a primeira versão desta auditoria dizia
> que "o recrutador não consegue avaliar o UI". Isso foi **forte demais**
> e foi escrito antes de testar a lupa. Quantidade nunca foi o problema:
> são 27 telas, 18 com zoom, mais link de protótipo e de design system. O
> problema é a escala no lugar do pagamento, e a descoberta do zoom.

### 3. "As seis correções" tem nove passos

Título: "As seis correções que encurtaram o caminho". Corpo: "Estas seis
são o que foi preciso mexer". EN: "These six are what had to change".
Array `passos`: **nove** itens. A régua de progresso desenha nove traços,
então dá para contar a contradição na tela.

### 4. O leitor não aguenta a distância

41 telas contra 10 dos outros capítulos. O índice lateral está bom, mas é
lista de 15 seções, não atalho: não tem "ver só o que mudou", não tem
tempo estimado.

### 5. h2 inconsistentes

Onze carregam argumento ("A loja cobrava ortografia para deixar
comprar"). **Três** eram rótulo burocrático na página: "As decisões", "A
solução" e "Antes e depois". ("Os módulos" existe só como rótulo de
índice, onde curto está certo: não é h2 de página.) Quem lê só os
títulos, que é o comportamento real de recrutador, encontrava buraco nos
beats finais.

### 6. Miudezas

- ~~2 imagens sem `alt`~~ **FALSO POSITIVO.** Os dois `bp-logo` têm
  `alt=""` dentro de um `<span aria-hidden="true">`, que é o padrão certo
  para imagem decorativa. A varredura contava string vazia como ausente.
  Nenhuma imagem do site está sem o atributo. Não procurar de novo.
- `buscaV2` e `popup` são os passos 1 e 2 de "O acabamento": o módulo
  abre em duas molduras vazias empilhadas.

## A maior oportunidade perdida

O capítulo prova, com folga, que o Gabriel **pensa** bem. Prova menos que
ele **desenha** bem, e a vaga é UX/UI. O conserto não é escrever mais: é
dar ao trabalho dele o mesmo tamanho que ele deu ao trabalho que criticou.

## Lista priorizada

**Rodada A (aprovada em 2026-08-26)**
1. Fazer a abertura do Design System aparecer.
2. Corrigir "seis" para "nove", PT e EN.
4. Aumentar as telas da `solucao`.
6. Alargar `.beat-p` de 295px para a faixa de 45 a 75 CPL.
7. Subir o piso tipográfico de 10 e 11px.
8. Reescrever os quatro h2 burocráticos.

**Rodada B (depois, decisão do Gabriel)**
- Ritmo e leiturabilidade em geral: é projeto à parte, e o Gabriel já
  disse que exige esforço considerável. Não atacar por partes.
- Atalho de 3 minutos dentro do capítulo (`solucao` + `antesDepois` +
  `resultado`), que não é o `#/rapido` global.
- Unificar as curvas de motion nos componentes de conteúdo.
- Quebrar uns 20 dos 60 dois-pontos.
- ~~Zoom nas telas da `solucao` e lupa visível sem hover.~~ **feito** na
  rodada de escala, abaixo.
- Os quatro prints pendentes.

## Registro de execução · escala e descoberta (Grupo B)

Executada em 2026-08-26 sobre `fb823c9`. Tudo medido na página servida,
em 1440x900, com os reveals congelados. É o Grupo B do HANDOFF: a escala
das telas e o zoom no clímax. O Grupo A (ritmo) não foi tocado.

**O achado técnico que ninguém tinha visto:** `.sol-grid` era um grid de
12 colunas com calha `var(--gutter)` (57,6px) dentro de um pai de 549px.
Onze calhas somam 633,6px, então as colunas `1fr` colapsavam a zero e o
painel spanando `1 / -1` media **634px dentro de um pai de 549**,
vazando 85px para fora da coluna. Os "628px" registrados na Rodada A eram
esse vazamento, não uma medida de layout. Agora a largura é declarada.

| Item | Antes | Depois |
|---|---|---|
| Telas de produto abaixo de 600px | **21 de 27** | **0** |
| `prevenda`, `contador`, `sidecart`, `points` | 240px (17%) | **600px (42%)** |
| Telas dos módulos e dos passos | 543px (38%) | **600px (42%)** |
| Telas da `solucao` (o clímax) | 628px (44%), por vazamento | **1033px (72%)** |
| Imagens com zoom | 18 de 27 | **21 de 27** |
| Zoom no clímax | **0 de 3** | **3 de 3** |
| Lupa em repouso | `opacity: 0` | `opacity: 1` |
| Contraste da lupa | não se via | **17,87:1** papel · **16,11:1** tinta |
| Altura do documento | 36.420px | **39.302px** (+7,9%) |

**O que mudou, em três decisões:**

1. **A margem cede, o texto não.** A coluna de provas mede 549px em 1440
   e estreitar o texto está fora de questão (a linha já mede 44
   caracteres, no piso da faixa). Então a coluna de provas passou a
   avançar sobre a margem **direita** da página, por `--sangra-dir`. Só a
   direita: a esquerda é onde mora o índice. A sangria é declarada por
   faixa de viewport e vale 0 abaixo de 1240px, uma calha na faixa do
   índice deslocado e `(100vw - 1240px) / 2` acima de 1700.
2. **O clímax toma a página.** As telas da `solucao` saíram da coluna de
   provas e ocupam as doze colunas mais a sangria: 1033px em 1440. A V1
   criticada aparece a 976px no antes/depois, então a régua deixou de
   estar invertida onde ela era comparável.
3. **O par de telas deixou de ser par de selos.** `.mod-figs.grade` punha
   duas telas lado a lado dentro da coluna: 240px cada. Empilhadas, cada
   uma vale a coluna inteira.

E a lupa passou a existir em repouso, invertendo para tinta no hover e no
foco. O alvo continua sendo o botão `.fig-abrir`, que já estava na ordem
de tabulação com rótulo próprio: o que faltava não era acesso, era aviso.

**Verificação.** 1920, 1700, 1440, 1280, 768 e 390: `scrollWidth ==
clientWidth` nos seis, **0 `pageerror`**, nenhum elemento vazando a borda
direita. **axe (wcag2a + wcag2aa): 0 violação** em 1440 papel, 1440
tinta, 1440 EN e 390. Varredura de reveal em passos de 90px: os **39**
painéis chegam a opacidade ≥ 0,95 na faixa de leitura, nenhum morto. A
medida das legendas alargadas ficou em 58 a 65 CPL, dentro da faixa. O
lightbox abre a partir do clímax, com `role="dialog"`, `aria-modal` e
fecha no Esc; em EN a lupa lê "+ ZOOM" e são os mesmos 21 botões.

Os outros quatro capítulos herdaram a mesma régua: `odex`,
`oderco-revenda`, `portfolio` e `locarmais-conciliacao` passaram a
mostrar a `solucao` a 1033px, com zoom. No Locar Mais os prints em
retrato usam `meia` e ficam a 485px de largura por 647 de altura, que é o
tamanho certo para um 3:4.

No mobile a régua já era outra e continua: em 390px, **26 das 27**
imagens ocupam a coluna inteira (344px de 350).

### Nota depois da rodada de escala

| Dimensão | Antes | Depois | Por quê |
|---|---|---|---|
| Apresentação do design final | 5,5 | **7,5** | Nada de produto abaixo de 600px, clímax a 1033px, zoom nas três telas que não tinham. |
| Acessibilidade | 8,5 | **9,0** | A lupa deixou de depender de um gesto que ninguém garante. |
| Ritmo e leiturabilidade | 5,5 | **5,0** | Tela maior é página mais alta: 40,5 telas de rolagem viraram 43,7. |
| Evidência, voz, narrativa, motion, acabamento | iguais | iguais | Não foram alvo. |

**O que ainda segura a apresentação em 7,5, e não em 9:** a abertura da
V1 é uma `CenaScroll` que abre em 82% da tela, perto de 1180px, e o
clímax da V2 para em 1033px. Para empatar de vez, as telas da `solucao`
teriam que sangrar em `100vw` como a cena da V1 sangra. Isso é decisão
visual do Gabriel, na tela dele, e não foi tomada aqui.

## Registro de execução

Rodada A, executada em 2026-08-26. Tudo verificado **medindo na página
servida**, não por print.

| Item | Estado | O que mudou, medido |
|---|---|---|
| 1. Abertura do DS visível | **feito** | `.beat-sistema .text-col .panel.text { opacity: 1 }` em `chapter.css`. Painéis que não acendem na faixa de leitura: **1 → 0**. O painel 6 vai a `maxOp 1,0`. |
| 2. "seis" → "nove", PT e EN | **feito** | `data.jsx` (título e corpo) e `i18n.jsx`. Bate com os 9 de `passos` e com os 9 traços da régua. |
| 3. `alt` nos `bp-logo` | **cancelado** | Falso positivo da varredura. Ver acima. |
| 4. Telas da `solucao` maiores | **feito** | `meia` removido dos shots. **282px → 628px** (44% da tela, +123%). As três ficaram iguais em 628x390. |
| 6. `.beat-p` mais larga | **feito** | Padding horizontal do `.panel.text` a 0 e `max-width` de 46ch para 62ch. `.beat-p` **295px → 375px, ~35 → ~44 CPL**. Mediana do capítulo 40 → 43. |
| 7. Piso tipográfico | **feito** | 81 regras em `app.css`, `chapter.css` e `kit.css`. Elementos abaixo de 12px: **133 → 0**. |
| 8. h2 burocráticos | **feito** | Três, não quatro. "As decisões" → "O que o projeto passou a defender"; "A solução" → "O caminho de compra, do começo ao fim"; "Antes e depois" → "A mesma dobra, dois sites". EN junto. |

**Regressões: nenhuma.** Verificado em 1440, 1700, 768 e 390: sem scroll
horizontal (`scrollWidth == clientWidth` nos quatro), **0 `pageerror`**,
0 falha real de contraste (as duas que a varredura aponta são os kanji
decorativos em `rgba(0,0,0,0)`, e já eram assim antes). Altura do
documento 37.030px → 36.420px.

### Nota depois da Rodada A: **8,0** (era 7,4)

| Dimensão | Antes | Depois | Por quê |
|---|---|---|---|
| Acabamento e consistência | 4,5 | **7,0** | Título invisível e "seis"/nove resolvidos. Seguram as duas molduras vazias de "O acabamento". |
| Acessibilidade | 7,5 | **8,5** | Nada mais abaixo de 12px. |
| Apresentação do design final | 4,0 | **5,5** | O clímax dobrou de tamanho. Mas a mediana das telas da V2 continua 543px contra 976px das da V1, e a `solucao` continua sem zoom. |
| Ritmo e leiturabilidade | 4,5 | **5,5** | 35 → 44 CPL no parágrafo principal. Mas ainda são 40 telas de rolagem. |
| Narrativa e estrutura | 8,0 | **8,5** | Os três h2 finais passaram a carregar argumento. |
| Evidência, voz, motion | 9,5 / 9,0 / 6,5 | iguais | Não foram alvo desta rodada. |

O que ainda segura a nota, em ordem: o **ritmo** (40 telas, ~20 min), a
**escala das telas da V2 fora da `solucao`**, e o **motion com cinco
curvas** contra a tese do próprio capítulo. Os três estão na Rodada B.

## Como reproduzir a medição

```bash
npm run build
cd dist && python3 -m http.server 8788 --bind 127.0.0.1
# Playwright: ~/.npm/_npx/*/node_modules/playwright (o hash muda por máquina)
# rota: http://127.0.0.1:8788/#/cap/pcyes   (é #/cap/, não #/capitulo/)
```

Para medir sem estado de transição, injete antes de medir:

```css
*,*::before,*::after{animation:none!important;transition:none!important}
.beat .panel,.panel{opacity:1!important;transform:none!important}
```

Filtre `_vercel/` do console: 404 local é esperado, não é regressão.
