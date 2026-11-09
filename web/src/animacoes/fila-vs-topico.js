/**
 * Fila × tópico — a distinção mais cobrada da matéria de mensageria.
 *
 * Acrescentar consumidor produz efeitos OPOSTOS: na fila divide o trabalho
 * (mais vazão); no tópico duplica a entrega (mais reações).
 */
import { criarPalco, el, texto } from './palco.js';

const L = 420, A = 190;

export function montar(alvo) {
  const palco = criarPalco(alvo, {
    titulo: 'Fila × tópico',
    legenda: 'Troque o modelo e mexa no número de consumidores: na fila cada '
           + 'mensagem vai para UM; no tópico, todos recebem uma cópia.',
    viewBox: `0 0 ${L} ${A}`,
    quadroPorSegundo: 1.6,
  });

  let modelo = 'fila';
  let consumidores = 3;

  const controles = document.createElement('div');
  controles.className = 'palco-opcoes';
  controles.innerHTML = `
    <div role="group" aria-label="modelo">
      <button type="button" data-modelo="fila" aria-pressed="true">fila</button>
      <button type="button" data-modelo="topico" aria-pressed="false">tópico</button>
    </div>
    <label class="palco-faixa"><span>consumidores</span>
      <input type="range" min="1" max="4" value="3"></label>`;
  palco.extras.append(controles);

  controles.querySelectorAll('[data-modelo]').forEach((b) => {
    b.addEventListener('click', () => {
      modelo = b.dataset.modelo;
      controles.querySelectorAll('[data-modelo]').forEach((o) =>
        o.setAttribute('aria-pressed', String(o === b)));
      reiniciar();
    });
  });
  controles.querySelector('input').addEventListener('input', (e) => {
    consumidores = Number(e.target.value);
    reiniciar();
  });

  const camada = el('g');
  palco.svg.append(camada);

  let mensagens = [];   // {id, x, destino}
  let proximo = 1, entregues = [];

  const reiniciar = () => {
    mensagens = []; proximo = 1;
    entregues = Array(consumidores).fill(0);
    desenhar();
  };

  function desenhar() {
    camada.innerHTML = '';
    const yBroker = 34, xBroker = L / 2 - 46;

    camada.append(
      el('rect', { x: 14, y: yBroker - 12, width: 76, height: 26, rx: 6, class: 'caixa' }),
      texto(52, yBroker + 1, 'produtor', { class: 'rotulo' }),
      el('rect', { x: xBroker, y: yBroker - 14, width: 92, height: 30, rx: 6, class: 'caixa-forte' }),
      texto(L / 2, yBroker + 1, modelo === 'fila' ? 'FILA' : 'TÓPICO', { class: 'rotulo-forte' }),
    );

    // consumidores
    const alturaLinha = 34;
    const yBase = 78;
    for (let i = 0; i < consumidores; i++) {
      const y = yBase + i * alturaLinha;
      camada.append(
        el('rect', { x: L - 118, y: y - 12, width: 104, height: 26, rx: 6, class: 'caixa' }),
        texto(L - 66, y + 1, `consumidor ${i + 1}`, { class: 'rotulo' }),
        texto(L - 10, y + 1, String(entregues[i] ?? 0),
              { 'text-anchor': 'end', class: 'rotulo-forte' }),
        el('path', {
          d: `M ${xBroker + 92} ${yBroker} C ${L - 170} ${yBroker}, ${L - 170} ${y}, ${L - 118} ${y}`,
          class: 'fio', fill: 'none',
        }),
      );
    }

    for (const m of mensagens) {
      const alvoY = m.destino === null ? yBroker : yBase + m.destino * alturaLinha;
      const y = m.x < 0.5 ? yBroker : yBroker + (alvoY - yBroker) * ((m.x - 0.5) / 0.5);
      camada.append(el('circle', {
        cx: 52 + m.x * (L - 118 - 52), cy: y, r: 4.5, class: 'msg',
      }));
    }
  }

  function quadro() {
    // anda com o que está no ar
    for (const m of mensagens) m.x += 0.25;
    for (const m of mensagens.filter((m) => m.x >= 1 && m.destino !== null)) {
      entregues[m.destino]++;
    }
    mensagens = mensagens.filter((m) => m.x < 1);

    // no meio do caminho, o broker decide o destino
    for (const m of mensagens) {
      if (m.destino === null && m.x >= 0.5) {
        if (modelo === 'fila') {
          m.destino = (m.id - 1) % consumidores;      // reveza: divide o trabalho
        } else {
          m.destino = 0;
          for (let i = 1; i < consumidores; i++) {     // copia para todos
            mensagens.push({ id: m.id, x: m.x, destino: i });
          }
        }
      }
    }

    if (proximo % 2 === 1 || mensagens.length < 3) {
      mensagens.push({ id: proximo++, x: 0, destino: null });
    } else { proximo++; }

    desenhar();
  }

  palco.aoQuadro(quadro);
  palco.aoReiniciar(reiniciar);
  reiniciar();
}
