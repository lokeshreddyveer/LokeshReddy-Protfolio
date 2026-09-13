import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "/playground",
  "Live GenAI Playground | Lokesh Reddy V",
  "Operate six observable GenAI experiments: retrieval, prompt-injection detection, answer evaluation, production RAG comparison, agent tracing, and PII redaction."
);

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return children;
}
