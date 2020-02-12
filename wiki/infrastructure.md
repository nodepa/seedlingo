# Infrastructure Overview

I'm trying out creating PWAs with both React and Vue.

## React


## Vue

I've created two different projects, one with "everything" and one based just on the pwa template.

### Vue PWA

### Vue Full
Adds compression on dev server to pass lh audit with:
```js
// vue.config.js
module.exports = {
  devServer: {
    compress: true
  }
}
```

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