"use client";
import { useState } from "react";
import { Check, ChevronDown, ChevronRight, CirclePause, Play, RotateCcw } from "lucide-react";
import { PageHeading } from "@/components/page-heading";

const steps=[
  ["Request received","00ms","Normalize request and attach correlation ID.","input: schedule a 30-minute review next week"],
  ["Intent classified","18ms","Select bounded scheduling workflow.","intent: create_meeting · confidence: 0.96"],
  ["Policy checked","41ms","Validate allowed action and required fields.","policy: calendar.write · approval: required"],
  ["Availability retrieved","126ms","Call read-only availability tool.","tool: availability.search · results: 4"],
  ["Options ranked","188ms","Rank candidate slots by constraints.","selected: Tue 10:30 · alternatives: 2"],
  ["Approval gate","241ms","Pause before externally consequential action.","state: awaiting_confirmation"],
  ["Tool executed","486ms","Create event using idempotency key.","tool: calendar.create · status: success"],
  ["Outcome verified","628ms","Read after write and validate event fields.","verification: passed · audit: captured"],
] as const;

export default function AgentTrace(){const [expanded,setExpanded]=useState(2);const [run,setRun]=useState(8);return <main><PageHeading eyebrow="LAB / AGENT EXECUTION" title="See where autonomy stops." intro="An animated, synthetic trace of a bounded agent workflow with policy checks, human approval, idempotent tools, and outcome verification."/><section className="shell agent-console"><div className="agent-controls"><div><span className="signal"/><strong>Trace AGT-8C21</strong><small>{run===8?"completed":"paused"}</small></div><div><button onClick={()=>setRun(run===8?5:8)}>{run===8?<><RotateCcw/> Replay</>:<><Play/> Continue</>}</button><button onClick={()=>setRun(5)}><CirclePause/> Approval gate</button></div></div><div className="agent-layout"><div className="agent-steps">{steps.map(([name,time,detail,payload],i)=>{const done=i<run;return <article key={name} className={`${done?"done":"pending"} ${expanded===i?"expanded":""}`}><button onClick={()=>setExpanded(expanded===i?-1:i)}><span className="step-state">{done?<Check/>:String(i+1).padStart(2,"0")}</span><div><strong>{name}</strong><small>{time}</small></div>{expanded===i?<ChevronDown/>:<ChevronRight/>}</button>{expanded===i&&<div className="step-detail"><p>{detail}</p><code>{payload}</code><div><span>input validated</span><span>trace emitted</span>{i===5&&<span>human approval</span>}</div></div>}</article>})}</div><aside><p className="kicker">CURRENT STATE</p><h2>{run===8?"verified":"awaiting_confirmation"}</h2><div className="state-grid"><span><small>WORKFLOW</small>scheduling.v3</span><span><small>POLICY</small>tools.12</span><span><small>RETRIES</small>0 / 2</span><span><small>TOTAL</small>{run===8?"628ms":"241ms"}</span></div><p className="state-note">The model can propose the next action. Policy and application code decide whether it is permitted.</p></aside></div></section></main>}
