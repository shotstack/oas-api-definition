const { editSchema } = require("../dist/zod/zod.gen.cjs");

// Test tracking
let passCount = 0;
let failCount = 0;
const failures = [];

function test(description, fn) {
  try {
    fn();
    passCount++;
    console.log(`  ✓ ${description}`);
  } catch (error) {
    failCount++;
    failures.push({ description, error: error.message });
    console.log(`  ✗ ${description}`);
    console.log(`    Error: ${error.message}`);
  }
}

function expectValid(schema, data, description) {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `Expected valid but got: ${JSON.stringify(result.error.issues.map((i) => i.message))}`,
    );
  }
}

function expectInvalid(schema, data, description) {
  const result = schema.safeParse(data);
  if (result.success) {
    throw new Error(`Expected invalid but validation passed`);
  }
}

function createMinimalEdit(asset = null) {
  return {
    timeline: {
      tracks: [
        {
          clips: [
            {
              asset: asset || {
                type: "video",
                src: "https://example.com/video.mp4",
              },
              start: 0,
              length: 5,
            },
          ],
        },
      ],
    },
    output: {
      format: "mp4",
    },
  };
}

function createMinimalClip(asset = null) {
  return {
    asset: asset || { type: "video", src: "https://example.com/video.mp4" },
    start: 0,
    length: 5,
  };
}

console.log("\n========================================");
console.log("COMPREHENSIVE ABUSE TEST SUITE");
console.log("========================================\n");

// ============================================
// SECTION 1: Empty Values and Missing Fields
// ============================================
console.log("\n--- 1. EMPTY VALUES AND MISSING FIELDS ---\n");

test("Reject completely empty object", () => {
  expectInvalid(editSchema, {});
});

test("Reject null edit", () => {
  expectInvalid(editSchema, null);
});

test("Reject undefined edit", () => {
  expectInvalid(editSchema, undefined);
});

test("Reject empty timeline", () => {
  expectInvalid(editSchema, { timeline: {}, output: { format: "mp4" } });
});

test("Reject timeline with empty tracks array", () => {
  expectInvalid(editSchema, {
    timeline: { tracks: [] },
    output: { format: "mp4" },
  });
});

test("Reject track with empty clips array (min 1 required)", () => {
  expectInvalid(editSchema, {
    timeline: { tracks: [{ clips: [] }] },
    output: { format: "mp4" },
  });
});

test("Reject clip with empty asset object", () => {
  expectInvalid(editSchema, {
    timeline: { tracks: [{ clips: [{ asset: {}, start: 0, length: 5 }] }] },
    output: { format: "mp4" },
  });
});

test("Reject missing output", () => {
  expectInvalid(editSchema, {
    timeline: {
      tracks: [
        {
          clips: [
            {
              asset: { type: "video", src: "https://x.com/v.mp4" },
              start: 0,
              length: 5,
            },
          ],
        },
      ],
    },
  });
});

test("Reject empty output object", () => {
  expectInvalid(editSchema, {
    timeline: {
      tracks: [
        {
          clips: [
            {
              asset: { type: "video", src: "https://x.com/v.mp4" },
              start: 0,
              length: 5,
            },
          ],
        },
      ],
    },
    output: {},
  });
});

// ============================================
// SECTION 2: Asset Type Tests
// ============================================
console.log("\n--- 2. ASSET TYPE VALIDATION ---\n");

// Video Asset
test("Accept valid video asset", () => {
  expectValid(
    editSchema,
    createMinimalEdit({ type: "video", src: "https://example.com/video.mp4" }),
  );
});

test("Reject video asset with empty src", () => {
  expectInvalid(editSchema, createMinimalEdit({ type: "video", src: "" }));
});

test("Reject video asset with missing src", () => {
  expectInvalid(editSchema, createMinimalEdit({ type: "video" }));
});

test("Reject video asset with null src", () => {
  expectInvalid(editSchema, createMinimalEdit({ type: "video", src: null }));
});

// Image Asset
test("Accept valid image asset", () => {
  expectValid(
    editSchema,
    createMinimalEdit({ type: "image", src: "https://example.com/image.jpg" }),
  );
});

test("Reject image asset with empty src", () => {
  expectInvalid(editSchema, createMinimalEdit({ type: "image", src: "" }));
});

// Audio Asset
test("Accept valid audio asset", () => {
  expectValid(
    editSchema,
    createMinimalEdit({ type: "audio", src: "https://example.com/audio.mp3" }),
  );
});

test("Reject audio asset with empty src", () => {
  expectInvalid(editSchema, createMinimalEdit({ type: "audio", src: "" }));
});

// Text Asset
test("Accept valid text asset", () => {
  expectValid(
    editSchema,
    createMinimalEdit({ type: "text", text: "Hello World" }),
  );
});

test("Accept text asset with empty text", () => {
  expectValid(editSchema, createMinimalEdit({ type: "text", text: "" }));
});

test("Reject text asset with missing text", () => {
  expectInvalid(editSchema, createMinimalEdit({ type: "text" }));
});

// Rich Text Asset
test("Accept valid rich-text asset", () => {
  expectValid(
    editSchema,
    createMinimalEdit({ type: "rich-text", text: "Hello World" }),
  );
});

test("Accept rich-text asset with empty text", () => {
  expectValid(editSchema, createMinimalEdit({ type: "rich-text", text: "" }));
});

// HTML Asset
test("Accept valid html asset", () => {
  expectValid(
    editSchema,
    createMinimalEdit({ type: "html", html: "<p>Hello</p>" }),
  );
});

test("Accept html asset with empty html", () => {
  expectValid(editSchema, createMinimalEdit({ type: "html", html: "" }));
});

// Caption Asset
test("Accept valid caption asset", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "caption",
      src: "https://example.com/captions.srt",
    }),
  );
});

test("Reject caption asset with empty src", () => {
  expectInvalid(editSchema, createMinimalEdit({ type: "caption", src: "" }));
});

// Luma Asset
test("Accept valid luma asset", () => {
  expectValid(
    editSchema,
    createMinimalEdit({ type: "luma", src: "https://example.com/mask.mp4" }),
  );
});

test("Reject luma asset with empty src", () => {
  expectInvalid(editSchema, createMinimalEdit({ type: "luma", src: "" }));
});

// Title Asset
test("Accept valid title asset", () => {
  expectValid(
    editSchema,
    createMinimalEdit({ type: "title", text: "My Title", style: "minimal" }),
  );
});

test("Reject title asset with missing text", () => {
  expectInvalid(
    editSchema,
    createMinimalEdit({ type: "title", style: "minimal" }),
  );
});

// Shape Asset
test("Accept valid rectangle shape asset", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "shape",
      shape: "rectangle",
    }),
  );
});

test("Accept valid circle shape asset", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "shape",
      shape: "circle",
    }),
  );
});

test("Accept valid line shape asset", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "shape",
      shape: "line",
    }),
  );
});

test("Reject shape asset with missing shape property", () => {
  expectInvalid(editSchema, createMinimalEdit({ type: "shape" }));
});

test("Reject shape asset with invalid shape enum", () => {
  expectInvalid(
    editSchema,
    createMinimalEdit({ type: "shape", shape: "triangle" }),
  );
});

// Text-to-Image Asset
test("Accept valid text-to-image asset", () => {
  expectValid(
    editSchema,
    createMinimalEdit({ type: "text-to-image", prompt: "A beautiful sunset" }),
  );
});

test("Reject text-to-image with missing prompt", () => {
  expectInvalid(editSchema, createMinimalEdit({ type: "text-to-image" }));
});

// Image-to-Video Asset
test("Accept valid image-to-video asset", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "image-to-video",
      src: "https://example.com/image.jpg",
    }),
  );
});

test("Reject image-to-video with empty src", () => {
  expectInvalid(
    editSchema,
    createMinimalEdit({ type: "image-to-video", src: "" }),
  );
});

// Invalid Asset Type
test("Reject unknown asset type", () => {
  expectInvalid(
    editSchema,
    createMinimalEdit({
      type: "unknown-type",
      src: "https://example.com/file.mp4",
    }),
  );
});

// ============================================
// SECTION 3: Numeric Value Boundaries
// ============================================
console.log("\n--- 3. NUMERIC VALUE BOUNDARIES ---\n");

// Video/Audio speed
test("Accept speed = 0 (minimum)", () => {
  expectValid(
    editSchema,
    createMinimalEdit({ type: "video", src: "https://x.com/v.mp4", speed: 0 }),
  );
});

test("Accept speed = 10 (maximum)", () => {
  expectValid(
    editSchema,
    createMinimalEdit({ type: "video", src: "https://x.com/v.mp4", speed: 10 }),
  );
});

test("Reject speed > 10", () => {
  expectInvalid(
    editSchema,
    createMinimalEdit({ type: "video", src: "https://x.com/v.mp4", speed: 11 }),
  );
});

test("Reject negative speed", () => {
  expectInvalid(
    editSchema,
    createMinimalEdit({ type: "video", src: "https://x.com/v.mp4", speed: -1 }),
  );
});

// Volume
test("Accept volume = 0 (muted)", () => {
  expectValid(
    editSchema,
    createMinimalEdit({ type: "video", src: "https://x.com/v.mp4", volume: 0 }),
  );
});

test("Accept volume = 1 (full)", () => {
  expectValid(
    editSchema,
    createMinimalEdit({ type: "video", src: "https://x.com/v.mp4", volume: 1 }),
  );
});

test("Reject volume > 1", () => {
  expectInvalid(
    editSchema,
    createMinimalEdit({
      type: "video",
      src: "https://x.com/v.mp4",
      volume: 1.5,
    }),
  );
});

test("Reject negative volume", () => {
  expectInvalid(
    editSchema,
    createMinimalEdit({
      type: "video",
      src: "https://x.com/v.mp4",
      volume: -0.5,
    }),
  );
});

// Clip width/height
test("Accept clip width = 1 (minimum)", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].width = 1;
  expectValid(editSchema, edit);
});

test("Accept clip width = 3840 (maximum)", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].width = 3840;
  expectValid(editSchema, edit);
});

test("Reject clip width = 0", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].width = 0;
  expectInvalid(editSchema, edit);
});

test("Reject clip width > 3840", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].width = 3841;
  expectInvalid(editSchema, edit);
});

test("Accept clip height = 1 (minimum)", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].height = 1;
  expectValid(editSchema, edit);
});

test("Accept clip height = 2160 (maximum)", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].height = 2160;
  expectValid(editSchema, edit);
});

test("Reject clip height = 0", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].height = 0;
  expectInvalid(editSchema, edit);
});

test("Reject clip height > 2160", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].height = 2161;
  expectInvalid(editSchema, edit);
});

// Float values for clip dimensions
test("Accept float value for clip width (e.g., 100.5)", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].width = 100.5;
  expectValid(editSchema, edit);
});

test("Accept float value for clip height (e.g., 100.5)", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].height = 100.5;
  expectValid(editSchema, edit);
});

// Crop values
test("Accept crop values = 0", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "video",
      src: "https://x.com/v.mp4",
      crop: { top: 0, bottom: 0, left: 0, right: 0 },
    }),
  );
});

test("Accept crop values = 1", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "video",
      src: "https://x.com/v.mp4",
      crop: { top: 1, bottom: 1, left: 1, right: 1 },
    }),
  );
});

test("Reject crop values > 1", () => {
  expectInvalid(
    editSchema,
    createMinimalEdit({
      type: "video",
      src: "https://x.com/v.mp4",
      crop: { top: 1.5 },
    }),
  );
});

test("Reject negative crop values", () => {
  expectInvalid(
    editSchema,
    createMinimalEdit({
      type: "video",
      src: "https://x.com/v.mp4",
      crop: { top: -0.1 },
    }),
  );
});

// ============================================
// SECTION 4: String Validation
// ============================================
console.log("\n--- 4. STRING VALIDATION ---\n");

// Whitespace strings
test("Reject src that is only whitespace", () => {
  expectInvalid(editSchema, createMinimalEdit({ type: "video", src: "   " }));
});

test("Accept text that is only whitespace", () => {
  expectValid(editSchema, createMinimalEdit({ type: "text", text: "   " }));
});

// Hex color patterns
test("Accept valid hex color #ffffff", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "rich-text",
      text: "Hello",
      font: { color: "#ffffff" },
    }),
  );
});

test("Accept valid hex color #000000", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "rich-text",
      text: "Hello",
      font: { color: "#000000" },
    }),
  );
});

test("Reject invalid hex color (missing #)", () => {
  expectInvalid(
    editSchema,
    createMinimalEdit({
      type: "rich-text",
      text: "Hello",
      font: { color: "ffffff" },
    }),
  );
});

test("Reject invalid hex color (wrong length)", () => {
  expectInvalid(
    editSchema,
    createMinimalEdit({
      type: "rich-text",
      text: "Hello",
      font: { color: "#fff" },
    }),
  );
});

test("Reject invalid hex color (invalid characters)", () => {
  expectInvalid(
    editSchema,
    createMinimalEdit({
      type: "rich-text",
      text: "Hello",
      font: { color: "#gggggg" },
    }),
  );
});

// Alias pattern validation
test("Accept valid alias pattern", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].alias = "MY_VIDEO_CLIP";
  expectValid(editSchema, edit);
});

test("Accept alias with numbers and dashes", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].alias = "my-video-123";
  expectValid(editSchema, edit);
});

test("Reject alias with spaces", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].alias = "my video clip";
  expectInvalid(editSchema, edit);
});

test("Reject alias with special characters", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].alias = "my@video!clip";
  expectInvalid(editSchema, edit);
});

// ============================================
// SECTION 5: Enum Validation
// ============================================
console.log("\n--- 5. ENUM VALIDATION ---\n");

// Output format enum
test("Accept format = mp4", () => {
  expectValid(editSchema, {
    timeline: { tracks: [{ clips: [createMinimalClip()] }] },
    output: { format: "mp4" },
  });
});

test("Accept format = gif", () => {
  expectValid(editSchema, {
    timeline: { tracks: [{ clips: [createMinimalClip()] }] },
    output: { format: "gif" },
  });
});

test("Accept format = mp3", () => {
  expectValid(editSchema, {
    timeline: { tracks: [{ clips: [createMinimalClip()] }] },
    output: { format: "mp3" },
  });
});

test("Accept format = jpg", () => {
  expectValid(editSchema, {
    timeline: { tracks: [{ clips: [createMinimalClip()] }] },
    output: { format: "jpg" },
  });
});

test("Accept format = png", () => {
  expectValid(editSchema, {
    timeline: { tracks: [{ clips: [createMinimalClip()] }] },
    output: { format: "png" },
  });
});

test("Accept format = bmp", () => {
  expectValid(editSchema, {
    timeline: { tracks: [{ clips: [createMinimalClip()] }] },
    output: { format: "bmp" },
  });
});

test("Reject invalid format", () => {
  expectInvalid(editSchema, {
    timeline: { tracks: [{ clips: [createMinimalClip()] }] },
    output: { format: "avi" },
  });
});

// Resolution enum
test("Accept resolution = preview", () => {
  expectValid(editSchema, {
    timeline: { tracks: [{ clips: [createMinimalClip()] }] },
    output: { format: "mp4", resolution: "preview" },
  });
});

test("Accept resolution = 1080", () => {
  expectValid(editSchema, {
    timeline: { tracks: [{ clips: [createMinimalClip()] }] },
    output: { format: "mp4", resolution: "1080" },
  });
});

test("Accept resolution = 4k", () => {
  expectValid(editSchema, {
    timeline: { tracks: [{ clips: [createMinimalClip()] }] },
    output: { format: "mp4", resolution: "4k" },
  });
});

test("Reject invalid resolution", () => {
  expectInvalid(editSchema, {
    timeline: { tracks: [{ clips: [createMinimalClip()] }] },
    output: { format: "mp4", resolution: "8k" },
  });
});

// Aspect ratio enum
test("Accept aspectRatio = 16:9", () => {
  expectValid(editSchema, {
    timeline: { tracks: [{ clips: [createMinimalClip()] }] },
    output: { format: "mp4", aspectRatio: "16:9" },
  });
});

test("Accept aspectRatio = 9:16", () => {
  expectValid(editSchema, {
    timeline: { tracks: [{ clips: [createMinimalClip()] }] },
    output: { format: "mp4", aspectRatio: "9:16" },
  });
});

test("Accept aspectRatio = 1:1", () => {
  expectValid(editSchema, {
    timeline: { tracks: [{ clips: [createMinimalClip()] }] },
    output: { format: "mp4", aspectRatio: "1:1" },
  });
});

test("Reject invalid aspectRatio", () => {
  expectInvalid(editSchema, {
    timeline: { tracks: [{ clips: [createMinimalClip()] }] },
    output: { format: "mp4", aspectRatio: "2:1" },
  });
});

// Clip position enum
test("Accept position = center", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].position = "center";
  expectValid(editSchema, edit);
});

test("Accept position = topLeft", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].position = "topLeft";
  expectValid(editSchema, edit);
});

test("Reject invalid position", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].position = "middle";
  expectInvalid(editSchema, edit);
});

// Clip fit enum
test("Accept fit = crop", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].fit = "crop";
  expectValid(editSchema, edit);
});

test("Accept fit = contain", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].fit = "contain";
  expectValid(editSchema, edit);
});

test("Accept fit = cover", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].fit = "cover";
  expectValid(editSchema, edit);
});

test("Accept fit = none", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].fit = "none";
  expectValid(editSchema, edit);
});

test("Reject invalid fit", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].fit = "stretch";
  expectInvalid(editSchema, edit);
});

// Clip effect enum
test("Accept effect = zoomIn", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].effect = "zoomIn";
  expectValid(editSchema, edit);
});

test("Accept effect = slideLeftFast", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].effect = "slideLeftFast";
  expectValid(editSchema, edit);
});

test("Reject invalid effect", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].effect = "spin";
  expectInvalid(editSchema, edit);
});

// Clip filter enum
test("Accept filter = greyscale", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].filter = "greyscale";
  expectValid(editSchema, edit);
});

test("Accept filter = blur", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].filter = "blur";
  expectValid(editSchema, edit);
});

test("Reject invalid filter", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].filter = "sepia";
  expectInvalid(editSchema, edit);
});

// Shape enum
test("Accept shape = rectangle", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "shape",
      shape: "rectangle",
    }),
  );
});

test("Accept shape = circle", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "shape",
      shape: "circle",
    }),
  );
});

test("Accept shape = line", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "shape",
      shape: "line",
    }),
  );
});

test("Reject invalid shape", () => {
  expectInvalid(
    editSchema,
    createMinimalEdit({
      type: "shape",
      shape: "triangle",
    }),
  );
});

// ============================================
// SECTION 6: Array Validation
// ============================================
console.log("\n--- 6. ARRAY VALIDATION ---\n");

// Multiple tracks
test("Accept multiple tracks", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks.push({
    clips: [
      {
        asset: { type: "image", src: "https://x.com/i.jpg" },
        start: 0,
        length: 5,
      },
    ],
  });
  expectValid(editSchema, edit);
});

// Multiple clips
test("Accept multiple clips in track", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips.push({
    asset: { type: "image", src: "https://x.com/i.jpg" },
    start: 5,
    length: 5,
  });
  expectValid(editSchema, edit);
});

// Fonts array
test("Accept fonts array", () => {
  const edit = createMinimalEdit();
  edit.timeline.fonts = [{ src: "https://x.com/font.ttf" }];
  expectValid(editSchema, edit);
});

test("Accept empty fonts array", () => {
  const edit = createMinimalEdit();
  edit.timeline.fonts = [];
  expectValid(editSchema, edit);
});

// Merge fields array
test("Accept merge fields", () => {
  const edit = createMinimalEdit();
  edit.merge = [
    { find: "NAME", replace: "John" },
    { find: "TITLE", replace: "Engineer" },
  ];
  expectValid(editSchema, edit);
});

test("Accept empty merge array", () => {
  const edit = createMinimalEdit();
  edit.merge = [];
  expectValid(editSchema, edit);
});

test("Reject merge field with missing find", () => {
  const edit = createMinimalEdit();
  edit.merge = [{ replace: "John" }];
  expectInvalid(editSchema, edit);
});

test("Reject merge field with missing replace", () => {
  const edit = createMinimalEdit();
  edit.merge = [{ find: "NAME" }];
  expectInvalid(editSchema, edit);
});

// Destinations array
test("Accept destinations array", () => {
  const edit = createMinimalEdit();
  edit.output.destinations = [{ provider: "shotstack" }];
  expectValid(editSchema, edit);
});

test("Accept empty destinations array", () => {
  const edit = createMinimalEdit();
  edit.output.destinations = [];
  expectValid(editSchema, edit);
});

// Tween arrays (scale, opacity, offset)
test("Accept scale as tween array", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].scale = [
    { from: 0.5, to: 1, start: 0, length: 2 },
  ];
  expectValid(editSchema, edit);
});

test("Accept opacity as tween array", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].opacity = [
    { from: 0, to: 1, start: 0, length: 2 },
  ];
  expectValid(editSchema, edit);
});

test("Accept empty tween array for scale", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].scale = [];
  expectValid(editSchema, edit);
});

// Gradient stops array
test("Accept gradient with 2 stops", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "rich-text",
      text: "Hello",
      style: {
        gradient: {
          type: "linear",
          stops: [
            { offset: 0, color: "#ff0000" },
            { offset: 1, color: "#0000ff" },
          ],
        },
      },
    }),
  );
});

test("Accept gradient with multiple stops", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "rich-text",
      text: "Hello",
      style: {
        gradient: {
          type: "linear",
          stops: [
            { offset: 0, color: "#ff0000" },
            { offset: 0.5, color: "#00ff00" },
            { offset: 1, color: "#0000ff" },
          ],
        },
      },
    }),
  );
});

test("Reject gradient with only 1 stop", () => {
  expectInvalid(
    editSchema,
    createMinimalEdit({
      type: "rich-text",
      text: "Hello",
      style: {
        gradient: {
          type: "linear",
          stops: [{ offset: 0, color: "#ff0000" }],
        },
      },
    }),
  );
});

test("Reject gradient with empty stops", () => {
  expectInvalid(
    editSchema,
    createMinimalEdit({
      type: "rich-text",
      text: "Hello",
      style: {
        gradient: {
          type: "linear",
          stops: [],
        },
      },
    }),
  );
});

// ============================================
// SECTION 7: Nested Object Validation
// ============================================
console.log("\n--- 7. NESTED OBJECT VALIDATION ---\n");

// Empty nested objects
test("Accept empty crop object", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "video",
      src: "https://x.com/v.mp4",
      crop: {},
    }),
  );
});

test("Accept empty transition object", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].transition = {};
  expectValid(editSchema, edit);
});

test("Accept empty offset object", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].offset = {};
  expectValid(editSchema, edit);
});

test("Accept empty transform object", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].transform = {};
  expectValid(editSchema, edit);
});

// Transition properties
test("Accept transition with in only", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].transition = { in: "fade" };
  expectValid(editSchema, edit);
});

test("Accept transition with out only", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].transition = { out: "fade" };
  expectValid(editSchema, edit);
});

test("Accept transition with both in and out", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].transition = { in: "fade", out: "zoom" };
  expectValid(editSchema, edit);
});

test("Reject invalid transition in", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].transition = { in: "spin" };
  expectInvalid(editSchema, edit);
});

// Offset properties
test("Accept offset with x only", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].offset = { x: 0.5 };
  expectValid(editSchema, edit);
});

test("Accept offset with y only", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].offset = { y: -0.3 };
  expectValid(editSchema, edit);
});

test("Accept offset with x and y", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].offset = { x: 0.5, y: -0.3 };
  expectValid(editSchema, edit);
});

test("Reject offset x > 10", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].offset = { x: 11 };
  expectInvalid(editSchema, edit);
});

test("Reject offset x < -10", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].offset = { x: -11 };
  expectInvalid(editSchema, edit);
});

test("Accept offset x as tween array", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].offset = {
    x: [{ from: 0, to: 0.5, start: 0, length: 2 }],
  };
  expectValid(editSchema, edit);
});

// Transform properties
test("Accept transform with rotate", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].transform = {
    rotate: { angle: 45 },
  };
  expectValid(editSchema, edit);
});

test("Accept transform with flip", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].transform = {
    flip: { horizontal: true, vertical: false },
  };
  expectValid(editSchema, edit);
});

test("Accept transform with skew", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].transform = {
    skew: { x: 10, y: 5 },
  };
  expectValid(editSchema, edit);
});

test("Accept transform with all properties", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].transform = {
    rotate: { angle: 45 },
    flip: { horizontal: true },
    skew: { x: 10 },
  };
  expectValid(editSchema, edit);
});

// Rich text nested objects
test("Accept rich-text with font object", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "rich-text",
      text: "Hello",
      font: { family: "Arial", size: 24, color: "#ffffff" },
    }),
  );
});

test("Accept rich-text with style object", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "rich-text",
      text: "Hello",
      style: { letterSpacing: 2, lineHeight: 1.5 },
    }),
  );
});

test("Accept rich-text with shadow object", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "rich-text",
      text: "Hello",
      shadow: { offsetX: 4, offsetY: 4, blur: 8, color: "#000000" },
    }),
  );
});

test("Accept rich-text with background object", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "rich-text",
      text: "Hello",
      background: { color: "#000000", opacity: 0.5, borderRadius: 10 },
    }),
  );
});

test("Accept rich-text with border object", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "rich-text",
      text: "Hello",
      border: { width: 2, color: "#ff0000", opacity: 0.8 },
    }),
  );
});

test("Accept rich-text with align object", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "rich-text",
      text: "Hello",
      align: { horizontal: "center", vertical: "middle" },
    }),
  );
});

test("Accept rich-text with animation object", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "rich-text",
      text: "Hello",
      animation: { preset: "fadeIn", duration: 2 },
    }),
  );
});

test("Reject rich-text animation without required preset", () => {
  expectInvalid(
    editSchema,
    createMinimalEdit({
      type: "rich-text",
      text: "Hello",
      animation: { duration: 2 },
    }),
  );
});

// ============================================
// SECTION 8: Type Coercion and Mixed Types
// ============================================
console.log("\n--- 8. TYPE COERCION AND MIXED TYPES ---\n");

// String-to-number coercion for start/length
test('Accept start as string number "0"', () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].start = "0";
  expectValid(editSchema, edit);
});

test('Accept length as string number "5"', () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].length = "5";
  expectValid(editSchema, edit);
});

// Smart clip properties
test("Accept start = auto", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].start = "auto";
  expectValid(editSchema, edit);
});

test("Accept length = auto", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].length = "auto";
  expectValid(editSchema, edit);
});

test("Accept length = end", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].length = "end";
  expectValid(editSchema, edit);
});

test("Accept start = alias://clip-name", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].start = "alias://my-clip";
  expectValid(editSchema, edit);
});

test("Reject invalid start string", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].start = "invalid";
  expectInvalid(editSchema, edit);
});

test("Reject invalid length string", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].length = "invalid";
  expectInvalid(editSchema, edit);
});

// Scale as number vs array
test("Accept scale as number", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].scale = 0.5;
  expectValid(editSchema, edit);
});

test("Accept scale as array", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].scale = [
    { from: 0.5, to: 1, start: 0, length: 2 },
  ];
  expectValid(editSchema, edit);
});

// Opacity as number vs array
test("Accept opacity as number", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].opacity = 0.5;
  expectValid(editSchema, edit);
});

test("Accept opacity as array", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].opacity = [
    { from: 0, to: 1, start: 0, length: 2 },
  ];
  expectValid(editSchema, edit);
});

// Volume as number vs array
test("Accept volume as number", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "video",
      src: "https://x.com/v.mp4",
      volume: 0.5,
    }),
  );
});

test("Accept volume as tween array", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "video",
      src: "https://x.com/v.mp4",
      volume: [{ from: 0, to: 1, start: 0, length: 2 }],
    }),
  );
});

// Padding as number vs object
test("Accept rich-text padding as number", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "rich-text",
      text: "Hello",
      padding: 10,
    }),
  );
});

test("Accept rich-text padding as object", () => {
  expectValid(
    editSchema,
    createMinimalEdit({
      type: "rich-text",
      text: "Hello",
      padding: { top: 10, right: 20, bottom: 10, left: 20 },
    }),
  );
});

// ============================================
// SECTION 9: Destination Tests
// ============================================
console.log("\n--- 9. DESTINATION VALIDATION ---\n");

// Shotstack destination
test("Accept shotstack destination", () => {
  const edit = createMinimalEdit();
  edit.output.destinations = [{ provider: "shotstack" }];
  expectValid(editSchema, edit);
});

test("Accept shotstack destination with exclude", () => {
  const edit = createMinimalEdit();
  edit.output.destinations = [{ provider: "shotstack", exclude: true }];
  expectValid(editSchema, edit);
});

// S3 destination
test("Accept S3 destination with required options", () => {
  const edit = createMinimalEdit();
  edit.output.destinations = [
    {
      provider: "s3",
      options: { region: "us-east-1", bucket: "my-bucket" },
    },
  ];
  expectValid(editSchema, edit);
});

test("Accept S3 destination with all options", () => {
  const edit = createMinimalEdit();
  edit.output.destinations = [
    {
      provider: "s3",
      options: {
        region: "us-east-1",
        bucket: "my-bucket",
        prefix: "videos/",
        filename: "my-video",
        acl: "public-read",
      },
    },
  ];
  expectValid(editSchema, edit);
});

test("Accept S3 destination without options (uses dashboard config)", () => {
  const edit = createMinimalEdit();
  edit.output.destinations = [{ provider: "s3" }];
  expectValid(editSchema, edit);
});

test("Reject S3 destination options without required region", () => {
  const edit = createMinimalEdit();
  edit.output.destinations = [
    {
      provider: "s3",
      options: { bucket: "my-bucket" },
    },
  ];
  expectInvalid(editSchema, edit);
});

test("Reject S3 destination options without required bucket", () => {
  const edit = createMinimalEdit();
  edit.output.destinations = [
    {
      provider: "s3",
      options: { region: "us-east-1" },
    },
  ];
  expectInvalid(editSchema, edit);
});

// Mux destination
test("Accept Mux destination", () => {
  const edit = createMinimalEdit();
  edit.output.destinations = [{ provider: "mux" }];
  expectValid(editSchema, edit);
});

test("Accept Mux destination with options", () => {
  const edit = createMinimalEdit();
  edit.output.destinations = [
    {
      provider: "mux",
      options: {
        playbackPolicy: ["public", "signed"],
        passthrough: "metadata",
      },
    },
  ];
  expectValid(editSchema, edit);
});

// Google Cloud Storage destination (options are optional)
test("Accept GCS destination with options", () => {
  const edit = createMinimalEdit();
  edit.output.destinations = [
    {
      provider: "google-cloud-storage",
      options: { bucket: "my-bucket" },
    },
  ];
  expectValid(editSchema, edit);
});

test("Accept GCS destination without options", () => {
  const edit = createMinimalEdit();
  edit.output.destinations = [
    {
      provider: "google-cloud-storage",
    },
  ];
  expectValid(editSchema, edit);
});

// Google Drive destination - requires options with folderId
test("Accept Google Drive destination with required options", () => {
  const edit = createMinimalEdit();
  edit.output.destinations = [
    {
      provider: "google-drive",
      options: { folderId: "folder123" },
    },
  ];
  expectValid(editSchema, edit);
});

test("Accept Google Drive destination with all options", () => {
  const edit = createMinimalEdit();
  edit.output.destinations = [
    {
      provider: "google-drive",
      options: { folderId: "folder123", filename: "my-video" },
    },
  ];
  expectValid(editSchema, edit);
});

test("Reject Google Drive destination without options", () => {
  const edit = createMinimalEdit();
  edit.output.destinations = [{ provider: "google-drive" }];
  expectInvalid(editSchema, edit);
});

// Vimeo destination
test("Accept Vimeo destination", () => {
  const edit = createMinimalEdit();
  edit.output.destinations = [{ provider: "vimeo" }];
  expectValid(editSchema, edit);
});

test("Accept Vimeo destination with options", () => {
  const edit = createMinimalEdit();
  edit.output.destinations = [
    {
      provider: "vimeo",
      options: {
        name: "My Video",
        description: "A description",
        privacy: {
          view: "anybody",
          embed: "public",
          download: true,
          add: false,
        },
      },
    },
  ];
  expectValid(editSchema, edit);
});

// TikTok destination
test("Accept TikTok destination", () => {
  const edit = createMinimalEdit();
  edit.output.destinations = [{ provider: "tiktok" }];
  expectValid(editSchema, edit);
});

test("Accept TikTok destination with options", () => {
  const edit = createMinimalEdit();
  edit.output.destinations = [
    {
      provider: "tiktok",
      options: { title: "My TikTok", privacyLevel: "private" },
    },
  ];
  expectValid(editSchema, edit);
});

// Multiple destinations
test("Accept multiple destinations", () => {
  const edit = createMinimalEdit();
  edit.output.destinations = [
    { provider: "shotstack" },
    { provider: "s3", options: { region: "us-east-1", bucket: "my-bucket" } },
    { provider: "mux" },
  ];
  expectValid(editSchema, edit);
});

// Invalid destination
test("Reject invalid destination provider", () => {
  const edit = createMinimalEdit();
  edit.output.destinations = [{ provider: "youtube" }];
  expectInvalid(editSchema, edit);
});

// ============================================
// SECTION 10: Output Properties
// ============================================
console.log("\n--- 10. OUTPUT PROPERTY VALIDATION ---\n");

// FPS enum
test("Accept fps = 12", () => {
  const edit = createMinimalEdit();
  edit.output.fps = 12;
  expectValid(editSchema, edit);
});

test("Accept fps = 25", () => {
  const edit = createMinimalEdit();
  edit.output.fps = 25;
  expectValid(editSchema, edit);
});

test("Accept fps = 60", () => {
  const edit = createMinimalEdit();
  edit.output.fps = 60;
  expectValid(editSchema, edit);
});

test("Reject invalid fps = 20", () => {
  const edit = createMinimalEdit();
  edit.output.fps = 20;
  expectInvalid(editSchema, edit);
});

// Quality enum
test("Accept quality = verylow", () => {
  const edit = createMinimalEdit();
  edit.output.quality = "verylow";
  expectValid(editSchema, edit);
});

test("Accept quality = medium", () => {
  const edit = createMinimalEdit();
  edit.output.quality = "medium";
  expectValid(editSchema, edit);
});

test("Accept quality = veryhigh", () => {
  const edit = createMinimalEdit();
  edit.output.quality = "veryhigh";
  expectValid(editSchema, edit);
});

test("Reject invalid quality", () => {
  const edit = createMinimalEdit();
  edit.output.quality = "ultra";
  expectInvalid(editSchema, edit);
});

// Boolean properties
test("Accept mute = true", () => {
  const edit = createMinimalEdit();
  edit.output.mute = true;
  expectValid(editSchema, edit);
});

test("Accept repeat = true", () => {
  const edit = createMinimalEdit();
  edit.output.repeat = true;
  expectValid(editSchema, edit);
});

// Size object
test("Accept custom size", () => {
  const edit = createMinimalEdit();
  edit.output.size = { width: 1920, height: 1080 };
  expectValid(editSchema, edit);
});

// Range object
test("Accept range", () => {
  const edit = createMinimalEdit();
  edit.output.range = { start: 0, length: 10 };
  expectValid(editSchema, edit);
});

// Poster and thumbnail
test("Accept poster", () => {
  const edit = createMinimalEdit();
  edit.output.poster = { capture: 2 };
  expectValid(editSchema, edit);
});

test("Accept thumbnail", () => {
  const edit = createMinimalEdit();
  edit.output.thumbnail = { capture: 5, scale: 0.5 };
  expectValid(editSchema, edit);
});

// ============================================
// SECTION 11: Edge Cases and Malformed Data
// ============================================
console.log("\n--- 11. EDGE CASES AND MALFORMED DATA ---\n");

// Arrays where objects expected
test("Reject array for asset", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].asset = [];
  expectInvalid(editSchema, edit);
});

test("Reject array for output", () => {
  expectInvalid(editSchema, {
    timeline: { tracks: [{ clips: [createMinimalClip()] }] },
    output: [],
  });
});

test("Reject array for timeline", () => {
  expectInvalid(editSchema, {
    timeline: [],
    output: { format: "mp4" },
  });
});

// Objects where arrays expected
test("Reject object for tracks", () => {
  expectInvalid(editSchema, {
    timeline: { tracks: {} },
    output: { format: "mp4" },
  });
});

test("Reject object for clips", () => {
  expectInvalid(editSchema, {
    timeline: { tracks: [{ clips: {} }] },
    output: { format: "mp4" },
  });
});

// Numbers where strings expected
test("Reject number for src", () => {
  expectInvalid(editSchema, createMinimalEdit({ type: "video", src: 12345 }));
});

test("Reject number for text", () => {
  expectInvalid(editSchema, createMinimalEdit({ type: "text", text: 12345 }));
});

// Strings where numbers expected
test("Reject non-numeric string for numeric properties", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].width = "wide";
  expectInvalid(editSchema, edit);
});

// Boolean where other types expected
test("Reject boolean for src", () => {
  expectInvalid(editSchema, createMinimalEdit({ type: "video", src: true }));
});

test("Reject boolean for text", () => {
  expectInvalid(editSchema, createMinimalEdit({ type: "text", text: false }));
});

// Null values
test("Reject null for asset", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].asset = null;
  expectInvalid(editSchema, edit);
});

test("Reject null for tracks", () => {
  expectInvalid(editSchema, {
    timeline: { tracks: null },
    output: { format: "mp4" },
  });
});

test("Reject null for output", () => {
  expectInvalid(editSchema, {
    timeline: { tracks: [{ clips: [createMinimalClip()] }] },
    output: null,
  });
});

// Very large values
test("Accept very large start time", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].start = 99999;
  expectValid(editSchema, edit);
});

test("Accept very large length", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].length = 99999;
  expectValid(editSchema, edit);
});

// Negative values where not allowed
test("Reject negative start", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].start = -1;
  expectInvalid(editSchema, edit);
});

test("Reject negative length", () => {
  const edit = createMinimalEdit();
  edit.timeline.tracks[0].clips[0].length = -1;
  expectInvalid(editSchema, edit);
});

// Extra/unknown properties (additionalProperties) - strict mode MUST reject these
test("Reject extra properties at top level", () => {
  const edit = createMinimalEdit();
  edit.unknownProperty = "value";
  expectInvalid(editSchema, edit);
});

test("Reject extra properties on asset", () => {
  const edit = createMinimalEdit({
    type: "video",
    src: "https://x.com/v.mp4",
    unknownProp: "value",
  });
  expectInvalid(editSchema, edit);
});

// ============================================
// SECTION 12: Soundtrack Tests
// ============================================
console.log("\n--- 12. SOUNDTRACK VALIDATION ---\n");

test("Accept valid soundtrack", () => {
  const edit = createMinimalEdit();
  edit.timeline.soundtrack = { src: "https://example.com/music.mp3" };
  expectValid(editSchema, edit);
});

test("Reject soundtrack with empty src", () => {
  const edit = createMinimalEdit();
  edit.timeline.soundtrack = { src: "" };
  expectInvalid(editSchema, edit);
});

test("Accept soundtrack with effect", () => {
  const edit = createMinimalEdit();
  edit.timeline.soundtrack = {
    src: "https://example.com/music.mp3",
    effect: "fadeIn",
  };
  expectValid(editSchema, edit);
});

test("Accept soundtrack with fadeInFadeOut effect", () => {
  const edit = createMinimalEdit();
  edit.timeline.soundtrack = {
    src: "https://example.com/music.mp3",
    effect: "fadeInFadeOut",
  };
  expectValid(editSchema, edit);
});

test("Reject soundtrack with invalid effect", () => {
  const edit = createMinimalEdit();
  edit.timeline.soundtrack = {
    src: "https://example.com/music.mp3",
    effect: "reverse",
  };
  expectInvalid(editSchema, edit);
});

test("Accept soundtrack with volume", () => {
  const edit = createMinimalEdit();
  edit.timeline.soundtrack = {
    src: "https://example.com/music.mp3",
    volume: 0.5,
  };
  expectValid(editSchema, edit);
});

// ============================================
// SECTION 13: Complex Integration Tests
// ============================================
console.log("\n--- 13. COMPLEX INTEGRATION TESTS ---\n");

test("Accept fully featured video edit", () => {
  const edit = {
    timeline: {
      background: "#000000",
      soundtrack: {
        src: "https://example.com/music.mp3",
        volume: 0.8,
        effect: "fadeInFadeOut",
      },
      fonts: [{ src: "https://example.com/font.ttf" }],
      tracks: [
        {
          clips: [
            {
              asset: { type: "title", text: "Title", style: "minimal" },
              start: 0,
              length: 5,
              position: "center",
              transition: { in: "fade", out: "fade" },
            },
          ],
        },
        {
          clips: [
            {
              asset: {
                type: "video",
                src: "https://example.com/video.mp4",
                trim: 2,
                volume: 0.5,
                speed: 1,
              },
              start: 0,
              length: 10,
              fit: "crop",
              scale: 1,
              effect: "zoomIn",
              filter: "boost",
            },
          ],
        },
      ],
    },
    output: {
      format: "mp4",
      resolution: "1080",
      aspectRatio: "16:9",
      fps: 30,
      quality: "high",
      poster: { capture: 5 },
      thumbnail: { capture: 5, scale: 0.25 },
      destinations: [
        { provider: "shotstack" },
        {
          provider: "s3",
          options: { region: "us-east-1", bucket: "my-bucket" },
        },
      ],
    },
    merge: [{ find: "TITLE", replace: "My Video" }],
    callback: "https://example.com/callback",
  };
  expectValid(editSchema, edit);
});

test("Accept image edit with rich text overlay", () => {
  const edit = {
    timeline: {
      tracks: [
        {
          clips: [
            {
              asset: {
                type: "rich-text",
                text: "Hello World",
                font: { family: "Arial", size: 48, color: "#ffffff" },
                style: {
                  letterSpacing: 2,
                  lineHeight: 1.5,
                  textTransform: "uppercase",
                },
                shadow: { offsetX: 2, offsetY: 2, blur: 4, color: "#000000" },
                background: {
                  color: "#000000",
                  opacity: 0.5,
                  borderRadius: 10,
                },
                padding: { top: 20, right: 40, bottom: 20, left: 40 },
                align: { horizontal: "center", vertical: "middle" },
                animation: { preset: "fadeIn", duration: 1 },
              },
              start: 0,
              length: 5,
              position: "center",
            },
          ],
        },
        {
          clips: [
            {
              asset: {
                type: "image",
                src: "https://example.com/background.jpg",
              },
              start: 0,
              length: 5,
              fit: "cover",
            },
          ],
        },
      ],
    },
    output: { format: "jpg" },
  };
  expectValid(editSchema, edit);
});

test("Accept shape with transform", () => {
  const edit = {
    timeline: {
      tracks: [
        {
          clips: [
            {
              asset: {
                type: "shape",
                shape: "rectangle",
              },
              start: 0,
              length: 5,
              transform: {
                rotate: { angle: 45 },
                skew: { x: 10 },
              },
            },
          ],
        },
      ],
    },
    output: { format: "mp4" },
  };
  expectValid(editSchema, edit);
});

// ============================================
// SUMMARY
// ============================================
console.log("\n========================================");
console.log("TEST SUMMARY");
console.log("========================================\n");

console.log(`Total Tests: ${passCount + failCount}`);
console.log(`Passed: ${passCount}`);
console.log(`Failed: ${failCount}`);

if (failures.length > 0) {
  console.log("\n--- FAILURES ---\n");
  failures.forEach(({ description, error }, index) => {
    console.log(`${index + 1}. ${description}`);
    console.log(`   Error: ${error}\n`);
  });
}

process.exit(failCount > 0 ? 1 : 0);
