import { INPUT } from './input.ts';

const TEST1 = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;

function doPart(input: string): string | number {
    const tot: number = input.split('\n\n')
        .map(elf => elf.split('\n')
            .map(cal => Number.parseInt(cal))
            .reduce((p, v) => p + v, 0))
        .reduce((p, v) => Math.max(p, v), 0);

    return tot;
}

function go(input: string, expected?: number | string): void {
    const result: number | string = doPart(input);
    console.log(`--> ${result} <--`);
    console.assert(!expected || result === expected, 'got: %s, expected: %s', result, expected);
}

void (() => {
    go(TEST1, 24000);
    go(INPUT);
})();
