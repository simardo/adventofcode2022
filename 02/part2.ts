import { INPUT } from './input.ts';

const TEST1 = `A Y
B X
C Z`;

type Dict<T> = { [key: string]: T };

const win: Dict<string> = {
    'A': 'Y',
    'B': 'Z',
    'C': 'X'
};

const draw: Dict<string> = {
    'A': 'X',
    'B': 'Y',
    'C': 'Z'
};

const lose: Dict<string> = {
    'A': 'Z',
    'B': 'X',
    'C': 'Y'
};

const score: Dict<number> = {
    'X': 1,
    'Y': 2,
    'Z': 3
};

function doPart(input: string): string | number {
    return input.split('\n').reduce((p, v) => {
        const [opp, exp] = v.split(' ');

        if (exp === 'Z') {
            p += score[win[opp]] + 6;
        } else if (exp === 'Y') {
            p += score[draw[opp]] + 3;
        } else {
            p += score[lose[opp]];
        }

        return p;
    }, 0);
}

function go(input: string, expected?: number | string): void {
    const result: number | string = doPart(input);
    console.log(`--> ${result} <--`);
    console.assert(!expected || result === expected, 'got: %s, expected: %s', result, expected);
}

void (() => {
    go(TEST1, 12);
    go(INPUT);
})();
