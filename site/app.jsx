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
import Blog from "./Blog.jsx";
import Post from "./Post.jsx";
import { porSlug } from "./blog.js";
import { Cortina, useTravessia } from "./Travessia.jsx";
import { Cursor } from "./Cursor.jsx";

/* --- roteamento ---
   /            → home
   /processo    → o método
   /sobre       → quem é
   /blog        → a listagem do blog
   /blog/<slug> → um post
   /case/<id>   → caso
   Path real, sem hash: o servidor devolve index.html para qualquer path que
   não seja arquivo, então a URL é compartilhável e o back/forward funciona.

   Era tudo sob /v2 até 29/08, quando esta versão virou o site — a antiga
   saiu do ar e ficou no repositório, em legado-v1/. Os endereços que ela
   tinha indexados são redirecionados pelo vercel.json, não aqui. */
function rotaDe(caminho) {
  const p = String(caminho || "").replace(/^\/+/, "").replace(/\/+$/, "");
  if (!p || p === "index.html") return { tipo: "home" };
  if (p === "processo") return { tipo: "processo" };
  if (p === "sobre") return { tipo: "sobre" };
  if (p === "blog") return { tipo: "blog" };
  const b = p.match(/^blog\/([\w-]+)$/);
  if (b) return { tipo: "post", slug: b[1] };
  const m = p.match(/^case\/([\w-]+)$/);
  if (m) return { tipo: "caso", id: m[1] };
  return { tipo: "404", path: p };
}

function rotaAtual() {
  return rotaDe(window.location.pathname);
}

/* O nome que a lâmina da travessia mostra na parada.

   É o nome da SEÇÃO, e não o título da página: quem clicou já sabe o que
   clicou, e o que a parada precisa dizer é "chegou". Por isso o caso mostra o
   nome do caso — que é a única troca de página em que o destino não estava
   escrito no link — e o post mostra só `TEXTO`, porque o título de um post não
   cabe numa linha de 12px em caixa alta. */
function nomeDaRota(rota) {
  if (!rota) return null;
  if (rota.tipo === "home") return "INÍCIO";
  if (rota.tipo === "processo") return "PROCESSO";
  if (rota.tipo === "sobre") return "SOBRE";
  if (rota.tipo === "blog") return "NOTAS";
  if (rota.tipo === "post") return "TEXTO";
  if (rota.tipo === "caso") {
    const c = chapterById(rota.id);
    return String((c && c.title) || "CASO").toUpperCase();
  }
  return null;
}

/* Link antigo da V1 com hash de rota (#/cap/pcyes) continua chegando de
   mensagem e de candidatura enviada. O `#` nunca sobe para o servidor, então
   redirect de vercel.json não alcança esse caso — quem traduz é o boot, uma
   vez, antes do primeiro render. Âncora de página (#casos) passa direto. */
function traduzirHashLegado() {
  const h = window.location.hash || "";
  if (h.indexOf("#/") !== 0) return;
  const alvo = h.slice(1).replace(/^\/cap\//, "/case/");
  try { window.history.replaceState(null, "", alvo === "/" ? "/" : alvo); } catch (e) {}
}
traduzirHashLegado();

function useRota(atravessar) {
  const [rota, setRota] = useState(rotaAtual);

  useEffect(() => {
    /* Voltar e avançar também passam pela cortina. A URL já mudou quando o
       popstate chega, então por 390ms a barra de endereço aponta para a página
       nova enquanto a antiga ainda está na tela — atrás da cortina, onde
       ninguém vê. */
    const onPop = () => atravessar(() => setRota(rotaAtual()), nomeDaRota(rotaAtual()));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [atravessar]);

  /* `href` pode trazer âncora: "/#casos" é a home parando na dobra dos
     casos, que é o que a nav pede em "Casos".
   *
     Hash puro não resolvia. O link era um <a> comum, então o clique
     recarregava o app inteiro e o navegador procurava #casos antes de o React
     montar a home: a página caía no topo com a dobra 2408px abaixo (medido em
     1440, vindo de /case/odex).
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

    /* Âncora dentro da própria página não é travessia: ninguém troca de
       página, e cobrir a tela para rolar 2000px seria mentir sobre o que
       aconteceu. Continua sendo rolagem suave, como sempre foi. */
    if (mesmaPagina) {
      window.history.replaceState(null, "", href);
      const alvo = document.getElementById(ancora);
      if (alvo) alvo.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    /* Trocar de página, sim. A troca roda com a tela já coberta pela cortina;
       ver os tempos em Travessia.jsx. */
    atravessar(() => {
      window.history.pushState(null, "", href);
      setRota(rotaAtual());

      if (!ancora) {
        window.scrollTo({ top: 0, behavior: "instant" });
        return;
      }

      let quadros = 0;
      const busca = () => {
        const alvo = document.getElementById(ancora);
        if (alvo) {
          alvo.scrollIntoView({ behavior: "instant", block: "start" });
          return;
        }
        if (++quadros < 12) requestAnimationFrame(busca);
      };
      requestAnimationFrame(busca);
    }, nomeDaRota(rotaDe(caminho)));
  }, [atravessar]);

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
  const { fase, rotulo, atravessar } = useTravessia();
  const [rota, ir] = useRota(atravessar);
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

  /* Título e endereço canônico acompanham a rota.
   *
   * O HTML servido é o mesmo em qualquer path — é uma SPA estática — então
   * sem isto todo caso se anuncia para buscador e para preview de link como
   * se fosse a home. A V1 já fazia isso e a regra não muda por a V2 ter
   * virado o site. */
  useEffect(() => {
    const base = "Gabriel Felix Barbosa";
    let titulo = `${base} · UX / Product Designer`;
    let caminho = "/";
    let descricao = null;
    let imagem = null;
    let tipoOg = "website";

    if (rota.tipo === "caso") {
      titulo = `${(chapterById(rota.id) || {}).title || rota.id} · ${base}`;
      caminho = `/case/${rota.id}`;
    } else if (rota.tipo === "processo") {
      titulo = `Processo · ${base}`;
      caminho = "/processo";
    } else if (rota.tipo === "sobre") {
      titulo = `Sobre · ${base}`;
      caminho = "/sobre";
    } else if (rota.tipo === "blog") {
      titulo = `Notas · ${base}`;
      caminho = "/blog";
      descricao = "Ofício, bastidor e carreira: o que eu aprendi medindo, o que deu errado antes de dar certo, e o que ninguém conta em processo seletivo.";
    } else if (rota.tipo === "post") {
      const post = porSlug(rota.slug);
      titulo = post ? `${post.titulo} · ${base}` : `Texto não encontrado · ${base}`;
      caminho = `/blog/${rota.slug}`;
      /* Post é a única rota do site em que a prévia de link importa de
         verdade: texto circula em grupo e em rede social, e sem isto todo
         post se anunciaria com a descrição da home. */
      if (post) {
        descricao = post.resumo;
        tipoOg = "article";
        if (post.capa) imagem = window.location.origin + post.capa;
      }
    }

    document.title = titulo;
    const url = window.location.origin + caminho;

    const por = (sel, attr, valor) => {
      if (valor == null) return;
      const el = document.querySelector(sel);
      if (el) el.setAttribute(attr, valor);
    };

    por('link[rel="canonical"]', "href", url);
    por('meta[property="og:url"]', "content", url);
    por('meta[property="og:type"]', "content", tipoOg);
    por('meta[property="og:title"]', "content", titulo);
    por('meta[name="twitter:title"]', "content", titulo);
    if (descricao) {
      por('meta[name="description"]', "content", descricao);
      por('meta[property="og:description"]', "content", descricao);
      por('meta[name="twitter:description"]', "content", descricao);
    }
    if (imagem) {
      por('meta[property="og:image"]', "content", imagem);
      por('meta[name="twitter:image"]', "content", imagem);
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
        <Cortina fase={fase} rotulo={rotulo} />
        <Cursor />
        <Nav sobreEscuro={sobreEscuro} ir={ir} rota={rota} />
        <main>
          {rota.tipo === "home" ? <Home ir={ir} />
            : rota.tipo === "processo" ? <Processo ir={ir} />
            : rota.tipo === "sobre" ? <Sobre ir={ir} />
            : rota.tipo === "blog" ? <Blog ir={ir} />
            : rota.tipo === "post" ? <Post slug={rota.slug} ir={ir} />
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

/* O marco mais pesado da tela de carregamento (0.55) é este: o app montou.
   Um quadro depois do render, para o aviso sair quando a primeira pintura já
   aconteceu e não quando o React só prometeu que vai acontecer. Ver
   site/decolagem.js. */
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    if (typeof window.__v2Pronto === "function") window.__v2Pronto();
  });
});
