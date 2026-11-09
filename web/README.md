# Site das anotações

Site estático gerado a partir dos `.md` da raiz do repositório, com
[Astro](https://astro.build) + [Starlight](https://starlight.astro.build).
Publicado automaticamente em **https://gaalfp.github.io/pos-fiap-notes/** a cada
push na `main`.

## Rodar localmente

```bash
cd web
npm install     # só na primeira vez
npm run dev     # abre em http://localhost:4321/pos-fiap-notes/
```

O `npm run dev` sincroniza o conteúdo antes de subir, e recarrega sozinho
quando você edita um `.md` da raiz.

## Como funciona

O conteúdo **não** mora aqui — ele continua na raiz, para ser lido no GitHub.
O site é construído de uma cópia transformada:

| Passo | Quem faz | O que faz |
|---|---|---|
| 1 | `tools/sincronizar-site.py` | copia os `.md` para `web/src/content/docs/`, transforma `README.md` em `index.md`, usa o `# H1` como título da página e reescreve os links para as URLs do site |
| 2 | `tools/gerar-site.py` | gera a barra lateral (`src/barra-lateral.json`) e o `base` (`src/site.json`) |
| 3 | `astro build` | gera o HTML, embute os diagramas, otimiza as imagens e monta o índice de busca |

### Diagramas

Os 127 diagramas Mermaid são desenhados **em tempo de build**, não no navegador:
desenhar no cliente custava **5,4 MB de JavaScript** por leitor (elk, cytoscape,
katex). Agora cada diagrama é um SVG de alguns KB, embutido na página — aparece
instantaneamente e funciona sem JavaScript.

```bash
npm run diagramas     # redesenha o que mudou (precisa do Playwright)
npm run diagramas -- --forcar   # redesenha tudo (ex.: mudou a paleta)
```

O cache fica em `src/diagramas/<hash>-{claro,escuro}.svg`, **versionado no git** —
o build normal não precisa de navegador. Só quem **cria ou altera** um diagrama
roda o comando acima. Se faltar algum SVG, a página cai no desenho pelo
navegador e o build avisa.

Os três passos rodam juntos no `npm run build`.

## Onde mexer

| Para mudar | Edite |
|---|---|
| O conteúdo | o `.md` na **raiz** do repositório |
| A ordem/nome das matérias na barra lateral **e** no índice do README | `tools/estrutura.py` |
| Tema, cores, recursos do Starlight | `astro.config.mjs` |
| Paleta, fontes e aparência | `src/estilos.css` |
| A paleta dos diagramas | `tools/renderizar-diagramas.mjs` (e depois `npm run diagramas -- --forcar`) |
| O mascote e o pixel art | `src/pixel/mascote.js` |

Depois de mexer em `tools/estrutura.py`, rode:

```bash
python3 tools/gerar-indice.py && python3 tools/gerar-site.py
```
