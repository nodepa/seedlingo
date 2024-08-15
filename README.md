<h1 align="center">Seedlingo English Demo</h1>

<p align="center">
  <img src="docs/.vuepress/public/images/seedlingo-logo-blue.svg"
    alt="seedlingo-logo" height="160px" width="160px"/>
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
  <tr>
    <td align="center">English demo</td>
    <td align="center"><a href="https://en.seedlingo.app">en.seedlingo.app</a></td>
  </tr>
</table>

<br/>
<p align="center">
  <a href="https://seedlingo.com/get-started/get-started.html">Documentation</a>
  ·
  <a href="/.github/CONTRIBUTING.md">Contributing</a>
</p>
<hr>

## Table of contents <!-- omit in toc -->

- [What is Seedlingo English Demo](#what-is-seedlingo-english-demo)
- [Get started](#get-started)
- [Community](#community)
- [Code of conduct](#code-of-conduct)
- [Contributing](#contributing)
- [License](#license)

## What is Seedlingo English Demo

The Seedlingo English Demo is the Seedlingo app with English demo content,
i.e. the original Simplified Chinese content
has been replaced with English content
for demonstration purposes.

Seedlingo is a digital language learning tool
targeting adults learning to read their native language.

A teacher or content developer
can prepare tailored units of exercises
from Seedlingo's templates
to provide skill-adjusted assignments
to a fluent listener
learning to read the language.

Current exercise types are:

- multiple-choice
  - select text by audio cue
  - select text by short phrase/synonym/explanation
- matching
  - match text to audio cue 4-by-4
  - match text to phrase/synonym/explanation 3-by-3
- cloze
  - select text that matches the missing bit in a sentence
  - select multiple text fragments
    that match multiple missing bits in a sentence
- comprehension
  - read a short paragraph or two,
    then answer questions about the the text,
    before practicing newly introduced words or fragments
    using multiple-choice or matching,
    then finally review the original text

Developing a content editor is high on the list of priorities.

Seedlingo was originally developed as
[立爱种字 LiAiZhongzi.com](https://liaizhongzi.com)
from ideas by [立爱教育 Li Ai Education](https://liaieducation.com),
to help Putonghua speaking adults
learn to read simplified Chinese characters.

To try the Android app, [download version 1.5.2](
  https://github.com/nodepa/seedlingo/releases/download/v1.5.2/seedlingo_v1.5.2_64.apk
) or check the [release history](https://github.com/nodepa/seedlingo/releases)
for a more recent version.
Download to your phone, then install.
You may have to enable the setting "Install from unknown sources"
before your phone will allow the installation.

There is also an English language version available for demonstration purposes
[online at en.seedlingo.app](https://en.seedlingo.app)
or [downloadable for Android](https://github.com/nodepa/seedlingo-en/releases).

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

#### Clone the Seedlingo repository

```sh
git clone git@github.com:nodepa/seedlingo.git
```

#### Navigate to repo

```sh
cd seedlingo/app
```

#### Install packages

```sh
npm install
```

#### Start the app in local preview mode

```sh
npm start   # Then visit http://localhost:4173 in your web browser
```

#### Development mode

You can also run Seedlingo in development mode.

```sh
npm run dev   # Then visit http://localhost:5173 in your web browser
```

#### Run full test suite

Executing the script `test` will trigger the scripts for

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
See the [Seedlingo documentation](https://seedlingo.com/content/content.html)
about formats.

## Community

Engage the community and ask questions
in [Seedlingo discussions](https://github.com/nodepa/seedlingo/discussions).
Please stop by and say hi.

## Code of conduct

Please help us keep the Seedlingo community open and positive.
Participate in the spirit of the
[Seedlingo Code of Conduct](.github/CODE_OF_CONDUCT.md)
and the [GitHub Community Guidelines](
https://docs.github.com/en/github/site-policy/github-community-guidelines).

## Contributing

We would love to receive your contributions to Seedlingo.
Read through our [contributing guidelines](.github/CONTRIBUTING.md)
and get working on it!

## License

The Seedlingo project,
EXCEPT all material in the [content/](content/) folder,
is licensed to the public under the [MIT License](LICENSE.md).

The Seedlingo project's [content/](content/) is licensed to the public under a
[Creative Commons Attribution-ShareAlike 4.0 International Public License](
content/LICENSE.md).

By contributing to the Seedlingo project,
you agree to license your contribution to the public under these terms,
and affirm that you have the right to do so.
