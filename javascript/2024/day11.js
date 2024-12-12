import fs from 'node:fs';
import { toInt, parseNumbers } from '../util.js';

const input = fs.readFileSync(0, 'utf-8').trim();

const nums = parseNumbers(input);

let part1 = 0;
let part2 = 0;
let cache = new Map();

for (let n of nums) {
    part1 += countStones(n, 25);
    part2 += countStones(n, 75);
}

console.log(part1);
console.log(part2);

function countStones(n, count) {
    const key = `${n},${count}`;
    let len = cache.get(key);

    if (len) {
        return len;
    }

    len = 1;

    for (let i = 0; i < count; i++) {
        if (n === 0) {
            n = 1;
            continue;
        }

        let s = n.toString();
        if (s.length % 2 === 0) {
            const l = s.length / 2;
            n = toInt(s.slice(0, l));
            len += countStones(toInt(s.slice(l)), count - i - 1);
            continue;
        }

        n *= 2024;
    }

    cache.set(key, len);

    return len;
}


