/* O motor da tela de carregamento.

   Roda embutido no <head>, antes de qualquer bundle, pelo mesmo motivo que o
   desenho dela é HTML servido: uma tela de carregamento que depende do
   carregamento chega tarde. Nada aqui usa React, módulo ou sintaxe que peça
   transpilação — é ES5 de propósito.

   O PROGRESSO É REAL, e essa era a pergunta do Gabriel: "como a gente vai
   mostrar que está carregando, de uma forma criativa". A criatividade é o
   avião dando a volta; a honestidade é o número. Ele sai de três marcos de
   verdade, com peso:

     0.55  o app montou       (site/app.jsx chama window.__v2Pronto)
     0.15  as fontes prontas  (document.fonts.ready)
     0.30  o load da janela   (imagens e pôster do vídeo do hero)

   Sobre isso há um PISO e um TETO, e os dois existem por motivos opostos:

   - PISO: numa conexão rápida os três marcos fecham em 200ms e a tela seria um
     estouro de vermelho, que é pior que não ter tela nenhuma. O progresso não
     pode andar mais rápido que o piso, então a volta do avião sempre acontece.
   - TETO: se um dos marcos nunca fechar — uma fonte que não responde, um
     arquivo que trava —, ninguém fica preso olhando um avião. Passou do teto,
     entra assim mesmo.

   Como a barra é `min(real, tempo)`, ela nunca mente para mais: chegar a 100
   exige que as três coisas tenham terminado E que o piso tenha passado. */
(function () {
  var raiz = document.documentElement;
  var tela = document.getElementById("v2-decolagem");
  if (!tela) return;

  var solta = function () {
    raiz.removeAttribute("data-decolando");
    if (tela && tela.parentNode) tela.parentNode.removeChild(tela);
  };

  /* Rede de segurança, registrada ANTES de qualquer coisa que possa falhar.

     A tela trava a rolagem enquanto está no ar. Se este script quebrar no meio
     — um navegador sem `document.fonts`, uma extensão que atropela o rAF —,
     sem isto o site fica atrás de um vermelho para sempre, e o modo de falha de
     uma tela de carregamento não pode ser "o site não abre". */
  setTimeout(solta, 8000);

  /* Quem pediu para nada se mover não vê a decolagem. O CSS já esconde a tela;
     aqui ela sai do DOM e o scroll é devolvido, senão a página ficaria travada
     atrás de um elemento invisível.

     `?semdecolagem` faz o mesmo, e existe para a instrumentação: as ferramentas
     de tools/ medem o DOM da página servida, e uma tela cheia de vermelho por
     dois segundos entra em todo print e em toda medida de primeira dobra. */
  var quieto = false;
  try {
    quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      || window.location.search.indexOf("semdecolagem") > -1;
  } catch (e) {}
  if (quieto) { solta(); return; }

  var PISO = 1100;    // ms: abaixo disso a tela é um flash
  var TETO = 4200;    // ms: acima disso ninguém espera mais
  var CIRC = 464.96;  // 2 * pi * 74, o raio da órbita no viewBox

  var t0 = (window.performance && performance.now) ? performance.now() : Date.now();
  var agora = function () {
    return ((window.performance && performance.now) ? performance.now() : Date.now()) - t0;
  };

  var marcos = { app: 0, fontes: 0, carga: 0 };
  var PESO = { app: 0.55, fontes: 0.15, carga: 0.30 };

  var fecha = function (nome) {
    return function () { marcos[nome] = 1; };
  };

  window.__v2Pronto = fecha("app");

  if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
    document.fonts.ready.then(fecha("fontes"), fecha("fontes"));
  } else {
    marcos.fontes = 1;
  }

  if (document.readyState === "complete") marcos.carga = 1;
  else window.addEventListener("load", fecha("carga"));

  var num = document.getElementById("v2-dec-n");
  var rastro = tela.querySelector(".v2-dec-rastro");
  var nave = tela.querySelector(".v2-dec-nave");

  var p = 0;         // o que está desenhado
  var saindo = false;

  var pinta = function (v) {
    var d = Math.round(v * 100);
    if (num) num.textContent = d >= 100 ? "100" : (d < 10 ? "00" : "0") + d;
    if (rastro) rastro.setAttribute("stroke-dashoffset", String(CIRC * (1 - v)));
    /* Uma volta exata, e não mais que isso: o avião anda os mesmos 360v graus
       que o rastro, então ele fica sempre na PONTA do próprio rastro. É essa
       coincidência que faz a peça ler como "o avião está desenhando o arco" em
       vez de "há um arco e há um avião". E em 100 ele volta ao topo, onde
       começou: a volta fecha. */
    if (nave) nave.style.transform = "rotate(" + (v * 360).toFixed(2) + "deg)";
  };

  /* A saída, nos dois tempos que o CSS descreve: a noite engole a tela, e a
     tela sai para cima com o corte na diagonal. O `data-pronto` no <html> é o
     gancho para o site aparecer já em movimento em vez de aparecer parado. */
  var sai = function () {
    if (saindo) return;
    saindo = true;
    pinta(1);
    tela.setAttribute("data-fase", "fim");
    setTimeout(function () {
      tela.setAttribute("data-fase", "fora");
      raiz.setAttribute("data-pronto", "1");
      raiz.removeAttribute("data-decolando");
      setTimeout(solta, 700);
    }, 520);
  };

  var quadro = function () {
    try { desenha(); } catch (e) { solta(); }
  };

  var desenha = function () {
    var t = agora();
    var real = marcos.app * PESO.app + marcos.fontes * PESO.fontes + marcos.carga * PESO.carga;
    var tempo = Math.min(1, t / PISO);
    var alvo = Math.min(real, tempo);
    if (t >= TETO) alvo = 1;
    /* Aproximação por fração fixa: o número sobe rápido quando está longe e
       encosta devagar, que é o que faz um contador parecer medindo alguma
       coisa em vez de rodando um relógio. */
    p += (alvo - p) * 0.14;
    if (alvo >= 1 && p > 0.995) { sai(); return; }
    pinta(p);
    requestAnimationFrame(quadro);
  };

  requestAnimationFrame(quadro);
})();
