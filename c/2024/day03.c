#include <stdio.h>
#include <stdlib.h>

static int isDigit(char c)
{
    return c >= '0' && c <= '9';
}

int main()
{
    int part1 = 0;
    int part2 = 0;

    char mul_tok[] = "mul(";
    int mul_idx = 0;
    int mul_arg[2] = {0};
    int mul_arg_idx = 0;

    char do_tok[] = "do()";
    int do_idx = 0;

    char dont_tok[] = "don't()";
    int dont_idx = 0;


    int isEnabled = 1;

    while (!feof(stdin)) {
        int c = fgetc(stdin);

        if (c == EOF) {
            break;
        }

        if (mul_idx == sizeof(mul_tok) - 1) {
            // Matches token "mul("

            if (isDigit(c) && mul_arg_idx < 2) {
                mul_arg[mul_arg_idx] = mul_arg[mul_arg_idx] * 10 + c - '0';
                continue;
            } else if (c == ',' && mul_arg_idx == 0) {
                mul_arg_idx++;
                continue;
            } else if (c == ')' && mul_arg_idx == 1) {
                part1 += mul_arg[0] * mul_arg[1];

                if (isEnabled) {
                    part2 += mul_arg[0] * mul_arg[1];
                }
            }
            mul_idx = 0;
            mul_arg[0] = 0;
            mul_arg[1] = 0;
            mul_arg_idx = 0;
        }

        // Try matching tokens
        if (c == mul_tok[mul_idx]) {
            mul_idx++;
        } else {
            mul_idx = 0;
        }

        if (c == do_tok[do_idx]) {
            do_idx++;
        } else {
            do_idx = 0;
        }

        if (c == dont_tok[dont_idx]) {
            dont_idx++;
        } else {
            dont_idx = 0;
        }

        if (do_idx == sizeof(do_tok) - 1) {
            // Matches token "do()"
            isEnabled = 1;
            do_idx = 0;
        }

        if (dont_idx == sizeof(dont_tok) - 1) {
            // Matches token "don't()"
            isEnabled = 0;
            dont_idx = 0;
        }
    }

    printf("%d\n", part1);
    printf("%d\n", part2);

    return 0;
}
