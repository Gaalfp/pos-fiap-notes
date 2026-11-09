/**
 * As oito etapas do ciclo de vida de um bean — com o momento exato em que o
 * proxy substitui o seu objeto no container (etapa 6).
 *
 * É esse detalhe que explica as pegadinhas de @Transactional, @Cacheable e
 * @Async: o que está registrado no container não é o seu objeto, é o embrulho.
 */
import { criarPalco, el, texto } from './palco.js';

const ETAPAS = [
  ['bean definition', 'só a receita: qual classe, qual escopo, de quem depende'],
  ['instanciação', 'o construtor roda — dependências de campo ainda são null'],
  ['injeção', 'o Spring preenche setters e campos'],
  ['BeanPostProcessor (antes)', 'ganchos do framework, antes da inicialização'],
  ['@PostConstruct', 'a sua inicialização, já com as dependências injetadas'],
  ['BeanPostProcessor (depois)', '🎁 é AQUI que o proxy é criado e entra no lugar'],
  ['pronto no container', 'quem injetar vai receber o PROXY, não o seu objeto'],
  ['@PreDestroy', 'no desligamento ordenado — não em kill -9'],
];

const L = 420, A = 150;

export function montar(alvo) {
  const palco = criarPalco(alvo, {
    titulo: 'Ciclo de vida de um bean',
    legenda: 'Avance com ⏭. Repare na etapa 6: o container passa a guardar o proxy.',
    viewBox: `0 0 ${L} ${A}`,
    quadroPorSegundo: 0.8,
  });

  const descricao = document.createElement('p');
  descricao.className = 'palco-passo';
  palco.extras.append(descricao);

  const camada = el('g');
  palco.svg.append(camada);
  let passo = 0;

  function desenhar() {
    camada.innerHTML = '';

    // régua das oito etapas
    const largura = (L - 40) / ETAPAS.length;
    ETAPAS.forEach((_, i) => {
      const x = 20 + i * largura;
      const ativo = i === passo;
      const feito = i < passo;
      camada.append(
        el('rect', {
          x: x + 2, y: 22, width: largura - 4, height: 8, rx: 4,
          class: ativo ? 'destaque' : (feito ? 'obj-longevo' : 'obj'),
          opacity: feito ? 0.55 : 1,
        }),
        texto(x + largura / 2, 14, String(i + 1), { class: 'rotulo' }),
      );
    });

    // o objeto e, a partir da etapa 6, o proxy em volta
    const cx = L / 2, cy = 92;
    const temProxy = passo >= 5;
    if (temProxy) {
      camada.append(
        el('rect', { x: cx - 92, y: cy - 34, width: 184, height: 68, rx: 10,
                     class: 'proxy' }),
        texto(cx, cy - 44, 'PROXY — o que o container guarda', { class: 'rotulo' }),
      );
    }
    camada.append(
      el('rect', { x: cx - 58, y: cy - 20, width: 116, height: 40, rx: 7,
                   class: passo === 0 ? 'receita' : 'bean' }),
      texto(cx, cy, passo === 0 ? 'receita' : 'o seu objeto',
            { class: 'rotulo-forte' }),
    );

    if (passo === 7) {
      camada.append(texto(cx, cy + 40, 'desligando…', { class: 'rotulo' }));
    }

    descricao.innerHTML =
      `<strong>${passo + 1}. ${ETAPAS[passo][0]}</strong> — ${ETAPAS[passo][1]}`;
  }

  palco.aoQuadro(() => { passo = (passo + 1) % ETAPAS.length; desenhar(); });
  palco.aoReiniciar(() => { passo = 0; desenhar(); });
  desenhar();
}
