module Y25.D01 exposing (..)

import List.Extra


parseInput : String -> List Int
parseInput =
    String.words
        >> List.filterMap
            (String.uncons
                >> Maybe.andThen
                    (\( dir, numStr ) ->
                        String.toInt numStr
                            |> Maybe.map
                                (\num ->
                                    case dir of
                                        'L' ->
                                            -num

                                        _ ->
                                            num
                                )
                    )
            )


part1 =
    parseInput
        >> List.Extra.scanl (+) 50
        >> List.map (modBy 100)
        >> List.filter ((==) 0)
        >> List.length


sign : Int -> Int
sign n =
    if n < 0 then
        -1

    else
        1


steps : Int -> List Int
steps n =
    List.repeat (abs n) (sign n)


part2 =
    parseInput
        >> List.concatMap steps
        >> List.Extra.scanl (+) 50
        >> List.map (modBy 100)
        >> List.filter ((==) 0)
        >> List.length


test =
    """L68
L30
R48
L5
R60
L55
L1
L99
R14
L82"""
