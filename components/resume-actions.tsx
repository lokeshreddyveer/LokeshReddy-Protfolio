"use client";

import { Download, ExternalLink, Printer } from "lucide-react";

const resumePath = "/resume/Lokesh_Reddy_V_Generative_AI_Engineer.pdf";

export function ResumeActions() {
  return <div className="resume-actions">
    <a className="button" href={resumePath} target="_blank" rel="noreferrer"><ExternalLink/> Open in new tab</a>
    <a className="button outline" href={resumePath} download><Download/> Download PDF</a>
    <button className="button outline" type="button" onClick={() => window.print()}><Printer/> Print</button>
  </div>;
}
