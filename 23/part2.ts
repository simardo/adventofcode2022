import { INPUT } from './input.ts';

const TEST0 = `.....
..##.
..#..
.....
..##.
.....`;

const TEST1 = `....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..`;

type Coord = [number, number];

type Elfe = {
    coord: Coord;
    proposal: Coord | undefined;
}

function toStr(coord: Coord): string {
    return `${coord[0]},${coord[1]}`;
}

function isElfeAt(map: Map<string, Elfe>, pos: Coord[]): boolean {
    return pos.some(p => map.has(toStr(p)));
}

function setProposal(map: Map<string, number>, coord: Coord): void {
    const key: string = toStr(coord);
    if (!map.has(key)) {
        map.set(key, 0);
    }
    map.set(key, map.get(key)! + 1);
}

function doPart(input: string): string | number {
    let map: Map<string, Elfe> = new Map<string, Elfe>();

    input.split('\n').forEach((line, y) => {
        [...line].forEach((col, x) => {
            if (col === '#') {
                map.set(toStr([x, y]), { coord: [x, y], proposal: undefined });
            }
        });
    });

    const globalChoices: string[] = ['N', 'S', 'W', 'E'];

    let moving = true;
    let part = 0;
    while (moving) {
        part++

        const proposals: Map<string, number> = new Map<string, number>();

        for (const elfe of map.values()) {
            const [x, y] = elfe.coord;
            if (isElfeAt(map, [[x, y - 1], [x - 1, y - 1], [x - 1, y], [x - 1, y + 1], [x, y + 1], [x + 1, y + 1], [x + 1, y], [x + 1, y - 1]])) {
                for (let c = 0; c < globalChoices.length; c++) {
                    const choice: string = globalChoices[c];
                    if (choice === 'N' && !isElfeAt(map, [[x - 1, y - 1], [x, y - 1], [x + 1, y - 1]])) {
                        elfe.proposal = [x, y - 1];
                        setProposal(proposals, [x, y - 1]);
                        break;
                    } else if (choice === 'S' && !isElfeAt(map, [[x - 1, y + 1], [x, y + 1], [x + 1, y + 1]])) {
                        elfe.proposal = [x, y + 1];
                        setProposal(proposals, [x, y + 1]);
                        break;
                    } else if (choice === 'W' && !isElfeAt(map, [[x - 1, y - 1], [x - 1, y], [x - 1, y + 1]])) {
                        elfe.proposal = [x - 1, y];
                        setProposal(proposals, [x - 1, y]);
                        break;
                    } else if (choice === 'E' && !isElfeAt(map, [[x + 1, y - 1], [x + 1, y], [x + 1, y + 1]])) {
                        elfe.proposal = [x + 1, y];
                        setProposal(proposals, [x + 1, y]);
                        break;
                    }
                }
            }
        }
        globalChoices.push(globalChoices.splice(0, 1)[0]);

        moving = false;
        const newMap: Map<string, Elfe> = new Map<string, Elfe>();
        for (const elfe of map.values()) {
            let moved = false;
            if (elfe.proposal !== undefined) {
                const key: string = toStr(elfe.proposal);
                if (proposals.get(key) === 1) {
                    elfe.coord = elfe.proposal;
                    newMap.set(key, elfe);
                    moved = true;
                    moving = true;
                }
                elfe.proposal = undefined;
            }
            if (!moved) {
                newMap.set(toStr(elfe.coord), elfe);
            }
        }
        map = newMap;
    }

    return part;
}

function go(input: string, expected?: number | string): void {
    // console.time();
    const result: number | string = doPart(input);
    // console.timeEnd();
    console.log(`--> ${result} <--`);
    console.assert(!expected || result === expected, 'got: %s, expected: %s', result, expected);
}

void (() => {
    go(TEST1, 20);
    go(INPUT);
})();
