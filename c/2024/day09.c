#include <stdio.h>
#include <stdlib.h>
#include <inttypes.h>

uint64_t arithmeticSum(uint64_t n) {
    return n * (n + 1) / 2;
}

uint64_t calculateChecksum(uint64_t len, uint64_t idx, uint64_t id) {
    return (arithmeticSum(len - 1) + idx * len) * id;
}

size_t parseInput(uint8_t **buf)
{
    size_t len = 0;

    fseek(stdin, 0, SEEK_END);
    len = ftell(stdin);
    uint8_t *input = malloc(len);

    if (input == NULL) {
        return 0;
    }

    fseek(stdin, 0, SEEK_SET);

    len = fread(input, 1, len, stdin);

    // Trim trailing newline characters
    while (len > 0 && (input[len-1] == '\n' || input[len-1] == '\r')) {
        len--;
    }

    // Convert ASCII to integer
    for (size_t i = 0; i < len; i++) {
        input[i] -= '0';
    }

    *buf = input;

    return len;
}

uint64_t solve1(uint8_t *input, size_t len)
{
    uint64_t idLow = 0;
    uint64_t idHigh = (len - 1) / 2;
    uint64_t lenHigh = input[idHigh * 2];

    uint64_t checksum = 0;
    uint64_t idx = 0;

    while (idLow < idHigh) {
        uint64_t lenLow = input[idLow * 2];

        checksum += calculateChecksum(lenLow, idx, idLow);
        idx += lenLow;

        uint64_t lenFree = input[idLow * 2 + 1];

        while (lenFree > 0) {
            if (lenFree < lenHigh) {
                checksum += calculateChecksum(lenFree, idx, idHigh);
                idx += lenFree;
                lenHigh -= lenFree;
                break;
            } else {
                checksum += calculateChecksum(lenHigh, idx, idHigh);
                idx += lenHigh;
                lenFree -= lenHigh;
                idHigh -= 1;
                lenHigh = input[idHigh * 2];
            }
        }

        idLow += 1;
    }

    checksum += calculateChecksum(lenHigh, idx, idLow);

    return checksum;
}

//00...111...2...333.44.5555.6666.777.888899
uint64_t solve2(uint8_t *input, size_t len)
{
    int idEnd = (len - 1) / 2;
    int blockEnd = input[idEnd * 2];

    uint64_t checksum = 0;
    int idxEnd = 0;

    for (size_t i = 0; i < len; i += 1) {
        idxEnd += input[i];
    }

    while (idEnd >= 0) {
        idxEnd -= blockEnd;
        int idxStart = 0;
        for (size_t i = 0; i < len; i += 1) {
            int block = input[i];
            if (i % 2 == 0) {
                idxStart += block;
                continue;
            }

            int free = block & 0x0F;
            int offset = (block & 0xF0) >> 4;
            idxStart += offset;

            if (blockEnd <= free) {
                // Block can be moved
                checksum += calculateChecksum(blockEnd, idxStart, idEnd);
                free -= blockEnd;
                offset += blockEnd;
                offset <<= 4;
                input[i] = offset | free;
                break;
            }
            idxStart += free;

            if (idxStart > idxEnd) {
                // There is no free space that fits the block
                checksum += calculateChecksum(blockEnd, idxEnd, idEnd);
                break;
            }
        }

        int f = input[idEnd * 2 - 1];
        idxEnd -= f & 0x0F;
        idxEnd -= (f & 0xF0) >> 4;
        idEnd -= 1;
        blockEnd = input[idEnd * 2];
    }

    return checksum;
}

int main()
{
    uint8_t *input = NULL;
    size_t len = parseInput(&input);

    uint64_t checksum = solve1(input, len);

    printf("%" PRIu64 "\n", checksum);

    checksum = solve2(input, len);

    printf("%" PRIu64 "\n", checksum);

    free(input);
}
