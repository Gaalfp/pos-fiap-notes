# II - QUARKUS NA PRÁTICA

> [← Voltar para QUARKUS](README.md) · Anterior: [I - COMO FUNCIONA](i-como-funciona.md) · Próximo: [III - QUARKUS × SPRING](iii-quarkus-x-spring.md)

## 1. Criando e estruturando o projeto

Três caminhos para começar, todos equivalentes: o site **code.quarkus.io** (o "Spring Initializr" do Quarkus), o **plugin Maven** ou a **CLI**.

```bash
# CLI (instalável via SDKMAN, Homebrew ou JBang)
quarkus create app br.com.exemplo:pedidos \
  --extension='rest-jackson,hibernate-orm-panache,jdbc-postgresql'
cd pedidos
quarkus dev
```

```bash
# sem instalar a CLI, só com Maven
./mvnw quarkus:add-extension -Dextensions='messaging-kafka'
./mvnw quarkus:dev
./mvnw package                      # modo JVM  → target/quarkus-app/quarkus-run.jar
./mvnw package -Dnative             # nativo    → binário do SO
```

A estrutura é a de um projeto Maven comum — **não existe anotação de classe principal** como `@SpringBootApplication`: o ponto de entrada é gerado no build.

```
src/
├── main/
│   ├── java/br/com/exemplo/
│   │   ├── api/          PedidoResource.java      ← camada web (Jakarta REST)
│   │   ├── domain/       Pedido.java              ← entidade / regra
│   │   ├── service/      PedidoService.java
│   │   └── infra/        PedidoRepository.java
│   ├── resources/
│   │   └── application.properties                 ← configuração única, com perfis
│   └── docker/
│       ├── Dockerfile.jvm                         ← já vêm gerados
│       └── Dockerfile.native
└── test/java/...
```

No `pom.xml`, o que importa é o **BOM da plataforma** (`quarkus-bom`), que fixa as versões de **todas** as extensões de forma coerente, e o `quarkus-maven-plugin`, que é quem executa a augmentação no `package`.

> A arquitetura de pastas acima é a convencional, mas nada impede aplicar [CLEAN ARCHITECTURE](../clean-architecture/README.md) aqui: o Quarkus não impõe camadas — `@ApplicationScoped` numa classe de caso de uso funciona exatamente como se espera.

---

## 2. Endpoint REST

A API é **Jakarta REST** (o antigo JAX-RS), implementada pela extensão `quarkus-rest` (chamada `quarkus-resteasy-reactive` nas versões anteriores da linha 3.x).

```java
@Path("/pedidos")                                   // ~ @RequestMapping
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PedidoResource {

    @Inject
    PedidoService service;

    @GET                                            // ~ @GetMapping
    public List<PedidoResponse> listar(@QueryParam("status") String status,
                                       @QueryParam("page") @DefaultValue("0") int page) {
        return service.listar(status, page);
    }

    @GET
    @Path("/{id}")
    public PedidoResponse buscar(@PathParam("id") Long id) {    // ~ @PathVariable
        return service.buscar(id);                              // lança NotFoundException → 404
    }

    @POST
    public Response criar(@Valid CriarPedidoRequest request, @Context UriInfo uriInfo) {
        Pedido pedido = service.criar(request);
        URI location = uriInfo.getAbsolutePathBuilder().path(pedido.id.toString()).build();
        return Response.created(location).build();              // 201 + header Location
    }

    @DELETE
    @Path("/{id}")
    public Response cancelar(@PathParam("id") Long id) {
        service.cancelar(id);
        return Response.noContent().build();                    // 204
    }
}
```

| Spring MVC | Jakarta REST |
|---|---|
| `@RestController` | *nada* — a classe com `@Path` já é um recurso |
| `@RequestMapping("/pedidos")` | `@Path("/pedidos")` |
| `@GetMapping` / `@PostMapping` | `@GET` / `@POST` + `@Path` |
| `@PathVariable` | `@PathParam` |
| `@RequestParam` | `@QueryParam` |
| `@RequestBody` | *nada* — o parâmetro sem anotação **é** o corpo |
| `@RequestHeader` | `@HeaderParam` |
| `ResponseEntity<T>` | `Response` ou `RestResponse<T>` |
| `@ResponseStatus` | `Response.status(...)` |

Os fundamentos de REST — verbos, idempotência, status codes, modelagem de URI — são os mesmos e estão em [FUNDAMENTOS REST](../spring-mvc-apis-restful/ii-fundamentos-rest.md). O que muda aqui é só o dialeto de anotações.

**Cliente HTTP** (o equivalente ao `RestClient`/Feign) é o MicroProfile Rest Client — uma interface declarativa:

```java
@RegisterRestClient(configKey = "pagamentos-api")
public interface PagamentosClient {
    @POST @Path("/cobrancas")
    CobrancaResponse cobrar(CobrancaRequest request);
}
```
```properties
quarkus.rest-client.pagamentos-api.url=https://api.exemplo.com
```

---

## 3. CDI na prática

```java
@ApplicationScoped
public class PedidoService {

    @Inject PedidoRepository repository;
    @Inject Event<PedidoCriado> eventos;              // evento CDI, em processo

    @Transactional                                    // jakarta.transaction.Transactional
    public Pedido criar(CriarPedidoRequest request) {
        Pedido pedido = Pedido.de(request);
        repository.persist(pedido);
        eventos.fire(new PedidoCriado(pedido.id));    // observadores reagem
        return pedido;
    }
}

@ApplicationScoped
public class NotificadorDePedido {
    void ao(@Observes PedidoCriado evento) { /* ... */ }   // ~ @EventListener
}
```

**Produzindo um bean** a partir de configuração (o equivalente ao `@Bean` numa `@Configuration`):

```java
@ApplicationScoped
public class ClientesConfig {

    @Produces                                         // ~ @Bean
    @ApplicationScoped
    public GatewayPagamento gateway(@ConfigProperty(name = "gateway.chave") String chave) {
        return new GatewayPagamento(chave);
    }
}
```

| Recurso | Spring | Quarkus (CDI) |
|---|---|---|
| Bean de serviço | `@Service`, `@Component` | `@ApplicationScoped` |
| Injeção | `@Autowired` | `@Inject` |
| Bean de fábrica | `@Bean` em `@Configuration` | `@Produces` |
| Vários candidatos | `@Qualifier`, `@Primary` | `@Named`, qualificador próprio, `@Default` |
| Evento em processo | `ApplicationEventPublisher` + `@EventListener` | `Event<T>` + `@Observes` |
| Interceptação | AOP (`@Around`) | `@Interceptor` + `@InterceptorBinding` |
| Ciclo de vida | `@PostConstruct`, `@PreDestroy` | **os mesmos** (são do Jakarta) |
| No start da aplicação | `ApplicationRunner` | `@Observes StartupEvent` |

---

## 4. Configuração e perfis

Um arquivo só — `application.properties` (ou `application.yaml` com a extensão `quarkus-config-yaml`) — com **perfis embutidos por prefixo**:

```properties
# valor padrão (todos os perfis)
quarkus.http.port=8080
pedido.limite-itens=50

# só em dev
%dev.quarkus.hibernate-orm.log.sql=true
%dev.quarkus.log.category."br.com.exemplo".level=DEBUG

# só em test
%test.pedido.limite-itens=5

# só em prod
%prod.quarkus.datasource.jdbc.url=${DB_URL}
%prod.quarkus.datasource.password=${DB_PASSWORD}
```

Os três perfis são automáticos: **`dev`** (`quarkus:dev`), **`test`** (durante os testes) e **`prod`** (o artefato empacotado). A ordem de precedência vai de variável de ambiente (maior) até o `application.properties` (menor), passando por `.env` e propriedades de sistema.

Lendo configuração no código:

```java
// valor isolado
@ConfigProperty(name = "pedido.limite-itens", defaultValue = "50")
int limiteItens;
```

```java
// grupo tipado e validado — o equivalente ao @ConfigurationProperties
@ConfigMapping(prefix = "pedido")
public interface PedidoConfig {
    @WithDefault("50") int limiteItens();
    Optional<String> webhook();
    Retentativa retentativa();

    interface Retentativa { int maximo(); Duration espera(); }
}
```

> **A pegadinha que vale a prova:** no Quarkus existem propriedades de **build time** e de **runtime**. `quarkus.datasource.db-kind`, por exemplo, é fixada na compilação — passar por variável de ambiente em produção **não tem efeito**; é preciso reconstruir. A documentação marca cada propriedade, e a razão está no [capítulo I](i-como-funciona.md#1-as-três-fases-build-static-init-e-runtime-init). No Spring, **tudo** é runtime — essa categoria de erro não existe lá.

---

## 5. Persistência com Hibernate e Panache

Por baixo é **Hibernate ORM** com JPA, igual ao que está em [SPRING DATA JPA](../spring-data-jpa/README.md) — persistence context, estados da entidade, `flush`, LAZY × EAGER, N+1: **tudo vale aqui**. O que o **Panache** adiciona é uma camada de conveniência, em dois estilos.

**Estilo *active record*** — a entidade tem os métodos de consulta:

```java
@Entity
public class Pedido extends PanacheEntity {        // id Long gerado, herdado

    @Column(nullable = false) public String cliente;
    @Enumerated(EnumType.STRING) public StatusPedido status;
    public BigDecimal total;

    // consultas como métodos estáticos do próprio domínio
    public static List<Pedido> doCliente(String cliente) {
        return list("cliente", cliente);           // "from Pedido where cliente = ?1"
    }

    public static List<Pedido> pendentesPaginado(int pagina) {
        return find("status", StatusPedido.PENDENTE)
                .page(Page.of(pagina, 20))
                .list();
    }
}
```

**Estilo repositório** — para quem quer a entidade limpa (e é o que combina com [CLEAN ARCHITECTURE](../clean-architecture/README.md)):

```java
@ApplicationScoped
public class PedidoRepository implements PanacheRepository<Pedido> {

    public List<Pedido> pendentesDoCliente(String cliente) {
        return list("cliente = ?1 and status = ?2", cliente, StatusPedido.PENDENTE);
    }
}
```

| Spring Data JPA | Panache |
|---|---|
| `JpaRepository<T, ID>` | `PanacheRepository<T>` (ou `PanacheRepositoryBase<T, ID>`) |
| *derived query* (`findByClienteAndStatus`) | string de consulta curta: `list("cliente = ?1 and status = ?2", ...)` |
| `@Query("...")` | `find("...")`, `list("...")`, `count("...")` |
| `Pageable` / `Page<T>` | `Page.of(n, tam)` + `.page(...)` |
| `Sort` | `Sort.by("campo")` |
| `save()` | `persist()` |
| `@Transactional` do Spring | `@Transactional` do Jakarta |

Os campos públicos nas entidades Panache **não** são um vazamento de encapsulamento acidental: o Quarkus gera *getters* e *setters* no bytecode durante a augmentação e reescreve os acessos. Ainda assim, entidade pública exposta direto na API continua sendo erro de projeto — **DTO na borda** vale aqui igual ao que está em [DTOs](../spring-mvc-apis-restful/iii-spring-mvc-na-pratica.md#3-dtos--e-por-que-nunca-expor-a-entidade-jpa).

**Migrations** entram por `quarkus-flyway` ou `quarkus-liquibase`, com o mesmo princípio de sempre: o esquema é código versionado, nunca `hibernate.hbm2ddl` em produção. → [Migrations](../spring-data-jpa/iii-transacoes-e-concorrencia.md#10-migrations--o-esquema-também-é-código)

---

## 6. Validação e tratamento de erro

Bean Validation é padrão Jakarta — as anotações são **as mesmas** do Spring (extensão `quarkus-hibernate-validator`):

```java
public record CriarPedidoRequest(
    @NotBlank String cliente,
    @NotEmpty @Valid List<ItemRequest> itens,
    @Positive BigDecimal total
) {}
```

Com `@Valid` no parâmetro do recurso, uma violação devolve **400** automaticamente, com o corpo listando as violações.

Para erro de negócio, o padrão é um `ExceptionMapper` — o equivalente ao `@RestControllerAdvice`:

```java
@Provider
public class LimiteExcedidoMapper implements ExceptionMapper<LimiteExcedidoException> {

    @Override
    public Response toResponse(LimiteExcedidoException e) {
        return Response.status(422)
                .entity(new ErroResponse("LIMITE_EXCEDIDO", e.getMessage()))
                .build();
    }
}
```

O formato padronizado de erro (RFC 9457, *Problem Details*) é o mesmo assunto discutido em [tratamento de erros](../spring-mvc-apis-restful/iii-spring-mvc-na-pratica.md#5-tratamento-de-erros); no Quarkus ele pode ser montado à mão no `ExceptionMapper` ou vir de extensões dedicadas da comunidade — não é um `ProblemDetail` pronto do framework como no Spring 6.

**Resiliência** vem do MicroProfile Fault Tolerance, com os padrões de [RESILIÊNCIA](../arquitetura-distribuida/iv-resiliencia.md) como anotações:

```java
@Retry(maxRetries = 3, delay = 200)
@Timeout(2000)
@CircuitBreaker(requestVolumeThreshold = 10, failureRatio = 0.5, delay = 5000)
@Fallback(fallbackMethod = "cobrancaIndisponivel")
public CobrancaResponse cobrar(CobrancaRequest req) { return client.cobrar(req); }
```

---

## 7. Mensageria

A extensão é o **SmallRye Reactive Messaging**, com conectores para Kafka, AMQP, MQTT, Pulsar e outros. O código fica independente do broker; o broker é escolhido na configuração. → [MENSAGERIA](../mensageria/README.md)

```java
@ApplicationScoped
public class PedidoProcessor {

    @Incoming("pedidos")                      // consome
    @Outgoing("pedidos-validados")            // e publica o retorno
    public PedidoValidado processar(PedidoCriado evento) {
        return validar(evento);
    }

    @Incoming("pedidos-validados")            // só consome
    public void registrar(PedidoValidado evento) { /* ... */ }
}

@ApplicationScoped
public class PedidoPublisher {
    @Inject @Channel("pedidos") Emitter<PedidoCriado> emitter;   // publica sob demanda

    public void publicar(PedidoCriado e) { emitter.send(e); }
}
```

```properties
mp.messaging.incoming.pedidos.connector=smallrye-kafka
mp.messaging.incoming.pedidos.topic=pedidos
mp.messaging.incoming.pedidos.group.id=pedidos-service
mp.messaging.outgoing.pedidos-validados.connector=smallrye-kafka
```

As garantias de entrega, *consumer group*, DLQ e idempotência são as da matéria de mensageria — o framework muda o dialeto, não as regras. → [Padrões de entrega](../mensageria/iii-padroes-de-entrega.md)

---

## 8. Testes

```java
@QuarkusTest                                   // sobe a aplicação de verdade, perfil "test"
class PedidoResourceTest {

    @InjectMock GatewayPagamento gateway;      // substitui o bean no container (quarkus-junit5-mockito)

    @Test
    void deveCriarPedidoERetornar201() {
        when(gateway.cobrar(any())).thenReturn(aprovado());

        given()
            .contentType(ContentType.JSON)
            .body(new CriarPedidoRequest("ana", List.of(item()), new BigDecimal("10.00")))
        .when()
            .post("/pedidos")
        .then()
            .statusCode(201)
            .header("Location", containsString("/pedidos/"));
    }
}
```

| Papel | Spring | Quarkus |
|---|---|---|
| Teste com a aplicação no ar | `@SpringBootTest` | `@QuarkusTest` |
| Chamada HTTP no teste | `MockMvc` / `WebTestClient` | **RestAssured** (`given().when().then()`) |
| Substituir um bean por mock | `@MockitoBean` (antes `@MockBean`) | `@InjectMock` |
| Configuração específica do teste | `@ActiveProfiles`, `@TestPropertySource` | `@TestProfile` |
| Infra real em container | Testcontainers, manual | **Dev Services**, automático |
| Teste contra o artefato final | — | `@QuarkusIntegrationTest` |

Dois pontos que não têm equivalente direto no mundo Spring:

- **Dev Services nos testes**: a suíte sobe com banco real em container sem uma linha de configuração. O [Testcontainers](../testes-em-software/iii-testes-no-spring.md#5-testcontainers) continua existindo para casos específicos, mas o caso comum já vem resolvido.
- **`@QuarkusIntegrationTest`**: roda a mesma suíte contra o **artefato empacotado** — JAR, binário nativo ou imagem de container. É o que pega os erros que só aparecem no nativo (reflexão não registrada), e por isso deve estar no pipeline de quem publica nativo. → [I - mundo fechado](i-como-funciona.md#4-graalvm-mandrel-e-a-hipótese-do-mundo-fechado)

A pirâmide, o TDD e a estratégia por camada são os de sempre. → [TESTES EM SOFTWARE](../testes-em-software/README.md)

---

## 9. Observabilidade

Tudo fica sob o prefixo **`/q/`**, e as extensões são as implementações MicroProfile:

| Recurso | Extensão | Endpoint |
|---|---|---|
| *Health check* | `quarkus-smallrye-health` | `/q/health`, `/q/health/live`, `/q/health/ready` |
| Métricas | `quarkus-micrometer-registry-prometheus` | `/q/metrics` |
| Documentação da API | `quarkus-smallrye-openapi` | `/q/openapi`, `/q/swagger-ui` |
| Tracing distribuído | `quarkus-opentelemetry` | exporta para o coletor |
| Console de desenvolvimento | (nativo do dev mode) | `/q/dev-ui` |

```java
@Liveness                                        // responde em /q/health/live
@ApplicationScoped
public class FilaHealthCheck implements HealthCheck {
    @Override public HealthCheckResponse call() {
        return HealthCheckResponse.up("fila-de-pedidos");
    }
}
```

Os `/q/health/live` e `/q/health/ready` existem para alimentar exatamente as sondas `livenessProbe` e `readinessProbe` do Kubernetes — é a integração que o Quarkus assume como caso padrão. Os três pilares e a diferença entre as sondas estão em [OBSERVABILIDADE](../arquitetura-distribuida/v-observabilidade.md).

---

## 10. Empacotamento e container

```bash
./mvnw package                                    # fast-jar (padrão): target/quarkus-app/
./mvnw package -Dquarkus.package.jar.type=uber-jar
./mvnw package -Dnative                           # binário nativo (exige GraalVM/Mandrel local)
./mvnw package -Dnative -Dquarkus.native.container-build=true   # nativo sem GraalVM na máquina
```

O `fast-jar` padrão **não** é um JAR único: é uma pasta com `quarkus-run.jar` e as dependências separadas em camadas — formato pensado para o cache de camadas do Docker. Copiar as dependências antes do código da aplicação faz o rebuild da imagem reaproveitar camadas. → [Imagem em camadas](../docker/capitulo-i-introducao-ao-docker.md#4-imagem-em-camadas-e-copy-on-write)

```dockerfile
# multi-stage nativo: o binário não precisa de JRE na imagem final
FROM quay.io/quarkus/ubi-quarkus-mandrel-builder-image:jdk-21 AS build
COPY --chown=quarkus:quarkus . /code
WORKDIR /code
RUN ./mvnw package -Dnative

FROM registry.access.redhat.com/ubi9/ubi-minimal
COPY --from=build /code/target/*-runner /application
EXPOSE 8080
USER 1001
CMD ["/application", "-Dquarkus.http.host=0.0.0.0"]
```

Os `Dockerfile.jvm` e `Dockerfile.native` já vêm gerados em `src/main/docker`. Além deles:

| Extensão | O que faz |
|---|---|
| `quarkus-container-image-jib` | constrói a imagem **sem Docker daemon**, direto do build Maven |
| `quarkus-kubernetes` | **gera** os manifestos (`Deployment`, `Service`, probes) no `package` |
| `quarkus-openshift` | o mesmo, para OpenShift |
| `quarkus-kubernetes-config` | lê `ConfigMap` e `Secret` como fonte de configuração |

Multi-stage build, usuário não-root, imagem mínima e os 12 fatores são as mesmas boas práticas de [ORQUESTRAÇÃO](../docker/capitulo-v-orquestracao-de-containeres.md#5-boas-práticas-de-container-em-produção).

---

## Perguntas para autoavaliação

1. O que o `quarkus-bom` resolve no `pom.xml`?
2. Por que não existe uma anotação equivalente a `@SpringBootApplication`?
3. Faça o de-para das anotações REST: `@RestController`, `@GetMapping`, `@PathVariable`, `@RequestParam`, `@RequestBody`, `@ResponseStatus`.
4. Como se declara o corpo da requisição em Jakarta REST?
5. Qual o equivalente CDI de `@Service`, `@Autowired` e `@Bean`?
6. Como se publica e se observa um evento em processo no CDI?
7. Como funcionam os perfis no `application.properties`? Cite os três automáticos.
8. Qual a diferença entre `@ConfigProperty` e `@ConfigMapping`?
9. O que é uma propriedade de build time e por que ela é uma pegadinha em produção?
10. Diferencie os dois estilos do Panache e diga quando usar cada um.
11. Qual o equivalente Panache de `JpaRepository`, *derived query*, `Pageable` e `save()`?
12. Por que os campos públicos de uma entidade Panache não violam o encapsulamento? Isso autoriza expor a entidade na API?
13. Como se trata erro de negócio em Jakarta REST, e qual o equivalente Spring?
14. Como os padrões de resiliência aparecem no Quarkus?
15. O que `@Incoming`, `@Outgoing` e `Emitter` fazem?
16. Qual o de-para de testes: `@SpringBootTest`, `MockMvc`, `@MockitoBean`, Testcontainers?
17. Para que serve o `@QuarkusIntegrationTest` e por que ele é obrigatório em quem publica nativo?
18. O que há sob o prefixo `/q/` e como isso serve ao Kubernetes?
19. Por que o `fast-jar` não é um JAR único, e que vantagem isso traz na imagem?
20. O que as extensões `jib` e `kubernetes` acrescentam ao `package`?

---

> [← Voltar para QUARKUS](README.md) · Anterior: [I - COMO FUNCIONA](i-como-funciona.md) · Próximo: [III - QUARKUS × SPRING](iii-quarkus-x-spring.md)
