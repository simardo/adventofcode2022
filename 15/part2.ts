import { INPUT } from './input.ts';

// const TEST1 = `Sensor at x=8, y=7: closest beacon is at x=2, y=10`;

const TEST1 = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

const RE = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/g;
let TARGET = 20;

function doPart(input: string): string | number {
    const sensors: [[number, number], [number, number]][] = [];
    let match: RegExpMatchArray | null;
    while ((match = RE.exec(input)) !== null) {
        const [, sx, sy, bx, by] = match;
        sensors.push([[Number.parseInt(sx), Number.parseInt(sy)], [Number.parseInt(bx), Number.parseInt(by)]])
    }

    let result: [number, number] | undefined;

    for (let y = 0; y <= TARGET && result === undefined; y++) {
        const rangesAtTarget: [number, number][] = [];

        sensors.forEach(s => {
            const [sensor, beacon] = s;
            const [sx, sy] = sensor;
            const [bx, by] = beacon;
            const dist = Math.abs(sx - bx) + Math.abs(sy - by);

            if (sy + dist >= y && sy - dist <= y) {
                const left: number = Math.max(0, sx - (dist - Math.abs(sy - y)));
                const right: number = Math.min(sx + (dist - Math.abs(sy - y)), TARGET);
                rangesAtTarget.push([left, right]);
            }
        });
        rangesAtTarget.sort((a, b) => a[0] - b[0]);

        let rangeIndex = 0;
        let x = 0;
        let range1: [number, number] = rangesAtTarget[rangeIndex];
        while (rangeIndex < rangesAtTarget.length && result === undefined) {
            if (range1[0] > x + 1) {
                result = [x + 1, y];
            } else {
                x = Math.max(x, range1[1]);
            }
            range1 = rangesAtTarget[++rangeIndex];
        }
    }

    return result![0] * 4000000 + result![1];
}

function go(input: string, expected?: number | string): void {
    // console.time();
    const result: number | string = doPart(input);
    // console.timeEnd();
    console.log(`--> ${result} <--`);
    console.assert(!expected || result === expected, 'got: %s, expected: %s', result, expected);
}

void (() => {
    go(TEST1, 56000011);
    TARGET = 4000000;
    go(INPUT);
})();
