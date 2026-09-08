# ACID

> [← Voltar para FUNDAMENTOS DE MODELAGEM DE DADOS](README.md)

Define as 4 propriedades fundamentais em um sistema de banco de dados. Usado para banco de dados Relacionais 

- A (Atomicidade) → Funciona como a regra do "tudo ou nada". Se uma transação envolver múltiplas operações, ou todas elas são executadas com sucesso, ou, caso ocorra qualquer falha, nenhuma delas é aplicada e o banco de dados é revertido ao estado anterior.
- C (Consistencia) → Garante que qualquer transação levará o banco de dados de um estado válido (obedecendo a todas as regras, restrições e chaves) para outro estado igualmente válido, evitando dados corrompidos ou fora de padrão.
- I (Isolamento) →  Determina que transações simultâneas sejam processadas de forma independente umas das outras. Isso impede que uma transação veja dados intermediários ou incompletos de outra transação que ainda está em andamento.
- D (Durabilidade) → Assegura que, uma vez que uma transação seja confirmada (ou *commit*), os dados serão armazenados de forma permanente, mesmo que ocorra uma queda de energia, falha no sistema ou erro grave.

Outro conceito bastante utilizado é o de BASE; 

O conceito **BASE** **é o oposto do modelo ACID, projetado para lidar com o enorme volume de dados e a necessidade de alta disponibilidade dos sistemas modernos na web** 

**BA - Basicamente Disponível (Basically Available):** O sistema prioriza estar sempre online e respondendo às requisições dos usuários, mesmo que ocorra uma falha parcial em algum servidor ou perda de dados temporária.

**S - Estado Fluido (Soft State):** Os dados não precisam ser estáticos ou ultra-consistentes o tempo todo. O estado dos dados pode mudar sozinho ao longo do tempo à medida que as atualizações se propagam pela rede. [[1](https://fidelissauro.dev/teorema-cap/), [2](https://www.reddit.com/r/devops/comments/1kpyate/eli5_what_exactly_are_acid_and_base_transactions/?tl=pt-br)]

**E - Consistência Eventual (Eventual Consistency):** O sistema garante que, se nenhuma nova atualização for feita, todos os servidores eventualmente alcançarão o mesmo estado e exibirão o mesmo dado idêntico para todos. [[1](https://www.marcosmota.com/entendendo-a-consistencia-em-sistemas-distribuidos/)]


---

## Isolamento na prática: os quatro níveis

O **I** de ACID é o único que você **negocia**. Isolamento total (transações uma após a outra) seria correto e lentíssimo; os SGBDs oferecem níveis intermediários, trocando garantia por concorrência.

### As anomalias

| Anomalia | O que acontece |
|---|---|
| **Dirty read** (leitura suja) | T1 lê um dado que T2 alterou mas **ainda não commitou** — e T2 pode dar rollback. Você leu algo que nunca existiu |
| **Non-repeatable read** (leitura não repetível) | T1 lê a **mesma linha** duas vezes e obtém valores diferentes, porque T2 alterou e commitou no meio |
| **Phantom read** (leitura fantasma) | T1 executa a **mesma consulta** duas vezes e aparecem **linhas novas**, porque T2 inseriu e commitou. Não é a linha que mudou — é o conjunto |
| **Lost update** (atualização perdida) | T1 e T2 leem o mesmo saldo, calculam e gravam: a segunda escrita **sobrescreve** a primeira, que se perde silenciosamente |
| **Write skew** | cada transação lê um conjunto, decide algo válido isoladamente, e juntas violam a regra (ex.: dois médicos de plantão pedem folga ao mesmo tempo, cada um vendo que "ainda tem outro de plantão") |

### Os níveis

| Nível | Dirty read | Non-repeatable read | Phantom read | Custo |
|---|:---:|:---:|:---:|---|
| **Read Uncommitted** | ✅ permite | ✅ permite | ✅ permite | mínimo |
| **Read Committed** | ❌ impede | ✅ permite | ✅ permite | baixo |
| **Repeatable Read** | ❌ | ❌ impede | ✅ permite* | médio |
| **Serializable** | ❌ | ❌ | ❌ impede | alto |

\* No **MySQL InnoDB**, o Repeatable Read usa *next-key locks* e, na prática, também evita phantoms na maioria dos casos. No **PostgreSQL**, o Repeatable Read é implementado como *snapshot isolation* e também não sofre phantom — mas ainda admite **write skew**, que só o Serializable elimina.

**Padrões de cada SGBD** (pergunta clássica): PostgreSQL, Oracle e SQL Server usam **Read Committed**; **MySQL/InnoDB** usa **Repeatable Read**. Ou seja, o mesmo código pode se comportar de forma diferente ao trocar de banco.

```sql
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;   -- SQL padrão
```

```java
@Transactional(isolation = Isolation.REPEATABLE_READ)   // Spring
public void transferir(...) { }
```

### O custo: isolamento × concorrência

Quanto mais forte o isolamento, **menos transações rodam em paralelo** — mais bloqueio, mais espera, mais chance de **deadlock** e de erro de serialização (que a aplicação precisa capturar e **repetir**). Serializable em sistema de alto volume costuma ser caro demais.

A maioria dos bancos modernos usa **MVCC** (*Multi-Version Concurrency Control*): cada transação enxerga um *snapshot* consistente, e **leitura não bloqueia escrita nem escrita bloqueia leitura**. É isso que torna Read Committed barato — o preço é guardar versões antigas (o `VACUUM` do Postgres existe para limpá-las).

### Como resolver *lost update* na aplicação

| Estratégia | Como funciona | Quando |
|---|---|---|
| **Bloqueio otimista** | coluna de versão; no `UPDATE`, `WHERE versao = ?`; se não afetou linha, alguém alterou antes → erro e retry | conflito **raro** (o caso comum) |
| **Bloqueio pessimista** | `SELECT ... FOR UPDATE` trava a linha até o commit | conflito **frequente**, ou operação curta e crítica |
| **Operação atômica no banco** | `UPDATE conta SET saldo = saldo - 100 WHERE id = ? AND saldo >= 100` | quando dá para expressar a regra em SQL |

Em JPA, isso é `@Version` (otimista) e `@Lock(PESSIMISTIC_WRITE)`. → [SPRING DATA JPA](../spring-data-jpa/README.md)

---

## ACID, BASE e o mundo distribuído

ACID vale dentro de **um** banco. Quando a operação atravessa serviços, não existe transação distribuída barata:

- **Two-phase commit (2PC)** existe, mas trava recursos e derruba a disponibilidade — praticamente abandonado em arquitetura de microsserviços.
- **Saga** — sequência de transações locais, cada uma com uma **compensação** (estorno) para desfazer logicamente o que já foi feito.
- **Outbox** — grava o evento na **mesma transação** do dado e publica depois, garantindo atomicidade entre banco e mensageria.

→ [TEOREMA CAP](../teorema-cap/README.md) · [MODELAGEM NÃO RELACIONAL](modelagem-nao-relacional.md)

---

## Perguntas para autoavaliação

1. Explique cada letra de ACID em uma frase.
2. O C de ACID é o mesmo C do teorema CAP? Justifique.
3. Diferencie dirty read, non-repeatable read e phantom read.
4. Qual nível de isolamento impede cada uma dessas anomalias?
5. Qual o nível padrão do PostgreSQL? E do MySQL InnoDB? Por que isso importa?
6. O que é lost update e quais são as três formas de evitá-lo?
7. Quando usar bloqueio otimista e quando usar pessimista?
8. O que é MVCC e por que ele torna a leitura barata?
9. Por que Serializable não é o padrão, se é o mais correto?
10. Compare ACID e BASE, e diga o que substitui a transação entre microsserviços.

---

> [← Voltar para FUNDAMENTOS DE MODELAGEM DE DADOS](README.md) · **Relacionados:** [TEOREMA CAP](../teorema-cap/README.md) · [SPRING DATA JPA](../spring-data-jpa/README.md) · [MODELAGEM NÃO RELACIONAL](modelagem-nao-relacional.md)
