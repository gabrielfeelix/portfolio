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
    rodape: {
      domain: "MOBILE", descriptor: "Book club app",
      premise: "[premise, the line that opens the chapter]", role: "[your role]",
      fact: "Published on the Play Store",
      tldr: {
        papel: "Concept, design and build (Android), solo",
        oque: "A book club app: organize readings and everything happening in the club",
        resultado: "Published on the Play Store [confirm numbers/usage]",
      },
      problema: { t: "A book club scattered everywhere",
        p: ["Whoever runs a book club lives between a group chat, a loose list and memory: what to read, by when, who read it. There is no single place for it.",
            "The constraint I embraced: take it from concept to published app alone, from design to code."] },
      decisoes: [
        { d: "Focus on the club ritual, not another books app", r: "because the value is in organizing collective reading: I designed around that ritual. [confirm main features]" },
        { d: "Native Android, lean build", r: "because with AI in the build flow I could go from prototype to published faster, without taking my hand off the design." },
        { d: "Lean scope to actually ship", r: "because a published app proves more than a pretty prototype: I cut everything non-essential to reach the Play Store." },
      ],
      solucao: { t: "From concept to the Play Store", p: ["A book club app designed and built from zero to publication on the Play Store. [confirm main screens/features]"], slots: 3 },
      resultado: { t: "Live, for real", p: ["Published on the Play Store: from concept to a real app, solo. [confirm downloads / learnings]"] },
    },
    remoctrl: {
      domain: "DESKTOP · APP", descriptor: "Universal smart TV remote",
      premise: "One remote for every TV, with no ads and no apologies.",
      role: "Concept, UX and app build (Tauri + React).",
      fact: "One codebase (Tauri 2.0) running on desktop and mobile; automatic TV discovery",
      tldr: {
        papel: "Product, UX and build (Tauri 2.0, React/TS)",
        oque: "Universal smart TV remote: Roku, Samsung and LG in a single app",
        resultado: "Always-on-top floating modal with a global hotkey; multi-brand [confirm roadmap stage]",
      },
      problema: { t: "One remote per brand, all of them bad",
        p: ["If you own TVs from different brands you end up with one app for each, almost all full of ads, hostile paywalls and telemetry.",
            "The constraint: unify Roku, Samsung (Tizen) and LG (webOS), which speak different protocols, into one honest, instant interface."] },
      decisoes: [
        { d: "Tauri 2.0: one codebase for desktop and mobile", r: "because maintaining two native apps is rework. Rust + WebView ships light on both ends." },
        { d: "Always-on-top floating modal with a global hotkey (Ctrl+Shift+N)", r: "because a remote is a 2-second interaction: it has to appear above everything and vanish, without switching windows." },
        { d: "Automatic TV discovery (SSDP/mDNS) + zero ads, zero hostile paywall", r: "because the pain is exactly the friction of the official apps: I find the TV on my own and removed everything that gets in the way." },
      ],
      solucao: { t: "One app, three brands, two seconds", p: ["A universal remote that discovers the TV on the network and speaks Roku ECP, Samsung Tizen (WebSocket) and LG webOS. D-pad, power, volume and app shortcuts in a floating modal with a global hotkey: no ads, no telemetry."], slots: 2 },
      resultado: { t: "Honest by design", p: ["The bet is simple: a remote that respects the user (no ads, no tracking) beats any friction-heavy official app. [confirm roadmap stage / release]"] },
    },
    traxium: {
      domain: "SAAS", descriptor: "SaaS platform",
      premise: "Export agrologistics compliance does not fit in a spreadsheet.",
      role: "Concept, UX and navigable prototype: from concept to the benchmarking version.",
      surface: "Web · SaaS (+ driver app preview)",
      fact: "18 navigable screens, from dashboard to the TRACES NT gateway, plus a driver app preview",
      tldr: {
        papel: "Research, information architecture, UI and navigable prototype (Next.js 16 + shadcn/ui)",
        oque: "Compliance SaaS for a grain carrier: EUDR, IDTF, TRACES NT and the driver app in one place",
        resultado: "18-screen prototype for benchmarking and validation; evolution roadmap defined [confirm current stage]",
      },
      problema: { t: "Regulatory risk managed by hand",
        p: ["Hauling grain for export today means swimming in rules: EUDR, GMP+ certification, T-3 sequencing, farm validation against INPE/MapBiomas/CAR, the TRACES NT gateway. All of it usually lives in loose spreadsheets and people's heads: risk of blocks and fines on every trip.",
            "The real constraint: the manager at the office and the driver on the road must see the same status, and the block signal can never be ambiguous."] },
      decisoes: [
        { d: "Principle: clarity over aesthetics, the regulatory signal is never ambiguous", r: "because this is a risk engine: critical status (block, NC, expired certification) uses color, icon AND label at once, never color alone." },
        { d: "Dense back office + driver app preview in the same prototype", r: "because the value only shows when both sides speak the same language. I modeled a blocked trip (IDTF rules engine, T-3) to prove the flow end to end." },
        { d: "Client-side prototype with editable mock data", r: "because it lets me generate variations and validate with stakeholders in days: the navigable prototype becomes the decision table before burning backend." },
      ],
      solucao: { t: "The risk engine, navigable",
        p: ["Operational dashboard (KPIs, compliance score, NCs, EUDR risk), trips with tracking and blocks, LCI/IDTF checklists, fleet and drivers, EUDR farm polygons, export batches, TRACES NT gateway and audit: 18 routes, plus an interactive driver app preview in a phone frame.",
            "Its own design system (teal + blue, dark sidebar): dense, distinctive, readable at a glance."], slots: 3 },
      resultado: { t: "From spreadsheet to a prototype that decides", p: ["Stakeholders start discussing the product by touching it. The evolution roadmap is mapped: multi-tenant backend with RLS, Leaflet/EUDR map, real TRACES NT and a React Native app, with UX research with drivers in Rondonópolis. [confirm current stage]"] },
    },
    pcyes: {
      domain: "E-COMMERCE", descriptor: "Site · e-commerce",
      premise: "Selling hardware to people who know hardware takes more than a shopfront.",
      role: "UX/UI and build of the e-commerce (v3), reading behavior along the flow.",
      fact: "Games & hardware e-commerce for Grupo Oderço (version 3)",
      tldr: {
        papel: "Design and build of the store + behavior reading (Clarity/Hotjar)",
        oque: "PCYES store for games, peripherals and setups: dark identity, conversion first",
        resultado: "Store live; iterations driven by heatmaps [confirm metrics]",
      },
      problema: { t: "Demanding audience, generic shopfront",
        p: ["Gamers scan fast and distrust a store with no soul. The previous version didn't pull the audience nor make clear what PCYES does best: setups, launches, good peripherals.",
            "Constraint: keep the brand's strong dark identity without sacrificing readability or purchase speed."] },
      decisoes: [
        { d: "Rebranding + reworked home, mobile-first page by page", r: "because the store had to feel like part of the gamer's setup, not a bright generic template. I redid the identity and the home before touching anything else." },
        { d: "Guided 'Build your PC' + profile with points and a rewards sidebar", r: "because building a PC is a complex decision (I broke it into a friendly flow) and gamers respond to gamification: points and rewards in the sidebar give a reason to come back." },
        { d: "Checkout in steps with content review, validated with heatmaps", r: "because an abandoned cart is money on the floor: clear steps, review before closing, and Clarity/Hotjar to read where eyes and clicks go. Tested with employees and customers, then iterated." },
      ],
      solucao: { t: "A dark, gamified, data-driven store",
        p: ["E-commerce v3 (React/Vite SPA) with a reworked home of banners and setup showcases, a guided 'Build your PC' flow, a profile with points and rewards in the sidebar, and a step checkout with review.",
            "Behavior monitored with Clarity/Hotjar and validated in tests with employees and customers, to sharpen the decision each cycle."], slots: 3 },
      resultado: { t: "Decisions by data, not gut feeling", p: ["The page's heat became a design argument: what nobody saw was cut; what converted gained weight. Gamification gave a reason to return. [confirm conversion / sales result]"] },
    },
    portfolio: {
      domain: "WEB · MANIFESTO", descriptor: "This volume you are reading",
      premise: "A portfolio read like a manga volume.",
      role: "Concept, design and build",
      fact: "You are reading the result",
      tldr: {
        papel: "Idea, design and code, from concept to live",
        oque: "A portfolio shaped like manga: reading well is the argument",
        resultado: "This site. Manga, ink and brutalism in service of reading",
      },
      problema: { t: "Prove UX without saying I do UX",
        p: ["The average portfolio lists screens and job titles. I wanted the navigation itself to be the proof: if I guide you well through here, I have already answered whether I can guide a user.",
            "The constraint I chose: no generic template. It had to look like me."] },
      decisoes: [
        { d: "Manga volume format", r: "because guiding the reading well IS the UX skill I want to prove. The metaphor serves the reading, never gets in its way." },
        { d: "B&W with red only on interaction", r: "because at rest it is ink on paper; color appears when you act. The interface comes alive at the touch, like an adaptation." },
        { d: "Typographic brutalism (Anton, panels, thick strokes)", r: "because I have loved manga and brutalism since I was a kid, and both demand obvious hierarchy and impact, no frills." },
      ],
      solucao: { t: "Cover, chapters, process and afterword",
        p: ["A coverflow of projects, a manga page turn, ink motion and screentone. A fast path for the recruiter, a deep path for whoever wants the full case.",
            "Actually built: from navigable prototype to published site."], slots: 3 },
      resultado: { t: "You are reading the result", p: ["The reading brought you this far. If the navigation worked, the argument proved itself."] },
    },
    odex: {
      domain: "SAAS · SOLAR", descriptor: "The solar integrator's platform (Hub v3)",
      premise: "Redesign the solar integrator's platform to feel like a store, not a system.",
      role: "Full redesign (UX/UI), navigable mockup build and validation lead.",
      surface: "Web · SaaS (solar integrator)",
      fact: "Redesign of Odex platform v3 (Hub Oderço): commercial focus and usability for the integrator",
      tldr: {
        papel: "End-to-end redesign, mockup build and a sprint-by-sprint feedback loop",
        oque: "The platform where the solar integrator builds kits, quotes and buys, with an e-commerce feel",
        resultado: "Full mockup validated sprint by sprint, ready to pair with backend [confirm status]",
      },
      problema: { t: "A platform that feels like a system, not a store",
        p: ["The solar integrator needs to build a kit, quote and buy fast, but the previous version felt like an ERP: locked flow, no commercial feel, hard to buy on impulse.",
            "And there were the rules only the internal team knows (freight in rural areas, 'no client' turning into 'expired', e-mails blocked for fraud, the direct sale bonus): without them, a pretty screen fails at the detail that matters."] },
      decisoes: [
        { d: "Redesign with an e-commerce feel + cart pinned to the topbar", r: "because the integrator must be able to buy at any moment. I removed the ERP weight and gave it store fluidity, focused on their ease of use." },
        { d: "A friendly 'Build your kit', guided in steps", r: "because building a solar kit is a technical decision: I broke it into clear steps to reduce error and abandonment." },
        { d: "Validation walkthrough with the stakeholder before coding rules", r: "because this was not discovery, it was validation: I aligned visual direction and the team's business rules. Every sprint closed with a recorded demo: the feedback loop the client herself suggested." },
      ],
      solucao: { t: "ERP became a guided store",
        p: ["Commercial home, category navigation, an always-available cart in the topbar and a step-by-step 'Build your kit'. Behind it: client search pre-filling the quote, editable validity with WhatsApp share, orders with invoice download (PDF/XML/DANFE), a PDP with calculator, Direct Sale Bonus and Reports.",
            "Editable mock instead of backend, to validate early and generate variations in front of the client: backend paired per iteration, no assumption hidden in code."], slots: 3 },
      resultado: { t: "Buying became impulse, not a mission", p: ["The platform stopped feeling like a system and started guiding the integrator from choice to purchase. A 6 to 8 sprint roadmap, blockers cleared first, backend dependencies explicit in the plan. [confirm backend stage]"] },
    },
    ponto: {
      domain: "SAAS · TIME TRACKING", descriptor: "Time tracking: manager SaaS + cleaner's app",
      premise: "Every minute counted with precision: on both sides.",
      role: "Product, UX and build of the management SaaS + app, on Supabase.",
      fact: "Manager panel + cleaner's app, same base (Supabase)",
      tldr: {
        papel: "Design and build of the admin (SaaS) and the app, Supabase backend",
        oque: "Time tracking for cleaners: the manager runs the operation, the cleaner clocks in",
        resultado: "A single source of hours for both sides [confirm usage]",
      },
      problema: { t: "Clock-ins on paper and WhatsApp",
        p: ["Whoever coordinates cleaners tracks hours in notebooks and chats: the manager does not trust the record, the cleaner has no proof, and nobody has a single source.",
            "The constraint: the record must be reliable enough to close payments, and simple enough for the cleaner to use on the phone."] },
      decisoes: [
        { d: "Two products, one base: manager panel + cleaner's app", r: "because the hour rules are the same on both sides: a single Supabase base avoids divergence and disputes." },
        { d: "'Every minute counted with precision': reliable records over pretty screens", r: "because clock-ins are money: the interface exists to build trust in the number, not to decorate." },
        { d: "Login and panel designed to 'run the operation'", r: "because the manager comes in to solve, not to explore: I open straight into what matters." },
      ],
      solucao: { t: "Manager runs it, cleaner clocks in", p: ["A SaaS panel for the manager to run the operation and close hours, and an app for the cleaner to clock in: same database (Supabase), precise and provable records on both sides."], slots: 2 },
      resultado: { t: "Hours become data, not arguments", p: ["The guesswork of hours becomes a single trustworthy record. [confirm adoption / payment closing]"] },
    },
    dropchina: {
      domain: "E-COMMERCE · SHOPIFY", descriptor: "Own store for a Mercado Livre Platinum seller",
      premise: "Turn marketplace reputation into an own brand.",
      role: "Shopify store (Liquid theme) + catalog automation.",
      fact: "Migration of a Mercado Livre Platinum seller (50k+ sales) to an own channel",
      tldr: {
        papel: "Shopify store setup and customization + catalog scripts (Admin API)",
        oque: "An own store for IT supplies, leaving marketplace dependence behind",
        resultado: "A direct channel with the customer, keeping the Platinum trust [confirm sales]",
      },
      problema: { t: "Hostage to the marketplace",
        p: ["A Platinum seller with 50k+ sales stuck on Mercado Livre: high fees, zero direct relationship with the customer, no own brand and a price war.",
            "Plus the classic anti-pattern of whoever migrates: generic theme, SKUs registered by hand and no identity. The customer does not notice they left the marketplace."] },
      decisoes: [
        { d: "An own channel WITH a brand, not another generic clone", r: "because the reputation had to become a brand: consistent identity (DropChina blue, burnt orange) and a Mercado Livre Platinum badge to carry over the trust that already existed." },
        { d: "Smart collections by tag, not hand-made categories", r: "because 7 auto-populated collections scale merchandising with no manual work: the manual-category anti-pattern stalls the operation." },
        { d: "Catalog automated via Admin API (CLI scripts)", r: "because registering 28 SKUs with structured descriptions (overview, specs, compatibility) by hand guarantees errors and delay." },
      ],
      solucao: { t: "Marketplace becomes brand", p: ["A Shopify store (customized Tinker theme) with 7 smart collections, 28 SKUs migrated and described in a structured way, PT header/footer with the Platinum badge and a brand palette: a catalog assembled by scripts, no manual typing."], slots: 3 },
      resultado: { t: "From rented shelf to own store", p: ["The seller now has a direct customer relationship and a recognizable brand, without letting go of the Platinum trust. [confirm own-channel sales]"] },
    },
    isabella: {
      domain: "WEBSITE · ARCHITECTURE", descriptor: "Website for architect Isabella Pires",
      premise: "Good projects do not start with floor plans, they start with listening.",
      role: "Concept, UX and build of the institutional site.",
      surface: "Website · Institutional",
      fact: "Architect Isabella Pires' site: 'Spaces that reflect who you really are'",
      tldr: {
        papel: "Design and build of the one-page site",
        oque: "Institutional architecture site: residential, commercial and interiors",
        resultado: "A live site that sells the method (listening), not just the photo [confirm leads]",
      },
      problema: { t: "An architect's site that only shows pretty photos",
        p: ["Architecture portfolios are usually cold galleries: gorgeous photo, zero story. Her differentiator (listening before drawing, creating spaces with soul) disappeared.",
            "The constraint: translate that differentiator in seconds and turn visits into contact."] },
      decisoes: [
        { d: "The hero sells the proposal, not just the image", r: "because the differentiator is listening: 'spaces that reflect who you are' leads before the gallery." },
        { d: "Two clear paths: see projects OR get in touch", r: "because architecture clients decide by affinity: I made both gestures easy, no noise." },
        { d: "Warm, sophisticated tone, mobile-first", r: "because the brand is welcoming: the site had to sound like she does." },
      ],
      solucao: { t: "Who she is, before what she does", p: ["An institutional site with a proposal-led hero, services (residential, commercial, interiors), project portfolio, about and contact: warm, mobile-first, walking the visitor to the contact."], slots: 2 },
      resultado: { t: "More than a gallery", p: ["The site tells the story before showing the floor plan: affinity first, project second. [confirm leads / contacts]"] },
    },
    locarmais: {
      domain: "WEBSITE · DIGITAL GUARANTOR", descriptor: "Website for digital guarantor Locarmais",
      premise: "One product, three audiences, one page: without turning into a mess.",
      role: "Design and build of the institutional site.",
      surface: "Website · Institutional",
      fact: "Locarmais' site, 'Your Digital Guarantor': a rent guarantee that waives guarantor and deposit",
      tldr: {
        papel: "Design and build of the institutional site",
        oque: "Site for the digital rent guarantee replacing guarantor/deposit",
        resultado: "A complex product became a clear pitch for all three audiences [confirm conversion]",
      },
      problema: { t: "Convince agency, tenant and landlord at once",
        p: ["A digital rent guarantee has to speak to three audiences with different fears: the agency wants speed and less fraud, the tenant wants approval without a guarantor, the landlord wants guaranteed rent.",
            "The constraint: say all of it in a single page, without the site becoming a patchwork."] },
      decisoes: [
        { d: "Dedicated sections per audience", r: "because each one wants to hear a different thing: I split the message for agency, tenant and landlord instead of one generic speech." },
        { d: "Social proof at the center (real testimonials)", r: "because a guarantee is about trust: someone who used it and got approved fast sells better than any promise." },
        { d: "A clear promise at the top", r: "because 'save time, protect your client and raise profitability' sums up the value before the scroll wears out." },
      ],
      solucao: { t: "Three conversations, one page", p: ["An institutional site that explains the digital guarantee to each audience, with strong social proof and clear CTAs: translating a complex financial product into a simple pitch."], slots: 2 },
      resultado: { t: "Complex became clear", p: ["The digital guarantee stopped needing explanation and started selling itself to all three sides. [confirm conversion / leads]"] },
    },
    web2design: {
      domain: "TOOL · DESIGN", descriptor: "Extension + Figma plugin: the web becomes an editable layer",
      premise: "Read first, choose later: the web becomes a layer in Figma.",
      role: "Concept, UX and build (Edge extension + Figma plugin).",
      surface: "Tool · Extension + Figma",
      fact: "Extension (Edge) + Figma plugin converting web pages into editable layers",
      tldr: {
        papel: "Design and build of the extension, the relay and the plugin",
        oque: "Captures a page or element from the web and sends it to Figma as editable layers",
        resultado: "Web → Figma with no manual copying and no third-party cloud [confirm usage]",
      },
      problema: { t: "Web references locked outside Figma",
        p: ["Designers keep recreating web references by hand inside Figma: slow and imprecise. And the tools that do it live in third-party clouds, costing privacy.",
            "The constraint: bring the page in as a real layer (color, typography, structure), keeping control and privacy."] },
      decisoes: [
        { d: "'Read first, choose later': capture → validate → download/copy", r: "because blind auto-magic conversion produces garbage: I give control to capture the whole page or a single element and check it first." },
        { d: "Self-hosted (own relay)", r: "because privacy matters: 'Send to Figma' runs on your relay, without handing data to a third-party cloud." },
        { d: "Multiple import paths (relay, upload, clipboard, Transfer ID)", r: "because designer workflows vary: I gave more than one door to the same delivery." },
      ],
      solucao: { t: "DOM becomes layers, with style generation", p: ["Extension (Edge, MV3) + Figma plugin with full-page or element capture, automatic color and typography generation, capture history and a self-hosted relay for the 'Send to Figma' flow."], slots: 2 },
      resultado: { t: "From page to Figma, no rework", p: ["Web references land editable in Figma in seconds, with privacy. [confirm usage / adoption]"] },
    },
    "4yu": {
      domain: "WEBSITE · LP", descriptor: "Sales landing page (4YU MKT)",
      premise: "A sales landing that goes straight to the point.",
      role: "Design and build of the landing page.",
      surface: "Website · Landing page",
      fact: "4YU MKT sales landing page",
      tldr: { papel: "Design and build of the LP", oque: "4YU sales landing page [confirm offer]", resultado: "[confirm conversion / status]" },
      problema: { t: "Sell in one page", p: ["A sales landing lives or dies on offer clarity and speed. [confirm 4YU's offer and audience]"] },
      decisoes: [
        { d: "Lean conversion structure", r: "because an LP is focus: promise, proof and CTA, no detours. [confirm]" },
        { d: "[confirm decision]", r: "because [confirm]" },
      ],
      solucao: { t: "Promise, proof, CTA", p: ["A sales landing page focused on conversion. [confirm real sections/offer]"], slots: 2 },
      resultado: { t: "[confirm result]", p: ["[confirm conversion / learnings]"] },
    },
    "kitamo-app": {
      domain: "SAAS · FINANCE", descriptor: "Personal finance SaaS (mobile)",
      premise: "The end of spreadsheets: your money, visible today.",
      role: "Product, UX and build (Laravel 12 + Vue 3/Inertia).",
      surface: "SaaS · Mobile (online)",
      fact: "Personal finance SaaS live (kitamo.com.br). MVP, mobile-first",
      tldr: {
        papel: "Full-stack design and build (Laravel + Vue/Inertia/Tailwind)",
        oque: "Personal finance that projects next month, not just last month's statement",
        resultado: "MVP live and online; next step is an Android app [confirm usage]",
      },
      problema: { t: "“Will I be able to pay next month's bills?”",
        p: ["Money tracking becomes an abandoned spreadsheet or an open-banking app nobody trusts. And neither answers the question that matters: can I pay next month?",
            "The constraint: give visibility of future cash with reliable manual entry, without depending on automatic bank integration."] },
      decisoes: [
        { d: "Reliable manual entry, no automatic open banking", r: "because users distrust connecting their bank: manual control, but with projection, gives clarity without fear." },
        { d: "Projection of next month, not just the past statement", r: "because the real pain is anticipating: I show upcoming card bills and expenses to answer 'will I make it?'." },
        { d: "Mobile-first, fully online, no card to try it", r: "because finance is a daily habit on the phone: I removed the entry friction ('takes 2 minutes, no credit card')." },
      ],
      solucao: { t: "Your month, visible before it happens", p: ["A mobile SaaS (Laravel 12 + Vue 3/Inertia) giving debt visibility, spending clarity, bill projection and planning for next month's expenses: reliable manual entry, fully online."], slots: 2 },
      resultado: { t: "Close the month with peace of mind", p: ["From 'will it work out?' to 'I know it will'. MVP live; the next step is becoming an Android app. [confirm usage / user numbers]"] },
    },
    "oderco-checkout": {
      domain: "E-COMMERCE · B2B", descriptor: "B2B invoice checkout (Grupo Oderço)",
      premise: "B2B invoice purchasing can't be a leap-of-faith form.",
      role: "UX and build of the checkout flow (steps + review).",
      fact: "Grupo Oderço's B2B checkout: invoice purchasing, per branch, with RMA credit",
      tldr: {
        papel: "Design and build of the step checkout, with review",
        oque: "B2B invoice checkout: logistics, payment and review per branch",
        resultado: "Flow tested with employees and customers [confirm adoption]",
      },
      problema: { t: "High-value B2B orders, zero margin for error",
        p: ["Wholesale invoice purchasing involves branches, freight (CIF/FOB/pickup), credit (RMA/deposit) and orders worth thousands. Mistakes are expensive, and the flow had to build confidence before confirming.",
            "The constraint: be friendly without hiding what the B2B buyer needs to check."] },
      decisoes: [
        { d: "Broke it into steps with a final review (Cart → Order → Review)", r: "because a large B2B order demands checking: reviewing the content before closing cuts error and insecurity." },
        { d: "Branch summary and order progress always in sight", r: "because the buyer needs to see items, total and where they are in the flow at all times: no blind checkout." },
        { d: "Tested with real employees and customers", r: "because invoice buyers have quirks (freight, RMA credit) that only show up in use. I iterated with them before closing." },
      ],
      solucao: { t: "B2B checkout in steps, no scares", p: ["A flow per branch and invoice: logistics (CIF/FOB/pickup) with freight options, credit use (RMA/deposit), payment method and final review: with the branch summary and order progress always visible."], slots: 2 },
      resultado: { t: "Confidence to close big orders", p: ["Steps and review gave the B2B buyer the control that was missing, tested with employees and customers. [confirm adoption / error reduction]"] },
    },
    "hub-oderco": {
      domain: "SAAS · TOOL", descriptor: "Multi-brand marketing hub",
      premise: "Seven brands, one visual standard, zero rework.",
      role: "Concept, UX and build of the internal tool.",
      surface: "Web · Internal tool",
      fact: "Serves 7 group brands: PCYES, Azux, Odex, Tonante, Quati, Skul, Vinik",
      tldr: {
        papel: "Design and build of the hub + AI content generation",
        oque: "Products & services hub: generates promo material and technical descriptions for 7 brands",
        resultado: "Standardization and speed for the group's brands [confirm time saved]",
      },
      problema: { t: "Each brand its own way; no standard",
        p: ["Seven brands created promo material and product descriptions by hand. Slow, inconsistent, and everyone reinvented the template from scratch.",
            "The constraint: standardize without stiffening: seven different identities had to fit one tool."] },
      decisoes: [
        { d: "Started by solving the daily user's pain", r: "because the tool was born internal (PCYES): I interviewed the people suffering the manual process before designing." },
        { d: "AI technical description generation in the flow", r: "because the bottleneck was writing repetitive product copy. AI removes the boring work and keeps the standard." },
        { d: "One hub, seven brand themes", r: "because centralizing the engine and swapping only the skin guarantees visual coherence without locking any brand." },
      ],
      solucao: { t: "One engine, seven brands live", p: ["A platform centralizing promo material creation, generating descriptions via AI and offering e-mail marketing tools: it grew from a PCYES internal tool into the whole group's hub."], slots: 3 },
      resultado: { t: "From internal tool to the group's platform", p: ["What was a PCYES shortcut scaled to seven brands. Standardization became the default, not an effort. [confirm usage numbers / time saved]"] },
    },
    argel: {
      domain: "APP · BOXING", descriptor: "Boxing gym management app",
      premise: "Running a training center shouldn't steal training time.",
      role: "Product, UX and build: management web + student app.",
      fact: "The Argel Riboli Boxing Team system: check-ins + recurring payments",
      tldr: {
        papel: "Design and build of the monorepo (management web + mobile app)",
        oque: "Student check-in control and recurring payments for the gym, with a student app",
        resultado: "Full system designed and built [confirm usage status]",
      },
      problema: { t: "Attendance and dues in a notebook",
        p: ["Student check-ins and monthly dues were handled manually, scattered across notebooks and WhatsApp. Late payments vanished, attendance never became data, and the coach lost mat time to admin.",
            "The constraint: simple enough for the coach to use between rounds, and light enough for students to check in on their phones."] },
      decisoes: [
        { d: "Interviewed coach and students before designing", r: "because the actual users had a specific routine: I tested the prototype with them and iterated to the first version." },
        { d: "Monorepo: management web + student app, shared code", r: "because business rules are the same on both sides: sharing avoids divergence and rework." },
        { d: "React Native (Expo) for the app", r: "because students live on their phones, and Expo lets me build and ship from prototype to real app fast." },
      ],
      solucao: { t: "Management at the desk, training in the pocket", p: ["A web platform for the coach to manage students, training and routine, and a mobile app for students to follow along: one codebase, two surfaces."], slots: 2 },
      resultado: { t: "From notebook to system", p: ["The gym gained a single source of truth instead of loose notebooks. [confirm adoption / store release]"] },
    },
    "solar-site": {
      domain: "WEBSITE · LP", descriptor: "Lead capture landing page",
      premise: "Sell method, not discounts: the way out of the price war.",
      role: "UX/UI and build of the landing (React + Vite).",
      surface: "Website · Landing page",
      fact: "The Solar Buy-Side Manual LP: a method for solar energy sellers",
      tldr: {
        papel: "Design and build of the landing (React/TS/Tailwind, Vite)",
        oque: "LP for the method that teaches solar sellers to use the 'buyer's code' to convert",
        resultado: "Landing live, mobile-first, focused on capturing whoever wants out of the price game [confirm leads]",
      },
      problema: { t: "Sellers stuck in the price war",
        p: ["Solar energy sellers compete on discount and disappear in the crowd. The Solar Buy-Side Manual teaches reading the 'buyer's code' to convert on value, but the LP had to sell that method in seconds, to a skeptical audience.",
            "The constraint: translate dense educational content into a clear promise, without becoming another generic info-product."] },
      decisoes: [
        { d: "Promise before feature: 'escape the price war'", r: "because that is the seller's real pain. The hero sells the transformation, not the lesson list." },
        { d: "Lean conversion structure, mobile-first (Vite)", r: "because the audience decides on the phone and a slow LP loses leads: hero, proof, price, CTA, in the order I tested." },
        { d: "One dominant CTA per fold", r: "because divided attention does not convert: every section pushes to the same action." },
      ],
      solucao: { t: "The transformation, in one page", p: ["A responsive landing opening with the promise (leave the price war), showing the 'buyer's code' method, proof and offer, with CTAs guiding to conversion: fast and mobile-first."], slots: 2 },
      resultado: { t: "From 'another course' to 'I need this method'", p: ["The reading takes the skeptical seller from 'I doubt it' to 'this is what I am missing' without friction. [confirm leads / conversion rate]"] },
    },
  };
  CHAPTERS.forEach((c) => {
    const en = CH[c.id];
    if (en) Object.assign(c, en);
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
        { k: "What I did", p: "Dove head first into the first screens that went live. [tell what you touched at TT&T]" },
        { k: "The experience", p: "[what the team and the pace were like, and what marked you there]" },
        { k: "What I built", p: "[the products or features that came from your hands]" },
      ] },
    locar: { role: "Real product work", period: "Product", note: "IMMO, Signamais and co.",
      blurb: "Where I designed real product and learned the handoff end to end.",
      story: [
        { k: "What I built", p: "The Locarmais website, Signamais and IMMO. From the interface to what holds it up behind." },
        { k: "The handoff", p: "[how the handoff with the dev team worked, what you standardized to make it flow]" },
        { k: "What I learned", p: "[the biggest lesson you took from Locarmais]" },
      ] },
    oderco: { role: "Design for a team of brands", period: "Current", note: "PCYES, Odex, Tonante, Vinik, Skul",
      blurb: "Today. I run design for a whole team of brands, from e-commerce to SaaS.",
      story: [
        { k: "The challenge", p: "Keeping coherence and pace while designing for several brands at once. [detail the challenge your way]" },
        { k: "The advantages", p: "[what designing for several brands gives you: range, speed, repertoire]" },
        { k: "What I love", p: "[what excites you most day to day here]" },
      ] },
  };
  COMPANIES.forEach((c) => { const en = CO_EN[c.id]; if (en) Object.assign(c, en); });

  /* certificates */
  const CERT_ISSUER_EN = { "ux-balas": "Certification", circuit: "UX program", coderhouse: "Certification", scrum: "Agile", "design-g": "Degree" };
  CERTS.forEach((c) => { if (CERT_ISSUER_EN[c.id]) c.issuer = CERT_ISSUER_EN[c.id]; });
  const certScrum = CERTS.find((c) => c.id === "scrum"); if (certScrum) certScrum.title = "Scrum Certification";
  const certDg = CERTS.find((c) => c.id === "design-g"); if (certDg) certDg.title = "Graphic Design";

  /* filter categories */
  const catAll = CATS.find((c) => c.key === "todos"); if (catAll) catAll.label = "All";

  /* rail/project card domains */
  const PJ_DOMAIN_EN = {
    remoctrl: "Native app · Desktop",
    "hub-oderco": "SaaS · Internal tool",
    "ponto-admin": "SaaS + App · Time tracking",
    "kitamo-app": "SaaS · Personal finance",
    isabella: "Website · Architecture",
    locarmais: "Website · Rent guarantee",
    web2design: "Tool · Design",
    argel: "App · Boxing",
    signamais: "SaaS · Subscriptions",
  };
  PROJECTS.forEach((p) => { if (PJ_DOMAIN_EN[p.id]) p.domain = PJ_DOMAIN_EN[p.id]; });
}

Object.assign(window, { LANG, t, toggleLang });
