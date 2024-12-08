#include <stdio.h>
#include <stdlib.h>

#define SIZE 150
char grid[SIZE][SIZE];
int width = 0;
int height = 0;
const char xmas[] = "XMAS";

char charAt(int row, int col)
{
    if (row < 0 || row >= height || col < 0 || col >= width) {
        return 0;
    }

    return grid[row][col];
}

int isXmas(int row, int col, int dr, int dc)
{

    for (size_t i = 1; i < sizeof(xmas) - 1; i++) {
        row += dr;
        col += dc;
        char c = charAt(row, col);

        if (c != xmas[i]) {
            return 0;
        }
    }

    return 1;
}

int countXmasAt(int row, int col)
{
    int count = 0;

    // Check vertical, horizontal
    count += isXmas(row, col, -1, 0);
    count += isXmas(row, col, 1, 0);
    count += isXmas(row, col, 0, -1);
    count += isXmas(row, col, 0, 1);

    // Check diagonals
    count += isXmas(row, col, 1, 1);
    count += isXmas(row, col, 1, -1);
    count += isXmas(row, col, -1, -1);
    count += isXmas(row, col, -1, 1);

    return count;
}

int isCross(char a, char b)
{
    if (a == 'M' && b == 'S') {
        return 1;
    }

    if (a == 'S' && b == 'M') {
        return 1;
    }

    return 0;
}

int main()
{
    int part1 = 0;
    int part2 = 0;

    int row = 0;
    int col = 0;

    while (!feof(stdin)) {
        char c = fgetc(stdin);

        if (c == EOF) {
            break;
        }
        if (c == '\n') {
            width = col;
            col = 0;
            row++;
            if (row >= SIZE) {
                fprintf(stderr, "To many rows\n");
                return 1;
            }
            continue;
        }
        grid[row][col] = c;
        col++;

        if (col >= SIZE) {
            fprintf(stderr, "To many columns\n");
            return 1;
        }
    }

    height = row;

    for (row = 0; row < height; row++) {
        for (col = 0; col < width; col++) {
            char c = grid[row][col];

            if (c != 'X') {
                continue;
            }

            part1 += countXmasAt(row, col);
        }
    }

    for (row = 0; row < height; row++) {
        for (col = 0; col < width; col++) {
            char c = grid[row][col];

            if (c != 'A') {
                continue;
            }

            char tl = charAt(row - 1, col - 1);
            char tr = charAt(row - 1, col + 1);
            char bl = charAt(row + 1, col - 1);
            char br = charAt(row + 1, col + 1);

            if (tl && tr && bl && br == 0) {
                continue;
            }

            if (isCross(tl, br) && isCross(tr, bl)) {
                part2++;
            }
        }
    }

    printf("%d\n", part1);
    printf("%d\n", part2);

    return 0;
}
