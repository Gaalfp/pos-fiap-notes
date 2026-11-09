/**
 * Troca os blocos ```mermaid pelo SVG já desenhado em tempo de build
 * (ver tools/renderizar-diagramas.mjs).
 *
 * Se o SVG não estiver no cache — diagrama novo, ainda não renderizado —,
 * cai no desenho pelo navegador, para não quebrar a página.
 */
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/* O Astro empacota o astro.config.mjs num diretório temporário, então
   import.meta.url não serve para achar src/. O build sempre roda com o cwd
   em web/, que é a referência estável. */
const DIAGRAMAS = join(process.cwd(), 'src', 'diagramas');
let avisou = false;

const hashDiagrama = (codigo) =>
  createHash('sha256').update(codigo.trim()).digest('hex').slice(0, 16);

const escapar = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function remarkMermaid() {
  return (tree) => {
    const percorrer = (no) => {
      if (!Array.isArray(no.children)) return;
      no.children = no.children.map((filho) => {
        if (filho.type !== 'code' || filho.lang !== 'mermaid') {
          percorrer(filho);
          return filho;
        }
        const hash = hashDiagrama(filho.value);
        const escuro = join(DIAGRAMAS, `${hash}-escuro.svg`);
        const claro = join(DIAGRAMAS, `${hash}-claro.svg`);

        if (existsSync(escuro) && existsSync(claro)) {
          const svg = (caminho) => readFileSync(caminho, 'utf-8');
          return {
            type: 'html',
            value:
              `<figure class="diagrama" data-tema="escuro">${svg(escuro)}</figure>` +
              `<figure class="diagrama" data-tema="claro">${svg(claro)}</figure>`,
          };
        }
        if (!avisou) {
          avisou = true;
          console.warn(
            `[mermaid] sem SVG no cache para ${hash} — o diagrama será desenhado no ` +
            `navegador. Rode: node tools/renderizar-diagramas.mjs`);
        }
        return { type: 'html', value: `<pre class="mermaid">${escapar(filho.value)}</pre>` };
      });
    };
    percorrer(tree);
    return tree;
  };
}
