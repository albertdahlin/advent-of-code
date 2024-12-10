#!/bin/bash

case $1 in
    "c")
        RUNTIME=""
        FILE=bin/2024/day
        EXT=c
        ;;

    "js")
        RUNTIME=node
        FILE=javascript/2024/day
        EXT=js
        ;;
    *)
        echo "Usage: $0 <lang>"
        exit 1
        ;;
esac

for i in {1..25}; do
    N=$(printf "%02d" $i)

    if [ -f $FILE$N.$EXT ]; then
        printf "% 2s " $i
        if [ $RUNTIME ]; then
            IFS=$'\n' read -r -d '' -a OUT <<< $( { time $RUNTIME $FILE$N.$EXT < input/2024/day$N.txt; } 2>&1 )
        else
            IFS=$'\n' read -r -d '' -a OUT <<< $( { time $FILE$N.$EXT < input/2024/day$N.txt; } 2>&1 )
        fi
        printf "% 7s" ${OUT[3]#user	0m}
        printf "% 15s" ${OUT[0]}
        printf "% 15s" ${OUT[1]}
        echo ""
    fi
done

