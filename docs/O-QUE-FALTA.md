# O que falta no volume

> Atualizado em 2026-08-29 (noite) sobre `faa772e`. Este é **o** arquivo de
> pendência. Arquitetura, regras duras, como medir e armadilhas estão em
> `docs/HANDOFF.md`: não duplique aqui.
>
> Item riscado = **feito, não reabrir**. Fica na lista por um ciclo para
> ninguém refazer, depois some.

## Estado

Cinco capítulos. Um de quase 18 minutos e quatro entre 1,6 e 4,2, que é o
desequilíbrio da tabela abaixo e o item 2.

| Capítulo | Altura (1440) | Telas | Palavras | Leitura | Imagens |
|---|---|---|---|---|---|
| **pcyes** | 35.293px | 39,2 | 3.544 | **17,7 min** | 29 |
| locarmais-conciliacao | 13.719px | 15,2 | 834 | 4,2 min | 4 |
| portfolio | 11.710px | 13,0 | 323 | 1,6 min | 5 |
| odex | 11.114px | 12,3 | 587 | 2,9 min | 4 |
| oderco-revenda | 10.911px | 12,1 | 641 | 3,2 min | 3 |

Regressão em `9355e72`: 6 larguras sem scroll horizontal, 8 rotas sem
`pageerror`, axe **0 violações** em papel, tinta, EN e 390, mais as três
rotas de empresa.

---

# A · Travado no Gabriel · precisa de material ou de decisão dele

Nada aqui avança sem ele. Não tentar resolver por conta própria.

### A0 · Ligar o Web Analytics na Vercel

Medido em 29/08 contra produção:

```
https://4yu.com.br/_vercel/speed-insights/script.js  → 200  ✓
https://4yu.com.br/_vercel/insights/script.js        → 404  ✗
```

O Speed Insights está ligado, o **Web Analytics não**. `dist/analytics.js`
empilha eventos em `window.vaq` esperando um script que nunca chega, então
**todo `vtrack` se perde** — inclusive o clique em canal de contato
(WhatsApp, e-mail, LinkedIn, Instagram, currículo), que é a única medida de
conversão que o site tem.

Não é código: é Project → Analytics → Enable no painel. Confirmar com o `curl`
acima antes de dar por resolvido.

### A1 · Nove imagens com o creme antigo gravado dentro

Token de CSS não resolve: a cor está no pixel. Repintar foto ou print é ato
de design, por isso não foi feito sozinho.

| Arquivo | Creme | O que é | Saída provável |
|---|---|---|---|
| `assets/gabriel.webp` e `.png` | 75% / 60% | retrato dele, fundo creme chapado | repintar muda a foto: **perguntar** |
| `assets/projetos/portfolio/*.webp` (4) | 22 a 72% | prints do **próprio portfólio quando era creme** | repintar não resolve, o creme está no meio da UI: **refazer o print** |
| `assets/projetos/pcyes/ck-mobile`, `contraste` | 42% / 27% | mockups sobre chapa creme | **perguntar** |
| `assets/og-image.png` | 16% | card social, tipo creme sobre tinta | **mecânico**: creme → branco |

`projetos/ponto/*` e `marcas/produto/*` ficaram de fora de propósito: o claro
ali é do produto, não é o papel do volume.

Para achar de novo: varrer `volume/assets/**` amostrando pixel e listar
imagem com ≥3% de `#F6F3EC` (tolerância 8).

### A2 · O print do pop-up do PCYES · um passo dorme até ele chegar

Três dos quatro prints chegaram e estão no ar. Falta o `popup` (a V2 com o
pop-up depois de 15% de rolagem). O passo "A chegada" do módulo "O
acabamento" está **oculto** (comentado em `data.jsx` e `i18n.jsx`, com nota
`PENDENTE`) e o módulo diz "oito correções". Quando o print chegar:

1. Salvar como `volume/assets/projetos/pcyes/busca-popup.webp` e apontar o
   `src` da figura `popup` em `data.jsx`, com o `ar` real do arquivo.
2. Descomentar o passo "A chegada" em `data.jsx` **e** em `i18n.jsx`.
3. Voltar "oito" para "nove" no título e no corpo, **nos dois idiomas**.
4. `npm run build`, conferir a régua com 9 traços, commit.

### A3 · Um número do funil para validar no GA4

O funil **sobe** de 808 (`add_to_cart`) para 896 (`begin_checkout`). Há nota
em `data.jsx` explicando por compra rápida e carrinho recuperado, o que é
plausível, mas se a marcação de `add_to_cart` estiver furada o dado está
errado, e é o tipo de coisa que um avaliador atento pergunta.

### A4 · Material solto que ele tem

- **Print do Traxium** (ele tem em casa).
- **Logo do IMMO** (`logo: null` em `data.jsx`).
- **Quatro peças sem logo porque não existe arquivo:** 4YU MKT, Kitamo,
  Remoctrl e Rodapé. O Rodapé tem logo só como componente
  (`~/dev/gabriel/rodape/claude-design/logo.jsx`, balão em `#B85838`), o
  mesmo caso do Traxium, que foi extraído da variante `mono` e virou
  `volume/assets/marcas/mono/traxium.svg`. Dá para repetir.

### A5 · Duas decisões visuais dele, sem material pendente

1. **Sangrar o clímax da `solucao` em `100vw`.** A abertura da V1 abre em 82%
   da tela (~1180px) e o clímax da V2 para em 1033px. **É o que segura a nota
   de "apresentação do design" em 7,5 e não em 9.**
2. **Piso tipográfico de 12 para 13px.** Nada abaixo de 12px hoje; restam 264
   elementos entre 12 e 14. Mexe em `app.css`, `chapter.css` e `kit.css`.
   Não é urgente e ninguém reclamou.

### A6 · O enquadramento das 27 imagens no celular

Em 390 a coluna mede 350px e as imagens ocupam 344px, certo para a largura.
O problema é a altura: são prints de tela **desktop**, então cada um vira uma
faixa baixa e larga onde não se lê interface nenhuma. A lupa resolve para
quem toca, mas o primeiro contato é a faixa.

Saídas conhecidas: recortar cada print para o trecho que importa, ou deixar a
imagem rolar na horizontal dentro da moldura. As duas mexem em 27 imagens e
**quem decide enquadramento é o Gabriel**.

---

### A7 · A seção de outros projetos precisa de mockup e história

Pedido do Gabriel em 29/08: a fita de peças (`.v2-fita-secao`, `Home.jsx`) é
uma faixa baixa que corre sozinha, sem narrativa. Ele quer **mockups e
histórias de verdade**. Precisa de arte e texto dele antes de virar código.

### A8 · A capa da página PROCESSO

Ele quer uma, e **ainda não sabe qual**. Depende de B0c. Não inventar.

# B · Aberto de verdade · pode andar sem ele

### B0c · A página PROCESSO com componentes melhores

Pedido do Gabriel em 29/08: "tá muito simples hoje". Quer **componentes mais
interessantes de outras refs**.

As refs baixadas estão em `~/dev/refs/`: `bungee`, `isabella-pires`,
`launchfolio`, `porto-template`, `tabfolio`, `td-maxfolio`, `viper-template` e
`fuel.framer.website` (esta com análise medida em `~/dev/refs/fuel-ANALISE.md`).
Comparativo em `docs/ANALISE-REFS.md`.

**Perguntar a ele qual referência agrada antes de propor.** Na sessão de 29/08
ele apontou a fuel e a decisão saiu muito mais rápida do que teria saído com o
agente propondo do zero.

Entra junto A8 (a capa) e B0 (o motion da seção dela na home).

### B1 · Engordar os outros quatro capítulos

O maior item da lista. Cada um mostra **3 a 5 telas de projeto**; para
portfólio de UI isso é pouco. **Não se resolve cortando o PCYES**, e essa
decisão está fechada: o problema é falta de atalho, não excesso de argumento,
e o atalho existe desde `1ab1e88`.

Referência honesta: se cada um chegasse a 8 ou 10 telas, o volume deixava de
ter um capítulo e quatro apêndices. **Quanto** e **com o quê** depende de
material do Gabriel, então isto encosta no bloco A.

Já herdaram de graça: régua de escala, zoom, curva única de motion, degraus
de medida tipográfica e a virada de ato no `Respiro`. **Não herdaram de
propósito:** o `Atalho`, que só aparece em capítulo com `minutos` declarado, e
só o PCYES tem. Atalho de 3 minutos num capítulo de 3 minutos seria mentira.
Se algum passar de uns 8 minutos, declare `minutos` **com o número medido** e
o atalho aparece sozinho.

### B2 · A ordem dos blocos no celular

Sem as duas colunas, texto e prova viram uma pilha só. A pergunta é de
sequência e segue aberta. O lado de **espaço** já foi resolvido (ver C3).

---

# C · Feito · não reabrir

- ~~**O motion da seção PROCESSO na home**~~ · `faa772e`. O `linha(i)` e a régua
  locais de `Home.jsx` escaparam do acerto de `bf26a57` e ficaram em `0.9s`,
  50% acima do `dur=0.6s` do resto — era a queixa de "pesado". Agora leem
  `dur`/`passo`/`easeRevela` de `motion.js`, então o próximo acerto global
  pega estas junto. O `blur(6px)` **saiu inteiro**, não encurtado: com
  `y`+`opacity` não acrescenta leitura, e era a única propriedade ali que o
  compositor não resolvia sozinho. O blur de `Home.jsx:648` **não é a mesma
  seção** — é a troca de marca da trajetória, e continua lá de propósito.
- ~~**`volume/assets/lua.webp`**~~ · `faa772e`. Apagado. Era a lua da tela de
  carregamento, que saiu em `bf26a57`.
- ~~**As páginas de empresa**~~ · `f1fd504`. Viraram narrativa: abertura,
  atos com parágrafo, balão de mangá na virada, setas de nanquim, linha do
  tempo e fecho com selo. Conteúdo real das três, espelho EN junto.
- ~~**O bege**~~ · `f1fd504`. Tokens `--wash-*` neutralizados por luminância
  igual (contraste não mexeu, maior desvio 0,04) e 15 PNGs repintados. Sobrou
  só o A1.
- ~~**"Quem sou" em três colunas**~~ · `f1fd504`. Virou duas seções, com
  retrato grande e `OndeEstou` própria.
- ~~**Retícula do rodapé**~~ · `f1fd504`.
- ~~**Outros projetos em chapa vermelha com dentição**~~ · construído e
  **recusado** pelo Gabriel depois de ver. Não reconstruir.
- ~~**Três contrastes reprovados**~~ · `f1fd504`. `.el-papel`, `.lv-num` e o
  `.eq-card.is-flat`, que rebaixava o card inteiro por `opacity`.
- ~~**28 Tabs até o atalho**~~ · medido, e a conclusão é **não mexer**. O
  atalho cai no Tab 28, mas "13 A solução" (o destino dele) cai no Tab 24:
  quem navega por teclado chega **quatro Tabs antes** de achar o botão. Mover
  não encurta nada, só mexe no layout.
- ~~**Os seis `<div style={{height}}>` do Ato IV**~~ · `84046f7`, viraram
  `.vao-ato` em `chapter.css`.
- ~~**O ritmo no mobile (espaço)**~~ · `030b1c3`. Encolheu 1,7 tela em 390 e
  1,9 em 768, desktop intacto byte a byte. A escala `--ma-*` era a mesma em
  390 e em 1440: os três degraus grandes agora encolhem sob 880px. O vão do
  `ModuloPassos` pagava por um mecanismo desligado no celular.
- ~~**Os dados do capítulo**~~ · `3e7dda7`. Saíram da amostra de 3 dias do
  Clarity e passaram ao GA4 do trimestre (166.267 sessões). Mudou a conclusão:
  quem chega ao checkout converte a **25%**, e o gargalo está um passo antes.
  Sobrou só o A3.
- ~~**Domínio no `llms.txt` e `robots.txt`**~~ · `2a74b8f`.

---

# D · Parece pendência e NÃO é · não procurar de novo

- **`rec-r` a 40 caracteres por linha** é **exceção declarada em comentário**:
  três recusas em três colunas, e alargar exigiria desfazer o trio.
- **O resultado do capítulo 05 não é circular** (`82df68b`): é o número
  medido do axe. Se mexer no texto, **remeça antes**: o parágrafo cita quatro
  combinações, seis larguras e oito rotas.
- **`ContaAte` não fica preso em zero** (`9cab6cc`). Rede de segurança de
  2600ms. Varredura que abra o capítulo **sem rolar** vê os números certos, e
  isso é o desejado.
- **A página das "Outras peças" sai de um Map sobre a lista completa**
  (`ccab123`), não do índice do `map`. **Não simplificar de volta para
  `(p, i)`:** numerar pelo índice da lista filtrada dava a mesma página a
  peças diferentes, medido em 11 das 12.
- **As 6 imagens sem lupa são o antes/depois.** Slider, 976px, de propósito.
- **Nenhuma figura está órfã.** `marca` é a régua do funil, via `dados.marca`.
- **Os `[assim]` não renderizam.** Moram só em `synthChapter`, o fallback de
  projeto sem capítulo autoral, e os cinco `CASE_IDS` têm capítulo.
- **Nenhuma imagem está sem `alt`.** Os dois `bp-logo` têm `alt=""` dentro de
  `<span aria-hidden="true">`, que é o padrão **correto**. Varredura que conta
  string vazia como ausente dá falso positivo.
- **Contraste está resolvido.** As violações que uma varredura acusa são os
  kanji decorativos em `rgba(0,0,0,0)`.
- **`calendario` não é beat.** É desenhado dentro de `Resultado`, no slot `c7`.
- **O `.view` é CSS órfão.** Corrigido em `4e3b79e`, elemento não existe mais.
- **As 3 figuras "sem revelar" não são figuras.** São `<span className="fig">`
  de altura 0, que não usam `useReveal`.
- **A pill do nav começa escondida** ao entrar num capítulo de uma posição
  rolada. Quirk pré-existente, fora de escopo, e o Nav é sensível.

---

# E · Opcional · nenhum é urgente

- **Antes/depois de um componente real:** card de produto da V1 ao lado do da
  V2. Não há documentação de token da V1, então o enquadramento honesto é "a
  V1 não tinha sistema". **Não inventar número.**
- **Quais artefatos do FigJam mudaram uma decisão.** Resposta é do Gabriel. O
  critério **não se relitiga**: o artefato entra só se mudou uma decisão, e
  entra junto dela. Os que não entram viram **uma figura só** em
  `investigacao`, com legenda que argumenta. **Não despejar os 10.**
- **`docs/AUDITORIA-PORTFOLIO.md` envelheceu:** é anterior à reforma das
  páginas de empresa e não avalia craft visual, motion nem leiturabilidade.
  Refazer só se ele quiser nota nova.
