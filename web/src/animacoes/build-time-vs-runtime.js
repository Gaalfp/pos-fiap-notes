/**
 * O mesmo trabalho, em momentos diferentes: o que o Spring faz a cada boot, o
 * Quarkus fez uma vez só, no build.
 *
 * As barras não são medição de desempenho — são a MESMA lista de tarefas,
 * colocada na fase em que cada framework a executa.
 */
import { criarPalco, el, texto } from './palco.js';

const TAREFAS = ['varrer o classpath', 'resolver a injeção', 'gerar proxies',
                 'validar o ORM', 'ler config do ambiente', 'abrir porta e pool'];
const NO_BUILD = 4;   // as quatro primeiras não dependem do ambiente

const L = 420, A = 180;

export function montar(alvo) {
  const palco = criarPalco(alvo, {
    titulo: 'Build time × runtime',
    legenda: 'As quatro primeiras tarefas dão sempre o mesmo resultado — por isso '
           + 'podem sair do boot. As duas últimas dependem do ambiente e ficam.',
    viewBox: `0 0 ${L} ${A}`,
    quadroPorSegundo: 1.6,
  });

  const camada = el('g');
  palco.svg.append(camada);
  let t = 0;
  const TOTAL = TAREFAS.length + 2;

  function barra(y, rotulo, tarefas, inicio, cor) {
    const x0 = 96, larguraTotal = L - x0 - 16;
    const passo = larguraTotal / TOTAL;
    camada.append(texto(x0 - 8, y + 7, rotulo,
                        { 'text-anchor': 'end', class: 'rotulo' }));
    camada.append(el('rect', { x: x0, y, width: larguraTotal, height: 14, rx: 7,
                               class: 'trilho' }));
    const feitas = Math.max(0, Math.min(tarefas, t - inicio));
    if (feitas > 0) {
      camada.append(el('rect', { x: x0, y, width: feitas * passo, height: 14, rx: 7,
                                 class: cor }));
    }
    return { x0, passo, feitas };
  }

  function desenhar() {
    camada.innerHTML = '';
    camada.append(texto(L / 2, 12, 'o mesmo trabalho, em fases diferentes',
                        { class: 'rotulo' }));

    // Spring: tudo no boot
    camada.append(texto(96, 34, '', {}));
    const s = barra(40, 'Spring · boot', TAREFAS.length, 0, 'destaque');
    // Quarkus: quatro no build, duas no boot
    const q1 = barra(86, 'Quarkus · build', NO_BUILD, 0, 'obj-longevo');
    const q2 = barra(112, 'Quarkus · boot', TAREFAS.length - NO_BUILD, NO_BUILD, 'destaque');

    const atual = TAREFAS[Math.min(t, TAREFAS.length - 1)];
    camada.append(texto(L / 2, 150,
      t >= TOTAL - 1 ? 'pronto — o boot do Quarkus só executou o que depende do ambiente'
                     : `fazendo: ${atual}`,
      { class: 'rotulo' }));

    camada.append(texto(L / 2, 168,
      'no Quarkus, as 4 primeiras já estavam feitas quando o processo subiu',
      { class: 'rotulo-fraco' }));
  }

  palco.aoQuadro(() => { t = (t + 1) % (TOTAL + 1); desenhar(); });
  palco.aoReiniciar(() => { t = 0; desenhar(); });
  desenhar();
}
