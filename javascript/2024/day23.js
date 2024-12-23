import fs from 'node:fs';
import { toInt, parseNumbers, Grid } from '../util.js';

let rows = fs.readFileSync(0, 'utf-8')
    .trim()
    .split('\n')

let connection = new Map()

for (let row of rows) {
    let [a, b] = row.split('-')

    if (!connection.has(a)) {
        connection.set(a, new Set())
    }

    if (!connection.has(b)) {
        connection.set(b, new Set())
    }

    connection.get(a).add(b)
    connection.get(b).add(a)
}

let part1 = new Set();
let largestSet = new Set();

for (let [p1, peers] of connection.entries()) {
    let group = new Set(peers);
    group.add(p1);
    peers = Array.from(peers);

    for (let i = 0; i < peers.length; i++) {
        for (let j = i + 1; j < peers.length; j++) {
            let p2 = peers[i];
            let p3 = peers[j];

            if (!connection.get(p2).has(p3)) {
                group.delete(p3);
                continue;
            }

            if (!(p1.startsWith('t') || p2.startsWith('t') || p3.startsWith('t'))) {
                continue;
            }

            let chiefGroup = [p1, p2, p3].sort().join(',');
            part1.add(chiefGroup);
        }
    }
    if (group.size > largestSet.size) {
        largestSet = group;
    }
}

console.log(part1.size)
let password = Array.from(largestSet).sort().join(',');

console.log(password)
