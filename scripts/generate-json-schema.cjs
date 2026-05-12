const fs = require("fs");
const path = require("path");

const BUNDLED_PATH = path.join(__dirname, "..", "dist", "api.bundled.json");
const OUT_DIR = path.join(__dirname, "..", "dist", "json-schema");
const MAX_CHARS = 5000;

// Properties to remove from object schemas
const STRIP_PROPERTIES = new Set(["instance"]);

// Max total chars for enum values per field.
// Cerebras limits total property/definition/enum string length to 5000 chars.
// Enums exceeding this are reduced to base variants (no Slow/Fast suffixes)
// then stripped entirely if still over.
const MAX_ENUM_CHARS = 400;

// For large enums: strip speed suffixes (Slow/Fast) to create a compact base set.
// Falls back to full strip if the reduced set still exceeds MAX_ENUM_CHARS.
function reduceEnum(values) {
  const reduced = values.filter(
    (v) => !v.endsWith("Slow") && !v.endsWith("Fast"),
  );
  return reduced.length > 0 && reduced.length < values.length
    ? reduced
    : values;
}

// Schema names to exclude entirely from $defs and anyOf branches
// Schemas to exclude (exact names and patterns)
const EXCLUDE_EXACT = new Set([
  "MuxDestination",
  "MuxDestinationOptions",
  "DolbyEnhancement",
  "DolbyEnhancementOptions",
  "HtmlAsset",
  "Html5Asset",
  "TitleAsset",
  "TextAsset",
]);
const EXCLUDE_PATTERNS = [
  /GeneratedAsset/, // All generated asset schemas (HeyGen, OpenAi, StabilityAi, DID, etc.)
  /TextToSpeechOptions/,
  /TextToImageOptions/,
  /TextToAvatarOptions/,
  /TextGeneratorOptions/,
];
function isExcluded(name) {
  return EXCLUDE_EXACT.has(name) || EXCLUDE_PATTERNS.some((p) => p.test(name));
}

const STRIP_KEYWORDS = new Set([
  // OAS-only keywords
  "example",
  "xml",
  "deprecated",
  "discriminator",
  // Informational metadata (unsupported by Cerebras strict mode)
  "title",
  "default",
  "$schema",
  // String validation (unsupported by Cerebras)
  "minLength",
  "maxLength",
  "pattern",
  "format",
  // Array validation (unsupported by Cerebras)
  "minItems",
  "maxItems",
  "uniqueItems",
  // Object validation (not needed with additionalProperties: false)
  "minProperties",
  "maxProperties",
]);

// Number constraints ARE supported by Cerebras:
// minimum, maximum, exclusiveMinimum, exclusiveMaximum, multipleOf

const api = JSON.parse(fs.readFileSync(BUNDLED_PATH, "utf8"));
const oasSchemas = api.components.schemas;

// Make a property schema nullable using anyOf with null
function makeNullable(propSchema) {
  if (propSchema.$ref) {
    return { anyOf: [propSchema, { type: "null" }] };
  }
  if (propSchema.anyOf) {
    if (!propSchema.anyOf.some((s) => s.type === "null")) {
      return { ...propSchema, anyOf: [...propSchema.anyOf, { type: "null" }] };
    }
    return propSchema;
  }
  if (propSchema.oneOf) {
    if (!propSchema.oneOf.some((s) => s.type === "null")) {
      const { oneOf, ...rest } = propSchema;
      return { ...rest, anyOf: [...oneOf, { type: "null" }] };
    }
    return propSchema;
  }
  if (propSchema.type) {
    const types = Array.isArray(propSchema.type)
      ? propSchema.type
      : [propSchema.type];
    if (!types.includes("null")) {
      const { type, ...rest } = propSchema;
      return {
        anyOf: [
          { type: types.length === 1 ? types[0] : types, ...rest },
          { type: "null" },
        ],
      };
    }
  }
  return propSchema;
}

function convertSchema(schema) {
  if (schema === null || schema === undefined || typeof schema !== "object") {
    return schema;
  }

  if (Array.isArray(schema)) {
    return schema.map(convertSchema).filter((item) => {
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
    if (STRIP_KEYWORDS.has(key) || key.startsWith("x-")) continue;

    // Rewrite $ref paths
    if (key === "$ref" && typeof value === "string") {
      out[key] = value
        .replace("#/components/schemas/", "#/$defs/")
        .replace(/\/oneOf\//g, "/anyOf/");
      continue;
    }

    // Skip OAS nullable (handled below)
    if (key === "nullable") continue;

    // Rename oneOf → anyOf (Cerebras only supports anyOf)
    if (key === "oneOf") {
      out.anyOf = convertSchema(value);
      continue;
    }

    // Convert properties dict: each value is a schema, but the dict itself is not
    if (
      key === "properties" &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      const props = {};
      for (const [propName, propSchema] of Object.entries(value)) {
        if (STRIP_PROPERTIES.has(propName)) continue;
        const converted = convertSchema(propSchema);
        // Derive enum from default/example for discriminator-like fields (e.g. provider)
        // When both default and example are the same string, it's a constant identifier
        if (
          propSchema.type === "string" &&
          !propSchema.enum &&
          propSchema.default &&
          propSchema.default === propSchema.example
        ) {
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
    out.anyOf = [base, { type: "null" }];
  }

  // anyOf unions: strip type/additionalProperties from parent (branches define types)
  if (out.anyOf && !out.properties) {
    delete out.type;
    delete out.additionalProperties;
  }

  // Reduce or strip large enums to stay under Cerebras string length limit
  if (
    out.enum &&
    out.enum.reduce((sum, v) => sum + String(v).length, 0) > MAX_ENUM_CHARS
  ) {
    const reduced = reduceEnum(out.enum);
    if (
      reduced.reduce((sum, v) => sum + String(v).length, 0) <= MAX_ENUM_CHARS
    ) {
      out.enum = reduced;
    } else {
      delete out.enum;
    }
  }

  // Strict mode: untyped schemas default to string
  if (
    !out.type &&
    !out.$ref &&
    !out.anyOf &&
    !out.enum &&
    !out.properties &&
    !out.items &&
    out.description
  ) {
    out.type = "string";
  }

  // Strict mode: schemas with properties must have type: "object"
  if (out.properties && !out.type) {
    out.type = "object";
  }

  // Strict mode: objects need additionalProperties: false
  if (out.type === "object" && out.properties) {
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
    if (!obj || typeof obj !== "object") return;
    if (Array.isArray(obj)) {
      obj.forEach(walk);
      return;
    }
    if (obj.$ref && typeof obj.$ref === "string") {
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
  if (!obj || typeof obj !== "object") return;
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => collectDescriptions(v, [...path, i], result));
    return;
  }
  for (const [k, v] of Object.entries(obj)) {
    if (k === "description" && typeof v === "string") {
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
    for (const d of descs) setAtPath(clone, d.path, "");
    // Remove empty description keys
    stripEmptyDescriptions(clone);
    return clone;
  }

  // Calculate max length per description (proportional reduction)
  const ratio = 1 - excess / totalDescChars;
  for (const d of descs) {
    const maxLen = Math.max(0, Math.floor(d.length * ratio));
    const current = getAtPath(clone, d.path);
    if (current.length > maxLen) {
      setAtPath(
        clone,
        d.path,
        maxLen > 3 ? current.slice(0, maxLen - 3) + "..." : "",
      );
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
      const ratio2 = Math.max(0, 1 - stillOver / totalRemaining - 0.1);
      for (const d of remaining) {
        const current = getAtPath(clone, d.path);
        const maxLen = Math.max(0, Math.floor(current.length * ratio2));
        if (current.length > maxLen) {
          setAtPath(
            clone,
            d.path,
            maxLen > 3 ? current.slice(0, maxLen - 3) : "",
          );
        }
      }
    }
  }

  stripEmptyDescriptions(clone);
  return clone;
}

function stripEmptyDescriptions(obj) {
  if (!obj || typeof obj !== "object") return;
  if (Array.isArray(obj)) {
    obj.forEach(stripEmptyDescriptions);
    return;
  }
  if (obj.description === "") delete obj.description;
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
editDeps.add("Edit");
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

  const fileName =
    name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() + ".json";
  fs.writeFileSync(
    path.join(OUT_DIR, fileName),
    JSON.stringify(fitted, null, 2) + "\n",
  );
  totalFiles++;
}

// Also output combined schemas.json for general use (no size limit)
fs.writeFileSync(
  path.join(OUT_DIR, "schemas.json"),
  JSON.stringify({ $defs: defs }, null, 2) + "\n",
);

// Report
const files = fs
  .readdirSync(OUT_DIR)
  .filter((f) => f.endsWith(".json") && f !== "schemas.json");
const sizes = files.map((f) => ({
  name: f,
  chars: JSON.stringify(
    JSON.parse(fs.readFileSync(path.join(OUT_DIR, f), "utf8")),
  ).length,
}));
const under = sizes.filter((s) => s.chars <= MAX_CHARS).length;
const editSize = sizes.find((s) => s.name === "edit.json");

console.log(`Generated ${totalFiles} Edit API schema files + schemas.json`);
console.log(`  ${under}/${totalFiles} under ${MAX_CHARS} chars`);
if (overLimit > 0) console.log(`  ${overLimit} over limit`);
if (editSize) console.log(`  edit.json: ${editSize.chars} chars`);

// ---------------------------------------------------------------------------
// Multi-pass LLM template generation schemas.
// Each schema must fit within the Cerebras 5,000-char strict-mode limit.
//
// Pipeline:
//   1. blueprint.json — timeline structure (tracks/clips with asset type
//      strings, timing, transitions, mergeField hints) + output + merge
//   2. Per-asset-type detailer schemas — generate asset objects in isolation:
//      - rich-text-content.json — text, font, background, border, padding, align
//      - rich-text-effects.json — style, stroke, shadow, gradient, animation
//      - caption-detailer.json — full CaptionAsset with font, background, margin
//      - template.json — simple assets (Video/Image/Audio) as single-call fallback
// ---------------------------------------------------------------------------

// Remove all descriptions from a schema tree
function stripDescriptions(obj) {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(stripDescriptions);
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === "description") continue;
    out[k] = stripDescriptions(v);
  }
  return out;
}

// Deep clone and strip descriptions from a $def
function cloneDef(name) {
  return stripDescriptions(JSON.parse(JSON.stringify(defs[name])));
}

// Strip named properties from a schema and rebuild its required array
function stripProps(schema, props) {
  const s = JSON.parse(JSON.stringify(schema));
  for (const p of props) {
    delete s.properties[p];
  }
  if (s.required) {
    s.required = s.required.filter((r) => !props.has(r));
  }
  return s;
}

// Remove $ref branches pointing to defs not in an allowed set
function filterRefs(obj, allowed) {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) {
    return obj
      .filter((item) => {
        if (item && item.$ref) {
          const m = item.$ref.match(/^#\/\$defs\/(.+?)(?:\/|$)/);
          if (m && !allowed.has(m[1])) return false;
        }
        return true;
      })
      .map((item) => filterRefs(item, allowed));
  }
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === "$ref" && typeof v === "string") {
      const m = v.match(/^#\/\$defs\/(.+?)(?:\/|$)/);
      if (m && !allowed.has(m[1])) continue;
    }
    out[k] = filterRefs(v, allowed);
  }
  return out;
}

// Remove orphaned array branches left after ref filtering (e.g. Tween arrays)
function cleanOrphanedArrays(obj) {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(cleanOrphanedArrays);
  if (obj.anyOf) {
    obj.anyOf = obj.anyOf.filter((branch) => {
      if (branch.type === "array" && branch.items) {
        const items = branch.items;
        return items.type || items.$ref || items.anyOf || items.properties;
      }
      return true;
    });
    if (obj.anyOf.length === 1) return cleanOrphanedArrays(obj.anyOf[0]);
  }
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = cleanOrphanedArrays(v);
  }
  return out;
}

// Write a schema file and report its size
function writeSchema(name, fileName, schema) {
  const output = { name, strict: true, schema };
  const json = JSON.stringify(output);
  fs.writeFileSync(
    path.join(OUT_DIR, fileName),
    JSON.stringify(output, null, 2) + "\n",
  );
  const status = json.length <= MAX_CHARS ? "OK" : "OVER";
  console.log(`  ${fileName}: ${json.length} chars [${status}]`);
  if (json.length > MAX_CHARS) {
    console.log(
      `    WARNING: exceeds ${MAX_CHARS} limit by ${json.length - MAX_CHARS}`,
    );
  }
  return json.length;
}

// --- blueprint.json ---
// Full edit structure but asset is just a type string + mergeField + textHint
const blueprintTransition = cloneDef("Transition");
const blueprintOutput = stripProps(
  cloneDef("Output"),
  new Set([
    "size",
    "scaleTo",
    "repeat",
    "mute",
    "range",
    "poster",
    "thumbnail",
    "destinations",
  ]),
);
const blueprintMergeField = cloneDef("MergeField");

const blueprintClip = {
  type: "object",
  properties: {
    asset: {
      type: "string",
      enum: ["video", "image", "audio", "rich-text", "svg", "caption"],
    },
    start: { anyOf: [{ type: "number", minimum: 0 }, { type: "string" }] },
    length: { anyOf: [{ type: "number", minimum: 0 }, { type: "string" }] },
    fit: {
      anyOf: [
        { type: "string", enum: ["cover", "contain", "crop", "none"] },
        { type: "null" },
      ],
    },
    position: {
      anyOf: [
        {
          type: "string",
          enum: [
            "top",
            "topRight",
            "right",
            "bottomRight",
            "bottom",
            "bottomLeft",
            "left",
            "topLeft",
            "center",
          ],
        },
        { type: "null" },
      ],
    },
    transition: {
      anyOf: [{ $ref: "#/$defs/Transition" }, { type: "null" }],
    },
    effect: { anyOf: [{ type: "string" }, { type: "null" }] },
    mergeField: { anyOf: [{ type: "string" }, { type: "null" }] },
    textHint: { anyOf: [{ type: "string" }, { type: "null" }] },
  },
  additionalProperties: false,
  required: [
    "asset",
    "start",
    "length",
    "fit",
    "position",
    "transition",
    "effect",
    "mergeField",
    "textHint",
  ],
};

writeSchema("Blueprint", "blueprint.json", {
  type: "object",
  properties: {
    output: { $ref: "#/$defs/Output" },
    merge: {
      anyOf: [
        { type: "array", items: { $ref: "#/$defs/MergeField" } },
        { type: "null" },
      ],
    },
    timeline: {
      type: "object",
      properties: {
        tracks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              clips: {
                type: "array",
                items: { $ref: "#/$defs/BlueprintClip" },
              },
            },
            additionalProperties: false,
            required: ["clips"],
          },
        },
      },
      additionalProperties: false,
      required: ["tracks"],
    },
  },
  additionalProperties: false,
  required: ["output", "merge", "timeline"],
  $defs: {
    BlueprintClip: blueprintClip,
    Transition: blueprintTransition,
    Output: blueprintOutput,
    MergeField: blueprintMergeField,
  },
});

// --- rich-text-content.json ---
// RichTextAsset with font, background, border, padding, align (no effects)
const rtContentAsset = stripProps(
  cloneDef("RichTextAsset"),
  new Set(["style", "stroke", "shadow", "animation"]),
);
const rtContentFont = stripProps(cloneDef("RichTextFont"), new Set(["stroke"]));
const rtContentDefs = new Set([
  "RichTextAsset",
  "RichTextFont",
  "RichTextBackground",
  "RichTextAlignment",
]);
const rtContentFiltered = filterRefs(rtContentAsset, rtContentDefs);

writeSchema("RichTextContent", "rich-text-content.json", {
  type: "object",
  properties: {
    assets: { type: "array", items: { $ref: "#/$defs/RichTextAsset" } },
  },
  additionalProperties: false,
  required: ["assets"],
  $defs: {
    RichTextAsset: rtContentFiltered,
    RichTextFont: rtContentFont,
    RichTextBackground: cloneDef("RichTextBackground"),
    RichTextAlignment: cloneDef("RichTextAlignment"),
  },
});

// --- rich-text-effects.json ---
// Style, stroke, shadow, gradient, animation per asset
writeSchema("RichTextEffects", "rich-text-effects.json", {
  type: "object",
  properties: {
    effects: { type: "array", items: { $ref: "#/$defs/RichTextEffect" } },
  },
  additionalProperties: false,
  required: ["effects"],
  $defs: {
    RichTextEffect: {
      type: "object",
      properties: {
        style: { anyOf: [{ $ref: "#/$defs/RichTextStyle" }, { type: "null" }] },
        stroke: {
          anyOf: [{ $ref: "#/$defs/RichTextStroke" }, { type: "null" }],
        },
        shadow: {
          anyOf: [{ $ref: "#/$defs/RichTextShadow" }, { type: "null" }],
        },
        animation: {
          anyOf: [{ $ref: "#/$defs/RichTextAnimation" }, { type: "null" }],
        },
      },
      additionalProperties: false,
      required: ["style", "stroke", "shadow", "animation"],
    },
    RichTextStyle: cloneDef("RichTextStyle"),
    RichTextStroke: cloneDef("RichTextStroke"),
    RichTextShadow: cloneDef("RichTextShadow"),
    RichTextGradient: cloneDef("RichTextGradient"),
    RichTextAnimation: cloneDef("RichTextAnimation"),
  },
});

// --- caption-detailer.json ---
writeSchema("CaptionDetails", "caption-detailer.json", {
  type: "object",
  properties: {
    assets: { type: "array", items: { $ref: "#/$defs/CaptionAsset" } },
  },
  additionalProperties: false,
  required: ["assets"],
  $defs: {
    CaptionAsset: cloneDef("CaptionAsset"),
    CaptionFont: cloneDef("CaptionFont"),
    CaptionBackground: cloneDef("CaptionBackground"),
    CaptionMargin: cloneDef("CaptionMargin"),
  },
});

// --- template.json ---
// Single-call fallback for simple templates (Video/Image/Audio only)
const TEMPLATE_DEFS = new Set([
  "Timeline",
  "Track",
  "Clip",
  "Asset",
  "VideoAsset",
  "ImageAsset",
  "AudioAsset",
  "Transition",
  "Output",
  "MergeField",
]);
const TEMPLATE_STRIP_PROPS = {
  Timeline: new Set(["soundtrack", "background", "fonts", "cache"]),
  Clip: new Set([
    "scale",
    "width",
    "height",
    "offset",
    "filter",
    "opacity",
    "transform",
    "alias",
  ]),
  Output: new Set([
    "size",
    "scaleTo",
    "repeat",
    "mute",
    "range",
    "poster",
    "thumbnail",
    "destinations",
  ]),
  VideoAsset: new Set(["crop", "chromaKey", "transcode"]),
  ImageAsset: new Set(["crop"]),
  AudioAsset: new Set(["speed"]),
};

const templateDefs = {};
for (const name of TEMPLATE_DEFS) {
  if (!defs[name]) continue;
  let schema = cloneDef(name);
  if (TEMPLATE_STRIP_PROPS[name]) {
    schema = stripProps(schema, TEMPLATE_STRIP_PROPS[name]);
  }
  schema = filterRefs(schema, TEMPLATE_DEFS);
  schema = cleanOrphanedArrays(schema);
  templateDefs[name] = schema;
}

writeSchema("Template", "template.json", {
  type: "object",
  properties: {
    timeline: { $ref: "#/$defs/Timeline" },
    output: { $ref: "#/$defs/Output" },
    merge: {
      anyOf: [
        { type: "array", items: { $ref: "#/$defs/MergeField" } },
        { type: "null" },
      ],
    },
  },
  additionalProperties: false,
  required: ["timeline", "output", "merge"],
  $defs: templateDefs,
});

// Generate barrel files for module imports
fs.writeFileSync(
  path.join(OUT_DIR, "index.js"),
  [
    "import { createRequire } from 'module';",
    "const require = createRequire(import.meta.url);",
    "export const edit = require('./edit.json');",
    "export const template = require('./template.json');",
    "export const blueprint = require('./blueprint.json');",
    "export const richTextContent = require('./rich-text-content.json');",
    "export const richTextEffects = require('./rich-text-effects.json');",
    "export const captionDetailer = require('./caption-detailer.json');",
    "",
  ].join("\n"),
);

fs.writeFileSync(
  path.join(OUT_DIR, "index.cjs"),
  [
    "module.exports.edit = require('./edit.json');",
    "module.exports.template = require('./template.json');",
    "module.exports.blueprint = require('./blueprint.json');",
    "module.exports.richTextContent = require('./rich-text-content.json');",
    "module.exports.richTextEffects = require('./rich-text-effects.json');",
    "module.exports.captionDetailer = require('./caption-detailer.json');",
    "",
  ].join("\n"),
);

fs.writeFileSync(
  path.join(OUT_DIR, "index.d.ts"),
  [
    "export interface JsonSchema {",
    "  name: string;",
    "  strict: boolean;",
    "  schema: Record<string, unknown>;",
    "}",
    "export declare const edit: JsonSchema;",
    "export declare const template: JsonSchema;",
    "export declare const blueprint: JsonSchema;",
    "export declare const richTextContent: JsonSchema;",
    "export declare const richTextEffects: JsonSchema;",
    "export declare const captionDetailer: JsonSchema;",
    "",
  ].join("\n"),
);

console.log("Generated barrel files: index.js, index.cjs, index.d.ts");
