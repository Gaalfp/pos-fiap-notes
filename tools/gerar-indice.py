#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Escreve o README.md da raiz: índice de 4 níveis (grupo > matéria > arquivo > tópico/subtópico).

Uso:  python3 tools/gerar-indice.py
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from estrutura import DADOS, RAIZ, arvore, slug  # noqa: E402

L = []
w = L.append

w("# ADJ - PÓSTECH FIAP")
w("")
w("Anotações da pós-graduação (migradas do Notion). Cada matéria é uma pasta, com o")
w("conteúdo principal no `README.md` e os capítulos/subtópicos em arquivos próprios.")
w("")
w("Este índice abre **todos os níveis**: matéria → arquivo → tópico → subtópico. Cada")
w("item leva direto à seção correspondente. Todo arquivo de conteúdo termina com")
w("**perguntas de autoavaliação**, omitidas aqui para não repetir em cada bloco.")
w("")
w("> 📌 **[RESUMO DE PROVA](RESUMO-PROVA.md)** — o arquivo de véspera. Comece por ele na reta final.")
w("")
w("## Sumário")
w("")
for grupo, materias in DADOS:
    nomes = " · ".join(f"[{m[0]}](#{slug(m[0])})" for m in materias)
    w(f"- **[{grupo}](#{slug(grupo)})** — {nomes}")
w("")
w("---")
w("")

for grupo, materias in DADOS:
    w(f"## {grupo}")
    w("")
    for nome, _pasta, descricao, arquivos in materias:
        w(f"### {nome}")
        w("")
        w(descricao)
        w("")
        unico = len(arquivos) == 1
        for rotulo_, caminho, desc_curta in arquivos:
            if unico:
                w(f"**[{rotulo_} →]({caminho})**" + (f" — {desc_curta}" if desc_curta else ""))
            else:
                w(f"#### [{rotulo_}]({caminho})")
                if desc_curta:
                    w("")
                    w(desc_curta[0].upper() + desc_curta[1:] + ".")
            w("")
            corpo = arvore(caminho)
            if corpo:
                w("\n".join(corpo))
            elif caminho.endswith("README.md"):
                w("_Só a apresentação da matéria, o índice dos capítulos e os links relacionados._")
            else:
                w("_Arquivo curto, sem subdivisões — leia direto._")
            w("")
        w("<br>")
        w("")
    w("---")
    w("")
w("<sub>Índice gerado por `tools/gerar-indice.py` a partir dos títulos dos arquivos. "
  "Ao criar ou renomear uma matéria, edite `tools/estrutura.py` e rode o gerador.</sub>")

destino = os.path.join(RAIZ, "README.md")
with open(destino, "w", encoding="utf-8") as fh:
    fh.write("\n".join(L) + "\n")
print(f"README.md atualizado ({len(L)} blocos)")
