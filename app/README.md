# Seedlingo

Seedlingo is currently available in Putonghua/Simplified Chinese at
[seedlingo.app](https://seedlingo.app)

An English language demo version is available at
[en.seedlingo.app](https://en.seedlingo.app)

## Prerequisites

Install [Node.js](https://nodejs.org),
which includes [npm](https://www.npmjs.com/get-npm) (Node Package Manager).

- If you *do not* use [Volta](https://volta.sh/),
  **use the version specified in the `volta`-section of `package.json`**
  when installing [Node.js](https://nodejs.org) according to your preference.

- If you *do* use [Volta](https://volta.sh/),
  the `package.json`-specified Node version
  will automatically be installed and used
  when commands are executed.

## Project setup

Using the Node.js version in the `volta` section of `package.json`:

```sh
npm install
```

### Compile and hot-reload for development

```sh
npm run dev   # Then visit http://localhost:5173 in your web browser
```

### Compile and minify for production

```sh
npm run build
```

### Run unit tests

```sh
npm run test:unit
```

### Run end-to-end tests

```sh
npm run test:e2e
```

### Lint and fix files

```sh
npm run lint # uses eslint
# or
npm run lint:tsc # uses TypeScript Compiler
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Service Worker

To use latest `workbox` independently of `workbox-webpack-plugin` v. < 5.0.0:

1. Download release version from
   [GitHub](https://github.com/GoogleChrome/workbox/releases/latest)
2. Extract to `/public/wb[major].[minor].[patch]`
3. Edit (e.g.) `/public/wb5.1.4/workbox-sw.js`
   and replace `https://storage.googleapis.com/workbox-cdn/releases/5.1.4`
   with `/wb5.1.4`
4. Edit `/public/service-worker.js` to add custom sw
   with `importScripts('/wb5.1.4/workbox-sw.js');`
5. Config `vue.config.js` with `workboxOptions.importWorkboxFrom: 'local'`
   to inject `modulePathPrefix` automatically,
   or `workboxOptions.importWorkboxFrom: 'disabled'`
   to only inject dependencies and handle the rest in `service-worker.js`
