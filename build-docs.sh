#!/bin/bash -e

DOCS_DIR=build/docs
OAS3_YAML=api.oas3.yaml
OAS3_JSON=api.oas3.json
mkdir -p $DOCS_DIR

# Validate OpenAPI 3.0 YAML
./node_modules/.bin/swagger-cli validate $OAS3_YAML

# Resolve YAML files in to one master JSON file
./node_modules/.bin/swagger-cli bundle -o $OAS3_JSON $OAS3_YAML

# Convert OpenAPI to doc to Shins Markdown
./node_modules/.bin/widdershins \
    --theme dracula \
    --language_tabs shell:Curl http:HTTP javascript--nodejs:NodeJS php:PHP ruby:Ruby python:Python java:Java go:Go \
    --summary $OAS3_JSON \
    --outfile $DOCS_DIR/index.html.md

cp $DOCS_DIR/index.html.md .shins/source/index.html.md

# Replace Create, Serve, Ingest API URL's as overrides do not work
sed -i -e 's/https:\/\/api.shotstack.io\/edit\/{version}\/assets/https:\/\/api.shotstack.io\/serve\/{version}\/assets/g' .shins/source/index.html.md
sed -i -e 's/https:\/\/api.shotstack.io\/edit\/{version}\/sources/https:\/\/api.shotstack.io\/ingest\/{version}\/sources/g' .shins/source/index.html.md
sed -i -e 's/https:\/\/api.shotstack.io\/edit\/{version}\/createassets/https:\/\/api.shotstack.io\/create\/{version}\/assets/g' .shins/source/index.html.md

# Openapi doesn't support duplicate path mapping
sed -i -e 's/\/path_alias_createassets/\/assets/g' .shins/source/index.html.md

# Build the Shins docs HTML
cd .shins
node shins.js \
    --logo ../assets/img/logo.svg \
    --logo-url https://shotstack.io \
    --customCss --minify
rm -f source/index.html.md-e
cd ..

mkdir -p $DOCS_DIR/source/images
cp .shins/index.html ./$DOCS_DIR/.
cp -r .shins/pub ./$DOCS_DIR/.
cp -r .shins/source/images/custom_logo.svg ./$DOCS_DIR/source/images/custom_logo.svg
cp -r .shins/source/images/navbar.png ./$DOCS_DIR/source/images/navbar.png
cp -r .shins/source/fonts ./$DOCS_DIR/source/fonts

# Insert Google Analytics
if [ -f .tags ]; then
    sed -i.tmp -e '/{{TAGS}}/r.tags' -e '/{{TAGS}}/d' ./$DOCS_DIR/index.html
    rm -f ./$DOCS_DIR/index.html.tmp
fi

rm -f ./$DOCS_DIR/index.html.md
rm -f $OAS3_JSON
