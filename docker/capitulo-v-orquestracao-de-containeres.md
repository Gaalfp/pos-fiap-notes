# CAPITULO V - ORQUESTRAÇÃO DE CONTAINERES

> [← Voltar para DOCKER](README.md) · Anterior: [CAPITULO IV - VOLUMES](capitulo-iv-volumes.md)

Dockercompose → ferramenta para definir e rodar aplicações de **múltiplos containers**. Em vez de você digitar aquele comando gigante (com volume, rede, portas e senhas) toda vez no terminal, você escreve tudo em um arquivo chamado `docker-compose.yml` e sobe tudo de uma vez.

### 🎻 A Analogia do Maestro

Imagine que sua aplicação é uma orquestra:

- O **Container** é o músico (o cara do Java, o cara do Banco de Dados, o cara do Cache).
- O **Docker Compose** é o **Maestro**. Ele sabe quem deve começar primeiro, qual porta cada um usa e como eles conversam entre si.

basicamente os comandos do docker-compose tem as mesmas funções do docker container comum. Com diferença dos comandos up e down, up vai subir e down derrubar.

---

## 1. Um `docker-compose.yml` real

```yaml
services:

  api:
    build:
      context: .
      dockerfile: Dockerfile
    image: banking-api:1.0
    container_name: banking-api
    ports:
      - "8080:8080"                       # só a API é publicada para fora
    environment:
      SPRING_PROFILES_ACTIVE: prod
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/banking   # nome do SERVIÇO como host
      SPRING_DATASOURCE_USERNAME: ${DB_USER}          # vem do arquivo .env
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      SPRING_RABBITMQ_HOST: rabbitmq
      JAVA_TOOL_OPTIONS: "-XX:MaxRAMPercentage=75.0"
    depends_on:
      postgres:
        condition: service_healthy        # ⚠️ espera ficar SAUDÁVEL, não só "iniciado"
      rabbitmq:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 40s                   # tempo de graça para a JVM subir
    networks: [backend, frontend]
    restart: unless-stopped
    deploy:
      resources:
        limits: { cpus: "1.5", memory: 768M }

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: banking
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - dados-postgres:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d banking"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks: [backend]                   # NÃO está na rede frontend
    restart: unless-stopped

  rabbitmq:
    image: rabbitmq:3.13-management-alpine
    ports:
      - "127.0.0.1:15672:15672"           # console só no loopback do host
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "-q", "ping"]
      interval: 15s
      retries: 5
    networks: [backend]
    restart: unless-stopped

volumes:
  dados-postgres:

networks:
  frontend:
  backend:
```

### Os pontos que importam nesse arquivo

**`depends_on` sozinho é uma armadilha.** Na forma curta (`depends_on: [postgres]`), ele garante apenas a **ordem de início** — o Compose considera "pronto" assim que o processo sobe. O Postgres leva alguns segundos até aceitar conexão, e a API estoura com *connection refused*. A forma correta é `condition: service_healthy`, que espera o **healthcheck** passar. É a pergunta mais frequente sobre Compose.

**Nome do serviço = hostname.** `jdbc:postgresql://postgres:5432` funciona porque o Compose cria uma rede definida pelo usuário e o DNS interno resolve o nome do serviço. → [CAPITULO III - REDES](capitulo-iii-redes.md)

**Duas redes, isolamento real.** `postgres` e `rabbitmq` estão só em `backend`; um container ligado apenas a `frontend` não tem rota até o banco.

**Segredo fora do arquivo.** `${DB_USER}` e `${DB_PASSWORD}` vêm de um `.env` que **não** vai para o Git (ou de um secret manager em produção).

**Políticas de `restart`:** `no` (padrão), `on-failure`, `always` (reinicia até após reboot da máquina), `unless-stopped` (igual a `always`, mas respeita uma parada manual).

> Note que a chave `version:` não aparece mais — ela foi **descontinuada** na especificação atual do Compose e só gera aviso.

---

## 2. Comandos

```bash
docker compose up -d                  # sobe tudo em background  (v2: "docker compose", sem hífen)
docker compose up -d --build          # rebuilda as imagens antes
docker compose down                   # derruba containers e rede
docker compose down -v                # ⚠️ derruba TAMBÉM os volumes — apaga os dados
docker compose ps                     # status dos serviços
docker compose logs -f api            # segue o log de um serviço
docker compose exec api sh            # entra no container do serviço
docker compose restart api
docker compose up -d --scale api=3    # sobe 3 réplicas da API (exige remover container_name e ports fixas)
docker compose config                 # mostra o YAML final, com variáveis já resolvidas — ótimo para debug
```

**Profiles** permitem serviços opcionais no mesmo arquivo:

```yaml
  pgadmin:
    image: dpage/pgadmin4
    profiles: [dev]        # só sobe com: docker compose --profile dev up
```

E **múltiplos arquivos** resolvem a diferença entre ambientes: `docker compose -f docker-compose.yml -f docker-compose.dev.yml up` mescla os dois, com o segundo sobrescrevendo o primeiro.

---

## 3. Onde o Compose para

O Compose é excelente para **desenvolvimento, testes de integração e CI**, e serve para produção pequena de **um host só**. O que ele **não** faz:

| Falta | Consequência |
|---|---|
| Múltiplos hosts | não distribui containers por um cluster |
| Auto-scaling | `--scale` é manual e não reage a carga |
| Self-healing entre nós | se a máquina morre, tudo morre junto |
| Deploy sem downtime | não tem rolling update com verificação de saúde |
| Balanceamento e service discovery entre nós | resolve DNS só dentro do host |
| Gestão de segredo e configuração | `.env` não é secret manager |

Quando um desses vira requisito, você precisa de um **orquestrador de cluster**.

---

## 4. Swarm × Kubernetes

| | **Docker Swarm** | **Kubernetes** |
|---|---|---|
| Curva de aprendizado | baixa — sintaxe quase igual à do Compose | alta |
| Instalação | `docker swarm init` | cluster (kubeadm, EKS, GKE, AKS) |
| Unidade de execução | **service** (containers) | **Pod** (um ou mais containers que compartilham rede e volume) |
| Escala automática | não nativa | **HPA** por CPU, memória ou métrica custom |
| Rolling update / rollback | sim, simples | sim, com estratégias e histórico de revisões |
| Ecossistema | pequeno | enorme (Helm, operadores, service mesh, GitOps) |
| Estado do projeto | **estagnado**, pouca evolução | **padrão de fato** do mercado |
| Quando escolher | cluster pequeno, time sem plataforma dedicada | qualquer coisa que precise escalar de verdade |

### O vocabulário mínimo de Kubernetes

Mapeando a partir do que você já sabe de Compose:

| Compose | Kubernetes | O que é |
|---|---|---|
| `services:` | **Deployment** | declara quantas réplicas do Pod devem existir e como atualizá-las |
| um container | **Pod** | a menor unidade implantável; um ou mais containers acoplados |
| DNS por nome de serviço | **Service** | IP e DNS estáveis que balanceiam entre os Pods |
| `ports:` publicado | **Ingress** | roteamento HTTP externo (host/path) para os Services |
| `environment:` | **ConfigMap** / **Secret** | configuração e segredo desacoplados da imagem |
| `volumes:` | **PersistentVolumeClaim** | pedido de armazenamento ao cluster |
| `deploy.resources` | `resources.requests/limits` | o agendador usa isso para decidir onde cabe o Pod |
| `healthcheck` | **liveness / readiness probe** | reiniciar se travou; tirar do balanceador se não está pronto |
| `--scale` | **HorizontalPodAutoscaler** | escala automaticamente por métrica |

**Liveness × readiness — distinção que cai em prova:** *liveness* responde "devo **reiniciar** este Pod?"; *readiness* responde "posso **mandar tráfego** para ele?". Uma aplicação Spring subindo com cache frio está *viva* mas ainda não *pronta*. Confundir as duas causa reinício em loop durante a inicialização (por isso existe `start_period`/`startupProbe`).

O Kubernetes **não usa mais o Docker como runtime** (o *dockershim* foi removido na versão 1.24) — ele fala com containerd ou CRI-O. Mas a **imagem continua a mesma**, porque o formato é OCI. Você continua buildando com Docker e rodando em Kubernetes.

---

## 5. Boas práticas de container em produção

Os pontos dos **12 fatores** que mais aparecem em prova de arquitetura:

- **Configuração no ambiente**, não na imagem. A mesma imagem sobe em dev, homolog e prod, mudando só variáveis. Se você builda uma imagem por ambiente, algo está errado.
- **Processos sem estado (stateless)**: sessão em Redis/JWT, arquivo em object storage, dado em banco. Container deve poder morrer a qualquer momento. → [SPRING SECURITY](../spring-security/README.md)
- **Logs em `stdout`/`stderr`**, como stream — nunca em arquivo dentro do container. Quem coleta e roda é a plataforma.
- **Descartabilidade**: subir rápido e desligar **graciosamente** com `SIGTERM`. → [CAPITULO II](capitulo-ii-gerenciamento-de-containers.md)
- **Paridade entre ambientes**: a mesma imagem, do commit à produção, identificada por tag/digest imutável.
- **Health endpoints** (`/actuator/health/liveness` e `/readiness` no Spring Boot) expostos para as probes.

---

## Perguntas para autoavaliação

1. Por que `depends_on` sozinho não garante que a API vai conectar no banco?
2. O que `condition: service_healthy` exige que o serviço tenha declarado?
3. Como a API descobre o endereço do Postgres em um Compose?
4. Qual a diferença entre `docker compose down` e `down -v`?
5. Para que serve separar `frontend` e `backend` em duas redes?
6. Cite três coisas que o Compose não faz e que exigem um orquestrador de cluster.
7. Compare Swarm e Kubernetes: quando cada um faz sentido?
8. O que é um Pod, e por que ele não é sinônimo de container?
9. Explique a diferença entre liveness probe e readiness probe.
10. O Kubernetes ainda usa o Docker como runtime? A sua imagem precisa mudar?
11. Por que a configuração deve vir do ambiente e não estar na imagem?

---

> [← Voltar para DOCKER](README.md) · Anterior: [CAPITULO IV - VOLUMES](capitulo-iv-volumes.md)
