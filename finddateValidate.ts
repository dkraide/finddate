import { extractDateRange } from "./finddate";

// Função para verificar o resultado da extração de intervalo de datas
export function checkDateRangeExtraction(phrase: string): any {
    const { startDate, endDate, error } = extractDateRange(phrase);

    if (error) {
        return `Não foi possível identificar um intervalo de datas válido na frase fornecida. Por favor, informe uma data ou um intervalo de datas compatível com a função. Exemplos válidos incluem: "Relatório de vendas de 01/01/2024 até 01/02/2024", "Relatório de vendas de 01/01/24 até 01/02/24", "Relatório de vendas de 11/1/24", "Relatório de vendas de 01/01 até 01/03", "Relatório de vendas de 1/1 até 1/3".`;
    }

    return {startDate, endDate};
}