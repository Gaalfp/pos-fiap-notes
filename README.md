# ADJ - PÓSTECH FIAP

Anotações da pós-graduação (migradas do Notion). Cada matéria é uma pasta, com o
conteúdo principal no `README.md` e os capítulos/subtópicos em arquivos próprios.
Toda matéria termina com **perguntas de autoavaliação**.

> 📌 **[RESUMO DE PROVA](RESUMO-PROVA.md)** — arquivo de véspera: as 20 pegadinhas, tabelas comparativas, definições em uma linha e o mapa de conexões entre as matérias.

## Arquitetura e design

- [ARQUITETURA DISTRIBUÍDA](arquitetura-distribuida/README.md) — desafios e estratégias: estilos, latência, consistência, resiliência e observabilidade
- [CLEAN ARCHITECTURE](clean-architecture/README.md) — camadas, Regra da Dependência, ports e adapters, comparativo com Hexagonal e Onion
- [SOLID](solid/README.md) — os cinco princípios com código violando/corrigido, code smells e princípios de componentes
- [DESIGN PATTERNS EM OO](design-patterns-em-oo/README.md) — os 23 padrões do GoF em três capítulos, com tabela de reconhecimento rápido
- [POO](poo/README.md) — pilares com código, herança × composição, `equals`/`hashCode` e exceções

## Java e Spring

- [Spring MVC - APIs RESTful](spring-mvc-apis-restful/README.md) — Fielding, Richardson, DispatcherServlet, ProblemDetail, cache HTTP, idempotência e OpenAPI
- [SPRING DATA JPA](spring-data-jpa/README.md) — anotações, persistence context, N+1, transações e concorrência
- [SPRING SECURITY](spring-security/README.md) — AuthN/AuthZ, JWT, OAuth2, filter chain, method security e [criptografia](spring-security/criptografia.md)
- [TESTES EM SOFTWARE](testes-em-software/README.md) — pirâmide, TDD, BDD, JUnit 5, Mockito e testes no Spring

## Dados

- [FUNDAMENTOS DE MODELAGEM DE DADOS](fundamentos-de-modelagem-de-dados/README.md) — formas normais, modelagem relacional, índices, views, procedures, NoSQL e grafos
- [TEOREMA CAP](teorema-cap/README.md) — a leitura correta, quadrantes, PACELC e níveis de consistência

## Infraestrutura e integração

- [DOCKER](docker/README.md) — containers, Dockerfile, redes, volumes e orquestração
- [gRPC e GRAPHQL](grpc-e-graphql/README.md) — protobuf, HTTP/2, schema, resolvers e DataLoader

## Referência rápida

- [UTEIS](uteis/README.md) — [comandos Docker](uteis/comandos-docker.md) e [dicas de banco de dados](uteis/dicas-de-banco-de-dados.md)
