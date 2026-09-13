import type { Metadata } from "next";
import { SiteChrome } from "@/components/site-chrome";
import "./globals.css";
import "./premium.css";
import "./redesign.css";

export const metadata: Metadata = {
  title: "Lokesh Reddy V | Generative AI Engineer — RAG, Agents & LLM Security",
  description: "Lokesh Reddy V is a Generative AI Engineer building production RAG, bounded agents, evaluation systems, and LLM security controls.",
  metadataBase: new URL("https://lokeshreddy.dev"),
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
  openGraph: { title: "Lokesh Reddy V | Generative AI Engineer", description: "Production RAG, bounded agents, evaluation systems, and LLM security controls.", type: "website", url: "https://lokeshreddy.dev" },
  twitter: { card: "summary_large_image", title: "Lokesh Reddy V | Generative AI Engineer", description: "Production RAG, bounded agents, evaluation systems, and LLM security controls." },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{__html:`document.documentElement.dataset.theme='dark'`}} /></head>
      <body className="antialiased"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"Person","name":"Lokesh Reddy V","jobTitle":"Generative AI Engineer","url":"https://lokeshreddy.dev","knowsAbout":["Retrieval-Augmented Generation","AI Agents","LLM Security","Azure OpenAI","AI Evaluation","Python","FastAPI"]})}}/><SiteChrome>{children}</SiteChrome></body>
    </html>
  );
}
