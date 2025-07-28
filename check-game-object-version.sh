#!/bin/bash

set -eu

FILE="src/app/models/game.ts"

if ! git diff --cached --quiet -- "$FILE"; then
    OLD=$(git show :1:"$FILE" 2>/dev/null || git show HEAD:"$FILE")
    NEW=$(git show :0:"$FILE")

    INTERFACE_CHANGED_LINES=$(diff \
        <(echo "$OLD" | sed -E -n '/^export interface |^interface /, /^}/ p') \
        <(echo "$NEW" | sed -E -n '/^export interface |^interface /, /^}/ p') |
        grep -E '^[<>]' | wc -l)

    if [ "$INTERFACE_CHANGED_LINES" -gt 0 ]; then
        echo "Interface changes detected in $FILE"

        OLD_VERSION=$(echo "$OLD" | sed -E -n 's/.*GAME_DATA_VERSION *= *(.+).*/\1/p')
        NEW_VERSION=$(echo "$NEW" | sed -E -n 's/.*GAME_DATA_VERSION *= *(.+).*/\1/p')

        if [ "$OLD_VERSION" = "$NEW_VERSION" ]; then
            echo "Game data version was not updated (still $NEW_VERSION)."
            exit 1
        else
            echo "Game data version updated from $OLD_VERSION to $NEW_VERSION"
            exit 0
        fi
    else
        echo "No interface changes detected in $FILE"
        exit 0
    fi
else
    echo "No changes detected in $FILE"
    exit 0
fi
