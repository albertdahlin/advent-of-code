import fs from 'node:fs';

const input = fs.readFileSync(0, 'utf-8');


let part1 = 0;
let part2 = 0;

let isEnabled = true;
for (const inst of input.matchAll(/mul\((\d+),(\d+)\)|do\(\)|don\'t\(\)/g)) {
    if (!inst) {
        break;
    }
    console.log(inst[0]);

    if (inst[0] === "do()") {
        isEnabled = true;
        continue;
    }

    if (inst[0] === "don't()") {
        isEnabled = false;
        continue;
    }

    let [a, b] = inst.slice(1).map((l) => parseInt(l, 10));

    part1 += a * b;

    if (!isEnabled) {
        continue;
    }

    part2 += a * b;
}

console.log(part1);
console.log(part2);

