/**
 * O mascote do caderno e a paleta do projeto.
 *
 * Sprites são arrays de strings: um caractere por pixel, cada caractere é uma
 * chave da paleta. '.' é transparente. O mesmo sistema vale para os ícones de
 * matéria (icones.js).
 */

export const PALETA = {
  k: '#050806',  // contorno (quase preto)
  c: '#F4F1E6',  // creme — a capa do caderno
  w: '#FFFFFF',
  p: '#F4B6C6', P: '#D98CA3',   // rosa
  y: '#F6D365', o: '#F2994A',   // amarelo (o elástico) / laranja
  g: '#B9DFA0', G: '#5E8F55',   // verde
  b: '#7A4B33', B: '#9C6444',   // madeira
  s: '#E3AE8B', S: '#C78A69', h: '#F6CFB3',
  d: '#3A281D', e: '#1A1411', l: '#9A7552',   // 'e' é o olho
  m: '#B5675C',                 // a boca
  j: '#1E1E22', J: '#5A5A64',
  t: '#0E0E10', z: '#C9C9D1',   // 'z' é o metal da espiral
  n: '#151517', a: '#2A2A30',
};

/**
 * O mascote — 22 × 20.
 * Um computador de tubo, de óculos: a tela é o rosto, o aro prateado é a
 * armação, e embaixo tem o slot de disquete e o LED de energia.
 */
export const COMPUTADOR = [
  '......................',
  '..kkkkkkkkkkkkkkkkkk..',
  '..kcccccccccccccccck..',
  '..kckkkkkkkkkkkkkkck..',
  '..kcktttttttttttttkck.',
  '..kcktttttttttttttkck.',
  '..kckzzzzzttzzzzzzkck.',
  '..kckztttzzzztttztkck.',
  '..kckztwtzttztwtztkck.',
  '..kckztttzttztttztkck.',
  '..kckzzzzzttzzzzzzkck.',
  '..kcktttttttttttttkck.',
  '..kckkkkkkkkkkkkkkck..',
  '..kccckkkkkkkccgccck..',
  '..kkkkkkkkkkkkkkkkkk..',
  '........kkkkkk........',
  '........kcccck........',
  '........kcccck........',
  '....kkkkkkkkkkkkkk....',
  '....kcccccccccccck....',
  '....kkkkkkkkkkkkkk....',
];

/** O mesmo computador de olhos fechados, para a piscada. */
export const COMPUTADOR_PISCANDO = COMPUTADOR.map((linha, i) =>
  i === 8 ? '..kckztttzttztttztkck.' : linha,
);

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
