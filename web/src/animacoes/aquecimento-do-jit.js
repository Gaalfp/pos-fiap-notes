/**
 * O aquecimento: a mesma requisição fica mais rápida conforme o JIT compila o
 * caminho quente — interpretado, depois C1, depois C2.
 *
 * É por isso que medir as primeiras requisições mede o aquecimento, não a
 * aplicação; e é o que o deploy e a autoescala pagam a cada pod novo.
 */
import { criarPalco, el, texto } from './palco.js';

const L = 420, A = 180;
const TOTAL = 60;          // requisições mostradas
const FAIXAS = [
  { ate: 12, nome: 'interpretado', base: 100 },
  { ate: 30, nome: 'C1', base: 42 },
  { ate: TOTAL, nome: 'C2', base: 14 },
];

export function montar(alvo) {
  const palco = criarPalco(alvo, {
    titulo: 'Aquecimento do JIT',
    legenda: 'Latência da mesma operação, requisição a requisição. O degrau '
           + 'acontece quando o JIT recompila o caminho quente.',
    viewBox: `0 0 ${L} ${A}`,
    quadroPorSegundo: 8,
  });

  const camada = el('g');
  palco.svg.append(camada);
  let n = 0;
  const pontos = [];

  const x0 = 40, y0 = 20, larg = L - x0 - 16, alt = 108;
  const px = (i) => x0 + (i / TOTAL) * larg;
  const py = (ms) => y0 + alt - (Math.min(ms, 110) / 110) * alt;

  function desenhar() {
    camada.innerHTML = '';

    camada.append(
      el('line', { x1: x0, y1: y0 + alt, x2: x0 + larg, y2: y0 + alt, class: 'eixo' }),
      el('line', { x1: x0, y1: y0, x2: x0, y2: y0 + alt, class: 'eixo' }),
      texto(x0 - 8, y0 + 4, '100', { 'text-anchor': 'end', class: 'rotulo-fraco' }),
      texto(x0 - 8, y0 + alt, '0', { 'text-anchor': 'end', class: 'rotulo-fraco' }),
      texto(16, y0 + alt / 2, 'ms', { class: 'rotulo-fraco',
                                      transform: `rotate(-90 16 ${y0 + alt / 2})` }),
      texto(x0 + larg / 2, y0 + alt + 16, 'requisições →', { class: 'rotulo-fraco' }),
    );

    // marcas das faixas
    let inicio = 0;
    for (const f of FAIXAS) {
      const xm = px(f.ate);
      if (f.ate < TOTAL) {
        camada.append(el('line', { x1: xm, y1: y0, x2: xm, y2: y0 + alt, class: 'marca' }));
      }
      camada.append(texto((px(inicio) + xm) / 2, y0 - 6, f.nome,
                          { class: n > inicio ? 'rotulo' : 'rotulo-fraco' }));
      inicio = f.ate;
    }

    if (pontos.length > 1) {
      camada.append(el('polyline', {
        points: pontos.map((p, i) => `${px(i)},${py(p)}`).join(' '),
        class: 'linha', fill: 'none',
      }));
    }
    const ultimo = pontos.at(-1);
    if (ultimo !== undefined) {
      camada.append(
        el('circle', { cx: px(pontos.length - 1), cy: py(ultimo), r: 3.5, class: 'destaque' }),
        texto(L / 2, A - 8,
              `requisição ${pontos.length} · ${Math.round(ultimo)} ms`, { class: 'rotulo' }),
      );
    }
  }

  function quadro() {
    if (n >= TOTAL) return palco.parar();
    const faixa = FAIXAS.find((f) => n < f.ate);
    const ruido = (Math.random() - 0.5) * faixa.base * 0.25;
    pontos.push(Math.max(6, faixa.base + ruido));
    n++;
    desenhar();
  }

  palco.aoQuadro(quadro);
  palco.aoReiniciar(() => { n = 0; pontos.length = 0; desenhar(); });
  desenhar();
}
