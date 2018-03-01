#!/bin/bash
set -e
set -o pipefail
set -u

echo "👋 G'day Trav"

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

echo "Cheers Trav 👋"

