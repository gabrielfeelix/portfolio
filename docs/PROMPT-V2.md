# Prompt — continuar a home da V2

Copie tudo abaixo da linha e envie numa sessão nova. Não traga esta sessão
junto: ela já carrega 300k de contexto e cada turno custa isso de novo.

---

Vou continuar o redesenho da home da V2 do meu portfólio.

## Antes de qualquer coisa

1. Invoque a skill `token-hygiene` e siga as regras dela na tarefa inteira.
   Print custa caro: leia o que precisar, não a pasta toda.
2. Leia, nesta ordem, e só isto:
   - `docs/HANDOFF-V2.md` — estado, o que foi corrigido, o que está aberto
   - `docs/ANALISE-REFS.md` — a base de direção, não é opcional
3. **Não vasculhe transcript de conversa.** O que é verdade está no repo e sai
   do `git log`.

## Onde estou

Repositório `/home/gabfelix/dev/portfolio`, branch **`home-v2-redesign`**
(a `main` é o volume de mangá que está no ar em 4yu.com.br e não se mexe nesta
tarefa). Os dois últimos commits são os que importam:

- `8052329` — doze erros visuais achados com Playwright e corrigidos
- `cfcb5f9` — a fita de mídia saiu, os casos viraram quadro com chapa de cor,
  e o `useCobertura` do herói voltou a funcionar

A branch **não foi empurrada**. Confira `git log origin/home-v2-redesign..HEAD`
antes de decidir se sobe.

## Como rodar e conferir

```bash
BUILD_V2=1 npm run build
cd dist && python3 -m http.server 8793 --bind 127.0.0.1
```

A home fica em `/v2/`. O servidor não faz fallback de rota: `/v2/case/pcyes`
dá 404 direto, abra `/v2/` e clique num card.

Ferramentas: `node tools/home-v2.mjs medidas` e `... prints`. Ele acha o
Playwright sozinho desde 28/08. O axe é separado: `npm i --no-save axe-core`.

**Armadilha nova, e ela produz falso positivo garantido:** espere 3 segundos
depois de rolar antes de rodar o axe. Com menos que isso o `useRise` da linha
do tempo ainda está correndo e o axe acusa 4 contrastes reprovados que não
existem.

O portão, antes de dizer que está bom: axe 0 a 1440 e a 390, zero erro de JS,
zero overflow horizontal em 1440 / 1280 / 390, e a página de caso abrindo com
as 17 dobras. Tudo isso estava passando em `cfcb5f9`.

## O que está aberto

Na ordem em que eu me importo:

1. **Gravação de tela dos protótipos.** É o que destrava o nível das
   referências, e é comigo. Os slots existem: `QUEBRA` e `EXTRA` no topo de
   `v2/Home.jsx`. Enquanto não chega, sobraram dois `.mp4` de tinta de banco
   (2,4MB) que precisam sair antes de publicar.
2. **A dobra da tese** roda 6 linhas de 104px numa medida de 809px. Já
   encolheu de 1896 para ~1300px, mas continua sendo a dobra mais alta em
   proporção ao que diz. Alargar a medida ou baixar um degrau: as duas mexem
   na gramática, então **me pergunte antes**.
3. **"2+ Anos em produto"** está a 128px no bloco de números, e o item 2 de
   `docs/PENDENCIAS-TEXTO.md` diz que esse número argumenta contra mim em vaga
   de pleno. Decisão minha, não mexa sozinho.
4. **A assinatura** da dobra 06 é o meu nome em itálico, placeholder. Vira SVG
   quando eu mandar o arquivo.
5. **O raio de 10px da tela flutuante** dentro do quadro é a única exceção à
   regra de raio 0. Está declarada em comentário. Se você achar que quebra o
   sistema, fale, não conserte por conta.

## Regras que não se negociam

- **NUNCA commitar `empresas-para-o-portfolio.md`.** Tem meu salário nas duas
  últimas empresas e o repositório é público. Já vazou uma vez, em 28/08, e o
  commit teve que ser apagado do GitHub. Agora está no `.gitignore`, mas
  confira o `git status` antes de commitar mesmo assim.
- **Zero travessões (—) em texto do site.** Dois-pontos, vírgula ou ponto; em
  título, "·". Em comentário de código pode.
- **Não invente número, resultado nem história de emprego.** Os dados saem de
  `volume/data.jsx` e do GA4. Se não está lá, pergunte.
- **Paleta: branco, preto, vermelho e cinza.** Cor de produto tem dois lugares
  e só dois: a chapa do quadro do caso e a chapa da empresa atual.
- **Commits em português**, no tom dos anteriores, terminando com
  `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.

## Como eu decido

Por comparação de print, nunca por descrição. Print da opção A contra a B
funciona; parágrafo descrevendo a proposta não funciona. Sou designer, falo
português. Se você mudar algo visual, me mostre.

## Material que existe nesta máquina

As seis referências estão baixadas em `~/dev/refs/` (viper-template, bungee,
launchfolio, porto-template, tabfolio, td-maxfolio, 384MB). O CSS delas vem
inline no `<style>` do HTML e o JS vem como `.mjs`, então procurar `*.css` ou
`*.js` nessas pastas volta quase zero sem que haja nada errado. Parte dos
links internos não foi reescrita: navegar offline pode puxar imagem do CDN.

A skill `clonar-site` está instalada em `~/dev/clonar-site`, linkada em
`~/.claude/skills/`, e serve para baixar mais referência se precisar.
