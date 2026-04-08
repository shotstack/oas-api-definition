#!/usr/bin/env bash
set -euo pipefail

# Generate PHP SDK from bundled OAS spec
# Usage: generate-php.sh <spec-file> <output-dir> <version>

SPEC_FILE="${1:?Usage: generate-php.sh <spec-file> <output-dir> <version>}"
OUTPUT_DIR="${2:?Usage: generate-php.sh <spec-file> <output-dir> <version>}"
VERSION="${3:?Usage: generate-php.sh <spec-file> <output-dir> <version>}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OAS_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
CONFIGS_DIR="${OAS_ROOT}/configs"
TEMPLATES_DIR="${OAS_ROOT}/templates/php"

echo "Generating PHP SDK v${VERSION} from ${SPEC_FILE}..."

npx @openapitools/openapi-generator-cli generate \
  -i "${SPEC_FILE}" \
  -g php \
  -c "${CONFIGS_DIR}/php.yaml" \
  -o "${OUTPUT_DIR}" \
  --template-dir "${TEMPLATES_DIR}" \
  --additional-properties=invokerPackage=Shotstack\\\\Client,licenseName="MIT",composerPackageName="shotstack/shotstack-sdk-php",srcBasePath="src",artifactVersion="${VERSION}",artifactUrl="https://shotstack.io",developerOrganization="Shotstack",developerOrganizationUrl="https://shotstack.io"

echo "PHP SDK generated at ${OUTPUT_DIR}"
