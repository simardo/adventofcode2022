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

function render(map: Map<string, Elfe>, part: number): void {
    let minX = Number.MAX_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxX = 0;
    let maxY = 0;
    for (const elfe of map.values()) {
        const [x, y] = elfe.coord;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
    }

    const rendered: string[][] = [];
    for (let y = minY; y <= maxY; y++) {
        const line: string[] = []
        for (let x = minX; x <= maxX; x++) {
            line.push('.');
        }
        rendered.push(line);
    }

    for (const elfe of map.values()) {
        const [x, y] = elfe.coord;
        rendered[y - minY][x - minX] = '#';
    }

    console.log();
    console.log(`== END OF PART ${part} ==`);
    console.log(rendered.map(m => m.join('')).join('\n'));
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

    for (let i = 1; i <= 10; i++) {
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

        const newMap: Map<string, Elfe> = new Map<string, Elfe>();
        for (const elfe of map.values()) {
            let moved = false;
            if (elfe.proposal !== undefined) {
                const key: string = toStr(elfe.proposal);
                if (proposals.get(key) === 1) {
                    elfe.coord = elfe.proposal;
                    newMap.set(key, elfe);
                    moved = true;
                }
                elfe.proposal = undefined;
            }
            if (!moved) {
                newMap.set(toStr(elfe.coord), elfe);
            }
        }
        map = newMap;
        // render(map, i);
    }

    let minX = Number.MAX_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxX = 0;
    let maxY = 0;
    for (const elfe of map.values()) {
        const [x, y] = elfe.coord;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
    }

    let result = 0;
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            if (!map.has(toStr([x, y]))) {
                result++
            }
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
    go(TEST1, 110);
    go(INPUT);
})();

