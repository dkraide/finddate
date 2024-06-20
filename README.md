# Funções para Extração e Verificação de Intervalo de Datas

Este repositório contém duas funções em TypeScript para extrair e verificar intervalos de datas a partir de frases informadas pelo usuário.

## Função extractDateRange

A função `extractDateRange` recebe uma frase como entrada e tenta identificar um intervalo de datas dentro dessa frase. Ela reconhece uma variedade de padrões, incluindo datas específicas, dias da semana, meses, e expressões como "hoje", "ontem", "última semana", entre outros. Caso identifique um intervalo válido, retorna as datas de início e fim. Caso contrário, retorna um erro indicando que não conseguiu identificar um intervalo válido.

### Exemplos de Uso:

```typescript
console.log(extractDateRange("Relatório de vendas dos últimos 3 dias")); // { startDate: 2024-06-07, endDate: 2024-06-10 }
console.log(extractDateRange("Relatório de vendas de ontem")); // { startDate: 2024-06-09, endDate: 2024-06-09 }
console.log(extractDateRange("Relatório de vendas de hoje")); // { startDate: 2024-06-10, endDate: 2024-06-10 }


## Função checkDateRangeExtraction

A função checkDateRangeExtraction é um utilitário simples que utiliza a função extractDateRange para verificar se um intervalo de datas foi corretamente extraído ou se ocorreu algum erro. Se ocorrer um erro na extração, esta função retorna uma mensagem orientando o usuário sobre como informar corretamente um intervalo de datas aceitável.

### Exemplo de Uso:

```typescript
console.log(checkDateRangeExtraction("Relatório de vendas de 01/01/2024 até 01/02/2024"));
// Retorna: "Intervalo de datas identificado: 01/01/2024 até 01/02/2024"

console.log(checkDateRangeExtraction("Relatório de vendas de hoje"));
// Retorna: "Intervalo de datas identificado: 10/06/2024 até 10/06/2024"

console.log(checkDateRangeExtraction("Relatório de vendas de última semana"));
// Retorna: "Intervalo de datas identificado: 03/06/2024 até 10/06/2024"

console.log(checkDateRangeExtraction("Relatório de vendas de 11/1/24"));
// Retorna: "Intervalo de datas identificado: 11/01/2024 até 11/01/2024"

console.log(checkDateRangeExtraction("Relatório de vendas de 01/01 até 01/03"));
// Retorna: "Intervalo de datas identificado: 01/01/2024 até 01/03/2024"

console.log(checkDateRangeExtraction("Relatório de vendas de 1/1 até 1/3"));
// Retorna: "Intervalo de datas identificado: 01/01/2024 até 01/03/2024"


# Como Contribuir

Sinta-se à vontade para contribuir com melhorias ou adicionar novos padrões de reconhecimento de datas às funções. Para isso, você pode seguir os passos abaixo:

Faça um fork deste repositório.
Crie uma nova branch (git checkout -b feature/nova-feature).
Faça commit de suas alterações (git commit -am 'Adicionando nova funcionalidade').
Faça push para a branch (git push origin feature/nova-feature).
Crie um novo Pull Request.
Espero que essas funções sejam úteis para suas necessidades de reconhecimento e verificação de intervalos de datas em textos!