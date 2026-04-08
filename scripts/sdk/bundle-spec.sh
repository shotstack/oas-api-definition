#!/usr/bin/env bash
set -euo pipefail

# Bundle the OAS YAML spec into a single JSON file for SDK generation.
# Usage: bundle-spec.sh <output-file>
#
# Must be run from the oas-api-definition root directory.

OUTPUT_FILE="${1:?Usage: bundle-spec.sh <output-file>}"

SPEC_FILE="./api.oas3.yaml"

if [ ! -f "${SPEC_FILE}" ]; then
  echo "Error: ${SPEC_FILE} not found. Run from the oas-api-definition root." >&2
  exit 1
fi

echo "Validating OpenAPI spec..."
npx @apidevtools/swagger-cli validate "${SPEC_FILE}"

echo "Bundling spec to ${OUTPUT_FILE}..."
npx @apidevtools/swagger-cli bundle -o "${OUTPUT_FILE}" -t json "${SPEC_FILE}"

echo "Spec bundled successfully."
