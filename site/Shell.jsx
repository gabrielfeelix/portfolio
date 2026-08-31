/* Casca da V2: nav e rodapé.
 *
 * A nav é clara por padrão. Sobre um hero escuro ela inverte, e volta ao claro
 * quando o hero sai da tela: é o mesmo elemento, não dois. */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ease, spring, useLamina, AVIAO_D } from "./motion.js";
import { CONTATO, AUTOR } from "./content.js";

/* Todo link passa pelo roteador (`ir`), inclusive "Casos".
 *
   "Casos" continua sendo âncora e não página, porque a dobra 03 da home É a
   lista de casos: uma página só para repetir a mesma grade não existe. O que
   mudou é quem trata a âncora. Como <a> puro, o clique recarregava o app e o
   navegador procurava #casos antes de o React montar a home, então vindo de
   uma página de caso a nav largava a pessoa no topo da home. Agora `ir`
   troca a rota e só depois procura o alvo; ver o comentário dele em app.jsx.

   O `href` continua real, então abrir em nova aba e copiar o link seguem
   funcionando: o `preventDefault` só vale para o clique comum. */
const LINKS = [
  { id: "casos",    rot: "Projetos", href: "/#casos",     rota: true },
  { id: "processo", rot: "Processo", href: "/processo",  rota: true },
  { id: "sobre",    rot: "Sobre",    href: "/sobre",     rota: true },
  { id: "blog",     rot: "Blog",     href: "/blog",      rota: true },
];

/* O ícone do pill. Duas cópias empilhadas dentro de uma janela de 13px: no
   hover a fita anda meia largura, uma sai pela esquerda e a outra entra pela
   direita. É melhor que o ícone que só desliza, porque o gesto termina no
   mesmo lugar em que começou.

   Era uma seta e virou o AVIÃO, em 29/08, a pedido do Gabriel: "em tudo que
   tiver setinha no site". E é literalmente o mesmo caminho do avião que cruza
   a rolagem e a travessia — três lugares, um desenho só, um `d` só. Se ele
   mudar, muda em todos de uma vez.

   O único arredondamento é `stroke-linejoin`: em 13px, a ponta viva do bico
   vira serrilhado, e meio pixel de junta arredondada resolve sem tirar a
   forma. Vai com `stroke` da mesma cor do `fill` porque o traço engorda a
   silhueta o suficiente para o avião não sumir nesse tamanho. */
function Aviao() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
      <path d={AVIAO_D} fill="currentColor" stroke="currentColor" strokeWidth="1.2"
            strokeLinejoin="round" />
    </svg>
  );
}

/* Pill padrão da V2: bolinha accent à esquerda, rótulo à direita.
   É o único botão do sistema, em duas variantes de peso e duas de fundo.

   `escuro`     sobre hero: a sombra sai, porque sombra sobre preto vira sujeira.
   `secundario` o mesmo botão sem chapa e sem preenchimento — ver a nota longa
                em shell.css, que é onde ele é desenhado.

   Fase 6: os dois efeitos medidos na referência entram aqui. O `filler` é o
   círculo accent que cresce até virar a pílula inteira; a fita de setas
   troca de seta no mesmo tempo. O rótulo vira branco quando o filler passa
   por baixo dele: branco sobre #E4231B mede 4.51:1, que passa AA em texto
   normal. Se o accent mudar, esse par volta para medição. */
/* `inerte` é o botão que não leva a lugar nenhum: vira <span>, perde a seta e
   perde o hover. Ele existe para a peça que já tem capa e ainda não tem
   destino ("Em breve"), que antes era um rótulo solto em mono — duas
   gramáticas para a mesma vaga dentro do card. Como <span>, ele não entra na
   ordem de tabulação e não promete clique.
   `resto` passa adiante o que a fita precisa e a pílula não tem por que
   conhecer: `tabIndex` e `aria-label` da cópia do laço. */
export function Pill({ children, href, onClick, escuro = false, seta = true, externo = false, secundario = false, inerte = false, ...resto }) {
  const Tag = inerte ? "span" : href ? "a" : "button";
  // Link para fora abre em aba nova, e `noopener` impede que a página de
  // destino alcance esta por window.opener.
  const fora = href && externo
    ? { target: "_blank", rel: "noopener noreferrer" }
    : null;
  return (
    <motion.div
      className={"v2-pill-wrap" + (escuro ? " is-escuro" : "") + (secundario ? " is-secundario" : "") + (inerte ? " is-inerte" : "")}
      whileTap={inerte ? undefined : { scale: 0.98 }}
      transition={spring}
    >
      <Tag
        className="v2-pill"
        href={inerte ? undefined : href}
        onClick={inerte ? undefined : onClick}
        type={!inerte && !href ? "button" : undefined}
        {...(inerte ? null : fora)}
        {...resto}
      >
        <span className="v2-pill-filler" aria-hidden="true" />
        <span className="v2-pill-dot" aria-hidden="true">
          {seta && !inerte ? (
            <span className="v2-pill-janela">
              <span className="v2-pill-fita"><Aviao /><Aviao /></span>
            </span>
          ) : null}
        </span>
        <span className="v2-pill-rot">{children}</span>
      </Tag>
    </motion.div>
  );
}

/* Label de seção: quadrado accent mais texto. Abre toda dobra. */
export function Label({ children }) {
  return (
    <p className="v2-label">
      <span className="v2-label-quad" aria-hidden="true" />
      {children}
    </p>
  );
}

/* Régua entre dobras.
 *
 * Fase 6: a cruz saiu do meio e foi para as duas pontas, como na referência.
 * No meio ela precisava de um retângulo de papel para mascarar a linha, o
 * que é um remendo; na ponta ela é só o fim da linha, e a linha ganha
 * opacidade em vez de cor própria. `discreta` é a régua de dentro de um
 * movimento, que separa sem anunciar. */
export function Regua({ discreta = false }) {
  return (
    <div className={"v2-regua" + (discreta ? " is-discreta" : "")} aria-hidden="true">
      <span className="v2-cruz" />
      <span className="v2-regua-linha" />
      <span className="v2-cruz" />
    </div>
  );
}

/* ---------------- menu do celular ----------------
 *
 * Abaixo de 860px os links da nav somem (`.v2-nav-links { display: none }`),
 * e até aqui não existia caminho nenhum para /processo, /sobre ou /blog a não
 * ser digitar a URL. Não era regressão, era como a V2 sempre esteve — e
 * virou bloqueio quando o blog entrou, porque texto longo se lê no telefone.
 *
 * A forma vem das referências, não de biblioteca: bungee numera os links do
 * menu na mono (`( _01 ) Home`), viper faz o mesmo do outro lado (`Home 01`),
 * e as duas fecham com e-mail e social. Aqui o índice na mono é o MESMO cromo
 * que abre toda dobra do site, então o menu não estreia vocabulário nenhum:
 * ele repete o que a página já fala.
 *
 * Chapa escura de borda a borda porque é o que o site já faz quando quer
 * dizer "outro plano": capa de capítulo, rodapé, hero. */

function Hamburguer({ aberto, onClick }) {
  return (
    <button
      type="button"
      className={"v2-burger" + (aberto ? " is-aberto" : "")}
      aria-label={aberto ? "Fechar menu" : "Abrir menu"}
      aria-expanded={aberto}
      aria-controls="v2-menu"
      onClick={onClick}
    >
      <span className="v2-burger-linha" aria-hidden="true" />
      <span className="v2-burger-linha" aria-hidden="true" />
    </button>
  );
}

function Menu({ aberto, fechar, ir, rota }) {
  const painel = useRef(null);
  const c = CONTATO();
  /* Deixou de ser só rede social em 30/08, quando o currículo entrou: o menu
     do telefone é a única navegação que existe em tela pequena, e era o único
     lugar do site onde o PDF não teria como aparecer. Por isso `atalhos` e
     não `sociais` — o currículo fecha a fila, depois dos canais de conversa. */
  const atalhos = ["linkedin", "instagram", "whatsapp", "curriculo"].filter((k) => c[k]);

  /* Enquanto aberto: Escape fecha, a página atrás não rola, e o foco entra no
     painel. Sem a trava de scroll, arrastar o menu arrastava a home embaixo
     dele e o menu voltava para uma página que tinha andado sozinha. */
  useEffect(() => {
    if (!aberto) return;
    const onKey = (e) => { if (e.key === "Escape") fechar(); };
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => { if (painel.current) painel.current.focus(); }, 0);
    return () => {
      document.body.style.overflow = antes;
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [aberto, fechar]);

  return (
    <AnimatePresence>
      {aberto ? (
        <motion.div
          id="v2-menu"
          ref={painel}
          className="v2-menu"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          /* Cortina: a chapa desce de cima, não aparece por opacidade. É a
             mesma passagem que a página de caso usa entre movimentos. */
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.42, ease }}
        >
          <nav className="v2-menu-links" aria-label="Seções">
            {LINKS.map((l, i) => (
              <motion.a
                key={l.id}
                href={l.href}
                className="v2-menu-link"
                data-aqui={linkDaRota(l.id, rota) ? "1" : undefined}
                aria-current={linkDaRota(l.id, rota) ? "page" : undefined}
                initial={{ y: 26, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ ...spring, delay: 0.16 + i * 0.06 }}
                onClick={(e) => {
                  if (l.rota && ir) { e.preventDefault(); fechar(); ir(l.href); }
                  else fechar();
                }}
              >
                <span className="v2-menu-n" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="v2-menu-rot">{l.rot}</span>
                <span className="v2-menu-traco" aria-hidden="true" />
              </motion.a>
            ))}
          </nav>

          <motion.div
            className="v2-menu-pe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.16 + LINKS.length * 0.06, duration: 0.38, ease }}
          >
            <a className="v2-menu-email" href={c.email.href}>{c.email.display}</a>
            <ul className="v2-menu-social">
              {atalhos.map((k) => (
                <li key={k}>
                  <a href={c[k].href} target="_blank" rel="noopener noreferrer">{c[k].label}</a>
                </li>
              ))}
            </ul>
            <p className="v2-menu-carimbo">©{new Date().getFullYear()} · MARINGÁ, BR</p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* Qual link da nav corresponde à rota aberta.

   A home NÃO acende nenhum: "Casos" é âncora para a dobra 03 e não uma página,
   então acendê-lo na home diria que a home é a lista de casos, que ela não é.
   Quem leva de volta para a home é a marca, à esquerda. Numa PÁGINA de caso,
   sim: aí "Casos" é onde a pessoa está.

   O post acende "Blog" pelo mesmo motivo que o caso acende "Casos": ler um
   texto é estar no blog. */
function linkDaRota(id, rota) {
  if (!rota) return false;
  if (id === "casos") return rota.tipo === "caso";
  if (id === "processo") return rota.tipo === "processo";
  if (id === "sobre") return rota.tipo === "sobre";
  if (id === "blog") return rota.tipo === "blog" || rota.tipo === "post";
  return false;
}

export function Nav({ sobreEscuro, ir, rota }) {
  const [encolhida, setEncolhida] = useState(false);
  const [menu, setMenu] = useState(false);
  const fechar = useCallback(() => setMenu(false), []);

  useEffect(() => {
    const onScroll = () => setEncolhida(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Duas saídas que não passam pelo clique no link: o back do navegador, e a
     janela crescendo além de 860px, onde o botão que abriu o menu deixa de
     existir. Sem a segunda, girar o telefone deixava a chapa escura presa na
     tela sem nada para fechá-la. */
  useEffect(() => {
    const larga = window.matchMedia("(min-width: 861px)");
    const onLarga = () => { if (larga.matches) setMenu(false); };
    window.addEventListener("popstate", fechar);
    larga.addEventListener("change", onLarga);
    return () => {
      window.removeEventListener("popstate", fechar);
      larga.removeEventListener("change", onLarga);
    };
  }, [fechar]);

  /* Com o menu aberto a barra está sobre chapa escura, e a marca precisa
     inverter junto — senão o nome fica preto sobre preto, que é exatamente o
     bug que `is-escuro` existe para resolver no hero. */
  return (
    <header className={"v2-nav" + (sobreEscuro || menu ? " is-escuro" : "") + (encolhida && !menu ? " is-encolhida" : "")}>
      {/* Fase 7: o ponto accent depois do nome saiu. Era maneirismo, e
          nenhuma das cinco referências faz isso. */}
      <a className="v2-nav-marca" href="/" onClick={ir ? (e) => { e.preventDefault(); ir("/"); } : undefined}>
        Gabriel Felix
      </a>

      {/* Os sobrescritos ⁰¹ ⁰² ⁰³ também saíram. O que separa os três agora
          é espaço, peso e o traço que cresce no hover. */}
      <nav className="v2-nav-links" aria-label="Seções">
        {LINKS.map((l) => {
          const aqui = linkDaRota(l.id, rota);
          return (
          <a
            key={l.id}
            href={l.href}
            className="v2-nav-link"
            /* `data-aqui` é o desenho e `aria-current` é o mesmo fato dito para
               quem não vê o desenho. Os dois, sempre juntos. */
            data-aqui={aqui ? "1" : undefined}
            aria-current={aqui ? "page" : undefined}
            onClick={l.rota && ir ? (e) => { e.preventDefault(); ir(l.href); } : undefined}
          >
            <span className="v2-nav-link-rot">{l.rot}</span>
            <span className="v2-nav-link-traco" aria-hidden="true" />
          </a>
          );
        })}
      </nav>

      <div className="v2-nav-cta">
        <Pill href={CONTATO().whatsapp.href} escuro={sobreEscuro} externo>Falar comigo</Pill>
      </div>

      <Hamburguer aberto={menu} onClick={() => setMenu((v) => !v)} />
      <Menu aberto={menu} fechar={fechar} ir={ir} rota={rota} />
    </header>
  );
}

/* A LÂMINA diagonal entre duas superfícies de cor diferente.

   Medida no fuel.framer.website (~/dev/refs/fuel-ANALISE.md). Lá ela é uma div
   VAZIA, sem um único filho, que sobe torta na fronteira entre duas seções.
   Dois valores, e os dois saturam junto:

     skewY        0  ->  -7deg     (o termo da matriz satura em tan 7° exato)
     translateY   0  ->  -220px

   E ela aparece DUAS vezes na referência, com a mesma conta e cores opostas:

     hero -> corpo    lâmina CLARA subindo sobre o escuro
     corpo -> rodapé  lâmina ESCURA subindo sobre o claro  (medido: rgb(17,17,17))

   É a mesma peça, na cor da seção que está CHEGANDO. Por isso `tom` e não dois
   componentes: o desenho é um só e o que muda é de onde para onde.

   `borda="topo"` é a fronteira de cima (a lâmina cobre o que está acima dela);
   `borda="base"` é a de baixo. Muda só onde ela se ancora. */
export function Lamina({ tom = "claro", borda = "topo" }) {
  const { ref, style } = useLamina();
  return (
    <motion.div
      className="v2-lamina"
      data-tom={tom}
      data-borda={borda}
      ref={ref}
      style={style}
      aria-hidden="true"
    />
  );
}

/* A caixa que o voo mede e por onde ele é recortado.

   Cada página embrulha o corpo dela aqui, e não ganha nível de DOM por isso:
   quem já tinha um corpo claro (home, caso, processo, sobre) passa
   `classe="v2-corpo-claro"` e continua sendo exatamente o mesmo elemento de
   antes, agora com o avião como primeiro filho. Blog e post, que não têm
   corpo claro, ficam com `.v2-voo-campo` — só posição e contexto de
   empilhamento, sem fundo e sem `data-clara`, para a nav não mudar de ideia
   sobre quando inverter. */
export function Rodape() {
  const c = CONTATO();
  /* `curriculo` fecha a lista desde 30/08. É o único item daqui que não é um
     canal de conversa, e é justamente o que faltava: recrutador que gostou do
     site precisa de um arquivo para anexar. Entra por último porque a ordem
     da lista é a da intenção — falar primeiro, arquivar depois. */
  const canais = ["email", "linkedin", "whatsapp", "instagram", "curriculo"].filter((k) => c[k]);
  return (
    <footer className="v2-rodape" id="contato" data-escuro-corpo="1">
      {/* A lâmina escura que subia aqui SAIU em 29/08, a pedido do Gabriel:
          "tira esse efeito de lâmina diagonal do footer, só do footer". A
          referência tem as duas — medi o par —, mas lá o rodapé não é uma
          dobra cheia. Aqui ele passou a ser, e uma diagonal cortando a entrada
          de uma dobra inteira é outro efeito, não o mesmo. A da fronteira
          hero -> corpo continua. */}
      <div className="v2-rodape-topo">
        <Label>Contato</Label>
        <p className="v2-rodape-chamada">
          Aberto a conversar sobre produto, e-commerce e sistemas internos.
        </p>
      </div>
      <ul className="v2-rodape-lista">
        {canais.map((k) => (
          <li key={k}>
            <a href={c[k].href} target="_blank" rel="noopener noreferrer">
              <span className="v2-rodape-canal">{c[k].label}</span>
              <span className="v2-rodape-valor">{c[k].display}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="v2-rodape-base">
        <span>{AUTOR()}</span>
        <span>UX · Product Designer</span>
      </div>
    </footer>
  );
}
