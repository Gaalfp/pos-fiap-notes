# DOCKER

Container não é uma VM leve — é um **processo isolado** pelo kernel do host, empacotado com todo o ambiente de que precisa. Estes capítulos vão do conceito ao `docker-compose.yml` de produção.

- [CAPITULO I - INTRODUÇÃO AO DOCKER](capitulo-i-introducao-ao-docker.md) — imagem × container, VM × container, namespaces e cgroups, arquitetura do daemon, camadas e copy-on-write, registry e ciclo de vida
- [CAPITULO II - GERENCIAMENTO DE CONTAINERS](capitulo-ii-gerenciamento-de-containers.md) — comandos, Dockerfile completo, `CMD` × `ENTRYPOINT`, multi-stage build, boas práticas de imagem Java e segurança
- [CAPITULO III - REDES](capitulo-iii-redes.md) — drivers, DNS interno por nome de serviço, publicação de portas e isolamento
- [CAPITULO IV - VOLUMES](capitulo-iv-volumes.md) — volume × bind mount × tmpfs, permissões, backup
- [CAPITULO V - ORQUESTRAÇÃO DE CONTAINERES](capitulo-v-orquestracao-de-containeres.md) — Compose real, healthcheck e `depends_on`, limites do Compose, Swarm × Kubernetes e 12 fatores

**Relacionados:** [COMANDOS DOCKER](../uteis/comandos-docker.md) · [TESTES EM SOFTWARE](../testes-em-software/iii-testes-no-spring.md) · [CLEAN ARCHITECTURE](../clean-architecture/README.md)
