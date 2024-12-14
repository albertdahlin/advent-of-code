#include <stdio.h>
#include <stdlib.h>
#include <inttypes.h>

#define SIZE 65536

uint64_t mapKey[SIZE] = {0};
uint64_t mapValue[SIZE] = {0};

uint64_t hash(uint64_t key) {
    key ^= key >> 32;
    key *= 0xd6e8feb86659fd93ULL;
    key ^= key >> 32;

    return key;
}

uint64_t pack(uint64_t n, uint_fast8_t iterations)
{
    return (n << 7) | iterations;
}

uint64_t get(uint64_t key)
{
    uint64_t idx = hash(key) % SIZE;

    return (mapKey[idx] == key) * mapValue[idx];
}

void set(uint64_t key, uint64_t val)
{
    uint64_t idx = hash(key) % SIZE;


    mapKey[idx] = key;
    mapValue[idx] = val;

}

uint64_t table_pow10[15] = {
    1, 10, 100, 1000, 10000, 100000,
    1000000, 10000000, 100000000, 1000000000,
    10000000000, 100000000000, 1000000000000,
    10000000000000, 100000000000000
};

uint64_t countDigits(uint64_t n)
{
    uint64_t digits = 0;

    while (table_pow10[digits] <= n) {
        digits += 1;
    }

    return digits;
}

uint64_t countStones(uint64_t n, uint_fast8_t iterations)
{
    uint64_t key = pack(n, iterations);
    uint64_t len = get(key);

    if (len > 0) {
        return len;
    }

    len = 1;

    while (iterations-- > 0) {
        if (n == 0) {
            n = 1;
            continue;
        }

        uint64_t digits = countDigits(n);

        if (digits % 2 == 0) {
            uint64_t pow10 = table_pow10[digits / 2];
            uint64_t right = n % pow10;
            len += countStones(right, iterations);
            n /= pow10;
            continue;
        }

        n *= 2024;
    }

    set(key, len);

    return len;
}

int main()
{
    uint64_t part1 = 0;
    uint64_t part2 = 0;

    while (!feof(stdin)) {
        uint64_t n;
        size_t numbersMatches = fscanf(stdin, "%" SCNu64, &n);

        if (numbersMatches != 1) {
            break;
        }

        part1 += countStones(n, 25);
        part2 += countStones(n, 75);
    }


    printf("%" PRIu64 "\n", part1);
    printf("%" PRIu64 "\n", part2);
}

