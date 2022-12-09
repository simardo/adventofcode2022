import { INPUT } from './input.ts';

const TEST1 = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

function doPart(input: string): string | number {
    const lines: string[] = input.split('\n');

    const stacks: string[][] = [];

    const RE_STACK = /\[(\w)\]/g;

    lines.forEach(l => {
        let match: RegExpMatchArray | null;
        while ((match = RE_STACK.exec(l)) !== null) {
            const [_, id] = match;
            const stackIndex = match.index! / 4;
            
            while (stacks.length <= stackIndex) {
                stacks.push([]);
            }

            const stack: string[] = stacks[stackIndex];
            stack.splice(0, 0, id);
        }
    })

    const RE_INSTR = /move (\d+) from (\d+) to (\d+)/g;

    lines.forEach(l => {
        let match: RegExpMatchArray | null;
        while ((match = RE_INSTR.exec(l)) !== null) {
            const [_, qtyS, fromS, toS] = match;
            const qty = Number.parseInt(qtyS);
            const from = Number.parseInt(fromS) - 1;
            const to = Number.parseInt(toS) - 1;
            
            const stackFrom: string[] = stacks[from];
            const stackTo: string[] = stacks[to];

            const onCrane: string[] = stackFrom.splice(-qty, qty);
            stackTo.push(...onCrane);
        }
    })

    return stacks.map(s => s.pop()).join('');
}

function go(input: string, expected?: number | string): void {
    const result: number | string = doPart(input);
    console.log(`--> ${result} <--`);
    console.assert(!expected || result === expected, 'got: %s, expected: %s', result, expected);
}

void (() => {
    go(TEST1, 'MCD');
    go(INPUT);
})();
