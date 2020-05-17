import * as _ from 'lodash';


// @TODO: build array STOP_WORDS from a txt file that 
// you can find online like from gensim library
const STOP_WORDS = ['les', 'pour', 'une', 'des', 'dans', 'sur', 'plus', 'que', 'fois', 'mais', 'par', 'aux', 'avec', 'son', 'est', 'pas', 'ses', 'qui', 'ont', 'pas', 'leur'];


// issue when PERIOD = 'year' 
// @TODO: solve it 
// In the future, the user specify the period PERIOD
// var PERIOD = 'year';
var oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds
const PERIOD_DURATION = {
day: oneDay, 
week: 7*oneDay, 
month: 30*oneDay,
year: 365*oneDay                  
}


const getDate = (str: string): Date => {
    const split = str.slice(1, -1).split(', ');
    const date = new Date();
    date.setTime(0);
    date.setFullYear(_.toNumber(split[2]), _.toNumber(split[0]), _.toNumber(split[1]));

    return date;
};


// From https://stackoverflow.com/questions/20630676/how-to-group-objects-with-timestamps-properties-by-day-week-month/38896252
// Group by time period - By 'day' | 'week' | 'month' | 'year'
// ------------------------------------------------------------
var groupByTimePeriod = function (obj, timestamp, period) {
  var objPeriod = {};
  var oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
  for (var i = 0; i < obj.length; i++) {
    var d = new Date(obj[i][timestamp] * 1000);
    if (period == 'day') {
      d = Math.floor(d.getTime() / oneDay);
    } else if (period == 'week') {
      d = Math.floor(d.getTime() / (oneDay * 7));
    } else if (period == 'month') {
      d = (d.getFullYear() - 1970) * 12 + d.getMonth();
    } else if (period == 'year') {
      d = d.getFullYear();
    } else {
      console.log('groupByTimePeriod: You have to set a period! day | week | month | year');
    }
    // define object key
    objPeriod[d] = objPeriod[d] || [];
    objPeriod[d].push(obj[i]);
  }
  return objPeriod;
};


export const generator = (tsv: string, period: string) => {

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
        return Math.floor(e.date.getTime() / PERIOD_DURATION[period]);
      //  if (PERIOD == "year"){
      //    var d = e.date.getFullYear();
      //   return d;
      //   }
      //   if (PERIOD == "month"){
      //    var d = (e.date.getFullYear() - 1970) * 12 + e.date.getMonth();
      //   return d;
      //   }
      //   var oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
      //   if (PERIOD == "week"){
      //     var period = 7*oneDay;
      //     return Math.floor(e.date.getTime() / period);
      //   }
      //   if (PERIOD == "day"){
      //     var period = oneDay; 
      //     return Math.floor(e.date.getTime() / period);
      //   }
      //   else {
      //     console.log('groupByTimePeriod: You have to set a period! day | week | month | year');
      //   }
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
