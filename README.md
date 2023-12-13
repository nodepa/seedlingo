<h1 align="center">Seedling</h1>

<p align="center">
  <img src="docs/.vuepress/public/images/seedling-logo-blue.svg"
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
    <td align="center"><a href="https://liaizhongzi.com">LiAiZhongzi.com</a></td>
  </tr>
</table>

<br/>
<p align="center">
  <a href="https://globalseedling.com/get-started/get-started.html">Documentation</a>
  ·
  <a href="/.github/CONTRIBUTING.md">Contributing</a>
</p>
<hr>

## Table of contents <!-- omit in toc -->

- [What is Seedling](#what-is-seedling)
- [Get started](#get-started)
- [Community](#community)
- [Code of conduct](#code-of-conduct)
- [Contributing](#contributing)
- [License](#license)

## What is Seedling

Seedling is a digital language learning tool for adults.

A teacher or content developer
can prepare lessons of curated exercises
using Seedling's included exercise templates
to provide tailored exercises
to someone who is learning to read their native first-language.

Current exercise types are:

- multiple-choice audio-to-text
- 4-by-4 audio-to-text matching
- multiple-choice explanation-to-text
- 3-by-3 explanation-to-text matching
- cloze multiple-choice
- text comprehension

Developing a content editor is high on the list of priorities.

Seedling was originally developed by idea of - and for the benefit of -
[Li Ai Education](https://liaieducation.com),
with Putonghua and Simplified Chinese content
available at [种字.com](https://种字.com)

## Get started

### Prerequisites

- Install [git](https://git-scm.com) if not present.
- Install [Node.js](https://nodejs.org), which includes
  [npm](https://www.npmjs.com/get-npm) (Node Package Manager).

  - If you *do not* use [Volta](https://volta.sh/),
    **use the version specified in the `volta`-section of `package.json`**
    when installing [Node.js](https://nodejs.org) according to your preference.

  - If you *do* use [Volta](https://volta.sh/),
    the `package.json`-specified Node version
    will automatically be installed and used
    when commands are executed.

### Development setup

Follow these steps to set up a development or test environment
on Ubuntu 22.04 LTS or equivalent.

#### Clone the Seedling repository

```sh
git clone git@github.com:nodepa/seedling.git
```

#### Navigate to repo

```sh
cd seedling/app
```

#### Install packages

```sh
npm install
```

#### Start the app in local demo

```sh
npm start   # Then visit http://localhost:4173 in your web browser
```

#### Run full test suite

This is a command that combines the scripts for

- `install`
- `lint`
- `test:unit:coverage`
- `test:e2e` (i.e. end-to-end)

```sh
npm test
```

### Misc

Play around with your own content
by replacing the `content/` folder (parallel to the `app/` folder)
with your own content.
See the [Seedling documentation](https://globalseedling.com/content/content.html)
about formats.

## Community

Engage the community and ask questions
in [Seedling discussions](https://github.com/nodepa/seedling/discussions).
Please stop by and say hi.

## Code of conduct

Please help us keep the Seedling community open and positive.
Participate in the spirit of the
[Seedling Code of Conduct](.github/CODE_OF_CONDUCT.md)
and the [GitHub Community Guidelines](
https://docs.github.com/en/github/site-policy/github-community-guidelines).

## Contributing

We would love to receive your contributions to Seedling.
Read through our [contributing guidelines](.github/CONTRIBUTING.md)
and get working on it!

## License

The Seedling project,
EXCEPT all material in the [content/](content/) folder,
is licensed to the public under the [MIT License](LICENSE.md).

The Seedling project's [content/](content/) is licensed to the public under a
[Creative Commons Attribution-ShareAlike 4.0 International Public License](
content/LICENSE.md).

By contributing to the Seedling project,
you agree to license your contribution to the public under these terms,
and affirm that you have the right to do so.
