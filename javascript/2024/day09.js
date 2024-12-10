import fs from 'node:fs';
import { toInt, parseNumbers } from '../util.js';

const input = fs.readFileSync(0, 'utf-8').trim();

const nums = input.split('').map(toInt);



let part1 = 0;

let idLow = 0;
let idHigh = (nums.length - 1) / 2;
let highLen = nums[idHigh * 2];

let idx = 0;
while (idLow < idHigh) {
    let blockLen = nums[idLow * 2];

    part1 += getChecksumPart(blockLen, idx, idLow);
    idx += blockLen;

    let freeLen = nums[idLow * 2 + 1];

    while (freeLen > 0) {
        if (freeLen < highLen) {
            part1 += getChecksumPart(freeLen, idx, idHigh);
            idx += freeLen;
            highLen -= freeLen;
            break;
        } else {
            part1 += getChecksumPart(highLen, idx, idHigh);
            idx += highLen;
            freeLen -= highLen;
            idHigh -= 1;
            highLen = nums[idHigh * 2];
        }
    }

    idLow += 1;
}

part1 += getChecksumPart(highLen, idx, idHigh);

console.log(part1);

function getChecksumPart(len, idx, id) {

    const r = (getSum(len - 1) + idx * len) * id;
    return r;
}

function getSum(n) {
    return n * (n + 1) / 2;
}



let part2 = [];


for (let id = 0; id < nums.length / 2; id++) {
    let block = nums[id * 2];

    part2.push({
        id,
        len: block,
        free: false,
    });

    let free = nums[id * 2 + 1];

    if (!free) {
        continue;
    }

    part2.push({
        len: free,
        free: true,
        blocks: [],
    });
}

for (let i = part2.length - 1; i > 0; i--) {
    let block = part2[i];

    if (block.free) {
        continue;
    }

    for (let j = 0; j < part2.length; j++) {
        if (j === i) {
            break;
        }

        let free = part2[j];

        if (!free.free) {
            continue;
        }

        if (free.len < block.len) {
            continue;
        }

        part2[i] = {
            len: block.len,
            free: true,
            blocks: [],
        }
        part2[j].len -= block.len;
        part2[j].blocks.push(block);
        break;
    }
}

let sum = 0;

idx = 0;
for (const block of part2) {
    if (block.free) {
        for (const b of block.blocks) {
            for (let i = 0; i < b.len; i++) {
                sum += b.id * idx;
                idx += 1;
            }
        }
        idx += block.len
    } else {
        for (let i = 0; i < block.len; i++) {
            sum += block.id * idx;
            idx += 1;
        }
    }
}


console.log(sum);

