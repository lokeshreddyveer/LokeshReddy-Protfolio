/* Company marks are supplied SVG/JPEG assets with known dimensions per employer. */
/* eslint-disable @next/next/no-img-element */
export function CompanyLogo({ company, mark, src }: { company: string; mark: string; src: string }) {
  return <div className={`company-mark company-mark-${mark.toLowerCase()}`}>
    {src ? <img src={src} alt={`${company} logo`} /> : <span aria-hidden="true">{mark}</span>}
  </div>;
}
