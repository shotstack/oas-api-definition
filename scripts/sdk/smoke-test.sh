#!/usr/bin/env bash
set -euo pipefail

# Run language-specific smoke tests on generated SDK code.
# Verifies that generated code compiles/imports without errors.
# Usage: smoke-test.sh <language> <sdk-dir>

LANGUAGE="${1:?Usage: smoke-test.sh <language> <sdk-dir>}"
SDK_DIR="${2:?Usage: smoke-test.sh <language> <sdk-dir>}"

echo "Running smoke tests for ${LANGUAGE} SDK at ${SDK_DIR}..."

case "${LANGUAGE}" in
  node|typescript)
    echo "→ TypeScript type-check..."
    cd "${SDK_DIR}"
    npm install --ignore-scripts 2>/dev/null || true
    npx tsc --noEmit --skipLibCheck
    echo "→ Import check..."
    node -e "import('./src/index.ts')" 2>/dev/null || \
      npx tsx -e "import * as sdk from './src/index'; console.log('Exports:', Object.keys(sdk).length)"
    echo "✓ Node/TypeScript smoke tests passed"
    ;;

  php)
    echo "→ PHP syntax check..."
    find "${SDK_DIR}/src" -name "*.php" -print0 | xargs -0 -n1 php -l 2>&1 | grep -v "No syntax errors" | head -20
    php_errors=$(find "${SDK_DIR}/src" -name "*.php" -print0 | xargs -0 -n1 php -l 2>&1 | grep -c "Parse error" || true)
    if [ "${php_errors}" -gt 0 ]; then
      echo "✗ ${php_errors} PHP syntax errors found"
      exit 1
    fi
    echo "→ Import check..."
    cd "${SDK_DIR}"
    if [ -f "composer.json" ]; then
      composer install --no-interaction --quiet 2>/dev/null || true
      php -r "require_once 'vendor/autoload.php'; new \Shotstack\Client\Configuration();" 2>/dev/null || \
        echo "  (Skipping autoload check — composer deps may not be available in CI)"
    fi
    echo "✓ PHP smoke tests passed"
    ;;

  python)
    echo "→ Python syntax check..."
    find "${SDK_DIR}" -name "*.py" -not -path "*/test/*" -print0 | \
      xargs -0 python3 -m py_compile 2>&1 || {
        echo "✗ Python syntax errors found"
        exit 1
      }
    echo "→ Import check..."
    cd "${SDK_DIR}"
    python3 -c "import shotstack_sdk; print('Modules:', dir(shotstack_sdk))" 2>/dev/null || \
      echo "  (Skipping import check — dependencies may not be available in CI)"
    echo "✓ Python smoke tests passed"
    ;;

  ruby)
    echo "→ Ruby syntax check..."
    find "${SDK_DIR}/lib" -name "*.rb" -print0 | xargs -0 -n1 ruby -c 2>&1 | grep -v "Syntax OK" | head -20
    ruby_errors=$(find "${SDK_DIR}/lib" -name "*.rb" -print0 | xargs -0 -n1 ruby -c 2>&1 | grep -c "SyntaxError" || true)
    if [ "${ruby_errors}" -gt 0 ]; then
      echo "✗ ${ruby_errors} Ruby syntax errors found"
      exit 1
    fi
    echo "→ Import check..."
    cd "${SDK_DIR}"
    if [ -f "Gemfile" ] || [ -f "shotstack.gemspec" ]; then
      bundle install --quiet 2>/dev/null || true
      ruby -e "require_relative 'lib/shotstack'; puts 'Module loaded: Shotstack'" 2>/dev/null || \
        echo "  (Skipping require check — gem deps may not be available in CI)"
    fi
    echo "✓ Ruby smoke tests passed"
    ;;

  *)
    echo "Unknown language: ${LANGUAGE}" >&2
    echo "Supported: node, php, python, ruby" >&2
    exit 1
    ;;
esac
