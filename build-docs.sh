#!/bin/bash -e

DOCS_DIR=build/docs
OAS3_YAML=api.oas3.yaml
OAS3_YAML_RESOLVED=api.oas3.resolved.yaml
OAS3_JSON=api.oas3.json
mkdir -p $DOCS_DIR

# Resolve YAML files in to one master file
./node_modules/.bin/speccy resolve $OAS3_YAML -o $OAS3_YAML_RESOLVED

# Convert YAML to JSON
./node_modules/.bin/js-yaml $OAS3_YAML_RESOLVED > $OAS3_JSON

# Convert OpenAPI to doc to Shins Markdown
./node_modules/.bin/widdershins \
    --theme dracula \
    --language_tabs shell:Curl http:HTTP javascript--nodejs:NodeJS php:PHP ruby:Ruby python:Python java:Java go:Go \
    --summary $OAS3_JSON \
    --outfile $DOCS_DIR/index.html.md

cp $DOCS_DIR/index.html.md .shins/source/index.html.md

# Replace Serve API URL's as overrides do not work
sed -i -e 's/https:\/\/api.shotstack.io\/{version}\/assets\//https:\/\/api.shotstack.io\/serve\/{version}\/assets\//g' .shins/source/index.html.md

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
    sed -i.bak -e '/{{TAGS}}/r.tags' -e '/{{TAGS}}/d' ./$DOCS_DIR/index.html
    rm -f ./$DOCS_DIR/index.html.bak
fi

rm -f ./$DOCS_DIR/index.html.md
rm -f $OAS3_JSON
rm -f $OAS3_YAML_RESOLVED
