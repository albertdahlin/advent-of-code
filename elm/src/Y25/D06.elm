module Y25.D06 exposing (..)

import List.Extra


apply : String -> List Int -> Int
apply op args =
    case op of
        "*" ->
            List.product args

        "+" ->
            List.sum args

        _ ->
            0


part1 : String -> Int
part1 s =
    String.lines s
        |> List.Extra.unconsLast
        |> Maybe.map
            (\( lastLine, lines ) ->
                lines
                    |> List.map (String.words >> List.filterMap String.toInt)
                    |> List.Extra.transpose
                    |> List.map2 apply (String.words lastLine)
                    |> List.sum
            )
        |> Maybe.withDefault -1


splitWhen : a -> List a -> List a -> List (List a)
splitWhen value acc list =
    case list of
        [] ->
            [ acc ]

        x :: xs ->
            if x == value then
                acc :: splitWhen value [] xs

            else
                splitWhen value (x :: acc) xs


part2 : String -> Int
part2 s =
    String.lines s
        |> List.Extra.unconsLast
        |> Maybe.map
            (\( lastLine, lines ) ->
                lines
                    |> List.map String.toList
                    |> List.Extra.transpose
                    |> List.map
                        (List.filter (\c -> c /= ' ')
                            >> String.fromList
                            >> String.toInt
                            >> Maybe.withDefault -1
                        )
                    |> splitWhen -1 []
                    |> List.map2 apply (String.words lastLine)
                    |> List.sum
            )
        |> Maybe.withDefault -1


test : String
test =
    """123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  """
