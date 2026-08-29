# Handoff: home da V2

Escrito em 2026-08-28. Substitui a versão anterior. Cole isto numa sessão nova
e não traga a antiga junto.

## Antes de tudo

1. Invoque a skill `token-hygiene` e siga na tarefa inteira.
2. Leia só: este arquivo e `docs/ANALISE-REFS.md`.
3. Não vasculhe transcript. O que é verdade está no repo e no `git log`.

## Onde está

Repositório `/home/gabfelix/dev/portfolio`, branch **`main`** (a
`home-v2-redesign` foi mergeada e as duas estão em dia com o `origin`).

Produção **não muda**: a Vercel roda `npm run build` sem `BUILD_V2`, que não
emite `dist/v2/`. Verificado por hash: os 162 arquivos de produção saem
idênticos com ou sem a V2 no repo. O que está no ar em 4yu.com.br é o volume
de mangá e não foi tocado.

Últimos commits que importam:

- `b128e9c` a dobra 04 virou índice tipográfico  ← **é o que ele recusou**
- `0f59782` o avião passa a costurar a página inteira
- `fbb2eff` método diagonal, assinatura Bad Script, avião na dobra 01
- `86e2f71` ilustrações SVG (já substituídas)

## Como rodar e conferir

```bash
BUILD_V2=1 npm run build
cd dist && python3 -m http.server 8793 --bind 127.0.0.1   # home em /v2/
```

O servidor não faz fallback de rota: `/v2/case/pcyes` dá 404, abra `/v2/` e
clique num card.

**Portão, antes de dizer que está bom:** axe 0 a 1440 / 1280 / 390, zero erro
de JS, zero overflow horizontal nos três, reduced-motion sem dobra invisível,
e a página de caso abrindo com as 17 dobras. Tudo isso passa em `b128e9c`.

Espere **3 segundos** depois de rolar antes de rodar o axe: com menos, o
`useRise` da linha do tempo ainda está correndo e o axe acusa 4 contrastes
reprovados que não existem. `npm i --no-save axe-core`.

## A tarefa aberta: refazer a dobra 04 (Método, "Do objetivo ao ar")

Palavras dele sobre o índice que está lá: *"achei mt parecida com a próxima
seção, e ainda achei mt sem graça, parece q n estamos usando personalidade nem
criatividade"*. As duas críticas procedem:

1. **Colisão real.** O índice é linha + filete + texto. A dobra 05 (`#onde`, "A
   linha do tempo") é a mesma coisa. Duas dobras seguidas com a mesma forma.
2. **Falta personalidade.** É a terceira tentativa nessa dobra. As duas
   anteriores (escada diagonal com ilustrações 320x200; três colunas com um
   quiz clicável) foram recusadas por serem forçadas. Esta foi recusada por ser
   sem graça. O ponto médio ainda não foi achado.

**O que ele pediu:** a opção 1 combinada com a opção 4, ou seja o índice com
**um desenho contínuo único** atravessando a dobra, uma linha vermelha que
muda de forma com a rolagem (pontos espalhados → moldura → barra publicada) em
vez de três selos separados. Os três selos de 64px que estão em
`v2/Ilustracoes.jsx` já são um ensaio disso: é o mesmo objeto em três estados,
com o ponto vermelho persistindo. Falta virar um traço só.

## Lacuna que ELE apontou e que é real

**As seis referências não foram varridas direito.** O que foi olhado:

| Ref | Varrido |
|---|---|
| viper-template | só a seção Approach |
| porto-template | só a seção Three Phases |
| launchfolio | página inteira |
| td-maxfolio | página inteira |
| bungee | **nada** |
| tabfolio | **nada** |

Antes de propor qualquer coisa, abra as quatro que faltam **por inteiro** e
procure COMPONENTE, não seção de processo.

Como olhar (as refs estão em `~/dev/refs/`, 384MB, Framer com CSS inline):

```bash
python3 -m http.server 8796 --bind 127.0.0.1 --directory ~/dev/refs
# depois: playwright, fullPage, e rolar antes de fotografar para disparar o motion
```

Playwright: não tem caminho fixo, descubra como `tools/home-v2.mjs` faz.

## Componentes já inventariados (não precisa reachar)

| Componente | Onde | Usado? |
|---|---|---|
| Título de duas cores (linha 1 cinza, linha 2 preta) | launchfolio, em toda seção | **não**, e é o ganho mais barato da lista |
| Título fixo à esquerda + lista rolando à direita | launchfolio | não |
| Pilha de linhas mono entre parênteses `(8+ years)` | td-maxfolio | não |
| Bento: painel grande + coluna de painéis estreitos | td-maxfolio | não |
| Primeira frase do parágrafo em negrito | launchfolio | sim, na dobra 04 |
| Barras de progresso com % | viper | não |
| Grupo de bolinhas de posição | viper e porto | não (saiu com a escada) |

Achado que vale lembrar: **três das seis não têm seção de processo nenhuma**
(bungee, td-maxfolio, tabfolio). As duas que têm são template de estúdio
vendendo serviço. A dobra 04 não é obrigatória, então precisa se pagar.

## Decisões fechadas, não reabra

- **O quiz clicável saiu** e não volta. "Vergonhoso", palavras dele.
- **Ilustração de conceito, uma por passo, saiu** e não volta. "Forçado".
- **O avião vermelho está aprovado e ele amou.** Não mexa sem pedir. Ele entra
  pela direita na dobra da tese, dá uma volta, atravessa na diagonal e daí
  costura a página inteira, sempre atrás do conteúdo.
- **Assinatura: Bad Script**, monolinear, sem floreio. A Ephesis foi recusada
  ("faculdade de pornografia"). Continua placeholder até o SVG dele chegar.
- **A revelação por desfoque da dobra 01** (opacidade + blur + subida) está
  aprovada: "amei, amei mesmo".
- **Gravação de tela é assunto de página de caso, não da home.** Na etapa 01 do
  método não existe tela ainda e na 03 seria redundante.

## Aberto, e é decisão do Gabriel

- **"2+ Anos em produto"** a 128px na dobra 03. O item 2 de
  `docs/PENDENCIAS-TEXTO.md` diz que esse número argumenta contra ele em vaga
  de pleno. Ele já sabe o argumento e ainda não decidiu.
- **A capa da quebra** entre casos e números é foto de banco (macro de lanterna
  de carro, StockSnap CC0, via API da Openverse, em
  `volume/assets/stock/capa-quebra.webp`). Só existe em 960px de largura e está
  em upscale para 1600. O print do PCYES que estava lá está anotado no
  comentário de `v2/Home.jsx` caso volte.
- **A dobra 05 (linha do tempo)** ele quer com logo das empresas e o bloco de
  texto deslocado para a direita. Não começou.
- **A dobra 07 (Fora da estante)** e o rodapé "falar comigo": pensar depois.

## Arquivos

```
v2/Home.jsx          dobras da home; Processo() é a dobra 04
v2/Ilustracoes.jsx   os três selos de 64px (viram um traço só)
v2/motion.js         primitivas; useVoo (avião), usePalavra (tese), useEscrita
v2/home.css          estilo da home; bloco "04. metodo: o indice"
v2/copy.js           PROCESSO_CURTO = [{titulo, frase} x3]
v2/tokens.css        escala, cores, --v2-font-mao
docs/ANALISE-REFS.md a base de direção, não é opcional
```

## Armadilhas que custaram tempo

- `npm run build` **não** emite `dist/v2/`. Use `BUILD_V2=1`.
- `overflow` diferente de `visible` num `<svg>` **zera o IntersectionObserver
  dos filhos**: `whileInView` nunca dispara e nada aparece, sem erro no
  console. Mesma coisa com `overflow: hidden` em qualquer ancestral.
- `clipPath` e valor dentro de `mask-image` não interpolam por `whileInView` no
  motion v13. Use `useInView` + `animate`.
- Meça posição com `offsetLeft`/`offsetTop`, não `getBoundingClientRect`, se o
  elemento tem animação de entrada com `translate`: o rect já vem transformado.
- `offset-distance` anda em **comprimento de arco**, não em altura. Ligando
  scroll direto nele o objeto foge do leitor. Ver a tabela em `useVoo`.
- Antes de criar classe, `grep` o nome: `.v2-marca` já existia e o
  `padding-inline` dela vazou para um svg novo.
- `pkill -f chromium` mata o próprio shell. Use `pkill -f "[h]eadless_shell"`.
- **NUNCA commitar `empresas-para-o-portfolio.md`.** Tem salário e o repo é
  público. Já vazou uma vez. Está no `.gitignore`, confira o `git status`
  assim mesmo.

## Regras de conteúdo

- Zero travessões (—) em texto do site. Dois-pontos, vírgula ou ponto; em
  título, "·". Em comentário de código pode.
- Não invente número, resultado nem história de emprego. Sai de
  `volume/data.jsx` e do GA4.
- Paleta: branco, preto, vermelho e cinza. Cor de produto tem dois lugares e só
  dois: a chapa do quadro do caso e a chapa da empresa atual.
- Raio 0 em tudo, com uma exceção declarada: os 10px da tela flutuante dentro
  do quadro do caso, que é o desenho de uma janela de navegador.
- Commits em português, no tom dos anteriores, terminando com
  `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.

## Como ele decide

Por comparação de print, nunca por descrição. É designer, fala português. Se
mudar algo visual, mostre. Para movimento, print não basta: mande a URL local e
um filmstrip de quadros.
