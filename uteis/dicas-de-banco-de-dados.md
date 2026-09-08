# DICAS DE BANCO DE DADOS

- **Ordenação:** o padrão é ordenar **no banco** (`ORDER BY` no SELECT). O banco aproveita o índice — que já devolve os dados na ordem —, evita trafegar o resultado inteiro para a aplicação e é a única forma de paginar corretamente com `LIMIT`/`OFFSET` (sem `ORDER BY` determinístico, a página 2 pode repetir ou pular linhas).
- Ordenar **na aplicação** só se justifica em casos estreitos: resultado pequeno que já está todo em memória, critério que o banco não conhece (ordem calculada por regra de negócio em Java) ou junção de dados vindos de fontes diferentes.
