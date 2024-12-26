import fs from 'node:fs';
import { toInt, parseNumbers, Grid } from '../util.js';

let schematics = fs.readFileSync(0, 'utf-8')
    .trim()
    .split('\n\n')

let keys = [];
let locks = [];

for (let schematic of schematics) {
    let rows = schematic.split('\n');
    let heights = Array(5);
    let isKey = false;
    for (let r = 0; r < rows.length - 1; r++) {
        let row = rows[r];
        let columns = row.split('');

        if (r == 0) {
            if (row == '#####') {
                heights.fill(0);
            } else {
                heights.fill(0);
                isKey = true;
            }
            continue;
        }
        for (let c = 0; c < columns.length; c++) {
            if (columns[c] == '#') {
                heights[c] += 1;
            }
        }
    }
    if (isKey) {
        keys.push(heights);
    } else {
        locks.push(heights);
    }
}

let part1 = 0;

for (let lock of locks) {
    for (let key of keys) {
        let isMatch = true
        for (let col = 0; col < 5; col++) {
            let diff = lock[col] + key[col];
            if (diff > 5) {
                isMatch = false;
                break;
            }
        }

        if (isMatch) {
            part1 += 1;
        }
    }
}

console.log(part1);
