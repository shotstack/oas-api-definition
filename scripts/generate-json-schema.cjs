const fs = require('fs');
const path = require('path');

const BUNDLED_PATH = path.join(__dirname, '..', 'dist', 'api.bundled.json');
const OUT_DIR = path.join(__dirname, '..', 'dist', 'json-schema');
const MAX_CHARS = 5000;

// Properties to remove from object schemas
const STRIP_PROPERTIES = new Set(['instance']);

// Max total chars for enum values per field (strip large enums to plain type)
const MAX_ENUM_CHARS = 250;

// Schema names to exclude entirely from $defs and anyOf branches
// Schemas to exclude (exact names and patterns)
const EXCLUDE_EXACT = new Set([
  'MuxDestination', 'MuxDestinationOptions',
  'DolbyEnhancement', 'DolbyEnhancementOptions',
  'HtmlAsset', 'TitleAsset', 'TextAsset',
]);
const EXCLUDE_PATTERNS = [
  /GeneratedAsset/,     // All generated asset schemas (HeyGen, OpenAi, StabilityAi, DID, etc.)
  /TextToSpeechOptions/,
  /TextToImageOptions/,
  /TextToAvatarOptions/,
  /TextGeneratorOptions/,
];
function isExcluded(name) {
  return EXCLUDE_EXACT.has(name) || EXCLUDE_PATTERNS.some(p => p.test(name));
}

const STRIP_KEYWORDS = new Set([
  // OAS-only keywords
  'example', 'xml', 'deprecated', 'discriminator',
  // Informational metadata (unsupported by Cerebras strict mode)
  'title', 'default', '$schema',
  // String validation (unsupported by Cerebras)
  'minLength', 'maxLength', 'pattern', 'format',
  // Array validation (unsupported by Cerebras)
  'minItems', 'maxItems', 'uniqueItems',
  // Object validation (not needed with additionalProperties: false)
  'minProperties', 'maxProperties',
]);

// Number constraints ARE supported by Cerebras:
// minimum, maximum, exclusiveMinimum, exclusiveMaximum, multipleOf

const api = JSON.parse(fs.readFileSync(BUNDLED_PATH, 'utf8'));
const oasSchemas = api.components.schemas;

// Make a property schema nullable using anyOf with null
function makeNullable(propSchema) {
  if (propSchema.$ref) {
    return { anyOf: [propSchema, { type: 'null' }] };
  }
  if (propSchema.anyOf) {
    if (!propSchema.anyOf.some(s => s.type === 'null')) {
      return { ...propSchema, anyOf: [...propSchema.anyOf, { type: 'null' }] };
    }
    return propSchema;
  }
  if (propSchema.oneOf) {
    if (!propSchema.oneOf.some(s => s.type === 'null')) {
      const { oneOf, ...rest } = propSchema;
      return { ...rest, anyOf: [...oneOf, { type: 'null' }] };
    }
    return propSchema;
  }
  if (propSchema.type) {
    const types = Array.isArray(propSchema.type) ? propSchema.type : [propSchema.type];
    if (!types.includes('null')) {
      const { type, ...rest } = propSchema;
      return { anyOf: [{ type: types.length === 1 ? types[0] : types, ...rest }, { type: 'null' }] };
    }
  }
  return propSchema;
}

function convertSchema(schema) {
  if (schema === null || schema === undefined || typeof schema !== 'object') {
    return schema;
  }

  if (Array.isArray(schema)) {
    return schema.map(convertSchema).filter(item => {
      // Remove $refs to excluded schemas from arrays (e.g. anyOf branches)
      if (item && item.$ref) {
        const match = item.$ref.match(/\/([^/]+)$/);
        if (match && isExcluded(match[1])) return false;
      }
      return true;
    });
  }

  const out = {};
  for (const [key, value] of Object.entries(schema)) {
    if (STRIP_KEYWORDS.has(key) || key.startsWith('x-')) continue;

    // Rewrite $ref paths
    if (key === '$ref' && typeof value === 'string') {
      out[key] = value.replace('#/components/schemas/', '#/$defs/').replace(/\/oneOf\//g, '/anyOf/');
      continue;
    }

    // Skip OAS nullable (handled below)
    if (key === 'nullable') continue;

    // Rename oneOf → anyOf (Cerebras only supports anyOf)
    if (key === 'oneOf') {
      out.anyOf = convertSchema(value);
      continue;
    }

    // Convert properties dict: each value is a schema, but the dict itself is not
    if (key === 'properties' && typeof value === 'object' && !Array.isArray(value)) {
      const props = {};
      for (const [propName, propSchema] of Object.entries(value)) {
        if (STRIP_PROPERTIES.has(propName)) continue;
        const converted = convertSchema(propSchema);
        // Derive enum from default/example for discriminator-like fields (e.g. provider)
        // When both default and example are the same string, it's a constant identifier
        if (propSchema.type === 'string' && !propSchema.enum
            && propSchema.default && propSchema.default === propSchema.example) {
          converted.enum = [propSchema.default];
        }
        props[propName] = converted;
      }
      out.properties = props;
      continue;
    }

    out[key] = convertSchema(value);
  }

  // Handle OAS nullable → anyOf with null (move all props into base branch)
  if (schema.nullable === true && out.type) {
    const base = { ...out };
    for (const k of Object.keys(out)) delete out[k];
    out.anyOf = [base, { type: 'null' }];
  }

  // anyOf unions: strip type/additionalProperties from parent (branches define types)
  if (out.anyOf && !out.properties) {
    delete out.type;
    delete out.additionalProperties;
  }

  // Strip large enums to keep under Cerebras string length limit
  if (out.enum && out.enum.reduce((sum, v) => sum + String(v).length, 0) > MAX_ENUM_CHARS) {
    delete out.enum;
  }

  // Strict mode: untyped schemas default to string
  if (!out.type && !out.$ref && !out.anyOf && !out.enum && !out.properties && !out.items && out.description) {
    out.type = 'string';
  }

  // Strict mode: schemas with properties must have type: "object"
  if (out.properties && !out.type) {
    out.type = 'object';
  }

  // Strict mode: objects need additionalProperties: false
  if (out.type === 'object' && out.properties) {
    out.additionalProperties = false;
  }

  // Strict mode: all properties must be required, optional ones become nullable
  if (out.properties) {
    const originalRequired = new Set(schema.required || []);
    const allKeys = Object.keys(out.properties);

    for (const key of allKeys) {
      if (!originalRequired.has(key)) {
        out.properties[key] = makeNullable(out.properties[key]);
      }
    }

    out.required = allKeys;
  }

  return out;
}

// Collect all $ref dependencies for a schema (transitive)
function collectDeps(schema, allDefs) {
  const deps = new Set();
  function walk(obj) {
    if (!obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) { obj.forEach(walk); return; }
    if (obj.$ref && typeof obj.$ref === 'string') {
      const match = obj.$ref.match(/^#\/\$defs\/(.+?)(?:\/|$)/);
      if (match && !deps.has(match[1])) {
        deps.add(match[1]);
        if (allDefs[match[1]]) walk(allDefs[match[1]]);
      }
    }
    for (const v of Object.values(obj)) walk(v);
  }
  walk(schema);
  return deps;
}

// Collect all description strings with their paths for truncation
function collectDescriptions(obj, path, result) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) { obj.forEach((v, i) => collectDescriptions(v, [...path, i], result)); return; }
  for (const [k, v] of Object.entries(obj)) {
    if (k === 'description' && typeof v === 'string') {
      result.push({ path: [...path, k], length: v.length });
    }
    collectDescriptions(v, [...path, k], result);
  }
}

// Set a value at a nested path
function setAtPath(obj, pathArr, value) {
  let current = obj;
  for (let i = 0; i < pathArr.length - 1; i++) {
    current = current[pathArr[i]];
  }
  current[pathArr[pathArr.length - 1]] = value;
}

// Get a value at a nested path
function getAtPath(obj, pathArr) {
  let current = obj;
  for (const key of pathArr) {
    current = current[key];
  }
  return current;
}

// Truncate descriptions proportionally to fit within maxChars
function fitToSize(output, maxChars) {
  let json = JSON.stringify(output);
  if (json.length <= maxChars) return output;

  // Deep clone to avoid mutating original
  const clone = JSON.parse(json);

  // Collect all descriptions
  const descs = [];
  collectDescriptions(clone, [], descs);
  if (descs.length === 0) return clone;

  const totalDescChars = descs.reduce((sum, d) => sum + d.length, 0);
  const excess = json.length - maxChars;

  if (excess >= totalDescChars) {
    // Even removing all descriptions won't be enough — strip them all
    for (const d of descs) setAtPath(clone, d.path, '');
    // Remove empty description keys
    stripEmptyDescriptions(clone);
    return clone;
  }

  // Calculate max length per description (proportional reduction)
  const ratio = 1 - (excess / totalDescChars);
  for (const d of descs) {
    const maxLen = Math.max(0, Math.floor(d.length * ratio));
    const current = getAtPath(clone, d.path);
    if (current.length > maxLen) {
      setAtPath(clone, d.path, maxLen > 3 ? current.slice(0, maxLen - 3) + '...' : '');
    }
  }

  // Verify and do a second pass if still over (due to JSON escaping)
  json = JSON.stringify(clone);
  if (json.length > maxChars) {
    const stillOver = json.length - maxChars;
    const remaining = [];
    collectDescriptions(clone, [], remaining);
    const totalRemaining = remaining.reduce((sum, d) => sum + d.length, 0);
    if (totalRemaining > 0) {
      const ratio2 = Math.max(0, 1 - (stillOver / totalRemaining) - 0.1);
      for (const d of remaining) {
        const current = getAtPath(clone, d.path);
        const maxLen = Math.max(0, Math.floor(current.length * ratio2));
        if (current.length > maxLen) {
          setAtPath(clone, d.path, maxLen > 3 ? current.slice(0, maxLen - 3) : '');
        }
      }
    }
  }

  stripEmptyDescriptions(clone);
  return clone;
}

function stripEmptyDescriptions(obj) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) { obj.forEach(stripEmptyDescriptions); return; }
  if (obj.description === '') delete obj.description;
  for (const v of Object.values(obj)) stripEmptyDescriptions(v);
}

// Convert all schemas (only non-excluded)
const allDefs = {};
for (const [name, schema] of Object.entries(oasSchemas)) {
  if (isExcluded(name)) continue;
  allDefs[name] = convertSchema(schema);
}

// Collect Edit API schemas: Edit + all transitive deps
const editDeps = collectDeps(allDefs.Edit, allDefs);
editDeps.add('Edit');
const defs = {};
for (const name of editDeps) {
  if (allDefs[name]) defs[name] = allDefs[name];
}

// Clean and recreate output directory
fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

let totalFiles = 0;
let overLimit = 0;

for (const [name, schema] of Object.entries(defs)) {
  const deps = collectDeps(schema, defs);
  const localDefs = {};
  for (const dep of deps) {
    if (defs[dep]) localDefs[dep] = defs[dep];
  }

  const output = {
    name,
    strict: true,
    schema: {
      ...schema,
      ...(Object.keys(localDefs).length > 0 ? { $defs: localDefs } : {}),
    },
  };

  const fitted = fitToSize(output, MAX_CHARS);
  if (JSON.stringify(fitted).length > MAX_CHARS) overLimit++;

  const fileName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() + '.json';
  fs.writeFileSync(path.join(OUT_DIR, fileName), JSON.stringify(fitted, null, 2) + '\n');
  totalFiles++;
}

// Also output combined schemas.json for general use (no size limit)
fs.writeFileSync(path.join(OUT_DIR, 'schemas.json'), JSON.stringify({ $defs: defs }, null, 2) + '\n');

// Report
const files = fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.json') && f !== 'schemas.json');
const sizes = files.map(f => ({ name: f, chars: JSON.stringify(JSON.parse(fs.readFileSync(path.join(OUT_DIR, f), 'utf8'))).length }));
const under = sizes.filter(s => s.chars <= MAX_CHARS).length;
const editSize = sizes.find(s => s.name === 'edit.json');

console.log(`Generated ${totalFiles} Edit API schema files + schemas.json`);
console.log(`  ${under}/${totalFiles} under ${MAX_CHARS} chars`);
if (overLimit > 0) console.log(`  ${overLimit} over limit`);
if (editSize) console.log(`  edit.json: ${editSize.chars} chars`);

// Generate barrel files for module imports
fs.writeFileSync(path.join(OUT_DIR, 'index.js'), [
  "import { createRequire } from 'module';",
  "const require = createRequire(import.meta.url);",
  "export const edit = require('./edit.json');",
  '',
].join('\n'));

fs.writeFileSync(path.join(OUT_DIR, 'index.cjs'), [
  "module.exports.edit = require('./edit.json');",
  '',
].join('\n'));

fs.writeFileSync(path.join(OUT_DIR, 'index.d.ts'), [
  'export interface JsonSchema {',
  '  name: string;',
  '  strict: boolean;',
  '  schema: Record<string, unknown>;',
  '}',
  'export declare const edit: JsonSchema;',
  '',
].join('\n'));

console.log('Generated barrel files: index.js, index.cjs, index.d.ts');
