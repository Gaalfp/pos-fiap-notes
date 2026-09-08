# CAPITULO IV - VOLUMES

São os dicos que o container usa. P que os dados sobrevivam mesmo que o container seja destruído ou reiniciado.

| **Benefício** | **Descrição** |
| --- | --- |
| **Portabilidade** | Você pode mover esse volume para outro computador e o banco de dados sobe igualzinho. |
| **Segurança** | Se o processo travar e corromper o container, seus arquivos estão salvos fora dele. |
| **Performance** | O Docker gerencia os volumes de forma que a leitura e escrita de dados seja muito mais rápida que dentro da camada do container. |
|  |  |
|  |  |

docker volume create nomeDoVolume → para criar um volume 

docker volume rm nomeDoVolume → remover o volume 

docker volume inspect → inspecionar o volume 

docker volume prune → vai limpar todos os discos que não estão sendo utilizados]
