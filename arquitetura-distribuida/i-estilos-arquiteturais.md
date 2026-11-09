# I - ESTILOS ARQUITETURAIS

> [← Voltar para ARQUITETURA DISTRIBUÍDA](README.md) · Próximo: [II - LATÊNCIA E PERFORMANCE](ii-latencia-e-performance.md)

## 1. Cliente - Servidor

O estilo mais antigo e mais difundido: um **servidor** oferece um serviço e fica passivamente à espera; **clientes** tomam a iniciativa e pedem. Toda a Web funciona assim.

```mermaid
flowchart TD
    C1["Cliente"] --> S["Servidor"]
    C2["Cliente"] --> S
    C3["Cliente"] --> S
    S --> DB[("Banco")]
```

**Características:** papéis assimétricos e fixos, o cliente conhece o endereço do servidor, o servidor centraliza o estado e as regras.

**Camadas (tiers)** — não confundir com *layers*, que é divisão lógica; *tier* é divisão **física**:

| Arranjo | Composição | Observação |
|---|---|---|
| **2 camadas** | cliente gordo + banco | o cliente tem a regra de negócio; atualizar significa atualizar todas as máquinas |
| **3 camadas** | cliente + servidor de aplicação + banco | o padrão clássico da Web |
| **n camadas** | + gateway, cache, fila, serviços | o que se vê hoje em qualquer aplicação de porte |

| ✅ | ❌ |
|---|---|
| simples de entender e operar | o servidor é **ponto único de falha** |
| segurança e regras centralizadas | escala vertical primeiro, horizontal com esforço |
| cliente leve | o servidor é gargalo sob carga |

O servidor "único" é, na prática, um conjunto atrás de um **load balancer** — e é aí que entra a exigência de ser **stateless**: qualquer instância precisa poder atender qualquer requisição. → [REST - stateless](../spring-mvc-apis-restful/ii-fundamentos-rest.md)

---

## 2. Peer-to-Peer (P2P)

Não há papéis fixos: cada nó é **cliente e servidor ao mesmo tempo** (*peer* = par). Os recursos são compartilhados diretamente entre os participantes.

```mermaid
flowchart LR
    P1["Peer"] <--> P2["Peer"]
    P2 <--> P3["Peer"]
    P3 <--> P4["Peer"]
    P4 <--> P1
    P1 <--> P3
    P2 <--> P4
```

| Tipo | Como funciona | Exemplo |
|---|---|---|
| **Puro (descentralizado)** | nenhum nó central; a busca se propaga pela rede | Gnutella, blockchain |
| **Híbrido** | um servidor central só para **descoberta**; a transferência é direta | Napster, BitTorrent com tracker |
| **Estruturado (DHT)** | tabela hash distribuída define deterministicamente quem guarda o quê | Kademlia (BitTorrent moderno), IPFS |

| ✅ | ❌ |
|---|---|
| **sem ponto único de falha** | consistência e coordenação muito difíceis |
| escala com o número de participantes (cada novo nó traz recursos) | segurança: os pares não são confiáveis |
| custo de infraestrutura distribuído | desempenho imprevisível (nós entram e saem) |
| resistente a censura | busca e descoberta são caras |

**Onde aparece hoje:** BitTorrent e IPFS (distribuição de arquivos), **blockchain** (Bitcoin, Ethereum — o consenso distribuído é o problema central), WebRTC (chamadas de vídeo ponto a ponto), e protocolos de *gossip* dentro de clusters — o Cassandra, por exemplo, usa gossip entre os nós, sendo internamente P2P enquanto se apresenta como cliente-servidor para a aplicação.

---

## 3. Monólito — o ponto de partida honesto

Antes de microsserviços, o que existe (e muitas vezes deveria continuar existindo):

| Tipo | Descrição |
|---|---|
| **Monólito** | uma aplicação, um deploy, um banco. Não é xingamento — é simples, rápido e transacional |
| **Monólito modular** | um deploy, porém com **módulos bem separados** e fronteiras explícitas internamente |
| **Big ball of mud** | monólito sem fronteira nenhuma; o problema real que as pessoas chamam de "monólito" |

**"Monolith first"** (Martin Fowler): comece monolítico, descubra as fronteiras **de verdade** com o sistema funcionando, e só então extraia serviços. Começar distribuído sem conhecer o domínio produz fronteiras erradas — e mudar fronteira depois de distribuir é caríssimo.

O **monólito modular** é o meio-termo mais subestimado: você ganha as fronteiras (e a possibilidade futura de extrair) sem pagar latência de rede, consistência eventual e complexidade operacional. → [CLEAN ARCHITECTURE](../clean-architecture/README.md)

---

## 4. Arquitetura de microsserviços

Conjunto de **serviços pequenos, autônomos e independentemente implantáveis**, cada um responsável por uma capacidade de negócio, comunicando-se por rede.

**As características que definem** (Fowler & Lewis):

| Característica | Significado |
|---|---|
| **Componentização por serviço** | a unidade de substituição é o serviço, não a biblioteca |
| **Organizado por capacidade de negócio** | time de "Pagamentos", não time de "Banco de dados" |
| **Produtos, não projetos** | *"you build it, you run it"* — o time opera o que escreveu |
| **Smart endpoints, dumb pipes** | a inteligência está no serviço; a rede só transporta |
| **Governança descentralizada** | cada serviço pode ter stack própria |
| **Dados descentralizados** | **um banco por serviço** |
| **Automação de infraestrutura** | CI/CD e deploy automatizados não são opcionais |
| **Design for failure** | falha é esperada, não excepcional |
| **Design evolutivo** | serviços nascem, se fundem e morrem |

### Database per service — a regra mais importante e mais violada

Cada serviço é **dono exclusivo** dos seus dados. Nenhum outro serviço lê a tabela dele diretamente: pede pela API ou consome um evento.

```mermaid
flowchart TB
    subgraph OK["✅ dados descentralizados"]
        A1["Serviço Contas"] --> DA[("BD Contas")]
        B1["Serviço Pagamentos"] --> DB1[("BD Pagamentos")]
        B1 -->|API / evento| A1
    end
    subgraph NOK["❌ banco compartilhado"]
        A2["Serviço Contas"] --> DS[("BD único")]
        B2["Serviço Pagamentos"] --> DS
    end
```

Compartilhar banco parece econômico e destrói a autonomia: a alteração de uma coluna quebra dois serviços, o deploy vira coordenado, e você acabou de construir um **monólito distribuído** — com toda a complexidade da rede e nenhuma independência. É a falha de projeto mais comum na adoção de microsserviços.

O preço de fazer certo é perder o `JOIN` e a transação ACID entre serviços. → [III - CONSISTÊNCIA](iii-consistencia-e-dados.md)

### Como decidir a fronteira

A boa fronteira vem do **domínio**, não da camada técnica. O vocabulário é o de **DDD**:

- **Bounded context** — a fronteira dentro da qual um termo tem **um** significado. "Conta" no contexto de Cadastro não é a mesma coisa que "Conta" em Cobrança. Cada bounded context é candidato natural a serviço.
- **Agregado** — o conjunto de objetos que muda junto, sob uma raiz. É o limite natural da transação — e, portanto, um bom limite de serviço.
- **Alta coesão, baixo acoplamento** — o mesmo critério de [SOLID](../solid/README.md), agora entre serviços.

**Teste prático da fronteira:** se quase toda mudança de requisito obriga a alterar dois serviços **juntos**, a fronteira está errada — eles deveriam ser um só.

| ✅ Vantagens | ❌ Custos |
|---|---|
| deploy e escala independentes | latência e falha parcial em toda interação |
| isolamento de falha | consistência eventual |
| autonomia de time e de stack | complexidade operacional multiplicada |
| substituição incremental de legado | teste de integração caro |
| escala seletiva (só o serviço quente) | exige maturidade de CI/CD e observabilidade |

**Quando microsserviços valem a pena:** muitos times precisando de autonomia de deploy, partes do sistema com perfis de escala muito diferentes, domínios realmente independentes, necessidade de isolamento de falha. **Quando não valem:** time pequeno, domínio ainda mal compreendido, sistema pequeno, e sem plataforma (CI/CD, observabilidade, orquestração) já madura.

---

## 5. Monólito × microsserviços — quando usar cada um

As duas seções anteriores descreveram cada estilo. Esta responde à pergunta que de fato aparece no trabalho: **qual dos dois, neste projeto, agora?**

O erro de partida é tratar isso como decisão técnica de tamanho de código. Não é:

> **Microsserviço não é sobre ser pequeno — é sobre poder ser implantado sozinho.** Um serviço de 200 mil linhas que sobe sem coordenar com ninguém é microsserviço. Vinte serviços de 500 linhas que precisam subir juntos são um **monólito distribuído** — o pior dos dois mundos.

### O comparativo lado a lado

| Critério | **Monólito** | **Microsserviços** |
|---|---|---|
| Unidade de deploy | **uma** — tudo sobe junto | **uma por serviço**, independentes |
| Chamada interna | chamada de método: nanossegundos, confiável | chamada de rede: milissegundos, **pode falhar no meio** |
| Transação | **ACID nativo**, um `BEGIN/COMMIT` | Saga, compensação, consistência eventual → [III](iii-consistencia-e-dados.md#4-transações-distribuídas) |
| Consulta entre domínios | `JOIN` | composição via API ou projeção/CQRS |
| Banco de dados | um, compartilhado por todo o código | **um por serviço**, exclusivo |
| Escala | replica-se **a aplicação inteira** | replica-se **só o serviço quente** |
| Isolamento de falha | fraco: um vazamento de memória derruba tudo | forte — **se** houver timeout, circuit breaker e bulkhead → [IV](iv-resiliencia.md) |
| Refatorar fronteira | **barato**: o compilador te ajuda | **caro**: contrato publicado, dados migrados, dois times envolvidos |
| Teste | integração roda local, rápido | exige contrato, *mock* de serviço, ambiente → [TESTES](../testes-em-software/iii-testes-no-spring.md) |
| Depuração | **um stack trace** | tracing distribuído e correlação → [V](v-observabilidade.md#5-tracing-distribuído) |
| Autonomia de time | baixa: todos no mesmo *release* | **alta**: cada time entrega no seu ritmo |
| Diversidade de stack | uma só | cada serviço pode escolher |
| Custo operacional | **baixo** | multiplicado pelo número de serviços |
| Onboarding de dev novo | um repositório, um `run` | precisa entender o mapa e subir dependências |
| Custo de infraestrutura | geralmente **menor** | mais processos, mais rede, mais observabilidade |

A assimetria importante dessa tabela: **as vantagens do monólito são de hoje; as dos microsserviços são de escala.** Monólito é mais barato enquanto o sistema e o time caibem nele.

### A pergunta que decide

A decisão é **organizacional antes de ser técnica**. Em ordem de peso:

1. **Quantos times precisam entregar sem pedir licença um ao outro?** Se a resposta é "um", microsserviços resolvem um problema que você não tem.
2. **O domínio já é conhecido?** Fronteira errada em monólito se corrige refatorando; em microsserviços, se corrige migrando dados e renegociando contrato.
3. **A plataforma existe?** CI/CD, observabilidade, orquestração e automação **antes** do primeiro serviço extraído.
4. **Há partes com perfis de escala ou de disponibilidade realmente diferentes?** Esse é o argumento técnico legítimo.

```mermaid
flowchart TD
    Q1{"Quantos times precisam<br/>fazer deploy sem<br/>coordenar entre si?"}
    Q1 -->|"1 time"| M["MONÓLITO<br/><i>de preferência MODULAR</i>"]
    Q1 -->|"vários"| Q2{"O domínio e as<br/>fronteiras já são<br/>bem conhecidos?"}
    Q2 -->|"não"| M2["MONÓLITO MODULAR<br/><i>descubra a fronteira primeiro</i>"]
    Q2 -->|"sim"| Q3{"Já existe plataforma:<br/>CI/CD, observabilidade,<br/>orquestração?"}
    Q3 -->|"não"| M3["MONÓLITO<br/>+ construir a plataforma<br/><i>distribuir sem ela = caos</i>"]
    Q3 -->|"sim"| Q4{"Há partes com escala,<br/>criticidade ou ciclo de vida<br/>muito diferentes?"}
    Q4 -->|"não"| M4["MONÓLITO MODULAR<br/><i>extraia quando doer</i>"]
    Q4 -->|"sim"| MS["MICROSSERVIÇOS<br/><i>extraia essas partes primeiro</i>"]
```

### Em que situação cada um se encaixa

| Situação concreta | Escolha | Por quê |
|---|---|---|
| *Startup* validando produto, 3 devs | **Monólito** | a fronteira do domínio muda toda semana; velocidade de mudança é tudo |
| Sistema interno de RH, uso previsível | **Monólito** | não há problema de escala nem de autonomia a resolver |
| MVP com prazo curto | **Monólito** | o imposto de distribuição não caberia no prazo |
| Produto que cresceu e tem 6 times brigando pelo mesmo *release* | **Microsserviços** | o gargalo é **coordenação de deploy** — exatamente o que eles resolvem |
| E-commerce em que só o catálogo e o carrinho sofrem no pico | **Híbrido**: extrair catálogo/carrinho | escala seletiva; o resto continua monólito |
| Processamento de vídeo/relatório que consome muita CPU | **Extrair esse componente** | perfil de recurso diferente do resto |
| Legado de 15 anos que ninguém quer tocar | **Strangler Fig** (abaixo) | extração incremental, sem *big bang* |
| Parte do sistema precisa de 99,99% e o resto não | **Extrair a parte crítica** | isolamento de falha e de janela de manutenção |
| Domínios de negócio genuinamente independentes (seguros × consórcio) | **Microsserviços** | o acoplamento era só o banco de dados |
| Requisito de stack diferente (um módulo em Python para ML) | **Extrair esse módulo** | governança descentralizada é vantagem real aqui |
| Equipe sem CI/CD, sem observabilidade, sem quem opere | **Monólito** | distribuir sem plataforma troca um problema por cinco |
| "O CTO leu um artigo sobre microsserviços" | **Monólito** | não é requisito |

### O imposto fixo de cada serviço

O que se esquece de somar na conta: **cada** serviço novo precisa de tudo isto, e não de "um pouco disto".

| Item | Por serviço |
|---|---|
| Pipeline de build, teste e deploy | próprio |
| Versionamento de contrato e compatibilidade | próprio → [Contrato de mensagem](../mensageria/iv-padroes-de-uso-e-operacao.md#5-contrato-e-versionamento-de-mensagem) |
| Logs estruturados, métricas, *health check*, tracing | próprio → [V - OBSERVABILIDADE](v-observabilidade.md) |
| Timeout, retry, circuit breaker, idempotência | próprio → [IV - RESILIÊNCIA](iv-resiliencia.md) |
| Banco, migrations e backup | próprios |
| Autenticação serviço-a-serviço | própria → [SPRING SECURITY](../spring-security/README.md#111-autenticação-serviço-a-serviço) |
| Alguém de plantão que entenda dele | próprio |

É isso que Fowler chama de **"microservice premium"**: um custo fixo pago de entrada, que só se paga quando a escala de **time** e de **tráfego** justifica. Abaixo desse ponto, o monólito entrega mais rápido.

### Sinais de que é hora de extrair — e de que não é

**Sinais verdadeiros (o monólito já dói):**

- A fila de *release* é o gargalo: times esperando uns pelos outros para subir.
- Um módulo precisa escalar 20× e o resto não — e você paga réplica da aplicação inteira.
- Uma parte derruba o resto por acoplamento de recurso (conexão, memória, CPU).
- Ciclos de vida divergentes: um módulo muda diariamente, outro muda por ano.
- O *build* e a suíte de testes já custam dezenas de minutos e travam o fluxo.
- Um domínio precisa de conformidade, janela de manutenção ou SLA próprios.

**Sinais falsos (não extraia por isso):**

- "O código está confuso" → isso é **falta de módulo**, não falta de rede. Rede não organiza código.
- "Está na moda" / "é o que o mercado usa".
- "Vai ficar mais fácil de testar" → fica mais difícil.
- "O deploy é lento" → investigue o pipeline antes de redesenhar a arquitetura.
- "Queremos usar Kubernetes" → ferramenta não é requisito.

> A pesquisa do **DORA/Accelerate** aponta arquitetura **fracamente acoplada** como preditora de desempenho de entrega — e "fracamente acoplada" **não** é sinônimo de "distribuída". Um monólito modular bem fatiado atende ao critério; vinte serviços que sobem juntos, não.

### Como sair do monólito: Strangler Fig

O padrão de **Martin Fowler** (*strangler fig*, a figueira que envolve a árvore até substituí-la): nada de reescrita *big bang*. Põe-se uma fachada na frente, extrai-se **uma** capacidade por vez e redireciona-se o tráfego.

```mermaid
flowchart LR
    subgraph F1["① hoje"]
        C1["clientes"] --> MONO1["Monólito"]
    end
    subgraph F2["② fachada na frente"]
        C2["clientes"] --> GW["API Gateway / proxy"] --> MONO2["Monólito"]
    end
    subgraph F3["③ extrai uma capacidade"]
        C3["clientes"] --> GW2["Gateway"]
        GW2 -->|"/pagamentos"| S1["Serviço Pagamentos"]
        GW2 -->|"resto"| MONO3["Monólito"]
    end
    F1 --> F2 --> F3
```

**A ordem de extração que costuma dar certo:** comece pelo que é **mais autônomo e menos central** — o módulo com menos dependências de dados, com time dono claro e com motivo real para sair (escala, SLA, stack). Nunca comece pelo núcleo transacional: ele é o mais acoplado e o mais arriscado.

Os pontos de dor da migração são sempre os mesmos dois: **separar os dados** (quebrar `JOIN`, duplicar dado por evento, migrar sem downtime) e **manter as duas versões no ar** durante a transição, geralmente com [Outbox](iii-consistencia-e-dados.md#5-outbox--o-problema-da-escrita-dupla) e idempotência. → [III - CONSISTÊNCIA E DADOS](iii-consistencia-e-dados.md)

### Os dois erros simétricos

```mermaid
flowchart TB
    subgraph E1["❌ Big ball of mud"]
        B["monólito sem fronteira interna<br/><i>tudo chama tudo</i>"]
    end
    subgraph E2["❌ Monólito distribuído"]
        D["serviços separados<br/>SEM autonomia<br/><i>banco compartilhado, deploy coordenado</i>"]
    end
    subgraph OK["✅ Os dois caminhos saudáveis"]
        M["Monólito MODULAR<br/><i>fronteira sem rede</i>"]
        S["Microsserviços de verdade<br/><i>fronteira + autonomia</i>"]
    end
    E1 -->|"extrair módulos"| M
    M -->|"quando a escala exigir"| S
    E2 -->|"consolidar de volta"| M
```

| Erro | O que é | O que ele custa |
|---|---|---|
| **Big ball of mud** | monólito sem nenhuma fronteira interna | mudança imprevisível; é o que as pessoas odeiam quando dizem "odeio monólito" |
| **Monólito distribuído** | serviços separados **sem** autonomia: banco compartilhado, deploy coordenado, contrato implícito | paga **toda** a complexidade da rede e não recebe **nenhuma** das vantagens |

**O caminho saudável é o do meio:** monólito **modular** primeiro — fronteiras explícitas, módulos com contrato interno, dados segregados por esquema. Dali, extrair é mecânico quando houver motivo. É a rota que [CLEAN ARCHITECTURE](../clean-architecture/README.md) prepara: se as dependências já apontam para dentro e a fronteira está em uma *port*, trocar uma chamada local por uma chamada de rede mexe em um adapter — não no domínio.

> **Dois movimentos públicos vale conhecer, porque desmontam a ideia de via única:** a Amazon mantém a cultura de *two-pizza teams* e microsserviços, e ainda assim o time do **Prime Video** relatou em 2023 ter consolidado um componente de monitoramento distribuído **de volta em um único processo**, com forte redução de custo; a **Segment** relatou em 2018 um movimento semelhante, voltando de dezenas de serviços para um monólito por causa do custo operacional. Arquitetura é reversível, e consolidar não é derrota — é resposta a medição.

**Em uma frase:** *comece monolítico e modular, distribua quando a organização — não o ego técnico — exigir, e extraia pela fronteira do domínio, uma capacidade por vez.*

---

## 6. SOA × microsserviços

| | **SOA** (anos 2000) | **Microsserviços** |
|---|---|---|
| Integração | **ESB** (Enterprise Service Bus) com lógica de roteamento e transformação | *smart endpoints, dumb pipes* |
| Granularidade | serviços grandes, às vezes empresa inteira | pequenos, por capacidade |
| Dados | frequentemente banco compartilhado | **um por serviço** |
| Protocolo | SOAP/WSDL, XML | REST, gRPC, mensageria |
| Governança | centralizada | descentralizada |
| Deploy | coordenado | independente |

A crítica histórica ao SOA é o **ESB**: concentrar regra de negócio no barramento criou um ponto único de falha, de gargalo e de disputa entre times.

---

## 7. Arquitetura orientada a eventos (event-driven)

Em vez de "A chama B", **A publica um fato** e quem se interessar reage. É o padrão [Observer](../design-patterns-em-oo/iii-padroes-comportamentais.md) em escala de arquitetura.

```mermaid
flowchart LR
    P["Serviço Pagamentos"] -->|publica<br/>PagamentoAprovado| B["Broker<br/><i>Kafka / RabbitMQ</i>"]
    B --> C1["Serviço Estoque"]
    B --> C2["Serviço Notificação"]
    B --> C3["Serviço Antifraude"]
```

**Três sabores de evento** (a distinção cai em prova):

| Tipo | O evento carrega | Consequência |
|---|---|---|
| **Event notification** | só o aviso + id (`PedidoCriado{id}`) | consumidor precisa chamar de volta para obter os dados (acopla, mas o dado é sempre atual) |
| **Event-carried state transfer** | os dados relevantes no próprio evento | consumidor fica autônomo e mantém uma réplica local (consistência eventual) |
| **Event sourcing** | o evento **é** a fonte da verdade; o estado é derivado | auditoria total e replay; complexidade alta → [III](iii-consistencia-e-dados.md) |

**Orquestração × coreografia** — as duas formas de conduzir um processo entre serviços:

| | **Orquestração** | **Coreografia** |
|---|---|---|
| Quem conduz | um **orquestrador** central chama os passos | cada serviço reage a eventos, sem maestro |
| Fluxo | explícito, visível num lugar só | emergente, espalhado |
| Acoplamento | o orquestrador conhece todos | serviços conhecem apenas eventos |
| Depurar | fácil | difícil (ninguém tem a visão completa) |
| Adicionar passo | mexe no orquestrador | só assinar o evento |

Não há vencedor: orquestração para processos de negócio críticos que precisam ser auditáveis; coreografia para reações desacopladas e laterais.

| ✅ | ❌ |
|---|---|
| desacoplamento forte entre produtor e consumidor | fluxo difícil de seguir e depurar |
| absorve picos de carga (a fila amortece) | consistência eventual |
| novo consumidor sem tocar no produtor | ordem e duplicidade viram problema seu |
| resiliência: o consumidor pode estar fora | exige **idempotência** em todo consumidor |

**Garantias de entrega:** *at-most-once* (pode perder), *at-least-once* (pode duplicar — o padrão na prática) e *exactly-once* (existe só sob condições estritas, dentro de um mesmo sistema). Como o mundo real é **at-least-once**, **todo consumidor precisa ser idempotente**. → [III - CONSISTÊNCIA](iii-consistencia-e-dados.md) · [MENSAGERIA - Padrões de entrega](../mensageria/iii-padroes-de-entrega.md)

---

## 8. Serverless / FaaS

O provedor gerencia servidor, escala e disponibilidade; você entrega **funções** que respondem a eventos (AWS Lambda, Azure Functions, Cloud Run).

| ✅ | ❌ |
|---|---|
| zero gestão de servidor | **cold start** (crítico para JVM) |
| escala automática até zero | limite de tempo de execução e de memória |
| paga pelo uso | *vendor lock-in* |
| ótimo para carga esporádica | depuração e teste local mais difíceis |
| | estado precisa ser sempre externo |

Em Java, o cold start é o ponto sensível — mitigado com GraalVM *native image* (Spring Native/Quarkus), que derruba o tempo de partida de segundos para milissegundos.

---

## 9. Comunicação: síncrona × assíncrona

A decisão que mais afeta acoplamento e resiliência:

| | **Síncrona** (REST, gRPC) | **Assíncrona** (fila, tópico) |
|---|---|---|
| Quem espera | o chamador **bloqueia** aguardando | ninguém: publica e segue |
| Acoplamento | temporal: os dois precisam estar **no ar agora** | nenhum: o consumidor pode estar fora |
| Falha do destino | propaga imediatamente | a mensagem fica na fila |
| Latência percebida | soma de toda a cadeia | resposta imediata, processamento depois |
| Pico de carga | derruba o destino | a fila amortece |
| Consistência | imediata | eventual |
| Complexidade | baixa | maior (ordem, duplicidade, DLQ) |

**Regra prática:** síncrono quando o chamador **precisa** da resposta para continuar (validar saldo antes de autorizar); assíncrono para tudo que pode acontecer depois (notificar, indexar, faturar, gerar relatório).

> **Chamadas síncronas encadeadas são a principal causa de falha em cascata.** Se A chama B que chama C, a indisponibilidade de C derruba os três — e a latência total é a **soma**. Cada elo da cadeia precisa de timeout e circuit breaker. → [IV - RESILIÊNCIA](iv-resiliencia.md)

---

## 10. A infraestrutura que a distribuição exige

| Componente | Problema que resolve |
|---|---|
| **Service discovery** | o endereço muda a cada deploy. Um *registry* (Consul, Eureka, DNS do Kubernetes) responde "onde está o serviço X?". Nada de IP fixo (falácia #5) |
| **Load balancer** | distribui entre instâncias. *Client-side* (o cliente escolhe a instância) × *server-side* (um proxy decide) |
| **API Gateway** | porta única de entrada: roteamento, autenticação, rate limit, agregação, TLS. Evita que o cliente conheça N endereços |
| **BFF** (*Backend for Frontend*) | um gateway por tipo de cliente (web, mobile, parceiro), cada um com o formato de resposta que aquela tela precisa → [GraphQL](../grpc-e-graphql/ii-graphql.md) |
| **Service mesh** | um *sidecar* (Istio/Envoy, Linkerd) ao lado de cada serviço cuidando de mTLS, retry, circuit breaker, tracing e roteamento — **fora** do código da aplicação |
| **Config centralizada** | configuração por ambiente sem rebuild (Spring Cloud Config, ConfigMap) |
| **Broker de mensagens** | desacoplamento temporal e absorção de picos → [MENSAGERIA](../mensageria/README.md) |

**Service mesh × biblioteca:** a mesma preocupação (retry, circuit breaker, mTLS) pode ficar no código (Resilience4j) ou na malha (sidecar). A malha é poliglota e não exige mudar a aplicação; a biblioteca é mais simples de operar e conhece o contexto de negócio. Times pequenos costumam ganhar com biblioteca; plataformas grandes e poliglotas ganham com malha.

---

## 11. Lei de Conway

> *"Organizações que projetam sistemas produzem projetos que são cópias da estrutura de comunicação dessas organizações."* — Melvin Conway, 1967

Três times → três camadas. Quatro times de produto → quatro serviços. **A arquitetura acompanha o organograma**, queira você ou não.

A **manobra inversa de Conway** é usar isso de propósito: organize os times como você quer que o sistema fique. Se quer serviços autônomos por domínio, monte **times autônomos por domínio** — multifuncionais, donos do deploy e da operação. Times divididos por camada técnica (front, back, DBA) produzirão inevitavelmente um sistema acoplado por camada, independentemente do desenho no quadro branco.

É por isso que "adotar microsserviços" é, antes de tudo, uma decisão **organizacional**. Sem autonomia de time, o resultado é um monólito distribuído com reuniões.

---

## Comparativo dos estilos

| | Cliente-Servidor | P2P | Monólito modular | Microsserviços | Event-driven | Serverless |
|---|---|---|---|---|---|---|
| Ponto único de falha | sim | **não** | sim | não | broker | provedor |
| Escala | vertical/horizontal no servidor | com os pares | do processo inteiro | **por serviço** | por consumidor | automática |
| Consistência | forte | difícil | **forte (ACID)** | eventual | eventual | depende |
| Complexidade operacional | baixa | alta | **baixa** | alta | alta | média |
| Acoplamento | médio | baixo | médio | baixo | **muito baixo** | baixo |
| Melhor para | a maioria das aplicações web | compartilhamento sem autoridade central | começar, e talvez ficar | muitos times, escalas distintas | reações desacopladas e picos | carga esporádica |

---

## Perguntas para autoavaliação

1. Diferencie *layer* de *tier*.
2. Quais os tipos de rede P2P e o que muda entre pura, híbrida e estruturada?
3. Cite duas vantagens e duas desvantagens do P2P em relação a cliente-servidor.
4. O que é "monolith first" e por que o argumento é forte?
5. Cite quatro características que definem microsserviços.
6. Por que compartilhar banco entre serviços produz um "monólito distribuído"?
7. O que é um bounded context e por que ele é bom candidato a fronteira de serviço?
8. Qual o teste prático para saber se a fronteira entre dois serviços está errada?
9. Por que "microsserviço não é sobre tamanho"? O que define de fato um microsserviço?
10. Compare monólito e microsserviços em seis critérios.
11. Por que se diz que as vantagens do monólito são "de hoje" e as dos microsserviços são "de escala"?
12. Qual é a pergunta organizacional que decide entre os dois, e por que ela vem antes da técnica?
13. Dê três situações concretas em que o monólito é a escolha certa e três em que microsserviços são.
14. O que é o *microservice premium* e o que compõe o imposto fixo de cada serviço novo?
15. Cite três sinais verdadeiros e três sinais falsos de que é hora de extrair um serviço.
16. "Fracamente acoplado" é sinônimo de "distribuído"? O que a pesquisa do DORA permite concluir?
17. Explique o Strangler Fig, por qual módulo começar a extração — e por qual nunca começar.
18. Quais são os dois pontos de dor de toda migração de monólito para serviços?
19. Diferencie *big ball of mud* e monólito distribuído. Por que o segundo é o pior dos dois mundos?
20. Por que consolidar serviços de volta num processo único não é um fracasso de arquitetura?
21. Compare SOA e microsserviços — qual a crítica histórica ao ESB?
22. Diferencie event notification, event-carried state transfer e event sourcing.
23. Orquestração × coreografia: vantagens de cada uma e quando usar.
24. Por que *at-least-once* torna a idempotência obrigatória?
25. Quando escolher comunicação síncrona e quando escolher assíncrona?
26. Por que chamadas síncronas encadeadas causam falha em cascata?
27. O que um service mesh faz, e qual a alternativa em biblioteca?
28. Enuncie a Lei de Conway e explique a manobra inversa.
---

> [← Voltar para ARQUITETURA DISTRIBUÍDA](README.md) · Próximo: [II - LATÊNCIA E PERFORMANCE](ii-latencia-e-performance.md)
