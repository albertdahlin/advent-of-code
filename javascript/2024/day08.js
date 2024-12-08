import fs from 'node:fs';
import { toInt, parseNumbers } from '../util.js';

const input = fs.readFileSync(0, 'utf-8');


let antennas = new Map();

let row = 0;
let col = 0;
let part1 = new Set();
let part2 = new Set();

for (const line of input.split('\n')) {
    if (!line) {
        break;
    }
    col = 0;

    for (const c of line.split('')) {
        if (c === '.') {
            col += 1;
            continue;
        }

        let list = antennas.get(c);

        if (!list) {
            list = [];
            antennas.set(c, list);
        }
        list.push([col, row]);

        col += 1;
    }
    row += 1;
}

for (const [freq, coords] of antennas.entries()) {
    for (let [x1, y1] of coords) {
        part2.add(`${x1},${y1}`);

        for (let [x2, y2] of coords) {
            if (x1 === x2 && y1 === y2) {
                continue;
            }
            let dx = x1 - x2;
            let dy = y1 - y2;

            let ax = x1 + dx;
            let ay = y1 + dy;
            if (isOutside(ax, ay)) {
                continue;
            }
            part1.add(`${ax},${ay}`);

            while (true) {
                if (isOutside(ax, ay)) {
                    break;
                }

                part2.add(`${ax},${ay}`);

                ax += dx;
                ay += dy;
            }
        }
    }
}


console.log(part1.size);
console.log(part2.size);


function isOutside(x, y) {
    return x < 0 || x >= row || y < 0 || y >= col;
}
