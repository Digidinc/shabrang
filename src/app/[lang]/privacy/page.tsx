import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Shabrang (shabrang.ca)',
};

export function generateStaticParams() {
  return getLanguages().map(lang => ({ lang }));
}

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center gap-4 mb-12">
        <h1 className="text-3xl font-light text-frc-gold tracking-tight">Privacy Policy</h1>
        <div className="h-px flex-1 bg-gradient-to-r from-frc-blue to-transparent" />
      </div>

      <div className="prose prose-invert max-w-none space-y-8">
        <p className="text-frc-text-dim text-sm">
          Last updated: January 2026
        </p>

        <section className="space-y-4">
          <h2 className="text-lg text-frc-text font-medium">1. Introduction</h2>
          <p className="text-frc-text-dim leading-relaxed">
            Shabrang (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website
            shabrang.ca. This Privacy Policy explains how we collect, use, and protect
            information when you visit our website.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg text-frc-text font-medium">2. Information We Collect</h2>
          <p className="text-frc-text-dim leading-relaxed">
            This is a static content website. We do not:
          </p>
          <ul className="list-disc list-inside text-frc-text-dim space-y-2 ml-4">
            <li>Require user accounts or registration</li>
            <li>Store personal information on our servers</li>
            <li>Use cookies for advertising purposes</li>
            <li>Sell or share data with third parties</li>
          </ul>
          <p className="text-frc-text-dim leading-relaxed mt-4">
            We may use analytics to understand how visitors use the site (see Section 3).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg text-frc-text font-medium">3. Analytics</h2>
          <p className="text-frc-text-dim leading-relaxed">
            We may use analytics services to understand how visitors interact with our website.
            These services collect anonymous usage data including pages visited, time spent,
            and general geographic location. This data is used solely to improve the website.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg text-frc-text font-medium">4. Hosting</h2>
          <p className="text-frc-text-dim leading-relaxed">
            This website is hosted on Cloudflare Pages. Cloudflare may collect standard web
            server logs including IP addresses, browser type, and pages visited for security
            and performance purposes. This data is processed according to
            <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-frc-gold hover:underline ml-1">
              Cloudflare&apos;s Privacy Policy
            </a>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg text-frc-text font-medium">5. External Links</h2>
          <p className="text-frc-text-dim leading-relaxed">
            Our website contains links to external services including Amazon, GitHub, and others.
            These external services have their own privacy policies. We encourage you to
            review them before interacting with these services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg text-frc-text font-medium">6. Your Rights</h2>
          <p className="text-frc-text-dim leading-relaxed">
            Since we do not collect personal data, there is no personal information to
            access, correct, or delete. If you have questions about data processed by
            our hosting provider (Cloudflare), please refer to their privacy policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg text-frc-text font-medium">7. Changes to This Policy</h2>
          <p className="text-frc-text-dim leading-relaxed">
            We may update this Privacy Policy from time to time. Changes will be posted
            on this page with an updated revision date.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg text-frc-text font-medium">8. Contact</h2>
          <p className="text-frc-text-dim leading-relaxed">
            For questions about this Privacy Policy, please contact us through the
            channels listed on our
            <a href="/en/about" className="text-frc-gold hover:underline ml-1">About page</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
