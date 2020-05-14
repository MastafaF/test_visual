import { SingleBarConf } from '../models/single-bar.model';

export const DEFAULT_DATA: { [key: string]: SingleBarConf[] } = {
    Rihanna: [
        {
            label: 'Rihanna',
            number: 5987346,
            color: '#00FFFF',
            ranking: 3, // position in the ranking
            purcents: 18 // relative to best which is 100%
        }
    ],
    Coldplay: [
        {
            label: 'Coldplay',
            number: 3567346,
            color: '#8A2BE2',
            ranking: 2,
            purcents: 33
        }
    ],
    'Post Malone': [
        {
            label: 'Post Malone',
            number: 1567346,
            color: '#DEB887',
            ranking: 1,
            purcents: 70
        }
    ],
    Vegedream: [
        {
            label: 'Vegedream',
            number: 567346,
            color: '#00008B',
            ranking: 4,
            purcents: 5
        }
    ],
    'Mister You': [
        {
            label: 'Mister You',
            number: 463432,
            color: '#DC143C',
            ranking: 0,
            purcents: 100
        }
    ]
};
