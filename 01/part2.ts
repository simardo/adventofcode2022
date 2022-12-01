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
    const elfs: number[] = input.split('\n\n')
        .map(elf => elf.split('\n')
            .map(cal => Number.parseInt(cal))
            .reduce((p, v) => p + v, 0))
        .sort((a, b) => a - b);

    return elfs.slice(-3).reduce((p, v) => p + v, 0);
}

function go(input: string, expected?: number | string): void {
    const result: number | string = doPart(input);
    console.log(`--> ${result} <--`);
    console.assert(!expected || result === expected, 'got: %s, expected: %s', result, expected);
}

void (() => {
    go(TEST1, 45000);
    go(INPUT);
})();
