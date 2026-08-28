/* =====================================================================
   VOLUME — i18n.jsx
   Loaded right after data.jsx. Detects the language (localStorage
   vol-lang, default pt), exposes LANG + t(pt, en), and, when EN, mutates
   the content globals IN PLACE (they are lexical consts shared across the
   classic scripts, so window-swapping wouldn't reach bare references).
   Toggle = save + reload: the swap must happen before first render.
   ===================================================================== */
const LANG = (() => {
  try { return localStorage.getItem("vol-lang") === "en" ? "en" : "pt"; } catch (e) { return "pt"; }
})();
function t(pt, en) { return LANG === "en" ? en : pt; }
function toggleLang() {
  try { localStorage.setItem("vol-lang", LANG === "en" ? "pt" : "en"); } catch (e) {}
  window.location.reload();
}

/* document chrome that lives outside React */
document.documentElement.lang = LANG === "en" ? "en" : "pt-BR";
if (LANG === "en") {
  const sk = document.querySelector(".skip-link");
  if (sk) sk.textContent = "Skip to content";
  const bl = document.querySelector("#boot .boot-label");
  if (bl && bl.firstChild) bl.firstChild.textContent = "Opening the volume";
}

/* ---- EN content: full mirrors of the authored PT copy ---------------- */
if (LANG === "en") {

  const CH = {
    pcyes: {
      domain: "E-COMMERCE", descriptor: "E-commerce redesign", title: "PCYES V2", project: "PCYES V2",
      premise: "A storefront that turned out beautiful and slow to buy from.",
      role: "UX/UI Designer, project owner",
      surface: "E-commerce · Magento",
      periodo: "6 months · release planned for October 2026",
      fact: "I argued against the brief with session recordings in hand, and the opposite direction is the one that got approved",
      tldr: { papel: "UX/UI Designer, project owner",
        oque: "A Magento hardware store, redesigned from the home page to the checkout.",
        resultado: "The direction opposite to the brief is the one that got approved. It goes live in October 2026" },
      /* o i18n SUBSTITUI o ramo inteiro (Object.assign raso), entao os
         numeros viajam junto: sem `desktop`/`mobile` aqui o grafico
         zerava em ingles, com build verde. */
      notaSuporte: {
        k: "Before we start",
        p: "This project was designed mobile first, and you will see phone screens along the way. But 7 out of every 10 visits to the store came from a computer, so the large exhibits in this chapter are desktop screenshots.",
        p2: "That is 116,530 desktop sessions against 50,352 on mobile, with an average order of R$ 663 against R$ 420. People who build their own PC compare spec sheets, keep several tabs open and decide on the big screen.",
        fonte: "Google Analytics 4 · Q2 2026 · 166,882 sessions",
        desktop: 70, mobile: 30,
        lDesk: "computer", lMob: "phone",
      },
      figuras: {
        abertura: { alt: "V1 home opening on a brand campaign, with the first product below the fold",
          legenda: "The V1 first fold: the campaign fills the screen and the first product only shows up after scrolling." },
        checkout: { alt: "V2 checkout with Pix, card, boleto and wallets visible before any scrolling",
          legenda: "The V2 checkout opens on the payment method. You know how you can pay before deciding whether to go on." },
        vitrine: { alt: "V2 storefront with filters on the left and a buy button on the product card",
          legenda: "In the storefront, buying no longer requires the product page: the button lives on the card, next to price and rating." },
        preco: { alt: "V2 product page with a sticky price column on the right",
          legenda: "On the product page, price and purchase stay pinned to the right. The decision doesn't depend on scrolling back up." },
        home: { alt: "V2 home with product carousel and promotion blocks",
          legenda: "The home now opens on product. The institutional blocks are still there, after the first buying carousel." },
        quickview: { alt: "Quick view open over the listing, with gallery, short spec sheet and buy button",
          legenda: "Quick view in the listing: judge the product, zoom the photo and buy without changing pages." },
        sku: { alt: "Internal tool with the product form on the left and the generated HTML on the right",
          legenda: "The internal tool: the SKU form on one side, the finished formatted HTML on the other, right away." },
        skuFila: { alt: "Production line with the SKU queue and the five stages of each product",
          legenda: "The production line: each SKU runs through CRM, SEO, HTML generator, Page Builder and publishing, and the team sees which stage every product is in." },
        contraste: { alt: "V1 home going from a dark section into a white fold in the middle of the scroll",
          legenda: "The V1 alternated dark folds with a full white fold halfway down. Late at night, that jump in brightness is the part that tires the reader." },
        libras: { alt: "VLibras translator open over the V2 home, with the signing avatar beside the banner",
          legenda: "The Libras translator opens from the accessibility icon in the header and signs the page in use. The V1 had none: people whose first language is Libras were reading a site in a second language." },
        prevenda: { alt: "Pre-order product page with a reservation bar, delivery date and reservation price",
          legenda: "The pre-order shows how many reservations are gone, how many are left and when the product arrives." },
        sidecart: { alt: "Side cart open over the product page, with the gift bar and the order's points",
          legenda: "The side cart opens over the page. Adding an item stopped pulling people away from where they were." },
        points: { alt: "PCYES Points area with the rarity ladder and points balance",
          legenda: "PCYES Points: balance, tier ladder and how far the next one is, with no fine print buried anywhere." },
        mspCaminhos: { alt: "Build your PC entry screen with the three available paths",
          legenda: "The module's entrance asks one thing: do you already know what you want, want help, or want it ready." },
        mspJogos: { alt: "Quiz step with the grid of games to select",
          legenda: "People who don't know components pick by what they play. The recommendation comes from Valorant and Fortnite, not from socket and TDP." },
        mspProntas: { alt: "Grid of ready-made builds split by use, with price and discount",
          legenda: "Ready-made builds became storefront products: name, use case, closed price and one-click purchase." },
        ckCarregado: { alt: "V1 checkout with the four payment methods stacked in a vertical list",
          legenda: "V1, fully loaded: each payment method takes a full row and the block runs down half the screen." },
        ckLento: { alt: "The same screen with only Boleto and Pix loaded, and an empty gap where the other methods were",
          legenda: "The same screen when the payment methods don't arrive: two are left, and the gap is larger than the content. Anyone paying by card can't see how to pay." },
        ckV12: { alt: "V1.2 checkout with the four payment methods side by side on a single row",
          legenda: "V1.2: the four methods fit on one row and shipping condenses into three options. The same checkout got 60% shorter." },
        ckMobile: { alt: "V1 and V1.2 mobile checkout side by side, with a line marking where the V1.2 ends",
          legenda: "Both at the same scale: the V1.2 ends where the V1 still has a quarter of a screen to go." },
        ckV12Pix: { alt: "V1.2 checkout with Pix selected, opening the immediate-approval steps",
          legenda: "Picking Pix opens what happens after you finish. The doubt that made people leave the checkout became an answer on the screen itself." },
        buscaV2: {
          alt: "V2 search suggesting the most searched products and terms before you type",
          legenda: "V2: search opens with the most sought-after products and terms. Whoever can't recall the name picks without typing." },
        popup: {
          alt: "V2 capture pop-up appearing after the person scrolls part of the page",
          legenda: "V2: the pop-up only appears after 15% of scroll. Whoever just arrived sees the store first; whoever already showed interest is the one who gets the offer." },
        buscaMouse: {
          alt: "V1 search for mouse returning a mousepad in the first results",
          legenda: "V1, searching \u201cmouse\u201d: the first result is a mousepad." },
        buscaMause: {
          alt: "V1 search for mause returning a screen with no results at all",
          legenda: "V1, searching \u201cmause\u201d: no results. One letter off and the whole store disappears." },
        mspBuilder: { alt: "Step-by-step build with the eight component stages and the configuration summary",
          legenda: "Building from scratch runs through eight steps with compatibility checked and the total always in sight." },
      },
      abertura: { k: "The scene", t: "A site the company liked and the customer didn't use",
        p: ["PCYES sells hardware and peripherals to people who build their own PC. They arrive knowing the model they want, compare spec sheets against the competition and decide in minutes. The site they had wasn't built for that: it opened on a brand campaign, with video and animation filling the entire first fold, and the product started below the edge of the screen.",
            "What came to me was an aesthetic brief, something along the lines of make it more minimal, cleaner, closer to a big brand. I agreed to look, but not to design before understanding why a beautiful store was selling less than it could, so I spent the whole first week watching people try to buy."],
        fig: "abertura" },
      problema: { t: "Three tolls to buy a mouse",
        p: ["In the recordings the same scene kept repeating. Someone found the product inside the campaign, clicked, waited for the page to open, and only there was there a buy button. Neither the storefront, nor the home, nor the category pages let you add to the cart, so every purchase cost clicks that didn't need to exist.",
            "Whoever got through that still stopped at the end, because checkout concentrated the drop-off and no report said why. That is where I put my chips: if people vanish on the last screen, the problem lives on the last screen.",
            "In the end, anyone who just wanted a mouse paid three tolls: finding the product inside the campaign, opening its page to be able to add it to the cart, and guessing in the dark whether they could pay the way they wanted."] },
      painel: {
        k: "The size of the hole",
        t: "166,267 came in that quarter, 273 bought",
        fonte: "GA4 and invoices · Q2 2026 · 166,267 sessions",
        acesos: 2,
        milLegenda: "Each dot is a person who entered the store. The two lit ones are the people who bought: 0.16% conversion across a whole quarter.",
        numeros: [
          { v: 166267, l: "sessions in the quarter" },
          { v: 273, l: "invoiced orders" },
          { v: 0.16, d: 2, s: "%", l: "conversion rate" },
        ],
        barras: [
          { l: "Average page scroll", v: 25.5, d: 1, n: "Three quarters of the page were never seen." },
          { l: "Sessions with a loading error", v: 14.4, d: 1, n: "One in seven ran into a technical failure, measured by the site's own event." },
          { l: "Direct traffic, no declared source", v: 50, n: "Half the volume, with a 71.9% bounce rate and 3% of the revenue: almost none of it was people buying." },
        ],
        nota: "Whole quarter, cross-checking GA4 against the invoices, two sources that don't talk to each other. Clarity comes in only where it measures well, which is behavior.",
      },
      /* o funil tambem substitui o ramo inteiro: `etapas` e `marca`
         viajam junto, senao somem em ingles com build verde. */
      funil: {
        k: "Where people stopped",
        t: "Of every 62 who open a product, one adds it to the cart",
        fonte: "Google Analytics 4 · Q2 2026 events · 166,267 sessions",
        etapas: [
          { l: "Sessions", v: 166267, n: "Everyone who entered the store in the quarter." },
          { l: "Saw a product", v: 50399, n: "Three in ten get as far as opening a product page." },
          { l: "Added to cart", v: 808, n: "And here the funnel collapses: of 62 who looked, one adds." },
          { l: "Started checkout", v: 896, n: "More than the previous step, and it isn't an error: you can start checkout without firing the cart event, through quick buy or a recovered cart." },
          { l: "Bought", v: 223, n: "Whoever reaches checkout converts at a quarter: 25%." },
        ],
        marca: { nosso: 0.13, mercado: 1.1, piso: 0.8, teto: 1.5, l: "Conversion rate",
          n: "Electronics convert at 1.1% on average in Brazil, with a healthy band between 0.8% and 1.5%. The store sat at an eighth of its own category's floor.",
          fonte: "Prax 2025 benchmark, over a thousand Brazilian e-commerces" },
        nota: "I lost that bet here. Whoever reaches checkout buys at 25%, one in four, so the last screen was never the main hole, before or after the fix I had just shipped to it. The hole sat one step earlier, between looking at a product and putting it in the cart, which was exactly the step I wasn't looking at, and it was out of that correction that the whole V2 ended up being redesigned. This is the full quarter, event by event, not a three-day sample.",
      },
      /* gesto e busca nunca tiveram tradução e renderizavam em
         português no modo EN: os dois melhores beats do volume, mudos
         para recrutador de fora. O objeto substitui o PT inteiro, então
         `itens` e `figs` viajam junto, senão somem em inglês. */
      gesto: {
        k: "What people clicked",
        t: "The site's most common click was closing the pop-up",
        fonte: "Microsoft Clarity · heat map · 497 views, 798 clicks",
        itens: [
          { el: "Close the pop-up", sel: "I._close-icon", v: 124, p: 15.54, tipo: "ruido" },
          { el: "Search field", sel: "#search", v: 76, p: 9.52, tipo: "busca" },
          { el: "Close the pop-up (area)", sel: "DIV._close", v: 58, p: 7.27, tipo: "ruido" },
          { el: "Carousel next", sel: "Next", v: 22, p: 2.76, tipo: "neutro" },
          { el: "Buy", sel: "BUTTON.action.primary", v: 5, p: 0.63, tipo: "compra" },
        ],
        leitura: "Added up, the two close buttons take 182 clicks, 22.8% of everything clicked on the page. Buy had 5. The site demanded attention before offering anything, and people spent their first gesture getting rid of it. That is what pulled the pop-up away from the arrival in the V2, and what sent me looking at search. If the second most common gesture is searching and the purchase never happens, the problem lives in what search returns.",
      },
      busca: {
        k: "The finding that widened the scope",
        t: "The store demanded spelling before letting you buy",
        p: ["I went to test what search answered. It was the store's main path: 71,416 sessions used search in the quarter, 43% of the total, more than the 50,399 that opened a product page.",
            "I searched for mouse and the storefront returned a mousepad ahead of the mouse, which was exactly the line the company was investing in most at that moment. The engine ranked by text proximity, not by catalog relevance.",
            "Then I searched for mause and nothing came back, and the suggestions that showed up were other spelling errors from the catalog itself, \u201cMause\u201d, \u201cVulcam\u201d. The same happened with mous, with teclao, with any variation that slipped from the exact spelling.",
            "Half the names in a hardware store are foreign and full of numbers, so misspelling is the common case and not the exception. Whoever typed mause had the same money as whoever typed mouse, and left without seeing a single product."],
        figs: ["buscaMouse", "buscaMause"],
        dado: { v: 71416, p: 43, l: "sessions used search in the quarter",
          n: "More people searched than browsed. Search was the store's main path, and it was the one returning a mousepad to anyone looking for a mouse.",
          fonte: "Google Analytics 4 · view_search_results event · Q2 2026" },
      },
      investigacao: { t: "Session recordings instead of opinion",
        p: ["None of this came out of a report. It came out of watching recorded sessions in Clarity, cross-checking navigation metrics and talking to people who were trying to buy.",
            "I watched the sessions end to end, no skipping, noting the exact point where the person stopped moving forward. It's slow work, and it's what holds up everything else: without it, the next meeting would be my opinion against the board's opinion, and mine loses.",
            "The board wanted a minimalist direction focused on brand value, and on-site behavior pointed the other way. I brought the recordings to the meeting and proposed a third path, with the brand present at chosen moments and the path to purchase as the site's spine. The final model was approved."],
        achados: ["Payment methods weren't visible in the checkout's first fold. Users only found out how they could pay after scrolling, and many left before that.",
                  "There was a bug in Magento's payment module, and it broke the purchase at the most expensive step of the funnel.",
                  "The path to purchase was too long for the kind of product being sold.",
                  "Beyond the recordings, the catalog had holes of its own. Launches without reservation, a configurator that only served people who already knew the part, a cart that took people away from the page."],
         },
      citacao: { q: "The board asked for minimalism and behavior on the site asked for a shortcut, so instead of picking one I split the layers.",
        fonte: "The proposal that unlocked the project" },
      decisoes: [
        { d: "A search that forgives bad spelling",
          r: "because the V1 returned an empty screen for \u201cmause\u201d and a mousepad for \u201cmouse\u201d. The V2 began tolerating misspellings, ranking the catalogue by what the store needs to sell, and opening with the most searched terms and products, for whoever can't recall the name of what they want. In a hardware store, demanding exact spelling is picking one audience and dismissing the rest." },
        { d: "The pop-up after 15% of scroll, never on arrival",
          r: "because the most common click on the entire site was closing the pop-up: 182 clicks across the two close areas, against 5 on the buy button. Email capture was charging the first gesture of someone who had just walked in. In the V2 it only appears after the person scrolls 15% of the page, meaning after they show some interest. The same offer, made to someone already looking." },
        { d: "Payment methods in the checkout's first fold",
          r: "because the recordings showed people leaving before finding out how they could pay. Along the way I found a bug in the Magento payment module that showed up in the recorded session and in no report at all, so I traced it to its origin in a public project of the extension and handed the tech team the exact spot to fix." },
        { d: "Add to cart straight from the home and the storefront",
          r: "because requiring the product page charged clicks that didn't need to exist. Whoever already knows what they want buys from the card, and from the cart goes straight to checkout. Whoever is still deciding still has the full page available." },
      ],
      recusei: { k: "What I turned down",
        p: "Not everything the research surfaced became a screen. These three I chose to leave out.",
        itens: [
          { o: "Swapping one institutional home for another", r: "The minimalist direction that arrived ready solved the aesthetics and kept the product out of the first fold. I brought the recordings to the meeting and proposed the opposite of what had been asked." },
          { o: "Erasing the brand from the site", r: "After turning the table, the easy path would be to make everything a dry storefront, but PCYES has personality and it sells, so the brand stayed, at a set time and place." },
          { o: "Filing a ticket and waiting", r: "The payment module bug was blocking real purchases. Diagnosing it wasn't my job, but it was what unlocked the most expensive step in the funnel." },
        ] },
      sistema: {
        k: "Before the screens",
        t: "The V1 had colors. The V2 has a system that knows what each color does",
        p: ["Forty screens drawn by hand become forty repeated decisions about spacing, state and color. Before drawing, I built the vocabulary: 239 tokens in the theme file, 69 components built on top of them.",
            "What changes is the address of the color. In the V1, the grey for secondary text was a hex written on the spot, different on every screen, and in the V2 it has a name and a job: ink-muted is the role \u201csecondary text\u201d, and when the theme flips it flips on its own."],
        escada: {
          k: "The same token, both themes",
          n: "One value per theme, a single role. No screen needs to know which theme it is in.",
          linhas: [
            { t: "surface-1", f: "Card background", c: "#ffffff", e: "#1a1a1a" },
            { t: "surface-3", f: "Raised background, solid divider", c: "#e5e5e5", e: "#323232" },
            { t: "ink-strong", f: "Heading, price", c: "#161616", e: "#ffffff" },
            { t: "ink-muted", f: "Secondary text", c: "rgba(22,22,22,.65)", cl: "black 65%", e: "rgba(255,255,255,.55)", el: "white 55%" },
            { t: "edge", f: "Default border", c: "rgba(0,0,0,.12)", cl: "black 12%", e: "rgba(255,255,255,.12)", el: "white 12%" },
          ],
        },
        funcoes: [
          { n: "Buy", c: "#22c55e", f: "Action", p: "The green of the buy button. It's a gesture, not information, and it only shows up where you can act." },
          { n: "Savings", c: "#15803d", ce: "#4ade80", f: "Information", p: "The \u201c-15% OFF\u201d and the Pix mention. Same family as the buy green, different job, and so a different value." },
          { n: "Pre-order", c: "#f97316", f: "Waiting", p: "Orange is the product that hasn't arrived yet. Reservation, counter and date use this color and nothing else does." },
          { n: "Coin", c: "#facc15", f: "Balance", p: "The gold of the points program. Balance, tier and expiry. Outside PCYES Points, this color doesn't appear." },
        ],
        caso: {
          k: "Why the value changes",
          t: "The savings green is two greens",
          p: ["The buy green (#22c55e) on white lands at 2.28:1. For text, WCAG asks for 4.5:1, so the same green that works as a button fails as small text.",
              "So the savings token holds two values, #15803d on light (5.02:1) and #4ade80 on dark (11.08:1). Whoever designs the screen writes savings and gets the green that passes in the theme they're in, without depending on someone remembering to check contrast."],
          pares: [{ tema: "Light", c: "#15803d", bg: "#ffffff", r: "5.02:1" },
                  { tema: "Dark", c: "#4ade80", bg: "#0e0e0e", r: "11.08:1", escuro: true }],
        },
        motion: {
          k: "Motion",
          t: "One curve, for everything that moves",
          curva: [0.16, 1, 0.3, 1],
          rotulo: "cubic-bezier(0.16, 1, 0.3, 1)",
          dur: "300ms",
          p: "It leaves fast and arrives slowly, which is how something with weight comes to a stop. The alternative is every component picking its own, and then the whole site looks like it was made by different people. so it ended up as one curve and one default duration for everything that moves.",
          marcos: [{ l: "200ms", n: "button state" }, { l: "300ms", n: "default" }, { l: "500ms", n: "panel entry" }],
        },
        tipografia: {
          k: "Type",
          t: "Two families, one scale",
          p: "Figtree carries headings and Inter carries text and interface, and the scale is not continuous: there are five steps, far enough apart that the hierarchy is obvious without anyone having to compare two pieces of text side by side.",
          familias: [{ n: "Figtree", f: "Display, headings" }, { n: "Inter", f: "Text and interface" }],
          escala: [
            { n: "h1", px: 80, fam: "Figtree", peso: 400, pn: "regular" },
            { n: "h2", px: 48, fam: "Figtree", peso: 300, pn: "light" },
            { n: "h3", px: 40, fam: "Figtree", peso: 400, pn: "regular" },
            { n: "h4", px: 32, fam: "Figtree", peso: 400, pn: "regular" },
            { n: "body", px: 16, fam: "Inter", peso: 400, pn: "regular" },
          ],
          nota: "The h2 is the only one in light. It is the size that shows up most at the top of a section, and at normal weight it competed with the h1 instead of organising the page below it.",
        },
        espaco: {
          k: "Space and radius",
          t: "The rhythm between sections has four values, not forty",
          p: "Distance between sections is usually where a system leaks, because someone writes 72, someone else writes 80, and the page loses its beat. Here there are four steps, and they shrink together on mobile, where a desktop gap turns into empty screen.",
          ritmo: [
            { l: "sm", d: 56, m: 40 },
            { l: "md", d: 88, m: 56 },
            { l: "lg", d: 128, m: 72 },
            { l: "xl", d: 168, m: 96 },
          ],
          ritmoNota: "Desktop and mobile. The same scale, compressed.",
          raios: [
            { v: 4, u: "Field, button" },
            { v: 8, u: "Default card" },
            { v: 12, u: "Modal, search" },
            { v: 18, u: "Gift card" },
            { v: 22, u: "Product photo" },
            { v: 26, u: "Category storefront" },
          ],
          raioNota: "Every radius has a written use. That is what stops a seventh radius from being born on the next screen.",
        },
        derivado: {
          k: "The case that closes it",
          t: "The product card holds no colour at all",
          p: ["The background behind the product photo is the most repeated component in the store, and it shows up on the home, the storefront, search and the cart. It would be the natural candidate for a grey picked by hand.",
              "It doesn't have one. The background is the theme's text colour dropped to 10% and 3% opacity, on a diagonal, so on light it comes out near transparent black and on dark near transparent white. Same rule, two results, and no value stored anywhere.",
              "A palette is a list of colours. This is a rule that produces the right colour in a context nobody planned for."],
          formula: "rgba(var(--foreground-rgb), .10) \u2192 .03",
          temas: [{ tema: "Light", ink: "22, 22, 22", bg: "#fafafa", escuro: false },
                  { tema: "Dark", ink: "255, 255, 255", bg: "#0a0a0a", escuro: true }],
        },
        nota: "The system is mirrored in code and synced with Figma through Tokens Studio, so the library and the product don't drift apart over time. A card shadow that existed copied in 43 places became a single token.",
      },
      solucao: { t: "Brand present, product on the spine",
        p: ["The three screens below are the same path, walked start to finish. The storefront buys without opening the product, the checkout opens on the payment method, and mobile repeats the rule on a screen where nothing gets repeated by accident.",
            "The system came with it, a Figma library with the components that show up across the whole purchase, so the tech team can implement without re-deciding spacing, state and color on every new screen."],
        legendas: ["Where the path begins. Anyone who already knows what they want buys without leaving the storefront.",
                   "Where it ends. The checkout opens on the payment method, before the person decides whether to go on.",
                   "And where it fits in a pocket. The same rule on the small screen, with the price fixed at the bottom."] },
      ponte: { k: "Before the V2 · the V1.2", t: "The checkout got better without waiting for the redesign",
          buraco: "The recordings showed the payment module failing exactly where the purchase happens, and the V2 had a release date.",
          p: ["Checkout was where I had put my chips, and waiting for the redesign cost sales every day. I proposed a small fix to the version already running, the V1.2."],
          passos: [
            { k: "The good state", t: "Even working, it ran too long",
              p: "Fully loaded, each payment method takes a full row. The block runs down half the screen and pushes the decision away from someone who already picked the product.",
              fig: "ckCarregado" },
            { k: "The real state", t: "And when it didn't load, it vanished",
              p: "The Magento payment module kept failing, and when it did there were two methods left and a gap larger than the content itself, exactly where the purchase happens. Anyone paying by card couldn't see how to pay.",
              fig: "ckLento" },
            { k: "The fix", t: "All four methods on one row",
              p: "The four now sit side by side and shipping condensed into three options behind a \u201csee more\u201d. The same checkout got 60% shorter: 3421 pixels tall against 1366.",
              fig: "ckV12" },
            { k: "The answer", t: "Choosing began to explain",
              p: "Picking Pix opens what happens after you finish, in three steps. The doubt that made people leave the checkout became an answer on the screen itself.",
              fig: "ckV12Pix" },
            { k: "On the phone", t: "The same decision, on the small screen",
              p: "On mobile the difference is literal: the V1.2 ends where the V1 still has a quarter of a screen to go, for the same purchase.",
              fig: "ckMobile" },
          ] },
      modulos: [
        { k: "Pre-order", t: "A reservation with counted slots and a date in plain sight",
          buraco: "PCYES lives off launches, limited editions, a Maringá FC collection, and the V1 treated all of that like any other product: either it had stock, or it disappeared from the storefront.",
          p: ["In the V2, a product announced before it ships goes into pre-order with a reservation. You see how many reservations are already gone, how many are left and the expected delivery date, and the card is only charged on dispatch.",
              "The reservation count is real and so is the date, so the bar shows how much is left without inventing a rush."],
          figs: ["prevenda"] },
        { k: "Build your PC", t: "Three paths to the same machine",
          buraco: "Building a PC splits two audiences that don't mix, and the old configurator served people who already know the part while abandoning people who only know the game they play.",
          p: ["The module's entrance asks one question and opens one of three paths. Pick one on the side to see how each behaves."],
          figs: ["mspCaminhos"],
          caminhos: [
            { t: "I know what I want", para: "Build from scratch", fig: "mspBuilder",
              p: "Eight steps, one part at a time, with the list filtered by what fits everything already chosen. The total and the installment stay in sight the whole way, so nobody finds out the price at the end." },
            { t: "Help me choose", para: "Three questions", fig: "mspJogos",
              p: "Instead of asking about budget, it asks what you play, edit or do day to day. The recommendation comes out of Valorant and Premiere, not out of socket and TDP, and comes back as a ready build you can still edit part by part." },
            { t: "I want it ready", para: "Tested setups", fig: "mspProntas",
              p: "Nine assembled and tested machines become storefront products: name, use case, closed price and one-click purchase, the same way you buy a mouse." },
          ] },
        { k: "What the V1 didn't have", t: "Side cart and a points program",
          buraco: "In the V1, adding to cart took people away from the page, and a loyalty program didn't exist.",
          p: ["Two things came into the V2. The side cart, which opens over the page instead of taking people away, with the gift bar showing how much is missing to earn something, and PCYES Points, with balance, tiers and expiry open on screen."],
          figs: ["sidecart", "points"] },
        { k: "The finishing", t: "The eight fixes that shortened the path",
          buraco: "The path to purchase ran long because every fold added a small friction, and none of them alone looked big enough to be worth fixing.",
          p: ["The four anchors say what the project came to stand for. These eight are what had to change, one fold at a time."],
          passos: [
            { k: "The entrance", t: "Search stopped demanding spelling",
              p: "The V2 opens with the most searched terms and products before anyone types, and what they mistype still finds its match. The field began serving both the person who knows the part number and the person who only knows what it is for.",
              fig: "buscaV2" },
            /* PENDENTE: o passo do pop-up dorme junto com o PT até o
               print existir. Ver a nota no data.jsx.
            { k: "The arrival", t: "The offer began waiting for interest",
              p: "The pop-up moved off the doorway to after 15% of scroll. Whoever just arrived sees the store; whoever is already looking is the one who gets the proposal.",
              fig: "popup" },
            */
            { k: "The home", t: "The institutional content moved down one fold",
              p: "Product carousels instead of brand blocks, promotions up front and a promo filter right at the category entrance. The institutional blocks are still there, after the first buying carousel.",
              fig: "home" },
            { k: "The storefront", t: "Judging without losing your place in the list",
              p: "Quick view opens the product over the listing, with photo zoom. Someone comparing three models doesn't restart the scroll on every look.",
              fig: "quickview" },
            { k: "The product", t: "The price stopped disappearing",
              p: "A sticky right column on desktop, a fixed bar at the bottom on mobile. It's the piece of information people check most often, and it was the one that kept demanding a scroll back to the top.",
              fig: "preco" },
            { k: "The spec sheet", t: "Copy generated from the SKU",
              p: "The spec sheets were inconsistent, each written by a different person in a different year. An internal tool began generating the HTML with heading hierarchy and formatted images.",
              fig: "sku" },
            { k: "The line", t: "And the team began seeing where each product is",
              p: "Every SKU runs through CRM, SEO, HTML generator, Page Builder and publishing. Now you can see which stage each one is in.",
              fig: "skuFila" },
            { k: "The reading", t: "The brightness jump left the navigation",
              p: "The site is dark and the V1 opened a fully white fold halfway down. Late at night, which is when a good share of this audience buys, that jump is the part that tires you out.",
              fig: "contraste" },
            { k: "The reach", t: "VLibras, because the store serves signing customers too",
              p: "People whose first language is Libras were reading the whole store in a second language. The widget cost little implementation time.",
              fig: "libras" },
          ] },
      ],
      antesDepois: { rotuloAntes: "V1", rotuloDepois: "V2",
        legenda: "The same first fold: the V1 opens on a brand campaign, the V2 opens on the path to purchase.",
        pares: [
          { rotuloAntes: "V1", rotuloDepois: "V2",
            legenda: "The same peripherals storefront: on the V1 the card only leads to the product page, on the V2 it buys." },
          { rotuloAntes: "V1", rotuloDepois: "V2",
            legenda: "The cart: on the V1 it's a page that pulls you out of the store, on the V2 it opens on top and leaves you where you were." },
        ] },
      calendario: { k: "Date set", mes: "October", ano: "2026", dia: 26,
        dow: ["S", "M", "T", "W", "T", "F", "S"],
        legenda: "October 26, 2026: the date agreed with the board for the V2 to go live. Until then, the prototype is the product you can test." },
      resultado: { t: "Goes live in October",
        p: ["Buying no longer needs the product page, the price stopped disappearing on scroll, and the payment method shows up before the person decides whether to go on. The final direction was approved and the date is set.",
            "I don't have operational results yet, and I'd rather not present a number that doesn't exist."],
        listaK: "What will be tracked after release",
        lista: ["Add-to-cart rate from the home and the storefront",
                "Checkout completion and drop-off per step",
                "Time between landing on the site and buying",
                "Payment error occurrences"] },
      aprendi: { p: ["Brand value and conversion entered the project as opposite choices, and they aren't: the brand could show up as much as it liked, and what got in the way was it sitting where the product should have been in the page hierarchy.",
                     "The most expensive lesson was the funnel one. I had a well-formed suspicion about checkout, plausible enough that I had already worked on it, and it was wrong. What corrected me was trading a three-day sample for the whole quarter, event by event.",
                     "Walking into a hard conversation with recordings instead of an opinion also changes who has to prove what. And chasing the payment module bug down to its origin bought more trust with the tech team than any presentation I could have made."] },
    },
    "locarmais-conciliacao": {
      vocabulario: {
        t: "Five statuses, one language",
        kicker: "the lexicon that ended the ambiguity",
        termos: [
          { n: "Reconciled", d: "What the system recorded matches what the acquirer reported. Closes on its own, asks nobody." },
          { n: "Not reconciled", d: "No match found yet. Not an error: a work queue." },
          { n: "Divergent", d: "Found a match, but the amount doesn't agree. This is where the team's time goes, and this is where the screen opens." },
          { n: "In dispute", d: "The difference became a claim with the acquirer. Leaves the normal flow without leaving your control." },
          { n: "Ignored", d: "Someone decided that entry doesn't go into reconciliation. A recorded decision, not a forgotten entry." },
        ],
        nota: "Five words the team began using the same way on screen and in conversation.",
      },
      domain: "SAAS", descriptor: "Financial reconciliation module", title: "Locar Mais", project: "Locar Mais",
      premise: "Is the amount that arrived the right amount? Finance couldn't answer.",
      role: "UX Designer, module owner",
      surface: "Management system · web", periodo: "In production",
      fact: "Replaced an external tool and wiped out the finance team's side spreadsheets",
      tldr: { papel: "UX Designer, module owner",
        oque: "A financial reconciliation module inside a management system.",
        resultado: "Replaced an external tool and wiped out the finance team's side spreadsheets" },
      problema: { t: "Is the amount that arrived the right amount?",
        p: ["The company was paid through multiple acquirers at once. Each with its own fee, tax, settlement window and statement format.",
            "Answering meant manually cross-checking what the system recorded against what each acquirer reported in the statement. Multiplied by hundreds of entries a day, it became slow, hard to audit and impossible to follow in real time.",
            "Basic questions went unanswered: how much is still due, how much was withheld in fees, and which entries are wrong."] },
      investigacao: { t: "Next to the people who run it daily",
        p: ["I worked alongside the finance team, who ran the process every day, and followed the real checking routine to see where the effort went and where the errors appeared.",
            "I also benchmarked established reconciliation platforms, to use the vocabulary the field already knows instead of inventing a new term where one exists."],
        achados: ["The work wasn't reconciling, it was finding what doesn't match. Most entries settle on their own; the team's time went into hunting the divergent minority inside the correct majority.",
                  "When the team forced a manual reconciliation, the reason was lost. Nobody could later say why that entry had been closed with a difference."] },
      decisoes: [
        { d: "Five statuses, one shared language", r: "because the team already used these ideas under different names from person to person. Reconciled, unreconciled, divergent, disputed and ignored: fixing the vocabulary in the interface ended the ambiguity in day-to-day conversations." },
        { d: "The top answers before anyone asks", r: "because expected, net amount, accumulated difference and reconciled percentage are what you look at first. The accumulated difference sits in focus next to the divergent count, because that is what triggers action." },
        { d: "Three paths, cheapest to most expensive", r: "because human effort has to be reserved for where it is actually needed: automatic reconciliation on statement import, bulk for what's left, and forced individual for what requires judgment." },
        { d: "Forcing a reconciliation requires a reason", r: "because the exception was a hole in the process and became data. Closing with a difference asks for a justification from a closed list (fee, split payment, date difference, acquirer rounding, other), and over time the company learns which divergences repeat and with which acquirer. It's the decision I'm proudest of in this module." },
        { d: "Data sources side by side", r: "because the checking has to happen on screen, without opening two systems: in the entry detail, the platform record and the gateway record appear together, with contract, expected fee, expected net amount and expected settlement date." },
        { d: "History with a full trail", r: "because in a financial module, answering 'who touched this and why' is a requirement: automatic reconciliation, statement import and manual adjustment all keep author and timestamp." },
        { d: "Import from multiple sources", r: "because the user uploads statements from several acquirers in a single operation and gets the consolidated result: how many reconciled on their own, how many diverged and how many are pending, with a CSV export for each group." },
      ],
      solucao: { t: "Reconciling means finding what doesn't match",
        p: ["The module opens on what needs attention, not on what went right.",
            "In the same system I designed the monitoring dashboards used by operations and the board: portfolio classified by behavior, approved-versus-paid contract performance, targets per rep and churn for the period. Same logic: the dashboard opens on the critical state, with a quick filter, and the detailed table sits right below for whoever needs to dig in."] },
      resultado: { t: "In production, and the spreadsheets are gone",
        p: ["I don't have a formal before-and-after measurement, but three behavior changes happened and are verifiable."],
        listaK: "What changed in the team's behavior",
        lista: ["The side spreadsheets are gone. The team kept several to control the process, one per front, and stopped using them after delivery.",
                "Finance stopped asking the development team for reports: the data became available in the platform itself.",
                "Reconciliation moved from an external tool to in-house, joining the operation's record and the acquirer's statement in one place."] },
      aprendi: { p: ["In a financial product, the most important screen isn't the one showing what went right. It's the one showing what doesn't match, and why.",
                     "I also learned the value of designing for the expected error. A system that only accepts the perfect path pushes the user out of it, usually into a side spreadsheet nobody audits."] },
    },
    odex: {
      investigacao: { t: "Validated with the people who operate the system",
        p: ["The system is operated by managers and the board, so the evaluation happened with them, who are the real users. Every version was delivered as a navigable prototype, with comments recorded on the screens, and adjusted before the next one."],
        achados: [
          "It wasn't a flow problem. The paths had worked for years and nobody was asking to change them.",
          "The interface promised less than the business already delivers today.",
          "Any change of path would cost dearly: the people who use the system every day know where everything is by heart.",
        ] },
      antesDepois: { rotuloAntes: "V1", rotuloDepois: "V3",
        legenda: "Two iterations of the redesign on the same fold: the V1 opens on a targets dashboard, the V3 opens on the catalogue. The path for the people already using it did not change." },
      domain: "DESKTOP AND WEB", descriptor: "Interface redesign", title: "ODEX", project: "ODEX",
      premise: "The platform had worked for years. It was the interface that had aged.",
      role: "UX/UI Designer",
      surface: "Platform · app · site",
      periodo: "Platform in progress · site in production · app in prototype",
      fact: "A legacy system brought up to date without changing the path of the people already using it",
      tldr: { papel: "UX/UI Designer",
        oque: "A management platform with years of use, plus an app and a marketing site.",
        resultado: "A legacy system brought up to date without changing the path of the people already using it" },
      problema: { t: "The interface aged along with the product",
        p: ["The platform worked, and had worked for years. The problem wasn't the flow, it was the interface: an old layout that aged along with the product and ended up communicating less than the business already delivers today.",
            "Redesigning legacy is an exercise in restraint, not in creation. The entire surface changed; the system's logic, on purpose, did not. The people who operate it every day know where everything is by heart, and making them relearn the path would charge a high price for an improvement they never asked for."] },
      decisoes: [
        { d: "The whole screen base redesigned, with a navigable prototype", r: "because the team needed to judge the proposal in use, not as a static image." },
        { d: "New visual language, path untouched", r: "because in a system with years of use, changing the look without changing the path is the difference between modernizing and getting in the way." },
        { d: "App redesigned on its main screens", r: "because the mobile surface has to speak the same language. It's in prototype today: implementation hasn't entered the roadmap yet." },
        { d: "I took on the site implementation myself", r: "because the delivery was tied to an event with a fixed date and the development team had no window. I went straight into Magento: changed the home code, created and indexed the categories, rebuilt header and footer and fixed the redirects." },
        { d: "Validation with managers and the board", r: "because they are the ones who operate the system every day, and an opinion from someone who doesn't use the product is not a criterion." },
      ],
      solucao: { t: "The whole surface, nothing to relearn",
        p: ["The platform redesigned with a navigable prototype, the app's main screens in prototype, and the energy storage page created for the new battery line, explaining how the product works to an audience that doesn't know the technology yet."] },
      resultado: { t: "Live in time for the trade show",
        p: ["The site went into production within the event's date. The platform is still in progress and the app is in prototype."] },
      aprendi: { p: ["The temptation, in a system like this, is to reorganize everything at once. The right work is updating the interface without forcing the people who use the product every day to relearn where things are.",
                     "Knowing how to touch the code changes what you can deliver. On this project it was the difference between arriving at the trade show with the new site or not arriving at all."] },
    },
    "oderco-revenda": {
      domain: "WEB", descriptor: "Reseller signup page", title: "Oderço", project: "Oderço",
      premise: "A long form, from a brand the visitor had never heard of.",
      role: "UX/UI Designer, from the flow to the automation",
      surface: "Landing page · form · RD Station", periodo: "Ready, staged rollout",
      fact: "Cut the sales team's systems from three to two",
      tldr: { papel: "UX/UI Designer, from the flow to the automation",
        oque: "A reseller sign-up landing page, with a staged form and automation.",
        resultado: "Cut the sales team's systems from three to two" },
      problema: { t: "Why should I answer all of this?",
        p: ["Traffic arrived from ads straight onto the signup page. And the page had nothing but the form.",
            "That works when the person already knows the company. Outside the region, almost nobody does. So the visitor landed on a long form, from a brand they had never heard of, and the question they asked was reasonable.",
            "Two problems stacked: no context, and a form too heavy for the level of trust that existed at that moment."] },
      decisoes: [
        { d: "Context and form on the same screen", r: "because whoever is already decided fills it in right away, and whoever needs to understand first scrolls and finds the product portfolio, the brands distributed, the reseller app and the companies served. The whole page is an argument, without ever taking the signup out of view." },
        { d: "A tech-company visual direction", r: "because that's what the reseller model needs the lead to believe, not the look of a traditional distributor." },
        { d: "Steps cut on purpose", r: "because the cut was defined by what the company needs to secure first. Step 1 asks for email and terms acceptance: if the person drops off from there on, the contact already exists and sales can follow up. Step 2 concentrates the qualification, such as area of interest." },
        { d: "A tax ID field that doesn't block signup", r: "because an integration failure can't cost a lead. The field accepts the new alphanumeric standard and fetches company data automatically; when the lookup finds nothing, the user fills it in and moves on, and sales verifies later." },
        { d: "Automatic lead distribution", r: "because I configured the custom fields and the automation in RD Station: leads come in and are round-robined between the reps responsible for first contact, with the email sequence triggered by the segment chosen in step 2." },
      ],
      solucao: { t: "The page answers before the form does",
        p: ["Someone arriving from an ad who has never heard of the company finds, on the same screen as the form, what it distributes, who it sells to and what the reseller gets out of it.",
            "The person filling it in already knows what they are signing up for."] },
      resultado: { t: "One system fewer in sales",
        p: ["Operations ran three systems for the same sales process. Today it runs two.",
            "That wasn't the predicted result. To build the automation I went after the RD Station API and documented how it worked. That showed the development team the integration was simpler than it looked, and they started connecting RD to the internal CRM. One system is out, and the path now is consolidating everything inside the in-house CRM, now that the flow has been validated in practice with the reps.",
            "The rollout is staged. First it takes only ad traffic, which is where the problem showed up hardest, and only then does it replace the official site's signup page. So far it has been tested with internal users and a small group of external ones."],
        listaK: "What will be tracked in this first phase",
        lista: ["Completion of each step",
                "Drop-off between step 1 and step 2",
                "Quality of the leads reaching sales"] },
      aprendi: { p: ["A short form isn't a goal in itself. What matters is where you cut: at the right point, a drop-off becomes a recoverable contact.",
                     "Most of the work wasn't even in the form. It was in answering, before it, the question the visitor was asking in silence: who is this company and why should I trust it."] },
    },
    portfolio: {
      domain: "WEB · MANIFESTO", descriptor: "This volume you are reading",
      premise: "A portfolio read like a manga volume.",
      role: "Concept, design and build",
      surface: "Website · Manifesto", periodo: "Live",
      fact: "Zero WCAG violations, measured view by view",
      tldr: { papel: "Idea, design and code, from concept to live",
        oque: "This volume: a self-authored portfolio designed and built from scratch.",
        resultado: "This site. Manga, ink and brutalism in the service of reading" },
      problema: { t: "Prove UX without saying I do UX",
        p: ["The average portfolio lists screens and job titles. I wanted the navigation itself to be the proof: if I guide you well through here, I have already answered whether I can guide a user.",
            "The constraint I chose: no generic template. It had to look like me."] },
      decisoes: [
        { d: "Manga volume format", r: "because guiding the reading well is the UX skill I want to prove. The metaphor serves the reading, never gets in its way." },
        { d: "B&W with red only on interaction", r: "because at rest it is ink on paper; color appears when you act. The interface comes alive at the touch, like an adaptation." },
        { d: "Typographic brutalism (Anton, panels, thick strokes)", r: "because I have loved manga and brutalism since I was a kid, and both demand obvious hierarchy and impact, no frills." },
      ],
      solucao: { t: "Cover, chapters, process and afterword",
        p: ["A list of chapters, a manga page turn, ink motion and screentone. A fast path for anyone in a hurry, a deep path for anyone who wants the full case.",
            "From navigable prototype to published site."] },
      aprendi: { p: ["Picking a strong metaphor is easy; the hard part is not letting it charge a toll. At every decision the question was the same: does this help someone read, or does it only insist that this is a manga? When the answer was the second one, it went.",
                     "And building my own portfolio handed back the argument I use in the other cases: a prototype in someone's hands is worth more than an opinion about an image. Everyone who opened this told me something I hadn't seen."] },
      resultado: { t: "Zero violations, measured and not promised",
        p: ["The volume passes WCAG 2.1 AA with no violations: zero on paper, zero in ink mode, zero in English and zero at 390px, swept with axe-core on the served page, view by view. Across six widths, from 1920 down to 390, none scrolls horizontally, and the eight routes load without a single JavaScript error.",
            "It is unglamorous, and that is the point. A portfolio arguing for care with detail while failing an automated sweep contradicts itself in its own shop window. This is the number I could hold myself to, so this is the one that is here, with the tool and the method up front."] },
    },
  };
  CHAPTERS.forEach((c) => {
    const en = CH[c.id];
    if (en) {
      // merge raso em `solucao`: a tradução só traz t/p/slots, e um
      // Object.assign cru trocava o objeto inteiro e derrubava `shots`,
      // o que fazia todo case aparecer em screentone cinza no inglês.
      const sol = en.solucao ? Object.assign({}, c.solucao, en.solucao) : c.solucao;
      // mesma armadilha nas figuras: o inglês traz legenda e alt, o
      // caminho do arquivo mora só no português. Merge por chave.
      const figsPt = c.figuras;
      // `semanas` do calendário é dado, não texto: o inglês só traz mês,
      // dia da semana e legenda, então a grade volta do português.
      const semanas = c.calendario && c.calendario.semanas;
      const adPt = c.antesDepois;
      Object.assign(c, en);
      if (sol) c.solucao = sol;
      if (semanas && c.calendario) c.calendario = Object.assign({}, c.calendario, { semanas: semanas });
      // antes/depois: o inglês traz rótulos e legendas, os arquivos moram no
      // português. Merge raso, e os pares extras casam por índice.
      if (adPt && c.antesDepois) {
        const adEn = c.antesDepois;
        const pares = (adPt.pares || []).map((par, i) => Object.assign({}, par, (adEn.pares || [])[i] || {}));
        c.antesDepois = Object.assign({}, adPt, adEn, pares.length ? { pares: pares } : {});
      }
      if (figsPt) {
        const figsEn = en.figuras || {};
        const merged = {};
        Object.keys(figsPt).forEach((k) => { merged[k] = Object.assign({}, figsPt[k], figsEn[k] || {}); });
        c.figuras = merged;
      }
    }
    if (c.cap === "PEÇA") c.cap = "PIECE";
    if (c.cap && c.cap.indexOf("CAP.") === 0) c.cap = c.cap.replace("CAP.", "CH.");
  });

  /* processo steps */
  const PROC_EN = [
    { t: "Objective", p: "Understand what needs to happen, not the list of screens." },
    { t: "Reference", p: "Hunt what already works. Steal like an artist, not like a tracing." },
    { t: "Navigable prototype", p: "From goal to clickable prototype in days. To touch, not to imagine." },
    { t: "Present", p: "I show early. Real criteria at the table, not loose opinion." },
    { t: "Adjust", p: "I cut what doesn't serve." },
    { t: "Deliver / Build", p: "Prototype becomes product, live." },
  ];
  PROCESSO.forEach((s, i) => Object.assign(s, PROC_EN[i]));

  /* companies */
  const CO_EN = {
    ttt: { role: "UX/UI Design intern", period: "2024 · 11 months · remote",
      anos: "2024", note: "Where I saw a product team from the inside",
      blurb: "A product training programme with forty interns. I joined to design and ended up coordinating people.",
      abre: "My first place in design paid nothing and never had a single real user. Even so, it was there that I first saw how a product team organises itself from the inside. That is what holds up everything that came after.",
      falaApos: 1,
      fala: "Interns coordinating interns. Nobody there had any mileage, and the squad still had to ship every week.",
      atos: [
        { k: "The programme", p: [
          "A founder wanted to build a development company and, instead of hiring, built a school. Around forty interns, half in design and half in code, split into squads with real agile rituals: planning, daily, review. All remote, voluntary and part time.",
          "None of us had experience. The whole structure leaned on the idea that people learning together ship faster than people learning alone, which is sometimes true and sometimes just organised noise.",
        ] },
        { k: "How an intern became a coordinator", p: [
          "The founder watched who stepped up and moved them into coordination. That is how I got the design squad: backlog, rituals and delivery tracking, run out of Trello and FigJam, with people my age and my level of mileage on the other end of the call.",
          "Coordinating with no authority and no repertoire teaches one specific thing: when you have no seniority to argue from, what is left is what is written down. If the definition wasn't clear on the card, the delivery came out different from the conversation, and the card was to blame.",
        ] },
        { k: "What passed through my hands", p: [
          "Flow and journey mapping, from rough sketch to internal validation. Facilitating sessions and talks on agile method. Hiring and onboarding new designers, training included.",
          "And a job with no name: taking the founder's idea, which arrived spoken, and handing it back drawn as a flow in FigJam so the rest of the team could disagree with it. It became routine, and it was the most useful part.",
        ] },
        { k: "What was missing, and it was a lot", p: [
          "Testing with a real user, at no point. That needs saying plainly, because it is the difference between an honest portfolio and a dressed up CV.",
          "What you learn in a place like that is how a product operation organises itself. How a screen gets validated is a different thing, and it only came later.",
        ] },
        { k: "Leaving", p: [
          "Voluntary and part time doesn't pay bills. I left for a sales job, which felt like a detour at the time and today reads as part of the CV: I spent a while on the side of someone who has to convince people, and that changes how you defend a design decision.",
        ] },
      ],
      fecha: "I left with no case to show, and with something no case teaches: what happens to a team when nobody writes the definition down.",
      skills: [
        { k: "Squad coordination", p: "backlog, rituals and delivery tracking in Trello and FigJam" },
        { k: "Flows and journeys", p: "from rough sketch to internal validation with the team" },
        { k: "Facilitation", p: "sessions and talks on agile method for the design squad" },
        { k: "Hiring and onboarding", p: "interviewing, onboarding and training new designers" },
        { k: "Documentation", p: "product definitions organised for the team to consult" },
      ] },
    locar: { role: "UX Designer", period: "2025 to 2026 · 13 months · Maringá",
      anos: "2025 · 26", note: "IMMO, Signa Mais and the finance module",
      blurb: "Where I designed real product, tested with real users and met my first heavy business logic.",
      abre: "Thirteen months in a group with five real estate products, an inherited visual base and one clear rule from above: solve it without formal research. It was there that I designed the most complex thing of my career so far.",
      falaApos: 1,
      fala: "Solve it, but without research. Surveys and interviews were within reach, and the order was still to ship a new feature.",
      atos: [
        { k: "The ground", p: [
          "Locarmais, IMMO, Locar Fácil, Signa Mais and Credfacil shared a dev team and part of the user base. Dense business logic SaaS, the kind where a wrong screen doesn't annoy anyone: it breaks somebody's month end close.",
          "All built on AdminLTE, an admin template put in place before I arrived. New features landed on top of it, gradually. I worked mainly on IMMO and Locarmais, and spent the whole period designing inside a visual vocabulary that wasn't mine.",
        ] },
        { k: "The house rule", p: [
          "Management measured output. A new feature counted for more than an improved one, and the order was to solve things without formal research, even though running a survey and booking interviews was perfectly possible.",
          "You can fight for method, and I did. You can also find the source nobody forbade. The finance team ran reconciliation on a parallel spreadsheet every month: that was field research served on a plate, it just didn't go by that name.",
        ] },
        { k: "The finance module", p: [
          "I designed the heaviest project of the period from scratch. Reconciliation with five statuses. Acquirers with different fees, taxes and payout terms. Automatic, batch and forced reconciliation with mandatory justification. Statement imports from several sources. A history trail with author and timestamp, and the source data side by side for whoever has to check.",
          "The hard part wasn't designing any of those screens. It was deciding the order they appear in, and what stays visible when the numbers don't match. Dense business logic isn't solved with a pretty component: it's solved by choosing what the user sees first when something has gone wrong.",
        ] },
        { k: "What changed in the operation", p: [
          "The module went to production and brought in house a reconciliation that had been running on a paid platform, which made receivables forecasting more reliable.",
          "The finance team stopped keeping the parallel spreadsheet. And stopped filing tickets with the dev team just to pull a report. Two habits died, and a dead habit is the hardest result to earn.",
        ] },
        { k: "The first time I really tested", p: [
          "It was the only place where I tested with real users of the system, not colleagues standing in for them. I interviewed, recorded, analysed and built hypotheses on what I saw, not on what I thought.",
          "Watching someone stall on a screen I considered obvious is the cheapest and most humbling lesson in this job. It permanently changed how I write labels and order fields.",
        ] },
        { k: "And I looked at someone else's work", p: [
          "I built the IMMO system and, along the way, became the UX reference for another designer on the team: reviewing deliverables, giving direction and following through. First time part of my job was looking at someone's work, which is nothing like looking at your own.",
        ] },
      ],
      fecha: "I arrived knowing how to draw a screen. I left knowing the screen is the last thing: before it there is somebody's operation, and it is almost never written down anywhere.",
      skills: [
        { k: "Process mapping", p: "interviews and shadowing the finance team in operation" },
        { k: "Business logic on screen", p: "multi-acquirer reconciliation, five statuses, audit trail" },
        { k: "Testing with real users", p: "users of the system itself, not proxy users" },
        { k: "Dashboards and metrics", p: "portfolio, contract conversion, targets and churn" },
        { k: "Design system", p: "maintaining and growing what existed: components, states and patterns" },
        { k: "Design direction", p: "reviewing and following through on another designer's delivery" },
      ] },
    oderco: { role: "UX/UI Designer", period: "2026 · current · Maringá",
      anos: "2026 →", note: "PCYES, Odex, Tonante, Vinik, Skul",
      blurb: "Today. Sole designer at a national distributor, running five brands across three fronts at once.",
      abre: "I'm the only designer at a national distributor with five in-house brands. E-commerce, platform and internal systems running at the same time, with nobody above me to review it. The queue is mine, and so is the prioritising.",
      falaApos: 2,
      fala: "The board wanted minimalism. The session recordings showed people giving up before buying. I didn't pick a side: I separated the layers.",
      atos: [
        { k: "The house", p: [
          "An electronics distributor founded in 1988, which started knocking on doors across Paraná and today distributes nationwide. Five in-house brands: PCYES in gaming, Vinik across segments, Skul in PC assembly, Odex in solar energy and Tonante in music.",
          "Each brand has its own audience, channel and tone. Sole designer means the coherence between them is my responsibility too, and that there is nobody to turn to when the call is hard.",
        ] },
        { k: "PCYES V2", p: [
          "The e-commerce redesign started in February and came out of bad metrics, not out of wanting a new look. I went after the why with session recordings in Microsoft Clarity, GA4 and conversations with people who buy.",
          "What surfaced was specific: payment methods didn't show above the fold in checkout, the Magento payment module had a bug, and the path to purchase ran too long. None of that is design opinion. It is recorded behaviour.",
        ] },
        { k: "The fight worth having", p: [
          "The board wanted a minimal direction focused on brand value, in line with the sector's reference brands. That was the first version's choice, and it's a defensible one. Behaviour on the site said otherwise.",
          "I brought the recordings into the conversation instead of my opinion, and proposed not choosing: separate the two layers. The brand shows up at defined moments and the product holds the spine of the page. That is the model that got approved, and it is what is going live.",
        ] },
        { k: "When the deadline didn't wait", p: [
          "On the Odex energy storage page, the dev team had no window and the trade show had a date. I implemented it straight in Magento: changed the home, created and indexed categories, rebuilt header and footer, fixed redirects.",
          "It was uncomfortable and it was right. Designing while knowing what implementation costs changed what I propose: today I kill on my own the idea I know will die in the dev queue.",
        ] },
        { k: "The side effect", p: [
          "To automate the lead routing on the reseller signup page, I documented the RD Station API. Reading that documentation, the dev team saw that connecting RD to the internal CRM was viable.",
          "The operation ran on three parallel systems and went down to two. It wasn't in scope, nobody asked, and it is the delivery I most like telling.",
        ] },
      ],
      fecha: "The best thing I've done here wasn't a screen. It was documenting an API and watching the company go from three systems to two.",
      skills: [
        { k: "Design System", p: "PCYES component library and palette, applied across the site" },
        { k: "E-commerce and checkout", p: "checkout rebuilt, add-to-cart on the shelf, sticky price column" },
        { k: "Session recordings", p: "Microsoft Clarity to find where purchase stalled, and to back decisions" },
        { k: "Implementation", p: "hands-on Magento when the deadline couldn't wait for the dev team" },
        { k: "Marketing automation", p: "RD Station: custom fields, lead routing and segment cadences" },
        { k: "Accessibility", p: "VLibras, contrast and product photo standardisation" },
      ] },
  };
  COMPANIES.forEach((c) => { const en = CO_EN[c.id]; if (en) Object.assign(c, en); });

  /* certificates */
  const CERT_ISSUER_EN = { "ux-balas": "Certification", circuit: "UX program", coderhouse: "Certification", scrum: "Agile", "design-g": "Degree" };
  CERTS.forEach((c) => { if (CERT_ISSUER_EN[c.id]) c.issuer = CERT_ISSUER_EN[c.id]; });
  const certScrum = CERTS.find((c) => c.id === "scrum"); if (certScrum) certScrum.title = "Scrum Certification";
  const certDg = CERTS.find((c) => c.id === "design-g"); if (certDg) certDg.title = "Graphic Design";

  /* a mensagem que abre a conversa no WhatsApp */
  CONTATO.whatsapp.href = "https://wa.me/5544998775978?text=" + encodeURIComponent(
    "Hi Gabriel! I came from your portfolio and I'd love to chat.");

  /* filter categories */
  const catAll = CATS.find((c) => c.key === "todos"); if (catAll) catAll.label = "All";

  /* rail/project card domains */
  const PJ_DOMAIN_EN = {
    "oderco-checkout": "E-commerce · B2B", "hub-oderco": "SaaS · Internal tool",
    "ponto-admin": "SaaS + App · Time tracking", "kitamo-app": "SaaS · Personal finance",
    isabella: "Website · Architecture", "locarmais-site": "Website · Rent guarantee",
    signamais: "SaaS · Subscriptions", "locarmais-conciliacao": "SaaS · Management",
    odex: "Desktop and Web", "oderco-revenda": "Web · Landing page", pcyes: "E-commerce · Magento",
    rodape: "App · Android", remoctrl: "Native app · Desktop", traxium: "SaaS",
    quantocobro: "App · Android", deixeiaqui: "App · Android",
    dropchina: "E-commerce · Shopify", web2design: "Tool · Design", argel: "App · Boxing",
    "solar-site": "Website · LP", "4yu": "Website · LP", immo: "SaaS",
  };
  const PJ_DESC_EN = {
    "oderco-checkout": "B2B checkout by invoice, in steps with a final review",
    "hub-oderco": "Hub that generates material and product copy for 7 brands",
    "ponto-admin": "Time tracking: manager dashboard and worker app",
    "kitamo-app": "Debt visibility and next-month bill projection",
    isabella: "Architecture site, from portfolio to contact",
    "locarmais-site": "Digital rent-guarantee site, one pitch for three audiences",
    signamais: "Subscriptions platform",
    pcyes: "E-commerce redesign", "locarmais-conciliacao": "Financial reconciliation module",
    odex: "Interface redesign", "oderco-revenda": "Reseller signup page",
    portfolio: "This volume you are reading",
    rodape: "Book club app, designed in Figma",
    quantocobro: "Works out the hourly rate for whoever charges by the hour",
    deixeiaqui: "Marks where the car is and walks you back to it",
  };
  PROJECTS.forEach((p) => { if (PJ_DESC_EN[p.id]) p.desc = PJ_DESC_EN[p.id]; });
  PROJECTS.forEach((p) => { if (PJ_DOMAIN_EN[p.id]) p.domain = PJ_DOMAIN_EN[p.id]; });
}

Object.assign(window, { LANG, t, toggleLang });
