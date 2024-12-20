
Array.isEqual = function(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    return true;
}

export function toInt(x) {
    return parseInt(x, 10);
}

export function parseNumbers(s) {
    const nums = [];

    for (let m of s.matchAll(/[\d-]+/g)) {
        nums.push(toInt(m));
    }

    return nums;
}

Map.prototype.hasVec = function(v) {
    return this.has(v.join(','));
}

Map.prototype.getVec = function(v) {
    return this.get(v.join(','));
}

Map.prototype.setVec = function(v, val) {
    this.set(v.join(','), val);
}

Map.prototype.deleteVec = function(v) {
    this.delete(v.join(','));
}

Map.fromVec = function(arr) {
    return new Map(arr.map(a => [a.join(','), a]));
}


export class Grid {
    constructor(width, height, fillValue = '.') {
        this.width = width;
        this.height = height;
        this.grid = Array(height).fill().map(() => Array(width).fill(fillValue));
    }

    at([x, y]) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return undefined;
        }

        return this.grid[y][x];
    }

    adjacent4([x, y]) {
        return [
            [x, y - 1],
            [x + 1, y],
            [x, y + 1],
            [x - 1, y],
        ];
    }

    adjacent8([x, y]) {
        return [
            [x, y - 1],
            [x + 1, y - 1],
            [x + 1, y],
            [x + 1, y + 1],
            [x, y + 1],
            [x - 1, y + 1],
            [x - 1, y],
            [x - 1, y - 1],
        ];
    }

    set([x, y], c) {
        this.grid[y][x] = c;
    }

    print([px, py] = []) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (px === x && py === y) {
                    process.stdout.write('@');
                    continue;
                }
                process.stdout.write(this.at([x, y]));
            }
            process.stdout.write('\n');
        }
    }
    swap(p1, p2) {
        let c = this.at(p1);
        this.set(p1, this.at(p2));
        this.set(p2, c);
    }

    static manhattanDistance(p1, p2) {
        return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
    }
}
