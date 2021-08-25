<h1 align="center">Seedling</h1>

<p align="center">
  <img src="docs/assets/images/seedling-logo-blue.svg"
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

<br/>
<p align="center">
  <a href="/docs/index.md">Documentation</a>
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

Seedling is a first-language digital learning tool for adults;
a collection of literacy exercises
that bundled content can make use of
to provide lessons to learners
unfamiliar with reading the particular content language.

Current exercise types are:

- multiple-choice audio-to-text
- 4-by-4 audio-to-text matching
- multiple-choice explanation-to-text
- 3-by-3 explanation-to-text matching
- cloze multiple-choice

Developing cloze matching and text comprehension exercises
are the next priorities.

Seedling was originally developed by idea of - and for the benefit of -
[Li Ai Education](https://liaieducation.com),
with Putonghua and Simplified Chinese content
available at [种字.com](https://种字.com)

## Get started

### Prerequisites

- Install [git](https://git-scm.com) if not present.
- Install [Node.js](https://nodejs.org), which includes the
  [npm](https://www.npmjs.com/get-npm) (Node Package Manager).
  A good way to manage Node.js versions is to use
  [NVM](https://github.com/nvm-sh/nvm).

### Development setup

```sh
# Clone the Seedling repository
git clone git@github.com:nodepa/seedling.git

# Navigate to repo
cd seedling/app

# Install recommended project version of Node & NPM
# If you do not have NVM installed,
# install Node.js according to your preference,
# but use the version specified in the project's .nvmrc file.
# If you do have NVM installed, it will use the .nvmrc version:
nvm install
nvm use

# Install packages
npm install

# Start the app in local demo
npm start   # Then visit http://localhost:8080 in your web browser

# Run full test suite (scripts for install & lint & test:unit:coverage & test:e2e)
npm run verify
```

Play around with your own content
by replacing the `content/` folder with your own.
See the [Seedling documentation](/docs/index.md) about formats.

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
