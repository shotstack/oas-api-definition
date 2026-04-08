#!/usr/bin/env bash
set -euo pipefail

# Generate Ruby SDK from bundled OAS spec
# Usage: generate-ruby.sh <spec-file> <output-dir> <version>

SPEC_FILE="${1:?Usage: generate-ruby.sh <spec-file> <output-dir> <version>}"
OUTPUT_DIR="${2:?Usage: generate-ruby.sh <spec-file> <output-dir> <version>}"
VERSION="${3:?Usage: generate-ruby.sh <spec-file> <output-dir> <version>}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OAS_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
CONFIGS_DIR="${OAS_ROOT}/configs"
TEMPLATES_DIR="${OAS_ROOT}/templates/ruby"

echo "Generating Ruby SDK v${VERSION} from ${SPEC_FILE}..."

# cd to OAS root so config-relative paths (templateDir: templates/ruby) resolve
cd "${OAS_ROOT}"
npx @openapitools/openapi-generator-cli generate \
  -i "${SPEC_FILE}" \
  -g ruby \
  -c "${CONFIGS_DIR}/ruby.yaml" \
  -o "${OUTPUT_DIR}" \
  --template-dir "${OAS_ROOT}/templates/ruby" \
  --additional-properties=moduleName="Shotstack",gemAuthor="Shotstack",gemAuthorEmail="ruby@shotstack.io",gemHomepage="https://shotstack.io/product/sdk/ruby/",gemLicense="MIT",gemVersion="${VERSION}"

echo "Ruby SDK generated at ${OUTPUT_DIR}"
