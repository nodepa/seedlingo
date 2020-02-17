# Infrastructure Overview

I'm trying out creating PWAs with both React and Vue.

## React

Scaffolded with `create-react-app`.

## Vue

I've created two different projects, one with "everything" and one based just on the pwa template.

### Vue PWA

### Vue Full

# Audit
Lighthouse as described [here](https://www.telerik.com/blogs/building-pwas-with-vuejs)
```sh
$ yarn run build
$ yarn run serve -s dist
$ lighthouse http://localhost:8080 --chrome-flags="--headless" --view

# or with https
$ yarn run build
$ yarn run serve -s dist --https
$ lighthouse https://localhost:8080 --chrome-flags="--headless --ignore-certificate-errors" --view
```

Add compression on dev server to pass lh audit by adding section to packages.js:
```js
{
  "vue": {
    "devServer": {
      "compress": true
    }
  }
}
```