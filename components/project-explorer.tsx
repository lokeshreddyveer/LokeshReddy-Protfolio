"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Search, X } from "lucide-react";
import { projects } from "@/lib/portfolio";

export function ProjectExplorer() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return projects;
    return projects.filter((project) => [project.title, project.label, project.outcome, project.summary, ...project.stack, ...project.metrics.flat()].join(" ").toLowerCase().includes(value));
  }, [query]);
  const compare = projects.filter((project) => selected.includes(project.slug));
  useEffect(() => { try { window.localStorage.setItem("project-compare-selection", JSON.stringify(selected)); } catch { /* optional page context */ } }, [selected]);
  const toggle = (slug: string) => {
    setComparisonOpen(false);
    setSelected((items) => items.includes(slug) ? items.filter((item) => item !== slug) : items.length < 2 ? [...items, slug] : items);
  };
  const clearComparison = () => { setSelected([]); setComparisonOpen(false); };

  return <>
    <div className="project-explorer-tools" role="search">
      <label><Search size={16} /><span className="sr-only">Search case studies</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, skills, metrics…" /></label>
      <span>{filtered.length} of {projects.length} shown</span>
    </div>
    <p className="project-explorer-hint">Select up to two case studies to compare their outcomes, evidence, and stack.</p>
    {selected.length > 0 && <div className="project-compare-tray" role="status" aria-live="polite">
      <div><strong>{selected.length === 2 ? "Two projects ready" : "One project selected"}</strong><span>{selected.length === 2 ? "Open the comparison to see the build story side by side." : "Choose one more project to enable comparison."}</span></div>
      <div><button type="button" className="project-compare-tray-primary" onClick={() => setComparisonOpen(true)} disabled={selected.length !== 2}>Compare {selected.length === 2 ? "2 projects" : "projects"}</button><button type="button" className="project-compare-tray-clear" onClick={clearComparison}>Clear</button></div>
    </div>}
    {compare.length > 0 && <section className="project-compare" aria-label="Selected projects for comparison">
      <header><strong>Compare these projects</strong><span>{compare.length}/2 selected</span></header>
      <div>{compare.map((project) => <article key={project.slug}><span>{project.label}</span><h3>{project.title}</h3><strong>{project.outcome}</strong><p>{project.metrics.slice(0, 2).map(([value, label]) => `${value} ${label}`).join(" · ")}</p><a href={`/projects/${project.slug}`}>Open case study</a></article>)}</div>
      <footer><button type="button" className="project-compare-primary" onClick={() => setComparisonOpen(true)} disabled={compare.length !== 2}>Compare</button><button type="button" className="project-compare-clear" onClick={clearComparison}><X size={15} /> Clear selection</button></footer>
      {comparisonOpen && compare.length === 2 && <article className="project-comparison-result" aria-label="Project comparison result">
        <div className="project-comparison-result-heading"><span>COMPARISON</span><h2>Two systems, two operating priorities.</h2><p>Both projects turn complex documents into reviewable decisions. The difference is where the workflow puts its control: continuous evidence review versus structured transaction analysis.</p></div>
        <div className="project-comparison-grid">
          <div><small>WHY IT WAS BUILT</small><p>{compare[0].summary}</p></div>
          <div><small>WHY IT WAS BUILT</small><p>{compare[1].summary}</p></div>
          <div><small>BUILD PATTERN</small><p>{compare[0].role}. {compare[0].stack.slice(0, 4).join(", ")}.</p></div>
          <div><small>BUILD PATTERN</small><p>{compare[1].role}. {compare[1].stack.slice(0, 4).join(", ")}.</p></div>
          <div><small>MEASURED OUTCOME</small><p>{compare[0].outcome}</p></div>
          <div><small>MEASURED OUTCOME</small><p>{compare[1].outcome}</p></div>
        </div>
        <div className="project-comparison-verdict"><small>WHEN EACH FITS BEST</small><p><strong>{compare[0].title}</strong> fits evidence-heavy research where source lineage and fast retrieval are central. <strong>{compare[1].title}</strong> fits repeatable review workflows where extraction, consistency checks, and reviewer-ready handoffs matter most.</p></div>
      </article>}
    </section>}
    <section className="shell project-index-list" aria-label="Project case studies">
      {filtered.map((project) => <article key={project.slug} className={`project-index-card ${selected.includes(project.slug) ? "is-selected" : ""}`}>
        <div className="project-index-card-top"><div className="project-index-meta"><span className="project-index-number">{String(projects.indexOf(project) + 1).padStart(2, "0")}</span><span>PUBLIC-SAFE CASE STUDY</span></div><button type="button" className="project-compare-toggle" onClick={(event) => { event.preventDefault(); event.stopPropagation(); toggle(project.slug); }} aria-label={`${selected.includes(project.slug) ? "Remove" : "Add"} ${project.title} ${selected.includes(project.slug) ? "from" : "to"} comparison`} aria-pressed={selected.includes(project.slug)}>{selected.includes(project.slug) ? <><Check size={14} /> Added</> : "Add to compare"}</button></div>
        <div className="project-index-content"><p className="project-index-label">{project.label}</p><h2><a className="project-index-title" href={`/projects/${project.slug}`}>{project.title}</a></h2><p className="project-index-hook">{project.outcome}</p><p className="project-index-outcome">{project.summary}</p><div className="project-index-metrics">{project.metrics.slice(0, 3).map(([value, label]) => <span key={label}><strong>{value}</strong><small>{label}</small></span>)}</div><div className="project-index-footer"><div className="project-index-stack">{project.stack.slice(0, 5).map((item) => <em key={item}>{item}</em>)}</div><a className="project-index-open" href={`/projects/${project.slug}`}>Open case study</a></div></div>
      </article>)}
    </section>
    {!filtered.length && <p className="project-empty">No case studies match “{query}”. Try a technology, metric, or capability.</p>}
  </>;
}
