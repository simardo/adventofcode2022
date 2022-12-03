import { INPUT } from './input.ts';

const TEST1 = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

function doPart(input: string): string | number {
    const lines: string[] = input.split('\n').map(s => s);

    return lines.reduce((p, v) => {
        const high: string[] = [...v];
        const low: string[] = high.splice(0, high.length / 2);
        const highSet: Set<string> = new Set<string>(high);

        const dup: string = low.find(l => highSet.has(l))!;

        return p += dup.charCodeAt(0) - (dup === dup.toLowerCase() ? 96 : 38);
    }, 0)
}

function go(input: string, expected?: number | string): void {
    const result: number | string = doPart(input);
    console.log(`--> ${result} <--`);
    console.assert(!expected || result === expected, 'got: %s, expected: %s', result, expected);
}

void (() => {
    go(TEST1, 157);
    go(INPUT);
})();
