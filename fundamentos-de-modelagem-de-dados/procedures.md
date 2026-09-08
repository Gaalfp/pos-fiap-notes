# PROCEDURES

Uma **procedure** (ou stored procedure) é um bloco de código SQL armazenado no banco de dados que encapsula uma sequência de instruções para ser executada quando chamada.

Pense nela como uma "função" no banco: você define a lógica uma vez, dá um nome, e pode chamá-la quantas vezes quiser passando parâmetros diferentes.

**Principais características:**

- Reusabilidade
- Segurança
- Manutenção
- Performance
- Aceita parâmetros de entrada e saída
- Pode conter lógica condicional (IF, WHILE, etc.)
- É executada diretamente no servidor do banco
- Não precisa retornar um valor (diferente de uma function)

**Para que servem:** Automatização de tarefas, validação de dados, operações em lote.

**Tipos de Procedures**

- **Simple procedures:** Executam uma sequência de comandos SQL sem interação com nenhuma variável de parâmetro
- **Com parâmetros:** Recebem parâmetros de entrada ou saída, podendo passar valores específicos para os comandos SQL serem executados
- **Do sistema:** Fornecidas pelos SGBDs para ajudar nas tarefas administrativas
- **Aninhadas:** Procedures que chamam outras procedures
- **Recursivas:** São chamadas recursivamente para resolver um problema

**Exemplo:**

> ⚠️ A sintaxe abaixo é **T-SQL (SQL Server)** — parâmetro com `@`, corpo em `AS BEGIN ... END` e chamada com `EXEC`. MySQL e PostgreSQL usam sintaxe diferente (`DELIMITER` + `IN param`, e `CREATE PROCEDURE ... LANGUAGE plpgsql` + `CALL`).

```sql
CREATE PROCEDURE BuscarCliente(@id INT)
AS
BEGIN
  SELECT * FROM Clientes WHERE ClienteId = @id;
END;
```

**Chamada:**

```sql
EXEC BuscarCliente @id = 5;
```
