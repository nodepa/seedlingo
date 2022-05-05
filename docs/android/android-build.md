---
---

# How to build for Android

1. Install tooling according to https://ionicframework.com/docs/developing/android
2. Navigate to `seedling/app`
3. Create Android project

    ```sh
    ionic cap add android
    ```

4. Sync Seedling to Android
```sh
   ionic cap sync android
```

5. Create splash image and icons

    ```sh
    npm i -g cordova-res
    cordova-res android --skip-config --copy --icon-source public/logo-m/apple-touch-icon-512x512.png --splash-source public/logo/splash.png --icon-foreground-source public/logo/icon-foreground.png --icon-background-source public/logo/icon-background.png`
    ```

6. Edit `ic_launcher.xml` and `ic_launcher_round.xml`, swap `background`'s `@color` to `@mipmap`
7. Edit `android/app/build.gradle`, bump version

    ```xml
    versionCode 2
    versionName "0.91.0"
    ```

8. In Android Studio, Build > Create signed build
9. Rename output artifact and manually test before uploading to server

