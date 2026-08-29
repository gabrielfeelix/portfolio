# Volume — Conteúdo dos capítulos

Documento único com os cinco capítulos do portfólio. Cada capítulo traz:

- **Ficha** — o que vai no topo da página do case
- **Texto** — o conteúdo redacional, pronto para uso
- **Imagens** — o que precisa ser capturado ou produzido
- **Motion** — sugestões de animação, sempre a serviço da leitura

Regra geral de motion, válida para o site inteiro: animação curta, sem flutuar. Ataque seco de 180ms, pausa de 380ms antes do reveal. `prefers-reduced-motion` desliga tudo sem perder conteúdo. Nenhuma informação pode existir apenas dentro de uma animação.

Regra geral de imagem: toda tela de sistema entra em largura cheia ou quase cheia. Recorte apertado só para detalhe que o texto está discutindo naquele parágrafo. Dado sensível sempre substituído por valor fictício.

---

# CAP. 01 — PCYES V2

## Ficha

| Campo | Conteúdo |
|---|---|
| Título | PCYES V2 |
| Subtítulo | Redesign do e-commerce |
| Categoria | E-commerce |
| Papel | UX/UI Designer, responsável pelo projeto |
| Superfície | E-commerce · Magento |
| Período | 6 meses · publicação prevista para outubro/2026 |
| Resultado | Caminho de compra encurtado e checkout reconstruído a partir de gravação de sessão |
| Links | Protótipo (Vercel) · Figma |

## Texto

### O problema

A primeira versão do site foi construída em cima da marca: vídeo, animação, muita presença institucional. Ficou bonita e ficou lenta de comprar.

Duas dores apareceram no comportamento dos usuários.

**As pessoas não chegavam ao checkout.** Para comprar qualquer coisa era obrigatório abrir a página do produto. Vitrine, home, categoria: nada permitia adicionar ao carrinho direto. Cada compra custava cliques que não precisavam existir.

**Quem chegava ao checkout não finalizava.** A etapa final concentrava o abandono, e não estava claro por quê.

### Como investiguei

Gravações de sessão no Microsoft Clarity, métricas de navegação e tempo de permanência, e conversa direta com usuários sobre onde travavam.

Três descobertas mudaram o projeto:

1. As formas de pagamento não apareciam na primeira dobra do checkout. O usuário só descobria como podia pagar depois de rolar a página, e muita gente saía antes disso.
2. Havia bugs no módulo de pagamento usado no Magento. A falha aparecia nas gravações antes de aparecer em qualquer relatório.
3. O caminho até a compra era longo demais para o tipo de produto vendido.

### A tensão do projeto

A diretoria queria uma direção minimalista, com foco em valor de marca, na linha do que marcas de referência vinham fazendo. Foi essa a escolha da primeira versão.

O comportamento no site apontava para o outro lado: o excesso de institucional estava no caminho da compra.

Em vez de escolher um dos dois, propus separar as camadas. Marca continua presente, mas em momentos específicos, e o caminho de compra passa a ser o eixo do site. Levei as gravações de sessão para sustentar a proposta. O modelo final foi aprovado.

### O que mudei

**Checkout**
Formas de pagamento visíveis já na primeira dobra e remoção de etapas desnecessárias. Investiguei o bug do módulo de pagamento até encontrar a origem em um projeto público da extensão e apontei a correção para o time de tecnologia.

**Caminho até a compra**
Adicionar ao carrinho passou a estar disponível direto na home e nas vitrines, sem exigir entrada na página do produto. Do carrinho, o usuário vai direto ao checkout.

**Preço sempre visível**
No desktop, coluna fixa à direita que acompanha a rolagem. No mobile, barra fixa na base da tela. A decisão de compra deixa de depender de voltar ao topo.

**Home orientada a produto**
Carrosséis de produto no lugar dos blocos institucionais, promoções em destaque e filtro de promoção logo na entrada das categorias.

**Visualização rápida**
Botão de preview na vitrine, com zoom, para avaliar o produto sem sair da listagem.

**Descrições padronizadas**
As fichas de produto eram inconsistentes. Construí uma ferramenta interna que gera o HTML da descrição a partir do SKU, com hierarquia de títulos e imagens já formatadas, usando IA. O que era trabalho manual e desigual virou padrão.

**Fotografia e equilíbrio visual**
Padronização das fotos e dos fundos de produto. O site é escuro, e as dobras claras da versão anterior causavam desconforto na leitura, então revisei o contraste ao longo de toda a navegação.

**Acessibilidade**
Integração do VLibras para usuários que têm Libras como primeira língua.

### Onde está e o que vou medir

O V2 entra em produção em outubro. Os testes feitos até aqui apontaram um caminho de compra mais fácil de entender, e a diretoria aprovou a direção final.

Ainda não tenho resultado de operação, e prefiro não apresentar número que não existe. O que vai ser acompanhado depois da publicação:

- Taxa de adição ao carrinho a partir da home e das vitrines
- Conclusão do checkout e abandono por etapa
- Tempo entre a entrada no site e a compra
- Ocorrência de erro no pagamento

### O que aprendi

Valor de marca e conversão foram tratados como escolhas opostas no começo do projeto. Não são. O problema não era a marca aparecer, era ela ocupar o lugar do produto na hierarquia da página.

E a lição mais cara: chegar em uma conversa difícil com gravação de sessão em vez de opinião muda completamente o rumo da discussão.

## Imagens

1. **Capa do capítulo** — home do V2 em largura cheia, desktop
2. **Antes e depois da home** — V1 e V2 lado a lado, mesma altura de recorte
3. **Checkout, antes e depois** — recorte da primeira dobra nos dois estados, com as formas de pagamento evidentes no V2
4. **Adicionar ao carrinho na vitrine** — recorte do card de produto com o botão
5. **Coluna de preço acompanhando a rolagem** — desktop, dois frames em alturas diferentes de scroll
6. **Barra fixa de preço no mobile** — mockup de celular
7. **Visualização rápida** — modal aberto sobre a listagem
8. **Página de produto com a descrição padronizada** — largura cheia
9. **Ferramenta de geração de descrição** — captura da interface, com SKU fictício

## Motion

- **Antes e depois**: slider de cortina arrastável. Sem arraste, o reveal acontece uma vez ao entrar na viewport.
- **Coluna de preço**: o próprio comportamento sticky demonstrado em loop curto de vídeo, com corte de no máximo 6 segundos.
- **Reveal dos blocos de decisão**: entrada em corte seco, sem fade longo, seguindo a regra de 180ms.
- Evitar parallax nas telas de sistema. Elas já são densas e o movimento atrapalha a leitura.

---

# CAP. 02 — Locarmais

## Ficha

| Campo | Conteúdo |
|---|---|
| Título | Locarmais |
| Subtítulo | Módulo de conciliação financeira |
| Categoria | SaaS |
| Papel | UX Designer, responsável pelo módulo |
| Superfície | Sistema de gestão · web |
| Status | Em produção |
| Resultado | Substituiu uma ferramenta externa e eliminou as planilhas paralelas do time financeiro |
| Links | Figma |

## Texto

### O problema

A empresa recebia por múltiplos adquirentes ao mesmo tempo. Cada um com sua taxa, seu imposto, seu prazo de repasse e seu formato de extrato.

Isso criava uma pergunta que o financeiro não conseguia responder com segurança: **o valor que chegou é o valor certo?**

Para saber, era preciso cruzar manualmente o que o sistema registrou com o que cada adquirente informou no extrato. Multiplicado por centenas de lançamentos por dia, o resultado era um processo lento, difícil de auditar e impossível de acompanhar em tempo real. Perguntas básicas ficavam sem resposta: quanto ainda falta receber, quanto foi retido em taxa, e quais lançamentos estão errados.

### Como investiguei

Trabalhei junto da equipe financeira, que era quem operava o processo todo dia. Acompanhei a rotina real de conferência para entender onde estava o esforço e onde apareciam os erros.

Também fiz benchmarking de plataformas de conciliação já consolidadas no mercado, para entender o vocabulário que profissionais da área já dominam e não inventar termo novo onde já existe um.

Duas coisas ficaram claras:

1. O trabalho não era conciliar. Era **encontrar o que não bate.** A maior parte dos lançamentos fecha sozinha; o tempo do time ia embora procurando a minoria divergente no meio da maioria correta.
2. Quando o time forçava uma conciliação manual, o motivo se perdia. Ninguém depois sabia por que aquele lançamento tinha sido fechado com diferença.

### As decisões de design

**Cinco status, uma linguagem comum**
Conciliado, não conciliado, divergente, em disputa e ignorado. O time já usava essas ideias, mas com nomes diferentes entre as pessoas. Fixar o vocabulário na interface acabou com a ambiguidade nas conversas do dia a dia.

**Topo responde antes de a pessoa perguntar**
Previsto, valor líquido, diferença acumulada e percentual conciliado no período. A diferença acumulada aparece em destaque junto da contagem de lançamentos divergentes, porque é ela que dispara a ação.

**Três caminhos, do mais barato ao mais caro**
Conciliação automática ao importar os extratos, conciliação em lote para o que sobra, e conciliação individual forçada para os casos que exigem julgamento humano. O esforço da pessoa fica reservado para onde ele realmente é necessário.

**Forçar conciliação exige motivo**
Ao fechar um lançamento com diferença, o sistema pede a justificativa em uma lista fechada: taxa ou tarifa aplicada, pagamento fracionado, diferença de data entre plataforma e gateway, arredondamento do adquirente, outros.

Essa foi a decisão de que mais me orgulho no módulo. A exceção deixou de ser um buraco no processo e virou dado. Com o tempo, a empresa passa a saber quais divergências mais se repetem e com qual adquirente.

**Origem dos dados lado a lado**
No detalhe do lançamento, o registro da plataforma e o registro do gateway aparecem juntos, com contrato, taxa esperada, valor líquido previsto e data prevista de repasse. A conferência acontece na tela, sem abrir dois sistemas.

**Histórico com rastro completo**
Cada lançamento guarda o que aconteceu com ele: conciliação automática pelo sistema, importação de extrato, ajuste manual com autor e horário. Em um módulo financeiro, poder responder "quem mexeu nisso e por quê" não é conforto, é requisito.

**Importação com múltiplas origens**
O usuário sobe os extratos de vários adquirentes em uma única operação e recebe o resultado consolidado: quantos conciliaram sozinhos, quantos divergiram e quantos ficaram pendentes, com exportação em CSV de cada grupo.

### Painéis de acompanhamento

No mesmo sistema desenhei os painéis de monitoramento usados pela operação e pela diretoria: acompanhamento de carteira com classificação por comportamento, aproveitamento de contratos aprovados contra pagos, metas por representante e churn do período.

A mesma lógica do módulo de conciliação se aplica aqui: o painel abre no que exige atenção, com filtro rápido pelo estado crítico, e a tabela detalhada fica logo abaixo para quem precisa investigar.

### Resultado

O módulo está em produção.

Não tenho medição formal de antes e depois, mas três mudanças de comportamento aconteceram e são verificáveis:

**As planilhas paralelas sumiram.** O time mantinha várias planilhas para controlar o processo, uma por frente. Depois da entrega, deixaram de usar.

**O financeiro parou de pedir relatório para o time de desenvolvimento.** Antes, cada consulta que fugia do padrão virava demanda para o dev. Os dados passaram a estar acessíveis na própria plataforma.

**A conciliação saiu de uma ferramenta externa para dentro de casa.** A empresa usava uma plataforma de mercado que não enxergava a base de dados interna. Trazer o processo para o sistema uniu o registro da operação e o extrato do adquirente no mesmo lugar, o que tornou a projeção de recebimento muito mais confiável.

O retorno do time foi de um processo mais rápido e mais claro de acompanhar.

### O que aprendi

Em produto financeiro, a tela mais importante não é a que mostra o que deu certo. É a que mostra o que não bate, e por quê.

Também aprendi o valor de desenhar para o erro previsto. Um sistema que só aceita o caminho perfeito empurra o usuário para fora dele, normalmente para uma planilha paralela que ninguém audita.

## Imagens

1. **Capa do capítulo** — tela cheia de conciliação, largura total
2. **Cards do topo** — recorte de previsto, líquido, diferença acumulada e percentual conciliado
3. **Tabela de lançamentos** — recorte apertado mostrando os cinco status coloridos na mesma captura
4. **Importação de extratos** — as duas etapas do modal, lado a lado
5. **Resultado da conciliação automática** — modal com conciliados, divergentes e não conciliados
6. **Forçar conciliação** — modal principal e, ao lado, o modal de justificativa da diferença com as opções visíveis
7. **Conciliação em lote** — seleção e confirmação, lado a lado
8. **Detalhe do lançamento** — as quatro abas em sequência: resumo, origem dos dados, conciliação, histórico
9. **Painéis** — monitoramento, aproveitamento e metas, em bloco separado

Todos os valores, nomes de cliente e nomes de adquirente devem ser fictícios nas capturas.

## Motion

- **Os cinco status**: destaque sequencial de cada linha da tabela conforme o texto correspondente entra na viewport. É o recurso mais forte deste case, porque ensina o vocabulário enquanto a pessoa lê.
- **Fluxo de conciliação**: sequência de três frames encadeados, automático, lote, individual, com transição em corte.
- **Aba de histórico**: os itens da timeline entrando um a um, de cima para baixo.
- Nada de zoom contínuo nas tabelas. Recorte fixo e legível.

---

# CAP. 03 — ODEX

## Ficha

| Campo | Conteúdo |
|---|---|
| Título | ODEX |
| Subtítulo | Redesign de interface |
| Categoria | Desktop e Web |
| Papel | UX/UI Designer |
| Superfície | Plataforma · aplicativo · site |
| Status | Plataforma em andamento · site em produção · app em protótipo |
| Resultado | Sistema legado atualizado sem alterar o percurso de quem já usava |
| Links | Protótipo (Vercel) · Figma |

## Texto

### O ponto de partida

A plataforma funcionava, e funcionava há anos. O problema não era o fluxo, era a interface: um layout antigo, que envelheceu junto com o produto e passou a comunicar menos do que o negócio já entrega hoje.

Este é um projeto de redesign visual, e vale dizer isso com clareza. Não redesenhei a lógica do sistema. Redesenhei a superfície inteira dele.

### O que fiz

**Plataforma**
Redesenho de toda a base de telas no Figma, com protótipo navegável para o time avaliar a proposta em uso, e não em imagem estática. O objetivo foi atualizar a linguagem visual mantendo intactos os caminhos que os usuários já conheciam de cor. Em sistema com anos de uso, mudar a aparência sem mudar o percurso é a diferença entre modernizar e atrapalhar.

**Aplicativo**
Redesenho das principais telas, hoje em protótipo. A implementação ainda não entrou no roadmap.

**Site**
Criei a página de armazenamento de energia para a nova linha de baterias, com foco em explicar o funcionamento do produto para um público que ainda não conhece a tecnologia.

Nesse projeto também assumi a implementação. A entrega estava presa a um evento com data fechada e o time de desenvolvimento não tinha janela, então fui direto ao Magento: alterei o código da home, criei e indexei as categorias, refiz cabeçalho e rodapé e ajustei os redirecionamentos. Foi ao ar a tempo da feira.

### Validação

O sistema é operado por gestores e diretoria, então a avaliação aconteceu com eles, que são os usuários reais. Cada versão foi entregue como protótipo navegável, com comentários registrados em cima das telas, e ajustada antes da versão seguinte.

### O que aprendi

Redesign de sistema legado é mais um exercício de contenção do que de criação. A tentação é reorganizar tudo. O trabalho certo é atualizar a interface sem obrigar quem usa o produto todo dia a reaprender onde as coisas estão.

E que saber mexer no código muda o que você consegue entregar. Nesse projeto foi a diferença entre chegar na feira com o site novo ou não chegar.

## Imagens

1. **Capa do capítulo** — tela principal da plataforma redesenhada
2. **Antes e depois da plataforma** — pelo menos três pares de telas equivalentes, sempre no mesmo enquadramento
3. **Grade de telas do sistema** — visão geral do volume redesenhado, em mosaico
4. **App** — três a quatro telas em mockup de celular
5. **Página de armazenamento de energia** — captura completa da página, em coluna alta
6. **Home do site** — antes e depois

Este é o capítulo mais visual dos cinco. O peso está nas imagens, não no texto, e isso é adequado ao que o projeto foi.

## Motion

- **Antes e depois**: mesmo slider de cortina do capítulo 01, para manter consistência de linguagem entre os cases.
- **Mosaico de telas**: entrada escalonada dos cards, 40ms de defasagem entre um e outro, sem exagero.
- **App**: rolagem interna simulada dentro do mockup, loop curto.

---

# CAP. 04 — Oderço

## Ficha

| Campo | Conteúdo |
|---|---|
| Título | Oderço |
| Subtítulo | Página de cadastro de revenda |
| Categoria | Web |
| Papel | UX/UI Designer, do fluxo à automação |
| Superfície | Landing page · formulário · RD Station |
| Status | Pronta, lançamento em etapas |
| Resultado | Reduziu de três para dois os sistemas usados pelo comercial |
| Links | Ver a página: https://oderco-lp-revenda.vercel.app/ · Figma |

## Texto

### O problema

O tráfego chegava de anúncio direto na página de cadastro. E a página só tinha o formulário.

Isso funciona quando a pessoa já conhece a empresa. Fora da região, quase ninguém conhece. Então o visitante caía em um formulário longo, de uma marca que ele nunca tinha ouvido falar, e a pergunta que ele fazia era razoável: **por que eu deveria responder tudo isso?**

Dois problemas somados, portanto: falta de contexto e formulário pesado demais para o nível de confiança que existia naquele momento.

### As decisões de design

**Contexto e formulário na mesma tela**
O formulário fica ao lado da apresentação da marca, não depois dela. Quem já está decidido preenche direto. Quem precisa entender antes rola a página e encontra o portfólio de produtos, as marcas distribuídas, o aplicativo de revenda e as empresas atendidas.

A página inteira funciona como argumento, mas sem nunca tirar o cadastro do campo de visão. A direção visual foi escolhida para comunicar uma empresa de tecnologia, não uma distribuidora tradicional, porque é isso que o modelo de revenda exige que o lead acredite.

**Etapas com corte proposital**
Dividir o formulário em duas etapas não foi só para encurtar a tela. O corte foi definido pelo que a empresa precisa garantir primeiro.

A etapa 1 pede e-mail e o aceite dos termos. Se a pessoa desistir a partir dali, o contato já existe e o comercial pode retomar. A etapa 2 concentra as perguntas de qualificação, como área de interesse, que servem para direcionar o atendimento.

**CNPJ que não trava o cadastro**
O campo aceita o novo padrão alfanumérico e busca os dados da empresa automaticamente. Quando a consulta não encontra o registro, ou quando o usuário digita errado, ele mesmo preenche os dados e segue. O comercial verifica depois.

A regra é simples: uma falha de integração não pode custar um lead.

**Distribuição automática do lead**
Configurei os campos personalizados e a automação no RD Station. O lead que entra é distribuído em esteira entre os vendedores responsáveis pelo primeiro contato, e a régua de e-mail é disparada conforme o segmento escolhido na etapa 2.

### Dois resultados

**O principal: o cadastro deixou de depender de o visitante já conhecer a marca.**
Quem chega de anúncio sem nunca ter ouvido falar da empresa encontra, na mesma tela do formulário, o que ela distribui, para quem vende e o que o revendedor ganha com isso. Preencher deixou de ser um ato de fé e passou a ser uma decisão informada.

**O segundo, que eu não tinha previsto:**
Para montar a automação, fui atrás da API do RD Station e documentei como ela funcionava. Isso mostrou ao time de desenvolvimento que a integração era mais simples do que parecia, e eles começaram a conectar o RD ao CRM interno.

A consequência foi organizacional: a operação usava três sistemas para o mesmo processo. Um deles saiu de cena, e hoje o caminho é consolidar tudo dentro do CRM próprio, agora que o fluxo foi validado na prática com os vendedores.

Um projeto que começou como uma página de cadastro acabou reduzindo o número de ferramentas do comercial.

### Onde está

A página está pronta e o lançamento é em etapas, de propósito.

Primeiro ela recebe só o tráfego de anúncio, que é onde o problema aparecia com mais força e onde dá para observar o efeito com o público que não conhece a marca. Só depois de entender o comportamento nesse cenário é que ela substitui a página de cadastro do site oficial.

Até aqui foi testada com usuários internos e com um grupo pequeno de usuários externos.

O que será acompanhado nessa primeira fase: conclusão de cada etapa, abandono entre a etapa 1 e a 2, e a qualidade dos leads que chegam ao comercial.

### O que aprendi

Formulário curto não é um objetivo em si. O que importa é onde você corta. Cortar no ponto certo transforma um abandono em um contato recuperável.

E a maior parte do trabalho não estava no formulário. Estava em responder, antes dele, a pergunta que o visitante fazia em silêncio: quem é essa empresa e por que eu deveria confiar nela.

## Imagens

1. **Capa do capítulo** — primeira dobra da página, com marca e formulário no mesmo enquadramento
2. **Página completa** — captura em coluna alta, mostrando a sequência inteira de argumentação
3. **Formulário, etapa 1** — recorte com e-mail e aceite dos termos
4. **Formulário, etapa 2** — recorte com as perguntas de qualificação
5. **CNPJ com preenchimento automático** — dois estados: consulta bem-sucedida e preenchimento manual
6. **Automação no RD Station** — captura do fluxo de esteira, com nomes fictícios
7. **Versão mobile** — primeira dobra e formulário

## Motion

- **Etapas do formulário**: transição real entre etapa 1 e etapa 2, curta, mostrando que o e-mail já foi capturado.
- **CNPJ**: sequência de digitação, busca e preenchimento automático dos campos. É o detalhe mais palpável do case.
- **Página completa**: rolagem acelerada dentro de um enquadramento fixo, no máximo 8 segundos, para mostrar a construção do argumento sem obrigar a leitura inteira.

---

# CAP. 05 — Volume

Este capítulo já existe no site e o conteúdo atual é aproveitável. Ajustes necessários:

- **Sair da posição de destaque.** Este passa a ser o último capítulo, não o primeiro. Remover o selo FAVORITO deste card.
- **Remover a redundância da ficha.** Hoje o hero traz PAPEL / SUPERFÍCIE / ANO e logo abaixo aparece PAPEL / O QUÊ / RESULTADO. Manter apenas um bloco, no mesmo formato de ficha dos outros quatro capítulos.
- **Corrigir o card 01 de "As decisões"**, onde há uma maiúscula no meio da frase: "porque guiar bem a leitura É a competência de UX que eu quero provar".
- **Substituir os screentones cinza** por capturas reais das telas do próprio portfólio.
- **Manter** o bloco "O sistema por trás do volume" na íntegra. A especificação de cor, tipografia, escala de espaço, movimento e acessibilidade é o trecho mais forte deste capítulo.

---

# Seção "Outras peças"

Substitui o atual "Índice do volume", mantendo o estilo visual de lista com linha pontilhada e número de página.

**Comportamento do clique:** cada item leva ao link externo do projeto, protótipo publicado na Vercel ou produto no ar. Nenhum item desta lista abre página de case interna, porque case existe apenas para os cinco capítulos.

**Cada item da lista contém:**

- Nome do projeto
- Uma linha curta de descrição, para a pessoa saber o que é antes de clicar
- Rótulo indicando o destino, algo como "Protótipo" ou "No ar"
- Indicação visual de link externo

**Acima da lista** fica a navegação por categoria removida da segunda seção da home: SAAS, MOBILE, DESKTOP, WEB, E-COMMERCE, com os contadores. O clique filtra apenas esta lista.

**Item sem link publicado** não entra nesta seção. Nome sem destino frustra quem clica.
