# BANCO DE DADOS EM GRAFOS

Coleção organizada de dados que foca nas **relações** entre diferentes entidades. Utilizando a teoria dos grafos, ele **representa** conexões entre os dados de forma visual e direta. Armazenam informações de uma rede de nós e arestas.

![image.png](assets/banco-de-dados-em-grafos-01.png)

Arestas podem **representar** relações de um para um ou de um para muitos.

Tanto os nós quanto as arestas podem ter propriedades — elas tornam os grafos mais expressivos.

---

## Conceitos Fundamentais

### Nós (Vértices)

Representam as **entidades** do modelo (ex: pessoas, produtos, lugares). Cada nó pode ter um conjunto de propriedades, como `name: "Alice"` ou `age: 30`.

### Arestas (Relacionamentos)

Representam as **conexões** entre nós. São **direcionadas** (possuem origem e destino) e possuem um **tipo** que descreve a natureza da relação (ex: `CONHECE`, `COMPROU`, `MORA_EM`).

### Propriedades

Atributos chave-valor associados tanto a nós quanto a arestas. Permitem armazenar informações adicionais diretamente no relacionamento (ex: `desde: 2020`).

---

## Quando Usar Banco de Dados em Grafos?

- Quando os **relacionamentos entre dados** são tão importantes quanto os próprios dados.
- Consultas que exigem **travessia de múltiplos níveis** de conexão (ex: amigos de amigos).
- Dados altamente conectados e dinâmicos.

---

## Casos de Uso Comuns

- **Redes sociais** → modelagem de amizades, seguidores e interações.
- **Sistemas de recomendação** → "quem comprou X também comprou Y".
- **Detecção de fraudes** → análise de padrões suspeitos em transações.
- **Grafos de conhecimento** → bases de conhecimento semântico (ex: Google Knowledge Graph).
- **Logística e rotas** → otimização de caminhos em mapas e redes de transporte.

---

## Linguagem de Consulta: Cypher

O **Cypher** é a linguagem de consulta mais popular para grafos, utilizada pelo **Neo4j**.

```
// Criar dois nós e um relacionamento
CREATE (a:Pessoa {name: 'Alice'})-[:CONHECE]->(b:Pessoa {name: 'Bob'})

// Buscar todos os amigos de Alice
MATCH (a:Pessoa {name: 'Alice'})-[:CONHECE]->(amigo)
RETURN amigo.name
```

---

## Principais SGBDs de Grafos

- **Neo4j** → o mais popular; utiliza Cypher como linguagem de consulta.
- **Amazon Neptune** → solução gerenciada na nuvem AWS.
- **ArangoDB** → multimodelo (grafos + documentos + chave-valor).
- **JanusGraph** → open source, escalável horizontalmente.

---

## Vantagens

- Alta performance em consultas com **múltiplos níveis de relacionamento**.
- Modelo de dados **intuitivo** e próximo do mundo real.
- Flexível — fácil de adicionar novos tipos de nós e arestas sem alterar o esquema.

## Desvantagens

- Não é ideal para dados **tabulares simples** (prefira SQL nesses casos).
- Menor adoção no mercado comparado a bancos relacionais.
- Ferramentas e profissionais especializados ainda são menos comuns.

---

## Por que grafo vence o relacional em travessia

A pergunta "amigos dos amigos dos amigos de Alice" em SQL exige **três `JOIN`s** da tabela de amizades consigo mesma — e cada nível **multiplica** o custo, porque o banco precisa consultar o índice a cada salto. Em banco de grafos, cada nó guarda **ponteiros diretos** para seus vizinhos (*index-free adjacency*): a travessia é um salto de ponteiro, e o custo depende do tamanho da **vizinhança**, não do tamanho da base.

| Profundidade da consulta | Relacional | Grafo |
|---|---|---|
| 1 nível ("amigos de Alice") | rápido | rápido |
| 3 níveis | lento (3 self-joins) | rápido |
| 5+ níveis ou profundidade variável | inviável na prática | ainda rápido |

É por isso que detecção de fraude e recomendação — que são justamente travessias profundas — migraram para grafos.

---

## Perguntas para autoavaliação

1. O que são nós, arestas e propriedades num banco de grafos?
2. Arestas são direcionadas? O que isso significa na modelagem?
3. O que é *index-free adjacency* e por que ela muda o custo da travessia?
4. Por que uma consulta de 4 níveis é cara no relacional e barata no grafo?
5. Escreva em Cypher: criar duas pessoas e um relacionamento entre elas.
6. Cite três casos de uso em que grafo é a escolha certa.
7. Quando **não** usar banco de grafos?
8. Onde os grafos se encaixam entre os tipos de NoSQL?

---

> [← Voltar para FUNDAMENTOS DE MODELAGEM DE DADOS](README.md) · **Relacionados:** [MODELAGEM NÃO RELACIONAL](modelagem-nao-relacional.md) · [MODELAGEM RELACIONAL](modelagem-relacional.md)
