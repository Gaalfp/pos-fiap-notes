# DESIGN PATTERNS EM OO

São soluções típicas para problemas comuns no desenvolvimento de software. São como modelos pré-fabricados que você pode personalizar para resolver um problema recorrente no seu código. Você não pode simplesmente encontrar um padrão e copiá-lo para o seu programa, como faria com funções ou bibliotecas prontas. O padrão não é um trecho de código específico, mas um conceito geral para resolver um problema em particular. Você pode seguir os detalhes do padrão e implementar uma solução que se adeque à realidade do seu programa.

## 🏗️ 1. Padrões Criacionais (Creational)

Estes padrões focam em **como os objetos são criados**. Eles ajudam a tornar o sistema independente de como seus objetos são instanciados e compostos, evitando o uso excessivo do operador `new` espalhado pelo código.

- **Objetivo:** Flexibilizar a criação de objetos.
- **Exemplos famosos:**
    - **Singleton:** Garante que uma classe tenha apenas uma instância.
    - **Factory Method:** Define uma interface para criar um objeto, mas deixa as subclasses decidirem qual classe instanciar.
    - **Builder:** Separa a construção de um objeto complexo da sua representação.

## 🧱 2. Padrões Estruturais (Structural)

Eles lidam com a **composição de classes e objetos**. O foco aqui é garantir que, ao montar partes do sistema, as estruturas permaneçam flexíveis e eficientes.

- **Objetivo:** Organizar diferentes classes e objetos para formar estruturas maiores.
- **Exemplos famosos:**
    - **Adapter:** Permite que interfaces incompatíveis trabalhem juntas (como um adaptador de tomada).
    - **Facade:** Provê uma interface simplificada para um conjunto complexo de classes.
    - **Composite:** Compõe objetos em estruturas de árvore para representar hierarquias.

## ⚙️ 3. Padrões Comportamentais (Behavioral)

Esses padrões concentram-se nos **algoritmos e na atribuição de responsabilidades** entre objetos. Eles descrevem não apenas os padrões de objetos ou classes, mas também os padrões de comunicação entre eles.

- **Objetivo:** Melhorar a comunicação e a interação entre os objetos.
- **Exemplos famosos:**
    - **Observer:** Define uma dependência "um-para-muitos" para que, quando um objeto muda de estado, todos os seus dependentes sejam notificados.
    - **Strategy:** Define uma família de algoritmos, encapsula cada um e os torna intercambiáveis.
    - **Chain of Responsibility:** Permite passar solicitações ao longo de uma cadeia de manipuladores.
