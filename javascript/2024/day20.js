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
        }

        if (c === '#') {
            grid.set([x, y], '#');
        }

    }
}

let visited = walk(start, grid);
let part1 = 0;

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        let c = grid.at([x, y]);

        if (c !== '#') {
            continue;
        }

        let left = [x - 1, y];
        let right = [x + 1, y];

        let savings = 0;

        if (grid.at(left) === '.' && grid.at(right) === '.') {
            savings = getSavings(right, left, visited);
        }

        let up = [x, y - 1];
        let down = [x, y + 1];

        if (grid.at(up) === '.' && grid.at(down) === '.') {
            savings = getSavings(down, up, visited);
        }

        if (savings >= 100) {
            part1 += 1;
        }
    }
}

console.log(part1);

process.exit(0);


let part2 = 0;
for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        let c = grid.at([x, y]);

        if (c !== '#') {
            continue;
        }

    }
}

console.log(part2);


function getSavings(cheatFrom, cheatTo, visited) {
    let f = visited.getVec(cheatFrom);
    let t = visited.getVec(cheatTo);
    let len = Math.abs(cheatFrom[0] - cheatTo[0]) + Math.abs(cheatFrom[1] - cheatTo[1]);
    return Math.abs(f - t) - len;
}


function walk(pos, grid, len = 0, visited = new Map()) {
    while (true) {
        let score = visited.getVec(pos);

        if (score !== undefined && score <= len) {
            return visited;
        }

        if (pos[0] == end[0] && pos[1] == end[1]) {
            visited.setVec(pos, len);
            return visited;
        }

        visited.setVec(pos, len);

        let adj = getAdj(pos, grid)
        adj = adj.filter(p => {
            let vv = visited.getVec(p);
            return vv === undefined || vv > len + 1;
        });

        if (adj.length === 0) {
            return visited;
        }

        if (adj.length === 1) {
            pos = adj[0];
            len += 1;
            continue;
        }

        for (let next of adj) {
            visited = walk(next, grid, len + 1, visited);
        }

        return visited;
    }
}

function getAdj(pos, grid) {
    let adj = grid.adjacent4(pos);
    return adj.filter(p => grid.at(p) === '.');
}
