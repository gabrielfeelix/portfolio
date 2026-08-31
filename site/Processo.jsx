/* Página /processo da V2.
 *
 * Hero escuro preso, corpo narrativo claro, fecho escuro, grade de casos.
 * O corpo inteiro mora em site/ProcessoNarrativa.jsx, e o porquê de ele ser
 * uma narrativa em vez de uma lista de seis passos está documentado lá.
 *
 * O que saiu daqui em 30/08, e não deve voltar sem o Gabriel pedir:
 *   `ABERTURA`   afirmava "seis passos, na mesma ordem, em todo projeto",
 *                que é o contrário do que ele faz;
 *   `MOVIMENTOS` + `CapaCapitulo`, as três chapas escuras de meia tela que
 *                alternavam com dois passos de texto cada;
 *   `PROVAS`     o mapa de figura por passo, hoje distribuído por batida
 *                narrativa em ProcessoNarrativa.jsx;
 *   `Relance`    o índice dos seis passos na margem, que duplicava o
 *                registro que o hero já imprime no pé.
 *
 * O hero não foi tocado: ele e a `Lamina` são de 29/08 e estão aprovados.
 */

import React from "react";
import { m as motion } from "motion/react";
import { useRise, useMaskLine, useCobertura } from "./motion.js";
import { Label, Pill } from "./Shell.jsx";
import { GradeCasos, Lamina } from "./Kit.jsx";
import { CONTATO } from "./content.js";
import { t } from "./i18n.js";
import { Narrativa } from "./ProcessoNarrativa.jsx";

/* ------------------------------------------------------------------ copy */

/* O hero, reescrito em 30/08 a pedido do Gabriel. O que estava aqui vinha
   verbatim de volume/Processo.jsx e vendia PRAZO: "Do objetivo ao protótipo,
   em dias." Palavras dele: "eu quero ter qualidade não velocidade... meu forte
   não é ficar fazendo tudo pra ontem".

   Além do tom, havia um defeito de substância: o hero anunciava SEIS PASSOS
   numa ordem fixa (o `v2-proc-registro`, que saiu junto) e o corpo da página
   existe para argumentar exatamente o contrário — que o caminho muda com o
   problema. O hero prometia uma lista que a página não entrega.

   A frase nova diz o que a página defende, que é julgamento, e não repete
   nenhum título do corpo: "o tamanho da pesquisa acompanha o preço de errar" é
   o bloco RISCO e "alguém que vai usar mexe na tela antes de eu fechar" é o
   NUNCA. Se o hero dissesse qualquer um dos dois, o leitor leria a mesma frase
   duas vezes em meia rolagem. */
const HERO = {
  olho: t("O método", "The method"),
  linha1: t("Meu processo muda.", "My process changes."),
  linha2: t("O critério não.", "My criteria do not."),
  premissa: t("O caminho é outro a cada projeto. Escolher qual deles rodar é a decisão que eu tomo antes de abrir o Figma.",
              "The path is different on every project. Choosing which one to run is the decision I make before opening Figma."),
};

/* volume/Processo.jsx · `.proc-msg`.
   A frase inteira lá é "Protótipo vira produto. Eu vou junto até o ar." A
   primeira sentença saiu: o passo 06 já diz "Protótipo vira produto no ar" uma
   tela acima, e as duas juntas repetiam seis palavras em meia rolagem. O que
   sobrou é a metade que o passo 06 NÃO diz. */
const FECHO = [t("Eu vou junto", "I stay with it"), t("até o ar.", "all the way to live.")];

/* ------------------------------------------------------------------ hero */

/* O mesmo hero preso e coberto da home e da página de caso, agora COM capa.
 *
 * A capa é a mesa do método no escuro: o tablet com a matriz CSD acesa, as
 * folhas de pesquisa atrás e o lápis vermelho. Não é foto de banco e não
 * afirma nada que não aconteceu — não tem gente, não tem mão, e a matriz é
 * bloco de cor, não interface legível. Foi o terceiro caminho tentado: um
 * curso de voo desenhado (recusado, "nada a ver") e um deserto (recusado,
 * literal demais) vieram antes. Não reconstruir nenhum dos dois.
 *
 * A arte é 2,33:1 e o hero é altura de viewport, então a proporção varia de
 * 2,36 em 2560x1080 até 0,44 no celular. Por isso `object-position` muda por
 * largura em processo.css: o que não pode sair do quadro é o tablet, e o que
 * sobra para o texto é o preto da esquerda, que o `cover` come primeiro.
 *
 * Sem `v2-halo`: o halo vermelho da home brigava com a luz quente que já vem
 * de cima à direita na própria arte. O grão fica, que é o que costura foto ao
 * resto do site.
 */
function ProcessoHero() {
  const linha = useMaskLine();
  const capa = useCobertura();

  return (
    <section className="v2-hero v2-proc-hero v2-grao" data-escuro="1" ref={capa.ref}>
      <div className="v2-hero-capa" aria-hidden="true">
        <img
          src="/volume/assets/processo/hero.webp"
          srcSet="/volume/assets/processo/hero-min.webp 1100w, /volume/assets/processo/hero.webp 1915w"
          sizes="100vw"
          alt=""
          decoding="async"
          fetchPriority="high"
        />
      </div>
      <span className="v2-hero-veu v2-proc-hero-veu" aria-hidden="true" />

      <motion.div className="v2-wrap v2-hero-in" style={capa.style}>
        <motion.div className="v2-hero-topo" {...linha(0)}>
          <p className="v2-hero-papel">{HERO.olho}</p>
          <p className="v2-hero-papel">©26</p>
        </motion.div>

        <div className="v2-proc-hero-baixo">
          <h1 className="v2-hero-h v2-proc-hero-h">
            <span className="v2-hero-linha"><motion.span {...linha(1)}>{HERO.linha1}</motion.span></span>
            <span className="v2-hero-linha"><motion.span {...linha(2)}>{HERO.linha2}</motion.span></span>
          </h1>

          <motion.p className="v2-proc-premissa" {...linha(3)}>{HERO.premissa}</motion.p>

        </div>
      </motion.div>
    </section>
  );
}

/* --------------------------------------------------------------- fecho */

/* A mesma chapa escura que fecha a página de caso no "O que eu aprendi": duas
   páginas internas terminando na mesma superfície, e depois dela a grade clara
   de casos, para o pé não empilhar dois escuros com o rodapé. */
function Fecho() {
  const rise = useRise();
  return (
    <section className="v2-aprendi v2-grao v2-proc-fecho" data-escuro-corpo="1">
      <div className="v2-wrap">
        <div className="v2-caso-duas">
          <Label>{t("No fim", "In the end")}</Label>
          <div className="v2-caso-coluna">
            <motion.p className="v2-proc-fecho-p" {...rise(0)}>
              {FECHO[0]} <span className="v2-proc-fecho-forte">{FECHO[1]}</span>
            </motion.p>
            <motion.div className="v2-caso-pills" {...rise(1)}>
              <Pill href={CONTATO().whatsapp.href} escuro externo>{t("Falar comigo", "Let's talk")}</Pill>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- página */

export default function Processo({ ir }) {
  return (
    <>
      <ProcessoHero />
      {/* Sem CampoDeVoo, ao contrário das outras páginas: aqui o avião
          vermelho é o cursor dos dois desenhos de Double Diamond, e ter um
          segundo avião cruzando o fundo ao mesmo tempo confundia qual dos
          dois o leitor deveria seguir. A partitura "processo" continua em
          motion.js caso ele volte. */}
      <div className="v2-corpo-claro v2-corpo-lamina" data-clara="1">
        <Lamina />

        <Narrativa />

        <Fecho />
        <GradeCasos cromo={t("Continue", "Keep going")} titulo={t("Os projetos", "The projects")} ir={ir} />
      </div>
    </>
  );
}

