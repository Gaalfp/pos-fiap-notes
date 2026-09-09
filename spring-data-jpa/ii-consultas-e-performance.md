# II - CONSULTAS E PERFORMANCE

> [← Voltar para SPRING DATA JPA](README.md) · Anterior: [I - PERSISTENCE CONTEXT](i-persistence-context-e-ciclo-de-vida.md) · Próximo: [III - TRANSAÇÕES E CONCORRÊNCIA](iii-transacoes-e-concorrencia.md)

## 1. A hierarquia de repositórios

```java
public interface ContaRepository extends JpaRepository<ContaEntity, Long> { }
```

Você declara **só a interface** — o Spring Data gera a implementação em runtime (é um [Proxy](../design-patterns-em-oo/ii-padroes-estruturais.md)).

| Interface | O que traz |
|---|---|
| `Repository<T, ID>` | marcador, **vazia** — você declara só os métodos que quiser |
| `CrudRepository` | `save`, `findById`, `findAll`, `delete`, `count`, `existsById` |
| `PagingAndSortingRepository` | + `findAll(Pageable)`, `findAll(Sort)` |
| `ListCrudRepository` | igual ao Crud, mas devolve `List` em vez de `Iterable` |
| `JpaRepository` | + `flush`, `saveAndFlush`, `saveAllAndFlush`, `deleteAllInBatch`, `getReferenceById` |

É a hierarquia segregada que o **ISP** prescreve: se o seu caso de uso só lê, estenda `Repository` e declare dois métodos — em vez de expor `deleteAll()` para o sistema inteiro. → [SOLID](../solid/README.md)

---

## 2. Derived queries — consulta pelo nome do método

O Spring Data **interpreta o nome** do método e escreve o JPQL:

```java
List<ContaEntity> findByTitularAndStatus(String titular, Status status);
Optional<ContaEntity> findFirstByDocumentoOrderByCriadoEmDesc(String documento);
List<ContaEntity> findBySaldoGreaterThanEqualAndStatusNot(BigDecimal min, Status status);
List<ContaEntity> findByTitularContainingIgnoreCase(String trecho);
List<ContaEntity> findByCriadoEmBetween(LocalDateTime de, LocalDateTime ate);
List<ContaEntity> findByClienteEnderecoCidade(String cidade);   // navega no relacionamento
boolean existsByDocumento(String documento);
long countByStatus(Status status);
void deleteByStatus(Status status);                              // exige @Transactional
List<ContaEntity> findTop10ByOrderBySaldoDesc();
```

| Palavra-chave | Vira |
|---|---|
| `And`, `Or` | `AND`, `OR` |
| `Between`, `LessThan`, `GreaterThanEqual` | comparações |
| `Like`, `Containing`, `StartingWith`, `EndingWith` | `LIKE` |
| `IgnoreCase` | `UPPER(x) = UPPER(?)` |
| `In`, `NotIn` | `IN` |
| `IsNull`, `IsNotNull` | `IS NULL` |
| `OrderBy...Asc/Desc` | `ORDER BY` |
| `Top`, `First` | `LIMIT` |
| `Distinct` | `DISTINCT` |

**Vantagem:** zero SQL, validado na **subida da aplicação** (nome errado = falha no startup, não em produção). **Limite:** a partir de três condições o nome vira `findByTitularAndStatusAndSaldoGreaterThanAndCriadoEmBetween...` — ilegível. Aí é hora de `@Query` ou Specification.

---

## 3. `@Query` — JPQL e SQL nativo

```java
// JPQL — fala de ENTIDADES e atributos Java, não de tabelas e colunas
@Query("SELECT c FROM ContaEntity c WHERE c.saldo > :minimo AND c.status = :status")
List<ContaEntity> buscarAcimaDe(@Param("minimo") BigDecimal minimo, @Param("status") Status status);

// SQL nativo — quando precisa de recurso do banco (CTE, window function, JSONB)
@Query(value = """
        SELECT c.* FROM conta c
        WHERE c.saldo > :minimo
          AND c.dados @> '{"vip": true}'::jsonb
        """, nativeQuery = true)
List<ContaEntity> buscarVipsAcimaDe(@Param("minimo") BigDecimal minimo);

// escrita exige @Modifying
@Modifying(clearAutomatically = true, flushAutomatically = true)
@Query("UPDATE ContaEntity c SET c.status = :novo WHERE c.status = :antigo")
int atualizarStatus(@Param("novo") Status novo, @Param("antigo") Status antigo);
```

| | **JPQL** | **SQL nativo** |
|---|---|---|
| Fala de | entidades e atributos | tabelas e colunas |
| Portável entre bancos | ✅ | ❌ |
| Validado no startup | ✅ | ❌ só em runtime |
| Recursos específicos do SGBD | ❌ | ✅ |
| Devolve entidade gerenciada | ✅ | ✅ (se mapear a entidade) |

> ### ⚠️ `@Modifying` e o persistence context desatualizado
>
> Um `UPDATE`/`DELETE` em massa via JPQL vai **direto ao banco** e **não passa pelo persistence context**: as entidades já carregadas em memória continuam com o valor antigo, e o dirty checking pode até sobrescrever sua atualização no commit. Por isso `clearAutomatically = true` (limpa o contexto depois) e `flushAutomatically = true` (descarrega o pendente antes). Também não dispara cascade nem callbacks (`@PreUpdate`).

---

## 4. Projections — não carregue a entidade inteira para ler

```java
// 1) INTERFACE-BASED (closed projection): o Spring gera o SELECT só das colunas usadas
public interface ResumoConta {
    String getTitular();
    BigDecimal getSaldo();
}
List<ResumoConta> findByStatus(Status status);      // SELECT titular, saldo FROM conta ...

// 2) DTO / CLASS-BASED via constructor expression
@Query("SELECT new com.fiap.banking.dto.ResumoContaDto(c.titular, c.saldo) FROM ContaEntity c")
List<ResumoContaDto> buscarResumo();

// 3) RECORD como projeção (Spring Data 3+ aceita direto)
public record ResumoContaDto(String titular, BigDecimal saldo) { }

// 4) DYNAMIC projection: o mesmo método serve para vários formatos
<T> List<T> findByStatus(Status status, Class<T> tipo);
```

**Por que importa:** a entidade completa traz todas as colunas (inclusive `@Lob`), entra no persistence context, consome memória e paga **dirty checking** no fim da transação. Em consulta de leitura, projeção é mais rápida e mais segura — e nada volta gerenciado, então não há risco de alteração acidental.

⚠️ **Open projection** (com `@Value("#{target.x + target.y}")`) **carrega a entidade inteira** por trás — perde todo o benefício.

---

## 5. Paginação e ordenação

```java
Page<ContaEntity> findByStatus(Status status, Pageable pageable);
Slice<ContaEntity> findByTitularContaining(String t, Pageable pageable);

var pageable = PageRequest.of(0, 20, Sort.by("criadoEm").descending());
Page<ContaEntity> page = repository.findByStatus(ATIVA, pageable);

page.getTotalElements();   // ⚠️ exige um SELECT count(*) EXTRA
page.getContent();
```

| | `Page<T>` | `Slice<T>` | `List<T>` |
|---|---|---|---|
| Queries | **2** (dados + `count`) | 1 (busca `size + 1`) | 1 |
| Sabe o total | ✅ | ❌ só "tem próxima?" | ❌ |
| Uso | tela com "página 7 de 42" | scroll infinito | quando você já limitou |

O `count` extra numa tabela grande com filtro pouco seletivo pode custar mais que a própria consulta. Se a tela não mostra o total, use `Slice`. Para base muito grande, **keyset pagination**. → [Evolução da API](../spring-mvc-apis-restful/iv-evolucao-da-api.md) · [ÍNDICE](../fundamentos-de-modelagem-de-dados/indice.md)

---

## 6. O problema N+1 — o mais importante da matéria

```java
List<ContaEntity> contas = repository.findAll();          // 1 query: SELECT * FROM conta
for (ContaEntity c : contas) {
    System.out.println(c.getCliente().getNome());          // +1 query POR conta
}
// 100 contas → 101 queries
```

Cada acesso ao proxy LAZY dispara um `SELECT`. Com 100 linhas e 5ms de ida e volta, são **500ms gastos em latência de rede**, não em banco. E o efeito é invisível em desenvolvimento com 3 registros — só aparece em produção.

**As fontes clássicas:** iterar sobre coleção acessando o lado LAZY; serializar entidade para JSON com OSIV ligado; `@ManyToOne` EAGER (que gera N+1 já no `findAll`).

### Como detectar

```yaml
spring:
  jpa:
    show-sql: true                       # imprime o SQL (só para dev)
    properties:
      hibernate:
        format_sql: true
        generate_statistics: true        # ⭐ loga quantas queries a sessão executou
logging:
  level:
    org.hibernate.SQL: DEBUG
    org.hibernate.orm.jdbc.bind: TRACE   # mostra os parâmetros
```

`generate_statistics` é o melhor sinal: se um endpoint reporta `142 statements`, você tem N+1. Ferramentas dedicadas: **datasource-proxy**, **p6spy**, ou um teste que **falha** quando o número de queries passa de um limite.

### As soluções

```java
// 1) JOIN FETCH — traz tudo numa query só
@Query("SELECT c FROM ContaEntity c JOIN FETCH c.cliente WHERE c.status = :status")
List<ContaEntity> buscarComCliente(@Param("status") Status status);

// 2) @EntityGraph — declarativo, funciona com derived queries e com Pageable
@EntityGraph(attributePaths = {"cliente", "transacoes"})
List<ContaEntity> findByStatus(Status status);

// 3) @BatchSize — não elimina o N+1, mas transforma N queries em N/size
@BatchSize(size = 25)
@OneToMany(mappedBy = "conta")
private List<Transacao> transacoes;    // 100 acessos → 4 queries com IN (...)

// 4) Projeção para DTO com join — nem cria entidade
@Query("SELECT new ...ResumoDto(c.titular, cl.nome) FROM ContaEntity c JOIN c.cliente cl")
List<ResumoDto> resumo();
```

| Solução | Quando |
|---|---|
| `JOIN FETCH` | você controla a query e sabe o que precisa |
| `@EntityGraph` | quer manter derived query / precisa combinar com `Pageable` |
| `@BatchSize` | a associação é acessada às vezes; reduz o estrago globalmente |
| Projeção DTO | leitura pura — a melhor opção para tela |

### Duas pegadinhas de `JOIN FETCH`

**a) `MultipleBagFetchException`** — dois `JOIN FETCH` de coleções `List` na mesma query:

```java
// 💥 org.hibernate.loader.MultipleBagFetchException: cannot simultaneously fetch multiple bags
@Query("SELECT p FROM Pedido p JOIN FETCH p.itens JOIN FETCH p.pagamentos")
```
O produto cartesiano tornaria impossível saber quantas linhas pertencem a cada coleção. Saídas: trocar `List` por **`Set`**, ou fazer **duas queries** (a segunda aproveita o cache L1 e "completa" as entidades já carregadas), ou usar `@BatchSize`.

**b) `JOIN FETCH` + paginação = paginação em memória**

```
HHH000104: firstResult/maxResults specified with collection fetch; applying in memory
```

O Hibernate **traz todas as linhas para a memória** e pagina lá — com 1 milhão de registros, é `OutOfMemoryError`. Com `@EntityGraph` e `@ManyToOne` não há problema; o conflito é com **coleção**. Saída: paginar os ids numa query e buscar os detalhes numa segunda (`WHERE id IN (...)`).

---

## 7. Inserção em lote

```yaml
spring:
  jpa:
    properties:
      hibernate:
        jdbc.batch_size: 50
        order_inserts: true
        order_updates: true
        batch_versioned_data: true
```

> ⚠️ **`GenerationType.IDENTITY` desabilita o batch de `INSERT`.** O Hibernate precisa do id gerado imediatamente após cada linha, então não consegue agrupar. Para carga em massa, use `SEQUENCE` com `allocationSize` (ex.: 50). É a pergunta de performance mais comum sobre JPA.

Em lote grande, faça `flush()` + `clear()` a cada N registros — senão o persistence context cresce indefinidamente e você toma `OutOfMemoryError`. E para carga realmente pesada (milhões de linhas), JPA não é a ferramenta: use `JdbcTemplate`, `COPY` ou o utilitário de bulk load do banco.

---

## 8. Consultas dinâmicas: Specification

Quando o filtro é montado em runtime (tela de busca com 8 campos opcionais), derived query não serve — seriam 2⁸ métodos.

```java
public interface ContaRepository extends JpaRepository<ContaEntity, Long>,
                                          JpaSpecificationExecutor<ContaEntity> { }

public class ContaSpecs {
    public static Specification<ContaEntity> comStatus(Status status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }
    public static Specification<ContaEntity> saldoAcimaDe(BigDecimal valor) {
        return (root, query, cb) -> valor == null ? null : cb.greaterThan(root.get("saldo"), valor);
    }
}

// compõe só o que veio preenchido — null é ignorado
repository.findAll(ContaSpecs.comStatus(filtro.status())
                  .and(ContaSpecs.saldoAcimaDe(filtro.saldoMinimo())), pageable);
```

Specification é a **Criteria API** com açúcar — e é o padrão [Specification/Composite](../design-patterns-em-oo/ii-padroes-estruturais.md) na prática. Alternativas: **QueryDSL** (mais legível, exige geração de código) ou montar JPQL dinâmico na mão (evite: propenso a SQL injection e a erro de sintaxe).

---

## 9. Checklist de performance

- [ ]  Nenhum `FetchType.EAGER` nas entidades
- [ ]  `open-in-view: false`
- [ ]  Consulta de listagem usa **projeção**, não entidade
- [ ]  Toda iteração sobre associação tem `JOIN FETCH` ou `@EntityGraph`
- [ ]  `generate_statistics` conferido nos endpoints principais
- [ ]  Paginação com `size` máximo; `Slice` quando o total não é exibido
- [ ]  `@Transactional(readOnly = true)` nas leituras
- [ ]  Colunas de `WHERE`/`JOIN`/`ORDER BY` indexadas
- [ ]  Batch configurado e PK por `SEQUENCE` onde há carga em massa
- [ ]  `@Modifying` com `clearAutomatically` quando faz update em massa
- [ ]  Sem `JOIN FETCH` de coleção junto com `Pageable`

---

## Perguntas para autoavaliação

1. Como o Spring Data implementa um repositório que você só declarou como interface?
2. Qual a vantagem de estender `Repository` em vez de `JpaRepository`?
3. Quando parar de usar derived query e partir para `@Query`?
4. Diferencie JPQL de SQL nativo em portabilidade e validação.
5. Por que `@Modifying` precisa de `clearAutomatically`?
6. Cite três motivos para usar projeção em vez de carregar a entidade.
7. `Page` × `Slice`: qual o custo extra e quando ele se justifica?
8. Explique o N+1 com um exemplo e diga por que ele não aparece em desenvolvimento.
9. Como detectar N+1 sem ler o log linha a linha?
10. Compare `JOIN FETCH`, `@EntityGraph` e `@BatchSize`.
11. O que é `MultipleBagFetchException` e como resolvê-la?
12. Por que `JOIN FETCH` com `Pageable` é perigoso?
13. Por que `IDENTITY` impede o batch insert?
14. Quando usar Specification em vez de derived query?

---

> [← Voltar para SPRING DATA JPA](README.md) · Anterior: [I - PERSISTENCE CONTEXT](i-persistence-context-e-ciclo-de-vida.md) · Próximo: [III - TRANSAÇÕES E CONCORRÊNCIA](iii-transacoes-e-concorrencia.md)
