import { INPUT } from './input.ts';

const TEST1 = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

function compareLists(left: any[], right: any[]): boolean | undefined {
    let i = 0;
    let result: boolean | undefined = undefined;
    while (result === undefined) {
        if (i >= left.length && i >= right.length) {
            break;
        } else if (i >= left.length) {
            result = true;
        } else if (i >= right.length) {
            result = false;
        } else if (typeof left[i] === 'number' && typeof right[i] === 'number') {
            if (left[i] < right[i]) {
                result = true;
            } else if (left[i] > right[i]) {
                result = false;
            }
        } else if (Array.isArray(left[i]) && Array.isArray(right[i])) {
            result = compareLists(left[i], right[i]);
        } else if (Array.isArray(left[i])) {
            result = compareLists(left[i], [right[i]]);
        } else {
            result = compareLists([left[i]], right[i]);
        }
        i++;
    }
    return result;
}

function doPart(input: string): string | number {
    const pairs: string[] = input.split('\n\n');

    return pairs.reduce((prev, pair, i) => {
        const [left, right] = pair.split('\n').map(p => JSON.parse(p));

        const ordered: boolean | undefined = compareLists(left, right);

        return ordered === true ? prev + i + 1 : prev;
    }, 0);
}

function go(input: string, expected?: number | string): void {
    // console.time();
    const result: number | string = doPart(input);
    // console.timeEnd();
    console.log(`--> ${result} <--`);
    console.assert(!expected || result === expected, 'got: %s, expected: %s', result, expected);
}

void (() => {
    go(TEST1, 13);
    go(INPUT);
})();
