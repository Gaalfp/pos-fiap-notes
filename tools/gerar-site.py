#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Escreve os dados que o site consome, a partir de tools/estrutura.py.

  src/barra-lateral.json  — a navegação lateral
  src/site.json           — o caminho base da publicação
  src/materias.json       — grupos, matérias, capítulos, tempo de leitura

A navegação do site e o índice do README saem da MESMA fonte, então não divergem.

Uso:  python3 tools/gerar-site.py
"""
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from estrutura import BASE, DADOS, RAIZ, TRILHA  # noqa: E402


PALAVRAS_POR_MINUTO = 200


def medir(caminho):
    """(palavras, minutos de leitura) de um arquivo, ignorando código."""
    with open(os.path.join(RAIZ, caminho), encoding="utf-8") as fh:
        texto = fh.read()
    texto = re.sub(r"```.*?```", " ", texto, flags=re.S)      # blocos de código
    texto = re.sub(r"\|[^\n]*\|", lambda m: m.group(0), texto)  # tabelas contam
    palavras = len(re.findall(r"[\wÀ-ÿ'-]+", texto))
    return palavras, max(1, round(palavras / PALAVRAS_POR_MINUTO))


def rota(caminho):
    """'poo/README.md' -> '/poo/' ; 'RESUMO-PROVA.md' -> '/resumo-prova'

    O Astro gera rotas em MINÚSCULAS. Esquecer isso passa despercebido no macOS
    (sistema de arquivos insensível a maiúsculas) e dá 404 no GitHub Pages.
    """
    sem_ext = caminho[:-3] if caminho.endswith(".md") else caminho
    if sem_ext.endswith("README"):
        sem_ext = sem_ext[:-len("README")]
    return "/" + sem_ext.strip("/").lower()


barra = [
    {"label": "Início", "link": "/"},
    {"label": "Índice completo", "link": "/indice/"},
]
for grupo, materias in DADOS:
    itens = []
    for nome, _pasta, _desc, arquivos in materias:
        if len(arquivos) == 1:
            itens.append({"label": nome, "link": rota(arquivos[0][1])})
        else:
            itens.append({
                "label": nome,
                "collapsed": True,
                "items": [{"label": r, "link": rota(c)} for r, c, _d in arquivos],
            })
    barra.append({"label": grupo, "collapsed": True, "items": itens})

# ── catálogo das matérias (home, trilha, progresso) ─────────────────────────
catalogo = []
for grupo, lista in DADOS:
    for nome, pasta, descricao, arquivos in lista:
        capitulos = []
        for rotulo_, caminho, desc_curta in arquivos:
            palavras, minutos = medir(caminho)
            capitulos.append({
                "rotulo": rotulo_, "url": rota(caminho), "descricao": desc_curta,
                "palavras": palavras, "minutos": minutos,
            })
        catalogo.append({
            "grupo": grupo, "nome": nome, "pasta": pasta, "descricao": descricao,
            "url": capitulos[0]["url"], "capitulos": capitulos,
            "minutos": sum(c["minutos"] for c in capitulos),
            "palavras": sum(c["palavras"] for c in capitulos),
        })

src = os.path.join(RAIZ, "web", "src")
os.makedirs(src, exist_ok=True)

with open(os.path.join(src, "barra-lateral.json"), "w", encoding="utf-8") as fh:
    json.dump(barra, fh, ensure_ascii=False, indent=2)
    fh.write("\n")

# o astro.config.mjs lê o base daqui, para não haver duas fontes da verdade
with open(os.path.join(src, "site.json"), "w", encoding="utf-8") as fh:
    json.dump({"base": BASE}, fh, ensure_ascii=False, indent=2)
    fh.write("\n")

por_nome = {m["nome"]: m for m in catalogo}
faltando = [n for n in TRILHA if n not in por_nome]
assert not faltando, f"TRILHA cita matéria inexistente: {faltando}"
for posicao, nome in enumerate(TRILHA, 1):
    por_nome[nome]["trilha"] = posicao

with open(os.path.join(src, "materias.json"), "w", encoding="utf-8") as fh:
    json.dump(catalogo, fh, ensure_ascii=False, indent=1)
    fh.write("\n")

total_min = sum(x["minutos"] for x in catalogo)
print(f"web/src/: barra-lateral.json ({len(barra) - 1} grupos), site.json, "
      f"materias.json ({len(catalogo)} matérias, {total_min} min de leitura)")
