import fs from 'node:fs';
import { toInt, parseNumbers, Grid } from '../util.js';

let [init, connections] = fs.readFileSync(0, 'utf-8')
    .trim()
    .split('\n\n')

let values = new Map();

for (let line of init.split('\n')) {
    let [key, value] = line.split(': ');
    values.set(key, toInt(value));
}

let output = new Map();

for (let line of connections.split('\n')) {
    let [a, op, b, out] = line.split(/\W+/);
    output.set(out, {a, op, b, out});
}

let part1 = getNum('z', findOutput(new Map(values), new Map(output)))

let x = getNum('x', values);
let y = getNum('y', values);
let part2 = 0;
let wrong = new Set();
let gatesByInput = new Map();

for (let [out, {a, op, b}] of output) {
    if (!gatesByInput.has(a)) {
        gatesByInput.set(a, new Set());
    }
    if (!gatesByInput.has(b)) {
        gatesByInput.set(b, new Set());
    }
    gatesByInput.get(a).add(out);
    gatesByInput.get(b).add(out);
}
let miss = new Set();
for (let gate of output.values()) {
    if (gate.a.startsWith('x') || gate.a.startsWith('y')) {
        if (gate.op == 'XOR') {
        }
    }
    if (gate.out.startsWith('z') && gate.op != 'XOR') {
        if (gate.out == 'z45') {
            continue;
        }
        miss.add(gate.out);
    }
    if (gate.op == 'AND') {
        if (gate.a.startsWith('x') || gate.a.startsWith('y')) {
            let abc = gatesByInput.get(gate.out);
            console.log(gate, abc);
        }
    }
    if (gate.op == 'XOR') {
        if (gate.a.startsWith('x') || gate.a.startsWith('y')) {
            continue;
        }
        if (gate.out.startsWith('z')) {
            continue;
        }
        miss.add(gate.out);
    }
}
let p2 = ['z24', 'z20', 'z09'];
miss.add('rvc');
miss.add('rrs');
console.log(Array.from(miss).sort().join(','));
process.exit(0);

for (let k of output.keys()) {
    if (k.startsWith('z')) {
        let n = parseInt(k.replace('z', ''));
        if (n < 2) {
            continue;
        }
        if (n >= 45) {
            continue;
        }

        if (!find(k, output, wrong)) {
            console.log(k);
        }
    }
}
wrong.delete('qpb');
wrong.delete('tdt');
console.log(Array.from(wrong).sort().join(','));
process.exit(0);

let wires = Array.from(output.keys())
for (let pairs of getPairs(wires.length)) {
    for (let swap of getGroups4(pairs)) {
        let swapped = new Map(output);
        let key = [];
        for (let [a, b] of swap) {
            let k1 = wires[a];
            let k2 = wires[b];
            key.push(k1);
            key.push(k2);
            swapped.set(k1, output.get(k2));
            swapped.set(k2, output.get(k1));
        }
        let o = findOutput(new Map(values), swapped);
        if (!o) {
            continue;
        }
        let z = getNum('z', o);

        //if ((x & y) == z) {
        if ((x + y) == z) {
            console.log(key.sort().join(','));
            process.exit(0);
        }
    }
    part2++;
    if (part2 % 1000 == 0) {
        console.log(part2);
    }
}


function findOutput(values, output) {
    let lastLen = output.size;
    while (output.size > 0) {
        for (let [out, {a, op, b}] of output) {
            if (values.has(out)) {
                output.delete(out);
                continue;
            }
            let aa = values.get(a);
            let bb = values.get(b);

            if (aa === undefined || bb === undefined) {
                continue;
            }

            let value = 0;

            if (op == 'AND') {
                value = (aa && bb);
            } else if (op == 'OR') {
                value = (aa || bb);
            } else if (op == 'XOR') {
                value = (aa ^ bb);
            }

            values.set(out, value);
            output.delete(out);
        }
        if (lastLen == output.size) {
            return false;
        }
        lastLen = output.size;
    }

    return values;
}

function getNum(k, values) {
    let z = [];

    for (let [key, val] of values) {
        if (key.startsWith(k)) {
            z.push([key, val]);
        }
    }
    z.sort((a, b) => b[0].localeCompare(a[0]));

    let num = 0;

    for (let [_, val] of z) {
        num = (num * 2) + val;
    }

    return num;
}

function *getPairs(max, n) {
    for (let a1 = 0; a1 < max; a1++) {
        for (let a2 = a1 + 1; a2 < max; a2++) {
            for (let a3 = a2 + 1; a3 < max; a3++) {
                for (let a4 = a3 + 1; a4 < max; a4++) {
                    for (let a5 = a4 + 1; a5 < max; a5++) {
                        for (let a6 = a5 + 1; a6 < max; a6++) {
                            for (let a7 = a6 + 1; a7 < max; a7++) {
                                for (let a8 = a7 + 1; a8 < max; a8++) {
                                    yield [a1, a2, a3, a4, a5, a6, a7, a8];
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function *getGroups(set, list = []) {
    let lll = Array.from(set);

    if (lll.length == 0) {
        yield list;
        return;
    }

    for (let n1 = 0; n1 < lll.length; n1++) {
        for (let n2 = n1 + 1; n2 < lll.length; n2++) {
            let v1 = lll[n1];
            let v2 = lll[n2];
            let set2 = new Set(set);
            set2.delete(v1);
            set2.delete(v2);

            yield *getGroups(set2, [...list, [v1, v2]]);
        }
    }
}

function *getGroups2([a, b, c, d]) {
    yield [[a, b], [c, d]];
    yield [[a, c], [b, d]];
    yield [[a, d], [b, c]];
}

function *getGroups4([a, b, c, d, e, f, g, h]) {
    yield [[a, b], [c, d], [e, f], [g, h]];
    yield [[a, b], [c, e], [d, f], [g, h]];
    yield [[a, b], [c, f], [d, e], [g, h]];
    yield [[a, b], [c, g], [d, h], [e, f]];
    yield [[a, b], [c, h], [d, g], [e, f]];
    yield [[a, c], [b, d], [e, f], [g, h]];
    yield [[a, c], [b, e], [d, f], [g, h]];
    yield [[a, c], [b, f], [d, e], [g, h]];
    yield [[a, c], [b, g], [d, h], [e, f]];
    yield [[a, c], [b, h], [d, g], [e, f]];
    yield [[a, d], [b, e], [c, f], [g, h]];
    yield [[a, d], [b, f], [c, e], [g, h]];
    yield [[a, d], [b, g], [c, h], [e, f]];
    yield [[a, d], [b, h], [c, g], [e, f]];
    yield [[a, e], [b, f], [c, g], [d, h]];
    yield [[a, e], [b, g], [c, h], [d, f]];
    yield [[a, e], [b, h], [c, f], [d, g]];
    yield [[a, f], [b, g], [c, h], [d, e]];
    yield [[a, f], [b, h], [c, e], [d, g]];
    yield [[a, g], [b, h], [c, f], [d, e]];
}

function find(z, output, set) {
    let z1 = output.get(z);
    if (z1.op != 'XOR') {
        set.add(z);
        return false;
    }
    if (z1.a.startsWith('x') || z1.a.startsWith('y')) {
        set.add(z);
        return false;
    }
    if (z1.b.startsWith('x') || z1.b.startsWith('y')) {
        set.add(z1.b);
        return false;
    }

    let n = parseInt(z.replace('z', ''));
    let a = output.get(z1.a);
    let b = output.get(z1.b);

    let xor = null;
    let or = null;

    if (b.op == 'XOR' && a.op == 'OR') {
        xor = b;
        or = a;
    } else if (a.op == 'XOR' && b.op == 'OR') {
        xor = a;
        or = b;
    } else {
        if (a.op == 'AND') {
            set.add(z1.a);
        }
        if (b.op == 'AND') {
            set.add(z1.b);
        }
        return false;
    }

    let and1 = output.get(or.a);
    let and2 = output.get(or.b);
    if (and1.op != 'AND') {
        set.add(or.a);
    }
    if (and2.op != 'AND') {
        set.add(or.b);
    }

    let x1 = getReg('x', n - 1);
    let y1 = getReg('y', n - 1);

    let prev = null;
    let next = null;

    if (and1.a == x1 && and1.b == y1) {
        prev = and1;
        next = and2;
    } else if (and2.a == x1 && and2.b == y1) {
        prev = and2;
        next = and1;
    } else {
        return false;
    }

    return true;
}

function getReg(k, n) {
    if (n < 10) {
        return `${k}0${n}`;
    }

    return `${k}${n}`;
}
