# ACID

Define as 4 propriedades fundamentais em um sistema de banco de dados. Usado para banco de dados Relacionais 

- A (Atomicidade) → Funciona como a regra do "tudo ou nada". Se uma transação envolver múltiplas operações, ou todas elas são executadas com sucesso, ou, caso ocorra qualquer falha, nenhuma delas é aplicada e o banco de dados é revertido ao estado anterior.
- C (Consistencia) → Garante que qualquer transação levará o banco de dados de um estado válido (obedecendo a todas as regras, restrições e chaves) para outro estado igualmente válido, evitando dados corrompidos ou fora de padrão.
- I (Isolamento) →  Determina que transações simultâneas sejam processadas de forma independente umas das outras. Isso impede que uma transação veja dados intermediários ou incompletos de outra transação que ainda está em andamento.
- D (Durabilidade) → Assegura que, uma vez que uma transação seja confirmada (ou *commit*), os dados serão armazenados de forma permanente, mesmo que ocorra uma queda de energia, falha no sistema ou erro grave.

Outro conceito bastante utilizado é o de BASE; 

O conceito **BASE** **é o oposto do modelo ACID, projetado para lidar com o enorme volume de dados e a necessidade de alta disponibilidade dos sistemas modernos na web** 

**BA - Basicamente Disponível (Basically Available):** O sistema prioriza estar sempre online e respondendo às requisições dos usuários, mesmo que ocorra uma falha parcial em algum servidor ou perda de dados temporária.

**S - Estado Fluido (Soft State):** Os dados não precisam ser estáticos ou ultra-consistentes o tempo todo. O estado dos dados pode mudar sozinho ao longo do tempo à medida que as atualizações se propagam pela rede. [[1](https://fidelissauro.dev/teorema-cap/), [2](https://www.reddit.com/r/devops/comments/1kpyate/eli5_what_exactly_are_acid_and_base_transactions/?tl=pt-br)]

**E - Consistência Eventual (Eventual Consistency):** O sistema garante que, se nenhuma nova atualização for feita, todos os servidores eventualmente alcançarão o mesmo estado e exibirão o mesmo dado idêntico para todos. [[1](https://www.marcosmota.com/entendendo-a-consistencia-em-sistemas-distribuidos/)]
