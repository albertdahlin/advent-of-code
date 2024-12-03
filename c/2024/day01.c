#include <stdio.h>
#include <inttypes.h>
#include "../util.c"

#define MAX_ROWS 1001
#define MAX_VAL 100000

int main()
{
    int64_t left[MAX_ROWS];
    int64_t right[MAX_ROWS];
    size_t count = 0;

    for (size_t i = 0; i < MAX_ROWS; i++) {
        int64_t l, r;
        int numbersMatches = fscanf(stdin, "%ld %ld", &l, &r);

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

    sort_int64(left, count);
    sort_int64(right, count);

    int64_t result = 0;

    for (size_t i = 0; i < count; i++) {
        result += abs(left[i] - right[i]);
    }

    printf("%ld\n", result);


    /* Part 2 */

    uint16_t freq[MAX_VAL] = {0};

    for (size_t i = 0; i < count; i++) {
        freq[right[i]]++;
    }

    result = 0;

    for (size_t i = 0; i < count; i++) {
        result += left[i] * freq[left[i]];
    }

    printf("%ld\n", result);

    return 0;
}
