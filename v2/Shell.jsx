/* Casca da V2: nav e rodapé.
 *
 * A nav é clara por padrão. Sobre um hero escuro ela inverte, e volta ao claro
 * quando o hero sai da tela: é o mesmo elemento, não dois. */

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { spring } from "./motion.js";
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
  { id: "casos",    rot: "Casos",    href: "/v2#casos",     rota: true },
  { id: "processo", rot: "Processo", href: "/v2/processo",  rota: true },
  { id: "sobre",    rot: "Sobre",    href: "/v2/sobre",     rota: true },
];

/* A seta do pill. Duas cópias empilhadas dentro de uma janela de 12px: no
   hover a fita anda meia largura, uma sai pela esquerda e a outra entra pela
   direita. É melhor que a seta que só desliza, porque o gesto termina no
   mesmo lugar em que começou. */
function Seta() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.6"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Pill padrão da V2: bolinha accent à esquerda, rótulo à direita.
   É o único botão do sistema. Variante `escuro` para uso sobre hero.

   Fase 6: os dois efeitos medidos na referência entram aqui. O `filler` é o
   círculo accent que cresce até virar a pílula inteira; a fita de setas
   troca de seta no mesmo tempo. O rótulo vira branco quando o filler passa
   por baixo dele: branco sobre #E4231B mede 4.51:1, que passa AA em texto
   normal. Se o accent mudar, esse par volta para medição. */
export function Pill({ children, href, onClick, escuro = false, seta = true, externo = false }) {
  const Tag = href ? "a" : "button";
  // Link para fora abre em aba nova, e `noopener` impede que a página de
  // destino alcance esta por window.opener.
  const fora = href && externo
    ? { target: "_blank", rel: "noopener noreferrer" }
    : null;
  return (
    <motion.div
      className={"v2-pill-wrap" + (escuro ? " is-escuro" : "")}
      whileTap={{ scale: 0.98 }}
      transition={spring}
    >
      <Tag className="v2-pill" href={href} onClick={onClick} type={href ? undefined : "button"} {...fora}>
        <span className="v2-pill-filler" aria-hidden="true" />
        <span className="v2-pill-dot" aria-hidden="true">
          {seta ? (
            <span className="v2-pill-janela">
              <span className="v2-pill-fita"><Seta /><Seta /></span>
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

export function Nav({ sobreEscuro, ir }) {
  const [encolhida, setEncolhida] = useState(false);

  useEffect(() => {
    const onScroll = () => setEncolhida(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={"v2-nav" + (sobreEscuro ? " is-escuro" : "") + (encolhida ? " is-encolhida" : "")}>
      {/* Fase 7: o ponto accent depois do nome saiu. Era maneirismo, e
          nenhuma das cinco referências faz isso. */}
      <a className="v2-nav-marca" href="/v2" onClick={ir ? (e) => { e.preventDefault(); ir("/v2"); } : undefined}>
        Gabriel Felix
      </a>

      {/* Os sobrescritos ⁰¹ ⁰² ⁰³ também saíram. O que separa os três agora
          é espaço, peso e o traço que cresce no hover. */}
      <nav className="v2-nav-links" aria-label="Seções">
        {LINKS.map((l) => (
          <a
            key={l.id}
            href={l.href}
            className="v2-nav-link"
            onClick={l.rota && ir ? (e) => { e.preventDefault(); ir(l.href); } : undefined}
          >
            <span className="v2-nav-link-rot">{l.rot}</span>
            <span className="v2-nav-link-traco" aria-hidden="true" />
          </a>
        ))}
      </nav>

      <div className="v2-nav-cta">
        <Pill href={CONTATO().email.href} escuro={sobreEscuro}>Falar comigo</Pill>
      </div>
    </header>
  );
}

export function Rodape() {
  const c = CONTATO();
  const canais = ["email", "linkedin", "whatsapp", "instagram"].filter((k) => c[k]);
  return (
    <footer className="v2-rodape" id="contato" data-escuro-corpo="1">
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
