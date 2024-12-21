#!/bin/bash

YEAR=2024

ANSWER=()
ANSWER+=("DUMMY")

while IFS= read -r line; do
    LINE=$(echo "$line" | xargs)
    ANSWER+=("$LINE")
done < "answer/$YEAR.txt"

case $1 in
    "c")
        RUNTIME=""
        FILE=bin/$YEAR/day
        EXT=c
        ;;

    "js")
        RUNTIME=node
        FILE=javascript/$YEAR/day
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
            IFS=$'\n' read -r -d '' -a OUT <<< $( { time $RUNTIME $FILE$N.$EXT < input/$YEAR/day$N.txt; } 2>&1 )
        else
            IFS=$'\n' read -r -d '' -a OUT <<< $( { time $FILE$N.$EXT < input/$YEAR/day$N.txt; } 2>&1 )
        fi
        printf "% 8s" ${OUT[3]#user	}
        printf "% 19s" ${OUT[0]}
        printf "% 17s" ${OUT[1]}
        if [ "${ANSWER[i]}" != "${OUT[0]} ${OUT[1]}" ]; then
            echo " FAIL, Expected: ${ANSWER[i]}"
        else
            echo ""
        fi
    else
        printf "% 2s\n" $i
    fi
done

