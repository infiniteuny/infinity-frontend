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



# [1.0.0](https://github.com/infiniteuny/infinity-frontend/compare/50d4bdfcfc000914fc608199d3159f7a4a7990d5...v1.0.0) (2026-06-01)


### Bug Fixes

* **component:** Hide membership form on user based on permission ([f230fbe](https://github.com/infiniteuny/infinity-frontend/commit/f230fbeb0fdd9271b37fbc029f860e7482faeeb3))
* **component:** Refactor overview page ([9d86c3a](https://github.com/infiniteuny/infinity-frontend/commit/9d86c3ae23797ea1cbb96832e69c588505c7efe6))
* **config:** Update navbar menu to go to the landing page ([7dbb7a7](https://github.com/infiniteuny/infinity-frontend/commit/7dbb7a742e376f7c76fd838fe95f61d0d191f426))
* **datasource:** Extend session expire a bit longer from default oauth2 access token expire ([719cb8f](https://github.com/infiniteuny/infinity-frontend/commit/719cb8f9e0410428dd45bf056a42143cf1130f7f))
* **deps:** update dependency axios to v1.16.0 [security] ([#662](https://github.com/infiniteuny/infinity-frontend/issues/662)) ([7e43960](https://github.com/infiniteuny/infinity-frontend/commit/7e43960fcc411534226d40e3a8b9c07d54f7e26b))
* **image:** Update favicon ([5c7cef0](https://github.com/infiniteuny/infinity-frontend/commit/5c7cef0d4e96d8436c2b89022f49816c6ec2d9a9))
* **proxy:** No need to check oauth2 token expires ([d6a44be](https://github.com/infiniteuny/infinity-frontend/commit/d6a44be542f7557d9ca77cce070794eb3e022a55))
* **repository:** Add missing injectable decorator ([22f262f](https://github.com/infiniteuny/infinity-frontend/commit/22f262fc16a95d328cac24a09b1506ea0d67db94))


### Features

* **asset:** Add image for overview page ([3e6215b](https://github.com/infiniteuny/infinity-frontend/commit/3e6215bc69b8bbacd9392f231f79799e908559e2))
* **asset:** Add svg assets for reregistration page ([2ddbc67](https://github.com/infiniteuny/infinity-frontend/commit/2ddbc6763d8fe3e4f20b455479b2e37a70134b89))
* **component:** Add classname and sx to clickable view tile ([6d43d43](https://github.com/infiniteuny/infinity-frontend/commit/6d43d438eef9274c0317ebdd8cf29f33a5504997))
* **component:** Add close button and profile tile to navbar ([60c590d](https://github.com/infiniteuny/infinity-frontend/commit/60c590da22a464383163523d41dce078de5c7638))
* **component:** Add overview component ([35ad08d](https://github.com/infiniteuny/infinity-frontend/commit/35ad08d7b7518ad26edfc3b70c66fc24031b21cd))
* **component:** Add reregistration view ([7f7d665](https://github.com/infiniteuny/infinity-frontend/commit/7f7d665b467ddea93c36e964b765710a6ca8ab2f))
* **component:** Implement system settings for membership configs ([376d49f](https://github.com/infiniteuny/infinity-frontend/commit/376d49ff4001efaf4887b53d4f882322397924a3))
* **dto:** Add ConfigDto and ConfigMapper ([50d4bdf](https://github.com/infiniteuny/infinity-frontend/commit/50d4bdfcfc000914fc608199d3159f7a4a7990d5))
* **repository:** Add extend user membership method ([d1be8f1](https://github.com/infiniteuny/infinity-frontend/commit/d1be8f1b13aa9dbfcc4befc5587a6b3511993408))
* **repository:** Implement ConfigRepository ([e15e30c](https://github.com/infiniteuny/infinity-frontend/commit/e15e30c9a36ea8cafeff5803235fc2d0b5e323da))
* **usecase:** Add CRUD usecase for Config with corresponding symbols and injections ([cbb8e8e](https://github.com/infiniteuny/infinity-frontend/commit/cbb8e8e8663f88e08bd80f653b5c3365f7b72af9))
* **usecase:** Add extend user membership use case ([f7505cf](https://github.com/infiniteuny/infinity-frontend/commit/f7505cf565cb39fb14e982be5bb387a5b5906d9e))
* **workflow:** Add changelog generation step to release workflow ([87977cc](https://github.com/infiniteuny/infinity-frontend/commit/87977cc0eb284df0d3a4ea342db938ac1fefeb91))



# 1.0.0-beta.1 (2026-05-19)


### Bug Fixes

* **auth:** Replace generic errors with APIError ([96586b2](https://github.com/infiniteuny/infinity-frontend/commit/96586b20e17b3e63343eee755f9e1552c9605f0f))
* **component:** Add permission checking on whole access control view ([c1c604f](https://github.com/infiniteuny/infinity-frontend/commit/c1c604fb4fed2edf4e748ac63835ef52ee37cef9))
* **component:** Integrate ProfileToolbar into UserForm ([0290a52](https://github.com/infiniteuny/infinity-frontend/commit/0290a52b3b5a5c4668df746dfa50dfbd55c9d5b7))
* **component:** Update delete handler to use correct membership or entitlement ID ([c672139](https://github.com/infiniteuny/infinity-frontend/commit/c6721396f74ff422f1d555619f106672106a25eb))
* **component:** Update subtitle for System Configurations tile ([3651933](https://github.com/infiniteuny/infinity-frontend/commit/3651933ab8c7f243484490c363429561c667f64a))
* **config:** Add competitions in settings route path matcher ([d1174f1](https://github.com/infiniteuny/infinity-frontend/commit/d1174f1cbabae30d4bda213c9b496119252ade60))


### Features

* **component:** Add isProfileForm prop to UserForm for rendering on profile edit ([c8e6fcb](https://github.com/infiniteuny/infinity-frontend/commit/c8e6fcb3a91bb6ec4088d9f9eb0592cc70914cdf))
* **component:** Add profile management tile to settings view ([eaacd31](https://github.com/infiniteuny/infinity-frontend/commit/eaacd318f8e34c718fdee262c57fc2d6a26931d9))
* **component:** Add ProfileToolbar component ([eb8441c](https://github.com/infiniteuny/infinity-frontend/commit/eb8441c7b2c1c2a366df10ec2fa8458fbdf50e0e))
* **datasource:** Add offline accessType ([b9ec969](https://github.com/infiniteuny/infinity-frontend/commit/b9ec969008ba870998258c48142bc1b293c0eae0))
* **route:** Add AuthGlobalError ([aec0d3e](https://github.com/infiniteuny/infinity-frontend/commit/aec0d3ea1677ef530a5f15af55b93a5fcd3a6fd5))
* **route:** Add profile and profile edit routes ([cc9d649](https://github.com/infiniteuny/infinity-frontend/commit/cc9d64973d6dd39b677e787e38148560fc30e534))



# 1.0.0-alpha.8 (2026-05-17)


### Bug Fixes

* **component:** Rename SettingTile with ClickableViewTile and move to shared internal folder ([af38e94](https://github.com/infiniteuny/infinity-frontend/commit/af38e945e6f96970ad2479520d1218f2a2957800))
* **deps:** update dependency next to v16.2.6 [security] ([#659](https://github.com/infiniteuny/infinity-frontend/issues/659)) ([e6142c2](https://github.com/infiniteuny/infinity-frontend/commit/e6142c23e7715f9129a250be5fc4c4a70183060d))
* **injection:** Add missing bindings for delete operations in client container ([90231b6](https://github.com/infiniteuny/infinity-frontend/commit/90231b6c4f4e6e2be5276c925ded4ce8d90a1b42))
* **route:** Delete unused permission checking for publicly accessible entities ([ff0246e](https://github.com/infiniteuny/infinity-frontend/commit/ff0246ee24dbcfe929bca42c129f3642c514f8f7))


### Features

* **component:** Add user permissions handling for relationship tile menu ([d224d11](https://github.com/infiniteuny/infinity-frontend/commit/d224d11b30088518b2439b8231519cf3b985092f))
* **styles:** Add dynamic rounded styling for grid tiles ([fe4e207](https://github.com/infiniteuny/infinity-frontend/commit/fe4e2075973e91ffe77da2ec28022a981e7276e9))



# 1.0.0-alpha.7 (2026-05-11)


### Bug Fixes

* **component:** Add missing actions row on users list ([66bafb9](https://github.com/infiniteuny/infinity-frontend/commit/66bafb99ca6a627601130218a4a961b9aec0cf07))
* **component:** Add missing is member form field ([4f524c9](https://github.com/infiniteuny/infinity-frontend/commit/4f524c922bdfba1b17c5c295bc6d6f79d068f17a))
* **component:** Optimize rerender to be done only when sidebar is not extended ([08507d8](https://github.com/infiniteuny/infinity-frontend/commit/08507d81178f219ad2b464dfad72709b147247d5))
* **component:** Update allowed file types for animations to GIF, APNG, and WebP ([7079493](https://github.com/infiniteuny/infinity-frontend/commit/70794934e380db51b07d1de7dd4f3148bbdaa751))
* **component:** Update validation to be nullable, not optional ([eb09b12](https://github.com/infiniteuny/infinity-frontend/commit/eb09b12368702f5bc87962bd2a13f37ce5670d3b))
* **config:** Correct site locale ([13a52d1](https://github.com/infiniteuny/infinity-frontend/commit/13a52d1c886ce2921afea332241e5618d549d12c))
* **config:** Remove permission config from achievement and user menu ([0219298](https://github.com/infiniteuny/infinity-frontend/commit/0219298005b3156583cf91a2931e6e488e874428))
* **config:** Remove permissions from settings ([2530d8d](https://github.com/infiniteuny/infinity-frontend/commit/2530d8d23ee34156f12bd65883a54537c7351d3c))
* **datasource:** Check for window type for client side datasource to make sure not triggered on server side ([7d2c36f](https://github.com/infiniteuny/infinity-frontend/commit/7d2c36f384906de943904810d3471d83692dd2d0))
* **deps:** update dependency axios to v1.15.2 [security] ([#657](https://github.com/infiniteuny/infinity-frontend/issues/657)) ([feaf098](https://github.com/infiniteuny/infinity-frontend/commit/feaf098c9666fd455b65c981043a3aa5202fc6dd))
* **docker:** Ignore renovate config ([55d5a0c](https://github.com/infiniteuny/infinity-frontend/commit/55d5a0c626a2ec46086fbef7bd118eb5edeab663))
* **dto:** Change default value of team members to undefined instead of empty array ([8bff3b5](https://github.com/infiniteuny/infinity-frontend/commit/8bff3b528ad632ac24f4bda81166add5ffa51eb2))
* **entity:** Add missing members property to Team ([f850652](https://github.com/infiniteuny/infinity-frontend/commit/f85065261c8b08a7b62f0d84d7ba88bc1d173aea))
* **entity:** Add username field to UserFilterOptions and UserSortOptions ([470cf0b](https://github.com/infiniteuny/infinity-frontend/commit/470cf0bb9cea2a2c8541d365f1ed4521f6a38212))
* **entity:** Fix animation to nullable but not undefined ([f56d092](https://github.com/infiniteuny/infinity-frontend/commit/f56d09201516859a5da67114fadcd394ecd87187))
* **entity:** Fix links type on user inherited entities ([a69c0a4](https://github.com/infiniteuny/infinity-frontend/commit/a69c0a488b95aace1d93b500346d3250760978f6))
* Fix testimonial permission name ([85f993f](https://github.com/infiniteuny/infinity-frontend/commit/85f993f6ecdbde2fb26ae4ab035350aaa6b0839e))
* **route:** Fix single entity edit and new page names ([57fb15b](https://github.com/infiniteuny/infinity-frontend/commit/57fb15b5b3448d5f4bffcda37a8f722453716ebe))
* **route:** Fix typo on page name ([9f66c09](https://github.com/infiniteuny/infinity-frontend/commit/9f66c0991ffb287ec8f4b920d641793023fe3fd9))
* **route:** No permission restriction on achievement list page ([dbee923](https://github.com/infiniteuny/infinity-frontend/commit/dbee92328ce59eb6d2d4bc7862c04bbc5e31c8c8))
* **route:** Tidy up permisison checking ([66a1c72](https://github.com/infiniteuny/infinity-frontend/commit/66a1c721065dd9be9d9648370fb409f832f94eba))
* **store:** Update wrong named store context variable ([81bce26](https://github.com/infiniteuny/infinity-frontend/commit/81bce26e65500d6e2b4fc8619f5b102e1741d7fa))
* Update project name ([af9d28e](https://github.com/infiniteuny/infinity-frontend/commit/af9d28ec56c08c65cf48881b5fa2684aec2c6840))


### Features

* **component:** Add actions for achievement list ([93186b8](https://github.com/infiniteuny/infinity-frontend/commit/93186b8b4d76ecb1044efdcfc237c2e1747cdbfa))
* **component:** Add actions for more list components ([a325eb6](https://github.com/infiniteuny/infinity-frontend/commit/a325eb670e35c41d2e0c72993c2f37ceb759a5e2))
* **component:** Add alert dialog ([3d5b6d2](https://github.com/infiniteuny/infinity-frontend/commit/3d5b6d23756933c19c57705947867cda196a7605))
* **component:** Add internal store context provider ([14b6b83](https://github.com/infiniteuny/infinity-frontend/commit/14b6b83cf5529db0914cf071eea5d9e17bcb0115))
* **component:** Add link form fields ([4b86678](https://github.com/infiniteuny/infinity-frontend/commit/4b8667867f37d215ab9b6b0e5128f5375b0f476b))
* **component:** Add missing permission checking on user list toolbar add button ([fbaaa65](https://github.com/infiniteuny/infinity-frontend/commit/fbaaa6516ff501c5c052c74ea06bc79e67a4e8f8))
* **component:** Add permission checking on list toolbar add button ([5ef7e63](https://github.com/infiniteuny/infinity-frontend/commit/5ef7e63ec0970b4100c3c43f6030adc1cedef4c4))
* **component:** Refactor to use sidebar and session state from context store ([e648765](https://github.com/infiniteuny/infinity-frontend/commit/e6487652dc54d319e516ad7e81bd576b190aa79b))
* **component:** Set column width and add actions for users list ([565e3b4](https://github.com/infiniteuny/infinity-frontend/commit/565e3b4eaea19e9875cec47ca6afca2ca2f946fd))
* **config:** Add initial menu permissions config ([38e1c29](https://github.com/infiniteuny/infinity-frontend/commit/38e1c29c06453310a9ac5c029603602a2630ef65))
* **entity:** Add permissions to menu ([2740bd0](https://github.com/infiniteuny/infinity-frontend/commit/2740bd072775df19250421e4b68f51dfed7b5428))
* **entity:** Add shortname field to Competition and CompetitionInstance entities ([68fb70e](https://github.com/infiniteuny/infinity-frontend/commit/68fb70ea3d127b274805dc446a161a31cbe28d0b))
* **entity:** Allow team members include on achievement ([d500aca](https://github.com/infiniteuny/infinity-frontend/commit/d500acad881d47b0e5676e6dfb74ac8356c77707))
* **entity:** Allow team members include on fund app ([4e10605](https://github.com/infiniteuny/infinity-frontend/commit/4e106050c99560d6788b106449706f6fe68db5c6))
* **hook:** Refactor internal store hook to get store using context ([96a0195](https://github.com/infiniteuny/infinity-frontend/commit/96a019501332c3d165b819a54ca1f5a052ff764c))
* **route:** Add permission checking on entity edit pages ([4db5125](https://github.com/infiniteuny/infinity-frontend/commit/4db5125da1e933acd9dfe2df7eec76066916c6ba))
* **route:** Add permission checking on list pages ([609ffd0](https://github.com/infiniteuny/infinity-frontend/commit/609ffd053d7e927772d4e49c3cadf48c097f9730))
* **route:** Add permission checking on relation pages ([acf114e](https://github.com/infiniteuny/infinity-frontend/commit/acf114ef64c39c8a44d1aee49851d4d84f46e421))
* **route:** Add permission checking on single entity pages ([fb60877](https://github.com/infiniteuny/infinity-frontend/commit/fb60877923549fd4eeda3001e30ddf3dffb2c900))
* **serena:** Update project config ([5099093](https://github.com/infiniteuny/infinity-frontend/commit/509909389f8b8f7108a66c2d8eed99d33d12941c))
* **store:** Add new internal session store slice ([82d244c](https://github.com/infiniteuny/infinity-frontend/commit/82d244c5ac0fa005a19fcea9e054772f1ad6671e))
* **store:** Remove unused public store ([369c764](https://github.com/infiniteuny/infinity-frontend/commit/369c764470e4ee3681f1063d02a25325cee298b2))
* **usecase:** Add delete achievement use case ([204c195](https://github.com/infiniteuny/infinity-frontend/commit/204c1958d682e5bc3529af0d1ed83db607a16890))
* **usecase:** Implement more delete use cases ([d1426b3](https://github.com/infiniteuny/infinity-frontend/commit/d1426b33e5b6a5e743957b9361bd6a2b85bb9a8e))
* **util:** Add menu sanitizer for sidebar menu permission checking ([d1c90d1](https://github.com/infiniteuny/infinity-frontend/commit/d1c90d109b5651a95684cffa3141a59ea3772669))



# 1.0.0-alpha.6 (2026-05-03)


### Bug Fixes

* **docker:** Add build time argument ([a2591d9](https://github.com/infiniteuny/infinity-frontend/commit/a2591d965f7646f6a7fdfc1a1d28db7a460dc6b8))



# 1.0.0-alpha.5 (2026-05-03)


### Bug Fixes

* **proxy:** Update callback URL handling to use NEXT_PUBLIC_APP_URL for redirection ([32fbef6](https://github.com/infiniteuny/infinity-frontend/commit/32fbef657980fa149784f14a7e4171574a44c9c6))



# 1.0.0-alpha.4 (2026-05-03)


### Bug Fixes

* **datasource:** Fix auth base url env name ([ba6a26c](https://github.com/infiniteuny/infinity-frontend/commit/ba6a26ce344e0a378b4ef1d973a22bef260dfaea))



# 1.0.0-alpha.3 (2026-05-03)


### Features

* **route:** Add healthcheck route ([7711b3b](https://github.com/infiniteuny/infinity-frontend/commit/7711b3bc2905a9dbb1ab1e4f4f899f429ae1b6b1))



# 1.0.0-alpha.2 (2026-05-03)


### Bug Fixes

* **datasource:** Update redis config to support sentinel ([ca28860](https://github.com/infiniteuny/infinity-frontend/commit/ca28860bee27c45a3c8001aea5d05e02d7259c4a))
* **deployment:** Optimize build step by leveraging cache for Next.js application ([6673433](https://github.com/infiniteuny/infinity-frontend/commit/66734333e0afd9ae1f435db5b19e3e90397a99be))



# 1.0.0-alpha.1 (2026-05-03)


### Bug Fixes

* **component:** Fix member ID used on row click of core team and community group admin member ([f8a62b0](https://github.com/infiniteuny/infinity-frontend/commit/f8a62b08cb01e5060309d57425ea1cb09564a2bd))
* **component:** Fix up logo form ([ce072a9](https://github.com/infiniteuny/infinity-frontend/commit/ce072a958ae7bad8c5652a9b2bab1d166f939709))
* **component:** Migrate to view tile ([cdddac0](https://github.com/infiniteuny/infinity-frontend/commit/cdddac0200c384aa385c894248a1ae50bec9fa4c))
* **component:** Remove unneeded use client ([d60e861](https://github.com/infiniteuny/infinity-frontend/commit/d60e861f4acb542dc7da23606a6cc2caaa81aecb))
* **component:** Use minRows instead of rows for multiline text fields ([7c293f8](https://github.com/infiniteuny/infinity-frontend/commit/7c293f8d01e429205284698689fbd82b841c11f9))
* **datasource:** Include nested permissions on auth get user info ([b40ff68](https://github.com/infiniteuny/infinity-frontend/commit/b40ff6879c64e7b75da7096d1847e9e7a9f7548b))
* **dto:** Add missing relation entity in membership ([460a996](https://github.com/infiniteuny/infinity-frontend/commit/460a9968ce168715bfb0dc5f33e3f13d1e8ec6bf))
* **dto:** Fix mapper function name ([9f721f9](https://github.com/infiniteuny/infinity-frontend/commit/9f721f91b093b59ecdb1347a095ce749d4d21e74))
* **dto:** Update relation pivot property name ([e13a112](https://github.com/infiniteuny/infinity-frontend/commit/e13a1121b44acc8d046736294d96a8fffc47ca5a))
* **entity:** Add options for relation entities ([304210b](https://github.com/infiniteuny/infinity-frontend/commit/304210b337a047115b8ed6d7330eb9d656152bcc))
* **entity:** Remove unexist property of core team member ([bc1191b](https://github.com/infiniteuny/infinity-frontend/commit/bc1191b239e8750d5dcdfa0771b20406cce7a70c))
* **entity:** Update property type to include File ([3772a90](https://github.com/infiniteuny/infinity-frontend/commit/3772a90d41f2520a41a0e075e321c614e427b89d))
* **entity:** Update relation pivot property name and include ([107a241](https://github.com/infiniteuny/infinity-frontend/commit/107a241c7d2b56f2c681b3df1b97c33849a7890f))
* **repository:** Allow null value on animation update ([d73aac9](https://github.com/infiniteuny/infinity-frontend/commit/d73aac9cf0be311c884723b1ab72f9217e901220))
* **repository:** Correct return type for getUserPermissions method ([9e21494](https://github.com/infiniteuny/infinity-frontend/commit/9e214940683e478af95c4451eb9d4d486e4f39e8))
* **repository:** Fix up some generated methods ([0a74037](https://github.com/infiniteuny/infinity-frontend/commit/0a74037f49b8805b5b664d237c9ae03e98384279))
* **repository:** Move pagination option response creation inside hasInclude condition check ([6de68df](https://github.com/infiniteuny/infinity-frontend/commit/6de68dfc40dfbe47b33568997c1d6da5932e04e7))
* **route:** Fix mapper function name used on pages ([8641052](https://github.com/infiniteuny/infinity-frontend/commit/86410525e83a9363aedad0b7ce0a3b1ffe30a9c0))
* **usecase:** Fix up some generated use cases ([bb0f71c](https://github.com/infiniteuny/infinity-frontend/commit/bb0f71cd7c5601ca81f3b9439d1a5454a11c65de))
* **usecase:** Make auth mandatory on some read, create, update, and delete use cases ([a3e077d](https://github.com/infiniteuny/infinity-frontend/commit/a3e077d3d8d67b2cfb9ab760861f17d02cd9d8f3))
* **usecase:** Register more to index ([d3327d0](https://github.com/infiniteuny/infinity-frontend/commit/d3327d0b524c07ec28934f67f8885100c778bf82))
* **usecase:** Remove unused import ([18dcac4](https://github.com/infiniteuny/infinity-frontend/commit/18dcac4d6864e839f02e1ceb6c725c104dce2c83))


### Features

* Add AGENTS.md ([b32e614](https://github.com/infiniteuny/infinity-frontend/commit/b32e6146c80f69ca6e16887b0f1b88cccaeae7d7))
* **component:** Add competition and competition instance components ([6eb29ef](https://github.com/infiniteuny/infinity-frontend/commit/6eb29efb9aa3d13e8aa0319c5571f8908eff85ab))
* **component:** Add core team and community group admin member single form and view ([a8f79f0](https://github.com/infiniteuny/infinity-frontend/commit/a8f79f0f2c4020880537f3e959db39e987c6c02a))
* **component:** Add error.js and not-found.js ([83055b2](https://github.com/infiniteuny/infinity-frontend/commit/83055b2e1ae4d733950b741cb06f7bb0c1b9fea4))
* **component:** Add menu to open relation list ([8320fbd](https://github.com/infiniteuny/infinity-frontend/commit/8320fbda6ac75236155a3ab58ff69ccbc92dab47))
* **component:** Add more list component for relations ([7e637ae](https://github.com/infiniteuny/infinity-frontend/commit/7e637ae7dddb3499b3ba7c6596419c11dbdb2a04))
* **component:** Add more list page components ([a31041d](https://github.com/infiniteuny/infinity-frontend/commit/a31041db6dde5a51652faee625abfec97c50049f))
* **component:** Add more single forms for user, team, group, and community group's relations ([429ea01](https://github.com/infiniteuny/infinity-frontend/commit/429ea01641a9bc5d978e3552b3ccf01b41763b30))
* **component:** Add single view and form component ([686e644](https://github.com/infiniteuny/infinity-frontend/commit/686e644048dc14a57ad379430b54f5de5146ceb3))
* **component:** Add text box and copy button for error page message ([43fceee](https://github.com/infiniteuny/infinity-frontend/commit/43fceeeabcb3a29034dd30e077bc4f7a39e2b033))
* **component:** Add trailing icon to setting tile ([d369432](https://github.com/infiniteuny/infinity-frontend/commit/d369432ab92a28e0d9cab8c81bc4efc64b3aa380))
* **component:** Add view tile shared component ([e6ca5c4](https://github.com/infiniteuny/infinity-frontend/commit/e6ca5c494b30ab569910487b895cb1522f4529a6))
* **config:** Update symbols for injection ([66d774d](https://github.com/infiniteuny/infinity-frontend/commit/66d774dd466661ebc46c3c0dee5a4851f7e4002f))
* **docker:** Add .dockerignore from Next.js ([c33759b](https://github.com/infiniteuny/infinity-frontend/commit/c33759b07a8547cfad9589d90a0d80bd2fc4f096))
* **dto:** Add competition instance DTO ([dbd6fc4](https://github.com/infiniteuny/infinity-frontend/commit/dbd6fc470cee5a838fbcad5eb31ca1bbe8e3fa5d))
* **dto:** Add more relationship dtos ([ab15988](https://github.com/infiniteuny/infinity-frontend/commit/ab159881e0813ad53a2c13fc7dcec94c9d9e5aa5))
* **dto:** Add user community group DTO ([14dfc17](https://github.com/infiniteuny/infinity-frontend/commit/14dfc1719b084e289a77f125dc90e9a012620c1a))
* **entity:** Add competition instance entity ([ac503da](https://github.com/infiniteuny/infinity-frontend/commit/ac503daf4af69e254940d4d257f5795a8a56c43b))
* **entity:** Add competition instance entity ([7102072](https://github.com/infiniteuny/infinity-frontend/commit/710207287e241fc3a354b8dbde17521892b51b54))
* **entity:** Add more relationship entities ([3bcdc2c](https://github.com/infiniteuny/infinity-frontend/commit/3bcdc2ca7d17a8c9106036352091a7d8c57b9c00))
* **injection:** Add more use cases binding ([14ff432](https://github.com/infiniteuny/infinity-frontend/commit/14ff432b8c32fbe5db05ea654f644dbb85970b0c))
* **injection:** Add more use cases injections ([fcf7373](https://github.com/infiniteuny/infinity-frontend/commit/fcf7373e0b2acfdc58155419ee97ad63e8c9ecc1))
* **license:** Add license ([6218e6e](https://github.com/infiniteuny/infinity-frontend/commit/6218e6e4886413fc908cd1a15a6543dcc0e17d5d))
* **repository:** Add competition instance repo implementation ([59fb7d7](https://github.com/infiniteuny/infinity-frontend/commit/59fb7d7d01526cc142a694a3acfbe154009901b2))
* **repository:** Add more relationship repositories ([bb1e4f4](https://github.com/infiniteuny/infinity-frontend/commit/bb1e4f4f9322a678a21070f1390aac6b64f88ceb))
* **repository:** Add options to relationship repositories ([0d56b77](https://github.com/infiniteuny/infinity-frontend/commit/0d56b774615cf008d9bead6fcd58c2a6c868a290))
* **repository:** Add user community group repository ([86c4693](https://github.com/infiniteuny/infinity-frontend/commit/86c46937868bf6b1ef79b2525f21a261bd2bfbd5))
* **repository:** Implement degree repo ([2306f7f](https://github.com/infiniteuny/infinity-frontend/commit/2306f7fd14b451fefa88416369f0a46e4f13187b))
* **route:** Add competition and competition instance routes ([b81972a](https://github.com/infiniteuny/infinity-frontend/commit/b81972a6badc3fb13bd12b679544a457415ff207))
* **route:** Add core team and community group admin single member route ([28a9dba](https://github.com/infiniteuny/infinity-frontend/commit/28a9dba3bd8811bde359ed8497681e3ca920c2ba))
* **route:** Add more page wiring for user, team, group, and community group's relations ([61b08ab](https://github.com/infiniteuny/infinity-frontend/commit/61b08ab8f3601b8cd9b86fbd464b177806678640))
* **route:** Add more routes ([16f105f](https://github.com/infiniteuny/infinity-frontend/commit/16f105f0ed73d6b6ffa52702e12455b34766d7af))
* **route:** Add more single and edit routes ([fada71f](https://github.com/infiniteuny/infinity-frontend/commit/fada71fe57d1c01d22c1accebea3602d69c13177))
* **route:** Add relation list page routes ([1cb7f4d](https://github.com/infiniteuny/infinity-frontend/commit/1cb7f4d6f642c01e3b80467402b10ce4695ed275))
* **serena:** Add serena config ([f7216df](https://github.com/infiniteuny/infinity-frontend/commit/f7216df50e4198370030773018bb112851a384c3))
* **serena:** Update serena data ([30afe98](https://github.com/infiniteuny/infinity-frontend/commit/30afe9850452e36465db90c23f0faa53b95f4a7c))
* **usecase:** Add competition instance use cases ([24d95ce](https://github.com/infiniteuny/infinity-frontend/commit/24d95cefa315812aec2c8c449b8a79231e54e33b))
* **usecase:** Add more relationship usecases ([c977a36](https://github.com/infiniteuny/infinity-frontend/commit/c977a361aa9d1d3f911b7b37daf3c86ac10a0d95))
* **usecase:** Add more use cases ([9c2f507](https://github.com/infiniteuny/infinity-frontend/commit/9c2f507b08f1228c46ae53ffa926d0f00baba541))



# 0.1.0-alpha.2 (2026-04-18)


### Bug Fixes

* **datasource:** Guard during CI build ([c97e0ef](https://github.com/infiniteuny/infinity-frontend/commit/c97e0ef510c67f348fa31b35b40e2f67a4eb851d))



# 0.1.0-alpha.1 (2026-04-18)


### Bug Fixes

* **auth:** Add session entity and use case ([0285e17](https://github.com/infiniteuny/infinity-frontend/commit/0285e17f021146271bfc2a2d027a640bbbc8279f))
* **auth:** Refactor auth data source and repository ([dccf8c8](https://github.com/infiniteuny/infinity-frontend/commit/dccf8c8435f2ec3e082ca41a7dd5fa955d66a052))
* **component:** Add download button to File ([321268e](https://github.com/infiniteuny/infinity-frontend/commit/321268e5e48ca02e128bc3deb51870b3a560f70b))
* **component:** Add skip to content button ([43098ae](https://github.com/infiniteuny/infinity-frontend/commit/43098aed52bdca26b48b3ca92bb72304de43ee70))
* **component:** Enable text select on setting tile ([58b21e6](https://github.com/infiniteuny/infinity-frontend/commit/58b21e6636f7fe7bba387baeca9faefdb1d11222))
* **component:** Fix `theme.vars` possibly undefined ([4557a37](https://github.com/infiniteuny/infinity-frontend/commit/4557a37ad9e5d9f66e906a929451f98d9d1c62c0))
* **component:** Fix app bar right glitch when open popover element ([8c8a636](https://github.com/infiniteuny/infinity-frontend/commit/8c8a6369c4f33d97aa6131550d84b4847930e81f))
* **component:** Fix form field disable to the field, not controller ([6bb1890](https://github.com/infiniteuny/infinity-frontend/commit/6bb189001c9b54c0f5bb3eabe953de26de12e99e))
* **component:** Fix form field disable to the field, not controller (2) ([f246196](https://github.com/infiniteuny/infinity-frontend/commit/f246196718671303230cd402f0b9d02965cbdb0a))
* **component:** Fix lint using useWatch instead of watch ([18bc78f](https://github.com/infiniteuny/infinity-frontend/commit/18bc78f61ec2fa88a303d96443bcb94f0ca36ad4))
* **component:** Fix lists page toolbar ([0888025](https://github.com/infiniteuny/infinity-frontend/commit/0888025a9a09a461523efff50bdaaad6fadf2d0b))
* **component:** Fix MUI Paper's text style ([7335c99](https://github.com/infiniteuny/infinity-frontend/commit/7335c99421b71b7000cb952f37350bf063050aff))
* **component:** Fix set null on File uploader delete button ([f3cb9d7](https://github.com/infiniteuny/infinity-frontend/commit/f3cb9d786062aa2c1cdaec93f0f23ecb690193f8))
* **component:** Fix setting tile rounding ([a0e7522](https://github.com/infiniteuny/infinity-frontend/commit/a0e75222bd814402469ced2a7746c59bea36c010))
* **component:** Fix toolbar action button alignment with flex ([dbc2f49](https://github.com/infiniteuny/infinity-frontend/commit/dbc2f499217599636a40d54f4bb58c0821c0935d))
* **component:** Fix type mismatch on permission form ([9eb309b](https://github.com/infiniteuny/infinity-frontend/commit/9eb309bd22a421fa7be6e3de0b82ea39c73c9bc2))
* **component:** Fix useStore hook with useShallow ([ddce1d5](https://github.com/infiniteuny/infinity-frontend/commit/ddce1d545b431c231f6b9da8e82401329cda3b6b))
* **component:** Fix zod recursive schemes ([1232062](https://github.com/infiniteuny/infinity-frontend/commit/1232062b172cef849b79de80922c9b8c2c418379))
* **component:** Format TailwindCSS class ([e9e1fae](https://github.com/infiniteuny/infinity-frontend/commit/e9e1fae7648c69dcdc4ea48162c66d6a3a1f5a4d))
* **component:** Ignore some eslint react-hooks rules ([53fe481](https://github.com/infiniteuny/infinity-frontend/commit/53fe4819e050bc51030c501b30ee668d20355f10))
* **component:** Move `InitColorSchemeScript` to MUI setup component ([4a0b2be](https://github.com/infiniteuny/infinity-frontend/commit/4a0b2be0e99072ed7431be0afaffc806a2e03a7d))
* **component:** Optimize on change callback ([9e8efa0](https://github.com/infiniteuny/infinity-frontend/commit/9e8efa06a2a1a5f5d6064196a15954f45dd3f227))
* **component:** Optimize useEffect usage ([11ae5d2](https://github.com/infiniteuny/infinity-frontend/commit/11ae5d2743742459e54556dddcc73d52fdb68711))
* **component:** Optimize with use memo ([0ad376b](https://github.com/infiniteuny/infinity-frontend/commit/0ad376b1e370468644011ebc57af0daaad9c9dc0))
* **component:** Refactor File field on form to display existing uploaded File on edit ([e9ceeed](https://github.com/infiniteuny/infinity-frontend/commit/e9ceeed537df6ef46c5ec39e7c7cc0a19a8925d7))
* **component:** Refactor lists pagination function ([fbf99b7](https://github.com/infiniteuny/infinity-frontend/commit/fbf99b78adfdd0411d7406c9e48d3207dc9959d3))
* **component:** Remove list container ([f428ca8](https://github.com/infiniteuny/infinity-frontend/commit/f428ca870abd6216d0feaf5a9db69036b34d27e4))
* **component:** Remove unused sidebar footer top margin ([ff05023](https://github.com/infiniteuny/infinity-frontend/commit/ff050231515c1ae962141435e29c34ae3a41f82a))
* **component:** Reorder setting tile ([c6b1edb](https://github.com/infiniteuny/infinity-frontend/commit/c6b1edb4bfc6afb13f25f504817fb5df55799c83))
* **component:** Reorder spread operation to the very first position ([0ef65cc](https://github.com/infiniteuny/infinity-frontend/commit/0ef65ccaaf59d7110bed1fd9e1ca1b33db74c5b4))
* **component:** Set form title to user name for edit user page ([ba3763b](https://github.com/infiniteuny/infinity-frontend/commit/ba3763b1b798052953518aec19b2e555a541c659))
* **component:** Set login button style as filled and add icon ([0b2a22b](https://github.com/infiniteuny/infinity-frontend/commit/0b2a22ba624c88d10c1a2af15f8980afe002391e))
* **component:** Set text-right on toolbar ([ace9c92](https://github.com/infiniteuny/infinity-frontend/commit/ace9c9234b9e27a7dbedd4f9dd9776d0563406ff))
* **component:** Simplify all toolbars button text ([42bc133](https://github.com/infiniteuny/infinity-frontend/commit/42bc1337c0648d03028b556b30a5aa34cea84da8))
* **component:** Tidy up entities list component ([dddf8ec](https://github.com/infiniteuny/infinity-frontend/commit/dddf8ec06c34ff6f33e6693e492eed272c82b6dd))
* **component:** Update fund app proposal MIME ([cbe6fee](https://github.com/infiniteuny/infinity-frontend/commit/cbe6feeceb196a7af9aa9c0540aa1dfaeae50ebe))
* **component:** Update internal shared header, footer, navbar, sidebar, and main ([cff18db](https://github.com/infiniteuny/infinity-frontend/commit/cff18dbe5dd8898ab3ed1cab6321d5c0082c18ca))
* **component:** Update logout icon to rounded ([0d6ba14](https://github.com/infiniteuny/infinity-frontend/commit/0d6ba14e688eb9a392e8754de0f067e9d26ea1be))
* **component:** Update skip button to use filled variant ([0d4e8d1](https://github.com/infiniteuny/infinity-frontend/commit/0d4e8d1a84b2aea663a096c1d32af665598e2c30))
* **component:** Update tailwind class ([d93f5ec](https://github.com/infiniteuny/infinity-frontend/commit/d93f5ec5ab8a9fcad105270e8c96b772ed251525))
* **component:** Update users fetch to include major's faculty ([c626e60](https://github.com/infiniteuny/infinity-frontend/commit/c626e6002e4583831e8ef24c18a1d6b95bb7ad1a))
* **component:** Use luxon and add major's degree detail ([f3cd7fe](https://github.com/infiniteuny/infinity-frontend/commit/f3cd7fe1bd8a81e9b4397dd3587a6beaafbed795))
* **component:** Use new style for single form and view ([b3d2391](https://github.com/infiniteuny/infinity-frontend/commit/b3d2391868cfeecc97e23cdd22ddac2d79448d56))
* **config:** Cleanup unused public menu ([aad382c](https://github.com/infiniteuny/infinity-frontend/commit/aad382ca1f918754263d481fbb5524335f134670))
* **config:** Fix file name ([1479d78](https://github.com/infiniteuny/infinity-frontend/commit/1479d78f658a5d30e374142306062a163d2b9e4e))
* **config:** Move config folder location ([43816cf](https://github.com/infiniteuny/infinity-frontend/commit/43816cf235021304937a3469990800952443726b))
* **config:** Move team menu to directories ([483594b](https://github.com/infiniteuny/infinity-frontend/commit/483594b89d4a8866b64824ea71d946d58a9005e4))
* **config:** Reduce default font size ([e60331f](https://github.com/infiniteuny/infinity-frontend/commit/e60331f17b052ceaa6710ced0a89bbc970bb1491))
* **config:** Remove MUI modularize imports ([4f3b9c8](https://github.com/infiniteuny/infinity-frontend/commit/4f3b9c809915d19e27ffff132848fe496b2021b3))
* **config:** Reorder sidebar menu ([82a07e6](https://github.com/infiniteuny/infinity-frontend/commit/82a07e6beeb834492abbc9ac277e2233c7b9b028))
* **config:** Update import path re-map ([6e90d6d](https://github.com/infiniteuny/infinity-frontend/commit/6e90d6df7151d145d92ab887823a66d7ee560c01))
* **config:** Update matcher ([ccb95e1](https://github.com/infiniteuny/infinity-frontend/commit/ccb95e17992e7342e99c938273fc4717b1558013))
* **config:** Update setting menu matcher ([a63dc49](https://github.com/infiniteuny/infinity-frontend/commit/a63dc49af33442e6b034f93a2e1abbfbbb5423a8))
* **datasource:** Disable buggy update account on sign in ([7fb59c5](https://github.com/infiniteuny/infinity-frontend/commit/7fb59c5b6181ee3480d1eff5162b1e0704a75a59))
* **datasource:** Disable prebuilt auth error page ([9555527](https://github.com/infiniteuny/infinity-frontend/commit/9555527118efeac5eafea19c3bb4939f89faa546))
* **datasource:** Fix circullar deps on auth data-source's use case injection ([4683bba](https://github.com/infiniteuny/infinity-frontend/commit/4683bbab78a71e9a3e3479aabc343e9c8d9c295b))
* **datasource:** Reduce cookie cache max age to 5 min ([1da68ae](https://github.com/infiniteuny/infinity-frontend/commit/1da68aeeaba28324e8fa1127a66ecbee42a91410))
* **datasource:** Set Infinity API env var to be public ([c9f4941](https://github.com/infiniteuny/infinity-frontend/commit/c9f49418b207dd759006fc0de63b3f48f42d8ae2))
* **datasource:** Store session as JWE ([4914ed8](https://github.com/infiniteuny/infinity-frontend/commit/4914ed80bec431b7cd7eb4d75874e78fa8980e95))
* **datasource:** Update cookie cache max age to 1 hour ([3684fd3](https://github.com/infiniteuny/infinity-frontend/commit/3684fd33423b1147b5a3acfbd14ff2764f75f239))
* **datasource:** Use uuid ([60690ee](https://github.com/infiniteuny/infinity-frontend/commit/60690ee6f2cf51dd32bee226f500a25ef59a5fed))
* **deployment:** Fix container image title and desc ([422e673](https://github.com/infiniteuny/infinity-frontend/commit/422e673a9b70a8f6e6e5b8a19f518f8d18226182))
* **deps:** Fix Next.js image optimization error ([9fb305f](https://github.com/infiniteuny/infinity-frontend/commit/9fb305fc3a56864e639e57337236e4026d2fc7cb))
* **deps:** update dependency @mui/x-data-grid to v8.14.1 ([#554](https://github.com/infiniteuny/infinity-frontend/issues/554)) ([db4969a](https://github.com/infiniteuny/infinity-frontend/commit/db4969a266a2a3f4b7e14da23deb59492897d154))
* **deps:** update dependency @mui/x-data-grid to v8.16.0 ([#567](https://github.com/infiniteuny/infinity-frontend/issues/567)) ([9e40975](https://github.com/infiniteuny/infinity-frontend/commit/9e4097546afef7a3348248aabda2a6a58701dff7))
* **deps:** update dependency @mui/x-data-grid to v8.20.0 ([#583](https://github.com/infiniteuny/infinity-frontend/issues/583)) ([9ddac29](https://github.com/infiniteuny/infinity-frontend/commit/9ddac2970e27c5c307e7617c969da1915f2bca8b))
* **deps:** update dependency @mui/x-data-grid to v8.28.1 ([#640](https://github.com/infiniteuny/infinity-frontend/issues/640)) ([d67f245](https://github.com/infiniteuny/infinity-frontend/commit/d67f2457bc243dc46d5b39f3fe45e4971db6e91b))
* **deps:** update dependency axios to v1.12.0 [security] ([#529](https://github.com/infiniteuny/infinity-frontend/issues/529)) ([b587584](https://github.com/infiniteuny/infinity-frontend/commit/b587584aadb9ebab06bafe57068e859c24f29578))
* **deps:** update dependency axios to v1.13.5 [security] ([1758dac](https://github.com/infiniteuny/infinity-frontend/commit/1758dac10760aef0b581c68529683198bf0c3733))
* **deps:** update dependency axios to v1.15.0 [security] ([8d9f122](https://github.com/infiniteuny/infinity-frontend/commit/8d9f12282947ec44e210d3b61d0d617cb7b5d8df))
* **deps:** update dependency effect to v3.20.0 [security] ([#630](https://github.com/infiniteuny/infinity-frontend/issues/630)) ([2edb3d2](https://github.com/infiniteuny/infinity-frontend/commit/2edb3d2ba21322e7e639f27dcc9c38d70a6e2112))
* **deps:** update dependency inversify to v7.10.3 ([#552](https://github.com/infiniteuny/infinity-frontend/issues/552)) ([028c471](https://github.com/infiniteuny/infinity-frontend/commit/028c471c71b411fc0ced5747c9a038cdfe97ab1f))
* **deps:** update dependency next to v15.3.3 [security] ([218bbb9](https://github.com/infiniteuny/infinity-frontend/commit/218bbb94f88200764d4e97df4a546109e812b0dd))
* **deps:** update dependency next to v15.4.7 [security] ([811b2e7](https://github.com/infiniteuny/infinity-frontend/commit/811b2e717e6679c9b9a01449fc1bf978a1b5ea47))
* **deps:** update dependency next to v15.5.10 [security] ([43261f6](https://github.com/infiniteuny/infinity-frontend/commit/43261f600d0edbb8a3694c01bc84a65bf1197a3a))
* **deps:** update dependency next to v15.5.14 [security] ([3bd6073](https://github.com/infiniteuny/infinity-frontend/commit/3bd607379397e87e937acfde842e3c824947f42f))
* **deps:** update dependency next to v15.5.7 [security] ([#585](https://github.com/infiniteuny/infinity-frontend/issues/585)) ([a29c9e5](https://github.com/infiniteuny/infinity-frontend/commit/a29c9e5fc4384a31319ce3918c93f79dee9234e2))
* **deps:** update dependency next to v15.5.8 [security] ([#587](https://github.com/infiniteuny/infinity-frontend/issues/587)) ([28b8e40](https://github.com/infiniteuny/infinity-frontend/commit/28b8e40300702ba69f874c1a5f4a2bb63e236dca))
* **deps:** update dependency next to v15.5.9 [security] ([#588](https://github.com/infiniteuny/infinity-frontend/issues/588)) ([473f43b](https://github.com/infiniteuny/infinity-frontend/commit/473f43bd1b01da35897058e4bc752406c5549b72))
* **deps:** update dependency next to v16.2.3 [security] ([#643](https://github.com/infiniteuny/infinity-frontend/issues/643)) ([1f02802](https://github.com/infiniteuny/infinity-frontend/commit/1f028021684128694cd104d82e755b0caea2680b))
* **deps:** update dependency next-auth to v5.0.0-beta.30 [security] ([#562](https://github.com/infiniteuny/infinity-frontend/issues/562)) ([bc2fe4c](https://github.com/infiniteuny/infinity-frontend/commit/bc2fe4c233310df96f6315dfd90a0ce5b24813c8))
* **deps:** update dependency sharp to v0.32.6 [security] ([03e9010](https://github.com/infiniteuny/infinity-frontend/commit/03e901098120e2b71c698066474af9d675179fef))
* **deps:** update major dependencies ([823d672](https://github.com/infiniteuny/infinity-frontend/commit/823d672cb3758997b3d2ecd9af814001c237fa2b))
* **deps:** update major dependencies ([7e49486](https://github.com/infiniteuny/infinity-frontend/commit/7e49486649349ebca5dbd7eb8cfcce03e8c7b757))
* **deps:** update major dependencies ([4a5dd6b](https://github.com/infiniteuny/infinity-frontend/commit/4a5dd6b7642037fa97a02d354dac1206ce9aacd8))
* **deps:** update major dependencies ([891e56f](https://github.com/infiniteuny/infinity-frontend/commit/891e56fa73935bd51d3ccb0707f74c2bf921e09d))
* **deps:** Update major dependencies ([87208c4](https://github.com/infiniteuny/infinity-frontend/commit/87208c4f9dda4aa2c3b227d7a993c8c126380664))
* **deps:** Update Next.js ([e9df1b2](https://github.com/infiniteuny/infinity-frontend/commit/e9df1b246a83a0637993e6a9eff43a9309aef958))
* **deps:** update non-major dependencies ([cd21ed5](https://github.com/infiniteuny/infinity-frontend/commit/cd21ed57b6aaf1c022f21015904f41824acfeca1))
* **deps:** update non-major dependencies ([01f7316](https://github.com/infiniteuny/infinity-frontend/commit/01f73166defac9a853b4ea1f8f2daedfa50bb8c6))
* **deps:** update non-major dependencies ([661f13e](https://github.com/infiniteuny/infinity-frontend/commit/661f13e3f7b972ffea73991350ce1a8bb708b5a1))
* **deps:** update non-major dependencies ([94ca0ae](https://github.com/infiniteuny/infinity-frontend/commit/94ca0ae7a8711a1f0e5435aef01169d9ac3d2621))
* **deps:** update non-major dependencies ([9d03b68](https://github.com/infiniteuny/infinity-frontend/commit/9d03b684157baf4b30de1f755cc199f1e8cffd0b))
* **deps:** update non-major dependencies ([a47a316](https://github.com/infiniteuny/infinity-frontend/commit/a47a3169a02f0648479306c2f98ccce8a22607b2))
* **deps:** update non-major dependencies ([ba08270](https://github.com/infiniteuny/infinity-frontend/commit/ba0827042c61a228ad5093ffc84751e81376fe44))
* **deps:** update non-major dependencies ([b6240f8](https://github.com/infiniteuny/infinity-frontend/commit/b6240f88faf1a29e5d4767983d3d8527c5081189))
* **deps:** update non-major dependencies ([1a202f7](https://github.com/infiniteuny/infinity-frontend/commit/1a202f769622ac2015d7ecfaa4ea43a25425d926))
* **deps:** update non-major dependencies ([b7c4c74](https://github.com/infiniteuny/infinity-frontend/commit/b7c4c740f5dee38cc7498c253c2077d6a9a97ab5))
* **deps:** update non-major dependencies ([016677f](https://github.com/infiniteuny/infinity-frontend/commit/016677fd5d19e067fed2fa6c99305e5fa569fd64))
* **deps:** update non-major dependencies ([#531](https://github.com/infiniteuny/infinity-frontend/issues/531)) ([96ceae2](https://github.com/infiniteuny/infinity-frontend/commit/96ceae252de6770e539fb94c0243af8d13fea2f7))
* **deps:** update non-major dependencies ([#534](https://github.com/infiniteuny/infinity-frontend/issues/534)) ([6a1f1cb](https://github.com/infiniteuny/infinity-frontend/commit/6a1f1cba2476eebe3520fd2bd42bb70d58ca1729))
* **deps:** update non-major dependencies ([#536](https://github.com/infiniteuny/infinity-frontend/issues/536)) ([68a4874](https://github.com/infiniteuny/infinity-frontend/commit/68a487480183c7875c59a18b7c73f2d65e6dca51))
* **deps:** update non-major dependencies ([#541](https://github.com/infiniteuny/infinity-frontend/issues/541)) ([8211bcf](https://github.com/infiniteuny/infinity-frontend/commit/8211bcfe46c528384bea394fb0140dab6ea072f8))
* **deps:** update non-major dependencies ([#549](https://github.com/infiniteuny/infinity-frontend/issues/549)) ([6c4b494](https://github.com/infiniteuny/infinity-frontend/commit/6c4b494ae7ce66ca59d665b0b8184cf498b548fc))
* **deps:** update non-major dependencies ([#556](https://github.com/infiniteuny/infinity-frontend/issues/556)) ([e793826](https://github.com/infiniteuny/infinity-frontend/commit/e79382676407c9832cb676bd1688f420a679eb8c))
* **deps:** update non-major dependencies ([#560](https://github.com/infiniteuny/infinity-frontend/issues/560)) ([0382a19](https://github.com/infiniteuny/infinity-frontend/commit/0382a194d0addfbc3132e240c154d98e579056fb))
* **deps:** update non-major dependencies ([#565](https://github.com/infiniteuny/infinity-frontend/issues/565)) ([9e4b2a4](https://github.com/infiniteuny/infinity-frontend/commit/9e4b2a4a1d51c998abd92dd306a243eccffb37f5))
* **deps:** update non-major dependencies ([#571](https://github.com/infiniteuny/infinity-frontend/issues/571)) ([af616cb](https://github.com/infiniteuny/infinity-frontend/commit/af616cbee537d200e1c3c63cbd07213e93598bea))
* **deps:** update non-major dependencies ([#575](https://github.com/infiniteuny/infinity-frontend/issues/575)) ([5564828](https://github.com/infiniteuny/infinity-frontend/commit/55648287730ba78d8a5a4cb1f4b2bf3b80363807))
* **deps:** update non-major dependencies ([#577](https://github.com/infiniteuny/infinity-frontend/issues/577)) ([3787e1e](https://github.com/infiniteuny/infinity-frontend/commit/3787e1e4f9461f7abd9e2262b883f702c0f3360a))
* **deps:** update non-major dependencies ([#582](https://github.com/infiniteuny/infinity-frontend/issues/582)) ([dd5e4ae](https://github.com/infiniteuny/infinity-frontend/commit/dd5e4aeee412b50f6fbcc5323790ae78d7276d2d))
* **deps:** update non-major dependencies ([#645](https://github.com/infiniteuny/infinity-frontend/issues/645)) ([9bcc47e](https://github.com/infiniteuny/infinity-frontend/commit/9bcc47ec38d2d56fe98e3b4cf34c77c189cdb7a3))
* **deps:** update non-major dependencies ([#648](https://github.com/infiniteuny/infinity-frontend/issues/648)) ([ec799f4](https://github.com/infiniteuny/infinity-frontend/commit/ec799f4a1b469f8c0e38edfde5fd95f437c269da))
* **deps:** update non-major dependencies to v7.3.4 ([#539](https://github.com/infiniteuny/infinity-frontend/issues/539)) ([11c88a1](https://github.com/infiniteuny/infinity-frontend/commit/11c88a10ff0de2766f81e3abb985ee569e1b21b6))
* **dto:** Fix type mismatch ([3414012](https://github.com/infiniteuny/infinity-frontend/commit/3414012bb21249271cfd292c79a0c426ab154f1f))
* **dto:** Switch date convertion to use luxon ([91e34c4](https://github.com/infiniteuny/infinity-frontend/commit/91e34c4a063e7bcee96f543615dbdaa9e1ad7987))
* **dto:** Tidy up generated DTOs ([8070c49](https://github.com/infiniteuny/infinity-frontend/commit/8070c49df63e95f83df73401f6186f8ad8b36d70))
* **entity:** Add current cursor on pagination options ([97b6ce3](https://github.com/infiniteuny/infinity-frontend/commit/97b6ce3a5c9143bbcf016fec3315be9c96c18da0))
* **entity:** Add missing include options ([ad0a2fb](https://github.com/infiniteuny/infinity-frontend/commit/ad0a2fb63a348b499c270ff0f841e652bbb73ec1))
* **entity:** Move team type relation from achievement and fund app to team ([08f8aff](https://github.com/infiniteuny/infinity-frontend/commit/08f8aff70e6d59118c793d08c7ac93b7ccf3b577))
* **entity:** Remove error from session entity ([e0cd315](https://github.com/infiniteuny/infinity-frontend/commit/e0cd31584bd10ab2cb482ced3719e33bbf616e55))
* **entity:** Remove group from CG Admin and Core Team ([1b18324](https://github.com/infiniteuny/infinity-frontend/commit/1b18324d82b0a9c6aec567b84fabe1f8d140167c))
* **entity:** Update achievement image type to File or string ([dbb0525](https://github.com/infiniteuny/infinity-frontend/commit/dbb052516daee9a6e81ff3fb04a580ead291d23e))
* **entity:** Update group and permission guard name type to enum ([a8fb7ea](https://github.com/infiniteuny/infinity-frontend/commit/a8fb7ea3284541531c1f6363dce85e526ddd885e))
* **entity:** Update menu entity ([4432dd4](https://github.com/infiniteuny/infinity-frontend/commit/4432dd436bdbeeabda759d14c95eac7762e7cdac))
* **error:** Update HTTP error constructor ([acb099b](https://github.com/infiniteuny/infinity-frontend/commit/acb099b4bd2466c6e137ca07a1f623c4bedbc729))
* **eslint-config:** Migrate eslint config to flat config ([3e903b7](https://github.com/infiniteuny/infinity-frontend/commit/3e903b70275a93ac154e8bf4e79536615a8cda11))
* **eslint:** Remove duplicated eslint plugin ([b20d5c2](https://github.com/infiniteuny/infinity-frontend/commit/b20d5c2d643ad583273768d1c95438d59df98b12))
* **injection:** Rename to client injection ([9f104c8](https://github.com/infiniteuny/infinity-frontend/commit/9f104c801d00cd609b23c4ed575b06cf276c92f6))
* **layout:** Add bg color to html component ([f4dc173](https://github.com/infiniteuny/infinity-frontend/commit/f4dc173508dc7bae80ac88f70a37ed306c5e89bb))
* **middleware:** Change middleware runtime to nodejs ([bcd8e08](https://github.com/infiniteuny/infinity-frontend/commit/bcd8e08efadcddd8d0d78447d1b0aeba8064fd75))
* Migrate MUI, TaildwindCSS, and Zustand ([1f76bf6](https://github.com/infiniteuny/infinity-frontend/commit/1f76bf6edc8f7360a0e0e2b8f88d62f1f8735b8e))
* Migrate to Next.js v16 ([6857597](https://github.com/infiniteuny/infinity-frontend/commit/68575979dcc957c8e2bff77aa549fa8e21d9dd4a))
* **next-config:** Ignore eslint during build ([c0df3d2](https://github.com/infiniteuny/infinity-frontend/commit/c0df3d28c17c5669d42c35eb904eacae037a07c1))
* **next-config:** Remove experimental app dir config ([34c914e](https://github.com/infiniteuny/infinity-frontend/commit/34c914e1b52b7b9ae4c2b88ee690125a198a2f5d))
* **proxy:** Move logout initialization to the conditional block ([c0969db](https://github.com/infiniteuny/infinity-frontend/commit/c0969dbe94895e70a80d2103786631f7a079a9ff))
* **proxy:** Return next as default ([c7a8f4b](https://github.com/infiniteuny/infinity-frontend/commit/c7a8f4ba6e1e303f1f0b7cd46acec3324c63f3e7))
* **public:** Remove default and file-based metadata ([7981910](https://github.com/infiniteuny/infinity-frontend/commit/7981910e5f7f9e239a9ce6e59c9354306aca1b53))
* Remove console.log ([059810c](https://github.com/infiniteuny/infinity-frontend/commit/059810c79da4b7eb85865a226ae7fbc934896d3c))
* **renovate:** Update group slugs ([66139ae](https://github.com/infiniteuny/infinity-frontend/commit/66139aedf17c2647cd7f78f9e8a3bb69af42f90a))
* **repository:** Add auth on users repository ([dad1217](https://github.com/infiniteuny/infinity-frontend/commit/dad1217af2417bec5031383358518cc414248500))
* **repository:** Disable sign in from server side ([bfa3fe2](https://github.com/infiniteuny/infinity-frontend/commit/bfa3fe2cc6e7cb68552d4a820cbe132c3bef96b9))
* **repository:** Fix filter and mapper ([0f36c6f](https://github.com/infiniteuny/infinity-frontend/commit/0f36c6f8840c620c236103acf2c6010f4e26cd1c))
* **repository:** Omit group ID from CG admin and core team ([783544e](https://github.com/infiniteuny/infinity-frontend/commit/783544ed3ffbe41ccb0b4330d6cd915647965e73))
* **repository:** Refactor post and put with File to use multipart/form-data ([10b21a7](https://github.com/infiniteuny/infinity-frontend/commit/10b21a76cfa057d0ac48327f1f002b15bb9460ed))
* **repository:** Use form for multipart file upload ([bf24245](https://github.com/infiniteuny/infinity-frontend/commit/bf242458140e6591b7cb95ec8704fd898f66cdee))
* **route:** Add missing includes on data fetch ([2d6dd21](https://github.com/infiniteuny/infinity-frontend/commit/2d6dd21fb851225dfc8cac6c04ac943073dc6835))
* **route:** Mark route as dynamic ([e6c15cb](https://github.com/infiniteuny/infinity-frontend/commit/e6c15cba4aef00fe5c3e717d3c7694ad719e6001))
* **route:** Migrate to asynchronous Dynamic APIs ([a19c8a6](https://github.com/infiniteuny/infinity-frontend/commit/a19c8a6bf7b1d872071b198beec1cb8710e188ad))
* **route:** Move dashboard route ([1a0069f](https://github.com/infiniteuny/infinity-frontend/commit/1a0069fa54e583f50451c9ce65f4155e422fa56a))
* **route:** Optimize data fetch ([8f84416](https://github.com/infiniteuny/infinity-frontend/commit/8f84416f054474eccc109d1ca4ea3cd07341a02c))
* **route:** Remove public routes and components ([77a5157](https://github.com/infiniteuny/infinity-frontend/commit/77a51572ac95f48c75ecd2f275c5580df20e861d))
* **route:** Remove unused routes ([ba8d527](https://github.com/infiniteuny/infinity-frontend/commit/ba8d527090d61dbcf2f2c546e38bde2a5824393e))
* **route:** Update intial user fetch to include major's faculty ([df019fb](https://github.com/infiniteuny/infinity-frontend/commit/df019fb8dc695c377b1396ba769ba7932db1941e))
* **route:** Update login page's get session use case ([4a2e7c7](https://github.com/infiniteuny/infinity-frontend/commit/4a2e7c760b6bee438fa6e9af7803946af761df71))
* **route:** Update route config ([2bb5f2b](https://github.com/infiniteuny/infinity-frontend/commit/2bb5f2bdc8220ee987f11c5232037b249abd9259))
* **route:** Use locale from config ([0ffd96d](https://github.com/infiniteuny/infinity-frontend/commit/0ffd96d77e69ff9866574e63b5188a52911a3c8f))
* **store:** Update import path and injection container name ([fe199e4](https://github.com/infiniteuny/infinity-frontend/commit/fe199e4aa3ec0e57664329da564bd89348e91b87))
* **style:** Fix color hex definitions ([8623435](https://github.com/infiniteuny/infinity-frontend/commit/8623435f3de54ac990840de1fa7625d9af6d5b3b))
* **theme:** Align Material UI breakpoint with Tailwind CSS's config ([d1f621d](https://github.com/infiniteuny/infinity-frontend/commit/d1f621d3a9cc637382688f2b505dddc3f1bf63ec))
* Update import path and config name ([7607317](https://github.com/infiniteuny/infinity-frontend/commit/760731782e1f8c328aafb772a865b67646a4e714))
* Update Infinity API timeout env var ([521ba34](https://github.com/infiniteuny/infinity-frontend/commit/521ba34c54e1e33b8fb05767120af1eef3819db0))
* **usecase:** Add missing positional param for filter ([03189d9](https://github.com/infiniteuny/infinity-frontend/commit/03189d975fafd11a6322438ac35bcec2b0eef33b))
* **usecase:** Authenticate by default ([02568f3](https://github.com/infiniteuny/infinity-frontend/commit/02568f35c02dc599ce898889e8935dc6f6c58175))
* **usecase:** Rename get users with token ([0befb34](https://github.com/infiniteuny/infinity-frontend/commit/0befb3493766e60df37bac6add0f9794f58422ca))
* **usecase:** Revert use case to class again ([935d65f](https://github.com/infiniteuny/infinity-frontend/commit/935d65f2bba44e66f48a19d7aeabfce482b4cc64))
* **util:** Add filled button disabled color style ([cb8ffa8](https://github.com/infiniteuny/infinity-frontend/commit/cb8ffa812b90b509775fde7532a82c25b0683390))
* **util:** Migrate MUI variant and dark mode styling ([8409442](https://github.com/infiniteuny/infinity-frontend/commit/8409442c66c8d1e893f19c608f532c3273c69657))
* **util:** Reorder HTTP error param ([7271767](https://github.com/infiniteuny/infinity-frontend/commit/72717679bfb67eb6e806fe3ecfcf50513ce3a5c0))
* **util:** Update `createM3Theme` function ([6018196](https://github.com/infiniteuny/infinity-frontend/commit/6018196fdcc6a9321592eadd40474757448bdc07))
* **util:** Update DataGrid styles for background transparency and consistent border color ([acfd67d](https://github.com/infiniteuny/infinity-frontend/commit/acfd67d60c7bc3965b433e4aa986b5597577849b))
* **util:** Update Material 3 theme creator function ([c5e84ad](https://github.com/infiniteuny/infinity-frontend/commit/c5e84ad8fcbdea61c9cdfcc442527ca9fbc657a4))
* **workflow:** No need to set Node.js outside docker ([51010d4](https://github.com/infiniteuny/infinity-frontend/commit/51010d46ea528f4fd2be800f2df0d5987ce9577f))


### Features

* Add `PartialBy` type ([b13f639](https://github.com/infiniteuny/infinity-frontend/commit/b13f639ba8560c7de1f1b6bbf22d068e3d323508))
* Add get users ([bcfed5d](https://github.com/infiniteuny/infinity-frontend/commit/bcfed5d0aa317b09736b400cf498ebcf1571375b))
* Add intial openspec configuration ([4b18453](https://github.com/infiniteuny/infinity-frontend/commit/4b18453dc3708455619d3b2d56c79d2b630f9d80))
* **auth:** Handle expired access token ([ea288ee](https://github.com/infiniteuny/infinity-frontend/commit/ea288eead7a754709a4b3e42274e568e868e3105))
* **auth:** Store user access token to session ([94baf9c](https://github.com/infiniteuny/infinity-frontend/commit/94baf9cb9b7b7d7a6f1d707f04a4a1fd566e9df5))
* **component:** Add empty row overlay ([dda6d39](https://github.com/infiniteuny/infinity-frontend/commit/dda6d398a82840c5154a72b9b2c41b0d3c434b3f))
* **component:** Add initial entities list page components ([16342c4](https://github.com/infiniteuny/infinity-frontend/commit/16342c41923f8c336bdc0fe9612d919a3b12f895))
* **component:** Add initial user form ([6014c7d](https://github.com/infiniteuny/infinity-frontend/commit/6014c7d20285167a485a66a864cf928b6a1c6202))
* **component:** Add initial users list component ([3b82715](https://github.com/infiniteuny/infinity-frontend/commit/3b82715eb03e10e70cffa57797d9879f1fb15002))
* **component:** Add internal section header ([2a69aea](https://github.com/infiniteuny/infinity-frontend/commit/2a69aea8321d8c731911dd4df6339651bceda57f))
* **component:** Add login page and component ([5de5de8](https://github.com/infiniteuny/infinity-frontend/commit/5de5de801b95288dd3799a2003423274501209c2))
* **component:** Add main box background ([99d2720](https://github.com/infiniteuny/infinity-frontend/commit/99d27202873d1e9ee1ac85a77b66fb2305347dc3))
* **component:** Add more icons ([c4a1305](https://github.com/infiniteuny/infinity-frontend/commit/c4a130592504688d52bd86b6d1a4b2d5cb4b7ce9))
* **component:** Add PDF viewer component ([a4cde65](https://github.com/infiniteuny/infinity-frontend/commit/a4cde650fcf6ffb2bc4a5fdf8beb078684b20cc2))
* **component:** Add settings view ([afdea5d](https://github.com/infiniteuny/infinity-frontend/commit/afdea5d65cb45e1fec57a455b55f35c578677a25))
* **component:** Add single entity form and view ([593c1d2](https://github.com/infiniteuny/infinity-frontend/commit/593c1d2494e6389d7383463ffde5d3ed8322b253))
* **component:** Add single fund app and single achievement components ([d988b4b](https://github.com/infiniteuny/infinity-frontend/commit/d988b4b339231fa0d4e1b05f1d42675db8667eec))
* **component:** Add single group and permission components ([5b38877](https://github.com/infiniteuny/infinity-frontend/commit/5b38877a0bdcc49492f04862126cdb9312813c81))
* **component:** Add single team components ([2bb2ce0](https://github.com/infiniteuny/infinity-frontend/commit/2bb2ce05f790355262928bae005fd4fdfc99d03e))
* **component:** Add single user view component ([50e42a6](https://github.com/infiniteuny/infinity-frontend/commit/50e42a6a425d1bc1372b327d56bda38e31c69988))
* **component:** Improve user nav menu ([8461fec](https://github.com/infiniteuny/infinity-frontend/commit/8461fec59f0764dbe26a4834a53d15f67a9eb45f))
* **component:** Update section header to accommodate menu ([2955169](https://github.com/infiniteuny/infinity-frontend/commit/295516964c2f0e0d80af70b632a7a6dc694f4209))
* **component:** Update users list and add users toolbar component ([28dff4f](https://github.com/infiniteuny/infinity-frontend/commit/28dff4f0c55e859b85ad365747bd89ebc191a13e))
* **config:** Add more menu route matcher ([52d2c0a](https://github.com/infiniteuny/infinity-frontend/commit/52d2c0a698e4f91b1e4a855a13461333065595f2))
* **config:** Add more symbols for deps injection ([40ddcef](https://github.com/infiniteuny/infinity-frontend/commit/40ddcef0a0500b3aa4fa4340782f37b95bf26b36))
* **datasource:** Disable unused auth endpoint ([59ee36f](https://github.com/infiniteuny/infinity-frontend/commit/59ee36fa83e0690d6372709b2efb3cf19d6c1225))
* **datasource:** Store user ID from infinity API ([85a4ad9](https://github.com/infiniteuny/infinity-frontend/commit/85a4ad9d2bbeffb69e3f579ff8875cf036ada496))
* **deployment:** Add initial dockerfile and workflow ([a8fdfd2](https://github.com/infiniteuny/infinity-frontend/commit/a8fdfd2583ec641e1cbc187c0a41302a6626ab47))
* **deps:** Add date picker, luxon, validator, and react hook form devtool ([c572403](https://github.com/infiniteuny/infinity-frontend/commit/c572403b982b2a00e4f9a96d50ccfd18573f3fae))
* **deps:** Add ioredis for auth server side secondary storage ([fdac974](https://github.com/infiniteuny/infinity-frontend/commit/fdac974790c631b3702e3caf7be6f4fa1e4c59bd))
* **deps:** Add MUI X Data Grid and React Hook Form deps ([1e070a3](https://github.com/infiniteuny/infinity-frontend/commit/1e070a3793000e1a9d4d9373c98ce28a73da7342))
* **deps:** Add react-toastify and prettier-plugin-tailwindcss ([47c47e7](https://github.com/infiniteuny/infinity-frontend/commit/47c47e7443451da9645b1760bd80fc67c24f6c3f))
* **dto:** Add degree, faculty, and major DTO ([b323456](https://github.com/infiniteuny/infinity-frontend/commit/b323456d8cb5e0c3207a765e4a6fe91cd7fd4a4c))
* **dto:** Add pagination options DTO ([d44f61e](https://github.com/infiniteuny/infinity-frontend/commit/d44f61e236c38ff26a18bf226381ce49c239ea0f))
* **dto:** Add user permission ([70b968a](https://github.com/infiniteuny/infinity-frontend/commit/70b968a9d8d3195f16a3287f7dcccd941d88d9b8))
* **entity:** Add degree, faculty, and major entity ([cdfa1c8](https://github.com/infiniteuny/infinity-frontend/commit/cdfa1c86034f5a3155cb08e8c413ab1d5a8d81a3))
* **entity:** Add fund app and team include options ([c8aff58](https://github.com/infiniteuny/infinity-frontend/commit/c8aff58abeb3f601090aab5d64df8e5bbd068aa1))
* **entity:** Add more entities ([9b06f87](https://github.com/infiniteuny/infinity-frontend/commit/9b06f875e0048068da213e7f068de7e224b0ab8c))
* **entity:** Add more filter and include options ([d943be2](https://github.com/infiniteuny/infinity-frontend/commit/d943be2f02018c942b4c62cb1690b70652253c35))
* **entity:** Add user include options ([bee0ecb](https://github.com/infiniteuny/infinity-frontend/commit/bee0ecbd61a4d4292bdc3aa1cc343eaad937b471))
* **entity:** Add user permission ([1236f2a](https://github.com/infiniteuny/infinity-frontend/commit/1236f2a30effda35526f093eab46f047bd69ba4a))
* **folder:** Update folder structure ([62e3e69](https://github.com/infiniteuny/infinity-frontend/commit/62e3e69cd44f90ac754fe29a9f1ba926526ce5f4))
* **injection:** Add more deps injections ([6dfe83b](https://github.com/infiniteuny/infinity-frontend/commit/6dfe83baa8fcaa6d9cd8b4b6a72ec53bbf32f196))
* **injection:** Add more injection configs ([e1d60ce](https://github.com/infiniteuny/infinity-frontend/commit/e1d60cea3662cb0579a18d643be135f34273818c))
* **layout:** Add session provider to internal dashboard layout ([3555e93](https://github.com/infiniteuny/infinity-frontend/commit/3555e938df41bb86ae11e7c9ebec496d838ba43d))
* Migrate to better-auth ([0e3b7d7](https://github.com/infiniteuny/infinity-frontend/commit/0e3b7d7460d25edae7cbd503636c88f5bcf2f0dc))
* **openspec:** Update openspec ([2453789](https://github.com/infiniteuny/infinity-frontend/commit/24537894e236bc264fed3d4b83ae83c504596ae2))
* **openspec:** Update specs ([8f2396c](https://github.com/infiniteuny/infinity-frontend/commit/8f2396c3b7b58e8ea5d18d224c8655dd119d5715))
* **public:** Add some initial title metadata ([dc064a2](https://github.com/infiniteuny/infinity-frontend/commit/dc064a20467c17f5f0cc01c8f77349b9898ec9ec))
* **repository:** Add abort signal ([a1eeb6c](https://github.com/infiniteuny/infinity-frontend/commit/a1eeb6c5cbddc2ae0beb732584b6ccddab9b9fc7))
* **repository:** Add complete repositories ([d6c6b0b](https://github.com/infiniteuny/infinity-frontend/commit/d6c6b0b214a2506a26b81f615658991d4aeb38ee))
* **repository:** Add complete user repository ([a023dcb](https://github.com/infiniteuny/infinity-frontend/commit/a023dcb5c21298ad626eb89020e2b8e775b1125b))
* **repository:** Add degree, faculty, and major repo ([3dd0227](https://github.com/infiniteuny/infinity-frontend/commit/3dd0227d9bef453c45f187f6d04039d7585c7b32))
* **repository:** Add HTTP error handling ([753cfd1](https://github.com/infiniteuny/infinity-frontend/commit/753cfd1b1456c84b511cf9bb4f114e3c9e4f1725))
* **repository:** Add include options on user repo ([fbace4d](https://github.com/infiniteuny/infinity-frontend/commit/fbace4da857bb28d8957f7b1649a65d3cbbbdee5))
* **repository:** Add user permission ([3e515a3](https://github.com/infiniteuny/infinity-frontend/commit/3e515a3fde82c7af5b0dc22f43549e32abf79f2b))
* **repository:** Update auth repo contract ([db7b29c](https://github.com/infiniteuny/infinity-frontend/commit/db7b29cc38d45e33b353b80b176de76f720837bb))
* **repository:** Update infinity API related repo to accept token input ([a776705](https://github.com/infiniteuny/infinity-frontend/commit/a77670570436bb50e86060fb2861f262a38f80ea))
* **route:** Add auth route, controller, and middleware ([428c2da](https://github.com/infiniteuny/infinity-frontend/commit/428c2dac53e16ea359593d0a8d7bae2699db63f9))
* **route:** Add edit page routes ([3a8e1e0](https://github.com/infiniteuny/infinity-frontend/commit/3a8e1e0623880ec9241b96e9b86d0d7126b5e8ea))
* **route:** Add settings pages ([fd9110d](https://github.com/infiniteuny/infinity-frontend/commit/fd9110d408d36685ef72bf6c46435c7248563ef7))
* **route:** Add single user page ([387a750](https://github.com/infiniteuny/infinity-frontend/commit/387a750f22fa823456b48654b785a0d63668893d))
* **route:** Add user form ([02cc392](https://github.com/infiniteuny/infinity-frontend/commit/02cc392604c014c88acb6c6cae85f4c1fe282324))
* **route:** Update users page ([0f79cb8](https://github.com/infiniteuny/infinity-frontend/commit/0f79cb8c88f4d601fb4f37c4dc38a1c87ae0b15f))
* **routing:** Create base routing structure ([bcc6fca](https://github.com/infiniteuny/infinity-frontend/commit/bcc6fcaf4efb5f115bf2d652851e7fdf881b23da))
* Set output type to standalone ([f6aadad](https://github.com/infiniteuny/infinity-frontend/commit/f6aadade271157cc36ac3ab869c9b48f1d3e8010))
* **style:** Setup MUI and Tailwind CSS ([bc66cd1](https://github.com/infiniteuny/infinity-frontend/commit/bc66cd1ba5e56b6bdf7cf530f0628d308f3a5502))
* **style:** Setup Tailwind font and global styles ([af82c2c](https://github.com/infiniteuny/infinity-frontend/commit/af82c2cb40c0e51830d86b57977c76f9184083b6))
* **theme:** Add and use material 3 theme creator ([48f1428](https://github.com/infiniteuny/infinity-frontend/commit/48f1428621064b8e8c147a09431a7d6338b2275a))
* **theme:** Update Material 3 theme creator to use tones ([dbe4163](https://github.com/infiniteuny/infinity-frontend/commit/dbe4163d14bddf3e231ab57c30649d1d43de9c69))
* **theme:** Update theme config to use color from Tailwind CSS config ([7e03913](https://github.com/infiniteuny/infinity-frontend/commit/7e03913e525fb411b87c446045a230609d86b97b))
* **usecase:** Add auth repo for getting access token ([89111cf](https://github.com/infiniteuny/infinity-frontend/commit/89111cf3c121c87662e15c5b7d4804a1e8ef6a0b))
* **usecase:** Add get competition team types ([95b8b39](https://github.com/infiniteuny/infinity-frontend/commit/95b8b39c6d9ae8063a0a79a5137f0c92f29abfb8))
* **usecase:** Add get single user use case ([7a6c6da](https://github.com/infiniteuny/infinity-frontend/commit/7a6c6dabbc4daed1be88a3900bd4e014e87c46ee))
* **usecase:** Add get user permission ([ab79aac](https://github.com/infiniteuny/infinity-frontend/commit/ab79aac103e5131f6280fea75da61c99cf32d8ea))
* **usecase:** Add getUser use case ([8a62576](https://github.com/infiniteuny/infinity-frontend/commit/8a625768e3ccf603b1d25f8c96257fdefa455224))
* **usecase:** Add logout usecase ([beba877](https://github.com/infiniteuny/infinity-frontend/commit/beba877f3d496f9d27315f5ebc5fcb12255839e0))
* **usecase:** Add logout usecase to server side proxy ([d21bb7e](https://github.com/infiniteuny/infinity-frontend/commit/d21bb7e86b65e04c9340d47b6b69272539b94e8c))
* **usecase:** Add more competition related use cases ([c559107](https://github.com/infiniteuny/infinity-frontend/commit/c559107b80f8a4f151ff30a90eee089d9110803c))
* **usecase:** Add more create, read, and update usecase ([3d993d3](https://github.com/infiniteuny/infinity-frontend/commit/3d993d38d42601295dd55a4979f964f65821e30b))
* **usecase:** Add more user, faculty, and major use cases ([0ef790f](https://github.com/infiniteuny/infinity-frontend/commit/0ef790f4b831ca2263cdea45d241e15fb613fbed))
* **utils:** Add Data Grid M3 theme ([36ec8d3](https://github.com/infiniteuny/infinity-frontend/commit/36ec8d3a35eab41df319ee7017bb9cb9b5581e80))



