#include <stdio.h>
#include <stdlib.h>

#define MAX_COLS 8

int sign(int x)
{
    if (x > 0) {
        return 1;
    } else if (x < 0) {
        return -1;
    } else {
        return 0;
    }
}

int isSafe(int levels[], int len, int skipIdx)
{
    int idx = 0;

    if (skipIdx == 0) {
        idx = 1;
    }

    int prev = levels[idx];

    if (skipIdx == 1) {
        idx = 2;
    } else {
        idx += 1;
    }

    int level = levels[idx];
    int direction = sign(level - prev);

    if (direction == 0) {
        return 0;
    }

    for (; idx < len; idx++) {
        if (idx == skipIdx) {
            continue;
        }
        level = levels[idx];
        int diff = level - prev;

        if (abs(diff) > 3 || diff == 0 || sign(diff) != direction) {
            return 0;
        }

        prev = level;
    }

    return 1;
}


int main()
{
    int part1 = 0;
    int part2 = 0;

    while (!feof(stdin)) {
        int levels[MAX_COLS] = {0};
        int len = 0;
        int level;
        int idx = 0;

        while (fscanf(stdin, "%u", &level) == 1) {
            levels[idx] = level;
            idx += 1;
            if (fgetc(stdin) == '\n') {
                break;
            }
            if (idx >= MAX_COLS) {
                fprintf(stderr, "Too many columns\n");
                break;
            }
        }

        len = idx;

        /* Part 1 */
        if (isSafe(levels, len, -1)) {
            part1 += 1;
            part2 += 1;
            continue;
        }

        /* Part 2 */
        for (int skipIdx = 0; skipIdx < len; skipIdx++) {
            if (isSafe(levels, len, skipIdx)) {
                part2 += 1;
                break;
            }
        }
    }

    printf("%d\n", part1);
    printf("%d\n", part2);

    return 0;
}
