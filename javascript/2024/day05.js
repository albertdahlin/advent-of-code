import fs from 'node:fs';
import * as Util from '../util.js';

const input = fs.readFileSync(0, 'utf-8');

let part1 = 0;
let part2 = 0;

let rules = new Map();
let updates = [];

let [rulesInput, updatesInput] = input.split('\n\n');

for (let line of rulesInput.split('\n')) {
    let [a, b] = line.split('|').map(Util.toInt);

    let nums = rules.get(a);

    if (!nums) {
        nums = [];
        rules.set(a, nums);
    }

    nums.push(b);
}

for (let update of updatesInput.split('\n')) {
    if (!update) {
        continue;
    }
    update = update.split(',').map(Util.toInt);
    updates.push(update);
}


for (let update of updates) {
    let fixed = fix(update);
    let middle = fixed[Math.floor(fixed.length / 2)];

    if (Array.isEqual(update, fixed)) {
        part1 += middle;
    } else {
        part2 += middle;
    }
}

function fix(update) {
    let fixed = Array.from(update);

    fixed.sort((a, b) => {
        let numsA = rules.get(a);
        let numsB = rules.get(b);

        if (numsA && numsA.includes(b)) {
            return -1;
        }

        if (numsB && numsB.includes(a)) {
            return 1;
        }

        return 0;
    });

    return fixed;
}

console.log(part1);
console.log(part2);

