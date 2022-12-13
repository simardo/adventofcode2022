export interface BTreeElement {
    score: number;
}

export class BTree<T extends BTreeElement> {
    public heap: T[] = [undefined!];

    private swap(oldX: number, newX: number): number {
        const temp: T = this.heap[newX];
        this.heap[newX] = this.heap[oldX];
        this.heap[oldX] = temp;

        return newX;
    }

    private percolateDown(): void {
        let x: number | undefined = 1;

        while (x !== undefined) {
            const root: T | undefined = this.heap[x];
            const childLeft: T = this.heap[2 * x];
            const childRight: T = this.heap[(2 * x) + 1];

            if (childRight && childRight.score < root.score && childRight.score < childLeft.score) {
                x = this.swap(x, (2 * x) + 1);
            } else if (childLeft && childLeft.score < root.score) {
                x = this.swap(x, 2 * x);
            } else {
                x = undefined;
            }
        }
    }

    public percolateUp(): void {
        let x: number | undefined = this.heap.length - 1;

        while (x !== undefined) {
            const leaf: T | undefined = this.heap[x];
            const parent: T = this.heap[Math.floor(x / 2)];
            if (parent && parent.score > leaf.score) {
                x = this.swap(x, Math.floor(x / 2));
            } else {
                x = undefined;
            }
        }
    }

    public dequeue(): T {
        const result: T = this.heap.length <= 2 ? this.heap.pop()! : this.heap[1];
        if (this.heap.length > 2) {
            this.heap[1] = this.heap.pop()!;
            this.percolateDown();
        }

        return result;
    }

    public enqueue(node: T): void {
        this.heap.push(node);
        this.percolateUp();
    }
}
