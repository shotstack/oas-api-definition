const fs = require("fs");
const path = require("path");

const zodGenPath = path.join(__dirname, "..", "dist", "zod", "zod.gen.ts");

console.log("Fixing discriminator and adding z.coerce for number fields...");

let content = fs.readFileSync(zodGenPath, "utf8");

// Fix destination provider fields to use z.literal() for proper discriminated union
// Note: The generated code uses double quotes, so we match both single and double quotes
const destinationProviderFixes = [
  { pattern: /provider: z\.string\(\)\.default\(["']shotstack["']\)/, replacement: 'provider: z.literal("shotstack")' },
  { pattern: /provider: z\.string\(\)\.default\(["']s3["']\)/, replacement: 'provider: z.literal("s3")' },
  { pattern: /provider: z\.string\(\)\.default\(["']mux["']\)/, replacement: 'provider: z.literal("mux")' },
  { pattern: /provider: z\.string\(\)\.default\(["']google-cloud-storage["']\)/, replacement: 'provider: z.literal("google-cloud-storage")' },
  { pattern: /provider: z\.string\(\)\.default\(["']google-drive["']\)/, replacement: 'provider: z.literal("google-drive")' },
  { pattern: /provider: z\.string\(\)\.default\(["']vimeo["']\)/, replacement: 'provider: z.literal("vimeo")' },
  { pattern: /provider: z\.string\(\)\.default\(["']tiktok["']\)/, replacement: 'provider: z.literal("tiktok")' },
];

destinationProviderFixes.forEach(({ pattern, replacement }) => {
  if (pattern.test(content)) {
    content = content.replace(pattern, replacement);
    console.log(`✓ Fixed destination provider: ${replacement}`);
  }
});

// Fix the malformed destinations union schema
const destinationsUnionPattern =
  /export const destinationsDestinationsSchema = z\.union\(\[[\s\S]*?\]\);/;

const newDestinationsSchema = `export const destinationsDestinationsSchema = z.discriminatedUnion("provider", [
  shotstackDestinationShotstackDestinationSchema,
  muxDestinationMuxDestinationSchema,
  s3DestinationS3DestinationSchema,
  googleCloudStorageDestinationGoogleCloudStorageDestinationSchema,
  googleDriveDestinationGoogleDriveDestinationSchema,
  vimeoDestinationVimeoDestinationSchema,
  tiktokDestinationTiktokDestinationSchema
]);`;

if (destinationsUnionPattern.test(content)) {
  content = content.replace(destinationsUnionPattern, newDestinationsSchema);
  console.log("✓ Fixed destinationsDestinationsSchema discriminator");
} else {
  console.log("⚠ Could not find destinationsDestinationsSchema to replace");
}

const assetUnionPattern =
  /export const assetAssetSchema = z\.union\(\[[\s\S]*?\]\);/;

const newAssetSchema = `export const assetAssetSchema = z.discriminatedUnion("type", [
  videoassetVideoAssetSchema,
  imageassetImageAssetSchema,
  textassetTextAssetSchema,
  richtextassetRichTextAssetSchema,
  audioassetAudioAssetSchema,
  lumaassetLumaAssetSchema,
  captionassetCaptionAssetSchema,
  htmlassetHtmlAssetSchema,
  titleassetTitleAssetSchema,
  shapeassetShapeAssetSchema,
  svgassetSvgAssetSchema,
  texttoimageassetTextToImageAssetSchema,
  imagetovideoassetImageToVideoAssetSchema,
  texttospeechassetTextToSpeechAssetSchema,
]);`;

if (assetUnionPattern.test(content)) {
  content = content.replace(assetUnionPattern, newAssetSchema);
  console.log("✓ Fixed assetAssetSchema discriminator");
} else {
  console.log("⚠ Could not find assetAssetSchema to replace");
}

const svgShapeUnionPattern =
  /export const svgshapesSvgShapeSchema = z\.union\(\[[\s\S]*?\]\);/;

const newSvgShapeSchema = `export const svgshapesSvgShapeSchema = z.discriminatedUnion("type", [
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

if (svgShapeUnionPattern.test(content)) {
  content = content.replace(svgShapeUnionPattern, newSvgShapeSchema);
  console.log("✓ Fixed svgshapesSvgShapeSchema discriminator");
} else {
  console.log("⚠ Could not find svgshapesSvgShapeSchema to replace");
}

const svgFillUnionPattern =
  /export const svgpropertiesSvgFillSchema = z\.union\(\[[\s\S]*?\]\);/;

const newSvgFillSchema = `export const svgpropertiesSvgFillSchema = z.discriminatedUnion("type", [
  svgpropertiesSvgSolidFillSchema,
  svgpropertiesSvgLinearGradientFillSchema,
  svgpropertiesSvgRadialGradientFillSchema,
]);`;

if (svgFillUnionPattern.test(content)) {
  content = content.replace(svgFillUnionPattern, newSvgFillSchema);
  console.log("✓ Fixed svgpropertiesSvgFillSchema discriminator");
} else {
  console.log("⚠ Could not find svgpropertiesSvgFillSchema to replace");
}

const svgAssetPattern =
  /export const svgassetSvgAssetSchema = z\.object\(\{[\s\S]*?\}\);/;

// Note: Do NOT include z.preprocess here - the number coercion pass will add it
const svgAssetSuperRefine = `export const svgassetSvgAssetSchema = z.object({
  type: z.enum(["svg"]),
  src: z.optional(z.string().min(1).max(500000)),
  shape: z.optional(svgshapesSvgShapeSchema),
  fill: z.optional(svgpropertiesSvgFillSchema),
  stroke: z.optional(svgpropertiesSvgStrokeSchema),
  shadow: z.optional(svgpropertiesSvgShadowSchema),
  transform: z.optional(svgpropertiesSvgTransformSchema),
  opacity: z.optional(z.number().gte(0).lte(1)).default(1),
  width: z.optional(z.number().int().gte(1).lte(4096)),
  height: z.optional(z.number().int().gte(1).lte(4096)),
}).superRefine((data, ctx) => {
  const hasShape = data.shape !== undefined;
  const hasSrc = data.src !== undefined && data.src.trim() !== "";

  if (!hasShape && !hasSrc) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Either 'src' or 'shape' must be provided",
      path: [],
    });
  }

  if (hasShape && hasSrc) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Provide either 'src' or 'shape', not both",
      path: ["src"],
    });
  }

  if (hasSrc) {
    const disallowedProps = ["shape", "fill", "stroke", "shadow", "transform", "width", "height"];
    for (const prop of disallowedProps) {
      if (data[prop] !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: \`'\${prop}' is not allowed when using 'src'. Only 'type' and 'src' are allowed in import mode\`,
          path: [prop],
        });
      }
    }
  }
});`;

if (svgAssetPattern.test(content)) {
  content = content.replace(svgAssetPattern, svgAssetSuperRefine);
  console.log("✓ Added superRefine validation to svgassetSvgAssetSchema for mutual exclusivity");
} else {
  console.log("⚠ Could not find svgassetSvgAssetSchema to add superRefine validation");
}

// Coercion function that converts strings to numbers inside preprocess (doesn't rely on z.coerce)
// Note: Arrays are passed through unchanged to allow unions with array types (e.g., scale: number | Tween[])
// Note: Merge field templates ({{ FIELD }}) are preserved to allow the union's string alternative to match
const coerceNumber = `((v: unknown) => { if (v === '' || v === null || v === undefined) return undefined; if (Array.isArray(v)) return v; if (typeof v === 'string') { if (/^\\{\\{\\s*[A-Za-z0-9_]+\\s*\\}\\}$/.test(v)) return v; return Number(v); } return v; })`;

const plainNumberPattern = /z\.number\(\)(?!\.)/g;
const plainNumberCount = (content.match(plainNumberPattern) || []).length;
if (plainNumberCount > 0) {
  content = content.replace(
    plainNumberPattern,
    `z.preprocess(${coerceNumber}, z.number())`
  );
  console.log(
    `✓ Added number coercion for plain z.number() (${plainNumberCount} occurrences)`
  );
}

const chainedNumberPattern = /z\.number\(\)((?:\.[a-zA-Z]+\([^)]*\))+)/g;
let chainedCount = 0;
content = content.replace(chainedNumberPattern, (match, chain) => {
  chainedCount++;
  return `z.preprocess(${coerceNumber}, z.number()${chain})`;
});
if (chainedCount > 0) {
  console.log(
    `✓ Added number coercion for chained z.number() (${chainedCount} occurrences)`
  );
}

const plainIntPattern = /z\.int\(\)(?!\.)/g;
const plainIntCount = (content.match(plainIntPattern) || []).length;
if (plainIntCount > 0) {
  content = content.replace(
    plainIntPattern,
    `z.preprocess(${coerceNumber}, z.number().int())`
  );
  console.log(
    `✓ Added number coercion for plain z.int() (${plainIntCount} occurrences)`
  );
}

const chainedIntPattern = /z\.int\(\)((?:\.[a-zA-Z]+\([^)]*\))+)/g;
let chainedIntCount = 0;
content = content.replace(chainedIntPattern, (match, chain) => {
  chainedIntCount++;
  return `z.preprocess(${coerceNumber}, z.number().int()${chain})`;
});
if (chainedIntCount > 0) {
  console.log(
    `✓ Added number coercion for chained z.int() (${chainedIntCount} occurrences)`
  );
}

const mergeFieldPattern = /export const mergefieldMergeFieldSchema = z\.object\(\{[\s\S]*?find: z\.string\(\),[\s\S]*?replace: z\.unknown\(\),[\s\S]*?\}\);/;

const newMergeFieldSchema = `export const mergefieldMergeFieldSchema = z.object({
  find: z.string(),
  replace: z.union([z.string(), z.number(), z.boolean(), z.null(), z.record(z.string(), z.unknown()), z.array(z.unknown())]),
});`;

if (mergeFieldPattern.test(content)) {
  content = content.replace(mergeFieldPattern, newMergeFieldSchema);
  console.log("✓ Fixed MergeField replace to require a value");
} else {
  console.log("⚠ Could not find mergefieldMergeFieldSchema to fix");
}


// ─── MERGE FIELD SUPPORT ──────────────────────────────────────────────────────
// Allow merge field templates ({{ FIELD_NAME }}) in string fields with regex validation
// and number fields. This enables the Studio SDK to preserve merge field bindings.
console.log("Adding merge field support...");

// Regex literal for merge fields: /^\{\{\s*[A-Za-z0-9_]+\s*\}\}$/
const MERGE_FIELD_REGEX_LITERAL = `/^\\{\\{\\s*[A-Za-z0-9_]+\\s*\\}\\}$/`;

// 1. z.string().regex(/pattern/) → union with merge field alternative
// For fields with existing regex patterns (like hex colors, clip aliases), add merge field as alternative
// Match regex literal: /.../ (handles escaped slashes inside)
let regexFieldCount = 0;
content = content.replace(
  /z\.string\(\)\.regex\((\/(?:[^\/\\]|\\.)*\/)\)(?![\.\(])/g,
  (match, existingRegex) => {
    regexFieldCount++;
    return `z.union([z.string().regex(${existingRegex}), z.string().regex(${MERGE_FIELD_REGEX_LITERAL})])`;
  }
);
console.log(`✓ Added merge field support to ${regexFieldCount} regex-validated string fields`);

// 2. Number fields with coercion → add merge field string alternative
// The existing z.preprocess wraps numbers. We need to add union with merge field.
// The coercion function contains many ) chars, so we use the "return v; })" anchor pattern
// Pattern: z.preprocess(((...) => {...return v; }), z.number()...) → z.union([...], z.string().regex(MERGE_FIELD)])
let numberFieldCount = 0;
content = content.replace(
  /(z\.preprocess\(\(\(v: unknown\).*?return v; }\), z\.number\(\)(?:\.[a-zA-Z]+\([^)]*\))*\))/g,
  (match) => {
    numberFieldCount++;
    return `z.union([${match}, z.string().regex(${MERGE_FIELD_REGEX_LITERAL})])`;
  }
);
console.log(`✓ Added merge field support to ${numberFieldCount} number fields`);

// ─── CLIP SCHEMA FIT PROPERTY FILTER ──────────────────────────────────────────
// Remove the 'fit' property from clips when the asset type is 'rich-text' or 'rich-caption'
// These asset types don't support the fit property
console.log("Adding fit property filter for rich-text and rich-caption assets...");

const clipSchemaPattern = /export const clipClipSchema = (z\.object\(\{[\s\S]*?\}\));/;

const clipSchemaMatch = content.match(clipSchemaPattern);
if (clipSchemaMatch) {
  const originalSchema = clipSchemaMatch[1];
  const newClipSchema = `export const clipClipSchema = ${originalSchema}.transform((clip) => {
  // Remove 'fit' property for asset types that don't support it
  if (clip.asset && typeof clip.asset === 'object' && 'type' in clip.asset) {
    const assetType = clip.asset.type;
    if (assetType === 'rich-text') {
      const { fit, ...rest } = clip;
      return rest;
    }
  }
  return clip;
});`;
  content = content.replace(clipSchemaPattern, newClipSchema);
  console.log("✓ Added fit property filter to clipClipSchema");
} else {
  console.log("⚠ Could not find clipClipSchema to add fit property filter");
}

fs.writeFileSync(zodGenPath, content);

const zodGenCjsPath = path.join(__dirname, "..", "dist", "zod", "zod.gen.cjs");
if (fs.existsSync(zodGenCjsPath)) {
  let cjsContent = fs.readFileSync(zodGenCjsPath, "utf8");

  // Fix destination provider fields in CJS
  // Note: The generated code uses double quotes, so we match both single and double quotes
  const cjsDestinationProviderFixes = [
    { pattern: /provider: zod_1\.z\.string\(\)\.default\(["']shotstack["']\)/, replacement: 'provider: zod_1.z.literal("shotstack")' },
    { pattern: /provider: zod_1\.z\.string\(\)\.default\(["']s3["']\)/, replacement: 'provider: zod_1.z.literal("s3")' },
    { pattern: /provider: zod_1\.z\.string\(\)\.default\(["']mux["']\)/, replacement: 'provider: zod_1.z.literal("mux")' },
    { pattern: /provider: zod_1\.z\.string\(\)\.default\(["']google-cloud-storage["']\)/, replacement: 'provider: zod_1.z.literal("google-cloud-storage")' },
    { pattern: /provider: zod_1\.z\.string\(\)\.default\(["']google-drive["']\)/, replacement: 'provider: zod_1.z.literal("google-drive")' },
    { pattern: /provider: zod_1\.z\.string\(\)\.default\(["']vimeo["']\)/, replacement: 'provider: zod_1.z.literal("vimeo")' },
    { pattern: /provider: zod_1\.z\.string\(\)\.default\(["']tiktok["']\)/, replacement: 'provider: zod_1.z.literal("tiktok")' },
  ];

  cjsDestinationProviderFixes.forEach(({ pattern, replacement }) => {
    if (pattern.test(cjsContent)) {
      cjsContent = cjsContent.replace(pattern, replacement);
      console.log(`✓ Fixed destination provider in CJS: ${replacement}`);
    }
  });

  // Fix destinations union schema in CJS
  const cjsDestinationsUnionPattern =
    /exports\.destinationsDestinationsSchema = zod_1\.z\.union\(\[[\s\S]*?\]\);/;

  const newCjsDestinationsSchema = `exports.destinationsDestinationsSchema = zod_1.z.discriminatedUnion("provider", [
  exports.shotstackDestinationShotstackDestinationSchema,
  exports.muxDestinationMuxDestinationSchema,
  exports.s3DestinationS3DestinationSchema,
  exports.googleCloudStorageDestinationGoogleCloudStorageDestinationSchema,
  exports.googleDriveDestinationGoogleDriveDestinationSchema,
  exports.vimeoDestinationVimeoDestinationSchema,
  exports.tiktokDestinationTiktokDestinationSchema
]);`;

  if (cjsDestinationsUnionPattern.test(cjsContent)) {
    cjsContent = cjsContent.replace(cjsDestinationsUnionPattern, newCjsDestinationsSchema);
    console.log("✓ Fixed destinationsDestinationsSchema discriminator in CJS");
  }

  const cjsAssetUnionPattern =
    /exports\.assetAssetSchema = zod_1\.z\.union\(\[[\s\S]*?\]\);/;

  const newCjsAssetSchema = `exports.assetAssetSchema = zod_1.z.discriminatedUnion("type", [
  exports.videoassetVideoAssetSchema,
  exports.imageassetImageAssetSchema,
  exports.textassetTextAssetSchema,
  exports.richtextassetRichTextAssetSchema,
  exports.audioassetAudioAssetSchema,
  exports.lumaassetLumaAssetSchema,
  exports.captionassetCaptionAssetSchema,
  exports.htmlassetHtmlAssetSchema,
  exports.titleassetTitleAssetSchema,
  exports.shapeassetShapeAssetSchema,
  exports.svgassetSvgAssetSchema,
  exports.texttoimageassetTextToImageAssetSchema,
  exports.imagetovideoassetImageToVideoAssetSchema,
  exports.texttospeechassetTextToSpeechAssetSchema,
]);`;

  if (cjsAssetUnionPattern.test(cjsContent)) {
    cjsContent = cjsContent.replace(cjsAssetUnionPattern, newCjsAssetSchema);
    console.log("✓ Fixed assetAssetSchema discriminator in CJS");
  }

  const cjsSvgShapeUnionPattern =
    /exports\.svgshapesSvgShapeSchema = zod_1\.z\.union\(\[[\s\S]*?\]\);/;

  const newCjsSvgShapeSchema = `exports.svgshapesSvgShapeSchema = zod_1.z.discriminatedUnion("type", [
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
]);`;

  if (cjsSvgShapeUnionPattern.test(cjsContent)) {
    cjsContent = cjsContent.replace(
      cjsSvgShapeUnionPattern,
      newCjsSvgShapeSchema
    );
    console.log("✓ Fixed svgshapesSvgShapeSchema discriminator in CJS");
  }

  const cjsSvgFillUnionPattern =
    /exports\.svgpropertiesSvgFillSchema = zod_1\.z\.union\(\[[\s\S]*?\]\);/;

  const newCjsSvgFillSchema = `exports.svgpropertiesSvgFillSchema = zod_1.z.discriminatedUnion("type", [
  exports.svgpropertiesSvgSolidFillSchema,
  exports.svgpropertiesSvgLinearGradientFillSchema,
  exports.svgpropertiesSvgRadialGradientFillSchema,
]);`;

  if (cjsSvgFillUnionPattern.test(cjsContent)) {
    cjsContent = cjsContent.replace(
      cjsSvgFillUnionPattern,
      newCjsSvgFillSchema
    );
    console.log("✓ Fixed svgpropertiesSvgFillSchema discriminator in CJS");
  }

  const cjsSvgAssetPattern =
    /exports\.svgassetSvgAssetSchema = zod_1\.z\.object\(\{[\s\S]*?\}\);/;

  // Note: Do NOT include z.preprocess here - the number coercion pass will add it
  const cjsSvgAssetSuperRefine = `exports.svgassetSvgAssetSchema = zod_1.z.object({
  type: zod_1.z.enum(["svg"]),
  src: zod_1.z.optional(zod_1.z.string().min(1).max(500000)),
  shape: zod_1.z.optional(exports.svgshapesSvgShapeSchema),
  fill: zod_1.z.optional(exports.svgpropertiesSvgFillSchema),
  stroke: zod_1.z.optional(exports.svgpropertiesSvgStrokeSchema),
  shadow: zod_1.z.optional(exports.svgpropertiesSvgShadowSchema),
  transform: zod_1.z.optional(exports.svgpropertiesSvgTransformSchema),
  opacity: zod_1.z.optional(zod_1.z.number().gte(0).lte(1)).default(1),
  width: zod_1.z.optional(zod_1.z.number().int().gte(1).lte(4096)),
  height: zod_1.z.optional(zod_1.z.number().int().gte(1).lte(4096)),
}).superRefine((data, ctx) => {
  const hasShape = data.shape !== undefined;
  const hasSrc = data.src !== undefined && data.src.trim() !== "";

  if (!hasShape && !hasSrc) {
    ctx.addIssue({
      code: zod_1.z.ZodIssueCode.custom,
      message: "Either 'src' or 'shape' must be provided",
      path: [],
    });
  }

  if (hasShape && hasSrc) {
    ctx.addIssue({
      code: zod_1.z.ZodIssueCode.custom,
      message: "Provide either 'src' or 'shape', not both",
      path: ["src"],
    });
  }

  if (hasSrc) {
    const disallowedProps = ["shape", "fill", "stroke", "shadow", "transform", "width", "height"];
    for (const prop of disallowedProps) {
      if (data[prop] !== undefined) {
        ctx.addIssue({
          code: zod_1.z.ZodIssueCode.custom,
          message: "'" + prop + "' is not allowed when using 'src'. Only 'type' and 'src' are allowed in import mode",
          path: [prop],
        });
      }
    }
  }
});`;

  if (cjsSvgAssetPattern.test(cjsContent)) {
    cjsContent = cjsContent.replace(cjsSvgAssetPattern, cjsSvgAssetSuperRefine);
    console.log("✓ Added superRefine validation to svgassetSvgAssetSchema in CJS");
  }

  // Coercion function for CJS (without TypeScript type annotation)
  // Note: Arrays are passed through unchanged to allow unions with array types (e.g., scale: number | Tween[])
  // Note: Merge field templates ({{ FIELD }}) are preserved to allow the union's string alternative to match
  const cjsCoerceNumber = `((v) => { if (v === '' || v === null || v === undefined) return undefined; if (Array.isArray(v)) return v; if (typeof v === 'string') { if (/^\\{\\{\\s*[A-Za-z0-9_]+\\s*\\}\\}$/.test(v)) return v; return Number(v); } return v; })`;

  const cjsPlainNumberPattern = /zod_1\.z\.number\(\)(?!\.)/g;
  const cjsPlainNumberCount = (cjsContent.match(cjsPlainNumberPattern) || [])
    .length;
  if (cjsPlainNumberCount > 0) {
    cjsContent = cjsContent.replace(
      cjsPlainNumberPattern,
      `zod_1.z.preprocess(${cjsCoerceNumber}, zod_1.z.number())`
    );
    console.log(
      `✓ Added number coercion in CJS (${cjsPlainNumberCount} occurrences)`
    );
  }

  const cjsChainedNumberPattern =
    /zod_1\.z\.number\(\)((?:\.[a-zA-Z]+\([^)]*\))+)/g;
  let cjsChainedCount = 0;
  cjsContent = cjsContent.replace(cjsChainedNumberPattern, (match, chain) => {
    cjsChainedCount++;
    return `zod_1.z.preprocess(${cjsCoerceNumber}, zod_1.z.number()${chain})`;
  });
  if (cjsChainedCount > 0) {
    console.log(
      `✓ Added number coercion chains in CJS (${cjsChainedCount} occurrences)`
    );
  }

  // ─── MERGE FIELD SUPPORT FOR CJS ─────────────────────────────────────────────
  const CJS_MERGE_FIELD_REGEX_LITERAL = `/^\\{\\{\\s*[A-Za-z0-9_]+\\s*\\}\\}$/`;

  // 1. String fields with regex validation
  let cjsRegexFieldCount = 0;
  cjsContent = cjsContent.replace(
    /zod_1\.z\.string\(\)\.regex\((\/(?:[^\/\\]|\\.)*\/)\)(?![\.\(])/g,
    (match, existingRegex) => {
      cjsRegexFieldCount++;
      return `zod_1.z.union([zod_1.z.string().regex(${existingRegex}), zod_1.z.string().regex(${CJS_MERGE_FIELD_REGEX_LITERAL})])`;
    }
  );
  console.log(`✓ Added merge field support to ${cjsRegexFieldCount} regex-validated string fields in CJS`);

  // 2. Number fields with coercion
  let cjsNumberFieldCount = 0;
  cjsContent = cjsContent.replace(
    /(zod_1\.z\.preprocess\(\(\(v\).*?return v; }\), zod_1\.z\.number\(\)(?:\.[a-zA-Z]+\([^)]*\))*\))/g,
    (match) => {
      cjsNumberFieldCount++;
      return `zod_1.z.union([${match}, zod_1.z.string().regex(${CJS_MERGE_FIELD_REGEX_LITERAL})])`;
    }
  );
  console.log(`✓ Added merge field support to ${cjsNumberFieldCount} number fields in CJS`);

  // ─── CLIP SCHEMA FIT PROPERTY FILTER FOR CJS ────────────────────────────────
  const cjsClipSchemaPattern = /exports\.clipClipSchema = (zod_1\.z\.object\(\{[\s\S]*?\}\));/;

  const cjsClipSchemaMatch = cjsContent.match(cjsClipSchemaPattern);
  if (cjsClipSchemaMatch) {
    const originalSchema = cjsClipSchemaMatch[1];
    const newCjsClipSchema = `exports.clipClipSchema = ${originalSchema}.transform((clip) => {
  // Remove 'fit' property for asset types that don't support it
  if (clip.asset && typeof clip.asset === 'object' && 'type' in clip.asset) {
    const assetType = clip.asset.type;
    if (assetType === 'rich-text') {
      const { fit, ...rest } = clip;
      return rest;
    }
  }
  return clip;
});`;
    cjsContent = cjsContent.replace(cjsClipSchemaPattern, newCjsClipSchema);
    console.log("✓ Added fit property filter to clipClipSchema in CJS");
  } else {
    console.log("⚠ Could not find clipClipSchema in CJS to add fit property filter");
  }

  fs.writeFileSync(zodGenCjsPath, cjsContent);
}

const zodGenJsPath = path.join(__dirname, "..", "dist", "zod", "zod.gen.js");
if (fs.existsSync(zodGenJsPath)) {
  let jsContent = fs.readFileSync(zodGenJsPath, "utf8");

  // Fix destination provider fields in ESM JS
  destinationProviderFixes.forEach(({ pattern, replacement }) => {
    if (pattern.test(jsContent)) {
      jsContent = jsContent.replace(pattern, replacement);
      console.log(`✓ Fixed destination provider in ESM JS: ${replacement}`);
    }
  });

  // Fix destinations union schema in ESM JS
  if (destinationsUnionPattern.test(jsContent)) {
    jsContent = jsContent.replace(destinationsUnionPattern, newDestinationsSchema);
    console.log("✓ Fixed destinationsDestinationsSchema discriminator in ESM JS");
  }

  const jsAssetUnionPattern =
    /export const assetAssetSchema = z\.union\(\[[\s\S]*?\]\);/;

  if (jsAssetUnionPattern.test(jsContent)) {
    jsContent = jsContent.replace(jsAssetUnionPattern, newAssetSchema);
    console.log("✓ Fixed assetAssetSchema discriminator in ESM JS");
  }

  if (svgShapeUnionPattern.test(jsContent)) {
    jsContent = jsContent.replace(svgShapeUnionPattern, newSvgShapeSchema);
    console.log("✓ Fixed svgshapesSvgShapeSchema discriminator in ESM JS");
  }

  if (svgFillUnionPattern.test(jsContent)) {
    jsContent = jsContent.replace(svgFillUnionPattern, newSvgFillSchema);
    console.log("✓ Fixed svgpropertiesSvgFillSchema discriminator in ESM JS");
  }

  if (svgAssetPattern.test(jsContent)) {
    jsContent = jsContent.replace(svgAssetPattern, svgAssetSuperRefine);
    console.log("✓ Added superRefine validation to svgassetSvgAssetSchema in ESM JS");
  }

  // Coercion function for ESM JS (without TypeScript type annotation)
  // Note: Arrays are passed through unchanged to allow unions with array types (e.g., scale: number | Tween[])
  // Note: Merge field templates ({{ FIELD }}) are preserved to allow the union's string alternative to match
  const esmCoerceNumber = `((v) => { if (v === '' || v === null || v === undefined) return undefined; if (Array.isArray(v)) return v; if (typeof v === 'string') { if (/^\\{\\{\\s*[A-Za-z0-9_]+\\s*\\}\\}$/.test(v)) return v; return Number(v); } return v; })`;

  const esmPlainNumberPattern = /z\.number\(\)(?!\.)/g;
  const esmPlainNumberCount = (jsContent.match(esmPlainNumberPattern) || [])
    .length;
  if (esmPlainNumberCount > 0) {
    jsContent = jsContent.replace(
      esmPlainNumberPattern,
      `z.preprocess(${esmCoerceNumber}, z.number())`
    );
    console.log(
      `✓ Added number coercion in ESM JS (${esmPlainNumberCount} occurrences)`
    );
  }

  const esmChainedNumberPattern = /z\.number\(\)((?:\.[a-zA-Z]+\([^)]*\))+)/g;
  let esmChainedCount = 0;
  jsContent = jsContent.replace(esmChainedNumberPattern, (match, chain) => {
    esmChainedCount++;
    return `z.preprocess(${esmCoerceNumber}, z.number()${chain})`;
  });
  if (esmChainedCount > 0) {
    console.log(
      `✓ Added number coercion chains in ESM JS (${esmChainedCount} occurrences)`
    );
  }

  // ─── MERGE FIELD SUPPORT FOR ESM JS ──────────────────────────────────────────
  const ESM_MERGE_FIELD_REGEX_LITERAL = `/^\\{\\{\\s*[A-Za-z0-9_]+\\s*\\}\\}$/`;

  // 1. String fields with regex validation
  let esmRegexFieldCount = 0;
  jsContent = jsContent.replace(
    /z\.string\(\)\.regex\((\/(?:[^\/\\]|\\.)*\/)\)(?![\.\(])/g,
    (match, existingRegex) => {
      esmRegexFieldCount++;
      return `z.union([z.string().regex(${existingRegex}), z.string().regex(${ESM_MERGE_FIELD_REGEX_LITERAL})])`;
    }
  );
  console.log(`✓ Added merge field support to ${esmRegexFieldCount} regex-validated string fields in ESM JS`);

  // 2. Number fields with coercion
  let esmNumberFieldCount = 0;
  jsContent = jsContent.replace(
    /(z\.preprocess\(\(\(v\).*?return v; }\), z\.number\(\)(?:\.[a-zA-Z]+\([^)]*\))*\))/g,
    (match) => {
      esmNumberFieldCount++;
      return `z.union([${match}, z.string().regex(${ESM_MERGE_FIELD_REGEX_LITERAL})])`;
    }
  );
  console.log(`✓ Added merge field support to ${esmNumberFieldCount} number fields in ESM JS`);

  // ─── CLIP SCHEMA FIT PROPERTY FILTER FOR ESM JS ─────────────────────────────
  const esmClipSchemaPattern = /export const clipClipSchema = (z\.object\(\{[\s\S]*?\}\));/;

  const esmClipSchemaMatch = jsContent.match(esmClipSchemaPattern);
  if (esmClipSchemaMatch) {
    const originalSchema = esmClipSchemaMatch[1];
    const newEsmClipSchema = `export const clipClipSchema = ${originalSchema}.transform((clip) => {
  // Remove 'fit' property for asset types that don't support it
  if (clip.asset && typeof clip.asset === 'object' && 'type' in clip.asset) {
    const assetType = clip.asset.type;
    if (assetType === 'rich-text') {
      const { fit, ...rest } = clip;
      return rest;
    }
  }
  return clip;
});`;
    jsContent = jsContent.replace(esmClipSchemaPattern, newEsmClipSchema);
    console.log("✓ Added fit property filter to clipClipSchema in ESM JS");
  } else {
    console.log("⚠ Could not find clipClipSchema in ESM JS to add fit property filter");
  }

  fs.writeFileSync(zodGenJsPath, jsContent);
}

console.log("Done!");
