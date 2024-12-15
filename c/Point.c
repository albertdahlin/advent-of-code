#pragma once

typedef enum Direction {
    UP = 0,
    RIGHT,
    DOWN,
    LEFT,
} Direction_t;



typedef struct Point {
    int x;
    int y;
} Point_t;


static Point_t Point(int x, int y)
{
    return (Point_t){x, y};
}

static Point_t Point_sub(Point_t a, Point_t b)
{
    return Point(a.x - b.x, a.y - b.y);
}

static Point_t Point_add(Point_t a, Point_t b)
{
    return Point(a.x + b.x, a.y + b.y);
}

static int Point_isOutside(Point_t p, int width, int height)
{
    return p.x < 0 || p.x >= width || p.y < 0 || p.y >= height;
}

// ****** DIRECTION ******

Direction_t Direction_fromArrow(char c)
{
    switch (c) {
        case '^': return UP;
        case '>': return RIGHT;
        case 'v': return DOWN;
        case '<': return LEFT;
        default: return -1;
    }
}

Point_t Direction_toPoint(Direction_t dir)
{
    switch (dir) {
        case UP: return Point(0, -1);
        case RIGHT: return Point(1, 0);
        case DOWN: return Point(0, 1);
        case LEFT: return Point(-1, 0);
    }

    return Point(0, 0);
}

// ****** POINT ARRAY ******


typedef struct PointArray {
    Point_t *item;
    size_t len;
    size_t cap;
} PointArray_t;

PointArray_t PointArray(size_t size)
{
    PointArray_t pa = {0};
    pa.item = calloc(size, sizeof(Point_t));
    pa.len = 0;
    pa.cap = size;

    return pa;
}

void PointArray_push(PointArray_t *pa, Point_t p)
{
    if (pa->len == pa->cap) {
        if (pa->cap == 0) {
            pa->cap = 1;
        }
        pa->cap *= 2;
        pa->item = realloc(pa->item, pa->cap * sizeof(Point_t));
    }
    pa->item[pa->len++] = p;
}

void PointArray_free(PointArray_t pa)
{
    if (pa.item == NULL) {
        return;
    }
    free(pa.item);
}


// ****** GRID ******


typedef struct Grid {
    uint8_t *data;
    int width;
    int height;
} Grid_t;


Grid_t Grid(int width, int height)
{
    Grid_t grid = {0};
    grid.data = calloc(width * height, sizeof(uint8_t));
    grid.width = width;
    grid.height = height;

    return grid;
}

void Grid_free(Grid_t grid)
{
    free(grid.data);
}

void Grid_setMaskAt(Point_t p, uint8_t mask, Grid_t *grid)
{
    if (Point_isOutside(p, grid->width, grid->height)) {
        return;
    }

    grid->data[p.y * grid->height + p.x] |= mask;
}

int Grid_getMaskAt(Point_t p, uint8_t mask, Grid_t *grid)
{
    if (Point_isOutside(p, grid->width, grid->height)) {
        return 0;
    }

    return grid->data[p.y * grid->height + p.x] & mask;
}

void Grid_setBitAt(Point_t p, uint8_t bit, Grid_t *grid)
{
    Grid_setMaskAt(p, 1U << bit, grid);
}

int Grid_isBitSetAt(Point_t p, uint8_t bit, Grid_t *grid)
{
    return Grid_getMaskAt(p, 1U << bit, grid) > 0;
}

void Grid_print(Grid_t grid, Point_t pos)
{
    for (int y = 0; y < grid.height; y++) {
        for (int x = 0; x < grid.width; x++) {
            char c = grid.data[y * grid.width + x];
            if (x == pos.x && y == pos.y) {
                putchar('@');
            } else {
                putchar(c);
            }
        }
        putchar('\n');
    }
}

size_t Grid_idxAt(int x, int y, Grid_t grid)
{
    return y * grid.width + x;
}

int Grid_at(int x, int y, Grid_t grid)
{
    if (x < 0 || x >= grid.width || y < 0 || y >= grid.height) {
        return -1;
    }

    return grid.data[y * grid.width + x];
}

int Grid_atPoint(Point_t p, Grid_t grid)
{
    return Grid_at(p.x, p.y, grid);
}

void Grid_set(Point_t p, uint8_t c, Grid_t *grid)
{
    if (Point_isOutside(p, grid->width, grid->height)) {
        return;
    }

    grid->data[p.y * grid->width + p.x] = c;
}

void Grid_swap(Point_t a, Point_t b, Grid_t *grid)
{
    uint8_t tmp = Grid_atPoint(a, *grid);

    Grid_set(a, Grid_atPoint(b, *grid), grid);
    Grid_set(b, tmp, grid);
}
