"use client";

import { useEffect } from "react";

export function TallyForm() {
  const formId = process.env.NEXT_PUBLIC_TALLY_FORM_ID ?? "MeW85l";

  useEffect(() => {
    const widgetScriptSrc = "https://tally.so/widgets/embed.js";
    const load = () => {
      const tallyWindow = window as typeof window & { Tally?: { loadEmbeds: () => void } };
      if (tallyWindow.Tally) {
        tallyWindow.Tally.loadEmbeds();
        return;
      }
      document.querySelectorAll<HTMLIFrameElement>("iframe[data-tally-src]:not([src])").forEach((iframe) => {
        iframe.src = iframe.dataset.tallySrc ?? "";
      });
    };

    const tallyWindow = window as typeof window & { Tally?: { loadEmbeds: () => void } };
    if (tallyWindow.Tally) {
      load();
      return;
    }
    const existing = document.querySelector(`script[src="${widgetScriptSrc}"]`);
    if (existing) return;
    const script = document.createElement("script");
    script.src = widgetScriptSrc;
    script.onload = load;
    script.onerror = load;
    document.body.appendChild(script);
  }, []);

  if (!formId) return null;

  return (
    <div className="contact-form-embed" aria-label="Contact form">
      <div>
        <p className="kicker">PRIVATE CONTACT FORM</p>
        <h2>Prefer a short form?</h2>
        <p>Share the context that matters. Your message goes directly through the secure form provider.</p>
      </div>
      <iframe
        data-tally-src={`https://tally.so/embed/${formId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
        loading="lazy"
        width="100%"
        height="760"
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        title="Contact Lokesh Reddy"
      />
    </div>
  );
}
