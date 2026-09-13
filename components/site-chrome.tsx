"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import ProofBar from "@/components/ProofBar";

const links = [
  ["Projects", "/projects"], ["Architecture", "/architecture"], ["Security", "/security"],
  ["Experience", "/experience"], ["Studio", "/studio"], ["Playground", "/playground"],
] as const;

const menuLinks = [
  ["About", "/about"], ["Notes", "/notes"], ["Résumé", "/resume"], ["Contact", "/contact"],
] as const;

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = "dark";
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    let frame = 0;
    const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf); };
    frame = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(frame); lenis.destroy(); };
  }, []);

  useEffect(() => {
    queueMicrotask(() => { setMenuOpen(false); setMobileMenuOpen(false); });
  }, [pathname]);

  const menuForPath = pathname;

  useEffect(() => {
    if (!menuOpen && !mobileMenuOpen) return;
    const close = (event: MouseEvent) => { if (!header.current?.contains(event.target as Node)) { setMenuOpen(false); setMobileMenuOpen(false); } };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setMenuOpen(false); setMobileMenuOpen(false); } };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", escape); };
  }, [menuOpen, mobileMenuOpen]);

  return <>
    <motion.header ref={header} className="minimal-nav full-nav" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: pathname === "/" ? 1.9 : 0.1 }}>
      <a className="minimal-logo" href="/" aria-label="Lokesh Reddy home">L<span>.</span></a>
      <nav className="full-nav-links" aria-label="Primary navigation">
        {links.map(([label, href]) => <a key={href} className={menuForPath.startsWith(href) ? "active" : ""} href={href}>{label}</a>)}
        <div className="full-nav-dropdown">
          <button className="full-nav-menu-trigger" type="button" aria-label="Open more sections" aria-expanded={menuOpen} onClick={() => setMenuOpen(value => !value)}>{menuOpen ? <X size={15} /> : <Menu size={15} />}</button>
          {menuOpen && <div className="full-nav-dropdown-menu">{menuLinks.map(([label, href]) => <a key={href} className={menuForPath.startsWith(href) ? "active" : ""} href={href}>{label}</a>)}</div>}
        </div>
        <a className="nav-contact" href="/contact">Let’s talk</a>
      </nav>
      <div className="mobile-nav-actions">
        <button className="mobile-nav-toggle" type="button" aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation" onClick={() => setMobileMenuOpen(value => !value)}>{mobileMenuOpen ? <X /> : <Menu />}</button>
      </div>
      <AnimatePresence>{mobileMenuOpen && <motion.nav id="mobile-navigation" className="full-mobile-nav" aria-label="Mobile navigation" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
        {links.map(([label, href]) => <a key={href} className={menuForPath.startsWith(href) ? "active" : ""} href={href}>{label}<span>↗</span></a>)}
        {menuLinks.map(([label, href]) => <a key={href} className={menuForPath.startsWith(href) ? "active" : ""} href={href}>{label}<span>↗</span></a>)}
        <a href="/contact">Let’s talk<span>↗</span></a>
      </motion.nav>}</AnimatePresence>
    </motion.header>
    {children}
    <footer className="global-footer"><div className="minimal-container"><div><strong>Lokesh Reddy V</strong><span>Generative AI Engineer · United States</span></div><nav><a href="/studio">Studio</a><a href="/projects">Projects</a><a href="/architecture">Architecture</a><a href="/security">Security</a><a href="/resume">Résumé</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav></div></footer>
    <ProofBar />
  </>;
}
