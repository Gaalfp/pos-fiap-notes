# SOLID

O acrônimo **SOLID** representa cinco princípios da programação orientada a objetos que ajudam a criar sistemas mais fáceis de manter, entender e estender. Eles foram popularizados por Robert C. Martin (Uncle Bob) e são fundamentais para uma boa arquitetura de software.

Vantagens:

- Manutencao Facilitada
- Testabilidade
- Reutilizacao
- Legibilidade e Compreensao

> Os cinco princípios atacam o mesmo inimigo: **a mudança**. Software que ninguém precisa mudar não precisa de SOLID. O objetivo é que uma alteração de requisito toque **poucos arquivos**, e que esses arquivos sejam **os previsíveis**. Uncle Bob resume: *"o objetivo dos princípios é criar estruturas de nível médio que tolerem mudança, sejam fáceis de entender e sejam a base de componentes reutilizáveis"*.

| | Princípio | Pergunta que ele responde |
|---|---|---|
| **S** | Single Responsibility | esta classe tem quantos motivos para mudar? |
| **O** | Open/Closed | para estender, preciso editar o que já funciona? |
| **L** | Liskov Substitution | posso trocar a implementação sem quebrar quem usa? |
| **I** | Interface Segregation | estou obrigando alguém a depender do que não usa? |
| **D** | Dependency Inversion | quem depende de quem — a regra ou o detalhe? |

---

## S — Single Responsibility

Principio da responsabilidade única, a classe ela deve ter apenas uma responsabilidade. Se uma classe tem muitas responsabilidades, aumenta a complexidade e a dificuldade de manter ou alterar o codigo. Já que a mudança de uma responsabilidade na classe pode ocasionar erros/alteracoes em outra.

A formulação precisa de Uncle Bob é mais útil que "faça só uma coisa":

> **Uma classe deve ter um, e apenas um, motivo para mudar** — ou seja, deve responder a **um único ator** (uma área de negócio, um stakeholder).

```java
// ❌ VIOLANDO — três atores diferentes mandam nesta classe
public class Transferencia {

    public void executar(ContaId origem, ContaId destino, BigDecimal valor) {
        if (valor.signum() <= 0) throw new IllegalArgumentException();   // regra → NEGÓCIO

        try (var conn = DriverManager.getConnection(URL)) {              // persistência → DBA
            conn.prepareStatement("UPDATE conta SET saldo = saldo - ? WHERE id = ?").execute();
        } catch (SQLException e) { throw new RuntimeException(e); }

        var email = "<html><body>Você transferiu R$ " + valor + "</body></html>";   // → MARKETING
        smtp.send(email);
    }
}
```

Mudou o layout do e-mail? Recompila a regra de transferência. Trocou o banco? Mexe na mesma classe. Três motivos para mudar, três times diferentes pedindo alteração no mesmo arquivo — e conflito de merge garantido.

```java
// ✅ CORRIGIDO — cada responsabilidade em seu lugar
public class RealizarTransferenciaService {                   // orquestra o caso de uso

    private final ContaRepositoryPort contas;                 // persistência
    private final NotificacaoPort notificacao;                // comunicação

    public Comprovante executar(TransferenciaCommand comando) {
        Conta origem  = contas.buscarPorId(comando.origem()).orElseThrow();
        Conta destino = contas.buscarPorId(comando.destino()).orElseThrow();

        origem.debitar(comando.valor());                      // a REGRA vive na entidade
        destino.creditar(comando.valor());

        contas.salvar(origem);
        contas.salvar(destino);

        var comprovante = Comprovante.de(origem, destino, comando.valor());
        notificacao.notificar(comprovante);
        return comprovante;
    }
}
```

**Cuidado com o exagero na direção oposta:** uma classe por método produz "classes anêmicas" e lógica espalhada, que é tão ruim quanto a God Class. O critério não é *tamanho*, é **motivo para mudar**.

**Code smells que denunciam:** God Class / Large Class, método com 200 linhas, nome com "e"/"Manager"/"Util" (`ClienteEPedidoService`), `import` de pacotes muito distintos no mesmo arquivo, classe que muda em quase todo release (*Divergent Change*).

**No Spring:** a separação `@RestController` (entrada) → `@Service` (caso de uso) → `@Repository` (persistência) é SRP institucionalizado pelo framework.

---

## O — Open/Closed

"Classes devem ser abertas a extensão mas fechadas para modificação."

Se voce quer que uma classe execute mais funcionalidades, o ideal é **estender o comportamento sem tocar no código que já existe e já foi testado**. Na prática: em vez de abrir a classe e acrescentar mais um `if`/`switch` a cada caso novo, você cria uma **nova implementação de uma abstração** (interface ou classe abstrata) e o código antigo continua intacto.

O sinal de violação é exatamente esse: toda vez que chega um requisito novo, alguém precisa editar a mesma classe. Se a única forma de estender é modificando o que já está pronto, o princípio foi quebrado.

```java
// ❌ VIOLANDO — cada tipo novo de tarifa reabre e recompila esta classe
public BigDecimal calcularTarifa(Transferencia t) {
    if (t.tipo() == PIX)      return BigDecimal.ZERO;
    if (t.tipo() == TED)      return new BigDecimal("12.90");
    if (t.tipo() == DOC)      return new BigDecimal("8.50");
    throw new IllegalArgumentException("tipo não suportado");
}
```

```java
// ✅ CORRIGIDO — tipo novo = classe nova; nada existente é tocado
public interface CalculadoraTarifa {
    boolean suporta(TipoTransferencia tipo);
    BigDecimal calcular(Transferencia transferencia);
}

@Component
public class TarifaTed implements CalculadoraTarifa {
    public boolean suporta(TipoTransferencia t) { return t == TED; }
    public BigDecimal calcular(Transferencia t) { return new BigDecimal("12.90"); }
}

@Service
public class ServicoTarifa {

    private final List<CalculadoraTarifa> calculadoras;    // o Spring injeta TODAS

    public BigDecimal calcular(Transferencia t) {
        return calculadoras.stream()
                .filter(c -> c.suporta(t.tipo()))
                .findFirst()
                .orElseThrow(() -> new TipoNaoSuportadoException(t.tipo()))
                .calcular(t);
    }
}
```

Isso é literalmente o padrão **Strategy**. → [DESIGN PATTERNS — Comportamentais](../design-patterns-em-oo/iii-padroes-comportamentais.md)

**Nuance importante:** OCP não significa "nunca edite código". Significa que a **variação prevista** deve ser absorvida por extensão. Abstrair *toda* variação imaginável é over-engineering (YAGNI). A regra madura é a **"Fool me once"**: escreva simples da primeira vez; quando a segunda variação chegar, aí sim abstraia — agora você conhece o eixo de variação real.

**Code smells:** `switch`/`if-else` sobre tipo que cresce a cada sprint, `instanceof` em cadeia, constantes de tipo (`TIPO_PIX = 1`) espalhadas.

**No Spring:** `List<Interface>` ou `Map<String, Interface>` injetados, `HandlerInterceptor`, `AuthenticationProvider`, `MessageConverter` — todos são pontos de extensão sem modificação.

---

## L — Liskov Substitution

Se S for um subtipo de T, então objetos do tipo T em um programa podem ser substituídos por objetos do tipo S sem alterar nenhuma das propriedades desejáveis desse programa. Quando uma classe **filha** não consegue executar as mesmas ações que sua classe **pai**, isso pode causar erros.

Se você tem uma classe `Pai` e uma classe `Filho`, você deve poder usar `Filho` em qualquer lugar onde se espera um `Pai` sem que o programa quebre. Se a subclasse altera o comportamento esperado da base (ex: uma classe `Pássaro` que tem o método `voar()`, mas a subclasse `Pinguim` lança uma exceção nesse método), o princípio foi violado.

### O exemplo canônico: Quadrado × Retângulo

É o caso clássico da literatura, porque mostra que **herança correta na matemática pode ser errada no código**:

```java
public class Retangulo {
    protected int largura, altura;
    public void setLargura(int l) { this.largura = l; }
    public void setAltura(int a)  { this.altura = a; }
    public int area() { return largura * altura; }
}

// "todo quadrado É UM retângulo" — verdade na geometria, desastre em OO
public class Quadrado extends Retangulo {
    @Override public void setLargura(int l) { this.largura = l; this.altura = l; }   // muda os DOIS
    @Override public void setAltura(int a)  { this.largura = a; this.altura = a; }
}

// o cliente, escrito contra Retangulo:
void testar(Retangulo r) {
    r.setLargura(5);
    r.setAltura(4);
    assert r.area() == 20;      // ✅ com Retangulo | ❌ com Quadrado: área = 16
}
```

O `Quadrado` **compila**, mas quebra a expectativa de quem programou contra `Retangulo`. LSP não é sobre assinatura (isso o compilador garante) — é sobre **contrato comportamental**.

### As regras de contrato (é isso que a prova cobra)

Para a substituição ser segura, a subclasse:

| Regra | Significa |
|---|---|
| **Pré-condições não podem ser fortalecidas** | a filha não pode exigir *mais* do que a mãe (ex: mãe aceita valor ≥ 0, filha exige ≥ 100) |
| **Pós-condições não podem ser enfraquecidas** | a filha não pode entregar *menos* do que a mãe promete |
| **Invariantes devem ser preservados** | as regras sempre verdadeiras da mãe continuam verdadeiras na filha |
| **Restrição histórica** | a filha não pode permitir mudanças de estado que a mãe proíbe (ex: tornar mutável algo imutável) |
| Exceções | a filha não pode lançar exceções que a mãe não declara |

```java
// ❌ VIOLANDO — fortalece a pré-condição e lança o que a mãe não prevê
public class ContaPoupanca extends Conta {
    @Override public void debitar(BigDecimal valor) {
        if (valor.compareTo(new BigDecimal("100")) < 0)
            throw new ValorMinimoException();      // a mãe aceitava qualquer valor positivo
        super.debitar(valor);
    }
}

// ✅ CORRIGIDO — o que varia não é "conta", é a política de saque
public interface PoliticaSaque { void validar(Conta conta, BigDecimal valor); }

public class Conta {
    private final PoliticaSaque politica;          // composição no lugar de herança
    public void debitar(BigDecimal valor) {
        politica.validar(this, valor);
        this.saldo = saldo.subtract(valor);
    }
}
```

**Como detectar:** subclasse que sobrescreve método para lançar `UnsupportedOperationException` (é o que `Collections.unmodifiableList()` faz — violação consciente e documentada da própria JDK); `if (obj instanceof X)` no **cliente** para tratar subtipos de forma diferente; método herdado que "não faz sentido" na filha.

**Regra prática:** herde por **comportamento substituível**, não por semelhança de dados. Se a filha precisa "desligar" algo da mãe, o relacionamento não é "é um".

---

## I — Interface Segregation

Os clientes nao devem ser forcados a depender de metodos que nao utilizam.

Quando uma classe é obrigada a executar ações que não são úteis, isso é um desperdício e pode gerar erros inesperados caso a classe não tenha a capacidade de executar essas ações.

Uma classe deve executar apenas as ações necessárias para cumprir sua função. Qualquer outra ação deve ser completamente removida ou movida para outro local, caso possa ser utilizada por outra classe no futuro.

```java
// ❌ VIOLANDO — a "interface gorda" obriga implementações a mentir
public interface Funcionario {
    BigDecimal calcularSalario();
    void registrarPonto();
    void aprovarFerias(Funcionario subordinado);       // só gestor faz isso
    void realizarCodeReview(PullRequest pr);           // só dev faz isso
}

public class Estagiario implements Funcionario {
    public void aprovarFerias(Funcionario f) {
        throw new UnsupportedOperationException();     // ← e isso também viola LSP
    }
}
```

```java
// ✅ CORRIGIDO — interfaces pequenas, compostas conforme o papel
public interface Remunerado { BigDecimal calcularSalario(); }
public interface Pontuavel  { void registrarPonto(); }
public interface Gestor     { void aprovarFerias(Funcionario subordinado); }
public interface Revisor    { void realizarCodeReview(PullRequest pr); }

public class Estagiario implements Remunerado, Pontuavel { }
public class TechLead   implements Remunerado, Pontuavel, Gestor, Revisor { }
```

**Ponto sutil:** a segregação é feita **do ponto de vista do cliente**, não do implementador. Interfaces com **um método** (functional interfaces) são o extremo saudável desse princípio — `Comparator`, `Predicate`, `Function`.

Repare que ISP e LSP se sustentam: interface gorda leva a `UnsupportedOperationException`, que quebra a substituição.

**Code smells:** implementações cheias de método vazio ou lançando exceção; interface com 15 métodos; nome genérico (`IService`, `IManager`).

**No Spring/JDK:** `JpaRepository` é uma interface grande, mas o Spring Data permite declarar **a sua** interface só com o que você usa; `Repository`, `CrudRepository`, `PagingAndSortingRepository` são justamente a hierarquia segregada.

---

## D — Dependency Inversion

**Módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender da abstração. Abstrações não devem depender de detalhes, e sim detalhes que dependem de abstrações.**

```java
// ❌ VIOLANDO — a regra de negócio conhece o detalhe (JPA, SMTP)
public class RealizarTransferenciaService {
    private final ContaJpaRepository repository = new ContaJpaRepository();   // acoplado
    private final SmtpEmailSender email = new SmtpEmailSender();              // acoplado
}
```

```java
// ✅ CORRIGIDO — o alto nível DECLARA a abstração de que precisa
public interface ContaRepositoryPort {          // ← pertence à camada de negócio
    Optional<Conta> buscarPorId(ContaId id);
    void salvar(Conta conta);
}

public class RealizarTransferenciaService {
    private final ContaRepositoryPort contas;   // depende da abstração
    public RealizarTransferenciaService(ContaRepositoryPort contas) { this.contas = contas; }
}

// o DETALHE implementa a abstração do centro — a dependência foi invertida
@Component
class ContaRepositoryAdapter implements ContaRepositoryPort {
    private final ContaJpaRepository jpa;
}
```

**O detalhe que dá o nome "inversão":** sem DIP, o fluxo de dependência acompanha o fluxo de controle (serviço → repositório → banco). Com DIP, a seta de dependência do repositório **aponta para trás**, para a interface declarada pelo serviço. É esse giro de 180° na seta que é invertido.

**Ponto que quase todo mundo erra:** a interface deve pertencer ao **módulo do cliente** (alto nível), não ao módulo da implementação. Uma interface `ContaRepository` declarada dentro do pacote de infraestrutura **não inverte nada** — o negócio continua olhando para fora.

**DIP × Injeção de Dependência:** não são sinônimos. DIP é o **princípio** (dependa de abstrações); DI é a **técnica** (alguém entrega a instância pronta); um container IoC é a **ferramenta**. Dá para aplicar DIP com `new` no `main()`, sem framework nenhum.

É o mecanismo que sustenta a [CLEAN ARCHITECTURE](../clean-architecture/README.md) inteira — e o que torna o use case testável sem banco. → [TESTES EM SOFTWARE](../testes-em-software/README.md)

---

## SOLID no Spring — resumo

| Princípio | Como aparece |
|---|---|
| **SRP** | camadas `@RestController` / `@Service` / `@Repository`; `@RestControllerAdvice` isolando tratamento de erro |
| **OCP** | `List<Interface>` injetada, `HandlerInterceptor`, `AuthenticationProvider`, `Converter`, auto-configuração com `@ConditionalOnMissingBean` |
| **LSP** | qualquer `DataSource`, `PasswordEncoder` ou `CacheManager` é substituível sem quebrar quem usa |
| **ISP** | hierarquia `Repository` → `CrudRepository` → `JpaRepository`; interfaces funcionais |
| **DIP** | **injeção por construtor** — a bean recebe abstrações, o container resolve o concreto |

---

## SOLID × Design Patterns

Quase todo padrão GoF é um princípio SOLID materializado:

| Princípio | Padrões |
|---|---|
| SRP | Command, Visitor, Facade, Mediator |
| OCP | **Strategy, Decorator, Template Method, State, Chain of Responsibility, Abstract Factory** |
| LSP | Template Method, Composite |
| ISP | Adapter, Facade |
| DIP | **Abstract Factory, Factory Method, Strategy, Bridge, Observer** |

→ [DESIGN PATTERNS EM OO](../design-patterns-em-oo/README.md)

---

## Code smells → princípio violado

Tabela de diagnóstico rápido:

| Sintoma no código | Princípio ferido |
|---|---|
| God Class, classe com 1.500 linhas, `Util` que faz de tudo | **SRP** |
| A mesma classe é alterada por motivos totalmente diferentes (*Divergent Change*) | **SRP** |
| Uma mudança de requisito obriga a editar 8 classes (*Shotgun Surgery*) | **SRP** / alta dispersão |
| `switch`/`if-else` sobre tipo que cresce a cada release | **OCP** |
| `instanceof` em cadeia no cliente | **OCP** e **LSP** |
| Subclasse lançando `UnsupportedOperationException` | **LSP** (e geralmente **ISP**) |
| Subclasse que exige mais que a superclasse | **LSP** |
| Implementação cheia de métodos vazios | **ISP** |
| `new` de classe concreta de infraestrutura dentro da regra de negócio | **DIP** |
| Domínio com `import org.springframework...` ou `jakarta.persistence...` | **DIP** |

---

## Princípios complementares

SOLID não cobre tudo. O vocabulário completo de design inclui:

- **DRY** (*Don't Repeat Yourself*) — cada conhecimento tem uma representação única. **Cuidado:** DRY é sobre **conhecimento**, não sobre linhas parecidas; unificar dois códigos iguais por coincidência cria acoplamento entre coisas que deveriam evoluir separadas (o oposto é o princípio **WET**/*Rule of Three*: só abstraia na terceira repetição).
- **KISS** (*Keep It Simple, Stupid*) — a solução mais simples que resolve.
- **YAGNI** (*You Aren't Gonna Need It*) — não implemente o que "vai precisar um dia".
- **Tell, Don't Ask** — mande o objeto fazer, em vez de perguntar o estado e decidir por ele. É o antídoto do domínio anêmico: `conta.debitar(valor)` em vez de `if (conta.getSaldo() >= valor) conta.setSaldo(...)`.
- **Lei de Demeter** (*princípio do menor conhecimento*) — fale só com os amigos imediatos. `pedido.getCliente().getEndereco().getCidade().getNome()` é o *train wreck* que denuncia a violação.
- **Composição sobre herança** — herança acopla em tempo de compilação; composição troca a peça em runtime. → [POO](../poo/conceitos-de-poo.md)
- **Alta coesão, baixo acoplamento** — a formulação mais antiga e mais geral: SRP é coesão, DIP é acoplamento.

### Princípios de componentes (o "SOLID dos pacotes")

Uncle Bob define outro conjunto, para o nível de **módulo/pacote** — aparece em prova de arquitetura:

| Sigla | Princípio | Ideia |
|---|---|---|
| **REP** | Reuse/Release Equivalence | a unidade de reúso é a unidade de release (versione o que você publica) |
| **CCP** | Common Closure | classes que mudam pelos mesmos motivos ficam no mesmo pacote (é o SRP dos pacotes) |
| **CRP** | Common Reuse | classes usadas juntas ficam juntas; não force o cliente a depender do que não usa (é o ISP dos pacotes) |
| **ADP** | Acyclic Dependencies | o grafo de dependência entre pacotes **não pode ter ciclos** |
| **SDP** | Stable Dependencies | dependa na direção da estabilidade (o instável depende do estável) |
| **SAP** | Stable Abstractions | pacote estável deve ser abstrato — senão vira rígido e impossível de mudar |

---

## Crítica: SOLID não é dogma

- **Over-abstração** é o risco número um. Interface com uma única implementação, criada "por princípio", é indireção pura: mais arquivos, mais saltos para ler o código, zero flexibilidade real. A abstração se paga quando existe **variação real**.
- **Os princípios se tensionam.** ISP empurra para muitas interfaces pequenas; SRP levado ao extremo fragmenta o domínio; OCP prematuro é YAGNI. Design é equilíbrio, não checklist.
- **Dan North** propôs o **CUPID** (*Composable, Unix philosophy, Predictable, Idiomatic, Domain-based*) como alternativa, argumentando que SOLID é abstrato demais para guiar decisões do dia a dia.
- SOLID nasceu em contexto **OO com herança**; em código funcional, boa parte se resolve com funções de primeira classe e imutabilidade.

**Resposta madura em prova:** *"SOLID é um conjunto de heurísticas para tornar o código tolerante à mudança, não um conjunto de regras a seguir cegamente. Aplicar cada princípio custa indireção; o custo se justifica onde a variação é real ou provável."*

---

## Perguntas para autoavaliação

1. Qual é a formulação precisa do SRP, e por que "fazer uma coisa só" é uma simplificação ruim?
2. Como transformar um `switch` que cresce a cada requisito em código aberto para extensão?
3. Por que `Quadrado extends Retangulo` viola o LSP mesmo compilando?
4. Quais são as quatro regras de contrato do LSP?
5. Uma subclasse pode lançar uma exceção que a superclasse não declara? Por quê?
6. O que é uma "interface gorda" e como ISP e LSP se relacionam nesse caso?
7. Onde a interface deve morar para que o DIP realmente inverta a dependência?
8. DIP e injeção de dependência são a mesma coisa? Explique.
9. Relacione OCP com Strategy e DIP com Abstract Factory.
10. Cite três code smells e o princípio que cada um denuncia.
11. Qual a diferença entre DRY aplicado a conhecimento e DRY aplicado a linhas parecidas?
12. Qual o risco de aplicar SOLID de forma dogmática?

---

**Relacionados:** [POO](../poo/README.md) · [DESIGN PATTERNS EM OO](../design-patterns-em-oo/README.md) · [CLEAN ARCHITECTURE](../clean-architecture/README.md) · [TESTES EM SOFTWARE](../testes-em-software/README.md)
