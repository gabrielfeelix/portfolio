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
import Processo from "./Processo.jsx";
import Sobre from "./Sobre.jsx";

/* --- roteamento ---
   /v2            → home
   /v2/processo   → o método
   /v2/case/<id>  → caso
   Path real, sem hash: o dev server devolve /v2/index.html para qualquer path
   sob /v2, então a URL é compartilhável e o back/forward funciona. */
function rotaAtual() {
  const p = window.location.pathname.replace(/^\/v2\/?/, "").replace(/\/+$/, "");
  if (!p) return { tipo: "home" };
  if (p === "processo") return { tipo: "processo" };
  if (p === "sobre") return { tipo: "sobre" };
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

  /* `href` pode trazer âncora: "/v2#casos" é a home parando na dobra dos
     casos, que é o que a nav pede em "Casos".
   *
     Hash puro não resolvia. O link era um <a> comum, então o clique
     recarregava o app inteiro e o navegador procurava #casos antes de o React
     montar a home: a página caía no topo com a dobra 2408px abaixo (medido em
     1440, vindo de /v2/case/odex).
   *
     Por isso o alvo é procurado DEPOIS da troca de rota, e por tentativa: a
     home monta em um quadro, mas o hero é sticky e a altura só assenta no
     seguinte. Doze quadros é o teto; passou disso, some sem rolar, que é
     melhor que pular para um lugar errado.
   *
     Rolagem suave só quando já se está na página. Vindo de outra rota, suave
     significaria atravessar o hero inteiro em animação para chegar a uma
     dobra que a pessoa pediu direto. */
  const ir = useCallback((href) => {
    const [caminho, ancora] = String(href).split("#");
    const mesmaPagina = window.location.pathname === caminho;
    if (mesmaPagina && !ancora) return;

    if (mesmaPagina) {
      window.history.replaceState(null, "", href);
    } else {
      window.history.pushState(null, "", href);
      setRota(rotaAtual());
    }

    if (!ancora) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    let quadros = 0;
    const busca = () => {
      const alvo = document.getElementById(ancora);
      if (alvo) {
        alvo.scrollIntoView({
          behavior: mesmaPagina ? "smooth" : "instant",
          block: "start",
        });
        return;
      }
      if (++quadros < 12) requestAnimationFrame(busca);
    };
    requestAnimationFrame(busca);
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

  /* A largura da barra de rolagem, em token.
   *
   * Quem sangra de borda a borda dentro de um container centrado usa
   * `margin-inline: calc(50% - 50vw)`. O problema é que `100vw` conta a barra
   * de rolagem e `50%` não, então em qualquer navegador com barra fixa a
   * mídia passa alguns pixels da janela e nasce um overflow horizontal que
   * não aparece em teste sem barra.
   *
   * `overflow: hidden` ou `clip` no ancestral resolveria e traz um problema
   * pior: ancestral com overflow diferente de `visible` mata o
   * IntersectionObserver dos filhos, e a página inteira depende de
   * `whileInView`. Está anotado em docs/HANDOFF-V2.md.
   *
   * Então a barra vira número e o cálculo desconta ela. Recalcula no resize
   * porque a barra some quando a página encolhe. */
  useEffect(() => {
    const mede = () => {
      const barra = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty("--v2-barra", `${Math.max(0, barra)}px`);
    };
    mede();
    window.addEventListener("resize", mede);
    return () => window.removeEventListener("resize", mede);
  }, []);

  useEffect(() => {
    if (rota.tipo === "caso") {
      document.title = `${(chapterById(rota.id) || {}).title || rota.id} · Gabriel Felix Barbosa`;
    } else if (rota.tipo === "processo") {
      document.title = "Processo · Gabriel Felix Barbosa";
    } else if (rota.tipo === "sobre") {
      document.title = "Sobre · Gabriel Felix Barbosa";
    } else {
      document.title = "Gabriel Felix Barbosa · UX / Product Designer";
    }
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
          {rota.tipo === "home" ? <Home ir={ir} />
            : rota.tipo === "processo" ? <Processo ir={ir} />
            : rota.tipo === "sobre" ? <Sobre ir={ir} />
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
