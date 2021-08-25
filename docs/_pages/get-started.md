---
layout: single
title: Get started
permalink: /get-started/
sidebar:
  nav: sidebar-documentation
---

If you want to try out Seedling on your local system,
want to develop your own content,
or want to contribute to Seedling,
this should get you up and running.

## Prerequisites

- Install [git](https://git-scm.com) if not present
- Install [Node.js](https://nodejs.org), which includes the
  [npm](https://www.npmjs.com/get-npm) (Node Package Manager).
  A good way to manage Node.js versions is to use
  [NVM](https://github.com/nvm-sh/nvm)

## Development setup

### Clone the Seedling repository

```sh
git clone git@github.com:nodepa/seedling.git
```

### Navigate to repo

```sh
cd seedling/app
```

### Install Node & NPM

If you do not have NVM installed,
install Node.js according to your preference,
but *use the version specified in the project's `.nvmrc` file*.
If you do have NVM installed, these commands will use the `.nvmrc` version:

```sh
nvm install
nvm use
```

### Install packages

```sh
npm install
```

### Start the app in local demo

```sh
npm start   # Then visit http://localhost:8080 in your web browser
```

### Run full test suite

This is a command that combines the scripts for

- install
- lint
- test:unit:coverage
- test:e2e

```sh
npm run verify
```

## Misc

Play around with your own content
by replacing the `content/` folder (parallel to the `app/` folder)
with your own.
