module Y25.D03 exposing (..)


parseInput : String -> List (List Int)
parseInput =
    String.lines
        >> List.map
            (String.split ""
                >> List.filterMap String.toInt
            )


maxOfLength : Int -> List Int -> ( Int, List Int )
maxOfLength minLen digits =
    case digits of
        [] ->
            ( 0, [] )

        x :: xs ->
            maxOfLengthHelp ( x, xs ) minLen digits


maxOfLengthHelp : ( Int, List Int ) -> Int -> List Int -> ( Int, List Int )
maxOfLengthHelp (( bestHead, _ ) as bestSoFar) minLen digits =
    if List.length digits < minLen then
        bestSoFar

    else
        case digits of
            [] ->
                bestSoFar

            x :: xs ->
                if x > bestHead then
                    maxOfLengthHelp ( x, xs ) minLen xs

                else
                    maxOfLengthHelp bestSoFar minLen xs


findBestOfLength : Int -> List Int -> List Int
findBestOfLength minLen digits =
    if minLen < 1 then
        []

    else
        let
            ( head, tail ) =
                maxOfLength minLen digits
        in
        head :: findBestOfLength (minLen - 1) tail


digitsToInt : List Int -> Int
digitsToInt =
    List.reverse
        >> List.indexedMap
            (\i x ->
                x * 10 ^ i
            )
        >> List.sum


part1 : String -> Int
part1 =
    parseInput
        >> List.map (findBestOfLength 2 >> digitsToInt)
        >> List.sum


part2 : String -> Int
part2 =
    parseInput
        >> List.map (findBestOfLength 12 >> digitsToInt)
        >> List.sum


test =
    """987654321111111
811111111111119
234234234234278
818181911112111"""

