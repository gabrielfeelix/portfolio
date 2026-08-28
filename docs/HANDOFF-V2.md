# Handoff: home da V2, depois do kit

Escrito em 2026-08-28, no fim da sessão que montou o kit e remontou a home.
Substitui a versão anterior deste arquivo. Não leia transcript: o repositório,
`docs/ANALISE-REFS.md` e este arquivo têm tudo.

## Antes de tudo

1. Invoque a skill `token-hygiene` e siga as regras dela na tarefa inteira.
2. Leia, nesta ordem: este arquivo e **`docs/ANALISE-REFS.md`**, que é a base de
   direção e não é opcional. Os specs antigos
   (`docs/superpowers/specs/2026-08-28-*.md`) continuam valendo só para a página
   de caso; a home foi refeita por cima deles.
3. A tarefa desta próxima sessão é **caçar erro visual**, não redesenhar. Ver
   "O que provavelmente está errado", abaixo. Gabriel ainda não viu o resultado.

## O estado, em uma frase

A home foi remontada sobre um kit de componentes, builda, roda sem erro de JS,
sem overflow horizontal a 1440 / 1280 / 390, e a página de caso continua
abrindo. **Ninguém olhou com olho humano ainda.**

## O que aconteceu nesta sessão

A home anterior tinha sido recusada por Gabriel ("não gostei muito, esperava
outra coisa"). Ele destrinchou as referências em detalhe e o diagnóstico virou
`docs/ANALISE-REFS.md`: não faltava seção, faltava gramática. Sete mecanismos
medidos no código das refs, e a V2 não tinha nenhum deles.

Decisão dele, literal: "quero que você faça o IDEAL, desde kit, padrões, tudo
que é bom fazer, aí vc pode montar, sei la como vc prefere, a ordem, só fz, eu n
manjo". Ou seja: as escolhas abaixo foram do agente, com a análise como base, e
ainda **não passaram pelo crivo dele**.

## O kit

`v2/Kit.jsx` + `v2/kit.css`. A regra está no topo do arquivo: nenhuma dobra da
home desenha cromo, título ou mídia por conta própria; se falta componente, ele
entra no kit primeiro.

| Componente | O que é |
|---|---|
| `Cromo` | a tripla `( _03 ) NOME ©26` na mono, no topo de toda dobra |
| `Relogio` | relógio vivo com Maringá, no hero |
| `Dobra` | o `<section>`, que já monta o cromo, a largura e o fundo |
| `Titulo` | 104px, com marca ® opcional, revelado por cortina |
| `Cabecalho` | as 5 partes do viper: olho, título, lead, CTA, nota + prova |
| `FitaMidia` | a fita do bungee: colunas em arco, sangrando, vídeo + imagem |
| `Quebra` | imagem/vídeo full-bleed entre dobras, com parallax |
| `Contador` | número 0→N a 128px |

## A gramática (v2/tokens.css)

| | antes | agora |
|---|---|---|
| Fontes | Switzer só | Switzer + **Geist Mono** (só cromo) |
| Escala | 128/72/64/44/17/14 | 140/104/128/22/17/11, sem miolo |
| Tracking display | -0.032em | -0.055em |
| Raio | 20/24/28 | 0, com 500px só no arco da fita |
| Medida de texto | 1000px | 809px |

Geist Mono foi escolhida porque é grotesk como a Switzer, tem figura tabular
para contador e relógio, e não carrega o tique retrô da Space Mono nem o de
editor da JetBrains Mono. Carrega de `fonts.googleapis.com` no
`v2/index.template.html`.

Os apelidos `--v2-t-manifesto`, `--v2-t-painel`, `--v2-t-frase`, `--v2-t-num` e
`--v2-t-bloco` continuam existindo, mas agora apontam para os cinco degraus. Não
crie um sexto degrau: se um componente pede, o degrau escolhido está errado.

## A ordem da home, e o argumento dela

```
hero (+ relógio) → fita de mídia sangrando (a passagem que faltava)
01 tese, partida esquerda/direita → marcas coladas nela
02 trabalho, cabeçalho de 5 partes, pilha grudada
   → quebra de fumaça full-bleed
03 números (4 · 18 · 3 · 2+)
04 método, numerado na mono
05 trajetória
06 GABRIEL, com a foto cruzando por cima (efeito do porto)
07 peças, fora da hierarquia de propósito
```

Os quatro números saem de `volume/data.jsx` (COMPANIES, CASE_ORDER,
PIECE_ORDER) e do ano de início 2024. **Nenhum foi inventado, e nenhum pode
ser.**

## Mídia de banco, temporária

`volume/assets/stock/ink-*.mp4`, seis vídeos do Mixkit (licença comercial
liberada, sem atribuição). Tinta preta e vermelha em fundo branco: não é stock
genérico, é a mesma linguagem que o portfólio já tem em
`volume/assets/ink-splash.png` e `splatter.svg`, e o vermelho do 41999 bate com
`--v2-accent`.

Unsplash e Pexels estão atrás de bot-wall (Anubis e Cloudflare); Playwright não
passa. Mixkit passa via Playwright, e o padrão de URL é
`https://assets.mixkit.co/videos/{id}/{id}-720.mp4`, com thumb em
`{id}-thumb-360-0.jpg`. O script de coleta ficou no scratchpad da sessão, então
refaça se precisar: abra `https://mixkit.co/free-stock-video/<categoria>/` e leia
`video[src]` do DOM, porque o network só serve os previews pagos do Envato.

**Os seis mp4 somam 28MB e estão versionados.** Não tem `ffmpeg` nem
ImageMagick nesta máquina. Antes de qualquer publicação isso precisa cair, e a
saída certa é trocar por gravação de tela do Gabriel, não comprimir stock.

## Dois bugs de motion que custaram tempo

Ambos estão anotados em `v2/motion.js`, e ambos fazem a dobra sair **em branco**,
sem erro no console:

1. `clipPath` não interpola com `whileInView` no motion v13. Com `animate`
   funciona, e é por isso que o `useMaskLine` do hero sempre funcionou.
2. `overflow: hidden` no ancestral zera o retângulo do IntersectionObserver
   quando o filho está deslocado para fora dele. O observer nunca acusa entrada
   e a animação nunca dispara. Por isso `useCortina` devolve um `ref` para a
   janela (que não se move) em vez de props de `whileInView`.

Se uma dobra nova sair invisível, comece por aqui.

## O que provavelmente está errado, e ninguém conferiu

Lista honesta do que ficou fora de verificação nesta sessão. Confira com print,
não com leitura de código:

1. **`axe` não rodou** nesta versão da home. O cromo em `--v2-muted` sobre
   branco, a nota de contador e o olho em `--v2-accent` a 11px são os
   candidatos a falhar contraste. O accent já não passa AA em texto normal
   (4.61:1), e agora ele aparece em texto de 11px em três lugares: `.v2-olho`,
   `.v2-passo-n` e `.v2-cartao-idx`. **Isto é uma violação provável, não uma
   suspeita.**
2. **`prefers-reduced-motion` não foi testado** depois do kit. `useCortina` e
   `useContador` têm ramo de reduced-motion escrito mas não medido.
3. **A fita de mídia (`FitaMidia`) é `aria-hidden`** e as capas de caso estão
   dentro dela. Confira se isso não some com conteúdo que devia ser lido.
4. **A altura da fita é `46vh`** e ela vem logo depois do hero preso. Em tela
   baixa (1280x620) pode encavalar com a passagem de cobertura do hero.
5. **`.v2-sobre` tem `height: 86vh`** com a foto em `position: absolute`
   escalando de 0.55 a 1. Em viewport curta a foto pode passar do nome ou
   estourar a janela.
6. **O raio virou 0 na página de caso inteira** (`--v2-r-card/media/secao`).
   A página abre, mas ninguém olhou dobra a dobra se algum componente dependia
   do raio para não parecer colado.
7. **Tab e foco** não foram percorridos depois do kit.
8. **A assinatura** em `.v2-sobre-ass` é o nome em itálico, placeholder
   assumido. Vira SVG quando Gabriel mandar a dele.
9. O `Cabecalho` usa `align-items: end`, então quando a coluna direita é alta
   (dobra `02`) o título desce para o rodapé da linha. É intencional, mas pode
   ler como desalinho.

## Armadilhas que continuam valendo

- `npm run build` **não** emite `dist/v2/`. Use `BUILD_V2=1 npm run build`
  (`build.mjs:41`).
- `v2/kit.css` precisa estar na lista `ordem` de `buildV2Css()`
  (`build.mjs:217`), depois de `tokens.css`.
- O servidor estático não faz fallback de rota: `/v2/case/pcyes` responde 404.
  Para ver a página de caso, abra `/v2/` e clique num card.
- `position: sticky` só gruda dentro do bloco que o contém, e nenhum ancestral
  pode ter `overflow` diferente de `visible` nem `transform`.
- Espaço no fim de um `inline-block` é descartado.
- `pkill -f chromium` mata o próprio shell. Use `pkill -f "[h]eadless_shell"`
  numa chamada separada.
- Playwright vive em `/home/gabrielbarbosa/.claude/node_modules/playwright`.
- Verificação: `node tools/home-v2.mjs medidas` e `... prints`, com
  `cd dist && python3 -m http.server 8793 --bind 127.0.0.1`.

## Como Gabriel decide

Por comparação de print, nunca por descrição. Print de opção A contra opção B
funciona; parágrafo descrevendo a proposta não funciona. Ele é designer, fala
português, e a regra de copy dele proíbe travessão e menção gratuita a IA.

## O que ele ainda deve

1. Gravação de tela dos protótipos (PCYES primeiro, é o caso com mais material).
   Os slots já existem na fita e na quebra: é trocar o `src` em
   `v2/Home.jsx`, constante `INK`.
2. A assinatura em SVG.
