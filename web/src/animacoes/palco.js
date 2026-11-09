/**
 * Palco comum das animações: moldura, controles e relógio.
 *
 * Cada animação recebe um palco e só se preocupa em desenhar um quadro.
 * Regras que valem para todas:
 *   - respeita `prefers-reduced-motion`: começa parada e mostra o resultado;
 *   - nunca roda fora da tela (economiza bateria no celular);
 *   - funciona no teclado.
 */

const SVG = 'http://www.w3.org/2000/svg';

export const el = (nome, atributos = {}, filhos = []) => {
  const n = document.createElementNS(SVG, nome);
  for (const [k, v] of Object.entries(atributos)) n.setAttribute(k, String(v));
  for (const f of [].concat(filhos)) n.append(f);
  return n;
};

export const texto = (x, y, conteudo, atributos = {}) =>
  el('text', { x, y, 'text-anchor': 'middle', 'dominant-baseline': 'middle', ...atributos },
     [document.createTextNode(conteudo)]);

export function criarPalco(alvo, { titulo, legenda, viewBox, quadroPorSegundo = 4 }) {
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;

  alvo.innerHTML = '';
  alvo.classList.add('palco');

  const cabecalho = document.createElement('div');
  cabecalho.className = 'palco-cabecalho';
  cabecalho.innerHTML = `<span class="palco-titulo">${titulo}</span>`;

  const controles = document.createElement('div');
  controles.className = 'palco-controles';
  const botao = (rotulo, aria) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = rotulo;
    b.setAttribute('aria-label', aria);
    controles.append(b);
    return b;
  };
  const bPlay = botao('▶', 'Reproduzir');
  const bPasso = botao('⏭', 'Avançar um passo');
  const bVoltar = botao('↺', 'Recomeçar');
  cabecalho.append(controles);

  const svg = el('svg', {
    viewBox, class: 'palco-svg', role: 'img',
    'aria-label': `${titulo}. ${legenda || ''}`,
  });

  const rodape = document.createElement('p');
  rodape.className = 'palco-legenda';
  if (legenda) rodape.textContent = legenda;

  const extras = document.createElement('div');
  extras.className = 'palco-extras';

  alvo.append(cabecalho, svg, extras, rodape);

  let rodando = false;
  let pausaManual = false;
  let relogio = null;
  const ouvintes = { quadro: () => {}, reinicio: () => {} };

  const parar = () => {
    rodando = false;
    clearInterval(relogio);
    bPlay.textContent = '▶';
    bPlay.setAttribute('aria-label', 'Reproduzir');
  };
  const tocar = () => {
    if (rodando) return parar();
    rodando = true;
    bPlay.textContent = '⏸';
    bPlay.setAttribute('aria-label', 'Pausar');
    relogio = setInterval(() => ouvintes.quadro(), 1000 / quadroPorSegundo);
  };

  bPlay.addEventListener('click', () => {
    pausaManual = rodando;   // se estava rodando, o clique é uma pausa deliberada
    tocar();
  });
  bPasso.addEventListener('click', () => { parar(); ouvintes.quadro(); });
  bVoltar.addEventListener('click', () => { parar(); ouvintes.reinicio(); });

  // Toca enquanto está na tela, pausa ao sair — e respeita quem pausou no botão.
  // Uma verificação periódica é mais previsível aqui que o IntersectionObserver:
  // o observador não dispara de forma confiável quando o elemento já nasce
  // visível ou quando a página restaura a posição de rolagem.
  const autoTocar = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const naTela = () => {
    const r = alvo.getBoundingClientRect();
    return r.top < innerHeight * 0.85 && r.bottom > innerHeight * 0.15;
  };

  setInterval(() => {
    if (document.hidden) { if (rodando) parar(); return; }
    const visivel = naTela();
    if (visivel && autoTocar && !pausaManual && !rodando) tocar();
    else if (!visivel && rodando) parar();
  }, 500);

  return {
    svg, extras, reduzido,
    aoQuadro(f) { ouvintes.quadro = f; },
    aoReiniciar(f) { ouvintes.reinicio = f; },
    tocar, parar,
    get rodando() { return rodando; },
  };
}
