module Utils exposing (..)

prependMaybeToList : Maybe a -> List a -> List a
prependMaybeToList maybe list =
    case maybe of
        Just a -> [a] ++ list
        Nothing -> list