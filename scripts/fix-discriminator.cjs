const fs = require("fs");
const path = require("path");

const START_TIME = Date.now();

const zodGenPath = path.join(__dirname, "..", "dist", "zod", "zod.gen.ts");
const zodGenCjsPath = path.join(__dirname, "..", "dist", "zod", "zod.gen.cjs");
const zodGenJsPath = path.join(__dirname, "..", "dist", "zod", "zod.gen.js");

const ALIAS_TABLE = [
  {
    kind: "enum",
    zSchema: "clipClipSchema",
    field: "fit",
    canonical: "crop",
    alias: "cover",
  },
  {
    kind: "enum",
    zSchema: "clipClipSchema",
    field: "fit",
    canonical: "cover",
    alias: "fill",
  },
  {
    kind: "enum",
    zSchema: "renditionRenditionSchema",
    field: "fit",
    canonical: "crop",
    alias: "cover",
  },
  {
    kind: "enum",
    zSchema: "renditionRenditionSchema",
    field: "fit",
    canonical: "cover",
    alias: "fill",
  },

  {
    kind: "enum",
    zSchema: "clipClipSchema",
    field: "position",
    canonical: "topRight",
    alias: "top-right",
  },
  {
    kind: "enum",
    zSchema: "clipClipSchema",
    field: "position",
    canonical: "topLeft",
    alias: "top-left",
  },
  {
    kind: "enum",
    zSchema: "clipClipSchema",
    field: "position",
    canonical: "bottomRight",
    alias: "bottom-right",
  },
  {
    kind: "enum",
    zSchema: "clipClipSchema",
    field: "position",
    canonical: "bottomLeft",
    alias: "bottom-left",
  },
  {
    kind: "enum",
    zSchema: "htmlassetHtmlAssetSchema",
    field: "position",
    canonical: "topRight",
    alias: "top-right",
  },
  {
    kind: "enum",
    zSchema: "htmlassetHtmlAssetSchema",
    field: "position",
    canonical: "topLeft",
    alias: "top-left",
  },
  {
    kind: "enum",
    zSchema: "htmlassetHtmlAssetSchema",
    field: "position",
    canonical: "bottomRight",
    alias: "bottom-right",
  },
  {
    kind: "enum",
    zSchema: "htmlassetHtmlAssetSchema",
    field: "position",
    canonical: "bottomLeft",
    alias: "bottom-left",
  },
  {
    kind: "enum",
    zSchema: "titleassetTitleAssetSchema",
    field: "position",
    canonical: "topRight",
    alias: "top-right",
  },
  {
    kind: "enum",
    zSchema: "titleassetTitleAssetSchema",
    field: "position",
    canonical: "topLeft",
    alias: "top-left",
  },
  {
    kind: "enum",
    zSchema: "titleassetTitleAssetSchema",
    field: "position",
    canonical: "bottomRight",
    alias: "bottom-right",
  },
  {
    kind: "enum",
    zSchema: "titleassetTitleAssetSchema",
    field: "position",
    canonical: "bottomLeft",
    alias: "bottom-left",
  },
  {
    kind: "enum",
    zSchema: "richtextpropertiesRichTextAlignmentSchema",
    field: "vertical",
    canonical: "middle",
    alias: "center",
  },

  {
    kind: "property",
    zSchema: "richtextassetRichTextAssetSchema",
    field: "align",
    alias: "alignment",
    required: false,
  },
  {
    kind: "property",
    zSchema: "richcaptionassetRichCaptionAssetSchema",
    field: "align",
    alias: "alignment",
    required: false,
  },

  {
    kind: "property",
    zSchema: "clipClipSchema",
    field: "length",
    alias: "duration",
    required: true,
  },
  {
    kind: "property",
    zSchema: "rangeRangeSchema",
    field: "length",
    alias: "duration",
    required: false,
  },
  {
    kind: "property",
    zSchema: "tweenTweenSchema",
    field: "length",
    alias: "duration",
    required: false,
  },

  {
    kind: "nested",
    zSchema: "textpropertiesTextFontSchema",
    field: "family",
    aliases: ["name", "fontFamily"],
  },
  {
    kind: "nested",
    zSchema: "richtextpropertiesRichTextFontSchema",
    field: "family",
    aliases: ["name", "fontFamily"],
  },
  {
    kind: "nested",
    zSchema: "captionpropertiesCaptionFontSchema",
    field: "family",
    aliases: ["name", "fontFamily"],
  },
  {
    kind: "nested",
    zSchema: "richcaptionpropertiesRichCaptionFontSchema",
    field: "family",
    aliases: ["name", "fontFamily"],
  },

  {
    kind: "nested",
    zSchema: "textpropertiesTextFontSchema",
    field: "size",
    aliases: ["fontSize"],
  },
  {
    kind: "nested",
    zSchema: "richtextpropertiesRichTextFontSchema",
    field: "size",
    aliases: ["fontSize"],
  },
  {
    kind: "nested",
    zSchema: "captionpropertiesCaptionFontSchema",
    field: "size",
    aliases: ["fontSize"],
  },
  {
    kind: "nested",
    zSchema: "richcaptionpropertiesRichCaptionFontSchema",
    field: "size",
    aliases: ["fontSize"],
  },

  {
    kind: "nested",
    zSchema: "textpropertiesTextFontSchema",
    field: "weight",
    aliases: ["fontWeight"],
  },
  {
    kind: "nested",
    zSchema: "richtextpropertiesRichTextFontSchema",
    field: "weight",
    aliases: ["fontWeight"],
  },
  {
    kind: "nested",
    zSchema: "richcaptionpropertiesRichCaptionFontSchema",
    field: "weight",
    aliases: ["fontWeight"],
  },

  {
    kind: "nested",
    zSchema: "richtextpropertiesRichTextShadowSchema",
    field: "offsetX",
    aliases: ["x"],
  },
  {
    kind: "nested",
    zSchema: "richtextpropertiesRichTextShadowSchema",
    field: "offsetY",
    aliases: ["y"],
  },

  {
    kind: "nested",
    zSchema: "richtextpropertiesRichTextBorderSchema",
    field: "radius",
    aliases: ["borderRadius"],
  },

  {
    kind: "nested",
    zSchema: "richtextpropertiesRichTextGradientStopSchema",
    field: "offset",
    aliases: ["position"],
  },
];

function buildPropertyTransform(field, alias, zPrefix) {
  const z = zPrefix;
  return (
    `.transform((data) => {\n` +
    `  if (data.${alias} !== undefined && data.${field} === undefined) {\n` +
    `    data.${field} = data.${alias};\n` +
    `  }\n` +
    `  const { ${alias}: _dropped, ...rest } = data;\n` +
    `  return rest;\n` +
    `})`
  );
}

function buildPropertySuperRefine(field, alias, zPrefix) {
  const z = zPrefix;
  return (
    `.superRefine((data, ctx) => {\n` +
    `  if (data.${field} === undefined && data.${alias} === undefined) {\n` +
    `    ctx.addIssue({ code: ${z}.ZodIssueCode.custom, message: "'${field}' is required (you may also use '${alias}' as an alias)", path: ["${field}"] });\n` +
    `  }\n` +
    `})`
  );
}

function buildMultiAliasTransform(field, aliases) {
  const checks = aliases
    .map(
      (a) =>
        `  if (data.${a} !== undefined && data.${field} === undefined) { data.${field} = data.${a}; }`,
    )
    .join("\n");
  const drops = aliases.map((a) => `${a}: _${a}`).join(", ");
  const rests = aliases.map((a) => `_${a}`).join(", ");
  return (
    `.transform((data) => {\n` +
    `${checks}\n` +
    `  const { ${drops}, ...rest } = data;\n` +
    `  return rest;\n` +
    `})`
  );
}

function buildEnumTransform(field, canonical, alias) {
  return (
    `.transform((data) => {\n` +
    `  if (data.${field} === "${alias}") data.${field} = "${canonical}";\n` +
    `  return data;\n` +
    `})`
  );
}

function findSchemaEnd(src, exportName, isCjs) {
  const prefix = isCjs
    ? `exports.${exportName} = `
    : `export const ${exportName} = `;
  const startIdx = src.indexOf(prefix);
  if (startIdx === -1) return null;

  const exprStart = startIdx + prefix.length;
  let depth = 0;
  let i = exprStart;
  let inStr = false;
  let strChar = "";

  while (i < src.length) {
    const c = src[i];
    if (inStr) {
      if (c === "\\") {
        i += 2;
        continue;
      }
      if (c === strChar) inStr = false;
    } else if (c === '"' || c === "'" || c === "`") {
      inStr = true;
      strChar = c;
    } else if (c === "(" || c === "{" || c === "[") {
      depth++;
    } else if (c === ")" || c === "}" || c === "]") {
      depth--;
    } else if (c === ";" && depth === 0) {
      return { startIdx, exprStart, semiIdx: i };
    }
    i++;
  }
  return null;
}

function makeFieldOptional(src, schemaName, fieldName, isCjs) {
  const found = findSchemaEnd(src, schemaName, isCjs || false);
  if (!found) {
    console.log(
      `- makeFieldOptional: schema "${schemaName}" not found, skipping`,
    );
    return src;
  }

  const before = src.slice(0, found.startIdx);
  const body = src.slice(found.startIdx, found.semiIdx);
  const after = src.slice(found.semiIdx);

  const fieldMarker = `\n  ${fieldName}: `;
  const markerIdx = body.indexOf(fieldMarker);
  if (markerIdx === -1) {
    console.log(
      `- makeFieldOptional: field "${fieldName}" not found in "${schemaName}", skipping`,
    );
    return src;
  }

  const valueStart = markerIdx + fieldMarker.length;
  let depth = 0;
  let i = valueStart;
  let inStr = false;
  let strChar = "";
  let started = false;

  while (i < body.length) {
    const c = body[i];
    if (inStr) {
      if (c === "\\") {
        i += 2;
        continue;
      }
      if (c === strChar) inStr = false;
    } else if (c === '"' || c === "'" || c === "`") {
      inStr = true;
      strChar = c;
    } else if (c === "(" || c === "{" || c === "[") {
      depth++;
      started = true;
    } else if (c === ")" || c === "}" || c === "]") {
      depth--;
      if (depth === 0 && started) {
        i++; // move past the closing bracket
        break;
      }
    }
    i++;
  }

  const peek = body.slice(i, i + 11);
  if (peek === ".optional()") return src;

  const newBody = body.slice(0, i) + ".optional()" + body.slice(i);
  console.log(`✓ Made ${schemaName}.${fieldName} optional`);
  return before + newBody + after;
}

function applyAliases(src, zPrefix, isCjs) {
  let result = src;
  let count = 0;
  const cjs = isCjs || false;
  const z = cjs ? "zod_1.z" : "z";
  const dParam = cjs ? "d" : "d: any";

  for (const entry of ALIAS_TABLE) {
    if (entry.kind === "nested") continue;

    const found = findSchemaEnd(result, entry.zSchema, cjs);
    if (!found) {
      console.error(
        `✗ ALIAS TABLE: could not find schema "${entry.zSchema}" (${entry.kind}: ${entry.field})`,
      );
      process.exit(1);
    }

    let injection = "";
    if (entry.kind === "enum") {
      injection = buildEnumTransform(entry.field, entry.canonical, entry.alias);
    } else if (entry.kind === "property") {
      injection =
        (entry.required
          ? buildPropertySuperRefine(entry.field, entry.alias, zPrefix)
          : "") + buildPropertyTransform(entry.field, entry.alias, zPrefix);
    }

    result =
      result.slice(0, found.semiIdx) + injection + result.slice(found.semiIdx);
    count++;
  }

  const nestedBySchema = new Map();
  for (const entry of ALIAS_TABLE) {
    if (entry.kind !== "nested") continue;
    if (!nestedBySchema.has(entry.zSchema))
      nestedBySchema.set(entry.zSchema, []);
    nestedBySchema.get(entry.zSchema).push(entry);
  }

  for (const [schemaName, entries] of nestedBySchema) {
    const found = findSchemaEnd(result, schemaName, cjs);
    if (!found) {
      console.error(
        `✗ ALIAS TABLE: could not find schema "${schemaName}" for nested aliases`,
      );
      process.exit(1);
    }

    const checks = entries
      .flatMap((e) =>
        e.aliases.map(
          (a) =>
            `    if ('${a}' in d && !('${e.field}' in d)) { d.${e.field} = d.${a}; }\n    delete d.${a};`,
        ),
      )
      .join("\n");

    const preFn =
      `((${dParam}) => {\n` +
      `  if (typeof d === 'object' && d !== null) {\n` +
      `    d = Object.assign({}, d);\n` +
      `${checks}\n` +
      `  }\n` +
      `  return d;\n` +
      `})`;

    result =
      result.slice(0, found.exprStart) +
      `${z}.preprocess(${preFn}, ` +
      result.slice(found.exprStart, found.semiIdx) +
      `)` +
      result.slice(found.semiIdx);

    count += entries.length;
  }

  console.log(`✓ Applied ${count} alias transforms`);
  return result;
}

function fixDestinationProviders(src, isTs) {
  const fixes = [
    {
      pattern: /provider: z\.string\(\)\.default\(["']shotstack["']\)/,
      replacement: 'provider: z.literal("shotstack")',
    },
    {
      pattern: /provider: z\.string\(\)\.default\(["']s3["']\)/,
      replacement: 'provider: z.literal("s3")',
    },
    {
      pattern: /provider: z\.string\(\)\.default\(["']mux["']\)/,
      replacement: 'provider: z.literal("mux")',
    },
    {
      pattern:
        /provider: z\.string\(\)\.default\(["']google-cloud-storage["']\)/,
      replacement: 'provider: z.literal("google-cloud-storage")',
    },
    {
      pattern: /provider: z\.string\(\)\.default\(["']google-drive["']\)/,
      replacement: 'provider: z.literal("google-drive")',
    },
    {
      pattern: /provider: z\.string\(\)\.default\(["']vimeo["']\)/,
      replacement: 'provider: z.literal("vimeo")',
    },
    {
      pattern: /provider: z\.string\(\)\.default\(["']tiktok["']\)/,
      replacement: 'provider: z.literal("tiktok")',
    },
    {
      pattern: /provider: z\.string\(\)\.default\(["']akamai-netstorage["']\)/,
      replacement: 'provider: z.literal("akamai-netstorage")',
    },
    {
      pattern: /provider: z\.string\(\)\.default\(["']azure-blob-storage["']\)/,
      replacement: 'provider: z.literal("azure-blob-storage")',
    },
  ];
  let result = src;
  for (const { pattern, replacement } of fixes) {
    if (pattern.test(result)) {
      result = result.replace(pattern, replacement);
      console.log(`✓ Fixed provider literal: ${replacement}`);
    }
  }
  return result;
}

function fixCjsDestinationProviders(src) {
  const fixes = [
    {
      pattern: /provider: zod_1\.z\.string\(\)\.default\(["']shotstack["']\)/,
      replacement: 'provider: zod_1.z.literal("shotstack")',
    },
    {
      pattern: /provider: zod_1\.z\.string\(\)\.default\(["']s3["']\)/,
      replacement: 'provider: zod_1.z.literal("s3")',
    },
    {
      pattern: /provider: zod_1\.z\.string\(\)\.default\(["']mux["']\)/,
      replacement: 'provider: zod_1.z.literal("mux")',
    },
    {
      pattern:
        /provider: zod_1\.z\.string\(\)\.default\(["']google-cloud-storage["']\)/,
      replacement: 'provider: zod_1.z.literal("google-cloud-storage")',
    },
    {
      pattern:
        /provider: zod_1\.z\.string\(\)\.default\(["']google-drive["']\)/,
      replacement: 'provider: zod_1.z.literal("google-drive")',
    },
    {
      pattern: /provider: zod_1\.z\.string\(\)\.default\(["']vimeo["']\)/,
      replacement: 'provider: zod_1.z.literal("vimeo")',
    },
    {
      pattern: /provider: zod_1\.z\.string\(\)\.default\(["']tiktok["']\)/,
      replacement: 'provider: zod_1.z.literal("tiktok")',
    },
  ];
  let result = src;
  for (const { pattern, replacement } of fixes) {
    if (pattern.test(result)) {
      result = result.replace(pattern, replacement);
      console.log(`✓ Fixed CJS provider literal: ${replacement}`);
    }
  }
  return result;
}

const NEW_DESTINATIONS_SCHEMA = `export const destinationsDestinationsSchema = z.discriminatedUnion("provider", [
  shotstackDestinationShotstackDestinationSchema,
  muxDestinationMuxDestinationSchema,
  s3DestinationS3DestinationSchema,
  googleCloudStorageDestinationGoogleCloudStorageDestinationSchema,
  googleDriveDestinationGoogleDriveDestinationSchema,
  vimeoDestinationVimeoDestinationSchema,
  tiktokDestinationTiktokDestinationSchema,
  akamaiNetStorageDestinationAkamaiNetStorageDestinationSchema,
  azureBlobStorageDestinationAzureBlobStorageDestinationSchema
]);`;

const NEW_ASSET_SCHEMA = `export const assetAssetSchema = z.discriminatedUnion("type", [
  videoassetVideoAssetSchema,
  imageassetImageAssetSchema,
  textassetTextAssetSchema,
  richtextassetRichTextAssetSchema,
  audioassetAudioAssetSchema,
  lumaassetLumaAssetSchema,
  captionassetCaptionAssetSchema,
  richcaptionassetRichCaptionAssetSchema,
  htmlassetHtmlAssetSchema,
  titleassetTitleAssetSchema,
  shapeassetShapeAssetSchema,
  svgassetSvgAssetSchema,
  texttoimageassetTextToImageAssetSchema,
  imagetovideoassetImageToVideoAssetSchema,
  texttospeechassetTextToSpeechAssetSchema,
]);`;

const NEW_SVG_SHAPE_SCHEMA = `export const svgshapesSvgShapeSchema = z.discriminatedUnion("type", [
  svgshapesSvgRectangleShapeSchema,
  svgshapesSvgCircleShapeSchema,
  svgshapesSvgEllipseShapeSchema,
  svgshapesSvgLineShapeSchema,
  svgshapesSvgPolygonShapeSchema,
  svgshapesSvgStarShapeSchema,
  svgshapesSvgArrowShapeSchema,
  svgshapesSvgHeartShapeSchema,
  svgshapesSvgCrossShapeSchema,
  svgshapesSvgRingShapeSchema,
  svgshapesSvgPathShapeSchema,
]);`;

const NEW_SVG_FILL_SCHEMA = `export const svgpropertiesSvgFillSchema = z.discriminatedUnion("type", [
  svgpropertiesSvgSolidFillSchema,
  svgpropertiesSvgLinearGradientFillSchema,
  svgpropertiesSvgRadialGradientFillSchema,
]);`;

function fixDiscriminatedUnions(src) {
  let result = src;

  const destPattern =
    /export const destinationsDestinationsSchema = z\.union\(\[[\s\S]*?\]\);/;
  if (!destPattern.test(result)) {
    console.error("✗ Could not find destinationsDestinationsSchema to replace");
    process.exit(1);
  }
  result = result.replace(destPattern, NEW_DESTINATIONS_SCHEMA);
  console.log("✓ Fixed destinationsDestinationsSchema discriminator");

  const assetPattern =
    /export const assetAssetSchema = z\.union\(\[[\s\S]*?\]\);/;
  if (!assetPattern.test(result)) {
    console.error("✗ Could not find assetAssetSchema to replace");
    process.exit(1);
  }
  result = result.replace(assetPattern, NEW_ASSET_SCHEMA);
  console.log("✓ Fixed assetAssetSchema discriminator");

  const svgShapePattern =
    /export const svgshapesSvgShapeSchema = z\.union\(\[[\s\S]*?\]\);/;
  if (svgShapePattern.test(result)) {
    result = result.replace(svgShapePattern, NEW_SVG_SHAPE_SCHEMA);
    console.log("✓ Fixed svgshapesSvgShapeSchema discriminator");
  } else {
    console.log(
      "- svgshapesSvgShapeSchema not present in generated output, skipping",
    );
  }

  const svgFillPattern =
    /export const svgpropertiesSvgFillSchema = z\.union\(\[[\s\S]*?\]\);/;
  if (svgFillPattern.test(result)) {
    result = result.replace(svgFillPattern, NEW_SVG_FILL_SCHEMA);
    console.log("✓ Fixed svgpropertiesSvgFillSchema discriminator");
  } else {
    console.log(
      "- svgpropertiesSvgFillSchema not present in generated output, skipping",
    );
  }

  return result;
}

const SVG_ASSET_REPLACEMENT = `export const svgassetSvgAssetSchema = z.object({
  type: z.enum(["svg"]),
  src: z.string().min(1).max(500000),
}).strict();`;

function fixSvgAsset(src) {
  const pattern =
    /export const svgassetSvgAssetSchema = z\.object\(\{[\s\S]*?\}\);/;
  if (!pattern.test(src)) {
    console.error("✗ Could not find svgassetSvgAssetSchema to replace");
    process.exit(1);
  }
  console.log("✓ Fixed svgassetSvgAssetSchema");
  return src.replace(pattern, SVG_ASSET_REPLACEMENT);
}

const COERCE_FN_TS = `((v: unknown) => { if (v === '' || v === null || v === undefined) return undefined; if (Array.isArray(v)) return v; if (typeof v === 'string') { if (/^\\{\\{\\s*[A-Za-z0-9_]+\\s*\\}\\}$/.test(v)) return v; return Number(v); } return v; })`;
const COERCE_FN_JS = `((v) => { if (v === '' || v === null || v === undefined) return undefined; if (Array.isArray(v)) return v; if (typeof v === 'string') { if (/^\\{\\{\\s*[A-Za-z0-9_]+\\s*\\}\\}$/.test(v)) return v; return Number(v); } return v; })`;

function addNumberCoercion(src, coerceFn, zPrefix) {
  let result = src;
  const p = zPrefix === "z" ? "z" : "zod_1\\.z";

  const plainPattern = new RegExp(`${p}\\.number\\(\\)(?!\\.)`, "g");
  const plainCount = (result.match(plainPattern) || []).length;
  if (plainCount > 0) {
    result = result.replace(
      plainPattern,
      `${zPrefix}.preprocess(${coerceFn}, ${zPrefix}.number())`,
    );
    console.log(`✓ Number coercion: plain z.number() (${plainCount})`);
  }

  const chainedPattern = new RegExp(
    `${p}\\.number\\(\\)((?:\\.[a-zA-Z]+\\([^)]*\\))+)`,
    "g",
  );
  let chainedCount = 0;
  result = result.replace(chainedPattern, (match, chain) => {
    chainedCount++;
    return `${zPrefix}.preprocess(${coerceFn}, ${zPrefix}.number()${chain})`;
  });
  if (chainedCount > 0)
    console.log(`✓ Number coercion: chained z.number() (${chainedCount})`);

  return result;
}

// ─── EXISTING PASS: merge field support ──────────────────────────────────────

const MERGE_RE = `/^\\{\\{\\s*[A-Za-z0-9_]+\\s*\\}\\}$/`;

function addMergeFieldSupport(src, zPrefix) {
  let result = src;
  const p = zPrefix === "z" ? "z" : "zod_1\\.z";

  let regexCount = 0;
  result = result.replace(
    new RegExp(
      `${p}\\.string\\(\\)\\.regex\\((\\/(?:[^\\/\\\\]|\\\\.)*\\/)\\)(?![.(])`,
      "g",
    ),
    (match, existingRegex) => {
      regexCount++;
      return `${zPrefix}.union([${zPrefix}.string().regex(${existingRegex}), ${zPrefix}.string().regex(${MERGE_RE})])`;
    },
  );
  console.log(`✓ Merge field support: regex fields (${regexCount})`);

  let numberCount = 0;
  const preStr =
    zPrefix === "z"
      ? "z\\.preprocess\\(\\(\\(v: unknown\\)"
      : "zod_1\\.z\\.preprocess\\(\\(\\(v\\)";
  result = result.replace(
    new RegExp(
      `(${preStr}.*?return v; }\\), ${p}\\.number\\(\\)(?:\\.[a-zA-Z]+\\([^)]*\\))*)\\)`,
      "g",
    ),
    (match) => {
      numberCount++;
      return `${zPrefix}.union([${match}, ${zPrefix}.string().regex(${MERGE_RE})])`;
    },
  );
  console.log(`✓ Merge field support: number fields (${numberCount})`);

  return result;
}

function fixMergeField(src, zPrefix) {
  const p = zPrefix === "z" ? "z" : "zod_1\\.z";
  const pattern = new RegExp(
    `(export const mergefieldMergeFieldSchema = ${p}\\.object\\(\\{[\\s\\S]*?find: ${p}\\.string\\(\\),[\\s\\S]*?replace: ${p}\\.unknown\\(\\),[\\s\\S]*?\\}\\))`,
    "m",
  );
  if (!pattern.test(src)) {
    return src;
  }
  const replacement = `export const mergefieldMergeFieldSchema = z.object({
  find: z.string(),
  replace: z.union([z.string(), z.number(), z.boolean(), z.null(), z.record(z.string(), z.unknown()), z.array(z.unknown())]),
})`;
  const result = src.replace(pattern, replacement);
  console.log("✓ Fixed MergeField replace type");
  return result;
}

// ─── EXISTING PASS: clip fit-filter for rich-text ────────────────────────────

const CLIP_FIT_FILTER_ESM = `export const clipSchema = clipClipSchema;

// Strips 'fit' from clips whose asset type is 'rich-text' (fit is unsupported there)
const clipClipSchemaWithFitFilter = clipClipSchema.transform((clip) => {
  if (clip.asset && typeof clip.asset === 'object' && 'type' in clip.asset) {
    if (clip.asset.type === 'rich-text') {
      const { fit, ...rest } = clip;
      return rest;
    }
  }
  return clip;
});`;

const CLIP_FIT_FILTER_CJS = `exports.clipSchema = exports.clipClipSchema;

// Strips 'fit' from clips whose asset type is 'rich-text' (fit is unsupported there)
const clipClipSchemaWithFitFilter = exports.clipClipSchema.transform((clip) => {
  if (clip.asset && typeof clip.asset === 'object' && 'type' in clip.asset) {
    if (clip.asset.type === 'rich-text') {
      const { fit, ...rest } = clip;
      return rest;
    }
  }
  return clip;
});`;

function addClipFitFilter(src, isCjs) {
  if (isCjs) {
    const exportPattern = /exports\.clipSchema = exports\.clipClipSchema;/;
    const trackPattern = /clips: zod_1\.z\.array\(exports\.clipClipSchema\)/;
    if (!exportPattern.test(src)) {
      console.error("✗ Could not find CJS clipSchema export for fit filter");
      process.exit(1);
    }
    let result = src.replace(exportPattern, CLIP_FIT_FILTER_CJS);
    if (!trackPattern.test(result)) {
      console.error(
        "✗ Could not find CJS trackTrackSchema to update with fit filter",
      );
      process.exit(1);
    }
    result = result.replace(
      trackPattern,
      "clips: zod_1.z.array(clipClipSchemaWithFitFilter)",
    );
    console.log("✓ Added clip fit filter (CJS)");
    return result;
  } else {
    const exportPattern = /export const clipSchema = clipClipSchema;/;
    const trackPattern = /clips: z\.array\(clipClipSchema\)/;
    if (!exportPattern.test(src)) {
      console.error("✗ Could not find ESM clipSchema export for fit filter");
      process.exit(1);
    }
    let result = src.replace(exportPattern, CLIP_FIT_FILTER_ESM);
    if (!trackPattern.test(result)) {
      console.error(
        "✗ Could not find ESM trackTrackSchema to update with fit filter",
      );
      process.exit(1);
    }
    result = result.replace(
      trackPattern,
      "clips: z.array(clipClipSchemaWithFitFilter)",
    );
    console.log("✓ Added clip fit filter (ESM)");
    return result;
  }
}

// ─── EXISTING PASS: strict mode ───────────────────────────────────────────────

function addStrictToObjects(src, prefix) {
  const marker = prefix + ".object({";
  let result = "";
  let i = 0;
  let strictCount = 0;

  while (i < src.length) {
    if (src.slice(i).startsWith(marker)) {
      let depth = 0;
      let j = i + marker.length - 1;
      depth = 1;
      j++;
      while (j < src.length && depth > 0) {
        if (src[j] === "{") depth++;
        else if (src[j] === "}") depth--;
        j++;
      }
      if (j < src.length && src[j] === ")") {
        j++;
        const after = src.slice(j);
        if (after.startsWith(".strict()")) {
          result += src.slice(i, j);
          i = j;
        } else {
          result += src.slice(i, j) + ".strict()";
          strictCount++;
          i = j;
        }
      } else {
        result += src[i];
        i++;
      }
    } else {
      result += src[i];
      i++;
    }
  }
  console.log(`✓ Added .strict() to ${strictCount} object schemas (${prefix})`);
  return result;
}

function addLegacyTextWrapMigrationError(code, zPrefix) {
  const schemaName = "textassetTextAssetSchema";
  const idx = code.indexOf(schemaName);
  if (idx === -1) {
    console.error(`✗ Could not find ${schemaName} for wrap migration error`);
    process.exit(1);
  }
  const strictMarker = ".strict()";
  const strictIdx = code.indexOf(strictMarker, idx);
  if (strictIdx === -1 || strictIdx - idx > 3000) {
    console.error(`✗ Could not find .strict() for ${schemaName}`);
    process.exit(1);
  }
  const superRefine =
    strictMarker +
    `.superRefine((data, ctx) => {\n` +
    `  if (data.background && data.background.wrap === true) {\n` +
    `    ctx.addIssue({\n` +
    `      code: ${zPrefix}.ZodIssueCode.custom,\n` +
    `      message: "background.wrap is only supported on rich-text and rich-caption assets. For type \\"text\\", migrate to type \\"rich-text\\" to use this feature.",\n` +
    `      path: ["background", "wrap"],\n` +
    `    });\n` +
    `  }\n` +
    `})`;
  const result =
    code.substring(0, strictIdx) +
    superRefine +
    code.substring(strictIdx + strictMarker.length);
  console.log(`✓ Added legacy text wrap migration error (${zPrefix})`);
  return result;
}

function fixCjsDiscriminatedUnions(src) {
  let result = src;

  const destPattern =
    /exports\.destinationsDestinationsSchema = zod_1\.z\.union\(\[[\s\S]*?\]\);/;
  if (!destPattern.test(result)) {
    console.error("✗ CJS: could not find destinationsDestinationsSchema");
    process.exit(1);
  }
  result = result.replace(
    destPattern,
    `exports.destinationsDestinationsSchema = zod_1.z.discriminatedUnion("provider", [
  exports.shotstackDestinationShotstackDestinationSchema,
  exports.muxDestinationMuxDestinationSchema,
  exports.s3DestinationS3DestinationSchema,
  exports.googleCloudStorageDestinationGoogleCloudStorageDestinationSchema,
  exports.googleDriveDestinationGoogleDriveDestinationSchema,
  exports.vimeoDestinationVimeoDestinationSchema,
  exports.tiktokDestinationTiktokDestinationSchema,
  exports.akamaiNetStorageDestinationAkamaiNetStorageDestinationSchema,
  exports.azureBlobStorageDestinationAzureBlobStorageDestinationSchema
]);`,
  );
  console.log("✓ CJS: fixed destinationsDestinationsSchema discriminator");

  const assetPattern =
    /exports\.assetAssetSchema = zod_1\.z\.union\(\[[\s\S]*?\]\);/;
  if (!assetPattern.test(result)) {
    console.error("✗ CJS: could not find assetAssetSchema");
    process.exit(1);
  }
  result = result.replace(
    assetPattern,
    `exports.assetAssetSchema = zod_1.z.discriminatedUnion("type", [
  exports.videoassetVideoAssetSchema,
  exports.imageassetImageAssetSchema,
  exports.textassetTextAssetSchema,
  exports.richtextassetRichTextAssetSchema,
  exports.audioassetAudioAssetSchema,
  exports.lumaassetLumaAssetSchema,
  exports.captionassetCaptionAssetSchema,
  exports.richcaptionassetRichCaptionAssetSchema,
  exports.htmlassetHtmlAssetSchema,
  exports.titleassetTitleAssetSchema,
  exports.shapeassetShapeAssetSchema,
  exports.svgassetSvgAssetSchema,
  exports.texttoimageassetTextToImageAssetSchema,
  exports.imagetovideoassetImageToVideoAssetSchema,
  exports.texttospeechassetTextToSpeechAssetSchema,
]);`,
  );
  console.log("✓ CJS: fixed assetAssetSchema discriminator");

  const svgShapePattern =
    /exports\.svgshapesSvgShapeSchema = zod_1\.z\.union\(\[[\s\S]*?\]\);/;
  if (svgShapePattern.test(result)) {
    result = result.replace(
      svgShapePattern,
      `exports.svgshapesSvgShapeSchema = zod_1.z.discriminatedUnion("type", [
  exports.svgshapesSvgRectangleShapeSchema,
  exports.svgshapesSvgCircleShapeSchema,
  exports.svgshapesSvgEllipseShapeSchema,
  exports.svgshapesSvgLineShapeSchema,
  exports.svgshapesSvgPolygonShapeSchema,
  exports.svgshapesSvgStarShapeSchema,
  exports.svgshapesSvgArrowShapeSchema,
  exports.svgshapesSvgHeartShapeSchema,
  exports.svgshapesSvgCrossShapeSchema,
  exports.svgshapesSvgRingShapeSchema,
  exports.svgshapesSvgPathShapeSchema,
]);`,
    );
    console.log("✓ CJS: fixed svgshapesSvgShapeSchema discriminator");
  } else {
    console.log("- CJS: svgshapesSvgShapeSchema not present, skipping");
  }

  const svgFillPattern =
    /exports\.svgpropertiesSvgFillSchema = zod_1\.z\.union\(\[[\s\S]*?\]\);/;
  if (svgFillPattern.test(result)) {
    result = result.replace(
      svgFillPattern,
      `exports.svgpropertiesSvgFillSchema = zod_1.z.discriminatedUnion("type", [
  exports.svgpropertiesSvgSolidFillSchema,
  exports.svgpropertiesSvgLinearGradientFillSchema,
  exports.svgpropertiesSvgRadialGradientFillSchema,
]);`,
    );
    console.log("✓ CJS: fixed svgpropertiesSvgFillSchema discriminator");
  } else {
    console.log("- CJS: svgpropertiesSvgFillSchema not present, skipping");
  }

  return result;
}

function fixCjsSvgAsset(src) {
  const pattern =
    /exports\.svgassetSvgAssetSchema = zod_1\.z\.object\(\{[\s\S]*?\}\);/;
  if (!pattern.test(src)) {
    console.error("✗ CJS: could not find svgassetSvgAssetSchema");
    process.exit(1);
  }
  console.log("✓ CJS: fixed svgassetSvgAssetSchema");
  return src.replace(
    pattern,
    `exports.svgassetSvgAssetSchema = zod_1.z.object({
  type: zod_1.z.enum(["svg"]),
  src: zod_1.z.string().min(1).max(500000),
}).strict();`,
  );
}

console.log("=== fix-discriminator start ===");

let ts = fs.readFileSync(zodGenPath, "utf8");

ts = fixDestinationProviders(ts, true);
ts = fixDiscriminatedUnions(ts);
ts = fixSvgAsset(ts);
ts = fixMergeField(ts, "z");
ts = addStrictToObjects(ts, "z");
ts = addLegacyTextWrapMigrationError(ts, "z");
ts = addClipFitFilter(ts, false);
ts = addNumberCoercion(ts, COERCE_FN_TS, "z");
ts = addMergeFieldSupport(ts, "z");
ts = makeFieldOptional(ts, "clipClipSchema", "length", false);
ts = makeFieldOptional(ts, "rangeRangeSchema", "length", false);
ts = makeFieldOptional(ts, "tweenTweenSchema", "length", false);
ts = applyAliases(ts, "z", false);

fs.writeFileSync(zodGenPath, ts);
console.log("✓ Wrote zod.gen.ts");

if (fs.existsSync(zodGenCjsPath)) {
  let cjs = fs.readFileSync(zodGenCjsPath, "utf8");

  cjs = fixCjsDestinationProviders(cjs);
  cjs = fixCjsDiscriminatedUnions(cjs);
  cjs = fixCjsSvgAsset(cjs);
  cjs = addStrictToObjects(cjs, "zod_1.z");
  cjs = addLegacyTextWrapMigrationError(cjs, "zod_1.z");
  cjs = addClipFitFilter(cjs, true);
  cjs = addNumberCoercion(cjs, COERCE_FN_JS, "zod_1.z");
  cjs = addMergeFieldSupport(cjs, "zod_1.z");
  cjs = makeFieldOptional(cjs, "clipClipSchema", "length", true);
  cjs = makeFieldOptional(cjs, "rangeRangeSchema", "length", true);
  cjs = makeFieldOptional(cjs, "tweenTweenSchema", "length", true);
  cjs = applyAliases(cjs, "zod_1.z", true);

  fs.writeFileSync(zodGenCjsPath, cjs);
  console.log("✓ Wrote zod.gen.cjs");
}

if (fs.existsSync(zodGenJsPath)) {
  let js = fs.readFileSync(zodGenJsPath, "utf8");

  js = fixDestinationProviders(js, false);
  js = fixDiscriminatedUnions(js);
  js = fixSvgAsset(js);
  js = fixMergeField(js, "z");
  js = addStrictToObjects(js, "z");
  js = addLegacyTextWrapMigrationError(js, "z");
  js = addClipFitFilter(js, false);
  js = addNumberCoercion(js, COERCE_FN_JS, "z");
  js = addMergeFieldSupport(js, "z");
  js = makeFieldOptional(js, "clipClipSchema", "length", false);
  js = makeFieldOptional(js, "rangeRangeSchema", "length", false);
  js = makeFieldOptional(js, "tweenTweenSchema", "length", false);
  js = applyAliases(js, "z", false);

  fs.writeFileSync(zodGenJsPath, js);
  console.log("✓ Wrote zod.gen.js");
}

const elapsed = Date.now() - START_TIME;
console.log(`=== fix-discriminator done in ${elapsed}ms ===`);
