import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("/notes", "Field Notes | Lokesh Reddy V", "Short, public-safe engineering notes on GenAI architecture, evaluation, retrieval, agents, and security.");
export default function NotesLayout({ children }: { children: React.ReactNode }) { return children; }
