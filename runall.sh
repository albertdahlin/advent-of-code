#!/bin/bash

for i in {1..25}; do
    N=$(printf "%02d" $i)

    if [ -f bin/2024/day$N.c ]; then
        printf "\n# Day $N\n"
        time ./bin/2024/day$N.c < input/2024/day$N.txt
    fi
done

