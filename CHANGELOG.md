## [1.3.3](https://github.com/infiniteuny/infinity-frontend/compare/v1.3.2...v1.3.3) (2026-06-16)


### Bug Fixes

* **component:** Add back url to related entity lists ([3fc5b70](https://github.com/infiniteuny/infinity-frontend/commit/3fc5b709fc11c7eb937084854b23c88734db8ddc))
* **component:** Add back URL to the entity list that on settings ([ed099ba](https://github.com/infiniteuny/infinity-frontend/commit/ed099bacd3cdeeabd4ea9c8ac091b19f27686453))
* **component:** Reorder code column after name on degree list ([1491424](https://github.com/infiniteuny/infinity-frontend/commit/149142475c704154125df39247adca4629b65216))



## [1.3.2](https://github.com/infiniteuny/infinity-frontend/compare/v1.3.1...v1.3.2) (2026-06-16)


### Bug Fixes

* **component:** Fix typo on achievement permission checking ([3ce80cf](https://github.com/infiniteuny/infinity-frontend/commit/3ce80cf3fa078005361f4715035c1a4975de7791))
* **component:** Track pagination state changes on entity list ([5c90315](https://github.com/infiniteuny/infinity-frontend/commit/5c90315698c16e4802ccfecf7bd139d119d8dadf))
* **route:** Add missing team member include on achievement and fund app route initial fetch ([8e244c7](https://github.com/infiniteuny/infinity-frontend/commit/8e244c7a38b4690b8315b150bb936f4de46a1438))



## [1.3.1](https://github.com/infiniteuny/infinity-frontend/compare/v1.2.0...v1.3.1) (2026-06-15)


### Bug Fixes

* **workflow:** Use the new committed version and changelog on prod release ([1085454](https://github.com/infiniteuny/infinity-frontend/commit/108545406ebff1ede7c5350a0788605a37fc9d5d))



# 1.3.0-alpha.2 (2026-06-15)


### Bug Fixes

* **component:** Add aria-label to icon button component on header ([b14ac15](https://github.com/infiniteuny/infinity-frontend/commit/b14ac15ba4fd22d031ccec44e8ab45f12465a30a))
* **component:** Change transition to be only with the transform/width related ([7601dc5](https://github.com/infiniteuny/infinity-frontend/commit/7601dc5075151e8c055247055fb2eab66c4e45fe))
* **component:** Fix autocomplete filter input to reload selected option on reopen ([296f8bb](https://github.com/infiniteuny/infinity-frontend/commit/296f8bb83dd232069ab5cad545206df812f6f33c))
* **component:** Fix date timezone on render and input ([7a91a66](https://github.com/infiniteuny/infinity-frontend/commit/7a91a660dc3d4cb3b241f52d3ecb86784cfcdd0b))
* **component:** Fix footer left margin on sidebar extended ([42ee9e0](https://github.com/infiniteuny/infinity-frontend/commit/42ee9e05a207f95ca123f06ac1cde016a759ed83))
* **component:** Fix initial sort and filter state to include empty array for both ([485b2bb](https://github.com/infiniteuny/infinity-frontend/commit/485b2bb3ea75671569a64b48f21926506f063e75))
* **component:** Move background CSS to body instead of html element ([6494b99](https://github.com/infiniteuny/infinity-frontend/commit/6494b99c604bd202012f1453bd0d2f01c88f676d))
* **component:** Track sort and filter state to prevent unnecessary reload when no changes ([dbcf9d6](https://github.com/infiniteuny/infinity-frontend/commit/dbcf9d63f736d9e451f50eb7013ada049f42d105))
* **datasource:** Fix better-auth account cookie max-age to 2 hours ([079ad15](https://github.com/infiniteuny/infinity-frontend/commit/079ad15d8d82e61057137b8f95fa92e12959b397))
* **deps:** update non-major dependencies ([#665](https://github.com/infiniteuny/infinity-frontend/issues/665)) ([5ad0e3f](https://github.com/infiniteuny/infinity-frontend/commit/5ad0e3fe153113c3cda9473b3da110c63bbe105a))
* **deps:** update non-major dependencies ([#670](https://github.com/infiniteuny/infinity-frontend/issues/670)) ([c3b686c](https://github.com/infiniteuny/infinity-frontend/commit/c3b686c2ae6b4a5ecc039eaca9a8a1ab1431ed96))
* **deps:** update non-major dependencies to v0.35.0 ([#668](https://github.com/infiniteuny/infinity-frontend/issues/668)) ([5be5f00](https://github.com/infiniteuny/infinity-frontend/commit/5be5f00a9f19a69a50ae9a2b58cb91b8cd8ef202))
* **docker:** Use prefer offline for npm ci command ([4266652](https://github.com/infiniteuny/infinity-frontend/commit/426665245743fdcdf2bbf39b2eac466244d10ee6))
* Ignore beads ([433dd92](https://github.com/infiniteuny/infinity-frontend/commit/433dd92ff4054c3cc70c8f7422c1eb1c7d3c1c36))
* **usecase:** Call get access token first on get session ([c5db84d](https://github.com/infiniteuny/infinity-frontend/commit/c5db84d64bead8a1644a8f67bfe096cd0e5d463b))


### Features

* **component:** Add filter for relation ID on entity lists ([f4fe169](https://github.com/infiniteuny/infinity-frontend/commit/f4fe169a0b13cc9d7a577f5306db0c89176a17b6))
* **component:** Add INFINITE logo with text ([ae5f4d4](https://github.com/infiniteuny/infinity-frontend/commit/ae5f4d4af1569a20b381ab9c2926ae54ea3c7bc9))
* **component:** Add initial complete sort and filter options ([b31c719](https://github.com/infiniteuny/infinity-frontend/commit/b31c7199599a78cdafd1c80acbfe730eb167cf95))
* **component:** Add search button to lists' toolbar ([efa8403](https://github.com/infiniteuny/infinity-frontend/commit/efa8403461ff4e3716b786a726aa2e5a78017d2e))
* **repository:** Add more complete sort options to all repository ([3905692](https://github.com/infiniteuny/infinity-frontend/commit/3905692c257a2c624aea027c8cc98b0a001fdb27))
* **workflow:** Use multijob with matrix for native arm64 docker build ([1525bef](https://github.com/infiniteuny/infinity-frontend/commit/1525bef75ded09ce131e13e3277f71c1a9d2af30))



# [1.2.0](https://github.com/infiniteuny/infinity-frontend/compare/v1.1.0...v1.2.0) (2026-06-09)


### Bug Fixes

* **component:** Add permission checking on edit button ([de3fb14](https://github.com/infiniteuny/infinity-frontend/commit/de3fb14eea92ea5220e407f0268b04461ef0920a))
* **component:** Avoid useEffect to set state ([501d8b8](https://github.com/infiniteuny/infinity-frontend/commit/501d8b8a72c383a440620ec9ab32b11da7267441))
* **component:** Fix component on MUI v9 ([0cf7cd0](https://github.com/infiniteuny/infinity-frontend/commit/0cf7cd096acdb5cdc7b1db9c5acc5754ae1157bf))
* **deps:** update major dependencies ([56128f3](https://github.com/infiniteuny/infinity-frontend/commit/56128f37df400b250fccd0b7f452a9f06e189b1d))
* **deps:** update non-major dependencies ([883e72b](https://github.com/infiniteuny/infinity-frontend/commit/883e72bfa1ded0d7f4c2aba2a3292c96316e24c0))
* **workfllow:** Set fetch depth to 0 so changelog builder can works correctly ([e401039](https://github.com/infiniteuny/infinity-frontend/commit/e4010397ea39b42120f4ed2f76946e4d9cf8528a))


### Features

* **component:** Update nested user property component to be used to profile page ([1f61259](https://github.com/infiniteuny/infinity-frontend/commit/1f61259ce91b810ff599f98e648df055cb26f14b))
* **route:** Add nested user property route to profile page ([e7a809f](https://github.com/infiniteuny/infinity-frontend/commit/e7a809f771792e00faa4bd61cf9e5451e06456cf))



# [1.1.0](https://github.com/infiniteuny/infinity-frontend/compare/v1.0.0...v1.1.0) (2026-06-08)


### Bug Fixes

* **component:** Change list loading overlay to skeleton ([3c30b45](https://github.com/infiniteuny/infinity-frontend/commit/3c30b45f484538611f1835f31579dd79ddad1a47))
* **component:** Change main component to use flex ([6238358](https://github.com/infiniteuny/infinity-frontend/commit/623835822c03ef5bd5302276854aa47afe10e184))
* **component:** Fix clickable view tile component to use Link for URL ([60b741d](https://github.com/infiniteuny/infinity-frontend/commit/60b741daaf25e3f9ea1e547d33075ee8bba05bc1))
* **component:** Fix core team and cg admin member's animation tile ([1c8b28b](https://github.com/infiniteuny/infinity-frontend/commit/1c8b28bb9765b9405238077221a8e5d38e9b2496))
* **component:** Hide status field on achievement and fund app form based on user permission ([dfecf32](https://github.com/infiniteuny/infinity-frontend/commit/dfecf32efa4db5d2f0262ae60101a6a8849b2808))
* **component:** Use shortname for all competition related name if available ([f52f3a9](https://github.com/infiniteuny/infinity-frontend/commit/f52f3a9d763b2c4c917a13f8709de443f4e43e2f))
* **datasource:** Move better-auth nextCookie plugin to the latest ([23e7a4e](https://github.com/infiniteuny/infinity-frontend/commit/23e7a4e8f496e13e3fe5934b1798be819efbdb73))
* **deps:** update dependency better-auth to v1.6.11 [security] ([#663](https://github.com/infiniteuny/infinity-frontend/issues/663)) ([8edbe50](https://github.com/infiniteuny/infinity-frontend/commit/8edbe5057b53865212d4ed63d251ed1ab8f752ac))
* **entity:** Allow user date filter to be null (for empty and not empty) ([a558879](https://github.com/infiniteuny/infinity-frontend/commit/a5588794ebc93da61adf47362a5ffb39451038f8))
* **entity:** Do not allow null value on create and update date filter ([b328d97](https://github.com/infiniteuny/infinity-frontend/commit/b328d97d0faf4da0b7e4ff3819a6a3f6250bc66d))
* **favicon:** Move to route folder ([e7278e3](https://github.com/infiniteuny/infinity-frontend/commit/e7278e3a14d9a26dc06bb6ecceed2b2f6e768f7c))
* **layout:** Remove favicon from metadata ([f52ac3e](https://github.com/infiniteuny/infinity-frontend/commit/f52ac3e17d30ba17eada02719e2f9b055b560a40))
* **proxy:** Remove logout from unproxied path ([36e04be](https://github.com/infiniteuny/infinity-frontend/commit/36e04befe0985fddf0ca2e4464547ecb77fbc3de))
* **repository:** Fix user date filter repo implementation ([b943d97](https://github.com/infiniteuny/infinity-frontend/commit/b943d97e756dbd4c59fe16aca8d4ee482b00e934))
* **route:** Move global error template to root ([e39730e](https://github.com/infiniteuny/infinity-frontend/commit/e39730e2264e78ada91f0a510ca188429753840a))


### Features

* **component:** Add back button to section header ([bc48a80](https://github.com/infiniteuny/infinity-frontend/commit/bc48a80cec4056800d729e13d0be1e2cd0740132))
* **component:** Add breadcrumbs and title metadata to each page ([f296193](https://github.com/infiniteuny/infinity-frontend/commit/f296193060460c19c25a5d307d5208bc8f684428))
* **component:** Add breadcrumbs component to main ([4060060](https://github.com/infiniteuny/infinity-frontend/commit/40600600cd439b9445ebb0b1ba9f16832755203c))
* **component:** Add initial grid operators list ([2ceb1ce](https://github.com/infiniteuny/infinity-frontend/commit/2ceb1ce8a248e64a823219d1aeb2b7f12a5fb66c))
* **component:** Add server side filtering and sorting to users list ([8600694](https://github.com/infiniteuny/infinity-frontend/commit/86006948d6f79a20198f213dffbdaa5c188afb34))
* **repository:** Add sort option to get users repo method ([24ca846](https://github.com/infiniteuny/infinity-frontend/commit/24ca8461435d3a0b8032246e1088d701b5156b7d))
* **util:** Add date filter operator converter ([ae5133e](https://github.com/infiniteuny/infinity-frontend/commit/ae5133e6ca96ac0805fdeb2e328e99445a336962))



