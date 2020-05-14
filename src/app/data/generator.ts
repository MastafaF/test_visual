import * as _ from 'lodash';

const STOP_WORDS = ['les', 'pour', 'une', 'des', 'dans', 'sur', 'plus', 'que', 'fois', 'mais', 'par', 'aux', 'avec', 'son', 'est', 'pas', 'ses', 'qui', 'ont', 'pas', 'leur'];

const getDate = (str: string): Date => {
    const split = str.slice(1, -1).split(', ');

    const date = new Date();
    date.setTime(0);
    date.setFullYear(_.toNumber(split[2]), _.toNumber(split[0]), _.toNumber(split[1]));

    return date;
};

export const generator = (tsv: string) => {

    const rows: any[] = tsv
        .split('\n')
        .slice(1, -1)
        .map(line => {
            const values = line.split('\t');
            return {
                date: getDate(values[1]),
                sentence: values[2]
            };
        });

    const groupedRows = _.groupBy(rows, e => {
        const week = 1000 * 60 * 60 * 24 * 7;
        return Math.floor(e.date.getTime() / week);
    });

    const dictionnary = {};

    Object.entries(groupedRows).forEach(([key, group]: [string, any[]]) => {

        const joined = group.map(line => line.sentence).join(' ');

        const words = joined
            .replace(/,/g, '')
            .replace(/"/g, '')
            .replace(/'/g, ' ')
            .replace(/:/g, '')
            .replace(/\(/g, '')
            .replace(/\)/g, '')
            .split(' ')
            .filter(e => !!e && e.length > 2 && !STOP_WORDS.includes(e));

        const rawWordCountMap = _.countBy(words, (e: string) => e.toLowerCase());
        const wordCount = [];

        Object.entries(rawWordCountMap).map(([word, count]: [string, number]) => {
            if (count === 1) { return; }

            wordCount.push({ word, count });
        });

        const sortedWordCount = _.orderBy(wordCount, 'count', 'desc');

        const topWordCount = sortedWordCount.slice(0, 30);
        const topCount = topWordCount[0] ? topWordCount[0].count : 1;

        const topWordCountMap = { __max: topCount };
        topWordCount.forEach(e => {
            dictionnary[e.word] = { label: e.word, timeserie: [] };
            topWordCountMap[e.word] = e.count;
        });

        groupedRows[key] = topWordCountMap;

    });

    const dates = Object.keys(groupedRows);
    const allWords = Object.keys(dictionnary);

    for (const date of dates) {

        const topCount = groupedRows[date].__max;
        const unrankedWords = [];

        for (const word of allWords) {
            const count = groupedRows[date][word] || 0;
            const purcents = 100 * (count / topCount);

            unrankedWords.push({ label: word, number: count, purcents });
        }

        const rankedWords = _.orderBy(unrankedWords, 'number', 'desc');

        rankedWords.forEach((word: any, ranking: number) => {
            dictionnary[word.label].timeserie.push({
                number: word.number,
                purcents: word.purcents,
                ranking
            });
        });
    }

    return dictionnary;

};
