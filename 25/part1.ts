import { INPUT } from './input.ts';

const TEST1 = `1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122`;

function incSnafu(snafu: string[], index: number): string[] {
    let result: string[] = [...snafu];
    if (index === result.length) {
        result.push('1');
    } else {
        const v: string = result[index];
        if (v === '0') {
            result[index] = '1';
        } else if (v === '1') {
            result[index] = '2';
        } else if (v === '2') {
            result[index] = '=';
            result = incSnafu(result, index + 1);
        } else if (v === '=') {
            result[index] = '-';
        } else if (v === '-') {
            result[index] = '0';
        }
    }
    return result;
}

function numberToSnafu(num: number): string {
    let exp = 0;
    let decimal: number = num;
    let result: string[] = [];
    while (Math.pow(5, exp) <= num) {
        result.push('0');
        exp++;
    }

    for (let e = exp; e >= 0; e--) {
        const n: number = Math.pow(5, e);
        while (decimal >= n) {
            result = incSnafu(result, e);
            decimal -= n;
        }
    }

    return result.reverse().join('');
}

function doPart(input: string): string | number {
    const lines: string[] = input.split('\n').map(s => s);

    const sum: number = lines.reduce((p,v) => {
        const n: string[] = [...v].reverse();
        return p + n.reduce((pp, vv, i) => {
            let result: number = Math.pow(5, i);
            if (vv === '-') {
                result = -result;
            } else if (vv === '=') {
                result = -2 * result;
            } else {
                result = Number.parseInt(vv) * result;
            }
            return pp + result;
        }, 0);
    }, 0);

    return numberToSnafu(sum);
}

function go(input: string, expected?: number | string): void {
    // console.time();
    const result: number | string = doPart(input);
    // console.timeEnd();
    console.log(`--> ${result} <--`);
    console.assert(!expected || result === expected, 'got: %s, expected: %s', result, expected);
}

void (() => {
    go(TEST1, '2=-1=0');
    go(INPUT);
})();
