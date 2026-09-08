# MODELAGEM NÃO RELACIONAL

**NoSQL** (que significa *Not Only SQL* ou "Não Apenas SQL") é um termo usado para descrever sistemas de bancos de dados **não relacionais**.

Diferente dos bancos de dados tradicionais (como MySQL, Oracle ou PostgreSQL), que organizam as informações em tabelas rígidas com linhas e colunas interligadas, o NoSQL foi criado para armazenar dados de formas variadas, oferecendo muito mais flexibilidade, velocidade e escalabilidade para aplicações modernas.

- maior flexibilidade
- escalabilidade horizontal
- desnormalização e agregação de dados
- schemaless
- alto desempenho

### Principais Tipos de Bancos NoSQL

Como os dados não ficam presos a tabelas, os bancos NoSQL utilizam diferentes modelos de armazenamento dependendo da necessidade:

- **Documentos:** Armazenam dados em formatos semelhantes a JSON (ex: *MongoDB*, *CouchDB*). Ótimos para catálogos de produtos e perfis de usuários.
- **Chave-Valor:** O modelo mais simples, onde cada dado tem uma chave única e um valor associado (ex: *Redis*, *Amazon DynamoDB*). Muito usados para cache de sessões e carrinhos de compras.
- **Colunas Amplas:** Armazenam dados em tabelas, mas agrupados por colunas em vez de linhas, permitindo leituras muito rápidas (ex: *Apache Cassandra*, *HBase*). Ideais para análise de grandes volumes de dados (Big Data).
- **Grafos:** Focados nas relações e conexões entre os dados, como redes de pontos interligados (ex: *Neo4j*). Perfeitos para redes sociais, sistemas de recomendação e detecção de fraudes.

Modelos de documentos

Json, XML, Bson, dados não estruturados ou semiestruturados.
