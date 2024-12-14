import fs from 'node:fs';
import { toInt, parseNumbers } from '../util.js';

const input = fs.readFileSync(0, 'utf-8').trim();


let nums = [];
let k = 10000000000000;
let part1 = 0;
let part2 = 0;

for (let line of input.split('\n')) {
    if (line === '') {
        continue;
    }

    let [x, y] = parseNumbers(line);
    nums.push([x, y]);

    if (nums.length === 3) {
        let [a, b, p] = nums;
        part1 += solve1(a, b, p);
        part2 += solve2(a, b, [p[0] + k, p[1] + k]);
        nums = [];
    }
}

console.log(part1);
console.log(part2);


/* Solution

Input is 3 vectors: a, b and p
The input can be thought of as two lines:
- Starting at (0, 0) with slope ay/ax
- Starting at (px, py) with slope by/bx

If the two lines intersects at (x, y) and x >= 0 AND x < px

Then the number of presses on
    a = x / ax
    b = (px - x) / bx


f1(x) = x * ay/ax
f2(x) = x * by/bx + k

py = px * by/bx + k

k = py - px * by/bx

f2(x) = x * by/bx + py - px * by/bx

f1(x) = f2(x)

x * ay/ax = x * by/bx + py - px * by/bx

x * ay/ax - x * by/bx = py - px * by/bx
x(ay/ax - by/bx) = py - px * by/bx

x = (py - px * by/bx) / (ay/ax - by/bx)

*/

function solve1(aa, bb, pp) {
    let [a, b] = buttonCount(aa, bb, pp);

    if (a !== undefined && b !== undefined && a < 100 && b < 100) {
        return a * 3 + b;
    }

    return 0;
}

function solve2(aa, bb, pp) {
    let [a, b] = buttonCount(aa, bb, pp);

    if (a !== undefined && b !== undefined) {
        return a * 3 + b;
    }

    return 0;
}

function buttonCount(aa, bb, pp) {
    let [ax, ay] = aa;
    let [bx, by] = bb;
    let [px, py] = pp;

    let k = py - px * by / bx;
    let x = Math.round((py - px * by / bx) / (ay / ax - by / bx));
    let a = Math.round(x / ax);
    let b = Math.round((px - x) / bx);

    if (x > px) {
        return [];
    }

    if (a < 0 || b < 0) {
        return [];
    }
    if (x % ax !== 0) {
        return [];
    }
    if ((px - x) % bx !== 0) {
        return [];
    }

    return [a, b];
}

