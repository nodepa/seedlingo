#!/usr/bin/env node

import fs from 'fs';

const packageJson = fs.readFileSync('package.json', 'utf8');
const version = /"version": "(.+)"/.exec(packageJson)[1];

const buildGradle = fs.readFileSync('android/app/build.gradle', 'utf8');
const versionCode = /versionCode\s(.+)/.exec(buildGradle)[1];
const buildGradleWVersionCodeBump = buildGradle.replace(
  /(\s*versionCode\s)(.*)/,
  (match, g1, g2) => `${g1}${+g2 + 1}`,
);
const buildGradleWVersionSync = buildGradleWVersionCodeBump.replace(
  /(\s*versionName ").*"/,
  `$1${version}"`,
);
fs.writeFileSync('android/app/build.gradle', buildGradleWVersionSync);

// eslint-disable-next-line no-console
console.log(
  `\n\x1b[36m[info]\x1b[0m versionName \x1b[32;1m${version}\x1b[0m and versionCode \x1b[32;1m${
    +versionCode + 1
  }\x1b[0m written to build.gradle\n`,
);
