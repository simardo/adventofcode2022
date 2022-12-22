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

function yell(monkeys: Dict<number | string[]>, name: string, human: number): number {
    const m = monkeys[name];
    let result: number;
    if (name === 'humn') {
        result = human;
    } else {
        if (typeof m === 'number') {
            result = m;
        } else {
            const [first, oper, second] = m;
            const f = yell(monkeys, first, human);
            const s = yell(monkeys, second, human);
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

    let humn = 0;
    const root: string[] = monkeys['root'] as string[];
    const first = root[0];
    const second = root[2];
    let f: number = yell(monkeys, first, humn);
    let s: number = yell(monkeys, second, humn);

    // console.log(f, s); // whatever humn, s = 34588563455325, if humn is very large, f < s

    const fLength: number = s.toString().length;
    humn = 0;
    for (let i = fLength - 1; i >= 0; i--) {
        let digit = 9;
        let temp: number = humn + (Math.pow(10, i) * digit);
        
        f = yell(monkeys, first, temp);
        s = yell(monkeys, second, temp);
        while (f < s) {
            digit--;

            temp = humn + (Math.pow(10, i) * digit);
            f = yell(monkeys, first, temp);
            s = yell(monkeys, second, temp);
        }
        humn = humn + (Math.pow(10, i) * digit);
    }

    return humn;
}

function go(input: string, expected?: number | string): void {
    // console.time();
    const result: number | string = doPart(input);
    // console.timeEnd();
    console.log(`--> ${result} <--`);
    console.assert(!expected || result === expected, 'got: %s, expected: %s', result, expected);
}

void (() => {
    // go(TEST1, 301);
    go(INPUT);
})();
