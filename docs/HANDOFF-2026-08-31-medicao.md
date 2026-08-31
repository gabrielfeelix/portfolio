# Handoff — 31/08/2026, manhã e tarde

Sessão de medição, consentimento e desempenho. Dez commits, de `52bbf74` a
`caddaf0`, todos em `main` e no ar.

**Não substitui `docs/HANDOFF.md`**, que é da madrugada do mesmo dia e cobre
outra metade (capas de mockup, selo de status, abas do case). Os dois valem
juntos. Se conflitarem em algo, este é mais novo.

Há um terceiro documento vivo: `docs/HANDOFF-PRERENDER.md`, que é a tarefa
seguinte, ainda não executada. Leia-o quando chegar nela.

---

## 1. O que esta sessão fez

### Prévia de link (`52bbf74`)

Compartilhar o site mostrava a arte vermelha "VOLUME", da V1. Título e
descrição já eram os novos; só a imagem nunca tinha sido trocada.

O card novo está na linguagem da V2: papel branco, nome em Switzer display com
track de -0.055em, rótulo e domínio em Geist Mono, e o avião no accent. O avião
é o `AVIAO_D` de `site/motion.js` — o mesmo path que já voa no botão, na
rolagem e na cortina de página, não uma releitura.

O arquivo tem nome novo, `og-2026.png`, e isso é o ponto: redes sociais
cacheiam a prévia pela URL. A arte antiga (`og-image.png`) fica onde está
porque `legado-v1/` ainda a referencia.

Gerado por `tools/og-card.mjs`, a partir de `tools/og-card.html`. Ele aborta se
a Switzer não baixar, em vez de produzir um card em system-ui que só se
descobre depois de compartilhado.

**O WhatsApp pode continuar mostrando a antiga por dias.** O cache dele é da
URL da página, não da imagem, então trocar o nome do arquivo não ajuda. Para
forçar, compartilhe com um parâmetro: `…4yu.com.br/?v=2`.

### GA4 próprio (`e38ccf9`)

O site não media nada. Agora mede, em propriedade só dele:

| | |
|---|---|
| propriedade | Portfólio Gabriel Felix · `properties/552169302` |
| measurement ID | `G-5VPYQ2C9RT` |
| conta | `accounts/401450636` — Analytics - 4YU |
| retenção | 14 meses |

Separada da "Propriedade - 4YU" por regra do playbook do 4yu: uma propriedade
por produto. Misturar faria "usuários ativos" virar número que não responde
nada, e dado misturado não se separa depois.

**O `page_view` é manual**, do efeito de rota em `site/app.jsx`. O automático
está desligado dos dois lados — `send_page_view: false` no config e Enhanced
Measurement → page changes desligado no próprio fluxo de dados. Numa SPA o
automático dispara no history change, que é **antes** de o React atualizar
`document.title`: cada página entraria no relatório com o título da anterior, e
o relatório mentiria sem nunca dar erro.

O snippet vive em `analyticsSnippet()`, em `build.mjs`, junto do Vercel
Analytics e do Clarity. O slot `<!--ANALYTICS-->` já existia no template.

### Banner de consentimento (`8f94219`, `b2fca95`)

`site/consent.js`, Consent Mode v2, com default por região: EEE, Reino Unido e
Suíça negados até aceitarem; resto, Brasil incluído, concedido com recusa a um
clique. A LGPD não exige consentimento prévio para medir audiência — exige
transparência e saída fácil.

Três coisas que não são óbvias e não devem ser desfeitas:

- **`consent.js` é o único script síncrono do site**, e roda ENTRE o ID do
  Clarity e o gtag. Invertida a ordem, o GA4 dispara uma vez antes de saber a
  resposta e o banner vira enfeite.
- **O Clarity não é carregado até haver consentimento.** Ele grava a sessão
  inteira e não entende o Consent Mode, que é coisa de tag do Google. E
  recusar **para** o que já está rodando: chama `clarity('stop')` e apaga os
  cookies `_ga`/`_clck` que já existiam. Sem isso o botão prometia e não fazia.
- **O banner não aparece na hero**, a pedido do Gabriel: a home abre com a
  decolagem e a capa em vídeo, e uma caixa por cima queima a primeira
  impressão. Espera passar a primeira dobra, ou 25s para quem nunca rola — sem
  esse segundo gatilho, bastava ficar parado para nunca receber a escolha.

O `z-index` é **1200**, e o número é escolhido. O site esconde o ponteiro do
sistema e desenha o próprio, o `.v2-vento`, em 1300. Com o banner acima disso,
não havia cursor visível nenhum sobre ele — dava a impressão exata de o mouse
passar por baixo, e mirar o botão virava adivinhação (`b2fca95`).

Os dois botões têm a mesma área, 166x41 medidos. O "Aceitar" não é vermelho:
`tokens.css` reserva o accent para grafismo, branco sobre ele raspa o AA com
4,51:1, e um botão vibrante ao lado de um apagado desequilibra a escolha mesmo
com as áreas iguais.

O rodapé ganhou "Medição", que reabre o banner. Revogar precisa ser tão fácil
quanto consentir.

### Dado de cliente fora do repositório (`aee87a8`)

`docs/analise-v1-2.md` traz receita, contagem de pedidos, ticket médio e número
de pedido do PCYES. Este repositório é público. O arquivo nunca chegou a ser
commitado — conferido com `git log --all` — e agora está no `.gitignore`, com o
padrão `docs/analise-v1-*.md`.

Vale a lição do Traxium, no handoff da madrugada: peça escondida não é peça
privada. Arquivo no repo é arquivo publicado.

### O case da V1.2 ganhou resultado (`c1b78a4`, `f0e4faf`)

O capítulo do PCYES tinha 21 minutos e nenhum resultado de operação. O bloco de
resultado dizia "prefiro não apresentar número que não existe" — verdade quando
foi escrito, falsa desde julho: a V1.2 está no ar e mediu.

O que entrou, escolhido por resistir a contestação e não por ser grande:

| resultado | número |
|---|---|
| erro de script no checkout | 57,9% → 48,9% |
| adição ao carrinho por produto visto | +28% · z = 5,40 |
| pedidos no cartão concluídos | 51/51, zero cancelados |
| mediana do ticket no cartão | R$ 425 → R$ 812 |

**O que ficou de fora, de propósito**, e não deve voltar: site 4x mais rápido,
rejeição de 55% para 34%, duração de sessão, engajamento. Todos co-ocorrem com
9 de julho — o dia em que o tráfego automatizado sumiu, 76% menos sessões e
servidor 4x mais rápido no mesmo dia — e não com o deploy de 17 a 24.

**E o apagão do cartão continua sendo diagnóstico, nunca resultado.** É o
número mais forte que existe sobre essa loja (39 dias sem nenhum pedido no
cartão, p = 2,6 × 10⁻⁷, ~R$ 14 mil) e o que menos pode ser reivindicado: ele
termina em 16 de março e o deploy é de julho. Está no Ato I, e é lá que ele
trabalha a favor.

Duas decisões do trabalho que não estavam escritas em lugar nenhum entraram: o
botão de comprar que era vermelho e virou verde, e o frete, que despejava mais
de dez transportadoras e passou a mostrar três. A renomeação ganhou passo
próprio — cada transportadora chegava à tela chamada de "Normal", que era o
nome interno do sistema. Instrumentação vazando para a tela, não estética.

O par vermelho/verde é comparador de arrastar, com a divisa abrindo em 60% e
não no meio: medindo a diferença entre as duas imagens coluna a coluna, a faixa
que muda vai de 983 a 1172 dos 1800px, que é o botão. Em 50% a divisa cai antes
dele.

**Uma correção que muda um argumento do case**: a nota de suporte afirmava que
7 de cada 10 acessos eram de computador. O comentário logo acima já dizia que o
número justo era 60/40 e o dado seguia 70/30 — o bruto do 2º trimestre, com
junho inflado pelo mesmo robô. Nos meses limpos o celular fica em 47–48%. Passa
a 52/48, o que enfraquece a justificativa de exibir prova em desktop e
fortalece a decisão que o capítulo defende: no trimestre o celular converteu
mais (0,169% contra 0,138%) e rejeitou menos.

### A rolagem do case travava (`6545c2d`)

Dez tarefas longas, 4.982ms de thread bloqueada numa rolagem de 9,2s.

Não era peso de imagem. Era altura: 45 imagens carregam por lazy e as molduras
nasciam com altura zero, então o corpo crescia 6.211px durante a rolagem. Cada
crescimento dispara o ResizeObserver do avião, que reamostra a rota em 420
pontos de SVG — 166ms cada. `getPointAtLength` comia 57,5% do CPU.

Corrigido reservando espaço: 15 figuras ganharam `ar` medido no arquivo, os
comparadores ganharam a proporção do par, e `.v2-fig-moldura` ganhou **piso de
8/5**. O piso é o que impede a regressão — figura nova sem `ar` voltaria a
custar cinco segundos.

Depois: zero tarefas longas, zero de thread travada.

As abas do mesmo case ganharam **arrastar com o mouse** e uma dica de Shift, só
em ponteiro fino, que some no primeiro arrasto. O bug de Shift que o Gabriel
relatou **não foi reproduzido** — passa em teste com evento real do navegador e
Lenis ativo, em cinco pontos do trilho, e produção tem o mesmo código. O
arrastar existe para não depender do modificador.

### Desempenho (`acc53a7`)

PageSpeed do celular dava 34. Medindo em 4G lento, o peso não estava onde
parecia:

- o vídeo da capa são 834 KB, o maior recurso da página. Tinha
  `preload="metadata"`, mas `autoPlay` anula essa dica. Agora só entra depois
  do `load`, em `requestIdleCallback`, e antes dele aparece o poster de 78 KB —
  primeiro quadro do próprio vídeo, então na tela não muda nada;
- o `gtag.js` são 153 KB, e eu o adicionei de manhã, ajudando a piorar o número
  que ele existe para observar. Também depois do `load`. Nenhum evento se
  perde: `window.gtag` empilha em `dataLayer` e o script processa a fila;
- as fontes saíram de quatro origens de terceiro e são servidas de
  `/volume/fonts/v2/`, com `@font-face` em `site/fontes.css` e preload de
  **dois** pesos. Só dois: preload é fila de prioridade, e pré-carregar as sete
  faria elas competirem entre si.

Motivo de não ser mais o CDN do Google, que vale registrar: desde 2020 o cache
do navegador é particionado por site, então a fonte que alguém já baixou em
outro lugar é baixada de novo aqui de qualquer jeito.

Licenças conferidas: Switzer é da Indian Type Foundry via Fontshare, uso
pessoal e comercial; Geist Mono e Bad Script são SIL OFL.

---

## 2. Onde o site está

| | antes | depois |
|---|---|---|
| PageSpeed desktop | 82 | **98** |
| PageSpeed celular | 34 | **50** |
| FCP celular | 4,0s | 2,7s |
| LCP celular | 6,7s | 4,5s |
| bytes até o load | ~1,6 MB | 637 KB |
| rolagem do case | 10 travadas | 0 |

Acessibilidade 96, práticas 100, SEO 100.

**Ao medir de novo, rode duas vezes e use a melhor.** O TBT do Lighthouse varia
muito com a carga do runner do Google: duas medições seguidas do mesmo commit
deram 38 e 50, com TBT de 4.330ms e 1.070ms, enquanto as outras quatro métricas
ficaram estáveis. São elas que valem.

---

## 3. O que sobrou

**O Clarity não existe ainda.** É a única pendência que depende do Gabriel: a
Microsoft não expõe API para criar projeto. Ele precisa criar em
clarity.microsoft.com para `gabrielfelix-ux.4yu.com.br` e passar o Project ID.
Com o ID, basta definir a env `CLARITY_ID` no projeto `gabrielfelix-ux` da
Vercel (hoje sem nenhuma env) — o build já liga sozinho, testado com ID falso.

Sobre o mistério: o Clarity que ele lembrava existe, é `xn0pzndoo7`, está ativo
e grava `4yu.com.br`. Achado dentro do contêiner GTM `GTM-W5XPJFMP` — no 4yu o
Clarity é carregado pelo GTM, por isso não há ID em repositório nenhum. Ele não
aparecia porque a conta `contato@4yu.com.br` provavelmente não é a dona.
**Esse ID não serve para o portfólio**: usá-lo misturaria as métricas.

**O pré-render da home**, que é a tarefa seguinte e tem documento próprio:
`docs/HANDOFF-PRERENDER.md`. Leia-o inteiro antes de começar — em especial a
seção 1, que responde à objeção do Gabriel sobre trabalho duplo, e a seção 8,
que diz quando abortar.

**O `analise-v1-2.md` está no disco e fora do git.** Ele é a fonte dos números
do case. Não commite.

---

## 4. Coisas que vão custar tempo se não estiverem escritas

**As credenciais do 4yu vivem em `~/dev/gabriel/4yu-apps/.secrets/`**, e não
neste repositório, que é público. Carregue com
`set -a && . ~/dev/gabriel/4yu-apps/.secrets/4yu.env && set +a`. O
`google-sa.json` é a service account `claude-automation@yu-automation`, que
alcança GA4 Admin, GTM, Firebase e Search Console — e **só** a conta
`accounts/401450636`. O playbook completo está em `~/dev/gabriel/4yu-apps/CLAUDE.md`.

**`grep -c` conta linhas, não ocorrências.** Cheguei a concluir que produção
estava desatualizada comparando `grep -c "shiftKey"` entre dois arquivos
minificados. Estava errado.

**Playwright não anexa modificador ao `mouse.wheel`.** Para testar Shift+roda,
use `Input.dispatchMouseEvent` via CDP com `modifiers: 8`. Já estava no handoff
da madrugada e continua valendo.

**Testes de interação precisam de contexto limpo por caso.** Rodando quatro
cenários de aba no mesmo contexto, dois falsos negativos apareceram: um
arrasto anterior deixava estado pendurado. Em contextos separados, tudo passou.

**Medir localhost não serve para comparar com produção.** O servidor de dev não
comprime, então o JS cru domina e esconde o efeito de qualquer otimização de
rede. Compare produção com produção, ou local com local.

**O `_*.mjs` do `.gitignore` cobre as sondas de Playwright.** Continua sendo o
jeito de escrever teste descartável sem sujar commit.

---

## 5. Decisões que não devem ser desfeitas sem motivo novo

- Uma propriedade GA4 por produto. O portfólio nunca volta para a "Propriedade
  - 4YU".
- O `page_view` é manual enquanto o site for SPA.
- O Clarity nunca carrega antes do consentimento.
- O apagão do cartão é diagnóstico, não resultado.
- Os quatro números do bloco de efeito foram escolhidos por sobreviverem a
  contestação. Acrescentar os "melhores" que ficaram de fora quebra o case.
- O piso de `aspect-ratio` em `.v2-fig-moldura` não sai: ele é o que impede a
  rolagem de voltar a travar.
