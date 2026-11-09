/**
 * Converte blocos ```mermaid em <pre class="mermaid">, antes do realce de sintaxe.
 * O desenho em si é feito no navegador (ver src/components/Head.astro).
 */
const escapar = (texto) =>
  texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function remarkMermaid() {
  return (tree) => {
    const percorrer = (no) => {
      if (!Array.isArray(no.children)) return;
      no.children = no.children.map((filho) => {
        if (filho.type === 'code' && filho.lang === 'mermaid') {
          return { type: 'html', value: `<pre class="mermaid">${escapar(filho.value)}</pre>` };
        }
        percorrer(filho);
        return filho;
      });
    };
    percorrer(tree);
    return tree;
  };
}
