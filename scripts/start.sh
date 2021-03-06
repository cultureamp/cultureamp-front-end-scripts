#!/bin/bash

CONFIG_FILE="$PWD/webpack.config.js"
if [ ! -f $CONFIG_FILE ]
  then
    CONFIG_FILE='node_modules/cultureamp-front-end-scripts/config/webpack/webpack.config.js'
fi

NODE_ENV=development node_modules/.bin/webpack-dev-server --host=0.0.0.0 --mode development --config $CONFIG_FILE
