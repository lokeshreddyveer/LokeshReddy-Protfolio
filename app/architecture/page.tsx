"use client";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Database,
  FileCheck2,
  KeyRound,
  Pause,
  Play,
  Radar,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { ReddyHoverAction } from "@/components/portfolio-ask";

const stages = [
  {
    name: "Input boundary",
    icon: ShieldCheck,
    summary: "Separate trusted instructions from user-controlled input.",
    detail:
      "Classify data, redact sensitive values, detect instruction override attempts, and assign a request policy before orchestration.",
    control: "Policy engine + PII boundary",
    risk: "Injection and data leakage",
  },
  {
    name: "Intent router",
    icon: Route,
    summary: "Choose a bounded path based on task and risk.",
    detail:
      "Route to retrieval, structured workflow, approved tool, clarification, or refusal. High-impact actions require deterministic preconditions.",
    control: "Schema-bound routing",
    risk: "Over-broad autonomy",
  },
  {
    name: "Hybrid retrieval",
    icon: Search,
    summary: "Build a traceable evidence set.",
    detail:
      "Combine semantic and keyword search with query expansion, metadata policy filters, freshness checks, and document-level authorization.",
    control: "ACL-aware retrieval",
    risk: "Stale or unauthorized context",
  },
  {
    name: "Reranking",
    icon: Radar,
    summary: "Prioritize useful evidence, not just similar text.",
    detail:
      "Re-score candidate chunks, enforce diversity, remove duplicates, and stop when evidence quality falls below threshold.",
    control: "Relevance threshold",
    risk: "Noisy context",
  },
  {
    name: "Model gateway",
    icon: Sparkles,
    summary: "Constrain generation through a controlled interface.",
    detail:
      "Use approved deployments, structured outputs, bounded context, timeouts, cost controls, and model-version tracking.",
    control: "Gateway policy",
    risk: "Unsupported output",
  },
  {
    name: "Validation",
    icon: FileCheck2,
    summary: "Check the answer before release.",
    detail:
      "Validate schema, claims, citations, policy, tool results, and evidence coverage. Refuse or escalate when support is insufficient.",
    control: "Deterministic validators",
    risk: "Hallucination or schema drift",
  },
  {
    name: "Audit & operations",
    icon: Database,
    summary: "Make behavior observable and replayable.",
    detail:
      "Record request IDs, versions, decisions, retrieval lineage, latency, tokens, guardrail outcomes, feedback, and release regressions.",
    control: "Redacted audit trace",
    risk: "Unexplained production behavior",
  },
];

export default function ArchitecturePage() {
  const [active, setActive] = useState(2);
  const [overlay, setOverlay] = useState<"system" | "security">("system");
  const [playing, setPlaying] = useState(false);
  const item = stages[active];
  const Icon = item.icon;
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % stages.length),
      1500,
    );
    return () => window.clearInterval(timer);
  }, [playing]);
  return (
    <main>
      <PageHeading
        eyebrow="ARCHITECTURE EXPLORER"
        title="A production request is a controlled journey."
        intro="Inspect each stage, replay the request path, then switch to the security overlay to see trust boundaries and control points."
      />
      <section className="shell explorer-toolbar">
        <div className="mode-toggle">
          <button
            className={overlay === "system" ? "selected" : ""}
            onClick={() => setOverlay("system")}
          >
            System view
          </button>
          <button
            className={overlay === "security" ? "selected" : ""}
            onClick={() => setOverlay("security")}
          >
            Security overlay
          </button>
        </div>
        <div className="explorer-actions">
          <button
            className="replay-button"
            onClick={() => setPlaying((value) => !value)}
            aria-pressed={playing}
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}{" "}
            {playing ? "Pause replay" : "Replay request"}
          </button>
          <span className="synthetic-badge">
            Reference architecture · synthetic
          </span>
        </div>
      </section>
      <section
        className={`shell architecture-workbench ${overlay} ${playing ? "is-playing" : ""}`}
      >
        <div className="architecture-rail">
          {stages.map((stage, i) => {
            const StageIcon = stage.icon;
            return (
              <button
                key={stage.name}
                onClick={() => {
                  setActive(i);
                  setPlaying(false);
                }}
                className={active === i ? "active" : ""}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                <StageIcon />
                <b>{stage.name}</b>
                <ChevronRight />
              </button>
            );
          })}
        </div>
        <article className="architecture-inspector">
          <div className="inspector-icon">
            <Icon />
          </div>
          <p className="mono">
            STAGE {String(active + 1).padStart(2, "0")} /{" "}
            {overlay.toUpperCase()} VIEW
          </p>
          <h2>{item.name}</h2>
          <h3>{item.summary}</h3>
          <p>{item.detail}</p>
          <div className="inspector-facts">
            <div>
              <small>CONTROL</small>
              <strong>{item.control}</strong>
            </div>
            <div>
              <small>PRIMARY RISK</small>
              <strong>{item.risk}</strong>
            </div>
          </div>
          {overlay === "security" && (
            <div className="security-callout">
              <KeyRound />
              <span>
                <strong>Trust boundary active</strong>Inputs and outputs are
                treated as untrusted until policy and authorization checks pass.
              </span>
            </div>
          )}
          <a
            href={active < 2 ? "/security" : "/projects/regulatory-intelligence-platform"}
            className="text-link"
          >
            See implementation pattern <ArrowRight />
          </a>
        </article>
      </section>
      <section className="shell adr-section">
        <div className="section-heading">
          <div>
            <p className="kicker">DECISION RECORDS</p>
            <h2>Why this shape?</h2>
          </div>
          <ReddyHoverAction
            scope="architecture decision records"
            question="Explain the architecture decision records on this page, compare the trade-offs, and suggest what I should read next."
          />
        </div>
        <div className="adr-grid">
          {[
            [
              "ADR-01",
              "Hybrid retrieval",
              "Semantic recall plus exact-match resilience for acronyms, identifiers, and policy language.",
            ],
            [
              "ADR-02",
              "Rerank before generation",
              "Spend model context on the strongest evidence, not the nearest embeddings.",
            ],
            [
              "ADR-03",
              "Deterministic validation",
              "Use code for enforceable policies, schemas, citations, and authorization boundaries.",
            ],
            [
              "ADR-04",
              "Workflow before agent",
              "Expand autonomy only when a bounded graph cannot express the task safely.",
            ],
          ].map(([id, title, text]) => (
            <article key={id}>
              <span>{id}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <Check />
              <ReddyHoverAction
                scope={title}
                question={`Explain ${title} from the Architecture page with its trade-off and an example from Lokesh's work.`}
              />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
