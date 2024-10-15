# Contributing to Seedlingo <!-- omit in toc -->

Welcome to the Seedlingo community,
and thank you for your efforts to make Seedlingo better!
We appreciate your contribution.

## Table of contents <!-- omit in toc -->

- [Code of conduct](#code-of-conduct)
- [Get familiar](#get-familiar)
- [How can I contribute?](#how-can-i-contribute)
- [Report bugs](#report-bugs)
- [Suggest enhancements](#suggest-enhancements)
- [Improve documentation](#improve-documentation)
- [Implement a fix or feature](#implement-a-fix-or-feature)
- [Develop content](#develop-content)
- [Documentation guidelines](#documentation-guidelines)
- [Coding guidelines](#coding-guidelines)
- [License](#license)

## Code of conduct

Please help us keep the Seedlingo community open and positive.
Participate in the spirit of the [Seedlingo Code of Conduct](CODE_OF_CONDUCT.md)
and the [GitHub Community Guidelines](
https://docs.github.com/en/github/site-policy/github-community-guidelines).

## Get familiar

- Try out a *live version* of Seedlingo at [liaizhongzi.com](https://liaizhongzi.com)
- Engage the *community* and ask questions
  in [Seedlingo discussions](https://github.com/nodepa/seedlingo/discussions).
  Please stop by and say hi.
- Explore the project *documentation*
  at [Seedlingo - Get started](https://seedlingo.com/get-started).
- Inspect the *nuts and bolts* of Seedling
  by cloning the [repository](https://github.com/nodepa/seedlingo).
  See the README-section on [Development setup](../README.md#development-setup)
  for details on how to run Seedlingo in your development environment.

## How can I contribute?

We really appreciate your eagerness to contribute.
We would love to have you:

- [Report bugs](#report-bugs)<!--this blocks TOC regeneration by Markdown AIO-->
- [Suggest enhancements](#suggest-enhancements)
- [Improve documentation](#improve-documentation)
- [Implement a fix or feature](#implement-a-fix-or-feature)
- [Develop content](#develop-content)

## Report bugs

### Before submitting a bug report

Do not submit an issue to ask for help,
rather:

- Use [Seedlingo discussions](https://github.com/nodepa/seedlingo/discussions)
  to search for and/or ask for help.
- Search [open and closed issues](
  https://github.com/nodepa/seedlingo/issues?q=is%3Aissue)
  to see if the problem has already been reported.
  Please add a comment to the existing issue instead of opening a new one.
- If the bug is a security vulnerability,
  please refer to our [security policy](SECURITY.md).
- If you found a mistake in the documentation,
  file a [documentation requests](#before-submitting-a-documentation-request)
  instead.

### Submit a bug report

Bugs are tracked as [GitHub issues](https://guides.github.com/features/issues/).

Create a [new issue](https://github.com/nodepa/seedlingo/issues/new/choose)
and select the [bug report template](/.github/ISSUE_TEMPLATE/bug_report.md).

- Give the bug report a short title that describes clearly
  the path to restore correct functionality.

  ```text
  fix: Prevent crash when navigating home
  ```

- Provide a short description of the issue you experience.
- Describe the exact steps which reproduce the problem
  in as many details as possible,
  from starting the app with which browser on what system,
  through how you ended up with the unmet expectation.
- Describe the behaviour you observed after following the steps
  and point out what exactly is the problem with that behaviour.
- Explain which behaviour you expected to see instead, and why.
- Feel free to include screenshots and animated GIFs
  which show you following the described steps
  and clearly demonstrate the problem.
  You can use [LICEcap](https://www.cockos.com/licecap/) to record GIFs
  on macOS and Windows,
  and [Silentcast](https://github.com/colinkeenan/silentcast)
  or [Byzanz](
  https://manpages.ubuntu.com/manpages/focal/en/man1/byzanz-record.1.html)
  on Linux.
- List environmental factors, like device and browser.

## Suggest enhancements

You can submit both [feature requests](#before-submitting-a-feature-request)
and [documentation requests](#before-submitting-a-documentation-request).

### Before submitting a feature request

- Check the [discussions about ideas](
  https://github.com/nodepa/seedlingo/discussions/categories/ideas).
  Feel free to suggest rough ideas in the discussions,
  allowing the community to participate in refining them from an early stage.
- Search [open and closed issues](
  https://github.com/nodepa/seedlingo/issues?q=is%3Aissue)
  to see if the enhancement has already been suggested.
  Please add a comment to the existing issue instead of opening a new one.

### Submit a feature request

Enhancement suggestions are tracked
as [GitHub issues](https://guides.github.com/features/issues/).

Create a [new issue](https://github.com/nodepa/seedlingo/issues/new/choose)
and select the [feature request template](
/.github/ISSUE_TEMPLATE/feature_request.md).

- Give the feature request a short and descriptive title using present tense,
  clearly identifying the expected improved situation this change will bring
  (preferably to the end user).

  ```text
  feat: 马丽 sees feedback to incorrect answer
  ```

- Describe the behaviour you expect to see
  and how it differs from current behaviour.
- Provide a step-by-step description of the suggested enhancement
  in as many details as possible.
- Explain why this enhancement would be useful to most users.
- Add a breakdown of suggested implementation actions.
- Describe alternative solutions, and why they are not suggested.
- Feel free to include screenshots and animated GIFs
  which help you demonstrate the steps
  or point out the part the suggestion is related to.
  You can use [LICEcap](https://www.cockos.com/licecap/) to record GIFs
  on macOS and Windows,
  and [Silentcast](https://github.com/colinkeenan/silentcast)
  or [Byzanz](
  https://manpages.ubuntu.com/manpages/focal/en/man1/byzanz-record.1.html)
  on Linux.
- Consider using prototyping services like [Marvel](https://marvelapp.com)
  to demonstrate the suggested functionality.

### Before submitting a documentation request

- Check the [discussions about documentation](
  https://github.com/nodepa/seedlingo/discussions/categories/documentation)
  and add your thoughts on the current and desired state
  of the Seedlingo documentation efforts.
- Check [open and closed issues](
  https://github.com/nodepa/seedlingo/issues?q=is%3Aissue)
  for already suggested documentation fixes or improvements.
  Please add a comment to the existing issue instead of opening a new one.

### Submit a documentation request

Enhancement suggestions are tracked
as [GitHub issues](https://guides.github.com/features/issues/).

Create a [new issue](https://github.com/nodepa/seedlingo/issues/new/choose)
and select the [documentation request template](
/.github/ISSUE_TEMPLATE/documentation_request.md).

- Give the documentation request
  a short and descriptive title
  using the imperative mood,
  clearly identifying the improvement to the documentation
  that this change will bring.

  ```text
  docs: Add content spec section
  ```

- Describe the desired benefit to users
  and how to improve the documentation to get there.
  Don't chew over too much.
  For example, processing all of the documentation in a certain way
  should be broken down into sub-tasks in separate issues.
  They can still be submitted together in one pull request.
- Add more explanation on the rationale behind this change
  and explain why this enhancement would be useful to most users.
- Provide a break down of the suggested enhancement
  in as many details as possible.

## Improve documentation

Please submit
a [documentation requests](#before-submitting-a-documentation-request)
if no existing issues cover your intended contribution.

### Submit documentation improvements

1. Familiarize yourself with Seedlingo's [LICENSE](../LICENSE.md).
   By contributing to the Seedlingo project,
   you agree to license your contribution under these terms,
   and affirm that you have the right to do so.
2. Pick a [good first issue](https://github.com/nodepa/seedlingo/contribute)
   or pick one from the prioritized queue
   on the [Documentation project board](
     https://github.com/nodepa/seedlingo/projects/8),
   then assign it to yourself
   or post a comment that you are working on it.
3. If you are not yet a Seedlingo collaborator:
   - [Fork](https://help.github.com/articles/fork-a-repo/)
     the [Seedlingo repository](https://github.com/nodepa/seedlingo),
     then proceed to work on your own fork.
4. Create a new branch off of `main`
   with a short descriptive name starting with `docs/`,
   like `docs/add-get-started`:

   ```bash
   git checkout -b docs/add-get-started main
   ```

5. Find the documentation in the `docs/` folder
   and add your improvements according to the issue you picked.
6. Follow our [documentation guidelines](#documentation-guidelines).
7. Commit your changes using a descriptive commit message
   that follows our [git commit message guidelines](#git-commit-messages):

   ```bash
   git config --local commit.template .gitmessage   # Add commit template once
   git add --patch     # Add files to staging area
   git commit          # Trigger commit message editor with .gitmessage template
   ```

8. Push your branch to GitHub:

   ```bash
   git push origin docs/add-get-started
   ```

9. Create a [pull request](https://github.com/nodepa/seedlingo/pulls)
   describing the aim and scope of the added and/or amended documentation
   according to the [pull request template](/.github/pull_request_template.md).
10. Answer comments on the pull request and await review and approval.
11. Make changes if requested, and commit them to your branch.
12. Rebase your branch on top of later commits to `main`
    and force push to your GitHub fork,
    which will update your pull request:

    ```bash
    git remote -v            # Ensure `upstream` points to `nodepa/seedlingo.git`
    git remote add upstream git@github.com:nodepa/seedlingo.git
    git pull --ff upstream main # update main branch to latest upstream version
    git rebase main -i       # rebase onto updated main
    git push -f              # push rebased branch to overwrite remote
    ```

13. Get notified when approved and merged.
14. **After** your pull request is merged,
    you may want to clean up your fork:

    ```bash
    git pull --ff upstream main         # update main to latest upstream version
    git checkout main -f                          # check out main branch
    git push origin --delete docs/add-get-started # delete remote branch
    git branch -D docs/add-get-started            # delete local branch
    ```

15. Celebrate your successful contribution! :partying_face::tada:

## Implement a fix or feature

### Submit a fix or feature

1. Familiarize yourself with Seedlingo's [LICENSE](../LICENSE.md).
   By contributing to the Seedlingo project,
   you agree to license your contribution under these terms,
   and affirm that you have the right to do so.
2. Pick a [good first issue](https://github.com/nodepa/seedlingo/contribute)
   or pick one from the prioritized queue
   on the [Development and operations project board](
     https://github.com/nodepa/seedlingo/projects/3),
   then assign it to yourself
   or post a comment that you are working on it.
3. If you are not yet a Seedlingo collaborator:
   - [Fork](https://help.github.com/articles/fork-a-repo/)
     the [Seedlingo repository](https://github.com/nodepa/seedlingo),
     then proceed to work on your own fork.
4. Set up your local development environment
   as described in the [README](../README.md#development-setup).
5. Create a new branch off of `main`
   with a short descriptive name starting with `<type>/`
   from our [git commit message guidelines](#git-commit-messages),
   like `fix/restore-audio`,
   `feat/mahjong-exercise-type`
   or `refactor/improve-readability`:

   ```bash
   git checkout -b fix/restore-audio main
   ```

6. Start implementing the issue you picked.
7. Write tests,
   preferably before you write any code.
   - unit tests
     - Name the test file the same as your code file,
       with an added `.test.ts` extension,
       and place it in the same folder.
     - A `fix` MUST have a unit test that DOES NOT pass
       when the `fix` is NOT applied,
       but PASSES when the `fix` IS applied,
       to reduce the chance of the bug reoccurring (i.e. regression).
     - Add or amend unit tests to cover added code
       (100% code coverage is NOT required,
       but critical paths MUST be covered).
     - Treat `describe` as a noun or situation.
     - Treat `it` as a statement about state or how an operation changes state.
   - end-to-end tests/feature tests/integration tests/acceptance tests
     - Name the test file by a descriptive name for the feature
       and put it in `tests/e2e/specs/` or a subfolder.
     - Add or amend tests for the user's "happy-path" through a feature.
     - Do NOT try to cover every possible fail state or edge case.
       Fail states tested here should only be ones
       where the user needs guidance to follow
       the correct path through the feature.
       Extensive edge case testing and system failure state testing
       should be tested in unit tests (see above).
       End-to-end tests are primarily to verify
       that units work well with other units,
       but can also simulate a real user
       accepting or rejecting adherence to development requirements.
8. Follow our [coding guidelines](#coding-guidelines).
9. Commit your changes using a descriptive commit message
   that follows our [commit message conventions](#git-commit-messages):

   ```bash
   git config --local commit.template .gitmessage   # Add commit template once
   git add --patch     # Add files to staging area
   git commit          # Trigger commit message editor with .gitmessage template
   ```

10. Push your branch to GitHub:

    ```bash
    git push origin fix/restore-audio
    ```

11. Create a [pull request](https://github.com/nodepa/seedlingo/pulls)
    describing the aim and scope of the added and/or amended code
    according to the [pull request template](/.github/pull_request_template.md).
12. Answer comments on the pull request and await review and approval.
13. Make changes if requested, and commit them to your branch.
14. Rebase your branch on top of later commits to `main`
    and force push to your GitHub fork,
    which will update your pull request:

    ```bash
    git remote -v            # Ensure `upstream` points to `nodepa/seedlingo.git`
    git remote add upstream git@github.com:nodepa/seedlingo.git
    git pull --ff upstream main # update main branch to latest upstream version
    git rebase main -i       # rebase onto updated main
    git push -f              # push rebased branch to overwrite remote
    ```

15. Get notified when approved and merged.
16. **After** your pull request is merged,
    you may want to clean up your fork:

    ```bash
    git pull --ff upstream main      # update main to latest upstream version
    git checkout main -f                       # check out main branch
    git push origin --delete fix/restore-audio # delete remote branch
    git branch -D fix/restore-audio            # delete local branch
    ```

17. Celebrate your successful contribution! :partying_face::tada:

## Develop content

Note: This section is incomplete.

- [ ] TODO: How to start new content?
- [ ] TODO: How to pick a license for new content?
- [ ] TODO: Add reference to content pack specification in documentation.
- [ ] TODO: Possibly remove this section
            if the suggested idea to [publish Seedlingo to NPM without content](
            https://github.com/nodepa/seedlingo/discussions/74) moves forward,
            since that will change the model to have separate content projects
            that use Seedlingo core as a package.

### Before submitting content

- Check the [discussions about content](
  https://github.com/nodepa/seedlingo/discussions/categories/content)
  and add your thoughts on the current and desired content generation efforts.
- Check [open and closed issues](
  https://github.com/nodepa/seedlingo/issues?q=is%3Aissue)
  for already suggested content fixes or improvements.
  Please add a comment to the existing issue instead of opening a new one.

### Submit content improvements

1. Familiarize yourself with Seedlingo's [LICENSE](../LICENSE.md).
   By contributing content to the Seedlingo project,
   you agree to license your contribution under these terms,
   and affirm that you have the right to do so.
2. Pick a [good first issue](https://github.com/nodepa/seedlingo/contribute)
   or pick one from the prioritized queue
   on the [Development and operations project board](
     https://github.com/nodepa/seedlingo/projects/3),
   then assign it to yourself
   or post a comment that you are working on it.
3. If you are not yet a Seedlingo collaborator:
   - [Fork](https://help.github.com/articles/fork-a-repo/)
     the [Seedlingo repository](https://github.com/nodepa/seedlingo),
     then proceed to work on your own fork.
4. Create a new branch off of `main`
   with a short descriptive name starting with `content/`,
   like `content/cn-relationships`:

   ```bash
   git checkout -b content/cn-relationships main
   ```

5. Find the app's content in the [`content/`](../content/) folder
   and add your improvements according to the issue you picked.
6. Verify the validity of content files
   by running the `LessonValidation.test.ts` file:

   ```bash
   npm run test:unit LessonValidation.test.ts
   ```

7. Commit your changes using a descriptive commit message
   that follows our [git commit message guidelines](#git-commit-messages):

   ```bash
   git config --local commit.template .gitmessage   # Add commit template once
   git add --patch     # Add files to staging area
   git commit          # Trigger commit message editor with .gitmessage template
   ```

8. Push your branch to GitHub:

   ```bash
   git push origin content/cn-relationships
   ```

9. Create a [pull request](https://github.com/nodepa/seedlingo/pulls)
   describing the aim and scope of the added and/or amended content
   according to the [pull request template](/.github/pull_request_template.md).
10. Answer comments on the pull request and await review and approval.
11. Make changes if requested, and commit them to your branch.
12. Rebase your branch on top of later commits to `main`
    and force push to your GitHub fork,
    which will update your pull request:

    ```bash
    git remote -v            # Ensure `upstream` points to `nodepa/seedlingo.git`
    git remote add upstream git@github.com:nodepa/seedlingo.git
    git pull --ff upstream main # update main branch to latest upstream version
    git rebase main -i         # rebase onto updated main
    git push -f                # push rebased branch to overwrite remote
    ```

13. Get notified when approved and merged.
14. **After** your pull request is merged,
    you may want to clean up your fork:

    ```bash
    git pull --ff upstream main       # update main to latest upstream version
    git checkout main -f                              # check out main branch
    git push origin --delete content/cn-relationships # delete remote branch
    git branch -D content/cn-relationships            # delete local branch
    ```

15. Celebrate your successful contribution! :partying_face::tada:

## Documentation guidelines

- Use short sentences and simple language when possible.
- Use [semantic linefeeds](
    https://rhodesmill.org/brandon/2012/one-sentence-per-line/)
  in Markdown documents.
- Aim to use max 80 character wide lines,
  though shorter is great, too.
- Complete sentences in lists are capitalized and end with a dot.
- Incomplete sentences in lists are not capitalized and do not end with a dot.
- Use [Sentence case](https://en.wikipedia.org/wiki/Letter_case#Sentence_case)
  for headings,
  because we have to pick one for consistency.
  Do not use [Title Case](https://en.wikipedia.org/wiki/Title_case).

  ```markdown
  # Sentence case
  # Title Case <!-- Do not use -->
  ```

- Write GitHub flavoured
  [Markdown](https://guides.github.com/features/mastering-markdown/).
- Write in VS Code with [Markdown All in One](
    https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)
  and [markdownlint](
    https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
  plugins,
  with the settings in the Seedlingo project's `.vscode/settings.json` file,
  to keep documentation files similarly formatted.

### Git commit messages

Git commit messages are documentation,
and subject lines may be used to generate change logs.

Our commit message guidelines are inspired by
[Chris Beams](https://chris.beams.io/posts/git-commit/),
[GloomyCorner](https://www.gloomycorner.com/setting-default-commit-template-in-git/)
and [Angular](https://github.com/angular/angular/blob/master/.gitmessage).

Commit message guidelines are provided at commit time
when using the terminal
by adding the [`.gitmessage`](../.gitmessage) template to your git config:

```sh
git config --local commit.template .gitmessage
```

The full guidelines are available in [.gitmessage](../.gitmessage).

Don't get tempted to include a bug fix and a feature in the same commit.

## Coding guidelines

While the project is set up to lint on commit,
notifying you when your code diverges from the style rules,
here are a few additional guidelines.

### Folder structure

- **`/`**
  - Only the [README](../README.md),
    [LICENSE](../LICENSE.md),
    [.gitmessage](../.gitmessage),
    [.gitignore](../.gitignore)
    and the [AWS Amplify config](../amplify.yml)
    live in the root folder.
- **`/docs/`**
  - All documentation live in `docs/`,
    with the only exceptions being
    [README](../README.md) and [LICENSE](../LICENSE.md) files,
    and some GitHub/process related documentation in `.github/`
    (like [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
    and [SECURITY.md](SECURITY.md)).
- **`/content/`**
  - content files consumed by the app,
    including the content's own [LICENSE](../content/LICENSE.md) file
    covering everything in the `content/` folder
- **`/api/`**
  - backend API
- **`/app/`**
  - home of the frontend/Android app's Vue.js project
- **`/app/android/`**
  - Android related project files
- **`/app/coverage/`**
  - system generated unit test coverage files generated to gauge test coverage
- **`/app/dist/`**
  - system generated production build files
- **`/app/public/`**
  - only for static files that are used directly by `index.html`
- **`/app/tests/compontent/`**
  - all unit tests for units that are components
- **`/app/tests/e2e/specs`**
  - all end-to-end tests utilizing Cypress
- **`/app/tests/unit/`**
  - all unit tests for units that are not components
- **`/app/src/`**
  - home of the app's core source code
- **`/app/src/assets/`**
  - relatively static assets, like the app logo
- **`/app/src/ModuleName/`**
  - Each module of the app has its own folder
    with a PascalCased/UpperCamelCased name.
    `BottomNavigationBar` related files live in their own folder,
    just like `MultipleChoice` and `Lessons` related files.
    Content of each module folder should make no assumptions
    about code living outside of the folder,
    de-coupling each module from each other.
    Each module is generally a high-level component
    with supporting sub-components and logic.
  - Within module folders,
    organize by functionality,
    i.e. folders for `components`, `data` etc.
- **`/app/src/lowercase-named-folders/`**
  - Vue.js features and other common and coupled code
    live in lowercase named folders.
- **`/app/src/common/`**
  - Functionality re-used by multiple modules should live in the `common/`-folder.
    Common functionality should preferably be passed into a module
    when the module is instantiated.
- **`/app/src/common/animations/`**
  - animations reused across components
- **`/app/src/common/components/`**
  - components reused across the app
- **`/app/src/common/directives/`**
  - custom plugin directives
- **`/app/src/common/router/`**
  - Vue.js `Router` for client side Single-Page Application routing
- **`/app/src/common/store/`**
  - Vue.js `Store` for client side Single-Page Application state management
- **`/app/src/common/types/`**
  - shared types
- **`/app/src/test-support/`**
  - assets only used in tests
  - overrides for content to allow consistency regardless of content changes
  - Because the unit test framework simulates a DOM,
    some web API objects and functions don't exist in the unit test "browser",
    so we mock certain functions to prevent tests from failing
    for environment disparity reasons.
- **`/app/src/views/`**
  - Vue.js `Views` for top-level component containers/pages
    generally addressed in the router.

### Style guide

All TypeScript code is linted with ESLint and Prettier.

Trigger lint with `npm run lint`.

- Don't override linting rules,
  and ask first if you absolutely have to override.
- Prioritize descriptive variable/method naming over brevity.
  Aim to make the code readable.
  Avoid comments if the same information can be conveyed
  by clever variable/method naming.
- Capitalize initialisms and acronyms in names,
  except for the first word,
  which should be lower-case:
  - `getURI` instead of `getUri`
  - `uriToOpen` instead of `URIToOpen`
- Prefer the object spread operator (`{...anotherObj}`) to `Object.assign()`
- Include a single line of whitespace between methods.
- Use `slice()` to copy an array
- Inline `export` with expressions whenever possible

  ```TypeScript
  // Use this:
  export default class ClassName {

  }

  // Instead of:
  class ClassName {

  }
  export default ClassName
  ```

- Place instances of `require` in the following order:
  - Built-in Node Modules (such as `path`)
  - Local Modules (using relative paths or `@/` shortcut)
- Place class properties in the following order:
  - Class methods and properties (methods starting with `static`)
  - Instance methods and properties

## License

The Seedlingo project,
EXCEPT all material in the [content/](../content/) folder,
is licensed to the public under the [MIT License](../LICENSE.md).

The Seedlingo project's [content/](../content/) is licensed to the public under the
[Creative Commons Attribution-ShareAlike 4.0 International Public License](
../content/LICENSE.md).

By contributing to the Seedlingo project,
you agree to license your contribution to the public under these terms,
and affirm that you have the right to do so.
