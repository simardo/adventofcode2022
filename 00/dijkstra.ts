import { BTree } from "./btree.ts";

type DijNode<T> = {
    coords: T;
    parent?: DijNode<T>;
    score: number;
    visited?: boolean;
    destination?: boolean;
}

type DijScore<T> = Map<string, DijNode<T>>;

export class Dijkstra<T> {

    constructor(private fromFn: () => T,
        private isDestFn: (item: T) => boolean,
        private nextFromFn: (item: T) => T[],
        private scoreAtFn: (item: T) => number | undefined,
        private getKeyFn: (item: T) => string) {
    }

    public shortestPath(): DijNode<T> | undefined {

        const scoredNodes: DijScore<T> = new Map<string, DijNode<T>>();
        const visitedNodes: DijScore<T> = new Map<string, DijNode<T>>();

        const bTree: BTree<DijNode<T>> = new BTree<DijNode<T>>();

        const from: T = this.fromFn();

        const node0: DijNode<T> = { coords: from, score: 0 };
        scoredNodes.set(this.getKeyFn(from), node0);
        bTree.heap.push(node0);

        let completed = false;

        while (!completed) {
            const bestNode: DijNode<T> = bTree.dequeue();

            const visit: (item: T) => void = (item => {
                const score: number | undefined = this.scoreAtFn(item);
                if (score) {
                    const key: string = this.getKeyFn(item);
                    let currentNode: DijNode<T> | undefined = scoredNodes.get(key);
                    const visitedNode: DijNode<T> | undefined = visitedNodes.get(key);

                    if (currentNode === undefined && visitedNode === undefined) {
                        currentNode = { coords: item, score: Number.MAX_VALUE, destination: this.isDestFn(item) };
                        scoredNodes.set(key, currentNode);
                        bTree.enqueue(currentNode);
                    }
                    if (currentNode) {
                        const newScore: number = bestNode.score + score;
                        if (newScore < currentNode.score) {
                            currentNode.score = newScore;
                            currentNode.parent = bestNode;
                            bTree.percolateUp();
                        }
                    }
                }
            });

            if (bestNode) {
                const node: T = bestNode.coords;
                this.nextFromFn(node).forEach(n => {
                    const toVisit: T = n;
                    visit(toVisit);
                });

                bestNode.visited = true;
                const nodeKey: string = this.getKeyFn(node);
                scoredNodes.delete(nodeKey);
                visitedNodes.set(nodeKey, bestNode);

                completed = bestNode.visited === true && bestNode.destination === true;
            } else {
                completed = true;
            }
        }

        return [...visitedNodes.values()].find(f => f.destination === true);
    }
}
