import { INPUT } from './input.ts';

const TEST1 = `30373
25512
65332
33549
35390`;

function explore(map: number[][], r: number, c: number, height: number): number {
    let score = 1;

    // right
    let result = 0;
    let tree = -1;
    for (let col = c + 1; tree < height && col < map[r].length; col++) {
        result++;
        tree = map[r][col];
    }
    score *= result;

    // left
    result = 0;
    tree = -1;
    for (let col = c - 1; tree < height && col >= 0; col--) {
        result++;
        tree = map[r][col];
    }
    score *= result;

    // bottom
    result = 0;
    tree = -1;
    for (let row = r + 1; tree < height && row < map.length; row++) {
        result++;
        tree = map[row][c];
    }
    score *= result;

    // top
    result = 0;
    tree = -1;
    for (let row = r - 1; tree < height && row >= 0; row--) {
        result++;
        tree = map[row][c];
    }
    score *= result;

    return score;
}

function doPart(input: string): string | number {
    const map: number[][] = input.split('\n').map(s => [...s].map(n => Number.parseInt(n)));

    let score = 0;
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            const tree: number = map[row][col];
            const treeScore = explore(map, row, col, tree);
            score = Math.max(score, treeScore);
        }
    }

    return score;
}

function go(input: string, expected?: number | string): void {
    // console.time();
    const result: number | string = doPart(input);
    // console.timeEnd();
    console.log(`--> ${result} <--`);
    console.assert(!expected || result === expected, 'got: %s, expected: %s', result, expected);
}

void (() => {
    go(TEST1, 8);
    go(INPUT);
})();
