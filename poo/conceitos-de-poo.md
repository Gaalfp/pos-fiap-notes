# CONCEITOS DE POO

Programa estruturado → Não segue os conceitos de programação orientada a objetos, então os dados não são agrupados logicamente em uma entidade por comum. São obtidos separadamente já que os dados estão espalhados.

Na Programacao orientada a objetos:

A classe é como um template do seu objeto, uma vez que elas são definidas em instâncias, elas conseguem ser utilizadas. A classe é como a forma e o objeto como o bolo.

- O objeto é uma entidade do mundo real, em technês, é como uma **unidade de estado e comportamento** que ocupa um lugar na memória (Heap).
    - **Identidade Única:** Mesmo que você tenha dois objetos `Usuario` com o mesmo nome e mesmo CPF, para o computador, eles são diferentes porque ocupam endereços de memória distintos.
    - **Ciclo de Vida:** O objeto "nasce" (instanciação via `new`), "vive" (executa métodos e altera atributos) e "morre" (removido pelo Garbage Collector quando ninguém mais o usa).
    - Atributos (também chamados de propriedades ou campos) são as variáveis declaradas dentro da classe que definem as **características** ou o **estado** do objeto.
        
        
        | **Tipo** | **Descrição** | **Exemplo Prático** |
        | --- | --- | --- |
        | **Atributo de Instância** | Cada objeto tem o seu próprio valor. | O `nome` de cada `Usuario`. |
        | **Atributo de Classe (Static)** | O valor é compartilhado por todos os objetos daquela classe. | O `limite_maximo_de_usuarios` do sistema. |
    - Métodos são funçoes que utilizam as propriedades da classe e fazem algum processamento para aquele Objeto.

Os objetos podem ter relacionamentos entre si, unidirecionais ou bidirecioanais. Depende da questão de negócio e complexidade do seu código. Nem sempre é necessário adicionar a complexidade de relacionamentos.

## PILARES DA POO:

**1. Abstração (O Filtro da Realidade)**
Abstrair é a habilidade de ignorar o que não é essencial. No código, criamos classes que representam apenas as propriedades e comportamentos necessários para o contexto do sistema.
• **O Conceito:** Se você está criando um sistema para um **Detran**, a abstração de `Carro` precisa de `placa` e `chassi`. Se o sistema é um **Simulador de Corrida**, a abstração precisa de `torque` e `coeficiente_aerodinamico`.
• **Na Prática:** Usamos **Classes Abstratas** e **Interfaces** para definir o "contrato" (o que o objeto deve fazer) sem se preocupar agora com o "como".
• **Visão Sênior:** A abstração mal feita gera o "over-engineering". Não tente prever o futuro; abstraia apenas o que o negócio pede hoje.

**2. Encapsulamento (A Blindagem dos Dados)**
É o pilar da **segurança**. Ele diz que o estado interno de um objeto (seus atributos) não deve ser acessado ou alterado diretamente por ninguém de fora.
• **O Conceito:** Você não abre o motor do carro para girar o pistão com a mão; você gira a chave. O motor está encapsulado.
• **Mecanismo:** Usamos modificadores de acesso:
    ◦ `private`: Só a própria classe vê.
    ◦ `protected`: A classe e suas filhas veem.
    ◦ `public`: Todo mundo vê (use com muito cuidado).
• **Visão Sênior:** O encapsulamento permite que você mude a lógica interna de uma classe (ex: mudar o banco de dados de SQL para NoSQL) sem que o resto do sistema sequer perceba.

**3. Herança (A Reutilização de DNA)**
Permite criar novas classes baseadas em classes existentes, herdando seus atributos e métodos. Cria uma relação de **"é um"**.
• **O Conceito:** Um `Desenvolvedor` **é um** `Funcionario`. Ele herda `nome` e `salario`, mas pode ter algo específico como `linguagem_principal`.
• **Vantagem:** Evita a repetição de código (DRY - *Don't Repeat Yourself*).
• **Visão Sênior:** **Cuidado aqui.** A herança cria um acoplamento muito forte. Se você mudar a classe pai, pode quebrar 50 classes filhas. Por isso, a regra de ouro do design de software moderno é: **"Prefira composição à herança"**.

**4. Polimorfismo (As Múltiplas Faces)**
É a capacidade de um objeto se comportar de formas diferentes dependendo do contexto. O mesmo método pode ter implementações distintas.
• **O Conceito:** Imagine o método `pagar()`.
    ◦ Para o objeto `Boleto`, `pagar()` gera um código de barras.
    ◦ Para o objeto `CartaoCredito`, `pagar()` chama a API da operadora.
    ◦ No código principal, você só chama `pagamento.pagar()` sem se importar com o tipo.
• **Tipos Práticos:**
    ◦ **Sobrescrita (Override):** A filha redefine um método da pai.
    ◦ **Sobrecarga (Overload):** O mesmo método aceita diferentes tipos de parâmetros (comum em Java/C#).
• **Visão Sênior:** O polimorfismo é o que torna o sistema **extensível**. Você pode adicionar um novo método de pagamento (ex: Pix) sem alterar uma única linha do código que processa as vendas.
