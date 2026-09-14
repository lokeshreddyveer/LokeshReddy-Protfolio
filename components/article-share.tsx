"use client";

import { Check, Link2, Share2, Share as ShareIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function BrandIcon({ kind }: { kind: "linkedin" | "x" | "facebook" | "whatsapp" | "email" }) {
  return <img className="article-share-brand-icon" src={`/social-icons/${kind}.svg`} alt="" aria-hidden="true" />;
}

export default function ArticleShare({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const shareUrl = typeof window === "undefined" ? "https://lokeshreddy.dev" : window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const nativeShare = async () => {
    if (!("share" in navigator)) return;
    try {
      await navigator.share({ title, url: shareUrl });
      setOpen(false);
    } catch {
      // A dismissed native share sheet is not an error.
    }
  };

  return (
    <div className="article-share" ref={rootRef}>
      <button className="article-share-trigger" type="button" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen(value => !value)}>
        <Share2 size={15} /> <span>Share</span>
      </button>
      <div className={`article-share-menu ${open ? "is-open" : ""}`} role="menu" aria-label="Share this article" aria-hidden={!open}>
        <a role="menuitem" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noreferrer" aria-label="Share on LinkedIn" title="LinkedIn"><BrandIcon kind="linkedin" /></a>
        <a role="menuitem" href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noreferrer" aria-label="Share on X" title="X"><BrandIcon kind="x" /></a>
        <a role="menuitem" href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer" aria-label="Share on Facebook" title="Facebook"><BrandIcon kind="facebook" /></a>
        <a role="menuitem" href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noreferrer" aria-label="Share on WhatsApp" title="WhatsApp"><BrandIcon kind="whatsapp" /></a>
        <a role="menuitem" href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`} aria-label="Share by email" title="Email"><BrandIcon kind="email" /></a>
        <button role="menuitem" type="button" onClick={copyLink} aria-label="Copy article link" title={copied ? "Copied" : "Copy link"}>{copied ? <Check size={16} /> : <Link2 size={16} />}</button>
        <button role="menuitem" type="button" className="article-share-native" onClick={nativeShare} aria-label="Share using device" title="More sharing options"><ShareIcon size={16} /></button>
      </div>
    </div>
  );
}
