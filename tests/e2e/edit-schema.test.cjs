/**
 * E2E Tests for Edit Schema - Full schema validation with real-world payloads
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const schemas = require('../../dist/zod/zod.gen.cjs');
const { expectSuccess, expectUnrecognizedKeysError } = require('../setup.cjs');

describe('E2E - Edit Schema Complete Validation', () => {

  describe('Minimal Valid Edit', () => {

    it('accepts minimal valid edit with video asset', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'video', src: 'https://example.com/video.mp4' },
              start: 0,
              length: 5
            }]
          }]
        },
        output: { format: 'mp4' }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      expectSuccess(result);
    });

    it('accepts minimal valid edit with image asset', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'image', src: 'https://example.com/image.jpg' },
              start: 0,
              length: 5
            }]
          }]
        },
        output: { format: 'mp4' }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      expectSuccess(result);
    });

    it('accepts minimal valid edit with text asset', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'text', text: 'Hello World' },
              start: 0,
              length: 5
            }]
          }]
        },
        output: { format: 'mp4' }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      expectSuccess(result);
    });
  });

  describe('Complex Valid Edits', () => {

    it('accepts edit with multiple tracks', () => {
      const edit = {
        timeline: {
          tracks: [
            {
              clips: [{
                asset: { type: 'video', src: 'https://example.com/video.mp4' },
                start: 0,
                length: 10
              }]
            },
            {
              clips: [{
                asset: { type: 'text', text: 'Overlay Text' },
                start: 2,
                length: 5
              }]
            },
            {
              clips: [{
                asset: { type: 'audio', src: 'https://example.com/music.mp3' },
                start: 0,
                length: 10
              }]
            }
          ]
        },
        output: { format: 'mp4', resolution: 'hd' }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      expectSuccess(result);
    });

    it('accepts edit with multiple clips per track', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [
              {
                asset: { type: 'video', src: 'https://example.com/video1.mp4' },
                start: 0,
                length: 5
              },
              {
                asset: { type: 'video', src: 'https://example.com/video2.mp4' },
                start: 5,
                length: 5
              },
              {
                asset: { type: 'video', src: 'https://example.com/video3.mp4' },
                start: 10,
                length: 5
              }
            ]
          }]
        },
        output: { format: 'mp4' }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      expectSuccess(result);
    });

    it('accepts edit with all output options', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'video', src: 'https://example.com/video.mp4' },
              start: 0,
              length: 5
            }]
          }]
        },
        output: {
          format: 'mp4',
          resolution: '1080',
          quality: 'high',
          fps: 30,
          scaleTo: 'preview',
          repeat: false
        }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      expectSuccess(result);
    });

    it('accepts edit with clip positioning and effects', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'video', src: 'https://example.com/video.mp4' },
              start: 0,
              length: 5,
              position: 'center',
              fit: 'cover',
              scale: 1.0,
              opacity: 1.0
            }]
          }]
        },
        output: { format: 'mp4' }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      expectSuccess(result);
    });

    it('accepts edit with timeline background', () => {
      const edit = {
        timeline: {
          background: '#000000',
          tracks: [{
            clips: [{
              asset: { type: 'video', src: 'https://example.com/video.mp4' },
              start: 0,
              length: 5
            }]
          }]
        },
        output: { format: 'mp4' }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      expectSuccess(result);
    });

    it('accepts edit with merge fields', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'text', text: '{{NAME}}' },
              start: 0,
              length: 5
            }]
          }]
        },
        output: { format: 'mp4' },
        merge: [
          { find: 'NAME', replace: 'John Doe' }
        ]
      };
      const result = schemas.editEditSchema.safeParse(edit);
      expectSuccess(result);
    });

    it('accepts edit with destinations', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'video', src: 'https://example.com/video.mp4' },
              start: 0,
              length: 5
            }]
          }]
        },
        output: {
          format: 'mp4',
          destinations: [
            { provider: 'shotstack' },
            { provider: 's3', options: { bucket: 'my-bucket', region: 'us-east-1' } }
          ]
        }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      expectSuccess(result);
    });

    it('accepts edit with callback URL', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'video', src: 'https://example.com/video.mp4' },
              start: 0,
              length: 5
            }]
          }]
        },
        output: { format: 'mp4' },
        callback: 'https://example.com/webhook'
      };
      const result = schemas.editEditSchema.safeParse(edit);
      expectSuccess(result);
    });
  });

  describe('Invalid Edits - Missing Required Fields', () => {

    it('rejects edit without timeline', () => {
      const edit = {
        output: { format: 'mp4' }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      assert.strictEqual(result.success, false);
    });

    it('rejects edit without output', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'video', src: 'https://example.com/video.mp4' },
              start: 0,
              length: 5
            }]
          }]
        }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      assert.strictEqual(result.success, false);
    });

    it('rejects edit without tracks', () => {
      const edit = {
        timeline: {},
        output: { format: 'mp4' }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      assert.strictEqual(result.success, false);
    });

    it('rejects clip without asset', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              start: 0,
              length: 5
            }]
          }]
        },
        output: { format: 'mp4' }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      assert.strictEqual(result.success, false);
    });

    it('rejects clip without start', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'video', src: 'https://example.com/video.mp4' },
              length: 5
            }]
          }]
        },
        output: { format: 'mp4' }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      assert.strictEqual(result.success, false);
    });

    it('rejects clip without length', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'video', src: 'https://example.com/video.mp4' },
              start: 0
            }]
          }]
        },
        output: { format: 'mp4' }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      assert.strictEqual(result.success, false);
    });
  });

  describe('Invalid Edits - Extra Properties', () => {

    it('rejects edit with extra property at top level', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'video', src: 'https://example.com/video.mp4' },
              start: 0,
              length: 5
            }]
          }]
        },
        output: { format: 'mp4' },
        extraProp: 'should fail'
      };
      expectUnrecognizedKeysError(schemas.editEditSchema.safeParse(edit));
    });

    it('rejects edit with extra property in timeline', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'video', src: 'https://example.com/video.mp4' },
              start: 0,
              length: 5
            }]
          }],
          extraProp: 'should fail'
        },
        output: { format: 'mp4' }
      };
      expectUnrecognizedKeysError(schemas.editEditSchema.safeParse(edit));
    });

    it('rejects edit with extra property in track', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'video', src: 'https://example.com/video.mp4' },
              start: 0,
              length: 5
            }],
            extraProp: 'should fail'
          }]
        },
        output: { format: 'mp4' }
      };
      expectUnrecognizedKeysError(schemas.editEditSchema.safeParse(edit));
    });

    it('rejects edit with extra property in clip', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'video', src: 'https://example.com/video.mp4' },
              start: 0,
              length: 5,
              extraProp: 'should fail'
            }]
          }]
        },
        output: { format: 'mp4' }
      };
      expectUnrecognizedKeysError(schemas.editEditSchema.safeParse(edit));
    });

    it('rejects edit with extra property in asset', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: {
                type: 'video',
                src: 'https://example.com/video.mp4',
                extraProp: 'should fail'
              },
              start: 0,
              length: 5
            }]
          }]
        },
        output: { format: 'mp4' }
      };
      expectUnrecognizedKeysError(schemas.editEditSchema.safeParse(edit));
    });

    it('rejects edit with extra property in output', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'video', src: 'https://example.com/video.mp4' },
              start: 0,
              length: 5
            }]
          }]
        },
        output: { format: 'mp4', extraProp: 'should fail' }
      };
      expectUnrecognizedKeysError(schemas.editEditSchema.safeParse(edit));
    });

    it('rejects edit with extra property in merge field', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'text', text: '{{NAME}}' },
              start: 0,
              length: 5
            }]
          }]
        },
        output: { format: 'mp4' },
        merge: [
          { find: 'NAME', replace: 'John', extraProp: 'should fail' }
        ]
      };
      expectUnrecognizedKeysError(schemas.editEditSchema.safeParse(edit));
    });
  });

  describe('Invalid Edits - Wrong Types', () => {

    it('rejects edit with string instead of timeline object', () => {
      const edit = {
        timeline: 'invalid',
        output: { format: 'mp4' }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      assert.strictEqual(result.success, false);
    });

    it('rejects edit with number instead of tracks array', () => {
      const edit = {
        timeline: { tracks: 123 },
        output: { format: 'mp4' }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      assert.strictEqual(result.success, false);
    });

    it('rejects edit with string instead of start number', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'video', src: 'https://example.com/video.mp4' },
              start: 'zero',
              length: 5
            }]
          }]
        },
        output: { format: 'mp4' }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      assert.strictEqual(result.success, false);
    });

    it('rejects edit with invalid asset type', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'invalid', src: 'https://example.com/file.mp4' },
              start: 0,
              length: 5
            }]
          }]
        },
        output: { format: 'mp4' }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      assert.strictEqual(result.success, false);
    });

    it('rejects edit with invalid output format', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'video', src: 'https://example.com/video.mp4' },
              start: 0,
              length: 5
            }]
          }]
        },
        output: { format: 'avi' }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      assert.strictEqual(result.success, false);
    });
  });

  describe('Edge Cases', () => {

    it('rejects empty clips array (min 1 required)', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: []
          }]
        },
        output: { format: 'mp4' }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      assert.strictEqual(result.success, false);
    });

    it('accepts edit with zero start time', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'video', src: 'https://example.com/video.mp4' },
              start: 0,
              length: 5
            }]
          }]
        },
        output: { format: 'mp4' }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      expectSuccess(result);
    });

    it('accepts edit with very small length', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'video', src: 'https://example.com/video.mp4' },
              start: 0,
              length: 0.001
            }]
          }]
        },
        output: { format: 'mp4' }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      expectSuccess(result);
    });

    it('accepts edit with null merge field replace value', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'text', text: '{{VALUE}}' },
              start: 0,
              length: 5
            }]
          }]
        },
        output: { format: 'mp4' },
        merge: [
          { find: 'VALUE', replace: null }
        ]
      };
      const result = schemas.editEditSchema.safeParse(edit);
      expectSuccess(result);
    });
  });

  describe('Real-World Payload Examples', () => {

    it('accepts typical video editing payload', () => {
      const edit = {
        timeline: {
          background: '#000000',
          tracks: [
            {
              clips: [
                {
                  asset: { type: 'video', src: 'https://cdn.example.com/intro.mp4' },
                  start: 0,
                  length: 3
                },
                {
                  asset: { type: 'video', src: 'https://cdn.example.com/main.mp4' },
                  start: 3,
                  length: 10
                },
                {
                  asset: { type: 'video', src: 'https://cdn.example.com/outro.mp4' },
                  start: 13,
                  length: 2
                }
              ]
            },
            {
              clips: [
                {
                  asset: { type: 'title', text: 'Welcome', style: 'minimal' },
                  start: 0,
                  length: 3,
                  position: 'center'
                }
              ]
            },
            {
              clips: [
                {
                  asset: { type: 'audio', src: 'https://cdn.example.com/bgm.mp3' },
                  start: 0,
                  length: 15
                }
              ]
            }
          ]
        },
        output: {
          format: 'mp4',
          resolution: '1080',
          quality: 'high'
        }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      expectSuccess(result);
    });

    it('accepts slideshow creation payload', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [
              {
                asset: { type: 'image', src: 'https://cdn.example.com/slide1.jpg' },
                start: 0,
                length: 3,
                fit: 'cover'
              },
              {
                asset: { type: 'image', src: 'https://cdn.example.com/slide2.jpg' },
                start: 3,
                length: 3,
                fit: 'cover'
              },
              {
                asset: { type: 'image', src: 'https://cdn.example.com/slide3.jpg' },
                start: 6,
                length: 3,
                fit: 'cover'
              }
            ]
          }]
        },
        output: {
          format: 'mp4',
          resolution: 'hd'
        }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      expectSuccess(result);
    });

    it('accepts GIF export payload', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'video', src: 'https://cdn.example.com/clip.mp4' },
              start: 0,
              length: 5
            }]
          }]
        },
        output: {
          format: 'gif',
          resolution: 'preview',
          fps: 15
        }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      expectSuccess(result);
    });

    it('accepts audio-only export payload', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'audio', src: 'https://cdn.example.com/podcast.mp3' },
              start: 0,
              length: 60
            }]
          }]
        },
        output: {
          format: 'mp3'
        }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      expectSuccess(result);
    });

    it('accepts thumbnail export payload', () => {
      const edit = {
        timeline: {
          tracks: [{
            clips: [{
              asset: { type: 'video', src: 'https://cdn.example.com/video.mp4' },
              start: 5,
              length: 1
            }]
          }]
        },
        output: {
          format: 'jpg',
          resolution: 'hd'
        }
      };
      const result = schemas.editEditSchema.safeParse(edit);
      expectSuccess(result);
    });
  });
});
