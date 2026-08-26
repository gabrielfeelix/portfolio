# Auditoria do portfólio + plano de revisão

> Auditoria feita em 2026-08-26 sobre o commit `f860d61`, calibrada para
> **mid**. Documento de trabalho: a Parte 1 é o diagnóstico e não muda; a
> Parte 2 é o plano do PCYES e vai sendo riscada conforme executa.
>
> **Ressalva de escopo:** nada aqui avalia composição visual, peso, motion
> ou "se a página parece boa". Screenshot deste site captura estado
> intermediário (`.beat .panel` nasce em `opacity: 0`, `CenaScroll` cresce
> ao longo de 1900px de trilho, `ModuloPassos` troca texto em meio à
> rolagem), então julgar craft por fotograma de transição enviesa para o
> negativo. Julgamento visual continua sendo do Gabriel, na tela dele.

---

# PARTE 1 · Diagnóstico

## Veredito

**Passa numa triagem para mid com folga. O problema não é o nível do
trabalho: é que a embalagem está calibrada abaixo do que o trabalho
demonstra.**

O PCYES lê senior por três sinais concretos:

- **Comportamento contradizendo auto-relato.** 182 cliques em fechar o
  pop-up contra 5 em comprar. Não perguntou se incomodava: mediu.
- **Reenquadramento de achado.** "mause" devolvia tela vazia. A leitura
  fácil é "bug de busca"; a leitura feita foi **letramento** — exigir
  ortografia exata numa loja de hardware escolhe um público e dispensa o
  resto. É tese sobre o usuário, não ticket.
- **Decisão rastreável ao dado.** Pop-up só após 15% de rolagem e busca
  tolerante a erro apontam para trás, para o número que as gerou.

Somado a design system em uso (token semântico, não catálogo de swatch),
escopo alargado por iniciativa própria (ferramenta de SKU) e código em
produção.

**O que segura:** nenhum capítulo fecha com número amarrado ao problema;
a distribuição de peso entre capítulos está invertida; e há um defeito
funcional na página feita para o recrutador com pressa.

## O que está bom e deve ser preservado

| O quê | Onde | Por que funciona |
|---|---|---|
| Home põe o trabalho na frente | `Capa.jsx:450-462` | Ordem: hero → diferencial → **capítulos** → outras peças → quem sou. A maioria erra pondo bio ou social acima dos cases. |
| Índice já vende resultado | `Capa.jsx:225-253` | `ChapterBlock` mostra domínio, título, contexto e **Resultado** antes do clique. Decisão informada, não thumbnail. |
| Dado desenhado, não printado | `painel`, `funil`, `gesto` | Print de dashboard é foto de ferramenta. Número desenhado é argumento. E cada painel carrega `fonte` + `nota` do que a amostra sustenta e do que não sustenta. |
| Vocabulário do Locar Mais | `data.jsx:561-572` | Cinco status que fixaram linguagem e acabaram com ambiguidade em conversa de time. Trabalho de designer sênior. |
| "Forçar conciliação exige motivo" | `data.jsx:541` | Exceção do processo virou dado estruturado. Melhor decisão de produto do volume. |
| Honestidade sobre limite de evidência | `data.jsx:574` | "Não tenho medição formal de antes e depois". Demarcar o que não se sabe aumenta confiança. |
| Sistema de espaço e tipo | `colors_and_type.css:99-127` | `--ma-1..7` em progressão quase Fibonacci, tipo fluido em `clamp`. Sistema, não escolha por tela. |

## O que está fraco, por impacto

### 1. A leitura rápida tem célula vazia nos 5 capítulos — DEFEITO

`Rapido` renderiza três células: Papel, **O quê**, Resultado
(`app.jsx:83-86`). Mas `tldr.oque` **não existe em nenhum capítulo** — só
em `data.jsx:1018`, que é o template de projeto novo. Todos definem
apenas `papel` e `resultado`.

A célula "O quê" sai vazia cinco vezes na página anunciada como *"Sem
tempo? O volume em 2 minutos"*. É a página do recrutador apressado.

### 2. Nenhum capítulo fecha com número amarrado ao problema

| Capítulo | `fact` atual | Problema |
|---|---|---|
| PCYES | "Caminho de compra encurtado e checkout reconstruído a partir de gravação de sessão" | Descreve o que foi feito, não o que mudou. Particípio, não outcome. |
| Locar Mais | "Substituiu ferramenta externa e eliminou planilhas paralelas" | **Este está certo.** É o modelo. |
| Odex | "No ar a tempo da feira" | Prazo cumprido é logística, não efeito de design. |
| Oderço | "Reduziu de três para dois os sistemas do comercial" | Bom, mas apresentado como nota de rodapé. |

O padrão do Locar Mais é o correto e já está dominado: três mudanças de
comportamento verificáveis no lugar do número ausente. **Não inventar
número lá.** O PCYES não pode ter número (publica em outubro/2026), mas
precisa desse enquadramento em vez do particípio.

### 3. Distribuição de peso invertida

PCYES **16 beats** · Locar Mais 6 · Odex 5 · Oderço 5.

O case central é o primeiro **e** o mais longo. Quem lê na ordem gasta a
atenção inteira no Cap. 01 e chega no Cap. 03 exausto, e o Cap. 03 é o
mais magro.

Agrava: o `#/rapido` é global (resolve escolha *entre* capítulos, não
*dentro* de um). No PCYES é 16 beats ou nada. E o `IndiceCapitulo`, que
seria o atalho interno, **só aparece em 1700px+ — na tela de 1440px do
Gabriel não aparece**. No laptop do recrutador médio, o capítulo mais
denso do volume não tem navegação interna.

### 4. O melhor resultado do volume está enterrado

Oderço (`data.jsx:684-688`): foi atrás da API do RD Station, documentou,
mostrou ao time de dev que a integração era mais simples do que parecia,
eles conectaram RD ao CRM, e **a empresa eliminou um de três sistemas do
processo comercial**.

Influência entre times e mudança organizacional partindo de um designer:
o sinal senior mais escasso. Está no terceiro parágrafo de um capítulo de
5 beats, no Cap. 04. "O resultado que eu não tinha previsto" é modéstia
que custa caro — o leitor médio não reconhece sozinho.

### 5. O Odex pede desculpa antes de argumentar

"Este é um projeto de redesign visual (...) Não redesenhei a lógica"
(`data.jsx:606`) chega **antes** do argumento, que é bom e está logo
abaixo: "mudar a aparência sem mudar o percurso é a diferença entre
modernizar e atrapalhar". O `aprendi` fecha melhor do que o capítulo
abre — "redesign de legado é mais exercício de contenção que de criação"
deveria governar o capítulo, não encerrá-lo.

### 6. Placeholders e figuras pendentes

Quatro figuras do PCYES sem `src` (`buscaMouse`, `buscaMause`,
`buscaV2`, `popup`) caem em `MangaPlate`. A solução é honesta e foi
decisão certa. Mas `buscaMouse` e `buscaMause` sustentam o **achado da
busca**, o melhor momento do melhor case: o argumento do letramento fica
sem prova visual justo onde mais convence.

Há ainda `[assim]` renderizados por `PH` (`data.jsx:26-28`), confirmados
pelo README.

### 7. Cinco violações de contraste conhecidas

Do handoff: `.cit-f > span` e `.cam-n` (#e4231b sobre #0a0a0a = 4,29:1,
precisa 4,5) e `.db-n`/`.cam-n` claro (#b4afa3 sobre #f6f3ec = **1,97:1**).
O 1,97:1 é severo. Padrão de correção já existe no repo
(`--vermilion-ink`, `--wash-3`, `--vermilion-lift`).

## A maior oportunidade perdida

**O volume nunca declara que o PCYES é o case central.**

Os cinco são apresentados como pares: mesma estrutura de bloco, mesma
promessa, numeração sequencial que sugere equivalência. O leitor precisa
*descobrir* qual é o principal gastando 16 beats. E quem abrir pelo Odex
(5 beats, "no ar a tempo da feira") forma opinião a partir do case mais
fraco — opinião formada cedo raramente se revisa.

Não se resolve cortando os outros. Resolve-se **nomeando** o principal e
deixando os outros serem evidência de amplitude: SaaS financeiro, legado,
aquisição, autoral. Quatro superfícies é ativo, desde que nenhuma finja
competir com a principal.

## Lista priorizada

**Alto impacto, esforço baixo**
1. ~~Preencher `tldr.oque` nos 5 capítulos~~ **FEITO** (`192f838`), PT e EN.
2. ~~Reescrever o `fact` do PCYES~~ **FEITO** (`192f838`). Direção escolhida
   pelo Gabriel: a decisão que virou a mesa. "Contrariei o briefing com
   gravação de sessão na mão, e a direção oposta foi a aprovada."
3. Promover o resultado do Oderço para a abertura do `resultado`.
4. ~~Corrigir as 5 violações de contraste~~ **FEITO por outro agente**
   (`e45aca3`): fechou as 5 do handoff e mais `.cover-k`, `.cover-ficha`,
   `.cal-k`, `.cal-dow`, `.ad-punho`, `.ad-tag-d`. 0 violação em
   1920/1700/1440/768/390, nos dois modos.

**Alto impacto, esforço médio**
5. ~~Decidir e expressar a hierarquia dos capítulos~~ **DECIDIDO + FEITO**
   (`192f838`). O Gabriel confirmou: **PCYES é o principal e continua
   Cap. 01**. O sumário passa a marcar com o selo "Capítulo principal"
   (`chap.principal` em `data.jsx`, `.rvm-main` em `RevealMask.jsx`).
6. ~~Resolver o `IndiceCapitulo` em 1440px~~ **FEITO por outro agente**
   (`e45aca3`): em vez de estreitar a leitura, o corpo sai do centro e
   anda para a direita; a sobra vira a coluna do índice, e a partir de
   1530px a coluna volta inteira.
7. Inverter a abertura do Odex: argumento primeiro, ressalva depois.

**Médio impacto**
8. Os quatro prints pendentes do PCYES (`buscaMouse` e `buscaMause` primeiro).
9. Varrer os `[assim]` restantes.

**Deixar quieto**
- Não inventar número para o Locar Mais. É o modelo, não o problema.
- Não cortar beats do PCYES para "equilibrar". O problema é falta de
  atalho, não excesso de argumento.

---

# PARTE 2 · Plano de revisão do PCYES

## O diagnóstico da ordem

Ordem atual, 16 beats:

```
abertura → problema → painel → funil → gesto → investigacao → busca
→ citacao → decisoes → recusei → sistema → modulos → solucao
→ calendario → antesDepois → resultado → aprendi
```

O Gabriel identificou o sintoma: *"falei das soluções dos problemas já
colocando a foto do resultado de cada problema, só depois fui falar do
DS, aí falei de outras coisas no meio"*. Está certo, e a causa é
estrutural.

### Causa 1 · `decisoes` é um segundo capítulo disfarçado de lista

`decisoes` tem **10 itens**, cada um com figura acoplada (`fig:`). Não é
uma lista de decisões: é o case inteiro resolvido de uma vez. Busca,
pop-up, checkout, carrinho, preço, home, quickview, SKU, contraste,
VLibras — problema, razão e prova, dez vezes seguidas, no mesmo ritmo
visual.

Consequências:

- **O clímax acontece no meio.** Quando o leitor chega em `solucao`, já
  viu tudo. `solucao` vira resumo do que já foi mostrado, e por isso
  sobrou com 1 slot e uma legenda.
- **Não há respiro.** Dez blocos de mesma forma seguidos achatam o
  relevo. A decisão do VLibras (custou pouco, mudou quem a loja atende) e
  a do preço fixo (correção de usabilidade) chegam com o mesmo peso.
- **A prova é gasta cedo.** As figuras `checkout`, `vitrine`, `preco` e
  `home` já foram usadas dentro de `decisoes`, então `antesDepois` e
  `solucao` chegam sem munição nova.

### Causa 2 · o arco de investigação é longo demais antes da primeira resposta

Do `abertura` até `citacao` são **8 beats sem nenhuma solução**:
abertura, problema, painel, funil, gesto, investigacao, busca, citacao.
Metade do capítulo é diagnóstico. É um material excelente, mas o leitor
fica meia dúzia de minutos sem ver nada sendo resolvido.

### Causa 3 · a régua de tempo está fora de lugar

`calendario` (a data de outubro) aparece **entre** `modulos` e
`antesDepois`. Ele é informação de status do projeto, não beat narrativo,
e corta o caminho entre a prova e a comparação final.

### Causa 4 · `sistema` está no lugar certo, mas isolado

A decisão de 2026-08-26 (DS depois das decisões, antes dos módulos) está
correta e **não deve ser relitigada**: o argumento é de ordem — o
vocabulário vem antes das telas, e cada tela vira prova de que o sistema
funciona.

O problema não é a posição, é que `sistema` chega depois de dez decisões
já provadas com figura. O DS deveria explicar *como* as telas seguintes
foram construídas, mas as telas já vieram antes dele, dentro de
`decisoes`.

**Conclusão:** o capítulo não precisa de menos conteúdo. Precisa que as
provas parem de ser gastas antes da hora.

## A ordem proposta

Quatro atos, com respiro declarado entre eles.

```
ATO I · A CENA E O BURACO
  1. abertura      a cena, o pedido estético, a recusa de desenhar antes
  2. problema      os três pedágios
  3. painel        o tamanho: 166.267 sessões, 273 pedidos, 0,16%
  4. funil         onde parava: 1.705 na home, 27 no checkout
                   ── respiro ──
ATO II · O QUE O DADO DISSE
  5. gesto         182 cliques em fechar contra 5 em comprar
  6. busca         o achado que ampliou o escopo (letramento)
  7. investigacao  gravação no lugar de opinião
  8. citacao       a frase que virou a reunião
                   ── respiro ──
ATO III · COMO EU RESOLVI
  9. recusei       o que ficou de fora, de propósito
 10. sistema       o vocabulário, antes das telas
 11. decisoes      ENXUTA: 4 a 5 decisões-âncora, sem figura
 12. modulos       as provas, com as figuras que eram de `decisoes`
                   ── respiro ──
ATO IV · O QUE MUDOU
 13. solucao       a síntese, agora com prova nova
 14. antesDepois   V1 e V2 no mesmo enquadramento
 15. resultado     o que mudou + calendário embutido
 16. aprendi       o fecho
```

### O que muda, concretamente

**a) `decisoes` perde as figuras e encolhe para 4 ou 5 âncoras.**

As dez decisões atuais se dividem em dois tipos:

| Tipo | Decisões | Para onde vão |
|---|---|---|
| **Âncora** (mudam a tese do projeto) | busca tolerante, pop-up após 15%, pagamento na primeira dobra, comprar do card | Ficam em `decisoes`, **sem figura**, como argumento puro |
| **Execução** (implementam a tese) | preço visível, home a produto, quickview, SKU, contraste, VLibras | Viram passos de `modulos`, **com** as figuras |

Isso resolve as três consequências de uma vez: `decisoes` volta a ser
lista de decisões, o relevo aparece (âncora ≠ execução), e a prova
visual é gasta em `modulos`, no lugar onde ela sustenta.

**b) `calendario` sai do meio e entra em `resultado`.**

É status de projeto. O lugar dele é junto do "entra em produção em
outubro", não cortando o caminho entre prova e comparação.

**c) `solucao` recupera função.**

Hoje é resumo do que já foi mostrado. Com as figuras concentradas em
`modulos`, `solucao` volta a ser a síntese: marca presente, produto no
eixo, e o mobile como prova de que a regra vale nas duas telas.

**d) Os respiros são explícitos.**

Três pontos de silêncio, entre os atos. Já existe vocabulário para isso
no CSS: `--ma-6` está comentado como *"the held silence before a reveal"*
e `--ma-hold` (380ms) como *"the pause before a reveal resolves"*. O
respiro não é espaço vazio: é a pausa antes de virar o ato.

### Os atalhos

Três níveis de leitura, para três leitores:

1. **30 segundos** — `#/rapido`, já existe. Precisa do `tldr.oque` preenchido.
2. **3 minutos** — os quatro títulos de ato + `antesDepois` + `resultado`.
   É o que o `IndiceCapitulo` deve entregar, e é o que hoje não existe em
   1440px.
3. **Completo** — os 16 beats na ordem acima.

O nível 2 é o que falta. E depende de uma decisão pendente do Gabriel
(ver Pendências).

## O material que ainda falta

### Prints pendentes (só o Gabriel pode dar)

| Chave | O que é | Prioridade | Por quê |
|---|---|---|---|
| `buscaMouse` | V1 buscando "mouse", devolvendo mousepad | **Alta** | Sustenta o achado da busca, melhor momento do case |
| `buscaMause` | V1 buscando "mause", tela vazia | **Alta** | Idem, é a prova do argumento de letramento |
| `buscaV2` | V2 sugerindo produtos e termos antes de digitar | Média | Prova da decisão-âncora |
| `popup` | Pop-up da V2 após 15% de rolagem | Média | Prova da decisão-âncora |

Precisa ser **arquivo em disco**. Imagem colada em chat não serve.

### FigJam e artefatos de descoberta

O handoff lista 10 artefatos da análise inicial: mapa do site, inventário
de telas, personas, jornada, fluxos, taxonomia, microcopy, auditoria
heurística, service blueprint, wireflows.

**Recomendação: não entram todos, e a maioria não entra.**

O capítulo já tem 16 beats e o diagnóstico do Ato I e II já é o dobro de
denso do que a maioria dos portfólios mostra. Despejar 10 artefatos
transforma o case em processo teatral — o padrão de falha mais comum em
portfólio de UX, e o oposto do que este capítulo faz hoje de melhor
(dado desenhado que carrega argumento).

Critério para entrar: **o artefato mudou uma decisão?** Se sim, entra
junto da decisão que ele mudou. Se não, fica fora.

Pelo material lido, dois se qualificam:

- **Auditoria heurística** — se dela saiu algum dos três pedágios do
  `problema`, entra ali como origem, não como grade de 10 heurísticas.
- **Jornada ou wireflow do checkout** — se sustenta a decisão de pagamento
  na primeira dobra, entra em `modulos`, no passo do checkout.

Os outros oito viram **uma figura só**: uma vista do FigJam inteiro, em
`investigacao`, com legenda que carrega o argumento (o padrão do
capítulo: legenda argumenta, não descreve). Algo como "dez artefatos
antes da primeira tela" — prova de rigor sem cobrar dez beats do leitor.

### Vídeo

Fica para depois, e a ordem está certa: primeiro o capítulo fecha, depois
o vídeo conta. Vídeo sobre estrutura instável só multiplica retrabalho.

## Ordem de execução sugerida

**Rodada 1 — defeitos** *(nada estrutural, tudo verificável)*
1. `tldr.oque` nos 5 capítulos
2. Cinco violações de contraste
3. `fact` do PCYES reescrito

**Rodada 2 — a reordenação do PCYES** *(o grosso)*
4. Separar `decisoes` em âncoras (sem figura) e execuções (para `modulos`)
5. Mover `calendario` para dentro de `resultado`
6. Reescrever `solucao` como síntese com prova nova
7. Marcar os respiros entre atos

**Rodada 3 — os atalhos**
8. Decidir o `IndiceCapitulo` em 1440px
9. Títulos de ato no índice (o nível 2 de leitura)

**Rodada 4 — o material que falta**
10. `buscaMouse` e `buscaMause` em disco
11. A vista única do FigJam em `investigacao`
12. `buscaV2` e `popup`

**Rodada 5 — os outros capítulos**
13. Resultado do Oderço promovido
14. Abertura do Odex invertida
15. Hierarquia dos capítulos decidida e expressa

## Pendências que dependem só do Gabriel

Nenhuma destas deve ser decidida sem ele:

1. ~~**O PCYES continua Cap. 01?**~~ **RESPONDIDO:** sim, é o principal e
   fica no Cap. 01, com o destaque explícito no sumário.
2. ~~**`IndiceCapitulo` em 1440px.**~~ **RESOLVIDO** em `e45aca3`.
3. **Quais artefatos do FigJam mudaram decisão.** O critério está acima;
   a resposta é dele.
4. **Os quatro prints.** Só ele tem acesso à V1. Combinado: entram depois
   da rodada de reordenação.

## Registro de execução

| Rodada | Item | Estado | Commit |
|---|---|---|---|
| 1 | `tldr.oque` nos 5 capítulos, PT e EN | feito | `192f838` |
| 1 | `fact` do PCYES reescrito | feito | `192f838` |
| 1 | Contraste (5 + 6 violações) | feito (outro agente) | `e45aca3` |
| 1 | Selo de capítulo principal | feito | `192f838` |
| 1 | Índice em 1440px | feito (outro agente) | `e45aca3` |
| 2 | Reordenação do PCYES | **próxima** | |

### Armadilha desta rodada

`ChapterBlock`/`ChapterList` em `Capa.jsx` **são código morto**. Quem
desenha a lista de capítulos da home é `RevealImageMask`/`RevealChapters`
em `RevealMask.jsx` (`.rvm-*`), chamado pelo `Sumario` via
`<RevealChapters>`. O selo foi escrito primeiro no componente errado e
não renderizava. Antes de editar a home, confirmar quem o `Sumario`
chama de fato.

Segunda armadilha, do mesmo tipo: `--vermilion-lift` **não existe mais**.
O `e45aca3` trocou por `--vermilion-sobre-ink`, que é o token para fundos
que pintam `var(--ink)` e **invertem** com o tema. Para fundo `--paper`
o token certo é `--vermilion-ink`, que já vira sozinho (#B01510 no papel,
#F4695C sobre tinta). CSS com token inexistente não quebra o build: cai
no valor herdado e passa despercebido.
