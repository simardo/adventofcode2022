import { INPUT } from './input.ts';

const TEST1 = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

type Folder = {
    name: string;
    full: string;
    files: [string, number][];
    subs: Dict<Folder>;
    parent: Folder | undefined;
}

type Dict<T> = { [key: string]: T };

function* readConsole(input: string): Generator<string> {
    const lines: string[] = input.split('\n');
    for (let i = 0; i < lines.length; i++) {
        yield lines[i];
    }
}

function computeSize(f: Folder): number {
    const fs: number = f.files.reduce((p, v) => p + v[1], 0);
    let ss = 0;
    Object.values(f.subs).forEach(s => ss += computeSize(s));
    return fs + ss;
}

function doPart(input: string): string | number {
    const rootFolder: Folder = {
        name: '/',
        full: '/',
        files: [],
        subs: {},
        parent: undefined
    };

    const allFolders: Folder[] = [];

    let curFolder: Folder = rootFolder;

    const iter = readConsole(input);
    let line = iter.next();
    while (!line.done) {
        if (line.value[0] === '$') {
            const [_, cmd, dir] = line.value.split(' ');
            if (cmd === 'cd') {
                if (dir === '/') {
                    curFolder = rootFolder;
                } else if (dir === '..') {
                    curFolder = curFolder.parent!;
                } else {
                    curFolder = curFolder.subs[dir];
                }
                line = iter.next();
            } else if (cmd === 'ls') {
                line = iter.next();
                while (!line.done && line.value[0] !== '$') {
                    const [i1, i2] = line.value.split(' ');
                    if (i1 === 'dir') {
                        const sub: Folder = { name: i2, full: curFolder.full + i2 + '/', files: [], subs: {}, parent: curFolder };
                        curFolder.subs[i2] = sub;
                        allFolders.push(sub);
                    } else {
                        curFolder.files.push([i2, Number.parseInt(i1)]);
                    }
                    line = iter.next();
                }
            }
        }
    }

    const unused: number = 70000000 - computeSize(rootFolder);

    const processed: Set<string> = new Set<string>();
    return allFolders.reduce((p, f) => {
        if (!processed.has(f.full)) {
            const size = computeSize(f);
            if (unused + size >= 30000000) {
                p = Math.min(p, size);
            }
            processed.add(f.full);
        }
        return p;
    }, Number.MAX_VALUE);
}

function go(input: string, expected?: number | string): void {
    const result: number | string = doPart(input);
    console.log(`--> ${result} <--`);
    console.assert(!expected || result === expected, 'got: %s, expected: %s', result, expected);
}

void (() => {
    go(TEST1, 24933642);
    go(INPUT);
})();
