
import fs from 'node:fs';

const input = fs.readFileSync(0, 'utf-8');


const left = [];
const right = [];

for (const line of input.split('\n')) {
    if (!line) {
        break;
    }

    let [l, r] = line.split(/\s+/);

    l = parseInt(l);
    r = parseInt(r);
    left.push(l);
    right.push(r);
}

// Part 1

left.sort();
right.sort();

let result = 0;

for (let i = 0; i < left.length; i++) {
    result += Math.abs(left[i] - right[i]);
}

console.log(result);


// Part 2

const freq = new Map();

for (let r of right) {
    let f = freq.get(r);
    freq.set(r, f ? f + 1 : 1);
}

result = 0;

for (let l of left) {
    let f = freq.get(l) || 0;
    result += l * freq.get(l) || 0;
}

console.log(result);
