/**
 * Desenha os diagramas Mermaid em tempo de BUILD, em SVG.
 *
 * Por quê: desenhar no navegador custava 5,4 MB de JavaScript (elk, cytoscape,
 * katex) baixados por quem lê — caro no celular. Em SVG, o diagrama aparece
 * instantaneamente, funciona sem JavaScript e pesa alguns KB.
 *
 * Cada diagrama é identificado pelo hash do seu código-fonte e guardado em
 * web/src/diagramas/. O cache é versionado, então o build normal não precisa de
 * navegador: só quem ALTERA um diagrama roda este script.
 *
 * Uso:  node tools/renderizar-diagramas.mjs [--forcar]
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)));
const DESTINO = join(RAIZ, 'web', 'src', 'diagramas');
const IGNORAR = new Set(['.git', '.github', 'node_modules', 'web', 'tools', '.venv']);

/* paleta — a mesma de web/src/estilos.css */
const TEMAS = {
  escuro: {
    background: '#0A0A0A', primaryColor: '#1c1c1b', primaryTextColor: '#F5F5F2',
    primaryBorderColor: '#5a5a58', lineColor: '#9B9B97', secondaryColor: '#26262a',
    tertiaryColor: '#141414', mainBkg: '#1c1c1b', nodeBorder: '#5a5a58',
    clusterBkg: '#121211', clusterBorder: '#35352e', titleColor: '#F5F5F2',
    edgeLabelBackground: '#0A0A0A', textColor: '#F5F5F2',
    actorBkg: '#1c1c1b', actorBorder: '#5a5a58', actorTextColor: '#F5F5F2',
    signalColor: '#9B9B97', signalTextColor: '#F5F5F2', labelBoxBkgColor: '#1c1c1b',
    labelBoxBorderColor: '#5a5a58', labelTextColor: '#F5F5F2', loopTextColor: '#F5F5F2',
    noteBkgColor: '#26262a', noteTextColor: '#F5F5F2', noteBorderColor: '#5a5a58',
  },
  claro: {
    background: '#F4F1E6', primaryColor: '#ebe8dc', primaryTextColor: '#16160f',
    primaryBorderColor: '#9b9b93', lineColor: '#6b6b63', secondaryColor: '#e4e2d8',
    tertiaryColor: '#efece0', mainBkg: '#ebe8dc', nodeBorder: '#9b9b93',
    clusterBkg: '#efece0', clusterBorder: '#d8d5c8', titleColor: '#16160f',
    edgeLabelBackground: '#F4F1E6', textColor: '#16160f',
    actorBkg: '#ebe8dc', actorBorder: '#9b9b93', actorTextColor: '#16160f',
    signalColor: '#6b6b63', signalTextColor: '#16160f', labelBoxBkgColor: '#ebe8dc',
    labelBoxBorderColor: '#9b9b93', labelTextColor: '#16160f', loopTextColor: '#16160f',
    noteBkgColor: '#e4e2d8', noteTextColor: '#16160f', noteBorderColor: '#9b9b93',
  },
};

function arquivosMd(dir, saida = []) {
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    if (entrada.name.startsWith('.') || IGNORAR.has(entrada.name)) continue;
    const caminho = join(dir, entrada.name);
    if (entrada.isDirectory()) arquivosMd(caminho, saida);
    else if (entrada.name.endsWith('.md')) saida.push(caminho);
  }
  return saida;
}

export const hashDiagrama = (codigo) =>
  createHash('sha256').update(codigo.trim()).digest('hex').slice(0, 16);

function coletar() {
  const mapa = new Map();
  for (const arquivo of arquivosMd(RAIZ)) {
    const texto = readFileSync(arquivo, 'utf-8');
    const re = /^```mermaid\n([\s\S]*?)^```/gm;
    let m;
    while ((m = re.exec(texto))) {
      const codigo = m[1].trimEnd();
      mapa.set(hashDiagrama(codigo), { codigo, origem: relative(RAIZ, arquivo) });
    }
  }
  return mapa;
}

const forcar = process.argv.includes('--forcar');
mkdirSync(DESTINO, { recursive: true });

const diagramas = coletar();
const faltando = [...diagramas].filter(([h]) =>
  forcar || !existsSync(join(DESTINO, `${h}-escuro.svg`)) || !existsSync(join(DESTINO, `${h}-claro.svg`)));

console.log(`${diagramas.size} diagramas no repositório · ${faltando.length} para desenhar`);
if (!faltando.length) { console.log('cache completo, nada a fazer'); process.exit(0); }

// o playwright vive em web/node_modules, não ao lado deste script
const exigir = createRequire(join(RAIZ, 'web', 'package.json'));
const { chromium } = exigir('playwright');
const navegador = await chromium.launch();
const pagina = await navegador.newPage();
await pagina.setContent('<!doctype html><html><body><div id="alvo"></div></body></html>');
await pagina.addScriptTag({
  path: join(RAIZ, 'web', 'node_modules', 'mermaid', 'dist', 'mermaid.min.js'),
});

let ok = 0;
const erros = [];
for (const [hash, { codigo, origem }] of faltando) {
  for (const [nome, variaveis] of Object.entries(TEMAS)) {
    try {
      const svg = await pagina.evaluate(async ({ codigo, variaveis, id }) => {
        window.mermaid.initialize({
          startOnLoad: false, theme: 'base', themeVariables: variaveis,
          fontFamily: "'Figtree Variable', system-ui, sans-serif",
          flowchart: { useMaxWidth: true, htmlLabels: true },
          sequence: { useMaxWidth: true }, securityLevel: 'strict',
        });
        const { svg } = await window.mermaid.render(id, codigo);
        return svg;
      }, { codigo, variaveis, id: `d${hash}${nome}` });
      writeFileSync(join(DESTINO, `${hash}-${nome}.svg`), svg);
      ok++;
    } catch (e) {
      erros.push(`${origem} [${nome}]: ${String(e).split('\n')[0].slice(0, 110)}`);
    }
  }
}
await navegador.close();

console.log(`✓ ${ok} SVGs escritos em web/src/diagramas/`);
if (erros.length) {
  console.log(`✗ ${erros.length} falharam:`);
  erros.forEach((e) => console.log('   ', e));
}
