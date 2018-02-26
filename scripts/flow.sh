#!/bin/bash

if [ ! -f "$PWD/.flowconfig" ]
  then
    echo "🖖 Local .flowconfig doesn't exist; copying from cultureamp-front-end-scripts module..."
    cp $PWD/node_modules/cultureamp-front-end-scripts/config/flow/flowconfig $PWD/.flowconfig
fi

node_modules/.bin/flow
