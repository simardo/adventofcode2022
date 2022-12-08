import { INPUT } from './input.ts';

const TEST1 = `30373
25512
65332
33549
35390`;

function doPart(input: string): string | number {
    const map: number[][] = input.split('\n').map(s => [...s].map(n => Number.parseInt(n)));

    const viewed: Set<string> = new Set<string>();

    const getNextHeight = (lastTree: number, row: number, col: number): number => {
        let result: number = lastTree;
        const tree: number = map[col][row];
        if (tree > lastTree) {
            viewed.add(`${col},${row}`);
            result = tree;
        }
        return result;
    }

    for (let row = 0; row < map.length; row++) {
        let lastTree = -1;
        for (let col = 0; col < map[row].length; col++) {
            lastTree = getNextHeight(lastTree, row, col);
        }
    }

    for (let row = 0; row < map.length; row++) {
        let lastTree = -1;
        for (let col = map[row].length - 1; col >= 0; col--) {
            lastTree = getNextHeight(lastTree, row, col);
        }
    }

    for (let col = 0; col < map[0].length; col++) {
        let lastTree = -1;
        for (let row = 0; row < map.length; row++) {
            lastTree = getNextHeight(lastTree, row, col);
        }
    }

    for (let col = 0; col < map[0].length; col++) {
        let lastTree = -1;
        for (let row = map.length - 1; row >= 0; row--) {
            lastTree = getNextHeight(lastTree, row, col);
        }
    }

    return viewed.size;
}

function go(input: string, expected?: number | string): void {
    // console.time();
    const result: number | string = doPart(input);
    // console.timeEnd();
    console.log(`--> ${result} <--`);
    console.assert(!expected || result === expected, 'got: %s, expected: %s', result, expected);
}

void (() => {
    go(TEST1, 21);
    go(INPUT);
})();
