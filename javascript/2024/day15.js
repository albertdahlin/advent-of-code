import fs from 'node:fs';
import { toInt, parseNumbers, Grid } from '../util.js';

const [ first, moves ] = fs.readFileSync(0, 'utf-8').trim().split('\n\n');

let rows = first.split('\n').map(row => row.split(''));

let start = null;
let width = rows[0].length;
let height = rows.length;

const grid1 = new Grid(width, height);
const grid2 = new Grid(width * 2, height);


for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        let c = rows[y][x];

        if (c === '@') {
            start = [x, y];
        }

        if (c === '#') {
            grid1.set([x, y], '#');
            grid2.set([x * 2, y], "#");
            grid2.set([x * 2 + 1, y], "#");
        }

        if (c === 'O') {
            grid1.set([x, y], 'O');
            grid2.set([x * 2, y], "[");
            grid2.set([x * 2 + 1, y], "]");
        }
    }
}

/* PART 1 */
performMoves(moves, attemptMove1, start, grid1);


let part1 = calculateGPS('O', grid1);

console.log(part1);

/* PART 2 */

let [x, y] = start;

performMoves(moves, attemptMove2, [x * 2, y], grid2);

let part2 = calculateGPS('[', grid2);
console.log(part2);

function performMoves(moves, wasMoved, pos, grid) {
    for (let move of moves.split('')) {
        if (move === '\n') {
            continue;
        }

        let dir = toDir(move);
        let next = add(pos, dir);
        let nextChar = grid.at(next);

        if (nextChar === '.') {
            pos = next;
            continue;
        }

        if (nextChar === '#') {
            continue;
        }

        if (wasMoved(next, dir, grid)) {
            pos = next;
        }
    }
}

function attemptMove1(pos, dir, grid) {
    let next = pos;
    let nextChar = grid.at(next);

    do {
        next = add(next, dir);
        nextChar = grid.at(next);
    } while (nextChar === 'O');

    if (nextChar === '#') {
        return false;
    }

    grid.swap(pos, next);

    return true;
}

function attemptMove2(pos, dir, grid) {
    if (isHorizontal(dir)) {
        return attemptMoveHorizontal(pos, dir, grid);
    } else {
        if (canMoveVertical(pos, dir, grid)) {
            moveVertical(pos, dir, grid);

            return true;
        }

        return false;
    }
}

function attemptMoveHorizontal(pos, dir, grid) {
    let next = pos;
    let nextChar = grid.at(next);
    let backtrack = [pos];

    do {
        next = add(next, dir);
        backtrack.push(next);
        nextChar = grid.at(next);
    } while (nextChar === '[' || nextChar === ']');

    if (nextChar === '#') {
        return false;
    }

    nextChar = '.';

    for (let b of backtrack) {
        let c = grid.at(b);
        grid.set(b, nextChar);
        nextChar = c;
    }

    return true;
}

function canMoveVertical(pos, dir, grid) {
    let c = grid.at(pos);

    if (c === '#') {
        return false;
    }

    if (c === '.') {
        return true;
    }

    let [x, y] = pos;

    if (c === '[') {
        x += 1;
    }

    if (c === ']') {
        x -= 1;
    }

    if (canMoveVertical(add(pos, dir), dir, grid)
        && canMoveVertical(add([x,y], dir), dir, grid)
    ) {
        return true;
    }

    return false;
}

function moveVertical(pos, dir, grid) {
    let c = grid.at(pos);

    if (c === '.') {
        return;
    }

    let next = add(pos, dir);

    let [x, y] = pos;

    if (c === '[') {
        x += 1;
    }

    if (c === ']') {
        x -= 1;
    }

    moveVertical(next, dir, grid);
    moveVertical(add([x, y], dir), dir, grid);

    grid.swap(pos, next);
    grid.swap([x, y], add([x, y], dir));
}

function calculateGPS(c, grid) {
    let sum = 0;
    for (let y = 0; y < grid.height; y++) {
        for (let x = 0; x < grid.width; x++) {
            if (grid.at([x, y]) === c) {
                sum += 100 * y + x;
            }
        }
    }

    return sum;
}

function toDir(char) {
    switch (char) {
        case '^':
            return [0, -1];
        case 'v':
            return [0, 1];
        case '>':
            return [1, 0];
        case '<':
            return [-1, 0];

        default:
            throw new Error('Invalid direction');
    }
}

function add([ax, ay], [bx, by]) {
    return [ax + bx, ay + by];
}

function isHorizontal(dir) {
    return dir[0] !== 0;
}

