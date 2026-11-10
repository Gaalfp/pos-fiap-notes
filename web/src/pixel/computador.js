/**
 * O mascote: um computador retrô (Macintosh 128K) de óculos, com olhos
 * desenhados pixel a pixel — 72 × 76.
 *
 * O sprite é PROCEDURAL: cada quadro é construído por código, não por uma
 * matriz escrita à mão. Isso permite animar olhar, piscada, sobrancelha e a
 * altura dos óculos sem redesenhar nada.
 *
 * Motor original desenhado para este projeto; portado para cá para que o site
 * gere os quadros em tempo de build (SVG) e, opcionalmente, anime no canvas.
 */

export const LARGURA = 72;
export const ALTURA = 76;

/* Esquemas de cor da íris */
const IRIS = {
  hazel: { limbal: '#231409', mid: '#6e3f19', light: '#a86829', fleck: '#c98a3e' },
  green: { limbal: '#102819', mid: '#255836', light: '#468c58', fleck: '#72b87f' },
  blue:  { limbal: '#12263a', mid: '#265178', light: '#4882b4', fleck: '#78b2e0' },
  amber: { limbal: '#2b1906', mid: '#8a520d', light: '#d48b19', fleck: '#f7b733' },
};

export function paleta(tomDaIris = 'hazel') {
  const iris = IRIS[tomDaIris] || IRIS.hazel;
  return {
    OUTLINE: '#141210', CASE_LIGHT: '#efe4ca', CASE_MAIN: '#dfd1b2',
    CASE_MID: '#c7b695', CASE_SHADOW: '#9e8d6f', CASE_DEEP: '#6b5d47',
    VENT_DARK: '#3b3328',
    CRT_BEZEL: '#1a211e', CRT_BG_DARK: '#161e1b', CRT_BG_MID: '#1e2925',
    CRT_GLOW: '#26342f',
    BROW_DARK: '#121316', BROW_MID: '#25282e', LID_CREASE: '#151c19',
    LID_SKIN: '#384740', LID_HIGH: '#4b5d55', LASH_LINE: '#0d0f11',
    LOWER_LID: '#2c3934',
    CARUNCLE: '#6b4c4c', SCLERA_DEEP: '#7e9096', SCLERA_SHAD: '#a8b8be',
    SCLERA_MID: '#d0dde2', SCLERA_LITE: '#eef5f7',
    IRIS_LIMBAL: iris.limbal, IRIS_MID: iris.mid, IRIS_LIGHT: iris.light,
    IRIS_FLECK: iris.fleck, PUPIL: '#050608',
    SPECULAR_1: '#ffffff', SPECULAR_2: '#b8dce8',
    FRAME_BLACK: '#0b0c0e', FRAME_DARK: '#191b20', FRAME_EDGE: '#2f343d',
    FRAME_HINGE: '#9ba3ad',
    LOGO_G: '#5dbb46', LOGO_Y: '#f5b800', LOGO_O: '#e86f1c',
    LOGO_R: '#d9383a', LOGO_B: '#2b7de9',
  };
}

/* Quadros: lookX/lookY (direção do olhar), blink (0 aberto … 3 fechado),
   squint, browY, browTilt, glassesY, glintOffset */
export const ANIMACOES = {
  idle: [
    { lookX: 0, lookY: 0, blink: 0, squint: 0, browY: 0, browTilt: 0, glassesY: 0, glintOffset: 0 },
    { lookX: 0, lookY: 0, blink: 0, squint: 0, browY: 0, browTilt: 0, glassesY: 0, glintOffset: 0 },
    { lookX: 0, lookY: 0, blink: 0, squint: 0, browY: 0, browTilt: 0, glassesY: 0, glintOffset: 0 },
    { lookX: 1, lookY: 0, blink: 0, squint: 0, browY: 0, browTilt: 0, glassesY: 0, glintOffset: 0 },
    { lookX: 1, lookY: 0, blink: 0, squint: 0, browY: 0, browTilt: 0, glassesY: 0, glintOffset: 0 },
    { lookX: 0, lookY: 0, blink: 1, squint: 0, browY: 0, browTilt: 0, glassesY: 0, glintOffset: 0 },
    { lookX: 0, lookY: 0, blink: 3, squint: 0, browY: 1, browTilt: 0, glassesY: 0, glintOffset: 0 },
    { lookX: 0, lookY: 0, blink: 1, squint: 0, browY: 0, browTilt: 0, glassesY: 0, glintOffset: 0 },
  ],
  scan: [
    { lookX: -2, lookY: 0, blink: 0, squint: 0, browY: 0, browTilt: 1, glassesY: 0, glintOffset: -1 },
    { lookX: -1, lookY: 0, blink: 0, squint: 0, browY: 0, browTilt: 1, glassesY: 0, glintOffset: 0 },
    { lookX: 0,  lookY: 0, blink: 0, squint: 0, browY: 0, browTilt: 1, glassesY: 0, glintOffset: 0 },
    { lookX: 1,  lookY: 0, blink: 0, squint: 0, browY: 0, browTilt: 1, glassesY: 0, glintOffset: 1 },
    { lookX: 2,  lookY: 0, blink: 0, squint: 0, browY: 0, browTilt: 1, glassesY: 0, glintOffset: 1 },
    { lookX: 2,  lookY: 1, blink: 1, squint: 0, browY: 0, browTilt: 1, glassesY: 0, glintOffset: 0 },
    { lookX: -2, lookY: 1, blink: 0, squint: 0, browY: 0, browTilt: 1, glassesY: 0, glintOffset: -1 },
    { lookX: -1, lookY: 1, blink: 0, squint: 0, browY: 0, browTilt: 1, glassesY: 0, glintOffset: 0 },
  ],
  focus: [
    { lookX: 0,  lookY: 0, blink: 0, squint: 1, browY: 1, browTilt: 1, glassesY: 0, glintOffset: 0 },
    { lookX: 0,  lookY: 0, blink: 0, squint: 1, browY: 1, browTilt: 1, glassesY: 0, glintOffset: 0 },
    { lookX: -1, lookY: 0, blink: 0, squint: 1, browY: 1, browTilt: 1, glassesY: 0, glintOffset: 0 },
    { lookX: -1, lookY: 0, blink: 0, squint: 1, browY: 1, browTilt: 1, glassesY: 0, glintOffset: 0 },
    { lookX: 1,  lookY: 0, blink: 0, squint: 1, browY: 1, browTilt: 1, glassesY: 0, glintOffset: 0 },
    { lookX: 0,  lookY: 0, blink: 0, squint: 1, browY: 1, browTilt: 1, glassesY: 0, glintOffset: 0 },
  ],
  ajustar_oculos: [
    { lookX: 0, lookY: 1, blink: 0, squint: 0, browY: 0, browTilt: 0, glassesY: 1,  glintOffset: -4 },
    { lookX: 0, lookY: 1, blink: 1, squint: 0, browY: 0, browTilt: 1, glassesY: 1,  glintOffset: -2 },
    { lookX: 0, lookY: 0, blink: 3, squint: 0, browY: 1, browTilt: 1, glassesY: -1, glintOffset: 2, brightGlint: true },
    { lookX: 0, lookY: 0, blink: 1, squint: 1, browY: 1, browTilt: 1, glassesY: -1, glintOffset: 6, brightGlint: true },
    { lookX: 0, lookY: 0, blink: 0, squint: 1, browY: 0, browTilt: 1, glassesY: 0,  glintOffset: 10 },
    { lookX: 0, lookY: 0, blink: 0, squint: 0, browY: 0, browTilt: 0, glassesY: 0,  glintOffset: 0 },
  ],
};

const grade = () => Array.from({ length: ALTURA }, () => new Array(LARGURA).fill(null));

const px = (g, x, y, cor) => {
  if (x >= 0 && x < LARGURA && y >= 0 && y < ALTURA && cor) g[y][x] = cor;
};

const ret = (g, x, y, w, h, cor) => {
  for (let dy = 0; dy < h; dy++) for (let dx = 0; dx < w; dx++) px(g, x + dx, y + dy, cor);
};

/** Um olho: sobrancelha, pálpebras, esclera com volume, íris em camadas e reflexo. */
function olho(g, baseX, baseY, direito, estado, P) {
  const { lookX, lookY, blink, squint, browY, browTilt } = estado;

  // sobrancelha (2px de espessura, com inclinação quando franzida)
  const by = baseY - 4 + browY;
  for (let dx = 0; dx < 15; dx++) {
    const medial = direito ? dx < 5 : dx > 9;
    const externo = direito ? dx > 12 : dx < 2;
    const py = by + (browTilt && medial ? 1 : 0) + (externo ? 1 : 0);
    px(g, baseX + dx, py, P.BROW_MID);
    px(g, baseX + dx, py + 1, P.BROW_DARK);
    if (!externo) px(g, baseX + dx, py + 2, P.LID_CREASE);
  }

  // olho fechado
  if (blink === 3) {
    for (let ry = 0; ry < 6; ry++) {
      for (let rx = 1; rx < 14; rx++) {
        px(g, baseX + rx, baseY + ry, ry === 0 ? P.LID_CREASE : (ry < 4 ? P.LID_SKIN : P.LID_HIGH));
      }
    }
    for (let rx = 1; rx < 14; rx++) {
      const curva = rx === 1 || rx === 13 ? 0 : 1;
      px(g, baseX + rx, baseY + 4 + curva, P.LASH_LINE);
      px(g, baseX + rx, baseY + 5 + curva, P.LOWER_LID);
    }
    return;
  }

  // prega da pálpebra
  for (let rx = 2; rx < 13; rx++) px(g, baseX + rx, baseY - 1, P.LID_CREASE);

  // esclera em formato amendoado, com sombreamento esférico
  for (let ry = 1; ry <= 5; ry++) {
    for (let rx = 1; rx <= 13; rx++) {
      if ((ry === 1 || ry === 5) && (rx <= 2 || rx >= 12)) continue;
      const lacrimal = direito ? (rx <= 2 && ry >= 3 && ry <= 4) : (rx >= 12 && ry >= 3 && ry <= 4);
      if (lacrimal) { px(g, baseX + rx, baseY + ry, P.CARUNCLE); continue; }
      let cor = P.SCLERA_LITE;
      if (ry === 1 || ry === 2) cor = P.SCLERA_DEEP;
      else if (rx <= 3 || rx >= 11) cor = P.SCLERA_SHAD;
      else if (ry === 5) cor = P.SCLERA_MID;
      px(g, baseX + rx, baseY + ry, cor);
    }
  }

  // íris (anel limbal, meia-lua iluminada), pupila e reflexo
  const cx = 7 + lookX, cy = 3 + lookY;
  for (let iy = -2; iy <= 2; iy++) {
    for (let ix = -2; ix <= 2; ix++) {
      if (Math.abs(ix) === 2 && Math.abs(iy) === 2) continue;
      const rx = cx + ix, ry = cy + iy;
      if (rx < 2 || rx > 12 || ry < 1 || ry > 5) continue;
      if ((ry === 1 || ry === 5) && (rx <= 2 || rx >= 12)) continue;
      let cor = P.IRIS_MID;
      const dist = ix * ix + iy * iy;
      if (dist >= 3) cor = P.IRIS_LIMBAL;
      else if (iy === 1 && Math.abs(ix) <= 1) cor = ix === 0 ? P.IRIS_FLECK : P.IRIS_LIGHT;
      if ((ix === 0 || ix === 1) && (iy === 0 || iy === -1)) cor = P.PUPIL;
      if (ry === 1 && cor !== P.PUPIL) cor = P.IRIS_LIMBAL;
      px(g, baseX + rx, baseY + ry, cor);
    }
  }
  const sx = Math.max(3, Math.min(11, cx - 1));
  const sy = Math.max(2, Math.min(4, cy - 1));
  px(g, baseX + sx, baseY + sy, P.SPECULAR_1);
  if (sy + 2 <= 5 && sx + 2 <= 11) px(g, baseX + sx + 2, baseY + sy + 2, P.SPECULAR_2);

  // cílios, cantos e pálpebras
  for (let rx = 1; rx <= 13; rx++) px(g, baseX + rx, baseY + (rx <= 2 || rx >= 12 ? 1 : 0), P.LASH_LINE);
  px(g, baseX, baseY + 3, P.LASH_LINE);
  px(g, baseX + 14, baseY + 3, P.LASH_LINE);

  if (blink === 1 || squint === 1) {
    for (let rx = 1; rx <= 13; rx++) {
      px(g, baseX + rx, baseY + 1, P.LID_SKIN);
      px(g, baseX + rx, baseY + 2, P.LASH_LINE);
    }
    for (let rx = 2; rx <= 12; rx++) px(g, baseX + rx, baseY + 5, P.LOWER_LID);
  }
  for (let rx = 2; rx <= 12; rx++) {
    px(g, baseX + rx, baseY + 6, P.LOWER_LID);
    if (rx >= 4 && rx <= 10) px(g, baseX + rx, baseY + 7, P.LID_CREASE);
  }
}

/** Os óculos de aro grosso, por cima da tela. */
function oculos(g, glassesY, glintOffset, brilhoForte, P) {
  const gy = 20 + (glassesY || 0);

  ret(g, 9, gy + 1, 5, 3, P.FRAME_BLACK);
  ret(g, 58, gy + 1, 5, 3, P.FRAME_BLACK);
  px(g, 9, gy + 1, P.FRAME_EDGE);
  px(g, 61, gy + 1, P.FRAME_EDGE);

  ret(g, 34, gy + 1, 4, 2, P.FRAME_BLACK);
  ret(g, 34, gy + 1, 4, 1, P.FRAME_EDGE);
  px(g, 34, gy + 3, P.FRAME_BLACK);
  px(g, 37, gy + 3, P.FRAME_BLACK);

  [{ x1: 13, x2: 34 }, { x1: 37, x2: 58 }].forEach((lente, i) => {
    const { x1, x2 } = lente;
    const w = x2 - x1 + 1;
    ret(g, x1, gy, w, 2, P.FRAME_BLACK);
    ret(g, x1 + 1, gy, w - 2, 1, P.FRAME_EDGE);
    ret(g, x1 + 1, gy + 13, w - 2, 2, P.FRAME_BLACK);
    ret(g, x1 + 2, gy + 13, w - 4, 1, P.FRAME_DARK);
    ret(g, x1, gy + 2, 2, 11, P.FRAME_BLACK);
    ret(g, x2 - 1, gy + 2, 2, 11, P.FRAME_BLACK);
    if (i === 0) {
      px(g, x1 + 1, gy + 2, P.FRAME_HINGE);
      px(g, x1 + 2, gy + 2, P.FRAME_HINGE);
    } else {
      px(g, x2 - 1, gy + 2, P.FRAME_HINGE);
      px(g, x2 - 2, gy + 2, P.FRAME_HINGE);
    }
    const base = x1 + 4 + (glintOffset || 0);
    for (let ly = 2; ly <= 12; ly++) {
      for (let lx = x1 + 2; lx <= x2 - 2; lx++) {
        const diag = (lx - base) + (ly - 2);
        if (brilhoForte && diag >= 0 && diag <= 4) px(g, lx, gy + ly, P.SPECULAR_1);
        else if ((diag === 0 || diag === 1) &&
                 (lx < x1 + 6 || lx > x2 - 5 || ly <= 3 || ly >= 11)) {
          px(g, lx, gy + ly, P.SPECULAR_2);
        }
      }
    }
  });
}

/** Monta a grade completa de um quadro. */
export function quadro(animacao = 'idle', indice = 0, tomDaIris = 'hazel') {
  const P = paleta(tomDaIris);
  const g = grade();
  const quadros = ANIMACOES[animacao] || ANIMACOES.idle;
  const e = quadros[indice % quadros.length];

  // gabinete
  ret(g, 13, 2, 46, 1, P.OUTLINE);
  ret(g, 12, 3, 48, 1, P.OUTLINE);
  ret(g, 13, 3, 45, 1, P.CASE_LIGHT);
  for (let y = 4; y <= 50; y++) {
    px(g, 11, y, P.OUTLINE);
    px(g, 60, y, P.OUTLINE);
    px(g, 12, y, P.CASE_LIGHT);
    ret(g, 13, y, 42, 1, P.CASE_MAIN);
    ret(g, 55, y, 2, 1, P.CASE_MID);
    ret(g, 57, y, 3, 1, P.CASE_SHADOW);
  }

  // moldura e tela
  ret(g, 15, 7, 39, 1, P.CASE_SHADOW);
  ret(g, 15, 38, 39, 1, P.CASE_LIGHT);
  for (let y = 8; y <= 37; y++) {
    px(g, 15, y, P.CASE_SHADOW);
    px(g, 54, y, P.CASE_LIGHT);
  }
  for (let y = 8; y <= 37; y++) {
    for (let x = 16; x <= 53; x++) {
      const borda = y === 8 || y === 37 || x === 16 || x === 53;
      const canto = (y <= 9 || y >= 36) && (x <= 17 || x >= 52);
      if (borda || canto) { px(g, x, y, P.OUTLINE); continue; }
      const d = Math.abs(y - 24);
      px(g, x, y, d < 7 ? P.CRT_GLOW : (d < 11 ? P.CRT_BG_MID : P.CRT_BG_DARK));
    }
  }

  olho(g, 17, 23, false, e, P);
  olho(g, 40, 23, true, e, P);
  px(g, 34, 24, P.LID_CREASE);
  px(g, 35, 25, P.LID_CREASE);
  px(g, 34, 26, P.LID_CREASE);

  oculos(g, e.glassesY, e.glintOffset, e.brightGlint, P);

  // frente: logo colorido e fenda do disquete
  ret(g, 12, 40, 45, 1, P.CASE_MID);
  ret(g, 16, 43, 3, 1, P.LOGO_G);
  ret(g, 16, 44, 3, 1, P.LOGO_Y);
  ret(g, 16, 45, 3, 1, P.LOGO_O);
  ret(g, 16, 46, 3, 1, P.LOGO_R);
  ret(g, 16, 47, 3, 1, P.LOGO_B);
  ret(g, 33, 43, 19, 4, P.CASE_SHADOW);
  ret(g, 34, 44, 17, 2, P.OUTLINE);
  ret(g, 45, 43, 4, 4, P.CASE_DEEP);
  ret(g, 45, 44, 4, 2, P.OUTLINE);
  px(g, 52, 46, P.VENT_DARK);

  // base com grelhas
  ret(g, 12, 51, 48, 1, P.OUTLINE);
  for (let y = 52; y <= 56; y++) {
    px(g, 13, y, P.OUTLINE);
    ret(g, 14, y, 41, 1, P.CASE_SHADOW);
    ret(g, 55, y, 3, 1, P.CASE_DEEP);
    px(g, 58, y, P.OUTLINE);
  }
  for (let vx = 17; vx <= 30; vx += 2) ret(g, vx, 53, 1, 3, P.VENT_DARK);

  // teclado em perspectiva
  ret(g, 8, 57, 48, 1, P.OUTLINE);
  for (let ky = 58; ky <= 65; ky++) {
    const recuo = Math.floor((65 - ky) / 3);
    const e1 = 6 + recuo, d1 = 56 - recuo;
    px(g, e1, ky, P.OUTLINE);
    px(g, d1, ky, P.OUTLINE);
    ret(g, e1 + 1, ky, d1 - e1 - 1, 1, P.CASE_MAIN);
    ret(g, d1 - 3, ky, 3, 1, P.CASE_SHADOW);
  }
  for (let fila = 0; fila < 4; fila++) {
    const ty = 59 + fila * 2;
    if (ty > 64) break;
    for (let kx = 10; kx <= 44; kx += 3) {
      if (fila === 3 && kx >= 19 && kx <= 34) { ret(g, kx, ty, 3, 1, P.CASE_LIGHT); continue; }
      ret(g, kx, ty, 2, 1, P.CASE_LIGHT);
      px(g, kx + 2, ty, P.VENT_DARK);
    }
    for (let nx = 47; nx <= 52; nx += 2) {
      px(g, nx, ty, P.CASE_LIGHT);
      px(g, nx + 1, ty, P.VENT_DARK);
    }
  }
  ret(g, 6, 66, 51, 2, P.CASE_SHADOW);
  ret(g, 6, 68, 51, 1, P.OUTLINE);

  // cabo e mouse
  ret(g, 58, 55, 4, 1, P.VENT_DARK);
  ret(g, 62, 56, 2, 4, P.VENT_DARK);
  ret(g, 61, 60, 2, 3, P.VENT_DARK);
  ret(g, 58, 63, 8, 1, P.OUTLINE);
  for (let my = 64; my <= 70; my++) {
    px(g, 57, my, P.OUTLINE);
    ret(g, 58, my, 7, 1, my < 67 ? P.CASE_LIGHT : P.CASE_MAIN);
    ret(g, 65, my, 2, 1, P.CASE_SHADOW);
    px(g, 67, my, P.OUTLINE);
  }
  ret(g, 59, 64, 5, 2, P.CASE_MID);
  ret(g, 59, 66, 5, 1, P.VENT_DARK);
  ret(g, 58, 71, 9, 1, P.OUTLINE);

  return g;
}

/** Comprime a grade em corridas horizontais [x, y, largura, cor]. */
export function corridas(g) {
  const saida = [];
  for (let y = 0; y < ALTURA; y++) {
    let x = 0;
    while (x < LARGURA) {
      const cor = g[y][x];
      if (!cor) { x++; continue; }
      let w = 1;
      while (x + w < LARGURA && g[y][x + w] === cor) w++;
      saida.push([x, y, w, cor]);
      x += w;
    }
  }
  return saida;
}

/** Um quadro como SVG (para o build: sem JavaScript no cliente). */
export function svgDoQuadro(animacao = 'idle', indice = 0, tomDaIris = 'hazel') {
  const rects = corridas(quadro(animacao, indice, tomDaIris))
    .map(([x, y, w, c]) => `<rect x="${x}" y="${y}" width="${w}" height="1" fill="${c}"/>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LARGURA} ${ALTURA}" `
       + `shape-rendering="crispEdges" role="img" aria-hidden="true">${rects}</svg>`;
}
