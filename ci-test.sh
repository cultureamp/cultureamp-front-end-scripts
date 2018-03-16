#!/bin/bash
set -e
set -o pipefail
set -u

function log {
    printf "\x1b[48;2;240;76;93m\x1b[38;2;255;255;255m CA \x1b[0m\x1b[38;2;240;76;93m "
    echo $1
    printf "\x1b[0m"
}

log "G'day Trav"

log "Run flow on the JS in this repo"
yarn flow

log "Run Jest tests for Webpack Config Maker"
yarn jest webpack-config-maker

log "Clone the front-end-example repo and install the current front-end-scripts"
FRONT_END_SCRIPTS_DIR=`pwd`
rm -rf tmp && mkdir tmp && cd tmp
git clone https://github.com/cultureamp/cultureamp-front-end-example.git
cd cultureamp-front-end-example
yarn
yarn add "file:${FRONT_END_SCRIPTS_DIR}"

log "Test front-end-example scripts run correctly"
#yarn build
yarn test
yarn lint
yarn flow
yarn format

log "Cheers Trav"

