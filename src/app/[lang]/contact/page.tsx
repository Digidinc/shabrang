import type { Metadata } from 'next';
import { getLanguages } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Connect with Shabrang for inquiries and collaborations.',
};

export function generateStaticParams() {
  return getLanguages().map((lang) => ({ lang }));
}

export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center gap-4 mb-12">
        <h1 className="text-3xl font-light text-frc-gold tracking-tight">Contact</h1>
        <div className="h-px flex-1 bg-gradient-to-r from-frc-blue to-transparent" />
      </div>

      <section className="border border-frc-blue p-8 space-y-6">
        <p className="text-frc-text leading-relaxed">
          We welcome inquiries, collaborations, and discussions related to Shabrang and The Liquid Fortress.
          If you have questions, want to explore partnerships, or wish to share your thoughts,
          feel free to reach out.
        </p>

        <div className="space-y-3 text-frc-text-dim">
          <p>
            <span className="text-frc-text">Website:</span>{' '}
            <a className="hover:text-frc-gold" href="https://shabrang.ca" target="_blank" rel="noopener noreferrer">
              shabrang.ca
            </a>
          </p>
          <p>
            <span className="text-frc-text">Author:</span> Kay Hermes
          </p>
          <p>
            <span className="text-frc-text">Book:</span>{' '}
            <a className="hover:text-frc-gold" href="https://www.amazon.com/LIQUID-FORTRESS-Structural-History-Persian-ebook/dp/B0GBJ47F5X" target="_blank" rel="noopener noreferrer">
              The Liquid Fortress on Amazon Kindle
            </a>
          </p>
        </div>

        <p className="text-xs text-frc-text-dim leading-relaxed">
          Thank you for your interest in Shabrang.
        </p>
      </section>
    </main>
  );
}
