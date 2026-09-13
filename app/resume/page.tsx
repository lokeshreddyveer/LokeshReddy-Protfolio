import { PageHeading } from "@/components/page-heading";
import { ResumeActions } from "@/components/resume-actions";

export default function ResumePage(){return <main><PageHeading eyebrow="RECRUITER RESUME" title="Experience, skills, and selected impact." intro="Preview the current two-page résumé, open it in a dedicated tab, download the PDF, or print directly."/><section className="shell resume-view"><ResumeActions/><div className="resume-preview-label"><span>Current recruiter version</span><small>PDF · 2 pages · updated September 2026</small></div><object data="/resume/Lokesh_Reddy_V_Generative_AI_Engineer.pdf" type="application/pdf"><p>PDF preview is unavailable in this browser. Use Open in new tab or Download PDF above.</p></object></section></main>}
