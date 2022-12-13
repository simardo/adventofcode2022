import { Dijkstra } from '../00/dijkstra.ts';
import { INPUT } from './input.ts';

const TEST1 = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

type Coords = [number, number];

function doPart(input: string): string | number {
    const map: string[][] = input.split('\n').map(s => [...s]);

    const starts: [number, number][] = [];
    let end: [number, number];
    map.forEach((vy, y) => {
        vy.forEach((vx, x) => {
            if (vx === 'S' || vx === 'a') {
                starts.push([x, y]);
                map[y][x] = 'a';
            } else if (vx === 'E') {
                end = [x, y];
                map[y][x] = 'z';
            }
        });
    });

    return starts.reduce((p, v) => {
        const dijkstra: Dijkstra<Coords> = new Dijkstra(
            () => v,
            item => item[0] === end[0] && item[1] === end[1],
            item => {
                const [x, y] = item;
                const next: Coords[] = [];
    
                const current: number = map[y][x].charCodeAt(0);
                const top: number | undefined = map[y - 1] !== undefined ? map[y - 1][x]?.charCodeAt(0) : undefined;
                if (top && (top < current || top - current <= 1)) {
                    next.push([x, y - 1]);
                }
    
                const left: number | undefined = map[y][x - 1]?.charCodeAt(0);
                if (left && (left < current || left - current <= 1)) {
                    next.push([x - 1, y]);
                }
    
                const right: number | undefined = map[y][x + 1]?.charCodeAt(0);
                if (right && (right < current || right - current <= 1)) {
                    next.push([x + 1, y]);
                }
                const bottom: number | undefined = map[y + 1] !== undefined ? map[y + 1][x]?.charCodeAt(0) : undefined;
                if (bottom && (bottom < current || bottom - current <= 1)) {
                    next.push([x, y + 1]);
                }
                return next;
            },
            () => 1,
            item => `${item[0]},${item[1]}`
        );

        const shortestPath = dijkstra.shortestPath();

        return Math.min(p, shortestPath ? shortestPath.score : Number.MAX_SAFE_INTEGER);
    }, Number.MAX_SAFE_INTEGER);
}

function go(input: string, expected?: number | string): void {
    const result: number | string = doPart(input);
    console.log(`--> ${result} <--`);
    console.assert(!expected || result === expected, 'got: %s, expected: %s', result, expected);
}

void (() => {
    go(TEST1, 29);
    go(INPUT);
})();
