const fs = require("fs");
const path = require("path");

const zodGenPath = path.join(__dirname, "..", "dist", "zod", "zod.gen.ts");

console.log("Fixing discriminator and adding z.coerce for number fields...");

let content = fs.readFileSync(zodGenPath, "utf8");

// Fix destination provider fields to use z.literal() for proper discriminated union
// Note: The generated code uses double quotes, so we match both single and double quotes
const destinationProviderFixes = [
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
    pattern: /provider: z\.string\(\)\.default\(["']google-cloud-storage["']\)/,
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

const svgAssetSuperRefine = `export const svgassetSvgAssetSchema = z.object({
  type: z.enum(["svg"]),
  src: z.optional(z.string().min(1).max(500000)),
  shape: z.optional(svgshapesSvgShapeSchema),
  fill: z.optional(svgpropertiesSvgFillSchema),
  stroke: z.optional(svgpropertiesSvgStrokeSchema),
  shadow: z.optional(svgpropertiesSvgShadowSchema),
  transform: z.optional(svgpropertiesSvgTransformSchema),
  opacity: z.optional(z.preprocess(((v: unknown) => { if (v === '' || v === null || v === undefined) return undefined; if (Array.isArray(v)) return v; if (typeof v === 'string') return Number(v); return v; }), z.number().gte(0).lte(1))).default(1),
  width: z.optional(z.preprocess(((v: unknown) => { if (v === '' || v === null || v === undefined) return undefined; if (Array.isArray(v)) return v; if (typeof v === 'string') return Number(v); return v; }), z.number().int().gte(1).lte(4096))),
  height: z.optional(z.preprocess(((v: unknown) => { if (v === '' || v === null || v === undefined) return undefined; if (Array.isArray(v)) return v; if (typeof v === 'string') return Number(v); return v; }), z.number().int().gte(1).lte(4096))),
}).strict().superRefine((data, ctx) => {
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
  console.log(
    "✓ Added superRefine validation to svgassetSvgAssetSchema for mutual exclusivity",
  );
} else {
  console.log(
    "⚠ Could not find svgassetSvgAssetSchema to add superRefine validation",
  );
}

// Coercion function that converts strings to numbers inside preprocess (doesn't rely on z.coerce)
// Note: Arrays are passed through unchanged to allow unions with array types (e.g., scale: number | Tween[])
const coerceNumber = `((v: unknown) => { if (v === '' || v === null || v === undefined) return undefined; if (Array.isArray(v)) return v; if (typeof v === 'string') return Number(v); return v; })`;

const plainNumberPattern = /z\.number\(\)(?!\.)/g;
const plainNumberCount = (content.match(plainNumberPattern) || []).length;
if (plainNumberCount > 0) {
  content = content.replace(
    plainNumberPattern,
    `z.preprocess(${coerceNumber}, z.number())`,
  );
  console.log(
    `✓ Added number coercion for plain z.number() (${plainNumberCount} occurrences)`,
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
    `✓ Added number coercion for chained z.number() (${chainedCount} occurrences)`,
  );
}

const plainIntPattern = /z\.int\(\)(?!\.)/g;
const plainIntCount = (content.match(plainIntPattern) || []).length;
if (plainIntCount > 0) {
  content = content.replace(
    plainIntPattern,
    `z.preprocess(${coerceNumber}, z.number().int())`,
  );
  console.log(
    `✓ Added number coercion for plain z.int() (${plainIntCount} occurrences)`,
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
    `✓ Added number coercion for chained z.int() (${chainedIntCount} occurrences)`,
  );
}

const mergeFieldPattern =
  /export const mergefieldMergeFieldSchema = z\.object\(\{[\s\S]*?find: z\.string\(\),[\s\S]*?replace: z\.unknown\(\),[\s\S]*?\}\);/;

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

const smartCoerceForUnion = `((v: unknown) => { if (v === '' || v === null || v === undefined) return undefined; if (typeof v === 'string' && /^-?\\d+(\\.\\d+)?$/.test(v)) return Number(v); return v; })`;

const clipStartPattern =
  /start: z\.union\(\[\s*z\.preprocess\(\(\(v: unknown\) => \{ if \(v === '' \|\| v === null \|\| v === undefined\) return undefined; if \(Array\.isArray\(v\)\) return v; if \(typeof v === 'string'\) return Number\(v\); return v; \}\), z\.number\(\)\.gte\(0\)\),\s*z\.string\(\)\.regex\(\/\^\(auto\|alias:\\\/\\\/\[A-Za-z0-9_-\]\+\)\$\/\),\s*\]\)/;

const newClipStartSchema = `start: z.union([
    z.preprocess(${smartCoerceForUnion}, z.number().gte(0)),
    z.string().regex(/^(auto|alias:\\/\\/[A-Za-z0-9_-]+)$/),
  ])`;

if (clipStartPattern.test(content)) {
  content = content.replace(clipStartPattern, newClipStartSchema);
  console.log(
    "✓ Fixed clip start to use smart coercion (preserves alias strings)",
  );
} else {
  console.log("⚠ Could not find clip start pattern to fix");
}

const clipLengthPattern =
  /length: z\.union\(\[\s*z\.preprocess\(\(\(v: unknown\) => \{ if \(v === '' \|\| v === null \|\| v === undefined\) return undefined; if \(Array\.isArray\(v\)\) return v; if \(typeof v === 'string'\) return Number\(v\); return v; \}\), z\.number\(\)\.gte\(0\)\),\s*z\.string\(\)\.regex\(\/\^\(auto\|end\|alias:\\\/\\\/\[A-Za-z0-9_-\]\+\)\$\/\),\s*\]\)/;

const newClipLengthSchema = `length: z.union([
    z.preprocess(${smartCoerceForUnion}, z.number().gte(0)),
    z.string().regex(/^(auto|end|alias:\\/\\/[A-Za-z0-9_-]+)$/),
  ])`;

if (clipLengthPattern.test(content)) {
  content = content.replace(clipLengthPattern, newClipLengthSchema);
  console.log(
    "✓ Fixed clip length to use smart coercion (preserves alias strings)",
  );
} else {
  console.log("⚠ Could not find clip length pattern to fix");
}

console.log("\n--- Adding strict mode to all object schemas ---");

const andPatternTransforms = [
  {
    pattern:
      /z\s*\n?\s*\.object\(\{\s*\n?\s*type: z\.literal\(\s*\n?\s*"didTextToAvatarOptions_DIDTextToAvatarOptions"\s*,?\s*\n?\s*\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(didTextToAvatarOptionsDidTextToAvatarOptionsSchema\)/g,
    replacement:
      'didTextToAvatarOptionsDidTextToAvatarOptionsSchema.extend({ type: z.literal("didTextToAvatarOptions_DIDTextToAvatarOptions") }).strict()',
    name: "didGeneratedAssetOptions",
  },
  {
    pattern:
      /z\s*\n?\s*\.object\(\{\s*\n?\s*type: z\.literal\(\s*\n?\s*"elevenlabsTextToSpeechOptions_ElevenLabsTextToSpeechOptions"\s*,?\s*\n?\s*\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(elevenlabsTextToSpeechOptionsElevenLabsTextToSpeechOptionsSchema\)/g,
    replacement:
      'elevenlabsTextToSpeechOptionsElevenLabsTextToSpeechOptionsSchema.extend({ type: z.literal("elevenlabsTextToSpeechOptions_ElevenLabsTextToSpeechOptions") }).strict()',
    name: "elevenlabsGeneratedAssetOptions",
  },
  // heygenGeneratedAssetOptions
  {
    pattern:
      /z\s*\n?\s*\.object\(\{\s*\n?\s*type: z\.literal\(\s*\n?\s*"heygenTextToAvatarOptions_HeyGenTextToAvatarOptions"\s*,?\s*\n?\s*\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(heygenTextToAvatarOptionsHeyGenTextToAvatarOptionsSchema\)/g,
    replacement:
      'heygenTextToAvatarOptionsHeyGenTextToAvatarOptionsSchema.extend({ type: z.literal("heygenTextToAvatarOptions_HeyGenTextToAvatarOptions") }).strict()',
    name: "heygenGeneratedAssetOptions",
  },
  // openaiGeneratedAssetOptions
  {
    pattern:
      /z\s*\n?\s*\.object\(\{\s*\n?\s*type: z\.literal\(\s*\n?\s*"openaiTextGeneratorOptions_OpenAiTextGeneratorOptions"\s*,?\s*\n?\s*\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(openaiTextGeneratorOptionsOpenAiTextGeneratorOptionsSchema\)/g,
    replacement:
      'openaiTextGeneratorOptionsOpenAiTextGeneratorOptionsSchema.extend({ type: z.literal("openaiTextGeneratorOptions_OpenAiTextGeneratorOptions") }).strict()',
    name: "openaiGeneratedAssetOptions",
  },
  // stabilityAiGeneratedAssetOptions
  {
    pattern:
      /z\s*\n?\s*\.object\(\{\s*\n?\s*type: z\.literal\(\s*\n?\s*"stabilityAiTextToImageOptions_StabilityAiTextToImageOptions"\s*,?\s*\n?\s*\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(stabilityAiTextToImageOptionsStabilityAiTextToImageOptionsSchema\)/g,
    replacement:
      'stabilityAiTextToImageOptionsStabilityAiTextToImageOptionsSchema.extend({ type: z.literal("stabilityAiTextToImageOptions_StabilityAiTextToImageOptions") }).strict()',
    name: "stabilityAiGeneratedAssetOptions",
  },
  // shotstackGeneratedAssetOptions - 4 members
  {
    pattern:
      /z\s*\n?\s*\.object\(\{\s*\n?\s*type: z\.literal\(\s*\n?\s*"shotstackTextToSpeechOptions_ShotstackTextToSpeechOptions"\s*,?\s*\n?\s*\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(shotstackTextToSpeechOptionsShotstackTextToSpeechOptionsSchema\)/g,
    replacement:
      'shotstackTextToSpeechOptionsShotstackTextToSpeechOptionsSchema.extend({ type: z.literal("shotstackTextToSpeechOptions_ShotstackTextToSpeechOptions") }).strict()',
    name: "shotstackTextToSpeechOptions",
  },
  {
    pattern:
      /z\s*\n?\s*\.object\(\{\s*\n?\s*type: z\.literal\(\s*\n?\s*"shotstackTextToImageOptions_ShotstackTextToImageOptions"\s*,?\s*\n?\s*\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(shotstackTextToImageOptionsShotstackTextToImageOptionsSchema\)/g,
    replacement:
      'shotstackTextToImageOptionsShotstackTextToImageOptionsSchema.extend({ type: z.literal("shotstackTextToImageOptions_ShotstackTextToImageOptions") }).strict()',
    name: "shotstackTextToImageOptions",
  },
  {
    pattern:
      /z\s*\n?\s*\.object\(\{\s*\n?\s*type: z\.literal\(\s*\n?\s*"shotstackTextGeneratorOptions_ShotstackTextGeneratorOptions"\s*,?\s*\n?\s*\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(shotstackTextGeneratorOptionsShotstackTextGeneratorOptionsSchema\)/g,
    replacement:
      'shotstackTextGeneratorOptionsShotstackTextGeneratorOptionsSchema.extend({ type: z.literal("shotstackTextGeneratorOptions_ShotstackTextGeneratorOptions") }).strict()',
    name: "shotstackTextGeneratorOptions",
  },
  {
    pattern:
      /z\s*\n?\s*\.object\(\{\s*\n?\s*type: z\.literal\(\s*\n?\s*"shotstackImageToVideoOptions_ShotstackImageToVideoOptions"\s*,?\s*\n?\s*\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(shotstackImageToVideoOptionsShotstackImageToVideoOptionsSchema\)/g,
    replacement:
      'shotstackImageToVideoOptionsShotstackImageToVideoOptionsSchema.extend({ type: z.literal("shotstackImageToVideoOptions_ShotstackImageToVideoOptions") }).strict()',
    name: "shotstackImageToVideoOptions",
  },
  // generatedAssetGeneratedAssetSchema - 6 provider members
  {
    pattern:
      /z\s*\n?\s*\.object\(\{\s*\n?\s*provider: z\.literal\("shotstackGeneratedAsset_ShotstackGeneratedAsset"\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(shotstackGeneratedAssetShotstackGeneratedAssetSchema\)/g,
    replacement:
      'shotstackGeneratedAssetShotstackGeneratedAssetSchema.extend({ provider: z.literal("shotstackGeneratedAsset_ShotstackGeneratedAsset") }).strict()',
    name: "generatedAsset-shotstack",
  },
  {
    pattern:
      /z\s*\n?\s*\.object\(\{\s*\n?\s*provider: z\.literal\("didGeneratedAsset_DIDGeneratedAsset"\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(didGeneratedAssetDidGeneratedAssetSchema\)/g,
    replacement:
      'didGeneratedAssetDidGeneratedAssetSchema.extend({ provider: z.literal("didGeneratedAsset_DIDGeneratedAsset") }).strict()',
    name: "generatedAsset-did",
  },
  {
    pattern:
      /z\s*\n?\s*\.object\(\{\s*\n?\s*provider: z\.literal\("elevenlabsGeneratedAsset_ElevenLabsGeneratedAsset"\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(elevenlabsGeneratedAssetElevenLabsGeneratedAssetSchema\)/g,
    replacement:
      'elevenlabsGeneratedAssetElevenLabsGeneratedAssetSchema.extend({ provider: z.literal("elevenlabsGeneratedAsset_ElevenLabsGeneratedAsset") }).strict()',
    name: "generatedAsset-elevenlabs",
  },
  {
    pattern:
      /z\s*\n?\s*\.object\(\{\s*\n?\s*provider: z\.literal\("heygenGeneratedAsset_HeyGenGeneratedAsset"\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(heygenGeneratedAssetHeyGenGeneratedAssetSchema\)/g,
    replacement:
      'heygenGeneratedAssetHeyGenGeneratedAssetSchema.extend({ provider: z.literal("heygenGeneratedAsset_HeyGenGeneratedAsset") }).strict()',
    name: "generatedAsset-heygen",
  },
  {
    pattern:
      /z\s*\n?\s*\.object\(\{\s*\n?\s*provider: z\.literal\("openaiGeneratedAsset_OpenAiGeneratedAsset"\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(openaiGeneratedAssetOpenAiGeneratedAssetSchema\)/g,
    replacement:
      'openaiGeneratedAssetOpenAiGeneratedAssetSchema.extend({ provider: z.literal("openaiGeneratedAsset_OpenAiGeneratedAsset") }).strict()',
    name: "generatedAsset-openai",
  },
  {
    pattern:
      /z\s*\n?\s*\.object\(\{\s*\n?\s*provider: z\.literal\(\s*\n?\s*"stabilityAiGeneratedAsset_StabilityAiGeneratedAsset"\s*,?\s*\n?\s*\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(stabilityAiGeneratedAssetStabilityAiGeneratedAssetSchema\)/g,
    replacement:
      'stabilityAiGeneratedAssetStabilityAiGeneratedAssetSchema.extend({ provider: z.literal("stabilityAiGeneratedAsset_StabilityAiGeneratedAsset") }).strict()',
    name: "generatedAsset-stabilityai",
  },
  // audioEnhancementAudioEnhancementSchema
  {
    pattern:
      /z\s*\n?\s*\.object\(\{\s*\n?\s*enhancement: z\.literal\("dolbyEnhancement_DolbyEnhancement"\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(dolbyEnhancementDolbyEnhancementSchema\)/g,
    replacement:
      'dolbyEnhancementDolbyEnhancementSchema.extend({ enhancement: z.literal("dolbyEnhancement_DolbyEnhancement") }).strict()',
    name: "audioEnhancement",
  },
];

let andTransformCount = 0;
andPatternTransforms.forEach(({ pattern, replacement, name }) => {
  if (pattern.test(content)) {
    content = content.replace(pattern, replacement);
    andTransformCount++;
    console.log(`✓ Transformed .and() to .extend().strict() for: ${name}`);
  }
});
console.log(`✓ Total .and() patterns transformed: ${andTransformCount}`);

// Step 2: Add .strict() to all standalone z.object() exports
let strictCount = 0;
const standaloneObjectPattern =
  /(export const \w+Schema\s*=\s*\n?\s*z\.object\(\{[\s\S]*?\}\))(\s*;)/g;

content = content.replace(
  standaloneObjectPattern,
  (match, objectPart, ending) => {
    if (
      objectPart.includes(".strict()") ||
      match.includes(".superRefine") ||
      match.includes(".and(")
    ) {
      return match;
    }
    strictCount++;
    return objectPart + ".strict()" + ending;
  },
);
console.log(`✓ Added .strict() to ${strictCount} standalone object schemas`);

// Step 3: Add .strict() to nested z.object() in z.optional() and z.array()
let nestedStrictCount = 0;

content = content.replace(
  /z\.optional\(z\.object\(\{([^}]+)\}\)\)/g,
  (match, inner) => {
    if (match.includes(".strict()")) return match;
    nestedStrictCount++;
    return `z.optional(z.object({${inner}}).strict())`;
  },
);

content = content.replace(
  /z\.array\(z\.object\(\{([^}]+)\}\)\)/g,
  (match, inner) => {
    if (match.includes(".strict()")) return match;
    nestedStrictCount++;
    return `z.array(z.object({${inner}}).strict())`;
  },
);
console.log(`✓ Added .strict() to ${nestedStrictCount} nested object schemas`);

// Step 4: Fix the MergeField schema to have .strict()
content = content.replace(
  /export const mergefieldMergeFieldSchema = z\.object\(\{\s*\n?\s*find: z\.string\(\),\s*\n?\s*replace: z\.union\(\[z\.string\(\), z\.number\(\), z\.boolean\(\), z\.null\(\), z\.record\(z\.string\(\), z\.unknown\(\)\), z\.array\(z\.unknown\(\)\)\]\),\s*\n?\s*\}\);/,
  `export const mergefieldMergeFieldSchema = z.object({
  find: z.string(),
  replace: z.union([z.string(), z.number(), z.boolean(), z.null(), z.record(z.string(), z.unknown()), z.array(z.unknown())]),
}).strict();`,
);
console.log("✓ Added .strict() to mergefieldMergeFieldSchema");

// ============================================================================
// TWEEN SCHEMA FIX: Make from/to required numbers instead of optional unknown
// ============================================================================
console.log("\n--- Fixing Tween Schema ---");

const tweenSchemaPattern =
  /export const tweenTweenSchema = z\.object\(\{\s*from: z\.optional\(z\.unknown\(\)\),\s*to: z\.optional\(z\.unknown\(\)\),/;

const tweenSchemaReplacement = `export const tweenTweenSchema = z.object({
  from: z.preprocess(((v: unknown) => { if (v === '' || v === null || v === undefined) return undefined; if (Array.isArray(v)) return v; if (typeof v === 'string') return Number(v); return v; }), z.number()),
  to: z.preprocess(((v: unknown) => { if (v === '' || v === null || v === undefined) return undefined; if (Array.isArray(v)) return v; if (typeof v === 'string') return Number(v); return v; }), z.number()),`;

if (tweenSchemaPattern.test(content)) {
  content = content.replace(tweenSchemaPattern, tweenSchemaReplacement);
  console.log("✓ Fixed tweenTweenSchema: made from/to required number fields");
} else {
  console.log("⚠ Could not find tweenTweenSchema to fix from/to fields");
}

// ============================================================================
// URL VALIDATION: Add pattern to reject javascript:, data:, file: schemes
// ============================================================================
console.log("\n--- Adding URL scheme validation ---");

// Pattern to validate safe URL schemes (http, https, or alias://)
const safeUrlPattern = `/^(https?:\\/\\/|alias:\\/\\/)/`;

// Find all src fields that use z.string() and add URL validation
// We need to be careful not to break existing patterns
const srcUrlFields = [
  // VideoAsset src
  {
    pattern: /(export const videoassetVideoAssetSchema = z\.object\(\{\s*type: z\.enum\(\["video"\]\),\s*src: )z\.string\(\)/,
    replacement: `$1z.string().regex(${safeUrlPattern}, "URL must use http://, https://, or alias:// scheme")`,
    name: "videoassetVideoAssetSchema.src"
  },
  // ImageAsset src
  {
    pattern: /(export const imageassetImageAssetSchema = z\.object\(\{\s*type: z\.enum\(\["image"\]\),\s*src: )z\.string\(\)/,
    replacement: `$1z.string().regex(${safeUrlPattern}, "URL must use http://, https://, or alias:// scheme")`,
    name: "imageassetImageAssetSchema.src"
  },
  // AudioAsset src
  {
    pattern: /(export const audioassetAudioAssetSchema = z\.object\(\{\s*type: z\.enum\(\["audio"\]\),\s*src: )z\.string\(\)/,
    replacement: `$1z.string().regex(${safeUrlPattern}, "URL must use http://, https://, or alias:// scheme")`,
    name: "audioassetAudioAssetSchema.src"
  },
  // LumaAsset src
  {
    pattern: /(export const lumaassetLumaAssetSchema = z\.object\(\{\s*type: z\.enum\(\["luma"\]\),\s*src: )z\.string\(\)/,
    replacement: `$1z.string().regex(${safeUrlPattern}, "URL must use http://, https://, or alias:// scheme")`,
    name: "lumaassetLumaAssetSchema.src"
  },
  // CaptionAsset src
  {
    pattern: /(export const captionassetCaptionAssetSchema = z\.object\(\{\s*type: z\.enum\(\["caption"\]\),\s*src: )z\.string\(\)/,
    replacement: `$1z.string().regex(${safeUrlPattern}, "URL must use http://, https://, or alias:// scheme")`,
    name: "captionassetCaptionAssetSchema.src"
  },
];

let urlFixCount = 0;
srcUrlFields.forEach(({ pattern, replacement, name }) => {
  if (pattern.test(content)) {
    content = content.replace(pattern, replacement);
    urlFixCount++;
    console.log(`✓ Added URL scheme validation to ${name}`);
  } else {
    console.log(`⚠ Could not find ${name} to add URL validation`);
  }
});
console.log(`✓ Total URL validations added: ${urlFixCount}`);

console.log("\n--- Strict mode transformations complete ---\n");

fs.writeFileSync(zodGenPath, content);

const zodGenCjsPath = path.join(__dirname, "..", "dist", "zod", "zod.gen.cjs");
if (fs.existsSync(zodGenCjsPath)) {
  let cjsContent = fs.readFileSync(zodGenCjsPath, "utf8");

  // Fix destination provider fields in CJS
  // Note: The generated code uses double quotes, so we match both single and double quotes
  const cjsDestinationProviderFixes = [
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
    cjsContent = cjsContent.replace(
      cjsDestinationsUnionPattern,
      newCjsDestinationsSchema,
    );
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
      newCjsSvgShapeSchema,
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
      newCjsSvgFillSchema,
    );
    console.log("✓ Fixed svgpropertiesSvgFillSchema discriminator in CJS");
  }

  // Coercion function for CJS (without TypeScript type annotation)
  // Note: Arrays are passed through unchanged to allow unions with array types (e.g., scale: number | Tween[])
  const cjsCoerceNumber = `((v) => { if (v === '' || v === null || v === undefined) return undefined; if (Array.isArray(v)) return v; if (typeof v === 'string') return Number(v); return v; })`;

  const cjsPlainNumberPattern = /zod_1\.z\.number\(\)(?!\.)/g;
  const cjsPlainNumberCount = (cjsContent.match(cjsPlainNumberPattern) || [])
    .length;
  if (cjsPlainNumberCount > 0) {
    cjsContent = cjsContent.replace(
      cjsPlainNumberPattern,
      `zod_1.z.preprocess(${cjsCoerceNumber}, zod_1.z.number())`,
    );
    console.log(
      `✓ Added number coercion in CJS (${cjsPlainNumberCount} occurrences)`,
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
      `✓ Added number coercion chains in CJS (${cjsChainedCount} occurrences)`,
    );
  }

  // ============================================================================
  // STRICT MODE FOR CJS: Add .strict() to all z.object() schemas
  // ============================================================================
  console.log("\n--- Adding strict mode to CJS object schemas ---");

  // Step 1: Transform .and() intersection patterns to .extend().strict() for CJS
  const cjsAndPatternTransforms = [
    {
      pattern:
        /zod_1\.z\s*\n?\s*\.object\(\{\s*\n?\s*type: zod_1\.z\.literal\(\s*\n?\s*"didTextToAvatarOptions_DIDTextToAvatarOptions"\s*,?\s*\n?\s*\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(exports\.didTextToAvatarOptionsDidTextToAvatarOptionsSchema\)/g,
      replacement:
        'exports.didTextToAvatarOptionsDidTextToAvatarOptionsSchema.extend({ type: zod_1.z.literal("didTextToAvatarOptions_DIDTextToAvatarOptions") }).strict()',
      name: "didGeneratedAssetOptions",
    },
    {
      pattern:
        /zod_1\.z\s*\n?\s*\.object\(\{\s*\n?\s*type: zod_1\.z\.literal\(\s*\n?\s*"elevenlabsTextToSpeechOptions_ElevenLabsTextToSpeechOptions"\s*,?\s*\n?\s*\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(exports\.elevenlabsTextToSpeechOptionsElevenLabsTextToSpeechOptionsSchema\)/g,
      replacement:
        'exports.elevenlabsTextToSpeechOptionsElevenLabsTextToSpeechOptionsSchema.extend({ type: zod_1.z.literal("elevenlabsTextToSpeechOptions_ElevenLabsTextToSpeechOptions") }).strict()',
      name: "elevenlabsGeneratedAssetOptions",
    },
    {
      pattern:
        /zod_1\.z\s*\n?\s*\.object\(\{\s*\n?\s*type: zod_1\.z\.literal\(\s*\n?\s*"heygenTextToAvatarOptions_HeyGenTextToAvatarOptions"\s*,?\s*\n?\s*\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(exports\.heygenTextToAvatarOptionsHeyGenTextToAvatarOptionsSchema\)/g,
      replacement:
        'exports.heygenTextToAvatarOptionsHeyGenTextToAvatarOptionsSchema.extend({ type: zod_1.z.literal("heygenTextToAvatarOptions_HeyGenTextToAvatarOptions") }).strict()',
      name: "heygenGeneratedAssetOptions",
    },
    {
      pattern:
        /zod_1\.z\s*\n?\s*\.object\(\{\s*\n?\s*type: zod_1\.z\.literal\(\s*\n?\s*"openaiTextGeneratorOptions_OpenAiTextGeneratorOptions"\s*,?\s*\n?\s*\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(exports\.openaiTextGeneratorOptionsOpenAiTextGeneratorOptionsSchema\)/g,
      replacement:
        'exports.openaiTextGeneratorOptionsOpenAiTextGeneratorOptionsSchema.extend({ type: zod_1.z.literal("openaiTextGeneratorOptions_OpenAiTextGeneratorOptions") }).strict()',
      name: "openaiGeneratedAssetOptions",
    },
    {
      pattern:
        /zod_1\.z\s*\n?\s*\.object\(\{\s*\n?\s*type: zod_1\.z\.literal\(\s*\n?\s*"stabilityAiTextToImageOptions_StabilityAiTextToImageOptions"\s*,?\s*\n?\s*\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(exports\.stabilityAiTextToImageOptionsStabilityAiTextToImageOptionsSchema\)/g,
      replacement:
        'exports.stabilityAiTextToImageOptionsStabilityAiTextToImageOptionsSchema.extend({ type: zod_1.z.literal("stabilityAiTextToImageOptions_StabilityAiTextToImageOptions") }).strict()',
      name: "stabilityAiGeneratedAssetOptions",
    },
    {
      pattern:
        /zod_1\.z\s*\n?\s*\.object\(\{\s*\n?\s*type: zod_1\.z\.literal\(\s*\n?\s*"shotstackTextToSpeechOptions_ShotstackTextToSpeechOptions"\s*,?\s*\n?\s*\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(exports\.shotstackTextToSpeechOptionsShotstackTextToSpeechOptionsSchema\)/g,
      replacement:
        'exports.shotstackTextToSpeechOptionsShotstackTextToSpeechOptionsSchema.extend({ type: zod_1.z.literal("shotstackTextToSpeechOptions_ShotstackTextToSpeechOptions") }).strict()',
      name: "shotstackTextToSpeechOptions",
    },
    {
      pattern:
        /zod_1\.z\s*\n?\s*\.object\(\{\s*\n?\s*type: zod_1\.z\.literal\(\s*\n?\s*"shotstackTextToImageOptions_ShotstackTextToImageOptions"\s*,?\s*\n?\s*\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(exports\.shotstackTextToImageOptionsShotstackTextToImageOptionsSchema\)/g,
      replacement:
        'exports.shotstackTextToImageOptionsShotstackTextToImageOptionsSchema.extend({ type: zod_1.z.literal("shotstackTextToImageOptions_ShotstackTextToImageOptions") }).strict()',
      name: "shotstackTextToImageOptions",
    },
    {
      pattern:
        /zod_1\.z\s*\n?\s*\.object\(\{\s*\n?\s*type: zod_1\.z\.literal\(\s*\n?\s*"shotstackTextGeneratorOptions_ShotstackTextGeneratorOptions"\s*,?\s*\n?\s*\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(exports\.shotstackTextGeneratorOptionsShotstackTextGeneratorOptionsSchema\)/g,
      replacement:
        'exports.shotstackTextGeneratorOptionsShotstackTextGeneratorOptionsSchema.extend({ type: zod_1.z.literal("shotstackTextGeneratorOptions_ShotstackTextGeneratorOptions") }).strict()',
      name: "shotstackTextGeneratorOptions",
    },
    {
      pattern:
        /zod_1\.z\s*\n?\s*\.object\(\{\s*\n?\s*type: zod_1\.z\.literal\(\s*\n?\s*"shotstackImageToVideoOptions_ShotstackImageToVideoOptions"\s*,?\s*\n?\s*\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(exports\.shotstackImageToVideoOptionsShotstackImageToVideoOptionsSchema\)/g,
      replacement:
        'exports.shotstackImageToVideoOptionsShotstackImageToVideoOptionsSchema.extend({ type: zod_1.z.literal("shotstackImageToVideoOptions_ShotstackImageToVideoOptions") }).strict()',
      name: "shotstackImageToVideoOptions",
    },
    {
      pattern:
        /zod_1\.z\s*\n?\s*\.object\(\{\s*\n?\s*provider: zod_1\.z\.literal\("shotstackGeneratedAsset_ShotstackGeneratedAsset"\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(exports\.shotstackGeneratedAssetShotstackGeneratedAssetSchema\)/g,
      replacement:
        'exports.shotstackGeneratedAssetShotstackGeneratedAssetSchema.extend({ provider: zod_1.z.literal("shotstackGeneratedAsset_ShotstackGeneratedAsset") }).strict()',
      name: "generatedAsset-shotstack",
    },
    {
      pattern:
        /zod_1\.z\s*\n?\s*\.object\(\{\s*\n?\s*provider: zod_1\.z\.literal\("didGeneratedAsset_DIDGeneratedAsset"\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(exports\.didGeneratedAssetDidGeneratedAssetSchema\)/g,
      replacement:
        'exports.didGeneratedAssetDidGeneratedAssetSchema.extend({ provider: zod_1.z.literal("didGeneratedAsset_DIDGeneratedAsset") }).strict()',
      name: "generatedAsset-did",
    },
    {
      pattern:
        /zod_1\.z\s*\n?\s*\.object\(\{\s*\n?\s*provider: zod_1\.z\.literal\("elevenlabsGeneratedAsset_ElevenLabsGeneratedAsset"\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(exports\.elevenlabsGeneratedAssetElevenLabsGeneratedAssetSchema\)/g,
      replacement:
        'exports.elevenlabsGeneratedAssetElevenLabsGeneratedAssetSchema.extend({ provider: zod_1.z.literal("elevenlabsGeneratedAsset_ElevenLabsGeneratedAsset") }).strict()',
      name: "generatedAsset-elevenlabs",
    },
    {
      pattern:
        /zod_1\.z\s*\n?\s*\.object\(\{\s*\n?\s*provider: zod_1\.z\.literal\("heygenGeneratedAsset_HeyGenGeneratedAsset"\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(exports\.heygenGeneratedAssetHeyGenGeneratedAssetSchema\)/g,
      replacement:
        'exports.heygenGeneratedAssetHeyGenGeneratedAssetSchema.extend({ provider: zod_1.z.literal("heygenGeneratedAsset_HeyGenGeneratedAsset") }).strict()',
      name: "generatedAsset-heygen",
    },
    {
      pattern:
        /zod_1\.z\s*\n?\s*\.object\(\{\s*\n?\s*provider: zod_1\.z\.literal\("openaiGeneratedAsset_OpenAiGeneratedAsset"\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(exports\.openaiGeneratedAssetOpenAiGeneratedAssetSchema\)/g,
      replacement:
        'exports.openaiGeneratedAssetOpenAiGeneratedAssetSchema.extend({ provider: zod_1.z.literal("openaiGeneratedAsset_OpenAiGeneratedAsset") }).strict()',
      name: "generatedAsset-openai",
    },
    {
      pattern:
        /zod_1\.z\s*\n?\s*\.object\(\{\s*\n?\s*provider: zod_1\.z\.literal\(\s*\n?\s*"stabilityAiGeneratedAsset_StabilityAiGeneratedAsset"\s*,?\s*\n?\s*\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(exports\.stabilityAiGeneratedAssetStabilityAiGeneratedAssetSchema\)/g,
      replacement:
        'exports.stabilityAiGeneratedAssetStabilityAiGeneratedAssetSchema.extend({ provider: zod_1.z.literal("stabilityAiGeneratedAsset_StabilityAiGeneratedAsset") }).strict()',
      name: "generatedAsset-stabilityai",
    },
    {
      pattern:
        /zod_1\.z\s*\n?\s*\.object\(\{\s*\n?\s*enhancement: zod_1\.z\.literal\("dolbyEnhancement_DolbyEnhancement"\)\s*,?\s*\n?\s*\}\)\s*\n?\s*\.and\(exports\.dolbyEnhancementDolbyEnhancementSchema\)/g,
      replacement:
        'exports.dolbyEnhancementDolbyEnhancementSchema.extend({ enhancement: zod_1.z.literal("dolbyEnhancement_DolbyEnhancement") }).strict()',
      name: "audioEnhancement",
    },
  ];

  let cjsAndTransformCount = 0;
  cjsAndPatternTransforms.forEach(({ pattern, replacement, name }) => {
    if (pattern.test(cjsContent)) {
      cjsContent = cjsContent.replace(pattern, replacement);
      cjsAndTransformCount++;
      console.log(`✓ CJS: Transformed .and() for: ${name}`);
    }
  });
  console.log(
    `✓ CJS: Total .and() patterns transformed: ${cjsAndTransformCount}`,
  );

  // Step 2: Add .strict() to all standalone exports.xxxSchema = zod_1.z.object()
  let cjsStrictCount = 0;
  const cjsStandaloneObjectPattern =
    /(exports\.\w+Schema\s*=\s*\n?\s*zod_1\.z\.object\(\{[\s\S]*?\}\))(\s*;)/g;

  cjsContent = cjsContent.replace(
    cjsStandaloneObjectPattern,
    (match, objectPart, ending) => {
      if (
        objectPart.includes(".strict()") ||
        match.includes(".superRefine") ||
        match.includes(".and(")
      ) {
        return match;
      }
      cjsStrictCount++;
      return objectPart + ".strict()" + ending;
    },
  );
  console.log(
    `✓ CJS: Added .strict() to ${cjsStrictCount} standalone object schemas`,
  );

  // Step 3: Add .strict() to nested zod_1.z.object() in optional/array
  let cjsNestedStrictCount = 0;

  cjsContent = cjsContent.replace(
    /zod_1\.z\.optional\(zod_1\.z\.object\(\{([^}]+)\}\)\)/g,
    (match, inner) => {
      if (match.includes(".strict()")) return match;
      cjsNestedStrictCount++;
      return `zod_1.z.optional(zod_1.z.object({${inner}}).strict())`;
    },
  );

  cjsContent = cjsContent.replace(
    /zod_1\.z\.array\(zod_1\.z\.object\(\{([^}]+)\}\)\)/g,
    (match, inner) => {
      if (match.includes(".strict()")) return match;
      cjsNestedStrictCount++;
      return `zod_1.z.array(zod_1.z.object({${inner}}).strict())`;
    },
  );
  console.log(
    `✓ CJS: Added .strict() to ${cjsNestedStrictCount} nested object schemas`,
  );

  // ============================================================================
  // CJS TWEEN SCHEMA FIX: Make from/to required numbers
  // ============================================================================
  console.log("\n--- CJS: Fixing Tween Schema ---");

  const cjsTweenSchemaPattern =
    /exports\.tweenTweenSchema = zod_1\.z\.object\(\{\s*from: zod_1\.z\.optional\(zod_1\.z\.unknown\(\)\),\s*to: zod_1\.z\.optional\(zod_1\.z\.unknown\(\)\),/;

  const cjsTweenSchemaReplacement = `exports.tweenTweenSchema = zod_1.z.object({
    from: zod_1.z.preprocess(((v) => { if (v === '' || v === null || v === undefined) return undefined; if (Array.isArray(v)) return v; if (typeof v === 'string') return Number(v); return v; }), zod_1.z.number()),
    to: zod_1.z.preprocess(((v) => { if (v === '' || v === null || v === undefined) return undefined; if (Array.isArray(v)) return v; if (typeof v === 'string') return Number(v); return v; }), zod_1.z.number()),`;

  if (cjsTweenSchemaPattern.test(cjsContent)) {
    cjsContent = cjsContent.replace(cjsTweenSchemaPattern, cjsTweenSchemaReplacement);
    console.log("✓ CJS: Fixed tweenTweenSchema: made from/to required number fields");
  } else {
    console.log("⚠ CJS: Could not find tweenTweenSchema to fix from/to fields");
  }

  // ============================================================================
  // CJS URL VALIDATION: Add pattern to reject javascript:, data:, file: schemes
  // ============================================================================
  console.log("\n--- CJS: Adding URL scheme validation ---");

  const cjsSafeUrlPattern = `/^(https?:\\/\\/|alias:\\/\\/)/`;

  const cjsSrcUrlFields = [
    // VideoAsset src
    {
      pattern: /(exports\.videoassetVideoAssetSchema = zod_1\.z\.object\(\{\s*type: zod_1\.z\.enum\(\["video"\]\),\s*src: )zod_1\.z\.string\(\)/,
      replacement: `$1zod_1.z.string().regex(${cjsSafeUrlPattern}, "URL must use http://, https://, or alias:// scheme")`,
      name: "videoassetVideoAssetSchema.src"
    },
    // ImageAsset src
    {
      pattern: /(exports\.imageassetImageAssetSchema = zod_1\.z\.object\(\{\s*type: zod_1\.z\.enum\(\["image"\]\),\s*src: )zod_1\.z\.string\(\)/,
      replacement: `$1zod_1.z.string().regex(${cjsSafeUrlPattern}, "URL must use http://, https://, or alias:// scheme")`,
      name: "imageassetImageAssetSchema.src"
    },
    // AudioAsset src
    {
      pattern: /(exports\.audioassetAudioAssetSchema = zod_1\.z\.object\(\{\s*type: zod_1\.z\.enum\(\["audio"\]\),\s*src: )zod_1\.z\.string\(\)/,
      replacement: `$1zod_1.z.string().regex(${cjsSafeUrlPattern}, "URL must use http://, https://, or alias:// scheme")`,
      name: "audioassetAudioAssetSchema.src"
    },
    // LumaAsset src
    {
      pattern: /(exports\.lumaassetLumaAssetSchema = zod_1\.z\.object\(\{\s*type: zod_1\.z\.enum\(\["luma"\]\),\s*src: )zod_1\.z\.string\(\)/,
      replacement: `$1zod_1.z.string().regex(${cjsSafeUrlPattern}, "URL must use http://, https://, or alias:// scheme")`,
      name: "lumaassetLumaAssetSchema.src"
    },
    // CaptionAsset src
    {
      pattern: /(exports\.captionassetCaptionAssetSchema = zod_1\.z\.object\(\{\s*type: zod_1\.z\.enum\(\["caption"\]\),\s*src: )zod_1\.z\.string\(\)/,
      replacement: `$1zod_1.z.string().regex(${cjsSafeUrlPattern}, "URL must use http://, https://, or alias:// scheme")`,
      name: "captionassetCaptionAssetSchema.src"
    },
  ];

  let cjsUrlFixCount = 0;
  cjsSrcUrlFields.forEach(({ pattern, replacement, name }) => {
    if (pattern.test(cjsContent)) {
      cjsContent = cjsContent.replace(pattern, replacement);
      cjsUrlFixCount++;
      console.log(`✓ CJS: Added URL scheme validation to ${name}`);
    } else {
      console.log(`⚠ CJS: Could not find ${name} to add URL validation`);
    }
  });
  console.log(`✓ CJS: Total URL validations added: ${cjsUrlFixCount}`);

  console.log("--- CJS strict mode transformations complete ---\n");

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
    jsContent = jsContent.replace(
      destinationsUnionPattern,
      newDestinationsSchema,
    );
    console.log(
      "✓ Fixed destinationsDestinationsSchema discriminator in ESM JS",
    );
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

  // NOTE: svgassetSvgAssetSchema superRefine is NOT added here for ESM JS because:
  // 1. The TypeScript file already has the superRefine
  // 2. When compiled to ESM JS, it already contains the superRefine code
  // 3. Adding it again would create duplicate code
  // The superRefine is applied in the TypeScript section (line ~119-162)

  // Coercion function for ESM JS (without TypeScript type annotation)
  // Note: Arrays are passed through unchanged to allow unions with array types (e.g., scale: number | Tween[])
  const esmCoerceNumber = `((v) => { if (v === '' || v === null || v === undefined) return undefined; if (Array.isArray(v)) return v; if (typeof v === 'string') return Number(v); return v; })`;

  const esmPlainNumberPattern = /z\.number\(\)(?!\.)/g;
  const esmPlainNumberCount = (jsContent.match(esmPlainNumberPattern) || [])
    .length;
  if (esmPlainNumberCount > 0) {
    jsContent = jsContent.replace(
      esmPlainNumberPattern,
      `z.preprocess(${esmCoerceNumber}, z.number())`,
    );
    console.log(
      `✓ Added number coercion in ESM JS (${esmPlainNumberCount} occurrences)`,
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
      `✓ Added number coercion chains in ESM JS (${esmChainedCount} occurrences)`,
    );
  }

  // ============================================================================
  // STRICT MODE FOR ESM JS: Add .strict() to all z.object() schemas
  // ============================================================================
  console.log("\n--- Adding strict mode to ESM JS object schemas ---");

  // Step 1: Transform .and() intersection patterns (same as TS since ESM JS uses same syntax)
  let esmAndTransformCount = 0;
  andPatternTransforms.forEach(({ pattern, replacement, name }) => {
    if (pattern.test(jsContent)) {
      jsContent = jsContent.replace(pattern, replacement);
      esmAndTransformCount++;
      console.log(`✓ ESM JS: Transformed .and() for: ${name}`);
    }
  });
  console.log(
    `✓ ESM JS: Total .and() patterns transformed: ${esmAndTransformCount}`,
  );

  // Step 2: Add .strict() to all standalone object schemas
  let esmStrictCount = 0;
  jsContent = jsContent.replace(
    standaloneObjectPattern,
    (match, objectPart, ending) => {
      if (
        objectPart.includes(".strict()") ||
        match.includes(".superRefine") ||
        match.includes(".and(")
      ) {
        return match;
      }
      esmStrictCount++;
      return objectPart + ".strict()" + ending;
    },
  );
  console.log(
    `✓ ESM JS: Added .strict() to ${esmStrictCount} standalone object schemas`,
  );

  // Step 3: Add .strict() to nested z.object() in optional/array
  let esmNestedStrictCount = 0;

  jsContent = jsContent.replace(
    /z\.optional\(z\.object\(\{([^}]+)\}\)\)/g,
    (match, inner) => {
      if (match.includes(".strict()")) return match;
      esmNestedStrictCount++;
      return `z.optional(z.object({${inner}}).strict())`;
    },
  );

  jsContent = jsContent.replace(
    /z\.array\(z\.object\(\{([^}]+)\}\)\)/g,
    (match, inner) => {
      if (match.includes(".strict()")) return match;
      esmNestedStrictCount++;
      return `z.array(z.object({${inner}}).strict())`;
    },
  );
  console.log(
    `✓ ESM JS: Added .strict() to ${esmNestedStrictCount} nested object schemas`,
  );

  // ============================================================================
  // ESM JS TWEEN SCHEMA FIX: Make from/to required numbers
  // ============================================================================
  console.log("\n--- ESM JS: Fixing Tween Schema ---");

  // ESM uses the same syntax as TypeScript (without type annotations)
  const esmTweenSchemaPattern =
    /export const tweenTweenSchema = z\.object\(\{\s*from: z\.optional\(z\.unknown\(\)\),\s*to: z\.optional\(z\.unknown\(\)\),/;

  const esmTweenSchemaReplacement = `export const tweenTweenSchema = z.object({
  from: z.preprocess(((v) => { if (v === '' || v === null || v === undefined) return undefined; if (Array.isArray(v)) return v; if (typeof v === 'string') return Number(v); return v; }), z.number()),
  to: z.preprocess(((v) => { if (v === '' || v === null || v === undefined) return undefined; if (Array.isArray(v)) return v; if (typeof v === 'string') return Number(v); return v; }), z.number()),`;

  if (esmTweenSchemaPattern.test(jsContent)) {
    jsContent = jsContent.replace(esmTweenSchemaPattern, esmTweenSchemaReplacement);
    console.log("✓ ESM JS: Fixed tweenTweenSchema: made from/to required number fields");
  } else {
    console.log("⚠ ESM JS: Could not find tweenTweenSchema to fix from/to fields");
  }

  // ============================================================================
  // ESM JS URL VALIDATION: Add pattern to reject javascript:, data:, file: schemes
  // ============================================================================
  console.log("\n--- ESM JS: Adding URL scheme validation ---");

  const esmSafeUrlPattern = `/^(https?:\\/\\/|alias:\\/\\/)/`;

  const esmSrcUrlFields = [
    // VideoAsset src
    {
      pattern: /(export const videoassetVideoAssetSchema = z\.object\(\{\s*type: z\.enum\(\["video"\]\),\s*src: )z\.string\(\)/,
      replacement: `$1z.string().regex(${esmSafeUrlPattern}, "URL must use http://, https://, or alias:// scheme")`,
      name: "videoassetVideoAssetSchema.src"
    },
    // ImageAsset src
    {
      pattern: /(export const imageassetImageAssetSchema = z\.object\(\{\s*type: z\.enum\(\["image"\]\),\s*src: )z\.string\(\)/,
      replacement: `$1z.string().regex(${esmSafeUrlPattern}, "URL must use http://, https://, or alias:// scheme")`,
      name: "imageassetImageAssetSchema.src"
    },
    // AudioAsset src
    {
      pattern: /(export const audioassetAudioAssetSchema = z\.object\(\{\s*type: z\.enum\(\["audio"\]\),\s*src: )z\.string\(\)/,
      replacement: `$1z.string().regex(${esmSafeUrlPattern}, "URL must use http://, https://, or alias:// scheme")`,
      name: "audioassetAudioAssetSchema.src"
    },
    // LumaAsset src
    {
      pattern: /(export const lumaassetLumaAssetSchema = z\.object\(\{\s*type: z\.enum\(\["luma"\]\),\s*src: )z\.string\(\)/,
      replacement: `$1z.string().regex(${esmSafeUrlPattern}, "URL must use http://, https://, or alias:// scheme")`,
      name: "lumaassetLumaAssetSchema.src"
    },
    // CaptionAsset src
    {
      pattern: /(export const captionassetCaptionAssetSchema = z\.object\(\{\s*type: z\.enum\(\["caption"\]\),\s*src: )z\.string\(\)/,
      replacement: `$1z.string().regex(${esmSafeUrlPattern}, "URL must use http://, https://, or alias:// scheme")`,
      name: "captionassetCaptionAssetSchema.src"
    },
  ];

  let esmUrlFixCount = 0;
  esmSrcUrlFields.forEach(({ pattern, replacement, name }) => {
    if (pattern.test(jsContent)) {
      jsContent = jsContent.replace(pattern, replacement);
      esmUrlFixCount++;
      console.log(`✓ ESM JS: Added URL scheme validation to ${name}`);
    } else {
      console.log(`⚠ ESM JS: Could not find ${name} to add URL validation`);
    }
  });
  console.log(`✓ ESM JS: Total URL validations added: ${esmUrlFixCount}`);

  console.log("--- ESM JS strict mode transformations complete ---\n");

  fs.writeFileSync(zodGenJsPath, jsContent);
}

console.log("Done!");
