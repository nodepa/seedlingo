---
---

# How to build for Android

## Install tools

1. Get and install the [Java Development Kit](
   https://www.oracle.com/java/technologies/downloads)
2. Download the Android Studio/SDK [command line tools](
   https://developer.android.com/studio)
   (scroll to the bottom to find packages with only the command line tools).
3. Unpack the command line tools, e.g. into `$HOME/cmdline-tools/latest`
4. Add the `cmdline-tools`'s parent folder to the environment variable `ANDROID_HOME`,
   and the `/bin`-folder to `PATH`:

   ```sh
   # in .bashrc or similar
   export ANDROID_HOME="$HOME/.android"
   export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
   ```

5. Check for updates:

   ```sh
   sdkmanager --update
   ```

6. Install build tools:

   ```sh
   sdkmanager --install "build-tools;34.0.0"
   ```

## Build for Android

1. Clone the repo as described in [Get started](/get-started/get-started)
2. Navigate to `seedlingo/app`
3. Run the build command

   ```sh
   npm run build:android
   ```

4. Find the final `.apk`-file in `android/app/build/outputs/apk/release/`.

## Troubleshooting

### Must have Java JDK installed

Check with:

```sh
javac --version
```

Install with:

```sh
 sudo apt install openjdk-21-jdk-headless
```

### Java and gradle versions must sync

Verify that `gradle` version is in sync with `java` version
(see the [Gradle Compatibility Matrix](
   https://docs.gradle.org/current/userguide/compatibility.html
)).

Update `seedlingo/app/android/gradle/wrapper/gradle-wrapper.properties` accordingly,
e.g. set `distributionUrl=https\://services.gradle.org/distributions/gradle-8.7-all.zip`
for `javac --version` -> `21.0.4`:

```sh
# at [...]/seedlingo/app/android
./gradlew wrapper --gradle-version 8.9
# if successful, repeat
./gradlew wrapper --gradle-version 8.9
```

Running the command twice ensures that the updated version
is working correctly on the second run.

::: warning
The version of the Android Gradle plugin (AGP)
and Gradle itself are not the same version number.
Check compatibility at
[Android Gradle Plugin > Update Gradle](
  https://developer.android.com/build/releases/gradle-plugin#updating-gradle
)
:::

## Optional extras

### Sign the .apk bundle

1. Add an `apksign.keystore` file
   (see the [Android Studio documentation](
   https://developer.android.com/studio/publish/app-signng))
   to `~/.android` and run the build command `npm run build:android` again.

### Splash and icons

1. Update splash image and icons

    ```sh
    npx cordova-res android --skip-config --copy --icon-source public/logo-m/apple-touch-icon-512x512.png --splash-source public/logo/splash.png --icon-foreground-source public/logo/icon-foreground.png --icon-background-source public/logo/icon-background.png`
    ```
2. Edit `ic_launcher.xml` and `ic_launcher_round.xml`, swap `background`'s `@color` to `@mipmap`
