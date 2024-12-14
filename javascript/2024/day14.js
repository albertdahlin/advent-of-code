import fs from 'node:fs';
import { toInt, parseNumbers } from '../util.js';

const input = fs.readFileSync(0, 'utf-8').trim();


const robots = [];

for (let line of input.split('\n')) {
    if (line === '') {
        continue;
    }
    robots.push(parseNumbers(line));
}

let width = 101;
let height = 103;

if (robots.length < 20) {
    // Test input
    width = 11;
    height = 7;
}

/* PART 1 */

let r1 = robots;

for (let t = 0; t < 100; t++) {
    r1 = tick(r1);
}

let middleX = Math.floor(width / 2);
let middleY = Math.floor(height / 2);

let quadrant = [0, 0, 0, 0];

for (const r of r1) {
    let [x, y] = r;

    if (x === middleX || y === middleY) {
        continue
    }

    let q = 0;

    if (x > middleX) {
        q += 1;
    }

    if (y > middleY) {
        q += 2;
    }

    quadrant[q] += 1;
}

let part1 = quadrant.reduce((a, b) => a * b, 1);

console.log(part1);

/* PART 2 */


let t = 0;
let r2 = robots;
let treeBox = [ 32, 63, 38, 71 ];
let part2 = 0;

for (t = 1; t < 200000; t++) {
    r2 = tick(r2);

    if (!isXmasTree(r2)) {
        continue;
    }

    part2 = t;
    // print(r2);
    break;
}

console.log(part2);

function isXmasTree(robots) {
    let count = 0;
    let [xmin, xmax, ymin, ymax] = treeBox;

    for (const [x, y] of robots) {
        if (y < ymin || y >= ymax) {
            continue;
        }

        if (x < xmin || x >= xmax) {
            continue;
        }
        count += 1;
    }

    return count >= 353;
}

function print(robots) {
    let grid = Array(height)
        .fill()
        .map(() => Array(width).fill('.'));

    for (let [x, y] of robots) {
        grid[y][x] = '#';
    }

    for (let row of grid) {
        console.log(row.join(''));
    };
}

function tick(robots) {
    const result = [];

    for (let [x, y, vx, vy] of robots) {
        x = (width + x + vx) % width;
        y = (height + y + vy) % height;

        result.push([x, y, vx, vy]);
    }

    return result;
}
