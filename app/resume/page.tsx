// The résumé page intentionally serves the uploaded PDF asset only here.
import { PageHeading } from "@/components/page-heading";
import { ResumeActions } from "@/components/resume-actions";

export default function ResumePage(){return <main><PageHeading eyebrow="RECRUITER RESUME" title="Experience, skills, and selected impact." intro="Preview the current two-page résumé, open it in a dedicated tab, download it in your preferred format, or print directly."/><section className="shell resume-view"><ResumeActions/><div className="resume-preview-label"><span>Current recruiter version</span><small>PDF · 2 pages</small></div><object data="/resume/Lokesh_Reddy_V_Generative_AI_Engineer.pdf" type="application/pdf"><p>PDF preview is unavailable in this browser. Use Open in new tab or Download above.</p></object></section></main>}
