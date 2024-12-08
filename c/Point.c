
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


// ****** POINT ARRAY ******


typedef struct PointArray {
    Point_t *item;
    size_t len;
    size_t cap;
} PointArray_t;

PointArray_t PointArray(size_t len)
{
    PointArray_t pa = {0};
    pa.item = calloc(len, sizeof(Point_t));
    pa.len = 0;
    pa.cap = len;

    return pa;
}

void PointArray_push(PointArray_t *pa, Point_t p)
{
    if (pa->len == pa->cap) {
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
    size_t width;
    size_t height;
} Grid_t;


Grid_t Grid(size_t width, size_t height)
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

void Grid_setMaskAt(Point_t p, int bit, Grid_t *grid)
{
    if (Point_isOutside(p, grid->width, grid->height)) {
        return;
    }

    uint8_t mask = 1 << bit;

    grid->data[p.y * grid->height + p.x] |= mask;
}

int Grid_isMaskSetAt(Point_t p, int bit, Grid_t *grid)
{
    if (Point_isOutside(p, grid->width, grid->height)) {
        return 0;
    }

    uint8_t mask = 1 << bit;

    return (grid->data[p.y * grid->height + p.x] & mask) > 0;
}

