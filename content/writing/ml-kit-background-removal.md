---
title: ML Kit Background Removal — Integration Documentation
slug: ml-kit-background-removal
summary: How I built on-device ML Kit / Vision background removal for Ponteo profile photos — architecture, platform routing, challenges, and fallbacks.
tags:
  - ml-kit
  - react-native
  - ponteo
publishedAt: 2026-03-01
---

## Overview

Ponteo uses **on-device subject/person segmentation** to strip the background from a user's profile photo, producing a transparent PNG that is then uploaded to S3. The entire pipeline runs locally on the device — no third-party server ever receives the raw photo — which satisfies HIPAA-friendly data-handling requirements.

The feature is active in two places:
- **Onboarding** — `CreateYourProfileScreen` (first-time profile setup)
- **Profile Settings** — `PersonalInfoBottomSheet` (profile photo update from settings)

---

## Architecture at a Glance

```
User picks / takes photo
        │
        ▼
openProfilePhotoWithCrop()          ← react-native-image-crop-picker
  • circular 400×400 crop
  • compresses to 0.85 quality
        │
        ▼
prepareProfilePhotoForUpload()      ← src/ml/profilePhotoUpload.ts
  ├── iOS Simulator? → skip cutout, use original
  ├── Persisted failure flag? → skip cutout, use original
  ├── cutProfilePhotoBackground()   ← src/ml/loadSelfieSegmentationModel.ts
  │     ├── normalizeProfileImageForMl()
  │     │     ├── ensureAndroidFileUriForMl() / ensureIosFileUriForMl()
  │     │     └── downscaleForVisionIfNeeded()  (cap: 2048px)
  │     │
  │     ├── iOS 15–16 → PonteoPersonCutout (Vision, Swift)
  │     ├── iOS 17+   → PonteoPersonCutout first, then @six33 fallback
  │     └── Android   → @six33/react-native-bg-removal (ML Kit)
  │
  ├── isCutoutAcceptable()          ← src/ml/cutoutQualityCheck.ts
  │     • checks file size, dimensions, opaque-pixel fraction
  │
  └── Returns ProfilePhotoPayload { uri, fileName, type, usedCutout }
        │
        ▼
UploadDocToS3()                     ← transparent PNG (or original fallback)
```

---

## Dependencies

### JavaScript / React Native

| Package | Version | Role |
|---|---|---|
| `@six33/react-native-bg-removal` | `^1.3.4` | RN bridge to ML Kit (Android) and Vision (iOS 17+) |
| `react-native-image-crop-picker` | `^0.51.1` | Photo picker + circular cropper |
| `react-native-compressor` | `^1.13.0` | Image downscale before ML inference |
| `react-native-blob-util` | `^0.24.5` | File copy for `content://` / `ph://` URI normalization |
| `upng-js` | `^2.1.0` | Pure-JS PNG decoder for alpha-channel quality check |
| `@types/upng-js` | `^2` | TypeScript types for upng-js |
| `patch-package` | `^8.0.0` | Applies in-repo patches to node_modules |

### Android (via `@six33` `build.gradle`)

```gradle
implementation 'com.google.android.gms:play-services-mlkit-subject-segmentation:16.0.0-beta1'
```

This pulls **ML Kit Subject Segmentation** from Play Services. No additional `build.gradle` change is needed in the app itself — it is declared entirely inside the `@six33` library.

### iOS (via `@six33` podspec + custom native module)

- **`@six33/react-native-bg-removal`** — uses `Vision.VNGenerateForegroundInstanceMaskRequest` (iOS 17+)
- **`PonteoPersonCutout`** (custom Swift module) — uses `Vision.VNGeneratePersonSegmentationRequest` (iOS 15+)
- No extra CocoaPods entries needed; both are auto-linked.

---

## Step-by-Step: How It Is Integrated

### Step 1 — Package Installation

```bash
yarn add @six33/react-native-bg-removal upng-js @types/upng-js react-native-compressor react-native-blob-util
```

### Step 2 — Postinstall Fix for New Architecture (iOS)

React Native's codegen resolves `@scope/pkg/package.json` via `require.resolve`. `@six33/react-native-bg-removal` originally only exported `"."` in its `exports` map, so resolution failed and `RNBackgroundRemoverSpec.h` was never generated, breaking the iOS New Architecture build.

A postinstall script patches this automatically on every `yarn install`:

**`scripts/ensure-six33-package-json-export.js`**
```js
// Injects  "./package.json": "./package.json"  into the exports map
// so RN codegen can resolve the package manifest on New Arch builds.
```

`package.json`:
```json
"scripts": {
  "postinstall": "node scripts/ensure-six33-package-json-export.js && patch-package"
}
```

### Step 3 — patch-package Patch for iOS Stability

The upstream `ReactNativeBackgroundRemover.swift` had several crash-prone patterns. A `patch-package` patch (`patches/@six33+react-native-bg-removal+1.3.4.patch`) fixes them:

| Issue in upstream | Fix applied |
|---|---|
| `reject()` called from background thread | Wrapped in `DispatchQueue.main.async {}` |
| `convertToUIImage` returned non-optional and called `fatalError` | Changed to `UIImage?` with GPU → software renderer fallback |
| Output path derived from `url.lastPathComponent` (can be empty) | Replaced with `UUID().uuidString` stable name |
| No extent validity check before Vision | Added `isUsableCIExtent()` guard |

### Step 4 — Custom iOS Native Module (`PonteoPersonCutout`)

A custom Swift/ObjC bridge module was written to handle **iOS 15 and 16**, where `@six33`'s `VNGenerateForegroundInstanceMaskRequest` is not available.

**`ios/ponteo_app/PonteoPersonCutout.m`** — ObjC bridge header:
```objc
RCT_EXTERN_MODULE(PonteoPersonCutout, NSObject)
RCT_EXTERN_METHOD(cutout:(NSString *)imageUri trim:(BOOL)trim resolve:... reject:...)
RCT_EXTERN_METHOD(isRunningOnSimulator:resolve:... reject:...)
```

**`ios/ponteo_app/PonteoPersonCutout.swift`** — Swift implementation:

1. `isRunningOnSimulator` — compiled with `#if targetEnvironment(simulator)` to safely report simulator state to JS without any ML call.
2. `cutout(imageUri:trim:)` — runs on a background queue with `autoreleasepool`:
   - Loads `CIImage` with `.applyOrientationProperty: true` (handles EXIF rotation)
   - Validates extent with `isUsableCIExtent()` (guards infinite/NaN CGRect from corrupt images)
   - Calls `VNGeneratePersonSegmentationRequest` with `.accurate` quality
   - Scales the returned mask to match the input extent (Vision often returns a smaller-resolution mask)
   - Composites with `CIFilter.blendWithMask()` over a transparent background
   - Renders via GPU `CIContext` with software fallback
   - Writes atomic PNG to `NSTemporaryDirectory()`

### Step 5 — JS ML Pipeline (`src/ml/`)

Three TypeScript modules form the pipeline:

#### `loadSelfieSegmentationModel.ts` — Core cutout logic

**URI normalization** (both platforms):
- Android: `content://` URIs from Android 13+ photo picker are copied to `file://` in app cache before being passed to ML Kit, because `java.net.URI` parsing of `content://` strings is unreliable in the native module.
- iOS: `ph://` and other non-`file://` URIs are similarly copied to the cache dir, because Core Image / Vision require stable file paths.

**Downscaling**:
- Images wider or taller than **2048px** are compressed to that limit at 0.9 quality via `react-native-compressor` before ML inference. This prevents Vision / Core Image memory pressure that commonly caused native crashes on high-resolution camera shots.

**Platform routing in `cutProfilePhotoBackground()`**:

```
iOS < 15  → throws (not supported)
iOS 15–16 → PonteoPersonCutout.cutout()  (Vision person segmentation)
iOS 17+   → PonteoPersonCutout.cutout()  first
              └── on failure → @six33 removeBackground()
                    └── on REQUIRES_API_FALLBACK → PonteoPersonCutout.cutout()
Android   → removeBackgroundOnAndroid() with retry loop
```

**Android retry loop** (`removeBackgroundOnAndroid`):
- ML Kit Subject Segmentation downloads its model from Play Services on first use. During that window the native module throws transient errors (`"in progress"`, `"download"`, `"not loaded"`, `"model"`, etc.).
- The code retries up to **6 times** with exponential back-off (`900ms × attempt`) to silently absorb the download delay, so the user never sees an error on first run.

#### `profilePhotoUpload.ts` — Upload orchestration

**Simulator detection** (cached):
- Calls `PonteoPersonCutout.isRunningOnSimulator()` (uses Swift compile-time `#if targetEnvironment(simulator)`) with a fallback bundle-path heuristic (`iphonesimulator` / `CoreSimulator` in `SourceCode.scriptURL`).
- Result is cached in a module-level variable — simulator status never changes at runtime.
- On simulator, the entire cutout path is bypassed (native Vision / ML Kit often hard-crashes the app on simulator and JS `try/catch` cannot recover from those crashes).

**Persisted failure flag**:
- If the segmenter throws a non-transient error (e.g., MediaPipe GPU init failure, OOM after retries), a flag `@ponteo/profile_subject_segmenter_failed_r2` is written to `AsyncStorage`.
- Subsequent uploads skip the cutout path entirely, preventing repeated memory thrashing or LMK kills.
- The flag key includes a **revision number** (`r2`). Bumping this number in code forces all users to retry after a library or ML Kit update that might have fixed the underlying issue.
- A public `clearProfilePhotoSegmenterFailureFlag()` export allows a debug/settings screen to reset the flag manually.

**Fallback chain**:
1. Try cutout → succeeded → quality check
2. Quality check passes → upload transparent PNG (`usedCutout: true`)
3. Cutout fails → persist failure flag → upload original JPEG (`usedCutout: false`)
4. Quality check fails (degenerate output) → upload original JPEG, **do not** set failure flag (segmenter ran fine, output just wasn't usable)
5. S3 upload of cutout fails → retry with original JPEG, show user-facing alert

#### `cutoutQualityCheck.ts` — Output validation

Even when ML Kit / Vision succeeds, it can produce degenerate output (e.g., nearly-all-transparent PNG when no person is detected, or a 1×1 pixel file). `isCutoutAcceptable()` runs three checks:

| Check | Threshold | Reason |
|---|---|---|
| Same asset path as original | equality | Segmenter returned the input unchanged |
| File size | < 180 bytes → reject | Valid portrait cutout is never this small |
| Dimensions via `Image.getSize` | ≤ 8px either axis → reject | Degenerate output |
| Opaque pixel fraction (via `upng-js`) | < 0.8% opaque → reject | Essentially fully transparent; no subject detected |

The alpha scan is capped at **1,048,576 pixels** (1024×1024) to limit memory on large photos. Above that, the fraction check is skipped (file-size and dimension checks still apply).

`upng-js` is used instead of a native call because it runs purely in the JS thread, requires no bridge round-trip, and decodes the PNG alpha channel without rendering to screen.

---

## How It Works End-to-End (User Flow)

1. User taps the profile photo circle.
2. `openProfilePhotoWithCrop()` launches `react-native-image-crop-picker` with a 400×400 circular crop overlay. The toolbar copy says *"Pinch to zoom · center your face"* and an inline hint explains that centering gives better background removal. `avoidEmptySpaceAroundImage: false` allows users to pinch out so their face fills less than the circle — intentional, so headroom exists around the subject.
3. On confirm, the cropped image URI is returned. The modal closes and `uploadPickedProfilePhoto()` begins.
4. `prepareProfilePhotoForUpload()` runs the full ML pipeline (described above) asynchronously. During this time a spinner overlays the profile photo preview with the freshly picked image shown underneath.
5. If cutout succeeds and passes quality check: the `profileImage` state is updated to the transparent PNG URI (visually: background disappears in the preview). The PNG is uploaded.
6. If cutout is skipped or fails: the original cropped JPEG is uploaded. A subtle alert informs the user ("Your photo was saved without background removal.").
7. `usedCutout: true/false` in the payload drives the alert logic — no cutout = notify the user, cutout = silent success.

---

## Challenges & Fixes

### Challenge 1 — iOS Simulator hard crashes
**Problem:** `VNGeneratePersonSegmentationRequest` and `@six33`'s `VNGenerateForegroundInstanceMaskRequest` crash the process on iOS Simulator. The crash happens inside native frameworks — JS `try/catch` cannot intercept it.

**Fix:** Detect simulator at the Swift layer (`#if targetEnvironment(simulator)`) and expose it as a JS-callable async method. Cache the result. Skip the entire ML path on simulator silently.

---

### Challenge 2 — `ph://` and `content://` URIs rejected by ML frameworks
**Problem:** Modern iOS photo pickers return `ph://` asset library URIs; Android 13+ returns `content://` media URIs. Neither Core Image/Vision (iOS) nor ML Kit's `InputImage` decoder (Android) handles these reliably.

**Fix:** Before ML processing, copy the image to a plain `file://` path in the app's cache directory using `react-native-blob-util`. The copy is done via base64 read/write to avoid platform filesystem permission issues.

---

### Challenge 3 — Memory crashes on high-resolution photos
**Problem:** Modern cameras produce 12–50MP images. Passing these directly to Vision or ML Kit caused OOM crashes or LMK kills on devices with limited RAM.

**Fix (pre-ML):** `downscaleForVisionIfNeeded()` caps both dimensions at **2048px** (≈4MP) using `react-native-compressor` at 0.9 quality before any ML call.

**Fix (in ML Kit, Android):** `BackgroundRemoverModule.kt` additionally limits its internal bitmap decode to **4,000,000 pixels** using `ImageDecoder`'s `setTargetSize()` on Android P+ and `BitmapFactory.Options.inSampleSize` on older APIs. OOM is retried up to 3 times with `System.gc()` between attempts.

---

### Challenge 4 — ML Kit model download delay on Android first run
**Problem:** `play-services-mlkit-subject-segmentation` downloads the segmentation model from Google Play Services on first use. During this ~5–30 second window, every call to `removeBackground()` throws a transient error (various messages depending on Play Services version).

**Fix:** `removeBackgroundOnAndroid()` retries up to **6 times** with exponential back-off starting at 900ms. The error message is matched against a list of known transient patterns. Non-transient errors (e.g., "No foreground detected") are not retried.

---

### Challenge 5 — `content://` URI crash in `java.net.URI` (Android)
**Problem:** The `@six33` module constructs the output file name by calling `URI(imageURI).path.split("/").last()`. `content://` URIs are not valid `java.net.URI` arguments and throw `URISyntaxException`, crashing the native module before ML Kit is even called.

**Fix:** `ensureAndroidFileUriForMl()` copies `content://` to a `file://` cache path before the URI is ever passed to the native module. This is enforced in `normalizeProfileImageForMl()` which runs on every platform before any ML call.

---

### Challenge 6 — iOS CGRect extent with infinite/NaN dimensions
**Problem:** Certain corrupt or zero-byte images cause `CIImage(contentsOf:)` to return an image whose `.extent` contains `CGFloat.infinity` or `NaN`. Passing such an extent to Vision or `CIContext.createCGImage` causes a crash.

**Fix:** `isUsableCIExtent()` validates all four float values (`.isFinite`, `!.isNaN`, `!.isInfinite`, `> 1`) before any Vision or CIContext call. Applied in both `PonteoPersonCutout.swift` and the `@six33` patch.

---

### Challenge 7 — Degenerate segmenter output (empty or almost-transparent PNG)
**Problem:** When no clear subject is detected (e.g., a photo of a room, a blurry face far from camera), ML Kit / Vision still "succeeds" but returns a PNG that is 99%+ transparent. Uploading this would erase the user's photo entirely.

**Fix:** `isCutoutAcceptable()` decodes the PNG with `upng-js` and measures the fraction of pixels with alpha > 20. If less than 0.8% of pixels are meaningfully opaque, the cutout is discarded and the original photo is used. File-size (< 180 bytes) and dimension (≤ 8px) guards catch even more extreme degenerate cases without the full decode overhead.

---

### Challenge 8 — iOS Vision returns a smaller mask than the input image
**Problem:** `VNGeneratePersonSegmentationRequest` returns a `VNPixelBufferObservation` whose `pixelBuffer` is typically 512×512 or similar — much smaller than the input photo. Applying this mask directly produces a mis-sized or mis-aligned result.

**Fix:** In `PonteoPersonCutout.swift`, after converting the observation to a `CIImage`, the mask is explicitly scaled to match the input's extent using `CGAffineTransform(scaleX:y:)` and then translated to align origins before compositing.

---

### Challenge 9 — `@six33` upstream `convertToUIImage` called `fatalError`
**Problem:** The upstream library's `convertToUIImage` was non-optional and called `fatalError("Failed to render CGImage")` if the GPU context failed. This crashed the app with no recovery path.

**Fix (via patch):** Changed return type to `UIImage?`. Tries GPU `CIContext` first; on failure falls back to a software renderer `CIContext`; returns `nil` only if both fail (handled gracefully upstream in the call site).

---

### Challenge 10 — Persisted failure thrashing
**Problem:** On devices where the segmenter consistently fails (e.g., Android devices where Play Services is outdated or ML Kit model is corrupt), each profile photo upload would trigger the full ML attempt, fail, and leave memory in a degraded state — potentially causing LMK kills.

**Fix:** On the first non-transient segmenter failure, `persistSegmenterFailure()` writes a flag to `AsyncStorage`. All subsequent calls to `prepareProfilePhotoForUpload()` skip ML entirely. The flag key is versioned (`r2`) so it auto-clears when the library is updated and the revision constant is bumped.

---

### Challenge 11 — New Architecture iOS codegen failure
**Problem:** React Native's New Architecture codegen uses `require.resolve('@six33/react-native-bg-removal/package.json')` to discover the native module spec. Since the library's `exports` map did not include `"./package.json"`, this resolution failed silently — `RNBackgroundRemoverSpec.h` was never generated, and the iOS build failed with a missing header error.

**Fix:** `scripts/ensure-six33-package-json-export.js` (run as a `postinstall` hook) checks for and injects `"./package.json": "./package.json"` into the library's `exports` map every time `yarn install` runs.

---

## Impact & Results

### User Experience
- Profile photos display with transparent backgrounds, which integrates visually with the app's UI — the photo appears "floating" without a rectangular box.
- The feature is silent on success: no extra tap or permission beyond the photo picker.
- On fallback (original photo used), a single brief alert informs the user — the upload still succeeds, so the flow is never blocked.

### Privacy / Compliance
- All ML inference runs **on-device**. No image data is sent to any segmentation API or third-party server. This is noted in code comments as "HIPAA-friendly."

### Platform Coverage
- **iOS 15–16:** Custom Vision module (`PonteoPersonCutout`)
- **iOS 17+:** Custom Vision module preferred; `@six33` foreground-instance mask as fallback
- **Android API 24+:** ML Kit Subject Segmentation via `@six33`
- **iOS Simulator:** Gracefully skipped — original photo used

### Reliability
- Retry loop handles Android first-run model download silently (up to ~6.75 seconds of back-off before giving up).
- Persisted failure flag prevents repeated thrashing on broken devices.
- Quality gate (`isCutoutAcceptable`) ensures a degenerate segmenter output never reaches S3.
- All failure paths fall back to the original photo — the upload **always** completes.

---

## File Reference

| File | Purpose |
|---|---|
| `src/ml/loadSelfieSegmentationModel.ts` | Core cutout orchestration, platform routing, URI normalization, retry |
| `src/ml/profilePhotoUpload.ts` | Upload pipeline, simulator detection, failure persistence, S3 fallback |
| `src/ml/cutoutQualityCheck.ts` | PNG alpha-channel quality validation using upng-js |
| `src/utils/profileImageCropPicker.ts` | Photo picker / circular crop wrapper |
| `ios/ponteo_app/PonteoPersonCutout.swift` | Custom iOS native module (iOS 15–16 Vision segmentation) |
| `ios/ponteo_app/PonteoPersonCutout.m` | ObjC bridge header for `PonteoPersonCutout` |
| `patches/@six33+react-native-bg-removal+1.3.4.patch` | Stability fixes for the upstream `@six33` iOS implementation |
| `scripts/ensure-six33-package-json-export.js` | Postinstall fix for New Architecture codegen resolution |
| `node_modules/@six33/.../BackgroundRemoverModule.kt` | Android ML Kit Subject Segmentation implementation (inside library) |
