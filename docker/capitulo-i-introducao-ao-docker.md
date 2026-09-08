# CAPITULO I - INTRODUÇÃO AO DOCKER

Docker - motor responsável pelo gerenciamento dos containeres em produção. Criamos varios containeres dentro da nossa máquina assim as aplicações se tornam independentes. 

Imagem - Um **arquivo** (snapshot) que contém o sistema operacional mínimo + sua aplicação Java + dependências

| **Conceito** | **Imagem** | **Container** |
| --- | --- | --- |
| **O que é?** | Um **arquivo** (snapshot) que contém o sistema operacional mínimo + sua aplicação Java + dependências. | Um **processo** vivo no seu computador que nasceu a partir daquela imagem. |
| **Estado** | **Imutável.** Você não altera uma imagem; se precisar mudar algo, você gera uma imagem nova. | **Mutável.** Você pode criar arquivos dentro dele enquanto ele estiver rodando (embora eles sumam se você deletar o container). |
| **Relação** | É a "planta" ou o modelo. | É a "casa" construída baseada na planta. |

- Kernel - comunicacao entre o hardware e software
- Cgroup - limita o uso de cpu, memoria e rede
- Namespaces - responsavel por isolar os processos
- WSL - windows subsystem for linux
