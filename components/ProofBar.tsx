"use client";
/* The avatar is canvas-processed to remove its baked-in background. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Copy } from "lucide-react";

type Message = { role: "user" | "proof"; text: string; source?: string; time: string };
type Tool = "jd" | "tailor" | "contact" | "interview" | "receipt" | null;
type Language = "auto" | "en" | "te" | "hi" | "es" | "fr" | "de";
type VisitorMode = "recruiter" | "manager" | "technical";
type ProofResponse = { reply?: string; source?: string; error?: string };
const source = "Sources: lokeshreddy.dev · current resume-derived portfolio content";
const opening: Message = { role: "proof", text: "Hi! How are you? What would you like to know about Lokesh?", time: "" };
const reddyTaglines = [
  "Evidence before confidence",
  "Bounded autonomy · observable outcomes",
  "Retrieve · validate · evaluate",
  "Security at the model boundary",
  "Ask freely · I’m listening",
];

function detectIntent(question: string) {
  const value = question.toLowerCase();
  if (/interview|mock interview|question me|practice/.test(value)) return "interview practice";
  if (/compare|difference|versus| vs /.test(value)) return "project comparison";
  if (/resume|cv|job description|jd|recruiter|hiring/.test(value)) return "career or recruiter review";
  if (/project|case study|built|experience|skill|stack|technology/.test(value)) return "portfolio content";
  if (/architecture|rag|agent|retrieval|evaluation|security|prompt injection|pii/.test(value)) return "technical deep dive";
  if (/where|open|take me|page|playground|studio|contact/.test(value)) return "navigation";
  return "general conversation";
}

function detectLanguage(value: string): Exclude<Language, "auto"> {
  if (/[\u0C00-\u0C7F]/.test(value)) return "te";
  if (/[\u0900-\u097F]/.test(value)) return "hi";
  const text = ` ${value.toLowerCase()} `;
  const scores: Array<[Exclude<Language, "auto">, RegExp]> = [
    ["es", /\b(hola|gracias|qué|como|cómo|puedes|quiero|sobre|proyectos|experiencia|disponible|español)\b/g],
    ["fr", /\b(bonjour|merci|comment|peux|projets|expérience|disponible|français|avec|pourquoi)\b/g],
    ["de", /\b(hallo|danke|wie|kannst|projekte|erfahrung|verfügbar|deutsch|über|warum)\b/g],
    ["en", /\b(the|and|what|how|can|about|projects|experience|available|please|english)\b/g],
  ];
  let winner: Exclude<Language, "auto"> = "en";
  let highest = 0;
  for (const [language, pattern] of scores) {
    const score = text.match(pattern)?.length || 0;
    if (score > highest) { winner = language; highest = score; }
  }
  return winner;
}

function speechLocale(value: Exclude<Language, "auto">) {
  return value === "es" ? "es-ES" : value === "fr" ? "fr-FR" : value === "de" ? "de-DE" : value === "te" ? "te-IN" : value === "hi" ? "hi-IN" : "en-US";
}

function formatMessageTime(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function ReddyImage({ className, alt = "" }: { className: string; alt?: string }) {
  const [src, setSrc] = useState("/reddy-lokesh.png");
  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      const { data, width, height } = pixels;
      const background = (index: number) => {
        const r = data[index], g = data[index + 1], b = data[index + 2];
        return Math.max(r, g, b) - Math.min(r, g, b) < 14 && r > 205 && g > 205 && b > 205;
      };
      const queue: number[] = [];
      for (let x = 0; x < width; x += 1) { queue.push(x, (height - 1) * width + x); }
      for (let y = 1; y < height - 1; y += 1) { queue.push(y * width, y * width + width - 1); }
      const seen = new Uint8Array(width * height);
      while (queue.length) {
        const pixel = queue.pop()!;
        if (seen[pixel] || !background(pixel * 4)) continue;
        seen[pixel] = 1; data[pixel * 4 + 3] = 0;
        const x = pixel % width, y = Math.floor(pixel / width);
        if (x > 0) queue.push(pixel - 1); if (x < width - 1) queue.push(pixel + 1);
        if (y > 0) queue.push(pixel - width); if (y < height - 1) queue.push(pixel + width);
      }
      context.putImageData(pixels, 0, 0); setSrc(canvas.toDataURL("image/png"));
    };
    image.src = "/reddy-lokesh.png";
  }, []);

  return <img className={className} src={src} alt={alt} loading="eager" decoding="async" />;
}

function MicrophoneIcon({ listening = false }: { listening?: boolean }) {
  return <svg className="reddy-microphone-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <rect x="8" y="3" width="8" height="12" rx="4" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" />
    {listening && <circle cx="19" cy="5" r="2" className="reddy-mic-live" />}
  </svg>;
}

function renderMessage(text: string) {
  const parts: React.ReactNode[] = [];
  const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|(https?:\/\/[^\s]+|\/resume\b)/g;
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = linkPattern.exec(text))) {
    if (match.index > cursor) parts.push(<span key={`text-${cursor}`}>{text.slice(cursor, match.index)}</span>);
    const href = match[2] || match[3];
    const internal = href.startsWith("https://lokeshreddy.dev") ? href.replace("https://lokeshreddy.dev", "") || "/" : href;
    const label = match[1] || href;
    parts.push(<a href={internal} key={`link-${match.index}`} target={internal.startsWith("http") ? "_blank" : undefined} rel={internal.startsWith("http") ? "noreferrer" : undefined}>{label.replace(/[.,]+$/, "")}</a>);
    cursor = match.index + match[0].length;
  }
  if (cursor < text.length) parts.push(<span key={`text-${cursor}`}>{text.slice(cursor)}</span>);
  return parts;
}

export default function ProofBar() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([opening]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<Language>("auto");
  const [tool, setTool] = useState<Tool>(null);
  const [toolText, setToolText] = useState("");
  const [copied, setCopied] = useState<number | null>(null);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [webSearch, setWebSearch] = useState(false);
  const [visitorMode, setVisitorMode] = useState<VisitorMode>("recruiter");
  const [interviewMode, setInterviewMode] = useState(false);
  const [interviewRound, setInterviewRound] = useState(1);
  const [rememberConversation, setRememberConversation] = useState(true);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const launchRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const viewAsMenuRef = useRef<HTMLDivElement>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [viewAsOpen, setViewAsOpen] = useState(false);

  const capabilityPrompts: Array<[string, string]> = [
    ["Just chat", "Have a natural, friendly conversation with me. Do not turn this into a portfolio tour unless it becomes relevant."],
    ["Tell me about yourself", "Introduce yourself naturally, explain what you can help with, and ask what the visitor would like to talk about."],
    ["Compare projects", "Compare the Regulatory Intelligence, Due Diligence, Evaluation, and Applied NLP projects across problem, architecture, technologies, metrics, and trade-offs."],
    ["Resume + JD match", "Explain how to match a job description against Lokesh's resume and portfolio, then give strong matches, adjacent matches, gaps, and relevant links."],
    ["Interview prep", "Generate five technical interview questions for an engineering manager, with discussion areas and evidence from Lokesh's work."],
    ["Explain a concept", "Explain hybrid retrieval, reranking, faithfulness, and prompt-injection defense through Lokesh's projects in plain language."],
    ["RAG security tour", "Give me a guided tour of Lokesh's RAG security controls and link each relevant page."],
    ["Explain this page", "Explain the most important ideas on the page I am currently viewing and suggest what to read next."],
    ["Recruiter tour", "Give me a two-minute recruiter tour: strongest outcomes, relevant projects, resume link, and recommended next step."],
    ["Recruiter dashboard", "Create a recruiter-ready candidate brief with fit signals, evidence, honest validation gaps, interview topics, and next action."],
  ];
  const compactExplorePrompts = capabilityPrompts.filter(([label]) => [
    "Explain this page",
    "Compare projects",
    "Recruiter tour",
    "Resume + JD match",
    "Interview prep",
    "RAG security tour",
  ].includes(label));

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault(); setOpen(value => !value); window.setTimeout(() => inputRef.current?.focus(), 40);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setTaglineIndex(index => (index + 1) % reddyTaglines.length), 7000);
    return () => window.clearInterval(timer);
  }, []);

  const openPanel = () => {
    setOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 40);
  };

  useEffect(() => {
    setMessages(items => items.map((message, index) => index === 0 && !message.time ? { ...message, time: new Date().toISOString() } : message));
    const onCopilot = (event: Event) => {
      const detail = (event as CustomEvent<{ question?: string }>).detail;
      setOpen(true);
      if (detail?.question) setInput(detail.question);
      window.setTimeout(() => inputRef.current?.focus(), 40);
    };
    window.addEventListener("reddy:copilot", onCopilot);
    return () => window.removeEventListener("reddy:copilot", onCopilot);
  }, []);

  useEffect(() => {
    try {
      const remember = window.localStorage.getItem("reddy-remember") !== "false";
      setRememberConversation(remember);
      if (!remember) { setHydrated(true); return; }
      const saved = window.localStorage.getItem("reddy-conversation");
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        if (Array.isArray(parsed) && parsed.length) setMessages(parsed.slice(-30));
      }
    } catch { /* local history is optional */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try {
        if (rememberConversation) window.localStorage.setItem("reddy-conversation", JSON.stringify(messages.slice(-30)));
        else window.localStorage.removeItem("reddy-conversation");
        window.localStorage.setItem("reddy-remember", String(rememberConversation));
      } catch { /* storage may be blocked */ }
    }
  }, [messages, hydrated, rememberConversation]);

  useEffect(() => {
    const closeOnOutside = (event: PointerEvent) => {
      if (!open) return;
      const target = event.target as Node;
      if (actionMenuRef.current && !actionMenuRef.current.contains(target)) setExploreOpen(false);
      if (moreMenuRef.current && !moreMenuRef.current.contains(target)) setMoreOpen(false);
      if (viewAsMenuRef.current && !viewAsMenuRef.current.contains(target)) setViewAsOpen(false);
      if (!panelRef.current?.contains(target) && !launchRef.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    return () => document.removeEventListener("pointerdown", closeOnOutside);
  }, [open]);

  useEffect(() => {
    const openFromCommand = () => { setOpen(true); window.setTimeout(() => inputRef.current?.focus(), 40); };
    window.addEventListener("proof:open", openFromCommand);
    return () => window.removeEventListener("proof:open", openFromCommand);
  }, []);

  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [messages, loading, open]);

  function activateTool(next: Exclude<Tool, null>) {
    setTool(next);
    setToolText("");
    if (next === "receipt") void send("Give me a proof receipt summarizing what I learned, the projects discussed, and the best next step with clickable links.");
    window.setTimeout(() => inputRef.current?.focus(), 40);
  }

  function startInterviewMode() {
    setInterviewMode(true); setInterviewRound(1); setExploreOpen(false);
    window.setTimeout(() => void send("Start interview practice for a Generative AI Engineer role. Ask me exactly one question at a time and wait for my answer."), 0);
  }

  function clearHistory() {
    setMessages([{ ...opening, time: new Date().toISOString() }]);
    setInterviewMode(false); setInterviewRound(1); setMoreOpen(false);
    try { window.localStorage.removeItem("reddy-conversation"); } catch { /* storage may be blocked */ }
  }

  function exportConversation() {
    const markdown = messages.map(message => `${message.role === "user" ? "You" : "Reddy"}: ${message.text}`).join("\n\n");
    const blob = new Blob([`# Reddy conversation\n\n${markdown}`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob); const link = document.createElement("a");
    link.href = url; link.download = "reddy-conversation.md"; link.style.display = "none";
    document.body.appendChild(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMoreOpen(false);
  }

  async function copyMessage(index: number, text: string) {
    try { await navigator.clipboard.writeText(text); setCopied(index); window.setTimeout(() => setCopied(null), 1400); } catch { /* clipboard may be unavailable */ }
  }

  function startVoice() {
    setVoiceError("");
    type Recognition = { lang: string; interimResults: boolean; maxAlternatives: number; start: () => void; onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onerror: ((event: { error?: string }) => void) | null; onend: (() => void) | null };
    type VoiceWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
    const voiceWindow = window as VoiceWindow;
    const SpeechRecognition = voiceWindow.SpeechRecognition || voiceWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) { setVoiceError("Voice input is not supported in this browser. Try Chrome or Edge."); return; }
    const recognition = new SpeechRecognition(); recognition.lang = speechLocale(language === "auto" ? "en" : language); recognition.interimResults = false; recognition.maxAlternatives = 1; setListening(true);
    recognition.onresult = event => setInput(String(event.results[0][0].transcript));
    recognition.onerror = event => { setListening(false); setVoiceError(event.error === "not-allowed" ? "Microphone permission was blocked." : "Voice input could not start."); };
    recognition.onend = () => setListening(false);
    try { recognition.start(); } catch { setListening(false); setVoiceError("Voice input is already active."); }
  }

  function speakMessage(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text.replace(/https?:\/\/\S+/g, "")); utterance.lang = speechLocale(language === "auto" ? detectLanguage(text) : language); window.speechSynthesis.speak(utterance);
  }

  async function send(value = input) {
    const question = value.trim();
    if (!question || loading) return;
    try { window.localStorage.setItem("reddy-question-count", String(Number(window.localStorage.getItem("reddy-question-count") || "0") + 1)); } catch { /* analytics is device-local and optional */ }
    const responseLanguage = language === "auto" ? detectLanguage(question) : language;
    const nextMessages = [...messages, { role: "user" as const, text: question, time: new Date().toISOString() }];
    let pageContext: { title?: string; heading?: string; notesQuery?: string; selectedProjects?: string[]; activeModule?: string; overlay?: string } = {};
    try {
      pageContext = {
        title: document.title.slice(0, 120),
        heading: document.querySelector("main h1")?.textContent?.trim().slice(0, 160),
        activeModule: document.querySelector(".playground-workbench header strong, .architecture-inspector h2, .studio-module-nav button.active")?.textContent?.trim().slice(0, 120) || "",
        overlay: document.querySelector(".architecture-workbench")?.className.includes("security") ? "security" : document.querySelector(".architecture-workbench") ? "system" : "",
        notesQuery: window.localStorage.getItem("notes-search-query")?.slice(0, 120) || "",
        selectedProjects: JSON.parse(window.localStorage.getItem("project-compare-selection") || "[]").slice(0, 2),
      };
    } catch { /* page context is optional */ }
    setOpen(true); setInput(""); setMessages(nextMessages); setLoading(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch("/api/proof", { method: "POST", headers: { "content-type": "application/json" }, signal: controller.signal, body: JSON.stringify({ page: window.location.pathname, pageContext, mode: visitorMode, language: responseLanguage, webSearch, interviewMode, interviewRound, intent: detectIntent(question), messages: nextMessages.map(message => ({ role: message.role === "proof" ? "assistant" : "user", content: message.text })) }) });
      const payload = await response.json() as ProofResponse;
      if (!response.ok) throw new Error(payload.error || "Proof is unavailable right now.");
      const reply = payload.reply || "Reddy could not produce a response right now. Please try again.";
      setMessages(items => [...items, { role: "proof", text: reply, source: payload.source || source, time: new Date().toISOString() }]);
      if (interviewMode) setInterviewRound(round => Math.min(round + 1, 10));
      if (autoSpeak) speakMessage(reply);
    } catch (error) {
      setMessages(items => [...items, { role: "proof", text: error instanceof DOMException && error.name === "AbortError" ? "Reddy is taking longer than expected. Please try again." : error instanceof Error ? error.message : "Reddy is unavailable right now. Please try again.", source, time: new Date().toISOString() }]);
    } finally { window.clearTimeout(timeout); setLoading(false); }
  }

  return <>
    {!open && <div className="proof-launch" ref={launchRef}><button type="button" className="proof-callout proof-callout-loop" onClick={openPanel} aria-label="Ask Reddy about Lokesh">Hey 👋 Want to know about Lokesh? <b>Ask Reddy</b></button><button className="proof-pill" type="button" onClick={openPanel} aria-label="Open Reddy portfolio assistant"><ReddyImage className="reddy-image" /></button></div>}
    {open && <aside className="proof-panel" ref={panelRef} aria-label="Reddy portfolio assistant">
      <header className="proof-panel-head"><div className="proof-panel-identity"><div><strong>I’m Reddy</strong><small className="reddy-tagline" key={taglineIndex}><i className="reddy-live-dot"/>{reddyTaglines[taglineIndex]}</small></div><ReddyImage className="proof-avatar-image" /></div><div className="proof-head-actions"><button type="button" onClick={() => setOpen(false)} aria-label="Close Reddy assistant">✕</button></div></header>
      <div className="reddy-controls" aria-label="Reddy controls">
        <div className="reddy-view-menu" ref={viewAsMenuRef}>
          <button className="reddy-menu-trigger" type="button" onClick={() => { setViewAsOpen(value => !value); setMoreOpen(false); setExploreOpen(false); }} aria-label="Choose visitor perspective" aria-expanded={viewAsOpen}>View as {visitorMode === "recruiter" ? "Recruiter" : visitorMode === "manager" ? "Manager" : "Technical"} <ChevronDown size={12}/></button>
          {viewAsOpen && <div className="reddy-menu-popover reddy-view-popover" role="menu">
            {([['recruiter', 'Recruiter'], ['manager', 'Manager'], ['technical', 'Technical']] as const).map(([value, label]) => <button key={value} type="button" className={visitorMode === value ? "selected" : ""} onClick={() => { setVisitorMode(value); setViewAsOpen(false); }} aria-pressed={visitorMode === value}>{label}<span>{visitorMode === value ? "✓" : ""}</span></button>)}
          </div>}
        </div>
        <div className="reddy-toolbar-actions">
          <button className="reddy-new-chat" type="button" onClick={clearHistory} aria-label="Start a new chat">New</button>
          <div className="reddy-more-menu" ref={moreMenuRef}>
            <button className="reddy-menu-trigger" type="button" onClick={() => { setMoreOpen(value => !value); setExploreOpen(false); }} aria-label="More Reddy options" aria-expanded={moreOpen}>More <ChevronDown size={12}/></button>
            {moreOpen && <div className="reddy-menu-popover" role="menu">
              <label className="reddy-language reddy-export"><span>Export</span><select defaultValue="" onChange={event => { if (event.target.value) { exportConversation(); event.target.value = ""; } }} aria-label="Export conversation"><option value="" disabled>Choose</option><option value="markdown">Markdown</option></select></label>
              <label className="reddy-language reddy-web-search"><span>Web search</span><select value={webSearch ? "on" : "off"} onChange={event => setWebSearch(event.target.value === "on")} aria-label="Web search"><option value="off">Off</option><option value="on">On</option></select></label>
              <label className="reddy-language"><span>Language</span><select value={language} onChange={event => setLanguage(event.target.value as Language)} aria-label="Response language"><option value="auto">Auto-detect</option><option value="en">English</option><option value="es">Español</option><option value="fr">Français</option><option value="de">Deutsch</option><option value="te">తెలుగు</option><option value="hi">हिन्दी</option></select></label>
              <button type="button" className={autoSpeak ? "selected" : ""} onClick={() => setAutoSpeak(value => !value)}>{autoSpeak ? "Auto-speak on" : "Auto-speak"}</button>
              <button type="button" onClick={clearHistory}>Clear history</button>
              <button type="button" className={rememberConversation ? "selected" : ""} onClick={() => { const next = !rememberConversation; setRememberConversation(next); try { window.localStorage.setItem("reddy-remember", String(next)); if (!next) window.localStorage.removeItem("reddy-conversation"); } catch { /* storage may be blocked */ } }}>{rememberConversation ? "Local memory on" : "Local memory off"}</button>
            </div>}
          </div>
        </div>
        <div className="reddy-action-menu" ref={actionMenuRef}>
          <button className="reddy-menu-trigger" type="button" onClick={() => { setExploreOpen(value => !value); setMoreOpen(false); }} aria-label="Explore Reddy capabilities" aria-expanded={exploreOpen}>Explore <span>⌄</span></button>
          {exploreOpen && <div className="reddy-action-menu-grid" role="menu">
            {compactExplorePrompts.map(([label, prompt]) => <button type="button" key={label} onClick={() => void send(prompt)}>{label}</button>)}
            <button type="button" onClick={() => { setExploreOpen(false); activateTool("jd"); }}>Match a JD</button>
            <button type="button" onClick={() => { setExploreOpen(false); activateTool("tailor"); }}>Tailor resume</button>
            <button type="button" onClick={() => { setExploreOpen(false); activateTool("contact"); }}>Draft contact</button>
            <button type="button" onClick={() => { setExploreOpen(false); activateTool("interview"); }}>Interview kit</button>
            <button type="button" onClick={() => { setExploreOpen(false); activateTool("receipt"); }}>Proof receipt</button>
          </div>}
        </div>
        {interviewMode && <button className="reddy-interview-exit" type="button" onClick={() => setInterviewMode(false)}>Exit interview</button>}
      </div>
      <div className="proof-panel-messages" ref={bodyRef} data-lenis-prevent data-lenis-prevent-wheel data-lenis-prevent-touch aria-live="polite" aria-label="Reddy conversation">
        {messages.map((message, index) => <div className={`proof-panel-message ${message.role}`} key={`${message.role}-${index}`}><span className="proof-panel-role">{message.role === "user" ? "You" : "Reddy"}{message.time && <time dateTime={message.time}> · {formatMessageTime(message.time)}</time>}</span><div className="proof-panel-bubble">{renderMessage(message.text)}</div>{message.role === "proof" && <button className="reddy-copy-button" type="button" onClick={() => void copyMessage(index, message.text)} aria-label={copied === index ? "Copied response" : "Copy response"} title={copied === index ? "Copied" : "Copy response"}><Copy size={13} strokeWidth={1.8}/></button>}</div>)}
        {messages.length === 1 && !loading && <div className="reddy-starters" aria-label="Conversation starters">{capabilityPrompts.slice(0, 5).map(([label, prompt]) => <button type="button" key={label} onClick={() => void send(prompt)}>{label}</button>)}</div>}
        {tool && tool !== "receipt" && <div className="reddy-tool-form"><span>{tool === "jd" ? "JOB DESCRIPTION MATCHER" : tool === "tailor" ? "RESUME TAILOR" : tool === "contact" ? "CONTACT COMPOSER" : "INTERVIEW PREP"}</span><textarea value={toolText} onChange={event => setToolText(event.target.value)} placeholder={tool === "jd" || tool === "tailor" ? "Paste a job description…" : tool === "contact" ? "Why would you like to connect with Lokesh?" : "What role should the interview kit target?"} /><div><button type="button" onClick={() => setTool(null)}>Cancel</button><button type="button" disabled={!toolText.trim() || loading} onClick={() => { const prompt = tool === "jd" ? `Match this job description against Lokesh's experience. Extract requirements and classify each as strong match, adjacent match, or gap with evidence and links:\n\n${toolText}` : tool === "tailor" ? `Tailor Lokesh's resume for this job description. Return a recruiter-ready headline, summary, prioritized skills, and experience bullets using only truthful portfolio evidence. Include a short gap note and the resume link:\n\n${toolText}` : tool === "contact" ? `Draft a professional contact email based on this context. Include subject, concise message, and next step:\n\n${toolText}` : `Create an interview preparation kit for this role. Include questions, expected discussion areas, follow-ups, and evidence from Lokesh's portfolio:\n\n${toolText}`; setTool(null); void send(prompt); }}>Run</button></div></div>}
        {loading && <span className="proof-panel-thinking">Reddy is thinking...</span>}
      </div>
      {voiceError && <div className="reddy-voice-error" role="status">{voiceError}</div>}
      <form className="proof-panel-input" onSubmit={event => { event.preventDefault(); void send(); }}><input ref={inputRef} value={input} onChange={event => setInput(event.target.value)} placeholder="Ask anything..." aria-label="Ask Reddy a question" /><button type="button" className={`reddy-voice ${listening ? "active" : ""}`} onClick={startVoice} aria-label={listening ? "Listening" : "Use voice input"} title={listening ? "Listening…" : "Use voice input"}><MicrophoneIcon listening={listening} /></button><button type="submit" className="reddy-send" disabled={!input.trim() || loading} aria-label="Send message">Send</button></form>
    </aside>}
  </>;
}
