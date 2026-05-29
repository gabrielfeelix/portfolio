/* =====================================================================
   VOLUME — organic.jsx
   <Organic variant size /> — the ink loaders from assets/Organic loaders,
   as a reusable decorative React component. Styles live in organic.css;
   the #org-goo / #org-wobble SVG filters live in index.html.
   Variants: morph contour pulse orbit merge three amoeba split magatama
   drip cluster jelly trail wave yin bounce ripple spread arc twin.
   ===================================================================== */
function organicInner(variant) {
  switch (variant) {
    case "orbit":   return [<div className="core" key="c"></div>, <div className="sat" key="s"></div>];
    case "merge":   return [<span className="a" key="a"></span>, <span className="b" key="b"></span>];
    case "three":   return [<span key="1"></span>, <span key="2"></span>, <span key="3"></span>];
    case "amoeba":  return (
      <svg viewBox="0 0 120 120" style={{ filter: "url(#org-wobble)" }}><circle cx="60" cy="60" r="42" /></svg>
    );
    case "split":   return [<span className="a" key="a"></span>, <span className="b" key="b"></span>];
    case "magatama": return (
      <svg viewBox="0 0 100 100"><path d="M50 6 C 26 6 6 26 6 50 C 6 74 26 94 50 94 C 66 94 78 84 78 70 C 78 58 68 50 56 50 C 48 50 42 56 42 64 C 42 70 46 74 52 74 C 44 80 30 76 26 64 C 20 46 32 26 52 24 C 70 22 86 34 90 52 C 92 28 74 6 50 6 Z" /></svg>
    );
    case "drip":    return [<div className="src" key="s"></div>, <div className="drop" key="d"></div>];
    case "cluster": return [
      <div className="hub" key="h"></div>,
      <i key="1"></i>, <i key="2"></i>, <i key="3"></i>, <i key="4"></i>, <i key="5"></i>,
    ];
    case "trail":   return [<i key="1"></i>, <i key="2"></i>, <i key="3"></i>];
    case "yin":     return [<span className="a" key="a"></span>, <span className="b" key="b"></span>];
    case "bounce":  return [<div className="puddle" key="p"></div>, <div className="ball" key="b"></div>];
    case "ripple":  return [<span key="1"></span>, <span key="2"></span>, <span key="3"></span>];
    case "twin":    return [<span className="a" key="a"></span>, <span className="b" key="b"></span>];
    default:        return null; // single-shape: morph contour pulse jelly wave spread arc
  }
}

function Organic({ variant = "cluster", size = 120, className = "", style = {}, onInk = false }) {
  const scale = size / 120;
  return (
    <span className={`org ${onInk ? "on-ink" : ""} ${className}`} aria-hidden="true"
          style={{ width: size, height: size, ...style }}>
      <span className="fig" style={{ "--org-scale": scale }}>
        <span className={`stage v-${variant}`}>{organicInner(variant)}</span>
      </span>
    </span>
  );
}

Object.assign(window, { Organic });
