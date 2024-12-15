#include <stdio.h>
#include <stdlib.h>
#include <inttypes.h>

#define MAX_ROWS 1001
#define MAX_VAL 100000

int compare(const void *a, const void *b) {
    int_fast32_t int_a = *((int_fast32_t*)a);
    int_fast32_t int_b = *((int_fast32_t*)b);

    return int_a - int_b;
}

int main()
{
    int_fast32_t left[MAX_ROWS];
    int_fast32_t right[MAX_ROWS];
    size_t count = 0;

    for (size_t i = 0; i < MAX_ROWS; i++) {
        int_fast32_t l, r;
        int_fast32_t numbersMatches = fscanf(
            stdin,
            "%" SCNdFAST32 " %" SCNdFAST32,
            &l,
            &r
        );

        if (numbersMatches == EOF) {
            count = i;
            break;
        } else if (numbersMatches != 2) {
            fprintf(stderr, "Invalid input at row: %zd\n", i + 1);
            return 1;
        }

        if (l > MAX_VAL || r > MAX_VAL) {
            fprintf(stderr, "Number too large at row: %zd\n", i + 1);
            return 1;
        }

        left[i] = l;
        right[i] = r;
    }


    /* Part 1 */

    qsort(left, count, sizeof(int_fast32_t), compare);
    qsort(right, count, sizeof(int_fast32_t), compare);

    int_fast32_t result = 0;

    for (size_t i = 0; i < count; i++) {
        result += labs(left[i] - right[i]);
    }

    printf("%" PRIdFAST32 "\n", result);


    /* Part 2 */

    uint16_t freq[MAX_VAL] = {0};

    for (size_t i = 0; i < count; i++) {
        freq[right[i]]++;
    }

    result = 0;

    for (size_t i = 0; i < count; i++) {
        result += left[i] * freq[left[i]];
    }

    printf("%" PRIdFAST32 "\n", result);

    return 0;
}
