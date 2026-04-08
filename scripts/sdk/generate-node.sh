#!/usr/bin/env bash
set -euo pipefail

# Generate Node/TypeScript SDK using @hey-api/openapi-ts
# Usage: generate-node.sh <spec-file> <output-dir> <version>
#
# This uses hey-api instead of openapi-generator to produce modern TypeScript
# with Zod validation, fetch-based HTTP, and tree-shakeable exports.

SPEC_FILE="${1:?Usage: generate-node.sh <spec-file> <output-dir> <version>}"
OUTPUT_DIR="${2:?Usage: generate-node.sh <spec-file> <output-dir> <version>}"
VERSION="${3:?Usage: generate-node.sh <spec-file> <output-dir> <version>}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OAS_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

echo "Generating Node/TypeScript SDK v${VERSION}..."

mkdir -p "${OUTPUT_DIR}/src/generated"

# hey-api resolves $ref from the spec's directory, so we pass the absolute path
# to the YAML source. The bundled JSON has unresolved example $refs that hey-api
# tries to follow, so we use the original YAML instead.
# Run npx from the OAS root so it finds the locally-installed hey-api package.
cd "${OAS_ROOT}"
npx @hey-api/openapi-ts \
  --input "${OAS_ROOT}/api.oas3.yaml" \
  --output "${OUTPUT_DIR}/src/generated" \
  --plugins @hey-api/typescript @hey-api/sdk
cd -

# Write package.json for the generated SDK
cat > "${OUTPUT_DIR}/package.json" << EOF
{
  "name": "shotstack-sdk",
  "version": "${VERSION}",
  "description": "Official Node SDK for the Shotstack Cloud Video Editing API",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist"],
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/shotstack/shotstack-sdk-node.git"
  },
  "keywords": ["shotstack", "video", "video-editing", "video-api", "cloud-video"],
  "engines": {
    "node": ">=18"
  },
  "dependencies": {
    "zod": "^4.0.0"
  }
}
EOF

# Write tsconfig.json
cat > "${OUTPUT_DIR}/tsconfig.json" << EOF
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "esnext",
    "moduleResolution": "bundler",
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"]
}
EOF

# Write index.ts that re-exports everything
cat > "${OUTPUT_DIR}/src/index.ts" << 'EOF'
export * from './generated/types.gen';
export * from './generated/sdk.gen';
EOF

echo "Node/TypeScript SDK generated at ${OUTPUT_DIR}"
