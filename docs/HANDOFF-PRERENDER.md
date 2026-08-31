# Handoff — pré-renderizar a home

Escrito em 31/08/2026, para quem for executar. Lê-se sozinho: não depende da
conversa em que nasceu.

---

## 1. Antes de tudo: isto NÃO é trabalho duplo

O Gabriel levantou a objeção certa, e ela é o motivo de este documento existir:

> "toda alteração que eu for fazer agora vamos ter que pré-renderizar em HTML e
> em JS toda vez, fazer match entre os dois e subir, é trabalho duplo vitalício"

**Se fosse assim, não faça.** Um site com HTML escrito à mão em paralelo ao
React é um site que vai divergir na terceira alteração e mentir para sempre.

Não é o que está proposto aqui. O HTML é **gerado a partir dos mesmos
componentes React**, dentro do `npm run build`, por `renderToString`. Existe uma
fonte de verdade só — `site/Home.jsx` e os arquivos que ele importa — e o HTML
é um artefato descartável, como `dist/app.js` já é hoje.

Na prática, depois de pronto:

- quem edita a home continua editando **só** o `.jsx`;
- `npm run build` gera o HTML novo sozinho;
- ninguém abre, lê ou concilia HTML nenhum;
- se o React e o HTML divergirem, **o build quebra** — não a produção.

O custo vitalício real é outro, menor, e está na seção 8. Leia antes de
começar, porque ele é o que decide se vale a pena.

---

## 2. Contexto do projeto

Portfólio do Gabriel Felix Barbosa, em `gabrielfelix-ux.4yu.com.br`.

- SPA em React 18, **sem framework**. Build próprio em `build.mjs` com esbuild.
- React e ReactDOM entram como **UMD global** (`window.React`), não como
  import — ver o plugin `reactGlobais` em `build.mjs`.
- O conteúdo mora em `volume/data.jsx` e `volume/i18n.jsx`, que são **scripts
  clássicos**: eles terminam com `Object.assign(window, { CHAPTERS, ... })`, e
  o app lê de `window` por `site/content.js`.
- A ordem das tags no HTML é load-bearing: React → data → i18n → app. Está
  comentada em `buildHtml()`, em `build.mjs`.
- Deploy: Vercel, automático no push para `main`. Sem passo manual.
- Idioma vem do caminho: `/en` e `/en/...` são inglês, o resto é português.

Leia também `docs/HANDOFF.md` (estado geral) antes de mexer.

---

## 3. O problema, medido

PageSpeed em 31/08, celular, depois das otimizações de rede já feitas:

| métrica | valor |
|---|---|
| Desempenho | 50 |
| FCP | 2,7s |
| LCP | 4,5s |
| Speed Index | 7,3s |
| TBT | 1.070ms |
| CLS | 0 |

Desktop está em 98 e não precisa de nada.

O diagnóstico, medido em 4G lento com CPU 4x mais lenta:

```
todos os recursos chegam até   2.084ms
FCP acontece em                5.096ms
                               -------
CPU pura, antes de pintar      3.012ms
```

A rede já foi resolvida. O que sobra é que o servidor entrega
`<div id="v2-root"></div>` **vazio**: nada aparece até o React baixar, parsear,
executar e montar a home inteira. A tira de quadros do Lighthouse mostra isso —
os quatro primeiros são brancos.

É por isso que o Speed Index (7,3s) está pior que o LCP (4,5s): a tela fica em
branco muito tempo e depois preenche de uma vez.

**Metade do bundle é o Framer Motion**: 144 KB de 316 KB.

---

## 4. O que já foi feito (não refaça)

Commit `acc53a7`:

- o vídeo do hero (834 KB) só carrega depois do `load`, em
  `requestIdleCallback`; antes dele aparece o poster de 78 KB;
- o `gtag.js` (153 KB) também só depois do `load` — nenhum evento se perde,
  porque `window.gtag` empilha em `dataLayer` e o script processa a fila
  quando chega;
- as fontes saíram de quatro origens de terceiro e são servidas de
  `/volume/fonts/v2/`, com `@font-face` em `site/fontes.css` e preload dos dois
  pesos da primeira tela.

Resultado: bytes até o `load` de ~1,6 MB para 637 KB, desktop de 82 para 98,
celular de 34 para 50.

---

## 5. A tarefa

Fazer o `build.mjs` gerar o HTML da **home** dentro de `dist/index.html`, no
lugar da div vazia.

### Escopo

- **Só a home** (`/` e `/en`). As outras rotas continuam como estão.
  Motivo: é a página que recebe o link compartilhado e a que o PageSpeed mede.
  Case, processo, sobre e blog são navegação interna, já com o JS quente.
- Alvo: FCP e Speed Index caindo para perto do que o desktop já entrega.
- Não mexer em desktop, que está em 98.

### A escolha que importa: hidratar ou substituir

**Faça a versão que SUBSTITUI.** Ou seja: o HTML pré-renderizado é pintura
inicial, e o cliente segue chamando `createRoot(...).render(...)` como hoje —
o React limpa o container e monta do zero.

- ganho: FCP, LCP e Speed Index, que é o que dói;
- custo: o React refaz o DOM uma vez, que é exatamente o que ele já faz hoje;
- **não** use `hydrateRoot` nesta primeira volta.

Por que não hidratar: hidratação exige que o HTML do servidor bata exatamente
com o primeiro quadro do cliente, e esta home tem Framer Motion em 294 pontos,
Lenis, cursor customizado e um relógio que imprime a hora. Qualquer diferença
vira erro de hidratação e o React descarta a árvore inteira — você teria o
custo do SSR sem o benefício. Hidratar pode ser um passo dois, depois de o
primeiro estar medido e estável.

---

## 6. Como fazer

### 6.1 O que já está a favor

Verificado em 31/08:

- `react-dom/server` está disponível (React 18.3.1, já em `dependencies`);
- **nenhum** módulo de `site/` toca `window`, `document`, `matchMedia` ou
  `localStorage` em nível de módulo — só dentro de função ou efeito;
- `site/content.js` lê `window.CHAPTERS` etc. dentro de funções, não na
  importação. Basta popular `global.window` antes de renderizar.

Isso é o que torna a tarefa viável. Se alguma dessas três deixar de valer, o
plano muda.

### 6.2 Passos

1. **Uma entrada de servidor.** Crie `site/entrada-ssr.jsx` que exporta uma
   função recebendo o idioma e devolvendo o elemento React da home — o mesmo
   que `app.jsx` monta na rota `/`. Não duplique árvore: importe o que já
   existe.

2. **Popular os globais no Node.** Antes de renderizar, o build precisa de
   `window` com o conteúdo publicado. Duas saídas, em ordem de preferência:
   - importar `volume/data.jsx` e `volume/i18n.jsx` num contexto que já tenha
     `global.window = {}` e `global.React` definidos, deixando eles fazerem o
     `Object.assign` de sempre;
   - se isso brigar com o formato clássico deles, execute os arquivos já
     transpilados de `dist/volume/*.js` com `node:vm` num contexto preparado.
   O importante é **não reescrever o conteúdo em outro lugar**.

3. **Renderizar no build.** Em `build.mjs`, depois de `buildBlog` e antes de
   `buildHtml`, gere a marcação com `renderToString` e injete no lugar de
   `<div id="v2-root"></div>`. Gere as duas versões, pt e en.

4. **Servir a versão certa.** O HTML é o mesmo para todo caminho (é SPA
   estática com rewrite). Como `/en` precisa do HTML em inglês e `/` do
   português, você tem duas saídas:
   - gerar `dist/index.html` (pt) e `dist/en.html` (en) e apontar o rewrite do
     `vercel.json` para cada um;
   - ou pré-renderizar só o português e aceitar que `/en` pinta em português
     por um quadro antes de o React trocar.
   **Prefira a primeira.** A segunda entrega uma piscada de idioma errado
   justamente para o público que o inglês existe para atender.

5. **`useLayoutEffect`.** Há 5 usos, em `site/app.jsx` e `site/motion.js`. No
   servidor eles emitem aviso. Não quebram, e como não vamos hidratar, não
   causam divergência. Silencie o aviso no build se poluir a saída, mas **não**
   troque `useLayoutEffect` por `useEffect` no cliente para calar o servidor:
   o comentário em `app.jsx:237` explica que a diferença ali é visível.

### 6.3 Armadilhas deste repositório

- **`Relogio`** (em `site/Kit.jsx`) imprime a hora. No HTML gerado ela vai
  congelada no horário do build. Como não hidratamos, o React corrige no
  primeiro quadro — mas confira que não fica um horário errado visível por
  meio segundo. Se ficar, renderize o relógio vazio no servidor.
- **`Rotativa`** (em `site/Home.jsx`) troca de palavra por timer. No servidor
  ela deve sair no item 0, que é o que o cliente também mostra primeiro.
- **A cortina e o `carregando.css`** entram inline no head e valem no primeiro
  quadro. Confira que o HTML novo não aparece **atrás** ou **na frente** da
  cortina de forma errada — é o ponto mais provável de dar errado visualmente.
- **`clean()`** em `build.mjs` preserva `dist/volume`. Se você gerar arquivo
  novo em `dist/`, garanta que ele não é apagado nem deixado para trás.
- **O `dist/` não é versionado.** Não commite HTML gerado.

---

## 7. Como verificar (obrigatório antes de subir)

1. **Nada quebrou.** Suba `PORT=45553 node build.mjs --serve`, abra `/`, `/en`,
   `/case/pcyes`, `/processo`, `/sobre`, `/blog` e confira que não há erro de
   JS no console e nenhuma requisição 4xx.

2. **O primeiro quadro bate.** Este é o teste que decide. Com Playwright,
   tire dois screenshots do topo da home:
   - um com JavaScript **desligado** (`context.setJavaScriptEnabled(false)`) —
     é o que o HTML pré-renderizado entrega sozinho;
   - outro com o React já montado.

   Eles não precisam ser idênticos ao pixel (o motion anima na entrada), mas o
   **texto, a posição do título e a capa** precisam coincidir. Se o quadro sem
   JS estiver em branco, o pré-render não funcionou. Se estiver visivelmente
   diferente, vai piscar para quem visita — conserte antes de subir.

3. **Mediu?** Rode o mesmo teste de rede que produziu os números da seção 3:
   4G lento (150ms de latência, 1,6 Mbps) com CPU 4x mais lenta, e compare FCP
   e Speed Index. Espere FCP perto de 1,3s. Se não melhorou, **não suba** —
   reverta e escreva o que aprendeu aqui neste arquivo.

4. **Depois do deploy**, rode o PageSpeed duas vezes e use a melhor. O TBT do
   Lighthouse varia muito com a carga do runner do Google: em 31/08 duas
   medições seguidas do mesmo commit deram 38 e 50, com TBT de 4.330ms e
   1.070ms. As outras quatro métricas ficaram estáveis nas duas — são elas que
   você deve olhar.

---

## 8. Como isso passa a ser gerido (a pergunta do Gabriel)

Depois de pronto, o fluxo de quem edita o site é **exatamente o de hoje**:
mexe no `.jsx`, roda o build, sobe. O HTML sai junto, sozinho.

O que muda de verdade, e é honesto dizer:

**O build fica mais lento.** Alguns segundos, uma vez por build.

**Um jeito novo de quebrar.** Se alguém escrever um componente que toca
`window` fora de efeito, o build passa a falhar. Isso é uma melhora disfarçada
de custo: hoje esse mesmo erro passa batido e só aparece no navegador de quem
visita. Falhar no build é o lugar certo de falhar. A mensagem de erro do Node
diz o arquivo e a linha.

**Um teste que precisa continuar rodando.** O da seção 7.2, o dos dois
screenshots. Ele é o que garante que o HTML e o React não divergiram. Deixe-o
como script em `tools/`, documentado, e rode antes de subir mudança grande na
home. Não precisa rodar para trocar uma palavra.

**O que NÃO muda:** ninguém escreve, lê ou concilia HTML. Não existe segundo
lugar para atualizar. Não existe "fazer match" manual. Se em algum momento
alguém precisar editar HTML à mão para consertar o pré-render, a
implementação está errada — pare e repense em vez de aceitar a duplicação.

### Quando abortar

Se, ao executar, você descobrir que:

- os componentes da home não rodam no Node sem serem reescritos, **ou**
- o quadro sem JS não bate com o do React sem gambiarra,

então pare e **não force**. O caminho alternativo, sem nenhuma dessas
complicações, é reduzir o JS: trocar o import cheio do Framer Motion por
`LazyMotion` + `domAnimation` (confirmado que o site não usa `drag` nem
`layout`, que é o que essa troca corta), o que tira cerca de 85 KB dos 316 KB
do bundle. É mecânico, são 294 usos de `motion.*` em 11 arquivos, e ataca o TBT
em vez do FCP — menos ganho, risco menor, e zero custo de manutenção depois.

Escreva aqui o que decidiu e por quê, para a próxima pessoa não refazer a
investigação.
