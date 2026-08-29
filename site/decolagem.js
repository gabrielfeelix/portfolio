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

  var rastro = tela.querySelector(".v2-dec-rastro");
  var barra = tela.querySelector(".v2-dec-barra i");

  var p = 0;          // o que está desenhado
  var saindo = false;
  var ultimo = 0;     // o instante do quadro anterior, para a conta por tempo

  var pinta = function (v) {
    /* O rastro cresce atrás do avião, que fica parado no centro. É a distância
       já voada: o avião não anda, o mundo é que passa por ele. */
    /* Duas leituras do mesmo número, e nenhuma delas é um número: o rastro
       atrás do avião, que é quanto já se voou, e o filete embaixo da frase,
       que é quanto falta. */
    var f = v.toFixed(4);
    if (rastro) rastro.style.setProperty("--p", f);
    if (barra) barra.style.setProperty("--p", f);
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
      /* `data-decolando` NÃO sai aqui, sai em `solta`.

         Ele é quem trava a rolagem, e tirá-lo no meio da animação devolve a
         barra de rolagem: a janela encolhe uns 15px, a página inteira e a
         própria tela de carregamento pulam de lado no meio do gesto. Era o
         "sobrando/faltando um pouquinho da tela" que o Gabriel viu no print.
         380ms de rolagem travada a mais não custam nada. */
      /* 380ms é a subida; a folga de 60 é para o último quadro dela existir */
      setTimeout(solta, 440);
    }, 460);
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
    /* Aproximação exponencial, por TEMPO e não por quadro.

       Era `p += (alvo - p) * 0.14` a cada requestAnimationFrame, o que amarra a
       velocidade do contador à taxa de quadros. Medido com a névoa borrada na
       tela: o rAF caiu para uns cinco quadros por segundo e o contador levava
       mais de três segundos e meio para chegar a 92 — a tela de carregamento
       tinha virado o motivo da espera.

       Com `1 - e^(-dt/TAU)` a curva é a mesma e o tempo até chegar é o mesmo em
       5fps ou em 120fps. TAU de 130ms dá a mesma sensação dos 14% a 60fps. */
    var dt = ultimo ? Math.min(120, t - ultimo) : 16;
    ultimo = t;
    p += (alvo - p) * (1 - Math.exp(-dt / 130));
    if (alvo >= 1 && p > 0.995) { sai(); return; }
    pinta(p);
    requestAnimationFrame(quadro);
  };

  requestAnimationFrame(quadro);
})();
