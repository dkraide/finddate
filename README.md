# Funções para Extração e Verificação de Intervalo de Datas

Este repositório contém duas funções em TypeScript para extrair e verificar intervalos de datas a partir de frases informadas pelo usuário.

## Função extractDateRange

A função `extractDateRange` recebe uma frase como entrada e tenta identificar um intervalo de datas dentro dessa frase. Ela reconhece uma variedade de padrões, incluindo datas específicas, dias da semana, meses, e expressões como "hoje", "ontem", "última semana", entre outros. Caso identifique um intervalo válido, retorna as datas de início e fim. Caso contrário, retorna um erro indicando que não conseguiu identificar um intervalo válido.

### Exemplos de Uso:

```typescript
console.log(extractDateRange("Relatório de vendas dos últimos 3 dias")); // { startDate: 2024-06-07, endDate: 2024-06-10 }
console.log(extractDateRange("Relatório de vendas de ontem")); // { startDate: 2024-06-09, endDate: 2024-06-09 }
console.log(extractDateRange("Relatório de vendas de hoje")); // { startDate: 2024-06-10, endDate: 2024-06-10 }
