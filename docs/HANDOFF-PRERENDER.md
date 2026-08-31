# Pré-render da home — feito em 31/08/2026

Este documento era o plano. Agora é o registro: a tarefa foi executada e
medida, e sobe neste commit. Confira o deploy pela seção 5. O que sobrou de
plano está na seção 6.

---

## 1. O que existe hoje

O `npm run build` escreve o HTML do **hero** dentro de `dist/index.html`, no
lugar da `<div id="v2-root"></div>` vazia. A marcação sai dos MESMOS
componentes React que o cliente monta, por `renderToString`.

- `site/entrada-ssr.jsx` — a árvore do servidor: `Nav` + `Hero`, nada mais.
- `preRender()` em `build.mjs` — roda o bundle num contexto `node:vm` por
  idioma e devolve as duas marcações.
- `buildHtml()` — escreve **três** arquivos, e os três são necessários.

**Ninguém escreve, lê ou concilia HTML.** Quem edita a home continua editando
só o `.jsx`; o HTML sai junto, sozinho. Se algum dia for preciso corrigir o
pré-render editando HTML à mão, a implementação está errada — pare e repense
em vez de aceitar a duplicação. Era a objeção do Gabriel e ela continua sendo
a regra.

**Não hidratamos.** O cliente segue com `createRoot(...).render(...)`, que
limpa o container e monta do zero. O que o servidor escreve é o estado
`initial` do Framer Motion, ou seja exatamente o primeiro quadro que o cliente
desenharia — é por construção que não pisca, e está medido (seção 4).

### Os três arquivos, e por que três

| arquivo | serve | conteúdo |
|---|---|---|
| `dist/index.html` | `/` | hero pré-renderizado, pt |
| `dist/en.html` | `/en` | hero pré-renderizado, en |
| `dist/rota.html` | todo o resto | a casca vazia de sempre |

O rewrite manda todo caminho que não é arquivo para um HTML só. Com a home
dentro dele, abrir `/case/pcyes` direto passaria a pintar a HOME por segundos
antes de trocar pelo caso — trocar tela branca por tela errada, que é pior.
Por isso `rota.html` existe e é para onde vai todo o resto.

Os três nomes estão amarrados aos `rewrites` do `vercel.json` E ao proxy do
`--serve`, em `build.mjs`. Renomear um pede mexer nos três lugares. O
`vercel.json` declara `/` → `/index.html` **explicitamente**, e não por
confiar na ordem entre sistema de arquivos e rewrite: se essa ordem virasse, o
pré-render deixaria de ser servido sem erro nenhum, que é a pior forma de
quebrar.

---

## 2. Só o hero, e isso foi medido

A primeira versão escrevia a home INTEIRA — 55 KB, 77 `<img>`, 48 `<svg>`.
Não funcionou, e o número que explica está numa linha só: **o app passou a
montar em 3,72s em vez de 2,16s.**

| | home inteira | só o hero |
|---|---|---|
| FCP | 4,6s → 1,1s | 4,6s → 0,9s |
| LCP | 4,9s → **6,3s** | 4,8s → 5,1s |
| app monta | 2,16s → **3,72s** | 2,11s → 2,68s |
| nota Lighthouse | **−36** | **+6 / +7** |

Parsear e fazer layout de um DOM que o React vai jogar fora custa CPU, e tudo
que depende de JS desliza junto — inclusive o elemento de LCP. Abaixo da dobra
o pré-render não pinta nada que alguém veja: é custo puro.

Uma armadilha do caminho, que vale registrar porque não era óbvia: com a home
inteira escrita, o parser descobria as imagens todas de uma vez e o limiar de
`loading="lazy"` do Chrome é generoso o bastante para buscar quase tudo —
1.871 KB viraram 2.837 KB. `preRender()` ainda tira o `src` de qualquer imagem
com `loading="lazy"`, hoje como rede de segurança: com só o hero no HTML não
sobra nenhuma, mas se alguém voltar a incluir dobra, o guarda-chuva já está
aberto.

---

## 3. O que melhorou, medido

Local contra local, mesmo build, mesmo servidor com gzip, mesma rede simulada
(1,6 Mbps · 150ms RTT · CPU 4x). `node tools/mede-home.mjs`.

| | sem pré-render | com pré-render |
|---|---|---|
| FCP | 4,5s | **0,95s** |
| Speed Index (Lighthouse) | 4,6s | **3,4s** |
| nota de desempenho | 43–44 | **50** (duas rodadas: +6 e +7) |
| LCP | 4,6s | 5,1s |
| TBT | 1,5–1,7s | 1,3–1,4s |
| CLS | 0 | 0 |
| bytes até o load | 1.871 KB | 1.872 KB |
| HTML (gzip) | 3,0 KB | 4,1 KB |

Os números absolutos NÃO são comparáveis com os do PageSpeed: a máquina é
outra. O que vale é o delta.

**O que o visitante ganha, dito com honestidade:** a **capa** do hero pinta ~3,5s
mais cedo. As **palavras** continuam esperando o JS, porque o design as mantém
invisíveis até revelar. Medido pixel a pixel: a metade de cima do quadro do
servidor é praticamente idêntica à do cliente (diferença de 1,5 a 6 por canal);
a metade de baixo diverge porque é onde ficam título, subtítulo e botões.

O LCP piora ~0,5s, e a causa é banda: o poster de 78 KB agora carrega ANTES do
`app.js` em vez de depois, atrasando a montagem em ~0,5s. É o preço de pintar
a capa 3,5s antes, e vale.

---

## 4. Como verificar (obrigatório antes de subir mudança no hero)

```
npm run dev                        # noutro terminal
node tools/primeiro-quadro.mjs     # ou: npm run verifica:home
```

Ele responde duas perguntas: as rotas sobem sem erro de JS e sem 4xx, e o
quadro do servidor bate com o **primeiro** quadro do cliente — texto idêntico
e todas as caixas na mesma posição.

Dois cuidados dentro dele que quebram em silêncio se removidos:

- o quadro do servidor é isolado **bloqueando `/app.js`**, e não desligando o
  JavaScript: com o JS desligado o `evaluate` do Playwright morre junto e não
  dá para medir nada;
- o quadro do cliente é lido num `MutationObserver` instalado ANTES do app, no
  callback da primeira inserção. Comparar com a tela assentada acusaria a
  animação de entrada como defeito — `useTardio` começa 16px abaixo, e é para
  começar.

Não precisa rodar para trocar uma palavra. Precisa ao mexer em
`site/entrada-ssr.jsx`, no `Hero`, no `Nav`, ou em `preRender()`/`buildHtml()`.

Para medir: `npm run build && node tools/mede-home.mjs`. Ele sobe servidor
próprio com gzip sobre `dist/` e mede os dois lados — `?vazio=1` é o "antes".
Medir o servidor de dev não serve: ele não comprime e o JS cru esconde tudo.

---

## 5. Confira depois do deploy

1. `curl -s https://gabrielfelix-ux.4yu.com.br/ | grep -c v2-hero-capa` tem de
   devolver 1, e não 0. Zero significa que o rewrite não pegou e o pré-render
   virou no-op silencioso.
2. O mesmo em `/en`, com `<html lang="en">`.
3. `curl -s .../case/pcyes | grep -c v2-hero-capa` tem de devolver **0**: caso
   não pode vir com a home escrita dentro.
4. PageSpeed duas vezes, use a melhor. O TBT oscila muito com a carga do
   runner do Google; FCP, LCP, SI e CLS ficam estáveis e são esses que valem.

---

## 6. O que sobrou

**A alavanca maior que o pré-render, e ela é decisão do Gabriel.** O elemento
de LCP é o `<p class="v2-hero-sub">`, e o Chrome **exclui do LCP tudo que está
em `opacity: 0`**. O `useTardio(1.4)` mantém esse parágrafo invisível por 1,4
segundo de propósito, então o LCP é, por construção, montagem + 1,4s +
animação. Nenhuma otimização de rede ou de HTML alcança isso.

A saída conhecida é começar a animação em `opacity: .1` em vez de `0` — quase
invisível para o olho, mas visível para o navegador, que passa a contar o
elemento no primeiro quadro. Custaria segundos de LCP. **É mudança na
coreografia de entrada do hero, então é escolha de design e não minha.**
Ver [DebugBear sobre animações de opacidade e LCP](https://www.debugbear.com/blog/opacity-animation-poor-lcp).

**A `description` do `en.html` continua a portuguesa.** O texto dela mora
dentro do efeito de rota em `site/app.jsx`, e copiá-lo para o build criaria a
segunda fonte de verdade que este trabalho inteiro existe para evitar. O app
corrige na montagem, como já corrigia antes — não é regressão, é a mesma
dívida de sempre. Resolver de verdade é mover a copy para `site/copy.js`, que
já tem o espelho pt/en.

**O `LazyMotion`** continua disponível como próximo passo independente: trocar
o import cheio do Framer Motion por `LazyMotion` + `domAnimation` tira ~85 KB
dos 316 KB do bundle e ataca o TBT. São 294 usos de `motion.*` em 11 arquivos,
mecânico, sem custo de manutenção depois. Confirmado que o site não usa `drag`
nem `layout`, que é o que essa troca corta.

---

## 7. Detalhes que vão custar tempo se não estiverem escritos

**`node:vm`, e não `import`.** Três coisas precisam valer ao mesmo tempo:
`volume/data.js` e `volume/i18n.js` são scripts CLÁSSICOS (abrem com
`const { useState } = React` nu, fecham com `Object.assign(window, ...)`, e
i18n alcança o `const CHAPTERS` do outro por referência léxica); `site/i18n.js`
lê `window.LANG` na CARGA DO MÓDULO, então com `import` o cache do Node faria
o segundo idioma sair no primeiro; e o React que renderiza tem de ser o MESMO
que `data.js` usa nos hooks. Contexto novo por idioma entrega as três.

**A ordem dentro do vm é a mesma das tags**: bundle (que publica o React),
depois `data.js`, depois `i18n.js`. Pelos mesmos motivos do comentário de
`buildHtml()`.

**`window.LANG` é semeado à mão** no contexto antes de tudo, porque
`site/i18n.js` o lê antes de `volume/i18n.js` rodar. Os dois batem porque o
`location.pathname` do contexto é o do idioma que está sendo gerado.

**O `Relogio` congela no horário do build e isso NÃO é problema — mas por um
motivo que não se adivinha.** Ele fica dentro de `.v2-hero-topo`, que nasce com
`clip-path: inset(0 0 100% 0)` vindo do `useMaskLine`: no quadro do servidor a
linha inteira está recortada a zero, então o horário errado (na Vercel o build
roda em UTC, três horas à frente de Maringá) nunca chega a aparecer. Se algum
dia a animação de entrada do topo mudar, isto volta a ser problema e a saída é
renderizar o relógio vazio no servidor.

**Ao testar, mate o servidor de dev primeiro.** Ele fica vigiando e
reconstrói `dist/` em modo dev por cima do build de produção — a medição sai
com número de página quebrada e leva um tempo para desconfiar.

**O Lighthouse não está no `package.json`.** Foi instalado com
`npm i --no-save lighthouse` só para medir. `tools/mede-home.mjs` não depende
dele: usa CDP direto, com garganta real em vez do modelo Lantern.
