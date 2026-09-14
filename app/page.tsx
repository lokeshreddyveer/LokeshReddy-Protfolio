"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { experience, fieldNotes, projects, skillGroups } from "@/lib/portfolio";
import { ReadingProgress } from "@/components/article-reading-tools";

const reveal = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 }, transition: { duration: 0.6, ease: "easeOut" as const } };
const proofStages = [
  ["01", "Frame", "Understand the intent", "Turn an ambiguous request into goals, constraints, and success criteria."],
  ["02", "Investigate", "Interrogate the evidence", "Retrieve what matters, challenge assumptions, and expose missing context."],
  ["03", "Design", "Choose the safest path", "Compare approaches for quality, latency, cost, and operational risk."],
  ["04", "Verify", "Deliver with proof", "Grounded, validated, traceable—and built with a recovery path."],
] as const;
const capabilities = [
  ["01", "Grounded knowledge systems", "Hybrid retrieval, reranking, source lineage, and evidence-aware responses."],
  ["02", "Bounded agent workflows", "Explicit states, scoped tools, approval gates, retries, and verifiable outcomes."],
  ["03", "Secure AI applications", "Trust boundaries, injection defense, PII handling, output policy, and audit trails."],
  ["04", "Evaluation & operations", "Task suites, quality regression, latency, token cost, monitoring, and release gates."],
] as const;
const architecture = ["Guardrails", "Router", "Retrieval", "Reranker", "Generation", "Validation", "Audit"];

export default function Home() {
  const hero = useRef<HTMLElement>(null);
  const name = useRef<HTMLHeadingElement>(null);
  useLayoutEffect(() => {
    gsap.registerPlugin(SplitText);
    const context = gsap.context(() => {
      if (!name.current) return;
      const split = new SplitText(name.current, { type: "chars" });
      gsap.timeline()
        .from(".minimal-eyebrow", { x: -30, opacity: 0, duration: 0.55, ease: "power3.out" }, 0.3)
        .from(split.chars, { y: 60, opacity: 0, duration: 0.8, stagger: 0.04, ease: "power3.out" }, 0.5)
        .from(".hero-location,.hero-statement,.minimal-role", { opacity: 0, duration: 0.55, stagger: 0.1, ease: "power2.out" }, 1.2)
        .from(".minimal-actions,.hero-focus", { opacity: 0, duration: 0.5, ease: "power2.out" }, 1.4)
        .from(".minimal-hero-meta", { opacity: 0, duration: 0.45 }, 1.55);
      return () => split.revert();
    }, hero);
    return () => context.revert();
  }, []);

  return <main className="minimal-site full-home">
    <ReadingProgress />
    <section className="minimal-hero" id="top" ref={hero}><div className="minimal-container minimal-hero-inner">
      <div className="minimal-square" aria-hidden="true" />
      <div className="minimal-eyebrow"><i />Lokesh / Engineering portfolio / 2026</div>
      <p className="hero-location">United States · Production GenAI</p>
      <h1 ref={name}>Lokesh Reddy V</h1>
      <h2 className="hero-statement">I build AI systems that earn their way into production.</h2>
      <p className="minimal-role">Production RAG, tool-using agents, evaluation pipelines, and LLM security—designed for accuracy, auditability, and operational control.</p>
      <div className="minimal-actions"><a className="minimal-primary" href="/projects">Explore the systems</a><a className="minimal-ghost" href="/resume">View résumé</a></div>
      <div className="hero-focus"><p>Current focus</p><div className="hero-focus-grid"><span><strong>Secure RAG</strong><small>Grounded answers with source lineage.</small></span><span><strong>Bounded agents</strong><small>Scoped tools, approval gates, recovery paths.</small></span><span><strong>Evaluation infrastructure</strong><small>Quality signals that travel with every release.</small></span></div><div className="hero-metrics-line"><span><strong>23%</strong> fewer staffing escalations</span><span><strong>60%</strong> faster infrastructure provisioning</span><span><strong>67%</strong> fewer post-deployment regressions</span></div></div>
      <div className="minimal-hero-meta"><a href="#reasoning" className="minimal-scroll"><i />Scroll</a><span>{new Date().getFullYear()}</span></div>
    </div></section>

    <motion.section className="reasoning-section full-section" id="reasoning" {...reveal}><div className="minimal-container">
      <div className="full-section-head"><div><p className="minimal-label"><i />Problem → Proof reasoning live</p><h2>Can this be trusted in production?</h2></div><a href="/architecture">Inspect the architecture ↗</a></div>
      <div className="reasoning-grid">{proofStages.map(([number, stage, title, copy]) => <article key={stage}><span>{number} / {stage}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </div></motion.section>

    <motion.section className="studio-banner" {...reveal}><div className="minimal-container studio-banner-grid"><div><p className="minimal-label"><i />Engineering Studio / New</p><h2>Don’t just read the portfolio. Challenge it.</h2><p>Use 15 browser-only experiences to test role fit, change architecture constraints, replay failures, inspect evidence, and generate a recruiter brief.</p></div><a href="/studio"><code>lokesh@genai:~$ open studio --all</code><strong>Enter the Engineering Studio <span>→</span></strong><small>15 interactive modules · no login · no data upload</small></a></div></motion.section>

    <motion.section className="readiness-section full-section" {...reveal}><div className="minimal-container">
      <div className="full-section-head"><div><p className="minimal-label"><i />Production readiness console</p><h2>A release earns its confidence.</h2></div><span>Public reference system</span></div>
      <div className="readiness-console"><header><code>lokesh@genai / release-console</code><span>Reference</span></header><div className="readiness-checks">{[["Pass","Evidence coverage","citations required"],["Pass","Task evaluation","regression checked"],["Pass","Output contract","schema valid"],["Watch","Weak evidence","escalate or refuse"]].map(([state,title,copy])=><div key={title} className={state.toLowerCase()}><span>{state}</span><strong>{title}</strong><small>{copy}</small></div>)}</div><footer>Sanitized architecture · illustrative signals · no client data</footer></div>
      <div className="readiness-pillars">{[["Model gateway","Approved deployments only","Versioned prompts, bounded context, timeout and cost controls."],["Trust boundary","Untrusted input stays untrusted","Inputs, retrieval, tools, and outputs are validated separately."],["Release gate","Evidence before rollout","Quality, latency, security, and regression checks travel with every release."]].map(([label,title,copy])=><article key={label}><span>{label}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </div></motion.section>

    <motion.section className="capabilities-section full-section" {...reveal}><div className="minimal-container"><p className="minimal-label"><i />What I build</p><div className="full-section-head"><h2>Reliable intelligence, not demo magic.</h2><p>The engineering around a model determines whether it can be trusted in production.</p></div><div className="capabilities-list">{capabilities.map(([number,title,copy])=><article key={title}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></motion.section>

    <motion.section className="minimal-work" id="work" {...reveal}><div className="minimal-container">
      <div className="minimal-section-head"><div><p className="minimal-label"><i />Selected Work</p><h2>Systems built for real constraints.</h2></div><a href="/projects" className="home-section-link">4 featured / {projects.length} total ↗</a></div>
      <div className="minimal-projects">{projects.slice(0,4).map((project, index) => <motion.div className="minimal-project" key={project.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}><a href={`/projects/${project.slug}`} className="minimal-project-link"><span className="minimal-number">{String(index + 1).padStart(2,"0")}</span><div><h3>{project.title}</h3><p>{project.outcome}</p><small>{project.metrics[0]?.[0]} · {project.metrics[0]?.[1]}</small></div><div className="minimal-tags">{project.stack.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div></a></motion.div>)}</div>
      <a href="/projects" className="home-projects-more">View all {projects.length} case studies <span>→</span></a>
    </div></motion.section>

    <motion.section className="architecture-section full-section" {...reveal}><div className="minimal-container"><div className="full-section-head"><div><p className="minimal-label"><i />Interactive architecture</p><h2>Follow a request through the system.</h2></div><a href="/architecture">Open architecture explorer ↗</a></div><div className="architecture-line">{architecture.map((stage,index)=><a href="/architecture" key={stage}><span>0{index+1}</span><strong>{stage}</strong></a>)}</div><div className="architecture-feature"><span>03 / Retrieval</span><div><h3>Hybrid search with filters, query expansion, and lineage.</h3><p>Control: Evidence lineage</p></div><strong>Failure mode: Weak recall</strong></div></div></motion.section>

    <section className="minimal-about" id="about"><div className="minimal-container minimal-about-grid"><motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.7, ease: "easeOut" }}><p className="minimal-label"><i />About / Engineering approach</p><h2>I work on the layers that make AI useful after the demo.</h2><p>My path runs from transformer-based NLP and full-stack AI applications to retrieval systems, bounded agents, evaluation, and production operations. I care about the boundary between model capability and software behavior: what the system knows, what it is allowed to do, how it fails, and how we prove it worked.</p><a className="minimal-ghost about-link" href="/about">Read my engineering philosophy</a></motion.div><motion.div className="principles-list" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.7, ease: "easeOut" }}>{[["01","Build for evidence","Grounded answers, traceable decisions, and measurable quality."],["02","Bound autonomy","Explicit states, scoped tools, approval gates, and recovery paths."],["03","Operate responsibly","Security, privacy, observability, and release discipline from day one."]].map(([n,title,copy])=><article key={n}><span>{n}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</motion.div></div></section>

    <motion.section className="experience-preview full-section" {...reveal}><div className="minimal-container"><div className="full-section-head"><div><p className="minimal-label"><i />Experience</p><h2>From applied NLP to production GenAI.</h2></div><a href="/experience">Full experience & education ↗</a></div><div className="experience-strips">{experience.map((item,index)=><a href="/experience" key={item.company}><span>0{index+1}</span><div><h3>{item.role}</h3><p>{item.company} · {item.location}</p></div><time>{item.dates}</time></a>)}</div></div></motion.section>

    <motion.section className="minimal-content-section full-section" {...reveal}><div className="minimal-container"><div className="full-section-head"><div><p className="minimal-label"><i />Technical system</p><h2>Skills connected to evidence.</h2></div><a href="/projects">See them in projects ↗</a></div><div className="minimal-skills">{skillGroups.map(([group, skills])=><div key={group}><h3>{group}</h3><p>{skills.join(" · ")}</p></div>)}</div></div></motion.section>

    <motion.section className="minimal-content-section full-section" {...reveal}><div className="minimal-container"><div className="full-section-head"><div><p className="minimal-label"><i />Field notes / Engineering writing</p><h2>Short arguments from the systems layer.</h2></div><a href="/about#field-notes">Read the approach ↗</a></div><div className="minimal-notes">{fieldNotes.map((note, index)=><a href={note.href} key={note.slug}><span>0{index + 1} / {note.type}</span><h3>{note.title}</h3><p>{note.summary}</p><small>{note.tags.join(" · ")}</small></a>)}</div></div></motion.section>

    <section className="minimal-contact" id="contact"><div className="minimal-container"><motion.p className="minimal-label centered" {...reveal}><i />Let’s build something reliable</motion.p><motion.h2 aria-label="Need an engineer who thinks beyond the model call?" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.025 } } }}>{Array.from("Need an engineer who thinks beyond the model call?").map((character,index)=><motion.span key={`${character}-${index}`} variants={{ hidden:{opacity:0,y:18},visible:{opacity:1,y:0,transition:{duration:.38,ease:"easeOut"}} }}>{character === " " ? "\u00A0" : character}</motion.span>)}</motion.h2><motion.p className="minimal-contact-copy" {...reveal}>Open to roles and technical conversations around production GenAI systems.</motion.p><div className="contact-actions"><a className="minimal-primary" href="/contact">Start a conversation</a><a className="minimal-ghost" href="/resume">View résumé</a></div></div></section>
  </main>;
}
