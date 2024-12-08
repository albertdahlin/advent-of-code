#include <stdio.h>
#include <stdlib.h>
#include <inttypes.h>
#include "../Point.c"

#define MAX_FREQ 64



int indexOf(char c, char seenFreq[MAX_FREQ])
{
    for (int i = 0; i < MAX_FREQ; i++) {
        if (seenFreq[i] == c) {
            return i;
        }
    }

    return -1;
}

Grid_t parseInput(PointArray_t pointByFreq[MAX_FREQ])
{
    char seenFreq[MAX_FREQ] = {0};
    int row = 0;
    int col = 0;
    int lastFreq = 0;
    int width = 0;

    while (!feof(stdin)) {
        char c = fgetc(stdin);

        if (c == EOF) {
            break;
        }

        if (c == '.') {
            col++;
            continue;
        }

        if (c == '\n') {
            if (width == 0) {
                width = col;
            }
            col = 0;
            row++;
            continue;
        }

        int freq = indexOf(c, seenFreq);

        if (freq < 0) {
            freq = lastFreq;
            seenFreq[lastFreq++] = c;
            pointByFreq[freq] = PointArray(16);
        }

        PointArray_push(&pointByFreq[freq], Point(col, row));
        col++;
    }

    int height = row;

    Grid_t grid = Grid(width, height);

    return grid;
}

int main()
{
    PointArray_t pointByFreq[MAX_FREQ] = {0};

    uint64_t part1 = 0;
    uint64_t part2 = 0;

    Grid_t grid = parseInput(pointByFreq);

    for (int f = 0; f < MAX_FREQ; f++) {
        PointArray_t points = pointByFreq[f];

        if (points.len == 0) {
            break;
        }

        for (size_t i = 0; i < points.len; i++) {
            Point_t p1 = points.item[i];

            if (!Grid_isBitSetAt(p1, 2, &grid)) {
                Grid_setBitAt(p1, 2, &grid);
                part2++;
            }

            for (size_t j = 0; j < points.len; j++) {
                if (i == j) {
                    continue;
                }
                Point_t p2 = points.item[j];
                Point_t delta = Point_sub(p1, p2);
                Point_t antinode = Point_add(p1, delta);

                if (Point_isOutside(antinode, grid.width, grid.height)) {
                    continue;
                }

                if (!Grid_isBitSetAt(antinode, 1, &grid)) {
                    Grid_setBitAt(antinode, 1, &grid);
                    part1++;
                }

                while (1) {
                    if (!Grid_isBitSetAt(antinode, 2, &grid)) {
                        Grid_setBitAt(antinode, 2, &grid);
                        part2++;
                    }
                    antinode = Point_add(antinode, delta);
                    if (Point_isOutside(antinode, grid.width, grid.height)) {
                        break;
                    }

                }
            }
        }
    }

    printf("%" PRIu64 "\n", part1);
    printf("%" PRIu64 "\n", part2);

    Grid_free(grid);

    for (int i = 0; i < MAX_FREQ; i++) {
        PointArray_free(pointByFreq[i]);
    }

    return 0;
}
