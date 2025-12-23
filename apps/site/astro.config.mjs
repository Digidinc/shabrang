import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load site config
let siteConfig = {};
const configPath = resolve(__dirname, 'site.config.mjs');
if (fs.existsSync(configPath)) {
  siteConfig = (await import(configPath)).default;
}

// Virtual module plugin for site config
function siteConfigPlugin() {
  const virtualModuleId = 'virtual:site-config';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'site-config',
    resolveId(id) {
      if (id === virtualModuleId) return resolvedVirtualModuleId;
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export default ${JSON.stringify(siteConfig)}`;
      }
    }
  };
}

export default defineConfig({
  site: siteConfig.domain ? `https://${siteConfig.domain}` : 'http://localhost:4321',
  base: '/content',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [siteConfigPlugin()]
  }
});
