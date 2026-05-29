/* =====================================================================
   VOLUME — cursor.jsx
   Custom cursor: a fast ink dot + a slower trailing ring that grows and
   inks vermelho over interactive elements. Disabled on touch / reduced
   motion (native cursor stays). Positions are written straight to the DOM
   in the rAF loop (no per-frame React re-render).
   ===================================================================== */
function CursorDot() {
  const mouse = useRef({ x: 0, y: 0 });
  const dot = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const dotEl = useRef(null);
  const ringEl = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;                 // touch / reduced-motion → keep native cursor
    setEnabled(true);
    document.body.classList.add("cursor-none");

    const SEL = "a, button, input, textarea, select, [role='button'], [tabindex], .rail-cover, .comp, .cert, .qsc-card, .dif-tag, .next-chap, .eq-card";
    const move = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    const over = (e) => { if (e.target.closest && e.target.closest(SEL)) setHovering(true); };
    const out = (e) => { if (e.target.closest && e.target.closest(SEL)) setHovering(false); };
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);

    const lerp = (a, b, f) => a + (b - a) * f;
    let raf;
    const tick = () => {
      dot.current.x = lerp(dot.current.x, mouse.current.x, 0.2);
      dot.current.y = lerp(dot.current.y, mouse.current.y, 0.2);
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.1);
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.1);
      if (dotEl.current) dotEl.current.style.transform = `translate(${dot.current.x}px, ${dot.current.y}px) translate(-50%, -50%)`;
      if (ringEl.current) ringEl.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      cancelAnimationFrame(raf);
      document.body.classList.remove("cursor-none");
    };
  }, []);

  if (!enabled) return null;
  return (
    <div className="cursor-layer" aria-hidden="true">
      <div ref={dotEl} className="cursor-dot"></div>
      <div ref={ringEl} className={`cursor-ring ${hovering ? "hover" : ""}`}></div>
    </div>
  );
}

Object.assign(window, { CursorDot });
