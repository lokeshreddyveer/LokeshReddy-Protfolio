"use client";

import { Download, ExternalLink, Printer, X } from "lucide-react";
import { useState } from "react";

const resumePath = "/resume/Lokesh_Reddy_V_Generative_AI_Engineer.pdf";
const docxPath = "/resume/Lokesh_Reddy_V_Generative_AI_Engineer.docx";
const docxAvailable = false;

export function ResumeActions() {
  const [downloadOpen, setDownloadOpen] = useState(false);
  return <>
    <div className="resume-actions">
    <a className="button" href={resumePath} target="_blank" rel="noreferrer"><ExternalLink/> Open in new tab</a>
    <button className="button outline" type="button" onClick={() => setDownloadOpen(true)}><Download/> Download</button>
    <button className="button outline" type="button" onClick={() => window.print()}><Printer/> Print</button>
    </div>
    {downloadOpen && <div className="resume-download-backdrop" role="presentation" onClick={() => setDownloadOpen(false)}>
      <section className="resume-download-dialog" role="dialog" aria-modal="true" aria-labelledby="resume-download-title" onClick={(event) => event.stopPropagation()}>
        <button className="resume-download-close" type="button" aria-label="Close download options" onClick={() => setDownloadOpen(false)}><X size={17}/></button>
        <p className="kicker">DOWNLOAD RÉSUMÉ</p><h2 id="resume-download-title">Choose a format.</h2><p>Download the recruiter résumé as a PDF or editable Word document.</p>
        <div className="resume-download-options"><a className="button" href={resumePath} download onClick={() => setDownloadOpen(false)}><Download/> PDF</a>{docxAvailable ? <a className="button outline" href={docxPath} download onClick={() => setDownloadOpen(false)}><Download/> DOCX</a> : <button className="button outline" type="button" disabled title="Upload the DOCX résumé to enable this option"><Download/> DOCX <small>pending upload</small></button>}</div>
      </section>
    </div>}
  </>;
}
