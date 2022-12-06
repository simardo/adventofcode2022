import { INPUT } from './input.ts';

const TEST1 = `mjqjpqmgbljsphdztnvjfqwrcgsmlb`;
const TEST2 = `bvwbjplbgvbhsrlpgdmjqwftvncz`;
const TEST3 = `nppdvjthqldpwncqszvftbrmjlhg`;
const TEST4 = `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`;
const TEST5 = `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`;

function doPart(input: string): string | number {
    let result = -1;
    const LENGTH = 4;
    for (let i = 0; result === -1 && i <= input.length - LENGTH; i++) {
        const s: string = input.substring(i, i + LENGTH);
        const set: Set<string> = new Set<string>([...s]);    
       
        if (set.size === LENGTH) {
            result = i + LENGTH;
        }
    }

    return result;
}

function go(input: string, expected?: number | string): void {
    console.time();
    const result: number | string = doPart(input);
    console.timeEnd();
    console.log(`--> ${result} <--`);
    console.assert(!expected || result === expected, 'got: %s, expected: %s', result, expected);
}

void (() => {
    go(TEST1, 7);
    go(TEST2, 5);
    go(TEST3, 6);
    go(TEST4, 10);
    go(TEST5, 11);
    go(INPUT);
})();
