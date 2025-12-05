module Y25.D05 exposing (..)

import List.Extra


parseRange : String -> Maybe ( Int, Int )
parseRange s =
    case String.split "-" s of
        [ x, y ] ->
            Maybe.map2 Tuple.pair
                (String.toInt x)
                (String.toInt y)

        _ ->
            Nothing


parseInput : String -> Result String { ranges : List ( Int, Int ), ids : List Int }
parseInput s =
    case String.split "\n\n" s of
        [ ranges, ids ] ->
            { ranges =
                String.words ranges
                    |> List.filterMap parseRange
            , ids =
                String.words ids
                    |> List.filterMap String.toInt
            }
                |> Ok

        _ ->
            Err "Could not parse"


isWithin : ( Int, Int ) -> Int -> Bool
isWithin ( from, to ) id =
    from <= id && id <= to


part1 : String -> Result String Int
part1 =
    parseInput
        >> Result.map
            (\parsed ->
                parsed.ids
                    |> List.filter
                        (\id ->
                            List.any
                                (\range ->
                                    isWithin range id
                                )
                                parsed.ranges
                        )
                    |> List.length
            )


unionOverlapLoop : ( Int, Int ) -> List ( Int, Int ) -> List ( Int, Int )
unionOverlapLoop ( prevFrom, prevTo ) list =
    case list of
        [] ->
            [ ( prevFrom, prevTo ) ]

        ( from, to ) :: rest ->
            if from <= prevTo then
                unionOverlapLoop ( prevFrom, max to prevTo ) rest

            else
                ( prevFrom, prevTo ) :: unionOverlapLoop ( from, to ) rest


unionOverlap : List ( Int, Int ) -> List ( Int, Int )
unionOverlap list =
    case list of
        [] ->
            []

        x :: xs ->
            unionOverlapLoop x xs


part2 : String -> Result String Int
part2 =
    parseInput
        >> Result.map
            (\parsed ->
                parsed.ranges
                    |> List.sort
                    |> unionOverlap
                    |> List.map (\( from, to ) -> to - from + 1)
                    |> List.sum
            )


test : String
test =
    """3-5
10-14
16-20
12-18

1
5
8
11
17
32"""
