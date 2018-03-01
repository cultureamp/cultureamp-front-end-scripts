#!/bin/bash

function log {
    printf "\x1b[48;2;240;76;93m\x1b[38;2;255;255;255m CA \x1b[0m\x1b[38;2;240;76;93m "
    echo $1
    printf "\x1b[0m"
}

CONFIG_FILE="$PWD/eslint.config.js"
IGNORE_FILE="$PWD/.eslintignore"

if [ ! -f $CONFIG_FILE ]
  then
    CONFIG_FILE="node_modules/cultureamp-front-end-scripts/config/eslint/eslint.config.js"
fi

if [ ! -f $IGNORE_FILE ]
  then
    log "Local .eslintignore doesn't exist; copying from cultureamp-front-end-scripts module..."
    cp node_modules/cultureamp-front-end-scripts/config/eslint/eslintignore $PWD/.eslintignore
fi

node_modules/.bin/eslint --config $CONFIG_FILE --ignore-path $IGNORE_FILE .
