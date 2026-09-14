import { fieldNotes } from "@/lib/portfolio";

export function GET() {
  const origin = "https://lokeshreddy.dev";
  const items = fieldNotes.map(note => `<item><title><![CDATA[${note.title}]]></title><link>${origin}${note.href}</link><guid isPermaLink="true">${origin}${note.href}</guid><pubDate>${new Date(`${note.publishedAt}T12:00:00Z`).toUTCString()}</pubDate><description><![CDATA[${note.summary}]]></description></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Lokesh Reddy — Field Notes</title><link>${origin}/notes</link><description>Public-safe engineering notes on generative AI systems.</description><language>en-us</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
