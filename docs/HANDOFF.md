# Handoff — 30/08/2026, madrugada

Substitui o handoff da noite de 30/08. `HANDOFF-V2.md`, `HANDOFF-2026-08-29.md`
e `HANDOFF-2026-08-29-noite.md` são de sessões passadas: se conflitarem com
este, este vale.

Tudo commitado. O acidente do `processo.css` (regex guloso que comeu 794 linhas
em 30/08) continua documentado no topo do bloco "corpo narrativo" daquele
arquivo — se algo parecer fora do lugar em relação a 29/08, é ali que se
procura.

---

## O que esta sessão fez

**A /processo ganhou ritmo.** Ela tinha uma forma só: os sete blocos abriam
idênticos — mesmo olho, mesma régua, mesmo título de 88px, mesma largura,
mesmos 104px de respiro — e não havia troca de superfície em 13.600px. Três
pautas foram montadas e comparadas rolando (atos com faixa escura, alternância
em zigue-zague, crescendo). O Gabriel escolheu o **crescendo**, e as outras
duas saíram junto com o seletor `?ritmo=`.

A pauta está em `RITMO`, no meio de `site/ProcessoNarrativa.jsx`. Dois campos
por bloco, largura e lado, e as três coisas sobem juntas do começo ao fim:

```
bloco    largura   lado   título
ABRE     estreita  esq    40px
FATORES  estreita  dir    40px
RISCO    wrap      esq    72px
CURTO    wrap      dir    72px
LONGO    larga     esq    88px
NUNCA    larga     dir    88px
APOSTA   larga     esq    88px
```

**O bloco é uma coluna só, e ela troca de lado.** A primeira tentativa partia o
cabeçalho em duas colunas (título de um lado, primeiro parágrafo do outro) e o
Gabriel mandou print: texto pequeno, linha, título grande, linha, sem ordem de
leitura possível. Partir o cabeçalho quebra a coluna no meio. Agora a leitura
desce reta dentro da coluna, e o que atravessa a página são as figuras e as
grades — é essa diferença que dá o ritmo.

**Quatro defeitos de escala, todos achados MEDINDO e não no olho:**

- `--v2-t-painel` é apelido de `--v2-t-secao`, então os números do funil saíam
  com os mesmos 88px dos sete títulos. Foram para `--v2-t-dado` (112).
- a frase de fecho estava em `--v2-t-frase` = `--v2-t-lead`, os mesmos 24px de
  todo parágrafo. Foi para `--v2-t-movimento` (72).
- o degrau "larga" nasceu usando `--v2-medida` (809px) e saía mais ESTREITO que
  o padrão de 18ch (918px), porque 1ch do título dá 51px a 1440.
- título de 88px em coluna de 620px virava torre de sete linhas. O tamanho
  agora sobe com a coluna: 40 / 72 / 88, todos tokens que já existiam.

**O hero parou de vender prazo.** Dizia "Do objetivo ao protótipo, em dias" e
listava seis passos numa ordem fixa — o contrário do que a página argumenta.
Hoje é "Meu processo muda. / O critério não." A orientação que gerou a moldura
de velocidade foi **revogada** em `docs/superpowers/plans/2026-08-28-home-v2-redesign.md`,
com o motivo escrito lá para nenhuma sessão futura reintroduzir.

**Duas figuras novas**, ambas genéricas por requisito (a versão antiga mostrava
o Monte seu PC e foi recusada por obrigar o leitor a saber o que era aquilo):

- `EsbocoEGrade` — a mesma tela duas vezes, rabiscoframe à mão e protótipo de
  baixa montado (barra de navegação, campo com cursor, botão no acento). As
  duas metades saem da MESMA lista de peças, com o mesmo x/y/w/h.
- `EixoDoRisco` — a cunha que engrossa da esquerda para a direita.

Os originais nunca foram commitados: procurei em todo o histórico, por seis
grafias. Morreram na mesma sessão que perdeu o CSS.

---

## AS TAREFAS EM ABERTO

**1. O avião da home, e ele já foi mexido duas vezes.**
Estado: a `cortina` em `motion.js` agora só troca a visibilidade com o avião
fora do quadro — cada trecho apagado é aparado até as duas pontas caírem em
amostras com `lados !== 0`, e trecho que acontece inteiro dentro da tela deixa
de ser apagado.

Medido a 1440x900, de 60 em 60px: sobram 6 trocas, todas a ≤30px de uma borda
(x:1398, x:-120, x:-23, x:-188, x:1445, x:1468). As que o Gabriel printou
(x:1248 e x:541, no meio da tela) sumiram.

**Se ele ainda ver o avião sumir, o próximo passo NÃO é opacidade.** Duas
tentativas por opacidade já falharam (corte seco, depois rampa de 240px). O
problema real é o percurso: há trechos que gastam muito arco com pouca altura,
e `offset-distance` anda em arco enquanto a tabela anda em altura. O conserto
seria em `rotaDoVoo`, redesenhando esses trechos para saírem pela borda em vez
de atravessarem o quadro.

**2. `site/copy.js:103` ainda diz "Do objetivo ao protótipo clicável em dias".**
Está VIVA, na dobra 04 da home. É o mesmo jargão que ele mandou parar. Foi
perguntado duas vezes e não foi respondido — não mexer sem ele confirmar,
porque é a home.

**3. `volume/data.jsx:948` tem o mesmo jargão, mas é texto morto.**
`PROCESSO()` deixou de ser renderizado quando o registro saiu do hero. Limpar
quando for conveniente.

**4. A cunha do risco é a peça de que eu tenho menos certeza.**
Ele pediu para deixá-la "mais bonita e harmônica" e ela foi refeita com bordas
em bezier e ponta em arco. Mas ela é a única figura abstrata da página — as
outras mostram coisa concreta. Se ele reclamar de novo, o caminho é remover, e
não continuar ajustando.

**5. A sessão que fez isto tudo chegou a ~300k tokens.**
Foi oferecido handoff duas vezes e ele optou por seguir. Este arquivo serve
como ponto de partida para uma sessão nova.

---

## Decisões que NÃO devem ser relitigadas

1. **A moldura da página.** "Todas as etapas são cortáveis" foi como ele
   descreveu, mas escrito assim lê como "pulo pesquisa quando aperta", que é a
   acusação que derruba portfólio de UX. A página diz que o tamanho da pesquisa
   acompanha o preço de errar, e há um bloco explícito dizendo que nunca é zero.

2. **Prazo não é argumento de venda.** Em lugar nenhum do site. Ver a
   orientação revogada no plano de 28/08.

3. **A cena `sticky` dos dois diamantes** (230vh / 210vh). Quatro tentativas de
   achar janela boa medindo a figura falharam.

4. **Movimento sem paradas.** `curva` é trapézio com rampas suaves. Trapézio e
   não cúbica: a cúbica tem pico de 1,5x a média no meio do percurso.

5. **Nada de print de produto acabado nesta página.**

6. **Nada específico de empresa nas figuras.** Genérico é requisito.

---

Para entrar no assunto: ler `site/ProcessoNarrativa.jsx` do começo. O cabeçalho
documenta a copy e o ângulo, e cada componente tem o porquê das decisões em
cima. `site/processo.css` documenta a pauta de ritmo e os quatro defeitos de
escala.
