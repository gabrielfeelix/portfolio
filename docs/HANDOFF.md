# Handoff — Portfólio "Volume" (Gabriel Felix Barbosa)

Portfólio em forma de volume de mangá. SPA React estática, sem backend.

- Dir: `/home/gabrielbarbosa/dev/gabriel/portfolio`
- Repo: github.com/gabrielfeelix/portfolio · push na `main` = auto-deploy Vercel
- No ar: https://portfolio-volume.vercel.app

> Este arquivo é relido a cada sessão, então guarda só o que **muda o que
> você vai fazer**: regras, armadilhas que custaram retrabalho, decisões já
> fechadas e o que está pendente. O histórico de features entregues está no
> `git log`, que é fonte melhor. Ao terminar uma rodada, prefira **substituir**
> uma seção a empilhar outra.

---

## Arquitetura (leia antes de editar)

- `volume/*.jsx` são **scripts clássicos** que compartilham estado via `window`. **Não há import/export.**
- `build.mjs` (esbuild) transpila cada jsx individualmente (`bundle:false`, **nunca** `minifyIdentifiers` — os nomes de topo são a API entre arquivos) → `dist/`, vendoriza React 18, copia assets, gera `dist/index.html`.
- Ordem dos scripts importa: tweaks-panel → data → i18n → organic → cursor → RevealMask → Capa → Capitulo → Processo → Posfacio → EmpresaPage → app.
- **`dist/` é apagado a cada build** (`rm -rf`). Nunca deixe arquivo só lá.
- Fluxo: editar → `npm run build` → commit → `git push origin main`.
- Commits terminam com `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`. Mensagens em português, no tom dos commits anteriores.

**Regra de ouro:** se algo renderiza errado, é bug de CSS ou do `build.mjs`. Não reescreva os `.jsx` "pra consertar render". Editar conteúdo (`data.jsx`, `i18n.jsx`) é normal.

## Regras duras

- **Zero travessões (—) em texto do site.** Palavra do Gabriel: "cara de IA". Use dois-pontos, vírgula ou ponto; em títulos, "·". Em comentário de código pode.
- **IA aparece pouco:** só onde é feature (Hub Oderço), uma filosofia no Posfácio, uma razão no Rodapé. Não re-adicionar.
- Outros repos em `~/dev/` são **somente leitura**. Cópia só na direção projeto → portfólio.
- **Não confie nestas notas: valide.** Rode o axe, tire screenshot e dê `Read` no PNG antes de dizer que está bom. Teste teclado de verdade.

## Ferramentas

**Playwright** — use `~/.npm/_npx/1ac161d228dd2210/node_modules/playwright`. Chromium do cache em `~/.cache/ms-playwright`. Funciona direto, sem `LD_LIBRARY_PATH` (a receita antiga de `dpkg -x` não é mais necessária).

- Servir o build: `npm run dev` (cai em outra porta se a 5173 estiver ocupada; veja o log).
- **Unity WebGL (VLibras e afins) só renderiza em `headless:false`** via WSLg (`DISPLAY=:0`). Leva ~60s e o canvas vive num shadow root, então `document.querySelector` não acha — sonde dentro do `shadowRoot` ou simplesmente espere e capture.
- Sempre dê `Read` no PNG. Build que passa não prova que a tela está certa: nesta rodada o sticky estava quebrado com o build verde.

**Figma MCP** — funciona. Arquivo PCYES V2 DS: key `A0Zg3I15KcYI82zZocmyjD`. `get_metadata` puxa a árvore por `nodeId` sem seleção; `get_variable_defs` e `get_screenshot` exigem o node selecionado no Figma desktop.

**Memória do projeto** em `~/.claude/projects/-home-gabrielbarbosa-dev-gabriel-portfolio/memory/`. Leia.

## Padrões do capítulo (o idioma da página)

- **Dado é desenhado, não fotografado.** Print de dashboard é foto de ferramenta; o número desenhado é argumento. Ver `Painel`, `Funil` e `Gesto` em `Capitulo.jsx`.
- **Toda figura carrega o argumento na legenda**, não a descrição da tela. Quem lê só as legendas tem que sair entendendo o case.
- **Moldura sem `src` vira `MangaPlate`** ("print a subir"): honesto, e não abre buraco no layout.
- Números precisam de procedência. Todo painel tem `fonte` e, quando a amostra é curta, uma `nota` dizendo o que ela sustenta e o que não sustenta.

### Armadilhas de `position: sticky` neste projeto

Custaram uma rodada inteira de retrabalho. As três agem juntas:

1. `.beat` tem `align-items: center`, que **centraliza a coluna curta** e a faz começar milhares de px abaixo da coluna alta. Corrija com `align-items: stretch` no módulo.
2. Sticky **precisa de um pai mais alto que ele** pra ter trilho por onde correr. Sem isso a coluna sobe junto com o scroll. Use `.text-col { align-self: stretch }`.
3. `.beat .panel` nasce `opacity: 0` e só acende com a classe `.in`. Numa coluna presa, essa faixa já passou e o conteúdo **some**. Force `opacity: 1` no módulo.

## Decisões fechadas (não relitigar)

- **Coverflow**: as capas laterais esmaecidas violam contraste no axe. Gabriel decidiu (2026-05-29) **aceitar** — é preview periférico decorativo e a capa focada carrega o texto legível. Exceção consciente à WCAG 1.4.3. Não mexer.
- **Hero**: aprovado, não mexer. O obi foi recusado.
- **Onde entra o Design System** (2026-08-26): depois das Decisões, antes dos Módulos. Nunca no começo. O argumento é "antes de desenhar 40 telas, construí o vocabulário", então o DS chega como resposta a um problema já posto e cada tela vira prova de que o sistema funciona.
- **Profundidade do DS**: "sistema em uso", não catálogo de swatches. Mostrar token semântico funcionando (mesmo componente em dark/light; cor com função: verde = compra, laranja = pré-venda, dourado = Coin). O argumento: *a V1 tinha cores; a V2 tem um sistema que sabe o que cada cor faz*. `ink-muted` não é cinza, é o papel "texto secundário", e vira sozinho quando o tema flipa.

## Pendente

**1. Design System no capítulo PCYES** — é a próxima seção grande. As decisões acima já estão fechadas.

O Figma tem (já inspecionado): `surface-0/1/2/3`, `ink`/`ink-muted`/`ink-subtle`, `edge`/`edge-subtle`/`edge-strong`, ladder dark documentada por uso, mais páginas de gradients, typography, spacing, radii, shadows, motion, containers e primitivos.

**2. Prints que só o Gabriel pode dar.** As molduras já existem marcadas como pendentes em `data.jsx`:

| Chave | O que é |
|---|---|
| `buscaMouse` | V1 buscando "mouse" e devolvendo mousepad na frente |
| `buscaMause` | V1 buscando "mause" e devolvendo tela vazia |
| `buscaV2` | V2 sugerindo produtos e termos antes de digitar |
| `popup` | Pop-up da V2 aparecendo após 15% de rolagem |

Ele mostrou os dois primeiros no chat, mas imagem de chat não serve: precisa de **arquivo em disco**. Falta também o FigJam da análise inicial (10 artefatos: mapa do site, inventário de telas, personas, jornada, fluxos, taxonomia, microcopy, auditoria heurística, service blueprint, wireflows) em resolução alta.

**3. Conteúdo de outros capítulos.** Traxium sem print (ele tem em casa). IMMO sem logo (`logo: null` em `data.jsx:755`) — ele vai mandar o Figma. Um `src: null` restante no par mobile do PCYES (`data.jsx`, o segundo shot da biblioteca do design system).

**4. Quirk pré-existente, fora de escopo.** Ao navegar pra um capítulo a partir de uma posição rolada, a pill do nav começa escondida até rolar pra cima. Mexer só com cuidado: o Nav é comportamento sensível.

## Estado do capítulo PCYES

O mais desenvolvido do volume. A leitura hoje:

abertura → problema → painel de números → **funil** → **gesto** → investigação → **busca** → citação → decisões → módulos → solução → resultado

Os três beats em negrito são desta rodada e usam dado desenhado:

- **Funil**: 1.705 na home → 27 no checkout. Régua comparando os 0,16% da loja com 1,1% da categoria (faixa saudável 0,8–1,5%, [Prax 2025](https://www.prax.ai/blog/benchmark-taxa-de-conversao), mais de mil e-commerces brasileiros).
- **Gesto**: mapa de calor. 182 cliques em fechar o pop-up contra 5 em comprar.
- **Busca**: o achado que ampliou o escopo. "mause" devolvia tela vazia, "mouse" devolvia mousepad. O argumento central é **letramento**: exigir ortografia exata numa loja de hardware escolhe um público e dispensa o resto.

Os dois primeiros sustentam duas decisões da V2, ambas rastreáveis ao dado: pop-up só após 15% de rolagem, e busca tolerante a erro com ranqueamento e termos sugeridos.

Dois componentes de scroll, ambos em `Capitulo.jsx`:

- **`CenaScroll`** — a cena de abertura entra num quadro pequeno (34% da tela) que cresce até a página inteira. Trilho de 1900px, abertura completa em 70% dele. Calibre por `altura` e `largIni`.
- **`ModuloPassos`** — texto preso à esquerda que troca quando cada prova cruza o meio da tela (IntersectionObserver, `rootMargin: -45%`), com régua de progresso. No mobile o sticky solta e o texto vai acima de cada figura. Dados em `modulos[].passos[{k,t,p,fig}]`.

## Planos antigos

`docs/superpowers/plans/` guarda os planos de 2026-05-29 (build/deploy, a11y, integração de conteúdo). Histórico, não roteiro.
