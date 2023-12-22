---
---

# How to build for Android

1. Get and install the [Java Development Kit](
   https://www.oracle.com/java/technologies/downloads)
2. Download and unpack the Android Studio/SDK [command line tools](
   https://developer.android.com/studio)
   (scroll to the bottom to find packages with only the command line tools).
3. Add the `cmdline-tools`'s parent folder to the environment variable
   `ANDROID_HOME`
4. Clone the repo as described in [Get started](/get-started/get-started)
5. Navigate to `seedlingo/app`
6. Run the build command
   ```sh
   npm run build:android
   ```
7. Find the final `.apk`-file in `android/app/build/outputs/apk/release/`.

# Optional extras

## Sign the .apk bundle

1. Add an `apksign.keystore` file
   (see the [Android Studio documentation](
   https://developer.android.com/studio/publish/app-signng))
   to `~/.android` and run the build command `npm run build:android` again.

## Splash and icons

1. Update splash image and icons

    ```sh
    npx cordova-res android --skip-config --copy --icon-source public/logo-m/apple-touch-icon-512x512.png --splash-source public/logo/splash.png --icon-foreground-source public/logo/icon-foreground.png --icon-background-source public/logo/icon-background.png`
    ```
2. Edit `ic_launcher.xml` and `ic_launcher_round.xml`, swap `background`'s `@color` to `@mipmap`
