import fs from 'node:fs';
import { toInt, parseNumbers } from '../util.js';

const input = fs.readFileSync(0, 'utf-8');


let part1 = 0;
let part2 = 0;
let tests = new Map();


for (const line of input.split('\n')) {
    let [target, ...nums] = parseNumbers(line);

    if (!target) {
        break;
    }

    if (search1(nums[0], nums.slice(1), target)) {
        part1 += target;
    }

    if (search2(nums[0], nums.slice(1), target)) {
        part2 += target;
    }
}


console.log(part1);
console.log(part2);

function search1(n, ns, target) {
    if (n > target) {
        return false;
    }

    if (ns.length > 0) {
        if (search1(n + ns[0], ns.slice(1), target)) {
            return true;
        }

        if (search1(n * ns[0], ns.slice(1), target)) {
            return true;
        }

        return false;
    }

    if (n === target) {
        return true;
    }

    return false;
}


function search2(n, ns, target) {
    if (n > target) {
        return false;
    }

    if (ns.length > 0) {
        if (search2(n + ns[0], ns.slice(1), target)) {
            return true;
        }

        if (search2(n * ns[0], ns.slice(1), target)) {
            return true;
        }

        n = toInt('' + n + ns[0]);

        if (search2(n, ns.slice(1), target)) {
            return true;
        }

        return false;
    }

    if (n === target) {
        return true;
    }

    return false;
}
