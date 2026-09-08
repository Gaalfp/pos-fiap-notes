# MODELAGEM RELACIONAL

Representação dos dados através das relações, organização em tabelas, chave primária (identificador único), integridade referencial, eliminação de redundância. 

- Domínio: um conjunto de valores que possuem propriedades em comum
- Atributo: uma propriedade da entidade, como nome, cor, tamanho
- Entidade: Um elemento do sistema que possui propriedades que o distinguem
- Tuplas: um conjunto de atributos de uma entidade

Tipos de modelagem de dados: 

- CONCEITUAL:

![image.png](assets/modelagem-relacional-01.png)

- LÓGICA:

![image.png](assets/modelagem-relacional-02.png)

- FÍSICA:

![image.png](assets/modelagem-relacional-03.png)

Existem formas normais para a aplicação da modelagem:

![image.png](assets/modelagem-relacional-04.png)

## RELACIONAMENTOS:

Formas em que as tabelas se relacionam entre si. 

Um para muitos: para um registro de uma tabela podem existir vários registros relacionados em outra tabela. Ex: uma tabela de marca - produto, uma marca pode ter N produtos. 

Muitos para muitos: Ocorre quando um ou mais registros estao associados a um ou mais registros de outra tabela. Ex: tabela aluna - professor, N alunos podem ter N professores relacionados.
