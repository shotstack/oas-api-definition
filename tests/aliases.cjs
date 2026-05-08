"use strict";

const {
  clipClipSchema,
  rangeRangeSchema,
  tweenTweenSchema,
  renditionRenditionSchema,
  assetAssetSchema,
  textpropertiesTextFontSchema,
  richtextpropertiesRichTextFontSchema,
  captionpropertiesCaptionFontSchema,
  richcaptionpropertiesRichCaptionFontSchema,
  richtextpropertiesRichTextAlignmentSchema,
  richtextpropertiesRichTextShadowSchema,
  richtextpropertiesRichTextBorderSchema,
  richtextpropertiesRichTextGradientStopSchema,
} = require("../dist/zod/zod.gen.cjs");

let passed = 0;
let failed = 0;

function ok(label, actual, expected) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    console.log(`    ok  ${label}`);
    passed++;
    return true;
  }
  console.log(`  FAIL  ${label}`);
  console.log(`        expected: ${JSON.stringify(expected)}`);
  console.log(`        got:      ${JSON.stringify(actual)}`);
  failed++;
  return false;
}

function passes(label, schema, input) {
  const r = schema.safeParse(input);
  if (r.success) {
    console.log(`  PASS  ${label}`);
    passed++;
    return r.data;
  }
  console.log(`  FAIL  ${label} — expected success`);
  console.log(
    `        issues: ${r.error.issues.map((i) => `[${i.path.join(".")}] ${i.message}`).join(", ")}`,
  );
  failed++;
  return null;
}

function rejects(label, schema, input) {
  const r = schema.safeParse(input);
  if (!r.success) {
    console.log(`  PASS  ${label}`);
    passed++;
  } else {
    console.log(`  FAIL  ${label} — expected failure`);
    console.log(`        output: ${JSON.stringify(r.data)}`);
    failed++;
  }
}

const BASE_CLIP = {
  asset: { type: "video", src: "https://example.com/v.mp4" },
  start: 0,
  length: 5,
};

console.log("\n── Clip.fit aliases ──");
{
  const d = passes(
    "cover  (canonical) unchanged — backward compat",
    clipClipSchema,
    { ...BASE_CLIP, fit: "cover" },
  );
  if (d) ok("fit === 'cover'", d.fit, "cover");
}
{
  const d = passes(
    "fill   (CSS) accepted → normalises to cover",
    clipClipSchema,
    { ...BASE_CLIP, fit: "fill" },
  );
  if (d) ok("fit === 'cover'", d.fit, "cover");
}
{
  const d = passes("crop   (canonical) unchanged", clipClipSchema, {
    ...BASE_CLIP,
    fit: "crop",
  });
  if (d) ok("fit === 'crop'", d.fit, "crop");
}
{
  const d = passes("contain (canonical) unchanged", clipClipSchema, {
    ...BASE_CLIP,
    fit: "contain",
  });
  if (d) ok("fit === 'contain'", d.fit, "contain");
}
rejects("invalid fit rejected", clipClipSchema, {
  ...BASE_CLIP,
  fit: "stretch",
});

console.log("\n── Rendition.fit aliases ──");
{
  const d = passes("cover canonical unchanged — backward compat", renditionRenditionSchema, {
    format: "mp4",
    fit: "cover",
  });
  if (d) ok("fit === 'cover'", d.fit, "cover");
}
{
  const d = passes("fill → cover", renditionRenditionSchema, {
    format: "mp4",
    fit: "fill",
  });
  if (d) ok("fit === 'cover'", d.fit, "cover");
}
{
  const d = passes("crop canonical", renditionRenditionSchema, {
    format: "mp4",
    fit: "crop",
  });
  if (d) ok("fit === 'crop'", d.fit, "crop");
}
rejects("invalid fit rejected on Rendition", renditionRenditionSchema, {
  format: "mp4",
  fit: "stretch",
});

console.log("\n── Clip.position kebab aliases ──");
for (const [alias, canonical] of [
  ["top-right", "topRight"],
  ["top-left", "topLeft"],
  ["bottom-right", "bottomRight"],
  ["bottom-left", "bottomLeft"],
]) {
  const d = passes(`${alias} → ${canonical}`, clipClipSchema, {
    ...BASE_CLIP,
    position: alias,
  });
  if (d) ok(`position === '${canonical}'`, d.position, canonical);
}
{
  const d = passes("topRight canonical unchanged", clipClipSchema, {
    ...BASE_CLIP,
    position: "topRight",
  });
  if (d) ok("position === 'topRight'", d.position, "topRight");
}
{
  const d = passes("center canonical unchanged", clipClipSchema, {
    ...BASE_CLIP,
    position: "center",
  });
  if (d) ok("position === 'center'", d.position, "center");
}
rejects("invalid position rejected", clipClipSchema, {
  ...BASE_CLIP,
  position: "middle",
});

console.log("\n── HtmlAsset.position kebab aliases ──");
const BASE_HTML = { type: "html", html: "<p>Hi</p>" };
for (const [alias, canonical] of [
  ["top-right", "topRight"],
  ["top-left", "topLeft"],
  ["bottom-right", "bottomRight"],
  ["bottom-left", "bottomLeft"],
]) {
  const d = passes(`${alias} → ${canonical}`, assetAssetSchema, {
    ...BASE_HTML,
    position: alias,
  });
  if (d) ok(`position === '${canonical}'`, d.position, canonical);
}
rejects("invalid position rejected on HtmlAsset", assetAssetSchema, {
  ...BASE_HTML,
  position: "middle",
});

console.log("\n── TitleAsset.position kebab aliases ──");
const BASE_TITLE = { type: "title", text: "Hello" };
for (const [alias, canonical] of [
  ["top-right", "topRight"],
  ["top-left", "topLeft"],
  ["bottom-right", "bottomRight"],
  ["bottom-left", "bottomLeft"],
]) {
  const d = passes(`${alias} → ${canonical}`, assetAssetSchema, {
    ...BASE_TITLE,
    position: alias,
  });
  if (d) ok(`position === '${canonical}'`, d.position, canonical);
}
rejects("invalid position rejected on TitleAsset", assetAssetSchema, {
  ...BASE_TITLE,
  position: "middle",
});

console.log("\n── RichTextAlignment.vertical center alias ──");
{
  const d = passes(
    "center → middle",
    richtextpropertiesRichTextAlignmentSchema,
    { horizontal: "left", vertical: "center" },
  );
  if (d) ok("vertical === 'middle'", d.vertical, "middle");
}
{
  const d = passes(
    "middle canonical unchanged",
    richtextpropertiesRichTextAlignmentSchema,
    { horizontal: "left", vertical: "middle" },
  );
  if (d) ok("vertical === 'middle'", d.vertical, "middle");
}
rejects(
  "invalid vertical rejected",
  richtextpropertiesRichTextAlignmentSchema,
  { horizontal: "left", vertical: "baseline" },
);

console.log("\n── RichTextAsset.alignment alias ──");
const BASE_RT = { type: "rich-text", text: "Hello" };
{
  const d = passes(
    "alignment alias accepted",
    assetAssetSchema,
    { ...BASE_RT, alignment: { horizontal: "center", vertical: "top" } },
  );
  if (d) {
    ok(
      "align.horizontal === 'center'",
      d.align && d.align.horizontal,
      "center",
    );
    ok("no 'alignment' key in output", "alignment" in d, false);
  }
}
{
  const d = passes(
    "align canonical still works",
    assetAssetSchema,
    { ...BASE_RT, align: { horizontal: "right", vertical: "bottom" } },
  );
  if (d)
    ok("align.horizontal === 'right'", d.align && d.align.horizontal, "right");
}
{
  const d = passes(
    "align wins when both sent",
    assetAssetSchema,
    {
      ...BASE_RT,
      align: { horizontal: "left", vertical: "top" },
      alignment: { horizontal: "right", vertical: "bottom" },
    },
  );
  if (d)
    ok(
      "align.horizontal === 'left' (canonical wins)",
      d.align && d.align.horizontal,
      "left",
    );
}

console.log("\n── RichCaptionAsset.alignment alias ──");
{
  const d = passes(
    "alignment alias on RichCaptionAsset",
    assetAssetSchema,
    {
      type: "rich-caption",
      src: "https://example.com/v.mp4",
      alignment: { horizontal: "center", vertical: "top" },
    },
  );
  if (d) {
    ok("align set from alignment", d.align && d.align.horizontal, "center");
    ok("no 'alignment' key in output", "alignment" in d, false);
  }
}

console.log("\n── Clip.duration alias ──");
{
  const input = {
    asset: { type: "video", src: "https://example.com/v.mp4" },
    start: 0,
    duration: 7,
  };
  const d = passes("duration alone (no length)", clipClipSchema, input);
  if (d) {
    ok("length === 7", d.length, 7);
    ok("no 'duration' key", "duration" in d, false);
  }
}
{
  const d = passes("length alone still works", clipClipSchema, BASE_CLIP);
  if (d) ok("length === 5", d.length, 5);
}
{
  const d = passes(
    "canonical wins: length=3 beats duration=9",
    clipClipSchema,
    { ...BASE_CLIP, length: 3, duration: 9 },
  );
  if (d) ok("length === 3", d.length, 3);
}
rejects("neither length nor duration → rejected", clipClipSchema, {
  asset: { type: "video", src: "https://example.com/v.mp4" },
  start: 0,
});

console.log("\n── Range.duration alias ──");
{
  const d = passes("duration alone", rangeRangeSchema, { duration: 6 });
  if (d) ok("length === 6", d.length, 6);
}
{
  const d = passes("length canonical", rangeRangeSchema, { length: 6 });
  if (d) ok("length === 6", d.length, 6);
}
{
  const d = passes("canonical wins", rangeRangeSchema, {
    length: 2,
    duration: 9,
  });
  if (d) ok("length === 2", d.length, 2);
}

console.log("\n── Tween.duration alias ──");
{
  const d = passes("duration alone", tweenTweenSchema, { duration: 3 });
  if (d) ok("length === 3", d.length, 3);
}
{
  const d = passes("length canonical", tweenTweenSchema, { length: 3 });
  if (d) ok("length === 3", d.length, 3);
}

console.log("\n── TextFont aliases ──");
{
  const d = passes("fontFamily → family", textpropertiesTextFontSchema, {
    fontFamily: "Roboto",
  });
  if (d) {
    ok("family === 'Roboto'", d.family, "Roboto");
    ok("no fontFamily key", "fontFamily" in d, false);
  }
}
{
  const d = passes("name → family", textpropertiesTextFontSchema, {
    name: "Roboto",
  });
  if (d) ok("family === 'Roboto'", d.family, "Roboto");
}
{
  const d = passes(
    "canonical wins: family beats fontFamily",
    textpropertiesTextFontSchema,
    { family: "Open Sans", fontFamily: "Roboto" },
  );
  if (d) ok("family === 'Open Sans'", d.family, "Open Sans");
}
{
  const d = passes("fontSize → size", textpropertiesTextFontSchema, {
    family: "Roboto",
    fontSize: 18,
  });
  if (d) {
    ok("size === 18", d.size, 18);
    ok("no fontSize key", "fontSize" in d, false);
  }
}
{
  const d = passes("fontWeight → weight", textpropertiesTextFontSchema, {
    family: "Roboto",
    fontWeight: 700,
  });
  if (d) {
    ok("weight === 700", d.weight, 700);
    ok("no fontWeight key", "fontWeight" in d, false);
  }
}
rejects("unknown field rejected", textpropertiesTextFontSchema, {
  fonFamily: "Roboto",
});

console.log("\n── RichTextFont aliases (with defaults) ──");
{
  const d = passes(
    "fontFamily → family (preprocess beats default)",
    richtextpropertiesRichTextFontSchema,
    { fontFamily: "Roboto" },
  );
  if (d) {
    ok("family === 'Roboto'", d.family, "Roboto");
    ok("no fontFamily key", "fontFamily" in d, false);
  }
}
{
  const d = passes("name → family", richtextpropertiesRichTextFontSchema, {
    name: "Roboto",
  });
  if (d) ok("family === 'Roboto'", d.family, "Roboto");
}
{
  const d = passes(
    "canonical family wins over alias",
    richtextpropertiesRichTextFontSchema,
    { family: "Open Sans", fontFamily: "Roboto" },
  );
  if (d) ok("family === 'Open Sans'", d.family, "Open Sans");
}
{
  const d = passes(
    "fontSize → size (preprocess beats default)",
    richtextpropertiesRichTextFontSchema,
    { fontSize: 36 },
  );
  if (d) {
    ok("size === 36", d.size, 36);
    ok("no fontSize key", "fontSize" in d, false);
  }
}
{
  const d = passes(
    "fontWeight → weight (preprocess beats default)",
    richtextpropertiesRichTextFontSchema,
    { fontWeight: 700 },
  );
  if (d) {
    ok("weight === 700", d.weight, 700);
    ok("no fontWeight key", "fontWeight" in d, false);
  }
}

console.log("\n── CaptionFont aliases ──");
{
  const d = passes("fontFamily → family", captionpropertiesCaptionFontSchema, {
    fontFamily: "Roboto",
  });
  if (d) {
    ok("family === 'Roboto'", d.family, "Roboto");
    ok("no fontFamily key", "fontFamily" in d, false);
  }
}
{
  const d = passes("name → family", captionpropertiesCaptionFontSchema, {
    name: "Roboto",
  });
  if (d) ok("family === 'Roboto'", d.family, "Roboto");
}
{
  const d = passes("fontSize → size", captionpropertiesCaptionFontSchema, {
    fontSize: 24,
  });
  if (d) {
    ok("size === 24", d.size, 24);
    ok("no fontSize key", "fontSize" in d, false);
  }
}
rejects(
  "fontWeight rejected (no weight field in CaptionFont)",
  captionpropertiesCaptionFontSchema,
  { fontWeight: 700 },
);

console.log("\n── RichCaptionFont aliases (with defaults) ──");
{
  const d = passes(
    "fontFamily → family",
    richcaptionpropertiesRichCaptionFontSchema,
    { fontFamily: "Roboto" },
  );
  if (d) {
    ok("family === 'Roboto'", d.family, "Roboto");
    ok("no fontFamily key", "fontFamily" in d, false);
  }
}
{
  const d = passes(
    "name → family",
    richcaptionpropertiesRichCaptionFontSchema,
    { name: "Roboto" },
  );
  if (d) ok("family === 'Roboto'", d.family, "Roboto");
}
{
  const d = passes(
    "fontSize → size",
    richcaptionpropertiesRichCaptionFontSchema,
    { fontSize: 36 },
  );
  if (d) {
    ok("size === 36", d.size, 36);
    ok("no fontSize key", "fontSize" in d, false);
  }
}
{
  const d = passes(
    "fontWeight → weight (preprocess beats default)",
    richcaptionpropertiesRichCaptionFontSchema,
    { fontWeight: 700 },
  );
  if (d) {
    ok("weight === 700", d.weight, 700);
    ok("no fontWeight key", "fontWeight" in d, false);
  }
}

console.log("\n── RichTextShadow x/y aliases (with default:0) ──");
{
  const d = passes(
    "x → offsetX (beats default 0)",
    richtextpropertiesRichTextShadowSchema,
    { x: 4 },
  );
  if (d) {
    ok("offsetX === 4", d.offsetX, 4);
    ok("no x key", "x" in d, false);
  }
}
{
  const d = passes(
    "y → offsetY (beats default 0)",
    richtextpropertiesRichTextShadowSchema,
    { y: 4 },
  );
  if (d) {
    ok("offsetY === 4", d.offsetY, 4);
    ok("no y key", "y" in d, false);
  }
}
{
  const d = passes(
    "canonical wins: offsetX=5 beats x=2",
    richtextpropertiesRichTextShadowSchema,
    { offsetX: 5, x: 2 },
  );
  if (d) ok("offsetX === 5", d.offsetX, 5);
}
{
  const d = passes(
    "offsetX=0 explicit (not alias)",
    richtextpropertiesRichTextShadowSchema,
    { offsetX: 0 },
  );
  if (d) ok("offsetX === 0", d.offsetX, 0);
}

console.log("\n── RichTextBorder.borderRadius alias (with default:0) ──");
{
  const d = passes(
    "borderRadius → radius (beats default 0)",
    richtextpropertiesRichTextBorderSchema,
    { borderRadius: 10 },
  );
  if (d) {
    ok("radius === 10", d.radius, 10);
    ok("no borderRadius key", "borderRadius" in d, false);
  }
}
{
  const d = passes(
    "canonical radius wins",
    richtextpropertiesRichTextBorderSchema,
    { radius: 5, borderRadius: 10 },
  );
  if (d) ok("radius === 5", d.radius, 5);
}

console.log("\n── RichTextGradientStop.position alias ──");
{
  const d = passes(
    "position → offset",
    richtextpropertiesRichTextGradientStopSchema,
    { position: 0.5, color: "#ff0000" },
  );
  if (d) {
    ok("offset === 0.5", d.offset, 0.5);
    ok("no position key", "position" in d, false);
  }
}
{
  const d = passes(
    "canonical offset wins",
    richtextpropertiesRichTextGradientStopSchema,
    { offset: 0.2, position: 0.8, color: "#ff0000" },
  );
  if (d) ok("offset === 0.2", d.offset, 0.2);
}

console.log("\n── Unknown fields rejected ──");
rejects("'colour' on clip rejected", clipClipSchema, {
  ...BASE_CLIP,
  colour: "red",
});
rejects("'fonFamily' on TextFont", textpropertiesTextFontSchema, {
  fonFamily: "Roboto",
});
rejects("'offsetz' on shadow", richtextpropertiesRichTextShadowSchema, {
  offsetz: 1,
});
rejects(
  "'grad' on gradient stop",
  richtextpropertiesRichTextGradientStopSchema,
  { grad: 0.5, color: "#ff0000" },
);

console.log(`\n${"═".repeat(50)}`);
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log("═".repeat(50) + "\n");
if (failed > 0) process.exit(1);
