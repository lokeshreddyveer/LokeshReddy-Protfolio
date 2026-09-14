import { Mail } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/privacy", "Privacy Notice | Lokesh Reddy V", "How the portfolio handles local interactive state, downloads, external links, hosting data, and visitor privacy.");

export default function PrivacyPage() {
  return <main>
    <PageHeading eyebrow="LEGAL / PRIVACY" title="Privacy Notice" intro="A plain-language explanation of what this portfolio does—and does not—collect. Last updated September 12, 2026." />
    <section className="shell legal-page">
      <article>
        <h2>Summary</h2>
        <p>This is a personal professional portfolio. It does not require an account, does not contain advertising, and does not intentionally collect personal information through an on-site form.</p>

        <h2>Information you provide</h2>
        <p>The contact page can open your email application or a professional profile. If you choose the email action, your email application—not this website—prepares the message. Any information you send is handled by your email provider and the recipient’s email provider under their respective privacy terms.</p>

        <h2>Portfolio assistant and interactive labs</h2>
        <p>Reddy is a browser-based portfolio assistant. When you send a message, the selected conversation history, current page path, language, and audience mode are sent to the site’s server route so an AI provider can generate a response. The assistant is instructed to use public portfolio information; do not enter confidential, financial, health, employment, or other sensitive personal information.</p>

        <h2>Technical data</h2>
        <p>The hosting provider may process routine request data needed to deliver and secure the site, such as an IP address, browser information, requested URL, timestamps, and security events. Optional analytics integrations may be enabled for site improvement: Microsoft Clarity for masked interaction recordings and Google Analytics for aggregated traffic measurement.</p>

        <h2>Cookies and local storage</h2>
        <p>The portfolio does not use advertising trackers. If analytics is enabled, the relevant provider may set or read measurement identifiers according to its own privacy terms. Theme preference and Reddy’s recent conversation are stored locally in your browser so the interface can persist between visits. You can clear that data through your browser’s site-storage controls or use Reddy’s New chat action.</p>

        <h2>External links and downloads</h2>
        <p>Links to professional-profile, email, and other third-party destinations are governed by those services’ privacy practices. Resume downloads are served as a static file from this site.</p>

        <h2>Data sharing and retention</h2>
        <p>This website does not sell personal information. Because it does not operate a contact database or analytics store, it has no separate portfolio-user database retention schedule. Email correspondence you voluntarily send may be retained as reasonably necessary to respond and maintain professional records.</p>

        <h2>Your choices</h2>
        <p>You may browse without using the assistant, downloading the resume, opening external links, or sending email. You can also disable JavaScript, although interactive demonstrations will not function.</p>

        <h2>Changes</h2>
        <p>This notice may be updated when the site’s features or data practices change. The updated date at the top will identify the current version.</p>

        <h2>Contact</h2>
        <p>Questions about this notice can be sent through the <a href="/contact">Contact page</a>.</p>
      </article>
      <aside><Mail/><p>No account. No advertising. Reddy uses public portfolio context and a server-side AI request only when you choose to send a message.</p><a href="/terms" className="text-link">Read Terms of Use</a></aside>
    </section>
  </main>;
}
