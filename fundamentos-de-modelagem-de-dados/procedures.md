# PROCEDURES

> [← Voltar para FUNDAMENTOS DE MODELAGEM DE DADOS](README.md)

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

---

## 1. A mesma procedure nos três dialetos

Procedure é o recurso **menos portável** do SQL: a linguagem procedural muda completamente de banco para banco.

```sql
-- ========== SQL SERVER (T-SQL) ==========
CREATE PROCEDURE BuscarCliente
    @id INT,
    @nome VARCHAR(120) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT @nome = Nome FROM Clientes WHERE ClienteId = @id;
END;
GO

DECLARE @n VARCHAR(120);
EXEC BuscarCliente @id = 5, @nome = @n OUTPUT;
```

```sql
-- ========== MySQL ==========
DELIMITER $$                                  -- troca o delimitador para o ";" interno não encerrar
CREATE PROCEDURE BuscarCliente(IN p_id INT, OUT p_nome VARCHAR(120))
BEGIN
    SELECT nome INTO p_nome FROM clientes WHERE cliente_id = p_id;
END$$
DELIMITER ;

CALL BuscarCliente(5, @n);
SELECT @n;
```

```sql
-- ========== PostgreSQL (PL/pgSQL) ==========
CREATE OR REPLACE PROCEDURE buscar_cliente(IN p_id INT, INOUT p_nome VARCHAR DEFAULT NULL)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT nome INTO p_nome FROM clientes WHERE cliente_id = p_id;
END;
$$;

CALL buscar_cliente(5, NULL);
```

| | SQL Server | MySQL | PostgreSQL |
|---|---|---|---|
| Linguagem | T-SQL | SQL/PSM | PL/pgSQL (e outras) |
| Parâmetro | `@nome` | `p_nome` com `IN/OUT/INOUT` | `p_nome` com `IN/OUT/INOUT` |
| Corpo | `AS BEGIN ... END` | `BEGIN ... END` + `DELIMITER` | `AS $$ ... $$` (*dollar quoting*) |
| Chamada | `EXEC` | `CALL` | `CALL` |
| Procedure com transação própria | ✅ | ✅ | ✅ desde a versão 11 (antes só function) |

**Parâmetros:**

| Modo | Direção |
|---|---|
| **`IN`** | entra na procedure (padrão) |
| **`OUT`** | sai da procedure — o chamador recebe |
| **`INOUT`** | entra com valor e volta alterado |

---

## 2. Procedure × Function × Trigger

Comparativo que cai em prova:

| | **Procedure** | **Function** | **Trigger** |
|---|---|---|---|
| Chamada | explícita (`CALL`/`EXEC`) | dentro de uma expressão SQL (`SELECT f(x)`) | **automática**, por evento |
| Retorno | opcional; pode usar `OUT` | **obrigatório**, um valor ou tabela | nenhum |
| Usa em `SELECT`/`WHERE` | ❌ | ✅ | — |
| Pode alterar dados (DML) | ✅ | restrito (no Postgres pode; no SQL Server, não) | ✅ |
| Controle de transação | ✅ (`COMMIT`/`ROLLBACK`) | ❌ | roda **dentro** da transação que a disparou |
| Evento que dispara | você | você | `BEFORE`/`AFTER` `INSERT`/`UPDATE`/`DELETE` |
| Visibilidade | explícita no código | explícita | **invisível** — é o grande risco |

```sql
-- TRIGGER: auditoria automática de alteração de saldo (PostgreSQL)
CREATE OR REPLACE FUNCTION fn_auditar_saldo() RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO auditoria_conta(conta_id, saldo_anterior, saldo_novo, alterado_em)
    VALUES (OLD.conta_id, OLD.saldo, NEW.saldo, now());
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_auditar_saldo
AFTER UPDATE OF saldo ON conta
FOR EACH ROW EXECUTE FUNCTION fn_auditar_saldo();
```

No PostgreSQL, note a peculiaridade: **o trigger chama uma *function*** que retorna `TRIGGER` — não existe "corpo de trigger" solto.

`BEFORE` × `AFTER`: o `BEFORE` pode **modificar** a linha que está sendo gravada (`NEW.campo := ...`) ou cancelar a operação; o `AFTER` só reage, com a linha já gravada.

---

## 3. Visão crítica: por que muito time moderno evita

Este é o tipo de argumento que rende ponto em dissertativa — mostrar que você entende o **trade-off**, não só a sintaxe.

**Contra:**

| Problema | Detalhe |
|---|---|
| **Fora do controle de versão** | a lógica vive no banco; sem disciplina de migration (Flyway/Liquibase), ninguém sabe qual versão está em produção nem quem alterou |
| **Difícil de testar** | não há JUnit para PL/pgSQL no fluxo normal do time; exige banco de verdade e ferramental próprio |
| **Lógica de negócio espalhada** | metade da regra em Java, metade em SQL — para entender o sistema é preciso ler os dois |
| **Portabilidade zero** | migrar de SGBD significa reescrever tudo (ver seção 1) |
| **Observabilidade pobre** | não aparece no APM, no stack trace nem no log estruturado da aplicação |
| **Debug e refatoração ruins** | sem IDE decente, sem *find usages*, sem refactor automático |
| **Escala verticalmente** | processar no banco consome a CPU do recurso **mais caro e mais difícil de escalar** da arquitetura; a aplicação escala horizontalmente com facilidade |
| **Triggers são invisíveis** | um `UPDATE` inocente dispara efeitos que ninguém vê lendo o código da aplicação |

**A favor (onde ainda faz todo sentido):**

- **Operação em lote pesada** — atualizar 10 milhões de linhas *dentro* do banco evita trafegar tudo pela rede. Aqui procedure ganha com folga.
- **Redução de round-trips** — uma rotina com 20 passos que exigiria 20 idas e voltas do app ao banco.
- **Segurança** — conceder `EXECUTE` na procedure sem dar `SELECT`/`UPDATE` direto nas tabelas.
- **Regra que precisa valer para todos os clientes** do banco (vários sistemas legados escrevendo na mesma base).
- **Auditoria e integridade que não podem ser burladas** — trigger garante o registro mesmo se alguém alterar direto por SQL.

**Consenso atual:** regra de negócio na aplicação, onde há teste, versionamento e observabilidade; banco cuida de **integridade** (constraints), **auditoria** e **processamento em lote**. Se usar procedures, versione-as em migrations, como se fossem código — porque são.

---

## Perguntas para autoavaliação

1. Qual a diferença entre procedure, function e trigger, em chamada e retorno?
2. O que os modos `IN`, `OUT` e `INOUT` significam?
3. Por que o MySQL precisa de `DELIMITER` para criar uma procedure?
4. `BEFORE` × `AFTER` trigger: qual pode alterar a linha sendo gravada?
5. No PostgreSQL, o que um trigger executa de fato?
6. Cite quatro motivos pelos quais times modernos evitam lógica de negócio em procedure.
7. Em que cenários a procedure ainda é a melhor escolha?
8. Por que processar no banco escala pior que processar na aplicação?
9. Como mitigar o problema de versionamento de procedures?

---

> [← Voltar para FUNDAMENTOS DE MODELAGEM DE DADOS](README.md) · **Relacionados:** [VIEWS](views.md) · [ACID](acid.md) · [SPRING DATA JPA](../spring-data-jpa/README.md)
