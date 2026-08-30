# Handoff — 30/08/2026, noite

Substitui o conteúdo anterior deste arquivo (handoff da manhã de 30/08, cujo
"próximo passo" era refazer os dois desenhos de Double Diamond — feito).
`HANDOFF-V2.md`, `HANDOFF-2026-08-29.md` e `HANDOFF-2026-08-29-noite.md` são de
sessões passadas: se conflitarem com este, este vale.

**Nada foi commitado.** Leia a seção "O acidente" antes de mexer em CSS.

---

## LEIA PRIMEIRO — o acidente do processo.css

Nesta sessão eu rodei um regex multilinha guloso em `site/processo.css` para
apagar CSS morto, e ele comeu de "corpo narrativo" até o fim do arquivo: **794
linhas viraram 81.** Não houve recuperação possível — o arquivo nunca tinha
sido commitado, `dist/site.css` já tinha sido rebuildado por cima, não havia
stash nem blob solto no git, e o histórico local do VS Code não tinha entrada
porque as edições vieram todas da linha de comando.

O arquivo foi **reconstruído**, e há duas categorias dentro dele:

- **Idêntico ao que era** — desenhos, cena `sticky`, avião, fases, halo dos
  rótulos SVG, media query. O texto desses estava na conversa.
- **Reescrito do zero** — `.v2-pn-bloco`, `-olho`, `-t`, `-p`, `-nota`,
  `-fatores`, `-fator-k/p`, `-trilho*`, `.is-destaque`, `.is-aposta`. Vieram
  da sessão que escreveu a narrativa e o original se perdeu. Seguem os tokens
  e a gramática da página e batem com o que estava na tela, mas **não são
  valor por valor o que existia.**

Há um aviso com esse mesmo conteúdo no topo do bloco em `processo.css`. Se
algo parecer fora do lugar em relação a 29/08, é ali que se procura.

**Consequência prática: commite cedo.** Se o CSS estivesse commitado, o erro
teria custado um `git checkout`.

---

## Onde estamos

`/processo` é uma narrativa em 7 seções, 13.637px, build limpo, zero erro de
runtime ou de console.

```
 M site/Processo.jsx          casca: hero, corpo, fecho, grade
 M site/processo.css          reconstruído (ver acima)
 M site/motion.js             primitivas novas no fim do arquivo
 M docs/HANDOFF.md            este arquivo
?? site/ProcessoNarrativa.jsx o corpo inteiro, copy + desenhos
?? uploads/processo-hero.png
```

### O que esta sessão entregou

**Os dois desenhos de Double Diamond, refeitos.** `DoisCaminhos` e `Diamante`
em `ProcessoNarrativa.jsx`. O traço se desenha na rolagem e o avião vermelho do
site corre na ponta dele, pela mesma mecânica do `Voo` (`offset-path` +
`offsetDistance`). Em `DoisCaminhos` os dois aviões correm juntos: na mesma
rolagem o do caminho curto já pousou e o do longo ainda está no primeiro
diamante — é o argumento da página em uma imagem. Em `Diamante` cada diamante
abre a partir do nó da esquerda, e as três verticais caem nos quartos da grade
de fases logo abaixo, o que faz desenho e lista serem um objeto só.

**Primitivas novas em `motion.js`** (no fim do arquivo, todas documentadas):
`useTracado`, `useTrecho`, e a função `curva`.

**O avião de fundo saiu do `/processo`.** `CampoDeVoo` virou `<div>` em
`Processo.jsx`; um segundo avião cruzando o fundo confundia qual seguir. A
partitura `processo` continua em `motion.js` caso volte. As outras páginas
(Home, Sobre, Case, Blog, Post) mantêm o delas.

**Os três números do funil sobem** (`useContador`, o mesmo da home), com
separador pt-BR.

---

## Decisões que NÃO devem ser relitigadas

**1. A moldura da página** (herdada, e continua valendo). "Todas as etapas são
cortáveis" foi como o Gabriel descreveu o próprio processo. Escrito assim numa
página que existe para conseguir entrevista, lê como "pulo pesquisa quando
aperta", que é a acusação que derruba portfólio de UX. A literatura sustenta a
prática e não a frase: Erika Hall (*Just Enough Research*) manda priorizar as
suposições de maior risco; a mesma literatura é clara em que pular pesquisa por
completo dispara a chance de fracasso. Então a página diz que **o tamanho da
pesquisa acompanha o preço de errar**, que o prazo decide quanto ele tem e não
onde gasta, e há um bloco explícito ("O que não cai") dizendo que **nunca é
zero**. Não reverter para a frase original.

**2. A cena `sticky`, e o orçamento que a justifica.** As duas figuras moram em
`.v2-pn-cena` (230vh / 210vh) com palco `.v2-pn-palco` de 100vh. Parece
exagero e não é: solta, uma figura de 460px numa tela de 900 só fica visível
por ~810px de rolagem, e nesse orçamento **não cabem ao mesmo tempo** (a) lento,
(b) terminar antes de o leitor passar e (c) começar do zero na entrada. Quatro
tentativas de achar uma janela boa medindo a figura falharam, cada uma perdendo
uma das três. Presa, a rolagem disponível vira a altura da cena, que é um
número que a gente escolhe. O dial é a altura em `processo.css`.

**3. Movimento sem paradas.** Existiu um `comCurva(t, paradas)` que repartia a
rota e parava o avião em cada parada do caminho curto e na cintura do diamante.
Lia como anda-pausa-anda-pausa e foi recusado. Hoje é `curva`: trapézio com
rampas suaves — arranca, cruza a maior parte em velocidade constante, freia.
Trapézio e não cúbica porque a cúbica tem pico de 1,5x a média bem no meio do
percurso, e o avião dá uma arrancada bem na hora em que o olho o acompanha.

**4. Nada de print de produto acabado nesta página.** Havia dois prints do
Monte seu PC no caminho longo. Print de produto numa página sobre processo
mostra o que ficou, que é a parte que não é o assunto. Foram removidos e não
devem voltar.

---

## O próximo passo, e é uma conversa antes de ser código

**O Gabriel acha que a página se apoia demais em exemplo real.** Palavras dele:
"vc ta dando mt exemplo meu real... vc ta dando numeros, falando nome de
empresas, etc. eles nem sabem oq é e quem é cada empresa". O que ele quer é
falar **como faz, como funciona um processo curto/longo, e ser criativo**.

Não é reescrita geral. Fora do fecho, nome real aparece em três lugares:

1. `FATORES.nota` — "PCYES e Oderço foram onde deu tempo de fazer o completo";
2. `LONGO.casos` — os dois parágrafos de Oderço e PCYES;
3. o bloco `APOSTA` inteiro — a confissão do checkout, os três números do
   funil (50.399 / 808 / 223) e a fonte do GA4.

O resto da página (`ABRE`, `RISCO`, `CURTO`, `LONGO.fases`, `NUNCA`) já é só
método, sem empresa nenhuma.

**A tensão que precisa ser resolvida com ele, não sozinho:** o handoff anterior
registrava a confissão do PCYES como decisão deliberada e como "o que a página
tem de único", e por isso ela é o fecho e não uma nota de rodapé. Tirar os
números tira também isso. Pode ser a escolha certa mesmo assim — mas é dele.

Ele disse "ainda vou querer mexer em coisas nessa página", então **não execute
essa reescrita sem perguntar.**

---

## O que deixar para trás

- **A seção "A mesma tela, três vezes"** (rabiscoframe → wireframe →
  formulário ao vivo). Ele gostou muito do rabiscoframe e do wireframe, e
  recusou a seção inteira: o formulário exigia saber o que é o Monte seu PC, e
  depois de reescrito para perguntar a situação do leitor ele recusou de novo
  e pediu para remover. Já apagada do JSX e do CSS. **Se a ideia voltar, o
  elogio era ao rabisco/wireframe desenhado em SVG, não ao formulário.**
- A discussão de janela de rolagem por posição da figura: resolvida pela cena.
- Os prints de comparação e o histórico de token hygiene desta sessão.

## O que mais falta (menor, herdado)

Batidas 2, 3, 5 e 6 têm componente tipográfico mas nenhuma imagem — e agora
nenhuma seção tem imagem, já que os dois prints saíram. Material disponível:
35 imagens do PCYES com legenda já escrita em `volume/data.jsx`, 22 do
Locarmais. As legendas são verbatim — não reescrever. Mas ver a direção nova
acima antes de sair colocando print.

---

Para entrar no assunto: ler `site/ProcessoNarrativa.jsx` do começo. O cabeçalho
dele documenta a copy e o ângulo em detalhe, e cada componente tem o porquê
das decisões em cima.
