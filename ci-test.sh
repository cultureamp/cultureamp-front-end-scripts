echo 'gday trav'
yarn link
rm -rf tmp
mkdir tmp && cd tmp
git clone https://github.com/cultureamp/cultureamp-front-end-example.git
cd cultureamp-front-end-example
yarn
yarn link cultureamp-front-end-scripts
yarn flow
yarn lint
yarn test
yarn format
echo 'cheers trav'

