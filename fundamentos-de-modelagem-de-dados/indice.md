# ÍNDICE

> [← Voltar para FUNDAMENTOS DE MODELAGEM DE DADOS](README.md)

## Índices

São estruturas extras usadas por tabelas para acelerar a velocidade de recuperação de dados. Ao executar um select com um campo de índice, o tempo de consulta é mais rápido. É como um livro mesmo, quando você quer ver uma página específica, você olha o índice. Assim evitamos TABLE SCAN que é varrer toda uma tabela, o que diminui a performance.

Algumas características de uso dos índices são: velocidade da consulta, armazenamento, manutenção, unicidade.

A maioria dos índices são B-TREE:

![Estrutura de uma B-Tree com nível raiz, intermediário e folha](assets/indice-01.png)

**Root Level (Nó Raiz)**

- É o ponto de entrada de qualquer busca
- Contém o nó **1-200**, representando o intervalo total dos dados
- Há apenas **um** nó raiz

**Intermediate Level (Nível Intermediário)**

- Divide o intervalo em partes menores: **1-100** e **101-200**
- As setas horizontais (↔) indicam que os nós são **ligados entre si** (facilitam buscas sequenciais)
- Abaixo, divide ainda mais: **1-50**, **51-100**, **101-150**, **151-200**

**Leaf Level (Nível Folha)**

- É onde os dados reais (ou ponteiros para eles) ficam armazenados
- Intervalos de 25 em 25: 1-25, 26-50, 51-75... até 176-200
- Todos os nós folha são **ligados em sequência** (ótimo para buscas por intervalo)

> Por que **B-Tree** (na verdade **B+Tree** na maioria dos SGBDs): a árvore é **balanceada**, então toda busca custa o mesmo número de saltos — tipicamente 3 ou 4 níveis para milhões de linhas, ou seja **O(log n)** em vez de O(n). E como as folhas são encadeadas, ela serve tanto para busca exata (`=`) quanto para **intervalo** (`BETWEEN`, `>`, `<`) e para entregar dados **já ordenados** (`ORDER BY` sem sort). → [DICAS DE BANCO DE DADOS](../uteis/dicas-de-banco-de-dados.md)

## Tipos de índices

Simples: vão indexar apenas uma coluna de uma tabela

Compostos: vão indexar múltiplas colunas de uma tabela

Únicos: Garante que todos os valores indexados em uma coluna serão distintos

Clusterizados: armazenam os dados da tabela de acordo com o índice. Uma tabela tem só um índice clusterizado.

Não clusterizados: Armazenam um ponteiro para a tabela presente de acordo com o índice

De textos: Otimizam as consultas por campos que têm muito texto

## Exemplos

básico:

```sql
CREATE INDEX idx_nome ON clientes(nome)
```

composto:

```sql
CREATE INDEX idx_identificacaocliente ON clientes (nome, telefone, email)
```

---

## 1. O outro lado: índice **não é grátis**

Toda a discussão acima é sobre o benefício. O custo:

| Custo | Detalhe |
|---|---|
| **Escrita mais lenta** | todo `INSERT`, `UPDATE` (da coluna indexada) e `DELETE` precisa **manter a árvore** — rebalanceando nós. Cinco índices = cinco estruturas atualizadas a cada escrita |
| **Espaço em disco** | um índice pode ocupar de 10% a mais de 100% do tamanho da tabela; não é raro o total de índices passar o tamanho dos dados |
| **Memória** | índices competem pelo *buffer pool*; índice inútil ocupa cache que faria falta a outro |
| **Manutenção** | fragmentação, `REINDEX`/`REBUILD`, estatísticas desatualizadas |
| **Bloqueio** | criar índice em tabela grande pode travar escrita (daí o `CREATE INDEX CONCURRENTLY` do Postgres) |

**Índice não usado é puro prejuízo**: paga o custo de escrita e não devolve nada em leitura. Todo SGBD tem como listar índices sem uso (`pg_stat_user_indexes` no Postgres) — é a primeira coisa a olhar num banco lento de escrita.

**Regra prática:** indexe as colunas de `WHERE`, `JOIN` e `ORDER BY` das consultas que realmente rodam — não "todas as colunas por precaução". Em tabela com escrita intensa, cada índice é uma decisão.

---

## 2. Seletividade — por que alguns índices são inúteis

**Seletividade = quantos valores distintos a coluna tem em relação ao total de linhas.**

| Coluna | Valores distintos | Seletividade | Índice ajuda? |
|---|---|---|---|
| `cpf` | 1.000.000 de 1.000.000 | ~100% (alta) | ✅ muito |
| `email` | quase todos distintos | alta | ✅ |
| `status_pedido` | 5 valores | baixa | 🟡 depende da distribuição |
| `sexo` | 2 valores | ~0,0002% (baixíssima) | ❌ inútil |
| `ativo` (boolean) | 2 valores | baixíssima | ❌ inútil |

O motivo é econômico: se o índice aponta para **metade da tabela**, o banco precisa ir ao índice, ler os ponteiros e depois buscar cada linha na tabela em posições aleatórias — mais caro do que simplesmente varrer a tabela sequencialmente. **O otimizador sabe disso e ignora o índice.**

A exceção importante é **distribuição desbalanceada**: se 99,9% dos pedidos estão `CONCLUIDO` e 0,1% estão `EM_ANALISE`, um índice ajuda **muito** na consulta por `EM_ANALISE`. A solução elegante é o **índice parcial**:

```sql
-- indexa só a fatia rara: menor, mais rápido e mais barato de manter
CREATE INDEX idx_pedido_em_analise ON pedido(criado_em)
WHERE status = 'EM_ANALISE';
```

---

## 3. Índice composto: a regra do prefixo mais à esquerda

```sql
CREATE INDEX idx_cliente ON clientes (nome, telefone, email);
```

Um índice composto funciona como uma **lista telefônica ordenada por sobrenome, depois nome**: dá para buscar por sobrenome, ou por sobrenome+nome — mas **não** por nome sozinho.

| Consulta | Usa o índice? |
|---|---|
| `WHERE nome = ?` | ✅ (prefixo) |
| `WHERE nome = ? AND telefone = ?` | ✅ (prefixo) |
| `WHERE nome = ? AND telefone = ? AND email = ?` | ✅ (completo) |
| `WHERE telefone = ?` | ❌ pula a primeira coluna |
| `WHERE email = ?` | ❌ |
| `WHERE nome = ? AND email = ?` | 🟡 usa só a parte de `nome`, filtra o resto linha a linha |

**Consequências práticas:**
- A **ordem das colunas** na definição do índice é decisão de projeto, não detalhe. Coloque primeiro a coluna usada em **igualdade** e mais seletiva; deixe as de **intervalo** (`>`, `BETWEEN`) por último — depois de uma condição de intervalo, o índice para de filtrar as colunas seguintes.
- Um índice `(a, b, c)` **torna redundante** um índice só de `(a)`. Índices redundantes são desperdício comum.

---

## 4. Quando o otimizador ignora o índice

Mesmo existindo o índice, ele **não é usado** quando:

```sql
-- ❌ FUNÇÃO sobre a coluna: o índice é de "data_criacao", não de "YEAR(data_criacao)"
WHERE YEAR(data_criacao) = 2026
-- ✅ reescreva como intervalo (sargable)
WHERE data_criacao >= '2026-01-01' AND data_criacao < '2027-01-01'

-- ❌ LIKE com curinga à esquerda: não há prefixo por onde começar a busca
WHERE nome LIKE '%silva'
-- ✅ prefixo fixo usa o índice
WHERE nome LIKE 'silva%'

-- ❌ tipo incompatível força conversão implícita da coluna
WHERE cpf = 12345678900          -- cpf é VARCHAR
-- ✅
WHERE cpf = '12345678900'

-- ❌ negação e OR costumam derrotar o índice
WHERE status <> 'ATIVO'
WHERE nome = ? OR telefone = ?   -- às vezes vira dois index scans + união; às vezes vira table scan
```

O termo técnico é **SARGable** (*Search ARGument able*): uma condição é sargable quando a coluna aparece "sozinha" de um lado da comparação. **Transformar a coluna mata o índice; transformar o valor, não.**

Outros motivos para o índice ser ignorado: **estatísticas desatualizadas** (rode `ANALYZE`), tabela pequena demais (varrer é mais barato) e consulta que retorna grande parte da tabela.

---

## 5. Covering index e index-only scan

```sql
SELECT nome, telefone FROM clientes WHERE nome = 'Ana';
```

Se o índice é `(nome, telefone)`, **todas** as colunas pedidas já estão nele — o banco responde **sem tocar na tabela**. Isso é **index-only scan**, e o índice é chamado de **covering index** para aquela consulta. É uma das otimizações de maior impacto: elimina o acesso aleatório à tabela.

```sql
-- Postgres: INCLUDE carrega colunas extras nas folhas SEM incluí-las na chave de busca
CREATE INDEX idx_cliente_nome ON clientes(nome) INCLUDE (telefone, email);
```

---

## 6. Clusterizado × não clusterizado

| | **Clusterizado** | **Não clusterizado** |
|---|---|---|
| O que guarda | **os próprios dados** da tabela, na ordem do índice | a chave + um **ponteiro** para a linha |
| Quantos por tabela | **um só** (a tabela tem uma ordem física) | vários |
| Leitura por intervalo | excelente (dados fisicamente adjacentes) | precisa do salto extra até a tabela |
| Custo | `INSERT` fora de ordem causa *page split* | menor |

No **SQL Server/MySQL InnoDB**, a PK é o índice clusterizado e a tabela **é** a árvore — por isso o índice secundário guarda a PK e faz uma segunda busca até a folha da tabela (é o *bookmark lookup*). No **PostgreSQL** não existe índice clusterizado permanente: a tabela é um *heap* e todos os índices são secundários (o comando `CLUSTER` só reordena o heap uma vez).

Consequência prática em InnoDB: **PK aleatória (UUIDv4) fragmenta a tabela** e degrada a escrita, porque cada inserção cai numa página aleatória. Daí a preferência por chave sequencial ou UUIDv7/ULID (ordenável por tempo).

---

## 7. B-Tree × Hash × outros

| Tipo | Suporta | Não suporta | Uso |
|---|---|---|---|
| **B-Tree** | `=`, `<`, `>`, `BETWEEN`, `LIKE 'x%'`, `ORDER BY`, `MIN/MAX` | — | **99% dos casos**, o padrão |
| **Hash** | apenas `=` | intervalo e ordenação | igualdade pura, em nicho |
| **GIN** (Postgres) | busca em `JSONB`, arrays, full-text | — | documento e texto |
| **GiST / SP-GiST** | dados geométricos, intervalos | — | geoespacial (PostGIS) |
| **BRIN** | intervalos em tabelas gigantes já ordenadas fisicamente | busca pontual | séries temporais, log |
| **Full-text** | busca por palavras, relevância, stemming | — | campos com muito texto |
| **Bitmap** | colunas de baixa cardinalidade em DW | escrita concorrente | OLAP (Oracle) |

**Por que B-Tree domina:** hash é teoricamente O(1) para igualdade, mas **não** atende intervalo, ordenação nem `LIKE` prefixado — e a maioria das consultas reais precisa de pelo menos um desses. A vantagem marginal em `=` não compensa perder o resto.

---

## 8. Lendo o plano de execução

```sql
EXPLAIN ANALYZE
SELECT * FROM pedido WHERE cliente_id = 42 AND status = 'ATIVO';
```

`EXPLAIN` mostra o plano **estimado**; `EXPLAIN ANALYZE` **executa** e mostra o tempo e as linhas reais (cuidado: executa de verdade, inclusive `UPDATE`/`DELETE` — use dentro de uma transação com `ROLLBACK`).

**O que procurar:**

| Operação | Significado | Sinal |
|---|---|---|
| `Seq Scan` / `Full Table Scan` | varreu a tabela inteira | 🔴 em tabela grande com filtro seletivo = índice faltando |
| `Index Scan` | usou o índice e foi à tabela buscar as linhas | 🟢 |
| `Index Only Scan` | respondeu só com o índice | 🟢🟢 ótimo |
| `Bitmap Heap Scan` | juntou vários acessos de índice antes de ir à tabela | 🟡 normal em faixa média |
| `Nested Loop` | para cada linha de A, busca em B | bom com poucas linhas; 🔴 péssimo com muitas |
| `Hash Join` | monta hash de uma tabela e varre a outra | bom para volumes grandes |
| `Merge Join` | junta duas entradas já ordenadas | bom quando há índice pelos dois lados |
| `Sort` (com `Disk`) | ordenação que não coube em memória | 🔴 aumente `work_mem` ou indexe o `ORDER BY` |

**A leitura mais importante:** compare **`rows` estimado × `actual rows`**. Diferença de ordem de grandeza significa **estatística desatualizada** — o otimizador escolheu um plano ruim porque tinha informação errada. `ANALYZE` resolve.

---

## Perguntas para autoavaliação

1. Por que a B-Tree dá busca em O(log n), e por que as folhas são encadeadas?
2. Cite três custos de manter um índice.
3. O que é seletividade e por que um índice em `sexo` é inútil?
4. Como um índice parcial resolve o caso da coluna de baixa cardinalidade mal distribuída?
5. Dado `INDEX (nome, telefone, email)`, quais consultas o usam e quais não?
6. Por que a ordem das colunas num índice composto importa?
7. O que é uma condição SARGable? Reescreva `WHERE YEAR(data) = 2026` para usar índice.
8. Por que `LIKE '%silva'` não usa índice, mas `LIKE 'silva%'` usa?
9. O que é um covering index e por que o index-only scan é mais rápido?
10. Qual a diferença entre índice clusterizado e não clusterizado, e quantos de cada tipo uma tabela pode ter?
11. Por que UUIDv4 como PK degrada a escrita no InnoDB?
12. Por que B-Tree domina, mesmo com hash sendo O(1) para igualdade?
13. Num `EXPLAIN ANALYZE`, o que significa uma diferença grande entre linhas estimadas e reais?

---

> [← Voltar para FUNDAMENTOS DE MODELAGEM DE DADOS](README.md) · **Relacionados:** [MODELAGEM RELACIONAL](modelagem-relacional.md) · [SPRING DATA JPA](../spring-data-jpa/README.md) · [Spring MVC - Evolução da API](../spring-mvc-apis-restful/iv-evolucao-da-api.md)
