---
---

# Android compatibility

Tested on Android x86 emulators

| version | name     | API | Google | WebView                                                                                                                                                                       |
| ------- | -------- | --- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5.0     | Lollipop | 21  | Yes    | Chromium M37 updated through Play                                                                                                                                             |
|         |          |     |        | - js issues (can't handle 'use strict')                                                                                                                                       |
| 5.1     | Lollipop | 22  | Yes    | Chromium M37 updated through Play                                                                                                                                             |
|         |          |     |        | - js issues (can't handle 'use strict')                                                                                                                                       |
| 7.0     | Nougat   | 24  | No     | Chrome 51                                                                                                                                                                     |
|         |          |     |        | - js issues                                                                                                                                                                   |
|         |          |     |        | - loads in com.android.webview 52.0.2743.100 (Chromium)                                                                                                                       |
|         |          |     |        | - js SyntaxError (index):50 remove: async () => {                                                                                                                             |
|         |          |     |        | - js SyntaxError chunk-vendors-legacy.###.js:11 ...await this...                                                                                                              |
|         |          |     |        | - async/await available since Chromium 55                                                                                                                                     |
|         |          |     |        | - fixable by:                                                                                                                                                                 |
|         |          |     |        | --- (s/"use strict";//g)                                                                                                                                                      |
|         |          |     |        | --- vue.config.js transpiledependencies @vue                                                                                                                                  |
|         |          |     |        | --- vue.config.js output: environment: const: false +++                                                                                                                       |
|         |          |     |        | --- tsconfig target es5, es6 ?                                                                                                                                                |
|         |          |     |        | --- modify @capacitor async (transpile not sufficient)                                                                                                                        |
| 7.0     | Nougat   | 24  | Yes    | Chrome 51, chrome inspect/logcat reports: Chrome 69.0.3497.100                                                                                                                |
|         |          |     |        | - ok, functional                                                                                                                                                              |
| 8.0     | Oreo     | 26  | No     | No (throws error on starting WebView)                                                                                                                                         |
|         |          |     |        | - [sideloading Chrome 69.0.3497.100](https://www.apkmirror.com/apk/google-inc/chrome/chrome-69-0-3497-100-release/#downloads) x86 Android 7.0+ restores webview functionality |
| 8.0     | Oreo     | 26  | Yes    | Chrome, chrome inspect/logcat reports: Chrome 69.0.3497.100                                                                                                                   |
|         |          |     |        | - ok, functional                                                                                                                                                              |

Capacitor officially supports Chrome > 60.
That's fine IF WebView has been updated
or has been replaced by a compatible Chromium build.
That may not necessarily be the case for older phones.

Ionic 6 officially supports Android 5.0/minSdkVersion 21,
though compatibility beyond opening the app probably requires Chrome > 60.

