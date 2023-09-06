#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const packageJson = fs.readFileSync('package.json');
const version = /"version": "(.+)"/.exec(packageJson)[1];

const buildGradle = fs.readFileSync('android/app/build.gradle');
const versionCode = /versionCode\s(.+)/.exec(buildGradle)[1];
const buildGradleWVersionCodeBump = buildGradle.toString().replace(/(\s*versionCode\s)(.*)/, (match, g1, g2) => `${g1}${+g2 + 1}`);
const buildGradleWVersionSync = buildGradleWVersionCodeBump.replace(/^( +versionName ").*"/, `$1${version}"`);
fs.writeFileSync('android/app/build.gradle', buildGradleWVersionSync);

console.log(`Version ${version} and versioNCode ${+versionCode + 1} written to build.gradle`)
