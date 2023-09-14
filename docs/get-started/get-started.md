---
---

# Get started

If you want to try out Seedling on your local system,
want to develop your own content,
or want to contribute to Seedling,
this should get you up and running.

## Prerequisites

- Install [git](https://git-scm.com) if not present
- Install [Node.js](https://nodejs.org), which includes
  [npm](https://www.npmjs.com/get-npm) (Node Package Manager).

  - If you *do not* use [Volta](https://volta.sh/),
    **use the version specified in the `volta`-section of `package.json`**
    when installing [Node.js](https://nodejs.org) according to your preference.

  - If you *do* use [Volta](https://volta.sh/),
    the `package.json`-specified Node version
    will automatically be installed and used
    when commands are executed.

## Development setup

Follow these steps to set up a development or test environment
on Ubuntu 22.04 LTS or equivalent.

### Clone the Seedling repository

```sh
git clone git@github.com:nodepa/seedling.git
```

### Navigate to repo

```sh
cd seedling/app
```

### Install packages

```sh
npm install
```

### Start the app in local demo

```sh
npm start   # Then visit http://localhost:4173 in your web browser
```

### Run full test suite

This command combines the scripts for:

- `install`
- `lint`
- `test:unit:coverage`
- `test:e2e` (i.e. end-to-end)


```sh
npm test
```

## Misc

Play around with your own content
by replacing the `content/` folder (parallel to the `app/` folder)
with your own content.
