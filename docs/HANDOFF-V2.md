# Handoff: home da V2, depois do redesenho recusado

Escrito em 2026-08-28, no fim da sessão que reescreveu a home. Substitui a
versão anterior deste arquivo. Não leia transcript: o repositório, o spec e este
arquivo têm tudo.

## Antes de tudo

1. Invoque a skill `token-hygiene` e siga as regras dela na tarefa inteira.
2. Leia, nesta ordem: este arquivo, o spec da home
   (`docs/superpowers/specs/2026-08-28-home-v2-redesign-design.md`) e o spec da
   V2 (`docs/superpowers/specs/2026-08-28-portfolio-v2-design.md`, decisões D1 a
   D8, que continuam valendo para a página de caso).
3. **Não comece a mexer no visual antes de perguntar.** Ver "A pergunta que abre
   a próxima sessão", abaixo.

## O estado, em uma frase

A home foi inteiramente reescrita nesta sessão, está funcionando, medida e
acessível, **e Gabriel não gostou do resultado**. As palavras dele: "não gostei
muito pra falar a verdade, esperava outra coisa da homepage".

## O que ele pediu, no começo da sessão

Palavras dele, resumidas sem interpretar:

- a home estava repetitiva: segunda seção lista, terceira lista, quarta grade;
- os projetos extras não podem ficar tão evidentes, "são projetos extras num
  portfólio de UX";
- queria a vibe do `viper-template`, e o que ele mais gostou lá foi **os
  projetos sendo comidos pelos de cima**;
- queria imagens de qualidade, motion, fotos em largura total;
- queria o portfólio "bem apple": fonte massa, espaçamento, motion suave,
  bonito, "uma experiência dentro do website".

## O que foi decidido com ele, por pergunta direta

| Decisão | Escolha dele |
|---|---|
| Escopo | refazer a home inteira |
| Tipografia | trocar por uma grotesk de display |
| Fonte, por print | **Switzer** (contra Hanken, Inter, Geist, General Sans) |
| Peças extras | fita de imagens no rodapé, não grade |
| Processo | três frases, não seis etapas, e não trilho horizontal |
| Formato dos casos | **linhas de dois cards grudando**, no formato do viper, depois de ver e recusar a versão de painel de foto sangrando |

## O que existe hoje, na branch

Branch `home-v2-redesign`, **não mergeada em `main`**. Onze commits, de
`177b11a` a `6f0e9c2`.

Ordem da home (`v2/Home.jsx`): hero, declaração, pilha de casos, marcas,
processo, onde estive, fita de peças. O rodapé vem do Shell.

| Dobra | Tratamento |
|---|---|
| Hero | intocado, com a saída por cobertura que já existia |
| Declaração | uma frase, coluna de 900px, acesa palavra a palavra no scroll |
| Casos | duas linhas de dois cards; a linha gruda num `top` 40px maior que a anterior e cobre a de cima |
| Marcas | o marquee de antes, agora entre as duas dobras pesadas |
| Processo | três frases grandes, sem numeral e sem régua |
| Onde estive | a timeline de antes, intocada |
| Peças | uma fita de sete capas correndo, mais uma linha de texto com as sete sem imagem |
| Rodapé | o `Rodape` do Shell, agora escuro, valendo para todas as rotas |

Arquivos tocados: `v2/{Home.jsx, Shell.jsx, motion.js, copy.js, tokens.css,
home.css, shell.css, case.css, index.template.html}` e `tools/home-v2.mjs`.

## Medido, não achado

- Fonte aplicada: `fonteH1` = `Switzer`. A Fontshare serve 400 a 700; o peso 800
  da Hanken sumiu do projeto inteiro.
- Pilha grudando: `tops` 96 e 136 com as duas linhas na tela, lombada de 40px.
- Vão entre casos e marcas: 104px.
- `axe` sem violação na home e na página de caso, a 1440.
- Movimento reduzido: pilha vira `relative`, fita para, declaração fica em
  opacidade 1.
- Celular a 390px: uma coluna, sem overflow horizontal.
- `Tab`: um foco por card, duplicata da fita com `tabIndex={-1}`.

## A pergunta que abre a próxima sessão

O que falhou não é execução, é direção: tudo que ele pediu foi implementado e o
resultado ainda não é o que ele esperava. **Não redesenhe nada antes de saber o
quê.** A pergunta útil não é "o que você achou", é uma comparação:

> Abre o `viper-template` em `~/dev/refs/viper-template.framer.website` e a home
> em `npm run dev` → `http://localhost:5173/v2/`, lado a lado. Aponta duas
> telas da ref que você queria e que a home não tem.

Ele decide visual por comparação de print, nunca por descrição. Print de opção
A contra opção B funciona; parágrafo descrevendo a proposta não funciona.

Hipóteses do que pode estar faltando, para testar com ele, **não para
implementar por conta**:

1. A home ficou branca e quieta demais. A ref tem seções de tela cheia, fundo
   escuro alternado e imagem grande; a nossa só tem uma dobra escura, o hero.
2. Os cards de caso mostram print de tela dentro de moldura pequena. Ele falou
   em "fotos em largura total" e isso não sobreviveu à escolha do formato de
   card, que veio depois.
3. Falta transição entre seções. Cada dobra começa e termina no branco, e a
   única passagem trabalhada é hero → corpo.
4. O material de imagem é desigual: PCYES 33, Locarmais 16, Odex 6, Oderço 5, e
   Locarmais nem capa tem. Pode não haver foto suficiente para o tratamento que
   ele imagina, e isso é conversa de conteúdo, não de código.

## Armadilhas custaram tempo nesta sessão

- `npm run build` **não** emite `dist/v2/`. Use `BUILD_V2=1 npm run build`
  (`build.mjs:41`).
- O servidor estático não faz fallback de rota: `/v2/case/pcyes` responde 404 e
  você acaba medindo a página de erro. Para conferir a página de caso, abra
  `/v2/` e clique num card.
- `position: sticky` só gruda dentro do bloco que o contém. Dar um invólucro
  por elemento grudado equivale a não grudar. Os elementos grudados são filhos
  diretos da seção, e nenhum ancestral pode ter `overflow` diferente de
  `visible` nem `transform`.
- Espaço no fim de um `inline-block` é descartado. Na revelação por palavra, o
  espaço fica fora do span.
- `pkill -f chromium` mata o próprio shell quando a palavra aparece no comando.
  Use `pkill -f "[h]eadless_shell"` numa chamada separada.
- Verificação: `node tools/home-v2.mjs medidas` e `... prints` (precisa do
  servidor em 8793). `axe-core` sai de `ct-boxe/node_modules`, leitura apenas.

## Se ele mandar recomeçar a home

A branch inteira é descartável: `main` está intacta em `22b05d0`. O que vale a
pena preservar de qualquer forma, porque foi decidido por print e não por gosto
do agente:

- Switzer, e a escala de `tokens.css` que veio com ela;
- as peças extras fora da hierarquia principal;
- o processo em três frases;
- o rodapé escuro.

O que está em aberto é a dobra dos casos e o ritmo geral da página.
