"use client";

import { useEffect, useRef } from "react";

const config = {
  "data-repo": "lokeshreddyveer/Lokeshreddy-comments",
  "data-repo-id": "R_kgDOUaACQg",
  "data-category": "Announcements",
  "data-category-id": "DIC_kwDOUaACQs4DFjf2",
  "data-mapping": "pathname",
  "data-strict": "1",
  "data-reactions-enabled": "1",
  "data-emit-metadata": "0",
  "data-input-position": "top",
  "data-theme": "dark",
  "data-lang": "en",
};

export default function GiscusComments() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.replaceChildren();
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    Object.entries(config).forEach(([name, value]) => script.setAttribute(name, value));
    container.appendChild(script);

    return () => container.replaceChildren();
  }, []);

  return (
    <section className="giscus-section" aria-label="Article comments">
      <div className="giscus-heading">
        <div>
          <p className="kicker">DISCUSSION</p>
          <h2>Share a thought</h2>
        </div>
        <p>Comments are powered by GitHub Discussions.</p>
      </div>
      <div ref={containerRef} className="giscus-container" />
    </section>
  );
}
