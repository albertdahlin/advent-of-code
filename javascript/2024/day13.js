import fs from 'node:fs';
import { toInt, parseNumbers } from '../util.js';

const input = fs.readFileSync(0, 'utf-8').trim();


let nums = [];
let machines = [];

for (let line of input.split('\n')) {
    if (line === '') {
        continue;
    }

    let [x, y] = parseNumbers(line);
    nums.push([x, y]);

    if (nums.length === 3) {
        machines.push(nums);
        nums = [];
    }
}

let part1 = 0;
let part2 = 0;

/* 
ax * a + bx * b = px + k
ay * a + by * b = py + k

ax = 94
ay = 34

bx = 22
by = 67

px = 10000000000000 + 8400
py = 10000000000000 + 5400

a(ax + ay) + b(bx + by) = px + py + 2k

a*ka + b*kb = kp

a + b*kb/ka = kp/ka

a = kp/ka - b*kb/ka
b = kp/kb - a*ka/kb


sub

ax * a + bx * b - px = 0
ay * a + by * b - py = 0

ax * a + bx * b - px = ay * a + by * b - py

a(ax - ay) + b(bx - by) = px - py


ka = ax - ay
kb = bx - by
kp = px - py

a*ka + b*kb = k + kp

b = (k + kp)/kb - a*ka / kb

*/

for (let [aa, bb, pp] of machines) {
    let [ax, ay] = aa;
    let [bx, by] = bb;
    let [px, py] = pp;

    let ka = ax - ay;
    let kb = bx - by;
    let kp = px - py;
    let k = 0;//10000000000000;
    let amax = 200;
    let a = 0;
    console.log('START', pp, amax);

    while (amax > 0) {
        let b = (k + kp) / kb - a * ka / kb;
        console.log(a, b, amax);

        if (b === kp) {
            console.log('BREAK', a, b);
            break;
        }
        if (a * b >= kp) {
            a -= amax;
        } else {
            a += amax;
        }
        amax = Math.floor(amax / 2);
    }
    continue;

    //px += 10000000000000;
    //py += 10000000000000;

    let apush = Math.floor(Math.min(px / ax, py / ay));
    let bpush = 0;
    let count = [];

    while (apush > 0) {
        apush--;
        bpush = Math.min((px - apush*ax) / bx, (py - apush *ay) / by);
        if (bpush > 100) {
            //continue;
        }
        if (apush > 100) {
            //break;
        }

        let x = (apush * ax) + (bpush * bx);
        let y = (apush * ay) + (bpush * by);

        if ((x -px + y - py) === 0) {
            count.push([apush, bpush]);
            //console.log(apush, bpush, x, y, px, py);
        }



    }

    if (count.length === 0) {
        continue;
    }
    console.log(count, ax, ay, bx, by, px, py);

    let lowestToken = 999999999;

    for (let [a, b] of count) {
        let token = a * 3 + b;
        lowestToken = Math.min(token, lowestToken);
    }

    part1 += lowestToken;
}

console.log(part1);
console.log(part2);
