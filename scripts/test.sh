#!/bin/bash

CONFIG_FILE='$PWD/jest.config.js'

if [ ! -f $CONFIG_FILE ]
  then
    CONFIG_FILE='node_modules/cultureamp-front-end-scripts/config/jest/jest.config.js'
fi

node_modules/.bin/jest --config $CONFIG_FILE
