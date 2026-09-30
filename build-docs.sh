#!/bin/bash -e
set -e

DOCS_DIR=${2:-build/docs}
OAS3_YAML=${1:-api.oas3.yaml}
OAS3_JSON=$DOCS_DIR/api.bundled.json
if [ "$#" -eq 0 ]; then
    rm -rf build/docs
fi
mkdir -p "$DOCS_DIR"

# Validate OpenAPI 3.0 YAML
./node_modules/.bin/swagger-cli validate "$OAS3_YAML"

# Resolve YAML files in to one master JSON file
./node_modules/.bin/swagger-cli bundle -o "$OAS3_JSON" "$OAS3_YAML" -t json

# Split bundled spec into per-API JSON files (api.edit.json, api.serve.json, api.ingest.json)
node scripts/split-by-api.cjs "$OAS3_JSON" "$DOCS_DIR"

# The reference shows each request body's example; widdershins only reads them as `examples`
SAMPLES_JSON=$(mktemp)
node scripts/promote-request-examples.cjs "$OAS3_JSON" "$SAMPLES_JSON"

# Convert OpenAPI to doc to Shins Markdown
./node_modules/.bin/widdershins \
    --theme vs2015 \
    --user_templates templates/code-samples \
    --language_tabs shell:Curl http:HTTP javascript--nodejs:NodeJS php:PHP ruby:Ruby python:Python java:Java go:Go \
    --summary "$SAMPLES_JSON" \
    --outfile "$DOCS_DIR/index.html.md"
rm -f "$SAMPLES_JSON"

cp "$DOCS_DIR/index.html.md" .shins/source/index.html.md

# Replace Serve, Ingest API URL's as overrides do not work. Matching the path, not the full URL, also
# rewrites the HTTP samples' request lines.
sed -i -e 's/\/edit\/{version}\/assets/\/serve\/{version}\/assets/g' .shins/source/index.html.md
sed -i -e 's/\/edit\/{version}\/sources/\/ingest\/{version}\/sources/g' .shins/source/index.html.md
sed -i -e 's/\/edit\/{version}\/upload/\/ingest\/{version}\/upload/g' .shins/source/index.html.md

# Build the Shins docs HTML
cd .shins
rm -f index.html
node shins.js \
    --logo ../assets/img/logo.svg \
    --logo-url https://shotstack.io \
    --customCss --minify
rm -f source/index.html.md-e
cd ..

mkdir -p "$DOCS_DIR/source/images"
cp .shins/index.html "$DOCS_DIR/"
cp -r .shins/pub "$DOCS_DIR/"
cp .shins/source/images/custom_logo.svg "$DOCS_DIR/source/images/custom_logo.svg"
cp .shins/source/images/navbar.png "$DOCS_DIR/source/images/navbar.png"
cp -r .shins/source/fonts "$DOCS_DIR/source/fonts"

# Insert Google Analytics
if [ -f .tags ]; then
    sed -i.tmp -e '/{{TAGS}}/r.tags' -e '/{{TAGS}}/d' "$DOCS_DIR/index.html"
    rm -f "$DOCS_DIR/index.html.tmp"
fi

rm -f "$DOCS_DIR/index.html.md"
if [ "$#" -eq 0 ]; then
    node scripts/build-reference-versions.cjs
fi
