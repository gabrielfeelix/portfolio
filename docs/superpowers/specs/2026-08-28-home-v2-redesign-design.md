# Home da V2, redesenho

Escrito em 2026-08-28. Sucede o spec `2026-08-28-portfolio-v2-design.md`, que
continua valendo para a página de caso e para as decisões D1 a D8. Este documento
cobre só a home.

## Problema

A home entregue nas Fases 6 a 8 está correta e sem graça. Toda seção usa o mesmo
gesto: `Label` de 220px à esquerda, conteúdo à direita, largura de 1000px, revelação
por `useRise`. Manifesto, processo, casos e peças são quatro variações do mesmo
bloco. Não há uma única imagem em largura cheia, nenhuma mudança de escala e nenhum
momento que o visitante lembre depois de fechar a aba.

O material existe: 76 imagens em `volume/assets/projetos/`, sendo PCYES 33,
Locarmais 16, Portfólio 7, Odex 6, Oderço Revenda 5. Os quatro casos de
`CASE_ORDER` têm de 2 a 5 telas cada. O que falta é hierarquia, não conteúdo.

## Princípio

A home alterna três larguras e nunca repete o gesto da seção anterior:

| Largura | Uso |
|---|---|
| Cheia, sangrando | hero, pilha de casos, fita de peças, fecho |
| Coluna larga (1000px) | processo, onde estive |
| Coluna estreita (720px) | declaração |

Onde gosto e legibilidade brigarem, vence legibilidade, e a divergência é dita.

## Decisões

**H1. A home é reescrita inteira.** `Home.jsx` e `home.css` são refeitos.
`Case.jsx` e `case.css` não são tocados nesta fase.

**H2. A tipografia troca para Switzer.** Hanken Grotesk é limpa e genérica em
corpo grande. A escolha saiu de uma comparação de print entre Hanken, Inter, Geist,
Switzer e General Sans, com a mesma frase em 76px, 40px e 17px, decidida por Gabriel
em 2026-08-28. Switzer é a mais apertada e a mais neutra em display: some atrás da
imagem em vez de competir com ela. Servida pela Fontshare
(`https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&display=swap`),
com `system-ui` de fallback. `--v2-font` em `tokens.css` passa a apontar para ela,
e a escala tipográfica é reaferida porque a métrica muda.

**H3. Os casos viram uma pilha grudada de linhas de dois.** Corrigido em
2026-08-28, depois do primeiro print: a versão de painel de foto sangrando em
`88vh` foi feita, vista e recusada por Gabriel, que preferiu o tratamento do
`viper-template`. O formato final é o da ref, medido nela: os casos andam em
**linhas de dois cards**, e a linha inteira é que gruda, num `top` 40px maior
que a anterior (`top:70px` e `top:110px` na ref). A linha seguinte sobe e cobre
a anterior, sobrando a lombada de 40px.

O card é moldura clara, não foto sangrando: fundo `--v2-superficie`, borda de
1px, raio de mídia, a imagem embutida com 10px de respiro e a legenda embaixo
(título e descritor à esquerda, domínio à direita). Medida da ref: 658 por 526.
A mídia é 16/10, e não 4/3: print de produto é largo, e num box de 4/3 o `cover`
cortava o texto da tela no meio da palavra.

A escala do coberto cai só para 0.97, porque quem separa as camadas é a
lombada, não o encolhimento. Quatro casos dão duas linhas. Locar Mais, que não
tem foto de capa, recebe a capa de marca, mesma solução da V1.

**H4. O manifesto vira uma declaração.** Uma frase só, em `--v2-t-manifesto`,
revelada palavra a palavra no scroll. Os dois parágrafos de apoio saem da home e
descem para `/sobre`. Coluna estreita, branco generoso em volta. É o silêncio antes
da pilha.

**H5. O processo cai de seis etapas para três.** Seis linhas numeradas são um índice
disfarçado de conteúdo. Viram três frases grandes, sem numeral, sem régua entre
elas. O conteúdo de `PROCESSO` em `volume/data.jsx` permanece intacto: a home passa
a consumir uma projeção de três itens, e as seis etapas continuam disponíveis para
`/processo`. A versão horizontal com scroll preso foi considerada e recusada por
Gabriel em 2026-08-28: motion caro, ruim no celular, e mais longa que o conteúdo
justifica.

**H6. As peças viram fita.** Sai a grade de sete cards com foto e sai a lista atrás
de botão. Entram duas fitas de imagem correndo em direções opostas, altura em torno
de 180px, sem título, sem card, sem etiqueta, com um link de uma linha abaixo. São
projetos extras num portfólio de UX e a hierarquia tem que dizer isso.

**H7. O fecho é o rodapé, escurecido.** Corrigido em 2026-08-28: a primeira
versão criou uma seção `Fecho` só da home, e o resultado foram dois fechos, os
dois com `id="contato"`, porque `Rodape` já existia em `Shell.jsx` e serve todas
as rotas. O `Fecho` foi removido. Quem ganha fundo `--v2-ink`, texto branco e
`data-escuro-corpo` é o `Rodape`, que passa a fechar também a página de caso.

**H8. O que fica como está.** Hero e sua saída por cobertura (`useCobertura`), o
marquee de marcas (que muda de posição, não de forma) e a timeline de `OndeEstive`,
única lista que sobrevive porque cronologia justifica lista.

## Arquitetura final da home

1. Hero, largura cheia, escuro, saída por cobertura
2. Declaração, coluna estreita, revelação por palavra
3. Pilha de casos, duas linhas de dois cards, grudadas
4. Marcas, marquee fino, respiro
5. Processo, três frases, coluna larga
6. Onde estive, timeline com logo
7. Peças, duas fitas de imagem
8. Rodapé, largura cheia, escuro (vem do Shell, não da home)

## Motion

Reaproveita o que existe em `v2/motion.js`: `spring` 200/60, `useMaskLine`,
`useParallax`, `useCobertura`, `useSticky`, `useScrollSuave` (já ligado em
`app.jsx:98`). Entram duas funções novas:

- `usePilha(indice, total)` — offset de `top`, escala e véu do painel coberto
- `usePalavra()` — revelação por palavra para a declaração

Todo movimento respeita `useReducedMotion`. Sem motion, a pilha vira quatro blocos
empilhados normais e a declaração aparece inteira.

## Riscos

- **Pilha grudada no celular.** Duas colunas em 390px dariam card de 170px, que
  não mostra tela de produto nenhuma. Abaixo de 860px a pilha desliga e vira
  uma coluna. O mesmo vale para `prefers-reduced-motion`.
- **Curso de scroll.** A pilha precisa de altura sobrando depois que a última
  linha gruda, senão a travessia acaba antes de ser vista. Medido: sem isso os
  tops iam de 96 para -354 em 1000px. Resolvido com 44vh de margem por linha e
  48vh de rodapé na seção.
- **Peso das imagens.** Quatro imagens em largura cheia mais duas fitas. Todas WebP,
  `loading="lazy"` fora do primeiro painel, e o primeiro painel entra em preload.
- **Troca de fonte.** Muda a métrica de tudo, inclusive da página de caso, que não é
  reescrita nesta fase. A família nova precisa ser conferida em `Case.jsx` antes do
  fim.

## Fora de escopo

Página de caso, `/sobre`, `/processo`, conteúdo real dos casos, e a V1 em `volume/`.
