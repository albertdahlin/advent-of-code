import fs from 'node:fs';

const input = fs.readFileSync(0, 'utf-8');


let part1 = 0;
let part2 = 0;

let grid = [];

let row = 0;
let col = 0;
let x, y = 0;
let blocked = new Set();
let width = 0;
let height = 0;

for (const line of input.split('\n')) {
    if (!line) {
        break;
    }
    col = 0;
    for (const c of line.split('')) {
        if (grid[row] === undefined) {
            grid[row] = [];
        }
        grid[row][col] = c;
        if (c === '#') {
            blocked.add(`${col},${row}`);
        }

        if (c === '^') {
            x = col;
            y = row;
        }
        col++;

    }
    row++;
}

width = grid[0].length;
height = grid.length;

function turnRight(dir) {
    return (dir + 1) % 4;
}

function gridAt(row, col) {
    if (grid[row] === undefined) {
        return undefined;
    }

    return grid[row][col];
}

function step(x, y, dir) {
    switch (dir) {
        case 0:
            y--;
            break;
        case 1:
            x++;
            break;
        case 2:
            y++;
            break;
        case 3:
            x--;
            break;
    }

    return [x, y];
}
function toStr(x, y) {
    return `${x},${y}`;
}

function isOutside(x, y) {
    return x < 0 || x >= width || y < 0 || y >= height;
}

function wouldLoop(x, y, dir) {
    let [x1, y1] = step(x, y, dir);

    if (isOutside(x1, y1)) {
        return false;
    }

    if (blocked.has(toStr(x1, y1))) {
        return false;
    }

    dir = turnRight(dir);
    let obst = toStr(x1, y1);

    let localVisited = new Map();

    while (true) {
        let key = toStr(x, y);
        let vdirs = visited.get(key) || new Set();
        let ldirs = localVisited.get(key) || new Set();

        if (vdirs.has(dir) || ldirs.has(dir)) {
            return true;
        }

        [x1, y1] = step(x, y, dir);

        if (isOutside(x1, y1)) {
            return false;
        }

        let key1 = toStr(x1, y1);

        if (blocked.has(key1) || key1 == obst) {
            dir = turnRight(dir);
        } else {
            key = toStr(x, y);
            let dirs = localVisited.get(key);

            if (dirs === undefined) {
                dirs = new Set();
                localVisited.set(key, dirs);
            }
            dirs.add(dir);
            x = x1;
            y = y1;
        }
    }
}

function walkUntilBlocked(x, y, dir) {
    while (true) {
        let [x1, y1] = step(x, y, dir);

        let key = toStr(x, y);
        let dirs = visited.get(key);

        if (dirs === undefined) {
            dirs = new Set();
            visited.set(key, dirs);
        }

        dirs.add(dir);

        if (wouldLoop(x, y, dir)) {
            obstacles.add(toStr(x1, y1));
        }

        if (blocked.has(toStr(x1, y1))) {
            return [x, y];
        }

        if (isOutside(x1, y1)) {
            return false;
        }

        x = x1;
        y = y1;
    }
}

let dir = 0;
let visited = new Map();
// 2118 high
// 2117 high
// 2116 high
let obstacles = new Set();

while (true) {
    let pos = walkUntilBlocked(x, y, dir);

    if (!pos) {
        // exited
        break;
    } else {
        [x, y] = pos;
        dir = turnRight(dir);
    }
}

console.log(visited.size);
console.log(obstacles.size);

