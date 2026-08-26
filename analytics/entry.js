// Vercel Web Analytics + Speed Insights for a non-framework static site.
// Bundled by build.mjs into dist/analytics.js. On Vercel these inject the
// /_vercel/* scripts automatically once Analytics/Speed Insights are enabled.
import { inject, track, pageview } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";

inject();
injectSpeedInsights();

// O site é roteado só por hash. O script da Vercel ignora pushState quando o
// pathname não muda (`m(t) || t.hash && m(t)`), então sem isto a sessão
// inteira vira UM pageview de entrada e não se sabe se alguém abriu um
// capítulo. app.jsx chama window.vpage a cada troca de view.
window.vpage = (path) => { try { pageview({ route: path, path }); } catch (e) {} };
window.vtrack = (name, data) => { try { track(name, data); } catch (e) {} };

// Idioma: uma vez por pageview, só quando EN (o default é PT, e evento por
// clique no toggle se perderia no reload que toggleLang dispara).
try {
  if (localStorage.getItem("vol-lang") === "en") track("idioma-en");
} catch (e) {}

// Contato é a conversão do portfólio. Um listener delegado cobre header,
// hero, rodapé e qualquer link futuro sem tocar nos .jsx.
const ALVOS = [
  [/wa\.me|api\.whatsapp/i, "whatsapp"],
  [/^mailto:/i, "email"],
  [/linkedin\.com/i, "linkedin"],
  [/instagram\.com/i, "instagram"],
  [/\.pdf($|\?)/i, "curriculo"],
];
document.addEventListener("click", (e) => {
  const a = e.target && e.target.closest && e.target.closest("a[href]");
  if (!a) return;
  const href = a.getAttribute("href") || "";
  const hit = ALVOS.find(([re]) => re.test(href));
  if (hit) window.vtrack("contato", { canal: hit[1] });
}, true);
