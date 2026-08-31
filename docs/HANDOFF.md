# Handoff — 31/08/2026, madrugada

Substitui o handoff de 30/08. `HANDOFF-2026-08-30-triagem.md`, `HANDOFF-V2.md`,
`HANDOFF-2026-08-29.md` e `HANDOFF-2026-08-29-noite.md` são de sessões passadas:
se conflitarem com este, este vale.

`HANDOFF-I18N-EN.md` **não** é passado: é a sessão de inglês que rodou em
paralelo nesta mesma madrugada, no mesmo clone. Os dois valem juntos, e cada um
cobre uma metade que a outra não tocou.

`HANDOFF-2026-08-31-medicao.md` também não é passado, e é MAIS NOVO que este:
cobre a manhã e a tarde do mesmo dia — prévia de link, GA4, banner de
consentimento, o resultado da V1.2 no case do PCYES e desempenho. Onde os dois
falarem da mesma coisa, aquele vale. `HANDOFF-PRERENDER.md` é a tarefa seguinte,
ainda não executada.

Tudo commitado e no ar. Produção conferida às 00:50 de 31/08: dez rotas
carregam sem erro de JS e sem 404 — home, sobre, processo, blog, quatro cases e
as duas versões `?lang=en`.

---

## O que esta sessão fez

### A dobra "Outros projetos"

Ela se chamava "Fora da estante" e abria com o nome dela na linha do cromo, em
mono de 11px, e nada mais. Era a única dobra da home sem título de display — e
por isso lia como rodapé da dobra anterior em vez de seção nova. Agora abre com
`<Titulo>Outros projetos</Titulo>`, e o cromo volta a ser só régua
(`( _07 ) PEÇAS ©26`).

Ao crescer o título apareceu um defeito antigo: o `.v2-wrap` daquela seção é
item de grid com `margin: 0 auto`, e **margem auto em grid cancela o stretch** —
o bloco ficava com largura de conteúdo e centralizado, o único da página. Com
uma linha de 11px isso mal aparecia. `.v2-fita-cabeca { width: 100% }` devolve.

### Onze capas de mockup fotográfico

As peças tinham print de tela ou imagem nenhuma. Agora têm foto de aparelho num
ambiente cuja cor sai da paleta do próprio app, que é o mesmo sistema das capas
de caso. **Os onze ambientes são deliberadamente diferentes** — se repetirem,
a fita lê como banco de imagem:

| Peça | Ambiente | Aparelho |
|---|---|---|
| Quanto Cobro | acrílico preto + neon menta | 2 celulares |
| Isabella Pires | ateliê claro, madeira e plantas | monitor |
| Kitamo | marinho + "KITAMO" em contorno | celular |
| Worklife | metal perfurado + luz dourada | notebook + celular |
| CT Argel Riboli | couro preto + facho vermelho | celular deitado |
| Locarmais | apartamento, mesa magenta, chaves | notebook |
| Deixei Aqui | concreto + faixa ciano de vaga | celular |
| 4YU MKT | veludo violeta + halo | iPad |
| Rodapé | ripado verde-musgo + disco terracota | celular |
| Hub Oderço | alumínio escovado + reflexo azul | tablet |
| Signamais | escritório em penumbra, persiana | monitor |

**Receita para instalar uma capa nova** (a mesma para todas):

1. O PNG do gerador chega em `/mnt/d/Downloads`, 1536×1024.
2. Copiar para `_fontes/mockups/<id>-full.webp`, qualidade 95. Essa pasta fica
   no git e o build **não** copia para o deploy.
3. Gerar a capa com **800px de largura**, LANCZOS, qualidade 90, em
   `volume/assets/projetos/<id>/cover.webp`.
4. Em `volume/data.jsx`: `cover:` na peça e o id no começo do `PIECE_ORDER`.

**Por que 800px e não os 1536 originais.** A capa é exibida a 380px. Com 1536, o
navegador reduz 4×, e durante a animação da fita o Chrome baixa a qualidade do
filtro para segurar o quadro — o resultado era capa serrilhada com a fita
rodando, que foi a queixa. Em 800px a redução cai para 2× e o serrilhado some.

**O que faz um prompt funcionar** (aprendido nas onze): cena horizontal
1536×1024; celular em pé ou inclinado, **nunca deitado de lado**, ocupando ~80%
da altura; ambiente com textura de verdade (ripado, concreto, couro, veludo,
metal), nunca gradiente liso; no máximo duas cores tiradas do app; e um bloco
explícito mandando remover marcas d'água e **não redesenhar a tela**. Variar o
ângulo entre as peças, senão o conjunto ganha cara de IA.

### O selo de status

Chapa de vidro no alto do card, acesa o tempo todo (não depende de hover). "No
ar" quando a peça tem destino publicado, "Em breve" quando não tem. O ponto é o
**accent vermelho do site**, e não um verde de "online" que o portfólio não tem
em lugar nenhum: luz vermelha é a convenção de no ar, e já é a cor da casa. Ele
respira em 2,4s, e o pulso some em `prefers-reduced-motion` — a cor continua
informando. Lê de `pieceStatus()`, em `volume/data.jsx`.

### A fita alterna celular e tela grande

Cinco capas de app entraram juntas e cinco celulares seguidos fazem o visitante
concluir "ele faz app" antes de chegar no primeiro site. `pieceProjects()` zipa
duas filas, mantendo a ordem do `PIECE_ORDER` dentro de cada uma.

**O zip roda depois do filtro de capa**, e essa é a parte que erra se for
esquecida: a fita descarta peça sem foto, então alternar antes intercala
fantasmas e os celulares se colam de novo.

### Botões da fita

- O filete em mono virou `Pill secundario escuro` — o mesmo botão da hero. O
  card cresceu de 340×212 para **380×237**, mesma proporção, porque a pílula
  ocupa 34px de chapa onde antes havia uma linha de texto.
- `Pill` ganhou `inerte` (vira `<span>`, sem seta) e `is-sem-seta` (esconde o
  `dot`, que sem o avião fica um círculo vazio na frente do rótulo).
- **Peça com dois destinos**: `links.prod` mais `pieceDestinoExtra()`. Só o
  Signamais usa — o protótipo é o principal e o sistema oficial entra em
  segundo plano, porque exige login e não saiu igual ao proposto.
- `destino: "proto"` finalmente é **lido**: link de Vercel pode ser produto no
  ar ou protótipo hospedado, e chamar protótipo de "Ver no ar" é a mentira que
  o volume já recusou no Rodapé. Muda Signamais, Worklife e Traxium.

### As abas do case voltaram a rolar

O trilho de `Abas` (`site/Case.jsx`) mede 2.688px contra 925px de caixa nos
cases longos, ou seja **sempre** precisa rolar — e não rolava, nem com Shift nem
com o deslize lateral do trackpad. O `data-lenis-prevent` que o `motion.js`
espalha impede o Lenis de sequestrar, e ainda assim o scroll nativo horizontal
não acontecia.

A rolagem passa a ser feita à mão, num listener `wheel` não passivo. Três
cuidados que quebram em silêncio se removidos: `passive: false`, senão
`preventDefault` é ignorado; só intercepta quando a roda **andou** alguma coisa,
para o scroll voltar a ser da página na ponta; e roda vertical sem Shift nunca é
roubada.

### Traxium fora de produção

Não bastava não ter capa. `sobre`, `desc` e o link do protótipo viajavam dentro
do `data.js` servido em produção — a tese inteira do produto e uma URL pública,
legíveis para quem abrisse o arquivo, mesmo com a peça invisível na fita. **Peça
escondida não era peça privada.**

Removidos: os dois textos, o link, as três frases em inglês no `i18n.jsx`, e
`hidden: true`. Sobrou a casca com o id. Conferido em produção: zero ocorrências
de `traxium-prototipo`, "torre de controle", "EUDR" e "desmatada". O texto
original está no histórico do git — `git log -p volume/data.jsx`.

O nome "Traxium" e a logo **continuam** em `COMPANIES`, que é a trajetória de
onde ele trabalhou. Não expõe a ideia, expõe o cliente. Decisão em aberto.

### Checkout Oderço

`hidden: true`. Com o Hub ali do lado, dois cartões da mesma conta seguidos
faziam a dobra parecer portfólio de um cliente só. Confirmado que não será
usado.

---

## Armadilhas que custaram tempo aqui

**`dist/uploads/` é apagado a cada `npm run build`.** Dois arquivos que o
Gabriel deixou lá foram destruídos por builds de outra sessão. Arte de origem
vai em `_fontes/`, que nenhum build toca.

**Ele salva tudo em `/mnt/d/Downloads`** (o `D:\Downloads` do Windows). Quando
disser "deixei lá", é ali — não em `uploads/`.

**Outra sessão trabalha neste mesmo clone.** Nesta madrugada ela mexeu em
`Home.jsx`, `Shell.jsx`, `Case.jsx`, `build.mjs` e no i18n inteiro, ao mesmo
tempo. Antes de commitar, conferir o diff **por arquivo**: um `git add -A`
levou quatro sondas de debug (`_dbg.mjs`, `_rota.mjs`, `.porta`) para dentro de
um commit. O `.gitignore` agora cobre `_*.mjs`, com exceção explícita para
`_v3.mjs`, que é do projeto.

**Playwright não anexa modificadores ao `mouse.wheel`.** Testar Shift+scroll com
`keyboard.down("Shift")` dá falso negativo; use `dispatchEvent(new WheelEvent(…,
{ shiftKey: true }))`.

---

## O que sobrou

**Traxium.** A capa não foi feita e a peça está fora de produção a pedido do
Gabriel, por conta de dados sensíveis. Quando puder voltar, o texto está no
histórico e o `hidden` sai.

**O i18n está em andamento.** Subiu junto no commit `082022b` a pedido dele,
para que o disco e o ar batessem. Na home, `?lang=en` ainda devolve a hero em
português. Isso é da sessão paralela — ver `HANDOFF-I18N-EN.md`.

**A memória do deploy tem uma ponta solta já anotada:** `PROJECTS` aponta a peça
`portfolio` para `portfolio-volume.vercel.app`, que é a versão antiga. O deploy
oficial é `gabrielfelix-ux.4yu.com.br`.

**Nada mais pendente.** Working tree limpo, `main` sincronizada com
`origin/main`, nenhuma das quatro branches tem commit fora da main.
