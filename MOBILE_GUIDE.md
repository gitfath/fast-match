# Mobile Application Development Guide (Android)

## Prerequisites
1. Ensure you have Android Studio installed.
2. Ensure you have the Android SDK and build tools installed.

## Setup Steps (Already Performed)
1. Installed Capacitor dependencies (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/assets`).
2. Initialized Capacitor project (`npx cap init`).
3. Added Android platform (`npx cap add android`).
4. Configured Next.js for static export (`output: 'export'`, `images: { unoptimized: true }`).

## Configuring App Icon & Splash Screen
To customize the app icon and splash screen:
1. Save your desired logo as `frontend/assets/icon.png`. Use a high-quality PNG (at least 1024x1024px) without transparency (for adaptive icons).
2. Save a splash screen image as `frontend/assets/splash.png` (at least 2732x2732px).
3. Run the asset generation command:
   ```bash
   npm run mobile:assets
   ```
   This will generate all icon sizes and place them in the correct Android resource folders.

## Building the APK
To build the application for Android:

1. Build the Next.js frontend and sync to Android:
   ```bash
   npm run mobile:build
   ```
   (This runs `npm run build` and `npx cap sync android`)

2. Open the Android project in Android Studio:
   ```bash
   npx cap open android
   ```

3. In Android Studio:
   - Wait for Gradle sync to complete.
   - Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   - Once built, locate the APK in `frontend/android/app/build/outputs/apk/debug/app-debug.apk`.
   - Or connect a device and click the **Run** button (green play icon).

## Troubleshooting
- If images are missing in the build, ensure `next.config.ts` has `images: { unoptimized: true }`.
- If build fails, ensure proper JDK version is selected in Android Studio (File > Project Structure > SDK Location > Gradle Settings).
