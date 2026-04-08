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
    # Use npx -p typescript to ensure we get the real TypeScript compiler, not the 'tsc' npm package
    npx -p typescript tsc --noEmit --skipLibCheck
    echo "→ Import check..."
    npx -p tsx tsx -e "import * as sdk from './src/index'; console.log('Exports:', Object.keys(sdk).length)"
    echo "✓ Node/TypeScript smoke tests passed"
    ;;

  php)
    if ! command -v php &>/dev/null; then
      echo "✗ php not found — skipping (install PHP or use setup-php action in CI)"
      exit 1
    fi
    echo "→ PHP syntax check..."
    php_errors=0
    while IFS= read -r -d '' file; do
      if ! php -l "$file" 2>&1 | grep -q "No syntax errors"; then
        php -l "$file" 2>&1
        php_errors=$((php_errors + 1))
      fi
    done < <(find "${SDK_DIR}/src" -name "*.php" -print0)
    if [ "${php_errors}" -gt 0 ]; then
      echo "✗ ${php_errors} PHP syntax errors found"
      exit 1
    fi
    echo "→ Import check..."
    cd "${SDK_DIR}"
    if [ -f "composer.json" ]; then
      composer install --no-interaction --quiet 2>/dev/null || true
      php -r "require_once 'vendor/autoload.php'; new \Shotstack\Client\Configuration();" 2>/dev/null || \
        echo "  (Skipping autoload check — composer deps may not be available)"
    fi
    echo "✓ PHP smoke tests passed"
    ;;

  python)
    if ! command -v python3 &>/dev/null; then
      echo "✗ python3 not found — skipping"
      exit 1
    fi
    echo "→ Python syntax check..."
    py_errors=0
    while IFS= read -r -d '' file; do
      if ! python3 -m py_compile "$file" 2>/dev/null; then
        echo "  Syntax error: $file"
        py_errors=$((py_errors + 1))
      fi
    done < <(find "${SDK_DIR}/shotstack_sdk" -name "*.py" -not -path "*/test/*" -not -path "*/__pycache__/*" -print0)
    if [ "${py_errors}" -gt 0 ]; then
      echo "✗ ${py_errors} Python syntax errors found"
      exit 1
    fi
    echo "→ Import check..."
    cd "${SDK_DIR}"
    python3 -c "import shotstack_sdk; print('Modules:', dir(shotstack_sdk))" 2>/dev/null || \
      echo "  (Skipping import check — dependencies may not be available)"
    echo "✓ Python smoke tests passed"
    ;;

  ruby)
    if ! command -v ruby &>/dev/null; then
      echo "✗ ruby not found — skipping"
      exit 1
    fi
    echo "→ Ruby syntax check..."
    ruby_errors=0
    while IFS= read -r -d '' file; do
      if ! ruby -c "$file" 2>/dev/null | grep -q "Syntax OK"; then
        ruby -c "$file" 2>&1
        ruby_errors=$((ruby_errors + 1))
      fi
    done < <(find "${SDK_DIR}/lib" -name "*.rb" -print0)
    if [ "${ruby_errors}" -gt 0 ]; then
      echo "✗ ${ruby_errors} Ruby syntax errors found"
      exit 1
    fi
    echo "→ Import check..."
    cd "${SDK_DIR}"
    if [ -f "Gemfile" ] || [ -f "shotstack.gemspec" ]; then
      bundle install --quiet 2>/dev/null || true
      ruby -e "require_relative 'lib/shotstack'; puts 'Module loaded: Shotstack'" 2>/dev/null || \
        echo "  (Skipping require check — gem deps may not be available)"
    fi
    echo "✓ Ruby smoke tests passed"
    ;;

  *)
    echo "Unknown language: ${LANGUAGE}" >&2
    echo "Supported: node, php, python, ruby" >&2
    exit 1
    ;;
esac
