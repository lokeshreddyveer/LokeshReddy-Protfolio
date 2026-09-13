import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { fieldNotes } from "@/lib/portfolio";
import { pageMetadata } from "@/lib/seo";

const articles = {
  "release-gates-for-llm-systems": {
    title: "Release gates for LLM systems",
    type: "Decision note",
    intro: "An AI feature should not be promoted because a handful of examples look impressive. It should be promoted when the evidence package explains what it does well, where it fails, and how the team can recover.",
    sections: [
      ["Start with the task, not the model", "A release gate begins with a task contract. What is the system expected to answer, classify, retrieve, or execute? Which cases are unacceptable even if the average score looks healthy? This framing keeps evaluation tied to user and operational outcomes rather than whichever benchmark is easiest to report."],
      ["Separate the gates", "I prefer separate checks for retrieval, generation, security, latency, and operational behavior. Retrieval can fail while the model remains fluent. A response can be relevant while leaking an unauthorized field. A system can be accurate but too slow or expensive for its intended workflow. One composite score hides those differences and makes ownership unclear."],
      ["Carry evidence into deployment", "The release artifact should identify the model and prompt versions, evaluation set, retrieval configuration, policy checks, latency and token observations, and rollback target. This is not bureaucracy around an AI feature; it is the minimum needed to explain a decision later. For high-impact workflows, a human approval boundary belongs in the release path as well."],
      ["Treat the gate as a control loop", "A failed gate should produce a useful next action: expand the test slice, change retrieval, tighten authorization, add a fallback, or defer release. The goal is not to make a system appear safe. The goal is to make behavior measurable enough that improvement is repeatable."],
    ],
  },
  "bounded-agents-over-open-loops": {
    title: "When a bounded workflow beats an autonomous loop",
    type: "Architecture note",
    intro: "Autonomy is not a maturity level by itself. In enterprise systems, the better design is often the smallest workflow that can express the task, expose its state, and recover safely.",
    sections: [
      ["Ask what can go wrong", "If a workflow can create a side effect, change a record, send a message, or expose sensitive information, an open-ended loop creates more uncertainty than value. The first design question should be which actions need permission, which state must be explicit, and what constitutes a verified outcome."],
      ["Make the graph visible", "A bounded workflow gives each meaningful state a name: clarify intent, retrieve evidence, request approval, invoke a tool, verify the result, or escalate. That makes traces understandable to engineers and reviewers. It also gives evaluation a concrete surface: each transition can have preconditions, test cases, and failure behavior."],
      ["Scope tools by action and resource", "A model should not receive a general-purpose capability simply because it may need one endpoint. Tool authorization should bind the caller, resource, action, and context. Consequential actions should be idempotent, observable, and independently verified. Human approval is a design control, not an admission that the system failed."],
      ["Earn autonomy gradually", "Start with recommendations or drafts. Add bounded execution only when evidence supports the transition. If the workflow cannot explain why an action was selected, what it changed, and how it can be reversed, it is not ready for broader autonomy."],
    ],
  },
  "retrieval-is-a-security-boundary": {
    title: "Retrieved text is evidence—not authority",
    type: "Security note",
    intro: "Retrieval improves an application's context, but it also introduces another stream of untrusted content. A document that appears in a search result should not gain the ability to rewrite policy or authorize an action.",
    sections: [
      ["Separate instruction classes", "System policy, application rules, user requests, retrieved passages, and tool responses have different trust levels. Keeping them visibly separate in the orchestration layer makes it possible to apply different validation and handling rules. Flattening everything into one prompt makes provenance and authorization harder to reason about."],
      ["Validate before context assembly", "Documents should pass access checks, freshness rules, metadata filters, and content-safety checks before they enter a model context. Retrieved text can be relevant and still contain a malicious instruction. The safe response is to preserve the evidence needed for an answer while excluding instructions that are not part of the document's informational role."],
      ["Never let evidence grant authority", "A retrieved passage should not be able to request secrets, change tool permissions, override a policy, or redirect data to an external destination. Those decisions belong to deterministic policy and authorization code. The model can help interpret evidence; it should not promote evidence into authority."],
      ["Make the decision auditable", "A useful trace records which sources were retrieved, what filters applied, which content was quarantined, which policy version made the decision, and whether the final answer was grounded. Redact sensitive payloads and retain only what a reviewer needs to reconstruct the control path."],
    ],
  },
} as const;

export function generateStaticParams(){return fieldNotes.map(note=>({slug:note.slug}))}
export function generateMetadata({params}:{params:{slug:string}}){const article=articles[params.slug as keyof typeof articles];if(!article)return {};return pageMetadata(`/notes/${params.slug}`,`${article.title} | Lokesh Reddy V`,article.intro)}

export default function NotePage({params}:{params:{slug:string}}){const article=articles[params.slug as keyof typeof articles];if(!article)notFound();return <main><article className="note-page shell"><a className="note-back" href="/about#field-notes"><ArrowLeft/>Back to Field Notes</a><header><p className="kicker">FIELD NOTE / {article.type.toUpperCase()}</p><h1>{article.title}</h1><p className="note-intro">{article.intro}</p><div className="note-safety"><ShieldCheck/>Public-safe engineering note · no client or confidential implementation details</div></header><div className="note-body">{article.sections.map(([heading,text])=><section key={heading}><h2>{heading}</h2><p>{text}</p></section>)}</div><footer className="note-footer"><a href="/studio">Explore the interactive Studio <ArrowRight/></a><a href="/about#field-notes">More Field Notes <ArrowRight/></a></footer></article></main>}
