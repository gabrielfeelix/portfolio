/* O kit da V2.
 *
 * Por que ele existe: a home recusada foi montada seção por seção, cada uma
 * resolvendo o próprio problema, e o resultado leu como coleção de componentes
 * em vez de página. docs/ANALISE-REFS.md mede por que as referências não leem
 * assim. A gramática vem antes das seções, e mora aqui.
 *
 * Regra de uso: nenhuma dobra da home desenha cromo, título ou mídia por conta
 * própria. Se uma dobra precisa de algo que o kit não tem, o componente entra
 * aqui primeiro. É isso que faz a página parecer um sistema e não um sortido.
 */

import React from "react";
import { motion } from "motion/react";
import { useRevelar, useCortina, useParallax, useContador } from "./motion.js";

/* ------------------------------------------------------------------ cromo */

/* M1 da análise: a camada que costura a página.
 *
 * Toda dobra abre com a mesma tripla, no mesmo lugar, na mono: índice, nome,
 * carimbo. viper serve `Featured Works` `(CQ® — 03)` `©2025`; bungee serve
 * `( _01 )` e `( _©25 )`; porto serve `01` `//Approach` `Since 2000`.
 *
 * Ela não informa quase nada, e é justamente por isso que funciona: o leitor
 * para de ler o conteúdo dela em duas seções e passa a usá-la como régua de
 * "mudei de seção", que era a reclamação do Gabriel. */
export function Cromo({ n, nome, carimbo, escuro = false }) {
  return (
    <p className="v2-cromo" data-escuro={escuro ? "1" : undefined}>
      <span className="v2-cromo-n">( _{n} )</span>
      <span className="v2-cromo-nome">{nome}</span>
      {carimbo ? <span className="v2-cromo-carimbo">{carimbo}</span> : null}
    </p>
  );
}

/* Relógio vivo. viper, bungee e porto têm o mesmo: bungee marca `( 00:00:00
   NY )`, porto marca `LOCAL/ 13:39:59`. É o enfeite de personalidade mais
   barato que existe (M6) e o único elemento da página que prova, sem dizer,
   que tem alguém do outro lado. Maringá vem de volume/data.jsx. */
export function Relogio({ cidade = "MARINGÁ" }) {
  const [hora, setHora] = React.useState(() => new Date());
  React.useEffect(() => {
    const t = setInterval(() => setHora(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const dois = (n) => String(n).padStart(2, "0");
  return (
    <p className="v2-relogio">
      ( {dois(hora.getHours())}:{dois(hora.getMinutes())}:{dois(hora.getSeconds())}
      {"  "}
      {cidade} )
    </p>
  );
}

/* ---------------------------------------------------------------- estrutura */

/* A dobra. Já traz o cromo, a largura e o fundo: nenhuma seção da home escreve
   `<section>` na mão, senão a moldura escapa em uma delas e o sistema quebra. */
export function Dobra({ id, n, nome, carimbo, escuro = false, largo = false, children, ...resto }) {
  return (
    <section
      className="v2-dobra"
      id={id}
      data-escuro={escuro ? "1" : undefined}
      data-largo={largo ? "1" : undefined}
      {...resto}
    >
      <div className="v2-dobra-in">
        {n ? <Cromo n={n} nome={nome} carimbo={carimbo} escuro={escuro} /> : null}
        {children}
      </div>
    </section>
  );
}

/* Título de dobra. Um degrau só, 104px, com a marca opcional grudada como as
   referências fazem: `Feartured Portfolio®`, `Bungee®`, `greyola©`. A marca é
   grafismo, então sai do fluxo de leitura por aria-hidden. */
export function Titulo({ children, marca, className = "", i = 0 }) {
  const cortina = useCortina();
  return (
    <span className={`v2-titulo-janela ${className}`} ref={cortina.ref}>
      <motion.h2 className="v2-titulo" {...cortina.props(i)}>
        {children}
        {marca ? <span className="v2-titulo-marca" aria-hidden="true">{marca}</span> : null}
      </motion.h2>
    </span>
  );
}

/* Título de duas cores: linha 1 cinza, linha 2 preta.

   É o componente que a launchfolio usa em TODA seção e que a tabfolio repete
   três vezes na página de sobre ("What I'm into" / "right now"). Custa uma
   span e resolve sozinho o que um título de uma cor só não faz: separa o
   assunto da afirmação sem pedir um segundo tamanho, que a escala proíbe.

   Fica no kit, e não na dobra, porque título é gramática: se cada dobra
   inventar a sua, a página volta a ser sortido. */
export function DuasCores({ fraca, forte }) {
  return (
    <>
      <span className="v2-titulo-fraco">{fraca}</span>
      {forte}
    </>
  );
}

/* M7: o cabeçalho de cinco partes que o Gabriel dissecou no viper.
 *
 *   olho pequeno → título com marca → lead de duas linhas → CTA → nota + prova
 *
 * As cinco existem em toda dobra pesada da referência, e é por isso que dobras
 * de conteúdo diferente parecem a mesma página. Partes opcionais somem sem
 * deixar buraco: o `gap` do flex resolve. */
export function Cabecalho({ olho, titulo, marca, lead, cta, nota, prova, empilhado = false, i = 0 }) {
  const revelar = useRevelar();
  return (
    <header className={`v2-cabecalho${empilhado ? " is-empilhado" : ""}`}>
      <div className="v2-cabecalho-esq">
        {olho ? <p className="v2-olho">{olho}</p> : null}
        <Titulo marca={marca} i={i}>{titulo}</Titulo>
      </div>
      <div className="v2-cabecalho-dir">
        {lead ? (
          <motion.p className="v2-lead" {...revelar(i + 1)}>{lead}</motion.p>
        ) : null}
        {cta ? <div className="v2-cabecalho-cta">{cta}</div> : null}
        {nota ? <p className="v2-cabecalho-nota">{nota}</p> : null}
        {prova ? <div className="v2-cabecalho-prova">{prova}</div> : null}
      </div>
    </header>
  );
}

/* A coluna presa: cabeçalho parado à esquerda, conteúdo rolando à direita.
 *
 * É o componente da launchfolio que estava no inventário de docs/HANDOFF-V2.md
 * e nunca tinha sido usado. Ele resolve uma coisa que lista nenhuma resolve: a
 * esquerda pode MUDAR de informação conforme a direita passa, e é isso que dá
 * a sensação de estar percorrendo alguma coisa em vez de rolar uma lista.
 *
 * O `top` da coluna presa desconta a nav, que é fixa: sem isso o bloco gruda
 * embaixo da barra e o título fica cortado pela metade. */
export function Presa({ esquerda, children }) {
  return (
    <div className="v2-presa">
      <div className="v2-presa-esq">{esquerda}</div>
      <div className="v2-presa-dir">{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------- mídia */

/* A FitaMidia (as colunas em arco do bungee) saiu em 28/08. O porquê está
   em Home.jsx, na função Passagem. */

/* A quebra de imagem do viper: `[SECTION] [IMG] [SECTION]`, largura total, sem
   uma palavra em cima. É o que dá respiro entre duas dobras pesadas e o que a
   home recusada não tinha, porque toda dobra dela começava e terminava no
   branco. Anda em parallax porque parada ela vira banner. */
export function Quebra({ src, video = false, alt = "", intensidade = 12 }) {
  const par = useParallax(intensidade);
  return (
    <figure className="v2-quebra" ref={par.ref}>
      <motion.div className="v2-quebra-in" style={par.style}>
        {video ? (
          <video src={src} autoPlay muted loop playsInline preload="metadata" aria-label={alt} />
        ) : (
          <img src={src} alt={alt} loading="lazy" />
        )}
      </motion.div>
    </figure>
  );
}

/* ------------------------------------------------------------------- dados */

/* O contador da viper e do porto, que o Gabriel chamou de MUITO FODA.
 *
 * O tamanho é o ponto: 128px. Em 56px, que era o da V2, o número lê como dado
 * de tabela; em 128 ele lê como afirmação e a dobra respira sozinha. */
export function Contador({ ate, sufixo = "", rotulo, nota }) {
  const { ref, valor } = useContador(ate);
  return (
    <div className="v2-contador" ref={ref}>
      <p className="v2-contador-n">
        {valor}
        {sufixo ? <span className="v2-contador-suf">{sufixo}</span> : null}
      </p>
      <p className="v2-contador-rot">{rotulo}</p>
      {nota ? <p className="v2-contador-nota">{nota}</p> : null}
    </div>
  );
}

/* Régua fina de dobra. Substitui a caixa: onde a V2 punha um painel cinza para
   separar, entra uma linha de 1px e o cromo em cima dela. */
export function Linha() {
  return <hr className="v2-linha" aria-hidden="true" />;
}
