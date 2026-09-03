## [1.18.3](https://github.com/shotstack/oas-api-definition/compare/v1.18.2...v1.18.3) (2026-09-03)


### Bug Fixes

* name generation models that the catalogue actually offers ([e64a591](https://github.com/shotstack/oas-api-definition/commit/e64a5919055010ba9806e66cce90128d3e6e035e))

## [1.18.2](https://github.com/shotstack/oas-api-definition/compare/v1.18.1...v1.18.2) (2026-09-01)


### Bug Fixes

* describe how a generation's cost is calculated ([367c995](https://github.com/shotstack/oas-api-definition/commit/367c995a7012adf2a2dccfbade1b59e4b8cc6ee1))

## [1.18.1](https://github.com/shotstack/oas-api-definition/compare/v1.18.0...v1.18.1) (2026-08-29)


### Bug Fixes

* deprecate CaptionAsset and add generating status ([d213946](https://github.com/shotstack/oas-api-definition/commit/d213946a55d578af098cf6e63e9a89feac77afe1))

# [1.18.0](https://github.com/shotstack/oas-api-definition/compare/v1.17.0...v1.18.0) (2026-08-24)


### Features

* publish generation model catalogue schemas ([d9b9a35](https://github.com/shotstack/oas-api-definition/commit/d9b9a35d4d1791292051a81cef38e9c66e1b97d3))

# [1.17.0](https://github.com/shotstack/oas-api-definition/compare/v1.16.0...v1.17.0) (2026-08-14)


### Features

* add italic font style schemas ([60f150e](https://github.com/shotstack/oas-api-definition/commit/60f150ec0746ba92e7d466bcd0e82d969fb19166))

# [1.16.0](https://github.com/shotstack/oas-api-definition/compare/v1.15.1...v1.16.0) (2026-08-12)


### Features

* default generative assets to the current best models ([7a1c10f](https://github.com/shotstack/oas-api-definition/commit/7a1c10f16b3f3150ff6c74b7ba83346ee2dd5dd1))
* model-scoped options object for generative assets ([f521bb7](https://github.com/shotstack/oas-api-definition/commit/f521bb7ccb33ebf8516018a575937da4ade89409))

## [1.15.1](https://github.com/shotstack/oas-api-definition/compare/v1.15.0...v1.15.1) (2026-08-11)


### Bug Fixes

* inline JSON data in /json barrels so CJS bundlers don't hit createRequire(import.meta.url) ([c9d4529](https://github.com/shotstack/oas-api-definition/commit/c9d4529787ade9f991fd8403521121c4b834b7ce))

# [1.15.0](https://github.com/shotstack/oas-api-definition/compare/v1.14.1...v1.15.0) (2026-08-11)


### Features

* full-fidelity Edit JSON Schema; deprecate text and soundtrack, point html/title at rich-text ([0e6b3cc](https://github.com/shotstack/oas-api-definition/commit/0e6b3cc26462a7c00db8aea39e69b0b48377b320))

## [1.14.1](https://github.com/shotstack/oas-api-definition/compare/v1.14.0...v1.14.1) (2026-07-17)


### Bug Fixes

* make google-drive destination options and folderId optional, saving to My Drive root when omitted ([1b3af08](https://github.com/shotstack/oas-api-definition/commit/1b3af08721ffa627b8c29216036823aebc18b686))

# [1.14.0](https://github.com/shotstack/oas-api-definition/compare/v1.13.3...v1.14.0) (2026-07-06)


### Features

* enhance audio, image, and video asset schemas with new properties for music generation, resolution, duration, and aspect ratio ([0cf6650](https://github.com/shotstack/oas-api-definition/commit/0cf6650a3d1ded027edf2d68b432f05a219303d7))

## [1.13.3](https://github.com/shotstack/oas-api-definition/compare/v1.13.2...v1.13.3) (2026-07-01)


### Bug Fixes

* remove deprecated 'seed' field from video asset schema and update tests ([ff7a689](https://github.com/shotstack/oas-api-definition/commit/ff7a6897f37fa650460fae50eabb3d02f4880521))

## [1.13.2](https://github.com/shotstack/oas-api-definition/compare/v1.13.1...v1.13.2) (2026-06-16)


### Bug Fixes

* update references from 'seed' to 'inputSrc' in video asset schemas and tests ([db8e75a](https://github.com/shotstack/oas-api-definition/commit/db8e75ad60243744c626d05459134c1c2b809403))

## [1.13.1](https://github.com/shotstack/oas-api-definition/compare/v1.13.0...v1.13.1) (2026-06-09)


### Bug Fixes

* enforce resolution/size constraint on output schema for non-mp3 formats ([b2890c3](https://github.com/shotstack/oas-api-definition/commit/b2890c377d9e9f68c689a07ff600063863e15373))

# [1.13.0](https://github.com/shotstack/oas-api-definition/compare/v1.12.2...v1.13.0) (2026-06-01)


### Features

* enhance asset schemas with prompt support and deprecate legacy types ([8385beb](https://github.com/shotstack/oas-api-definition/commit/8385beb42bdf0015dede545b10f4e370cbbd4c61))
* implement src-or-prompt validation for media asset schemas ([6a2f3a7](https://github.com/shotstack/oas-api-definition/commit/6a2f3a76a57f6f1c98195a9e7012df125115750a))

## [1.12.2](https://github.com/shotstack/oas-api-definition/compare/v1.12.1...v1.12.2) (2026-05-21)

## [1.12.1](https://github.com/shotstack/oas-api-definition/compare/v1.12.0...v1.12.1) (2026-05-18)


### Bug Fixes

* update descriptions and add maxLength constraints for Html5Asset properties ([2cfdc24](https://github.com/shotstack/oas-api-definition/commit/2cfdc24850c1d26d583d9f975dbed9e7fb9a6fdc))

# [1.12.0](https://github.com/shotstack/oas-api-definition/compare/v1.11.0...v1.12.0) (2026-05-18)


### Features

* add optional client-generated identifier to Clip schema ([d1b8ef1](https://github.com/shotstack/oas-api-definition/commit/d1b8ef119dbe7030f8f2674cfebca00f74937a58))

# [1.11.0](https://github.com/shotstack/oas-api-definition/compare/v1.10.10...v1.11.0) (2026-05-12)


### Features

* add Html5Asset for HTML5/CSS3/JS rendering ([79854a5](https://github.com/shotstack/oas-api-definition/commit/79854a5a2a1e5a0718a3246066eb05fa17a82bac))

## [1.10.10](https://github.com/shotstack/oas-api-definition/compare/v1.10.9...v1.10.10) (2026-05-06)

## [1.10.9](https://github.com/shotstack/oas-api-definition/compare/v1.10.8...v1.10.9) (2026-04-15)


### Bug Fixes

* Added wrap as an accepted optional boolean on TextBackground with a description explaining it exists purely so validators can emit a clear migration error. ([a049cb2](https://github.com/shotstack/oas-api-definition/commit/a049cb2f04defb1c77ab29e2797d508a4a8d536a))

## [1.10.8](https://github.com/shotstack/oas-api-definition/compare/v1.10.7...v1.10.8) (2026-04-15)


### Bug Fixes

* remove src validation for rich-caption ([55bb8a2](https://github.com/shotstack/oas-api-definition/commit/55bb8a21106beb2f3bb3c5e1bce0780413c99959))

## [1.10.7](https://github.com/shotstack/oas-api-definition/compare/v1.10.6...v1.10.7) (2026-04-11)


### Bug Fixes

* add  wrap  to rich-text  and rich-caption ([f570b2e](https://github.com/shotstack/oas-api-definition/commit/f570b2e9569f134cbf872f46659e09dc2338fa03))

## [1.10.6](https://github.com/shotstack/oas-api-definition/compare/v1.10.5...v1.10.6) (2026-04-08)


### Bug Fixes

* node file cleanup ([3b9bc8e](https://github.com/shotstack/oas-api-definition/commit/3b9bc8ee735c0676d0140b03adc6a5498cba13bd))

## [1.10.5](https://github.com/shotstack/oas-api-definition/compare/v1.10.4...v1.10.5) (2026-04-08)


### Bug Fixes

* typescript sdk fixed ([5c216cf](https://github.com/shotstack/oas-api-definition/commit/5c216cfc0a24461ac6e6aa0a0a27c048a0752877))

## [1.10.4](https://github.com/shotstack/oas-api-definition/compare/v1.10.3...v1.10.4) (2026-04-08)


### Bug Fixes

* --template-dir added back to PHP/Python/Ruby scripts (config templateDir resolves relative to config file, not CWD) ([f5dda2d](https://github.com/shotstack/oas-api-definition/commit/f5dda2d45483312b38de5aa2a8e7a9d2b53aa90f))

## [1.10.3](https://github.com/shotstack/oas-api-definition/compare/v1.10.2...v1.10.3) (2026-04-08)


### Bug Fixes

* test and verified all test cases for all sdks ([aeb9625](https://github.com/shotstack/oas-api-definition/commit/aeb9625fc3be3c236cfa317bcdf3442f71eda3e2))

## [1.10.2](https://github.com/shotstack/oas-api-definition/compare/v1.10.1...v1.10.2) (2026-04-08)


### Bug Fixes

* workflow pipeline issue resolved ([aa32a3f](https://github.com/shotstack/oas-api-definition/commit/aa32a3fb16801b06b5667637c31b09af7efe8245))

## [1.10.1](https://github.com/shotstack/oas-api-definition/compare/v1.10.0...v1.10.1) (2026-04-08)


### Bug Fixes

* add TypeScript SDK to regeneration pipeline ([cd66165](https://github.com/shotstack/oas-api-definition/commit/cd6616577f20f9020b5cc99e8a1a726b0ea2d775))

# [1.10.0](https://github.com/shotstack/oas-api-definition/compare/v1.9.12...v1.10.0) (2026-04-08)


### Features

* add automated SDK regeneration pipeline ([54bca25](https://github.com/shotstack/oas-api-definition/commit/54bca25e036bb856456bbec80b167c47d81f4751))

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
