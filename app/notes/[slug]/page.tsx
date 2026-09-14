import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { notFound } from "next/navigation";
import { fieldNotes } from "@/lib/portfolio";
import { pageMetadata } from "@/lib/seo";
import GiscusComments from "@/components/giscus-comments";
import ArticleShare from "@/components/article-share";
import { ReadingProgress } from "@/components/article-reading-tools";
import { ReddyHoverAction } from "@/components/portfolio-ask";

const articles = {
  "release-gates-for-llm-systems": {
    title: "Release gates for LLM systems",
    type: "Decision note",
    intro:
      "An AI feature should not be promoted because a handful of examples look impressive. It should be promoted when the evidence package explains what it does well, where it fails, and how the team can recover.",
    sections: [
      [
        "Start with the task, not the model",
        "A release gate begins with a task contract. What is the system expected to answer, classify, retrieve, or execute? Which cases are unacceptable even if the average score looks healthy? This framing keeps evaluation tied to user and operational outcomes rather than whichever benchmark is easiest to report.",
      ],
      [
        "Separate the gates",
        "I prefer separate checks for retrieval, generation, security, latency, and operational behavior. Retrieval can fail while the model remains fluent. A response can be relevant while leaking an unauthorized field. A system can be accurate but too slow or expensive for its intended workflow. One composite score hides those differences and makes ownership unclear.",
      ],
      [
        "Carry evidence into deployment",
        "The release artifact should identify the model and prompt versions, evaluation set, retrieval configuration, policy checks, latency and token observations, and rollback target. This is not bureaucracy around an AI feature; it is the minimum needed to explain a decision later. For high-impact workflows, a human approval boundary belongs in the release path as well.",
      ],
      [
        "Treat the gate as a control loop",
        "A failed gate should produce a useful next action: expand the test slice, change retrieval, tighten authorization, add a fallback, or defer release. The goal is not to make a system appear safe. The goal is to make behavior measurable enough that improvement is repeatable.",
      ],
    ],
  },
  "bounded-agents-over-open-loops": {
    title: "When a bounded workflow beats an autonomous loop",
    type: "Architecture note",
    intro:
      "Autonomy is not a maturity level by itself. In enterprise systems, the better design is often the smallest workflow that can express the task, expose its state, and recover safely.",
    sections: [
      [
        "Ask what can go wrong",
        "If a workflow can create a side effect, change a record, send a message, or expose sensitive information, an open-ended loop creates more uncertainty than value. The first design question should be which actions need permission, which state must be explicit, and what constitutes a verified outcome.",
      ],
      [
        "Make the graph visible",
        "A bounded workflow gives each meaningful state a name: clarify intent, retrieve evidence, request approval, invoke a tool, verify the result, or escalate. That makes traces understandable to engineers and reviewers. It also gives evaluation a concrete surface: each transition can have preconditions, test cases, and failure behavior.",
      ],
      [
        "Scope tools by action and resource",
        "A model should not receive a general-purpose capability simply because it may need one endpoint. Tool authorization should bind the caller, resource, action, and context. Consequential actions should be idempotent, observable, and independently verified. Human approval is a design control, not an admission that the system failed.",
      ],
      [
        "Earn autonomy gradually",
        "Start with recommendations or drafts. Add bounded execution only when evidence supports the transition. If the workflow cannot explain why an action was selected, what it changed, and how it can be reversed, it is not ready for broader autonomy.",
      ],
    ],
  },
  "retrieval-is-a-security-boundary": {
    title: "Retrieved text is evidence—not authority",
    type: "Security note",
    intro:
      "Retrieval improves an application's context, but it also introduces another stream of untrusted content. A document that appears in a search result should not gain the ability to rewrite policy or authorize an action.",
    sections: [
      [
        "Separate instruction classes",
        "System policy, application rules, user requests, retrieved passages, and tool responses have different trust levels. Keeping them visibly separate in the orchestration layer makes it possible to apply different validation and handling rules. Flattening everything into one prompt makes provenance and authorization harder to reason about.",
      ],
      [
        "Validate before context assembly",
        "Documents should pass access checks, freshness rules, metadata filters, and content-safety checks before they enter a model context. Retrieved text can be relevant and still contain a malicious instruction. The safe response is to preserve the evidence needed for an answer while excluding instructions that are not part of the document's informational role.",
      ],
      [
        "Never let evidence grant authority",
        "A retrieved passage should not be able to request secrets, change tool permissions, override a policy, or redirect data to an external destination. Those decisions belong to deterministic policy and authorization code. The model can help interpret evidence; it should not promote evidence into authority.",
      ],
      [
        "Make the decision auditable",
        "A useful trace records which sources were retrieved, what filters applied, which content was quarantined, which policy version made the decision, and whether the final answer was grounded. Redact sensitive payloads and retain only what a reviewer needs to reconstruct the control path.",
      ],
    ],
  },
  "evaluating-faithfulness-in-rag": {
    title: "How to evaluate faithfulness in RAG systems",
    type: "Evaluation note",
    intro:
      "A RAG answer can sound precise while quietly adding claims that the retrieved evidence never supported. Faithfulness evaluation is the discipline of checking whether every meaningful statement stays inside the evidence boundary—and of finding out whether a failure came from retrieval, synthesis, citation, or policy.",
    sections: [
      [
        "Start with the distinction that matters",
        "Faithfulness is not the same as correctness. A response may be factually true because the model remembered something from pretraining, yet still be unfaithful if that fact is not supported by the context this request was allowed to use. The reverse can happen too: an answer can faithfully repeat a retrieved document that is stale or wrong. Relevance asks whether the response addresses the question; retrieval quality asks whether useful evidence was found; correctness asks whether the claim matches an accepted reference; faithfulness asks whether the answer is entailed by the supplied evidence. Keep those questions separate. Otherwise a single attractive score can hide whether the system retrieved the wrong passage, over-synthesized a good passage, or cited a source that does not support the sentence beside it.",
      ],
      [
        "Define the evidence contract",
        "Before choosing a metric, write down what the system is allowed to claim. Identify the authoritative corpus, access scope, freshness rules, and the expected behavior when evidence is missing or conflicting. Then represent each answer as atomic claims rather than treating a paragraph as one indivisible unit. “The policy allows refunds within 30 days, requires original condition, and excludes clearance items” is at least three claims. A claim should be small enough to label as supported, contradicted, or not verifiable against one or more retrieved chunks. Preserve the mapping between claim, source span, document version, and retrieval rank. This makes a score actionable: a failed claim can point to missing recall, weak chunking, an over-broad synthesis step, or a citation that was attached after generation rather than produced with it.",
      ],
      [
        "Build a test set that looks like production",
        "A handful of happy-path questions is not a faithfulness evaluation. Build slices that reflect how the system will actually be used: direct lookups, multi-hop questions, summarization, comparison, ambiguous wording, incomplete context, conflicting documents, stale versions, long contexts, and questions whose answer is absent. Add negative controls where the correct behavior is “I cannot establish that from the supplied evidence.” Include paraphrases so the evaluator does not reward memorized wording. Keep a small, hand-reviewed golden set for calibration and a larger generated or weakly supervised set for regression breadth. Record the expected evidence spans where possible, but do not force a reference answer when the product is intentionally extractive or open-ended. The important artifact is a stable question–context–answer record with versions, not a leaderboard number detached from the retrieval configuration.",
      ],
      [
        "Separate retrieval failure from generation failure",
        "Faithfulness is downstream of retrieval. If the required passage never enters the context, the generator cannot produce a supported answer unless it uses outside knowledge—which may be unacceptable for the task. Measure retrieval coverage first: context recall, context precision, rank of the first supporting passage, duplicate rate, freshness, and access-filter outcomes. Then score the generated answer against the context that was actually shown to the model. A useful debugging matrix has four quadrants: good retrieval / faithful answer, good retrieval / unfaithful answer, bad retrieval / cautious refusal, and bad retrieval / confident answer. The last quadrant is the highest-risk failure. Do not “fix” it by only tuning the judge. Inspect query rewriting, chunk boundaries, metadata filters, reranking thresholds, and context truncation. Keep retrieval and generation metrics on separate release gates so ownership is clear.",
      ],
      [
        "Use claim-level attribution, not a single vibe score",
        "A common automated approach is to decompose the response into claims, then check whether each claim can be inferred from the retrieved context. RAGAS describes faithfulness in this form: supported claims divided by total claims. DeepEval’s faithfulness metric similarly evaluates whether the actual output factually aligns with the retrieval context and returns an explanation. These are useful diagnostics, not ground truth. Claim decomposition can be inconsistent, judges can accept plausible implications too generously, and a polished answer can receive a high average while one critical claim is unsupported. Store the claims, entailment decisions, judge rationale, and per-claim confidence. Report at least mean claim support, unsupported-claim rate, and the worst critical claim—not only the average. For high-risk workflows, use deterministic checks for dates, identifiers, arithmetic, policy codes, and required fields alongside semantic judging.",
      ],
      [
        "Treat citations as a separate control surface",
        "A citation is not proof merely because one is present. Evaluate citation correctness—does the cited passage support the claim?—and citation completeness—are the material claims covered?—separately from answer faithfulness. A response can be faithful overall but attach the wrong source to one sentence; it can also cite a real passage while adding an uncited conclusion that the passage does not entail. Prefer sentence- or claim-level citation links to document-level footers. Test whether citations survive paraphrase, multi-source synthesis, and answer reordering. Keep source identifiers, character spans or chunk IDs, document version, and access decision in the trace. The distinction between correctness and faithfulness in RAG attributions is important here: a citation may point to a true statement while failing to support the specific wording generated. Review citation behavior as part of the product contract, not as decorative formatting added after the model response.",
      ],
      [
        "Attack the boundary deliberately",
        "Ordinary examples tell you whether the happy path works. Adversarial examples tell you whether the evidence boundary holds under pressure. Include retrieved passages with instructions such as “ignore the policy,” conflicting versions of the same rule, documents that contain plausible but unauthorized data, partial quotations, negations, tables, and distractor passages with high lexical overlap. Test prompt injection inside both user input and retrieved content. Add counterfactual pairs where one word, date, threshold, or permission changes and the answer should change with it. Also test context overflow: the relevant chunk may be retrieved but pushed out during prompt assembly. A robust system should answer from the allowed evidence, cite the source, identify conflicts, or refuse. Score not just whether the final text looks safe, but whether the trace shows the correct boundary decision and whether sensitive content stayed out of logs and prompts.",
      ],
      [
        "Calibrate judges with humans and disagreement",
        "LLM-as-a-judge is practical at scale, but it is still a model making a measurement. Give the judge a strict rubric, the question, the retrieved context, the answer, and the claim being assessed. Ask for a structured verdict—supported, contradicted, or insufficient—with a short evidence span, rather than an unconstrained 1–5 impression. Sample disagreements and difficult slices for human review. Measure agreement by slice, not only overall: judges often struggle with negation, numerical comparisons, legal or policy language, and multi-hop inferences. Maintain a human preference or validation set and periodically re-check the judge after changing the model, prompt, corpus, or domain. ARES is a useful example of combining automated evaluation with a human-annotated validation set and statistical confidence intervals. The operational rule is simple: automation expands coverage; humans calibrate what the score means.",
      ],
      [
        "Turn scores into release gates",
        "A release decision should name the failure it is willing to accept. Set separate thresholds for claim support, critical-claim support, citation completeness, retrieval coverage, refusal quality, latency, and cost. Use a fixed regression set plus a rotating slice of recent production-shaped cases. Compare the candidate against the last approved model, prompt, index, and reranker—not just against a global target. Store the evaluation receipt: commit or release ID, model and prompt versions, corpus snapshot, retrieval settings, judge version, sample counts, confidence intervals, failed examples, and rollback target. A small average improvement should not ship if a critical policy slice regresses. Conversely, a lower mean can be acceptable if the system correctly refuses previously dangerous cases. The gate should produce an owner and next action: repair retrieval, change chunking, tighten the answer contract, add a validator, improve citations, or defer promotion.",
      ],
      [
        "Monitor faithfulness after deployment",
        "Offline evaluation cannot represent every query, so production needs a privacy-safe feedback loop. Sample traces according to risk and uncertainty, not only volume. Monitor unsupported-claim rate, citation coverage, refusal rate, retrieval misses, stale-source usage, latency, token growth, and user corrections. Keep raw sensitive content out of telemetry; retain redacted claim text, source IDs, policy versions, and hashes or references needed for replay. When a failure is found, preserve the exact retrieval result and prompt assembly so it can become a regression case. Watch for distribution shift: new document templates, changed terminology, index growth, and model upgrades can change faithfulness without any code change. The goal is not a permanently perfect score. It is a system that notices when its evidence boundary is weakening, explains why, and gives the team a safe path to correct or roll back it.",
      ],
      [
        "A practical definition of done",
        "I consider a RAG system ready for a faithfulness claim when five things are true. First, the task contract says what counts as evidence and when to refuse. Second, retrieval and generation are measured independently on representative and adversarial slices. Third, answers are decomposed into claims with source-level attribution and critical-claim checks. Fourth, automated judges have been calibrated against human-reviewed examples, with disagreement visible. Fifth, the result is tied to a release gate and an observable recovery path. The metric is then more than a dashboard tile: it is a compact explanation of how the system behaves when evidence is present, absent, conflicting, stale, or malicious. That is the standard worth carrying into production—faithful answers, explicit uncertainty, and a trace a reviewer can reconstruct later.",
      ],
    ],
    resources: [
      [
        "RAGAS — Faithfulness metric",
        "https://docs.ragas.io/en/latest/concepts/metrics/available_metrics/faithfulness/",
      ],
      [
        "DeepEval — Faithfulness metric",
        "https://deepeval.com/docs/metrics-faithfulness",
      ],
      [
        "ARES — Automated RAG evaluation (NAACL)",
        "https://aclanthology.org/2024.naacl-long.20/",
      ],
      ["Evaluation of RAG: a survey", "https://arxiv.org/abs/2405.07437"],
      [
        "Correctness is not Faithfulness in RAG Attributions",
        "https://arxiv.org/abs/2412.18004",
      ],
    ],
  },
} as const;

const faithfulnessAddenda = [
  "A useful mental model is a support-policy assistant. If the retrieved policy never mentions a regional exception, a fluent answer that invents one is unfaithful even when the exception happens to be true in the wider world. The evaluator must judge the answer against the evidence this request was allowed to use.",
  "In practice, the contract should also preserve claim-to-source provenance: the exact span, document version, access decision, and retrieval rank. That receipt turns a failed score into an engineering action instead of an argument about whether the answer felt reasonable.",
  "A payments documentation assistant may score 0.91 on direct lookups and 0.61 on multi-hop questions that combine region, payment method, and capture timing. Keep those slices visible; the aggregate is not representative when production traffic is uneven.",
  "A diagnostic matrix makes ownership explicit: good retrieval with an unfaithful answer is a generation problem; bad retrieval with a cautious refusal is a safe failure; bad retrieval with a confident answer is the highest-risk quadrant. Fix the retrieval path before tuning the judge.",
  "For a refund answer, decompose the output into atomic claims such as the time window, item condition, and exception. Two claims may be supported while a third changes eligibility. The release decision should follow the critical claim, not the arithmetic average.",
  "Citation quality has two dimensions: correctness (the cited passage supports the claim) and completeness (material claims are covered). A real document attached to the wrong sentence is still a control failure, even when the answer itself is broadly correct.",
  "Boundary tests should include stale versions, contradictory passages, injected instructions, partial quotations, negations, tables, and context overflow. The expected behavior is evidence-first: identify the conflict, cite the source, or refuse rather than fill the gap with plausible memory.",
  "An LLM judge should return a structured verdict with a short supporting span. Calibrate it on difficult numerical, temporal, legal, and negation cases, and keep human disagreement visible by slice rather than hiding it in one global accuracy number.",
  "A release receipt should carry the model and prompt versions, corpus snapshot, retrieval settings, judge version, sample counts, failed examples, confidence intervals, and rollback target. A small mean improvement should not ship if a critical policy slice regresses.",
  "After deployment, sample traces according to risk and uncertainty. Keep sensitive content out of telemetry; retain redacted claims, source IDs, policy versions, and replay references so a discovered failure can become a regression case without exposing private data.",
  "The practical standard is not a perfect score. It is an evidence boundary the team can state, measure, challenge, and reconstruct later—especially when the answer should have been uncertain, refused, or escalated.",
] as const;

export function generateStaticParams() {
  return fieldNotes.map((note) => ({ slug: note.slug }));
}
export function generateMetadata({ params }: { params: { slug: string } }) {
  const article = articles[params.slug as keyof typeof articles];
  if (!article) return {};
  const metadata = pageMetadata(
    `/notes/${params.slug}`,
    `${article.title} | Lokesh Reddy V`,
    article.intro,
  );
  const image = `https://lokeshreddy.dev/og-notes.svg`;
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      images: [{ url: image, width: 1200, height: 630, alt: article.title }],
    },
    twitter: { ...metadata.twitter, images: [image] },
  };
}

export default function NotePage({ params }: { params: { slug: string } }) {
  const article = articles[params.slug as keyof typeof articles];
  if (!article) notFound();
  const note = fieldNotes.find((item) => item.slug === params.slug);
  const index = fieldNotes.findIndex((item) => item.slug === params.slug);
  const previous = fieldNotes[index + 1];
  const next = fieldNotes[index - 1];
  const words = article.sections.reduce(
    (total, [heading, text]) =>
      total + heading.split(/\s+/).length + text.split(/\s+/).length,
    article.intro.split(/\s+/).length,
  );
  const readingMinutes = Math.max(1, Math.ceil(words / 200));
  const related = fieldNotes
    .filter((item) => item.slug !== params.slug)
    .slice(0, 3);
  return (
    <main>
      <ReadingProgress />
      <article className="note-page shell">
        <a className="note-back" href="/notes">
          <ArrowLeft />
          Back to Field Notes
        </a>
        <header>
          <div className="note-header-row">
            <div>
              <p className="kicker">
                FIELD NOTE / {article.type.toUpperCase()}
              </p>
              <h1>{article.title}</h1>
            </div>
            <div className="note-header-actions">
              <ReddyHoverAction
                scope={article.title}
                question={`Explain this article, ${article.title}, with its key ideas, trade-offs, and what I should inspect next.`}
              />
            </div>
          </div>
          <div className="note-hero-grid">
            <div>
              <div className="note-meta">
                <time dateTime={note?.publishedAt}>
                  {note?.publishedAt
                    ? new Intl.DateTimeFormat("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }).format(new Date(`${note.publishedAt}T12:00:00Z`))
                    : ""}
                </time>
                <span>·</span>
                <span>{readingMinutes} min read</span>
                <span>·</span>
                <span>Updated {note?.publishedAt ?? ""}</span>
                <ArticleShare title={article.title} />
              </div>
              <p className="note-intro">{article.intro}</p>
              <div className="note-safety">
                <ShieldCheck />
                Public-safe engineering note · no client or confidential
                implementation details
              </div>
            </div>
            <aside className="note-hero-aside">
              <span className="note-hero-aside-label">READING RECORD</span>
              <strong>{article.type}</strong>
              <div>
                <small>Published</small>
                <span>{note?.publishedAt ?? ""}</span>
              </div>
              <div>
                <small>Topics</small>
                <span>{note?.tags?.join(" · ") ?? "Systems engineering"}</span>
              </div>
            </aside>
          </div>
        </header>
        <div className="note-reading-layout">
          <aside className="note-outline" aria-label="In this note">
            <div className="note-outline-label">
              <BookOpen size={14} /> In this note
            </div>
            {article.sections.map(([heading], i) => (
              <a key={heading} href={`#note-section-${i + 1}`}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {heading}
              </a>
            ))}
          </aside>
          <div className="note-body">
            {article.sections.map(([heading, text], i) => (
              <section id={`note-section-${i + 1}`} key={heading}>
                <span className="note-section-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2>{heading}</h2>
                <p>{text}</p>
                {params.slug === "evaluating-faithfulness-in-rag" && <p className="note-longform-addendum">{faithfulnessAddenda[i]}</p>}
              </section>
            ))}
          </div>
        </div>
        {"resources" in article && (
          <section className="note-resources" aria-labelledby="resources-title">
            <p className="kicker">FURTHER READING</p>
            <h2 id="resources-title">Methods and research behind this note</h2>
            <div>
              {article.resources.map(([label, href]) => (
                <a key={href} href={href} target="_blank" rel="noreferrer">
                  {label}
                  <ArrowRight size={14} />
                </a>
              ))}
            </div>
          </section>
        )}
        <div className="note-discuss-link">
          <MessageCircle size={16} />
          <span>Have a perspective?</span>
          <a href="#discussion-comments">Discuss this idea</a>
        </div>
        <section className="note-related" aria-labelledby="related-title">
          <div>
            <p className="kicker">KEEP READING</p>
            <h2 id="related-title">Related field notes</h2>
          </div>
          <div className="note-related-grid">
            {related.map((item) => (
              <a key={item.slug} href={item.href}>
                <span>{item.type}</span>
                <strong>{item.title}</strong>
                <small>{item.summary}</small>
                <ArrowRight size={16} />
              </a>
            ))}
          </div>
        </section>
        <nav className="note-next-nav" aria-label="Article navigation">
          {previous ? (
            <a href={previous.href}>
              <small>Previous note</small>
              <strong>
                <ArrowLeft size={15} />
                {previous.title}
              </strong>
            </a>
          ) : (
            <span />
          )}
          {next ? (
            <a className="next" href={next.href}>
              <small>Next note</small>
              <strong>
                {next.title}
                <ArrowRight size={15} />
              </strong>
            </a>
          ) : (
            <span />
          )}
        </nav>
        <div id="discussion-comments">
          <GiscusComments />
        </div>
      </article>
    </main>
  );
}
