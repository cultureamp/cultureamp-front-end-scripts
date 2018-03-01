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

# Clone the example repo, install dependencies and link scripts
yarn link
rm -rf tmp
mkdir tmp && cd tmp
git clone https://github.com/cultureamp/cultureamp-front-end-example.git
cd cultureamp-front-end-example
yarn
yarn link cultureamp-front-end-scripts

# Run the tests
yarn flow
yarn lint
yarn test
yarn format

log "Cheers Trav"

