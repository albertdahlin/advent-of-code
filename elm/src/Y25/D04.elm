module Y25.D04 exposing (..)

import Set exposing (Set)


type alias Pos =
    ( Int, Int )


parseInput : String -> Set Pos
parseInput =
    String.lines
        >> List.map String.toList
        >> List.indexedMap
            (\y row ->
                row
                    |> List.indexedMap
                        (\x char ->
                            if char == '@' then
                                Just ( x, y )

                            else
                                Nothing
                        )
                    |> List.filterMap identity
            )
        >> List.concat
        >> Set.fromList


adjacent : Pos -> List Pos
adjacent ( x, y ) =
    [ ( x - 1, y )
    , ( x + 1, y )
    , ( x - 1, y + 1 )
    , ( x + 1, y + 1 )
    , ( x - 1, y - 1 )
    , ( x + 1, y - 1 )
    , ( x, y - 1 )
    , ( x, y + 1 )
    ]


part1 : String -> Int
part1 i =
    let
        rollPositions =
            parseInput i
    in
    Set.size rollPositions - Set.size (removeRolls rollPositions)


removeRolls : Set Pos -> Set Pos
removeRolls rollPositions =
    rollPositions
        |> Set.foldl
            (\pos set ->
                let
                    adjCount =
                        adjacent pos
                            |> List.map (\adj -> Set.member adj rollPositions)
                            |> List.filter identity
                            |> List.length
                in
                if adjCount < 4 then
                    Set.remove pos set

                else
                    set
            )
            rollPositions


removeAll : Set Pos -> Set Pos
removeAll set =
    let
        nextSet =
            removeRolls set
    in
    if Set.size nextSet == Set.size set then
        set

    else
        removeAll nextSet


part2 : String -> Int
part2 i =
    let
        rollPositions =
            parseInput i
    in
    Set.size rollPositions - Set.size (removeAll rollPositions)


test : String
test =
    """..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@."""
