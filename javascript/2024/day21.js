import fs from 'node:fs';
import { toInt, parseNumbers, Grid } from '../util.js';

let rows = fs.readFileSync(0, 'utf-8')
    .trim()
    .split('\n')

const num = [
    [7, 8, 9],
    [4, 5, 6],
    [1, 2, 3],
    ['X', 0, 'A'],
];

const arrows = [
    ['X', '^', 'A'],
    ['<', 'v', '>'],

]

const numPos = new Map();

for (let y = 0; y < num.length; y++) {
    for (let x = 0; x < num[y].length; x++) {
        let c = num[y][x];
        if (c === undefined) {
            continue;
        }
        numPos.set(c, [x, y]);
        numPos.set(c.toString(), [x, y]);
    }
}

const moves = new Map();
moves.set('A^', ['<']);
moves.set('A>', ['v']);
moves.set('Av', ['<v', 'v<']);
moves.set('A<', ['v<<', '<v<']);
moves.set('AA', []);
moves.set('^v', ['v']);
moves.set('^<', ['v<']);
moves.set('^>', ['>v', 'v>']);
moves.set('^A', ['>']);
moves.set('^^', []);
moves.set('v<', ['<']);
moves.set('v>', ['>']);
moves.set('v^', ['^']);
moves.set('vA', ['^>', '>^']);
moves.set('vv', []);
moves.set('<>', ['>>']);
moves.set('<v', ['>']);
moves.set('<^', ['>^']);
moves.set('<A', ['>>^', '>^>']);
moves.set('<<', []);
moves.set('><', ['<<']);
moves.set('>v', ['<']);
moves.set('>^', ['<^', '^<']);
moves.set('>A', ['^']);
moves.set('>>', []);

let part1 = 0;
let part2 = 0;

let mem = new Map();
let robotCount = 25;

for (let row of rows) {
    let prevKey = 'A';
    let sum1 = 0;
    let sum2 = 0;
    let num = toInt(row.split('').filter(key => key !== 'A').join(''));

    for (let key of row.split('')) {
        let shortest1 = Infinity;
        let shortest2 = Infinity;
        let paths = pathsBetween(numPos.get(prevKey), numPos.get(key), [0, 3]);

        for (let path of paths) {
            path = path.join('') + 'A';
            let len = sequenceLength(path, 'A', 2);
            if (len <= shortest1) {
                shortest1 = len;
            }
            len = sequenceLength(path, 'A', 25);
            if (len <= shortest2) {
                shortest2 = len;
            }
            continue;
        }

        prevKey = key;
        sum1 += shortest1;
        sum2 += shortest2;
    }

    part1 += sum1 * num;
    part2 += sum2 * num;
}

console.log(part1);
console.log(part2);

function sequenceLength(path, b = 'A', limit = 2) {
    let key = [path, b, limit].join(',');
    if (mem.has(key)) {
        return mem.get(key);
    }
    if (limit === 0) {
        return path.length;
    }

    let len = 0;

    for (let i = 0; i < path.length; i++) {
        let button = path[i];
        let nextPaths = moves.get(b + button);
        let shortest = Infinity;
        for (let nextPath of nextPaths) {
            let ll = sequenceLength(nextPath + 'A', 'A', limit - 1);

            if (ll < shortest) {
                shortest = ll;
            }
        }
        if (nextPaths.length === 0) {
            len += 1;
        } else {
            len += shortest;
        }
        b = button;
    }

    mem.set(key, len);

    return len;
}


process.exit(0);


function pathsBetween(pos1, pos2, forbidden) {
    let dx = pos2[0] - pos1[0];
    let dy = pos2[1] - pos1[1];

    let hor = '<';

    if (dx > 0) {
        hor = '>';
    }

    let vert = '^';

    if (dy > 0) {
        vert = 'v';
    }

    if (dx === 0) {
        return [Array(Math.abs(dy)).fill(vert)];
    }

    if (dy === 0) {
        return [Array(Math.abs(dx)).fill(hor)];
    }

    let set = new Map();

    for (let x = 0; x <= Math.abs(dx); x++) {
        for (let y = 0; y <= Math.abs(dy); y++) {
            let t =
                [ ...Array(x).fill(hor)
                , ...Array(y).fill(vert)
                , ...Array(Math.abs(dx) - x).fill(hor)
                , ...Array(Math.abs(dy) - y).fill(vert)
                ]

            set.setVec(t, t);

            t =
                [ ...Array(y).fill(vert)
                , ...Array(x).fill(hor)
                , ...Array(Math.abs(dy) - y).fill(vert)
                , ...Array(Math.abs(dx) - x).fill(hor)
                ]
            set.setVec(t, t);
        }
    }

    return Array.from(set.values()).filter(path => isGood(path, pos1, forbidden));
}

function isGood(path, pos, forbidden) {
    for (let dir of path) {
        if (pos[0] === forbidden[0] && pos[1] === forbidden[1]) {
            return false;
        }
        pos = next(pos, dir);
    }

    return true;
}

function next([x, y], dir) {
    switch (dir) {
        case '^': return [x, y - 1];
        case '>': return [x + 1, y];
        case 'v': return [x, y + 1];
        case '<': return [x - 1, y];
    }
}
