#include <stdio.h>
#include <stdlib.h>
#include <inttypes.h>
#include "../Point.c"


Point_t step1(Point_t pos, Point_t dir, Grid_t grid)
{
    Point_t next = pos;
    uint8_t nextChar = Grid_atPoint(next, grid);

    do {
        next = Point_add(next, dir);
        nextChar = Grid_atPoint(next, grid);
    } while (nextChar == 'O');

    if (nextChar == '#') {
        return pos;
    }

    pos = Point_add(pos, dir);

    Grid_swap(pos, next, &grid);

    return pos;
}


Point_t stepHorizontal(Point_t pos, Point_t dir, Grid_t grid)
{
    Point_t next = pos;
    uint8_t nextChar = Grid_atPoint(next, grid);

    do {
        next = Point_add(next, dir);
        nextChar = Grid_atPoint(next, grid);
    } while (nextChar == '[' || nextChar == ']');

    if (nextChar == '#') {
        return pos;
    }

    pos = Point_add(pos, dir);
    Point_t p = next;

    while (p.x != pos.x) {
        next = Point(p.x - dir.x, p.y);
        Grid_swap(p, next, &grid);
        p = next;
    }

    return pos;
}

int canMoveVertical(Point_t pos, Point_t dir, Grid_t grid)
{
    uint8_t c = Grid_atPoint(pos, grid);

    if (c == '#') {
        return 0;
    }

    if (c == '.') {
        return 1;
    }

    int x = pos.x;
    int y = pos.y;

    if (c == '[') {
        x += 1;
    }

    if (c == ']') {
        x -= 1;
    }

    return canMoveVertical(Point_add(pos, dir), dir, grid)
        && canMoveVertical(Point(x, y + dir.y), dir, grid);
}

void moveVertical(Point_t pos, Point_t dir, Grid_t grid)
{
    uint8_t c = Grid_atPoint(pos, grid);

    if (c == '.') {
        return;
    }

    int x = pos.x;

    if (c == '[') {
        x += 1;
    }

    if (c == ']') {
        x -= 1;
    }

    Point_t next = Point_add(pos, dir);

    moveVertical(next, dir, grid);
    moveVertical(Point(x, pos.y + dir.y), dir, grid);

    Grid_swap(pos, next, &grid);
    Grid_swap(Point(x, pos.y), Point(x, pos.y + dir.y), &grid);
}

Point_t stepVertical(Point_t pos, Point_t dir, Grid_t grid)
{
    Point_t next = Point_add(pos, dir);
    if (canMoveVertical(next, dir, grid)) {
        moveVertical(next, dir, grid);

        return next;
    }

    return pos;
}

Point_t step2(Point_t pos, Point_t dir, Grid_t grid)
{
    if (dir.y == 0) {
        return stepHorizontal(pos, dir, grid);
    } else {
        return stepVertical(pos, dir, grid);
    }

    return pos;
}


int calculateGPS(Grid_t grid, uint8_t c)
{
    int sum = 0;

    for (int y = 0; y < grid.height; y++) {
        for (int x = 0; x < grid.width; x++) {
            if (Grid_at(x, y, grid) == c) {
                sum += y * 100 + x;
            }
        }
    }

    return sum;
}

int main()
{
    int row = 0;
    int col = 0;
    int width = 0;
    int height = 0;

    // Parse first row to find the size of the grid
    while (!feof(stdin)) {
        int c = fgetc(stdin);

        if (c == '\n') {
            // Assume the input grid is square
            width = col;
            height = col;
            row += 1;
            col = 0;
            break;
        }

        col += 1;
    }

    Grid_t grid1 = Grid(width, height);
    Grid_t grid2 = Grid(width * 2, height);

    for (int x = 0; x < width; x++) {
        Grid_set(Point(x, 0), '#', &grid1);
        Grid_set(Point(x * 2, 0), '#', &grid2);
        Grid_set(Point(x * 2 + 1, 0), '#', &grid2);
    }

    // Parse the rest of the grid part of the input
    Point_t start = Point(0, 0);

    while (!feof(stdin)) {
        int c = fgetc(stdin);

        if (c == '\n' && col == 0) {
            // Reached the end of the grid part of the input.
            break;
        }

        if (c == '\n') {
            row += 1;
            col = 0;
            continue;
        }

        if (c == '@') {
            start = Point(col, row);
            c = '.';
        }

        Grid_set(Point(col, row), c, &grid1);

        if (c == 'O') {
            Grid_set(Point(col * 2, row), '[', &grid2);
            Grid_set(Point(col * 2 + 1, row), ']', &grid2);
        } else {
            Grid_set(Point(col * 2, row), c, &grid2);
            Grid_set(Point(col * 2 + 1, row), c, &grid2);
        }


        col += 1;
    }


    // Perform all the moves

    Point_t pos1 = start;
    Point_t pos2 = Point(start.x * 2, start.y);

    while (!feof(stdin)) {
        int c = fgetc(stdin);

        if (c == EOF || c == '\n') {
            continue;
        }

        Direction_t dir = Direction_fromArrow(c);
        Point_t delta = Direction_toPoint(dir);

        pos1 = step1(pos1, delta, grid1);
        pos2 = step2(pos2, delta, grid2);
    }


    int part1 = calculateGPS(grid1, 'O');
    int part2 = calculateGPS(grid2, '[');

    printf("%d\n", part1);
    printf("%d\n", part2);

    Grid_free(grid1);
    Grid_free(grid2);
}


