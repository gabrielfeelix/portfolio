/* Consent Mode v2 e o banner de medição do portfólio.
 *
 * Carrega SEM async nem defer e ANTES do gtag, de propósito: o
 * gtag('consent','default') precisa chegar antes de qualquer tag disparar.
 * Depois do gtag, o GA4 já teria rodado uma vez sem consentimento — que é
 * exatamente o que este arquivo existe para impedir. A ordem é montada em
 * analyticsSnippet(), em build.mjs.
 *
 * Default por região:
 *   EEE + Reino Unido + Suíça -> negado até aceitarem (o GDPR exige antes)
 *   resto, Brasil incluído    -> concedido, com recusa a um clique
 *
 * Não é descuido com o Brasil. A LGPD não exige consentimento prévio para
 * medição de audiência; exige base legal, transparência e uma saída fácil.
 * Negar por padrão aqui zeraria o dado de quem simplesmente ignora o banner,
 * sem ganho real de privacidade para ninguém. O que a lei pede está aqui: o
 * banner diz o que é medido e por quem, e "Recusar" tem exatamente o mesmo
 * peso visual de "Aceitar" — sem botão apagado, sem recusa escondida em
 * segundo nível.
 *
 * O Clarity é tratado diferente do GA4, e essa é a parte que erra fácil. Ele
 * não entende o Consent Mode do Google: obedecer `analytics_storage` é coisa
 * de tag do Google. Como o Clarity GRAVA A SESSÃO — movimento de mouse,
 * clique, rolagem, o que é dado bem mais sensível que uma contagem de página
 * — ele não é carregado até haver consentimento. Recusou, o script nunca
 * entra na página; não é "entra e não persiste".
 */
(function () {
  var CHAVE = "gfb_consent";
  var EEE = ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU",
             "IS","IE","IT","LV","LI","LT","LU","MT","NL","NO","PL","PT","RO",
             "SK","SI","ES","SE","GB","CH"];

  /* O idioma sai do caminho, e não do i18n do site: este arquivo roda antes de
     volume/i18n.jsx existir. A regra é a mesma de lá — `/en` e `/en/...` são
     inglês, todo o resto é português. */
  var EN = (function () {
    try {
      var p = window.location.pathname;
      return p === "/en" || p.indexOf("/en/") === 0;
    } catch (e) { return false; }
  })();
  function t(pt, en) { return EN ? en : pt; }

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  function sinais(v) {
    return {
      ad_storage: v, ad_user_data: v, ad_personalization: v,
      analytics_storage: v, functionality_storage: v,
      personalization_storage: v, security_storage: "granted"
    };
  }

  var escolha = null;
  try { escolha = localStorage.getItem(CHAVE); } catch (e) { /* modo restrito */ }

  if (escolha === "granted" || escolha === "denied") {
    gtag("consent", "default", sinais(escolha));
  } else {
    /* Dois defaults: o primeiro nega e vale só para a lista de regiões, o
       segundo concede e pega o resto do mundo. É a forma que o Consent Mode
       aceita para ter regra por região sem precisar saber de onde a pessoa é. */
    var negado = sinais("denied");
    negado.region = EEE;
    gtag("consent", "default", negado);
    gtag("consent", "default", sinais("granted"));
  }
  gtag("set", "ads_data_redaction", escolha !== "granted");

  /* O Clarity só entra aqui, e só com consentimento explícito. O ID chega do
     build (env CLARITY_ID); sem ele esta função não faz nada, que é o estado
     do site enquanto o projeto do Clarity não existir. */
  function carregarClarity() {
    var id = window.__CLARITY_ID;
    if (!id || window.clarity) return;
    (function (c, l, a, r, i, t2, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t2 = l.createElement(r); t2.async = 1; t2.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t2, y);
    })(window, document, "clarity", "script", id);
  }

  /* Sem escolha registrada, o Brasil já está concedido pelo default acima, e o
     Clarity acompanha. Quem está no EEE cai no `denied` e não carrega nada até
     clicar. */
  function permitidoAgora() {
    if (escolha === "granted") return true;
    if (escolha === "denied") return false;
    return !regiaoRestrita();
  }

  /* Aproximação de região pelo fuso, sem pedir nada a serviço externo: chamar
     uma API de geolocalização para decidir sobre privacidade seria entregar o
     IP de todo visitante a um terceiro justamente para protegê-lo. O fuso erra
     em casos de borda (VPN, viagem), e o erro é para o lado seguro: na dúvida,
     Europa entra na regra mais restritiva. */
  function regiaoRestrita() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      return /^Europe\//.test(tz) || tz === "Atlantic/Canary" || tz === "Atlantic/Madeira";
    } catch (e) { return false; }
  }

  if (permitidoAgora()) carregarClarity();

  function decidir(v) {
    escolha = v;
    try { localStorage.setItem(CHAVE, v); } catch (e) { /* só esta sessão */ }
    gtag("consent", "update", sinais(v));

    if (v === "granted") {
      carregarClarity();
    } else {
      /* Recusar tem de PARAR o que já está rodando, e não só impedir o
         próximo carregamento. No Brasil o default é concedido, então quando o
         banner aparece o Clarity já está gravando há alguns segundos: sem esta
         parte, "Recusar" apenas prometia parar e deixava a gravação correndo
         até o fim da visita. `stop` encerra a sessão em andamento e `consent`
         false o impede de persistir. */
      if (window.clarity) {
        try { window.clarity("consent", false); } catch (e) {}
        try { window.clarity("stop"); } catch (e) {}
      }
      apagarCookies();
    }

    var el = document.getElementById("gfb-consent");
    if (el) el.remove();
  }

  /* Os cookies que já foram gravados antes da recusa saem junto. Deixá-los é
     manter identificador de quem acabou de pedir para não ser identificado.
     `_ga*` é do Analytics, `_clck` e `_clsk` são do Clarity. */
  function apagarCookies() {
    try {
      var host = location.hostname;
      var dominios = [host, "." + host];
      var raiz = host.split(".").slice(-3).join(".");
      if (raiz !== host) dominios.push("." + raiz);
      document.cookie.split(";").forEach(function (c) {
        var nome = c.split("=")[0].trim();
        if (!/^(_ga|_gid|_gat|_clck|_clsk)/.test(nome)) return;
        dominios.forEach(function (d) {
          document.cookie = nome + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" + d;
        });
        document.cookie = nome + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      });
    } catch (e) { /* navegador em modo restrito */ }
  }

  /* Revogar precisa ser tão fácil quanto consentir. Chamado pelo link do
     rodapé; sem isto, quem escolheu uma vez ficaria preso à escolha. */
  window.abrirConsentimento = function () {
    try { localStorage.removeItem(CHAVE); } catch (e) {}
    escolha = null;
    montar();
  };

  function montar() {
    if (document.getElementById("gfb-consent")) return;

    var css = document.createElement("style");
    css.textContent =
      /* z-index 1200, e o número é escolhido, não chutado.
         O site esconde o ponteiro do sistema (`cursor:none` em tudo, por
         html[data-vento]) e desenha o próprio cursor, o `.v2-vento`, em 1300.
         Com o banner em 9998 ele ficava ACIMA do vento: o cursor desenhado
         sumia atrás da caixa e o do sistema já estava escondido, então não
         havia cursor nenhum em cima do banner — dava a impressão exata de que
         o mouse passava por baixo, e mirar o botão virava adivinhação.
         1200 põe o banner acima de tudo do site (a cortina e o carregamento
         são 900) e abaixo do cursor, que é o único que precisa ficar por cima
         de tudo. */
      '#gfb-consent{position:fixed;left:20px;bottom:20px;z-index:1200;width:min(380px,calc(100vw - 40px));' +
      'background:var(--v2-ink,#0B0B0C);color:#fff;border-radius:14px;padding:20px;' +
      'font:400 14px/1.55 var(--v2-font,"Switzer",system-ui,sans-serif);' +
      'box-shadow:0 18px 48px rgba(0,0,0,.28);' +
      'animation:gfb-consent-entra .32s cubic-bezier(.16,1,.3,1) both}' +
      '@keyframes gfb-consent-entra{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}' +
      '@media (prefers-reduced-motion:reduce){#gfb-consent{animation:none}}' +
      '#gfb-consent .rotulo{font:500 10px/1 var(--v2-mono,"Geist Mono",monospace);' +
      'letter-spacing:.14em;text-transform:uppercase;color:#8A8A90;margin:0 0 10px}' +
      '#gfb-consent p{margin:0 0 14px;color:#E8E8EA}' +
      '#gfb-consent .det{margin:0 0 14px;font-size:13px;color:#A0A0A6}' +
      '#gfb-consent summary{cursor:pointer;color:#A0A0A6;font-size:13px;' +
      'text-underline-offset:3px;text-decoration:underline}' +
      '#gfb-consent summary::marker{content:""}' +
      '#gfb-consent ul{margin:10px 0 0;padding-left:16px}' +
      '#gfb-consent li{margin:0 0 5px}' +
      '#gfb-consent .linha{display:flex;gap:8px;margin-top:4px}' +
      /* Os dois botões têm a MESMA área e o mesmo peso de fonte. A diferença é
         só a cor de fundo: recusa apagada é escurecimento de escolha, e é o
         que a LGPD chama de consentimento não livre. */
      '#gfb-consent button{flex:1 1 0;cursor:pointer;border:0;border-radius:9px;padding:11px 14px;' +
      'font:600 14px var(--v2-font,"Switzer",system-ui,sans-serif);transition:filter .18s}' +
      '#gfb-consent button:hover{filter:brightness(1.12)}' +
      '#gfb-consent button:focus-visible{outline:2px solid #fff;outline-offset:2px}' +
      /* Branco no "Aceitar", e não o accent, por dois motivos que apontam para
         o mesmo lado. O tokens.css é explícito que o vermelho é grafismo, não
         fundo de texto pequeno — branco sobre accent dá 4,51:1, que raspa o AA.
         E um botão vermelho vibrante contra um cinza translúcido desequilibra
         a escolha mesmo com os dois do mesmo tamanho: peso visual também é
         desenho de consentimento. Branco sólido contra contorno branco mantém
         os dois legíveis e comparáveis. */
      '#gfb-consent .sim{background:#fff;color:var(--v2-ink,#0B0B0C)}' +
      '#gfb-consent .nao{background:transparent;color:#fff;box-shadow:0 0 0 1px rgba(255,255,255,.34) inset}';
    document.head.appendChild(css);

    var b = document.createElement("div");
    b.id = "gfb-consent";
    b.setAttribute("role", "dialog");
    b.setAttribute("aria-label", t("Preferências de medição", "Measurement preferences"));
    b.innerHTML =
      '<p class="rotulo">' + t("Medição", "Measurement") + '</p>' +
      '<p>' + t(
        "Meço como as pessoas usam este site para saber o que melhorar. Recusar não tira nada daqui.",
        "I measure how people use this site so I know what to improve. Refusing takes nothing away from it."
      ) + '</p>' +
      '<details class="det"><summary>' + t("O que é medido", "What gets measured") + '</summary>' +
      '<ul>' +
      '<li>' + t("Google Analytics: páginas vistas, origem da visita, tipo de aparelho.",
                 "Google Analytics: pages viewed, where the visit came from, device type.") + '</li>' +
      '<li>' + t("Microsoft Clarity: gravação anônima da sessão, com rolagem e cliques.",
                 "Microsoft Clarity: anonymous session recording, including scrolling and clicks.") + '</li>' +
      '<li>' + t("Nada é vendido, e não há anúncio nenhum neste site.",
                 "Nothing is sold, and there are no ads on this site.") + '</li>' +
      '</ul></details>' +
      '<div class="linha">' +
      '<button class="sim" id="gfb-sim">' + t("Aceitar", "Accept") + '</button>' +
      '<button class="nao" id="gfb-nao">' + t("Recusar", "Refuse") + '</button>' +
      '</div>';
    document.body.appendChild(b);
    document.getElementById("gfb-sim").onclick = function () { decidir("granted"); };
    document.getElementById("gfb-nao").onclick = function () { decidir("denied"); };
  }

  /* O banner NÃO aparece na hero.
   *
   * Pedido do Gabriel, e é a decisão certa: a home abre com a tela de
   * decolagem e a capa em vídeo, e uma caixa preta subindo por cima disso
   * queima a primeira impressão inteira — que é justamente a coisa que um
   * portfólio existe para causar.
   *
   * Adiar o banner não adia proteção nenhuma, e vale conferir o raciocínio:
   * no Brasil a medição já está concedida pelo default, então o banner é a
   * SAÍDA, não a porta — mostrar depois só muda quando a saída aparece. Na
   * Europa o default é negado e nada carrega até alguém clicar, então adiar
   * apenas adia o pedido, nunca a coleta. Nos dois casos o lado seguro.
   *
   * Dois gatilhos, o que vier primeiro:
   *   - passar da primeira dobra (85% da altura da janela);
   *   - 25 segundos de página aberta.
   * O segundo existe porque quem nunca rola também precisa poder recusar: sem
   * ele, bastava ficar parado na home para nunca receber a escolha, e uma
   * saída que não aparece não é saída. */
  function agendar() {
    var mostrado = false;
    var limite = Math.round(window.innerHeight * 0.85);

    function mostrar() {
      if (mostrado) return;
      mostrado = true;
      window.removeEventListener("scroll", aoRolar);
      clearTimeout(relogio);
      montar();
    }
    function aoRolar() {
      if ((window.scrollY || window.pageYOffset || 0) > limite) mostrar();
    }

    var relogio = setTimeout(mostrar, 25000);
    window.addEventListener("scroll", aoRolar, { passive: true });
    aoRolar(); // quem chega com a página já rolada (voltou de outra rota)
  }

  if (escolha !== "granted" && escolha !== "denied") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", agendar);
    } else {
      agendar();
    }
  }
})();
