// import { INPUT } from './input.ts';

const TEST1 = ``;

// type Dict<T> = { [key: string]: T };

function doPart(input: string): string | number {
    const lines: string[] = input.split('\n').map(s => s);
    const nums: number[] = input.split('\n').map(s => Number.parseInt(s));
    const map: number[][] = input.split('\n').map(s => [...s].map(n => Number.parseInt(n)));

    console.log(map.map(m => m.join('')).join('\n'));

    return 0;
}

function go(input: string, expected?: number | string): void {
    const result: number | string = doPart(input);
    console.log(`--> ${result} <--`);
    console.assert(!expected || result === expected, 'got: %s, expected: %s', result, expected);
}

void (() => {
    go(TEST1, 0);
    // go(INPUT);
})();

/*
const RE: RegExp = /(\d+)\s<->\s(.+)/g;

let match: RegExpMatchArray | null;
while ((match = RE.exec(input)) !== null) {
    const [, id, ids] = match;
}
*/

// const render: () => void = () => {
//     console.log(map.map(line => line.map(cell => cell.actual === 1 ? '>' : cell.actual === 2 ? 'v' : '.').join('')).join('\n'));
// };
