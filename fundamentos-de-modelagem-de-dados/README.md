# FUNDAMENTOS DE MODELAGEM DE DADOS

### **BASIC CONCEPTS:**

Dados são elementos brutos que representam um aspecto da realidade. Matéria prima da informação. 

- Metadados representam e caracterizam outros dados documentados.

Banco de dados: coleção de informações correlacionadas.

SGBD: Sistemas de gerenciamento de banco de dados. Permitindo controlar acesso, manipulacoes e questoes fundamentais de um banco de dados. Sao sistemas gerenciadores

Bancos Relacionais: Chaves primárias e estrangeiras, tabelas, integridade referencial, uso de linguagem SQL, propriedades ACID (Atomicidade, Consistencia, Isolamento, Durabilidade), segurança e controles de acesso. 

Modelagem de dados: criar uma representacao visual dos sistemas de gerenciamento e coleta de informações de uma organização. 

- Nivel logico: A modelagem torna-se mais detalhada definindo tabelas, colunas, tipios de dados, chaves e restricoes
- Nivel fisico: implementacao do nivel logico, discutimos questoes como indexes, colocamos em pratica os campos

![image.png](assets/fundamentos-de-modelagem-de-dados-01.png)

![image.png](assets/fundamentos-de-modelagem-de-dados-02.png)

Normalização de dados: é o processo de organizar os dados em um banco, com o objetivo de torná-lo mais eficiente, sem redundância e com integridade.

- Divisão em tabelas: tabelas menores, com dados pertinentes a um único conceito.
- Atributos atômicos: não podem ser divididos ou modificados, pois estão em sua forma mínima.
- Chave primária: é exclusiva e não pode se repetir.
- Independência de ordens: a ordem de linhas e colunas deve ser independente dos dados.
- Redução de redundância: evita a repetição de dados, economizando espaço e evitando inconsistências.
- Manutenção simplificada: manutenções e atualizações ficam mais simples.
- Escalabilidade: novas tabelas não afetam necessariamente as outras.

Modelagem orientada a objetos: Orientada a desenvolvimento de software, representa entidades do mundo real em objetos. os 4 pilares são os mesmos da programação. 

[MODELAGEM RELACIONAL](modelagem-relacional.md)

[VIEWS](views.md)

[ÍNDICE](indice.md)

[PROCEDURES](procedures.md)

[MODELAGEM NÃO RELACIONAL](modelagem-nao-relacional.md)

[BANCO DE DADOS EM GRAFOS](banco-de-dados-em-grafos.md)

[ACID](acid.md)
