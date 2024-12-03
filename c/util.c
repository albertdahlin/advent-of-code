#include <stdio.h>
#include <stdlib.h>
#include <inttypes.h>

int compare(const void *a, const void *b) {
    int64_t int_a = *((int64_t*)a);
    int64_t int_b = *((int64_t*)b);

    return int_a - int_b;
}

void sort_int64(int64_t *arr, size_t count) {
    qsort(arr, count, sizeof(int64_t), compare);
}
