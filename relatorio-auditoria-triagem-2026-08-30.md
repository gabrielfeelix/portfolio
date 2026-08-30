# Auditoria de portfólio · triagem de contratação (pleno)

**Data:** 2026-08-30 · **Material:** as 13 páginas de `gabrielfelix-ux.4yu.com.br`
renderizadas em Chromium headless (não o `data.jsx` lido de fora: o que a
auditoria de 26/08 fez), mais o código em `site/` e `volume/`
**Calibração:** vaga de pleno em Product/UX Design, leitura de hiring manager
em primeira triagem
**Verificado em máquina:** imagens visíveis por página, links externos, peso,
FCP, overflow horizontal, erros de console, metadados por rota

---

## 1. Veredito

**Passa a triagem de pleno com folga. Passaria numa de sênior se o portfólio
fechasse pelo menos um caso com número.**

O que puxava a leitura para baixo não era o pensamento — era mecânica. Quatro
coisas contradiziam a própria tese do site:

- a página do método atribuía à empresa errada um trabalho que está no case;
- a home da V2 e a página de produto não apareciam numa leitura corrida;
- o H1 dizia uma coisa diferente a cada 2,8 segundos;
- um case anunciava "A investigação" em tela cheia e entregava seção vazia.

Isso não fazia parecer pleno. Fazia parecer descuidado, que é pior, porque é o
oposto exato do que o texto promete. Tudo corrigido em 30/08 (seção 3).

### Nota

| | Antes | Depois |
|---|---|---|
| Contra vaga de **pleno** | 7,0 | **7,8** |
| Contra vaga de **sênior** | 5,5 | **6,2** |

| Dimensão (régua de pleno) | Antes | Depois | Nota |
|---|---|---|---|
| Pensamento e evidência | 9 | 9 | já era o ponto alto |
| Qualidade de texto | 9 | 9 | intocado |
| Craft visual | 8 | 8,5 | o trabalho passou a aparecer |
| Mecânica e confiabilidade | 5 | 9 | os quatro furos acima |
| **Prova de resultado** | **3** | **3** | **não mudou** |

As correções não subiram o teto. Elas tiraram o que estava puxando o portfólio
para baixo do próprio nível. O teto continua onde estava, e é a seção 5.

---

## 2. O que é bom e não deve ser mexido

- **A disciplina de evidência do PCYES.** 166.267 sessões → 50.399 → 808 → 223,
  trimestre inteiro evento a evento, com o benchmark que dá sentido ao número
  (0,13% contra 1,1% da categoria, "a um oitavo do piso").
- **"Perdi a aposta aqui."** Comportamento contradizendo a própria hipótese,
  nomeado sem defesa. É o sinal sênior mais raro que existe.
- **"O que eu recusei".** Três decisões que não viraram tela, com o motivo.
- **A briga com a diretoria resolvida por um terceiro caminho**, com gravação
  na mão em vez de opinião.
- **A /sobre.** A melhor página do site. "Eu ia ser advogado" é abertura de
  verdade, e "saí de lá sem um caso para mostrar, e com uma coisa que caso
  nenhum ensina" transforma estágio sem usuário real em patrimônio.
- **O léxico da Locarmais** e "exigir motivo para fechar com diferença" — "a
  exceção era um buraco no processo e virou dado" é a melhor frase de produto
  do site.
- **Saúde técnica.** Zero erro de console em 13 páginas, zero 4xx, sem overflow
  horizontal, FCP ~700ms, e **os 9 links externos "Ver no ar" respondem 200**.
  O assassino clássico de portfólio não existe aqui.

---

## 3. O que foi corrigido em 30/08

Merge `61b7661`, quatro commits.

| Item | Antes | Depois | Commit |
|---|---|---|---|
| Módulos do PCYES em aba | 19 de 32 imagens visíveis | **32 de 32** | `09c3fa1` |
| Busca da V2 escondida | só as duas telas de falha | V1 + V1 + **V2 logo abaixo** | `09c3fa1` |
| Oderço com seção vazia | `MOVIMENTO 02/04 · A investigação` sem nada | movimentos contam o que existe: `01/03 → 03/03` | `09c3fa1` |
| Conciliação atribuída ao Oderço | errado em 3 lugares | volta para a Locarmais | `e80e39d` |
| H1 rotativo entre 4 frases | promessa sorteada | fixo em "o dado à decisão" | `4dd6982` |
| Description da home em 7 páginas | prévia de catálogo no LinkedIn | 8 páginas, 8 descrições | `95c2387` |
| 404 respondendo 200 e indexável | "O capítulo 'contato' não existe" | `noindex` + canonical na home + copy própria | `95c2387` |
| Favicon de 1,42 MB | um PNG de 1254px para pintar 32px | 2 KB na aba, 37 KB no iOS, + `.ico` | `95c2387` |
| Nome acessível do card do blog | começava pelo resumo | começa pelo título | `95c2387` |

### O custo

**O case do PCYES foi de 24.710px para 32.164px** (~36 telas). Os quatro
módulos somam 7.920px, e "O acabamento" sozinho é 4.454px. Foi a troca
escolhida — tudo visível — mas é real.

Meio-termo disponível em uma linha, se um dia incomodar: manter Pré-venda,
Monte seu PC e "O que a V1 não tinha" empilhados (3.466px) e devolver só "O
acabamento" para aba. Volta a ~28k sem esconder nenhuma tela principal.

Efeito colateral aceito: `busca-v2.webp` aparece duas vezes, a 8.413px
(resolução do achado) e a 21.103px (execução). A 13 mil pixels de distância
não lê como repetição.

### Três apontamentos da auditoria que estavam errados

Registrados porque errar para o lado do alarme também custa tempo:

- **"19 de 41 imagens escondidas"** — eram **13 de 32**. As cópias que o
  `PresoEsquerda` e o comparador duplicam no DOM por acessibilidade foram
  contadas como imagens distintas. **O checkout V1.2 nunca esteve escondido.**
- **`alt=""` nas capas dos casos** — é o padrão correto. O texto do link já diz
  "PCYES V2 · Redesign do e-commerce"; pôr alt faria o leitor de tela repetir.
  Não foi mexido.
- **Links duplicados na fita de peças** — já resolvido, com `aria-hidden` na
  cópia e `tabIndex={-1}` nos links clonados.

---

## 4. Os números que já existem

**Esta é a seção que importa.** A frase "eu não tenho número de nada" não está
certa, e ela é justamente o que prende o portfólio em 7,8.

### 4.1 O que está em produção e nunca foi consultado

Do post de 26/08, palavras do próprio Gabriel:

> "A correção do checkout que eu fiz antes do redesenho **está em produção na
> loja que vende hoje**. E eu tenho GA4, notas fiscais e Clarity na mão. (...)
> Ele só nunca foi puxado."

Isso não é falta de dado. É um relatório que ninguém abriu.

**Consulta:** GA4 da PCYES, `begin_checkout` → `purchase`, dois intervalos de
data — antes e depois do dia em que a V1.2 subiu. Meia hora, não um projeto.
Vale também abandono por etapa e ocorrência de erro no pagamento, que é o bug
do módulo do Magento que foi caçado até a origem.

### 4.2 Dois números que já estão no site, tratados como detalhe

- **"O mesmo checkout ficou 60% mais curto: 3.421 pixels de altura contra
  1.366."** Está no case, no meio de um passo, como observação de layout. É um
  antes e um depois medido, do próprio trabalho, em produção. Só não está no
  fecho.
- **"Reduziu de três para dois os sistemas usados pelo comercial."** Está como
  `fact` do Oderço e é chamado de "efeito colateral" no corpo. Eliminar um
  sistema de uma operação comercial é resultado de negócio, e veio de ter ido
  atrás da API do RD Station e documentado. Não é acidente: é influência
  organizacional, que é sinal sênior.

### 4.3 O que dá para contar sem analytics nenhum

Da Locarmais, já escrito no case: "as planilhas paralelas sumiram, o time
mantinha várias, uma por frente."

- Quantas frentes? Isso é um número: **N planilhas → 0**.
- "O financeiro parou de pedir relatório para o time de desenvolvimento" —
  quantos pedidos por mês eram? Se não souber, é uma mensagem para alguém que
  estava lá.

### 4.4 A conta

| Número | Onde está | Custo |
|---|---|---|
| Checkout antes/depois | GA4 da PCYES | ~30 min |
| 60% mais curto | já escrito, no lugar errado | mover para o fecho |
| 3 sistemas → 2 | já escrito, chamado de acidente | reenquadrar |
| Planilhas eliminadas | uma pergunta no WhatsApp | 10 min |

**Três dos quatro já estão escritos.** Nenhum precisa de acesso que não se
tenha. O que separa 7,8 de 8,5 não é uma métrica que faltou chance de coletar —
é reconhecer como resultado o que já existe e é tratado como detalhe, e abrir
um relatório.

### 4.5 Onde isso mexe na nota

| Ação | Nota |
|---|---|
| Puxar o antes/depois do checkout V1.2 no GA4 | 7,8 → **8,5** |
| O V1.2 virar case próprio com esse número | → **8,8** |
| Segundo caso com número de produção | → **9,0**, e a régua vira sênior |

---

## 5. A maior oportunidade perdida

**O checkout V1.2 devia ser um case, e hoje é subseção no meio do PCYES.**

É a única coisa no portfólio que é, ao mesmo tempo: **em produção**,
**inteiramente dele**, e **mensurável com dados que já estão na mão**. Foi uma
correção proposta sem esperar o redesenho, com um bug do módulo de pagamento do
Magento caçado até a origem num projeto público da extensão e entregue pronto
para o time de tecnologia, e o checkout ficou 60% mais curto.

Não é um parágrafo dentro do PCYES. É o quinto case: curto, três telas, um
antes e um depois. Um case assim no topo da home muda a faixa em que o
portfólio é lido, porque é a única página que não termina em promessa.

---

## 6. O que não dá para resolver pelo repositório

- **Domínio próprio nos "Ver no ar".** `powderblue-elephant-709864.hostingersite.com`,
  `notify-cleat-99358726.figma.site`, `pcyes-v3-codigo-fonte.vercel.app`,
  `ponto-snowy.vercel.app`. Todos respondem 200, mas nome gerado automático lê
  como rascunho na barra de status. Precisa renomear os projetos no painel.
  (`pcyes-v3-codigo-fonte` ainda contradiz o site, que chama o projeto de V2.)
- **Capas próprias no blog.** As três são banco de imagem — tipos móveis, mãos
  em caderno. Num blog de designer é o tell mais barato.
- **A investigação do Oderço.** A estrutura não mostra mais buraco, mas o
  movimento sumiu em vez de existir. Material que já está nos próprios textos:
  testes com usuários internos e um grupo pequeno de externos, e o fluxo
  validado na prática com os vendedores. Precisa das palavras dele.
- **O ODEX** continua o case mais fraco e está em terceiro: sem número, sem
  pesquisa além de "validado com gestores", sem trade-off nomeado.

---

## 7. Itens deliberadamente não mexidos

- **Os cinco contadores da home** (4 casos, 22 projetos, 17 marcas, 3 times,
  2+ anos). São contagem do próprio output sob o rótulo "números de produção,
  não de vaidade", e num site que abre falando de dado o contraste é caro.
  Mantidos a pedido.
- **O Instagram no rodapé.** Escolha de identidade, não defeito.
- **O comprimento das páginas** (/processo 15.067px, /sobre 14.167px). O texto
  sustenta, mas a triagem dá 90 segundos. A travessia ilustrada come uma tela
  inteira sem mostrar trabalho, e o calendário de outubro come outra para
  comunicar uma data.
