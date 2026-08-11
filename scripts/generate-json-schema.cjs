/**
 * Full-fidelity JSON Schema for the Edit API, for consumers that want the
 * complete contract (MCP tool inputSchemas, editor validation, docs tooling).
 *
 * Keeps optionality, every enum value, every asset type, all validation
 * keywords, `deprecated` flags, and descriptions (HTML converted to plain
 * text). OAS-only keywords (`xml`, `x-*`) are dropped; `nullable` and
 * `example` are converted to their JSON Schema equivalents.
 *
 * Output: dist/json-schema/edit.json — self-contained draft 2020-12 schema
 * with internal $defs, plus barrel index files for the `/json` subpath export.
 */
const fs = require("fs");
const path = require("path");

const BUNDLED_PATH = path.join(__dirname, "..", "dist", "api.bundled.json");
const OUT_DIR = path.join(__dirname, "..", "dist", "json-schema");

const api = JSON.parse(fs.readFileSync(BUNDLED_PATH, "utf8"));
const oasSchemas = api.components.schemas;

// OAS descriptions use HTML (<ul><li>, <b>, <a>) — flatten to plain text so
// agent-facing schema descriptions read cleanly.
function htmlToText(s) {
  return s
    .replace(/<li>/g, "\n- ")
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([^<]*)<\/a>/g, "$2 ($1)")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// OAS 3.0 schema object → JSON Schema draft 2020-12.
// Keeps everything except OAS-only keywords; converts nullable and example.
function convertSchema(schema) {
  if (schema === null || typeof schema !== "object") return schema;
  if (Array.isArray(schema)) return schema.map(convertSchema);

  const out = {};
  for (const [key, value] of Object.entries(schema)) {
    // OAS-only keywords: discriminator is a routing hint (oneOf branches still
    // discriminate via their `type` enums) and its mapping holds unrewritten
    // #/components/schemas/ paths; ajv strict mode rejects unknown keywords.
    if (key === "xml" || key === "discriminator" || key.startsWith("x-")) continue;
    if (key === "nullable") continue; // handled below
    // OAS numeric type modifiers are not JSON Schema formats (which apply to
    // strings); strict validators reject them as unknown.
    if (key === "format" && ["float", "double", "int32", "int64"].includes(value)) continue;
    if (key === "$ref" && typeof value === "string") {
      out.$ref = value.replace("#/components/schemas/", "#/$defs/");
      continue;
    }
    if (key === "example") {
      out.examples = [value];
      continue;
    }
    if (key === "description" && typeof value === "string") {
      out.description = htmlToText(value);
      continue;
    }
    out[key] = convertSchema(value);
  }

  // Some OAS schemas declare properties without type: object; make it explicit.
  if (out.properties && !out.type) out.type = "object";

  // Union schemas (e.g. Asset) declare additionalProperties: false as an OAS
  // discriminator-context hint. In pure JSON Schema that bans every property
  // (no sibling `properties`), failing all branches — the members define the
  // object shape, so drop it.
  if ((out.oneOf || out.anyOf) && !out.properties && out.additionalProperties === false) {
    delete out.additionalProperties;
  }

  if (schema.nullable === true) {
    if (out.$ref) return { anyOf: [{ $ref: out.$ref }, { type: "null" }] };
    if (out.type && !Array.isArray(out.type)) out.type = [out.type, "null"];
  }
  return out;
}

function collectDeps(schema, allDefs, deps = new Set()) {
  if (!schema || typeof schema !== "object") return deps;
  if (Array.isArray(schema)) {
    schema.forEach((s) => collectDeps(s, allDefs, deps));
    return deps;
  }
  if (typeof schema.$ref === "string") {
    const name = schema.$ref.replace("#/$defs/", "");
    if (allDefs[name] && !deps.has(name)) {
      deps.add(name);
      collectDeps(allDefs[name], allDefs, deps);
    }
  }
  Object.values(schema).forEach((v) => collectDeps(v, allDefs, deps));
  return deps;
}

const allDefs = {};
for (const [name, schema] of Object.entries(oasSchemas)) {
  allDefs[name] = convertSchema(schema);
}

const editDeps = collectDeps(allDefs.Edit, allDefs);
const $defs = {};
for (const name of [...editDeps].sort()) $defs[name] = allDefs[name];

const output = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "Edit",
  ...allDefs.Edit,
  $defs,
};

fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(
  path.join(OUT_DIR, "edit.json"),
  JSON.stringify(output, null, 2) + "\n",
);

// Barrel files so `@shotstack/schemas/json` resolves for both module systems.
fs.writeFileSync(
  path.join(OUT_DIR, "index.js"),
  `import { createRequire } from 'module';\nconst require = createRequire(import.meta.url);\nexport const edit = require('./edit.json');\n`,
);
fs.writeFileSync(
  path.join(OUT_DIR, "index.cjs"),
  `module.exports = { edit: require('./edit.json') };\n`,
);
fs.writeFileSync(
  path.join(OUT_DIR, "index.d.ts"),
  `export declare const edit: Record<string, unknown>;\n`,
);

console.log(
  `Generated edit.json (${Object.keys($defs).length} $defs, ${(JSON.stringify(output).length / 1024).toFixed(1)} KB) + barrel files`,
);
