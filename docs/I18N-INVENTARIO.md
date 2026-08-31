# Inventário i18n — strings em PT visíveis na V2

Gerado automaticamente. Cada linha é `arquivo:linha` + a string.

Ignora comentários. Revise: alguns podem ser classe CSS ou chave interna.


## site/Blog.jsx — 4 strings

- `L176` — [JSX] Ofício, bastidor e carreira. O que eu aprendi medindo, o que deu errado
              antes de dar certo, e o que ninguém conta em processo seletivo.
- `L188` — [JSX] O primeiro texto está sendo escrito. Volte em alguns dias.
- `L216` — [JSX] Nada com esse recorte.
- `L226` — Isso tudo saiu de algum lugar

## site/Case.jsx — 43 strings

- `L163` —  {...entrada.sobe(3, { base: 0.1 })}>
              {}
              {links.vercel ? <Pill href={links.vercel} externo escuro>Ver no ar</Pill> : null}
              {links.figma ? <Pill href={links.fi
- `L165` — [JSX] Ver no ar
- `L166` — [JSX] Abrir no Figma
- `L194` — , cap.minutos ? `${cap.minutos} min` : null],
  ].filter(([, v]) => v);

  return (
    <section className=
- `L199` —  {...rise(0)}>
        {t.resultado \|\| t.oque ? (
          <div className=
- `L201` — >
            {t.resultado ? (
              <div className=
- `L204` — >O resultado</p>
                <p className=
- `L204` — [JSX] O resultado
- `L205` — >{t.resultado}</p>
              </div>
            ) : null}
            {t.oque ? (
              <div className=
- `L210` — >O quê</p>
                <p className=
- `L210` — [JSX] O quê
- `L271` — O capítulo inteiro
- `L272` — A investigação, o funil, o sistema e as provas. Tudo que sustenta a decisão.
- `L273` — Só o essencial
- `L274` — O problema, o que eu decidi e o que aconteceu. O mesmo texto, sem os desvios.
- `L278` — [JSX] Como você quer ler
- `L279` — [JSX] Quanto tempo você tem?
- `L339` — O que eu li errado
- `L642` — [JSX] Cor com função
- `L1113` — Antes e depois
- `L1159` — >
          <Label>O que eu aprendi</Label>
          <div className=
- `L1160` — [JSX] O que eu aprendi
- `L1180` — >Antes de sair</p>
      <h2 className=
- `L1180` — [JSX] Antes de sair
- `L1181` — >Dá para abrir e mexer</h2>
      <p className=
- `L1181` — [JSX] Dá para abrir e mexer
- `L1187` — >
        {l.vercel ? <Pill href={l.vercel} externo>Abrir o protótipo</Pill> : null}
        {l.figma ? <Pill href={l.figma} externo secundario>Ver o arquivo no Figma</Pill> : null}
      </div>
    <
- `L1188` — [JSX] Abrir o protótipo
- `L1189` — [JSX] Ver o arquivo no Figma
- `L1202` — >Esse endereço não existe.</h1>
            <p className=
- `L1202` — [JSX] Esse endereço não existe.
- `L1203` — >
              Ou ele mudou de lugar, ou nunca esteve aqui. Os quatro casos, o
              método e o resto do site continuam na home.
            </p>
            <div className=
- `L1203` — [JSX] Ou ele mudou de lugar, ou nunca esteve aqui. Os quatro casos, o
              método e o resto do site continuam na home.
- `L1208` — )}>Voltar para a home</Pill>
              <Pill onClick={() => ir(
- `L1208` — [JSX] Voltar para a home
- `L1209` — )}>Ver os projetos</Pill>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const dois = (n) => String(n).padStart(2, 
- `L1209` — [JSX] Ver os projetos
- `L1218` — );

export default function Caso({ id, ir }) {
  const cap = chapterById(id);
  if (!cap) return <NaoAchou ir={ir} />;

  
  
  const [curto, setCurto] = useState(() => {
    if (typeof window === 
- `L1243` — , tem: [
- `L1246` — A investigação
- `L1249` — A resposta
- `L1252` — O resultado
- `L1283` — >
            <p>Você leu a versão de {cap.minutosCurto} min</p>
            <Pill onClick={() => trocar(false)}>Ler o capítulo inteiro · {cap.minutos} min</Pill>
          </section>
        ) : null

## site/Home.jsx — 9 strings

- `L119` — >
            <Pill onClick={paraCasos} escuro>Ver os casos</Pill>
            <Pill href={CONTATO().whatsapp.href} escuro secundario externo>Falar comigo</Pill>
          </div>
        </motion.div>
- `L120` — [JSX] Ver os casos
- `L121` — [JSX] Falar comigo
- `L220` —  + m.id} m={m} />)}
          </div>
        </div>
      </div>
    </section>
  );
}




const PILHA_TOPO = 96;    
const PILHA_PASSO = 40;   


function Cartao({ caso, i, ir }) {
  const cap = caso
- `L361` — [JSX] Ver tudo
- `L416` — [JSX] Ver o método inteiro
- `L525` — [JSX] Designer de produto em Maringá, que aprende o problema antes de abrir o Figma
          e implementa quando o prazo aperta.
- `L595` —  />
        <Titulo>Outros projetos</Titulo>
      </div>
      <div className=
- `L596` — [JSX] Outros projetos

## site/Kit.jsx — 2 strings

- `L180` — Abaixo, como foi parar lá.
- `L299` — , ir, quantos = 3 }) {
  const rise = useRise();
  const [lista] = useState(() => {
    const pool = casos().filter((c) => c.id !== excluir);
    for (let i = pool.length - 1; i > 0; i--) {
      cons

## site/Post.jsx — 7 strings

- `L13` — https://gabrielfelix-ux.4yu.com.br
- `L126` — [JSX] Esse texto não existe
- `L127` — [JSX] O endereço
- `L128` — [JSX] não corresponde a nenhum post.
- `L131` — [JSX] Ver todos os textos
- `L184` — [JSX] UX / Product Designer. Desenho e construo: do protótipo navegável ao
              produto publicado.
- `L188` — [JSX] Quem é

## site/Processo.jsx — 7 strings

- `L15` — O método
- `L16` — Meu processo muda.
- `L17` — O critério não.
- `L18` — O caminho é outro a cada projeto. Escolher qual deles rodar é a decisão que eu tomo antes de abrir o Figma.
- `L22` — até o ar.
- `L79` —  {...rise(1)}>
              <Pill href={CONTATO().whatsapp.href} escuro externo>Falar comigo</Pill>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}



exp
- `L80` — [JSX] Falar comigo

## site/ProcessoNarrativa.jsx — 50 strings

- `L12` — Como eu trabalho
- `L13` — Me perguntam qual é o meu processo esperando resposta de uma linha.
- `L15` — A minha tem duas.
- `L16` — Já me entregaram feature com o problema pronto. O P.O. chegou com a reclamação na mão, o FAQ dizia onde doía, e a dúvida que uma pesquisa mataria já estava morta. Fui direto para o protótipo e validei
- `L17` — E teve PCYES, onde eu passei semanas antes de desenhar a primeira caixa. Matriz CSD para separar o que a gente sabia do que a gente achava. Benchmarking para não inventar palavra que o mercado já usa.
- `L18` — Nos dois casos eu acho que escolhi certo. E escolher entre um e outro é boa parte do trabalho, mesmo que não apareça na tela final.
- `L23` — O que decide o tamanho
- `L24` — Três coisas decidem: prazo, time, e o que já chegou provado
- `L28` — Se é para segunda-feira ou para daqui um mês. Ele decide quanto eu tenho, não onde eu gasto.
- `L30` — Se eu divido a atividade com alguém ou toco sozinho. Dois designers mudam o que cabe na mesma semana.
- `L31` — O que já chegou validado
- `L32` — Reclamação recorrente, chamado no FAQ, dado de uso. Quando o problema já vem provado, refazer a prova só atrasa.
- `L38` —  /></>,
  gente: <><circle cx=
- `L38` — [JSX] ,
  gente:
- `L82` — Analytics e gravação
- `L83` — Objetivo, não lista de telas
- `L83` — Recorte do problema
- `L84` — Critério na mesa
- `L84` — Protótipo navegável
- `L85` — Vai para o ar
- `L88` — Na Locarmais eu sentei junto do financeiro e acompanhei a conferência dia a dia antes de desenhar. O benchmarking ali foi de vocabulário: plataformas de conciliação já consolidadas, para não inventar 
- `L89` — No PCYES o qualitativo e o quantitativo vieram separados de propósito. O Clarity respondeu o que as pessoas faziam, mapa de calor e gravação. O GA4 respondeu onde elas paravam.
- `L94` — O que não cai
- `L95` — Alguém que vai usar aquilo mexe na tela antes de eu fechar.
- `L97` — No caminho curto pode ser uma pessoa, quinze minutos, protótipo na mão. No longo é teste de usabilidade com roteiro.
- `L98` — O tamanho muda conforme o projeto, mas nunca chega a zero.
- `L104` — A vez que eu errei a conta
- `L105` — Eu tinha acabado de consertar o checkout. Tinha certeza de que o buraco era ali.
- `L107` — Abri o trimestre inteiro no GA4 e o dado disse outra coisa. De cada 62 pessoas que abriam uma página de produto, uma punha no carrinho. E quem chegava ao checkout comprava a 25%, uma em cada quatro.
- `L108` — A tela que eu tinha acabado de consertar nunca foi o gargalo principal, nem antes nem depois do conserto.
- `L109` — Perdi a aposta, e foi essa correção que redesenhou a V2 inteira.
- `L117` — Google Analytics 4 · 2º trimestre de 2026 · 166.267 sessões
- `L118` — O processo que eu escolhi estava certo. Só estava apontado para o lugar errado.
- `L189` — [JSX] Problema
- `L192` — [JSX] Os dois começam no mesmo problema e terminam no mesmo lugar. O que muda é quanto eu abro antes de fechar.
- `L410` — >Protótipo de baixa</text>
      </svg>
      <figcaption className=
- `L410` — [JSX] Protótipo de baixa
- `L412` — >
        As mesmas peças, duas vezes. A primeira serve para decidir o que entra na tela; a segunda, para alguém tocar.
      </figcaption>
    </motion.figure>
  );
}





function EixoDoRisco() {
  
- `L412` — [JSX] As mesmas peças, duas vezes. A primeira serve para decidir o que entra na tela; a segunda, para alguém tocar.
- `L459` — >Onde vira conta</text>
        </motion.g>

        <text className=
- `L459` — [JSX] Onde vira conta
- `L462` — >Sem pesquisa</text>
        <text className=
- `L462` — [JSX] Sem pesquisa
- `L463` — >Com pesquisa</text>
        <text className=
- `L463` — [JSX] Com pesquisa
- `L466` — >Tempo total até acertar</text>
      </svg>
      <figcaption className=
- `L466` — [JSX] Tempo total até acertar
- `L468` — >
        Decidir no chute começa mais barato e cobra depois, em retrabalho. Levantar as coisas antes custa tempo
        na frente e quase não cobra na sequência. As duas linhas se cruzam em algum po
- `L468` — [JSX] Decidir no chute começa mais barato e cobra depois, em retrabalho. Levantar as coisas antes custa tempo
        na frente e quase não cobra na sequência. As duas linhas se cruzam em algum ponto,
- `L591` —  {...rise(2)}>{LONGO.p}</motion.p>
        <Paras itens={LONGO.casos} i0={3} classe=

## site/Shell.jsx — 13 strings

- `L10` — /#casos
- `L83` — Abrir menu
- `L171` — >©{new Date().getFullYear()} · MARINGÁ, BR</p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}


function linkDaRota(id, rota) {
  if (!rota) return false;

- `L222` — >
        {LINKS.map((l) => {
          const aqui = linkDaRota(l.id, rota);
          return (
          <a
            key={l.id}
            href={l.href}
            className=
- `L229` — 
            
            data-aqui={aqui ? 
- `L231` —  : undefined}
            aria-current={aqui ? 
- `L242` — >
        <Pill href={CONTATO().whatsapp.href} escuro={sobreEscuro} externo>Falar comigo</Pill>
      </div>

      <Hamburguer aberto={menu} onClick={() => setMenu((v) => !v)} />
      <Menu aberto={
- `L243` — [JSX] Falar comigo
- `L262` — 
    />
  );
}


export function Rodape() {
  const c = CONTATO();
  
  const canais = [
- `L275` — >
        <Label>Contato</Label>
        <p className=
- `L276` — [JSX] Contato
- `L277` — >
          Aberto a conversar sobre produto, e-commerce e sistemas internos.
        </p>
      </div>
      <ul className=
- `L277` — [JSX] Aberto a conversar sobre produto, e-commerce e sistemas internos.

## site/Sobre.jsx — 21 strings

- `L75` —  {...tardio}>
            <Pill href={c.whatsapp.href} escuro externo>Falar comigo</Pill>
            {c.linkedin ? <Pill href={c.linkedin.href} externo escuro>LinkedIn</Pill> : null}
          </moti
- `L76` — [JSX] Falar comigo
- `L80` — >
            <li>Maringá, PR</li>
            <li>{atual ? atual.name : null}</li>
            <li>Desde 2024</li>
          </ul>
        </div>
      </motion.div>
    </section>
  );
}




functio
- `L81` — [JSX] Maringá, PR
- `L83` — [JSX] Desde 2024
- `L100` — Maringá, Paraná
- `L215` — [JSX] O que passou pela minha mão
- `L265` — );
    const ler = () => setPodeHover(mq.matches);
    ler();
    mq.addEventListener(
- `L268` — , ler);
    return () => mq.removeEventListener(
- `L269` — , ler);
  }, []);

  const ligado = podeHover && !quieto;

  const mover = (e) => {
    if (!ligado) return;
    alvoX.set(e.clientX);
    alvoY.set(e.clientY);
  };

  const rise = useRise();
  const
- `L356` — >
        <VitrineCerts lista={lista} />
        <Ferramentas />
      </div>
    </Dobra>
  );
}



function ForaDaTela() {
  const rise = useRise();
  const c = CONTATO();
  return (
    <Dobra id=
- `L392` —  {...rise(SOBRE_FORA.length)}>
            {c.youtube ? <Pill href={c.youtube.href} externo>Ver o canal no YouTube</Pill> : null}
            {c.tiktok ? <Pill href={c.tiktok.href} externo secundario>
- `L393` — [JSX] Ver o canal no YouTube
- `L417` —  style={estilo}>{children}</motion.span>
    </p>
  );
}

function Adiante() {
  const revelar = useRevelar();
  const c = CONTATO();
  return (
    <Dobra id=
- `L427` — >Para onde eu vou</p>
      <motion.p className=
- `L427` — [JSX] Para onde eu vou
- `L435` — >
          <Pill href={c.whatsapp.href} externo>Falar comigo</Pill>
          {c.curriculo ? <Pill href={c.curriculo.href} externo secundario>Currículo em PDF</Pill> : null}
        </div>
      </mo
- `L436` — [JSX] Falar comigo
- `L437` — [JSX] Currículo em PDF
- `L457` — Como eu cheguei aqui
- `L462` — Fora da tela

## site/app.jsx — 6 strings

- `L182` — ) {
      titulo = `Processo · ${base}`;
      caminho = 
- `L186` — ) {
      titulo = `Sobre · ${base}`;
      caminho = 
- `L194` — ) {
      const post = porSlug(rota.slug);
      titulo = post ? `${post.titulo} · ${base}` : `Texto não encontrado · ${base}`;
      caminho = `/blog/${rota.slug}`;
      
      if (post) {
        d
- `L208` —  && !porSlug(rota.slug));
    if (!achou) {
      titulo = `Página não encontrada · ${base}`;
      caminho = 
- `L256` — [JSX] : rota.tipo === "processo" ?
- `L257` — [JSX] : rota.tipo === "sobre" ?

## site/blog.js — 2 strings

- `L38` —  } = {}) {
  let saida = posts;
  if (tag) saida = saida.filter((p) => p.tag === tag);
  const termo = normal(q).trim();
  if (termo) {
    const partes = termo.split(/\s+/);
    saida = saida.filter(
- `L79` — ).map(Number);
  return `${d} de ${MESES[m - 1]} de ${a}`;
}

export function dataCurta(iso) {
  const [a, m, d] = String(iso).split(

## site/content.js — 1 strings

- `L8` — 
    );
  }
  return v;
}

export const CHAPTERS   = () => g("CHAPTERS");
export const PROJECTS   = () => g("PROJECTS");
export const CASE_ORDER = () => g("CASE_ORDER");
export const PIECE_ORDER = () 

## site/copy.js — 42 strings

- `L6` — que leva
- `L9` — a pesquisa à tela
- `L10` — o dado à decisão
- `L11` — a dúvida ao teste
- `L15` — o dado à decisão
- `L17` — . É de lá que saem as decisões.
- `L17` — Antes de desenhar, eu assisto 
- `L17` — sessão de usuário
- `L26` — O protótipo
- `L27` — Coloco uma tela clicável na mão das pessoas *cedo*.
- `L29` — Opinião sobre imagem estática costuma ser gosto, e opinião sobre uma 
- `L30` — coisa que a pessoa tentou usar costuma ser informação.
- `L34` — A parte demorada do meu trabalho é o *ajuste*.
- `L35` — É ajuste, e mais ajuste, e é onde eu prefiro gastar o tempo.
- `L41` — Nunca consegui pensar design e código como duas coisas separadas. 
- `L42` — Quando o prazo aperta, eu mesmo implemento.
- `L44` — Gosto de colocar uma tela clicável na mão das pessoas cedo, porque opinião sobre imagem estática costuma ser gosto, e opinião sobre uma coisa que a pessoa tentou usar costuma ser informação.
- `L45` — Depois disso é ajuste, e mais ajuste. É a parte demorada do meu trabalho, e é onde eu não corto tempo.
- `L53` — Pesquisa e teste entram em todo projeto. O tamanho de cada um muda conforme o risco da decisão e o tempo que eu tenho.
- `L57` — Quando as dúvidas já foram sanadas
- `L58` — Às vezes o problema chega com a resposta junto: reclamação que se repete, chamado no suporte, dado de uso que já aponta onde dói. Aí eu aproveito o que já existe e vou direto para o protótipo, e o tem
- `L62` — Quando ninguém sabe ainda qual é o problema
- `L63` — É onde eu sigo o Double Diamond. Levo mais tempo na descoberta antes de desenhar qualquer tela, porque quando a decisão é cara de desfazer eu prefiro gastar o tempo antes do que corrigir depois.
- `L66` — Nos dois casos, alguém que vai usar a tela mexe nela antes de eu fechar.
- `L73` — Começo pelo objetivo, não pela lista de telas, e caço o que já funciona antes de desenhar.
- `L77` — Do objetivo ao protótipo clicável em dias, para a mesa tocar em vez de imaginar.
- `L81` — Mostro cedo, corto o que não serve, e o protótipo vira produto no ar.
- `L115` — Designer de produto em Maringá, que aprende o problema antes de abrir 
- `L116` — o Figma e implementa quando o prazo aperta.
- `L121` — Gosto de colocar uma tela clicável na mão das pessoas cedo, porque 
- `L122` — opinião sobre imagem estática costuma ser gosto, e opinião sobre uma 
- `L123` — coisa que a pessoa tentou usar costuma ser informação.
- `L125` — Depois disso é ajuste, e mais ajuste. É a parte demorada do meu trabalho, e é onde eu não corto tempo.
- `L126` — Nunca consegui pensar design e código como duas coisas separadas. Quando o prazo aperta, eu mesmo implemento.
- `L132` — Contrariei o briefing com gravação de sessão na mão, e a direção oposta foi a aprovada.
- `L133` — PCYES V2 · Grupo Oderço · 2026
- `L138` — Eu estava no fim do curso de Direito na UEM quando a pandemia parou tudo. Para ocupar a cabeça, montei um e-commerce só para aprender a mexer.
- `L139` — Foi ali que a coisa virou. Não me peguei gostando só das telas: gostei da engenharia de fazer um sistema existir, de tirar algo do nada e botar de pé.
- `L140` — Larguei o Direito, me formei em Design Gráfico, fui atrás de curso de UX e tirei a certificação Scrum para andar no ritmo de time ágil. Comecei na TT&T, desenhei produto na Locarmais, e hoje toco o de
- `L145` — Corro, treino boxe há dois anos e jogo vôlei toda semana num time amador aqui em Maringá.
- `L146` — Leio mangá e manhwa numa quantidade difícil de justificar, e mantenho um canal sobre anime. Se quiser conferir o que eu ando assistindo, 
- `L146` — tá aqui

## site/ferramentas.js — 2 strings

- `L7` — Onde tudo começa
- `L8` — Implementação no PCYES e na Odex

## site/motion.js — 1 strings

- `L398` — ;
}


function manobras(P, w, topo, sobra, base, fatia) {
  const em = (fx, u) => P.push([w * fx, topo + sobra * (base + u * fatia)]);
  const volta = (fx, u, raio) => {
    const bx = w * fx;
    con

---

**Total: 210 strings.**
