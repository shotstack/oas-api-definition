## [1.9.12](https://github.com/shotstack/oas-api-definition/compare/v1.9.11...v1.9.12) (2026-04-08)


### Bug Fixes

* replaced validation text for rich-caption ([2cf9199](https://github.com/shotstack/oas-api-definition/commit/2cf9199a15ba4dab20bc8d85deab2b23f5a689e7))

## [1.9.11](https://github.com/shotstack/oas-api-definition/compare/v1.9.10...v1.9.11) (2026-04-07)


### Bug Fixes

* src validation for rich-caption ([7c679ad](https://github.com/shotstack/oas-api-definition/commit/7c679ade093188e70d090d86a85db536d4cd27e2))

## [1.9.10](https://github.com/shotstack/oas-api-definition/compare/v1.9.9...v1.9.10) (2026-04-03)


### Bug Fixes

* correct markdown links in captionasset schema ([6a3bc4e](https://github.com/shotstack/oas-api-definition/commit/6a3bc4e8366f48ac75a0c8aab246b3679e4a5c17))

## [1.9.9](https://github.com/shotstack/oas-api-definition/compare/v1.9.8...v1.9.9) (2026-04-02)


### Bug Fixes

* enhance RichCaptionActiveFont schema by adding font family and weight properties, and removing scale property ([05d0a61](https://github.com/shotstack/oas-api-definition/commit/05d0a6121c8ec386cbb29dcd6f8a2cc810abade9))

## [1.9.8](https://github.com/shotstack/oas-api-definition/compare/v1.9.7...v1.9.8) (2026-04-02)


### Bug Fixes

* remove unused SVG shape properties and update nullable types in destination options ([b5dd7e8](https://github.com/shotstack/oas-api-definition/commit/b5dd7e8cea9dc3e0cdb470cc012bc4a6ce5ebeb8))

## [1.9.7](https://github.com/shotstack/oas-api-definition/compare/v1.9.6...v1.9.7) (2026-04-01)


### Bug Fixes

* Removed  Create API intro description, server URL, tag definition, path aliases, all Create schema references, all Create response schema references. ([3ffc4b0](https://github.com/shotstack/oas-api-definition/commit/3ffc4b0009d1fee4a12427015cd750aa6c052962))
* streamline SvgAsset schema by removing shape-related properties and enforcing strict validation ([6b6d08a](https://github.com/shotstack/oas-api-definition/commit/6b6d08a1099f45ca98145a36a519740eba1b40dd))

## [1.9.6](https://github.com/shotstack/oas-api-definition/compare/v1.9.5...v1.9.6) (2026-03-30)


### Bug Fixes

* The edit-api validates with @shotstack/schemas/zod which has the default: "#ffff00". After validation, active.font.color becomes "#ffff00" even though the user didn't set it. Then this passes to the  canvas which sees an explicit yellow and uses it. ([1c26a99](https://github.com/shotstack/oas-api-definition/commit/1c26a994c29425dc6238e5994d367e261d3cf3ac))

## [1.9.5](https://github.com/shotstack/oas-api-definition/compare/v1.9.4...v1.9.5) (2026-03-26)


### Bug Fixes

*  OAS schema updated. RichCaptionActiveFont now has size ([85f051f](https://github.com/shotstack/oas-api-definition/commit/85f051f3afcb098c770a7ff20c153a4143f16e5b))

## [1.9.4](https://github.com/shotstack/oas-api-definition/compare/v1.9.3...v1.9.4) (2026-03-26)


### Bug Fixes

*  fixed the build issue ([d52f7cb](https://github.com/shotstack/oas-api-definition/commit/d52f7cba332afc25da72fa2c4a070134d4fac74d))
* update wordanimation to animation ([f7e6d80](https://github.com/shotstack/oas-api-definition/commit/f7e6d80514f37f05138fd4d6451fb34581f16991))

## [1.9.3](https://github.com/shotstack/oas-api-definition/compare/v1.9.2...v1.9.3) (2026-03-16)


### Bug Fixes

* remove wordspacing from rich-caption ([4955e14](https://github.com/shotstack/oas-api-definition/commit/4955e14e34ce815f06d9415b6e42398c5972997d))

## [1.9.2](https://github.com/shotstack/oas-api-definition/compare/v1.9.1...v1.9.2) (2026-03-16)


### Bug Fixes

* Removed textDecoration from RichCaptionFont and Changed wordAnimation.style default from "karaoke" to "highlight" ([e8601cf](https://github.com/shotstack/oas-api-definition/commit/e8601cf4dd2d1202f15d2bc33a04e0c6632d3ef5))

## [1.9.1](https://github.com/shotstack/oas-api-definition/compare/v1.9.0...v1.9.1) (2026-03-13)


### Bug Fixes

*  added none for shadow and stroke and removed speed ([3370824](https://github.com/shotstack/oas-api-definition/commit/3370824033f594785cfd3a8a0491d6a46130f66c))

# [1.9.0](https://github.com/shotstack/oas-api-definition/compare/v1.8.7...v1.9.0) (2026-03-12)


### Bug Fixes

* Add type-based fallback release rules for conventional commits ([a4e8128](https://github.com/shotstack/oas-api-definition/commit/a4e812809f6622aa04d88a257e5a87737702fee0))
* added shadow and textdecorations ([ee84599](https://github.com/shotstack/oas-api-definition/commit/ee84599ce0d51c51eb31b0a27c0f1d6578a6cbb3))
* enable OIDC provenance for npm publish ([2c149bf](https://github.com/shotstack/oas-api-definition/commit/2c149bfed4720a2ed275c40f7c616f2de2067df5))
* publishing package ([64780d4](https://github.com/shotstack/oas-api-definition/commit/64780d44d8b4567994dcd9d080dd2f91e0d20e27))


### Features

* Add concurrency control to the workflow  queues releases so they run one at a time ([4c7c973](https://github.com/shotstack/oas-api-definition/commit/4c7c973150b3c4a9c947dbdd9adea714a63ef9d6))
