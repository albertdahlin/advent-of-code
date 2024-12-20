import fs from 'node:fs';
import { toInt, parseNumbers, Grid } from '../util.js';

const input = fs.readFileSync(0, 'utf-8')
    .trim()
    .split('\n')
    .map(row => parseNumbers(row));

let size = 71;
let end = [size - 1, size - 1];

let grid = new Grid(size, size);

for (let p of input.slice(0, 1024)) {
    grid.set(p, '#');
}

let visited = new Map();
findEnd([0, 0], 0);
console.log(visited.getVec(end));

let max = input.length - 1;
let idx = 1024;
let min = 1024;

while (max - min > 1) {
    visited = new Map();
    grid = new Grid(size, size);
    setUntil(idx, grid);
    findEnd([0, 0], 0);
    let dist = visited.getVec(end);

    if (dist === undefined) {
        max = idx;
        idx = Math.floor((idx + min) / 2);
    } else {
        min = idx;
        idx = Math.floor((idx + max) / 2);
    }
}

console.log(input[idx].join(','));

function setUntil(n, grid) {
    for (let p of input.slice(0, n)) {
        grid.set(p, '#');
    }
}

function findEnd(pos, dist) {

    for (let [dx, dy] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
        let newPos = [pos[0] + dx, pos[1] + dy];
        let newDist = dist + 1;

        if (visited.getVec(newPos) <= newDist) {
            continue;
        }
        let c = grid.at(newPos);

        if (c === undefined || c === '#') {
            continue;
        }

        visited.setVec(newPos, newDist);

        findEnd(newPos, newDist);
    }
}
