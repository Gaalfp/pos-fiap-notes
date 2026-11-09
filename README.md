# ADJ - PÓSTECH FIAP

Anotações da pós-graduação (migradas do Notion). Cada matéria é uma pasta, com o
conteúdo principal no `README.md` e os capítulos/subtópicos em arquivos próprios.

Este índice abre **todos os níveis**: matéria → arquivo → tópico → subtópico. Cada
item leva direto à seção correspondente. Todo arquivo de conteúdo termina com
**perguntas de autoavaliação**, omitidas aqui para não repetir em cada bloco.

> 📌 **[RESUMO DE PROVA](RESUMO-PROVA.md)** — o arquivo de véspera. Comece por ele na reta final.

## Sumário

- **[Arquitetura e design](#arquitetura-e-design)** — [CLEAN ARCHITECTURE](#clean-architecture) · [SOLID](#solid) · [DESIGN PATTERNS EM OO](#design-patterns-em-oo) · [POO](#poo)
- **[Sistemas distribuídos e integração](#sistemas-distribuídos-e-integração)** — [ARQUITETURA DISTRIBUÍDA](#arquitetura-distribuída) · [FUNDAMENTOS DE MENSAGERIA](#fundamentos-de-mensageria) · [TEOREMA CAP](#teorema-cap) · [gRPC e GRAPHQL](#grpc-e-graphql)
- **[Java e frameworks](#java-e-frameworks)** — [SPRING E SPRING BOOT](#spring-e-spring-boot) · [Spring MVC - APIs RESTful](#spring-mvc---apis-restful) · [SPRING DATA JPA](#spring-data-jpa) · [SPRING SECURITY](#spring-security) · [TESTES EM SOFTWARE](#testes-em-software) · [QUARKUS](#quarkus)
- **[Dados](#dados)** — [FUNDAMENTOS DE MODELAGEM DE DADOS](#fundamentos-de-modelagem-de-dados)
- **[Infraestrutura](#infraestrutura)** — [DOCKER](#docker)
- **[Referência rápida](#referência-rápida)** — [RESUMO DE PROVA](#resumo-de-prova) · [UTEIS](#uteis)

---

## Arquitetura e design

### CLEAN ARCHITECTURE

Camadas, Regra da Dependência, ports e adapters, e o comparativo com Hexagonal e Onion.

**[Conteúdo da matéria →](clean-architecture/README.md)**

- [1. As quatro camadas](clean-architecture/README.md#1-as-quatro-camadas)
- [2. A Regra da Dependência](clean-architecture/README.md#2-a-regra-da-dependência)
- [3. Fluxo de controle × fluxo de dependência](clean-architecture/README.md#3-fluxo-de-controle--fluxo-de-dependência)
- [4. Os ports na prática (Java + Spring)](clean-architecture/README.md#4-os-ports-na-prática-java--spring)
  - [Entity — regra de negócio pura](clean-architecture/README.md#entity--regra-de-negócio-pura)
  - [Ports — as fronteiras, declaradas pelo centro](clean-architecture/README.md#ports--as-fronteiras-declaradas-pelo-centro)
  - [Interactor — o caso de uso](clean-architecture/README.md#interactor--o-caso-de-uso)
  - [Adapters — as pontas](clean-architecture/README.md#adapters--as-pontas)
- [5. Fluxo completo de uma requisição](clean-architecture/README.md#5-fluxo-completo-de-uma-requisição)
- [6. Estrutura de pastas em Java/Spring](clean-architecture/README.md#6-estrutura-de-pastas-em-javaspring)
- [7. Quem mora onde: entidade, DTO e model](clean-architecture/README.md#7-quem-mora-onde-entidade-dto-e-model)
- [8. Clean × Hexagonal × Onion](clean-architecture/README.md#8-clean--hexagonal--onion)
- [9. O que se ganha e o que se paga](clean-architecture/README.md#9-o-que-se-ganha-e-o-que-se-paga)
- [10. O que Clean Architecture NÃO é](clean-architecture/README.md#10-o-que-clean-architecture-não-é)
  - [Sinais de que "está Clean" só no nome](clean-architecture/README.md#sinais-de-que-está-clean-só-no-nome)

<br>

### SOLID

Os cinco princípios com código violando/corrigido, code smells e princípios de componentes.

**[Conteúdo da matéria →](solid/README.md)**

- [S — Single Responsibility](solid/README.md#s--single-responsibility)
- [O — Open/Closed](solid/README.md#o--openclosed)
- [L — Liskov Substitution](solid/README.md#l--liskov-substitution)
  - [O exemplo canônico: Quadrado × Retângulo](solid/README.md#o-exemplo-canônico-quadrado--retângulo)
  - [As regras de contrato (é isso que a prova cobra)](solid/README.md#as-regras-de-contrato-é-isso-que-a-prova-cobra)
- [I — Interface Segregation](solid/README.md#i--interface-segregation)
- [D — Dependency Inversion](solid/README.md#d--dependency-inversion)
- [SOLID no Spring — resumo](solid/README.md#solid-no-spring--resumo)
- [SOLID × Design Patterns](solid/README.md#solid--design-patterns)
- [Code smells → princípio violado](solid/README.md#code-smells--princípio-violado)
- [Princípios complementares](solid/README.md#princípios-complementares)
  - [Princípios de componentes (o "SOLID dos pacotes")](solid/README.md#princípios-de-componentes-o-solid-dos-pacotes)
- [Crítica: SOLID não é dogma](solid/README.md#crítica-solid-não-é-dogma)

<br>

### DESIGN PATTERNS EM OO

Os 23 padrões do GoF em três capítulos, com tabela de reconhecimento rápido.

#### [Visão geral](design-patterns-em-oo/README.md)

Princípios, os 23 padrões, reconhecimento rápido, padrões no JDK e no Spring.

- [1. Os dois princípios por trás de quase todos](design-patterns-em-oo/README.md#1-os-dois-princípios-por-trás-de-quase-todos)
- [2. Os 23 padrões](design-patterns-em-oo/README.md#2-os-23-padrões)
- [3. Tabela de reconhecimento rápido](design-patterns-em-oo/README.md#3-tabela-de-reconhecimento-rápido)
  - [Os pares que mais confundem](design-patterns-em-oo/README.md#os-pares-que-mais-confundem)
- [4. Onde eles aparecem no JDK e no Spring](design-patterns-em-oo/README.md#4-onde-eles-aparecem-no-jdk-e-no-spring)
- [5. Padrões e SOLID](design-patterns-em-oo/README.md#5-padrões-e-solid)
- [6. Crítica: quando padrão vira problema](design-patterns-em-oo/README.md#6-crítica-quando-padrão-vira-problema)

#### [I - PADRÕES CRIACIONAIS](design-patterns-em-oo/i-padroes-criacionais.md)

Como o objeto nasce.

- [1. Singleton](design-patterns-em-oo/i-padroes-criacionais.md#1-singleton)
  - [Implementação — as três formas que importam](design-patterns-em-oo/i-padroes-criacionais.md#implementação--as-três-formas-que-importam)
  - [Consequências](design-patterns-em-oo/i-padroes-criacionais.md#consequências)
- [2. Factory Method](design-patterns-em-oo/i-padroes-criacionais.md#2-factory-method)
- [3. Abstract Factory](design-patterns-em-oo/i-padroes-criacionais.md#3-abstract-factory)
- [4. Builder](design-patterns-em-oo/i-padroes-criacionais.md#4-builder)
- [5. Prototype](design-patterns-em-oo/i-padroes-criacionais.md#5-prototype)
- [Bônus: Object Pool](design-patterns-em-oo/i-padroes-criacionais.md#bônus-object-pool)
- [Resumo do capítulo](design-patterns-em-oo/i-padroes-criacionais.md#resumo-do-capítulo)

#### [II - PADRÕES ESTRUTURAIS](design-patterns-em-oo/ii-padroes-estruturais.md)

Como os objetos se compõem.

- [1. Adapter (Wrapper)](design-patterns-em-oo/ii-padroes-estruturais.md#1-adapter-wrapper)
- [2. Bridge](design-patterns-em-oo/ii-padroes-estruturais.md#2-bridge)
- [3. Composite](design-patterns-em-oo/ii-padroes-estruturais.md#3-composite)
- [4. Decorator](design-patterns-em-oo/ii-padroes-estruturais.md#4-decorator)
- [5. Facade](design-patterns-em-oo/ii-padroes-estruturais.md#5-facade)
- [6. Flyweight](design-patterns-em-oo/ii-padroes-estruturais.md#6-flyweight)
- [7. Proxy](design-patterns-em-oo/ii-padroes-estruturais.md#7-proxy)
  - [O Proxy é o padrão que explica o Spring](design-patterns-em-oo/ii-padroes-estruturais.md#o-proxy-é-o-padrão-que-explica-o-spring)
- [Resumo do capítulo](design-patterns-em-oo/ii-padroes-estruturais.md#resumo-do-capítulo)

#### [III - PADRÕES COMPORTAMENTAIS](design-patterns-em-oo/iii-padroes-comportamentais.md)

Como os objetos se comunicam.

- [1. Strategy](design-patterns-em-oo/iii-padroes-comportamentais.md#1-strategy)
- [2. State](design-patterns-em-oo/iii-padroes-comportamentais.md#2-state)
- [3. Template Method](design-patterns-em-oo/iii-padroes-comportamentais.md#3-template-method)
- [4. Observer](design-patterns-em-oo/iii-padroes-comportamentais.md#4-observer)
- [5. Command](design-patterns-em-oo/iii-padroes-comportamentais.md#5-command)
- [6. Chain of Responsibility](design-patterns-em-oo/iii-padroes-comportamentais.md#6-chain-of-responsibility)
- [7. Iterator](design-patterns-em-oo/iii-padroes-comportamentais.md#7-iterator)
- [8. Mediator](design-patterns-em-oo/iii-padroes-comportamentais.md#8-mediator)
- [9. Memento](design-patterns-em-oo/iii-padroes-comportamentais.md#9-memento)
- [10. Visitor](design-patterns-em-oo/iii-padroes-comportamentais.md#10-visitor)
- [11. Interpreter](design-patterns-em-oo/iii-padroes-comportamentais.md#11-interpreter)
- [Resumo do capítulo](design-patterns-em-oo/iii-padroes-comportamentais.md#resumo-do-capítulo)

<br>

### POO

Os fundamentos que sustentam o resto do curso: pilares com código, herança × composição e exceções.

#### [Visão geral](poo/README.md)

Índice e ligação com SOLID, Design Patterns e Clean Architecture.

_Só a apresentação da matéria, o índice dos capítulos e os links relacionados._

#### [CONCEITOS DE POO](poo/conceitos-de-poo.md)

Classe e objeto, memória, os quatro pilares, Java moderno.

- [Stack × Heap — onde cada coisa mora](poo/conceitos-de-poo.md#stack--heap--onde-cada-coisa-mora)
- [PILARES DA POO](poo/conceitos-de-poo.md#pilares-da-poo)
  - [1. Abstração (O Filtro da Realidade)](poo/conceitos-de-poo.md#1-abstração-o-filtro-da-realidade)
  - [2. Encapsulamento (A Blindagem dos Dados)](poo/conceitos-de-poo.md#2-encapsulamento-a-blindagem-dos-dados)
  - [3. Herança (A Reutilização de DNA)](poo/conceitos-de-poo.md#3-herança-a-reutilização-de-dna)
  - [4. Polimorfismo (As Múltiplas Faces)](poo/conceitos-de-poo.md#4-polimorfismo-as-múltiplas-faces)
- [Sobrecarga × Sobrescrita — lado a lado](poo/conceitos-de-poo.md#sobrecarga--sobrescrita--lado-a-lado)
- [Classe abstrata × Interface](poo/conceitos-de-poo.md#classe-abstrata--interface)
- [Herança × Composição — o mesmo problema, dos dois jeitos](poo/conceitos-de-poo.md#herança--composição--o-mesmo-problema-dos-dois-jeitos)
- [Acoplamento e coesão](poo/conceitos-de-poo.md#acoplamento-e-coesão)
- [`equals` e `hashCode` — o contrato](poo/conceitos-de-poo.md#equals-e-hashcode--o-contrato)
- [Imutabilidade e value objects](poo/conceitos-de-poo.md#imutabilidade-e-value-objects)
- [Java moderno: records, sealed e pattern matching](poo/conceitos-de-poo.md#java-moderno-records-sealed-e-pattern-matching)

#### [MANIPULAÇÕES E EXCEÇÕES](poo/manipulacoes-e-excecoes.md)

Call Stack, `Throwable`, checked × unchecked, anti-padrões.

- [1. A Call Stack](poo/manipulacoes-e-excecoes.md#1-a-call-stack)
  - [Exemplo de Fluxo:](poo/manipulacoes-e-excecoes.md#exemplo-de-fluxo)
  - [Como funciona o rastro da exceção:](poo/manipulacoes-e-excecoes.md#como-funciona-o-rastro-da-exceção)
- [2. A hierarquia de `Throwable`](poo/manipulacoes-e-excecoes.md#2-a-hierarquia-de-throwable)
- [3. Checked × Unchecked — a decisão de projeto](poo/manipulacoes-e-excecoes.md#3-checked--unchecked--a-decisão-de-projeto)
- [4. `try-catch-finally`](poo/manipulacoes-e-excecoes.md#4-try-catch-finally)
  - [A pegadinha do `return` no `finally`](poo/manipulacoes-e-excecoes.md#a-pegadinha-do-return-no-finally)
- [5. `try-with-resources` e `AutoCloseable`](poo/manipulacoes-e-excecoes.md#5-try-with-resources-e-autocloseable)
- [6. `throw` × `throws`](poo/manipulacoes-e-excecoes.md#6-throw--throws)
- [7. Exceções customizadas](poo/manipulacoes-e-excecoes.md#7-exceções-customizadas)
- [8. Encadeamento e as regras de ouro](poo/manipulacoes-e-excecoes.md#8-encadeamento-e-as-regras-de-ouro)
  - [Anti-padrões](poo/manipulacoes-e-excecoes.md#anti-padrões)
- [9. Exceção de negócio × controle de fluxo](poo/manipulacoes-e-excecoes.md#9-exceção-de-negócio--controle-de-fluxo)
- [10. Custo e limites](poo/manipulacoes-e-excecoes.md#10-custo-e-limites)

<br>

---

## Sistemas distribuídos e integração

### ARQUITETURA DISTRIBUÍDA

Os três eixos de preocupação — latência, consistência e resiliência — mais estilos e observabilidade.

#### [Visão geral](arquitetura-distribuida/README.md)

Anotações da aula, falácias, desafios e como os eixos se conectam.

- [Anotações da aula](arquitetura-distribuida/README.md#anotações-da-aula)
- [1. O que muda quando o sistema é distribuído](arquitetura-distribuida/README.md#1-o-que-muda-quando-o-sistema-é-distribuído)
- [2. As oito falácias da computação distribuída](arquitetura-distribuida/README.md#2-as-oito-falácias-da-computação-distribuída)
- [3. Os desafios da arquitetura distribuída](arquitetura-distribuida/README.md#3-os-desafios-da-arquitetura-distribuída)
  - [O trade-off central](arquitetura-distribuida/README.md#o-trade-off-central)
- [4. Como os três eixos da aula se conectam](arquitetura-distribuida/README.md#4-como-os-três-eixos-da-aula-se-conectam)
- [Capítulos](arquitetura-distribuida/README.md#capítulos)

#### [I - ESTILOS ARQUITETURAIS](arquitetura-distribuida/i-estilos-arquiteturais.md)

Cliente-servidor, P2P, monólito × microsserviços, SOA, event-driven, serverless.

- [1. Cliente - Servidor](arquitetura-distribuida/i-estilos-arquiteturais.md#1-cliente---servidor)
- [2. Peer-to-Peer (P2P)](arquitetura-distribuida/i-estilos-arquiteturais.md#2-peer-to-peer-p2p)
- [3. Monólito — o ponto de partida honesto](arquitetura-distribuida/i-estilos-arquiteturais.md#3-monólito--o-ponto-de-partida-honesto)
- [4. Arquitetura de microsserviços](arquitetura-distribuida/i-estilos-arquiteturais.md#4-arquitetura-de-microsserviços)
  - [Database per service — a regra mais importante e mais violada](arquitetura-distribuida/i-estilos-arquiteturais.md#database-per-service--a-regra-mais-importante-e-mais-violada)
  - [Como decidir a fronteira](arquitetura-distribuida/i-estilos-arquiteturais.md#como-decidir-a-fronteira)
- [5. Monólito × microsserviços — quando usar cada um](arquitetura-distribuida/i-estilos-arquiteturais.md#5-monólito--microsserviços--quando-usar-cada-um)
  - [O comparativo lado a lado](arquitetura-distribuida/i-estilos-arquiteturais.md#o-comparativo-lado-a-lado)
  - [A pergunta que decide](arquitetura-distribuida/i-estilos-arquiteturais.md#a-pergunta-que-decide)
  - [Em que situação cada um se encaixa](arquitetura-distribuida/i-estilos-arquiteturais.md#em-que-situação-cada-um-se-encaixa)
  - [O imposto fixo de cada serviço](arquitetura-distribuida/i-estilos-arquiteturais.md#o-imposto-fixo-de-cada-serviço)
  - [Sinais de que é hora de extrair — e de que não é](arquitetura-distribuida/i-estilos-arquiteturais.md#sinais-de-que-é-hora-de-extrair--e-de-que-não-é)
  - [Como sair do monólito: Strangler Fig](arquitetura-distribuida/i-estilos-arquiteturais.md#como-sair-do-monólito-strangler-fig)
  - [Os dois erros simétricos](arquitetura-distribuida/i-estilos-arquiteturais.md#os-dois-erros-simétricos)
- [6. SOA × microsserviços](arquitetura-distribuida/i-estilos-arquiteturais.md#6-soa--microsserviços)
- [7. Arquitetura orientada a eventos (event-driven)](arquitetura-distribuida/i-estilos-arquiteturais.md#7-arquitetura-orientada-a-eventos-event-driven)
- [8. Serverless / FaaS](arquitetura-distribuida/i-estilos-arquiteturais.md#8-serverless--faas)
- [9. Comunicação: síncrona × assíncrona](arquitetura-distribuida/i-estilos-arquiteturais.md#9-comunicação-síncrona--assíncrona)
- [10. A infraestrutura que a distribuição exige](arquitetura-distribuida/i-estilos-arquiteturais.md#10-a-infraestrutura-que-a-distribuição-exige)
- [11. Lei de Conway](arquitetura-distribuida/i-estilos-arquiteturais.md#11-lei-de-conway)
- [Comparativo dos estilos](arquitetura-distribuida/i-estilos-arquiteturais.md#comparativo-dos-estilos)

#### [II - LATÊNCIA E PERFORMANCE](arquitetura-distribuida/ii-latencia-e-performance.md)

CDN, camadas de cache, redução de chamadas, backpressure.

- [1. Latência não é otimização de código](arquitetura-distribuida/ii-latencia-e-performance.md#1-latência-não-é-otimização-de-código)
- [2. De onde vem a latência de uma requisição](arquitetura-distribuida/ii-latencia-e-performance.md#2-de-onde-vem-a-latência-de-uma-requisição)
  - [Média mente: use percentis](arquitetura-distribuida/ii-latencia-e-performance.md#média-mente-use-percentis)
- [3. CDN — Rede de Entrega de Conteúdo](arquitetura-distribuida/ii-latencia-e-performance.md#3-cdn--rede-de-entrega-de-conteúdo)
- [4. Cache — as camadas](arquitetura-distribuida/ii-latencia-e-performance.md#4-cache--as-camadas)
  - [Padrões de escrita e leitura](arquitetura-distribuida/ii-latencia-e-performance.md#padrões-de-escrita-e-leitura)
  - [Estratégias de invalidação](arquitetura-distribuida/ii-latencia-e-performance.md#estratégias-de-invalidação)
  - [Os quatro problemas clássicos de cache](arquitetura-distribuida/ii-latencia-e-performance.md#os-quatro-problemas-clássicos-de-cache)
- [5. Reduzir o número de chamadas](arquitetura-distribuida/ii-latencia-e-performance.md#5-reduzir-o-número-de-chamadas)
- [6. Reduzir o tamanho e o custo de cada chamada](arquitetura-distribuida/ii-latencia-e-performance.md#6-reduzir-o-tamanho-e-o-custo-de-cada-chamada)
- [7. Backpressure — quando o produtor é mais rápido que o consumidor](arquitetura-distribuida/ii-latencia-e-performance.md#7-backpressure--quando-o-produtor-é-mais-rápido-que-o-consumidor)
- [Checklist de latência](arquitetura-distribuida/ii-latencia-e-performance.md#checklist-de-latência)

#### [III - CONSISTÊNCIA E DADOS](arquitetura-distribuida/iii-consistencia-e-dados.md)

Replicação, Saga, Outbox, idempotência, CQRS.

- [1. O problema](arquitetura-distribuida/iii-consistencia-e-dados.md#1-o-problema)
- [2. Replicação](arquitetura-distribuida/iii-consistencia-e-dados.md#2-replicação)
  - [Topologias](arquitetura-distribuida/iii-consistencia-e-dados.md#topologias)
  - [Replicação síncrona × assíncrona — o ponto da aula](arquitetura-distribuida/iii-consistencia-e-dados.md#replicação-síncrona--assíncrona--o-ponto-da-aula)
  - [Replication lag e as garantias de sessão](arquitetura-distribuida/iii-consistencia-e-dados.md#replication-lag-e-as-garantias-de-sessão)
  - [Quórum](arquitetura-distribuida/iii-consistencia-e-dados.md#quórum)
- [3. Dados em microsserviços](arquitetura-distribuida/iii-consistencia-e-dados.md#3-dados-em-microsserviços)
- [4. Transações distribuídas](arquitetura-distribuida/iii-consistencia-e-dados.md#4-transações-distribuídas)
  - [Two-Phase Commit (2PC) — e por que quase ninguém usa](arquitetura-distribuida/iii-consistencia-e-dados.md#two-phase-commit-2pc--e-por-que-quase-ninguém-usa)
  - [Saga — a resposta prática](arquitetura-distribuida/iii-consistencia-e-dados.md#saga--a-resposta-prática)
- [5. Outbox — o problema da escrita dupla](arquitetura-distribuida/iii-consistencia-e-dados.md#5-outbox--o-problema-da-escrita-dupla)
- [6. Idempotência — a exigência que atravessa tudo](arquitetura-distribuida/iii-consistencia-e-dados.md#6-idempotência--a-exigência-que-atravessa-tudo)
- [7. CQRS e Event Sourcing](arquitetura-distribuida/iii-consistencia-e-dados.md#7-cqrs-e-event-sourcing)
- [8. Tempo e ordem](arquitetura-distribuida/iii-consistencia-e-dados.md#8-tempo-e-ordem)
- [Checklist de consistência](arquitetura-distribuida/iii-consistencia-e-dados.md#checklist-de-consistência)

#### [IV - RESILIÊNCIA](arquitetura-distribuida/iv-resiliencia.md)

Timeout, retry, circuit breaker, bulkhead, chaos engineering.

- [1. Falha não é exceção, é rotina](arquitetura-distribuida/iv-resiliencia.md#1-falha-não-é-exceção-é-rotina)
  - [O mecanismo da falha em cascata](arquitetura-distribuida/iv-resiliencia.md#o-mecanismo-da-falha-em-cascata)
- [2. Timeout — o padrão mais básico e o mais esquecido](arquitetura-distribuida/iv-resiliencia.md#2-timeout--o-padrão-mais-básico-e-o-mais-esquecido)
- [3. Retry — repetir, mas com juízo](arquitetura-distribuida/iv-resiliencia.md#3-retry--repetir-mas-com-juízo)
- [4. Circuit Breaker — o disjuntor](arquitetura-distribuida/iv-resiliencia.md#4-circuit-breaker--o-disjuntor)
- [5. Bulkhead — antepara](arquitetura-distribuida/iv-resiliencia.md#5-bulkhead--antepara)
- [6. Fallback e degradação graciosa](arquitetura-distribuida/iv-resiliencia.md#6-fallback-e-degradação-graciosa)
- [7. Rate limiting, throttling e load shedding](arquitetura-distribuida/iv-resiliencia.md#7-rate-limiting-throttling-e-load-shedding)
- [8. Combinando os padrões — a ordem importa](arquitetura-distribuida/iv-resiliencia.md#8-combinando-os-padrões--a-ordem-importa)
- [9. Redundância, health checks e desligamento](arquitetura-distribuida/iv-resiliencia.md#9-redundância-health-checks-e-desligamento)
- [10. Chaos Engineering](arquitetura-distribuida/iv-resiliencia.md#10-chaos-engineering)
- [Anti-padrões](arquitetura-distribuida/iv-resiliencia.md#anti-padrões)
- [Checklist de resiliência](arquitetura-distribuida/iv-resiliencia.md#checklist-de-resiliência)

#### [V - OBSERVABILIDADE](arquitetura-distribuida/v-observabilidade.md)

Logs, métricas, tracing, SLI/SLO/SLA e alertas.

- [1. Por que o monitoramento muda](arquitetura-distribuida/v-observabilidade.md#1-por-que-o-monitoramento-muda)
- [2. Os três pilares](arquitetura-distribuida/v-observabilidade.md#2-os-três-pilares)
- [3. Logs](arquitetura-distribuida/v-observabilidade.md#3-logs)
- [4. Métricas](arquitetura-distribuida/v-observabilidade.md#4-métricas)
  - [RED e USE — o que medir](arquitetura-distribuida/v-observabilidade.md#red-e-use--o-que-medir)
- [5. Tracing distribuído](arquitetura-distribuida/v-observabilidade.md#5-tracing-distribuído)
- [6. SLI, SLO, SLA e error budget](arquitetura-distribuida/v-observabilidade.md#6-sli-slo-sla-e-error-budget)
- [7. Alertas](arquitetura-distribuida/v-observabilidade.md#7-alertas)
- [8. O que instrumentar num serviço Spring](arquitetura-distribuida/v-observabilidade.md#8-o-que-instrumentar-num-serviço-spring)
- [Checklist de observabilidade](arquitetura-distribuida/v-observabilidade.md#checklist-de-observabilidade)

<br>

### FUNDAMENTOS DE MENSAGERIA

Comunicação assíncrona, fila × tópico, tipos de mensagem, brokers, protocolos e padrões de entrega.

#### [Visão geral](mensageria/README.md)

Anotações da aula, assincronia, fila × tópico, onde se usa.

- [Anotações da aula](mensageria/README.md#anotações-da-aula)
- [1. O que é mensageria](mensageria/README.md#1-o-que-é-mensageria)
- [2. Como funciona a comunicação assíncrona](mensageria/README.md#2-como-funciona-a-comunicação-assíncrona)
  - [Vantagens](mensageria/README.md#vantagens)
  - [Desvantagens — o preço](mensageria/README.md#desvantagens--o-preço)
  - [Quando usar (e quando não)](mensageria/README.md#quando-usar-e-quando-não)
- [3. Os dois modelos: fila × tópico](mensageria/README.md#3-os-dois-modelos-fila--tópico)
- [4. Onde a mensageria é usada de verdade](mensageria/README.md#4-onde-a-mensageria-é-usada-de-verdade)
- [Capítulos](mensageria/README.md#capítulos)

#### [I - TIPOS DE MENSAGEM](mensageria/i-tipos-de-mensagem.md)

Comando, evento, consulta e pub/sub em profundidade.

- [1. Comando](mensageria/i-tipos-de-mensagem.md#1-comando)
- [2. Evento](mensageria/i-tipos-de-mensagem.md#2-evento)
  - [Histórico e reprocessamento — o que a retenção permite](mensageria/i-tipos-de-mensagem.md#histórico-e-reprocessamento--o-que-a-retenção-permite)
  - [Os três sabores de evento](mensageria/i-tipos-de-mensagem.md#os-três-sabores-de-evento)
- [3. Pub/Sub em profundidade](mensageria/i-tipos-de-mensagem.md#3-pubsub-em-profundidade)
  - [Conceitos do pub/sub](mensageria/i-tipos-de-mensagem.md#conceitos-do-pubsub)
  - [Aplicações reais de pub/sub](mensageria/i-tipos-de-mensagem.md#aplicações-reais-de-pubsub)
- [4. Consulta](mensageria/i-tipos-de-mensagem.md#4-consulta)
  - [Request-Reply sobre mensageria](mensageria/i-tipos-de-mensagem.md#request-reply-sobre-mensageria)
  - [Agregação de múltiplas fontes](mensageria/i-tipos-de-mensagem.md#agregação-de-múltiplas-fontes)
- [5. Como escolher — e os erros clássicos](mensageria/i-tipos-de-mensagem.md#5-como-escolher--e-os-erros-clássicos)

#### [II - MESSAGE BROKERS](mensageria/ii-message-brokers.md)

Modelos de organização, protocolos e as ferramentas.

- [1. O que é e por que existe](mensageria/ii-message-brokers.md#1-o-que-é-e-por-que-existe)
- [2. Funções principais](mensageria/ii-message-brokers.md#2-funções-principais)
- [3. Os três modelos de organização](mensageria/ii-message-brokers.md#3-os-três-modelos-de-organização)
  - [a) Baseado em fila (point-to-point)](mensageria/ii-message-brokers.md#a-baseado-em-fila-point-to-point)
  - [b) Baseado em tópico (publish/subscribe)](mensageria/ii-message-brokers.md#b-baseado-em-tópico-publishsubscribe)
  - [c) Baseado em padrão de roteamento](mensageria/ii-message-brokers.md#c-baseado-em-padrão-de-roteamento)
- [4. As duas famílias de broker](mensageria/ii-message-brokers.md#4-as-duas-famílias-de-broker)
- [5. Protocolos de mensagem](mensageria/ii-message-brokers.md#5-protocolos-de-mensagem)
  - [MQTT em detalhe — o protocolo da IoT](mensageria/ii-message-brokers.md#mqtt-em-detalhe--o-protocolo-da-iot)
- [6. As ferramentas](mensageria/ii-message-brokers.md#6-as-ferramentas)
  - [RabbitMQ](mensageria/ii-message-brokers.md#rabbitmq)
  - [Apache Kafka](mensageria/ii-message-brokers.md#apache-kafka)
  - [AWS SQS (+ SNS)](mensageria/ii-message-brokers.md#aws-sqs--sns)
  - [Azure Service Bus](mensageria/ii-message-brokers.md#azure-service-bus)
  - [Outras que aparecem](mensageria/ii-message-brokers.md#outras-que-aparecem)
- [7. Comparativo geral](mensageria/ii-message-brokers.md#7-comparativo-geral)
  - [Como escolher](mensageria/ii-message-brokers.md#como-escolher)

#### [III - PADRÕES DE ENTREGA](mensageria/iii-padroes-de-entrega.md)

At most / at least / exactly once e garantias do produtor.

- [1. Por que existem garantias diferentes](mensageria/iii-padroes-de-entrega.md#1-por-que-existem-garantias-diferentes)
- [2. At most once — no máximo uma vez](mensageria/iii-padroes-de-entrega.md#2-at-most-once--no-máximo-uma-vez)
- [3. At least once — pelo menos uma vez](mensageria/iii-padroes-de-entrega.md#3-at-least-once--pelo-menos-uma-vez)
- [4. Exactly once — exatamente uma vez](mensageria/iii-padroes-de-entrega.md#4-exactly-once--exatamente-uma-vez)
  - [A verdade incômoda](mensageria/iii-padroes-de-entrega.md#a-verdade-incômoda)
- [5. Comparativo e a escolha prática](mensageria/iii-padroes-de-entrega.md#5-comparativo-e-a-escolha-prática)
- [6. Garantias do lado do produtor](mensageria/iii-padroes-de-entrega.md#6-garantias-do-lado-do-produtor)

#### [IV - PADRÕES DE USO E OPERAÇÃO](mensageria/iv-padroes-de-uso-e-operacao.md)

Competing consumers, ordenação, DLQ, Outbox/Inbox, Spring.

- [1. Competing consumers — como se escala](mensageria/iv-padroes-de-uso-e-operacao.md#1-competing-consumers--como-se-escala)
- [2. Ordenação — o trade-off mais incômodo](mensageria/iv-padroes-de-uso-e-operacao.md#2-ordenação--o-trade-off-mais-incômodo)
- [3. Retry e Dead Letter Queue](mensageria/iv-padroes-de-uso-e-operacao.md#3-retry-e-dead-letter-queue)
- [4. Transactional messaging: Outbox e Inbox](mensageria/iv-padroes-de-uso-e-operacao.md#4-transactional-messaging-outbox-e-inbox)
- [5. Contrato e versionamento de mensagem](mensageria/iv-padroes-de-uso-e-operacao.md#5-contrato-e-versionamento-de-mensagem)
- [6. Observabilidade e operação](mensageria/iv-padroes-de-uso-e-operacao.md#6-observabilidade-e-operação)
- [7. Mensageria com Spring](mensageria/iv-padroes-de-uso-e-operacao.md#7-mensageria-com-spring)
- [8. Anti-padrões](mensageria/iv-padroes-de-uso-e-operacao.md#8-anti-padrões)
- [Checklist de mensageria](mensageria/iv-padroes-de-uso-e-operacao.md#checklist-de-mensageria)

<br>

### TEOREMA CAP

A leitura correta do teorema, os quadrantes, PACELC e níveis de consistência.

**[Conteúdo da matéria →](teorema-cap/README.md)**

- [1. As definições rigorosas](teorema-cap/README.md#1-as-definições-rigorosas)
- [2. A leitura correta: não é "escolha 2 de 3"](teorema-cap/README.md#2-a-leitura-correta-não-é-escolha-2-de-3)
- [3. Os três quadrantes na prática](teorema-cap/README.md#3-os-três-quadrantes-na-prática)
- [4. Cenário narrado: um saldo durante a partição](teorema-cap/README.md#4-cenário-narrado-um-saldo-durante-a-partição)
- [5. PACELC — a extensão que corrige a lacuna](teorema-cap/README.md#5-pacelc--a-extensão-que-corrige-a-lacuna)
- [6. Níveis de consistência](teorema-cap/README.md#6-níveis-de-consistência)
- [7. CAP, ACID e BASE são o mesmo assunto por ângulos diferentes](teorema-cap/README.md#7-cap-acid-e-base-são-o-mesmo-assunto-por-ângulos-diferentes)
- [8. A crítica moderna ao CAP](teorema-cap/README.md#8-a-crítica-moderna-ao-cap)

<br>

### gRPC e GRAPHQL

Os dois caminhos opostos para os preços que o REST cobra: payload de texto e endpoint fixo.

#### [Visão geral](grpc-e-graphql/README.md)

Comparativo REST × gRPC × GraphQL e critério de escolha.

- [Comparativo — a tabela que cai em prova](grpc-e-graphql/README.md#comparativo--a-tabela-que-cai-em-prova)
  - [Critério de escolha](grpc-e-graphql/README.md#critério-de-escolha)

#### [I - gRPC](grpc-e-graphql/i-grpc.md)

RPC, Protocol Buffers, channel e stub, HTTP/2, status codes.

- [1. O que é RPC?](grpc-e-graphql/i-grpc.md#1-o-que-é-rpc)
- [2. Google × gRPC](grpc-e-graphql/i-grpc.md#2-google--grpc)
  - [Funcionamento](grpc-e-graphql/i-grpc.md#funcionamento)
- [3. Protocol Buffers](grpc-e-graphql/i-grpc.md#3-protocol-buffers)
  - [Um `.proto` completo e comentado](grpc-e-graphql/i-grpc.md#um-proto-completo-e-comentado)
  - [Field numbers — o mecanismo de compatibilidade](grpc-e-graphql/i-grpc.md#field-numbers--o-mecanismo-de-compatibilidade)
  - [Tipos escalares e a pegadinha do proto3](grpc-e-graphql/i-grpc.md#tipos-escalares-e-a-pegadinha-do-proto3)
  - [Geração de código](grpc-e-graphql/i-grpc.md#geração-de-código)
- [4. Channel](grpc-e-graphql/i-grpc.md#4-channel)
- [5. Stub](grpc-e-graphql/i-grpc.md#5-stub)
- [6. Por que HTTP/2 importa](grpc-e-graphql/i-grpc.md#6-por-que-http2-importa)
- [7. Padrões de comunicação](grpc-e-graphql/i-grpc.md#7-padrões-de-comunicação)
- [8. Status codes do gRPC](grpc-e-graphql/i-grpc.md#8-status-codes-do-grpc)
- [9. Deadlines, cancelamento e interceptors](grpc-e-graphql/i-grpc.md#9-deadlines-cancelamento-e-interceptors)
- [10. gRPC em Java/Spring](grpc-e-graphql/i-grpc.md#10-grpc-em-javaspring)
- [11. Limitações e alternativas de borda](grpc-e-graphql/i-grpc.md#11-limitações-e-alternativas-de-borda)

#### [II - GRAPHQL](grpc-e-graphql/ii-graphql.md)

Schema e SDL, query, resolvers, DataLoader, Spring for GraphQL.

- [1. O problema que ele resolve](grpc-e-graphql/ii-graphql.md#1-o-problema-que-ele-resolve)
- [2. O Schema e a SDL](grpc-e-graphql/ii-graphql.md#2-o-schema-e-a-sdl)
  - [Notação de nulidade — a pegadinha mais comum](grpc-e-graphql/ii-graphql.md#notação-de-nulidade--a-pegadinha-mais-comum)
- [3. Query — o lado do cliente](grpc-e-graphql/ii-graphql.md#3-query--o-lado-do-cliente)
- [4. Mutation e Subscription](grpc-e-graphql/ii-graphql.md#4-mutation-e-subscription)
- [5. Resolvers e o resolver chain](grpc-e-graphql/ii-graphql.md#5-resolvers-e-o-resolver-chain)
  - [DataLoader — batching e cache por requisição](grpc-e-graphql/ii-graphql.md#dataloader--batching-e-cache-por-requisição)
- [6. Spring for GraphQL](grpc-e-graphql/ii-graphql.md#6-spring-for-graphql)
- [7. Erros — por que vem 200](grpc-e-graphql/ii-graphql.md#7-erros--por-que-vem-200)
- [8. Paginação e evolução do schema](grpc-e-graphql/ii-graphql.md#8-paginação-e-evolução-do-schema)
  - [Cursor connections (padrão Relay)](grpc-e-graphql/ii-graphql.md#cursor-connections-padrão-relay)
  - [Versionamento: não existe](grpc-e-graphql/ii-graphql.md#versionamento-não-existe)
- [9. Limitações e riscos](grpc-e-graphql/ii-graphql.md#9-limitações-e-riscos)
- [10. Quando usar (e quando não)](grpc-e-graphql/ii-graphql.md#10-quando-usar-e-quando-não)

<br>

---

## Java e frameworks

### SPRING E SPRING BOOT

A base que as outras matérias de Spring supõem: o container, o bean, o proxy e o que o Boot acrescenta.

#### [Visão geral](spring-e-spring-boot/README.md)

IoC e DI, o vocabulário mínimo, Spring × Spring Boot, o ecossistema e o boot passo a passo.

- [1. O problema: quem cria os objetos?](spring-e-spring-boot/README.md#1-o-problema-quem-cria-os-objetos)
- [2. Inversão de controle e injeção de dependência](spring-e-spring-boot/README.md#2-inversão-de-controle-e-injeção-de-dependência)
- [3. O vocabulário mínimo](spring-e-spring-boot/README.md#3-o-vocabulário-mínimo)
- [4. Spring × Spring Boot — a confusão mais comum](spring-e-spring-boot/README.md#4-spring--spring-boot--a-confusão-mais-comum)
- [5. O ecossistema](spring-e-spring-boot/README.md#5-o-ecossistema)
- [6. Como uma aplicação Spring Boot sobe](spring-e-spring-boot/README.md#6-como-uma-aplicação-spring-boot-sobe)
- [Capítulos](spring-e-spring-boot/README.md#capítulos)

#### [I - IoC E BEANS](spring-e-spring-boot/i-ioc-e-beans.md)

O container, declarar e injetar beans, ambiguidade, ciclo de vida, escopos, dependência circular.

- [1. O container: `ApplicationContext`](spring-e-spring-boot/i-ioc-e-beans.md#1-o-container-applicationcontext)
- [2. As três formas de declarar um bean](spring-e-spring-boot/i-ioc-e-beans.md#2-as-três-formas-de-declarar-um-bean)
  - [a) `@Component` e os *stereotypes* — para as suas classes](spring-e-spring-boot/i-ioc-e-beans.md#a-component-e-os-stereotypes--para-as-suas-classes)
  - [b) `@Bean` dentro de `@Configuration` — para classes que não são suas](spring-e-spring-boot/i-ioc-e-beans.md#b-bean-dentro-de-configuration--para-classes-que-não-são-suas)
  - [c) Registro programático — o caso raro](spring-e-spring-boot/i-ioc-e-beans.md#c-registro-programático--o-caso-raro)
- [3. As três formas de injetar — e por que construtor](spring-e-spring-boot/i-ioc-e-beans.md#3-as-três-formas-de-injetar--e-por-que-construtor)
- [4. Quando há mais de um candidato](spring-e-spring-boot/i-ioc-e-beans.md#4-quando-há-mais-de-um-candidato)
- [5. O ciclo de vida de um bean](spring-e-spring-boot/i-ioc-e-beans.md#5-o-ciclo-de-vida-de-um-bean)
- [6. Escopos](spring-e-spring-boot/i-ioc-e-beans.md#6-escopos)
- [7. `@Lazy` e a inicialização antecipada](spring-e-spring-boot/i-ioc-e-beans.md#7-lazy-e-a-inicialização-antecipada)
- [8. Dependência circular](spring-e-spring-boot/i-ioc-e-beans.md#8-dependência-circular)
- [9. Beans condicionais](spring-e-spring-boot/i-ioc-e-beans.md#9-beans-condicionais)
- [10. Como inspecionar o container](spring-e-spring-boot/i-ioc-e-beans.md#10-como-inspecionar-o-container)

#### [II - AOP E PROXIES](spring-e-spring-boot/ii-aop-e-proxies.md)

Preocupações transversais, vocabulário do AOP, JDK proxy × CGLIB, limitações, `@Aspect`, eventos.

- [1. O problema: preocupações transversais](spring-e-spring-boot/ii-aop-e-proxies.md#1-o-problema-preocupações-transversais)
- [2. O vocabulário do AOP](spring-e-spring-boot/ii-aop-e-proxies.md#2-o-vocabulário-do-aop)
- [3. Como o Spring implementa: o proxy](spring-e-spring-boot/ii-aop-e-proxies.md#3-como-o-spring-implementa-o-proxy)
- [4. As limitações estruturais do proxy](spring-e-spring-boot/ii-aop-e-proxies.md#4-as-limitações-estruturais-do-proxy)
- [5. Escrevendo um aspecto próprio](spring-e-spring-boot/ii-aop-e-proxies.md#5-escrevendo-um-aspecto-próprio)
- [6. As anotações que dependem de proxy](spring-e-spring-boot/ii-aop-e-proxies.md#6-as-anotações-que-dependem-de-proxy)
- [7. Eventos, `@Async` e `@Scheduled`](spring-e-spring-boot/ii-aop-e-proxies.md#7-eventos-async-e-scheduled)
- [8. Spring AOP × AspectJ](spring-e-spring-boot/ii-aop-e-proxies.md#8-spring-aop--aspectj)

#### [III - SPRING BOOT](spring-e-spring-boot/iii-spring-boot.md)

`@SpringBootApplication`, autoconfiguração, starters, configuração e perfis, Actuator, empacotamento, Boot 3.

- [1. O que o Boot acrescenta](spring-e-spring-boot/iii-spring-boot.md#1-o-que-o-boot-acrescenta)
- [2. `@SpringBootApplication` decomposto](spring-e-spring-boot/iii-spring-boot.md#2-springbootapplication-decomposto)
- [3. Autoconfiguração: o mecanismo](spring-e-spring-boot/iii-spring-boot.md#3-autoconfiguração-o-mecanismo)
  - [Starters](spring-e-spring-boot/iii-spring-boot.md#starters)
- [4. Configuração externalizada](spring-e-spring-boot/iii-spring-boot.md#4-configuração-externalizada)
  - [`@Value` × `@ConfigurationProperties`](spring-e-spring-boot/iii-spring-boot.md#value--configurationproperties)
- [5. Perfis](spring-e-spring-boot/iii-spring-boot.md#5-perfis)
- [6. Actuator](spring-e-spring-boot/iii-spring-boot.md#6-actuator)
- [7. DevTools e produtividade](spring-e-spring-boot/iii-spring-boot.md#7-devtools-e-produtividade)
- [8. Empacotamento](spring-e-spring-boot/iii-spring-boot.md#8-empacotamento)
- [9. O que mudou no Spring Boot 3](spring-e-spring-boot/iii-spring-boot.md#9-o-que-mudou-no-spring-boot-3)

<br>

### Spring MVC - APIs RESTful

Como o Spring transforma HTTP em chamada de método — e como projetar a API para resistir a volume, mudança e retry.

#### [Visão geral](spring-mvc-apis-restful/README.md)

Índice da matéria e relacionados.

_Só a apresentação da matéria, o índice dos capítulos e os links relacionados._

#### [I - INTRODUÇÃO SOBRE O SPRING MVC](spring-mvc-apis-restful/i-introducao-sobre-o-spring-mvc.md)

Origem do Spring, o problema dos EJBs e os componentes do framework.

_Arquivo curto, sem subdivisões — leia direto._

#### [II - FUNDAMENTOS REST](spring-mvc-apis-restful/ii-fundamentos-rest.md)

Fielding, Richardson, verbos, status codes, URIs, HATEOAS.

- [1. O que REST é (e o que não é)](spring-mvc-apis-restful/ii-fundamentos-rest.md#1-o-que-rest-é-e-o-que-não-é)
- [2. As seis restrições de Fielding](spring-mvc-apis-restful/ii-fundamentos-rest.md#2-as-seis-restrições-de-fielding)
- [3. Modelo de Maturidade de Richardson](spring-mvc-apis-restful/ii-fundamentos-rest.md#3-modelo-de-maturidade-de-richardson)
- [4. Métodos HTTP: seguro, idempotente, cacheável](spring-mvc-apis-restful/ii-fundamentos-rest.md#4-métodos-http-seguro-idempotente-cacheável)
  - [`POST` × `PUT` × `PATCH`](spring-mvc-apis-restful/ii-fundamentos-rest.md#post--put--patch)
- [5. Status codes](spring-mvc-apis-restful/ii-fundamentos-rest.md#5-status-codes)
- [6. Modelagem de recursos e URIs](spring-mvc-apis-restful/ii-fundamentos-rest.md#6-modelagem-de-recursos-e-uris)
- [7. HATEOAS](spring-mvc-apis-restful/ii-fundamentos-rest.md#7-hateoas)
- [8. REST no meio dos outros estilos](spring-mvc-apis-restful/ii-fundamentos-rest.md#8-rest-no-meio-dos-outros-estilos)

#### [III - SPRING MVC NA PRÁTICA](spring-mvc-apis-restful/iii-spring-mvc-na-pratica.md)

DispatcherServlet, DTOs, Bean Validation, ProblemDetail, Jackson.

- [1. O ciclo do DispatcherServlet](spring-mvc-apis-restful/iii-spring-mvc-na-pratica.md#1-o-ciclo-do-dispatcherservlet)
- [2. Mapeamento de requisições](spring-mvc-apis-restful/iii-spring-mvc-na-pratica.md#2-mapeamento-de-requisições)
  - [Resolvendo os parâmetros](spring-mvc-apis-restful/iii-spring-mvc-na-pratica.md#resolvendo-os-parâmetros)
- [3. DTOs — e por que nunca expor a entidade JPA](spring-mvc-apis-restful/iii-spring-mvc-na-pratica.md#3-dtos--e-por-que-nunca-expor-a-entidade-jpa)
- [4. Bean Validation](spring-mvc-apis-restful/iii-spring-mvc-na-pratica.md#4-bean-validation)
  - [Grupos de validação](spring-mvc-apis-restful/iii-spring-mvc-na-pratica.md#grupos-de-validação)
  - [Validação customizada](spring-mvc-apis-restful/iii-spring-mvc-na-pratica.md#validação-customizada)
- [5. Tratamento de erros](spring-mvc-apis-restful/iii-spring-mvc-na-pratica.md#5-tratamento-de-erros)
  - [`ProblemDetail` — RFC 9457](spring-mvc-apis-restful/iii-spring-mvc-na-pratica.md#problemdetail--rfc-9457)
  - [`@RestControllerAdvice`](spring-mvc-apis-restful/iii-spring-mvc-na-pratica.md#restcontrolleradvice)
- [6. `ResponseEntity` e o header `Location`](spring-mvc-apis-restful/iii-spring-mvc-na-pratica.md#6-responseentity-e-o-header-location)
- [7. Serialização com Jackson](spring-mvc-apis-restful/iii-spring-mvc-na-pratica.md#7-serialização-com-jackson)
- [8. Filtro × Interceptor × AOP](spring-mvc-apis-restful/iii-spring-mvc-na-pratica.md#8-filtro--interceptor--aop)
- [9. Spring MVC × WebFlux](spring-mvc-apis-restful/iii-spring-mvc-na-pratica.md#9-spring-mvc--webflux)

#### [IV - EVOLUÇÃO DA API](spring-mvc-apis-restful/iv-evolucao-da-api.md)

Paginação, versionamento, cache HTTP, idempotência, CORS, OpenAPI.

- [1. Paginação, filtro e ordenação](spring-mvc-apis-restful/iv-evolucao-da-api.md#1-paginação-filtro-e-ordenação)
  - [`Page` × `Slice` × keyset](spring-mvc-apis-restful/iv-evolucao-da-api.md#page--slice--keyset)
- [2. Versionamento](spring-mvc-apis-restful/iv-evolucao-da-api.md#2-versionamento)
  - [As quatro estratégias](spring-mvc-apis-restful/iv-evolucao-da-api.md#as-quatro-estratégias)
- [3. Cache HTTP](spring-mvc-apis-restful/iv-evolucao-da-api.md#3-cache-http)
  - [ETag para concorrência: `If-Match`](spring-mvc-apis-restful/iv-evolucao-da-api.md#etag-para-concorrência-if-match)
- [4. Idempotência em `POST`](spring-mvc-apis-restful/iv-evolucao-da-api.md#4-idempotência-em-post)
- [5. Operações assíncronas](spring-mvc-apis-restful/iv-evolucao-da-api.md#5-operações-assíncronas)
- [6. Rate limiting](spring-mvc-apis-restful/iv-evolucao-da-api.md#6-rate-limiting)
- [7. CORS](spring-mvc-apis-restful/iv-evolucao-da-api.md#7-cors)
- [8. Documentação — OpenAPI](spring-mvc-apis-restful/iv-evolucao-da-api.md#8-documentação--openapi)
- [9. Segurança de API — os itens que aparecem no design](spring-mvc-apis-restful/iv-evolucao-da-api.md#9-segurança-de-api--os-itens-que-aparecem-no-design)
- [10. Checklist de design de API](spring-mvc-apis-restful/iv-evolucao-da-api.md#10-checklist-de-design-de-api)

<br>

### SPRING DATA JPA

Anotações e mapeamento, persistence context, N+1, transações e concorrência.

#### [Visão geral](spring-data-jpa/README.md)

Mapeamento de tabelas, herança, embedded, callbacks, named queries.

- [Capítulos](spring-data-jpa/README.md#capítulos)
  - [1. Estrutura e Mapeamento de Tabelas](spring-data-jpa/README.md#1-estrutura-e-mapeamento-de-tabelas)
  - [3. Estratégias de Herança](spring-data-jpa/README.md#3-estratégias-de-herança)
  - [4. Componentes Embutidos (Embedded)](spring-data-jpa/README.md#4-componentes-embutidos-embedded)
  - [5. Gatilhos de Ciclo de Vida (Lifecycle Callbacks)](spring-data-jpa/README.md#5-gatilhos-de-ciclo-de-vida-lifecycle-callbacks)
  - [6. Consultas Nomeadas (Named Queries)](spring-data-jpa/README.md#6-consultas-nomeadas-named-queries)

#### [I - PERSISTENCE CONTEXT E CICLO DE VIDA](spring-data-jpa/i-persistence-context-e-ciclo-de-vida.md)

Estados da entidade, `EntityManager`, flush, LAZY × EAGER, cascade.

- [1. O que é o Persistence Context](spring-data-jpa/i-persistence-context-e-ciclo-de-vida.md#1-o-que-é-o-persistence-context)
- [2. Os quatro estados da entidade](spring-data-jpa/i-persistence-context-e-ciclo-de-vida.md#2-os-quatro-estados-da-entidade)
- [3. As operações do `EntityManager`](spring-data-jpa/i-persistence-context-e-ciclo-de-vida.md#3-as-operações-do-entitymanager)
  - [`persist` × `merge` — a diferença que pega todo mundo](spring-data-jpa/i-persistence-context-e-ciclo-de-vida.md#persist--merge--a-diferença-que-pega-todo-mundo)
- [4. Flush: quando o SQL realmente sai](spring-data-jpa/i-persistence-context-e-ciclo-de-vida.md#4-flush-quando-o-sql-realmente-sai)
- [5. LAZY × EAGER e os proxies](spring-data-jpa/i-persistence-context-e-ciclo-de-vida.md#5-lazy--eager-e-os-proxies)
  - [`LazyInitializationException`](spring-data-jpa/i-persistence-context-e-ciclo-de-vida.md#lazyinitializationexception)
- [6. Open Session In View (OSIV)](spring-data-jpa/i-persistence-context-e-ciclo-de-vida.md#6-open-session-in-view-osiv)
- [7. Cascade e orphanRemoval](spring-data-jpa/i-persistence-context-e-ciclo-de-vida.md#7-cascade-e-orphanremoval)
  - [Relacionamento bidirecional precisa de método auxiliar](spring-data-jpa/i-persistence-context-e-ciclo-de-vida.md#relacionamento-bidirecional-precisa-de-método-auxiliar)
- [8. Callbacks e auditoria](spring-data-jpa/i-persistence-context-e-ciclo-de-vida.md#8-callbacks-e-auditoria)
- [9. Cache de segundo nível (L2)](spring-data-jpa/i-persistence-context-e-ciclo-de-vida.md#9-cache-de-segundo-nível-l2)

#### [II - CONSULTAS E PERFORMANCE](spring-data-jpa/ii-consultas-e-performance.md)

Derived queries, `@Query`, projections, paginação, N+1, batch.

- [1. A hierarquia de repositórios](spring-data-jpa/ii-consultas-e-performance.md#1-a-hierarquia-de-repositórios)
- [2. Derived queries — consulta pelo nome do método](spring-data-jpa/ii-consultas-e-performance.md#2-derived-queries--consulta-pelo-nome-do-método)
- [3. `@Query` — JPQL e SQL nativo](spring-data-jpa/ii-consultas-e-performance.md#3-query--jpql-e-sql-nativo)
- [4. Projections — não carregue a entidade inteira para ler](spring-data-jpa/ii-consultas-e-performance.md#4-projections--não-carregue-a-entidade-inteira-para-ler)
- [5. Paginação e ordenação](spring-data-jpa/ii-consultas-e-performance.md#5-paginação-e-ordenação)
- [6. O problema N+1 — o mais importante da matéria](spring-data-jpa/ii-consultas-e-performance.md#6-o-problema-n1--o-mais-importante-da-matéria)
  - [Como detectar](spring-data-jpa/ii-consultas-e-performance.md#como-detectar)
  - [As soluções](spring-data-jpa/ii-consultas-e-performance.md#as-soluções)
  - [Duas pegadinhas de `JOIN FETCH`](spring-data-jpa/ii-consultas-e-performance.md#duas-pegadinhas-de-join-fetch)
- [7. Inserção em lote](spring-data-jpa/ii-consultas-e-performance.md#7-inserção-em-lote)
- [8. Consultas dinâmicas: Specification](spring-data-jpa/ii-consultas-e-performance.md#8-consultas-dinâmicas-specification)
- [9. Checklist de performance](spring-data-jpa/ii-consultas-e-performance.md#9-checklist-de-performance)

#### [III - TRANSAÇÕES E CONCORRÊNCIA](spring-data-jpa/iii-transacoes-e-concorrencia.md)

`@Transactional`, propagação, rollback, locking, isolamento, migrations.

- [1. Como `@Transactional` funciona](spring-data-jpa/iii-transacoes-e-concorrencia.md#1-como-transactional-funciona)
- [2. Propagação](spring-data-jpa/iii-transacoes-e-concorrencia.md#2-propagação)
- [3. Rollback: a regra que pega todo mundo](spring-data-jpa/iii-transacoes-e-concorrencia.md#3-rollback-a-regra-que-pega-todo-mundo)
- [4. As pegadinhas do proxy](spring-data-jpa/iii-transacoes-e-concorrencia.md#4-as-pegadinhas-do-proxy)
- [5. `readOnly` e `timeout`](spring-data-jpa/iii-transacoes-e-concorrencia.md#5-readonly-e-timeout)
- [6. Locking otimista — `@Version`](spring-data-jpa/iii-transacoes-e-concorrencia.md#6-locking-otimista--version)
- [7. Locking pessimista](spring-data-jpa/iii-transacoes-e-concorrencia.md#7-locking-pessimista)
- [8. Isolamento](spring-data-jpa/iii-transacoes-e-concorrencia.md#8-isolamento)
- [9. Efeitos colaterais e o commit](spring-data-jpa/iii-transacoes-e-concorrencia.md#9-efeitos-colaterais-e-o-commit)
- [10. Migrations — o esquema também é código](spring-data-jpa/iii-transacoes-e-concorrencia.md#10-migrations--o-esquema-também-é-código)
- [Checklist de PR (JPA e transações)](spring-data-jpa/iii-transacoes-e-concorrencia.md#checklist-de-pr-jpa-e-transações)

<br>

### SPRING SECURITY

Parte 1: conceitos de AuthN/AuthZ, JWT e OAuth2. Parte 2: o framework — filter chain, resource server e method security.

#### [Conteúdo da matéria](spring-security/README.md)

Parte 1 — conceitos de AuthN/AuthZ; parte 2 — o framework na prática.

- [1.1 AuthN vs AuthZ](spring-security/README.md#11-authn-vs-authz)
- [1.2 Vocabulário essencial](spring-security/README.md#12-vocabulário-essencial)
- [1.3 Fatores de autenticação](spring-security/README.md#13-fatores-de-autenticação)
- [1.4 Armazenamento de senhas](spring-security/README.md#14-armazenamento-de-senhas)
- [1.5 Estado da sessão: Stateful vs Stateless](spring-security/README.md#15-estado-da-sessão-stateful-vs-stateless)
  - [Sessão no servidor (stateful)](spring-security/README.md#sessão-no-servidor-stateful)
  - [Token auto-contido (stateless)](spring-security/README.md#token-auto-contido-stateless)
- [1.6 JWT em detalhe](spring-security/README.md#16-jwt-em-detalhe)
- [1.7 Onde guardar o token no cliente](spring-security/README.md#17-onde-guardar-o-token-no-cliente)
- [1.8 Modelos de autorização](spring-security/README.md#18-modelos-de-autorização)
  - [RBAC — Role-Based Access Control](spring-security/README.md#rbac--role-based-access-control)
  - [ABAC — Attribute-Based Access Control](spring-security/README.md#abac--attribute-based-access-control)
  - [ReBAC — Relationship-Based Access Control](spring-security/README.md#rebac--relationship-based-access-control)
  - [ACL — Access Control List](spring-security/README.md#acl--access-control-list)
  - [PEP / PDP / PIP (vocabulário de arquitetura)](spring-security/README.md#pep--pdp--pip-vocabulário-de-arquitetura)
- [1.9 OAuth 2.0](spring-security/README.md#19-oauth-20)
  - [Papéis](spring-security/README.md#papéis)
  - [Fluxos (grant types)](spring-security/README.md#fluxos-grant-types)
  - [Scopes vs Roles](spring-security/README.md#scopes-vs-roles)
- [1.10 OpenID Connect (OIDC)](spring-security/README.md#110-openid-connect-oidc)
- [1.11 Autenticação serviço-a-serviço](spring-security/README.md#111-autenticação-serviço-a-serviço)
- [1.12 Ameaças e defesas (checklist)](spring-security/README.md#112-ameaças-e-defesas-checklist)
- [2.1 Como o Spring Security se encaixa](spring-security/README.md#21-como-o-spring-security-se-encaixa)
- [2.2 Objetos centrais](spring-security/README.md#22-objetos-centrais)
- [2.3 Fluxo de autenticação](spring-security/README.md#23-fluxo-de-autenticação)
- [2.4 Configuração moderna (Spring Security 6.x)](spring-security/README.md#24-configuração-moderna-spring-security-6x)
  - [Múltiplas cadeias de filtro](spring-security/README.md#múltiplas-cadeias-de-filtro)
- [2.5 Roles vs Authorities no Spring](spring-security/README.md#25-roles-vs-authorities-no-spring)
- [2.6 UserDetailsService (autenticação com banco próprio)](spring-security/README.md#26-userdetailsservice-autenticação-com-banco-próprio)
- [2.7 Resource Server com JWT](spring-security/README.md#27-resource-server-com-jwt)
- [2.8 Emitindo JWT próprio (sem auth server externo)](spring-security/README.md#28-emitindo-jwt-próprio-sem-auth-server-externo)
- [2.9 Method Security](spring-security/README.md#29-method-security)
  - [Bean de política (mais limpo que SpEL longo)](spring-security/README.md#bean-de-política-mais-limpo-que-spel-longo)
- [2.10 CSRF — quando ligar e quando desligar](spring-security/README.md#210-csrf--quando-ligar-e-quando-desligar)
- [2.11 CORS](spring-security/README.md#211-cors)
- [2.12 Testes](spring-security/README.md#212-testes)
- [2.13 Ecossistema Spring relacionado](spring-security/README.md#213-ecossistema-spring-relacionado)
- [Checklist de revisão de PR (segurança)](spring-security/README.md#checklist-de-revisão-de-pr-segurança)

#### [CRIPTOGRAFIA](spring-security/criptografia.md)

Hash × simétrica × assimétrica, KDF, HMAC, PKI, TLS.

- [1. As quatro propriedades que a criptografia entrega](spring-security/criptografia.md#1-as-quatro-propriedades-que-a-criptografia-entrega)
- [2. As três famílias](spring-security/criptografia.md#2-as-três-famílias)
  - [2.1 Hash](spring-security/criptografia.md#21-hash)
  - [2.2 Simétrica](spring-security/criptografia.md#22-simétrica)
  - [2.3 Assimétrica](spring-security/criptografia.md#23-assimétrica)
- [3. Cifra híbrida — como as coisas realmente funcionam](spring-security/criptografia.md#3-cifra-híbrida--como-as-coisas-realmente-funcionam)
- [4. Hash vs KDF — a distinção que importa para senha](spring-security/criptografia.md#4-hash-vs-kdf--a-distinção-que-importa-para-senha)
- [5. MAC, HMAC e assinatura digital](spring-security/criptografia.md#5-mac-hmac-e-assinatura-digital)
- [6. Certificados e PKI](spring-security/criptografia.md#6-certificados-e-pki)
- [7. TLS em alto nível](spring-security/criptografia.md#7-tls-em-alto-nível)
- [8. Em trânsito vs em repouso](spring-security/criptografia.md#8-em-trânsito-vs-em-repouso)
- [9. Aleatoriedade](spring-security/criptografia.md#9-aleatoriedade)
- [10. Regras práticas](spring-security/criptografia.md#10-regras-práticas)
- [11. Mapa rápido: qual ferramenta para qual problema](spring-security/criptografia.md#11-mapa-rápido-qual-ferramenta-para-qual-problema)
- [Glossário](spring-security/criptografia.md#glossário)

<br>

### TESTES EM SOFTWARE

Pirâmide, TDD, BDD, cobertura — e a prática com JUnit 5, Mockito e o ecossistema de testes do Spring.

#### [Visão geral](testes-em-software/README.md)

Pirâmide, tipos, vocabulário, TDD, BDD, cobertura, anti-padrões.

- [1. A pirâmide de testes](testes-em-software/README.md#1-a-pirâmide-de-testes)
  - [Os anti-padrões da forma](testes-em-software/README.md#os-anti-padrões-da-forma)
  - [A crítica moderna: Testing Trophy](testes-em-software/README.md#a-crítica-moderna-testing-trophy)
- [2. Os tipos de teste](testes-em-software/README.md#2-os-tipos-de-teste)
- [3. Vocabulário](testes-em-software/README.md#3-vocabulário)
  - [FIRST — as propriedades de um bom teste](testes-em-software/README.md#first--as-propriedades-de-um-bom-teste)
- [4. Estrutura e nomenclatura](testes-em-software/README.md#4-estrutura-e-nomenclatura)
  - [AAA — Arrange, Act, Assert](testes-em-software/README.md#aaa--arrange-act-assert)
  - [Nome do teste](testes-em-software/README.md#nome-do-teste)
- [5. TDD — Test Driven Development](testes-em-software/README.md#5-tdd--test-driven-development)
  - [O ciclo Red-Green-Refactor](testes-em-software/README.md#o-ciclo-red-green-refactor)
  - [As três leis (Uncle Bob)](testes-em-software/README.md#as-três-leis-uncle-bob)
  - [Exemplo passo a passo](testes-em-software/README.md#exemplo-passo-a-passo)
  - [Variações e limites](testes-em-software/README.md#variações-e-limites)
- [6. BDD — Behavior Driven Development](testes-em-software/README.md#6-bdd--behavior-driven-development)
  - [Gherkin — Given / When / Then](testes-em-software/README.md#gherkin--given--when--then)
  - [Step definitions (Cucumber + Java)](testes-em-software/README.md#step-definitions-cucumber--java)
- [7. Cobertura de código](testes-em-software/README.md#7-cobertura-de-código)
  - [Os tipos de cobertura](testes-em-software/README.md#os-tipos-de-cobertura)
  - [Por que 100% de cobertura não significa qualidade](testes-em-software/README.md#por-que-100-de-cobertura-não-significa-qualidade)
  - [Teste de mutação — a métrica que mede o teste](testes-em-software/README.md#teste-de-mutação--a-métrica-que-mede-o-teste)
- [8. Dados de teste](testes-em-software/README.md#8-dados-de-teste)
- [9. Anti-padrões](testes-em-software/README.md#9-anti-padrões)
- [10. Estratégia por camada (Clean Architecture)](testes-em-software/README.md#10-estratégia-por-camada-clean-architecture)
- [11. Testes no pipeline](testes-em-software/README.md#11-testes-no-pipeline)
- [Checklist de revisão de PR (testes)](testes-em-software/README.md#checklist-de-revisão-de-pr-testes)

#### [I - JUNIT 5 E ASSERTJ](testes-em-software/i-junit-5-e-assertj.md)

Arquitetura do JUnit 5, ciclo de vida, assertions, parametrizados, AssertJ.

- [1. A arquitetura do JUnit 5](testes-em-software/i-junit-5-e-assertj.md#1-a-arquitetura-do-junit-5)
  - [JUnit 4 → JUnit 5: o de-para](testes-em-software/i-junit-5-e-assertj.md#junit-4--junit-5-o-de-para)
- [2. Ciclo de vida](testes-em-software/i-junit-5-e-assertj.md#2-ciclo-de-vida)
- [3. Assertions do Jupiter](testes-em-software/i-junit-5-e-assertj.md#3-assertions-do-jupiter)
  - [`assertAll` — agrupando verificações do mesmo comportamento](testes-em-software/i-junit-5-e-assertj.md#assertall--agrupando-verificações-do-mesmo-comportamento)
  - [Exceções](testes-em-software/i-junit-5-e-assertj.md#exceções)
  - [Timeout](testes-em-software/i-junit-5-e-assertj.md#timeout)
- [4. Organização e legibilidade](testes-em-software/i-junit-5-e-assertj.md#4-organização-e-legibilidade)
  - [Assumptions — pular em vez de falhar](testes-em-software/i-junit-5-e-assertj.md#assumptions--pular-em-vez-de-falhar)
- [5. Testes parametrizados](testes-em-software/i-junit-5-e-assertj.md#5-testes-parametrizados)
- [6. Injeção de parâmetros e extensões](testes-em-software/i-junit-5-e-assertj.md#6-injeção-de-parâmetros-e-extensões)
  - [Execução paralela](testes-em-software/i-junit-5-e-assertj.md#execução-paralela)
- [7. AssertJ](testes-em-software/i-junit-5-e-assertj.md#7-assertj)
  - [Strings, números e datas](testes-em-software/i-junit-5-e-assertj.md#strings-números-e-datas)
  - [Coleções — onde o AssertJ brilha](testes-em-software/i-junit-5-e-assertj.md#coleções--onde-o-assertj-brilha)
  - [Exceções](testes-em-software/i-junit-5-e-assertj.md#exceções)
  - [Comparação de objetos inteiros](testes-em-software/i-junit-5-e-assertj.md#comparação-de-objetos-inteiros)
  - [Soft assertions](testes-em-software/i-junit-5-e-assertj.md#soft-assertions)
  - [Asserts customizados de domínio](testes-em-software/i-junit-5-e-assertj.md#asserts-customizados-de-domínio)
  - [Qual usar?](testes-em-software/i-junit-5-e-assertj.md#qual-usar)

#### [II - TEST DOUBLES E MOCKITO](testes-em-software/ii-test-doubles-e-mockito.md)

Stub × mock, stubbing, matchers, verificação, spy, BDDMockito.

- [1. Test double — o conceito](testes-em-software/ii-test-doubles-e-mockito.md#1-test-double--o-conceito)
  - [A distinção que realmente importa: stub × mock](testes-em-software/ii-test-doubles-e-mockito.md#a-distinção-que-realmente-importa-stub--mock)
  - [Quando um Fake ganha do Mock](testes-em-software/ii-test-doubles-e-mockito.md#quando-um-fake-ganha-do-mock)
- [2. Mockito — o essencial](testes-em-software/ii-test-doubles-e-mockito.md#2-mockito--o-essencial)
  - [Comportamento padrão de um mock](testes-em-software/ii-test-doubles-e-mockito.md#comportamento-padrão-de-um-mock)
  - [Stubbing](testes-em-software/ii-test-doubles-e-mockito.md#stubbing)
- [3. Argument matchers](testes-em-software/ii-test-doubles-e-mockito.md#3-argument-matchers)
- [4. Verificação de interações](testes-em-software/ii-test-doubles-e-mockito.md#4-verificação-de-interações)
  - [ArgumentCaptor — inspecionar o que foi passado](testes-em-software/ii-test-doubles-e-mockito.md#argumentcaptor--inspecionar-o-que-foi-passado)
- [5. Spy e mock parcial](testes-em-software/ii-test-doubles-e-mockito.md#5-spy-e-mock-parcial)
- [6. Strict stubs](testes-em-software/ii-test-doubles-e-mockito.md#6-strict-stubs)
- [7. BDDMockito](testes-em-software/ii-test-doubles-e-mockito.md#7-bddmockito)
- [8. Casos difíceis](testes-em-software/ii-test-doubles-e-mockito.md#8-casos-difíceis)
- [9. O que não mockar](testes-em-software/ii-test-doubles-e-mockito.md#9-o-que-não-mockar)
  - [Ciclo vicioso do teste que testa o mock](testes-em-software/ii-test-doubles-e-mockito.md#ciclo-vicioso-do-teste-que-testa-o-mock)

#### [III - TESTES NO SPRING](testes-em-software/iii-testes-no-spring.md)

`@SpringBootTest`, slices, Testcontainers, segurança, ArchUnit.

- [1. O que vem no `spring-boot-starter-test`](testes-em-software/iii-testes-no-spring.md#1-o-que-vem-no-spring-boot-starter-test)
- [2. A decisão central: quanto de Spring subir](testes-em-software/iii-testes-no-spring.md#2-a-decisão-central-quanto-de-spring-subir)
  - [Cache de contexto — o que faz a suíte ser rápida ou lenta](testes-em-software/iii-testes-no-spring.md#cache-de-contexto--o-que-faz-a-suíte-ser-rápida-ou-lenta)
- [3. `@SpringBootTest`](testes-em-software/iii-testes-no-spring.md#3-springboottest)
- [4. Slices](testes-em-software/iii-testes-no-spring.md#4-slices)
  - [`@WebMvcTest` — a camada web isolada](testes-em-software/iii-testes-no-spring.md#webmvctest--a-camada-web-isolada)
  - [`@MockBean` está deprecado](testes-em-software/iii-testes-no-spring.md#mockbean-está-deprecado)
  - [`@DataJpaTest` — a camada de persistência](testes-em-software/iii-testes-no-spring.md#datajpatest--a-camada-de-persistência)
- [5. Testcontainers](testes-em-software/iii-testes-no-spring.md#5-testcontainers)
- [6. Dados, propriedades e configuração de teste](testes-em-software/iii-testes-no-spring.md#6-dados-propriedades-e-configuração-de-teste)
  - [A pegadinha do `@Transactional` no teste](testes-em-software/iii-testes-no-spring.md#a-pegadinha-do-transactional-no-teste)
- [7. Testando segurança](testes-em-software/iii-testes-no-spring.md#7-testando-segurança)
- [8. Dependências HTTP externas](testes-em-software/iii-testes-no-spring.md#8-dependências-http-externas)
- [9. ArchUnit — testando a arquitetura](testes-em-software/iii-testes-no-spring.md#9-archunit--testando-a-arquitetura)
- [10. Estratégia de suíte](testes-em-software/iii-testes-no-spring.md#10-estratégia-de-suíte)
- [Checklist de PR (testes no Spring)](testes-em-software/iii-testes-no-spring.md#checklist-de-pr-testes-no-spring)

<br>

### QUARKUS

O framework Java desenhado para container: trabalho antecipado para o build, imagem nativa e o comparativo com o Spring.

#### [Visão geral](quarkus/README.md)

O problema que resolve, build-time augmentation, modos JVM e nativo, onde é usado.

- [1. Antes de tudo: o que uma aplicação Java faz, do código ao ar](quarkus/README.md#1-antes-de-tudo-o-que-uma-aplicação-java-faz-do-código-ao-ar)
  - [As três fases da vida de uma aplicação](quarkus/README.md#as-três-fases-da-vida-de-uma-aplicação)
  - [O vocabulário mínimo](quarkus/README.md#o-vocabulário-mínimo)
  - [O que a aplicação faz no boot — o passo a passo](quarkus/README.md#o-que-a-aplicação-faz-no-boot--o-passo-a-passo)
  - [O que ela faz depois, em regime](quarkus/README.md#o-que-ela-faz-depois-em-regime)
  - [Por que isso importa para entender o Quarkus](quarkus/README.md#por-que-isso-importa-para-entender-o-quarkus)
- [2. O problema que o Quarkus resolve](quarkus/README.md#2-o-problema-que-o-quarkus-resolve)
- [3. A ideia central: *build-time augmentation*](quarkus/README.md#3-a-ideia-central-build-time-augmentation)
- [4. Os dois modos de execução](quarkus/README.md#4-os-dois-modos-de-execução)
- [5. O que ele é por dentro](quarkus/README.md#5-o-que-ele-é-por-dentro)
- [6. Onde o Quarkus é usado](quarkus/README.md#6-onde-o-quarkus-é-usado)
- [7. O que o Quarkus NÃO é](quarkus/README.md#7-o-que-o-quarkus-não-é)
- [Capítulos](quarkus/README.md#capítulos)

#### [I - COMO FUNCIONA](quarkus/i-como-funciona.md)

As três fases, ArC, extensões, GraalVM e mundo fechado, JIT × AOT, dev mode, threads.

- [1. As três fases: build, static init e runtime init](quarkus/i-como-funciona.md#1-as-três-fases-build-static-init-e-runtime-init)
  - [O que significa "gerar bytecode"](quarkus/i-como-funciona.md#o-que-significa-gerar-bytecode)
  - [As três fases](quarkus/i-como-funciona.md#as-três-fases)
  - [Static init × runtime init: qual é o critério](quarkus/i-como-funciona.md#static-init--runtime-init-qual-é-o-critério)
  - [O *bytecode recorder* — a ponte entre as duas pontas](quarkus/i-como-funciona.md#o-bytecode-recorder--a-ponte-entre-as-duas-pontas)
- [2. ArC — o container de injeção resolvido no build](quarkus/i-como-funciona.md#2-arc--o-container-de-injeção-resolvido-no-build)
  - [O que é "o grafo de dependências"](quarkus/i-como-funciona.md#o-que-é-o-grafo-de-dependências)
  - [Declarando um bean](quarkus/i-como-funciona.md#declarando-um-bean)
- [3. Anatomia de uma extensão](quarkus/i-como-funciona.md#3-anatomia-de-uma-extensão)
  - [As duas peças do módulo de deployment](quarkus/i-como-funciona.md#as-duas-peças-do-módulo-de-deployment)
- [4. GraalVM, Mandrel e a hipótese do mundo fechado](quarkus/i-como-funciona.md#4-graalvm-mandrel-e-a-hipótese-do-mundo-fechado)
- [5. JIT × AOT — por que o nativo pode ser mais lento](quarkus/i-como-funciona.md#5-jit--aot--por-que-o-nativo-pode-ser-mais-lento)
- [6. Dev mode — o que mais impressiona na prática](quarkus/i-como-funciona.md#6-dev-mode--o-que-mais-impressiona-na-prática)
- [7. O modelo de threads: Vert.x, event loop e Mutiny](quarkus/i-como-funciona.md#7-o-modelo-de-threads-vertx-event-loop-e-mutiny)
- [8. O preço do modelo](quarkus/i-como-funciona.md#8-o-preço-do-modelo)

#### [II - QUARKUS NA PRÁTICA](quarkus/ii-quarkus-na-pratica.md)

Projeto, Jakarta REST, CDI, config e perfis, Panache, mensageria, testes, container.

- [1. Criando e estruturando o projeto](quarkus/ii-quarkus-na-pratica.md#1-criando-e-estruturando-o-projeto)
- [2. Endpoint REST](quarkus/ii-quarkus-na-pratica.md#2-endpoint-rest)
- [3. CDI na prática](quarkus/ii-quarkus-na-pratica.md#3-cdi-na-prática)
- [4. Configuração e perfis](quarkus/ii-quarkus-na-pratica.md#4-configuração-e-perfis)
- [5. Persistência com Hibernate e Panache](quarkus/ii-quarkus-na-pratica.md#5-persistência-com-hibernate-e-panache)
- [6. Validação e tratamento de erro](quarkus/ii-quarkus-na-pratica.md#6-validação-e-tratamento-de-erro)
- [7. Mensageria](quarkus/ii-quarkus-na-pratica.md#7-mensageria)
- [8. Testes](quarkus/ii-quarkus-na-pratica.md#8-testes)
- [9. Observabilidade](quarkus/ii-quarkus-na-pratica.md#9-observabilidade)
- [10. Empacotamento e container](quarkus/ii-quarkus-na-pratica.md#10-empacotamento-e-container)

#### [III - QUARKUS × SPRING](quarkus/iii-quarkus-x-spring.md)

DI em build time × runtime, números, tabela de-para, nativo, ecossistema, migração.

- [1. A diferença de origem explica todas as outras](quarkus/iii-quarkus-x-spring.md#1-a-diferença-de-origem-explica-todas-as-outras)
- [2. Injeção de dependência: runtime × build time](quarkus/iii-quarkus-x-spring.md#2-injeção-de-dependência-runtime--build-time)
- [3. Inicialização e memória: os números e o que eles não dizem](quarkus/iii-quarkus-x-spring.md#3-inicialização-e-memória-os-números-e-o-que-eles-não-dizem)
- [4. Tabela de-para](quarkus/iii-quarkus-x-spring.md#4-tabela-de-para)
- [5. Modelo de execução e programação reativa](quarkus/iii-quarkus-x-spring.md#5-modelo-de-execução-e-programação-reativa)
- [6. Imagem nativa: o Quarkus não é mais o único](quarkus/iii-quarkus-x-spring.md#6-imagem-nativa-o-quarkus-não-é-mais-o-único)
- [7. As extensões de compatibilidade com Spring](quarkus/iii-quarkus-x-spring.md#7-as-extensões-de-compatibilidade-com-spring)
- [8. Ecossistema, maturidade e mercado](quarkus/iii-quarkus-x-spring.md#8-ecossistema-maturidade-e-mercado)
- [9. Experiência de desenvolvimento](quarkus/iii-quarkus-x-spring.md#9-experiência-de-desenvolvimento)
- [10. Quando escolher cada um](quarkus/iii-quarkus-x-spring.md#10-quando-escolher-cada-um)
- [11. Roteiro de migração (se for migrar)](quarkus/iii-quarkus-x-spring.md#11-roteiro-de-migração-se-for-migrar)
- [12. As pegadinhas que mais aparecem](quarkus/iii-quarkus-x-spring.md#12-as-pegadinhas-que-mais-aparecem)

<br>

---

## Dados

### FUNDAMENTOS DE MODELAGEM DE DADOS

Da normalização ao NoSQL: formas normais, modelagem relacional, índices, views, procedures, ACID e grafos.

#### [Visão geral](fundamentos-de-modelagem-de-dados/README.md)

Conceitos básicos, normalização, as formas normais, desnormalização.

- [BASIC CONCEPTS:](fundamentos-de-modelagem-de-dados/README.md#basic-concepts)
- [Normalização](fundamentos-de-modelagem-de-dados/README.md#normalização)
  - [As anomalias que a normalização elimina](fundamentos-de-modelagem-de-dados/README.md#as-anomalias-que-a-normalização-elimina)
- [As formas normais](fundamentos-de-modelagem-de-dados/README.md#as-formas-normais)
  - [1FN — Primeira Forma Normal](fundamentos-de-modelagem-de-dados/README.md#1fn--primeira-forma-normal)
  - [2FN — Segunda Forma Normal](fundamentos-de-modelagem-de-dados/README.md#2fn--segunda-forma-normal)
  - [3FN — Terceira Forma Normal](fundamentos-de-modelagem-de-dados/README.md#3fn--terceira-forma-normal)
  - [BCNF — Forma Normal de Boyce-Codd](fundamentos-de-modelagem-de-dados/README.md#bcnf--forma-normal-de-boyce-codd)
- [Quando desnormalizar de propósito](fundamentos-de-modelagem-de-dados/README.md#quando-desnormalizar-de-propósito)
- [Capítulos](fundamentos-de-modelagem-de-dados/README.md#capítulos)

#### [MODELAGEM RELACIONAL](fundamentos-de-modelagem-de-dados/modelagem-relacional.md)

Chaves, relacionamentos e cardinalidade, integridade, álgebra relacional, JOINs.

- [Tipos de chave](fundamentos-de-modelagem-de-dados/modelagem-relacional.md#tipos-de-chave)
- [RELACIONAMENTOS:](fundamentos-de-modelagem-de-dados/modelagem-relacional.md#relacionamentos)
  - [Como cada cardinalidade vira tabela](fundamentos-de-modelagem-de-dados/modelagem-relacional.md#como-cada-cardinalidade-vira-tabela)
  - [Cardinalidade e participação (notação Crow's Foot)](fundamentos-de-modelagem-de-dados/modelagem-relacional.md#cardinalidade-e-participação-notação-crows-foot)
- [Integridade referencial](fundamentos-de-modelagem-de-dados/modelagem-relacional.md#integridade-referencial)
- [Álgebra relacional](fundamentos-de-modelagem-de-dados/modelagem-relacional.md#álgebra-relacional)
- [Tipos de JOIN](fundamentos-de-modelagem-de-dados/modelagem-relacional.md#tipos-de-join)

#### [ÍNDICE](fundamentos-de-modelagem-de-dados/indice.md)

Tipos, custo, seletividade, índice composto, covering index, plano de execução.

- [Índices](fundamentos-de-modelagem-de-dados/indice.md#índices)
- [Tipos de índices](fundamentos-de-modelagem-de-dados/indice.md#tipos-de-índices)
- [Exemplos](fundamentos-de-modelagem-de-dados/indice.md#exemplos)
- [1. O outro lado: índice não é grátis](fundamentos-de-modelagem-de-dados/indice.md#1-o-outro-lado-índice-não-é-grátis)
- [2. Seletividade — por que alguns índices são inúteis](fundamentos-de-modelagem-de-dados/indice.md#2-seletividade--por-que-alguns-índices-são-inúteis)
- [3. Índice composto: a regra do prefixo mais à esquerda](fundamentos-de-modelagem-de-dados/indice.md#3-índice-composto-a-regra-do-prefixo-mais-à-esquerda)
- [4. Quando o otimizador ignora o índice](fundamentos-de-modelagem-de-dados/indice.md#4-quando-o-otimizador-ignora-o-índice)
- [5. Covering index e index-only scan](fundamentos-de-modelagem-de-dados/indice.md#5-covering-index-e-index-only-scan)
- [6. Clusterizado × não clusterizado](fundamentos-de-modelagem-de-dados/indice.md#6-clusterizado--não-clusterizado)
- [7. B-Tree × Hash × outros](fundamentos-de-modelagem-de-dados/indice.md#7-b-tree--hash--outros)
- [8. Lendo o plano de execução](fundamentos-de-modelagem-de-dados/indice.md#8-lendo-o-plano-de-execução)

#### [ACID](fundamentos-de-modelagem-de-dados/acid.md)

Os níveis de isolamento, anomalias e a relação com BASE.

- [Isolamento na prática: os quatro níveis](fundamentos-de-modelagem-de-dados/acid.md#isolamento-na-prática-os-quatro-níveis)
  - [As anomalias](fundamentos-de-modelagem-de-dados/acid.md#as-anomalias)
  - [Os níveis](fundamentos-de-modelagem-de-dados/acid.md#os-níveis)
  - [O custo: isolamento × concorrência](fundamentos-de-modelagem-de-dados/acid.md#o-custo-isolamento--concorrência)
  - [Como resolver *lost update* na aplicação](fundamentos-de-modelagem-de-dados/acid.md#como-resolver-lost-update-na-aplicação)
- [ACID, BASE e o mundo distribuído](fundamentos-de-modelagem-de-dados/acid.md#acid-base-e-o-mundo-distribuído)

#### [VIEWS](fundamentos-de-modelagem-de-dados/views.md)

View simples e materializada, quando compensa.

_Arquivo curto, sem subdivisões — leia direto._

#### [PROCEDURES](fundamentos-de-modelagem-de-dados/procedures.md)

A mesma procedure em três dialetos, procedure × function × trigger.

- [1. A mesma procedure nos três dialetos](fundamentos-de-modelagem-de-dados/procedures.md#1-a-mesma-procedure-nos-três-dialetos)
- [2. Procedure × Function × Trigger](fundamentos-de-modelagem-de-dados/procedures.md#2-procedure--function--trigger)
- [3. Visão crítica: por que muito time moderno evita](fundamentos-de-modelagem-de-dados/procedures.md#3-visão-crítica-por-que-muito-time-moderno-evita)

#### [MODELAGEM NÃO RELACIONAL](fundamentos-de-modelagem-de-dados/modelagem-nao-relacional.md)

Tipos de NoSQL, modelagem por query, embedding × referencing, sharding.

- [Principais Tipos de Bancos NoSQL](fundamentos-de-modelagem-de-dados/modelagem-nao-relacional.md#principais-tipos-de-bancos-nosql)
- [1. A inversão fundamental: modelagem orientada a query](fundamentos-de-modelagem-de-dados/modelagem-nao-relacional.md#1-a-inversão-fundamental-modelagem-orientada-a-query)
- [2. Embedding × Referencing](fundamentos-de-modelagem-de-dados/modelagem-nao-relacional.md#2-embedding--referencing)
- [3. Sharding e partition key](fundamentos-de-modelagem-de-dados/modelagem-nao-relacional.md#3-sharding-e-partition-key)
- [4. Consistência: BASE em vez de ACID](fundamentos-de-modelagem-de-dados/modelagem-nao-relacional.md#4-consistência-base-em-vez-de-acid)
- [5. Quando usar cada um](fundamentos-de-modelagem-de-dados/modelagem-nao-relacional.md#5-quando-usar-cada-um)

#### [BANCO DE DADOS EM GRAFOS](fundamentos-de-modelagem-de-dados/banco-de-dados-em-grafos.md)

Nós, arestas, propriedades, Cypher, quando grafo vence o relacional.

- [Conceitos Fundamentais](fundamentos-de-modelagem-de-dados/banco-de-dados-em-grafos.md#conceitos-fundamentais)
  - [Nós (Vértices)](fundamentos-de-modelagem-de-dados/banco-de-dados-em-grafos.md#nós-vértices)
  - [Arestas (Relacionamentos)](fundamentos-de-modelagem-de-dados/banco-de-dados-em-grafos.md#arestas-relacionamentos)
  - [Propriedades](fundamentos-de-modelagem-de-dados/banco-de-dados-em-grafos.md#propriedades)
- [Quando Usar Banco de Dados em Grafos?](fundamentos-de-modelagem-de-dados/banco-de-dados-em-grafos.md#quando-usar-banco-de-dados-em-grafos)
- [Casos de Uso Comuns](fundamentos-de-modelagem-de-dados/banco-de-dados-em-grafos.md#casos-de-uso-comuns)
- [Linguagem de Consulta: Cypher](fundamentos-de-modelagem-de-dados/banco-de-dados-em-grafos.md#linguagem-de-consulta-cypher)
- [Principais SGBDs de Grafos](fundamentos-de-modelagem-de-dados/banco-de-dados-em-grafos.md#principais-sgbds-de-grafos)
- [Vantagens](fundamentos-de-modelagem-de-dados/banco-de-dados-em-grafos.md#vantagens)
- [Desvantagens](fundamentos-de-modelagem-de-dados/banco-de-dados-em-grafos.md#desvantagens)
- [Por que grafo vence o relacional em travessia](fundamentos-de-modelagem-de-dados/banco-de-dados-em-grafos.md#por-que-grafo-vence-o-relacional-em-travessia)

<br>

---

## Infraestrutura

### DOCKER

Do conceito de processo isolado até o `docker-compose.yml` de produção.

#### [Visão geral](docker/README.md)

Índice da matéria e relacionados.

_Só a apresentação da matéria, o índice dos capítulos e os links relacionados._

#### [CAPÍTULO I - INTRODUÇÃO AO DOCKER](docker/capitulo-i-introducao-ao-docker.md)

VM × container, namespaces e cgroups, camadas, registry, ciclo de vida.

- [1. Máquina virtual × Container](docker/capitulo-i-introducao-ao-docker.md#1-máquina-virtual--container)
- [2. As três tecnologias do kernel Linux](docker/capitulo-i-introducao-ao-docker.md#2-as-três-tecnologias-do-kernel-linux)
- [3. Arquitetura do Docker](docker/capitulo-i-introducao-ao-docker.md#3-arquitetura-do-docker)
- [4. Imagem em camadas e copy-on-write](docker/capitulo-i-introducao-ao-docker.md#4-imagem-em-camadas-e-copy-on-write)
  - [Por que a ordem das instruções importa](docker/capitulo-i-introducao-ao-docker.md#por-que-a-ordem-das-instruções-importa)
- [5. Registry, tags e digest](docker/capitulo-i-introducao-ao-docker.md#5-registry-tags-e-digest)
- [6. Ciclo de vida do container](docker/capitulo-i-introducao-ao-docker.md#6-ciclo-de-vida-do-container)

#### [CAPÍTULO II - GERENCIAMENTO DE CONTAINERS](docker/capitulo-ii-gerenciamento-de-containers.md)

Comandos, Dockerfile, `CMD` × `ENTRYPOINT`, multi-stage build, segurança.

- [Comandos que faltam na lista e você vai usar todo dia](docker/capitulo-ii-gerenciamento-de-containers.md#comandos-que-faltam-na-lista-e-você-vai-usar-todo-dia)
- [ESTRUTURA BÁSICA DE UM DOCKERFILE](docker/capitulo-ii-gerenciamento-de-containers.md#estrutura-básica-de-um-dockerfile)
  - [As instruções que faltavam](docker/capitulo-ii-gerenciamento-de-containers.md#as-instruções-que-faltavam)
  - [`CMD` × `ENTRYPOINT` — a diferença crucial](docker/capitulo-ii-gerenciamento-de-containers.md#cmd--entrypoint--a-diferença-crucial)
  - [Forma *exec* × forma *shell* — e o PID 1](docker/capitulo-ii-gerenciamento-de-containers.md#forma-exec--forma-shell--e-o-pid-1)
  - [`.dockerignore`](docker/capitulo-ii-gerenciamento-de-containers.md#dockerignore)
- [Multi-stage build — obrigatório em Java](docker/capitulo-ii-gerenciamento-de-containers.md#multi-stage-build--obrigatório-em-java)
- [Boas práticas de imagem Java](docker/capitulo-ii-gerenciamento-de-containers.md#boas-práticas-de-imagem-java)
- [Segurança de imagem](docker/capitulo-ii-gerenciamento-de-containers.md#segurança-de-imagem)

#### [CAPÍTULO III - REDES](docker/capitulo-iii-redes.md)

Drivers, DNS interno, `EXPOSE` × `-p`, isolamento.

- [1. Os drivers de rede](docker/capitulo-iii-redes.md#1-os-drivers-de-rede)
- [2. Bridge padrão × bridge criada por você](docker/capitulo-iii-redes.md#2-bridge-padrão--bridge-criada-por-você)
- [3. Publicar porta: `EXPOSE` × `-p`](docker/capitulo-iii-redes.md#3-publicar-porta-expose---p)
- [4. Boas práticas](docker/capitulo-iii-redes.md#4-boas-práticas)

#### [CAPÍTULO IV - VOLUMES](docker/capitulo-iv-volumes.md)

Volume × bind mount × tmpfs, permissões, backup, Compose.

- [1. As três formas de persistir](docker/capitulo-iv-volumes.md#1-as-três-formas-de-persistir)
- [2. A armadilha das permissões](docker/capitulo-iv-volumes.md#2-a-armadilha-das-permissões)
- [3. Backup e restauração](docker/capitulo-iv-volumes.md#3-backup-e-restauração)
- [4. Volumes no Compose](docker/capitulo-iv-volumes.md#4-volumes-no-compose)
- [5. Boas práticas](docker/capitulo-iv-volumes.md#5-boas-práticas)

#### [CAPÍTULO V - ORQUESTRAÇÃO DE CONTAINERES](docker/capitulo-v-orquestracao-de-containeres.md)

Compose real, limites do Compose, Swarm × Kubernetes, 12 fatores.

- [🎻 A Analogia do Maestro](docker/capitulo-v-orquestracao-de-containeres.md#-a-analogia-do-maestro)
- [1. Um `docker-compose.yml` real](docker/capitulo-v-orquestracao-de-containeres.md#1-um-docker-composeyml-real)
  - [Os pontos que importam nesse arquivo](docker/capitulo-v-orquestracao-de-containeres.md#os-pontos-que-importam-nesse-arquivo)
- [2. Comandos](docker/capitulo-v-orquestracao-de-containeres.md#2-comandos)
- [3. Onde o Compose para](docker/capitulo-v-orquestracao-de-containeres.md#3-onde-o-compose-para)
- [4. Swarm × Kubernetes](docker/capitulo-v-orquestracao-de-containeres.md#4-swarm--kubernetes)
  - [O vocabulário mínimo de Kubernetes](docker/capitulo-v-orquestracao-de-containeres.md#o-vocabulário-mínimo-de-kubernetes)
- [5. Boas práticas de container em produção](docker/capitulo-v-orquestracao-de-containeres.md#5-boas-práticas-de-container-em-produção)

<br>

---

## Referência rápida

### RESUMO DE PROVA

Arquivo de véspera: as pegadinhas mais cobradas com a correção, tabelas comparativas, definições em uma linha e o mapa de conexões entre as matérias.

**[Conteúdo →](RESUMO-PROVA.md)**

- [As 27 pegadinhas](RESUMO-PROVA.md#as-27-pegadinhas)
- [Tabelas de véspera](RESUMO-PROVA.md#tabelas-de-véspera)
  - [Verbos HTTP](RESUMO-PROVA.md#verbos-http)
  - [Status codes que caem](RESUMO-PROVA.md#status-codes-que-caem)
  - [Isolamento × anomalias](RESUMO-PROVA.md#isolamento--anomalias)
  - [Formas normais](RESUMO-PROVA.md#formas-normais)
  - [Design Patterns — reconhecimento rápido](RESUMO-PROVA.md#design-patterns--reconhecimento-rápido)
  - [SOLID](RESUMO-PROVA.md#solid)
  - [REST × gRPC × GraphQL](RESUMO-PROVA.md#rest--grpc--graphql)
  - [Padrões de entrega](RESUMO-PROVA.md#padrões-de-entrega)
  - [Mensageria — fila × tópico](RESUMO-PROVA.md#mensageria--fila--tópico)
  - [Pirâmide de testes](RESUMO-PROVA.md#pirâmide-de-testes)
  - [Test doubles](RESUMO-PROVA.md#test-doubles)
  - [Docker](RESUMO-PROVA.md#docker)
- [Definições em uma linha](RESUMO-PROVA.md#definições-em-uma-linha)
- [Por matéria](RESUMO-PROVA.md#por-matéria)
  - [Clean Architecture](RESUMO-PROVA.md#clean-architecture)
  - [SOLID](RESUMO-PROVA.md#solid)
  - [Design Patterns](RESUMO-PROVA.md#design-patterns)
  - [POO](RESUMO-PROVA.md#poo)
  - [Testes](RESUMO-PROVA.md#testes)
  - [Spring MVC / REST](RESUMO-PROVA.md#spring-mvc--rest)
  - [gRPC e GraphQL](RESUMO-PROVA.md#grpc-e-graphql)
  - [Spring Security](RESUMO-PROVA.md#spring-security)
  - [Spring Data JPA](RESUMO-PROVA.md#spring-data-jpa)
  - [Modelagem de Dados](RESUMO-PROVA.md#modelagem-de-dados)
  - [Arquitetura Distribuída](RESUMO-PROVA.md#arquitetura-distribuída)
  - [Mensageria](RESUMO-PROVA.md#mensageria)
  - [Teorema CAP](RESUMO-PROVA.md#teorema-cap)
  - [Docker](RESUMO-PROVA.md#docker)
- [Mapa de conexões](RESUMO-PROVA.md#mapa-de-conexões)

<br>

### UTEIS

Para consultar durante o trabalho, não para estudar.

#### [Visão geral](uteis/README.md)

Índice da referência rápida.

_Só a apresentação da matéria, o índice dos capítulos e os links relacionados._

#### [COMANDOS DOCKER](uteis/comandos-docker.md)

Cheat sheet do dia a dia — o conceito está em [DOCKER](docker/README.md).

- [🐳 Comandos de Imagens (O "DNA" do seu Container)](uteis/comandos-docker.md#-comandos-de-imagens-o-dna-do-seu-container)
- [🔍 Comandos de Inspeção e Debug (O "Raio-X")](uteis/comandos-docker.md#-comandos-de-inspeção-e-debug-o-raio-x)

#### [DICAS DE BANCO DE DADOS](uteis/dicas-de-banco-de-dados.md)

Boas práticas soltas — o aprofundamento está em [ÍNDICE](fundamentos-de-modelagem-de-dados/indice.md).

_Arquivo curto, sem subdivisões — leia direto._

<br>

---

<sub>Índice gerado a partir dos títulos dos arquivos. Ao criar ou renomear uma seção, atualize a entrada correspondente aqui.</sub>
