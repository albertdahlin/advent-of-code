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

function walk(x, y, blocked) {
    let dir = 0;
    let visited = new Map();
    let wouldLoop = false;

    while (true) {
        let [x1, y1] = step(x, y, dir);

        let key = toStr(x, y);
        let dirs = visited.get(key);

        if (dirs === undefined) {
            dirs = new Set();
            visited.set(key, dirs);
        }

        if (dirs.has(dir)) {
            wouldLoop = true;
            break;
        }

        dirs.add(dir);

        if (blocked.has(toStr(x1, y1))) {
            dir = turnRight(dir);
            continue;
        }

        if (isOutside(x1, y1)) {
            break;
        }

        x = x1;
        y = y1;
    }

    return [visited, wouldLoop];
}


let [ visited, _ ] = walk(x, y, blocked);

console.log(visited.size);

visited.delete(toStr(x, y));

for (const [key, _] of visited) {
    let [_, wouldLoop] = walk(x, y, new Set(blocked).add(key));

    if (wouldLoop) {
        part2 += 1;
    }
}

console.log(part2);

