# SOLID

O acrônimo **SOLID** representa cinco princípios da programação orientada a objetos que ajudam a criar sistemas mais fáceis de manter, entender e estender. Eles foram popularizados por Robert C. Martin (Uncle Bob) e são fundamentais para uma boa arquitetura de software.

Vantagens:

- Manutencao Facilitada
- Testabilidade
- Reutilizacao
- Legibilidade e Compreensao

# S - SINGLE RESPONSABILITY

Principio da responsabilidade única, a classe ela deve ter apenas uma responsabilidade. Se uma classe tem muitas responsabilidades, aumenta a complexidade e a dificuldade de manter ou alterar o codigo. Já que a mudança de uma responsabilidade na classe pode ocasionar erros/alteracoes em outra.

# O - OPEN CLOSED

“Classes devem ser abertas a extensao mas fechadas para modificacao.”

Se voce quer que uma classe execute mais funcionalidades, o ideal é **estender o comportamento sem tocar no código que já existe e já foi testado**. Na prática: em vez de abrir a classe e acrescentar mais um `if`/`switch` a cada caso novo, você cria uma **nova implementação de uma abstração** (interface ou classe abstrata) e o código antigo continua intacto.

O sinal de violação é exatamente esse: toda vez que chega um requisito novo, alguém precisa editar a mesma classe. Se a única forma de estender é modificando o que já está pronto, o princípio foi quebrado. 

 

# L - LISKOV SUBSTITUTION

Se S for um subtipo de T, então objetos do tipo T em um programa podem ser substituídos por objetos do tipo S sem alterar nenhuma das propriedades desejáveis desse programa. Quando uma classe **filha** não consegue executar as mesmas ações que sua classe **pai** , isso pode causar erros.

Se você tem uma classe `Pai` e uma classe `Filho`, você deve poder usar `Filho` em qualquer lugar onde se espera um `Pai` sem que o programa quebre. Se a subclasse altera o comportamento esperado da base (ex: uma classe `Pássaro` que tem o método `voar()`, mas a subclasse `Pinguim` lança uma exceção nesse método), o princípio foi violado.
****

# I - INTERFACE SEGREGATION

Os clientes nao devem ser forcados a depender de metodos que nao utilizam.

Quando uma classe é obrigada a executar ações que não são úteis, isso é um desperdício e pode gerar erros inesperados caso a classe não tenha a capacidade de executar essas ações.

Uma classe deve executar apenas as ações necessárias para cumprir sua função. Qualquer outra ação deve ser completamente removida ou movida para outro local, caso possa ser utilizada por outra classe no futuro.

# D - DEPENDENCY INVERSION

**Módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender da abstração. Abstracoes nao devem depender de detalhes e sim detalhes que dependem de abstracoes**
