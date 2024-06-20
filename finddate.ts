export function extractDateRange(phrase: string): { startDate: Date | null, endDate: Date | null, error?: string } {
    const now = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    // Remover caracteres especiais e normalizar a frase
    phrase = removeSpecialCharacters(phrase.toLowerCase());
    phrase = convertNumbersInWordsToNumerals(phrase);

    // Expressões regulares para capturar padrões de datas
    const daysOfWeek: { [key: string]: number } = {
        "domingo": 0, "segunda": 1, "terca": 2, "quarta": 3, "quinta": 4,
        "sexta": 5, "sabado": 6
    };

    const months: { [key: string]: number } = {
        "janeiro": 0, "fevereiro": 1, "marco": 2, "abril": 3, "maio": 4,
        "junho": 5, "julho": 6, "agosto": 7, "setembro": 8, "outubro": 9,
        "novembro": 10, "dezembro": 11
    };

    const lastYearMatch = /ultimo ano/i;
    const tillNowMatch = /ate agora/i;
    const specificMonthsMatch = /de\s+([a-z]+)(?:\s+(?:ate|a)\s+([a-z]+))?(?:\s+de\s+(\d{4}))?/i;
    const betweenMonthsMatch = /(?:entre|de)\s+([a-z]+)\s+(?:e|a)\s+([a-z]+)(?:\s+de\s+(\d{4}))?/i;
    const lastWeekMatch = /ultima\s+semana/i;
    const lastWeeksMatch = /ultimas?\s+(\d+)\s+semanas?/i;
    const lastMonthMatch = /ultimo\s+mes/i;
    const lastMonthsMatch = /ultimos?\s+(\d+)\s+meses?/i;
    const lastMonthsOfMatch = /dos?\s+ultimos?\s+(\d+)\s+meses?/i;
    const lastDaysMatch = /ultimos?\s+(\d+)\s+dias?/i;
    const yesterdayMatch = /\bontem\b/i;
    const dayBeforeYesterdayMatch = /anteontem/i;
    const todayMatch = /\b(hoje|agora)\b/i;
    const specificDayMatch = /(?:segunda(?:-feira)?|terca(?:-feira)?|quarta(?:-feira)?|quinta(?:-feira)?|sexta(?:-feira)?|sabado(?:-feira)?|domingo)(?:-feira)?/i;

    // Expressão regular para intervalo de datas DD/MM/YYYY até DD/MM/YYYY
    const dateRangeMatchLong = /(?:de\s+)?(\d{1,2})\/(\d{1,2})(?:\/(\d{2}|\d{4}))?\s+ate\s+(\d{1,2})\/(\d{1,2})(?:\/(\d{2}|\d{4}))?/i;

    // Expressão regular para intervalo de datas DD/MM/YY até DD/MM/YY
    const dateRangeMatchShort = /(?:de\s+)?(\d{1,2})\/(\d{1,2})(?:\/(\d{2}))?\s+ate\s+(\d{1,2})\/(\d{1,2})(?:\/(\d{2}))?/i;

    // Expressão regular para data DD/MM/YY ou DD/MM/YYYY
    const singleDateMatch = /(?:de\s+)?(\d{1,2})\/(\d{1,2})(?:\/(\d{2}|\d{4}))?/i;

    // Verificar se a frase contém um intervalo de datas específico
    const dateRangeLongMatch = phrase.match(dateRangeMatchLong);
    const dateRangeShortMatch = phrase.match(dateRangeMatchShort);
    const singleDateMatchResult = phrase.match(singleDateMatch);

    // Função para converter string de data DD/MM/YYYY ou DD/MM/YY para objeto Date
    const parseDate = (day: string, month: string, year?: string) => {
        if (!year) {
            year = now.getFullYear().toString();
        } else if (year.length === 2) {
            year = "20" + year; // Assume que anos de 2 dígitos são de 2000 a 2099
        }
        const parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return parsedDate;
    };

    // Extrair datas para intervalo longo DD/MM/YYYY até DD/MM/YYYY
    if (dateRangeLongMatch) {
        const startDay = dateRangeLongMatch[1];
        const startMonth = dateRangeLongMatch[2];
        const startYear = dateRangeLongMatch[3];
        startDate = parseDate(startDay, startMonth, startYear);

        const endDay = dateRangeLongMatch[4];
        const endMonth = dateRangeLongMatch[5];
        const endYear = dateRangeLongMatch[6];
        endDate = parseDate(endDay, endMonth, endYear);

        return { startDate, endDate };
    }

    // Extrair datas para intervalo curto DD/MM/YY até DD/MM/YY
    if (dateRangeShortMatch) {
        const startDay = dateRangeShortMatch[1];
        const startMonth = dateRangeShortMatch[2];
        const startYear = dateRangeShortMatch[3];
        startDate = parseDate(startDay, startMonth, startYear);

        const endDay = dateRangeShortMatch[4];
        const endMonth = dateRangeShortMatch[5];
        const endYear = dateRangeShortMatch[6];
        endDate = parseDate(endDay, endMonth, endYear);

        return { startDate, endDate };
    }

    // Extrair data única DD/MM/YY ou DD/MM/YYYY
    if (singleDateMatchResult) {
        const day = singleDateMatchResult[1];
        const month = singleDateMatchResult[2];
        const year = singleDateMatchResult[3];
        startDate = parseDate(day, month, year);
        endDate = startDate; // Define a data final como a mesma data de início

        return { startDate, endDate };
    }

    // Verificação para "dos ultimos X meses"
    const lastMonthsOfMatches = phrase.match(lastMonthsOfMatch);
    if (lastMonthsOfMatches) {
        const numberOfMonths = parseInt(lastMonthsOfMatches[1]);
        startDate = new Date(now.getFullYear(), now.getMonth() - numberOfMonths, 1);
        endDate = now; // Define a data final como hoje
        return { startDate, endDate };
    }

    // Verificação para "última semana"
    if (lastWeekMatch.test(phrase)) {
        const endDateOfWeek = new Date(now);
        const startDateOfWeek = new Date(now);

        startDateOfWeek.setDate(endDateOfWeek.getDate() - 6); // Define o início da semana

        startDate = startDateOfWeek;
        endDate = endDateOfWeek;

        return { startDate, endDate };
    }

    // Verificação para "último mês"
    if (lastMonthMatch.test(phrase)) {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        return { startDate, endDate };
    }

    // Verificação para "últimos meses"
    const lastMonthsMatches = phrase.match(lastMonthsMatch);
    if (lastMonthsMatches) {
        const numberOfMonths = parseInt(lastMonthsMatches[1]);
        startDate = new Date(now.getFullYear(), now.getMonth() - numberOfMonths, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        return { startDate, endDate };
    }

    // Verificação para "último ano"
    if (lastYearMatch.test(phrase)) {
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        endDate = new Date(now.getFullYear() - 1, 11, 31);
        return { startDate, endDate };
    }

    // Verificação para "até agora"
    if (tillNowMatch.test(phrase)) {
        endDate = now; // Define a data final como hoje

        // Verificar se há um mês específico na frase
        const monthMatch = phrase.match(/de\s+([a-z]+)/i);
        if (monthMatch && monthMatch[1] in months) {
            startDate = new Date(now.getFullYear(), months[monthMatch[1]], 1);
            return { startDate, endDate };
        }
    }

    // Verificação para meses específicos
    const specificMonthMatches = phrase.match(specificMonthsMatch);
    const today = phrase.match(todayMatch);
    if (specificMonthMatches && !today) {
        const startMonth = specificMonthMatches[1];
        if (startMonth in months) {
            startDate = new Date(now.getFullYear(), months[startMonth], 1);

            if (specificMonthMatches[2]) {
                const endMonth = specificMonthMatches[2];
                if (endMonth in months) {
                    endDate = new Date(now.getFullYear(), months[endMonth] + 1, 0);
                }
            } else {
                endDate = new Date(now.getFullYear(), months[startMonth] + 1, 0);
            }

            if (specificMonthMatches[3]) {
                const year = parseInt(specificMonthMatches[3]);
                startDate.setFullYear(year);
                endDate.setFullYear(year);
            }
            return { startDate, endDate };
        }
    }

    // Verificação para intervalo de meses
    const betweenMonthMatches = phrase.match(betweenMonthsMatch);
    if (betweenMonthMatches) {
        const startMonth = betweenMonthMatches[1];
        if (startMonth in months) {
            startDate = new Date(now.getFullYear(), months[startMonth], 1);
            const endMonth = betweenMonthMatches[2];
            const today = phrase.match(endMonth);
            if (endMonth in months) {
                endDate = new Date(now.getFullYear(), months[endMonth] + 1, 0);
            } else if (today) {
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            }
            if (betweenMonthMatches[3]) {
                const year = parseInt(betweenMonthMatches[3]);
                startDate.setFullYear(year);
                endDate.setFullYear(year);
            }
            return { startDate, endDate };
        }
    }

    // Verificação para "últimos X dias"
    const lastDaysMatches = phrase.match(lastDaysMatch);
    if (lastDaysMatches) {
        const numberOfDays = parseInt(lastDaysMatches[1]);
        endDate = new Date(now);
        startDate = new Date(now);
        startDate.setDate(endDate.getDate() - numberOfDays + 1); // Define o início dos dias atrás

        return { startDate, endDate };
    }

    // Verificação para "ontem"
    if (yesterdayMatch.test(phrase)) {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 1);
        endDate = startDate;
        return { startDate, endDate };
    }

    // Verificação para "anteontem"
    if (dayBeforeYesterdayMatch.test(phrase)) {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 2);
        endDate = startDate;
        return { startDate, endDate };
    }

    // Verificação para "hoje"
    if (todayMatch.test(phrase)) {
        startDate = now;
        endDate = now;
        return { startDate, endDate };
    }

    // Verificação para dias da semana específicos
    const specificDayMatches = phrase.match(specificDayMatch);
    if (specificDayMatches) {
        const dayOfWeek = specificDayMatches[0].replace(/-feira/i, '');
        if (dayOfWeek in daysOfWeek) {
            let diff = now.getDay() - daysOfWeek[dayOfWeek];
            if (diff < 0) {
                diff += 7; // Se a diferença for negativa, ajusta para a semana anterior
            }
            startDate = new Date(now);
            startDate.setDate(now.getDate() - diff);
            endDate = new Date(startDate);
            return { startDate, endDate };
        }
    }

    // Se não corresponder a nenhum padrão conhecido, retorna null com uma mensagem de erro
    return { startDate: null, endDate: null, error: "Não foi possível identificar um intervalo de datas válido na frase fornecida." };
}

// Função para remover caracteres especiais da string
function removeSpecialCharacters(text: string): string {
    return text.replace(/[^\w\s-\/]/gi, ''); // Adicionado '/' para permitir datas no formato DD/MM/YYYY ou DD/MM/YY
}

// Função para converter números por extenso para numerais
function convertNumbersInWordsToNumerals(text: string): string {
    const numberMap: { [key: string]: string } = {
        "um": "1", "dois": "2", "tres": "3", "quatro": "4", "cinco": "5",
        "seis": "6", "sete": "7", "oito": "8", "nove": "9", "dez": "10"
        // Adicionar outros números por extenso conforme necessário
    };
    return text.replace(/\b(\w+)\b/g, match => numberMap[match] || match);
}

// Exemplos de uso
console.log(extractDateRange("Relatorio de vendas de 01/01/2024 ate 01/02/2024"));
console.log(extractDateRange("Relatorio de vendas de 01/01/24 ate 01/02/24"));
console.log(extractDateRange("Relatorio de vendas de 11/1/24"));
console.log(extractDateRange("Relatorio de vendas de 01/01 ate 01/03"));
console.log(extractDateRange("Relatorio de vendas de 1/1 ate 1/3"));
console.log(extractDateRange("Relatorio de vendas de 01/01 ate 01/03"));
