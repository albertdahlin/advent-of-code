import fs from 'node:fs';
import { toInt, parseNumbers, Grid } from '../util.js';

let [ available, designs ] = fs.readFileSync(0, 'utf-8')
    .trim()
    .split('\n\n');

available = available.split(/,\s*/);
designs = designs.split('\n');

let longest = Math.max(...available.map(t => t.length));
let towels = new Set(available);
let memo = new Map();

let part1 = 0;
let part2 = 0;

for (let design of designs) {
    let count = countPossible(design);
    part1 += count > 0;
    part2 += count;
}

console.log(part1);
console.log(part2);

function countPossible(design) {
    if (memo.has(design)) {
        return memo.get(design);
    }

    let count = 0;

    for (let len = Math.min(longest, design.length); len > 0; len--) {
        let candidate = design.slice(-len);

        if (!towels.has(candidate)) {
            continue;
        }

        let next = design.slice(0, -len);

        if (next.length === 0) {
            count += 1;
            continue;
        }

        count += countPossible(next);
    }

    memo.set(design, count);

    return count;
}
