// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { remarkMermaid } from './src/plugins/remark-mermaid.mjs';

const ler = (arquivo) =>
  JSON.parse(readFileSync(new URL(arquivo, import.meta.url), 'utf-8'));

// ambos são gerados por tools/gerar-site.py, a partir de tools/estrutura.py
const barraLateral = ler('./src/barra-lateral.json');
const { base } = ler('./src/site.json');

export default defineConfig({
  site: 'https://gaalfp.github.io',
  base,
  markdown: {
    remarkPlugins: [remarkMermaid],
  },
  integrations: [
    starlight({
      title: 'ADJ · PÓSTECH FIAP',
      description: 'Anotações da pós-graduação em Arquitetura e Desenvolvimento Java',
      defaultLocale: 'root',
      locales: {
        root: { label: 'Português', lang: 'pt-BR' },
      },
      social: [
        {
          icon: 'github',
          label: 'Repositório no GitHub',
          href: 'https://github.com/Gaalfp/pos-fiap-notes',
        },
      ],
      sidebar: barraLateral,
      editLink: {
        baseUrl: 'https://github.com/Gaalfp/pos-fiap-notes/edit/main/',
      },
      lastUpdated: true,
      pagination: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      components: {
        Head: './src/components/Head.astro',
      },
      customCss: ['./src/estilos.css'],
    }),
  ],
});
