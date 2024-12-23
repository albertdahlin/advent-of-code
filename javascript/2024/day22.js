import fs from 'node:fs';
import { toInt, parseNumbers, Grid } from '../util.js';

let rows = fs.readFileSync(0, 'utf-8')
    .trim()
    .split('\n')


let part1 = 0;
let totalBySequence = new Map();

for (let row of rows) {
    let secret = toInt(row);
    let prevPrice = secret % 10;
    let sequence = Array(4);
    let sequencesSeen = new Set();

    for (let i = 0; i < 2000; i++) {
        secret = next(secret);

        let price = secret % 10;
        let diff = price - prevPrice;
        prevPrice = price;
        push(diff, sequence);

        if (i < 4) {
            continue;
        }

        let key = sequence.join(',');

        if (sequencesSeen.has(key)) {
            continue;
        }

        sequencesSeen.add(key);

        let total = totalBySequence.get(key) || 0;
        totalBySequence.set(key, total + price);
    }

    part1 += secret;
}


console.log(part1);
console.log(Math.max(...totalBySequence.values()));


function push(n, sequence) {
    for (let i = 0; i < sequence.length - 1; i++) {
        sequence[i] = sequence[i + 1];
    }

    sequence[sequence.length - 1] = n;
}


function next(n) {
    // Some performance optimizations:
    // 16777216 is 2^24, or 0x1000000 in hex.
    // x % 0x1000000 can be converted to x & 0xFFFFFF (0x1000000 - 1)
    // Multiplication and division can be converted to bit shift operations
    // since we're dealing with powers of 2.
    n ^= (n << 6);
    n &= 0xFFFFFF;
    n ^= (n >> 5);
    n &= 0xFFFFFF;
    n ^= (n << 11);
    n &= 0xFFFFFF;

    return n;
}
