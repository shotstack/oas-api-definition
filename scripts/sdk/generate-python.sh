#!/usr/bin/env bash
set -euo pipefail

# Generate Python SDK from bundled OAS spec
# Usage: generate-python.sh <spec-file> <output-dir> <version>
#
# Note: Python uses openapi-generator v5.4.0 due to oneOf/anyOf bugs in v7.x.
# The discriminator-based oneOf deserialization in Python remains broken in v7.21.0.
# Re-test on each major openapi-generator release.

SPEC_FILE="${1:?Usage: generate-python.sh <spec-file> <output-dir> <version>}"
OUTPUT_DIR="${2:?Usage: generate-python.sh <spec-file> <output-dir> <version>}"
VERSION="${3:?Usage: generate-python.sh <spec-file> <output-dir> <version>}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OAS_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
CONFIGS_DIR="${OAS_ROOT}/configs"
TEMPLATES_DIR="${OAS_ROOT}/templates/python"

PYTHON_GENERATOR_VERSION="5.4.0"

echo "Generating Python SDK v${VERSION} from ${SPEC_FILE}..."
echo "Using openapi-generator v${PYTHON_GENERATOR_VERSION} (Python requires legacy version)"

npx @openapitools/openapi-generator-cli version-manager set "${PYTHON_GENERATOR_VERSION}"

# cd to OAS root for consistent working directory
cd "${OAS_ROOT}"
npx @openapitools/openapi-generator-cli generate \
  -i "${SPEC_FILE}" \
  -g python \
  -c "${CONFIGS_DIR}/python.yaml" \
  -o "${OUTPUT_DIR}" \
  --template-dir "${OAS_ROOT}/templates/python" \
  --additional-properties=packageName="shotstack_sdk",projectName="shotstack-sdk",pythonAttrNoneIfUnset=true,packageVersion="${VERSION}",packageUrl="https://shotstack.io/product/sdk/python/",infoName="Shotstack",infoEmail="pypi@shotstack.io",licenseInfo="MIT"

echo "Python SDK generated at ${OUTPUT_DIR}"
