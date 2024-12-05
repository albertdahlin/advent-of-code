#include <stdio.h>
#include <stdlib.h>
#include <inttypes.h>
#include <string.h>
#include "../util.c"

uint8_t rules[100][100] = {0};

#define MAX_COLS 32
#define MAX_ROWS 200
uint8_t updates[MAX_ROWS][MAX_COLS] = {0};

int parseUpdates()
{
    uint8_t num = 0;
    int row = 0;
    int col = 1;

    while (!feof(stdin)) {
        char c = fgetc(stdin);

        if (c == EOF) {
            return row;
        }

        if (isDigit(c)) {
            num = num * 10 + c - '0';
            continue;
        }

        if (c == '\n' || c == ',') {
            updates[row][col] = num;
            num = 0;

            if (c == '\n') {
                updates[row][0] = col;
                row++;
                col = 1;
                if (row >= MAX_ROWS) {
                    fprintf(stderr, "To many rows\n");
                    return -1;
                }
            } else {
                col++;
            }

            if (col >= MAX_COLS) {
                fprintf(stderr, "To many columns\n");
                return -1;
            }
        }
    }

    return row;
}

int parseRules()
{
    uint8_t nums[2] = {0};
    int numIdx = 0;

    while (!feof(stdin)) {
        char c = fgetc(stdin);

        if (c == EOF) {
            return __LINE__;
        }

        if (isDigit(c)) {
            nums[numIdx] = nums[numIdx] * 10 + c - '0';
            continue;
        }

        if (c == '\n') {
            if (numIdx == 1) {
                rules[nums[0]][nums[1]] = 1;
                nums[0] = 0;
                nums[1] = 0;
                numIdx = 0;
                continue;
            } else {
                // Done parsing rules.
                break;
            }
        }

        if (c == '|' && numIdx == 0) {
            numIdx++;
            continue;
        }

        return __LINE__;
    }

    return 0;
}

int compareByRule(const void *a, const void *b)
{
    uint8_t ia = *((uint8_t*)a);
    uint8_t ib = *((uint8_t*)b);

    if (rules[ia][ib]) {
        return -1;
    }

    if (rules[ib][ia]) {
        return 1;
    }

    return 0;
}

int isEqual(uint8_t *a, uint8_t *b, int len)
{
    for (int i = 0; i < len; i++) {
        if (a[i] != b[i]) {
            return 0;
        }
    }

    return 1;
}

int main()
{
    if (parseRules() != 0) {
        return 1;
    }

    int rows = parseUpdates();

    if (rows < 0) {
        return 1;
    }

    int part1 = 0;
    int part2 = 0;

    uint8_t fixedOrder[MAX_COLS] = {0};

    for (int row = 0; row < rows; row++) {
        uint8_t *update = &updates[row][1];
        int len = updates[row][0];

        memcpy(fixedOrder, update, len);
        qsort(fixedOrder, len, sizeof(uint8_t), compareByRule);

        int middle = fixedOrder[len / 2];

        if (isEqual(fixedOrder, update, len)) {
            part1 += middle;
        } else {
            part2 += middle;
        }
    }

    printf("%d\n", part1);
    printf("%d\n", part2);

    return 0;
}
