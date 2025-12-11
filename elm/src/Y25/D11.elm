module Y25.D11 exposing (..)

import Dict exposing (Dict)
import List.Extra


type alias Graph =
    Dict String (List String)


parsePair : List String -> Maybe ( String, List String )
parsePair list =
    case list of
        [ dev, out ] ->
            Just ( dev, String.words out )

        _ ->
            Nothing


parseInput : String -> Graph
parseInput =
    String.lines
        >> List.filterMap
            (String.split ":"
                >> parsePair
            )
        >> Dict.fromList


edgesBetween : String -> String -> Graph -> Int
edgesBetween from to graph =
    countEdges Dict.empty from to graph
        |> Tuple.first


countEdges : Dict String Int -> String -> String -> Graph -> ( Int, Dict String Int )
countEdges mem from to graph =
    case Dict.get from mem of
        Just edgeCount ->
            ( edgeCount, mem )

        Nothing ->
            if from == to then
                ( 1, mem )

            else
                case Dict.get from graph of
                    Just out ->
                        let
                            ( edgeCount, mem3 ) =
                                List.foldl
                                    (\from2 ( accN, accMem ) ->
                                        let
                                            ( edgeCount2, mem2 ) =
                                                countEdges
                                                    accMem
                                                    from2
                                                    to
                                                    graph
                                        in
                                        ( accN + edgeCount2
                                        , mem2
                                        )
                                    )
                                    ( 0, mem )
                                    out
                        in
                        ( edgeCount
                        , Dict.insert from edgeCount mem3
                        )

                    Nothing ->
                        ( 0
                        , Dict.insert from 0 mem
                        )


part1 : String -> Int
part1 =
    parseInput
        >> edgesBetween "you" "out"


part2 : String -> Int
part2 str =
    let
        graph =
            parseInput str
    in
    [ edgesBetween "svr" "fft" graph
    , edgesBetween "fft" "dac" graph
    , edgesBetween "dac" "out" graph
    ]
        |> List.product


test =
    """aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out"""


test2 =
    """svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out"""


