#!/bin/bash

#######################################################
# SDK generator
#
# Setup:
#
# https://openapi-generator.tech
# `npm install @openapitools/openapi-generator-cli -g`
#
#######################################################

# Setup variables
SPEC_FILE=./api.oas3.yaml
SPEC_FILE_JSON=./api.oas3.json
BUILD_DIR=./build/sdks
TEMPLATES_DIR=./templates
CONFIGS_DIR=./configs
OPENAPI_GENERATOR_VERSION_STABLE=7.4.0
OPENAPI_GENERATOR_VERSION_LEGACY=5.4.0
SDK_VERSION=0.2.9

echo "Current SDK_VERSION is set to: $SDK_VERSION"
read -p "Is this version correct? (y/n): " confirm

if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
    echo "Building SDKs with version: $SDK_VERSION."
else
    echo "Please update the SDK_VERSION in the build-sdks.sh file to the correct version."
    exit 1
fi

# Prepare build dir
rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR

# Validate OpenAPI 3.0 YAML
./node_modules/.bin/swagger-cli validate $SPEC_FILE

# Resolve YAML files in to one master JSON file
./node_modules/.bin/swagger-cli bundle -o $SPEC_FILE_JSON $SPEC_FILE

# Determine where the OpenAPI Generator is. This can vary depending
# on how it has been installed (manually, source, Homebrew or NPM).
OPENAPI_GENERATOR=`which openapi-generator-cli`
if [ $? -ne 0 ]; then
    OPENAPI_GENERATOR=`which openapi-generator`
fi

if [ "$OPENAPI_GENERATOR" = "" ]; then
    >&2 echo "Can't find openapi-generator or openapi-generator-cli - is it installed?"
    exit 1
fi

echo "- using OpenAPI generator $OPENAPI_GENERATOR"

# Resolve YAML files in to one master file
./node_modules/.bin/swagger-cli bundle -o $SPEC_FILE_JSON $SPEC_FILE

# Set Open API generator version
$OPENAPI_GENERATOR version-manager set $OPENAPI_GENERATOR_VERSION_STABLE

# PHP SDK
$OPENAPI_GENERATOR generate -i $SPEC_FILE_JSON -g php -c $CONFIGS_DIR/php.yaml -o $BUILD_DIR/php \
    --additional-properties=invokerPackage=Shotstack\\\\Client,licenseName="MIT",composerPackageName="shotstack/shotstack-sdk-php",srcBasePath="src",artifactVersion=$SDK_VERSION,artifactUrl="https://shotstack.io",developerOrganization="Shotstack",developerOrganizationUrl="https://shotstack.io"

printf "\n========================================= \n"
printf "\nPHP SDK Generated\n\n"

# Ruby SDK
$OPENAPI_GENERATOR generate -i $SPEC_FILE_JSON -g ruby -c $CONFIGS_DIR/ruby.yaml -o $BUILD_DIR/ruby \
    --additional-properties=moduleName="Shotstack",gemAuthor="Shotstack",gemAuthorEmail="ruby@shotstack.io",gemHomepage="https://shotstack.io/product/sdk/ruby/",gemLicense="MIT",gemVersion=$SDK_VERSION,

printf "\n========================================= \n"
printf "\nRuby SDK Generated\n\n"

# Node SDK
$OPENAPI_GENERATOR generate -i $SPEC_FILE_JSON -g javascript -c $CONFIGS_DIR/node.yaml -o $BUILD_DIR/node \
    --additional-properties=emitModelMethods=true,licenseName="MIT",projectName="shotstack-sdk",useES6=false,usePromises=true,projectVersion=$SDK_VERSION
cd $BUILD_DIR/node
npm install
npm run build
cd -

printf "\n========================================= \n"
printf "\nNode SDK Generated\n\n"

# Node (Typescript) SDK
$OPENAPI_GENERATOR generate -i $SPEC_FILE_JSON -g typescript-node -c $CONFIGS_DIR/typescript.yaml  -o $BUILD_DIR/typescript \
    --additional-properties=npmName="shotstack-sdk-typescript",supportsES6=true,npmVersion=$SDK_VERSION,enumPropertyNaming=UPPERCASE,licenseName="MIT"

printf "\n========================================= \n"
printf "\nTypescript SDK Generated\n\n"

# Python SDK
# v7.4.0 seems to have a bunch of bugs around oneOf and anyOf. Revert to v5.4.0
$OPENAPI_GENERATOR version-manager set $OPENAPI_GENERATOR_VERSION_LEGACY
$OPENAPI_GENERATOR generate -i $SPEC_FILE_JSON -g python -c $CONFIGS_DIR/python.yaml -o $BUILD_DIR/python \
    --additional-properties=packageName="shotstack_sdk",projectName="shotstack-sdk",pythonAttrNoneIfUnset=true,packageVersion=$SDK_VERSION,packageUrl="https://shotstack.io/product/sdk/python/",infoName="Shotstack",infoEmail="pypi@shotstack.io",licenseInfo="MIT"

printf "\n========================================= \n"
printf "\nPython SDK Generated\n\n"

# Openapi doesn't support duplicate path mapping
sed -i -e 's/\/path_alias_createassets/\/assets/g' $BUILD_DIR/node/dist/api/CreateApi.js
sed -i -e 's/\/path_alias_createassets/\/assets/g' $BUILD_DIR/typescript/api/createApi.ts
sed -i -e 's/\/path_alias_createassets/\/assets/g' $BUILD_DIR/php/src/Api/CreateApi.php
sed -i -e 's/\/path_alias_createassets/\/assets/g' $BUILD_DIR/python/shotstack_sdk/api/create_api.py
sed -i -e 's/\/path_alias_createassets/\/assets/g' $BUILD_DIR/ruby/lib/shotstack/api/create_api.rb

# Revert back to stable version
$OPENAPI_GENERATOR version-manager set $OPENAPI_GENERATOR_VERSION_STABLE

# Cleanup
rm -f $SPEC_FILE_JSON