# Spring MVC - APIs RESTful

Como o Spring recebe uma requisição HTTP, transforma em chamada de método e devolve JSON — e como projetar essa API para que ela resista a volume, a mudança e a retry.

- [I - INTRODUÇÃO SOBRE O SPRING MVC](i-introducao-sobre-o-spring-mvc.md) — origem do Spring, o problema dos EJBs e os componentes do framework
- [II - FUNDAMENTOS REST](ii-fundamentos-rest.md) — as seis restrições de Fielding, modelo de Richardson, verbos, idempotência, status codes, modelagem de recursos e HATEOAS
- [III - SPRING MVC NA PRÁTICA](iii-spring-mvc-na-pratica.md) — ciclo do DispatcherServlet, anotações, DTOs e records, Bean Validation, tratamento de erro com ProblemDetail, Jackson, filtros × interceptors × AOP
- [IV - EVOLUÇÃO DA API](iv-evolucao-da-api.md) — paginação e keyset, versionamento, cache HTTP e ETag, idempotency key, operações assíncronas, rate limiting, CORS, OpenAPI e segurança de API

**Relacionados:** [TESTES EM SOFTWARE](../testes-em-software/README.md) · [SPRING SECURITY](../spring-security/README.md) · [CLEAN ARCHITECTURE](../clean-architecture/README.md) · [gRPC e GRAPHQL](../grpc-e-graphql/README.md)
