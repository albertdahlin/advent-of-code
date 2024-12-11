#include <stdio.h>
#include <stdlib.h>
#include <inttypes.h>

#define SIZE 32768

uint64_t mapKey[SIZE] = {0};
uint64_t mapValue[SIZE] = {0};
uint64_t collision = 0;

uint64_t murmur64(uint64_t x) {
    x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9ULL;
    x = (x ^ (x >> 27)) * 0x94d049bb133111ebULL;
    x = x ^ (x >> 31);
    return x;
}

uint64_t pack(uint64_t n, uint64_t iterations)
{
    return n * 80 + iterations + 1;
}

uint64_t get(uint64_t n, uint64_t iterations)
{
    uint64_t key = pack(n, iterations);

    uint64_t idx = murmur64(key) % SIZE;

    for (size_t i = 0; i < 1; i++) {
        if (mapKey[idx] == key) {
            return mapValue[idx];
        }

        //idx = murmur64(key + i) % SIZE;
        idx = (idx + 1) % SIZE;
    }

    return 0;
}

void set(uint64_t n, uint64_t iterations, uint64_t val)
{
    uint64_t key = pack(n, iterations);
    if (key >= (1ULL << 32)) {
        printf("TOO BIG: %" PRIu64 "\n", n);
    }

    uint64_t idx = murmur64(key) % SIZE;

    for (size_t i = 0; i < 1; i++) {
        if (mapKey[idx] == key) {
            return;
        }

        if (mapKey[idx] == 0) {
            mapKey[idx] = key;
            mapValue[idx] = val;
            return;
        }
        collision++;

        //printf("COLLISION: %" PRIu64 " %zu\n", idx, i);
        //idx = murmur64(key + i) % SIZE;
        idx = (idx + 1) % SIZE;
    }
}

uint64_t countStones(uint64_t num, uint64_t iterations)
{
    uint64_t len = get(num, iterations);


    if (len > 0) {
        return len;
    }
    uint64_t n = num;

    len = 1;

    for (uint64_t i = 0; i < iterations; i++) {
        if (n == 0) {
            n = 1;
            continue;
        }

        uint64_t digits = 0;
        uint64_t pow10 = 1;
        do {
            pow10 *= 10;
            digits += 1;
        } while (pow10 <= n);

        if (digits % 2 == 0) {
            pow10 = 1;
            for (uint64_t j = 0; j < digits / 2; j++) {
                pow10 *= 10;
            }
            uint64_t left = n / pow10;
            uint64_t right = n % pow10;
            len += countStones(right, iterations - i - 1);
            n = left;
            continue;
        }

        n *= 2024;
    }
    set(num, iterations, len);

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
        //printf("NUM: %" PRIu64 "\n", n);
        part1 += countStones(n, 25);
        part2 += countStones(n, 75);
    }

    printf("%" PRIu64 "\n", part1);
    printf("%" PRIu64 "\n", part2);
    printf("%" PRIu64 "\n", collision);
}

