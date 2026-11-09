/**
 * Mascote e paleta do projeto.
 *
 * O estilo vem do convite de aniversário do Gabriel (artefato "Festa de 23"):
 * sprites são arrays de strings, um caractere por pixel, cada caractere é uma
 * chave da paleta. '.' é transparente. É o mesmo sistema, para que o site e o
 * convite pareçam da mesma mão.
 */

export const PALETA = {
  k: '#050806',  // contorno (quase preto)
  c: '#F4F1E6',  // creme — fundo claro
  w: '#FFFFFF',
  p: '#F4B6C6', P: '#D98CA3',   // rosa
  y: '#F6D365', o: '#F2994A',   // amarelo / laranja
  g: '#B9DFA0', G: '#5E8F55',   // verde
  b: '#7A4B33', B: '#9C6444',   // madeira
  s: '#E3AE8B', S: '#C78A69', h: '#F6CFB3',   // pele: base, sombra, luz
  d: '#3A281D', e: '#1A1411', l: '#9A7552',   // cabelo/barba, olho, cabelo claro
  m: '#B5675C',                 // boca
  j: '#1E1E22', J: '#5A5A64',   // jaqueta
  t: '#0E0E10', z: '#C9C9D1',   // camiseta escura / detalhe claro
  n: '#151517', a: '#2A2A30',   // sapato / calça
};

/** Cabeça — 14 × 13 */
export const CABECA = [
  '...kkkkkkkk...',
  '.kshhsssssssk.',
  'kshhsssssssssk',
  'kssssssssssssk',
  'slllllllllllls',
  'slseslsslsesls',
  'klllllsslllllk',
  'ksssssSSsssssk',
  'kdssssssssssdk',
  'kdssddddddssdk',
  'kdddsmmmmsdddk',
  '.kddddddddddk.',
  '...kkkkkkkk...',
];

/** Corpo — 16 × 14 */
export const CORPO = [
  '......ssss......',
  '.kjjjJttttJjjjk.',
  'kjjjjJttttJjjjjk',
  'kjJjjjzttzjjjJjk',
  'kjJjjjzttzjjjJjk',
  'kjJjjjzttzjjjJjk',
  'kjjjjjzttzjjjjjk',
  'sjjjjjzttzjjjjjs',
  '.kjjjjjjjjjjjjk.',
  '..kaaaakkaaaak..',
  '..kaaak..kaaak..',
  '..kaaak..kaaak..',
  '.knnnnk..knnnnk.',
  '.kwwwwk..kwwwwk.',
];

/** Converte um sprite em SVG (um <rect> por corrida de pixels iguais). */
export function paraSvg(linhas, { escala = 1, paleta = PALETA } = {}) {
  const alt = linhas.length;
  const larg = Math.max(...linhas.map((l) => l.length));
  const partes = [];
  linhas.forEach((linha, y) => {
    let x = 0;
    while (x < linha.length) {
      const ch = linha[x];
      if (ch === '.' || ch === ' ') { x++; continue; }
      let fim = x;
      while (fim + 1 < linha.length && linha[fim + 1] === ch) fim++;
      const cor = paleta[ch] || ch;
      partes.push(`<rect x="${x}" y="${y}" width="${fim - x + 1}" height="1" fill="${cor}"/>`);
      x = fim + 1;
    }
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${larg} ${alt}" `
       + `width="${larg * escala}" height="${alt * escala}" shape-rendering="crispEdges" `
       + `role="img" aria-hidden="true">${partes.join('')}</svg>`;
}
