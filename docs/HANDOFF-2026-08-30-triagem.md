# Handoff — 30/08/2026, sessão de triagem de contratação

Contexto para quem pega amanhã. Tudo abaixo está em `main`, buildado e verificado
no navegador. Último commit desta sessão: `4e977b0`.

**Leia `docs/VOZ.md` antes de escrever qualquer prosa neste repositório.** Ele é
normativo e nasceu no fim deste dia.

---

## De onde isso veio

O Gabriel pediu uma skill de review de portfólio. Instalei
`~/.claude/skills/portfolio-review/` (origem: `github.com/wonjyou/portfolio-review-skill`,
MIT, auditada — ver `PROVENANCE.md` lá dentro; o SKILL.md publicado estava
quebrado e foi reparado). Rodei a auditoria calibrada para **pleno**, que é o
alvo declarado dele: está saindo de júnior para pleno.

Nota inicial: **8/10 para pleno**. O que segurava não era conteúdo, era embalagem.

---

## O que foi entregue hoje

| Item | Estado |
|---|---|
| Currículo publicado e linkado (rodapé, menu 390px, fim da /sobre) | ✅ |
| Tempo de leitura declarado nos 5 casos (ficha + cartão da home) | ✅ |
| Caminho curto (`?curto=1`), com dobra própria e ilustração | ✅ |
| ODEX enriquecido: 604 → 1.164 palavras, 2 → 5 figuras | ✅ |
| Oderço enriquecido: 756 → 1.392 palavras, ganhou a pesquisa que faltava | ✅ |
| Antes/depois do Oderço (cadastro antigo real × LP nova) | ✅ |
| Mídia saiu da linguagem V1 (trama e chapa fora, filete e raio próprio) | ✅ |
| Arte de origem saiu de `uploads/` para `_fontes/` (deploy 30MB → 2,2MB) | ✅ |
| **Voz:** `docs/VOZ.md` aberto, e o aforismo varrido de home, /processo e /sobre | ✅ |
| Dobra 04 da home refeita: era autoelogio, virou a tese dos dois caminhos | ✅ |
| "Casos" virou "Projetos" em todo rótulo visível | ✅ |
| A cunha do risco virou gráfico de duas curvas, com o cruzamento medido | ✅ |
| Fatores viraram ficha com ícone; a nota que citava projeto por nome saiu | ✅ |
| Grade do fim: 3 projetos sorteados, nunca o que está aberto | ✅ |
| Mídia dos prints: trama e chapa V1 fora, filete e `--v2-r-print` | ✅ |
| Mobile 390px: pé do cartão empilha, véu da fita fecha, alvo de toque 78×44 | ✅ |
| Hero do projeto: Figma virou secundário; convite ao protótipo no fim da leitura | ✅ |
| Botões do canal (YouTube primário, TikTok secundário) na /sobre | ✅ |
| Logos aparados até a tinta: a marca da Locarmais dobrou de tamanho | ✅ |

**Distribuição de leitura do portfólio:** era 19/7/4/3/2 min, virou **19/7/7/6/2**.

---

## Pendências, em ordem de impacto

### 1. 🔴 Screencast do Locarmais — depende do Gabriel

É o caso com o desfecho mais concreto do portfólio (planilhas paralelas
extintas, financeiro parou de pedir relatório ao dev, ferramenta externa
internalizada) e **o único com `links: { vercel: null, figma: null }`**.

Precisa de 60–90s de screencast do módulo de conciliação, com valores borrados
ou de demonstração. Ele já confirmou que a tela mostra dado de demo, então é só
declarar isso na legenda — o que aliás soma, porque honestidade é a marca do
portfólio.

Depois de gravado: embutir no caso com legenda e ligar em `links` para o cartão
da home mostrar.

### 2. 🟡 Dividir o PCYES em dois casos — o Gabriel faz amanhã

Ele avisou que vai separar **PCYES V2** e **checkout V1.2**, adicionar um
checkout novo e comparar métricas. O plano já estava escrito em
`relatorio-auditoria-triagem-2026-08-30.md:184` ("o checkout V1.2 devia ser um
case, e hoje é subseção no meio do PCYES").

Isso resolve dois problemas de uma vez: encurta o capítulo de 19 minutos, e cria
**o primeiro caso do portfólio com métrica logo na entrada** — a V1.2 está em
produção desde antes do redesenho, e existe GA4.

**Ao fazer, atualizar:**
- `minutos` e `minutosCurto` do PCYES (remedir, não estimar — a conta é palavras
  de prosa ÷ 200);
- a regra do atalho: só aparece com economia de 3 min ou mais. Se o PCYES cair
  para ~10 min, o atalho continua; se cair para 5, some;
- `CASE_ORDER` em `volume/data.jsx` e o `sitemap`.

### 3. 🟡 Nenhum caso tem métrica de operação

Quatro casos, quatro desfechos honestos sem número. Para **pleno** isso lê como
maturidade — o site diz "prefiro não apresentar número que não existe", e isso
compra confiança. Para sênior, não sustenta.

O item 2 acima é a saída mais barata. O segundo melhor é o Locarmais: as três
mudanças de comportamento **são** o resultado e mereciam número, nem que seja
"de N planilhas para zero".

### 4. ✅ A voz — RESOLVIDO no fim do dia, e virou norma

O Gabriel reprovou a copy da dobra 04 da home por VOZ, não por conteúdo, e o
diagnóstico dele vale para mais coisa que aquela dobra.

O padrão que ele recusa: aforismo. Frase invertida, punchline no fim, tudo
querendo ser citável. Nas palavras dele — "vc fala assim: eu à escola fui. E
não eu fui à escola. E pior: Escola? eu fui. Mas não somente uma escola. Fiz
melhor, fui à grande escola." Ele chama de lacração e de cringe, e está certo:
ninguém fala assim, e num portfólio isso lê como quem está posando.

Exemplos que ele apontou, todos originais da /processo:
- "O tamanho da pesquisa acompanha o preço de errar"
- "Muda o tamanho. Nunca é zero, e é a única linha que eu não negocio"
- "Dias, não semanas"
- "Quando a dúvida já morreu"

**Feito.** A dobra 04 da home foi reescrita, a /processo teve seis frases
trocadas e a /sobre uma. A régua virou documento: **`docs/VOZ.md`**, que é
normativo e tem os moldes para procurar, a régua de seis pontos, a tabela de
antes/depois aprovada, e a lista do que NÃO mexer.

Leia `docs/VOZ.md` antes de escrever qualquer prosa nova neste repositório.

A /sobre estava quase toda limpa — é a escrita mais humana do site e serve de
referência de tom. Só `SOBRE_TRABALHO.paras[0]` tinha o vício.

REGRA EDITORIAL que ele estabeleceu no mesmo momento, e que vale para o site
inteiro: **a home informa COMO ele trabalha; o case referencia o trabalho.**
Citar projeto por nome numa dobra generalista é referência de serviço prestado,
e isso é assunto do case. Ele reclamou explicitamente de agentes serem
"fissurados" em puxar o erro do checkout para todo lugar — aquela história é
material de case, não de home.

### 5. 🟡 As rotas ainda dizem `/case/`

A renomeação de "casos" para "projetos" foi feita em todo rótulo que aparece na
tela, e **parou nas URLs de propósito**. `/case/<id>` continua.

O motivo: elas estão no `sitemap.xml`, no canonical de cada página, no
`llms.txt` e em todo link que o Gabriel já mandou para alguém — e ele está
mandando este portfólio para recrutador esta semana. Trocar sem redirecionar
quebra o que já circula.

Se for para fazer, o pacote é: rota nova em `app.jsx`, redirect 301 de
`/case/*` para `/projeto/*` no `vercel.json`, `sitemap` e `llms.txt`
regenerados, e o canonical acompanhando. É tarefa com verificação própria, não
um replace.

Ficaram também, e não são erro, os "caso" que são português normal: "nos dois
casos eu acho que escolhi certo", "errar a grafia é o caso comum". Trocar
aquilo por "projeto" quebraria a frase.

### 6. 🟢 FOUC na entrada do capítulo

O Gabriel viu a segunda dobra renderizar sem estilo uma vez. Não reproduzi:
5 casos locais e 3 no ar, todos corretos, `site.css` com 895 regras, zero falha
de rede. É a página antes do CSS aplicar.

Se acontecer de novo **e persistir depois de hard refresh**, aí é bug. A
mitigação, se quiserem eliminar a chance: inline do CSS crítico da `.v2-abre` no
`<head>`, como já é feito com a cortina de troca de página (ver `inline` em
`build.mjs`).

### 7. 🟢 Assets em `uploads/` que ficaram

`favicon.png` (1,5 MB) e `gabrielfelix-foto.*` (364 KB) continuam sendo
publicados porque **`legado-v1/` ainda os referencia**. Movê-los quebraria a V1
arquivada. Se a V1 for aposentada de vez, saem e o deploy perde mais 1,8 MB.

---

## Coisas que NÃO são para mexer

**A arte de origem em `_fontes/`.** Eu classifiquei errado como órfã e o Gabriel
corrigiu. Não são lixo, são as fontes:

- `_fontes/campo/*-parallax.png` → `tools/camadas-campo.py` gera
  `volume/assets/campo/*.webp`, que são **os morros, a lua e o avião do campo de
  voo, no ar e funcionando**;
- `_fontes/processo-hero.png` → `volume/assets/processo/hero.webp`;
- `_fontes/hero-capa-4.mp4` (9,5 MB) → o original de `volume/assets/hero/capa.mp4`.

Apagar qualquer um impede regerar as camadas. O `ENT` do
`tools/camadas-campo.py` aponta para `_fontes/campo`.

**O `--v2-r-media: 0`.** Continua 0 e é proposital: canto reto é a régua da
moldura da página. Quem tem raio é o print, por `--v2-r-print: 10px`, que é
token separado a pedido do Gabriel.

**A figura que sangra de borda a borda** (`.v2-fig.is-sangra`) segue com canto
reto: quem toca as duas bordas da janela não tem canto para arredondar.

**Os cartões da fita "Fora da estante"** começam em x=0 e sangram nas duas
bordas. Uma auditoria apontou isso como defeito de mobile; é o desenho de uma
fita em marquee, que precisa entrar e sair do quadro para o laço não ter
costura. Recuar as bordas ali cria dois começos falsos.

**Os logos em `volume/assets/logos/`** foram aparados até a tinta em 30/08, e é
por isso que `max-height` finalmente significa o tamanho da marca. Se um logo
novo entrar com respiro dentro do arquivo, ele vai parecer pequeno de novo e a
correção é na arte, não no CSS. Os originais estão em `_fontes/logos/`.

**A frase "opinião sobre imagem estática costuma ser gosto"** e as outras da
lista de protegidos do `VOZ.md` não entram na varredura de aforismo. Elas dizem
uma coisa que aconteceu ou que ele pensa; as que saíram diziam o quanto ele é
bom.

---

## Armadilha do ambiente

**Duas sessões de Claude dividiram este clone hoje, e colidiram duas vezes:**

1. Uma commitou no instante em que eu tinha arquivos staged e **levou meu código
   sob a mensagem dela** (`0cdbc10`). Nada se perdeu, mas a mensagem que
   documentava três correções, sim.
2. A outra sessão trocou o clone de branch, e **dois commits meus foram direto
   para `main`** sem eu pedir.

Se for rodar mais de um agente, dê uma branch para cada, ou rode um de cada vez.
Vale checar `git rev-parse --abbrev-ref HEAD` antes de commitar e comparar o SHA
antes/depois para detectar corrida.

---

## Convenções que esta sessão seguiu

- **Nada de texto inventado.** Todo fato novo em `volume/data.jsx` veio do
  dossiê, dos docs do repo, ou da boca do Gabriel. Quando faltou fato, eu parei
  e pedi em vez de preencher — foi o caso do ODEX e do Oderço antes de ele
  mandar o material.
- **Medir, não estimar.** Tempo de leitura, largura de comparador, altura de
  bloco, peso de deploy: tudo verificado no navegador com Playwright antes de
  afirmar.
- **Colisão de classe é real.** `v2-cam-*` bateu com o `.v2-caminhos` do PCYES e
  o título saiu sem centrar. Antes de criar prefixo novo, `grep` nele.

- **Voz.** `docs/VOZ.md` é normativo, e a régua é uma linha: escreva como você
  explicaria para um colega, em voz alta, sem plateia. O molde mais caro é o
  mais difícil de ver — frase sem ninguém dentro, tipo "o tamanho da pesquisa
  acompanha o preço de errar": sem sujeito humano, sem substantivo concreto,
  soa sábia e não informa nada.
- **A home informa como ele trabalha; o projeto referencia o trabalho.** Citar
  projeto por nome numa dobra generalista é referência de serviço prestado, e
  isso é assunto do case. Foi por isso que "e é o que eu fiz no PCYES e na
  Locarmais" saiu do caminho longo, e que a nota dos fatores saiu inteira.
- **Antes de criar prefixo de classe, `grep` nele.** `v2-cam-` bateu com o
  `.v2-caminhos` do PCYES e o título da dobra saiu sem centrar, porque a regra
  deles vinha depois no arquivo e vencia por ordem de cascata.
- **Resultado de outro agente se confere antes de aplicar.** Das cinco queixas
  de mobile que chegaram por auditoria externa, três eram reais, uma estava
  errada no diagnóstico e certa no sintoma, e uma era desenho e não defeito.
- **Diagnostique antes de mexer no CSS.** O logo pequeno era respiro dentro do
  PNG, não regra apertada. O parágrafo que não alargava tinha um `max-width`
  vencendo a coluna. O gráfico que "esticava" era `scaleX` deformando o grupo.
  Nos três, mexer no sintoma teria escondido a causa.
