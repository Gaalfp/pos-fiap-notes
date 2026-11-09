/**
 * O ciclo do garbage collector: objetos nascem no Eden, os poucos que
 * sobrevivem são copiados para um Survivor e, depois de alguns ciclos,
 * promovidos para a Old Generation.
 *
 * O ponto que a animação quer mostrar: o minor GC custa proporcional ao que
 * está VIVO, não ao que morreu — por isso objeto de vida curta é quase grátis,
 * e objeto de vida média (que sobrevive só o bastante para ser promovido) é o
 * pior caso.
 */
import { criarPalco, el, texto } from './palco.js';

const L = 420, A = 170;
const AREAS = {
  eden:  { x: 10,  y: 30, w: 170, h: 96, rotulo: 'Eden' },
  s0:    { x: 190, y: 30, w: 50,  h: 96, rotulo: 'S0' },
  s1:    { x: 248, y: 30, w: 50,  h: 96, rotulo: 'S1' },
  old:   { x: 308, y: 30, w: 102, h: 96, rotulo: 'Old' },
};

export function montar(alvo) {
  const palco = criarPalco(alvo, {
    titulo: 'Ciclo do garbage collector',
    legenda: 'Cada quadrado é um objeto. A cada minor GC, o Eden é esvaziado: '
           + 'o que ainda está vivo é copiado para o Survivor da vez.',
    viewBox: `0 0 ${L} ${A}`,
    quadroPorSegundo: 2,
  });

  // controle extra: quantos objetos nascem por quadro
  const faixa = document.createElement('label');
  faixa.className = 'palco-faixa';
  faixa.innerHTML = '<span>alocação</span><input type="range" min="2" max="12" value="6">';
  palco.extras.append(faixa);

  const contadores = document.createElement('dl');
  contadores.className = 'palco-numeros';
  palco.extras.append(contadores);

  const camadaAreas = el('g');
  const camadaObjetos = el('g');
  palco.svg.append(camadaAreas, camadaObjetos);

  for (const [, a] of Object.entries(AREAS)) {
    camadaAreas.append(
      el('rect', { x: a.x, y: a.y, width: a.w, height: a.h, rx: 6,
                   class: 'area' }),
      texto(a.x + a.w / 2, a.y - 10, a.rotulo, { class: 'rotulo' }),
    );
  }

  let objetos = [];
  let survivorAtual = 's0';
  let ciclos = 0, coletados = 0, promovidos = 0;
  let proximoId = 0;

  const reiniciar = () => {
    objetos = []; survivorAtual = 's0';
    ciclos = coletados = promovidos = 0; proximoId = 0;
    desenhar();
  };

  function posicionar(o) {
    const a = AREAS[o.area];
    const colunas = Math.max(1, Math.floor((a.w - 8) / 11));
    const i = o.indice;
    return {
      x: a.x + 5 + (i % colunas) * 11,
      y: a.y + a.h - 12 - Math.floor(i / colunas) * 11,
    };
  }

  function desenhar() {
    camadaObjetos.innerHTML = '';
    const porArea = {};
    for (const o of objetos) {
      porArea[o.area] = (porArea[o.area] || 0);
      o.indice = porArea[o.area]++;
      const { x, y } = posicionar(o);
      camadaObjetos.append(
        el('rect', {
          x, y, width: 8, height: 8, rx: 1.5,
          class: `obj ${o.longevo ? 'obj-longevo' : ''}`,
        }),
      );
    }
    contadores.innerHTML =
      `<div><dt>minor GC</dt><dd>${ciclos}</dd></div>` +
      `<div><dt>coletados</dt><dd>${coletados}</dd></div>` +
      `<div><dt>promovidos</dt><dd>${promovidos}</dd></div>` +
      `<div><dt>vivos</dt><dd>${objetos.length}</dd></div>`;
  }

  function quadro() {
    const taxa = Number(faixa.querySelector('input').value);
    const cabeNoEden = objetos.filter((o) => o.area === 'eden').length + taxa <= 60;

    if (cabeNoEden) {
      for (let i = 0; i < taxa; i++) {
        objetos.push({
          id: proximoId++, area: 'eden', idade: 0,
          // a hipótese geracional: a maioria morre jovem
          longevo: Math.random() < 0.18,
        });
      }
    } else {
      // Eden cheio → minor GC
      ciclos++;
      const destino = survivorAtual;
      const sobreviventes = [];
      for (const o of objetos) {
        if (o.area === 'old') { sobreviventes.push(o); continue; }
        if (!o.longevo) { coletados++; continue; }      // morreu jovem
        o.idade++;
        if (o.idade >= 3) { o.area = 'old'; promovidos++; }
        else o.area = destino;
        sobreviventes.push(o);
      }
      objetos = sobreviventes;
      survivorAtual = survivorAtual === 's0' ? 's1' : 's0';
    }
    desenhar();
  }

  palco.aoQuadro(quadro);
  palco.aoReiniciar(reiniciar);
  desenhar();   // o palco começa a tocar quando a animação entra na tela
}
