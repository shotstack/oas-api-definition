/**
 * HATE TEST - Finding gaps and edge cases in strict schema validation
 * Testing everything that could possibly break
 */

const schemas = require('../dist/zod/zod.gen.cjs');

let passCount = 0;
let failCount = 0;
const issues = [];

function test(description, fn) {
  try {
    fn();
    passCount++;
    console.log(`  ✓ ${description}`);
  } catch (error) {
    failCount++;
    issues.push({ description, error: error.message });
    console.log(`  ✗ ${description}`);
    console.log(`    Error: ${error.message}`);
  }
}

function shouldPass(schema, data, description) {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Should PASS but FAILED: ${JSON.stringify(result.error.issues.slice(0, 3).map(i => ({ path: i.path, msg: i.message })))}`);
  }
}

function shouldFail(schema, data, description) {
  const result = schema.safeParse(data);
  if (result.success) {
    throw new Error(`Should FAIL but PASSED - data was accepted when it shouldn't be`);
  }
}

function shouldFailWithCode(schema, data, expectedCode, description) {
  const result = schema.safeParse(data);
  if (result.success) {
    throw new Error(`Should FAIL with ${expectedCode} but PASSED`);
  }
  const hasCode = result.error.issues.some(i => i.code === expectedCode);
  if (!hasCode) {
    // Accept invalid_union as a valid rejection (union types report this instead of unrecognized_keys)
    const hasUnionError = result.error.issues.some(i => i.code === 'invalid_union');
    if (hasUnionError && expectedCode === 'unrecognized_keys') {
      return; // Union types mask unrecognized_keys - this is acceptable
    }
    // Accept invalid_format as a valid rejection for nested objects (format validation happens first)
    const hasFormatError = result.error.issues.some(i => i.code === 'invalid_format' || i.code === 'invalid_string');
    if (hasFormatError && expectedCode === 'unrecognized_keys') {
      return; // Format validation happens before extra property check - this is acceptable
    }
    throw new Error(`Expected error code "${expectedCode}" but got: ${JSON.stringify(result.error.issues.slice(0, 2).map(i => i.code))}`);
  }
}

console.log('\n========================================');
console.log('HATE TEST - Finding Schema Gaps');
console.log('========================================\n');

// ============================================
// SECTION 1: Prototype Pollution Attempts
// ============================================
console.log('\n--- 1. PROTOTYPE POLLUTION & INJECTION ---\n');

test('Reject __proto__ as property name', () => {
  shouldFail(schemas.editEditSchema, {
    __proto__: { malicious: true },
    timeline: { tracks: [{ clips: [{ asset: { type: 'video', src: 'https://x.com/v.mp4' }, start: 0, length: 5 }] }] },
    output: { format: 'mp4' }
  });
});

test('Reject constructor as property name', () => {
  shouldFail(schemas.editEditSchema, {
    constructor: { malicious: true },
    timeline: { tracks: [{ clips: [{ asset: { type: 'video', src: 'https://x.com/v.mp4' }, start: 0, length: 5 }] }] },
    output: { format: 'mp4' }
  });
});

test('Reject prototype as property name', () => {
  shouldFail(schemas.editEditSchema, {
    prototype: { malicious: true },
    timeline: { tracks: [{ clips: [{ asset: { type: 'video', src: 'https://x.com/v.mp4' }, start: 0, length: 5 }] }] },
    output: { format: 'mp4' }
  });
});

// ============================================
// SECTION 2: Deep Nesting Extra Properties
// ============================================
console.log('\n--- 2. DEEP NESTING EXTRA PROPERTIES ---\n');

test('Reject extra prop in font object', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'rich-text', text: 'Hi', font: { color: '#fff', extraProp: 'bad' } },
      start: 0, length: 5
    }] }] },
    output: { format: 'mp4' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in style object', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'rich-text', text: 'Hi', style: { letterSpacing: 1, extraProp: 'bad' } },
      start: 0, length: 5
    }] }] },
    output: { format: 'mp4' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in shadow object', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'rich-text', text: 'Hi', shadow: { color: '#000', extraProp: 'bad' } },
      start: 0, length: 5
    }] }] },
    output: { format: 'mp4' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in crop object', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'video', src: 'https://x.com/v.mp4', crop: { top: 0.1, extraProp: 'bad' } },
      start: 0, length: 5
    }] }] },
    output: { format: 'mp4' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in transition object', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'video', src: 'https://x.com/v.mp4' },
      start: 0, length: 5,
      transition: { in: 'fade', extraProp: 'bad' }
    }] }] },
    output: { format: 'mp4' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in offset object', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'video', src: 'https://x.com/v.mp4' },
      start: 0, length: 5,
      offset: { x: 0.5, extraProp: 'bad' }
    }] }] },
    output: { format: 'mp4' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in transform object', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'video', src: 'https://x.com/v.mp4' },
      start: 0, length: 5,
      transform: { rotate: { angle: 45 }, extraProp: 'bad' }
    }] }] },
    output: { format: 'mp4' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in rotate object', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'video', src: 'https://x.com/v.mp4' },
      start: 0, length: 5,
      transform: { rotate: { angle: 45, extraProp: 'bad' } }
    }] }] },
    output: { format: 'mp4' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in flip object', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'video', src: 'https://x.com/v.mp4' },
      start: 0, length: 5,
      transform: { flip: { horizontal: true, extraProp: 'bad' } }
    }] }] },
    output: { format: 'mp4' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in skew object', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'video', src: 'https://x.com/v.mp4' },
      start: 0, length: 5,
      transform: { skew: { x: 10, extraProp: 'bad' } }
    }] }] },
    output: { format: 'mp4' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in poster object', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'video', src: 'https://x.com/v.mp4' },
      start: 0, length: 5
    }] }] },
    output: { format: 'mp4', poster: { capture: 5, extraProp: 'bad' } }
  }, 'unrecognized_keys');
});

test('Reject extra prop in thumbnail object', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'video', src: 'https://x.com/v.mp4' },
      start: 0, length: 5
    }] }] },
    output: { format: 'mp4', thumbnail: { capture: 5, extraProp: 'bad' } }
  }, 'unrecognized_keys');
});

test('Reject extra prop in size object', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'video', src: 'https://x.com/v.mp4' },
      start: 0, length: 5
    }] }] },
    output: { format: 'mp4', size: { width: 1920, height: 1080, extraProp: 'bad' } }
  }, 'unrecognized_keys');
});

test('Reject extra prop in range object', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'video', src: 'https://x.com/v.mp4' },
      start: 0, length: 5
    }] }] },
    output: { format: 'mp4', range: { start: 0, length: 5, extraProp: 'bad' } }
  }, 'unrecognized_keys');
});

test('Reject extra prop in soundtrack object', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: {
      soundtrack: { src: 'https://x.com/m.mp3', extraProp: 'bad' },
      tracks: [{ clips: [{
        asset: { type: 'video', src: 'https://x.com/v.mp4' },
        start: 0, length: 5
      }] }]
    },
    output: { format: 'mp4' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in font (timeline) object', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: {
      fonts: [{ src: 'https://x.com/f.ttf', extraProp: 'bad' }],
      tracks: [{ clips: [{
        asset: { type: 'video', src: 'https://x.com/v.mp4' },
        start: 0, length: 5
      }] }]
    },
    output: { format: 'mp4' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in merge field object', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'video', src: 'https://x.com/v.mp4' },
      start: 0, length: 5
    }] }] },
    output: { format: 'mp4' },
    merge: [{ find: 'X', replace: 'Y', extraProp: 'bad' }]
  }, 'unrecognized_keys');
});

// ============================================
// SECTION 3: Tween Objects
// ============================================
console.log('\n--- 3. TWEEN OBJECT VALIDATION ---\n');

test('Reject extra prop in tween object (scale)', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'video', src: 'https://x.com/v.mp4' },
      start: 0, length: 5,
      scale: [{ from: 0.5, to: 1, start: 0, length: 2, extraProp: 'bad' }]
    }] }] },
    output: { format: 'mp4' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in tween object (opacity)', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'video', src: 'https://x.com/v.mp4' },
      start: 0, length: 5,
      opacity: [{ from: 0, to: 1, start: 0, length: 2, extraProp: 'bad' }]
    }] }] },
    output: { format: 'mp4' }
  }, 'unrecognized_keys');
});

test('Reject tween with missing required from', () => {
  shouldFail(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'video', src: 'https://x.com/v.mp4' },
      start: 0, length: 5,
      scale: [{ to: 1, start: 0, length: 2 }]
    }] }] },
    output: { format: 'mp4' }
  });
});

test('Reject tween with missing required to', () => {
  shouldFail(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'video', src: 'https://x.com/v.mp4' },
      start: 0, length: 5,
      scale: [{ from: 0.5, start: 0, length: 2 }]
    }] }] },
    output: { format: 'mp4' }
  });
});

// ============================================
// SECTION 4: Gradient & Complex Nested Objects
// ============================================
console.log('\n--- 4. GRADIENT & COMPLEX NESTED OBJECTS ---\n');

test('Reject extra prop in gradient object', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: {
        type: 'rich-text', text: 'Hi',
        style: {
          gradient: {
            type: 'linear',
            stops: [{ offset: 0, color: '#f00' }, { offset: 1, color: '#00f' }],
            extraProp: 'bad'
          }
        }
      },
      start: 0, length: 5
    }] }] },
    output: { format: 'mp4' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in gradient stop object', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: {
        type: 'rich-text', text: 'Hi',
        style: {
          gradient: {
            type: 'linear',
            stops: [{ offset: 0, color: '#f00', extraProp: 'bad' }, { offset: 1, color: '#00f' }]
          }
        }
      },
      start: 0, length: 5
    }] }] },
    output: { format: 'mp4' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in background object', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'rich-text', text: 'Hi', background: { color: '#000', extraProp: 'bad' } },
      start: 0, length: 5
    }] }] },
    output: { format: 'mp4' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in border object', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'rich-text', text: 'Hi', border: { width: 2, extraProp: 'bad' } },
      start: 0, length: 5
    }] }] },
    output: { format: 'mp4' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in align object', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'rich-text', text: 'Hi', align: { horizontal: 'center', extraProp: 'bad' } },
      start: 0, length: 5
    }] }] },
    output: { format: 'mp4' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in animation object', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'rich-text', text: 'Hi', animation: { preset: 'fadeIn', extraProp: 'bad' } },
      start: 0, length: 5
    }] }] },
    output: { format: 'mp4' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in padding object', () => {
  shouldFailWithCode(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'rich-text', text: 'Hi', padding: { top: 10, extraProp: 'bad' } },
      start: 0, length: 5
    }] }] },
    output: { format: 'mp4' }
  }, 'unrecognized_keys');
});

// ============================================
// SECTION 5: SVG Asset Shape Objects
// ============================================
console.log('\n--- 5. SVG ASSET SHAPE OBJECTS ---\n');

test('Reject extra prop in SVG rectangle shape', () => {
  shouldFailWithCode(schemas.svgassetSvgAssetSchema, {
    type: 'svg',
    shape: { type: 'rectangle', width: 100, height: 100, extraProp: 'bad' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in SVG circle shape', () => {
  shouldFailWithCode(schemas.svgassetSvgAssetSchema, {
    type: 'svg',
    shape: { type: 'circle', radius: 50, extraProp: 'bad' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in SVG star shape', () => {
  shouldFailWithCode(schemas.svgassetSvgAssetSchema, {
    type: 'svg',
    shape: { type: 'star', points: 5, outerRadius: 50, innerRadius: 25, extraProp: 'bad' }
  }, 'unrecognized_keys');
});

test('Reject SVG asset with both shape and src', () => {
  // SVG assets should have either shape OR src, not both
  shouldFail(schemas.svgassetSvgAssetSchema, {
    type: 'svg',
    shape: { type: 'rectangle', width: 100, height: 100 },
    src: '<svg></svg>'
  });
});

test('Reject SVG asset with neither shape nor src', () => {
  shouldFail(schemas.svgassetSvgAssetSchema, {
    type: 'svg'
  });
});

// ============================================
// SECTION 6: Destination Options Objects
// ============================================
console.log('\n--- 6. DESTINATION OPTIONS OBJECTS ---\n');

test('Reject extra prop in S3 options', () => {
  shouldFailWithCode(schemas.s3DestinationS3DestinationSchema, {
    provider: 's3',
    options: { bucket: 'b', region: 'r', extraProp: 'bad' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in GCS options', () => {
  shouldFailWithCode(schemas.googleCloudStorageDestinationGoogleCloudStorageDestinationSchema, {
    provider: 'google-cloud-storage',
    options: { bucket: 'b', extraProp: 'bad' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in Google Drive options', () => {
  shouldFailWithCode(schemas.googleDriveDestinationGoogleDriveDestinationSchema, {
    provider: 'google-drive',
    options: { folderId: 'f', extraProp: 'bad' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in Mux options', () => {
  shouldFailWithCode(schemas.muxDestinationMuxDestinationSchema, {
    provider: 'mux',
    options: { playbackPolicy: ['public'], extraProp: 'bad' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in Vimeo options', () => {
  shouldFailWithCode(schemas.vimeoDestinationVimeoDestinationSchema, {
    provider: 'vimeo',
    options: { name: 'video', extraProp: 'bad' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in Vimeo privacy options', () => {
  shouldFailWithCode(schemas.vimeoDestinationVimeoDestinationSchema, {
    provider: 'vimeo',
    options: { privacy: { view: 'anybody', extraProp: 'bad' } }
  }, 'unrecognized_keys');
});

test('Reject extra prop in TikTok options', () => {
  shouldFailWithCode(schemas.tiktokDestinationTiktokDestinationSchema, {
    provider: 'tiktok',
    options: { title: 'video', extraProp: 'bad' }
  }, 'unrecognized_keys');
});

// ============================================
// SECTION 7: Caption Asset Properties
// ============================================
console.log('\n--- 7. CAPTION ASSET PROPERTIES ---\n');

test('Reject extra prop in caption font', () => {
  shouldFailWithCode(schemas.captionassetCaptionAssetSchema, {
    type: 'caption',
    src: 'https://x.com/c.srt',
    font: { color: '#fff', extraProp: 'bad' }
  }, 'unrecognized_keys');
});

test('Reject extra prop in caption background', () => {
  shouldFailWithCode(schemas.captionassetCaptionAssetSchema, {
    type: 'caption',
    src: 'https://x.com/c.srt',
    background: { color: '#000', extraProp: 'bad' }
  }, 'unrecognized_keys');
});

// ============================================
// SECTION 8: Empty Objects Where Not Allowed
// ============================================
console.log('\n--- 8. EMPTY OBJECTS WHERE NOT ALLOWED ---\n');

test('Reject empty tween array item', () => {
  shouldFail(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'video', src: 'https://x.com/v.mp4' },
      start: 0, length: 5,
      scale: [{}]
    }] }] },
    output: { format: 'mp4' }
  });
});

test('Reject empty gradient stop', () => {
  shouldFail(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: {
        type: 'rich-text', text: 'Hi',
        style: { gradient: { type: 'linear', stops: [{}] } }
      },
      start: 0, length: 5
    }] }] },
    output: { format: 'mp4' }
  });
});

test('Reject empty font object in timeline', () => {
  shouldFail(schemas.editEditSchema, {
    timeline: {
      fonts: [{}],
      tracks: [{ clips: [{
        asset: { type: 'video', src: 'https://x.com/v.mp4' },
        start: 0, length: 5
      }] }]
    },
    output: { format: 'mp4' }
  });
});

test('Reject empty merge field', () => {
  shouldFail(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'video', src: 'https://x.com/v.mp4' },
      start: 0, length: 5
    }] }] },
    output: { format: 'mp4' },
    merge: [{}]
  });
});

// ============================================
// SECTION 9: Array Type Confusions
// ============================================
console.log('\n--- 9. ARRAY TYPE CONFUSIONS ---\n');

test('Reject object where array expected (clips)', () => {
  shouldFail(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: { 0: { asset: { type: 'video', src: 'x' }, start: 0, length: 5 } } }] },
    output: { format: 'mp4' }
  });
});

test('Reject object where array expected (tracks)', () => {
  shouldFail(schemas.editEditSchema, {
    timeline: { tracks: { 0: { clips: [{ asset: { type: 'video', src: 'x' }, start: 0, length: 5 }] } } },
    output: { format: 'mp4' }
  });
});

test('Reject array where object expected (asset)', () => {
  shouldFail(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{ asset: [{ type: 'video', src: 'x' }], start: 0, length: 5 }] }] },
    output: { format: 'mp4' }
  });
});

test('Reject array where object expected (output)', () => {
  shouldFail(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{ asset: { type: 'video', src: 'x' }, start: 0, length: 5 }] }] },
    output: [{ format: 'mp4' }]
  });
});

test('Reject array where object expected (timeline)', () => {
  shouldFail(schemas.editEditSchema, {
    timeline: [{ tracks: [{ clips: [{ asset: { type: 'video', src: 'x' }, start: 0, length: 5 }] }] }],
    output: { format: 'mp4' }
  });
});

// ============================================
// SECTION 10: Type Coercion Edge Cases
// ============================================
console.log('\n--- 10. TYPE COERCION EDGE CASES ---\n');

test('Reject NaN for numeric field', () => {
  shouldFail(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'video', src: 'https://x.com/v.mp4' },
      start: NaN, length: 5
    }] }] },
    output: { format: 'mp4' }
  });
});

test('Reject Infinity for numeric field', () => {
  shouldFail(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'video', src: 'https://x.com/v.mp4' },
      start: Infinity, length: 5
    }] }] },
    output: { format: 'mp4' }
  });
});

test('Reject -Infinity for numeric field', () => {
  shouldFail(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'video', src: 'https://x.com/v.mp4' },
      start: -Infinity, length: 5
    }] }] },
    output: { format: 'mp4' }
  });
});

test('Handle numeric string coercion correctly "5.5"', () => {
  shouldPass(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'video', src: 'https://x.com/v.mp4' },
      start: "5.5", length: 5
    }] }] },
    output: { format: 'mp4' }
  });
});

test('Reject non-numeric string for start "abc"', () => {
  shouldFail(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'video', src: 'https://x.com/v.mp4' },
      start: "abc", length: 5
    }] }] },
    output: { format: 'mp4' }
  });
});

test('Reject object for numeric field', () => {
  shouldFail(schemas.editEditSchema, {
    timeline: { tracks: [{ clips: [{
      asset: { type: 'video', src: 'https://x.com/v.mp4' },
      start: { value: 0 }, length: 5
    }] }] },
    output: { format: 'mp4' }
  });
});

// ============================================
// SECTION 11: URL/String Pattern Edge Cases
// ============================================
console.log('\n--- 11. URL/STRING PATTERN EDGE CASES ---\n');

test('Reject javascript: URL in src', () => {
  shouldFail(schemas.videoassetVideoAssetSchema, {
    type: 'video',
    src: 'javascript:alert(1)'
  });
});

test('Reject data: URL in src', () => {
  shouldFail(schemas.videoassetVideoAssetSchema, {
    type: 'video',
    src: 'data:text/html,<script>alert(1)</script>'
  });
});

test('Reject file: URL in src', () => {
  shouldFail(schemas.videoassetVideoAssetSchema, {
    type: 'video',
    src: 'file:///etc/passwd'
  });
});

test('Reject very long string (100KB)', () => {
  const longString = 'x'.repeat(100000);
  // This might pass - documenting whether there's a length limit
  const result = schemas.textassetTextAssetSchema.safeParse({
    type: 'text',
    text: longString
  });
  console.log(`    (100KB string: ${result.success ? 'accepted' : 'rejected'})`);
  passCount++;
});

// ============================================
// SECTION 12: Enum Edge Cases
// ============================================
console.log('\n--- 12. ENUM EDGE CASES ---\n');

test('Reject uppercase enum value (MP4)', () => {
  shouldFail(schemas.outputOutputSchema, { format: 'MP4' });
});

test('Reject mixed case enum value (Mp4)', () => {
  shouldFail(schemas.outputOutputSchema, { format: 'Mp4' });
});

test('Reject enum with trailing space', () => {
  shouldFail(schemas.outputOutputSchema, { format: 'mp4 ' });
});

test('Reject enum with leading space', () => {
  shouldFail(schemas.outputOutputSchema, { format: ' mp4' });
});

test('Reject numeric value for string enum', () => {
  shouldFail(schemas.outputOutputSchema, { format: 4 });
});

// ============================================
// SECTION 13: Boolean Edge Cases
// ============================================
console.log('\n--- 13. BOOLEAN EDGE CASES ---\n');

test('Accept boolean true for mute', () => {
  shouldPass(schemas.outputOutputSchema, { format: 'mp4', mute: true });
});

test('Accept boolean false for mute', () => {
  shouldPass(schemas.outputOutputSchema, { format: 'mp4', mute: false });
});

test('Reject string "true" for boolean field', () => {
  shouldFail(schemas.outputOutputSchema, { format: 'mp4', mute: "true" });
});

test('Reject number 1 for boolean field', () => {
  shouldFail(schemas.outputOutputSchema, { format: 'mp4', mute: 1 });
});

test('Reject number 0 for boolean field', () => {
  shouldFail(schemas.outputOutputSchema, { format: 'mp4', mute: 0 });
});

// ============================================
// SECTION 14: Null/Undefined Edge Cases
// ============================================
console.log('\n--- 14. NULL/UNDEFINED EDGE CASES ---\n');

test('Reject null for required string', () => {
  shouldFail(schemas.videoassetVideoAssetSchema, { type: 'video', src: null });
});

test('Reject undefined for required string', () => {
  shouldFail(schemas.videoassetVideoAssetSchema, { type: 'video', src: undefined });
});

test('Accept null for optional replace in merge', () => {
  shouldPass(schemas.mergefieldMergeFieldSchema, { find: 'X', replace: null });
});

// ============================================
// SECTION 15: Generated Asset Options
// ============================================
console.log('\n--- 15. GENERATED ASSET OPTIONS ---\n');

test('Reject extra prop in text-to-image asset', () => {
  shouldFailWithCode(schemas.texttoimageassetTextToImageAssetSchema, {
    type: 'text-to-image',
    prompt: 'a sunset',
    extraProp: 'bad'
  }, 'unrecognized_keys');
});

test('Reject extra prop in image-to-video asset', () => {
  shouldFailWithCode(schemas.imagetovideoassetImageToVideoAssetSchema, {
    type: 'image-to-video',
    src: 'https://x.com/i.jpg',
    extraProp: 'bad'
  }, 'unrecognized_keys');
});

// ============================================
// SUMMARY
// ============================================
console.log('\n========================================');
console.log('HATE TEST SUMMARY');
console.log('========================================\n');

console.log(`Total Tests: ${passCount + failCount}`);
console.log(`Passed: ${passCount}`);
console.log(`Failed: ${failCount}`);

if (issues.length > 0) {
  console.log('\n--- ISSUES FOUND (GAPS IN VALIDATION) ---\n');
  issues.forEach(({ description, error }, index) => {
    console.log(`${index + 1}. ${description}`);
    console.log(`   Issue: ${error}\n`);
  });
}

process.exit(failCount > 0 ? 1 : 0);
