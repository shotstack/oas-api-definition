DOCS_DIR=build/docs
OAS3_YAML=api.oas3.yaml
OAS3_JSON=api.oas3.json
mkdir -p $DOCS_DIR

# Convert YAML to JSON
./node_modules/.bin/js-yaml $OAS3_YAML > $OAS3_JSON

# Convert OpenAPI to doc to Shins Markdown
./node_modules/.bin/widdershins \
    --theme dracula \
    --language_tabs shell:Curl http:HTTP javascript--nodejs:NodeJS javascript:jQuery php:PHP ruby:Ruby python:Python java:Java go:Go \
    --summary $OAS3_JSON \
    --outfile $DOCS_DIR/index.html.md

cp $DOCS_DIR/index.html.md .shins/source/index.html.md

# Build the Shins docs HTML
cd .shins
node shins.js \
    --logo ../assets/img/logo.png \
    --logo-url https://shotstack.io \
    --customCss --minify

cd -

mkdir -p $DOCS_DIR/source/images
cp .shins/index.html ./$DOCS_DIR/.
cp -r .shins/pub ./$DOCS_DIR/.
cp -r .shins/source/images/custom_logo.png ./$DOCS_DIR/source/images/custom_logo.png
cp -r .shins/source/images/navbar.png ./$DOCS_DIR/source/images/navbar.png
cp -r .shins/source/fonts ./$DOCS_DIR/source/fonts

# Insert Google Analytics
sed -e "/{{GA}}/{r .ga" -e "d}" ./$DOCS_DIR/index.html > ./$DOCS_DIR/index.tmp.html
mv -f ./$DOCS_DIR/index.tmp.html ./$DOCS_DIR/index.html

rm ./$DOCS_DIR/index.html.md
rm $OAS3_JSON
