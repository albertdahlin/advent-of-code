import fs from 'node:fs';

const input = fs.readFileSync(0, 'utf-8');


let part1 = 0;
let part2 = 0;

let grid = [];

let row = 0;
let col = 0;

for (const line of input.split('\n')) {
    if (!line) {
        break;
    }
    col = 0;
    for (const c of line.split('')) {
        if (grid[row] === undefined) {
            grid[row] = [];
        }
        grid[row][col] = c;
        col++;
    }
    row++;
}

function getWord(len, getChar) {
    let letters = [];
    for (let i = 0; i < len; i++) {
        let c = getChar(i);

        if (c === undefined) {
            return undefined;
        }

        letters.push(c);
    }

    return letters.join('');
}

function gridAt(row, col) {
    if (grid[row] === undefined) {
        return undefined;
    }

    return grid[row][col];
}

function count(word, row, col) {
    let words = [];

    let c = gridAt(row, col);

    if (c !== 'X') {
        return 0;
    }

    const len = word.length;

    words.push(getWord(len, (i) => gridAt(row + i, col)));
    words.push(getWord(len, (i) => gridAt(row - i, col)));
    words.push(getWord(len, (i) => gridAt(row, col + i)));
    words.push(getWord(len, (i) => gridAt(row, col - i)));

    words.push(getWord(len, (i) => gridAt(row + i, col + i)));
    words.push(getWord(len, (i) => gridAt(row + i, col - i)));
    words.push(getWord(len, (i) => gridAt(row - i, col + i)));
    words.push(getWord(len, (i) => gridAt(row - i, col - i)));

    words = words.filter((w) => w === word);

    return words.length;
}

for (row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
        part1 += count('XMAS', row, col);
    }
}

for (row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
        let c = gridAt(row, col);

        if (c !== 'A') {
            continue;
        }

        let tl = gridAt(row - 1, col - 1);
        let tr = gridAt(row - 1, col + 1);
        let bl = gridAt(row + 1, col - 1);
        let br = gridAt(row + 1, col + 1);

        let w1 = [tl, br];
        let w2 = [tr, bl];

        w1 = w1.sort().join('');
        w2 = w2.sort().join('');

        if (w1 == 'MS' && w2 == 'MS') {
            part2++;
        }
    }
}

console.log(part1);
console.log(part2);

