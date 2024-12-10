
import fs from 'node:fs';
import { toInt, parseNumbers } from '../util.js';

const input = fs.readFileSync(0, 'utf-8').trim();

let row = 0;
let col = 0;
let grid = [];
let starts = [];

for (const c of input.trim()) {
    if (c === '\n') {
        row += 1;
        col = 0;
    } else {
        if (!grid[row]) {
            grid[row] = [];
        }
        let h = toInt(c);
        if (h === 0) {
            starts.push([row, col]);
        }
        grid[row][col] = h;
        col += 1;
    }
}

let size = grid[0].length;

let part1 = 0;
let part2 = 0;

for (const [row, col] of starts) {
    let [ p1, p2 ] = walk(row, col, new Set());
    part1 += p1;
    part2 += p2;
}

console.log(part1);
console.log(part2);

function heightAt(row, col) {
    if (row < 0 || row >= size || col < 0 || col >= size) {
        return undefined;
    }

    return grid[row][col];
}

function walk(row, col, visited) {
    let height = heightAt(row, col);

    if (height === undefined) {
        return [ 0, 0 ];
    }

    if (height == 9) {
        let key = `${row},${col}`;
        if (visited.has(key)) {
            return [ 0, 1 ];
        }
        visited.add(key);
        return [ 1, 1 ];
    }

    let part1 = 0;
    let part2 = 0;

    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        let nextHeight = heightAt(row + dr, col + dc);
        if (height + 1 === nextHeight) {
            let [ p1, p2 ] = walk(row + dr, col + dc, visited);
            part1 += p1;
            part2 += p2;
        }
    }

    return [ part1, part2 ];
}
