import { ArrowLeft } from "lucide-react";

export function PageHeading({ eyebrow, title, intro, back }: { eyebrow: string; title: string; intro: string; back?: string }) {
  return <header className="page-heading shell">{back && <a href={back} className="text-link"><ArrowLeft size={15}/> Back</a>}<p className="kicker">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></header>;
}
