# 立爱种字

Seedling is currently available in Putonghua/Simplified Chinese:
[种字.com](https://种字.com)

## Project setup

Using the Node.js version in the `.nvmrc` file:

```sh
npm install
```

### Compile and hot-reload for development

```sh
npm start
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
npm run lint
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

