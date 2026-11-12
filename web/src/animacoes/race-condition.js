/**
 * Duas threads fazendo `contador++` — com e sem synchronized.
 *
 * O que a animação quer mostrar: `valor++` são TRÊS passos (ler, somar,
 * gravar). Quando as duas threads se intercalam entre o primeiro e o terceiro,
 * as duas leem o mesmo número e uma grava por cima da outra — duas somas viram
 * uma. Com synchronized, a segunda espera a primeira terminar os três passos.
 */
import { criarPalco, el, texto } from './palco.js';

const L = 420, A = 200;
const PASSOS = ['ler', 'somar', 'gravar'];
const FAIXAS = [
  { nome: 'thread A', y: 104 },
  { nome: 'thread B', y: 158 },
];

export function montar(alvo) {
  const palco = criarPalco(alvo, {
    titulo: 'Race condition: contador++',
    legenda: 'Sem proteção, as duas threads leem o mesmo valor e uma grava por '
           + 'cima da outra. Com synchronized, a segunda espera.',
    viewBox: `0 0 ${L} ${A}`,
    quadroPorSegundo: 1.8,
  });

  let protegido = false;

  const opcoes = document.createElement('div');
  opcoes.className = 'palco-opcoes';
  opcoes.innerHTML = `
    <div role="group" aria-label="modo">
      <button type="button" data-modo="livre" aria-pressed="true">sem synchronized</button>
      <button type="button" data-modo="sync" aria-pressed="false">com synchronized</button>
    </div>`;
  palco.extras.append(opcoes);

  const numeros = document.createElement('dl');
  numeros.className = 'palco-numeros';
  palco.extras.append(numeros);

  opcoes.querySelectorAll('[data-modo]').forEach((b) => {
    b.addEventListener('click', () => {
      protegido = b.dataset.modo === 'sync';
      opcoes.querySelectorAll('[data-modo]').forEach((o) =>
        o.setAttribute('aria-pressed', String(o === b)));
      reiniciar();
    });
  });

  const camada = el('g');
  palco.svg.append(camada);

  let memoria, threads, concluidos, dono;

  const reiniciar = () => {
    memoria = 0;
    concluidos = 0;        // incrementos que percorreram os três passos
    dono = null;                       // quem está com o lock (modo synchronized)
    threads = FAIXAS.map(() => ({ passo: -1, lido: null, esperando: false }));
    desenhar();
  };

  function desenhar() {
    camada.innerHTML = '';

    // a memória compartilhada
    camada.append(
      el('rect', { x: L / 2 - 58, y: 18, width: 116, height: 40, rx: 8, class: 'caixa-forte' }),
      texto(L / 2, 32, 'memória compartilhada', { class: 'rotulo-fraco' }),
      texto(L / 2, 47, `valor = ${memoria}`, { class: 'rotulo-forte' }),
    );

    FAIXAS.forEach((faixa, i) => {
      const t = threads[i];
      camada.append(texto(42, faixa.y, faixa.nome, { class: 'rotulo' }));

      PASSOS.forEach((nome, p) => {
        const x = 96 + p * 100;
        const ativo = t.passo === p;
        camada.append(
          el('rect', {
            x, y: faixa.y - 15, width: 86, height: 30, rx: 7,
            class: ativo ? 'destaque' : 'caixa',
          }),
          texto(x + 43, faixa.y - 2, nome, {
            class: ativo ? 'rotulo-forte' : 'rotulo',
            fill: ativo ? 'var(--sl-color-bg)' : undefined,
          }),
        );
        // o valor que a thread carrega consigo
        if (ativo && t.lido !== null) {
          camada.append(texto(x + 43, faixa.y + 10,
            p === 2 ? `grava ${t.lido + 1}` : `tem ${t.lido}${p === 1 ? ' + 1' : ''}`,
            { class: 'rotulo-fraco', fill: 'var(--sl-color-bg)' }));
        }
      });

      if (t.esperando) {
        camada.append(texto(L / 2, faixa.y + 2, '🔒 esperando o lock', { class: 'rotulo' }));
      }
    });

    const perdidas = concluidos - memoria;
    numeros.innerHTML =
      `<div><dt>incrementos</dt><dd>${concluidos}</dd></div>` +
      `<div><dt>obtido</dt><dd>${memoria}</dd></div>` +
      `<div><dt>somas perdidas</dt><dd>${perdidas}</dd></div>`;
  }

  function quadro() {
    // modo protegido: só uma thread por vez percorre os três passos
    if (protegido) {
      if (dono === null) {
        dono = threads[0].passo === -1 ? 0 : 1;
        threads[dono].passo = 0;
        threads[dono].lido = memoria;
        threads[1 - dono].esperando = true;
      } else {
        const t = threads[dono];
        t.passo++;
        if (t.passo === 2) memoria = t.lido + 1;
        if (t.passo > 2) {
          t.passo = -1; t.lido = null;
          concluidos++;
          threads[1 - dono].esperando = false;
          dono = 1 - dono;
          const outra = threads[dono];
          outra.passo = 0;
          outra.lido = memoria;
          threads[1 - dono].esperando = true;
        }
      }
      return desenhar();
    }

    // modo livre: as duas avançam em paralelo e se atropelam
    threads.forEach((t) => {
      if (t.passo === -1) {
        t.passo = 0;
        t.lido = memoria;          // as duas leem o MESMO valor
        return;
      }
      t.passo++;
      if (t.passo === 2) memoria = t.lido + 1;   // uma grava por cima da outra
      if (t.passo > 2) { t.passo = -1; t.lido = null; concluidos++; }
    });
    desenhar();
  }

  palco.aoQuadro(quadro);
  palco.aoReiniciar(reiniciar);
  reiniciar();
}
