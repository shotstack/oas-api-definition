# @shotstack/schemas

Centralized OpenAPI schemas and TypeScript types for the Shotstack API.

## Installation

```bash
npm install @shotstack/schemas zod
```

## Usage

### TypeScript Types

```typescript
import type { components } from '@shotstack/schemas';

type Edit = components['schemas']['Edit'];
type Timeline = components['schemas']['Timeline'];
type Clip = components['schemas']['Clip'];
type Output = components['schemas']['Output'];
```

### Zod Schemas

```typescript
import { z } from 'zod';
import { richTextAssetSchema, editSchema, timelineSchema } from '@shotstack/schemas/zod';

const result = richTextAssetSchema.safeParse(inputData);
if (result.success) {
  console.log(result.data);
}
```

### Extending Schemas

```typescript
import { z } from 'zod';
import { richTextAssetSchema } from '@shotstack/schemas/zod';

const ExtendedAsset = richTextAssetSchema.extend({
  customFonts: z.array(z.object({
    src: z.string().url(),
    family: z.string(),
  })).optional(),
  border: z.object({
    width: z.number().min(0),
    color: z.string(),
  }).optional(),
});

type ExtendedAssetType = z.infer<typeof ExtendedAsset>;
```

### Custom Validation

```typescript
import { richTextAnimationSchema } from '@shotstack/schemas/zod';

const AnimationWithDirection = richTextAnimationSchema.refine(
  (data) => {
    if (data.preset === 'slideIn' && !data.direction) {
      return false;
    }
    return true;
  },
  { message: 'direction is required for slideIn preset' }
);
```

## Available Schemas

- Edit, Timeline, Track, Clip, Output
- Assets: VideoAsset, ImageAsset, AudioAsset, HtmlAsset, TextAsset, TitleAsset, LumaAsset, CaptionAsset, ShapeAsset, RichTextAsset
- Destinations: ShotstackDestination, S3Destination, MuxDestination, VimeoDestination, GoogleDriveDestination, GoogleCloudStorageDestination
- Transforms, Transitions, Fonts, MergeFields, and more

## Development

```bash
pnpm install
pnpm run build
pnpm run test
```

## License

MIT
