import { NextResponse } from "next/server";
import { env } from "cloudflare:workers";
import { assistantAnswers, experience, fieldNotes, projects, skillGroups } from "@/lib/portfolio";

type Body = { question?: string; scope?: string; context?: string };
type ProviderResult = { text: string; provider: string } | null;

const buckets = new Map<string, { day: string; count: number }>();
const DAILY_LIMIT = 12;
const MAX_BUCKETS = 5000;

async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit = {}, timeoutMs = 9000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try { return await fetch(input, { ...init, signal: controller.signal }); }
  finally { clearTimeout(timer); }
}

function value(key: string) {
  const workerEnv = env as unknown as Record<string, string | undefined>;
  return workerEnv[key] || process.env[key];
}

function corpus() {
  return [
    "PUBLIC PORTFOLIO FACTS — Lokesh Reddy V, Generative AI Engineer.",
    ...projects.map(p => `${p.title}. ${p.summary} Role: ${p.role}. Outcome: ${p.outcome}. Decisions: ${p.decisions.join("; ")}. Stack: ${p.stack.join(", ")}.`),
    ...experience.map(x => `${x.company}: ${x.role}. ${x.detail} Highlights: ${x.highlights.join("; ")}`),
    ...skillGroups.map(([group, skills]) => `${group}: ${(skills as readonly string[]).join(", ")}`),
    ...fieldNotes.map(n => `${n.title}: ${n.summary}`),
  ].join("\n");
}

function sources(question: string, scope?: string) {
  const q = `${question} ${scope || ""}`.toLowerCase();
  const found: string[] = [];
  if (q.includes("project") || q.includes("built") || q.includes("rag") || q.includes("agent")) found.push("Projects / case studies");
  if (q.includes("experience") || q.includes("career") || q.includes("company") || q.includes("tcs")) found.push("Experience / career map");
  if (q.includes("security") || q.includes("injection") || q.includes("pii") || q.includes("authorization")) found.push("Security Lab / trust boundaries");
  if (q.includes("azure") || q.includes("openai") || q.includes("architecture") || q.includes("retrieval")) found.push("Architecture Explorer / decision records");
  if (q.includes("evaluation") || q.includes("quality") || q.includes("hallucination")) found.push("RAG Debugger / evaluation strategy");
  return found.length ? found : ["Portfolio index"];
}

function fallback(question: string, scope?: string) {
  const q = `${question} ${scope || ""}`.toLowerCase();
  const match = assistantAnswers.find(item => item.match.some(term => q.includes(term)));
  return match?.text || "I can answer from Lokesh's public portfolio about projects, architecture, Azure OpenAI, prompt security, evaluation, skills, and experience. I do not have evidence for private or client-confidential details.";
}

async function callGemini(prompt: string): Promise<ProviderResult> {
  const key = value("GEMINI_API_KEY");
  if (!key) return null;
  return callCompatible("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", key, "gemini-2.5-flash", prompt);
}

async function callCompatible(url: string, key: string | undefined, model: string, prompt: string, headers: Record<string, string> = {}): Promise<ProviderResult> {
  if (!key) return null;
  try {
    const response = await fetchWithTimeout(url, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${key}`, ...headers }, body: JSON.stringify({ model, temperature: 0.1, messages: [{ role: "system", content: "Answer only from the supplied public portfolio corpus. Be concise. Never invent private/client facts." }, { role: "user", content: prompt }] }) });
    if (!response.ok) return null;
    const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const text = payload.choices?.[0]?.message?.content?.trim();
    return text ? { text, provider: "live" } : null;
  } catch { return null; }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Body;
  const question = (body.question || "").trim().slice(0, 800);
  if (question.length < 3) return NextResponse.json({ error: "Ask a question with at least three characters." }, { status: 400 });
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const day = new Date().toISOString().slice(0, 10); const key = `${ip}:${day}`; const bucket = buckets.get(key) || { day, count: 0 };
  for (const [bucketKey, entry] of buckets) if (entry.day !== day) buckets.delete(bucketKey);
  if (buckets.size >= MAX_BUCKETS && !buckets.has(key)) return NextResponse.json({ error: "The public assistant is busy. Please try again shortly." }, { status: 429 });
  if (bucket.count >= DAILY_LIMIT) return NextResponse.json({ error: "The public assistant limit has been reached for today.", remaining: 0 }, { status: 429 });
  const prompt = `Question: ${question}\nScope: ${body.scope || "whole portfolio"}\n\nPUBLIC CORPUS:\n${corpus().slice(0, 30000)}\n\nAnswer in 2–5 sentences. If the corpus does not support the answer, say that clearly.`;
  const live = await callGemini(prompt) || await callCompatible("https://api.groq.com/openai/v1/chat/completions", value("GROQ_API_KEY"), "llama-3.3-70b-versatile", prompt) || await callCompatible("https://openrouter.ai/api/v1/chat/completions", value("OPENROUTER_API_KEY"), value("OPENROUTER_MODEL") || "openrouter/free", prompt, { "HTTP-Referer": "https://lokeshreddy.dev", "X-Title": "Lokesh Reddy Portfolio" }) || await callCompatible("https://integrate.api.nvidia.com/v1/chat/completions", value("NVIDIA_NIM_API_KEY"), value("NVIDIA_NIM_MODEL") || "nvidia/nemotron-3-super-120b-a12b", prompt, { "X-Title": "Lokesh Reddy Portfolio" });
  bucket.count += 1; buckets.set(key, bucket);
  return NextResponse.json({ answer: live?.text || fallback(question, body.scope), sources: sources(question, body.scope), live: Boolean(live), remaining: DAILY_LIMIT - bucket.count });
}
