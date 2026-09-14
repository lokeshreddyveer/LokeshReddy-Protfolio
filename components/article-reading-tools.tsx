"use client";

import { useEffect, useRef } from "react";

export function ReadingProgress() {
  const progressRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress / 100})`;
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); if (frame) window.cancelAnimationFrame(frame); };
  }, []);
  return <div className="note-reading-progress" aria-hidden="true"><span ref={progressRef} /></div>;
}
