#include <stdio.h>
#include <stdlib.h>

#define MAX_COLS 8


static int isDigit(char c)
{
    return c >= '0' && c <= '9';
}


int main()
{
    int part1 = 0;
    int part2 = 0;

    char tok_mul[] = "mul(";
    char tok_do[] = "do()";
    char tok_dont[] = "don't()";

    int idx_mul = 0;
    int idx_do = 0;
    int idx_dont = 0;
    int mulArg[2] = {0};
    int mulArgIdx = 0;

    int isEnabled = 1;

    while (!feof(stdin)) {
        char c = fgetc(stdin);

        if (c == EOF) {
            break;
        }

        if (idx_mul == sizeof(tok_mul) - 1) {
            if (isDigit(c) && mulArgIdx < 2) {
                mulArg[mulArgIdx] = mulArg[mulArgIdx] * 10 + c - '0';
                continue;
            } else if (c == ',' && mulArgIdx == 0) {
                mulArgIdx++;
                continue;
            } else if (c == ')' && mulArgIdx == 1) {
                part1 += mulArg[0] * mulArg[1];

                if (isEnabled) {
                    part2 += mulArg[0] * mulArg[1];
                }
            }
            idx_mul = 0;
            mulArg[0] = 0;
            mulArg[1] = 0;
            mulArgIdx = 0;
        }

        if (c == tok_mul[idx_mul]) {
            idx_mul++;
        } else {
            idx_mul = 0;
        }

        if (c == tok_do[idx_do] && c == tok_dont[idx_dont]) {
            // Both do() and don't() have the same prefix
            idx_do++;
            idx_dont++;
        } else if (c == tok_do[idx_do]) {
            idx_do++;
            idx_dont = 0;
        } else if (c == tok_dont[idx_dont]) {
            idx_dont++;
            idx_do = 0;
        } else {
            idx_do = 0;
            idx_dont = 0;
        }

        if (idx_do == sizeof(tok_do) - 1) {
            isEnabled = 1;
            idx_do = 0;
        }

        if (idx_dont == sizeof(tok_dont) - 1) {
            isEnabled = 0;
            idx_dont = 0;
        }
    }

    printf("%d\n", part1);
    printf("%d\n", part2);

    return 0;
}
