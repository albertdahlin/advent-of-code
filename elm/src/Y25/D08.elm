module Y25.D08 exposing (..)

import List.Extra
import Set exposing (Set)


type alias Point =
    ( Int, Int, Int )


toVector : List Int -> Maybe Point
toVector list =
    case list of
        [ x, y, z ] ->
            Just ( x, y, z )

        _ ->
            Nothing


parseInput : String -> List Point
parseInput =
    String.lines
        >> List.filterMap
            (String.split ","
                >> List.filterMap String.toInt
                >> toVector
            )


sq : Int -> Int
sq x =
    x * x


sqDistance : Point -> Point -> Int
sqDistance ( x1, y1, z1 ) ( x2, y2, z2 ) =
    sq (x1 - x2) + sq (y1 - y2) + sq (z1 - z2)


unionFind : Point -> Point -> List (Set Point) -> List (Set Point) -> List (Set Point)
unionFind p1 p2 setsToUnion sets =
    case sets of
        [] ->
            [ List.foldl
                Set.union
                (Set.fromList [ p1, p2 ])
                setsToUnion
            ]

        set :: rest ->
            if Set.member p1 set || Set.member p2 set then
                unionFind
                    p1
                    p2
                    (set :: setsToUnion)
                    rest

            else
                set :: unionFind p1 p2 setsToUnion rest


unionFirstN : Int -> List (Set Point) -> List ( Point, Point ) -> List (Set Point)
unionFirstN n sets pairs =
    if n == 0 then
        sets

    else
        case pairs of
            [] ->
                sets

            ( p1, p2 ) :: ps ->
                unionFirstN
                    (n - 1)
                    (unionFind p1 p2 [] sets)
                    ps


part1 : String -> Int
part1 =
    parseInput
        >> List.Extra.uniquePairs
        >> List.map (\( p1, p2 ) -> ( sqDistance p1 p2, p1, p2 ))
        >> List.sort
        >> List.map (\( _, p1, p2 ) -> ( p1, p2 ))
        >> unionFirstN 1000 []
        >> List.map Set.size
        >> List.sort
        >> List.reverse
        >> List.take 3
        >> List.product


isDone : Int -> List (Set Point) -> Bool
isDone size sets =
    case sets of
        [ set ] ->
            Set.size set == size

        _ ->
            False


lastUnifyingPair : Int -> List (Set Point) -> List ( Point, Point ) -> Maybe ( Point, Point )
lastUnifyingPair size sets pairs =
    case pairs of
        [] ->
            Nothing

        ( p1, p2 ) :: ps ->
            let
                sets2 =
                    unionFind p1 p2 [] sets
            in
            if isDone size sets2 then
                Just ( p1, p2 )

            else
                lastUnifyingPair
                    size
                    sets2
                    ps


part2 : String -> Maybe Int
part2 s =
    let
        points =
            parseInput s

        count =
            List.length points
    in
    points
        |> List.Extra.uniquePairs
        |> List.map (\( p1, p2 ) -> ( sqDistance p1 p2, p1, p2 ))
        |> List.sort
        |> List.map (\( _, p1, p2 ) -> ( p1, p2 ))
        |> lastUnifyingPair count []
        |> Maybe.map (\( ( x1, _, _ ), ( x2, _, _ ) ) -> x1 * x2)


test =
    """162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689"""
