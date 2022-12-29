import { Dijkstra } from '../00/dijkstra.ts';
import { INPUT } from './input.ts';

const TEST1 = `#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`;

type Coord = [number, number];

type Elfe = {
    pos: Coord;
    minute: number;
}

type WindCoords = Map<string, Coord>;

type Winds = [WindCoords, WindCoords, WindCoords, WindCoords];

function toStr(coord: Coord): string {
    const [x, y] = coord;
    return `${x},${y}`;
}

function getWinds(minute: number, winds: Winds[], maxEast: number, maxSouth: number): Winds {
    while (winds.length < minute + 1) {
        const [we, ww, ws, wn] = winds[winds.length - 1];

        const newWe: WindCoords = new Map<string, Coord>();
        for (const [x, y] of we.values()) {
            let newX: number = x + 1;
            if (newX > maxEast - 2) {
                newX = 1;
            }
            newWe.set(toStr([newX, y]), [newX, y]);
        }

        const newWw: WindCoords = new Map<string, Coord>();
        for (const [x, y] of ww.values()) {
            let newX: number = x - 1;
            if (newX < 1) {
                newX = maxEast - 2;
            }
            newWw.set(toStr([newX, y]), [newX, y]);
        }

        const newWs: WindCoords = new Map<string, Coord>();
        for (const [x, y] of ws.values()) {
            let newY: number = y + 1;
            if (newY > maxSouth - 2) {
                newY = 1;
            }
            newWs.set(toStr([x, newY]), [x, newY]);
        }

        const newWn: WindCoords = new Map<string, Coord>();
        for (const [x, y] of wn.values()) {
            let newY: number = y - 1;
            if (newY < 1) {
                newY = maxSouth - 2;
            }
            newWn.set(toStr([x, newY]), [x, newY]);
        }

        winds.push([newWe, newWw, newWs, newWn]);
    }
    return winds[minute];
}

function isPosFree(winds: Winds[], minute: number, c: Coord, maxEast: number, maxSouth: number): boolean {
    const [we, ww, ws, wn] = getWinds(minute, winds, maxEast, maxSouth);
    const key: string = toStr(c);
    return !(we.has(key) || ww.has(key) || ws.has(key) || wn.has(key));
}

function doPart(input: string): string | number {
    const windsEast: WindCoords = new Map<string, Coord>();
    const windsWest: WindCoords = new Map<string, Coord>();
    const windsSouth: WindCoords = new Map<string, Coord>();
    const windsNorth: WindCoords = new Map<string, Coord>();

    const windsAt: Winds[] = [];

    let width = 0;
    const height = input.split('\n').length;

    input.split('\n').forEach((row, y) => [...row].forEach((col, x) => {
        if (col === '>') {
            windsEast.set(toStr([x, y]), [x, y])
        } else if (col === '<') {
            windsWest.set(toStr([x, y]), [x, y])
        } else if (col === 'v') {
            windsSouth.set(toStr([x, y]), [x, y])
        } else if (col === '^') {
            windsNorth.set(toStr([x, y]), [x, y])
        }
        width = row.length;
    }));
    windsAt.push([windsEast, windsWest, windsSouth, windsNorth]);

    const dijkstra: Dijkstra<Elfe> = new Dijkstra<Elfe>(
        () => { return { pos: [1, 0], minute: 0 } },
        e => e.pos[0] === width - 2 && e.pos[1] === height - 1,
        e => {
            const next: Elfe[] = [];
            const [x, y] = e.pos;
            // wait
            if (isPosFree(windsAt, e.minute + 1, [x, y], width, height)) {
                next.push({ minute: e.minute + 1, pos: [x, y] })
            }
            // east
            if (!(x === 1 && y === 0) && (x + 1 <= width - 2) && isPosFree(windsAt, e.minute + 1, [x + 1, y], width, height)) {
                next.push({ minute: e.minute + 1, pos: [x + 1, y] })
            }
            // west
            if (!(x === 1 && y === 0) && (x - 1 >= 1) && isPosFree(windsAt, e.minute + 1, [x - 1, y], width, height)) {
                next.push({ minute: e.minute + 1, pos: [x - 1, y] })
            }
            // south
            if ((x === width - 2 && y + 1 === height - 1) || (y + 1 <= height - 2) && isPosFree(windsAt, e.minute + 1, [x, y + 1], width, height)) {
                next.push({ minute: e.minute + 1, pos: [x, y + 1] })
            }
            // north
            if ((y - 1 >= 1) && isPosFree(windsAt, e.minute + 1, [x, y - 1], width, height)) {
                next.push({ minute: e.minute + 1, pos: [x, y - 1] })
            }
            return next;
        },
        _ => 1,
        e => `${toStr(e.pos)},${e.minute}`
    )

    const result = dijkstra.shortestPath();

    return result?.score!;
}

function go(input: string, expected?: number | string): void {
    // console.time();
    const result: number | string = doPart(input);
    // console.timeEnd();
    console.log(`--> ${result} <--`);
    console.assert(!expected || result === expected, 'got: %s, expected: %s', result, expected);
}

void (() => {
    go(TEST1, 18);
    go(INPUT);
})();
