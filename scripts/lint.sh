#!/bin/bash

CONFIG_FILE="$PWD/eslint.config.js"
IGNORE_FILE="$PWD/.eslintignore"

if [ ! -f $CONFIG_FILE ]
  then
    CONFIG_FILE="node_modules/cultureamp-front-end-scripts/config/eslint/eslint.config.js"
fi

if [ ! -f $IGNORE_FILE ]
  then
    echo "🖖 Local .eslintignore doesn't exist; copying from cultureamp-front-end-scripts module..."
    cp node_modules/cultureamp-front-end-scripts/config/eslint/eslintignore $PWD/.eslintignore
fi

node_modules/.bin/eslint --config $CONFIG_FILE --ignore-path $IGNORE_FILE .
