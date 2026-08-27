# Auditoria de portfólio · triagem de contratação (mid-level)

**Data:** 2026-08-26 · **Material:** gabrielfelix-ux.4yu.com.br (conteúdo auditado via `volume/data.jsx`/`i18n.jsx`, que é o que o site renderiza) + todos os links externos testados
**Calibração:** vaga mid-level de Product/UX Designer, leitura de hiring manager em primeira triagem

---

## 1. Veredito executivo

**Passa na triagem mid-level com folga — e não é cortesia.** Se este portfólio chegasse na minha mesa para uma vaga mid, ele iria para a pilha de entrevista na primeira leitura do capítulo 01. A disciplina de evidência (funil de 1.705 → 27, mapa de calor com 182 cliques em "fechar pop-up" contra 5 em "comprar", a busca que devolve mousepad para "mouse") é coisa que a maioria dos portfólios *sênior* não tem. A seção "O que eu recusei" e a honestidade de "prefiro não apresentar número que não existe" são tells de senioridade, não de mid.

**O que segura o portfólio abaixo de sênior é uma coisa só: nenhum case fecha o ciclo com resultado medido em produção.** O capítulo mais forte (PCYES) termina em "entra em produção em outubro". O único case em produção há tempo (Locarmais) termina em "não tenho medição formal". O leitor sai convencido de que você pensa bem e constrói de verdade — e sem uma única prova numérica de que o que você construiu mudou um número de negócio. Para mid, isso é aceitável. É exatamente a fronteira que você vai precisar cruzar para a próxima faixa, e o material para cruzá-la já existe (ver seção 4).

---

## 2. O que é genuinamente bom (manter e amplificar)

**A gramática de evidência do capítulo 01 (PCYES).** O trio painel → funil → gesto é a melhor sequência do site. Dado redesenhado em vez de print de dashboard, com fonte e nota de procedência ("amostra de 3 dias... indício que orientou onde olhar, não medida definitiva"). Isso responde antecipadamente à pergunta que todo entrevistador cético faria. O beat da busca ("mouse"/"mause") é o melhor achado do portfólio inteiro: concreto, visual, e reenquadrado como decisão de negócio ("a loja decidindo que quem não escreve certo não compra").

**Comportamento acima de auto-relato.** "A diretoria pedia minimalismo. O comportamento no site pedia atalho. Em vez de escolher um dos dois, separei as camadas" — contrariar o briefing com gravação de sessão na mão e sair com a direção aprovada é o tipo de história que rende 20 minutos de entrevista. Está no lugar certo (fact do capítulo, citação, Posfácio).

**"O que eu recusei".** Trade-offs nomeados são raros em portfólio. Os três itens do PCYES (não trocar uma home institucional por outra, não apagar a marca, não abrir chamado e esperar) mostram julgamento, não execução.

**"I" implacável e sem inflação.** O texto inteiro é primeira pessoa com escopo honesto: "Diagnosticar não era o meu papel, mas era o que destravava a etapa mais cara do funil". Nenhum "nós" escondendo o indivíduo, e nenhum papel inflado.

**A ponte V1.2.** Corrigir o checkout na versão que já rodava, antes do redesenho, com o antes/depois em cinco estados (checkout 60% mais curto, 3.421 → 1.366 px) — é a prova de que você prioriza por custo de espera, não por vaidade de projeto.

**O design system como argumento, não catálogo.** 239 tokens, 69 componentes, o verde de economia com contraste medido (5,02:1 / 11,08:1), o card que não guarda cor nenhuma. "Paleta é uma lista de cores. Sistema é uma regra que produz a cor certa em um contexto que ninguém previu" é a melhor frase do site.

**A metáfora paga o próprio pedágio.** O mangá podia ser firula; não é, porque a infraestrutura de leitura existe: TL;DR por capítulo, atalho com minutos medidos (18 min declarados, 3.593 palavras a 200 wpm), leitura rápida de 2 minutos na capa, EN completo. O capítulo 05 verbaliza o critério ("isso ajuda a ler ou só reforça que é um mangá?").

**Honestidade estrutural.** Peça sem link não entra no índice; certificado sem href não ganha botão "Ver"; moldura pendente declarada em vez de buraco. Consistente com o discurso.

---

## 3. O que está fraco, confuso ou custando entrevista (por impacto)

1. **Nenhum desfecho medido, em nenhum case.** O padrão de falha nº 1 de portfólio: todo case termina antes do número. PCYES: "resultado de operação eu ainda não tenho". Locarmais: "não tenho medição formal". ODEX: "no ar a tempo da feira". Oderço Revenda: "3 → 2 sistemas" (o mais próximo de um resultado, e é efeito colateral). A honestidade salva — mas honestidade sobre ausência não substitui presença. Detalhe agravante: **a V1.2 do checkout PCYES está em produção desde antes do redesenho e vocês têm GA4 + notas fiscais**. Existe um antes/depois medível dormindo aí (ver seção 4).

2. **Cap. 03 (ODEX) é o capítulo fraco e dilui a média.** Duas telas (`s1`, `s2`), problema genérico ("a interface envelheceu"), resultado sem tensão. A tese de contenção ("redesign de legado é exercício de contenção") é boa, mas não tem a prova que os outros capítulos ensinaram o leitor a esperar: nenhum dado, nenhum achado de pesquisa específico, nenhum "recusei". Se o leitor abrir os capítulos em ordem, o 03 é onde a régua cai. Ou o capítulo ganha telas internas e um achado concreto, ou vira peça no índice.

3. **O WhatsApp de contato fala com cliente, não com recrutador.** A mensagem pré-preenchida é "estou interessado nos seus serviços de UX/UI Design" — linguagem de freelancer/agência. Colide de frente com o "Pra onde eu vou" do Posfácio ("quero trabalhar em produto maior"). Um hiring manager que clica ali sente que o portfólio está vendendo serviço, não candidatura. Custa 2 minutos corrigir.

4. **`llms.txt` inteiro aponta para o deploy antigo** (`portfolio-volume.vercel.app`). Qualquer ferramenta de IA que um recrutador usar para resumir o site vai citar e linkar o domínio errado — que está previsto para ser apagado. Quando for apagado, o llms.txt vira um mapa de links mortos.

5. **Divergência PT/EN no fact do capítulo principal.** PT: "Contrariei o briefing com gravação de sessão na mão, e a direção oposta foi a aprovada". EN: "A shorter path to purchase and a checkout rebuilt from session recordings". São dois posicionamentos diferentes — e o PT é muito mais forte. Recrutador internacional lê a versão fraca.

6. **Link quebrado no índice: `site.locarmais.com` devolve 403.** É a peça "Locarmais · Fiança digital". Pode ser bloqueio de bot, mas se um recrutador tomar o 403, é exatamente o padrão "imagem/link quebrado onde deveria estar a prova". Testar num navegador limpo; se o 403 for real, remover a peça (a regra do próprio site: nome sem destino frustra quem clica).

7. **Hub Oderço linka para `powderblue-elephant-709864.hostingersite.com`.** URL de hospedagem gratuita com nome aleatório — o equivalente moderno do badge free-tier que mina o posicionamento. Ou ganha domínio, ou a peça sai do índice até ganhar.

8. **Certificados sem nenhum link ou credencial.** Todos os cinco `href: null`. A seção existe, ocupa dobra do Posfácio, e não é verificável. Para mid-level, certificado sem link pesa menos que a ausência da seção — considerar linkar credenciais ou enxugar para uma linha de texto na trajetória.

9. **Custo de leitura concentrado no cap. 01.** 18 minutos declarados é honesto, mas é 3–4× o tempo total que uma primeira triagem dá ao portfólio inteiro. A mitigação existe (TL;DR, atalho, leitura rápida) — só que a leitura rápida vive num link discreto da capa. Quem entra direto num capítulo por link compartilhado não a encontra.

**Verificado e ok (para constar):** todas as imagens referenciadas existem no deploy (content-type `image/webp` confirmado, incluindo as três telas da busca do commit `6022122`); todos os demais 13 links externos respondem 200; protótipos PCYES, ODEX, checkout Oderço e LP revenda abrem.

---

## 4. A maior oportunidade perdida

**Medir a V1.2.** O portfólio inteiro sofre de "resultado ainda não chegou" — mas a correção do checkout (V1.2) **já está em produção na loja que vende hoje**, e você demonstra ter GA4, notas fiscais e Clarity. Conclusão de checkout e abandono por etapa, antes e depois da V1.2, é um número que já existe nos seus dados. Um único parágrafo — "a V1.2 entrou no ar em [mês]; a conclusão do checkout foi de X% para Y% no trimestre seguinte" — converteria o capítulo mais forte do site de "promessa bem argumentada" em "resultado medido", e mudaria a resposta da pergunta mais importante da triagem: *o trabalho dessa pessoa chega em produção e move número?*

Enquanto o número não vem, aplicar o reframe nos outros cases: em vez de encerrar em ausência ("não tenho medição formal"), encerrar na decisão adotada — o Locarmais já tem os três comportamentos verificáveis (planilhas sumiram, relatórios pararam de ser pedidos, ferramenta externa cancelada); falta só quantificar o que dá: quantos lançamentos/dia, quantos adquirentes, quantas planilhas paralelas existiam. "Substituiu uma ferramenta contratada" fica duas vezes mais forte com o nome do custo que saiu.

## 5. Lista de correções priorizada (esforço → impacto, executável esta semana)

| # | Correção | Esforço | Impacto |
|---|----------|---------|---------|
| 1 | Trocar a mensagem pré-preenchida do WhatsApp para linguagem de candidatura ("Vi seu portfólio e quero conversar sobre uma oportunidade") | minutos | alto: alinha o portfólio inteiro com o objetivo declarado |
| 2 | Atualizar `llms.txt` para `gabrielfelix-ux.4yu.com.br` | minutos | médio: evita mapa de links mortos para ferramentas de IA |
| 3 | Igualar o `fact` EN do PCYES ao PT (a versão do briefing contrariado) e varrer outras divergências PT/EN | minutos | médio-alto: o recrutador EN merece a história forte |
| 4 | Testar `site.locarmais.com` em navegador limpo; se 403 real, tirar a peça do índice | minutos | médio: um 403 desmente "honestidade estrutural" |
| 5 | Hub Oderço: domínio próprio ou fora do índice | baixo | médio |
| 6 | Locarmais: adicionar 2–3 números de contexto (lançamentos/dia, nº de adquirentes, nº de planilhas paralelas) com procedência | baixo-médio | alto: quantifica o único case maduro em produção |
| 7 | Certificados: linkar credenciais ou reduzir a seção a uma linha da trajetória | baixo | baixo-médio |
| 8 | Puxar do GA4 a conclusão de checkout antes/depois da V1.2 e publicar no beat da ponte | médio | **o maior do portfólio** |
| 9 | ODEX: subir telas internas da plataforma + um achado concreto da validação com gestores, ou rebaixar a peça | médio | alto: elimina o capítulo fraco |
| 10 | Expor a "Leitura rápida" também no menu/header, não só na capa | baixo | médio: protege a triagem de 5 minutos |

---

## Nota final

Você está mais perto do que a ausência de números faz parecer. A estrutura de argumento — problema com tamanho, dado com procedência, decisão com "porque", recusa com motivo, reflexão sem insegurança — já é a de um portfólio sênior. O que falta não é reescrever nada: é fechar o ciclo de medição em um único case. O dia em que o beat da V1.2 ganhar um antes/depois de conversão, este portfólio muda de faixa sem mudar uma vírgula do resto.
