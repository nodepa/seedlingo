# Infrastructure Overview

I'm trying out creating PWAs with both React and Vue.

## React

Scaffolded with `create-react-app`.

## Vue
Scaffold a full blown SPA with PWA traits with `vue create vue` + "Manually select features", manually selecting ALL options.
* Please pick a preset: Manually select features
* Check the features needed for your project: Babel, TS, PWA, Router, Vuex, CSS Pre-processors, Linter, Unit, E2E
  * Babel - use because with template it just works, so can ignore or make use of as sees fit.
  * TS - Strong typing for JS, worth a shot, but not sure if it's worth sticking with yet.
    * Class-style components: If using TypeScript, then most def. This allows defining [vue components with the normal syntax for TS classes](https://vuejs.org/v2/guide/class-and-style.html). [Comparison](https://medium.com/haiiro-io/why-i-use-vue-class-component-472579a266b4). May drop if other needed node modules not compatible.
  * PWA - most def.
  * Router - Building SPA, so most def.
  * Vuex - State management, will most likely use.
  * CSS preprocessor (PostCSS, Autoprefixer and CSS Modules by default), pick Sass/**SCSS** (with node-sass for speed) for familiarity/similarity to CSS, otherwise we might as well use Stylus which gives syntax flexibility. While Stylus looks good, improvements are mainly in syntax flexibility: [Sass vs Stylus](https://designshack.net/articles/css/sass-vs-stylus-who-wins-the-minimal-syntax-battle/). [Another comparison of features including Less](https://code.tutsplus.com/tutorials/sass-vs-less-vs-stylus-preprocessor-shootout--net-24320). Less not a good option.
  * Linter - I'd like some ignore ; syntax, so should use Standard, in particular if also using Stylus' minimalistic syntax for CSS.
    * Lint both on save and commit in case editing outside VS Code.
  * Jest/Cypress for testing. Tried on previous prototype and found superior in my mind.
* Configuration:
  * Use Babel alongside TypeScript (required for modern mode, auto-detected polyfills, transpiling JSX)? Yes
  * Use history mode for router? (Requires proper server setup for index fallback in production) Yes
  * Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): Stylus
  * Pick a linter / formatter config: Standard
  * Pick additional lint features: Lint on save, Lint and fix on commit
  * Pick a unit testing solution: Jest
  * Pick a E2E testing solution: Cypress
  * Where do you prefer placing config for Babel, ESLint, etc.? In package.json

## Front end technologies

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