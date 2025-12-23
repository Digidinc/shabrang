/// <reference types="astro/client" />

declare module 'virtual:site-config' {
  interface SiteConfig {
    name: string;
    domain: string;
    tenant: string;
    colors?: { primary?: string; accent?: string };
    nav?: Array<{ label: string; href: string }>;
    hero?: { title?: string; subtitle?: string };
    seo?: { title?: string; description?: string };
    social?: { twitter?: string; github?: string };
  }
  const config: SiteConfig;
  export default config;
}
