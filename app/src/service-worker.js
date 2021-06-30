/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */

// import from local npm with vue.config.js flag importWorkboxFrom: 'local'
// should generate `importScripts('/workbox-v4.3.1/workbox-sw.js');` above ^
// should generate `workbox.setConfig({modulePathPrefix: "/workbox-v4.3.1"});` ^

// if using local from github release (if workbox-webpack-plugin < 5?):
// set  vue.config.js flag `importWorkboxFrom: 'disabled'` and uncomment:
// importScripts('/wb5.1.4/workbox-sw.js');

workbox.core.setCacheNameDetails({ prefix: 'zhongzi' });

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
