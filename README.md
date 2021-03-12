![Seedlings](https://github.com/nodepa/seedlings/blob/master/asset-sources/seedlings-banner.png)
A mobile-first literacy webapp for adults.

Currently available as 种字立爱 - Seedlings for Putonhua in Simplified Chinese.

## Development

```sh
# Install git
sudo apt install git

# Clone this git repo
git clone git@github.com:toshify/seedlings.git

# Install [NVM](https://github.com/nvm-sh/nvm) to handle node versions (ensure v#.##.# is latest version):
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

# Reload terminal
exit
<Ctrl-Alt-T>
# or instead
source ~/.bashrc

# Then install latest Node LTS
nvm install --lts

# Install [yarn](https://yarnpkg.com/getting-started/install) globally
npm install -g yarn

# Navigate to repo
cd seedlings/vue

# Install packages
yarn # equivalent of: yarn install

# Start the app in local demo
yarn start
```

## Update tools

### NVM
Re-install [NVM](https://github.com/nvm-sh/nvm) to update (ensure v#.##.# is latest version):
```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```

### Node
```sh
nvm install --lts
```

### Yarn
```sh
yarn set version latest
```

## Service Worker

To use latest workbox independently of workbox-webpack-plugin v. < 5.0.0:
1. Download release version from [GitHub](https://github.com/GoogleChrome/workbox/releases/latest)
2. Extract to `/public/wb[major].[minor].[patch]`
3. Edit (e.g.) `/public/wb5.1.4/workbox-sw.js` and replace
   `https://storage.googleapis.com/workbox-cdn/releases/5.1.4` with
   `/wb5.1.4`
4. Edit `/public/service-worker.js` to add custom sw with
   `importScripts('/wb5.1.4/workbox-sw.js');`
5. Config `vue.config.js` with `workboxOptions.importWorkboxFrom: 'local'` to
   inject `modulePathPrefix` automatically, or
   `workboxOptions.importWorkboxFrom: 'disabled'` to only inject dependencies
   and handle the rest in `service-worker.js`

