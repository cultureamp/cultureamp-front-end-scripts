#!/bin/bash

CONFIG_FILE="$PWD/webpack.config.js"
if [ ! -f $CONFIG_FILE ]
  then
    CONFIG_FILE='node_modules/cultureamp-front-end-scripts/config/webpack/webpack.config.js'
fi

node_modules/.bin/webpack --mode production --config $CONFIG_FILE
