module Y25.D07 exposing (..)

import Dict exposing (Dict)
import List.Extra
import Set exposing (Set)


parseInput : String -> List (Set Int)
parseInput =
    String.lines
        >> List.map
            (String.toList
                >> List.Extra.indexedFoldl
                    (\i c set ->
                        if c == '.' then
                            set

                        else
                            Set.insert i set
                    )
                    Set.empty
            )
        >> List.filter (Set.isEmpty >> not)


part1 : String -> Int
part1 =
    parseInput
        >> List.Extra.uncons
        >> Maybe.map
            (\( firstRow, rest ) ->
                List.foldl
                    (\row acc ->
                        Set.foldl
                            (\n ( count, set ) ->
                                if Set.member n set then
                                    ( count + 1
                                    , Set.remove n set
                                        |> Set.insert (n - 1)
                                        |> Set.insert (n + 1)
                                    )

                                else
                                    ( count, set )
                            )
                            acc
                            row
                    )
                    ( 0, firstRow )
                    rest
                    |> Tuple.first
            )
        >> Maybe.withDefault -1


split : Dict ( Int, List Int ) Int -> Int -> List (List Int) -> ( Int, Dict ( Int, List Int ) Int )
split mem idx list =
    case list of
        [] ->
            ( 1, mem )

        row :: rest ->
            case Dict.get ( idx, row ) mem of
                Just answer ->
                    ( answer, mem )

                Nothing ->
                    if List.member idx row then
                        let
                            ( a, mem1 ) =
                                split mem (idx + 1) rest

                            ( b, mem2 ) =
                                split mem1 (idx - 1) rest
                        in
                        ( a + b
                        , mem2
                            |> Dict.insert ( idx, row ) (a + b)
                        )

                    else
                        split mem idx rest


part2 : String -> Int
part2 =
    parseInput
        >> List.map Set.toList
        >> List.Extra.uncons
        >> Maybe.andThen
            (\( firstRow, rest ) ->
                firstRow
                    |> List.head
                    |> Maybe.map
                        (\idx ->
                            split Dict.empty idx rest
                                |> Tuple.first
                        )
            )
        >> Maybe.withDefault -1


test =
    """.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
..............."""
