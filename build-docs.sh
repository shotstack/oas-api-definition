./node_modules/.bin/widdershins --search false --language_tabs 'curl:Curl' 'php:PHP' --summary api.oas3.json -o build/index.html.md
cp build/index.html.md .shins/source/index.html.md

cd .shins
node shins.js

cd -

cp .shins/index.html ./build/.
cp -r .shins/pub ./build/.

rm ./build/index.html.md
