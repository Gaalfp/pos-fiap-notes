# CAPITULO II - GERENCIAMENTO DE CONTAINERS

> [← Voltar para DOCKER](README.md) · Anterior: [CAPITULO I](capitulo-i-introducao-ao-docker.md) · Próximo: [CAPITULO III - REDES](capitulo-iii-redes.md)

- docker container → mexer em containeres
- docker container ls → listar containeres ativos
- docker container ls -a → listar todos os containeres, inclusive os parados (`-a` = *all*; `-l` é *latest*, traz só o último criado)
- docker container start idcontainer → startar o container
- docker container stop idcontainer → stop o container
- docker container pause idcontainer → pausa o container, nao para ele
- docker container unpause idcontainer → despausa o container
- docker container kill idcontainer → vai matar o container
- docker container rm idcontainer → vai removar o container da lista, primeiro precisa stopar (dá pra usar o rm -f, que vai forçar ele a remover, matando-o mesmo ativo)
- docker container run -d imagem → vai rodar o container em segundo plano
- docker build → vai buildar a aplicação (adicionando -t voce vai tagear sua imagem. ex:node-app:latest)
- docker image → para interações com a imagem
- docker container logs idDoContainer → para ver os logs do container
- docker container logs -f → pra continuar nos logs

**`stop` × `kill` × `pause`** — diferença que cai em prova:

| Comando | Sinal | Efeito |
|---|---|---|
| `stop` | `SIGTERM`, depois `SIGKILL` após o *grace period* (10s por padrão) | permite **encerramento gracioso**: fechar conexões, terminar requisições |
| `kill` | `SIGKILL` direto | mata na hora, sem chance de limpeza — dado em memória se perde |
| `pause` | `SIGSTOP` via cgroup freezer | congela os processos; o container continua existindo e ocupando memória |

Em aplicação Spring, é o `SIGTERM` que dispara o `graceful shutdown` (`server.shutdown=graceful`). Usar `kill` em produção é atalho para transação pela metade.

### Comandos que faltam na lista e você vai usar todo dia

```bash
docker exec -it <id> sh            # entra no container em execução (debug)
docker inspect <id>                # TUDO sobre o container em JSON: rede, mounts, env, healthcheck
docker stats                       # uso de CPU/memória em tempo real
docker top <id>                    # processos rodando dentro do container
docker cp <id>:/app/heapdump.hprof .   # copia arquivo de dentro do container
docker system df                   # quanto disco imagens/containers/volumes estão ocupando
docker system prune -a             # ⚠️ remove TUDO que não está em uso
docker run --rm ...                # remove o container automaticamente ao terminar
docker run --memory=512m --cpus=1.5 ...   # limita recursos via cgroups
```

---

## ESTRUTURA BÁSICA DE UM DOCKERFILE

- **FROM** → indicando a imagem e o nome da imagem
- **ENV** → aponta pra variavel dentro do dockerfile
- **ARGS** → argumentos que devem ser passados no momento do build
- **WORKDIR** → Define o diretorio que a apliacação vai rodar
- **COPY** → copiar algo para dentro do seu container, para o seu diretorio
- **RUN** → executar comandos, executado no momento que builda, criação da imagem
- **EXPOSE** → expor algo, geralmente utilizado para expor alguma porta
- **CMD** → é tipo um run mas que só executa quando o container starta, quando inicia

### As instruções que faltavam

| Instrução | Para quê |
|---|---|
| **`ENTRYPOINT`** | define o **executável fixo** do container (ver abaixo) |
| **`LABEL`** | metadados da imagem (`maintainer`, versão, commit) — usados por ferramentas e políticas |
| **`USER`** | troca o usuário que roda o processo — **essencial**, o padrão é root |
| **`HEALTHCHECK`** | comando que diz se a aplicação está saudável (não só "o processo existe") |
| **`VOLUME`** | declara um ponto de montagem que deve persistir fora da camada do container |
| **`ADD`** | como o `COPY`, mas também baixa URL e **descompacta tar** — por isso é imprevisível: **prefira `COPY`** |

```dockerfile
LABEL org.opencontainers.image.source="https://github.com/Gaalfp/minha-app"
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1
USER 10001:10001
```

`ARG` × `ENV`: **`ARG` só existe durante o build** (e aparece no histórico da imagem — nunca passe segredo por ele); **`ENV` persiste no container em execução**.

### `CMD` × `ENTRYPOINT` — a diferença crucial

| | `CMD` | `ENTRYPOINT` |
|---|---|---|
| Papel | comando/argumentos **padrão** | o **executável** do container |
| `docker run img outro-comando` | **substitui** o CMD | vira **argumento** do entrypoint |
| Uso típico | imagem genérica (ex.: `ubuntu` → `bash`) | imagem de aplicação, que sempre roda a mesma coisa |

```dockerfile
ENTRYPOINT ["java", "-jar", "/app/app.jar"]     # sempre executa isso
CMD ["--spring.profiles.active=prod"]           # argumento padrão, substituível

# docker run minha-app                          → java -jar app.jar --spring.profiles.active=prod
# docker run minha-app --spring.profiles.active=dev → troca só o argumento
```

### Forma *exec* × forma *shell* — e o PID 1

```dockerfile
CMD ["java", "-jar", "app.jar"]     # ✅ EXEC form (JSON): java vira o PID 1
CMD java -jar app.jar               # ❌ SHELL form: roda "/bin/sh -c java -jar app.jar"
```

Na forma shell, o **PID 1 é o `sh`**, e ele **não repassa o `SIGTERM`** para o Java. Resultado: `docker stop` espera 10 segundos e mata a JVM com `SIGKILL` — sem `graceful shutdown`, com requisições cortadas no meio. **Use sempre a forma exec** (colchetes com JSON) em `CMD` e `ENTRYPOINT`. → [CAPITULO I](capitulo-i-introducao-ao-docker.md)

### `.dockerignore`

Tão importante quanto o Dockerfile e quase sempre esquecido. Sem ele, o build envia `target/`, `.git/` e `node_modules/` inteiros para o daemon como contexto — deixando o build lento e podendo **vazar segredo** para dentro da imagem.

```gitignore
target/
.git/
.env
*.md
.idea/
**/src/test/
```

---

## Multi-stage build — obrigatório em Java

O problema: a imagem precisa do **JDK + Maven + código-fonte** para compilar, mas para **executar** basta o **JRE + o jar**. Sem multi-stage, você entrega 700 MB contendo compilador, código-fonte e cache do Maven em produção.

```dockerfile
# ---------- ESTÁGIO 1: BUILD ----------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build

COPY pom.xml .
RUN mvn dependency:go-offline -B          # camada cacheada enquanto o pom não muda

COPY src ./src
RUN mvn clean package -DskipTests -B

# ---------- ESTÁGIO 2: RUNTIME ----------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S app && adduser -S -G app app     # usuário sem privilégio
USER app

COPY --from=build /build/target/*.jar app.jar    # ← só o artefato atravessa

EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
```

Só o **último estágio** vira a imagem final: JDK, Maven, `.m2` e código-fonte ficam para trás. **De ~700 MB para ~200 MB**, com menos superfície de ataque (sem compilador dentro do container em produção).

Bônus para Spring Boot: as *layered jars* permitem separar dependências (mudam pouco) do código da aplicação (muda sempre), melhorando ainda mais o cache:

```dockerfile
RUN java -Djarmode=layertools -jar app.jar extract
COPY --from=build /build/dependencies/ ./
COPY --from=build /build/application/ ./
```

---

## Boas práticas de imagem Java

| Prática | Por quê |
|---|---|
| **Multi-stage build** | imagem final sem JDK, Maven nem código-fonte |
| **Base enxuta** | `alpine` (~5 MB, usa musl libc), `-jre` em vez de `-jdk`, ou **distroless** (sem shell nem gerenciador de pacotes) |
| **Usuário não-root** (`USER`) | limita o estrago de um RCE; exigido por políticas de cluster |
| **JVM ciente do container** | `-XX:MaxRAMPercentage=75.0` — a JVM enxerga os limites do cgroup desde o Java 10; sem isso ela pode assumir a RAM do host e tomar OOMKill |
| **Fixar a versão da base** | `eclipse-temurin:21.0.5_11-jre-alpine`, não `latest` |
| **Não usar `root` no build também** | reduz risco de escrita indevida no contexto |
| **`HEALTHCHECK`** | o orquestrador precisa saber se a app está **pronta**, não só se o processo existe |
| **Filesystem read-only** (`--read-only` + `tmpfs`) | container imutável em execução |
| **`--cap-drop=ALL`** | remove capacidades do kernel que a aplicação não usa |
| **Scan de vulnerabilidade no CI** | Trivy, Grype, Docker Scout |

> **Alpine e Java:** alpine usa `musl` em vez de `glibc`. Isso já causou problemas de compatibilidade e de desempenho de DNS em algumas cargas. Se a imagem for crítica, meça — muitos times preferem `-jre-jammy` (Ubuntu slim) ou distroless a alpine.

---

## Segurança de imagem

export DOCKER_CONTENT_TRUST=1 para habilitar que sejam baixadas apenas imagens verificadas.

ao buildar uma imagem com um `--no-cache` voce nao usa cache e atualiza a imagem pra versão mais atualizada. Não utiliza a versão em memória.

Nem sempre a imagem com a versão latest é a melhor

**Trivy** é um scanner de vulnerabilidades gratuito para imagens

```bash
trivy image minha-app:1.4.2 --severity HIGH,CRITICAL
docker scout cves minha-app:1.4.2
```

Outros pontos que a prova costuma cobrar:

- **Nunca coloque segredo na imagem** — nem em `ENV`, nem em `ARG`, nem em arquivo copiado. Tudo isso fica no **histórico de camadas** e é recuperável com `docker history`, mesmo que um `RUN rm` apague o arquivo depois (a camada anterior continua lá). Segredo entra em runtime: variável de ambiente injetada pelo orquestrador, secret manager ou `--mount=type=secret` no BuildKit.
- **Imagem mínima = menos CVE.** Cada pacote a mais na base é vulnerabilidade potencial que você vai ter que remediar depois.
- **Assinatura de imagem** (Docker Content Trust, Cosign/Sigstore) garante que a imagem em produção é a que o seu CI publicou.

---

## Perguntas para autoavaliação

1. Qual a diferença entre `stop`, `kill` e `pause`, e qual sinal cada um envia?
2. Por que `CMD java -jar app.jar` (forma shell) impede o *graceful shutdown*?
3. `CMD` × `ENTRYPOINT`: o que acontece quando você passa um comando no `docker run` em cada caso?
4. Qual a diferença entre `ARG` e `ENV`, e por que nenhum dos dois serve para segredo?
5. Por que `COPY` é preferível a `ADD`?
6. O que o multi-stage build resolve, e por que ele importa tanto em Java?
7. O que faz `-XX:MaxRAMPercentage` e o que acontece sem ele em um container com limite de memória?
8. Por que rodar como não-root é uma boa prática, e como fazer isso no Dockerfile?
9. Um `RUN rm segredo.txt` remove o segredo da imagem? Justifique.
10. Para que serve o `.dockerignore` e o que acontece sem ele?

---

> [← Voltar para DOCKER](README.md) · Anterior: [CAPITULO I](capitulo-i-introducao-ao-docker.md) · Próximo: [CAPITULO III - REDES](capitulo-iii-redes.md)
