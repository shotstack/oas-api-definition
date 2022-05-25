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
BUILD_DIR=./build/sdks

# Prepare build dir
rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR

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

# PHP SDK
$OPENAPI_GENERATOR generate -i $SPEC_FILE -g php -o $BUILD_DIR/php \
                  --invoker-package Shotstack\\Client

printf "\n========================================= \n"
printf "\nPHP SDK Generated"
printf "\n\nNow fix:"
printf "\n-- OneOfTitleAssetImageAssetVideoAsset to Asset - see commit: http://tiny.cc/8jyu6y\n"
printf "\n========================================= \n"

# Ruby SDK
$OPENAPI_GENERATOR generate -i $SPEC_FILE -g ruby -o $BUILD_DIR/ruby \
    --additional-properties=moduleName="Shotstack"

printf "\n========================================= \n"
printf "\nRuby SDK Generated"
printf "\n\nNow fix:"
printf "\n-- OneOfTitleAssetImageAssetVideoAsset to Asset - see commit: http://tiny.cc/5i4w6y\n"
printf "\n========================================= \n"

# Node SDK
$OPENAPI_GENERATOR generate -i $SPEC_FILE -g javascript -o $BUILD_DIR/node \
    --additional-properties=emitModelMethods=true,licenseName="MIT",projectName="shotstack-sdk",useES6=false,usePromises=true

printf "\n========================================= \n"
printf "\nNode SDK Generated"
printf "\n\nNow fix:"
printf "\n-- OneOfTitleAssetImageAssetVideoAsset to Asset - see commit history"
printf "\n========================================= \n"

# Python SDK
$OPENAPI_GENERATOR generate -i $SPEC_FILE -g python -o $BUILD_DIR/python \
    --additional-properties=packageName="shotstack_sdk",projectName="shotstack-sdk",pythonAttrNoneIfUnset=true

printf "\n========================================= \n"
printf "\nPython SDK Generated"
printf "\n\nNow fix:"
printf "\n-- OneOfTitleAssetImageAssetVideoAsset to Asset - see commit history"
printf "\n========================================= \n"