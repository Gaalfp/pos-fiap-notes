# II - TEST DOUBLES E MOCKITO

> [← Voltar para TESTES EM SOFTWARE](README.md) · Anterior: [I - JUnit 5 e AssertJ](i-junit-5-e-assertj.md) · Próximo: [III - Testes no Spring](iii-testes-no-spring.md)

## 1. Test double — o conceito

**Test double** (dublê de teste) é qualquer objeto que substitui um colaborador real durante o teste. O termo vem de *stunt double*, o dublê do cinema. Serve para:

- **isolar** o SUT (falha no teste aponta para a unidade, não para a dependência),
- **acelerar** (sem rede, sem banco, sem broker),
- **tornar determinístico** (sem timeout, sem dado que mudou),
- **simular o inimaginável** (banco fora do ar, timeout do parceiro, saldo negativo impossível de reproduzir).

A taxonomia canônica é do Gerard Meszaros (*xUnit Test Patterns*), popularizada por Martin Fowler. **Essa tabela é questão de prova garantida:**

| Tipo | O que faz | Tem lógica? | Verifica? | Exemplo |
|---|---|---|---|---|
| **Dummy** | Só preenche um parâmetro obrigatório. Nunca é usado de verdade | não | não | `new Conta(null, null)` passado só para compilar |
| **Fake** | Implementação real, porém simplificada e imprópria para produção | **sim** | não | repositório em `HashMap`, H2 no lugar do Postgres |
| **Stub** | Devolve respostas prontas para as chamadas do teste | não | não | `when(repo.buscar(id)).thenReturn(conta)` |
| **Spy** | Objeto real que **registra** o que aconteceu (ou stub que conta chamadas) | parcial | indireta | `verify(notificador).enviar(...)` sobre objeto real |
| **Mock** | Pré-programado com **expectativas**; o teste falha se a interação esperada não ocorrer | não | **sim** | `verify(port, times(1)).salvar(conta)` |

Mnemônico:

- **Dummy** → existe só para ocupar espaço.
- **Fake** → funciona, mas simplificado.
- **Stub** → responde o que mandei responder.
- **Spy** → deixa acontecer e anota.
- **Mock** → cobra que a conversa aconteça do jeito combinado.

### A distinção que realmente importa: stub × mock

```java
// STUB — o colaborador é ENTRADA. Verifico o RESULTADO (verificação de estado)
when(contas.buscarPorId(id)).thenReturn(Optional.of(contaComSaldo100));
useCase.executar(comando);
assertThat(contas.buscarPorId(id).get().saldo()).isEqualByComparingTo("70.00");

// MOCK — o colaborador é SAÍDA. Verifico a INTERAÇÃO (verificação de comportamento)
useCase.executar(comando);
verify(notificacao).notificarTransferencia(any(ComprovanteTransferencia.class));
```

Regra prática: **stub para o que entra, mock para o que sai.** Se o efeito do caso de uso é observável no estado, verifique estado. Se o efeito é "mandou mensagem para fora" (e-mail, evento, chamada a parceiro), aí sim verifique interação — não há outro jeito de observar.

**Classicist × Mockist:** a escola *Detroit/classicista* prefere objetos reais e verificação de estado, mockando só o que é lento ou não determinístico; a escola *London/mockista* mocka todos os colaboradores e verifica interações. Testes mockistas quebram mais em refatoração (conhecem o "como"); testes classicistas dão diagnóstico menos preciso. Na prática: **classicista por padrão, mockista nas fronteiras.**

### Quando um Fake ganha do Mock

```java
// Fake: implementação real e simples do PORT — reutilizável em todos os testes do use case
public class ContaRepositoryFake implements ContaRepositoryPort {

    private final Map<ContaId, Conta> dados = new HashMap<>();

    @Override public Optional<Conta> buscarPorId(ContaId id) { return Optional.ofNullable(dados.get(id)); }
    @Override public void salvar(Conta conta) { dados.put(conta.id(), conta); }
}
```

Quando o teste precisa de **coerência entre chamadas** — salvar e depois ler o que foi salvo —, o fake produz um teste muito mais legível que uma cadeia de `when`/`verify`. Fakes só valem a pena quando a interface é sua (é aqui que ter *ports* na [Clean Architecture](../clean-architecture/README.md) se paga de novo).

---

## 2. Mockito — o essencial

```xml
<dependency>
  <groupId>org.mockito</groupId>
  <artifactId>mockito-junit-jupiter</artifactId>
  <scope>test</scope>
</dependency>
```

```java
@ExtendWith(MockitoExtension.class)
class RealizarTransferenciaServiceTest {

    @Mock  ContaRepositoryPort contas;        // dublê
    @Mock  NotificacaoPort notificacao;

    @InjectMocks RealizarTransferenciaService useCase;   // SUT com os mocks injetados

    @Test
    void deveTransferirEntreContas() {
        Conta origem  = ContaBuilder.umaConta().comId("1").comSaldo("500.00").build();
        Conta destino = ContaBuilder.umaConta().comId("2").comSaldo("100.00").build();
        when(contas.buscarPorId(new ContaId("1"))).thenReturn(Optional.of(origem));
        when(contas.buscarPorId(new ContaId("2"))).thenReturn(Optional.of(destino));

        useCase.executar(new TransferenciaCommand(new ContaId("1"), new ContaId("2"), new BigDecimal("200.00")));

        assertThat(origem.saldo()).isEqualByComparingTo("300.00");
        assertThat(destino.saldo()).isEqualByComparingTo("300.00");
        verify(contas).salvar(origem);
        verify(contas).salvar(destino);
        verify(notificacao).notificarTransferencia(any());
    }
}
```

`@InjectMocks` tenta injetar por **construtor** (preferido), depois por setter, depois por campo. Se a injeção falhar, ele **não avisa** — deixa o campo nulo e você toma `NullPointerException`. Por isso, em código novo, muita gente prefere instanciar o SUT à mão no `@BeforeEach`: é explícito e não depende de heurística.

### Comportamento padrão de um mock

Método não configurado devolve o **valor "vazio"** do tipo: `null` para objetos, `0` para números, `false` para boolean, coleção vazia para `List`/`Set`/`Map`, `Optional.empty()` para `Optional`. Nunca lança por si só. É por isso que um `NullPointerException` no meio do teste quase sempre significa "esqueci de stubar alguma coisa".

### Stubbing

```java
when(contas.buscarPorId(id)).thenReturn(Optional.of(conta));
when(contas.buscarPorId(id)).thenThrow(new IllegalStateException("banco fora"));
when(contas.buscarPorId(any())).thenReturn(Optional.empty());

// respostas diferentes em chamadas sucessivas
when(gateway.consultar(id)).thenReturn(pendente).thenReturn(aprovado);

// resposta calculada a partir do argumento
when(contas.salvar(any(Conta.class))).thenAnswer(inv -> inv.getArgument(0));

// para métodos void
doNothing().when(notificacao).notificarTransferencia(any());
doThrow(new TimeoutException()).when(notificacao).notificarTransferencia(any());
```

**`doReturn().when()` × `when().thenReturn()`** — os dois fazem stub, mas o primeiro **não executa o método real** ao configurar. Obrigatório em três casos: (1) método `void`, (2) stub sobre `@Spy`, (3) quando a chamada real teria efeito colateral. Fora isso, prefira `when().thenReturn()` — é type-safe.

---

## 3. Argument matchers

```java
when(contas.buscarPorId(any(ContaId.class))).thenReturn(Optional.of(conta));

verify(contas).salvar(argThat(c -> c.saldo().compareTo(BigDecimal.ZERO) >= 0));

verify(auditoria).registrar(eq("TRANSFERENCIA"), any(), eq(valor));
```

Principais: `any()`, `any(Tipo.class)`, `anyString()`, `anyLong()`, `anyList()`, `eq(valor)`, `isNull()`, `argThat(predicado)`, `same(ref)`, `contains("x")`.

> **Regra do tudo-ou-nada:** se você usar **um** matcher numa chamada, **todos** os argumentos precisam ser matchers. `verify(x).metodo(any(), "fixo")` lança `InvalidUseOfMatchersException` — o correto é `verify(x).metodo(any(), eq("fixo"))`. Esse erro é o mais comum do Mockito e cai em prova.

E cuidado com `anyString()`: ele **não casa com `null`** (use `isNull()` ou `nullable(String.class)`).

---

## 4. Verificação de interações

```java
verify(contas).salvar(conta);                    // exatamente 1 vez (padrão)
verify(contas, times(2)).salvar(any());
verify(notificacao, never()).notificarTransferencia(any());
verify(contas, atLeastOnce()).buscarPorId(any());
verify(contas, atMost(3)).salvar(any());
verify(gateway, timeout(500)).consultar(any());  // assíncrono: espera até 500ms

// ordem entre colaboradores
InOrder ordem = inOrder(contas, notificacao);
ordem.verify(contas).salvar(origem);
ordem.verify(notificacao).notificarTransferencia(any());

verifyNoInteractions(auditoria);                 // ninguém tocou nesse mock
verifyNoMoreInteractions(contas);                // nada além do que já verifiquei
```

`verifyNoMoreInteractions` parece rigor, mas costuma virar **teste frágil**: qualquer chamada nova legítima quebra o teste. Use só quando "não chamar mais nada" for a regra de negócio (ex.: em caso de falha, nada pode ser persistido).

### ArgumentCaptor — inspecionar o que foi passado

```java
@Captor ArgumentCaptor<ComprovanteTransferencia> captor;

@Test
void deveNotificarComOsDadosCorretos() {
    useCase.executar(comando);

    verify(notificacao).notificarTransferencia(captor.capture());

    ComprovanteTransferencia enviado = captor.getValue();
    assertThat(enviado.valor()).isEqualByComparingTo("200.00");
    assertThat(enviado.origem()).isEqualTo(new ContaId("1"));
}
```

`captor.getAllValues()` devolve a lista quando houve várias chamadas. Use captor quando precisar **assertar sobre o conteúdo** do argumento; use `argThat` quando a condição for simples e a falha não precisar de detalhe.

---

## 5. Spy e mock parcial

```java
@Spy List<String> lista = new ArrayList<>();     // objeto REAL, monitorado

lista.add("a");
verify(lista).add("a");                          // e o item realmente entrou
assertThat(lista).hasSize(1);

// stub sobre spy: SEMPRE doReturn, senão o método real executa antes
doReturn(100).when(lista).size();
```

Spy é útil para legado (classe grande da qual você quer sobrescrever um único método) e é **cheiro de design** no código novo: se você precisa de mock parcial, geralmente há duas responsabilidades na mesma classe pedindo para ser separadas.

---

## 6. Strict stubs

Desde o Mockito 2, o `MockitoExtension` roda em modo `STRICT_STUBS`:

- **`UnnecessaryStubbingException`** — você configurou um `when` que o teste nunca usou. Quase sempre é sinal de copiar/colar de cenário, ou de que o código mudou e o teste ficou para trás.
- **`PotentialStubbingProblem`** — o SUT chamou o método com argumento diferente do stubado. Denuncia teste que "quase" bate.

```java
lenient().when(contas.buscarPorId(any())).thenReturn(Optional.of(conta));   // isenta ESTE stub
@MockitoSettings(strictness = Strictness.LENIENT)                            // isenta a classe (evite)
```

Relaxar a regra deveria ser exceção. O modo estrito existe justamente para expor teste que não testa o que diz testar.

---

## 7. BDDMockito

Mesma API com vocabulário Given-When-Then, para o teste ler como o cenário:

```java
import static org.mockito.BDDMockito.*;

// given
given(contas.buscarPorId(new ContaId("1"))).willReturn(Optional.of(origem));
willThrow(new TimeoutException()).given(notificacao).notificarTransferencia(any());

// when
useCase.executar(comando);

// then
then(contas).should().salvar(origem);
then(notificacao).should(never()).notificarTransferencia(any());
```

---

## 8. Casos difíceis

```java
// Estáticos (precisa de mockito-inline / Mockito 5+)
try (MockedStatic<LocalDate> mock = mockStatic(LocalDate.class)) {
    mock.when(LocalDate::now).thenReturn(LocalDate.of(2026, 1, 15));
    // ...
}   // o mock só vale dentro do try-with-resources e da thread atual

// Construção de objetos dentro do método (last resort)
try (MockedConstruction<HttpClient> mock = mockConstruction(HttpClient.class)) { }
```

Mockito 5 usa o *inline mock maker* por padrão, então **classes e métodos `final`** e estáticos são mockáveis sem plugin extra. Mesmo assim: precisar de `mockStatic` normalmente significa dependência escondida. A alternativa melhor é injetar (`Clock`, `IdGenerator`, um port) — o teste fica mais simples e o design também.

---

## 9. O que **não** mockar

| Não mocke | Por quê | Faça isso |
|---|---|---|
| **A classe sob teste** | você passa a testar o dublê | teste o objeto real |
| **Value objects e entidades** (`BigDecimal`, `Conta`, `Dinheiro`) | são baratos e sem efeito colateral; mock aqui esconde a regra | instancie de verdade (builder) |
| **Tipos que você não possui** (SDK do parceiro, `RestTemplate`, driver) | você estaria assumindo o comportamento de terceiro, e o teste passa mesmo se a suposição for falsa | envolva num **port** seu e mocke o port; valide o real com teste de integração/contrato |
| **Getter/setter e DTO** | nada a verificar | use o objeto |
| **Tudo, sempre** | teste vira espelho da implementação | mocke fronteiras; use objetos reais no miolo |

**Mock retornando mock** (`when(a.getB()).thenReturn(mockB)`) é sinal de violação da Lei de Demeter: o SUT está navegando por dentro dos colaboradores. Corrija o design, não o teste.

### Ciclo vicioso do teste que testa o mock

```java
// ❌ isso passa mesmo se o use case estiver completamente errado
when(contas.buscarPorId(id)).thenReturn(Optional.of(conta));
useCase.executar(comando);
verify(contas).buscarPorId(id);        // só provei que o stub que EU criei foi chamado
```

Não há nenhum assert sobre **resultado**. O teste continuaria verde se o débito nunca acontecesse. Sempre pergunte: *"se eu apagar a regra de negócio, este teste fica vermelho?"* Se não fica, ele não protege nada.

---

## Perguntas para autoavaliação

1. Explique Dummy, Fake, Stub, Spy e Mock com um exemplo de cada.
2. Qual a diferença entre verificação de estado e verificação de comportamento?
3. Quando um Fake é preferível a um Mock?
4. Por que `verify(x).metodo(any(), "fixo")` lança exceção, e como corrigir?
5. O que um mock não configurado devolve para `Optional`, `List`, `boolean` e objeto?
6. Em quais três situações `doReturn().when()` é obrigatório no lugar de `when().thenReturn()`?
7. O que é `UnnecessaryStubbingException` e por que ela é útil em vez de irritante?
8. Por que não se deve mockar `RestTemplate` ou o SDK de um parceiro? O que fazer no lugar?
9. Quando `ArgumentCaptor` é melhor que `argThat`?
10. Como identificar um teste que só testa o próprio mock?

---

> [← Voltar para TESTES EM SOFTWARE](README.md) · Anterior: [I - JUnit 5 e AssertJ](i-junit-5-e-assertj.md) · Próximo: [III - Testes no Spring](iii-testes-no-spring.md)
