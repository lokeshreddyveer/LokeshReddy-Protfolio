import { BarChart3, Layers3 } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { projects } from "@/lib/portfolio";
import { ProjectExplorer } from "@/components/project-explorer";

export default function ProjectsPage(){return <main><PageHeading eyebrow="SYSTEMS / CASE STUDIES" title="Production thinking, made inspectable." intro={`${projects.length} public-safe case studies across retrieval, agents, evaluation, infrastructure automation, network operations, and applied NLP. Search by capability or metric, compare two systems, then open the full case study.`}/><section className="shell project-index-summary"><span><BarChart3 size={17}/><strong>{projects.length}</strong><small>case studies</small></span><span><Layers3 size={17}/><strong>6</strong><small>system layers</small></span><p>Public-safe evidence only: no client identifiers, private data, or production endpoints.</p></section><ProjectExplorer /></main>}
