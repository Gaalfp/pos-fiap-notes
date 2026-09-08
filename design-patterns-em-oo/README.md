# DESIGN PATTERNS EM OO

> **Capítulos:** [I - Criacionais](i-padroes-criacionais.md) · [II - Estruturais](ii-padroes-estruturais.md) · [III - Comportamentais](iii-padroes-comportamentais.md)

São soluções típicas para problemas comuns no desenvolvimento de software. São como modelos pré-fabricados que você pode personalizar para resolver um problema recorrente no seu código. Você não pode simplesmente encontrar um padrão e copiá-lo para o seu programa, como faria com funções ou bibliotecas prontas. O padrão não é um trecho de código específico, mas um **conceito geral** para resolver um problema em particular — você segue a estrutura e implementa uma solução que se adeque à realidade do seu programa.

**Origem:** o catálogo canônico é o livro *Design Patterns: Elements of Reusable Object-Oriented Software* (1994), dos quatro autores conhecidos como **GoF — Gang of Four** (Gamma, Helm, Johnson, Vlissides). São **23 padrões**. A ideia de "linguagem de padrões" veio antes, da arquitetura civil, com Christopher Alexander.

**Padrão × biblioteca × framework:** biblioteca é código pronto que você chama; framework é código pronto que chama o seu; **padrão é uma ideia de projeto** — não tem código, tem estrutura.

---

## 1. Os dois princípios por trás de quase todos

O livro do GoF enuncia dois princípios que explicam a maioria dos 23 padrões:

**1. Programe para uma interface, não para uma implementação.**
O cliente depende de um tipo abstrato; a implementação concreta é escolhida em outro lugar. É o que permite trocar comportamento sem tocar em quem usa. (É o **D** de [SOLID](../solid/README.md).)

**2. Prefira composição de objetos a herança de classes.**
Herança é acoplamento em tempo de **compilação**: a subclasse enxerga o interior da superclasse e não muda mais. Composição é acoplamento em tempo de **execução**: você troca a peça sem recompilar quem usa. Strategy, Decorator, Bridge, State e Composite existem essencialmente para trocar herança por composição.

Um padrão do GoF é descrito por quatro elementos: **nome** (vocabulário comum do time), **problema** (quando aplicar), **solução** (a estrutura de classes e objetos) e **consequências** (o que você ganha e o que paga).

---

## 2. Os 23 padrões

| | **Criacional** — criação de objetos | **Estrutural** — composição | **Comportamental** — responsabilidade e comunicação |
|---|---|---|---|
| **Escopo de classe** (herança, estático) | Factory Method | Adapter *(versão por herança)* | Interpreter · Template Method |
| **Escopo de objeto** (composição, dinâmico) | Abstract Factory · Builder · Prototype · Singleton | Adapter *(por composição)* · Bridge · Composite · Decorator · Facade · Flyweight · Proxy | Chain of Responsibility · Command · Iterator · Mediator · Memento · Observer · State · Strategy · Visitor |

- **Criacionais (5)** — flexibilizam **como** os objetos nascem, tirando o `new` concreto de dentro do cliente.
- **Estruturais (7)** — montam objetos em estruturas maiores mantendo flexibilidade: adaptar, envolver, aninhar, simplificar.
- **Comportamentais (11)** — distribuem responsabilidade e definem como os objetos conversam.

---

## 3. Tabela de reconhecimento rápido

Ferramenta de véspera de prova: **o problema soa assim → o padrão é esse.** Em prova de GoF, o que se cobra é reconhecer o padrão pelo enunciado ou pelo diagrama.

| O enunciado diz… | Padrão | Categoria |
|---|---|---|
| "uma única instância, ponto de acesso global" | **Singleton** | criacional |
| "a subclasse decide qual objeto criar" | **Factory Method** | criacional |
| "famílias de produtos relacionados que combinam entre si" | **Abstract Factory** | criacional |
| "objeto com muitos parâmetros opcionais, construção passo a passo" | **Builder** | criacional |
| "criar copiando um objeto já existente, sem saber a classe concreta" | **Prototype** | criacional |
| "duas interfaces incompatíveis precisam trabalhar juntas" | **Adapter** | estrutural |
| "separar abstração da implementação para variarem independentemente" | **Bridge** | estrutural |
| "tratar objeto individual e composição de objetos do mesmo jeito (árvore)" | **Composite** | estrutural |
| "adicionar responsabilidade dinamicamente, sem herança, empilhável" | **Decorator** | estrutural |
| "uma porta de entrada simples para um subsistema complexo" | **Facade** | estrutural |
| "muitos objetos parecidos consumindo memória demais" | **Flyweight** | estrutural |
| "controlar o acesso a um objeto (lazy, remoto, segurança, cache)" | **Proxy** | estrutural |
| "passar a requisição por uma cadeia até alguém tratar" | **Chain of Responsibility** | comportamental |
| "encapsular uma requisição como objeto; desfazer, enfileirar, agendar" | **Command** | comportamental |
| "percorrer uma coleção sem expor a estrutura interna" | **Iterator** | comportamental |
| "muitos objetos se conhecendo demais; centralizar a comunicação" | **Mediator** | comportamental |
| "salvar e restaurar o estado sem violar o encapsulamento" | **Memento** | comportamental |
| "quando um muda, todos os interessados são notificados" | **Observer** | comportamental |
| "o objeto muda de comportamento conforme o estado interno" | **State** | comportamental |
| "família de algoritmos intercambiáveis, escolhidos em runtime" | **Strategy** | comportamental |
| "o esqueleto do algoritmo é fixo; alguns passos variam" | **Template Method** | comportamental |
| "nova operação sobre uma estrutura de objetos, sem alterar as classes" | **Visitor** | comportamental |
| "interpretar uma gramática/expressão" | **Interpreter** | comportamental |

### Os pares que mais confundem

| Confusão | Como separar |
|---|---|
| **Strategy × State** | estrutura idêntica; a **intenção** difere. Strategy: o *cliente* escolhe o algoritmo, e as estratégias não se conhecem. State: o *objeto* troca de estado sozinho, e um estado conhece o próximo |
| **Decorator × Proxy** | os dois envolvem outro objeto. Decorator **acrescenta** comportamento e é empilhável; Proxy **controla o acesso** (lazy, segurança, remoto) e normalmente é um só |
| **Adapter × Facade** | Adapter **converte** uma interface existente em outra esperada; Facade **cria** uma interface nova e simples para um subsistema inteiro |
| **Factory Method × Abstract Factory** | Factory Method é **um** método sobrescrito que cria **um** produto; Abstract Factory é um **objeto** com vários métodos que cria uma **família** consistente |
| **Builder × Abstract Factory** | Builder monta **um** objeto complexo passo a passo; Abstract Factory devolve produtos prontos de uma família |
| **Template Method × Strategy** | Template Method varia passos por **herança** (compilação); Strategy varia o algoritmo inteiro por **composição** (runtime) |
| **Composite × Decorator** | estruturas parecidas: Composite tem **muitos** filhos (árvore); Decorator tem **um** componente envolvido (corrente) |
| **Mediator × Observer** | Mediator centraliza a comunicação num objeto que conhece todos; Observer é notificação um-para-muitos, com o publisher sem conhecer os inscritos |

---

## 4. Onde eles aparecem no JDK e no Spring

Ancorar o padrão em algo que você já usa é a melhor forma de fixar:

| Padrão | JDK | Spring |
|---|---|---|
| Singleton | `Runtime.getRuntime()`, `Desktop.getDesktop()` | escopo padrão de bean (**singleton por container**, não o do GoF) |
| Factory Method | `Calendar.getInstance()`, `NumberFormat.getInstance()` | `FactoryBean<T>`, `@Bean` |
| Abstract Factory | `DocumentBuilderFactory`, `SAXParserFactory` | `BeanFactory`, `ConnectionFactory` |
| Builder | `StringBuilder`, `Stream.Builder`, `Calendar.Builder` | `UriComponentsBuilder`, `MockMvcRequestBuilders`, `SecurityFilterChain` (DSL) |
| Prototype | `Object.clone()`, `Cloneable` | `@Scope("prototype")` |
| Adapter | `Arrays.asList()`, `InputStreamReader` | `HandlerAdapter`, `MessageConverter` |
| Bridge | drivers JDBC | `JdbcTemplate` sobre diferentes dialetos |
| Composite | `Component`/`Container` (AWT) | `CompositeCacheManager`, cadeias de `Validator` |
| Decorator | `BufferedReader(new FileReader(...))`, `Collections.unmodifiableList()` | `HttpServletRequestWrapper`, `TransactionAwareDataSourceProxy` |
| Facade | `javax.faces.context.FacesContext` | `JdbcTemplate`, `RestTemplate`, `JmsTemplate` (fachadas sobre APIs verbosas) |
| Flyweight | `Integer.valueOf()` (cache -128..127), *string pool* | — |
| Proxy | `java.lang.reflect.Proxy`, RMI | **`@Transactional`, `@Cacheable`, `@Async`, `@PreAuthorize` — todo o AOP** |
| Chain of Responsibility | `FilterChain` da API Servlet | `SecurityFilterChain`, `HandlerInterceptor` |
| Command | `Runnable`, `Callable` | `TransactionCallback`, `@Scheduled` |
| Iterator | `Iterator`, `Iterable` (o `for-each`) | `Page`/`Slice` |
| Mediator | `ExecutorService` (coordena tarefas) | `ApplicationEventPublisher` |
| Memento | serialização, `Object.clone()` para snapshot | `@Transactional` rollback (conceitualmente) |
| Observer | `PropertyChangeListener`, `Flow.Subscriber` | `ApplicationListener`, `@EventListener` |
| State | — | `StateMachine` (Spring Statemachine) |
| Strategy | `Comparator`, `ThreadPoolExecutor.RejectedExecutionHandler` | `PasswordEncoder`, `AuthenticationProvider`, `ViewResolver` |
| Template Method | `AbstractList`, `InputStream` | `JdbcTemplate`, `AbstractController`, `OncePerRequestFilter` |
| Visitor | `FileVisitor` (`Files.walkFileTree`), API de anotações | `BeanDefinitionVisitor` |

> **O padrão mais importante para entender Spring é o Proxy.** `@Transactional`, `@Cacheable` e `@PreAuthorize` funcionam porque o container entrega um **proxy** no lugar da sua bean. Daí vem a pegadinha da **chamada interna**: um método chamando outro da mesma classe via `this` não passa pelo proxy — e a anotação simplesmente não tem efeito. → [SPRING DATA JPA](../spring-data-jpa/README.md) · [SPRING SECURITY](../spring-security/README.md)

---

## 5. Padrões e SOLID

Quase todo padrão do GoF é um princípio SOLID materializado — essa tabela cruzada é excelente resposta de dissertativa:

| Princípio | Padrões que o realizam | Como |
|---|---|---|
| **SRP** | Command, Visitor, Mediator, Facade | extraem uma responsabilidade para um objeto próprio |
| **OCP** | **Strategy, Decorator, Template Method, State, Chain of Responsibility, Abstract Factory** | estender = adicionar uma nova classe, não editar as existentes |
| **LSP** | Template Method, Composite | subclasses precisam honrar o contrato da base |
| **ISP** | Adapter, Facade | expõem só a interface que o cliente precisa |
| **DIP** | **Abstract Factory, Factory Method, Strategy, Bridge, Observer** | o cliente depende da abstração; o concreto é injetado |

O caminho inverso também vale: quando você aplica OCP para acabar com um `switch` que cresce a cada requisito, o que nasce é um **Strategy**. Padrões não são invenções soltas — são consequências dos princípios.

---

## 6. Crítica: quando padrão vira problema

- **Patternitis / over-engineering** — aplicar padrão porque é bonito, não porque há problema. Três interfaces e uma factory para uma classe que nunca terá segunda implementação é custo puro. A regra é **YAGNI**: o padrão entra quando a variação **aparece**, não quando você imagina que pode aparecer.
- **Padrão como sintoma de limitação da linguagem** — Peter Norvig observou que 16 dos 23 padrões ficam invisíveis ou triviais em linguagens com funções de primeira classe. Em Java moderno, Strategy e Command frequentemente são só um `Function` ou um lambda; Iterator virou `for-each`.
- **Singleton é considerado antipadrão por muita gente** — estado global, acoplamento escondido, difícil de testar. Ver o [capítulo I](i-padroes-criacionais.md).
- **Padrão errado é pior que nenhum** — usar Decorator onde o problema pedia Strategy adiciona indireção sem resolver a variação.

Critério prático: **o padrão precisa remover uma dor real que já existe no código.** Se você não consegue nomear a dor, não aplique.

---

## Perguntas para autoavaliação

1. O que é um design pattern e por que ele não é uma biblioteca?
2. Quais são as três categorias do GoF e o critério de cada uma?
3. Enuncie os dois princípios do GoF e dê um padrão que materializa cada um.
4. Strategy e State têm a mesma estrutura. O que os diferencia?
5. Decorator e Proxy também se parecem. Como distinguir pela intenção?
6. Adapter × Facade: qual converte e qual simplifica?
7. Factory Method × Abstract Factory: qual cria um produto e qual cria uma família?
8. Qual padrão explica `@Transactional` no Spring, e que pegadinha ele causa?
9. Relacione OCP com Strategy, e DIP com Abstract Factory.
10. Cite um risco real de aplicar padrões em excesso.

---

> **Capítulos:** [I - Criacionais](i-padroes-criacionais.md) · [II - Estruturais](ii-padroes-estruturais.md) · [III - Comportamentais](iii-padroes-comportamentais.md)
>
> **Relacionados:** [SOLID](../solid/README.md) · [POO](../poo/README.md) · [CLEAN ARCHITECTURE](../clean-architecture/README.md)
