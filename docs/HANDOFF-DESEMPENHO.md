# Handoff — tirar a home de 75 para 85+ no celular

Escrito em 31/08/2026, depois de dois commits que subiram a nota de 50 para
75. Lê-se sozinho. A meta do Gabriel é **no mínimo 85 no celular**.

Leia antes: `docs/HANDOFF-PRERENDER.md` (o que já foi feito e por quê) e
`docs/HANDOFF.md` (estado geral do site).

---

## 0. Como trabalhar aqui

O Gabriel pediu explicitamente, e a ordem importa:

1. **Pesquise na web** as boas práticas de cada item antes de mexer. Muita
   recomendação do PageSpeed é genérica e não se aplica a este site; outras
   se aplicam mas têm armadilha. Não implemente de memória.
2. **Analise e decida.** Nem tudo na lista da seção 2 vale fazer. Algumas
   coisas custam design e o design não é seu para gastar. Diga o que decidiu
   não fazer e por quê — isso vale tanto quanto o que você fizer.
3. **Meça antes e depois, sempre**, e no mesmo runner. Número de máquina
   diferente não se compara com número de máquina diferente.
4. **Revise.** Rode `npm run verifica:home` a cada mudança na home. Se quebrar
   o primeiro quadro, você trocou desempenho por piscada.
5. **Nada de mudar o design por conta própria.** Onde a otimização exigir
   mexer em animação, cor, tempo ou layout, **pare e pergunte ao Gabriel**.
   A seção 4 lista exatamente esses casos.

Ferramentas que já existem no repositório:

```
npm run dev              # servidor de dev na 45553
npm run verifica:home    # o primeiro quadro do servidor bate com o do React?
npm run build            # produção
npm run mede:home        # A/B do pré-render, garganta real via CDP
```

Armadilhas de medição já pagas com tempo:

- **Mate o servidor de dev antes de medir.** Ele fica vigiando e reconstrói
  `dist/` em modo dev por cima do build de produção.
- **`pkill -f <termo>` mata o próprio shell** se o termo aparecer na linha de
  comando dele. Use `pgrep -af` primeiro, ou mate por PID.
- **Medir localhost não compara com produção**: o servidor de dev não
  comprime. `tools/mede-home.mjs` sobe servidor próprio com gzip por isso.
- **O Lighthouse local não é o runner do Google.** Nesta máquina o TBT deu
  3.900ms onde o PageSpeed deu 280ms. Para nota absoluta, só PageSpeed. Para
  delta, o A/B local com os dois lados no mesmo runner.
- A API do PageSpeed tem quota diária e ela estourou em 31/08. O Gabriel roda
  pela interface web quando precisa.

---

## 1. Onde está agora

PageSpeed celular, 31/08 12:34, Moto G Power emulado, 4G lento, Lighthouse
13.4.1:

| | |
|---|---|
| **Desempenho** | **75** (era 50 antes do pré-render, 59 depois dele) |
| Acessibilidade | 96 |
| Práticas recomendadas | 100 |
| SEO | 100 |

| métrica | valor | peso na nota |
|---|---|---|
| FCP | 2,3s | 10% |
| Speed Index | **6,0s** | 10% |
| LCP | **3,9s** | 25% |
| TBT | 280ms | 30% |
| CLS | 0 | 25% |

Computador estava em 94 na medição anterior (antes do LazyMotion, que deve ter
melhorado). Reconfirme.

### A conta da nota, que é como priorizar

As curvas do Lighthouse no celular: FCP p10=1800ms, SI p10=3387ms,
LCP p10=2500ms, TBT p10=200ms. Rodando os números atuais:

```
FCP 2,3s  → 0,75 × 10 =  7,5
SI  6,0s  → 0,47 × 10 =  4,7
LCP 3,9s  → 0,52 × 25 = 13,0
TBT 280ms → 0,83 × 30 = 24,9
CLS 0     → 1,00 × 25 = 25,0
                        -----
                         75,1   ← bate com os 75 medidos
```

**Faltam 10 pontos. Onde eles estão:**

| se conseguir | ganho |
|---|---|
| LCP 3,9s → 2,5s | **+9,5** |
| SI 6,0s → 3,4s | +4,3 |
| TBT 280ms → 150ms | +3,6 |
| FCP 2,3s → 1,5s | +2,0 |

**O LCP sozinho quase entrega a meta.** Ataque ele primeiro. Não gaste tempo
em CLS: já está em 0 e vale 25% que você já tem inteiros.

---

## 2. O que o PageSpeed apontou, na íntegra

Transcrito dos relatórios para você não precisar de print.

### Insights

| item | economia estimada |
|---|---|
| **Solicitações que bloquearam a renderização** | **760 ms** — só `/site.css`, 21,3 KiB, 380ms. Marcado LCP + FCP. |
| Use ciclos de vida eficientes de cache | 250 KiB — tudo do próprio site com TTL de 7 dias, 2.504 KiB no total |
| Reflow forçado | (sem número) |
| Detalhamento da LCP | (sem número) — **abra este, é onde está a resposta do item 3.1** |
| Árvore de dependência da rede | (sem número) |
| Melhorar a entrega de imagens | 405 KiB |
| Terceiros | (informativo) |

A tabela de cache, por tamanho: `hero/capa.mp4` 1.148 KiB · `hero/capa.webm`
834 · `oderco-revenda/capa-home.webp` 99 · `pcyes/capa-home.webp` 87 ·
`odex/capa-home.webp` 81 · `hero/capa-poster.webp` 79 ·
`locarmais/capa-home.webp` 76 · `ferramentas/clarity.png` 38 · e ~15 logos
mono e SVG de 1 a 11 KiB. Todos com TTL de 7 dias, que é o
`max-age=604800` de `/volume/assets/(.*)` no `vercel.json`.

### Diagnóstico

| item | número |
|---|---|
| Reduza o tempo de execução de JavaScript | 1,5 s |
| Reduza o JavaScript não usado | 110 KiB |
| Reduza o CSS não usado | 15 KiB |
| Os elementos de imagem não têm `width` e `height` explícitas | — |
| Evite payloads de rede muito grandes | 3.035 KiB |
| Evitar tarefas longas na thread principal | 5 encontradas |
| Evitar animações não compostas | 21 elementos |

### Acessibilidade (96) — um item

"As cores de primeiro e segundo plano não têm uma taxa de contraste
suficiente", apontando várias palavras dentro de
`<span class="v2-declaracao-w" style="opacity: 0.06; filter: blur(7px); transform: translateY(12px)">`.

**Isso é o estado INICIAL de uma animação de entrada**, não uma cor mal
escolhida: o Lighthouse tira a foto antes da revelação e mede o texto ainda
apagado. Já estava em 0.06 antes desta sessão — não é regressão nem foi
introduzido pelo ajuste de LCP. A nota de acessibilidade continua 96, a mesma
de antes. Confirme isso antes de "consertar" a cor de alguma coisa.

---

## 3. O plano, em ordem de ponto por risco

Faça um de cada vez, medindo entre eles. Não empacote dois numa medição só,
porque quando o número não se mexer você não vai saber qual dos dois falhou.

### 3.1 Descobrir onde estão os 3,9s do LCP  ·  primeiro, sem exceção

Não otimize antes de saber. Abra **"Detalhamento da LCP"** no PageSpeed: ele
quebra o LCP em TTFB, atraso de carga, tempo de carga e **atraso de
renderização**. Cada um pede um remédio diferente e o remédio errado não faz
nada.

Contexto que você já tem, medido em 31/08:

- o elemento de LCP era `<p class="v2-hero-sub">`, 15.255px²;
- ele nascia em `opacity: 0`, e o Chrome **exclui do LCP tudo em opacity 0**;
  por isso o LCP era montagem do React + 1,4s de `useTardio` + animação;
- isso foi corrigido: `useTardio` agora nasce em `0.06` (`site/motion.js`), e
  o HTML servido já sai com `style="opacity:0.06;transform:translateY(16px)"`.

**Com FCP em 2,3s e LCP em 3,9s, sobrou 1,6s de diferença que precisa de
nome.** Duas hipóteses, e a medição decide:

- **(a)** o elemento de LCP mudou e agora é a capa do hero
  (`capa-poster.webp`, 79 KiB), que só é descoberta depois do HTML. Se for,
  o remédio é 3.2 e é barato.
- **(b)** continua sendo o subtítulo, e o que atrasa é a chegada do
  `/site.css` (3.3), sem o qual nada pinta.

### 3.2 Pré-carregar a capa do hero  ·  barato, sem risco, provável ganho de LCP

Se 3.1 disser que a capa é o elemento de LCP, some ao `<head>` de
`site/index.template.html`, junto dos dois preloads de fonte que já existem:

```html
<link rel="preload" as="image" href="/volume/assets/hero/capa-poster.webp" fetchpriority="high">
```

Hoje o navegador só descobre essa imagem ao parsear o corpo do HTML. Não muda
nada de design.

**Cuidado documentado**: preload é fila de prioridade, não "baixe tudo antes".
Já existem dois preloads de fonte, e o comentário no template explica que
pré-carregar as sete fontes anulava o efeito. Se somar este, **meça se os
preloads de fonte não pioraram** — pode ser preciso escolher entre a capa e um
dos pesos.

### 3.3 Tirar o `site.css` do caminho crítico  ·  760ms, o maior item da lista

`/site.css` são 21,3 KiB que **bloqueiam a primeira pintura por 380ms**, e o
PageSpeed estima 760ms de economia. Isso pesa em FCP, LCP e Speed Index ao
mesmo tempo — os três de uma vez.

O agravante: **15 dos 21 KiB não são usados na home.** O arquivo é a
concatenação de dez folhas (`buildCss()` em `build.mjs`), e a home carrega
junto o CSS de caso, processo, sobre e blog.

Duas saídas, e elas se somam:

- **CSS crítico inline.** Extrair as regras da primeira tela e embuti-las no
  `<head>`, carregando o resto de forma assíncrona. O site já faz isso com
  `carregando.css` — leia `inline()` em `build.mjs`, o mecanismo está pronto.
  **É o item de maior risco da lista**: errar produz FOUC, e o Gabriel não vai
  estar olhando. Pesquise como extrair crítico sem ferramenta pesada, e
  **peça um print para ele antes de subir**.
- **Quebrar o CSS por rota.** `buildCss()` concatena tudo em um arquivo. Servir
  na home só `fontes+tokens+kit+shell+home+cursor` e carregar `case.css`,
  `processo.css`, `sobre.css`, `blog.css` sob demanda corta os 15 KiB não
  usados sem nenhum risco de FOUC. **Comece por aqui, que é o lado seguro da
  mesma economia.**

### 3.4 Speed Index de 6,0s  ·  +4,3 pontos, e parte é decisão do Gabriel

SI mede quão rápido a tela fica visualmente completa. Com o FCP em 2,3s, os
3,7s restantes são a tela AINDA MUDANDO — e boa parte disso é a coreografia de
entrada do hero, que é design e não defeito:

- `useTardio(1.4)` segura o subtítulo e os botões por 1,4s;
- `useMaskLine` abre a headline linha a linha, com atraso escalonado;
- o vídeo de 834 KB entra depois do `load` e troca a capa.

Investigue com o filmstrip do PageSpeed quanto de SI é animação e quanto é
carga. **Reduzir o 1,4s é mudança de design: leve o número para o Gabriel e
deixe ele decidir**, com o ganho em pontos na mão. Não mexa sozinho.

### 3.5 Os 110 KiB de JavaScript não usado  ·  +3,6 no TBT, mudança de arquitetura

`app.js` tem 270 KB e mais da metade não roda na home: `Case.jsx`,
`Processo.jsx`, `Sobre.jsx`, `Blog.jsx` e `Post.jsx` viajam junto. Separar por
rota exige trocar o bundle de `format: "iife"` para `esm` com code splitting,
e mexer na ordem das tags do `buildHtml()` — que é contrato documentado (React
→ data → i18n → app) e quebra em silêncio se invertido.

Ganho real, risco real. **Só depois que 3.2 e 3.3 estiverem medidos**, e
provavelmente já não seja necessário para chegar aos 85.

O LazyMotion já foi feito nesta sessão (315,8 KB → 270,4 KB). Não refaça, e
não tire o `strict` do `<LazyMotion>` em `site/app.jsx`: ele é o que impede
alguém reintroduzir o import cheio sem ninguém notar.

### 3.6 Miudezas, se sobrar tempo

- **`width` e `height` explícitos nas imagens.** Barato, e o CLS já está em 0
  — então o ganho é de trabalho de layout, não de nota. Faça se for rápido.
- **Cache de 7 dias.** O `vercel.json` dá `max-age=604800` para
  `/volume/assets/(.*)`. O PageSpeed quer mais, mas o próprio audit está
  marcado **"Fora da pontuação"** e só afeta visita repetida. Os nomes de
  arquivo não têm hash, então aumentar o TTL significa que trocar uma imagem
  sem renomear deixa gente vendo a antiga por um mês — foi exatamente por isso
  que a prévia de link virou `og-2026.png`. **Baixo valor, risco real. Provável
  não fazer.**
- **"Melhorar a entrega de imagens", 405 KiB.** As quatro capas de projeto
  (`capa-home.webp`, 76 a 99 KiB) são as maiores. Já existe receita de
  redimensionamento documentada em `docs/HANDOFF.md`, e o motivo dos 800px
  está lá — leia antes de reencodar qualquer coisa.
- **"Animações não compostas", 21 elementos.** São `clip-path` e
  `filter: blur`, que rodam na thread principal. Trocar por `transform` e
  `opacity` mudaria o gesto. **Design. Não mexa sem perguntar.**
- **`hero/capa.mp4`, 1.148 KiB na tabela do PageSpeed.** Testei em produção
  com Moto G4 emulado e **só o `capa.webm` foi buscado** (834 KB, 206). O mp4
  aparece na tabela deles mas não no meu traço. Se algum cliente estiver
  baixando os dois, é mais de um mega no caminho — **confirme antes de
  concluir qualquer coisa**, nos dois sentidos.

---

## 4. O que é decisão do Gabriel, e não sua

Leve número e opção, não uma mudança pronta:

1. **O 1,4s do `useTardio`** (seção 3.4). É a entrada do hero e vale pontos de
   Speed Index.
2. **`clip-path` e `blur` nas animações** (seção 3.6). Trocar por propriedades
   compostas muda o gesto.
3. **CSS crítico inline** (seção 3.3). Não é design, mas errar aparece na tela
   como FOUC. Peça print antes de subir.

---

## 5. Invariantes que não podem cair

Se você quebrar qualquer um destes, desfez trabalho que já foi pago:

- **`npm run verifica:home` passa nos dois idiomas.** É o que garante que o
  HTML do build e o React não divergiram.
- **`dist/rota.html` continua servindo tudo que não é a home.** Se
  `/case/pcyes` passar a vir com a home escrita dentro, o visitante vê a
  página errada por segundos.
- **O `strict` do `<LazyMotion>` fica.**
- **`useTardio` não volta para `opacity: 0`.** É o que tira o LCP do refém.
- **O piso de `aspect-ratio` em `.v2-fig-moldura` não sai.** É o que impede a
  rolagem do caso voltar a travar (commit `6545c2d`).
- **A ordem das tags em `buildHtml()`**: React → data → i18n → app.
- **O `page_view` do GA4 continua manual** enquanto o site for SPA.

---

## 6. Definição de pronto

- PageSpeed celular **≥ 85**, rodado duas vezes, usando a melhor.
- Computador não caiu (estava em 94, confirme o valor atual antes de mexer).
- Acessibilidade, práticas e SEO intactos (96 / 100 / 100).
- `npm run verifica:home` passa.
- As rotas longas rolam de ponta a ponta sem erro de JS.
- Este arquivo atualizado com o que você mediu, o que decidiu não fazer e por
  quê. Se não chegar aos 85, escreva onde travou e qual era o teto — isso vale
  mais que uma tentativa a mais.
