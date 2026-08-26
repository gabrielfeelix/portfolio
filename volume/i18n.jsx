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
      fact: "A shorter path to purchase and a checkout rebuilt from session recordings",
      tldr: { papel: "UX/UI Designer, project owner",
        resultado: "A shorter path to purchase and a checkout rebuilt from session recordings" },
      figuras: {
        abertura: { legenda: "The V1 first fold: the campaign fills the screen and the first product only shows up after scrolling." },
        funil: { legenda: "The funnel over the analyzed period: where each step lost people, and the checkout drop at the end." },
        gravacao: { legenda: "Session recording: the person scrolls the checkout twice looking for a payment method and leaves without buying." },
        checkout: { alt: "V2 checkout with Pix, card, boleto and wallets visible before any scrolling",
          legenda: "The V2 checkout opens on the payment method. You know how you can pay before deciding whether to go on." },
        vitrine: { alt: "V2 storefront with filters on the left and a buy button on the product card",
          legenda: "In the storefront, buying no longer requires the product page: the button lives on the card, next to price and rating." },
        preco: { alt: "V2 product page with a sticky price column on the right",
          legenda: "On the product page, price and purchase stay pinned to the right. The decision doesn't depend on scrolling back up." },
        home: { alt: "V2 home with product carousel and promotion blocks",
          legenda: "The home now opens on product. The institutional blocks are still there, after the first buying carousel." },
        quickview: { legenda: "Quick view in the listing: judge the product, zoom the photo and buy without changing pages." },
        sku: { legenda: "The internal tool: SKU on one side, formatted description on the other." },
        contraste: { legenda: "Before and after the contrast and photography pass across the navigation." },
        libras: { legenda: "VLibras opened from the menu, translating the page in use." },
        contador: { alt: "Pre-order countdown running, with days, hours, minutes and seconds",
          legenda: "The countdown actually runs on screen, and the reservation number beside it is what's left. Scarcity that exists, not the kind the copy promises." },
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
        mspBuilder: { alt: "Step-by-step build with the eight component stages and the configuration summary",
          legenda: "Building from scratch runs through eight steps with compatibility checked and the total always in sight." },
      },
      abertura: { k: "The scene", t: "A site the company liked and the customer didn't use",
        p: ["PCYES sells hardware and peripherals to people who build their own PC. They arrive knowing the model they want, compare spec sheets against the competition and decide in minutes. The site they had wasn't built for that: it opened on a brand campaign, with video and animation filling the entire first fold, and the product started below the edge of the screen.",
            "What came to me was an aesthetic brief. Make it more minimal, cleaner, closer to a big brand. I agreed to look, but not to design before understanding why a beautiful store was selling less than it could. The first week went into watching people try to buy."],
        fig: "abertura" },
      problema: { t: "Nice to look at, hard to buy from",
        p: ["The first version was built on top of the brand: video, animation, a lot of institutional presence. It turned out beautiful and slow to buy from.",
            "People weren't reaching checkout. Buying anything meant opening the product page: the storefront, the home and the category pages had no add-to-cart. Every purchase cost clicks that didn't need to exist.",
            "And whoever did reach checkout didn't finish. The final step concentrated the drop-off, and it wasn't clear why.",
            "Added up, the site charged three tolls to someone who only wanted a mouse: find the product inside the campaign, open its page to be able to add it to the cart, and guess in the dark whether they could pay the way they wanted. Each of those tolls has its own way of losing the customer."],
        fig: "funil" },
      investigacao: { t: "Session recordings instead of opinion",
        p: ["Recordings in Microsoft Clarity, navigation and dwell-time metrics, and direct conversations with users about where they got stuck.",
            "I watched the recordings end to end, no skipping, noting the exact point where the person stopped moving forward. It's slow work and it's what holds up everything else: without it, the next meeting would be my opinion against the board's opinion, and mine loses.",
            "The board wanted a minimalist direction focused on brand value. On-site behavior pointed the other way. Instead of picking one, I proposed splitting the layers: the brand stays present at specific moments, and the path to purchase becomes the site's spine. I brought the recordings to back the proposal, and the final model was approved."],
        achados: ["Payment methods weren't visible in the checkout's first fold. Users only found out how they could pay after scrolling, and many left before that.",
                  "There were bugs in the payment module used in Magento. The failure showed up in the recordings before it showed up in any report.",
                  "The path to purchase was too long for the kind of product being sold."],
        fig: "gravacao" },
      citacao: { q: "The board asked for minimalism. Behavior on the site asked for a shortcut. Instead of picking one, I split the layers.",
        fonte: "The proposal that unlocked the project" },
      decisoes: [
        { d: "Payment methods in the checkout's first fold", fig: "checkout",
          r: "because the recordings showed people leaving before finding out how they could pay. Along the way I found a bug in the Magento payment module: the error showed up in the recorded session and in no report at all. I traced it to its origin in a public project of the extension and handed the tech team the exact spot to fix." },
        { d: "Add to cart straight from the home and the storefront", fig: "vitrine",
          r: "because requiring the product page charged clicks that didn't need to exist. Whoever already knows what they want buys from the card, and from the cart goes straight to checkout. Whoever is still deciding still has the full page available." },
        { d: "Price always visible", fig: "preco",
          r: "because the buying decision can't depend on scrolling back to the top: a sticky right column on desktop, a fixed bar at the bottom on mobile. It's the piece of information people check most often, and it was the one that kept disappearing." },
        { d: "A product-led home", fig: "home",
          r: "because the institutional content was taking the product's place: product carousels instead of brand blocks, promotions up front and a promo filter right at the category entrance. The brand didn't leave, it moved down one fold." },
        { d: "Quick view in the storefront", fig: "quickview",
          r: "because you should be able to judge the product without leaving the listing: a preview button, with photo zoom. Someone comparing three models doesn't lose their place in the list on every look." },
        { d: "Product copy generated from the SKU", fig: "sku",
          r: "because the spec sheets were inconsistent, each one written by a different person in a different year. I built an internal tool that generates the description HTML with heading hierarchy and pre-formatted images, using AI: what was manual and uneven became a standard." },
        { d: "Photography and contrast reviewed across the whole navigation", fig: "contraste",
          r: "because the site is dark and the light folds of the previous version made reading uncomfortable, especially for people browsing late at night, which is a good share of this audience." },
        { d: "VLibras integrated", fig: "libras",
          r: "because people whose first language is Libras buy here too. It cost little implementation time and it's the difference between the store serving that person or not." },
      ],
      recusei: { k: "What I turned down",
        p: "Not everything the research surfaced became a screen. Three things were left out on purpose.",
        itens: [
          { o: "Swapping one institutional home for another", r: "The minimalist direction that arrived ready solved the aesthetics and kept the product out of the first fold. I brought the recordings to the meeting and proposed the opposite of what had been asked." },
          { o: "Erasing the brand from the site", r: "After turning the table, the easy path would be to make everything a dry storefront. PCYES has personality and it sells. The brand stayed, at a set time and place." },
          { o: "Filing a ticket and waiting", r: "The payment module bug was blocking real purchases. Diagnosing it wasn't my job, but it was what unlocked the most expensive step in the funnel." },
        ] },
      solucao: { t: "Brand present, product on the spine",
        p: ["Instead of choosing between brand value and conversion, I split the layers: the brand appears at specific moments and the path to purchase becomes the site's spine.",
            "Home, storefront and checkout rebuilt to shorten the distance between arriving and buying.",
            "The system came with it: a Figma library with the components that show up across the whole purchase, so the tech team can implement without re-deciding spacing, state and color on every new screen."],
        legendas: ["On mobile, the same rule: the storefront buys without opening the product and the price stays fixed at the bottom of the screen.",
                   "The design system library: card, button, price and state designed once and used across the navigation."] },
      modulos: [
        { k: "Pre-order", t: "A reservation with counted slots and a date in plain sight",
          p: ["PCYES launches limited editions and a Maringá FC collection, and the V1 treated a launch like any other product: either it had stock, or it disappeared from the storefront.",
              "In the V2, a product announced before it ships goes into pre-order with a reservation. You see how many reservations are already gone, how many are left and the expected delivery date, and the card is only charged on dispatch.",
              "The scarcity here isn't invented urgency. The reservation count is real and so is the date, and that's what makes the bar work instead of annoy."],
          figs: ["prevenda", "contador"] },
        { k: "Build your PC", t: "Three paths to the same machine",
          p: ["Building a PC splits two audiences that don't mix: people who know the processor model they want, and people who only know the game they play. The old configurator served the first well and abandoned the second.",
              "The module's entrance asks one question and opens one of three paths. Pick one on the side to see how each behaves."],
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
          p: ["Two things came into the V2 that didn't exist before. The side cart, which opens over the page instead of taking people away, with the gift bar showing how much is missing to earn something, and PCYES Points, with balance, tiers and expiry open on screen.",
              "Both solve the same problem by different routes: give a reason to keep buying without charging another click to someone who already decided."],
          figs: ["sidecart", "points"] },
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
        p: ["Buying no longer requires the product page, the price stopped disappearing on scroll, and the payment method shows up before the person decides whether to go on. The final direction was approved and the date is set.",
            "I don't have operational results yet, and I'd rather not present a number that doesn't exist."],
        listaK: "What will be tracked after release",
        lista: ["Add-to-cart rate from the home and the storefront",
                "Checkout completion and drop-off per step",
                "Time between landing on the site and buying",
                "Payment error occurrences"] },
      aprendi: { p: ["Brand value and conversion were treated as opposite choices at the start of the project. They aren't. The problem wasn't the brand showing up, it was the brand taking the product's place in the page hierarchy.",
                     "And the most expensive lesson: walking into a hard conversation with session recordings instead of an opinion completely changes where the discussion goes.",
                     "Chasing the payment module bug down to its origin also bought more trust with the tech team than any presentation I could have made."] },
    },
    "locarmais-conciliacao": {
      domain: "SAAS", descriptor: "Financial reconciliation module", title: "Locar Mais", project: "Locar Mais",
      premise: "Is the amount that arrived the right amount? Finance couldn't answer.",
      role: "UX Designer, module owner",
      surface: "Management system · web", periodo: "In production",
      fact: "Replaced an external tool and wiped out the finance team's side spreadsheets",
      tldr: { papel: "UX Designer, module owner",
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
        { d: "History with a full trail", r: "because in a financial module, being able to answer 'who touched this and why' isn't a comfort, it's a requirement: automatic reconciliation, statement import and manual adjustment with author and timestamp." },
        { d: "Import from multiple sources", r: "because the user uploads statements from several acquirers in a single operation and gets the consolidated result: how many reconciled on their own, how many diverged and how many are pending, with a CSV export for each group." },
      ],
      solucao: { t: "Reconciling means finding what doesn't match",
        p: ["The module opens on what needs attention, not on what went right.",
            "In the same system I designed the monitoring dashboards used by operations and the board: portfolio classified by behavior, approved-versus-paid contract performance, targets per rep and churn for the period. Same logic: the dashboard opens on the critical state, with a quick filter, and the detailed table sits right below for whoever needs to dig in."] },
      resultado: { t: "In production, and the spreadsheets are gone",
        p: ["I don't have a formal before-and-after measurement, but three behavior changes happened and are verifiable. The team's feedback was of a faster process that's clearer to follow."],
        listaK: "What changed in the team's behavior",
        lista: ["The side spreadsheets are gone. The team kept several to control the process, one per front, and stopped using them after delivery.",
                "Finance stopped asking the development team for reports: the data became available in the platform itself.",
                "Reconciliation moved from an external tool to in-house, joining the operation's record and the acquirer's statement in one place."] },
      aprendi: { p: ["In a financial product, the most important screen isn't the one showing what went right. It's the one showing what doesn't match, and why.",
                     "I also learned the value of designing for the expected error. A system that only accepts the perfect path pushes the user out of it, usually into a side spreadsheet nobody audits."] },
    },
    odex: {
      domain: "DESKTOP AND WEB", descriptor: "Interface redesign", title: "ODEX", project: "ODEX",
      premise: "The platform had worked for years. It was the interface that had aged.",
      role: "UX/UI Designer",
      surface: "Platform · app · site",
      periodo: "Platform in progress · site in production · app in prototype",
      fact: "A legacy system brought up to date without changing the path of the people already using it",
      tldr: { papel: "UX/UI Designer",
        resultado: "A legacy system brought up to date without changing the path of the people already using it" },
      problema: { t: "The interface aged along with the product",
        p: ["The platform worked, and had worked for years. The problem wasn't the flow, it was the interface: an old layout that aged along with the product and ended up communicating less than the business already delivers today.",
            "This is a visual redesign project, and that's worth saying plainly. I didn't redesign the system's logic. I redesigned its entire surface."] },
      decisoes: [
        { d: "The whole screen base redesigned, with a navigable prototype", r: "because the team needed to judge the proposal in use, not as a static image." },
        { d: "New visual language, path untouched", r: "because in a system with years of use, changing the look without changing the path is the difference between modernizing and getting in the way." },
        { d: "App redesigned on its main screens", r: "because the mobile surface has to speak the same language. It's in prototype today: implementation hasn't entered the roadmap yet." },
        { d: "I took on the site implementation myself", r: "because the delivery was tied to an event with a fixed date and the development team had no window. I went straight into Magento: changed the home code, created and indexed the categories, rebuilt header and footer and fixed the redirects." },
        { d: "Validation with managers and the board", r: "because they are the ones who operate the system. Each version shipped as a navigable prototype, with comments recorded on the screens, and was adjusted before the next one." },
      ],
      solucao: { t: "The whole surface, nothing to relearn",
        p: ["The platform redesigned with a navigable prototype, the app's main screens in prototype, and the energy storage page created for the new battery line, explaining how the product works to an audience that doesn't know the technology yet."] },
      resultado: { t: "Live in time for the trade show",
        p: ["The site went into production within the event's date. The platform is still in progress and the app is in prototype."] },
      aprendi: { p: ["Redesigning a legacy system is more an exercise in restraint than in creation. The temptation is to reorganize everything. The right work is updating the interface without forcing the people who use the product every day to relearn where things are.",
                     "And that knowing how to touch the code changes what you can deliver. On this project it was the difference between arriving at the trade show with the new site or not arriving at all."] },
    },
    "oderco-revenda": {
      domain: "WEB", descriptor: "Reseller signup page", title: "Oderço", project: "Oderço",
      premise: "A long form, from a brand the visitor had never heard of.",
      role: "UX/UI Designer, from the flow to the automation",
      surface: "Landing page · form · RD Station", periodo: "Ready, staged rollout",
      fact: "Cut the sales team's systems from three to two",
      tldr: { papel: "UX/UI Designer, from the flow to the automation",
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
            "Filling it in stopped being an act of faith and became an informed decision."] },
      resultado: { t: "One system fewer in sales",
        p: ["The result I hadn't predicted: to build the automation I went after the RD Station API and documented how it worked. That showed the development team the integration was simpler than it looked, and they started connecting RD to the internal CRM.",
            "The consequence was organizational. Operations used three systems for the same process: one is out, and the path now is consolidating everything inside the in-house CRM, now that the flow has been validated in practice with the reps.",
            "The rollout is staged on purpose. First it takes only ad traffic, which is where the problem showed up hardest, and only then does it replace the official site's signup page. So far it has been tested with internal users and a small group of external ones."],
        listaK: "What will be tracked in this first phase",
        lista: ["Completion of each step",
                "Drop-off between step 1 and step 2",
                "Quality of the leads reaching sales"] },
      aprendi: { p: ["A short form isn't a goal in itself. What matters is where you cut. Cutting at the right point turns a drop-off into a recoverable contact.",
                     "And most of the work wasn't in the form. It was in answering, before it, the question the visitor was asking in silence: who is this company and why should I trust it."] },
    },
    portfolio: {
      domain: "WEB · MANIFESTO", descriptor: "This volume you are reading",
      premise: "A portfolio read like a manga volume.",
      role: "Concept, design and build",
      surface: "Website · Manifesto", periodo: "Live",
      fact: "You are reading the result",
      tldr: { papel: "Idea, design and code, from concept to live",
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
        p: ["A list of chapters, a manga page turn, ink motion and screentone. A fast path for the recruiter, a deep path for whoever wants the full case.",
            "Actually built: from navigable prototype to published site."] },
      resultado: { t: "You are reading the result",
        p: ["The reading brought you this far. If the navigation worked, the argument proved itself."] },
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
    { t: "Adjust", p: "I cut what doesn't serve. Constraint sharpens the decision." },
    { t: "Deliver / Build", p: "Prototype becomes product, live. I design and I build." },
  ];
  PROCESSO.forEach((s, i) => Object.assign(s, PROC_EN[i]));

  /* companies */
  const CO_EN = {
    ttt: { role: "Where I started", period: "Early career", note: "First real products",
      blurb: "My first contact with real product work. Where the urge to design and build became a craft.",
      story: [
        { k: "What I did", p: "Quick research, information architecture and low and high fidelity prototyping. I took the whole cycle, from framing the request to the documentation the dev team built from." },
        { k: "The challenge", p: "It was my first contact with product that actually shipped. Understanding that a screen doesn't end in Figma, and that thin documentation becomes someone else's rework, was what the period was about." },
        { k: "What I learned", p: "To write for whoever implements. Labels, empty states, what happens when a field fails: if that isn't in the spec, someone decides for you, and usually decides on the fly." },
      ],
      skills: [
        { k: "Information architecture", p: "content and navigation structure for the first screens" },
        { k: "Prototyping", p: "low and high fidelity in Figma, from sketch to clickable" },
        { k: "Quick research", p: "gathering references and context before designing" },
        { k: "Documentation and handoff", p: "specifying states and behaviour for the dev team" },
      ] },
    locar: { role: "Real product work", period: "Product", note: "IMMO, Signamais and co.",
      blurb: "Where I designed real product and learned the handoff end to end.",
      story: [
        { k: "The context", p: "SaaS products for the real estate and rental market. Locarmais, IMMO, Locar Fácil and Signa Mais share a dev team and part of the user base, so interface decisions rarely stayed inside a single system." },
        { k: "What I built", p: "The financial module from scratch, the heaviest project of the period: reconciliation with five statuses, acquirers with different fees, taxes and payout terms, automatic, batch and forced reconciliation with mandatory justification, statement imports from several sources, and a history trail with author and timestamp. Also the Signa Mais e-signature platform and the agency portfolio dashboards." },
        { k: "The challenge", p: "Reconciliation is dense business logic and every acquirer has its own. The way through was interviewing and shadowing the finance team running the process on spreadsheets, then turning that into screens usable without training." },
        { k: "The result", p: "The module went to production and replaced a paid reconciliation platform. The finance team stopped keeping parallel spreadsheets and stopped filing tickets with the dev team to pull reports." },
        { k: "What I learned", p: "This is where I tested with actual users of the system, not colleagues. Watching someone stall on a screen I considered obvious changed how I write labels and order fields." },
      ],
      skills: [
        { k: "Process mapping", p: "interviews and shadowing the finance team in operation" },
        { k: "Business logic on screen", p: "multi-acquirer reconciliation, five statuses, audit trail" },
        { k: "Testing with real users", p: "users of the system itself, not proxy users" },
        { k: "Dashboards and metrics", p: "portfolio, contract conversion, targets and churn" },
        { k: "Handoff", p: "flow documentation and support through refinement and QA" },
      ] },
    oderco: { role: "Design for a team of brands", period: "Current", note: "PCYES, Odex, Tonante, Vinik, Skul",
      blurb: "Today. I run design for a whole team of brands, from e-commerce to SaaS.",
      story: [
        { k: "The context", p: "A national electronics distributor with five in-house brands (PCYES, Vinik, Skul, Odex and Tonante), each with its own audience and channel, plus the internal systems. I'm the only designer, so the queue and the prioritising are mine too." },
        { k: "What I built", p: "The PCYES e-commerce redesign, including the component library and palette the whole site runs on. The Odex platform interface and the energy storage page for the new battery line. The Oderço reseller signup page, with a two-step form and automatic company lookup." },
        { k: "The challenge", p: "At PCYES the board wanted a minimal direction focused on brand value, and the metrics called for a shorter path to purchase. I brought session recordings into the conversation and proposed separating the two layers instead of choosing between them: the brand shows up at defined moments and the product holds the spine of the page. That's the model that got approved." },
        { k: "What I learned", p: "On the storage page the dev team had no window and the trade show had a date, so I implemented it straight in Magento: changed the home, created and indexed categories, rebuilt header and footer, fixed redirects. Designing while knowing what implementation costs changed what I propose." },
        { k: "Side effect", p: "While documenting the RD Station API for the lead routing automation, the dev team saw that connecting RD to the internal CRM was viable. The operation ran on three parallel systems and went down to two." },
      ],
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
    "Hi Gabriel! I came from your portfolio and I'm interested in your UX/UI Design work.");

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
  };
  PROJECTS.forEach((p) => { if (PJ_DESC_EN[p.id]) p.desc = PJ_DESC_EN[p.id]; });
  PROJECTS.forEach((p) => { if (PJ_DOMAIN_EN[p.id]) p.domain = PJ_DOMAIN_EN[p.id]; });
}

Object.assign(window, { LANG, t, toggleLang });
