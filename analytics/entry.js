// Vercel Web Analytics + Speed Insights for a non-framework static site.
// Bundled by build.mjs into dist/analytics.js. On Vercel these inject the
// /_vercel/* scripts automatically once Analytics/Speed Insights are enabled.
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";

inject();
injectSpeedInsights();
