"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  BadgeCheck,
  Bot,
  BriefcaseBusiness,
  Check,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Copy,
  Download,
  FileSearch,
  Gauge,
  GitBranch,
  Network,
  Pause,
  Play,
  Printer,
  Radar,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  TerminalSquare,
  TriangleAlert,
  WandSparkles,
} from "lucide-react";
import { experience, projects } from "@/lib/portfolio";
import { ReddyHoverAction } from "@/components/portfolio-ask";

type ModuleId =
  | "role-fit"
  | "architecture"
  | "evidence"
  | "comparison"
  | "incident"
  | "security"
  | "tour"
  | "interview"
  | "evolution"
  | "rag"
  | "readiness"
  | "failures"
  | "brief"
  | "receipt"
  | "skills";
type Persona =
  "Recruiter" | "Engineering Manager" | "AI Architect" | "Security Reviewer";

const modules: {
  id: ModuleId;
  no: string;
  title: string;
  short: string;
  icon: typeof Target;
}[] = [
  {
    id: "role-fit",
    no: "01",
    title: "Role-Fit Lens",
    short: "Match a role to evidence",
    icon: Target,
  },
  {
    id: "architecture",
    no: "02",
    title: "Decision Simulator",
    short: "Configure the architecture",
    icon: GitBranch,
  },
  {
    id: "evidence",
    no: "03",
    title: "Evidence Graph",
    short: "Trace claims to outcomes",
    icon: Network,
  },
  {
    id: "comparison",
    no: "04",
    title: "Naive vs Production",
    short: "Reveal the control layers",
    icon: ArrowLeftRight,
  },
  {
    id: "incident",
    no: "05",
    title: "Incident Replay",
    short: "Diagnose and recover",
    icon: RotateCcw,
  },
  {
    id: "security",
    no: "06",
    title: "Security Review",
    short: "Inspect every boundary",
    icon: ShieldCheck,
  },
  {
    id: "tour",
    no: "07",
    title: "90-Second Tour",
    short: "A guided technical brief",
    icon: Play,
  },
  {
    id: "interview",
    no: "08",
    title: "Interview Generator",
    short: "Ask evidence-led questions",
    icon: Sparkles,
  },
  {
    id: "evolution",
    no: "09",
    title: "Architecture Evolution",
    short: "Prototype to controlled",
    icon: GitBranch,
  },
  {
    id: "rag",
    no: "10",
    title: "Local RAG Playground",
    short: "Chunk, retrieve, answer",
    icon: FileSearch,
  },
  {
    id: "readiness",
    no: "11",
    title: "Readiness Scorecard",
    short: "Evidence and open risks",
    icon: Gauge,
  },
  {
    id: "failures",
    no: "12",
    title: "Failure Library",
    short: "What broke and why",
    icon: TriangleAlert,
  },
  {
    id: "brief",
    no: "13",
    title: "Recruiter Brief",
    short: "Print the 30-second case",
    icon: BriefcaseBusiness,
  },
  {
    id: "receipt",
    no: "14",
    title: "Proof Receipt",
    short: "Take the evidence with you",
    icon: Clipboard,
  },
  {
    id: "skills",
    no: "15",
    title: "Skill Constellation",
    short: "Skills connected to proof",
    icon: Radar,
  },
];

const personaData: Record<
  Persona,
  { focus: string; proof: string[]; questions: string[] }
> = {
  Recruiter: {
    focus: "Impact, relevant experience, and a clear path to the résumé.",
    proof: [
      "23% fewer booking escalations",
      "60% faster infrastructure provisioning",
      "67% fewer post-deployment regressions",
    ],
    questions: [
      "Tell me about the outcome you are proudest of.",
      "How does your background fit this role?",
    ],
  },
  "Engineering Manager": {
    focus:
      "Delivery ownership, reliability, team enablement, and measurable release quality.",
    proof: [
      "Bounded agent workflow design",
      "Release gates and regression suites",
      "Recoverable service integration",
    ],
    questions: [
      "How did you turn evaluation into a release gate?",
      "How do you handle production failure paths?",
    ],
  },
  "AI Architect": {
    focus:
      "System boundaries, retrieval decisions, orchestration trade-offs, and operability.",
    proof: [
      "Hybrid retrieval and reranking",
      "Structured workflow over open agent loops",
      "Versioned prompts, traces, and rollback",
    ],
    questions: [
      "When is an agent the wrong architecture?",
      "Why rerank after hybrid retrieval?",
    ],
  },
  "Security Reviewer": {
    focus:
      "Data classification, authorization, injection defense, validation, and auditability.",
    proof: [
      "Retrieved content treated as untrusted",
      "Scoped tools with approval gates",
      "Redacted, versioned audit events",
    ],
    questions: [
      "Where are the trust boundaries?",
      "How is authorization enforced around tools?",
    ],
  },
};

const keywordMap = [
  {
    terms: ["rag", "retrieval", "search", "vector", "embedding"],
    label: "Retrieval systems",
    project: "Regulated Financial Services Intelligence Platform",
    href: "/projects/regulatory-intelligence-platform",
  },
  {
    terms: ["agent", "langgraph", "workflow", "tool", "scheduling"],
    label: "Bounded agents",
    project: "Deal Advisory Due Diligence Agent",
    href: "/projects/deal-advisory-due-diligence",
  },
  {
    terms: [
      "security",
      "prompt injection",
      "pii",
      "guardrail",
      "authorization",
    ],
    label: "LLM security",
    project: "Regulated Financial Services Intelligence Platform",
    href: "/security",
  },
  {
    terms: ["azure", "openai", "cloud"],
    label: "Azure OpenAI",
    project: "Production AI architecture",
    href: "/architecture",
  },
  {
    terms: ["fastapi", "python", "api", "backend"],
    label: "AI application engineering",
    project: "InfraSpeak — Network Infrastructure Provisioning",
    href: "/projects/infraspeak",
  },
  {
    terms: ["evaluation", "ragas", "deepeval", "quality", "test"],
    label: "Evaluation systems",
    project: "LLM Evaluation & Quality Gate Framework",
    href: "/projects/llm-evaluation-quality-gates",
  },
  {
    terms: ["bert", "roberta", "nlp", "classification"],
    label: "Applied NLP",
    project: "Mortgage Document Classification",
    href: "/projects/mortgage-document-classification",
  },
];

const evidencePaths = [
  {
    claim: "67% fewer regressions",
    kind: "Verified career impact",
    project: "LLM Evaluation & Quality Gate Framework",
    decision: "Task-specific regression gates",
    tech: "RAGAS · DeepEval · GitHub Actions",
    outcome: "Safer release decisions",
    href: "/projects/llm-evaluation-quality-gates",
  },
  {
    claim: "60% faster provisioning",
    kind: "Verified career impact",
    project: "InfraSpeak — Network Infrastructure Provisioning",
    decision: "Retrieval before generation",
    tech: "FastAPI · FAISS · Terraform",
    outcome: "Controlled infrastructure delivery",
    href: "/projects/infraspeak",
  },
  {
    claim: "38% lower inference cost",
    kind: "Verified career impact",
    project: "Domain-Adapted Llama 3",
    decision: "QLoRA + staged promotion",
    tech: "MLflow · vLLM · Azure",
    outcome: "Efficient domain adaptation",
    href: "/projects/domain-adapted-llama3",
  },
  {
    claim: "93.4% macro F1",
    kind: "Verified career impact",
    project: "Mortgage Document Classification",
    decision: "Confidence-gated automation",
    tech: "BERT · MLflow · Flask",
    outcome: "Human-reviewed document triage",
    href: "/projects/mortgage-document-classification",
  },
];

const incidentSteps = [
  [
    "Request",
    "An internal abbreviation appears in a policy question.",
    "The query is valid, but its language does not match the indexed documents.",
  ],
  [
    "Weak retrieval",
    "Vector-only search returns semantically nearby passages.",
    "Exact policy terminology and the abbreviation expansion are missing.",
  ],
  [
    "Unsupported draft",
    "The model produces a plausible answer from weak context.",
    "Fluent output is not evidence of correctness.",
  ],
  [
    "Evaluation gate",
    "Evidence coverage falls below the release requirement.",
    "The response is stopped before it reaches the user.",
  ],
  [
    "Recovery",
    "Query expansion adds the domain term and metadata filter.",
    "The system changes retrieval strategy, not the answer wording.",
  ],
  [
    "Rerank",
    "Hybrid candidates are reranked for direct support.",
    "Only the strongest passages enter the generation context.",
  ],
  [
    "Validated release",
    "Claims map to sources and the output contract passes.",
    "The response is released with lineage and an auditable recovery trace.",
  ],
] as const;

const tourSteps = [
  [
    "Who I am",
    "Generative AI Engineer focused on the software and controls around capable models.",
    "/about",
  ],
  [
    "What I build",
    "Production RAG, bounded agents, evaluation systems, and LLM security.",
    "/projects",
  ],
  [
    "Career evidence",
    "23% fewer booking escalations, 60% faster provisioning, and 67% fewer regressions.",
    "/experience",
  ],
  [
    "Architecture judgment",
    "Hybrid retrieval, reranking, deterministic validation, and explicit autonomy boundaries.",
    "/architecture",
  ],
  [
    "Failure literacy",
    "I document what failed, isolate the cause, and turn the correction into a repeatable control.",
    "/studio?module=failures",
  ],
  [
    "Security posture",
    "Untrusted input, retrieval, tools, and output cross separate policy boundaries.",
    "/security",
  ],
  [
    "Continue the conversation",
    "Inspect the résumé, choose interview topics, or start a focused conversation.",
    "/resume",
  ],
] as const;

const interviewQuestions = [
  {
    q: "Why do you prefer bounded workflows over autonomous agent loops?",
    why: "Reveals judgment about control, recovery, and observability.",
    href: "/projects/deal-advisory-due-diligence",
    evidence: "Deal Advisory Due Diligence Agent",
  },
  {
    q: "How do you evaluate retrieval independently from generation?",
    why: "Separates evidence quality from fluent model behavior.",
    href: "/lab/rag-debugger",
    evidence: "RAG Debugger",
  },
  {
    q: "How do you handle malicious instructions inside retrieved documents?",
    why: "Tests whether security extends beyond the user prompt.",
    href: "/security",
    evidence: "Security Lab",
  },
  {
    q: "How do you authorize a consequential tool call?",
    why: "Surfaces identity, scope, approval, and idempotency design.",
    href: "/architecture",
    evidence: "Architecture Explorer",
  },
  {
    q: "Tell me about a retrieval strategy that failed.",
    why: "Shows diagnosis, iteration, and evidence-led decision making.",
    href: "/projects/regulatory-intelligence-platform",
    evidence: "Regulatory Intelligence Platform",
  },
  {
    q: "How did evaluation cases affect release decisions?",
    why: "Connects a career claim to operational practice.",
    href: "/projects/llm-evaluation-quality-gates",
    evidence: "Quality Gate Framework",
  },
];

const evolution = [
  {
    v: "V1",
    name: "Functional prototype",
    path: ["Prompt", "Model", "Answer"],
    failed:
      "Answers were fluent but evidence and failure behavior were opaque.",
    change: "Added retrieval, citations, and a stable API contract.",
    tradeoff: "More moving parts and measurable latency.",
  },
  {
    v: "V2",
    name: "Reliable application",
    path: ["Route", "Retrieve", "Rerank", "Generate", "Validate"],
    failed:
      "Quality controls existed, but access and operational decisions were scattered.",
    change: "Centralized policy, identity, tracing, versioning, and recovery.",
    tradeoff: "Stricter release discipline and additional platform ownership.",
  },
  {
    v: "V3",
    name: "Production-controlled",
    path: [
      "Policy",
      "Identity",
      "Evidence",
      "Workflow",
      "Model",
      "Gate",
      "Audit",
    ],
    failed: "The remaining risk is managed, not declared eliminated.",
    change:
      "Continuous evaluation, least privilege, approval gates, and rollback travel with each release.",
    tradeoff: "Autonomy is earned per action rather than granted globally.",
  },
];

const readiness = [
  {
    name: "Correctness",
    status: "Evidence ready",
    evidence:
      "Citation checks, task evaluations, and unsupported-claim handling.",
    risk: "Domain shifts still require fresh test cases.",
  },
  {
    name: "Security",
    status: "Controlled",
    evidence:
      "Trust separation, scoped tools, PII handling, and policy validation.",
    risk: "Controls must follow every new tool and data source.",
  },
  {
    name: "Reliability",
    status: "Recovery defined",
    evidence:
      "Timeouts, idempotency, retries, fallbacks, and explicit terminal states.",
    risk: "External dependencies can still degrade.",
  },
  {
    name: "Observability",
    status: "Traceable",
    evidence:
      "Request, model, prompt, retrieval, tool, and decision versions are correlated.",
    risk: "Telemetry must remain privacy-safe.",
  },
  {
    name: "Cost control",
    status: "Budgeted",
    evidence: "Token budgets, model routing, caching, and latency/cost alerts.",
    risk: "Traffic shape can invalidate estimates.",
  },
  {
    name: "Explainability",
    status: "Inspectable",
    evidence:
      "Evidence lineage and deterministic policy decisions are visible.",
    risk: "Model internals are not treated as explanations.",
  },
  {
    name: "Release readiness",
    status: "Gated",
    evidence:
      "Quality, security, performance, and rollback checks ship together.",
    risk: "A pass is time-bound evidence, not permanent safety.",
  },
];

const failures = [
  {
    name: "Abbreviation blind spot",
    symptom: "Vector search returned related but indirect passages.",
    root: "Internal shorthand did not align with document language.",
    fix: "Query expansion + BM25 + metadata filters + reranking.",
    prevent: "Maintain domain vocabulary tests and retrieval slice metrics.",
  },
  {
    name: "Premature tool call",
    symptom: "An agent tried to schedule before resolving ambiguity.",
    root: "A permissive loop lacked deterministic preconditions.",
    fix: "Added clarification state, scoped actions, and approval boundaries.",
    prevent: "Test every consequential transition and reject incomplete state.",
  },
  {
    name: "Hidden minority weakness",
    symptom: "Aggregate classification accuracy looked healthy.",
    root: "Minority classes were drowned out by the majority distribution.",
    fix: "Added per-slice evaluation and threshold analysis.",
    prevent: "Gate releases on critical-slice performance, not one average.",
  },
  {
    name: "Configuration drift",
    symptom: "Generic IaC examples produced inconsistent output.",
    root: "Open generation had no policy-aware template boundary.",
    fix: "Curated templates, schema checks, and human deployment review.",
    prevent: "Version templates and test policy invariants in CI.",
  },
  {
    name: "Context without value",
    symptom: "Longer context increased latency but not answer support.",
    root: "Retrieval optimized volume rather than marginal evidence gain.",
    fix: "Reranked, deduplicated, and capped context by evidence value.",
    prevent: "Track answer quality against context size and cost.",
  },
  {
    name: "Duplicate side effect",
    symptom: "A retry repeated a consequential action.",
    root: "Transport retry semantics were confused with business idempotency.",
    fix: "Idempotency keys and verified terminal tool outcomes.",
    prevent: "Design retries per action risk, not as a global default.",
  },
];

const skillEvidence = [
  {
    name: "FastAPI",
    x: 18,
    y: 56,
    role: "Versioned AI service contracts and asynchronous integration.",
    around: "Python · Azure OpenAI · SQL · Docker",
    type: "Professional / sanitized",
    href: "/projects/infraspeak",
  },
  {
    name: "Azure OpenAI",
    x: 43,
    y: 24,
    role: "Server-side model access behind policy, timeout, and evaluation gates.",
    around: "FastAPI · LangChain · structured outputs",
    type: "Engineering capability",
    href: "/architecture",
  },
  {
    name: "LangGraph",
    x: 66,
    y: 50,
    role: "Explicit agent states, bounded tools, approval, and recovery paths.",
    around: "Python · FastAPI · Azure · evaluation",
    type: "Professional / sanitized",
    href: "/projects/deal-advisory-due-diligence",
  },
  {
    name: "Evaluation",
    x: 47,
    y: 77,
    role: "Task suites spanning retrieval, output, security, and regression.",
    around: "RAGAS · DeepEval · custom checks",
    type: "Professional / sanitized",
    href: "/lab/rag-debugger",
  },
  {
    name: "LLM Security",
    x: 83,
    y: 22,
    role: "Injection defense, PII handling, authorization, and auditability.",
    around: "Policy validation · identity · redacted logs",
    type: "Synthetic demonstration + capability",
    href: "/security",
  },
  {
    name: "Hybrid Retrieval",
    x: 15,
    y: 18,
    role: "Exact-match resilience plus semantic recall and reranking.",
    around: "Vector search · metadata · source attribution",
    type: "Sanitized case study",
    href: "/projects/regulatory-intelligence-platform",
  },
];

function SectionTitle({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="studio-section-title">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  );
}
function Flow({ items }: { items: string[] }) {
  return (
    <div className="studio-flow">
      {items.map((item, i) => (
        <div key={item}>
          <span>{String(i + 1).padStart(2, "0")}</span>
          <strong>{item}</strong>
          {i < items.length - 1 && <ArrowRight />}
        </div>
      ))}
    </div>
  );
}

export default function StudioPage() {
  const [active, setActive] = useState<ModuleId>("role-fit");
  const [persona, setPersona] = useState<Persona>("Recruiter");
  const [jd, setJd] = useState("");
  const [sensitivity, setSensitivity] = useState("Internal");
  const [autonomy, setAutonomy] = useState("Bounded tools");
  const [latency, setLatency] = useState("Interactive");
  const [quality, setQuality] = useState("High assurance");
  const [cost, setCost] = useState("Balanced");
  const [evidence, setEvidence] = useState(0);
  const [production, setProduction] = useState(72);
  const [incident, setIncident] = useState(0);
  const [securityMode, setSecurityMode] = useState(false);
  const [tour, setTour] = useState(0);
  const [tourPlaying, setTourPlaying] = useState(false);
  const [tourRemaining, setTourRemaining] = useState(13);
  const [question, setQuestion] = useState(0);
  const [version, setVersion] = useState(2);
  const [ragText, setRagText] = useState(
    "Release policy\nEvery AI release must pass task-specific quality checks, security tests, and rollback verification.\n\nRetrieval controls\nRetrieved documents are untrusted input. Access filters and source lineage must be preserved.",
  );
  const [ragQuery, setRagQuery] = useState("What must an AI release pass?");
  const [chunkMode, setChunkMode] = useState("Heading-aware");
  const [score, setScore] = useState(0);
  const [failure, setFailure] = useState(0);
  const [receiptSystem, setReceiptSystem] = useState(
    "Regulated Financial Services Intelligence Platform",
  );
  const [receiptStatus, setReceiptStatus] = useState("");
  const [skill, setSkill] = useState(1);
  const [livePrompt, setLivePrompt] = useState("");
  const [liveAnswer, setLiveAnswer] = useState<{
    answer: string;
    sources: string[];
    live?: boolean;
  } | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState("");

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get(
      "module",
    ) as ModuleId | null;
    if (value && modules.some((m) => m.id === value))
      queueMicrotask(() => setActive(value));
  }, []);
  useEffect(() => {
    if (!tourPlaying) return;
    const timer = window.setInterval(
      () =>
        setTourRemaining((value) => {
          if (value > 1) return value - 1;
          setTour((step) => {
            if (step >= tourSteps.length - 1) {
              setTourPlaying(false);
              return step;
            }
            return step + 1;
          });
          return 13;
        }),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [tourPlaying]);

  const jdMatches = useMemo(() => {
    const words = jd.toLowerCase();
    return keywordMap.filter((item) =>
      item.terms.some((term) => words.includes(term)),
    );
  }, [jd]);
  const architectureControls = useMemo(() => {
    const base = [
      "Request policy gateway",
      "Versioned prompt + model route",
      "Response schema validation",
      "Trace correlation",
    ];
    if (sensitivity !== "Public")
      base.push(
        "Data classification",
        "PII redaction",
        "ACL-aware retrieval",
        "Redacted audit logging",
      );
    if (sensitivity === "Restricted")
      base.push(
        "Private model boundary",
        "Encryption scope review",
        "Retention minimization",
      );
    if (autonomy !== "Advisory")
      base.push(
        "Scoped tool identities",
        "Idempotency keys",
        "Action verification",
      );
    if (autonomy === "Tool execution")
      base.push(
        "Human approval for consequential actions",
        "Per-resource authorization",
      );
    if (quality === "Regulated")
      base.push("Independent review gate", "Immutable evidence package");
    if (latency === "Asynchronous")
      base.push("Durable workflow state", "Queue + resumable execution");
    if (cost === "High pressure")
      base.push("Model tier routing", "Semantic cache", "Strict token budget");
    return [...new Set(base)];
  }, [sensitivity, autonomy, latency, quality, cost]);
  const chunks = useMemo(() => {
    if (chunkMode === "Heading-aware")
      return ragText
        .split(/\n\s*\n/)
        .filter(Boolean)
        .map((x, i) => ({ id: i + 1, text: x.trim() }));
    const words = ragText.split(/\s+/).filter(Boolean);
    const size = chunkMode === "Fixed 24 words" ? 24 : 34;
    const out = [];
    for (let i = 0; i < words.length; i += size)
      out.push({
        id: out.length + 1,
        text: words.slice(i, i + size).join(" "),
      });
    return out;
  }, [ragText, chunkMode]);
  const ranked = useMemo(() => {
    const terms = ragQuery
      .toLowerCase()
      .split(/\W+/)
      .filter((x) => x.length > 2);
    return chunks
      .map((c) => ({
        ...c,
        score: terms.reduce(
          (n, t) => n + (c.text.toLowerCase().includes(t) ? 1 : 0),
          0,
        ),
      }))
      .sort((a, b) => b.score - a.score);
  }, [chunks, ragQuery]);
  const topContext = ranked[0]?.text || "No context available.";
  const receipt = `ENGINEERING PROOF RECEIPT\nSystem: ${receiptSystem}\nInspected: architecture decisions, security controls, failure handling, and evidence lineage\nEvidence: sanitized case study + synthetic public demonstration\nRelevant experience: production RAG, bounded agents, evaluation, and AI application security\nReview URL: https://lokeshreddy.dev/studio\nNote: No client or confidential data is represented.`;
  const copyReceipt = async () => {
    await navigator.clipboard.writeText(receipt);
    setReceiptStatus("Copied to clipboard");
  };
  const downloadReceipt = () => {
    const url = URL.createObjectURL(
      new Blob([receipt], { type: "text/plain" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "Lokesh-Reddy-engineering-proof.txt";
    a.click();
    URL.revokeObjectURL(url);
    setReceiptStatus("Receipt downloaded");
  };
  const chooseModule = (id: ModuleId) => {
    setActive(id);
    window.history.replaceState(null, "", `/studio?module=${id}`);
  };
  const toggleTour = () => {
    if (!tourPlaying && tour === tourSteps.length - 1) setTour(0);
    setTourRemaining(13);
    setTourPlaying((value) => !value);
  };
  const runLiveStudio = async (question: string, scope: string) => {
    if (question.trim().length < 3 || liveLoading) return;
    setLiveLoading(true);
    setLiveError("");
    try {
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question, scope }),
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload.error || "Live review unavailable");
      setLiveAnswer(payload);
    } catch (error) {
      setLiveError(
        error instanceof Error ? error.message : "Live review unavailable",
      );
    } finally {
      setLiveLoading(false);
    }
  };

  const renderModule = () => {
    if (active === "role-fit")
      return (
        <>
          <SectionTitle
            eyebrow="01 / ROLE-FIT LENS"
            title="See the evidence through your hiring lens."
            copy="Select a perspective, paste a job description, and optionally run a transient evidence review grounded in the public portfolio."
          />
          <div className="persona-switch">
            {(Object.keys(personaData) as Persona[]).map((p) => (
              <button
                onClick={() => setPersona(p)}
                className={persona === p ? "active" : ""}
                key={p}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="role-fit-grid">
            <article className="studio-panel">
              <small>CURRENT LENS</small>
              <h3>{persona}</h3>
              <p>{personaData[persona].focus}</p>
              <div className="proof-stack">
                {personaData[persona].proof.map((x) => (
                  <span key={x}>
                    <BadgeCheck />
                    {x}
                  </span>
                ))}
              </div>
            </article>
            <article className="studio-panel">
              <label className="studio-label" htmlFor="job-description">
                JOB DESCRIPTION / ROLE CONTEXT
              </label>
              <textarea
                id="job-description"
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste a role description to map it to public portfolio evidence…"
              />
              <p className="privacy-inline">
                <ShieldCheck />
                Live review is transient · do not submit confidential or client
                data
              </p>
              <button
                className="button"
                disabled={liveLoading || jd.trim().length < 3}
                onClick={() =>
                  runLiveStudio(
                    `Analyze this job description for ${persona} fit. Identify matching evidence, supported gaps, and interview topics:\n${jd}`,
                    "Role-Fit Lens / public portfolio evidence",
                  )
                }
              >
                {liveLoading
                  ? "Reviewing evidence…"
                  : "Run live evidence review"}
              </button>
              {liveError && <p className="live-error">{liveError}</p>}
              {liveAnswer && (
                <div className="live-studio-result">
                  <strong>{liveAnswer.answer}</strong>
                  <small>{liveAnswer.sources.join(" · ")}</small>
                </div>
              )}
            </article>
          </div>
          {jd && (
            <div className="match-results">
              <div>
                <span>LOCAL SIGNALS</span>
                <strong>
                  {jdMatches.length
                    ? `${jdMatches.length} capability signals found`
                    : "No direct keyword match yet"}
                </strong>
              </div>
              {jdMatches.map((m) => (
                <a href={m.href} key={m.label}>
                  <Check />
                  <span>
                    <strong>{m.label}</strong>
                    <small>{m.project}</small>
                  </span>
                  <ArrowRight />
                </a>
              ))}
              <div className="gap-note">
                <TriangleAlert />
                <p>
                  <strong>Potential gap review</strong>
                  {jdMatches.length < 3
                    ? "The text does not yet map strongly to three portfolio areas. Treat this as an interview topic—not a fabricated match."
                    : "No obvious gap is inferred from keyword coverage alone. Validate depth in interview."}
                </p>
              </div>
            </div>
          )}
        </>
      );
    if (active === "architecture")
      return (
        <>
          <SectionTitle
            eyebrow="02 / ARCHITECTURE DECISION SIMULATOR"
            title="Change the constraints. Watch the controls move."
            copy="This is deterministic reference logic—not a claim that one architecture fits every environment."
          />
          <div className="simulator-layout">
            <div className="simulator-controls">
              {[
                [
                  "DATA SENSITIVITY",
                  sensitivity,
                  setSensitivity,
                  ["Public", "Internal", "Restricted"],
                ],
                [
                  "AUTONOMY",
                  autonomy,
                  setAutonomy,
                  ["Advisory", "Bounded tools", "Tool execution"],
                ],
                [
                  "LATENCY TARGET",
                  latency,
                  setLatency,
                  ["Interactive", "Near real-time", "Asynchronous"],
                ],
                [
                  "QUALITY REQUIREMENT",
                  quality,
                  setQuality,
                  ["Standard", "High assurance", "Regulated"],
                ],
                [
                  "COST PRESSURE",
                  cost,
                  setCost,
                  ["Low", "Balanced", "High pressure"],
                ],
              ].map(([label, value, setter, options]) => (
                <label key={label as string}>
                  <span>{label as string}</span>
                  <select
                    value={value as string}
                    onChange={(e) =>
                      (setter as (v: string) => void)(e.target.value)
                    }
                  >
                    {(options as string[]).map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <div className="architecture-output">
              <div className="architecture-output-head">
                <span>REFERENCE CONTROL PLANE</span>
                <strong>{architectureControls.length} controls selected</strong>
              </div>
              <Flow
                items={[
                  "Policy",
                  "Identity",
                  "Evidence",
                  autonomy === "Advisory" ? "Response" : "Tool boundary",
                  "Validation",
                  "Audit",
                ]}
              />
              <div className="control-cloud">
                {architectureControls.map((x, i) => (
                  <span key={x} className={i > 7 ? "elevated" : ""}>
                    <Check />
                    {x}
                  </span>
                ))}
              </div>
              <p className="tradeoff-note">
                <ArrowLeftRight />
                <strong>Trade-off:</strong> stronger assurance adds policy
                ownership, evaluation work, and latency. Controls are justified
                by risk—not accumulated for appearance.
              </p>
            </div>
          </div>
        </>
      );
    if (active === "evidence")
      return (
        <>
          <SectionTitle
            eyebrow="03 / EVIDENCE GRAPH"
            title="Every strong claim has a route back to proof."
            copy="Select a claim to trace its supporting system, engineering decision, implementation context, and outcome."
          />
          <div className="evidence-selector">
            {evidencePaths.map((x, i) => (
              <button
                key={x.claim}
                onClick={() => setEvidence(i)}
                className={evidence === i ? "active" : ""}
              >
                <small>{x.kind}</small>
                <strong>{x.claim}</strong>
              </button>
            ))}
          </div>
          <div className="evidence-graph" aria-label="Evidence trace">
            <div>
              <small>CLAIM</small>
              <strong>{evidencePaths[evidence].claim}</strong>
            </div>
            <ArrowRight />
            <div>
              <small>SYSTEM</small>
              <strong>{evidencePaths[evidence].project}</strong>
            </div>
            <ArrowRight />
            <div>
              <small>DECISION</small>
              <strong>{evidencePaths[evidence].decision}</strong>
            </div>
            <ArrowRight />
            <div>
              <small>TECHNOLOGY</small>
              <strong>{evidencePaths[evidence].tech}</strong>
            </div>
            <ArrowRight />
            <div className="outcome">
              <small>OUTCOME</small>
              <strong>{evidencePaths[evidence].outcome}</strong>
            </div>
          </div>
          <a className="studio-action" href={evidencePaths[evidence].href}>
            Inspect the supporting case study <ArrowRight />
          </a>
        </>
      );
    if (active === "comparison")
      return (
        <>
          <SectionTitle
            eyebrow="04 / NAIVE VS PRODUCTION"
            title="A model call is a component—not a system."
            copy="Drag the control to reveal the engineering that appears as risk and accountability increase."
          />
          <div className="comparison-control">
            <span>NAIVE DEMO</span>
            <input
              type="range"
              min="0"
              max="100"
              value={production}
              onChange={(e) => setProduction(Number(e.target.value))}
              aria-label="Production engineering depth"
            />
            <span>PRODUCTION-CONTROLLED</span>
          </div>
          <div
            className="comparison-stage"
            style={{ "--reveal": `${production}%` } as CSSProperties}
          >
            <div className="comparison-naive">
              <small>FAST TO DEMO</small>
              <Flow items={["Prompt", "Model", "Answer"]} />
              <ul>
                <li>No authorization boundary</li>
                <li>No evidence lineage</li>
                <li>Failure appears as an answer</li>
              </ul>
            </div>
            <div className="comparison-production">
              <small>DESIGNED TO OPERATE</small>
              <Flow
                items={[
                  "Policy",
                  "Identity",
                  "Retrieval",
                  "Rerank",
                  "Model",
                  "Validate",
                  "Audit",
                ]}
              />
              <div className="comparison-benefits">
                {[
                  "Security",
                  "Reliability",
                  "Explainability",
                  "Recovery",
                  "Cost control",
                  "Operational visibility",
                ].map((x) => (
                  <span key={x}>
                    <Check />
                    {x}
                  </span>
                ))}
              </div>
            </div>
            <div className="comparison-divider" />
          </div>
        </>
      );
    if (active === "incident")
      return (
        <>
          <SectionTitle
            eyebrow="05 / SYNTHETIC INCIDENT REPLAY"
            title="Watch a weak answer get stopped—and recovered."
            copy="A public, synthetic replay of a retrieval failure. Step through the event and inspect the engineering response."
          />
          <div className="incident-console">
            <div className="incident-top">
              <div>
                <span>INC-024 · RETRIEVAL QUALITY</span>
                <strong>
                  {incident < 3
                    ? "DEGRADING"
                    : incident < 6
                      ? "RECOVERING"
                      : "RESOLVED"}
                </strong>
              </div>
              <div className="incident-controls">
                <button
                  onClick={() => setIncident(Math.max(0, incident - 1))}
                  disabled={incident === 0}
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={() => setIncident(Math.min(6, incident + 1))}
                  disabled={incident === 6}
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
            <div className="incident-track">
              {incidentSteps.map((x, i) => (
                <button
                  key={x[0]}
                  onClick={() => setIncident(i)}
                  className={
                    incident === i ? "active" : i < incident ? "done" : ""
                  }
                >
                  <span>{i < incident ? <Check /> : i + 1}</span>
                  <small>{x[0]}</small>
                </button>
              ))}
            </div>
            <div className="incident-detail">
              <div className="incident-orb">
                <Bot />
                <i />
              </div>
              <div>
                <small>
                  EVENT {String(incident + 1).padStart(2, "0")} / 07
                </small>
                <h3>{incidentSteps[incident][0]}</h3>
                <p>{incidentSteps[incident][1]}</p>
                <strong>{incidentSteps[incident][2]}</strong>
              </div>
            </div>
          </div>
        </>
      );
    if (active === "security")
      return (
        <>
          <SectionTitle
            eyebrow="06 / SECURITY REVIEW MODE"
            title="Turn the system inside out."
            copy="Switch from the functional path to the trust, identity, data, and failure boundaries a reviewer needs to inspect."
          />
          <div className="security-mode-switch">
            <span>
              <strong>
                {securityMode ? "Security review" : "Functional view"}
              </strong>
              <small>
                {securityMode
                  ? "Boundaries and controls exposed"
                  : "Request path and system behavior"}
              </small>
            </span>
            <button
              onClick={() => setSecurityMode((v) => !v)}
              aria-pressed={securityMode}
            >
              <i />
              <span>{securityMode ? "Review on" : "Enable review"}</span>
            </button>
          </div>
          <div className={`security-blueprint ${securityMode ? "review" : ""}`}>
            <Flow
              items={[
                "User input",
                "Policy gateway",
                "Retrieval",
                "Tool workflow",
                "Model",
                "Output gate",
                "Audit",
              ]}
            />
            <div className="security-overlays">
              {(securityMode
                ? [
                    "DATA: internal / restricted",
                    "IDENTITY: caller → resource",
                    "PII: detect before context",
                    "TOOLS: least privilege",
                    "APPROVAL: consequential actions",
                    "RETENTION: minimize + redact",
                    "FAILURE: refuse / recover",
                    "AUDIT: policy + version + decision",
                  ]
                : [
                    "Classify request",
                    "Select path",
                    "Assemble evidence",
                    "Execute bounded action",
                    "Generate",
                    "Validate",
                    "Trace result",
                  ]
              ).map((x, i) => (
                <span key={x} style={{ animationDelay: `${i * 0.06}s` }}>
                  <ShieldCheck />
                  {x}
                </span>
              ))}
            </div>
          </div>
          <a className="studio-action" href="/security">
            Open the full AI security lab <ArrowRight />
          </a>
        </>
      );
    if (active === "tour")
      return (
        <>
          <SectionTitle
            eyebrow="07 / 90-SECOND GUIDED TOUR"
            title="The technical case, without the scavenger hunt."
            copy="Seven concise stops for a busy recruiter or hiring manager. Autoplay respects reduced-motion preferences."
          />
          <div className={`tour-stage ${tourPlaying ? "playing" : ""}`}>
            <div className="tour-progress">
              {tourSteps.map((_, i) => (
                <button
                  key={i}
                  className={i === tour ? "active" : i < tour ? "done" : ""}
                  onClick={() => setTour(i)}
                  aria-label={`Open tour step ${i + 1}`}
                >
                  <i />
                </button>
              ))}
            </div>
            <div className="tour-card">
              <span>
                STOP {String(tour + 1).padStart(2, "0")} / 07 · ~
                {tour === 6 ? "90" : Math.round(((tour + 1) * 90) / 7)} SEC
              </span>
              <h3>{tourSteps[tour][0]}</h3>
              <p>{tourSteps[tour][1]}</p>
              <a href={tourSteps[tour][2]}>
                Explore the evidence <ArrowRight />
              </a>
            </div>
            <div className="tour-controls">
              <button
                onClick={() => setTour(Math.max(0, tour - 1))}
                disabled={tour === 0}
              >
                <ChevronLeft />
                Back
              </button>
              <button className="play" onClick={toggleTour}>
                {tourPlaying ? (
                  <>
                    <Pause />
                    Pause · {tourRemaining}s
                  </>
                ) : (
                  <>
                    <Play />
                    Start 90-second tour
                  </>
                )}
              </button>
              <button
                onClick={() => setTour(Math.min(6, tour + 1))}
                disabled={tour === 6}
              >
                Next
                <ChevronRight />
              </button>
            </div>
          </div>
        </>
      );
    if (active === "interview")
      return (
        <>
          <SectionTitle
            eyebrow="08 / ASK ME ABOUT"
            title="Generate a better interview question."
            copy="Start from the curated evidence, or describe a role and generate fresh questions grounded in the public case studies."
          />
          <div className="interview-stage">
            <div className="question-machine">
              <span>
                QUESTION {String(question + 1).padStart(2, "0")} /{" "}
                {interviewQuestions.length.toString().padStart(2, "0")}
              </span>
              <blockquote>{interviewQuestions[question].q}</blockquote>
              <p>{interviewQuestions[question].why}</p>
              <div>
                <a href={interviewQuestions[question].href}>
                  <BadgeCheck />
                  {interviewQuestions[question].evidence}
                </a>
                <button
                  onClick={() =>
                    setQuestion((question + 1) % interviewQuestions.length)
                  }
                >
                  <WandSparkles />
                  Generate another
                </button>
              </div>
            </div>
            <aside>
              {interviewQuestions.map((x, i) => (
                <button
                  key={x.q}
                  onClick={() => setQuestion(i)}
                  className={question === i ? "active" : ""}
                >
                  <span>0{i + 1}</span>
                  {x.q}
                </button>
              ))}
            </aside>
          </div>
          <div className="live-interview-builder studio-panel">
            <label className="studio-label">OPTIONAL ROLE CONTEXT</label>
            <textarea
              value={livePrompt}
              onChange={(e) => setLivePrompt(e.target.value)}
              placeholder="Paste a role focus or interview context…"
            />
            <button
              className="button"
              disabled={liveLoading || livePrompt.trim().length < 3}
              onClick={() =>
                runLiveStudio(
                  `Generate five evidence-backed interview questions for this role context. Include what each question tests and the relevant project evidence:\n${livePrompt}`,
                  "Interview Generator / public case studies",
                )
              }
            >
              {liveLoading ? "Generating…" : "Generate grounded questions"}
            </button>
            {liveError && <p className="live-error">{liveError}</p>}
            {liveAnswer && (
              <div className="live-studio-result">
                <strong>{liveAnswer.answer}</strong>
                <small>{liveAnswer.sources.join(" · ")}</small>
              </div>
            )}
          </div>
        </>
      );
    if (active === "evolution")
      return (
        <>
          <SectionTitle
            eyebrow="09 / ARCHITECTURE EVOLUTION"
            title="Maturity is the history of corrected assumptions."
            copy="Move from a functional prototype to a production-controlled system and inspect what forced each change."
          />
          <div className="version-switch">
            {evolution.map((x, i) => (
              <button
                onClick={() => setVersion(i)}
                className={version === i ? "active" : ""}
                key={x.v}
              >
                <span>{x.v}</span>
                <strong>{x.name}</strong>
              </button>
            ))}
          </div>
          <div className="evolution-stage">
            <Flow items={evolution[version].path} />
            <div className="evolution-notes">
              <article>
                <small>WHAT FAILED</small>
                <p>{evolution[version].failed}</p>
              </article>
              <article>
                <small>WHAT CHANGED</small>
                <p>{evolution[version].change}</p>
              </article>
              <article>
                <small>TRADE-OFF INTRODUCED</small>
                <p>{evolution[version].tradeoff}</p>
              </article>
            </div>
          </div>
        </>
      );
    if (active === "rag")
      return (
        <>
          <SectionTitle
            eyebrow="10 / BROWSER-ONLY RAG PLAYGROUND"
            title="Turn text into an inspectable retrieval path."
            copy="Paste harmless sample text. Chunking, scoring, and the demonstration answer run deterministically in this browser—no model, upload, API, or storage."
          />
          <div className="rag-workbench">
            <div className="rag-input">
              <label>
                <span>SAFE SAMPLE DOCUMENT</span>
                <textarea
                  value={ragText}
                  onChange={(e) => setRagText(e.target.value)}
                />
              </label>
              <label>
                <span>QUESTION</span>
                <input
                  value={ragQuery}
                  onChange={(e) => setRagQuery(e.target.value)}
                />
              </label>
              <label>
                <span>CHUNKING</span>
                <select
                  value={chunkMode}
                  onChange={(e) => setChunkMode(e.target.value)}
                >
                  <option>Heading-aware</option>
                  <option>Fixed 24 words</option>
                  <option>Fixed 34 words</option>
                </select>
              </label>
              <p className="privacy-inline">
                <ShieldCheck />
                Processed locally and cleared when the tab closes
              </p>
            </div>
            <div className="rag-output">
              <div className="rag-pipeline-mini">
                {[
                  "Document",
                  `${chunks.length} chunks`,
                  "Keyword overlap",
                  "Ranked context",
                  "Extractive demo",
                ].map((x, i) => (
                  <span key={x}>
                    <small>0{i + 1}</small>
                    {x}
                  </span>
                ))}
              </div>
              <div className="retrieved-chunks">
                {ranked.slice(0, 3).map((c, i) => (
                  <article key={c.id} className={i === 0 ? "top" : ""}>
                    <span>
                      RANK {i + 1} · CHUNK {c.id}
                    </span>
                    <strong>Overlap score {c.score}</strong>
                    <p>{c.text}</p>
                  </article>
                ))}
              </div>
              <div className="demo-answer">
                <Bot />
                <div>
                  <span>DETERMINISTIC DEMO ANSWER</span>
                  <p>{topContext}</p>
                  <small>
                    This returns the strongest visible context—not a generated
                    claim.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    if (active === "readiness")
      return (
        <>
          <SectionTitle
            eyebrow="11 / PRODUCTION READINESS SCORECARD"
            title="Readiness is a set of arguments—not one score."
            copy="Select a dimension to inspect the evidence for release and the risk that remains open."
          />
          <div className="readiness-layout">
            <div className="readiness-radar">
              {readiness.map((x, i) => (
                <button
                  onClick={() => setScore(i)}
                  className={score === i ? "active" : ""}
                  key={x.name}
                >
                  <span>0{i + 1}</span>
                  <strong>{x.name}</strong>
                  <small>{x.status}</small>
                </button>
              ))}
            </div>
            <article className="readiness-detail">
              <span>DIMENSION {String(score + 1).padStart(2, "0")}</span>
              <h3>{readiness[score].name}</h3>
              <div>
                <BadgeCheck />
                <p>
                  <small>EVIDENCE</small>
                  {readiness[score].evidence}
                </p>
              </div>
              <div className="risk">
                <TriangleAlert />
                <p>
                  <small>REMAINING RISK</small>
                  {readiness[score].risk}
                </p>
              </div>
              <p className="no-score">
                No composite score: categories have different consequences and
                owners.
              </p>
            </article>
          </div>
        </>
      );
    if (active === "failures")
      return (
        <>
          <SectionTitle
            eyebrow="12 / FAILURE LIBRARY"
            title="The fix matters. The prevention matters more."
            copy="Six sanitized engineering failures expressed as symptom, root cause, correction, and durable prevention."
          />
          <div className="failure-layout">
            <nav>
              {failures.map((x, i) => (
                <button
                  key={x.name}
                  className={failure === i ? "active" : ""}
                  onClick={() => setFailure(i)}
                >
                  <span>F-{String(i + 1).padStart(2, "0")}</span>
                  {x.name}
                </button>
              ))}
            </nav>
            <article className="failure-record">
              <div>
                <TriangleAlert />
                <span>
                  FAILURE RECORD F-{String(failure + 1).padStart(2, "0")}
                </span>
              </div>
              <h3>{failures[failure].name}</h3>
              {[
                ["SYMPTOM", failures[failure].symptom],
                ["ROOT CAUSE", failures[failure].root],
                ["FIX", failures[failure].fix],
                ["PREVENTION", failures[failure].prevent],
              ].map(([l, t], i) => (
                <section key={l}>
                  <span>
                    {String(i + 1).padStart(2, "0")} / {l}
                  </span>
                  <p>{t}</p>
                </section>
              ))}
            </article>
          </div>
        </>
      );
    if (active === "brief")
      return (
        <>
          <SectionTitle
            eyebrow="13 / RECRUITER BRIEF"
            title="Why Lokesh for this role—in one printable view."
            copy={`The brief adapts to the active ${persona} lens without changing the underlying facts.`}
          />
          <article className="recruiter-brief" id="recruiter-brief">
            <header>
              <div>
                <span>30-SECOND TECHNICAL BRIEF</span>
                <h2>Lokesh Reddy V</h2>
                <p>Generative AI Engineer · United States</p>
              </div>
              <strong>{persona}</strong>
            </header>
            <p className="brief-summary">
              Builds production RAG, bounded agent workflows, evaluation
              systems, and LLM security controls. Strongest at the boundary
              between model capability and dependable software behavior.
            </p>
            <div className="brief-grid">
              <section>
                <small>CORE CAPABILITIES</small>
                {[
                  "Production retrieval systems",
                  "Bounded tool-using agents",
                  "Evaluation + release gates",
                  "AI application security",
                ].map((x) => (
                  <p key={x}>
                    <Check />
                    {x}
                  </p>
                ))}
              </section>
              <section>
                <small>SELECTED OUTCOMES</small>
                {personaData[persona].proof.map((x) => (
                  <p key={x}>
                    <BadgeCheck />
                    {x}
                  </p>
                ))}
              </section>
            </div>
            <div className="brief-systems">
              <small>RELEVANT SYSTEMS</small>
              {projects.slice(0, 3).map((p) => (
                <span key={p.slug}>{p.title}</span>
              ))}
            </div>
            <div className="brief-timeline">
              <small>EXPERIENCE PATH</small>
              {experience.map((x) => (
                <span key={x.company}>
                  <b>{x.dates.split(" — ")[0]}</b>
                  {x.role}
                  <em>{x.company}</em>
                </span>
              ))}
            </div>
            <div className="brief-questions">
              <small>SUGGESTED INTERVIEW TOPICS</small>
              {personaData[persona].questions.map((x) => (
                <p key={x}>{x}</p>
              ))}
            </div>
          </article>
          <div className="brief-actions">
            <button onClick={() => window.print()}>
              <Printer />
              Print brief
            </button>
            <a href="/resume">
              <Download />
              Open résumé options
            </a>
            <button onClick={() => setActive("role-fit")}>
              <Target />
              Change role lens
            </button>
            <button
              onClick={() =>
                runLiveStudio(
                  `Create a concise recruiter brief for a ${persona} reviewing this portfolio. Highlight strongest evidence, relevant projects, three interview topics, and one honest validation question.${jd ? ` Role context: ${jd}` : ""}`,
                  "Recruiter Brief / public portfolio",
                )
              }
            >
              {liveLoading ? "Preparing…" : "Generate live brief"}
            </button>
          </div>
          {liveAnswer && (
            <div className="live-studio-result">
              <strong>{liveAnswer.answer}</strong>
              <small>{liveAnswer.sources.join(" · ")}</small>
            </div>
          )}
        </>
      );
    if (active === "receipt")
      return (
        <>
          <SectionTitle
            eyebrow="14 / PROOF RECEIPT"
            title="Leave with an inspectable engineering trail."
            copy="Choose a system and generate a concise, portable receipt of what was reviewed. It contains no visitor, client, or confidential data."
          />
          <div className="receipt-layout">
            <div className="receipt-controls">
              <label>
                <span>SYSTEM INSPECTED</span>
                <select
                  value={receiptSystem}
                  onChange={(e) => {
                    setReceiptSystem(e.target.value);
                    setReceiptStatus("");
                  }}
                >
                  {projects.map((p) => (
                    <option key={p.slug}>{p.title}</option>
                  ))}
                </select>
              </label>
              <div>
                <button onClick={copyReceipt}>
                  <Copy />
                  Copy receipt
                </button>
                <button onClick={downloadReceipt}>
                  <Download />
                  Download .txt
                </button>
              </div>
              {receiptStatus && (
                <p>
                  <Check />
                  {receiptStatus}
                </p>
              )}
            </div>
            <pre className="proof-receipt">{receipt}</pre>
          </div>
        </>
      );
    return (
      <>
        <SectionTitle
          eyebrow="15 / SKILL CONSTELLATION"
          title="Skills are useful when they connect to evidence."
          copy="Select a node to see where the technology appears, the role it played, its surrounding system, and the evidence class."
        />
        <div className="constellation-layout">
          <div className="constellation" aria-label="Technology evidence map">
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <path d="M18 56 L43 24 L66 50 L47 77 L18 56 M43 24 L83 22 L66 50 M15 18 L43 24 L18 56 M47 77 L66 50" />
            </svg>
            {skillEvidence.map((x, i) => (
              <button
                key={x.name}
                className={skill === i ? "active" : ""}
                onClick={() => setSkill(i)}
                style={{ left: `${x.x}%`, top: `${x.y}%` }}
              >
                <i />
                {x.name}
              </button>
            ))}
          </div>
          <article className="skill-evidence">
            <span>EVIDENCE NODE {String(skill + 1).padStart(2, "0")}</span>
            <h3>{skillEvidence[skill].name}</h3>
            <small>ROLE IN THE SYSTEM</small>
            <p>{skillEvidence[skill].role}</p>
            <small>USED TOGETHER</small>
            <p>{skillEvidence[skill].around}</p>
            <small>EVIDENCE CLASS</small>
            <strong>{skillEvidence[skill].type}</strong>
            <a href={skillEvidence[skill].href}>
              Inspect supporting evidence <ArrowRight />
            </a>
          </article>
        </div>
      </>
    );
  };

  const current = modules.find((x) => x.id === active)!;
  const CurrentIcon = current.icon;
  return (
    <main className="studio-page">
      <section className="shell studio-intro">
        <div>
          <p className="kicker">ENGINEERING STUDIO / GUIDED SYSTEM EXPLORER</p>
          <h1>
            Choose a lens.
            <br />
            <span>Challenge the design.</span>
          </h1>
          <p>
            Fifteen browser-only modules explain architecture judgment, failure
            handling, security, and evidence. Start with the path that matches
            why you are here.
          </p>
          <div className="studio-start-paths">
            <button onClick={() => chooseModule("role-fit")}>
              <BriefcaseBusiness />
              <span>
                <strong>I’m hiring</strong>
                <small>Start with role fit and career evidence</small>
              </span>
              <ArrowRight />
            </button>
            <button onClick={() => chooseModule("architecture")}>
              <GitBranch />
              <span>
                <strong>I’m reviewing engineering</strong>
                <small>Start with decisions and trade-offs</small>
              </span>
              <ArrowRight />
            </button>
            <button onClick={() => chooseModule("security")}>
              <ShieldCheck />
              <span>
                <strong>I’m reviewing risk</strong>
                <small>Start with boundaries and controls</small>
              </span>
              <ArrowRight />
            </button>
          </div>
        </div>
        <div className="studio-intro-mark">
          <TerminalSquare />
          <span>LOCAL / SAFE</span>
          <strong>15</strong>
          <small>interactive modules</small>
        </div>
      </section>
      <section className="shell studio-mode-note">
        <div>
          <span>STUDIO</span>
          <strong>Explore the reasoning</strong>
          <p>
            Deterministic, synthetic, browser-only modules for inspecting design
            decisions.
          </p>
        </div>
        <ArrowRight />
        <div>
          <span>PLAYGROUND</span>
          <strong>Run the model</strong>
          <p>
            Live inference with Gemini primary, Groq and OpenRouter fallbacks,
            visible limits, and server-side keys.
          </p>
          <a href="/playground">
            Open live Playground <ArrowRight />
          </a>
        </div>
      </section>
      <section className="shell studio-shell">
        <nav
          className="studio-module-nav"
          aria-label="Engineering Studio modules"
        >
          <p>SELECT A MODULE</p>
          {modules.map(({ id, no, title, short, icon: Icon }) => (
            <a
              href={`/studio?module=${id}`}
              key={id}
              onClick={(event) => {
                event.preventDefault();
                chooseModule(id);
              }}
              className={active === id ? "active" : ""}
              aria-current={active === id ? "page" : undefined}
            >
              <span>{no}</span>
              <Icon />
              <div>
                <strong>{title}</strong>
                <small>{short}</small>
              </div>
              <ChevronRight />
            </a>
          ))}
        </nav>
        <div className="studio-workbench">
          <div className="studio-workbench-bar">
            <span>
              <i />
              MODULE {current.no} ACTIVE
            </span>
            <strong>
              <CurrentIcon />
              {current.title}
            </strong>
            <em>LOCAL / SYNTHETIC / SANITIZED</em>
            <ReddyHoverAction
              scope={`Engineering Studio / ${current.title}`}
              question={`Explain the ${current.title} Studio module, what it demonstrates, and what evidence I should inspect next.`}
            />
          </div>
          <div className="studio-workbench-body" key={active}>
            {renderModule()}
          </div>
        </div>
      </section>
    </main>
  );
}
