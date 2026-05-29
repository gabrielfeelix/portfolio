/* =====================================================================
   VOLUME — cursor.jsx
   Custom cursor: a fast ink dot + a slower trailing ring that grows and
   inks vermelho over interactive elements, and flips to white over the red
   cover. Disabled on touch / reduced motion (native cursor stays).
   Positions are written straight to the DOM in the rAF loop (no per-frame
   React re-render).
   ===================================================================== */
function CursorDot() {
  const mouse = useRef({ x: 0, y: 0 });
  const dot = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const dotEl = useRef(null);
  const ringEl = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [onRed, setOnRed] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;                 // touch / reduced-motion → keep native cursor
    setEnabled(true);
    document.body.classList.add("cursor-none");

    const SEL = "a, button, input, textarea, select, [role='button'], [tabindex], .rail-cover, .comp, .cert, .qsc-card, .dif-tag, .next-chap, .eq-card";
    const move = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    const over = (e) => {
      const t = e.target;
      if (!t || !t.closest) return;
      setHovering(!!t.closest(SEL));
      setOnRed(!!t.closest(".splash"));
    };
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);

    const lerp = (a, b, f) => a + (b - a) * f;
    let raf;
    const tick = () => {
      dot.current.x = lerp(dot.current.x, mouse.current.x, 0.3);
      dot.current.y = lerp(dot.current.y, mouse.current.y, 0.3);
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.16);
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.16);
      if (dotEl.current) dotEl.current.style.transform = `translate(${dot.current.x}px, ${dot.current.y}px) translate(-50%, -50%)`;
      if (ringEl.current) ringEl.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      cancelAnimationFrame(raf);
      document.body.classList.remove("cursor-none");
    };
  }, []);

  if (!enabled) return null;
  return (
    <div className={`cursor-layer ${onRed ? "on-red" : ""}`} aria-hidden="true">
      <div ref={dotEl} className="cursor-dot"></div>
      <div ref={ringEl} className={`cursor-ring ${hovering ? "hover" : ""}`}></div>
    </div>
  );
}

Object.assign(window, { CursorDot });
