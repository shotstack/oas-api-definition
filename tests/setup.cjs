/**
 * Test Setup and Utilities for @shotstack/schemas strict mode validation
 */

const assert = require('node:assert');

/**
 * Helper to check if a parse result failed with unrecognized_keys error
 */
function expectUnrecognizedKeysError(result, expectedKeys = []) {
  assert.strictEqual(result.success, false, 'Expected parse to fail');
  const hasUnrecognizedKeys = result.error.issues.some(
    issue => issue.code === 'unrecognized_keys'
  );
  assert.ok(hasUnrecognizedKeys, `Expected unrecognized_keys error, got: ${JSON.stringify(result.error.issues)}`);

  if (expectedKeys.length > 0) {
    const unrecognizedIssue = result.error.issues.find(i => i.code === 'unrecognized_keys');
    if (unrecognizedIssue && unrecognizedIssue.keys) {
      expectedKeys.forEach(key => {
        assert.ok(
          unrecognizedIssue.keys.includes(key),
          `Expected key '${key}' to be in unrecognized keys: ${JSON.stringify(unrecognizedIssue.keys)}`
        );
      });
    }
  }
}

/**
 * Helper to check if a parse result failed with invalid_enum_value error
 */
function expectInvalidEnumError(result) {
  assert.strictEqual(result.success, false, 'Expected parse to fail');
  const hasInvalidEnum = result.error.issues.some(
    issue => issue.code === 'invalid_enum_value' ||
             issue.code === 'invalid_literal' ||
             issue.code === 'invalid_value' ||  // Zod 4 uses this for enum validation
             (issue.message && (issue.message.includes('Invalid enum value') ||
                               issue.message.includes('Invalid input') ||
                               issue.message.includes('Invalid option')))
  );
  assert.ok(hasInvalidEnum, `Expected invalid enum error, got: ${JSON.stringify(result.error.issues)}`);
}

/**
 * Helper to check that valid data passes
 */
function expectSuccess(result) {
  if (!result.success) {
    console.error('Parse failed with errors:', JSON.stringify(result.error.issues, null, 2));
  }
  assert.strictEqual(result.success, true, `Expected parse to succeed, but got errors: ${JSON.stringify(result.error?.issues)}`);
  return result.data;
}

/**
 * Helper to create test data with an extra property
 */
function withExtraProperty(obj, extraProp = 'unknownExtraProperty', extraValue = 'should_fail') {
  return { ...obj, [extraProp]: extraValue };
}

/**
 * Common valid test data fixtures
 */
const validFixtures = {
  // Minimal valid video asset
  videoAsset: {
    type: 'video',
    src: 'https://example.com/video.mp4'
  },

  // Minimal valid image asset
  imageAsset: {
    type: 'image',
    src: 'https://example.com/image.jpg'
  },

  // Minimal valid text asset
  textAsset: {
    type: 'text',
    text: 'Hello World'
  },

  // Minimal valid audio asset
  audioAsset: {
    type: 'audio',
    src: 'https://example.com/audio.mp3'
  },

  // Minimal valid caption asset
  captionAsset: {
    type: 'caption',
    src: 'https://example.com/captions.srt'
  },

  // Minimal valid HTML asset
  htmlAsset: {
    type: 'html',
    html: '<p>Hello</p>'
  },

  // Minimal valid title asset
  titleAsset: {
    type: 'title',
    text: 'Title Text',
    style: 'minimal'
  },

  // Minimal valid shape asset
  shapeAsset: {
    type: 'shape',
    shape: 'rectangle'
  },

  // Minimal valid SVG asset with shape
  svgAssetWithShape: {
    type: 'svg',
    shape: {
      type: 'rectangle',
      width: 100,
      height: 100
    }
  },

  // Minimal valid SVG asset with src
  svgAssetWithSrc: {
    type: 'svg',
    src: '<svg></svg>'
  },

  // Minimal valid luma asset
  lumaAsset: {
    type: 'luma',
    src: 'https://example.com/luma.mp4'
  },

  // Minimal valid clip
  clip: {
    asset: { type: 'video', src: 'https://example.com/video.mp4' },
    start: 0,
    length: 5
  },

  // Minimal valid track
  track: {
    clips: [
      {
        asset: { type: 'video', src: 'https://example.com/video.mp4' },
        start: 0,
        length: 5
      }
    ]
  },

  // Minimal valid timeline
  timeline: {
    tracks: [
      {
        clips: [
          {
            asset: { type: 'video', src: 'https://example.com/video.mp4' },
            start: 0,
            length: 5
          }
        ]
      }
    ]
  },

  // Minimal valid output
  output: {
    format: 'mp4'
  },

  // Minimal valid edit
  edit: {
    timeline: {
      tracks: [
        {
          clips: [
            {
              asset: { type: 'video', src: 'https://example.com/video.mp4' },
              start: 0,
              length: 5
            }
          ]
        }
      ]
    },
    output: {
      format: 'mp4'
    }
  },

  // Destination fixtures
  shotstackDestination: {
    provider: 'shotstack'
  },

  s3Destination: {
    provider: 's3',
    options: {
      bucket: 'my-bucket',
      region: 'us-east-1'
    }
  },

  muxDestination: {
    provider: 'mux'
  }
};

module.exports = {
  expectUnrecognizedKeysError,
  expectInvalidEnumError,
  expectSuccess,
  withExtraProperty,
  validFixtures
};
