#include <stdio.h>
#include <stdlib.h>
#include <inttypes.h>


uint64_t bruteforce1(uint64_t n, uint64_t *nums, size_t len, uint64_t target)
{
    if (n > target) {
        return 0;
    }

    if (len == 0) {
        return n == target;
    }

    if (bruteforce1(n + nums[0], nums + 1, len - 1, target)) {
        return 1;
    }

    if (bruteforce1(n * nums[0], nums + 1, len - 1, target)) {
        return 1;
    }

    return 0;
}


uint64_t bruteforce2(uint64_t n, uint64_t *nums, size_t len, uint64_t target)
{
    if (n > target) {
        return 0;
    }

    if (len == 0) {
        return n == target;
    }

    if (bruteforce2(n + nums[0], nums + 1, len - 1, target)) {
        return 1;
    }
    if (bruteforce2(n * nums[0], nums + 1, len - 1, target)) {
        return 1;
    }

    /* "Concatenate" (||) the next number to the current number.


       Multiply the current number by 10^x, where x is the
       number of digits in the next number.
       Then add the next number to the result.

       123 || 456 = 123 * 1000 + 456 = 123000 + 456 = 123456

       n * pow(10, log10(next) + 1) + next

       `log` and `pow` are slow, so we use a loop instead.
     */
    uint64_t x = 1;

    do {
        x *= 10;
    } while (x <= nums[0]);

    n = x * n + nums[0];

    if (bruteforce2(n, nums + 1, len - 1, target)) {
        return 1;
    }

    return 0;
}


uint64_t solve(
    uint64_t test,
    uint64_t nums[],
    size_t len,
    uint64_t checkConcat
) {
    uint64_t n = nums[len - 1];

    if (len <= 1) {
        return n == test;
    }

    uint64_t rem = test % n;
    uint64_t quot = test / n;

    if (rem == 0 && solve(quot, nums, len - 1, checkConcat)) {
        return 1;
    }

    if (checkConcat) {
        // This is a faster implementation of
        // pow10 = pow(10, log10(n) + 1);
        uint64_t pow10 = 1;

        do {
            pow10 *= 10;
        } while (pow10 <= n);

        // Check if `test` ends with `n`, eg. 123456 ends with 456
        uint64_t endsWithN = (test - n) % pow10 == 0;

        if (endsWithN && solve(test / pow10, nums, len - 1, checkConcat)) {
            return 1;
        }
    }

    return solve(test - n, nums, len - 1, checkConcat);
}


int main()
{
    uint64_t part1 = 0;
    uint64_t part2 = 0;

    uint64_t target = 0;
    uint64_t nums[32] = {0};
    size_t len = 0;

    while (!feof(stdin)) {
        if (fscanf(stdin, "%" SCNu64 ":", &target) == 0) {
            break;
        }

        len = 0;

        while (1) {
            if (fscanf(stdin, "%" SCNu64, &nums[len]) == 0) {
                break;
            }

            len++;

            if (len == sizeof(nums) / sizeof(nums[0])) {
                break;
            }

            char c = fgetc(stdin);

            if (c == '\n' || c == EOF) {
                break;
            }
        }

        if (solve(target, nums, len, 0)) {
            part1 += target;
            part2 += target;
        } else if (solve(target, nums, len, 1)) {
            part2 += target;
        }
    }

    printf("%" PRIu64 "\n", part1);
    printf("%" PRIu64 "\n", part2);

    return 0;
}
