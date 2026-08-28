# Pendências da revisão de texto

Coisas que a revisão encontrou e **não** resolveu, porque estão fora do escopo "só mexer em texto".

---

## 1. Quatro dos cinco capítulos não têm resultado medido

*(a pendência que você pediu para eu explicar melhor)*

### O mal-entendido

Você estranhou, e com razão: o portfólio **está cheio de número**. 166.267 sessões, 0,16% de conversão, 182 cliques contra 5, 71.416 buscas, 60% mais curto, 239 tokens, zero violação WCAG.

Só que todos esses números — menos o último — medem a **mesma metade da história**.

| | O que os números medem hoje | O que falta |
|---|---|---|
| `pcyes` | o tamanho do buraco (antes) | o que mudou depois de publicar |
| `locarmais` | — | medição formal antes/depois |
| `odex` | — | o efeito do redesenho |
| `oderco` | — | conclusão e abandono por etapa |
| `portfolio` | zero violação WCAG **(este mede o depois)** | — |

Você mediu o **problema** com rigor incomum. Você não mediu o **resultado** — porque na maioria dos casos ainda não dava para medir, e você diz isso, honestamente, em cada capítulo.

### Por que isso vira problema mesmo sendo honesto

Cada capítulo, sozinho, está certo. O efeito só aparece na **sequência**:

- `pcyes` fecha em *"Resultado de operação eu ainda não tenho."*
- `locarmais` fecha em *"Não tenho medição formal de antes e depois."*
- `odex` fecha em *"segue em andamento e o app está em protótipo."*
- `oderco` fecha em *"O lançamento é em etapas."*

Quatro finais seguidos dizendo a mesma coisa. Quem lê um capítulo vê integridade. Quem lê o volume inteiro sai com **"nada dele chegou a ser medido"** — que não é o que nenhum capítulo diz, e é o que os quatro dizem juntos.

Isso é o que eu chamei de efeito de conjunto: invisível capítulo a capítulo, óbvio na fila.

### Por que não dá para consertar escrevendo

As três saídas possíveis são todas fora do escopo desta revisão:

1. **Medir.** `pcyes` sobe em outubro/2026 e a lista do que será acompanhado já está escrita. Quando os números vierem, esse problema morre sozinho — é a solução de verdade, e é só esperar.
2. **Reordenar o volume**, para o capítulo que tem número medido (`portfolio`, zero violação) não ficar por último e por acaso. Isso é estrutura, não texto.
3. **Aceitar e assumir de frente**, dizendo uma vez só no volume — não em quatro finais — que os projetos são recentes e que a medição vem depois. Isso é a única das três que é texto, e mesmo assim mexe em onde as coisas moram, não em como estão escritas.

### Recomendação

Não escreva nada agora. **Espere outubro.** `pcyes` é o capítulo principal, tem a lista de métricas pronta, e um único capítulo fechando com resultado medido quebra o padrão dos quatro finais. É o melhor retorno possível e o custo é zero de escrita.

Se quiser agir antes disso, a opção 2 (ordem) rende mais que a 3 (redação).

---

## 2. "+2 · Anos na área" em bloco de destaque

`volume/Capa.jsx:495`

Bloco de estatística existe para carregar número que ajuda. Ao lado de "Projetos" e "No ar", "+2 anos" recebe o mesmo peso tipográfico e é o único dos três que argumenta contra você em vaga de pleno.

Não mexi: **é fato, e apagar fato não é revisão de texto.** A decisão de tirar o item do bloco é sua e é estrutural.

---

## 3. `odex` repete duas frases dentro do próprio capítulo

`volume/data.jsx`, capítulo 03. Duplicação quase literal:

- `investigacao.p[0]` ≈ `decisoes[4].r` — "Cada versão foi entregue/saiu como protótipo navegável, com comentários registrados em cima das telas, e ajustada antes da versão seguinte."
- `problema.p[0]` ≈ `achados[1]` — "a interface que envelheceu junto com o produto e passou a comunicar menos do que o negócio já entrega hoje" (e o título do beat diz a mesma coisa uma terceira vez).

Isto **é** texto e será corrigido quando a revisão chegar na página do `odex`. Registrado aqui só para não se perder.

---

## 4. O atalho de leitura do capítulo

`volume/Capitulo.jsx:76` — `irParaSec("solucao")`

Quem aceita "se você tiver 3 minutos" pula `painel`, `funil`, `gesto` e `busca` — os quatro beats que provam raciocínio — e cai em três telas com legenda.

Não mexi: o destino do atalho é uma linha de código, não texto. Mas é a correção de maior retorno por esforço do volume inteiro.
