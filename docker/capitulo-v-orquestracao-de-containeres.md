# CAPITULO V - ORQUESTRAÇÃO DE CONTAINERES

Dockercompose → ferramenta para definir e rodar aplicações de **múltiplos containers**. Em vez de você digitar aquele comando gigante (com volume, rede, portas e senhas) toda vez no terminal, você escreve tudo em um arquivo chamado `docker-compose.yml` e sobe tudo de uma vez.

### 🎻 A Analogia do Maestro

Imagine que sua aplicação é uma orquestra:

- O **Container** é o músico (o cara do Java, o cara do Banco de Dados, o cara do Cache).
- O **Docker Compose** é o **Maestro**. Ele sabe quem deve começar primeiro, qual porta cada um usa e como eles conversam entre si.

basicamente os comandos do docker-compose tem as mesmas funções do docker container comum. Com diferença dos comandos up e down, up vai subir e down derrubar.
