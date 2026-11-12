# III - JAVA.UTIL.CONCURRENT

> [← Voltar para THREADS E CONCORRÊNCIA](README.md) · Anterior: [II - COMPARTILHANDO MEMÓRIA](ii-compartilhando-memoria.md)

Desde o Java 5 existe um pacote inteiro que resolve, pronto e testado, o que o capítulo II mandava fazer na mão. **Em código novo, comece por aqui** — `Thread` e `synchronized` crus são a exceção, não a regra.

## 1. `ExecutorService`: pare de criar thread na mão

Criar uma thread por tarefa não escala: cada uma custa memória e tempo, e mil tarefas viram mil threads. Um **pool** reaproveita um número fixo delas.

```java
ExecutorService pool = Executors.newFixedThreadPool(4);

for (int i = 1; i <= 100; i++) {
    int n = i;
    pool.submit(() -> System.out.println("tarefa " + n));    // 100 tarefas, 4 threads
}

pool.shutdown();                                    // não aceita mais tarefas
pool.awaitTermination(30, TimeUnit.SECONDS);        // espera as que faltam
```

| Fábrica | O que cria |
|---|---|
| `newFixedThreadPool(n)` | **n** threads fixas; as tarefas excedentes esperam numa fila |
| `newCachedThreadPool()` | cresce conforme a demanda e recicla threads ociosas — **perigoso** com carga alta: pode criar threads demais |
| `newSingleThreadExecutor()` | uma thread só, tarefas em ordem |
| `newScheduledThreadPool(n)` | tarefas agendadas ou repetidas |
| `newVirtualThreadPerTaskExecutor()` | **Java 21+**: uma thread virtual por tarefa (seção 9) |

**Desligar é obrigatório:**

| Método | O que faz |
|---|---|
| `shutdown()` | para de aceitar novas; **termina** as que já estão rodando e as da fila |
| `shutdownNow()` | tenta interromper as em execução e devolve a lista das que não começaram |
| `awaitTermination(t, u)` | espera até **t** pelo encerramento; devolve `false` se estourou |
| `isShutdown()` / `isTerminated()` | já pediu para desligar / já acabou tudo |

> ⚠️ **Esquecer o `shutdown()` trava a JVM.** As threads do pool são **não-daemon**: enquanto existirem, o programa não encerra, mesmo com a `main` terminada. → [threads daemon](i-criando-e-controlando-threads.md#4-os-métodos-essenciais)

Em Java moderno, o `try-with-resources` resolve (o `ExecutorService` virou `AutoCloseable` no Java 19):

```java
try (var pool = Executors.newFixedThreadPool(4)) {
    pool.submit(tarefa);
}   // fecha e espera sozinho
```

---

## 2. `Callable` e `Future`: quando a tarefa devolve algo

```java
ExecutorService pool = Executors.newFixedThreadPool(2);

Future<Integer> futuro = pool.submit(() -> {       // Callable<Integer>
    Thread.sleep(1000);
    return 42;
});

System.out.println("faço outra coisa enquanto isso");
Integer resultado = futuro.get();                  // ← BLOQUEIA até ficar pronto
System.out.println(resultado);                     // 42
```

| Método de `Future` | O que faz |
|---|---|
| `get()` | espera e devolve o resultado — **bloqueia** |
| `get(t, unidade)` | espera no máximo **t**; estoura `TimeoutException` |
| `isDone()` | já terminou (com sucesso, erro ou cancelamento)? |
| `cancel(mayInterrupt)` | tenta cancelar |
| `isCancelled()` | foi cancelada? |

**As exceções ficam guardadas.** Se o `Callable` lançar, nada aparece até você chamar `get()` — e aí vem embrulhada:

```java
try {
    futuro.get();
} catch (ExecutionException e) {
    Throwable causa = e.getCause();      // ← a exceção REAL está aqui
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
}
```

> ⚠️ Com `submit()`, uma exceção na tarefa fica **silenciosa** se ninguém chamar `get()`. Com `execute()`, ela vai para o *uncaught exception handler*. É uma causa clássica de "a tarefa simplesmente não rodou e ninguém viu".

---

## 3. `CompletableFuture`: encadear sem bloquear

`Future.get()` bloqueia. `CompletableFuture` deixa você **declarar o que fazer quando ficar pronto**:

```java
CompletableFuture
    .supplyAsync(() -> buscarUsuario(id))             // roda em outra thread
    .thenApply(usuario -> usuario.getEmail())          // transforma o resultado
    .thenAccept(email -> enviar(email))                // consome
    .exceptionally(erro -> { log(erro); return null; });   // trata falha
```

```java
// esperar duas coisas em paralelo e juntar
var a = CompletableFuture.supplyAsync(() -> buscarPerfil(id));
var b = CompletableFuture.supplyAsync(() -> buscarPedidos(id));

a.thenCombine(b, (perfil, pedidos) -> montarTela(perfil, pedidos))
 .join();
```

| Método | Para quê |
|---|---|
| `supplyAsync(f)` | começa uma tarefa que **devolve** valor |
| `runAsync(r)` | começa uma tarefa sem retorno |
| `thenApply(f)` | transforma o resultado |
| `thenAccept(c)` | consome, sem devolver |
| `thenCompose(f)` | encadeia outro `CompletableFuture` (evita um futuro dentro de outro) |
| `thenCombine(o, f)` | junta **dois** resultados |
| `allOf(...)` / `anyOf(...)` | espera todos / o primeiro |
| `exceptionally(f)` | trata erro |
| `join()` | como `get()`, mas sem checked exception |

---

## 4. Classes atômicas: contador sem lock

```java
AtomicInteger contador = new AtomicInteger(0);

contador.incrementAndGet();      // ++contador, de forma atômica
contador.getAndIncrement();      // contador++
contador.addAndGet(5);
contador.compareAndSet(10, 20);  // se for 10, vira 20
```

Resolvem o `valor++` do [capítulo II](ii-compartilhando-memoria.md#1-a-race-condition-passo-a-passo) **sem bloquear ninguém**: por baixo usam **CAS** (*compare-and-swap*), uma instrução do processador que compara e troca numa operação só. Se outra thread chegou antes, a operação tenta de novo.

| Classe | Para |
|---|---|
| `AtomicInteger`, `AtomicLong` | contadores |
| `AtomicBoolean` | flags que precisam de teste-e-ajuste atômico |
| `AtomicReference<T>` | trocar uma referência de forma atômica |
| `LongAdder` | contador sob **altíssima** contenção: mais rápido que `AtomicLong` |

---

## 5. Coleções concorrentes

| Coleção | Use para |
|---|---|
| **`ConcurrentHashMap`** | mapa compartilhado. Trava só o trecho afetado, não o mapa inteiro |
| **`CopyOnWriteArrayList`** | lista com **muitas leituras e poucas escritas** (ex.: listeners): cada escrita copia o array inteiro |
| **`BlockingQueue`** (`ArrayBlockingQueue`, `LinkedBlockingQueue`) | **produtor-consumidor** pronto: `put()` espera se está cheia, `take()` espera se está vazia |
| **`ConcurrentLinkedQueue`** | fila sem bloqueio, quando não quer esperar |

O produtor-consumidor do capítulo II, agora sem `wait`/`notify`:

```java
BlockingQueue<String> fila = new LinkedBlockingQueue<>(100);

// produtor
new Thread(() -> {
    try { fila.put("item"); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
}).start();

// consumidor
new Thread(() -> {
    try { String item = fila.take(); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
}).start();
```

> ⚠️ `ConcurrentHashMap` **não aceita chave nem valor `null`** (o `HashMap` aceita). E cuidado: operações isoladas são atômicas, mas uma sequência de duas não é — para isso existem `putIfAbsent`, `computeIfAbsent` e `merge`.

---

## 6. `ReentrantLock`: o lock explícito

Faz o que `synchronized` faz, com mais controle:

```java
private final ReentrantLock lock = new ReentrantLock();

public void transferir() {
    lock.lock();
    try {
        // seção crítica
    } finally {
        lock.unlock();           // ⚠️ SEMPRE no finally
    }
}
```

| Recurso | `synchronized` | `ReentrantLock` |
|---|---|---|
| Soltar automaticamente | **sim**, ao sair do bloco | **não** — você tem que chamar `unlock()` |
| Tentar sem esperar | ❌ | `tryLock()` |
| Esperar com prazo | ❌ | `tryLock(5, TimeUnit.SECONDS)` — **a defesa contra deadlock** |
| Interrompível enquanto espera | ❌ | `lockInterruptibly()` |
| Fila justa (FIFO) | ❌ | `new ReentrantLock(true)` |
| Várias condições de espera | uma só (`wait`/`notify`) | `newCondition()`, quantas quiser |
| Risco | menor | **esquecer o `unlock()` trava tudo** |

> **Quando usar qual:** `synchronized` por padrão — é mais simples e impossível de esquecer de soltar. `ReentrantLock` quando você precisa de `tryLock` com prazo, de justiça ou de múltiplas condições.

E o `ReadWriteLock`, quando as leituras são muito mais frequentes que as escritas:

```java
var rw = new ReentrantReadWriteLock();
rw.readLock().lock();      // vários leitores ao mesmo tempo
rw.writeLock().lock();     // escritor sozinho, exclui todos
```

---

## 7. Os sincronizadores

| Classe | O que faz | Reutilizável |
|---|---|---|
| **`CountDownLatch`** | espera **N eventos** acontecerem: `countDown()` diminui, `await()` espera chegar a zero | ❌ uso único |
| **`CyclicBarrier`** | espera **N threads** chegarem a um ponto, e aí todas seguem | ✅ |
| **`Semaphore`** | limita quantas threads usam um recurso ao mesmo tempo (`acquire`/`release`) | ✅ |
| **`Phaser`** | barreira flexível, com fases | ✅ |

```java
// esperar 3 serviços subirem antes de continuar
CountDownLatch pronto = new CountDownLatch(3);

for (var servico : servicos) {
    new Thread(() -> { servico.iniciar(); pronto.countDown(); }).start();
}
pronto.await();                 // bloqueia até os 3 chamarem countDown()
System.out.println("tudo no ar");
```

```java
// no máximo 5 conexões simultâneas
Semaphore vagas = new Semaphore(5);
vagas.acquire();
try { usarConexao(); } finally { vagas.release(); }
```

---

## 8. `ThreadLocal`: uma cópia por thread

```java
private static final ThreadLocal<SimpleDateFormat> FORMATO =
    ThreadLocal.withInitial(() -> new SimpleDateFormat("dd/MM/yyyy"));

String data = FORMATO.get().format(new Date());     // cada thread tem a sua
```

Resolve o compartilhamento **evitando-o**: cada thread tem seu próprio valor. É assim que o Spring guarda a transação e o contexto de segurança da requisição atual. → [SPRING SECURITY](../spring-security/README.md)

> ⚠️ **Em pool de threads, limpe.** A thread é reaproveitada, então o valor sobra para a próxima tarefa — vaza dado entre requisições e segura objetos na memória. Chame `remove()` no `finally`.

---

## 9. Threads virtuais (Java 21)

A mudança mais importante da plataforma nessa área:

```java
// uma thread virtual por tarefa — pode ser um milhão delas
try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {
    for (var pedido : pedidos) {
        pool.submit(() -> processar(pedido));      // bloquear aqui é BARATO
    }
}

Thread.ofVirtual().start(() -> System.out.println("sou virtual"));
```

| | Thread de plataforma | Thread virtual |
|---|---|---|
| Equivale a | **uma thread do sistema operacional** | gerenciada pela **JVM**, montada sobre poucas do SO |
| Custo | ~1 MB de pilha | leve: pilha no heap, cresce sob demanda |
| Quantas cabem | milhares | **milhões** |
| Ao bloquear em I/O | desperdiça uma thread cara | **desmonta** e libera a do SO |
| Pool | **necessário** | **não faça pool** — crie uma por tarefa |
| Ajuda em trabalho de CPU | — | **não**: o limite continua sendo o número de núcleos |

O detalhe (incluindo *pinning* e onde o gargalo vai parar) está em [JVM - threads de plataforma × virtuais](../jvm-e-plataforma-java/iii-subir-e-operar-em-producao.md#3-threads-plataforma--virtuais).

---

## 10. O mapa da decisão

| Preciso… | Use |
|---|---|
| rodar tarefas em segundo plano | `ExecutorService` |
| um resultado depois | `Callable` + `Future` |
| encadear etapas sem bloquear | `CompletableFuture` |
| um contador seguro | `AtomicInteger` / `LongAdder` |
| um mapa compartilhado | `ConcurrentHashMap` |
| produtor-consumidor | `BlockingQueue` |
| esperar N coisas terminarem | `CountDownLatch` |
| limitar acesso simultâneo | `Semaphore` |
| lock com prazo ou justiça | `ReentrantLock` |
| um valor por thread | `ThreadLocal` (com `remove()`) |
| atender milhares de conexões | **threads virtuais** (21+) |

---

## Perguntas para autoavaliação

1. Por que criar uma thread por tarefa não escala?
2. Compare `newFixedThreadPool`, `newCachedThreadPool` e `newSingleThreadExecutor`.
3. Por que `newCachedThreadPool` é perigoso sob carga alta?
4. Diferencie `shutdown()` e `shutdownNow()`.
5. O que acontece se você esquecer o `shutdown()`?
6. Qual a diferença entre `Runnable` e `Callable` num executor?
7. O que `Future.get()` faz? Como evitar esperar para sempre?
8. Onde vai parar uma exceção lançada dentro de um `Callable`?
9. Qual a diferença de comportamento entre `submit()` e `execute()` diante de uma exceção?
10. O que `CompletableFuture` resolve que o `Future` não resolve?
11. Diferencie `thenApply`, `thenCompose` e `thenCombine`.
12. Como o `AtomicInteger` consegue ser seguro sem bloquear?
13. Quando usar `LongAdder` em vez de `AtomicLong`?
14. Por que `ConcurrentHashMap` é melhor que `Collections.synchronizedMap`?
15. Que restrição o `ConcurrentHashMap` tem que o `HashMap` não tem?
16. Para que serve `CopyOnWriteArrayList` — e quando ela é péssima?
17. Como uma `BlockingQueue` substitui `wait`/`notify`?
18. Compare `synchronized` e `ReentrantLock` em cinco critérios.
19. Por que o `unlock()` precisa estar no `finally`?
20. Como o `tryLock` com prazo ajuda contra deadlock?
21. Diferencie `CountDownLatch`, `CyclicBarrier` e `Semaphore`.
22. Para que serve `ThreadLocal`, e qual o cuidado obrigatório em pool de threads?
23. Compare thread de plataforma e thread virtual em quatro critérios.
24. Por que não se faz pool de threads virtuais?

---

> [← Voltar para THREADS E CONCORRÊNCIA](README.md) · Anterior: [II - COMPARTILHANDO MEMÓRIA](ii-compartilhando-memoria.md)
