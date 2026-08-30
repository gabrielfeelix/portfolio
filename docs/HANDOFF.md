# Handoff — 29/08/2026, fim do dia

Substitui o handoff anterior. O que veio antes está em `HANDOFF-2026-08-29.md`
e `HANDOFF-2026-08-29-noite.md`.

## O que foi feito

A quebra do meio da home virou **a travessia**: um campo noturno em cinco
camadas com parallax, altura de viewport inteira, entre "O que já saiu da mesa"
e o método.

Commits: `eefa5d1` `e58363a` `50c8967` `38c702e` `6c71cbd` `08cfbc8`.

## Decisões fechadas — não relitigar

- **A ordem da home mudou.** A quebra vinha entre os casos e os números e
  partia uma frase no meio ("o trabalho" e "a escala dele" são a mesma coisa em
  duas partes). Agora: casos → números → travessia → método → trajetória.
- **A seção tem texto**, e isso contraria `ANALISE-REFS.md` ("04 quebra de
  imagem pura, sem texto"). `PENDENCIAS-V2.md` é de 29/08 e pede "passagem, não
  banner mudo" — ela manda. A ANALISE-REFS ainda não foi corrigida.
- **A frase é da Claude, não do Gabriel.** "Acima, o que foi ao ar. Abaixo,
  como foi parar lá." Está em `site/Kit.jsx`, constante `CAMPO_FRASE`. Trocável.
- **Cinco camadas, não uma imagem.** O motivo principal não é o parallax: é o
  retrato. Imagem chapada só sabe ser cortada, e numa seção de viewport inteira
  o telefone perde a lua e metade do morro. Em camadas a composição se remonta.
- **`100svh`, nunca `vh`** — no celular o `vh` conta a barra do navegador.
- **A lua não tem alpha.** Entra por `mix-blend-mode: screen` sobre o próprio
  preto, e por isso `.v2-campo` precisa de `isolation: isolate`.

## Arquivos que importam

| | |
|---|---|
| `site/Kit.jsx` | componente `Campo`, `CAMPO_V` (curso do parallax), `CAMPO_FRASE` |
| `site/kit.css` | tudo de `.v2-campo*`, inclusive os degraus por `min-aspect-ratio` |
| `site/motion.js` | `useCamadas`, `tabelaPorAltura`, `cortina`, e as durações |
| `tools/camadas-campo.py` | regenera as 5 camadas a partir de `uploads/*-parallax.png` |
| `tools/shot.mjs` | screenshot com Playwright, percorrendo a página antes |
| `volume/assets/campo/` | as 5 camadas publicadas (~330KB) |

Os PNGs de origem (4,9MB) estão em `uploads/` e **fora do git** por `.gitignore`.
Se sumirem, as camadas em `volume/assets/campo/` continuam servindo o site, mas
não dá para reprocessar.

## Armadilhas já pagas — não repetir

- **O avião do site.** Qualquer regra que varra os filhos diretos de
  `.v2-corpo-claro` precisa excluir `.v2-voo`. Foi assim que ele sumiu sem
  ninguém notar (`position: relative` anula o `inset: 0`, a camada fica com
  altura 0, e o `overflow: clip` recorta o avião inteiro).
- **Os morros são compensados em `vw`, não em `%`.** `bottom` em `%` resolve
  contra a altura da seção, mas a altura renderizada da imagem sai da largura.
  Em `%` os morros sobem até tapar o avião em janela larga e baixa.
- **Medir o avião exige esperar a mola.** `stiffness: 80` leva mais de um
  segundo. Medir logo após um salto de scroll dá um diagnóstico falso de "ele
  está sempre fora da tela".
- **Verificar com Playwright, não com o build.** Dois bugs (a caixa de 414px do
  dito e a colisão do avião com o texto) só apareceram na tela.

## Aberto

1. **Outra sessão trabalha no mesmo clone.** Ela commitou trabalho meu dentro
   de commits dela (`9a881e4`, `533527e`, `fd118a5`). Confira o diff por arquivo
   antes de commitar.
2. **`uploads/img-capa-meio-site.png`, 1,6MB, entrou no histórico** em
   `9a881e4`. Limpar exige reescrever histórico — decisão do Gabriel, e só com
   a outra sessão parada.
3. **`.v2-linha` colide**: é o `<hr>` do Kit e o `<li>` do método ao mesmo
   tempo. Não quebrou nada; a ordem no arquivo decide.
4. **2560x1080 tem 11px de folga** entre o avião e o morro na travessia. É o
   caso mais apertado medido.
5. **`ANALISE-REFS.md` precisa ser corrigida** — ver a segunda decisão acima.

## O que deixar para trás

Toda a exploração de arte: a foto de banco, o avião vermelho no escuro, o campo
procedural em silhueta preta. Foram três direções recusadas antes desta, e o
resultado está no repositório. Não precisa do caminho.
