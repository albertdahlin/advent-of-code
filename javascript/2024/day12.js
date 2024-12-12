import fs from 'node:fs';
import { toInt, parseNumbers } from '../util.js';

const input = fs.readFileSync(0, 'utf-8').trim();

const grid = [];

let row = 0;

for (let line of input.split('\n')) {
    grid[row] = line.split('');
    row++;
}

const size = row;
const visited = new Map();

let part1 = 0;
let part2 = 0;

for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
        let plant = at(x, y);
        if (visited.hasVec([x,y])) {
            continue;
        }
        let [area, perimeter] = floodRegion(x, y, plant);
        part1 += area * perimeter.length;

        let sides = countSides(perimeter);
        part2 += area * sides;
    }
}

console.log(part1);
console.log(part2);


function floodRegion(x, y, plant, dir) {
    const thisPlant = at(x, y);

    if (thisPlant !== plant) {
        return [0, [[x, y, dir]]];
    }

    if (visited.hasVec([x, y])) {
        return [0, []];
    }

    visited.setVec([x, y], true);

    let area = 1;
    let perimeter = [];

    for (const [dx, dy, dir] of [
        [ 0, -1, 'U'],
        [ 0,  1, 'D'],
        [-1,  0, 'L'],
        [ 1,  0, 'R']
    ]) {
        let [a, p] = floodRegion(x + dx, y + dy, plant, dir);
        area += a;
        perimeter = perimeter.concat(p);
    }

    return [area, perimeter];
}

function at(x, y) {
    if (x < 0 || x >= size || y < 0 || y >= size) {
        return false;
    }

    return grid[y][x];
}

function countSides(perimeter) {
    let sides = 0;
    perimeter = Map.fromVec(perimeter);

    for (let [_, [x, y, d]] of perimeter) {
        removeLine(x, y, d, perimeter);
        sides++;
    }

    return sides;
}

function removeLine(x, y, dir, set) {
    if (dir === 'U' || dir === 'D') {
        removePoints(x, y, 1, 0, set, dir);
        removePoints(x, y, -1, 0, set, dir);
    }
    if (dir === 'L' || dir === 'R') {
        removePoints(x, y, 0, 1, set, dir);
        removePoints(x, y, 0, -1, set, dir);
    }

    set.deleteVec([x, y, dir]);
}

function removePoints(x, y, dx, dy, set, dir) {
    x += dx;
    y += dy;

    while (set.hasVec([x, y, dir])) {
        set.deleteVec([x, y, dir]);
        x += dx;
        y += dy;
    }
}
