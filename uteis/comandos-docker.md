# COMANDOS  DOCKER

### **🐳 Comandos de Imagens (O "DNA" do seu Container)**

As imagens são arquivos de leitura que servem como base para os containers.

| **Comando** | **O que ele faz exatamente** | **Exemplo de Uso** |
| --- | --- | --- |
| `docker build` | Constrói uma imagem a partir de um arquivo `Dockerfile`. | `docker build -t meu-projeto .` |
| `docker pull` | Baixa uma imagem do Docker Hub para o seu computador. | `docker pull postgres` |
| `docker images` | Lista todas as imagens que você tem baixadas no Mac. | `docker images` |
| `docker rmi` | **R**emove uma **i**magem específica do seu disco. | `docker rmi id_da_imagem` |
| `docker tag` | Cria um "apelido" ou versão para uma imagem. | `docker tag imagem:v1 imagem:latest` |
|  |  |  |

**🚀 Comandos de Containers (O "Coração" do Docker)**

| **Comando** | **O que ele faz exatamente** | **Flags Comuns** |
| --- | --- | --- |
| **`docker run`** | **Cria e inicia** um container de uma vez só. | `-d` (fundo), `-p` (porta), `--name` (nome) |
| `docker ps` | Mostra os containers que estão **rodando** agora. | `-a` (mostra até os que já pararam) |
| `docker stop` | Desliga o container suavemente (manda um sinal de tchau). | `docker stop nome_do_container` |
| `docker start` | Liga um container que já foi criado mas estava parado. | `docker start nome_do_container` |
| `docker rm` | **R**emove um container (deleta o processo). | `docker rm -f` (força a remoção) |
| `docker pause` | "Congela" o container no estado atual. | `docker pause nome_do_container` |

### 🔍 Comandos de Inspeção e Debug (O "Raio-X")

Esses são os comandos para quando algo dá errado ou você quer entender o que está rolando.

| **Comando** | **O que ele faz exatamente** | **Por que usar?** |
| --- | --- | --- |
| **`docker exec`** | Roda um comando dentro de um container ativo. | Para "entrar" no terminal do container (`-it`). |
| `docker logs` | Mostra a saída de texto do console do container. | Para ver erros de inicialização ou logs do site. |
| `docker inspect` | Mostra um relatório técnico (JSON) detalhado. | Para ver o IP interno ou configurações de rede. |
| `docker stats` | Mostra o consumo de CPU e Memória em tempo real. | Para saber se o Docker está pesando no seu Mac. |
| `docker port` | Mostra qual porta do seu Mac está ligada ao container. | Para saber onde acessar no seu navegador. |
