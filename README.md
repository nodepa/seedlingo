<h1 align="center">Seedling</h1>

<p align="center">
  <img src="docs/seedling-logo-blue.svg"
    alt="seedling-logo" height="160px" width="160px"/>
  <br/>
  <b>Modern mobile multi-language literacy</b>
  <br/>
  <i>A first-language digital learning tool for adults</i>
</p>

<table align="center">
  <tr>
    <td align="center">Language</td>
    <td align="center">App</td>
  </tr>
  <tr>
    <td align="center">Putonghua/<br/>Simplified Chinese</td>
    <td align="center"><a href="https://种字.com">种字.com</a></td>
  </tr>
</table>
<hr>

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
cd seedling/app

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

