# CONCEITOS DE POO

> [← Voltar para POO](README.md) · Próximo: [MANIPULAÇÕES E EXCEÇÕES](manipulacoes-e-excecoes.md)

Programa estruturado → Não segue os conceitos de programação orientada a objetos, então os dados não são agrupados logicamente em uma entidade por comum. São obtidos separadamente já que os dados estão espalhados.

Na Programacao orientada a objetos:

A classe é como um template do seu objeto, uma vez que elas são definidas em instâncias, elas conseguem ser utilizadas. **A classe é como a forma e o objeto como o bolo.**

- O objeto é uma entidade do mundo real, em technês, é como uma **unidade de estado e comportamento** que ocupa um lugar na memória (Heap).
    - **Identidade Única:** Mesmo que você tenha dois objetos `Usuario` com o mesmo nome e mesmo CPF, para o computador, eles são diferentes porque ocupam endereços de memória distintos.
    - **Ciclo de Vida:** O objeto "nasce" (instanciação via `new`), "vive" (executa métodos e altera atributos) e "morre" (removido pelo Garbage Collector quando ninguém mais o usa).
    - Atributos (também chamados de propriedades ou campos) são as variáveis declaradas dentro da classe que definem as **características** ou o **estado** do objeto.

        | **Tipo** | **Descrição** | **Exemplo Prático** |
        | --- | --- | --- |
        | **Atributo de Instância** | Cada objeto tem o seu próprio valor. | O `nome` de cada `Usuario`. |
        | **Atributo de Classe (Static)** | O valor é compartilhado por todos os objetos daquela classe. | O `limite_maximo_de_usuarios` do sistema. |
    - Métodos são funçoes que utilizam as propriedades da classe e fazem algum processamento para aquele Objeto.

Os objetos podem ter relacionamentos entre si, unidirecionais ou bidirecioanais. Depende da questão de negócio e complexidade do seu código. Nem sempre é necessário adicionar a complexidade de relacionamentos.

```java
public class Conta {                                  // CLASSE — a forma

    private static int totalDeContasCriadas = 0;      // atributo de CLASSE: um só para todas
    private final ContaId id;                         // atributo de INSTÂNCIA: um por objeto
    private BigDecimal saldo;

    public Conta(ContaId id, BigDecimal saldoInicial) {   // construtor: o "nascimento"
        this.id = id;
        this.saldo = saldoInicial;
        totalDeContasCriadas++;
    }

    public void debitar(BigDecimal valor) { }         // método de instância
    public static int total() { return totalDeContasCriadas; }   // método de classe
}

Conta a = new Conta(new ContaId("1"), new BigDecimal("100"));   // OBJETO — o bolo
Conta b = new Conta(new ContaId("1"), new BigDecimal("100"));   // outro objeto, a != b
```

### Stack × Heap — onde cada coisa mora

| | **Stack** | **Heap** |
|---|---|---|
| Guarda | variáveis locais, parâmetros, **referências** | os **objetos** propriamente ditos |
| Escopo | por thread, some ao sair do método | compartilhado, vive até o GC coletar |
| Erro típico | `StackOverflowError` (recursão infinita) | `OutOfMemoryError` |

`Conta a = new Conta(...)` cria o objeto **no heap** e guarda **na stack** apenas a referência. Por isso `a == b` compara **endereços**, não conteúdo — a origem da discussão de `equals` (seção 7).

---

## PILARES DA POO

### 1. Abstração (O Filtro da Realidade)

Abstrair é a habilidade de ignorar o que não é essencial. No código, criamos classes que representam apenas as propriedades e comportamentos necessários para o contexto do sistema.

- **O Conceito:** Se você está criando um sistema para um **Detran**, a abstração de `Carro` precisa de `placa` e `chassi`. Se o sistema é um **Simulador de Corrida**, a abstração precisa de `torque` e `coeficiente_aerodinamico`.
- **Na Prática:** Usamos **Classes Abstratas** e **Interfaces** para definir o "contrato" (o que o objeto deve fazer) sem se preocupar agora com o "como".
- **Visão Sênior:** A abstração mal feita gera o "over-engineering". Não tente prever o futuro; abstraia apenas o que o negócio pede hoje.

```java
public interface MeioDePagamento {          // O QUE faz — sem dizer COMO
    Recibo pagar(BigDecimal valor);
}
```

### 2. Encapsulamento (A Blindagem dos Dados)

É o pilar da **segurança**. Ele diz que o estado interno de um objeto (seus atributos) não deve ser acessado ou alterado diretamente por ninguém de fora.

- **O Conceito:** Você não abre o motor do carro para girar o pistão com a mão; você gira a chave. O motor está encapsulado.
- **Mecanismo:** Usamos modificadores de acesso:
    - `private`: Só a própria classe vê.
    - *(padrão / package-private)*: a própria classe e o mesmo pacote.
    - `protected`: A classe, o mesmo pacote e suas filhas veem.
    - `public`: Todo mundo vê (use com muito cuidado).
- **Visão Sênior:** O encapsulamento permite que você mude a lógica interna de uma classe (ex: mudar o banco de dados de SQL para NoSQL) sem que o resto do sistema sequer perceba.

| Modificador | Mesma classe | Mesmo pacote | Subclasse (outro pacote) | Qualquer um |
|---|:---:|:---:|:---:|:---:|
| `private` | ✅ | ❌ | ❌ | ❌ |
| *(default)* | ✅ | ✅ | ❌ | ❌ |
| `protected` | ✅ | ✅ | ✅ | ❌ |
| `public` | ✅ | ✅ | ✅ | ✅ |

```java
// ❌ encapsulamento FURADO — getter/setter público é o mesmo que atributo público
public class Conta {
    private BigDecimal saldo;
    public BigDecimal getSaldo() { return saldo; }
    public void setSaldo(BigDecimal s) { this.saldo = s; }   // qualquer um zera o saldo
}
conta.setSaldo(new BigDecimal("999999"));      // a regra de negócio foi contornada

// ✅ encapsulamento DE VERDADE — o objeto protege seu invariante
public class Conta {
    private BigDecimal saldo;

    public void debitar(BigDecimal valor) {
        if (valor.signum() <= 0) throw new ValorInvalidoException(valor);
        if (saldo.compareTo(valor) < 0) throw new SaldoInsuficienteException(id, saldo, valor);
        this.saldo = saldo.subtract(valor);            // só existe UM caminho para mudar o saldo
    }

    public BigDecimal saldo() { return saldo; }        // leitura, sem escrita
}
```

> **Gerar getter e setter para tudo não é encapsulamento** — é atributo público com passos extras. O princípio **Tell, Don't Ask** resume a alternativa: mande o objeto fazer (`conta.debitar(x)`), não pergunte o estado para decidir por ele. Domínio cheio de get/set e regra espalhada nos serviços é o *anemic domain model*. → [SOLID](../solid/README.md)

### 3. Herança (A Reutilização de DNA)

Permite criar novas classes baseadas em classes existentes, herdando seus atributos e métodos. Cria uma relação de **"é um"**.

- **O Conceito:** Um `Desenvolvedor` **é um** `Funcionario`. Ele herda `nome` e `salario`, mas pode ter algo específico como `linguagem_principal`.
- **Vantagem:** Evita a repetição de código (DRY - *Don't Repeat Yourself*).
- **Visão Sênior:** **Cuidado aqui.** A herança cria um acoplamento muito forte. Se você mudar a classe pai, pode quebrar 50 classes filhas. Por isso, a regra de ouro do design de software moderno é: **"Prefira composição à herança"**.

```java
public abstract class Funcionario {
    protected final String nome;
    protected BigDecimal salarioBase;

    public BigDecimal calcularSalario() { return salarioBase; }     // comportamento herdado
}

public class Desenvolvedor extends Funcionario {
    private final String linguagemPrincipal;

    @Override
    public BigDecimal calcularSalario() {
        return super.calcularSalario().add(bonusPorCertificacao());  // super = chama a mãe
    }
}
```

Java tem **herança simples** de classe (uma mãe só) e **herança múltipla de tipo** via interfaces (uma classe implementa quantas quiser) — decisão de projeto tomada para evitar o *problema do diamante* do C++.

### 4. Polimorfismo (As Múltiplas Faces)

É a capacidade de um objeto se comportar de formas diferentes dependendo do contexto. O mesmo método pode ter implementações distintas.

- **O Conceito:** Imagine o método `pagar()`.
    - Para o objeto `Boleto`, `pagar()` gera um código de barras.
    - Para o objeto `CartaoCredito`, `pagar()` chama a API da operadora.
    - No código principal, você só chama `pagamento.pagar()` sem se importar com o tipo.
- **Tipos Práticos:**
    - **Sobrescrita (Override):** A filha redefine um método da pai.
    - **Sobrecarga (Overload):** O mesmo método aceita diferentes tipos de parâmetros (comum em Java/C#).
- **Visão Sênior:** O polimorfismo é o que torna o sistema **extensível**. Você pode adicionar um novo método de pagamento (ex: Pix) sem alterar uma única linha do código que processa as vendas.

```java
List<MeioDePagamento> meios = List.of(new Boleto(), new CartaoCredito(), new Pix());

for (MeioDePagamento meio : meios) {
    meio.pagar(valor);          // MESMA chamada, comportamento diferente em cada objeto
}
```

---

## Sobrecarga × Sobrescrita — lado a lado

Fonte eterna de questão de prova:

```java
public class Calculadora {
    BigDecimal somar(BigDecimal a, BigDecimal b) { }
    BigDecimal somar(BigDecimal a, BigDecimal b, BigDecimal c) { }   // SOBRECARGA: nº de params
    BigDecimal somar(int a, int b) { }                               // SOBRECARGA: tipo
    // BigDecimal somar(BigDecimal x, BigDecimal y) { }              // ❌ não compila: mesma assinatura
    // int somar(BigDecimal a, BigDecimal b) { }                     // ❌ retorno NÃO diferencia
}
```

| | **Sobrecarga (overload)** | **Sobrescrita (override)** |
|---|---|---|
| Onde | mesma classe (ou herdada) | classe **filha** redefinindo a mãe |
| Assinatura | **muda** (tipo/quantidade/ordem dos parâmetros) | **idêntica** |
| Tipo de retorno | não diferencia sobrecarga | igual ou **covariante** (subtipo) |
| Resolvida em | **compilação** — *static/early binding* | **execução** — *dynamic/late binding* |
| Depende de | tipo **declarado** da variável | tipo **real** do objeto |
| Visibilidade | livre | não pode **reduzir** (public não vira protected) |
| Exceções | livre | não pode lançar checked **mais ampla** |
| Anotação | — | `@Override` (opcional, mas sempre use) |

```java
// a diferença de binding, na prática:
Funcionario f = new Desenvolvedor();     // tipo declarado: Funcionario | tipo real: Desenvolvedor

f.calcularSalario();     // SOBRESCRITA → decidido em runtime → executa o do Desenvolvedor
imprimir(f);             // SOBRECARGA  → decidido em compilação → chama imprimir(Funcionario)
```

Essa última linha é a pegadinha clássica: **sobrecarga olha o tipo declarado**, então `imprimir(Desenvolvedor)` **não** é chamado. Também não existe sobrescrita de método `static` (isso é *hiding*, e segue o tipo declarado), nem de `private` ou `final`.

---

## Classe abstrata × Interface

```java
public abstract class ProcessadorPagamento {          // CLASSE ABSTRATA
    protected final Auditoria auditoria;              // estado (campos) ✅
    protected ProcessadorPagamento(Auditoria a) { }   // construtor ✅

    public final Recibo processar(Cobranca c) {       // método concreto e final ✅
        auditoria.registrar(c);
        return autorizar(c);
    }
    protected abstract Recibo autorizar(Cobranca c);  // contrato para a filha
}

public interface MeioDePagamento {                    // INTERFACE
    Recibo pagar(BigDecimal valor);                   // implicitamente public abstract

    default boolean suportaParcelamento() { return false; }   // Java 8: comportamento padrão
    static MeioDePagamento padrao() { return new Pix(); }     // Java 8: método estático
    private void log(String msg) { }                          // Java 9: auxiliar privado
    int LIMITE_MAXIMO = 50_000;                               // implicitamente public static final
}
```

| | **Classe abstrata** | **Interface** |
|---|---|---|
| Relação | **"é um"** (identidade) | **"é capaz de"** (capacidade) |
| Herança múltipla | ❌ uma só | ✅ quantas quiser |
| Estado (campos de instância) | ✅ | ❌ (só constantes) |
| Construtor | ✅ | ❌ |
| Métodos concretos | ✅ | ✅ desde o Java 8 (`default`) |
| Visibilidade dos membros | qualquer | métodos `public` (ou `private` auxiliares) |
| Evoluir sem quebrar quem já implementa | ✅ | ✅ com `default` |

**Quando usar qual:**
- **Interface** — para definir capacidade/contrato, especialmente na fronteira do sistema (é o *port* da [Clean Architecture](../clean-architecture/README.md)). Padrão em código novo.
- **Classe abstrata** — quando há **estado compartilhado** ou um **esqueleto de algoritmo** com passos variáveis (o padrão Template Method).

> **Por que `default` methods existem?** Para permitir que o Java adicionasse `stream()`, `forEach()` e `removeIf()` às interfaces de coleção **sem quebrar** todas as implementações do mundo. Não foram criados para simular herança múltipla de comportamento — usar assim leva a hierarquias confusas.

---

## Herança × Composição — o mesmo problema, dos dois jeitos

```java
// ❌ POR HERANÇA — parece econômico, mas acopla e não escala
public class ContaCorrente extends Conta { }
public class ContaCorrenteComChequeEspecial extends ContaCorrente { }
public class ContaCorrenteComChequeEspecialEIsentaDeTarifa extends ContaCorrenteComChequeEspecial { }
// e agora: conta poupança com isenção? explosão combinatória, tudo fixo em compilação
```

```java
// ✅ POR COMPOSIÇÃO — combina em runtime, sem explosão de classes
public class Conta {

    private final PoliticaLimite limite;         // pode ser SemLimite, ChequeEspecial, LimitePorRenda
    private final PoliticaTarifa tarifa;         // pode ser TarifaPadrao, Isento, PacotePremium

    public Conta(PoliticaLimite limite, PoliticaTarifa tarifa) { }

    public void debitar(BigDecimal valor) {
        BigDecimal disponivel = saldo.add(limite.disponivelPara(this));
        if (disponivel.compareTo(valor) < 0) throw new SaldoInsuficienteException(...);
        this.saldo = saldo.subtract(valor).subtract(tarifa.cobrarPor(valor));
    }
}

new Conta(new ChequeEspecial(new BigDecimal("1000")), new Isento());   // qualquer combinação
```

| | Herança | Composição |
|---|---|---|
| Relação | "é um" | "tem um" / "usa um" |
| Acoplamento | forte, à implementação da mãe | fraco, à interface do colaborador |
| Momento | **compilação** (fixo) | **execução** (trocável) |
| Reúso | herda tudo, inclusive o que não quer | usa só o que precisa |
| Testabilidade | precisa instanciar a hierarquia | injeta um dublê |

**O problema da classe base frágil:** mudar a mãe pode quebrar filhas que você nem conhece, porque a subclasse depende de **detalhes internos** da superclasse (qual método chama qual). Com composição, o contrato é explícito e público.

**Herança ainda é a escolha certa quando:** existe verdadeira relação "é um" **com substituibilidade** (LSP), a hierarquia é estável e rasa, e você controla as duas pontas. Fora disso, componha.

---

## Acoplamento e coesão

O vocabulário que a prova usa para falar de qualidade de design:

- **Coesão** — o quanto os elementos de um módulo pertencem juntos. **Alta coesão é o objetivo**: uma classe cujos métodos e campos servem ao mesmo propósito. Baixa coesão é a classe `Utils` que tem `formatarCpf`, `enviarEmail` e `calcularJuros`.
- **Acoplamento** — o quanto um módulo depende de outro. **Baixo acoplamento é o objetivo**: mudar A não deve obrigar a mudar B.

Tipos de acoplamento, do pior para o melhor:

| Nível | Tipo | Exemplo |
|---|---|---|
| pior | **de conteúdo** | uma classe mexe no estado interno da outra |
| ↓ | **comum** | duas classes compartilham estado global mutável (singleton mutável) |
| ↓ | **de controle** | passar uma flag que decide o fluxo do outro (`processar(true)`) |
| ↓ | **estrutural** | depender do formato interno de um objeto (`getA().getB().getC()`) |
| melhor | **de dados** | passar só os dados necessários por parâmetro/interface |

Regra que amarra tudo: **alta coesão dentro do módulo, baixo acoplamento entre módulos.** SRP é o princípio da coesão; DIP é o princípio do acoplamento.

---

## `equals` e `hashCode` — o contrato

`==` compara **referência** (endereço na memória); `equals` compara o que **você** definir como igualdade. Sem sobrescrever, `equals` do `Object` é `==`.

```java
public class Conta {
    private final ContaId id;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;                            // atalho
        if (o == null || getClass() != o.getClass()) return false;
        Conta outra = (Conta) o;
        return Objects.equals(id, outra.id);                   // identidade de ENTIDADE: só o id
    }

    @Override
    public int hashCode() { return Objects.hash(id); }         // consistente com equals
}
```

**O contrato de `equals`:** reflexivo (`x.equals(x)`), simétrico, transitivo, consistente, e `x.equals(null)` é sempre `false`.

**O contrato entre `equals` e `hashCode`** — é isso que cai em prova:

| Regra | Vale? |
|---|---|
| Se `a.equals(b)` então `a.hashCode() == b.hashCode()` | **obrigatório** |
| Se `a.hashCode() == b.hashCode()` então `a.equals(b)` | **não** — colisão é permitida |

Quebrar a primeira regra causa um bug silencioso e cruel: o objeto **some** de `HashMap`/`HashSet`. A busca vai ao bucket calculado pelo `hashCode`; se o hash mudou (ou é o default), o objeto não é encontrado, mesmo estando lá.

```java
Set<Conta> contas = new HashSet<>();
contas.add(new Conta(new ContaId("1")));
contas.contains(new Conta(new ContaId("1")));   // false se hashCode não foi sobrescrito
```

**Regras práticas:** use apenas campos **imutáveis** no `equals`/`hashCode` (campo mutável usado como chave de hash é bug esperando acontecer); em entidade JPA, baseie na **chave de negócio** ou num UUID atribuído na criação — nunca no `id` gerado pelo banco, que é `null` antes do `persist`. E `record` gera os dois automaticamente a partir de **todos** os componentes.

**Identidade × igualdade — a distinção conceitual:**
- **Entidade** tem identidade: duas contas com o mesmo `id` são a mesma conta, mesmo com saldos diferentes.
- **Value object** tem igualdade estrutural: dois `Dinheiro(100, BRL)` são intercambiáveis; não há identidade.

---

## Imutabilidade e value objects

```java
public record Dinheiro(BigDecimal valor, Moeda moeda) {

    public Dinheiro {                                          // construtor compacto: valida
        Objects.requireNonNull(valor);
        if (valor.scale() > 2) throw new PrecisaoInvalidaException(valor);
    }

    public Dinheiro somar(Dinheiro outro) {
        if (!moeda.equals(outro.moeda)) throw new MoedaIncompativelException();
        return new Dinheiro(valor.add(outro.valor), moeda);    // devolve NOVO, não muda o atual
    }
}
```

Objetos imutáveis são **thread-safe de graça**, seguros como chave de mapa, impossíveis de deixar em estado inválido e fáceis de raciocinar. Em domínio financeiro, valores monetários, datas e identificadores deveriam ser sempre imutáveis. Receita: campos `final`, sem setter, classe `final`, e cópias defensivas de coleções/objetos mutáveis recebidos ou devolvidos.

---

## Java moderno: records, sealed e pattern matching

```java
// RECORD (Java 16) — carrier de dados imutável: gera construtor, getters, equals, hashCode, toString
public record ContaResponse(String id, String titular, BigDecimal saldo) { }
```
Ideal para DTO, value object e retorno de consulta. **Não** use em entidade JPA (a JPA exige construtor sem argumentos e campos mutáveis).

```java
// SEALED (Java 17) — hierarquia FECHADA: só estes tipos podem implementar
public sealed interface Lancamento permits Pix, Boleto, Cartao { }

// PATTERN MATCHING em switch (Java 21) — exaustivo, sem default
BigDecimal tarifa = switch (lancamento) {
    case Pix p                          -> BigDecimal.ZERO;
    case Boleto b when b.valor() > 5000 -> new BigDecimal("5.00");   // guarded pattern
    case Boleto b                       -> new BigDecimal("2.50");
    case Cartao c                       -> c.valor().multiply(TAXA);
};
```

`sealed` devolve ao autor o controle da hierarquia — e permite ao **compilador** garantir que você tratou todos os casos. É a resposta moderna ao padrão Visitor e ao `instanceof` em cadeia. → [DESIGN PATTERNS](../design-patterns-em-oo/iii-padroes-comportamentais.md)

```java
// pattern matching para instanceof (Java 16) — sem cast manual
if (lancamento instanceof Boleto b && b.vencido()) {
    cobrarMulta(b);                       // "b" já vem tipado
}
```

---

## Perguntas para autoavaliação

1. Qual a diferença entre classe e objeto, e onde cada um vive na memória?
2. Por que gerar getter e setter para todos os campos não é encapsulamento?
3. O que é *Tell, Don't Ask* e como ele se relaciona com domínio anêmico?
4. Sobrecarga é resolvida em compilação ou execução? E sobrescrita?
5. `Funcionario f = new Desenvolvedor(); imprimir(f);` — qual sobrecarga é chamada e por quê?
6. Uma sobrescrita pode reduzir a visibilidade do método? Pode lançar uma checked exception mais ampla?
7. Cite três diferenças entre classe abstrata e interface e diga quando usar cada uma.
8. Por que os `default methods` foram adicionados ao Java 8?
9. Mostre o mesmo problema resolvido por herança e por composição, e diga por que a segunda escala melhor.
10. O que é o problema da classe base frágil?
11. Qual o contrato entre `equals` e `hashCode`, e o que acontece se você quebrar?
12. Qual a diferença entre identidade (entidade) e igualdade estrutural (value object)?
13. Por que um `record` não deve ser usado como entidade JPA?
14. O que `sealed` permite ao compilador garantir num `switch`?

---

> [← Voltar para POO](README.md) · Próximo: [MANIPULAÇÕES E EXCEÇÕES](manipulacoes-e-excecoes.md)
