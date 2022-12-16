import { INPUT } from './input.ts';

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

let TARGET = 10;

function doPart(input: string): string | number {
    const sensors: [[number, number], [number, number]][] = [];
    let match: RegExpMatchArray | null;
    while ((match = RE.exec(input)) !== null) {
        const [, sx, sy, bx, by] = match;
        sensors.push([[Number.parseInt(sx), Number.parseInt(sy)], [Number.parseInt(bx), Number.parseInt(by)]])
    }

    const posAtTarget: Set<string> = new Set<string>;
    const toStr = (x: number, y: number) => `${x},${y}`;

    sensors.forEach(s => {
        const [sensor, beacon] = s;
        const [sx, sy] = sensor;
        const [bx, by] = beacon;
        const dist = Math.abs(sx - bx) + Math.abs(sy - by);

        for (let x = sx; Math.abs(x - sx) + Math.abs(TARGET - sy) <= dist; x++) {
            posAtTarget.add(toStr(x, TARGET));
        }

        for (let x = sx; Math.abs(x - sx) + Math.abs(TARGET - sy) <= dist; x--) {
            posAtTarget.add(toStr(x, TARGET));
        }

        if (by === TARGET) {
            posAtTarget.delete(toStr(bx, by));
        }
        if (sy === TARGET) {
            posAtTarget.delete(toStr(sx, sy));
        }
    })

    return posAtTarget.size;
}

function go(input: string, expected?: number | string): void {
    // console.time();
    const result: number | string = doPart(input);
    // console.timeEnd();
    console.log(`--> ${result} <--`);
    console.assert(!expected || result === expected, 'got: %s, expected: %s', result, expected);
}

void (() => {
    go(TEST1, 26);
    TARGET = 2000000;
    go(INPUT);
})();
