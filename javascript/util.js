
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
        return this.grid[y][x];
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
}
