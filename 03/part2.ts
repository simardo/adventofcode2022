import { INPUT } from './input.ts';

const TEST1 = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

function doPart(input: string): string | number {
    const lines: string[] = input.split('\n');

    let sum = 0;
    while (lines.length > 0) {
        const group: string[] = lines.splice(0, 3);
        const sack1: Set<string> = new Set<string>([...group[0]]);
        const sack2: Set<string> = new Set<string>([...group[1]].filter(p => sack1.has(p)));

        const dup = [...group[2]].find(l => sack2.has(l))!;

        sum += dup.charCodeAt(0) - (dup === dup.toLowerCase() ? 96 : 38);
    }

    return sum;
}

function go(input: string, expected?: number | string): void {
    const result: number | string = doPart(input);
    console.log(`--> ${result} <--`);
    console.assert(!expected || result === expected, 'got: %s, expected: %s', result, expected);
}

void (() => {
    go(TEST1, 70);
    go(INPUT);
})();
