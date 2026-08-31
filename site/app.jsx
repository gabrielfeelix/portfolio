/* Raiz da V2.
 *
 * React vem do vendor UMD da V1; i18n e data.js publicam o conteúdo em window;
 * este arquivo lê tudo por content.js. Nada de texto é duplicado. */

import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { chapterById } from "./content.js";
import { Nav, Rodape } from "./Shell.jsx";
import { useScrollSuave, rolarPara } from "./motion.js";
import Home from "./Home.jsx";
import Caso from "./Case.jsx";
import Processo from "./Processo.jsx";
import Sobre from "./Sobre.jsx";
import Blog from "./Blog.jsx";
import Post from "./Post.jsx";
import { porSlug } from "./blog.js";
import { Cortina, useTravessia } from "./Travessia.jsx";
import { decodeDeChegada, trocarIdioma } from "./idioma.js";
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

/* Encurta uma descrição sem cortar palavra no meio. Prefere terminar numa
   frase inteira; se nem a primeira frase couber, corta na última palavra e
   fecha com reticências. */
function encurtar(txt, max) {
  const s = String(txt || "").trim();
  if (s.length <= max) return s;
  const corte = s.slice(0, max + 1);
  const frase = Math.max(corte.lastIndexOf(". "), corte.lastIndexOf("? "), corte.lastIndexOf("! "));
  if (frase > max * 0.5) return s.slice(0, frase + 1);
  const palavra = corte.lastIndexOf(" ");
  return s.slice(0, palavra > 0 ? palavra : max).trimEnd() + "…";
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
    const onPop = () => atravessar(() => setRota(rotaAtual()));
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
      if (alvo) rolarPara(alvo);
      return;
    }

    /* Trocar de página, sim. A troca roda com a tela já coberta pela cortina;
       ver os tempos em Travessia.jsx. */
    atravessar(() => {
      window.history.pushState(null, "", href);
      setRota(rotaAtual());

      if (!ancora) {
        rolarPara(0, { imediato: true });
        return;
      }

      let quadros = 0;
      const busca = () => {
        const alvo = document.getElementById(ancora);
        if (alvo) {
          rolarPara(alvo, { imediato: true });
          return;
        }
        if (++quadros < 12) requestAnimationFrame(busca);
      };
      requestAnimationFrame(busca);
    });
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
  const { fase, atravessar } = useTravessia();
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
  /* Se esta carga é a chegada de uma troca de idioma, o texto que está na tela
     nasce embaralhado e se resolve no idioma novo. Toda a conta está em
     idioma.js; aqui só o gancho.

     Roda numa `useLayoutEffect` e não numa `useEffect` porque a diferença é o
     efeito inteiro: layout roda ANTES de o navegador pintar, então o primeiro
     quadro que a pessoa vê já é o embaralhado. Com `useEffect` a página pinta
     uma vez com o texto final e só então embaralha — ou seja, a pessoa lê a
     resposta antes da pergunta.

     Sem dependências e sem limpeza: acontece uma vez por carga, e a carga
     inteira dura menos que o efeito não duraria. */
  useLayoutEffect(() => { decodeDeChegada(); }, []);

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
    /* A descrição da home é o padrão, não `null`: como isto roda a cada troca
       de rota numa SPA, sair de um caso para a home com `null` deixava a
       description do caso na página anterior colada na home. Toda rota agora
       escreve a sua, e quem não tem uma própria cai aqui de volta. */
    let descricao = "Portfólio de Gabriel Felix Barbosa, UX/Product Designer. Quatro projetos abertos por inteiro: o problema, o que a pesquisa mostrou, o que foi cortado e o que sobrou no ar.";
    let imagem = null;
    let tipoOg = "website";

    if (rota.tipo === "caso") {
      const cap = chapterById(rota.id);
      titulo = `${(cap || {}).title || rota.id} · ${base}`;
      caminho = `/case/${rota.id}`;
      /* Cada caso se descreve com o que ele tem de próprio.
       *
       * Até 30/08 só /blog e /blog/<slug> definiam descrição, então os quatro
       * casos, /processo e /sobre serviam a description da home: quem mandava
       * /case/pcyes no LinkedIn ou no WhatsApp gerava prévia de catálogo, e o
       * caso mais forte do site se anunciava como página inicial.
       *
       * `descriptor` diz o que é, `premise` é a frase de abertura do caso, e
       * `fact` é o resultado que o Resumo já mostra. Nada escrito novo: é o
       * mesmo texto que está na tela. */
      if (cap) {
        const cabeca = [cap.descriptor, cap.project].filter(Boolean).join(" · ");
        const corpo = [cap.premise, cap.fact].filter(Boolean).join(" ");
        /* Corte em 200: acima disso a prévia trunca no meio de uma palavra e
           a última frase, que é onde mora o resultado, nunca chega. Corta na
           última fronteira de frase que couber, e só cai no reticências se a
           primeira frase sozinha já passar. */
        descricao = encurtar(`${cabeca}. ${corpo}`.replace(/\s+/g, " ").trim(), 200);
      }
    } else if (rota.tipo === "processo") {
      titulo = `Processo · ${base}`;
      caminho = "/processo";
      descricao = "Meu processo muda, o critério não. Os dois caminhos que eu rodo, o que decide o tamanho da pesquisa, e a vez em que o dado provou que a minha aposta estava errada.";
    } else if (rota.tipo === "sobre") {
      titulo = `Sobre · ${base}`;
      caminho = "/sobre";
      descricao = "Larguei Direito por causa de um e-commerce que montei na pandemia. Hoje sou o designer de produto de uma distribuidora nacional, e desenho e implemento quando o prazo aperta.";
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

    /* Endereço que não existe: título genérico, fora do índice, e canonical
       apontando para a home em vez de para o próprio caminho errado.
       Vale para /qualquer-coisa e para /case/<id> de caso que não existe. */
    const achou = rota.tipo !== "404" && !(rota.tipo === "caso" && !chapterById(rota.id))
      && !(rota.tipo === "post" && !porSlug(rota.slug));
    if (!achou) {
      titulo = `Página não encontrada · ${base}`;
      caminho = "/";
      descricao = "Esse endereço não existe mais ou nunca existiu.";
    }

    document.title = titulo;
    const url = window.location.origin + caminho;

    const por = (sel, attr, valor) => {
      if (valor == null) return;
      const el = document.querySelector(sel);
      if (el) el.setAttribute(attr, valor);
    };

    por('meta[name="robots"]', "content", achou ? "index, follow" : "noindex, follow");
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
        <Cortina fase={fase} />
        <Cursor />
        <Nav sobreEscuro={sobreEscuro} ir={ir} rota={rota} trocarIdioma={trocarIdioma} />
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
