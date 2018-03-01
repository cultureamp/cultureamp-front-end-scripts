#!/bin/bash

function log {
    printf "\x1b[48;2;240;76;93m\x1b[38;2;255;255;255m CA \x1b[0m\x1b[38;2;240;76;93m "
    echo $1
    printf "\x1b[0m"
}

if [ ! -f "$PWD/.flowconfig" ]
  then
    log "Local .flowconfig doesn't exist; copying from cultureamp-front-end-scripts module..."
    cp $PWD/node_modules/cultureamp-front-end-scripts/config/flow/flowconfig $PWD/.flowconfig
fi

node_modules/.bin/flow
