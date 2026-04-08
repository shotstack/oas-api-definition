#!/usr/bin/env node

/**
 * Spec-vs-SDK conformance check.
 *
 * Parses the bundled OAS spec and verifies that the generated SDK
 * contains models/classes for every schema defined in the spec.
 *
 * Usage: node conformance-check.mjs <spec-json> <language> <sdk-dir>
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, basename } from 'path';

const [specFile, language, sdkDir] = process.argv.slice(2);

if (!specFile || !language || !sdkDir) {
  console.error('Usage: node conformance-check.mjs <spec-json> <language> <sdk-dir>');
  process.exit(1);
}

// Parse the OAS spec
const spec = JSON.parse(readFileSync(specFile, 'utf-8'));
const specSchemas = Object.keys(spec.components?.schemas || {});

console.log(`Checking ${language} SDK conformance against ${specSchemas.length} spec schemas...\n`);

/**
 * Get the list of model/type names from the generated SDK.
 */
function getSdkModels(language, sdkDir) {
  const models = new Set();

  switch (language) {
    case 'node': {
      // For hey-api generated SDK, check types.gen.ts for exported types
      const typesFile = join(sdkDir, 'src', 'generated', 'types.gen.ts');
      if (existsSync(typesFile)) {
        const content = readFileSync(typesFile, 'utf-8');
        const typeMatches = content.matchAll(/export\s+(?:type|interface)\s+(\w+)/g);
        for (const m of typeMatches) models.add(m[1]);
      }
      // Also check the index if types.gen.ts doesn't exist yet
      const indexFile = join(sdkDir, 'src', 'index.ts');
      if (existsSync(indexFile) && models.size === 0) {
        const content = readFileSync(indexFile, 'utf-8');
        const exportMatches = content.matchAll(/export\s+\{([^}]+)\}/g);
        for (const m of exportMatches) {
          m[1].split(',').forEach(name => models.add(name.trim()));
        }
      }
      break;
    }

    case 'php': {
      const modelDir = join(sdkDir, 'src', 'Model');
      if (existsSync(modelDir)) {
        for (const file of readdirSync(modelDir)) {
          if (file.endsWith('.php')) models.add(basename(file, '.php'));
        }
      }
      break;
    }

    case 'python': {
      const modelDir = join(sdkDir, 'shotstack_sdk', 'model');
      if (existsSync(modelDir)) {
        for (const file of readdirSync(modelDir)) {
          if (file.endsWith('.py') && file !== '__init__.py') {
            // Convert snake_case filename to PascalCase
            const name = basename(file, '.py')
              .split('_')
              .map(w => w.charAt(0).toUpperCase() + w.slice(1))
              .join('');
            models.add(name);
          }
        }
      }
      break;
    }

    case 'ruby': {
      const modelDir = join(sdkDir, 'lib', 'shotstack', 'models');
      if (existsSync(modelDir)) {
        for (const file of readdirSync(modelDir)) {
          if (file.endsWith('.rb')) {
            // Convert snake_case filename to PascalCase
            const name = basename(file, '.rb')
              .split('_')
              .map(w => w.charAt(0).toUpperCase() + w.slice(1))
              .join('');
            models.add(name);
          }
        }
      }
      break;
    }

    default:
      console.error(`Unknown language: ${language}`);
      process.exit(1);
  }

  return models;
}

const sdkModels = getSdkModels(language, sdkDir);

console.log(`Found ${sdkModels.size} models in ${language} SDK\n`);

// Compare
const missing = [];
const matched = [];

for (const schema of specSchemas) {
  if (sdkModels.has(schema)) {
    matched.push(schema);
  } else {
    missing.push(schema);
  }
}

// Report
if (matched.length > 0) {
  console.log(`✓ ${matched.length} schemas matched`);
}

if (missing.length > 0) {
  console.log(`\n✗ ${missing.length} schemas MISSING from ${language} SDK:`);
  for (const schema of missing.sort()) {
    console.log(`  - ${schema}`);
  }
  console.log('');
  process.exit(1);
} else {
  console.log(`\n✓ All ${specSchemas.length} spec schemas are present in the ${language} SDK`);
}
