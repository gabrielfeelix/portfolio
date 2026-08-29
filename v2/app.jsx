/* Raiz da V2.
 *
 * React vem do vendor UMD da V1; i18n e data.js publicam o conteúdo em window;
 * este arquivo lê tudo por content.js. Nada de texto é duplicado. */

import React, { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { chapterById } from "./content.js";
import { Nav, Rodape } from "./Shell.jsx";
import { useScrollSuave } from "./motion.js";
import Home from "./Home.jsx";
import Caso from "./Case.jsx";

/* --- roteamento ---
   /v2            → home
   /v2/case/<id>  → caso
   Path real, sem hash: o dev server devolve /v2/index.html para qualquer path
   sob /v2, então a URL é compartilhável e o back/forward funciona. */
function rotaAtual() {
  const p = window.location.pathname.replace(/^\/v2\/?/, "").replace(/\/+$/, "");
  if (!p) return { tipo: "home" };
  const m = p.match(/^case\/([\w-]+)$/);
  if (m) return { tipo: "caso", id: m[1] };
  return { tipo: "404", path: p };
}

function useRota() {
  const [rota, setRota] = useState(rotaAtual);

  useEffect(() => {
    const onPop = () => setRota(rotaAtual());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const ir = useCallback((href) => {
    if (window.location.pathname === href) return;
    window.history.pushState(null, "", href);
    setRota(rotaAtual());
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return [rota, ir];
}

/* A nav é clara por padrão e inverte enquanto uma superfície escura ocupa a
   faixa dela. São duas perguntas diferentes, e por isso duas regras:

   1. O hero. Ele é `sticky` e nunca sai da tela, então observar o hero
      deixava a nav branca a página inteira. Quem responde é o CORPO CLARO:
      enquanto ele não alcança a barra, o que está atrás dela é o hero.
   2. Os blocos escuros do meio da página, como o "Aprendi" que fecha o
      caso. Esses respondem sozinhos: escuro enquanto a faixa da nav estiver
      dentro deles.

   Um listener de scroll no lugar de IntersectionObserver porque a pergunta
   é sobre uma faixa de 72px, e IO só sabe responder sobre a viewport
   inteira ou uma fração dela em porcentagem, que muda com a altura da tela. */
const NAV_H = 72;

function useSobreEscuro(rota) {
  const [escuro, setEscuro] = useState(false);

  useEffect(() => {
    const claro = document.querySelector("[data-clara]");
    const escurosCorpo = Array.from(document.querySelectorAll("[data-escuro-corpo]"));
    let quadro = 0;

    const calc = () => {
      quadro = 0;
      if (claro && claro.getBoundingClientRect().top > NAV_H) { setEscuro(true); return; }
      setEscuro(escurosCorpo.some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= NAV_H && r.bottom > NAV_H;
      }));
    };

    const agendar = () => { if (!quadro) quadro = requestAnimationFrame(calc); };

    calc();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, [rota]);

  return escuro;
}

function App() {
  const [rota, ir] = useRota();
  const [erro, setErro] = useState(null);
  const sobreEscuro = useSobreEscuro(rota);
  // Amortecimento do scroll da página inteira. Ver a primitiva 7 em motion.js.
  useScrollSuave();

  useEffect(() => {
    document.title =
      rota.tipo === "caso"
        ? `${(chapterById(rota.id) || {}).title || rota.id} · Gabriel Felix Barbosa`
        : "Gabriel Felix Barbosa · UX / Product Designer";
  }, [rota]);

  if (erro) {
    return (
      <div className="v2-wrap" style={{ paddingTop: "var(--v2-s7)" }}>
        <p className="v2-erro">{erro}</p>
      </div>
    );
  }

  try {
    return (
      <div className="v2-shell">
        <Nav sobreEscuro={sobreEscuro} ir={ir} />
        <main>
          {rota.tipo === "home"
            ? <Home ir={ir} />
            : <Caso id={rota.id || rota.path} ir={ir} />}
        </main>
        <Rodape />
      </div>
    );
  } catch (e) {
    // Falha de conteúdo (uma chave que data.jsx parou de publicar) aparece
    // escrita na tela, não como página branca.
    queueMicrotask(() => setErro(String(e && e.message ? e.message : e)));
    return null;
  }
}

const alvo = document.getElementById("v2-root");
if (alvo) createRoot(alvo).render(<App />);
