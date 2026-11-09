# QUARKUS

> **Capítulos:** [I - Como funciona](i-como-funciona.md) · [II - Quarkus na prática](ii-quarkus-na-pratica.md) · [III - Quarkus × Spring](iii-quarkus-x-spring.md)

**Quarkus** é um framework Java criado pela **Red Hat** (primeira versão em 2019) que se apresenta como *"a Kubernetes-native Java stack"* — uma pilha Java desenhada **para rodar em container**, não em servidor de aplicação.

A frase de marketing é *"Supersonic Subatomic Java"*, mas a ideia técnica por trás é uma só e vale memorizar:

> **Tudo o que um framework tradicional faz quando a aplicação sobe, o Quarkus faz quando a aplicação é compilada.**

Essa única decisão explica praticamente todo o resto: a inicialização em milissegundos, o consumo baixo de memória, a compatibilidade com imagem nativa, o modelo de extensões — e também as limitações dele.

> Essa frase só tem sentido se **compilar**, **subir** e **rodar** forem três coisas distintas e nítidas na sua cabeça. Se não forem — ou se termos como *build*, *boot*, *runtime* e *reflexão* ainda escorregam — comece pela **seção 1**: ela monta o mapa que o resto do material usa.

---

## 1. Antes de tudo: o que uma aplicação Java faz, do código ao ar

Todo o resto deste material gira em torno de **em qual momento** o trabalho é feito. Então, antes de falar do Quarkus, vale deixar nítido o que são esses momentos — e o que uma aplicação Java de fato faz em cada um deles.

### As três fases da vida de uma aplicação

```mermaid
flowchart LR
    DEV["👩‍💻 você escreve<br/><b>código-fonte</b><br/><i>arquivos .java</i>"]
    BUILD["🔨 <b>BUILD</b><br/>compilar + empacotar<br/><i>na sua máquina ou no CI</i>"]
    ART["📦 <b>artefato</b><br/><i>JAR, binário<br/>ou imagem</i>"]
    BOOT["🚀 <b>BOOT</b><br/>o processo sobe<br/>e se prepara"]
    RUN["⚙️ <b>EM REGIME</b><br/>atendendo requisições<br/><i>'em runtime'</i>"]
    DEV --> BUILD --> ART --> BOOT --> RUN
    RUN -->|"deploy novo,<br/>escala, reinício"| BOOT
```

| Fase | Quando acontece | Quem executa | O que acontece | Quantas vezes |
|---|---|---|---|---|
| **Build** | antes de publicar | sua máquina ou o servidor de CI | o **compilador** traduz `.java` em `.class` (bytecode) e empacota tudo num artefato | **uma vez por versão** |
| **Boot** (inicialização) | ao iniciar o processo | a máquina onde a aplicação roda | a JVM sobe, carrega as classes e o framework **monta a aplicação**: lê configuração, cria objetos, abre conexões, registra rotas | **a cada** vez que o processo sobe |
| **Em regime** (*runtime*) | depois do boot | a mesma máquina | o processo fica no ar recebendo requisições, executando regra de negócio e falando com banco e outros serviços | continuamente, até o processo morrer |

A distinção que importa: **o build acontece uma vez; o boot acontece sempre.** Se há 200 réplicas de um serviço subindo e descendo ao longo do dia, o trabalho de boot é pago 200 vezes por dia — e é exatamente aí que o Quarkus vai mexer.

### O vocabulário mínimo

| Termo | O que é, em uma linha |
|---|---|
| **Código-fonte** | os arquivos `.java` que você escreve; nada disso roda direto |
| **Compilar** | traduzir código-fonte para um formato executável. Em Java, o `javac` gera **bytecode** |
| **Bytecode** (`.class`) | instruções para a **JVM**, não para o processador. É o que está dentro do JAR |
| **Build** | o processo completo: compilar + resolver dependências + empacotar (+ no Quarkus, a *augmentation*). É o que o Maven/Gradle faz |
| **Artefato** | o pacote que sai do build: um **JAR**, um binário do sistema operacional ou uma imagem de container |
| **JVM** | *Java Virtual Machine* — o programa que executa o bytecode, traduzindo-o para instruções reais do processador |
| **Deploy** | levar o artefato para o ambiente onde ele vai rodar (servidor, container, pod) |
| **Processo** | a aplicação **em execução**, ocupando memória e CPU. Um pod no Kubernetes é, na prática, um processo |
| **Boot** / *startup* / inicialização | o intervalo entre o comando `java -jar app.jar` e a aplicação **estar pronta** para atender a primeira requisição |
| **Runtime** | o tempo em que o processo está no ar. "Decidido em runtime" = decidido **enquanto a aplicação roda**, com o ambiente real na mão |
| ***Classpath*** | a lista de lugares onde a JVM procura classes: o seu código **mais** todas as bibliotecas (dezenas de milhares de classes, num projeto comum) |
| ***Classloading*** | carregar uma classe do disco para a memória na primeira vez que ela é usada |
| **Anotação** (`@Entity`) | um marcador no código que não faz nada por si: um framework precisa **lê-lo** e agir |
| **Reflexão** (*reflection*) | código que **inspeciona e usa outras classes por nome**, descobrindo-as enquanto roda. É assim que um framework encontra suas classes anotadas sem nunca ter ouvido falar delas |
| **JIT** (*just-in-time*) | compilador que, **em runtime**, observa quais trechos são mais executados e os recompila otimizados para a máquina. É o que faz a JVM ficar mais rápida com o tempo |
| **AOT** (*ahead-of-time*) | o oposto: compilar **antes** de rodar, já para código nativo da máquina |
| ***Heap*** / **RSS** | *heap* é a área de memória dos objetos; **RSS** é a memória física total que o sistema operacional vê o processo ocupando (é o número que a cota do pod cobra) |
| ***Cold start*** | a espera sentida pelo usuário quando a requisição chega e **não havia instância no ar** — ela precisa bootar primeiro |

### O que a aplicação faz no boot — o passo a passo

Esta é a parte que quase ninguém olha de perto, e é o coração do assunto. Entre o `java -jar app.jar` e o primeiro `200 OK`, numa aplicação web típica, acontece isto:

```mermaid
flowchart TB
    P1["1 · a JVM sobe<br/><i>aloca memória, inicializa</i>"]
    P2["2 · carrega classes<br/><i>suas e das bibliotecas</i>"]
    P3["3 · VARRE O CLASSPATH<br/>procurando anotações<br/><i>@Entity, @Service, @RestController…</i>"]
    P4["4 · monta o grafo de objetos<br/><i>quem depende de quem,<br/>cria tudo na ordem certa</i>"]
    P5["5 · gera proxies<br/><i>classes 'embrulho' para transação,<br/>cache, segurança</i>"]
    P6["6 · valida o mapeamento ORM<br/><i>classe × tabela × coluna</i>"]
    P7["7 · lê a configuração<br/>e abre o pool de conexões"]
    P8["8 · registra as rotas<br/>e abre a porta HTTP"]
    OK["✅ pronto para a<br/>primeira requisição"]
    P1 --> P2 --> P3 --> P4 --> P5 --> P6 --> P7 --> P8 --> OK
```

| Passo | O que é, em palavras simples |
|---|---|
| **1–2. JVM e classes** | o processo nasce e as classes vão sendo lidas do JAR para a memória |
| **3. Varredura do classpath** | o framework **não sabe** quais são as suas classes. Para descobrir, ele percorre tudo o que está no classpath, por **reflexão**, perguntando "esta classe tem `@Entity`? tem `@Service`?" Em projeto grande, são muitos milhares de classes examinadas **toda vez que a aplicação sobe** |
| **4. Grafo de objetos** | com a lista em mãos, o container de **injeção de dependência** descobre que `PedidoService` precisa de `PedidoRepository`, que precisa de `DataSource`… e constrói todo mundo na ordem correta |
| **5. Proxies** | para `@Transactional` funcionar, o framework **embrulha** a sua classe em outra, gerada ali na hora, que abre e fecha a transação em volta do seu método. O mesmo para cache e segurança |
| **6. Validação do ORM** | o Hibernate confere se cada entidade bate com as tabelas e monta seu metamodelo interno |
| **7–8. Config, pool e porta** | lê variáveis de ambiente e arquivos, abre as conexões de banco e finalmente passa a escutar na porta |

**Dois fatos sobre essa lista** sustentam tudo o que vem depois:

- **É trabalho repetido e idêntico.** Os passos 3, 4, 5 e 6 dão exatamente o mesmo resultado em toda inicialização — a mesma varredura, o mesmo grafo, os mesmos proxies. Nada ali depende do ambiente.
- **Ele deixa resíduo na memória.** Os metadados do escaneamento, o catálogo de objetos e os caches de reflexão continuam ocupando memória enquanto o processo vive, mesmo sem nunca serem usados de novo.

### O que ela faz depois, em regime

Pronta, a aplicação entra no laço que é a vida real dela:

```mermaid
sequenceDiagram
    participant C as Cliente
    participant S as Servidor HTTP
    participant A as Seu código
    participant DB as Banco
    C->>S: GET /pedidos/42
    S->>A: entrega a requisição a uma thread
    A->>DB: consulta
    DB-->>A: dados
    A-->>S: objeto de resposta
    S-->>C: 200 OK (JSON)
    Note over A: a cada repetição, o JIT<br/>aprende e otimiza o caminho quente
```

Duas coisas acontecem com o tempo nesse regime: a aplicação **fica mais rápida** (o JIT vai compilando e otimizando o que mais se executa — é o "aquecimento") e a memória **se estabiliza** num patamar que inclui os objetos em uso, os caches e todo o resíduo do boot.

### Por que isso importa para entender o Quarkus

Com esse mapa na mão, as três ideias centrais do framework ficam óbvias:

1. Os passos **3 a 6** do boot são sempre iguais → então podem ser feitos **uma vez, no build**, e não a cada inicialização. É isso, e só isso, que significa *build-time augmentation*.
2. Se esse trabalho não acontece mais no boot, **o resíduo dele não existe na memória** → footprint menor.
3. Se nada é descoberto por **reflexão em runtime**, a aplicação pode ser compilada **AOT** para um binário nativo — porque tudo já é conhecido antes de rodar.

> Se algum termo da tabela acima ainda estiver nebuloso, vale fixá-lo agora: as seções seguintes usam "build", "boot", "runtime" e "reflexão" como vocabulário corrente.

---

## 2. O problema que o Quarkus resolve

A JVM foi projetada para um mundo em que a aplicação subia **uma vez**, numa máquina grande, e ficava no ar por meses. Nesse mundo, gastar 40 segundos no boot e 2 GB de heap era irrelevante: o JIT tinha tempo de aquecer e o throughput compensava tudo.

Container, Kubernetes e serverless mudaram a conta:

| O mundo para o qual a JVM foi feita | O mundo de container e Kubernetes |
|---|---|
| Um processo grande, de vida longa | **Muitos** processos pequenos, de vida curta |
| Sobe uma vez por release | Sobe a cada deploy, *scale-out*, *rollout*, *reschedule* do nó |
| Memória é do servidor | Memória é **cota do pod** — e o preço é por GB |
| Boot de 1 minuto não incomoda | Boot de 1 minuto **impede** autoescala reativa e *scale-to-zero* |
| Otimizar throughput de pico | Otimizar **densidade** (quantas instâncias cabem por nó) e **custo** |
| Reflexão e classpath dinâmico são grátis | Reflexão custa memória e **impede compilação nativa** |

O custo do modelo antigo está concentrado no **boot** — nos passos 3 a 6 do [passo a passo da seção 1](#o-que-a-aplicação-faz-no-boot--o-passo-a-passo): varrer o classpath, montar o grafo de dependências, gerar proxies, validar o mapeamento ORM. Esse trabalho dá **sempre o mesmo resultado** a cada inicialização — e é exatamente ele que o Quarkus tira do caminho.

---

## 3. A ideia central: *build-time augmentation*

O Quarkus move o trabalho de inicialização para a **fase de compilação** (chamada de **augmentation**). O resultado do build não é só o seu código: é o seu código **mais o bytecode já gerado** com o grafo de injeção resolvido, os proxies criados e os metadados prontos.

```mermaid
flowchart TB
    subgraph T["Framework tradicional — trabalho a cada boot"]
        direction LR
        T1["build<br/><i>compila e empacota</i>"] --> T2["BOOT<br/>escanear classpath<br/>montar DI<br/>gerar proxies<br/>validar ORM<br/>ler config"] --> T3["pronto<br/><i>segundos depois</i>"]
    end
    subgraph Q["Quarkus — trabalho uma vez, no build"]
        direction LR
        Q1["BUILD + augmentation<br/>escanear classpath<br/>montar DI<br/>gerar proxies<br/>validar ORM"] --> Q2["boot<br/><i>só executa o<br/>bytecode pronto</i>"] --> Q3["pronto<br/><i>milissegundos depois</i>"]
    end
```

Três consequências diretas:

1. **Sobe rápido mesmo na JVM comum.** O ganho de inicialização não depende de imagem nativa — vem de não repetir no boot um trabalho que já foi feito.
2. **Gasta menos memória.** Não há metadados de escaneamento, `BeanDefinition` nem cache de reflexão vivos no heap: o que sobreviveu virou bytecode.
3. **Fica compatível com compilação nativa.** O GraalVM exige saber **tudo em tempo de build** (*closed world*). Um framework que resolve tudo no build já atende a essa exigência por construção — daí o Quarkus ser nativo-*friendly* e o modelo tradicional não.

> **A pegadinha nº 1 da matéria:** o Quarkus **não** é rápido *porque* é nativo. Ele é rápido porque antecipa o trabalho para o build; a imagem nativa é um **segundo** ganho, opcional, empilhado sobre o primeiro. → [I - Como funciona](i-como-funciona.md)

O preço aparece no [capítulo I](i-como-funciona.md#8-o-preço-do-modelo): se as decisões são tomadas no build, **mudar de decisão exige rebuild**. Parte da configuração do Quarkus é *build-time* e não se altera por variável de ambiente.

---

## 4. Os dois modos de execução

O mesmo código-fonte produz dois artefatos diferentes, e essa escolha é de **deploy**, não de programação:

| | **Modo JVM** (`package`) | **Modo nativo** (`-Dnative`) |
|---|---|---|
| Artefato | JAR + JVM (HotSpot) | **executável** do sistema operacional |
| Como nasce | `./mvnw package` | `./mvnw package -Dnative` (GraalVM/Mandrel) |
| Inicialização | dezenas a centenas de ms | **poucos ms a algumas dezenas de ms** |
| Memória (RSS) | baixa | **a mais baixa das três opções** |
| Tempo de build | segundos | **minutos**, e exige muita RAM na máquina de build |
| JIT em runtime | **sim** — otimiza com o tempo | **não** — tudo foi compilado AOT |
| Throughput sustentado | **tende a ganhar** em carga longa | pode perder, por não ter JIT |
| Reflexão dinâmica | livre | precisa ser **registrada** no build |
| Imagem de container | precisa de JRE na imagem | binário em imagem mínima |

**A regra de escolha:** processo de **vida curta** ou que escala agressivamente (função serverless, job, CLI, pod que nasce e morre) → **nativo**. Serviço de **vida longa** sob carga constante → **modo JVM**, onde o JIT trabalha a seu favor.

> Os números divulgados pelo projeto (ordem de grandeza: **dezenas de MB** de RSS e **dezenas de ms** de boot no nativo, contra **centenas de MB** e **segundos** numa pilha tradicional) vêm de *benchmarks* do próprio fornecedor, em aplicações REST+CRUD simples. A ordem de grandeza se sustenta na prática; o número exato depende da sua aplicação — meça a sua. → [III - Quarkus × Spring](iii-quarkus-x-spring.md#3-inicialização-e-memória-os-números-e-o-que-eles-não-dizem)

---

## 5. O que ele é por dentro

O Quarkus não inventou um conjunto novo de APIs: ele **implementa padrões** já existentes do ecossistema Java corporativo, sobre um núcleo reativo.

```mermaid
flowchart TB
    APP["Sua aplicação"]
    subgraph API["APIs — padrões, não proprietárias"]
        JK["Jakarta EE<br/>CDI · REST · Persistence<br/>Validation · Transactions"]
        MP["MicroProfile<br/>Config · Health · Metrics<br/>OpenAPI · Fault Tolerance<br/>Reactive Messaging"]
    end
    subgraph CORE["Núcleo do Quarkus"]
        ARC["ArC<br/><i>CDI resolvido em build time</i>"]
        EXT["Extensões<br/><i>módulo de deployment + runtime</i>"]
        MUT["Mutiny<br/><i>API reativa: Uni / Multi</i>"]
    end
    VX["Vert.x — event loop, I/O não bloqueante"]
    APP --> API --> CORE --> VX
```

| Peça | Papel |
|---|---|
| **Jakarta EE** | as anotações que você escreve: `@Inject`, `@Path`, `@Entity`, `@Transactional`, `@Valid` |
| **MicroProfile** | os padrões de microsserviço: configuração, *health check*, métricas, OpenAPI, tolerância a falhas |
| **SmallRye** | as implementações da Red Hat dessas especificações MicroProfile usadas pelo Quarkus |
| **ArC** | o container de injeção de dependência — CDI **resolvido no build**, sem escaneamento em runtime |
| **Extensões** | a unidade de integração: cada tecnologia (Hibernate, Kafka, Redis…) entra como extensão, com uma parte que roda no **build** e outra em **runtime** |
| **Vert.x** | o motor de I/O não bloqueante sob tudo — é o *event loop* que atende as requisições |
| **Mutiny** | a API reativa exposta ao desenvolvedor: `Uni` (0 ou 1 resultado) e `Multi` (vários) |

Isso tem um efeito prático importante: **o que você aprende em Quarkus é em boa parte padrão Jakarta/MicroProfile**, não API de um framework só. → [I - Como funciona](i-como-funciona.md)

---

## 6. Onde o Quarkus é usado

O denominador comum dos casos de uso é sempre o mesmo: **quando inicialização e memória viram custo ou requisito**.

| Cenário | Por que o Quarkus se encaixa |
|---|---|
| **Serverless / FaaS** (AWS Lambda, Azure Functions, Knative) | *cold start* é a métrica que manda; o nativo sobe em dezenas de ms. Permite *scale-to-zero* de verdade |
| **Microsserviços em Kubernetes** | mais pods por nó com a mesma cota de memória → **densidade** e custo menor de cluster |
| **Autoescala reativa** | um pod que sobe em 50 ms consegue responder ao pico; um que sobe em 40 s não |
| **Jobs, CronJobs e CLIs** | processo de vida curta: o boot era uma fração enorme do tempo total de execução |
| **Consumidores de mensageria** | Reactive Messaging (Kafka, AMQP, MQTT) sobre o núcleo reativo → [MENSAGERIA](../mensageria/README.md) |
| **Edge e IoT** | binário nativo pequeno, sem JVM, em hardware restrito |
| **Modernização de legado Java EE** | o código já usa CDI, JPA e JAX-RS; a migração é mais curta do que reescrever em Spring |
| **Ambiente Red Hat / OpenShift** | é o stack Java suportado comercialmente pela Red Hat, com integração pronta |

**Onde ele faz menos sentido:** monólito corporativo de vida longa que já roda bem; time inteiramente formado em Spring, sem demanda de custo ou *cold start*; projeto que depende de bibliotecas que só existem no ecossistema Spring (Spring Cloud, Spring Batch, Spring Integration); e qualquer caso em que **custo de inicialização simplesmente não é um problema** — aí o ganho não paga a curva de aprendizado.

> Entre os casos publicados pelo próprio projeto há empresas de telecomunicações, aviação e serviços financeiros relatando redução de consumo de memória e de custo de infraestrutura. Trate esses relatos como o que são: **estudos de caso do fornecedor** — úteis como indício, não como prova.

---

## 7. O que o Quarkus **NÃO** é

| Afirmação comum | Por que está errada |
|---|---|
| "É um Spring Boot mais rápido" | Não é uma reimplementação do Spring. As APIs são Jakarta EE + MicroProfile; o modelo de DI é CDI resolvido em build time |
| "Só vale a pena com imagem nativa" | O maior ganho é do *build-time augmentation*, que acontece também no modo JVM |
| "É rápido porque é nativo" | Invertido: é compatível com nativo **porque** resolve tudo no build |
| "É só para aplicação reativa" | O modelo imperativo é cidadão de primeira classe; o núcleo reativo fica embaixo, opcional para você |
| "As extensões `spring-*` rodam Spring dentro do Quarkus" | Elas traduzem um **subconjunto** de anotações Spring para o modelo do Quarkus. São ponte de migração, não runtime do Spring → [III](iii-quarkus-x-spring.md#7-as-extensões-de-compatibilidade-com-spring) |
| "Substitui o Spring no mercado" | O ecossistema, a comunidade e o mercado de trabalho do Spring são ordens de grandeza maiores |

---

## Capítulos

- [I - COMO FUNCIONA](i-como-funciona.md) — *build-time augmentation* em detalhe, ArC e CDI no build, anatomia de uma extensão, GraalVM e o mundo fechado, JIT × AOT, dev mode e live reload, modelo de threads (Vert.x e Mutiny) e o preço do modelo
- [II - QUARKUS NA PRÁTICA](ii-quarkus-na-pratica.md) — estrutura do projeto, Jakarta REST, CDI, configuração e perfis, Hibernate com Panache, transações, validação, mensageria, testes com `@QuarkusTest` e Dev Services, observabilidade e empacotamento para container
- [III - QUARKUS × SPRING](iii-quarkus-x-spring.md) — o comparativo ponto a ponto: injeção de dependência, tabela de-para das anotações, números de boot e memória, modelo reativo, testes, ecossistema e maturidade, extensões de compatibilidade, critério de escolha e roteiro de migração

---

## Perguntas para autoavaliação

1. Quais são as três fases da vida de uma aplicação e o que acontece em cada uma?
2. Qual a diferença entre compilar, buildar, bootar e rodar?
3. O que é bytecode e por que ele precisa da JVM?
4. Explique classpath, classloading e reflexão — e por que um framework precisa de reflexão.
5. Descreva os oito passos entre `java -jar app.jar` e a primeira requisição atendida.
6. Quais desses passos dão sempre o mesmo resultado, e por que isso é a chave do Quarkus?
7. Que resíduo o boot deixa na memória do processo?
8. O que é o JIT e por que a aplicação fica mais rápida com o tempo?
9. Diferencie JIT e AOT, heap e RSS, boot e *cold start*.
10. Qual é a ideia central do Quarkus, em uma frase?
11. O que mudou no mundo de container e Kubernetes que tornou o custo de boot e de memória relevante?
12. Que trabalho um framework tradicional faz a cada inicialização, e onde o Quarkus o faz?
13. Por que o Quarkus sobe rápido **mesmo sem** imagem nativa?
14. Qual a relação entre *build-time augmentation* e a possibilidade de compilar nativo?
15. Compare modo JVM e modo nativo em cinco critérios.
16. Em que situação o modo JVM **ganha** do nativo? Por quê?
17. Que padrões o Quarkus implementa em vez de criar APIs próprias? Dê exemplos de cada.
18. O que são ArC, Mutiny e Vert.x no desenho do framework?
19. Cite quatro cenários em que o Quarkus se encaixa bem e dois em que não vale a pena.
20. Por que "é rápido porque é nativo" está invertido?
21. As extensões `quarkus-spring-*` rodam Spring dentro do Quarkus? O que elas fazem de fato?
22. Qual é o preço de tomar decisões em tempo de build?
---

**Relacionados:** [Spring MVC - APIs RESTful](../spring-mvc-apis-restful/README.md) · [SPRING DATA JPA](../spring-data-jpa/README.md) · [DOCKER](../docker/README.md) · [ARQUITETURA DISTRIBUÍDA](../arquitetura-distribuida/i-estilos-arquiteturais.md) · [MENSAGERIA](../mensageria/README.md) · [SPRING E SPRING BOOT](../spring-e-spring-boot/README.md)
