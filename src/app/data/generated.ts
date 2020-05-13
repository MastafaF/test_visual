import * as _ from 'lodash';

const e = _.groupBy([{ a: 3 }, { a: 4 }, { a: 3 }], 'a');
// return: {
//     '3': [
//         { a: 3 },
//         { a: 3 }
//     ],
//     '4': [
//         { a: 4 }
//     ]
// }

export const GENERATED_DATA = {};
