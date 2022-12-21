import { INPUT } from './input.ts';

const TEST1 = `1
2
-3
3
-2
0
4`;

type Link = {
    value: number;
    prev: Link;
    next: Link;
}

function doPart(input: string): string | number {
    const nums: Link[] = input.split('\n').map(s => {
        return {
            value: Number.parseInt(s)
        } as Link;
    });

    nums.forEach((l, i) => {
        l.prev = i === 0 ? nums[nums.length - 1] : nums[i - 1];
        l.next = i === nums.length - 1 ? nums[0] : nums[i + 1];
    });

    const chain: Link = nums[0];

    nums.forEach(n => {
        if (n.value != 0) {
            // remove
            n.prev.next = n.next;
            n.next.prev = n.prev;

            let pos: Link = n;
            if (pos.value > 0) {
                for (let i = 1; i <= n.value; i++) {
                    pos = pos.next;
                }
            } else if (pos.value < 0) {
                for (let i = 0; i >= n.value; i--) {
                    pos = pos.prev;
                }
            }

            const oldPosNext: Link = pos.next;
            n.next = pos.next;
            oldPosNext.prev = n;

            n.prev = pos;
            pos.next = n;
        }

    });

    let zero: Link = nums.find(n => n.value === 0)!;

    let result = 0;
    for (let i = 1; i <= 3000; i++) {
        zero = zero.next;
        if (i % 1000 === 0) {
            result += zero.value;
        }
    }

    return result;
}

function go(input: string, expected?: number | string): void {
    // console.time();
    const result: number | string = doPart(input);
    // console.timeEnd();
    console.log(`--> ${result} <--`);
    console.assert(!expected || result === expected, 'got: %s, expected: %s', result, expected);
}

void (() => {
    go(TEST1, 3);
    go(INPUT);
})();

