import { INPUT } from './input.ts';

const TEST1 = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

function doPart(input: string): string | number {
    const coords: string[][] = input.split('\n').map(s => s.split(' -> '));

    const map: string[][] = [];

    coords.forEach(c => {
        for (let i = 0; i < c.length - 1; i++) {
            const [fromX, fromY] = c[i].split(',').map(n => Number.parseInt(n));
            const [toX, toY] = c[i + 1].split(',').map(n => Number.parseInt(n));

            while (map.length <= Math.max(fromY, toY) + 1) {
                map.push([]);
            }

            map.forEach(y => {
                while (y.length <= Math.max(fromX, toX) + 1) {
                    y.push('.');
                }
            });

            for (let x = Math.min(fromX, toX); x <= Math.max(fromX, toX); x++) {
                for (let y = Math.min(fromY, toY); y <= Math.max(fromY, toY); y++) {
                    map[y][x] = '#';
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
            if (map[sy + 1][sx] === '.') {
                sy++;
            } else {
                if (map[sy + 1][sx - 1] === '.') { // left
                    sx--;
                    sy++
                } else if (map[sy + 1][sx + 1] === '.') { // right
                    sx++;
                    sy++
                } else {
                    map[sy][sx] = 'o';
                    stopped = true;
                }
            }
            if (sy >= map.length - 1) {
                stopped = true;
                voidReached = true;
            }
        }
    }
    console.log(map.map(m => m.filter((_, x) => x > 450).join('')).join('\n'));

    return sandCount-1;
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
