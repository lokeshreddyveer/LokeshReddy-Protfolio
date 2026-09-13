import { FileCheck2 } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/terms", "Terms of Use | Lokesh Reddy V", "Terms for viewing and using Lokesh Reddy V's public engineering portfolio and synthetic demonstrations.");

export default function TermsPage() {
  return <main>
    <PageHeading eyebrow="LEGAL / TERMS" title="Terms of Use" intro="Terms for using this personal engineering portfolio. Last updated September 12, 2026." />
    <section className="shell legal-page">
      <article>
        <h2>Purpose</h2>
        <p>This site presents professional background, engineering approaches, and interactive demonstrations for informational and recruitment purposes. By using it, you agree to these terms.</p>

        <h2>Demonstrations and accuracy</h2>
        <p>Interactive labs, traces, scores, documents, request identifiers, dashboards, and architecture views are illustrative. Unless expressly identified as a verified career metric, demonstration data is synthetic and should not be interpreted as live production telemetry or a promise of future performance.</p>

        <h2>No professional advice</h2>
        <p>Content is not legal, financial, compliance, cybersecurity, investment, or other professional advice. Architecture patterns must be evaluated against the requirements and risk profile of the system in which they may be used.</p>

        <h2>Confidentiality and affiliations</h2>
        <p>This portfolio is personal. Opinions and demonstrations are the author’s own and do not represent an employer, customer, university, or other organization. The site does not intentionally disclose client-confidential information, proprietary source code, internal prompts, production data, or non-public architecture.</p>

        <h2>Acceptable use</h2>
        <p>You may view, link to, and evaluate the site for legitimate professional purposes. You may not attempt to disrupt the service, bypass access controls, probe for secrets, impersonate the author, misrepresent portfolio content, or use automated activity that materially degrades availability.</p>

        <h2>Intellectual property</h2>
        <p>Original site copy, design, demonstrations, and presentation are protected by applicable intellectual-property laws. Technology names, logos, and third-party marks belong to their respective owners. Viewing this site does not grant a license to reuse its original content beyond ordinary personal evaluation, quotation, and linking permitted by law.</p>

        <h2>Third-party services</h2>
        <p>External links and email actions take you to services outside this site. Reddy messages may be processed by the configured AI provider through the site’s server route. Do not submit confidential or regulated information. Provider availability, security, content, and terms are controlled by their respective providers.</p>

        <h2>Assistant responses</h2>
        <p>Reddy is an informational guide, not a source of legal, financial, employment, security, or other professional advice. Responses can be incomplete or wrong; verify important claims against the linked portfolio pages and contact Lokesh directly for clarification.</p>

        <h2>Availability and warranties</h2>
        <p>The site is provided “as is” and “as available.” No guarantee is made that it will always be uninterrupted, error-free, or suitable for a particular purpose. Features may be changed, suspended, or removed.</p>

        <h2>Limitation of liability</h2>
        <p>To the maximum extent permitted by applicable law, the site owner is not liable for indirect, incidental, consequential, or special loss arising from reliance on the site, use of its demonstrations, or use of third-party links.</p>

        <h2>Changes</h2>
        <p>These terms may be updated as the portfolio evolves. Continued use after an update means the current terms apply to that use.</p>

        <h2>Contact</h2>
        <p>Questions about these terms can be sent through the <a href="/contact">Contact page</a>.</p>
      </article>
      <aside><FileCheck2/><p>Public portfolio content, synthetic engineering demonstrations, and no implied organizational endorsement.</p><a href="/privacy" className="text-link">Read Privacy Notice</a></aside>
    </section>
  </main>;
}
