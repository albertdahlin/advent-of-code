module Y25.D09 exposing (..)

import Array exposing (Array)
import Dict exposing (Dict)
import List.Extra
import Set exposing (Set)


type alias Pos =
    ( Int, Int )


type alias Box =
    ( Pos, Pos )


toPos : List Int -> Maybe Pos
toPos list =
    case list of
        [ a, b ] ->
            Just ( a, b )

        _ ->
            Nothing


parseInput : String -> List Pos
parseInput =
    String.lines
        >> List.filterMap
            (String.split ","
                >> List.filterMap String.toInt
                >> toPos
            )


area : Box -> Int
area ( ( x1, y1 ), ( x2, y2 ) ) =
    let
        x =
            1 + abs (x2 - x1)

        y =
            1 + abs (y2 - y1)
    in
    x * y


part1 : String -> Maybe Int
part1 =
    parseInput
        >> List.Extra.uniquePairs
        >> List.map area
        >> List.sort
        >> List.reverse
        >> List.head


isInside : List Box -> List Box -> Pos -> Bool
isInside hlines vlines ( x, y ) =
    let
        above =
            hlines
                |> List.filter
                    (\( ( x1, y1 ), ( x2, y2 ) ) ->
                        x1 <= x && x <= x2 && y >= y1
                    )

        below =
            hlines
                |> List.filter
                    (\( ( x1, y1 ), ( x2, y2 ) ) ->
                        x1 >= x && x >= x2 && y <= y1
                    )

        left =
            vlines
                |> List.filter
                    (\( ( x1, y1 ), ( x2, y2 ) ) ->
                        y1 >= y && y >= y2 && x >= x1
                    )

        right =
            vlines
                |> List.filter
                    (\( ( x1, y1 ), ( x2, y2 ) ) ->
                        y1 <= y && y <= y2 && x <= x1
                    )
    in
    not
        (List.isEmpty above
            || List.isEmpty below
            || List.isEmpty left
            || List.isEmpty right
        )


fourCorners : Box -> List Pos
fourCorners ( ( x1, y1 ), ( x2, y2 ) ) =
    [ ( x1, y1 )
    , ( x2, y1 )
    , ( x1, y2 )
    , ( x2, y2 )
    ]


fourSides : Box -> List Pos
fourSides ( ( x1, y1 ), ( x2, y2 ) ) =
    [ List.range (min x1 x2) (max x1 x2)
        |> List.concatMap (\x -> [ ( x, y1 ), ( x, y2 ) ])
    , List.range (min y1 y2) (max y1 y2)
        |> List.concatMap (\y -> [ ( x1, y ), ( x2, y ) ])
    ]
        |> List.concat


isAllInside : List Box -> List Box -> List Pos -> Bool
isAllInside h l list =
    case list of
        [] ->
            True

        p :: rest ->
            if isInside h l p then
                isAllInside h l rest

            else
                False


findFirstValid : List Box -> List Box -> List ( x, Box ) -> Maybe ( x, Box )
findFirstValid hlines vlines list =
    case list of
        [] ->
            Nothing

        ( x, box ) :: rest ->
            if
                fourCorners box
                    |> isAllInside hlines vlines
            then
                if
                    fourSides box
                        |> isAllInside hlines vlines
                then
                    Just ( x, box )

                else
                    findFirstValid hlines vlines rest

            else
                findFirstValid hlines vlines rest


toIndexTable : List Int -> Dict Int Int
toIndexTable list =
    list
        |> Set.fromList
        |> Set.toList
        |> List.indexedMap
            (\idx v ->
                ( v, idx )
            )
        |> Dict.fromList


part2 : String -> Maybe Int
part2 s =
    let
        redTiles =
            parseInput s

        xidx =
            redTiles
                |> List.map Tuple.first
                |> toIndexTable

        yidx =
            redTiles
                |> List.map Tuple.second
                |> toIndexTable

        idxPos =
            redTiles
                |> List.map pointToIdx

        pointToIdx ( x, y ) =
            ( Dict.get x xidx |> Maybe.withDefault -1
            , Dict.get y yidx |> Maybe.withDefault -1
            )

        boxToIdx ( p1, p2 ) =
            ( pointToIdx p1, pointToIdx p2 )

        lines =
            List.map2 Tuple.pair
                idxPos
                (List.drop 1 idxPos
                    ++ List.take 1 idxPos
                )

        vlines =
            lines
                |> List.filter
                    (\( ( x1, y1 ), ( x2, y2 ) ) ->
                        x1 == x2
                    )

        hlines =
            lines
                |> List.filter
                    (\( ( x1, y1 ), ( x2, y2 ) ) ->
                        y1 == y2
                    )
    in
    redTiles
        |> List.Extra.uniquePairs
        |> List.map (\box -> ( area box, boxToIdx box ))
        |> List.sortBy Tuple.first
        |> List.reverse
        |> findFirstValid hlines vlines
        |> Maybe.map Tuple.first


test =
    """7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3"""



--..............
--.......#XXX#..
--.......XXXXX..
--..#XXXX#XXXX..
--..XXXX#XXXX#..
--..XXXXX.......
--..XXXX#XXXX#..
--..#XXXX#X#XX..
--.......#XXXX..
--.........#X#..
--..............


test2 =
    """7,1
11,1
11,4
6,4
6,6
11,6
11,9
9,9
9,8
7,8
7,7
2,7
2,3
7,3"""


