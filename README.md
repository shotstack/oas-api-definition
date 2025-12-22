# @shotstack/schemas

Centralized OpenAPI schemas and TypeScript types for the Shotstack API.

## Installation

```bash
npm install @shotstack/schemas
```

## Usage

```typescript
import type { components } from '@shotstack/schemas';

type Edit = components['schemas']['Edit'];
type Timeline = components['schemas']['Timeline'];
type Clip = components['schemas']['Clip'];
type Output = components['schemas']['Output'];
```

## Available Types

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
