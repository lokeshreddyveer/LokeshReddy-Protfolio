"use client";
/* eslint-disable @next/next/no-img-element */

export function ReddyHoverAction({ scope, question, label = "Ask Reddy" }: { scope: string; question?: string; label?: string }) {
  const prompt = question || `Explain ${scope} in plain language, highlight the most important evidence, and suggest what I should explore next.`;
  return <button className="reddy-hover-action" type="button" aria-label={`${label}: ${scope}`} onClick={(event) => { event.stopPropagation(); window.dispatchEvent(new CustomEvent("reddy:copilot", { detail: { question: prompt } })); }}><img src="/reddy.png" alt="" /><span>{label}</span></button>;
}
