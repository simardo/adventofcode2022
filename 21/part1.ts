import { INPUT } from './input.ts';

const TEST1 = `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`;

type Dict<T> = { [key: string]: T };

function yell(monkeys: Dict<number | string[]>, name: string): number {
    const m = monkeys[name];
    let result: number;
    if (typeof m === 'number') {
        result = m;
    } else {
        const [first, oper, second] = m;
        const f = yell(monkeys, first);
        const s = yell(monkeys, second);
        if (oper === '+') {
            result = f + s;
        } else if (oper === '-') {
            result = f - s;
        } else if (oper === '*') {
            result = f * s;
        } else {
            result = f / s;
        }
    }
    return result;
}

function doPart(input: string): string | number {
    const monkeys: Dict<number | string[]> = {};

    input.split('\n').forEach(s => {
        const [name, oper] = s.split(':');
        let yell: number | string[] = Number.parseInt(oper.trim());
        if (Number.isNaN(yell)) {
            yell = oper.trim().split(' ');
        }
        monkeys[name] = yell;
    });

    return yell(monkeys, 'root');
}

function go(input: string, expected?: number | string): void {
    // console.time();
    const result: number | string = doPart(input);
    // console.timeEnd();
    console.log(`--> ${result} <--`);
    console.assert(!expected || result === expected, 'got: %s, expected: %s', result, expected);
}

void (() => {
    go(TEST1, 152);
    go(INPUT);
})();
