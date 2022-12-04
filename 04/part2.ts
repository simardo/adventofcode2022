import { INPUT } from './input.ts';

const TEST1 = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

function doPart(input: string): string | number {
    const lines: string[] = input.split('\n').map(s => s);

    return lines.reduce((p, v) => {
        const [pair1, pair2] = v.split(',');
        const [low1, high1] = pair1.split('-').map(n => Number.parseInt(n));
        const [low2, high2] = pair2.split('-').map(n => Number.parseInt(n));

        return (
            (low2 >= low1 && high2 <= high1)
            || (high2 <= high1 && high2 >= low1)
            || (low1 >= low2 && high1 <= high2)
            || (high1 <= high2 && high1 >= low2)
        ) ? p+1 : p;
    }, 0);
}

function go(input: string, expected?: number | string): void {
    const result: number | string = doPart(input);
    console.log(`--> ${result} <--`);
    console.assert(!expected || result === expected, 'got: %s, expected: %s', result, expected);
}

void (() => {
    go(TEST1, 4);
    go(INPUT);
})();
