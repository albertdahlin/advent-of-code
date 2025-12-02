module Y25.D02 exposing (..)


toPair : List a -> Maybe ( a, a )
toPair lst =
    case lst of
        [ x, y ] ->
            Just ( x, y )

        _ ->
            Nothing


split : String -> Int -> List String
split str size =
    if String.isEmpty str then
        []

    else
        String.left size str :: split (String.dropLeft size str) size


groups : Int -> List Int
groups n =
    groups_ 1 n


groups_ : Int -> Int -> List Int
groups_ x n =
    if x > n // 2 then
        []

    else if modBy x n == 0 then
        x :: groups_ (x + 1) n

    else
        groups_ (x + 1) n


isInvalid1 : Int -> Bool
isInvalid1 id =
    let
        str =
            String.fromInt id

        len =
            String.length str
    in
    if len >= 2 then
        split str (len // 2)
            |> toPair
            |> Maybe.map (\( a, b ) -> a == b)
            |> Maybe.withDefault False

    else
        False


allEqual : List a -> Bool
allEqual list =
    case list of
        [] ->
            False

        x :: xs ->
            List.all ((==) x) xs


isInvalid2 : Int -> Bool
isInvalid2 id =
    let
        str =
            String.fromInt id

        len =
            String.length str
    in
    if len < 2 then
        False

    else
        groups len
            |> List.map (split str >> allEqual)
            |> List.any identity


part1 =
    parseInput
        >> List.map (\( start, end ) -> loop start end 0 isInvalid1)
        >> List.sum


part2 =
    parseInput
        >> List.map (\( start, end ) -> loop start end 0 isInvalid2)
        >> List.sum


loop : Int -> Int -> Int -> (Int -> Bool) -> Int
loop n end sum isValid =
    if n > end then
        sum

    else if isValid n then
        loop (n + 1) end (sum + n) isValid

    else
        loop (n + 1) end sum isValid


parseInput : String -> List ( Int, Int )
parseInput =
    String.split ","
        >> List.map
            (String.trim
                >> String.split "-"
                >> List.filterMap String.toInt
            )
        >> List.filterMap toPair


test =
    """11-22,95-115,998-1012,1188511880-1188511890,222220-222224,
1698522-1698528,446443-446449,38593856-38593862,565653-565659,
824824821-824824827,2121212118-2121212124"""


input =
    """194-253,81430782-81451118,7709443-7841298,28377-38007,6841236050-6841305978,2222204551-2222236166,2623-4197,318169-385942,9827-16119,580816-616131,646982-683917,147-181,90-120,3545483464-3545590623,4304-5747,246071-314284,8484833630-8484865127,743942-795868,42-53,1435-2086,50480-60875,16232012-16441905,94275676-94433683,61509567-61686956,3872051-4002614,6918792899-6918944930,77312-106847,282-387,829099-1016957,288251787-288311732,6271381-6313272,9877430-10095488,59-87,161112-224439,851833788-851871307,6638265-6688423,434-624,1-20,26-40,6700-9791,990-1307,73673424-73819233"""
