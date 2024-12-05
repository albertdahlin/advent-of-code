#include <stdio.h>
#include <stdlib.h>
#include <inttypes.h>
#include <string.h>
#include "../util.c"

/* Use a bitmask to store if a is connected to b.
Connected in this case means that a must come before b.

Numbers are 11..98, which means we need 87*87/64 ~ 113 uint64_t to store all possible connections.
*/
uint64_t bitmask[113] = {0};

#define MAX_COLS 24

uint64_t getBitIndex(uint8_t a, uint8_t b)
{
    return (a - 11) * 100 + (b - 11);
}

uint64_t getIdx(uint64_t bitIdx)
{
    return bitIdx >> 6;
}

uint64_t getMask(uint64_t bitIdx)
{
    uint64_t bit = bitIdx & 63;

    return 1ULL << bit;
}

void connect(uint8_t a, uint8_t b)
{
    uint64_t bitIdx = getBitIndex(a, b);
    uint64_t idx = getIdx(bitIdx);
    uint64_t mask = getMask(bitIdx);

    bitmask[idx] |= mask;
}

uint64_t isConnected(uint8_t a, uint8_t b)
{
    uint64_t bitIdx = getBitIndex(a, b);
    uint64_t idx = getIdx(bitIdx);
    uint64_t mask = getMask(bitIdx);

    return bitmask[idx] & mask;
}

int parseNumbers(uint8_t *nums)
{
    uint8_t num = 0;
    int lastIdx = 0;

    while (!feof(stdin)) {
        char c = fgetc(stdin);

        if (c == EOF) {
            return lastIdx;
        }

        if (isDigit(c)) {
            num = num * 10 + c - '0';
            continue;
        }

        if (c == ',') {
            nums[lastIdx] = num;
            lastIdx++;
            num = 0;
            if (lastIdx >= MAX_COLS) {
                fprintf(stderr, "To many columns\n");
                return -1;
            }
        }

        if (c == '\n') {
            nums[lastIdx] = num;
            lastIdx++;
            break;
        }
    }

    return lastIdx;
}


int parseRules()
{
    uint8_t nums[2] = {0};
    int numIdx = 0;

    while (!feof(stdin)) {
        char c = fgetc(stdin);

        if (c == EOF) {
            return __LINE__;
        }

        if (isDigit(c)) {
            nums[numIdx] = nums[numIdx] * 10 + c - '0';
            continue;
        }

        if (c == '\n') {
            if (numIdx == 1) {
                connect(nums[0], nums[1]);
                nums[0] = 0;
                nums[1] = 0;
                numIdx = 0;
                continue;
            } else {
                // Done parsing rules.
                break;
            }
        }

        if (c == '|' && numIdx == 0) {
            numIdx++;
            continue;
        }

        return __LINE__;
    }

    return 0;
}

int compareByRule(const void *a, const void *b)
{
    uint8_t ia = *((uint8_t*)a);
    uint8_t ib = *((uint8_t*)b);

    if (isConnected(ia, ib)) {
        return -1;
    }

    if (isConnected(ib, ia)) {
        return 1;
    }

    return 0;
}

int main()
{
    if (parseRules() != 0) {
        return 1;
    }

    int part1 = 0;
    int part2 = 0;

    uint8_t fixedOrder[MAX_COLS] = {0};
    uint8_t update[MAX_COLS] = {0};

    while (!feof(stdin)) {
        int len = parseNumbers(update);

        if (len <= 0) {
            break;
        }

        memcpy(fixedOrder, update, len);
        qsort(fixedOrder, len, sizeof(uint8_t), compareByRule);

        int middle = fixedOrder[len / 2];

        if (memcmp(fixedOrder, update, len) == 0) {
            part1 += middle;
        } else {
            part2 += middle;
        }
    }

    printf("%d\n", part1);
    printf("%d\n", part2);

    return 0;
}
