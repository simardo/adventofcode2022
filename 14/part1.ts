import { INPUT } from './input.ts';

const TEST1 = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

function doPart(input: string): string | number {
    const coords: string[][] = input.split('\n').map(s => s.split(' -> '));

    const map: Set<string> = new Set<string>();

    const toStr: (x: number, y: number) => string = (x, y) => `${x},${y}`;

    let neant = 0;

    coords.forEach(c => {
        for (let i = 0; i < c.length - 1; i++) {
            const [fromX, fromY] = c[i].split(',').map(n => Number.parseInt(n));
            const [toX, toY] = c[i + 1].split(',').map(n => Number.parseInt(n));

            for (let x = Math.min(fromX, toX); x <= Math.max(fromX, toX); x++) {
                for (let y = Math.min(fromY, toY); y <= Math.max(fromY, toY); y++) {
                    map.add(toStr(x, y));
                    neant = Math.max(neant, y);
                }
            }
        }
    });

    let voidReached = false;
    let sandCount = 0;
    while (!voidReached) {
        sandCount++;
        let [sx, sy] = [500, 0];
        let stopped = false;
        while (!stopped) {
            if (!map.has(toStr(sx, sy + 1))) {
                sy++;
            } else {
                if (!map.has(toStr(sx - 1, sy + 1))) { // left
                    sx--;
                    sy++
                } else if (!map.has(toStr(sx + 1, sy + 1))) { // right
                    sx++;
                    sy++
                } else {
                    map.add(toStr(sx, sy));
                    stopped = true;
                }
            }
            if (sy >= neant) {
                stopped = true;
                voidReached = true;
            }
        }
    }

    return sandCount - 1;
}

function go(input: string, expected?: number | string): void {
    // console.time();
    const result: number | string = doPart(input);
    // console.timeEnd();
    console.log(`--> ${result} <--`);
    console.assert(!expected || result === expected, 'got: %s, expected: %s', result, expected);
}

void (() => {
    go(TEST1, 24);
    go(INPUT);
})();
