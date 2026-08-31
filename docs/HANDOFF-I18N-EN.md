# Handoff — versão em inglês do portfólio

**Para:** o próximo agente. **Objetivo:** botão EN na nav + site inteiro em inglês nativo.
**Data:** 30/08/2026. **Autor:** sessão de auditoria (Claude).

---

## 0. Leia isto primeiro

Duas coisas que vão te economizar horas:

1. **A encanação de i18n JÁ EXISTE e já está em produção.** Não construa nada novo de
   infraestrutura antes de ler a seção 2.
2. **Já existe tradução EN de boa qualidade** em `volume/i18n.jsx` (79 KB). Ela é
   idiomática de verdade, não literal. **Sua tarefa é continuar essa voz, não recomeçar.**
   Leia a seção 4 antes de escrever a primeira frase.

**Estado no momento deste handoff:** ligar EN hoje deixa o site ~100% em português.
A home não traduz uma palavra. Verificado rodando com `localStorage["vol-lang"]="en"`.

> **CORRIGIDO EM 30/08, depois deste handoff.** O diagnóstico acima estava certo no
> sintoma e errado na causa, e a causa era pior: as tags de script carregavam
> `i18n.js` ANTES de `data.js`, mas o corpo do i18n muta `CHAPTERS` e `PROJECTS`, que
> quem declara é o data. Em inglês ele estourava `CHAPTERS is not defined` na primeira
> linha do bloco EN e morria ali — nenhum espelho era aplicado, e nem `window.LANG`
> chegava a ser publicado. Em português ninguém via, porque o bloco todo está dentro de
> um `if (LANG === "en")` que nunca abria. **A ordem foi invertida em `build.mjs` e os
> espelhos da V1 passaram a valer.** Os números da seção 6 abaixo foram medidos com o
> bug e não valem mais; a medição nova está lá.

---

## 1. Por que EN não funciona hoje

`i18n.jsx` foi escrito para a **V1**. Ele espelha `CHAPTERS` e `PROJECTS` de
`volume/data.jsx`. Mas a **V2** (o site atual, em `site/*.jsx`) tem copy própria que
nunca passou por `window`:

- `site/copy.js` — hero, declaração, método, toda a /sobre. **Hardcoded em PT.**
- `site/*.jsx` — rótulos de interface ("Os outros casos", "Ver no ar", "O problema",
  "MOVIMENTO", "Contato", "Currículo"…). **Hardcoded em PT.**

Some-se a isso que dois casos inteiros nasceram depois da V1 e nunca foram traduzidos.

---

## 2. Como a infraestrutura funciona (não reinvente)

`volume/i18n.jsx`, carregado **depois** de `data.jsx` — e a ordem é o contrato, com a
conta inteira escrita no comentário de `buildHtml()` em `build.mjs`. Os dois continuam
sendo scripts clássicos que dividem o mesmo escopo léxico global, que é como o i18n
alcança o `const CHAPTERS` do outro arquivo por referência nua:

```js
const LANG = localStorage.getItem("vol-lang") === "en" ? "en" : "pt";
function t(pt, en) { return LANG === "en" ? en : pt; }
function toggleLang() { localStorage.setItem("vol-lang", ...); window.location.reload(); }
// se EN: muta os globais de conteúdo NO LUGAR (Object.assign raso)
Object.assign(window, { LANG, t, toggleLang });
```

Pontos que já estão resolvidos e que você não precisa refazer:
- `document.documentElement.lang` já vira `en`
- o skip-link e o label do boot já traduzem
- **troca de idioma = salvar + recarregar**, de propósito: a mutação tem que
  acontecer antes do primeiro render. Não tente trocar sem reload.

⚠️ **Object.assign é raso.** Se você espelhar um ramo (ex.: `notaSuporte`), tem que
repetir **todos** os campos daquele ramo, inclusive números. Já houve bug assim:
faltava `desktop`/`mobile` e o gráfico zerava em inglês com o build passando verde.
Está anotado em comentário no próprio `i18n.jsx`.

---

## 3. O trabalho, em três frentes

### Frente A — o botão EN ✅ FEITO em 30/08

Está em `site/Shell.jsx` (`TrocaIdioma`), montado nos dois lugares, 44×44 nos dois,
com o rótulo no idioma de destino. A troca passa por `site/idioma.js`, que também faz o
texto da página decodificar no idioma novo na chegada — os detalhes estão nos
comentários daquele arquivo e nas guardas `ehChegadaDeIdioma()` em `site/motion.js`.

**O que isso quer dizer para a Frente B:** o efeito já funciona, mas hoje ele resolve
português em português na maior parte da tela. Cada string que você traduzir é uma
string a mais que a pessoa vê MUDANDO de idioma na frente dela.

<details><summary>o pedido original, como estava escrito</summary>

Pedido do Gabriel: **à esquerda do botão "Falar comigo"**, um `EN` que troca o site.

Onde: `site/Shell.jsx`, no bloco `v2-nav-cta` (por volta da **L321**):

```jsx
<div className="v2-nav-cta">
  <Pill href={CONTATO().whatsapp.href} escuro={sobreEscuro} externo>Falar comigo</Pill>
</div>
```

Insira o toggle **antes** do `<Pill>`. Requisitos:
- rótulo mostra o idioma **de destino** (`EN` quando em PT, `PT` quando em EN)
- `<button>`, não `<a>` — é ação, não navegação
- `aria-label` explícito ("Switch to English" / "Mudar para português")
- alvo de toque ≥ 44×44px (**a auditoria achou vários alvos de 78×22 no site — não
  repita o erro**)
- precisa herdar o estado `sobreEscuro`, igual ao `Pill`, senão some sobre hero escuro
- **existe também a nav do menu mobile** (`v2-menu-links`, por volta da **L195**).
  Abaixo de 860px os links da nav somem. O toggle tem que aparecer nos dois lugares.

Chame `window.toggleLang()`. Já existe.

</details>

### Frente B — a copy da V2 (211 strings, é o grosso)

Inventário completo gerado em **`docs/I18N-INVENTARIO.md`**, com arquivo e linha.
Distribuição:

| Arquivo | Strings |
|---|---|
| `site/ProcessoNarrativa.jsx` | 50 |
| `site/Case.jsx` | 43 |
| `site/copy.js` | 42 |
| `site/Sobre.jsx` | 21 |
| `site/Shell.jsx` | 12 |
| `site/Home.jsx` | 9 |
| `site/app.jsx` | 8 |
| `site/Post.jsx` | 7 |
| `site/Processo.jsx` | 7 |
| `site/Blog.jsx` | 4 |
| resto (`Kit`, `blog.js`, `ferramentas.js`, `content.js`, `motion.js`) | 8 |

O inventário é gerado por regex e **tem falso positivo** (pegou trecho de código junto).
Revise antes de usar. Ele serve de mapa, não de lista final.

**Arquitetura recomendada:** um `site/copy.en.js` espelhando `site/copy.js`, e um helper
`t()` nativo da V2 que lê `window.LANG`. Motivo: `volume/*` é **congelado por contrato do
projeto** (está escrito no cabeçalho de `site/copy.js`) — a V2 não deve editar lá. Inchar
o `i18n.jsx` com copy da V2 quebra essa regra e mistura duas gerações do site.

Para os rótulos de interface soltos no JSX, um dicionário só (`site/ui.en.js`) com chaves
curtas é mais limpo que espalhar `t("Ver no ar", "See it live")` por 15 arquivos — mas
qualquer um dos dois serve. Escolha um e seja consistente.

### Frente C — os casos em `volume/data.jsx`

Aqui **pode** editar `i18n.jsx`: é exatamente o arquivo dele.

| Caso | Campos no PT | Já espelhados | **Faltando** |
|---|---|---|---|
| PCYES | 126 | 104 | 22 |
| ODEX | 35 | 16 | 19 |
| **Locarmais** | 46 | **0** | **46** |
| **Oderço revenda** | 42 | **0** | **42** |

Locarmais e Oderço-revenda são **dois casos longos inteiros, do zero**. São o maior
bloco de trabalho do projeto todo.

⚠️ **Os 104 espelhos do PCYES provavelmente estão defasados.** O PT foi reescrito várias
vezes em agosto/2026 (veja o histórico de comentários em `site/copy.js`). **Não confie
neles sem comparar campo a campo com o `data.jsx` atual.** Traduzir por cima de um
espelho velho é pior que traduzir do zero, porque parece pronto.

Campos faltando (amostra, confira a lista viva você mesmo):
- pcyes: `antes`, `depois`, `figFim`, `links`, `mes`, `minutos`, `papel`, `principal`, `q`, `rotuloAntes`, `semanas`, `shots`…
- odex: `catalogo`, `kit1`, `kit2`, `loja`, `orcamentos`, `plataforma`, `slots`, `figuras`…
- locarmais: tudo — `achados`, `aprendi`, `buraco`, `conciliacao`, `decisoes`, `forcar`, `importar`, `investigacao`, `figuras`…
- oderco-revenda: tudo — `achados`, `antesDepois`, `antigo`, `app`, `aprendi`, `catalogo`, `fechamento`, `hero`…

Como levantar a lista atual:
```bash
# campos do PT por capítulo, contra o que existe no i18n
grep -n 'id: "locarmais-conciliacao"' volume/data.jsx
```

---

## 4. A voz — a parte que importa

O Gabriel foi explícito: **"muita coisa contextualmente é diferente lá, palavras, gírias
e tal"**. Ele não quer tradução, quer o texto reescrito como se tivesse nascido em inglês.

A copy PT é a maior força do portfólio: títulos que já entregam a descoberta, voz falada,
zero jargão de designer. Tradução literal mata isso. Exemplos do que **já foi bem feito**
no `i18n.jsx` e que você deve igualar:

| PT | EN existente | Por que funciona |
|---|---|---|
| "Uma vitrine que ficou bonita e ficou lenta de comprar" | "A storefront that turned out beautiful and slow to buy from" | mantém a virada da frase |
| "Contrariei o briefing…" | "I argued against the brief with session recordings in hand" | "contrariei" → "argued against", não "contradicted" |
| "Ninguém assina milhares no escuro" | "Nobody signs off thousands in the dark" | "signs off", não "signs" |

Armadilhas concretas deste texto:
- **"caço o que já funciona"** — não é "hunt". Algo como "I go looking for what already works".
- **"para a mesa tocar em vez de imaginar"** — "a mesa" aqui é a sala de reunião/os stakeholders,
  não "the table". Reescreva o conceito.
- **"sem letra miúda escondida"** — "no fine print", expressão pronta.
- **"o que sobrou no ar"** / **"vai para o ar"** — "shipped" / "goes live", nunca "in the air".
- **"a parte demorada"** — "the slow part", não "the delayed part".
- **"o dado à decisão"** (H1 do site) — a frase mais importante da página. Vale gastar tempo.
- **Termos que NÃO se traduzem:** Pix, boleto, CNPJ, Magento, GA4, Clarity. Se precisar,
  glose numa aposição curta ("Pix, Brazil's instant transfer").
- **Valores em R$ ficam em R$.** Não converta para dólar: a fonte é GA4 brasileiro e
  converter inventa dado. O EN atual já faz certo ("an average order of R$ 663").
- **Separador de milhar inverte:** `166.267` (PT) → `166,267` (EN). Já tem precedente
  no arquivo. Fácil de errar e destrói a credibilidade dos números.
- **Datas:** "2º trimestre de 2026" → "Q2 2026".

**Não venda IA.** É regra de copy declarada do Gabriel, anotada em `site/copy.js`. Um
parágrafo do PT entra cortado no ponto final por causa disso. Preserve o corte no EN.

---

## 4.5. O QUE FOI FEITO EM 30–31/08

As três frentes estão fechadas, menos o blog. Commits: `feat(idioma)`,
`feat(i18n): a copy da V2`, `feat(i18n): os quatro capítulos`.

**Frente A — botão.** `TrocaIdioma`, em `site/Shell.jsx`. Nos dois lugares, 44×44,
rótulo no idioma de destino. A troca passa por `site/idioma.js`, que também faz o texto
da página decodificar no idioma novo na chegada (~720ms). As guardas
`ehChegadaDeIdioma()` em `site/motion.js` desligam a animação de entrada nessa carga.

**Frente B — copy da V2.** Arquitetura: `site/i18n.js` (helper), `site/copy.en.js` e
`site/processo.en.js` (prosa, espelhos sobrepostos com mescla PROFUNDA), e `t(pt, en)`
inline para rótulo. `volume/i18n.jsx` não foi inchado — o congelamento vale.

**Frente C — capítulos.** O handoff estava ERRADO ao dizer que Locarmais e Oderço têm
zero espelho: os dois já tinham. O que faltava eram ramos. Método que achou o buraco de
verdade, e que serve para a próxima vez: rodar em EN e procurar toda linha renderizada
que aparece LITERAL em `data.jsx`.

**Correção de infra, e era ela que quebrava tudo.** As tags de script carregavam
`i18n.js` ANTES de `data.js`, mas o i18n muta `CHAPTERS`/`PROJECTS`, que o data declara.
Em inglês estourava `CHAPTERS is not defined` e morria: nenhum espelho aplicado, nem
`window.LANG` publicado. Invertido em `build.mjs`.

**Estado hoje:** as oito rotas vazam 1–2 palavras, e as duas são falso positivo do
medidor (o `com` de `gmail.com`).

### O que sobrou, e por quê

1. **O blog.** Três posts em `conteudo/blog/*.md`, 17,5 KB de ensaio pessoal. Não foram
   traduzidos de propósito: são texto autoral do Gabriel, e a voz deles é o ativo. Além
   disso pede infra que não existe — `build.mjs` gera `posts.gerado.js` de um idioma só,
   então um post em EN precisa de arquivo próprio e de um índice por idioma. **Decisão
   dele, não do próximo agente.** Enquanto isso o /blog fica em português com a
   interface em inglês, que é honesto: o artigo É em português.
2. **`pieceDestino` em `volume/data.jsx`** ganhou rótulos novos em 31/08 numa sessão
   paralela ("Ver no ar", "Ver protótipo", "Ver em produção") e eles nasceram hardcoded,
   sem `t()`. São função, não dado, então o espelho do i18n não os alcança — precisa de
   `t()` no lugar. Uma linha cada.
3. **Revisão fina do PCYES.** O espelho tem 37 KB e cobre tudo o que renderiza, mas
   ninguém comparou campo a campo com o PT atual. O aviso da seção 3 continua de pé.

---

## 5. Ordem sugerida

1. Frente A (botão). Dá pra ver funcionando no mesmo dia e destrava o teste.
2. Frente B (211 strings da V2) — é o que faz a home deixar de sair em PT.
3. Frente C: **revisar** PCYES e ODEX antes de traduzir Locarmais e Oderço, porque a
   revisão te calibra na voz antes do trabalho pesado.
4. Rodar o teste da seção 6 e caçar o que sobrou.

---

## 6. Como testar

```bash
npm run dev   # a porta varia, ele imprime
```

```js
// no console do navegador
localStorage.setItem("vol-lang","en"); location.reload();
```

Script de vazamento — conta palavras que só existem em PT, por rota. Foi assim que o
estado atual foi medido:

```js
const pt = document.body.innerText.match(/\b(não|são|para|com|uma|que|você|então|porque|quando|onde|antes|depois|também|tela|casos|processo|trabalho|método|resultado|problema|pesquisa|contato|currículo|leitura|minutos|meses)\b/gi) || [];
console.log(pt.length, [...new Set(pt.map(s=>s.toLowerCase()))]);
```

Baseline **com o bug de ordem** (não use, está aqui só como histórico): home 131,
/case/pcyes 526, /processo 163, /sobre 195, /blog 35.

**Baseline real, medida em 30/08 depois da correção de ordem** — é esta que tem que ir
a zero, e ela é quase toda copy da V2 (Frente B), porque os espelhos da V1 agora valem:

| rota | vaza | rota | vaza |
|---|---|---|---|
| `/` | 61 | `/case/oderco-revenda` | 59 |
| `/processo` | 121 | `/case/odex` | 24 |
| `/sobre` | 63 | `/case/pcyes` | **23** |
| `/blog` | 24 | `/case/locarmais-conciliacao` | — |

O slug do Locarmais é `locarmais-conciliacao`, não `locarmais` (`CASE_ORDER`,
`volume/data.jsx:1279`). `/case/locarmais` cai no 404.

Não esqueça de: `<title>`, `meta description`, `og:*`, `sitemap.xml`, `llms.txt`,
página 404, e os `alt` das imagens.

⚠️ **O watcher do dev não recopia asset.** Se mexer em algo de `volume/assets/`, copie
na mão pro `dist/` ou reinicie. Perdi tempo com isso.

---

## 7. Avisos do repositório

- **Outra sessão estava editando a copy PT** em 30/08 (`site/Home.jsx`, `site/home.css`,
  `site/copy.js` mudaram durante a auditoria: "Do objetivo ao ar" virou "Não é um
  processo. São dois.", "Fora da estante" virou "Outros projetos"). **Confirme que o PT
  estabilizou antes de traduzir**, e cheque o diff por arquivo antes de commitar.
- `volume/` é congelado por contrato, **exceto** `i18n.jsx` para a Frente C.
- `site/copy.js` tem a regra: "mudou lá, muda aqui". Vale para o EN também.

---

## 8. Fora de escopo, mas anotado

A auditoria de portfólio da mesma sessão achou o seguinte. **Não é sua tarefa**, mas se
esbarrar, não piore:

- Nenhum dos 4 casos fecha com número medido *depois* — é o maior gargalo do portfólio
  para vaga de pleno.
- Grade de casos quebra abaixo de ~520px (título e descrição espremidos numa coluna
  estreita com a metade direita vazia).
- Carrossel "Outros projetos" quebrado no mobile: cards sangram nas duas bordas, rótulo
  sem scrim por cima do print, alvo de toque 78×22.
- Prints de solução com `alt=""` (marcados como decorativos sendo conteúdo).
