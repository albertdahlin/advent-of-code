import fs from 'node:fs';
import { toInt, parseNumbers, Grid } from '../util.js';

const rows = fs.readFileSync(0, 'utf-8')
    .trim()
    .split('\n')
    .map(row => row.split(''));

let width = rows[0].length;
let height = rows.length;

const grid = new Grid(width, height);

let start = null;
let end = null;

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        let c = rows[y][x];

        if (c === 'S') {
            start = [x, y];
        }

        if (c === 'E') {
            end = [x, y];
            grid.set([x, y], 'E');
        }

        if (c === '#') {
            grid.set([x, y], '#');
        }

    }
}

let visited = new Map();
let paths = [];
let bestScore = undefined;

search(start, 1, 0, [start]);

let set = new Set();

for (let [score, path] of paths) {
    if (score > bestScore) {
        continue;
    }

    for (let p of path) {
        set.add(p.join(','));
        grid.set(p, 'O');
    }
}

console.log(bestScore);
console.log(set.size);

function search(pos, dir, score, path) {
    if (bestScore !== undefined && score > bestScore) {
        return;
    }

    while (true) {
        let c = grid.at(pos);

        if (c === '#') {
            return;
        }

        let key = [...pos, dir].join(',');

        let best = visited.get(key);

        if (best < score) {
            return;
        }

        visited.set(key, score);
        path.push(pos);

        if (c === 'E') {
            if (bestScore === undefined || score <= bestScore) {
                bestScore = score;
                paths.push([score, path]);
            }
            return;
        }

        search(pos, turnLeft(dir), score + 1000, Array.from(path));
        search(pos, turnRight(dir), score + 1000, Array.from(path));

        score += 1;
        pos = next(pos, dir);
    }
}


function turnLeft(dir) {
    return (dir + 3) % 4;
}

function turnRight(dir) {
    return (dir + 1) % 4;
}

function next([x, y], dir) {
    switch (dir) {
        case 0: return [x, y - 1];
        case 1: return [x + 1, y];
        case 2: return [x, y + 1];
        case 3: return [x - 1, y];
    }
}