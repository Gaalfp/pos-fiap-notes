# -*- coding: utf-8 -*-
"""Fonte única da estrutura do repositório.

Quem consome:
  - tools/gerar-indice.py  → escreve o README.md da raiz
  - tools/gerar-site.py    → escreve web/mkdocs.yml (tema + navegação)

Ao criar uma matéria ou um capítulo novo, edite a lista DADOS abaixo e rode:
    python3 tools/gerar-indice.py && python3 tools/gerar-site.py
"""
import os
import re

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PULAR = "Perguntas para autoavaliação"

# Caminho base do site publicado. O GitHub Pages de um repositório serve em
# /<nome-do-repo>/. Com domínio próprio, troque por "" e rode os geradores.
BASE = "/pos-fiap-notes"


def rotulo(texto):
    """Texto de exibição: sem links nem negrito, mantendo `code`."""
    texto = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', texto)
    return texto.replace('**', '').strip()


def limpo(texto):
    return rotulo(texto).replace('`', '').replace('*', '').strip()


def slug(texto):
    """Mesmo algoritmo de âncora que o GitHub usa."""
    texto = limpo(texto).lower()
    return ''.join('-' if c == ' ' else c
                   for c in texto if c in ' -_' or c.isalnum())


def titulos(caminho):
    """Lista de (nível, texto) dos H2/H3, ignorando blocos de código."""
    saida, dentro_de_fence = [], False
    with open(os.path.join(RAIZ, caminho), encoding='utf-8') as fh:
        for linha in fh:
            if linha.startswith('```'):
                dentro_de_fence = not dentro_de_fence
                continue
            if dentro_de_fence:
                continue
            m = re.match(r'^(#{2,3})\s+(.*\S)\s*$', linha)
            if m:
                saida.append((len(m.group(1)), m.group(2)))
    return saida


def arvore(caminho, recuo=""):
    """Lista markdown aninhada dos tópicos (H2) e subtópicos (H3)."""
    saida, pulando, viu_topico = [], False, False
    for nivel, texto in titulos(caminho):
        if nivel == 2:
            pulando = limpo(texto) == PULAR
            if pulando:
                continue
            viu_topico = True
            saida.append(f"{recuo}- [{rotulo(texto)}]({caminho}#{slug(texto)})")
        else:
            if pulando:
                continue
            pad = recuo + ("  " if viu_topico else "")
            saida.append(f"{pad}- [{rotulo(texto)}]({caminho}#{slug(texto)})")
    return saida


# Ordem de leitura recomendada (a "trilha" da home): dos fundamentos da
# plataforma até as alternativas. Use exatamente os nomes das matérias.
TRILHA = [
    "JVM E PLATAFORMA JAVA",
    "POO",
    "THREADS E CONCORRÊNCIA",
    "SOLID",
    "DESIGN PATTERNS EM OO",
    "CLEAN ARCHITECTURE",
    "SPRING E SPRING BOOT",
    "Spring MVC - APIs RESTful",
    "SPRING DATA JPA",
    "SPRING SECURITY",
    "TESTES EM SOFTWARE",
    "FUNDAMENTOS DE MODELAGEM DE DADOS",
    "DOCKER",
    "ARQUITETURA DISTRIBUÍDA",
    "TEOREMA CAP",
    "FUNDAMENTOS DE MENSAGERIA",
    "gRPC e GRAPHQL",
    "QUARKUS",
]

# (grupo, [ (matéria, pasta, descrição, [ (rótulo, arquivo, descrição curta) ]) ])
DADOS = [
("Arquitetura e design", [
  ("CLEAN ARCHITECTURE", "clean-architecture",
   "Camadas, Regra da Dependência, ports e adapters, e o comparativo com Hexagonal e Onion.",
   [("Conteúdo da matéria", "clean-architecture/README.md", None)]),
  ("SOLID", "solid",
   "Os cinco princípios com código violando/corrigido, code smells e princípios de componentes.",
   [("Conteúdo da matéria", "solid/README.md", None)]),
  ("DESIGN PATTERNS EM OO", "design-patterns-em-oo",
   "Os 23 padrões do GoF em três capítulos, com tabela de reconhecimento rápido.",
   [("Visão geral", "design-patterns-em-oo/README.md", "princípios, os 23 padrões, reconhecimento rápido, padrões no JDK e no Spring"),
    ("I - PADRÕES CRIACIONAIS", "design-patterns-em-oo/i-padroes-criacionais.md", "como o objeto nasce"),
    ("II - PADRÕES ESTRUTURAIS", "design-patterns-em-oo/ii-padroes-estruturais.md", "como os objetos se compõem"),
    ("III - PADRÕES COMPORTAMENTAIS", "design-patterns-em-oo/iii-padroes-comportamentais.md", "como os objetos se comunicam")]),
  ("POO", "poo",
   "Os fundamentos que sustentam o resto do curso: pilares com código, herança × composição e exceções.",
   [("Visão geral", "poo/README.md", "índice e ligação com SOLID, Design Patterns e Clean Architecture"),
    ("CONCEITOS DE POO", "poo/conceitos-de-poo.md", "classe e objeto, memória, os quatro pilares, Java moderno"),
    ("MANIPULAÇÕES E EXCEÇÕES", "poo/manipulacoes-e-excecoes.md", "Call Stack, `Throwable`, checked × unchecked, anti-padrões")]),
]),
("Sistemas distribuídos e integração", [
  ("ARQUITETURA DISTRIBUÍDA", "arquitetura-distribuida",
   "Os três eixos de preocupação — latência, consistência e resiliência — mais estilos e observabilidade.",
   [("Visão geral", "arquitetura-distribuida/README.md", "anotações da aula, falácias, desafios e como os eixos se conectam"),
    ("I - ESTILOS ARQUITETURAIS", "arquitetura-distribuida/i-estilos-arquiteturais.md", "cliente-servidor, P2P, monólito × microsserviços, SOA, event-driven, serverless"),
    ("II - LATÊNCIA E PERFORMANCE", "arquitetura-distribuida/ii-latencia-e-performance.md", "CDN, camadas de cache, redução de chamadas, backpressure"),
    ("III - CONSISTÊNCIA E DADOS", "arquitetura-distribuida/iii-consistencia-e-dados.md", "replicação, Saga, Outbox, idempotência, CQRS"),
    ("IV - RESILIÊNCIA", "arquitetura-distribuida/iv-resiliencia.md", "timeout, retry, circuit breaker, bulkhead, chaos engineering"),
    ("V - OBSERVABILIDADE", "arquitetura-distribuida/v-observabilidade.md", "logs, métricas, tracing, SLI/SLO/SLA e alertas")]),
  ("FUNDAMENTOS DE MENSAGERIA", "mensageria",
   "Comunicação assíncrona, fila × tópico, tipos de mensagem, brokers, protocolos e padrões de entrega.",
   [("Visão geral", "mensageria/README.md", "anotações da aula, assincronia, fila × tópico, onde se usa"),
    ("I - TIPOS DE MENSAGEM", "mensageria/i-tipos-de-mensagem.md", "comando, evento, consulta e pub/sub em profundidade"),
    ("II - MESSAGE BROKERS", "mensageria/ii-message-brokers.md", "modelos de organização, protocolos e as ferramentas"),
    ("III - PADRÕES DE ENTREGA", "mensageria/iii-padroes-de-entrega.md", "at most / at least / exactly once e garantias do produtor"),
    ("IV - PADRÕES DE USO E OPERAÇÃO", "mensageria/iv-padroes-de-uso-e-operacao.md", "competing consumers, ordenação, DLQ, Outbox/Inbox, Spring")]),
  ("TEOREMA CAP", "teorema-cap",
   "A leitura correta do teorema, os quadrantes, PACELC e níveis de consistência.",
   [("Conteúdo da matéria", "teorema-cap/README.md", None)]),
  ("gRPC e GRAPHQL", "grpc-e-graphql",
   "Os dois caminhos opostos para os preços que o REST cobra: payload de texto e endpoint fixo.",
   [("Visão geral", "grpc-e-graphql/README.md", "comparativo REST × gRPC × GraphQL e critério de escolha"),
    ("I - gRPC", "grpc-e-graphql/i-grpc.md", "RPC, Protocol Buffers, channel e stub, HTTP/2, status codes"),
    ("II - GRAPHQL", "grpc-e-graphql/ii-graphql.md", "schema e SDL, query, resolvers, DataLoader, Spring for GraphQL")]),
]),
("Java e frameworks", [
  ("JVM E PLATAFORMA JAVA", "jvm-e-plataforma-java",
   "A plataforma embaixo de tudo: JVM, memória, garbage collector, inicialização e operação em produção.",
   [("Visão geral", "jvm-e-plataforma-java/README.md", "as três coisas que se chamam Java, processo/thread/stack/heap/GC, JDK × JRE × JVM, o mapa de memória, versões LTS"),
    ("I - A JVM POR DENTRO", "jvm-e-plataforma-java/i-a-jvm-por-dentro.md", "carregamento de classes, bytecode, interpretador e JIT, aquecimento, CDS e cache AOT"),
    ("II - MEMÓRIA E GARBAGE COLLECTOR", "jvm-e-plataforma-java/ii-memoria-e-garbage-collector.md", "o que é um GC, o mapa da memória, RSS × heap, gerações, os coletores, tuning, container"),
    ("III - SUBIR E OPERAR EM PRODUÇÃO", "jvm-e-plataforma-java/iii-subir-e-operar-em-producao.md", "`java -jar` passo a passo, cold start, threads virtuais, imagem, flags, JFR, diagnóstico")]),
  ("THREADS E CONCORRÊNCIA", "threads-e-concorrencia",
   "Do zero: o que é uma thread, os métodos da classe Thread, o que quebra quando elas compartilham memória e o que o java.util.concurrent já resolve.",
   [("Visão geral", "threads-e-concorrencia/README.md", "processo × thread, concorrência × paralelismo, a primeira thread, os métodos essenciais e os três problemas"),
    ("I - CRIANDO E CONTROLANDO THREADS", "threads-e-concorrencia/i-criando-e-controlando-threads.md", "`Runnable` × `Thread`, `start()` × `run()`, `sleep`/`join`/`interrupt`, daemon, os seis estados"),
    ("II - COMPARTILHANDO MEMÓRIA", "threads-e-concorrencia/ii-compartilhando-memoria.md", "race condition, atomicidade × visibilidade, `synchronized`, `volatile`, `wait`/`notify`, deadlock"),
    ("III - JAVA.UTIL.CONCURRENT", "threads-e-concorrencia/iii-java-util-concurrent.md", "`ExecutorService`, `Future`, `CompletableFuture`, atômicos, coleções concorrentes, locks e threads virtuais")]),
  ("SPRING E SPRING BOOT", "spring-e-spring-boot",
   "A base que as outras matérias de Spring supõem: o container, o bean, o proxy e o que o Boot acrescenta.",
   [("Visão geral", "spring-e-spring-boot/README.md", "IoC e DI, o vocabulário mínimo, a origem do Spring, Spring × Spring Boot, o ecossistema"),
    ("I - IoC E BEANS", "spring-e-spring-boot/i-ioc-e-beans.md", "o container, declarar e injetar beans, ambiguidade, ciclo de vida, escopos, dependência circular"),
    ("II - AOP E PROXIES", "spring-e-spring-boot/ii-aop-e-proxies.md", "preocupações transversais, vocabulário do AOP, JDK proxy × CGLIB, limitações, `@Aspect`, eventos"),
    ("III - SPRING BOOT", "spring-e-spring-boot/iii-spring-boot.md", "`@SpringBootApplication`, autoconfiguração, starters, configuração e perfis, Actuator, empacotamento")]),
  ("Spring MVC - APIs RESTful", "spring-mvc-apis-restful",
   "Como o Spring transforma HTTP em chamada de método — e como projetar a API para resistir a volume, mudança e retry.",
   [("Visão geral", "spring-mvc-apis-restful/README.md", "índice da matéria e relacionados"),
    ("I - INTRODUÇÃO SOBRE O SPRING MVC", "spring-mvc-apis-restful/i-introducao-sobre-o-spring-mvc.md", "servlet e servlet container, Front Controller, por que \"MVC\" confunde numa API REST"),
    ("II - FUNDAMENTOS REST", "spring-mvc-apis-restful/ii-fundamentos-rest.md", "Fielding, Richardson, verbos, status codes, URIs, HATEOAS"),
    ("III - SPRING MVC NA PRÁTICA", "spring-mvc-apis-restful/iii-spring-mvc-na-pratica.md", "DispatcherServlet, DTOs, Bean Validation, ProblemDetail, Jackson"),
    ("IV - EVOLUÇÃO DA API", "spring-mvc-apis-restful/iv-evolucao-da-api.md", "paginação, versionamento, cache HTTP, idempotência, CORS, OpenAPI")]),
  ("SPRING DATA JPA", "spring-data-jpa",
   "Anotações e mapeamento, persistence context, N+1, transações e concorrência.",
   [("Visão geral", "spring-data-jpa/README.md", "mapeamento de tabelas, herança, embedded, callbacks, named queries"),
    ("I - PERSISTENCE CONTEXT E CICLO DE VIDA", "spring-data-jpa/i-persistence-context-e-ciclo-de-vida.md", "estados da entidade, `EntityManager`, flush, LAZY × EAGER, cascade"),
    ("II - CONSULTAS E PERFORMANCE", "spring-data-jpa/ii-consultas-e-performance.md", "derived queries, `@Query`, projections, paginação, N+1, batch"),
    ("III - TRANSAÇÕES E CONCORRÊNCIA", "spring-data-jpa/iii-transacoes-e-concorrencia.md", "`@Transactional`, propagação, rollback, locking, isolamento, migrations")]),
  ("SPRING SECURITY", "spring-security",
   "Parte 1: conceitos de AuthN/AuthZ, JWT e OAuth2. Parte 2: o framework — filter chain, resource server e method security.",
   [("Conteúdo da matéria", "spring-security/README.md", "parte 1 — conceitos de AuthN/AuthZ; parte 2 — o framework na prática"),
    ("CRIPTOGRAFIA", "spring-security/criptografia.md", "hash × simétrica × assimétrica, KDF, HMAC, PKI, TLS")]),
  ("TESTES EM SOFTWARE", "testes-em-software",
   "Pirâmide, TDD, BDD, cobertura — e a prática com JUnit 5, Mockito e o ecossistema de testes do Spring.",
   [("Visão geral", "testes-em-software/README.md", "pirâmide, tipos, vocabulário, TDD, BDD, cobertura, anti-padrões"),
    ("I - JUNIT 5 E ASSERTJ", "testes-em-software/i-junit-5-e-assertj.md", "arquitetura do JUnit 5, ciclo de vida, assertions, parametrizados, AssertJ"),
    ("II - TEST DOUBLES E MOCKITO", "testes-em-software/ii-test-doubles-e-mockito.md", "stub × mock, stubbing, matchers, verificação, spy, BDDMockito"),
    ("III - TESTES NO SPRING", "testes-em-software/iii-testes-no-spring.md", "`@SpringBootTest`, slices, Testcontainers, segurança, ArchUnit")]),
  ("QUARKUS", "quarkus",
   "O framework Java desenhado para container: trabalho antecipado para o build, imagem nativa e o comparativo com o Spring.",
   [("Visão geral", "quarkus/README.md", "fundamentos de execução, o problema que resolve, build-time augmentation, modos JVM e nativo"),
    ("I - COMO FUNCIONA", "quarkus/i-como-funciona.md", "as três fases, ArC, extensões, GraalVM e mundo fechado, JIT × AOT, dev mode, threads"),
    ("II - QUARKUS NA PRÁTICA", "quarkus/ii-quarkus-na-pratica.md", "projeto, Jakarta REST, CDI, config e perfis, Panache, mensageria, testes, container"),
    ("III - QUARKUS × SPRING", "quarkus/iii-quarkus-x-spring.md", "DI em build time × runtime, números, tabela de-para, nativo, ecossistema, migração")]),
]),
("Dados", [
  ("FUNDAMENTOS DE MODELAGEM DE DADOS", "fundamentos-de-modelagem-de-dados",
   "Da normalização ao NoSQL: formas normais, modelagem relacional, índices, views, procedures, ACID e grafos.",
   [("Visão geral", "fundamentos-de-modelagem-de-dados/README.md", "conceitos básicos, normalização, as formas normais, desnormalização"),
    ("MODELAGEM RELACIONAL", "fundamentos-de-modelagem-de-dados/modelagem-relacional.md", "chaves, relacionamentos e cardinalidade, integridade, álgebra relacional, JOINs"),
    ("ÍNDICE", "fundamentos-de-modelagem-de-dados/indice.md", "tipos, custo, seletividade, índice composto, covering index, plano de execução"),
    ("ACID", "fundamentos-de-modelagem-de-dados/acid.md", "os níveis de isolamento, anomalias e a relação com BASE"),
    ("VIEWS", "fundamentos-de-modelagem-de-dados/views.md", "view simples e materializada, quando compensa"),
    ("PROCEDURES", "fundamentos-de-modelagem-de-dados/procedures.md", "a mesma procedure em três dialetos, procedure × function × trigger"),
    ("MODELAGEM NÃO RELACIONAL", "fundamentos-de-modelagem-de-dados/modelagem-nao-relacional.md", "tipos de NoSQL, modelagem por query, embedding × referencing, sharding"),
    ("BANCO DE DADOS EM GRAFOS", "fundamentos-de-modelagem-de-dados/banco-de-dados-em-grafos.md", "nós, arestas, propriedades, Cypher, quando grafo vence o relacional")]),
]),
("Infraestrutura", [
  ("DOCKER", "docker",
   "Do conceito de processo isolado até o `docker-compose.yml` de produção.",
   [("Visão geral", "docker/README.md", "índice da matéria e relacionados"),
    ("CAPÍTULO I - INTRODUÇÃO AO DOCKER", "docker/capitulo-i-introducao-ao-docker.md", "VM × container, namespaces e cgroups, camadas, registry, ciclo de vida"),
    ("CAPÍTULO II - GERENCIAMENTO DE CONTAINERS", "docker/capitulo-ii-gerenciamento-de-containers.md", "comandos, Dockerfile, `CMD` × `ENTRYPOINT`, multi-stage build, segurança"),
    ("CAPÍTULO III - REDES", "docker/capitulo-iii-redes.md", "drivers, DNS interno, `EXPOSE` × `-p`, isolamento"),
    ("CAPÍTULO IV - VOLUMES", "docker/capitulo-iv-volumes.md", "volume × bind mount × tmpfs, permissões, backup, Compose"),
    ("CAPÍTULO V - ORQUESTRAÇÃO DE CONTAINERES", "docker/capitulo-v-orquestracao-de-containeres.md", "Compose real, limites do Compose, Swarm × Kubernetes, 12 fatores")]),
]),
("Referência rápida", [
  ("RESUMO DE PROVA", ".",
   "Arquivo de véspera: as pegadinhas mais cobradas com a correção, tabelas comparativas, definições em uma linha e o mapa de conexões entre as matérias.",
   [("Conteúdo", "RESUMO-PROVA.md", None)]),
  ("UTEIS", "uteis",
   "Para consultar durante o trabalho, não para estudar.",
   [("Visão geral", "uteis/README.md", "índice da referência rápida"),
    ("COMANDOS DOCKER", "uteis/comandos-docker.md", "cheat sheet do dia a dia — o conceito está em [DOCKER](docker/README.md)"),
    ("DICAS DE BANCO DE DADOS", "uteis/dicas-de-banco-de-dados.md", "boas práticas soltas — o aprofundamento está em [ÍNDICE](fundamentos-de-modelagem-de-dados/indice.md)")]),
]),
]
