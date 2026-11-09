#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Escreve web/src/barra-lateral.json a partir de tools/estrutura.py.

A navegação do site e o índice do README saem da MESMA fonte, então não divergem.

Uso:  python3 tools/gerar-site.py
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from estrutura import BASE, DADOS, RAIZ  # noqa: E402


def rota(caminho):
    """'poo/README.md' -> '/poo/' ; 'poo/conceitos.md' -> '/poo/conceitos'"""
    sem_ext = caminho[:-3] if caminho.endswith(".md") else caminho
    if sem_ext.endswith("README"):
        sem_ext = sem_ext[:-len("README")]
    return "/" + sem_ext.strip("/")


barra = [{"label": "Início", "link": "/"}]
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

src = os.path.join(RAIZ, "web", "src")
os.makedirs(src, exist_ok=True)

with open(os.path.join(src, "barra-lateral.json"), "w", encoding="utf-8") as fh:
    json.dump(barra, fh, ensure_ascii=False, indent=2)
    fh.write("\n")

# o astro.config.mjs lê o base daqui, para não haver duas fontes da verdade
with open(os.path.join(src, "site.json"), "w", encoding="utf-8") as fh:
    json.dump({"base": BASE}, fh, ensure_ascii=False, indent=2)
    fh.write("\n")

print(f"web/src/barra-lateral.json atualizado ({len(barra) - 1} grupos) e site.json")
