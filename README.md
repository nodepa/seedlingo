![Seedling](https://github.com/nodepa/seedling/blob/main/asset-sources/seedling-banner.png)
A mobile-first literacy webapp for adults

Available as 立爱种字 - Seedling for Putonghua Simplified Chinese, at [种字.com](https://种字.com)

## Development

```sh
# Install git
sudo apt install git

# Clone this git repo
git clone git@github.com:nodepa/seedling.git

# Install [NVM](https://github.com/nvm-sh/nvm) to handle node versions (ensure v#.##.# is latest version):
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

# Reload terminal
exit
<Ctrl-Alt-T>
# or instead
source ~/.bashrc

# Navigate to repo
cd seedling/vue

# Then install recommended project version of Node & NPM
# NVM will use the version specified in the .nvmrc file
nvm install

# Install packages
npm install

# Start the app in local demo
npm start
```

## Update tools

### NVM
Re-install [NVM](https://github.com/nvm-sh/nvm) to update (ensure v#.##.# is latest version):
```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```

### Node
```sh
nvm install --lts # installs latest lts version
```

### NPM
```sh
npm install -g npm@latest
```

