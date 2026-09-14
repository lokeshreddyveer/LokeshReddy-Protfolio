import { PageHeading } from "@/components/page-heading";
import NotesIndex from "@/components/notes-index";

export default function NotesPage() {
  return <main>
    <PageHeading eyebrow="FIELD NOTES / ENGINEERING WRITING" title="Short arguments from the systems layer." intro="Public-safe notes on retrieval, bounded agents, evaluation, security, and the controls that make GenAI dependable." />
    <NotesIndex />
  </main>;
}
