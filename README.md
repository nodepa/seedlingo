# 立爱识字 Li Ai Shizi

A mobile-first literacy webapp for adult Chinese.

## Development

```sh
# Install git
sudo apt install git

# Clone this git repo
git clone git@github.com:toshify/shizi.git target-dir

# Install [NVM](https://github.com/nvm-sh/nvm) to handle node versions (ensure v#.##.# is latest version):
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

# Reload terminal
exit
Ctrl-Alt-T
# or instead
source ~/.bashrc

# Then install latest Node LTS
nvm install --lts

# Install [yarn](https://yarnpkg.com/getting-started/install) globally
npm install -g yarn

# Navigate to repo
cd shizi/vue # or target-dir/vue or target-dir/react

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

