import { INPUT } from './input.ts';

const TEST1 = `A Y
B X
C Z`;

type Dict<T> = { [key: string]: T };

const eq: Dict<string> = {
    'A': 'X',
    'B': 'Y',
    'C': 'Z'
};

const win: Dict<string> = {
    'A': 'Y',
    'B': 'Z',
    'C': 'X'
};

const score: Dict<number> = {
    'X': 1,
    'Y': 2,
    'Z': 3
};

function doPart(input: string): string | number {
    return input.split('\n').reduce((p, v) => {
        const [opp, me] = v.split(' ');

        return p + score[me] + (eq[opp] === me ? 3 : win[opp] === me ? 6 : 0);
    }, 0);
}

function go(input: string, expected?: number | string): void {
    const result: number | string = doPart(input);
    console.log(`--> ${result} <--`);
    console.assert(!expected || result === expected, 'got: %s, expected: %s', result, expected);
}

void (() => {
    go(TEST1, 15);
    go(INPUT);
})();
