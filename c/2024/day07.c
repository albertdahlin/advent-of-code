#include <stdio.h>
#include <stdlib.h>
#include <inttypes.h>

uint64_t solve1(uint64_t n, uint64_t *nums, size_t len, uint64_t target)
{
    if (n > target) {
        return 0;
    }

    if (len > 0) {
        if (solve1(n + nums[0], nums + 1, len - 1, target)) {
            return 1;
        }
        if (solve1(n * nums[0], nums + 1, len - 1, target)) {
            return 1;
        }

        return 0;
    }

    return n == target;
}

uint64_t solve2(uint64_t n, uint64_t *nums, size_t len, uint64_t target)
{
    if (n > target) {
        return 0;
    }

    if (len > 0) {
        if (solve2(n + nums[0], nums + 1, len - 1, target)) {
            return 1;
        }
        if (solve2(n * nums[0], nums + 1, len - 1, target)) {
            return 1;
        }

        /* "Concatenate" (||) the next number to the current number.

           multiply the current number by 10^x, where x is the number of digits in the next number.
           Then add the next number to the result.

           123 || 456 = 123 * 1000 + 456 = 123000 + 456 = 123456
         */
        uint64_t x = nums[0];

        while (x > 0) {
            n *= 10;
            x /= 10;
        }

        n = n + nums[0];

        if (solve2(n, nums + 1, len - 1, target)) {
            return 1;
        }

        return 0;
    }

    return n == target;
}

int main()
{
    uint64_t part1 = 0;
    uint64_t part2 = 0;

    uint64_t target = 0;
    uint64_t nums[32] = {0};
    size_t len = 0;

    while (!feof(stdin)) {
        if (fscanf(stdin, "%" SCNu64, &target) == 0) {
            break;
        }

        char c = fgetc(stdin);
        len = 0;

        while (1) {
            if (fscanf(stdin, "%" SCNu64, &nums[len]) == 0) {
                break;
            }

            len++;

            if (len == 32) {
                break;
            }

            c = fgetc(stdin);

            if (c == '\n' || c == EOF) {
                break;
            }
        }

        if (solve1(nums[0], &nums[1], len - 1, target)) {
            part1 += target;
        }
        if (solve2(nums[0], &nums[1], len - 1, target)) {
            part2 += target;
        }
    }

    printf("%" PRIu64 "\n", part1);
    printf("%" PRIu64 "\n", part2);

    return 0;
}
