module Y25.D10 exposing (..)

import Array exposing (Array)
import Set exposing (Set)


type alias Machine =
    { lights : Set Int
    , buttons : List (List Int)
    , joltage : Array Int
    }


parseMachine : List String -> Maybe Machine
parseMachine words =
    case words of
        [] ->
            Nothing

        lights :: rest ->
            let
                ( buttons, joltage ) =
                    parseButtons [] rest
            in
            { lights = parseLights lights
            , buttons = buttons
            , joltage = parseNumbers joltage |> Array.fromList
            }
                |> Just


parseLights : String -> Set Int
parseLights lights =
    lights
        |> String.toList
        |> List.filter (\c -> c == '.' || c == '#')
        |> List.indexedMap
            (\i c ->
                if c == '#' then
                    Just i

                else
                    Nothing
            )
        |> List.filterMap identity
        |> Set.fromList


parseButtons : List (List Int) -> List String -> ( List (List Int), String )
parseButtons acc words =
    case words of
        [] ->
            Debug.todo "Should never be empty"

        [ joltage ] ->
            ( acc, joltage )

        button :: rest ->
            parseButtons
                (parseNumbers button :: acc)
                rest


parseNumbers : String -> List Int
parseNumbers str =
    String.filter (\c -> Char.isDigit c || c == ',') str
        |> String.split ","
        |> List.filterMap String.toInt


parseInput : String -> List Machine
parseInput =
    String.lines
        >> List.filterMap
            (String.words
                >> parseMachine
            )


toggle : List Int -> Set Int -> Set Int
toggle button lights =
    case button of
        [] ->
            lights

        idx :: rest ->
            if Set.member idx lights then
                toggle
                    rest
                    (Set.remove idx lights)

            else
                toggle
                    rest
                    (Set.insert idx lights)


type State
    = Done Int
    | State Int (List (List Int)) (Set Int)


isDone : State -> Maybe Int
isDone state =
    case state of
        Done path ->
            Just path

        _ ->
            Nothing


step : Int -> Set Int -> List (List Int) -> List State
step count state buttons =
    case buttons of
        [] ->
            []

        button :: rest ->
            let
                state2 =
                    toggle button state
            in
            if Set.isEmpty state2 then
                [ Done (count + 1)
                ]

            else
                State (count + 1) rest state2 :: step count state rest


bfs : Int -> Set Int -> List (List Int) -> List Int
bfs count set buttons =
    let
        states =
            step count set buttons

        done =
            List.filterMap isDone states
    in
    case done of
        [] ->
            List.concatMap
                (\state ->
                    case state of
                        Done _ ->
                            Debug.todo "not possible"

                        State pt btns set2 ->
                            bfs pt set2 btns
                )
                states

        _ ->
            done


failOnNothing : String -> Maybe a -> a
failOnNothing msg mb =
    case mb of
        Just x ->
            x

        Nothing ->
            Debug.todo msg


part1 : String -> Int
part1 s =
    let
        machines =
            parseInput s
    in
    machines
        |> List.map
            (\machine ->
                bfs 0 machine.lights machine.buttons
                    |> List.minimum
                    |> failOnNothing "Non empty list"
            )
        |> List.sum




allZero array =
    Array.filter ((/=) 0) array
        |> Array.isEmpty


anyNegative array =
    Array.filter ((>) 0) array
        |> Array.isEmpty
        |> not


subtract buttons array =
    case buttons of
        [] ->
            array

        button :: rest ->
            case Array.get button array of
                Just j ->
                    Array.set button (j - 1) array
                        |> subtract rest

                Nothing ->
                    array


search count buttons joltage =
    let
        next =
            List.map
                (\button ->
                    subtract button joltage
                )
                buttons
                |> List.filter (anyNegative >> not)
    in
    if List.any allZero next then
        [ count
        ]

    else
        List.concatMap (search (count + 1) buttons) next


loop ( n, best ) count buttons joltage =
    if count >= best then
        ( n, best )

    else if allZero joltage then
        ( n, count )

    else if anyNegative joltage then
        ( n, best )

    else
        case buttons of
            [] ->
                ( n, best )

            button :: rest ->
                let
                    next =
                        subtract button joltage
                in
                loop
                    (loop ( n + 1, best ) (count + 1) buttons next)
                    count
                    rest
                    joltage


toMask len idxs =
    List.foldl
        (\i a ->
            case Array.get i a of
                Just x ->
                    Array.set i (x + 1) a

                Nothing ->
                    a
        )
        (Array.repeat len 0)
        idxs


part2 s =
    let
        machines =
            parseInput s
    in
    machines
        |> List.map
            (\machine ->
                let
                    _ =
                        machine.buttons
                            |> List.sortBy List.length
                            |> List.map
                                (toMask
                                    (Array.length machine.joltage)
                                    >> Debug.log "buttons"
                                )

                    _ =
                        Debug.log "joltage" machine.joltage
                in
                machine
                    |> .joltage
                    |> loop ( 0, 999 ) 0 machine.buttons
                    |> Debug.log "done"
            )


test =
    """[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}"""


