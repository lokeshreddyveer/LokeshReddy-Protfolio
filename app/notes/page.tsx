import { ArrowRight } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { fieldNotes } from "@/lib/portfolio";

export default function NotesPage() {
  return <main>
    <PageHeading eyebrow="FIELD NOTES / ENGINEERING WRITING" title="Short arguments from the systems layer." intro="Public-safe notes on retrieval, bounded agents, evaluation, security, and the controls that make GenAI dependable." />
    <section className="shell listing-grid note-index-grid">
      {fieldNotes.map((note, index) => <a href={note.href} key={note.slug} className="listing-card note-index-card">
        <div><span className="mono">0{index + 1} / {note.type}</span><ArrowRight /></div>
        <h2>{note.title}</h2>
        <p>{note.summary}</p>
        <small>{note.tags.join(" · ")}</small>
      </a>)}
    </section>
  </main>;
}
