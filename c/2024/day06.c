#include <stdio.h>
#include <stdlib.h>
#include <inttypes.h>
#include <string.h>

typedef struct Point {
    int x;
    int y;
} Point_t;

#define GRID_MAX (130 * 130 / 64 + 1) // 130 * 130 bits

int gridSize = 0;
uint64_t blocked[GRID_MAX] = {0};
uint64_t visitedMask[GRID_MAX * 4] = {0};

#define VISITED_SIZE 10000
Point_t visited[VISITED_SIZE] = {0};



static Point_t Point(int x, int y)
{
    return (Point_t){x, y};
}

typedef enum DIR {
    UP = 0,
    RIGHT = 1,
    DOWN = 2,
    LEFT = 3
} DIR;


DIR DIR_fromPoint(Point_t a, Point_t b)
{
    if (a.x == b.x) {
        if (a.y < b.y) {
            return DOWN;
        } else {
            return UP;
        }
    } else {
        if (a.x < b.x) {
            return RIGHT;
        } else {
            return LEFT;
        }
    }
}

static void set(uint64_t i, uint64_t *bitmask)
{
    uint64_t idx = i >> 6;
    uint64_t mask = 1ULL << (i & 63);

    bitmask[idx] |= mask;
}

static void unset(uint64_t i, uint64_t *bitmask)
{
    uint64_t idx = i >> 6;
    uint64_t mask = 1ULL << (i & 63);

    bitmask[idx] &= ~mask;
}

static int isSet(uint64_t i, uint64_t *bitmask)
{
    uint64_t idx = i >> 6;
    uint64_t mask = 1ULL << (i & 63);

    return (bitmask[idx] & mask) > 0;
}

static void setPos(Point_t p, uint64_t *bitmask)
{
    set(p.y * gridSize + p.x, bitmask);
}

static void setVisited(Point_t p, DIR dir)
{
    set(p.y * gridSize * 4 + p.x * 4 + dir, visitedMask);
}

static void unsetPos(Point_t p, uint64_t *bitmask)
{
    unset(p.y * gridSize + p.x, bitmask);
}

static int isPosSet(Point_t p, uint64_t *bitmask)
{
    return isSet(p.y * gridSize + p.x, bitmask);
}

static int isVisited(Point_t p, DIR dir)
{
    return isSet(p.y * gridSize * 4 + p.x * 4 + dir, visitedMask);
}

static Point_t step(Point_t p, DIR dir)
{
    switch (dir) {
        case UP:
            return Point(p.x, p.y - 1);

        case RIGHT:
            return Point(p.x + 1, p.y);

        case DOWN:
            return Point(p.x, p.y + 1);

        case LEFT:
            return Point(p.x - 1, p.y);
    }

    return p;
}

static DIR turnRight(DIR dir)
{
    return (DIR)((dir + 1) % 4);
}

static int isOutside(Point_t p)
{
    return p.x < 0 || p.y < 0 || p.x >= gridSize || p.y >= gridSize;
}

int markVisitedLocations(Point_t start)
{
    Point_t pos = start;
    DIR dir = UP;

    int len = 0;

    while (1) {
        Point_t next = step(pos, dir);

        if (!isVisited(pos, 0)) {
            if (len >= VISITED_SIZE) {
                fprintf(stderr, "Visited array too small\n");
                exit(1);
            }
            visited[len++] = pos;
            setVisited(pos, 0);
        }

        if (isOutside(next)) {
            break;
        }

        if (isPosSet(next, blocked)) {
            dir = turnRight(dir);
            continue;
        }

        pos = next;
    }

    return len;
}

int wouldLoop(Point_t start, DIR dir)
{
    memset(visitedMask, 0, sizeof(visitedMask));
    Point_t pos = start;

    while (1) {
        Point_t next = step(pos, dir);

        if (isOutside(next)) {
            return 0;
        }

        if (isVisited(pos, dir)) {
            return 1;
        }

        if (isPosSet(next, blocked)) {
            setVisited(pos, dir);
            dir = turnRight(dir);
            continue;
        }

        pos = next;
    }

    return 0;
}

int main()
{
    uint64_t part1 = 0;
    uint64_t part2 = 0;
    int row = 0;
    int col = 0;

    Point_t start = {0};

    while (!feof(stdin)) {
        int c = fgetc(stdin);

        if (c == EOF) {
            break;
        }

        if (c == '^') {
            start = Point(col, row);
        }

        if (c == '\n') {
            row += 1;
            if (gridSize == 0) {
                gridSize = col;
            }
            col = 0;
            continue;
        }

        if (c == '#') {
            setPos(Point(col, row), blocked);
        }

        col += 1;
    }

    int visited_len = markVisitedLocations(start);

    for (int i = 1; i < visited_len; i++) {
        Point_t pos = visited[i];
        setPos(pos, blocked);

        start = visited[i - 1];
        DIR dir = DIR_fromPoint(start, pos);

        if (wouldLoop(start, dir)) {
            part2 += 1;
        }

        unsetPos(pos, blocked);
    }

    part1 = visited_len;

    printf("%" PRIu64 "\n", part1);
    printf("%" PRIu64 "\n", part2);

    return 0;
}

