# CAPITULO II - GERENCIAMENTO DE CONTAINERS

- ddocker container - mexer em containeres
- docker container ls → listar containeres ativos
- docker container ls -la → listar todos os containeres
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

## ESTRUTURA BÁSICA DE UM DOCKERFILE

- FROM → indicando a imagem e o nome da imagem
- ENV → aponta pra variavel dentro do dockerfile
- ARGS → argumentos que devem ser passados no momento do build
- WORKDIR → Define o diretorio que a apliacação vai rodar
- COPY → copiar algo para dentro do seu container, para o seu diretorio
- RUN → executar comandos, executado no momento que builda, criação da imagem
- EXPOSE → expor algo, geralmente utilizado para expor alguma porta
- CMD → é tipo um run mas que só executa quando o container starta, quando inicia

export DOCKER_CONTENT_TRUST=1 para habilitar que sejam baixadas apenas imagens verificadas.

ao buildar uma imagem com um —no-cache voce nao usa cache e atualiza a imagem pra versão mais atualizada. Não utiliza a versão em memória.

Nem sempre a imagem com a versão latest é a melhor

Trivy é um scanner de vulnerabilidades gratuito para imagens
