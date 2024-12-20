import fs from 'node:fs';
import { toInt, parseNumbers, Grid } from '../util.js';

const input = fs.readFileSync(0, 'utf-8').trim().split('\n');


let program = parseNumbers(input[4]);

let ra = parseNumbers(input[0])[0];

let output = run(ra);
console.log(output.join(','));


let idx = program.length - 1;
let part2 = solve2(0, idx);

console.log(part2);

function solve2(ra, idx) {
    let x = 0;
    let best = Infinity;

    while (true) {
        let out = run(ra + x);
        let isCorrect = true;

        for (let i = 0; i < out.length; i++) {
            if (program[i + idx] !== out[i]) {
                isCorrect = false;
                break;
            }
        }

        if (isCorrect) {
            if (idx === 0) {
                return ra + x;
            }

            let v = solve2(ra * 8 + x, idx - 1);

            if (v < best) {
                best = v;
            }
        }

        x += 1;

        if (x === 8) {
            if (best === Infinity) {
                x = 0;
                ra += 8;
            } else {
                break;
            }
        }
    }

    return best;
}

function run(x) {
    let output = [];
    const state = {
        ra: x,
        rb: 0,
        rc: 0,
        ip: 0,
    }
    while (state.ip < (program.length - 1) && state.ip >= 0 ) {
        let op = program[state.ip];
        let a = program[state.ip + 1];
        perform(op, a, output, state);
    }

    return output;
}

function perform(op, a, output, state) {
    switch (op) {
        case 0:
            // adv
            a = combo(a, state);
            state.ra = Math.trunc(state.ra / Math.pow(2, a));
            break;

        case 1:
            // bxl
            state.rb = state.rb ^ a;
            break;

        case 2:
            // bst
            a = combo(a, state);
            state.rb = a % 8;
            break;

        case 3:
            // jnz
            if (state.ra !== 0) {
                state.ip = a;
                return;
            }

            break;

        case 4:
            // bxc
            state.rb = state.rb ^ state.rc;
            break;

        case 5:
            // out
            a = combo(a, state);
            output.push(a % 8);
            break;

        case 6:
            // bdv
            a = combo(a, state);
            state.rb = Math.trunc(state.ra / Math.pow(2, a)) % 8;
            break;

        case 7:
            // cdv
            a = combo(a, state);
            state.rc = Math.trunc(state.ra / Math.pow(2, a)) % 8;
            break;

        default:
            throw new Error('invalid operation');
    }

    state.ip += 2;
}


function combo(v, state) {
    if (v <= 3) {
        return v;
    }

    if (v === 4) {
        return state.ra;
    }

    if (v === 5) {
        return state.rb;
    }

    if (v === 6) {
        return state.rc;
    }

    if (v === 7) {
        throw new Error('invalid operand');
    }
}

