# RESUMO DE PROVA

Arquivo de **véspera**: densidade máxima, sem explicação longa. Cada linha aponta para o material completo. Se algo aqui não fizer sentido de imediato, é exatamente o que você precisa revisar.

**Índice:** [Pegadinhas](#as-20-pegadinhas) · [Tabelas](#tabelas-de-véspera) · [Definições](#definições-em-uma-linha) · [Por matéria](#por-matéria) · [Conexões](#mapa-de-conexões)

---

## As 20 pegadinhas

As afirmações **erradas** que mais aparecem em prova — e a correção.

| # | ❌ O erro | ✅ O correto |
|---|---|---|
| 1 | "CAP: escolha 2 de 3" | P **não é opcional**; a escolha é C **ou** A **durante a partição** |
| 2 | "O C de ACID é o C de CAP" | ACID: integridade de restrições. CAP: **linearizabilidade** entre réplicas |
| 3 | "OCP: adicione funcionalidade na classe existente" | estenda criando **nova implementação**; não toque no que já funciona |
| 4 | "Quadrado é um Retângulo, então pode herdar" | viola **LSP**: quebra a expectativa de quem programou contra a base |
| 5 | "`@Transactional` faz rollback em qualquer exceção" | só em **unchecked**; checked **commita** (use `rollbackFor`) |
| 6 | "`this.metodoTransacional()` abre transação" | chamada interna **não passa pelo proxy** → anotação ignorada |
| 7 | "Driver `host` do Docker não tem internet" | **tem**; quem não tem rede é o **`none`** |
| 8 | "`docker container ls -la` lista todos" | é `-a`; `-l` é *latest* |
| 9 | "100% de cobertura = suíte boa" | cobertura mede **execução**, não verificação (teste sem assert cobre tudo) |
| 10 | "`DELETE` não é idempotente porque o 2º dá 404" | idempotência é sobre **efeito**, não resposta |
| 11 | "Erro de validação de negócio é 400" | 400 = sintaxe; **422** = semântica/regra de negócio |
| 12 | "401 = sem permissão" | 401 = **não autenticado**; 403 = autenticado **sem permissão** |
| 13 | "`no-cache` proíbe cache" | proíbe **usar sem revalidar**; quem proíbe armazenar é **`no-store`** |
| 14 | "GraphQL com erro devolve 4xx/5xx" | devolve **200** com array `errors` (admite resultado parcial) |
| 15 | "proto3 distingue campo ausente de zero" | **não** distingue; use `optional` ou wrapper types |
| 16 | "`EnumType.ORDINAL` é equivalente a STRING" | ORDINAL grava a **posição**: inserir valor no meio corrompe os dados |
| 17 | "`@ManyToOne` é LAZY por padrão" | é **EAGER** (fonte de N+1); declare `LAZY` |
| 18 | "`save()` é obrigatório para atualizar" | entidade **managed** salva por **dirty checking** no commit |
| 19 | "View nunca aceita `INSERT`/`UPDATE`" | view **simples** costuma aceitar; complexa é somente leitura |
| 20 | "Sobrecarga é resolvida em runtime" | sobrecarga: **compilação** (tipo declarado). Sobrescrita: **runtime** (tipo real) |

**Bônus:** `assertEquals(new BigDecimal("70.00"), new BigDecimal("70.0"))` **falha** (`equals` compara escala) · `Integer.valueOf(127) == Integer.valueOf(127)` é `true`, com 128 é `false` (cache flyweight) · `catch (Exception)` antes de `catch (IOException)` **não compila** · `return` no `finally` **engole** a exceção · `ddl-auto: update` **nunca** em produção.

---

## Tabelas de véspera

### Verbos HTTP

| Método | Seguro | Idempotente | Cacheável |
|---|:---:|:---:|:---:|
| GET / HEAD | ✅ | ✅ | ✅ |
| OPTIONS | ✅ | ✅ | ❌ |
| POST | ❌ | ❌ | raro |
| PUT | ❌ | ✅ | ❌ |
| PATCH | ❌ | ❌* | ❌ |
| DELETE | ❌ | ✅ | ❌ |

### Status codes que caem

`201` criado + `Location` · `202` aceito, assíncrono · `204` sem corpo · `304` cache válido · `400` sintaxe · `401` não autenticado · `403` sem permissão · `404` não existe · `409` conflito · `415` media type errado · `422` regra de negócio · `429` rate limit + `Retry-After` · `500` bug seu · `503` indisponível.

### Isolamento × anomalias

| Nível | Dirty read | Non-repeatable | Phantom |
|---|:---:|:---:|:---:|
| Read Uncommitted | permite | permite | permite |
| Read Committed *(padrão PG/Oracle/SQL Server)* | impede | permite | permite |
| Repeatable Read *(padrão MySQL)* | impede | impede | permite* |
| Serializable | impede | impede | impede |

### Formas normais

| FN | Elimina |
|---|---|
| 1FN | atributo não atômico / grupo repetitivo |
| 2FN | dependência **parcial** da chave composta |
| 3FN | dependência **transitiva** |
| BCNF | determinante que não é superchave |

*"cada atributo depende da chave, da chave inteira e de nada além da chave"*

### Design Patterns — reconhecimento rápido

| Enunciado | Padrão |
|---|---|
| instância única | Singleton |
| subclasse decide o que criar | Factory Method |
| família consistente de produtos | Abstract Factory |
| muitos parâmetros opcionais | Builder |
| criar copiando | Prototype |
| interfaces incompatíveis | Adapter |
| duas hierarquias independentes | Bridge |
| árvore parte-todo | Composite |
| somar comportamento empilhável | Decorator |
| simplificar subsistema | Facade |
| muitos objetos iguais na memória | Flyweight |
| controlar acesso (lazy/segurança/cache) | Proxy |
| passa adiante até alguém tratar | Chain of Responsibility |
| requisição como objeto, undo/fila | Command |
| percorrer sem expor estrutura | Iterator |
| centralizar comunicação | Mediator |
| snapshot sem violar encapsulamento | Memento |
| notificar interessados | Observer |
| comportamento muda com o estado | State |
| algoritmos intercambiáveis | Strategy |
| esqueleto fixo, passos variáveis | Template Method |
| nova operação sem alterar classes | Visitor |

**Pares que confundem:** Strategy (cliente escolhe) × State (objeto transiciona) · Decorator (acrescenta, empilha) × Proxy (controla acesso) · Adapter (converte existente) × Facade (cria interface nova) · Factory Method (um produto, herança) × Abstract Factory (família, composição) · Template Method (herança) × Strategy (composição).

### SOLID

| | Princípio | Violação típica |
|---|---|---|
| S | uma razão para mudar | God Class |
| O | aberto p/ extensão, fechado p/ modificação | `switch` que cresce |
| L | subtipo substitui o tipo base | `UnsupportedOperationException` |
| I | não depender do que não usa | interface gorda |
| D | depender de abstração | `new` de infra na regra |

### REST × gRPC × GraphQL

| | REST | gRPC | GraphQL |
|---|---|---|---|
| Formato | JSON | Protobuf binário | JSON |
| Transporte | HTTP/1.1+ | **HTTP/2** | HTTP (1 endpoint) |
| Contrato | opcional | `.proto` obrigatório | schema obrigatório |
| Quem define a resposta | servidor | servidor | **cliente** |
| Cache HTTP | ✅ | ❌ | ❌ |
| Streaming | limitado | ✅ bidirecional | subscriptions |
| Erro | status HTTP | 17 códigos | **sempre 200** |

### Pirâmide de testes

Unitário (70%, ms, isolado) → Integração (20%) → E2E (10%, lento, frágil). Anti-padrões: **cone de sorvete** (tudo E2E), **ampulheta** (sem integração).

### Test doubles

Dummy (só preenche) · Fake (implementação simplificada) · Stub (responde) · Spy (registra) · Mock (**cobra** a interação).

### Docker

VM virtualiza **hardware**; container virtualiza **S.O.** (kernel compartilhado). Namespaces = isolamento · cgroups = limite · union fs = camadas. `CMD` (padrão substituível) × `ENTRYPOINT` (executável fixo). Forma **exec** `["java","-jar"]` para receber SIGTERM.

---

## Definições em uma linha

**ACID** Atomicidade, Consistência, Isolamento, Durabilidade · **BASE** Basically Available, Soft state, Eventual consistency · **CAP** Consistency, Availability, Partition tolerance · **PACELC** se Partição → A ou C; senão → Latência ou Consistência · **SOLID** SRP, OCP, LSP, ISP, DIP · **GoF** Gang of Four, 23 padrões, 1994 · **DRY/KISS/YAGNI** não repita conhecimento / simples / não antecipe · **TDD** Red-Green-Refactor · **BDD** Given-When-Then · **AAA** Arrange-Act-Assert · **FIRST** Fast, Independent, Repeatable, Self-validating, Timely · **REST** estilo arquitetural de Fielding (2000), 6 restrições · **HATEOAS** nível 3 de Richardson · **RPC** chamada remota como se fosse local · **ORM** mapeamento objeto-relacional · **JPA** especificação · **Hibernate** implementação · **N+1** 1 consulta + 1 por item · **OSIV** Open Session In View · **MVCC** versões concorrentes sem bloqueio · **OCI** padrão aberto de imagem/runtime · **12 fatores** config no ambiente, stateless, log em stdout, descartabilidade.

---

## Por matéria

### [Clean Architecture](clean-architecture/README.md)
Entities → Use Cases → Interface Adapters → Frameworks. **Regra da Dependência: setas apontam para dentro.** Fluxo de controle vai para fora; a dependência é invertida por **Input/Output Ports** (DIP). Não é framework, não é estrutura de pastas, não obriga 4 camadas. Sinal de falso: `@Entity` no domínio, use case recebendo `HttpServletRequest`.

### [SOLID](solid/README.md)
LSP: pré-condição não pode ser **fortalecida**, pós-condição não **enfraquecida**, invariante preservado. DIP: a interface pertence ao **módulo de alto nível**. DIP ≠ injeção de dependência (princípio × técnica).

### [Design Patterns](design-patterns-em-oo/README.md)
Criacionais 5 · Estruturais 7 · Comportamentais 11. `volatile` obrigatório no double-checked locking. Singleton do Spring ≠ do GoF. **Proxy explica `@Transactional`, `@Cacheable`, `@PreAuthorize`** — e a pegadinha da chamada interna.

### [POO](poo/README.md)
Abstração, encapsulamento, herança, polimorfismo. Getter/setter público **não é** encapsulamento. `equals` ⇒ mesmo `hashCode` (a recíproca não vale). Herança acopla em compilação; composição troca em runtime. Checked = compilador exige; unchecked = erro de programação.

### [Testes](testes-em-software/README.md)
TDD é técnica de **design**. Cobertura mede execução; **mutation score** mede detecção. `@WebMvcTest` prova o contrato da API; `@DataJpaTest` esconde `LazyInitializationException` (transação aberta). Cada `@MockitoBean` cria um **contexto novo** (suíte lenta).

### [Spring MVC / REST](spring-mvc-apis-restful/README.md)
6 restrições (só *code on demand* é opcional); stateless é a mais violada. Richardson 0–3; mercado para no 2. DispatcherServlet → HandlerMapping → HandlerAdapter → Converter. `@Valid` no body / `@Validated` na classe. `ProblemDetail` = RFC 9457. **Exceção em filtro não cai no `@RestControllerAdvice`.**

### [gRPC e GraphQL](grpc-e-graphql/README.md)
Field number nunca se reutiliza (use `reserved`); renomear é seguro. 4 padrões: unary, server/client streaming, bidirecional. GraphQL: resolver chain → **N+1** → **DataLoader**. Sem versionamento: evolui com `@deprecated`. Riscos: depth attack, introspecção, rate limit por custo.

### [Spring Security](spring-security/README.md)
401 ≠ 403. Senha com **KDF lento** (bcrypt/Argon2), nunca SHA. JWT stateless → revogação é o problema. `hasRole("X")` = authority `ROLE_X`. CSRF só importa com cookie de sessão.

### [Spring Data JPA](spring-data-jpa/README.md)
Estados: transient → managed → detached → removed. **Dirty checking** salva sem `save()`. `merge` devolve **outra** instância. N+1: `JOIN FETCH` / `@EntityGraph` / `@BatchSize`. `JOIN FETCH` + `Pageable` = paginação em memória. `IDENTITY` mata o batch insert. `@Version` = otimista; `FOR UPDATE` = pessimista.

### [Modelagem de Dados](fundamentos-de-modelagem-de-dados/README.md)
Conceitual → lógico → físico. `UNIQUE` na FK transforma 1:N em **1:1**. FK sempre no lado "muitos". Índice: custa escrita e disco; **seletividade** baixa = inútil; **prefixo mais à esquerda**; função na coluna mata o índice. `LEFT JOIN` com filtro no `WHERE` vira `INNER`.

### [Teorema CAP](teorema-cap/README.md)
CP recusa; AP responde desatualizado; "CA" = não distribuído. PACELC cobre o tempo sem partição (Latência × Consistência). Quórum: **R + W > N**.

### [Docker](docker/README.md)
Container = processo isolado, não VM leve. Camadas + copy-on-write; ordem das instruções = cache. Multi-stage: 700 MB → 200 MB. `depends_on` sozinho não espera ficar **pronto** (`condition: service_healthy`). Liveness (reiniciar?) × readiness (mandar tráfego?).

---

## Mapa de conexões

Perguntas dissertativas adoram **cruzar** matérias. As pontes que existem no material:

| Ponte | Conexão |
|---|---|
| **SOLID → Design Patterns** | OCP se materializa em Strategy; DIP em Abstract Factory |
| **SOLID → Clean Architecture** | a Regra da Dependência **é** o DIP nas fronteiras |
| **Clean Arch → Testes** | port mockável = use case testável sem Spring nem banco |
| **Design Patterns → Spring** | Proxy explica `@Transactional`/`@Cacheable`/`@PreAuthorize` e a chamada interna |
| **POO → JPA** | `equals`/`hashCode` em entidade; proxy LAZY e `getClass()` |
| **POO → JPA/Spring** | checked exception **não** faz rollback; por isso domínio usa unchecked |
| **Modelagem → JPA** | índice, seletividade e `EXPLAIN` explicam por que a query do repositório está lenta |
| **ACID → CAP → NoSQL** | isolamento local × consistência distribuída × BASE |
| **CAP → REST** | idempotência, retry e Saga existem porque a rede falha |
| **REST → GraphQL/gRPC** | mesma necessidade, três contratos diferentes |
| **JPA → REST** | N+1 e `LazyInitializationException` aparecem ao serializar entidade no controller |
| **Docker → 12 fatores** | stateless e config no ambiente ligam container a arquitetura |

---

**Como usar na véspera:** leia as **20 pegadinhas** e as **tabelas**; para cada matéria, responda mentalmente às perguntas do arquivo correspondente. Onde travar, abra o material — os links estão em cada seção.
