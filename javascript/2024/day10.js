
import fs from 'node:fs';
import { toInt, parseNumbers } from '../util.js';

const input = fs.readFileSync(0, 'utf-8').trim();

let row = 0;
let col = 0;
let grid = [];
let starts = [];

for (const c of input) {
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
        return 0;
    }

    return grid[row][col];
}

function walk(row, col, visited) {
    if (row < 0 || row >= size || col < 0 || col >= size) {
        return [ 0, 0 ];
    }

    let h = heightAt(row, col);
    let key = `${row},${col}`;

    if (h == 9) {
        if (visited.has(key)) {
            return [ 0, 1 ];
        }
        visited.add(key);
        return [ 1, 1 ];
    }

    h += 1;

    let part1 = 0;
    let part2 = 0;

    let up = heightAt(row - 1, col);
    let down = heightAt(row + 1, col);
    let left = heightAt(row, col - 1);
    let right = heightAt(row, col + 1);

    if (up === h) {
        let [ p1, p2 ] = walk(row - 1, col, visited);
        part1 += p1;
        part2 += p2;
    }

    if (down === h) {
        let [ p1, p2 ] = walk(row + 1, col, visited);
        part1 += p1;
        part2 += p2;
    }

    if (left === h) {
        let [ p1, p2 ] = walk(row, col - 1, visited);
        part1 += p1;
        part2 += p2;
    }

    if (right === h) {
        let [ p1, p2 ] = walk(row, col + 1, visited);
        part1 += p1;
        part2 += p2;
    }

    return [ part1, part2 ];
}
