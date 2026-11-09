#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Copia o conteúdo do repositório para web/src/content/docs/ (de onde o Astro constrói).

O conteúdo continua morando na raiz — é assim que se lê no GitHub. O site é
construído de uma cópia transformada:

  1. README.md vira index.md (a home de cada pasta);
  2. links para `README.md` são reescritos para `index.md`;
  3. o H1 vira o campo `title` do frontmatter (o Starlight renderiza o título).

Uso:  python3 tools/sincronizar-site.py
"""
import os
import re
import shutil
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from estrutura import BASE, RAIZ  # noqa: E402

DOCS = os.path.join(RAIZ, "web", "src", "content", "docs")
IGNORAR = {".git", ".github", "tools", "web", "node_modules", ".venv"}
IMAGENS = {".png", ".jpg", ".jpeg", ".svg", ".gif"}
EDITAR_EM = "https://github.com/Gaalfp/pos-fiap-notes/edit/main/"


def yaml_str(texto):
    return '"' + texto.replace('\\', '\\\\').replace('"', '\\"') + '"'


def url_do_arquivo(caminho_md):
    """'spring-e-spring-boot/README.md' -> '/pos-fiap-notes/spring-e-spring-boot/'

    O Astro gera rotas em minúsculas, sem a extensão, e trata README/index como
    a página da pasta.
    """
    partes = caminho_md[:-3].lower().split("/") if caminho_md.endswith(".md") \
        else caminho_md.lower().split("/")
    partes = [p for p in partes if p not in (".", "")]
    if partes == ["readme"]:
        return BASE + "/indice/"          # o índice completo da raiz
    if partes and partes[-1] in ("readme", "index"):
        partes.pop()
    return BASE + "/" + ("/".join(partes) + "/" if partes else "")


def reescrever_links(corpo, pasta_rel):
    """Troca links para arquivos .md pelas URLs finais do site.

    O Astro resolve links de imagem sozinho (e as otimiza), então só mexemos
    em alvos .md. Links externos e âncoras da própria página ficam como estão.
    """
    def troca(m):
        alvo, ancora = m.group(1), m.group(2) or ""
        if alvo.startswith(("http://", "https://", "mailto:", "/")):
            return m.group(0)
        caminho = os.path.normpath(os.path.join(pasta_rel, alvo)).replace(os.sep, "/")
        return f"]({url_do_arquivo(caminho)}{ancora})"

    return re.sub(r'\]\(([^)\s#]+\.md)(#[^)\s]*)?\)', troca, corpo)


ANIMACAO = re.compile(r'^<!--[ \t]*animacao:[ \t]*([a-z0-9-]+)[ \t]*-->[ \t]*$', re.M)


def plantar_animacoes(corpo):
    """`<!--animacao: ciclo-do-gc-->` vira o ponto onde a animação é montada.

    No GitHub é um comentário — invisível. No site vira um elemento que o
    navegador preenche sob demanda (web/src/animacoes/). Assim o markdown
    continua markdown: nada de MDX, que tentaria ler `<pid>` como componente.
    """
    return ANIMACAO.sub(
        lambda m: f'<div class="animacao" data-animacao="{m.group(1)}"></div>',
        corpo)


def transformar(conteudo, pasta_rel, caminho_original):
    """Extrai o H1 como título e devolve frontmatter + corpo com links de site."""
    linhas = conteudo.split("\n")
    titulo, corte = None, 0
    for i, linha in enumerate(linhas[:10]):
        m = re.match(r'^#\s+(.*\S)\s*$', linha)
        if m:
            titulo = m.group(1).strip()
            corte = i + 1
            break
    corpo = "\n".join(linhas[corte:]).lstrip("\n") if titulo else conteudo
    corpo = reescrever_links(corpo, pasta_rel)
    corpo = plantar_animacoes(corpo)

    if not titulo:
        return corpo
    # o título também perde a formatação markdown (fica no <h1> do tema)
    limpo = titulo.replace('`', '').replace('**', '').strip()
    # o "editar página" aponta para o arquivo ORIGINAL, na raiz do repositório
    editar = f"{EDITAR_EM}{caminho_original}"
    return (f"---\ntitle: {yaml_str(limpo)}\neditUrl: {yaml_str(editar)}\n---\n\n{corpo}")


if os.path.isdir(DOCS):
    shutil.rmtree(DOCS)
os.makedirs(DOCS)

paginas = imagens = 0
for base, pastas, arquivos in os.walk(RAIZ):
    pastas[:] = [p for p in pastas if p not in IGNORAR and not p.startswith(".")]
    rel = os.path.relpath(base, RAIZ)
    for arq in arquivos:
        ext = os.path.splitext(arq)[1].lower()
        origem = os.path.join(base, arq)
        if ext == ".md":
            # o README da raiz é o índice completo; a home é uma página própria
            nome = "indice.md" if (rel == "." and arq == "README.md") else \
                   ("index.md" if arq == "README.md" else arq)
            destino = os.path.normpath(os.path.join(DOCS, rel, nome))
            os.makedirs(os.path.dirname(destino), exist_ok=True)
            with open(origem, encoding="utf-8") as fh:
                texto = fh.read()
            with open(destino, "w", encoding="utf-8") as fh:
                origem_rel = os.path.relpath(origem, RAIZ).replace(os.sep, "/")
                fh.write(transformar(texto, "" if rel == "." else rel, origem_rel))
            paginas += 1
        elif ext in IMAGENS:
            destino = os.path.normpath(os.path.join(DOCS, rel, arq))
            os.makedirs(os.path.dirname(destino), exist_ok=True)
            shutil.copy2(origem, destino)
            imagens += 1

# páginas escritas à mão (a capa, por exemplo) vivem fora de content/docs,
# que é apagado a cada sincronização
PROPRIAS = os.path.join(RAIZ, "web", "src", "paginas")
proprias = 0
if os.path.isdir(PROPRIAS):
    for base, _, arquivos in os.walk(PROPRIAS):
        for arq in arquivos:
            rel = os.path.relpath(os.path.join(base, arq), PROPRIAS)
            destino = os.path.join(DOCS, rel)
            os.makedirs(os.path.dirname(destino), exist_ok=True)
            shutil.copy2(os.path.join(base, arq), destino)
            proprias += 1

print(f"{paginas} páginas, {imagens} imagens e {proprias} páginas próprias "
      f"sincronizadas para web/src/content/docs/")
