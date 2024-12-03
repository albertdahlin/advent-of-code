import fs from 'node:fs';

const input = fs.readFileSync(0, 'utf-8');


let part1 = 0;
let part2 = 0;

for (const line of input.split('\n')) {
    if (!line) {
        break;
    }

    let levels = line.split(' ').map((l) => parseInt(l, 10));

    if (isSafe(levels)) {
        part1++;
        part2++;
        continue;
    }

    for (let i = 0; i < levels.length; i++) {
        let dampened = Array.from(levels);
        delete dampened[i];
        if (isSafe(dampened)) {
            part2++;
            break;
        }
    }
}

console.log(part1);
console.log(part2);

function isSafe(levels) {
    let prev = null;
    let isIncreasing = false;
    let isDecreasing = false;

    for (let level of levels) {
        if (level === undefined) {
            continue;
        }
        if (prev === null) {
            prev = level;
            continue;
        }

        let diff = level - prev;

        if (Math.abs(diff) > 3) {
            return false;
        }

        if (Math.abs(diff) < 1) {
            return false;
        }

        if (diff > 0 && !isDecreasing) {
            isIncreasing = true;
        } else if (diff < 0 && !isIncreasing) {
            isDecreasing = true;
        } else {
            return false;
        }
        prev = level;
    }

    return true;
}
