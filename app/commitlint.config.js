// Commit template from .gitmessage:
// feat: Add feature (use imperative mood)
// # └── feat, fix, refactor, style, docs, test, content or infra─────────┤

// # **Motivation - Why is this change necessary?**
// Because

// # **Impact - How will this commit address the need?**
// this commit will:
// - add

// # **Context - Additional information** <!-- Optional section -->

// # **Issues - What issues are involved?**
// Resolves #12
// Resolves #23

// **Certification**
// - [ ] I certify that <!-- Check the box to certify: [X] -->
// - I have read the [contributing guidelines](
//   https://github.com/nodepa/seedling/blob/main/.github/CONTRIBUTING.md)
// - I license these contributions to the public under Seedling's [LICENSE](
//   https://github.com/nodepa/seedling/blob/main/LICENSE.md)
//   and have the rights to do so.

// # Signed-off-by: Name/username <email>

// # ─── END OF COMMIT MESSAGE ───────────────────────────────────wrap<=72┘
module.exports = {
  helpUrl:
    "Commit message guidelines are found in this project's root folder's .gitmessage file, and at https://github.com/nodepa/seedling/blob/main/.gitmessage",
  rules: {
    'body-empty': [2, 'never'],
    'body-footer-certification': [2, 'always'],
    'body-impact': [1, 'always'], // 1 means warning
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 72],
    'body-motivation': [1, 'always'], // 1 means warning
    'footer-leading-blank': [2, 'always'],
    'footer-max-line-length': [2, 'always', 72],
    'header-max-length': [2, 'always', 72],
    'scope-enum': [2, 'never'],
    'signed-off-by': [2, 'always'],
    'subject-case': [2, 'always', ['lower-case', 'sentence-case']],
    'subject-empty': [2, 'never'],
    'subject-exclamation-mark': [2, 'never', '.'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      ['content', 'docs', 'feat', 'fix', 'infra', 'refactor', 'style', 'test'],
    ],
    'trailer-exists': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'body-leading-blank': (parsed, when) => {
          if (!parsed.body) {
            return [true];
          }
          const negated = when === 'never';
          const lines = parsed.raw.split(/(?:\r?\n)/).slice(1);
          let firstNonCommentIsBlank = false;
          for (const line of lines) {
            if (line === '') {
              firstNonCommentIsBlank = true;
              break;
            }
            if (!line.match(/^#+/)) {
              break;
            }
          }
          return [
            negated ? !firstNonCommentIsBlank : firstNonCommentIsBlank,
            'body ' + negated
              ? 'may not '
              : 'must ' + 'have leading blank line',
          ];
        },
        'body-footer-certification': function (
          { body, footer },
          when = 'always',
        ) {
          const negated = when == 'never';
          const includesCertification = `${body}${footer}`
            .toLowerCase()
            .includes(
              '**certification**\n' +
                '- [x] i certify that <!-- check the box to certify: [x] -->\n' +
                '- i have read the [contributing guidelines](\n' +
                '  https://github.com/nodepa/seedling/blob/main/.github/contributing.md)\n' +
                "- i license these contributions to the public under seedling's\n" +
                '  [license](https://github.com/nodepa/seedling/blob/main/license.md)\n' +
                '  and have the rights to do so.\n',
            );
          return [
            negated ? !includesCertification : includesCertification,
            'body ' + negated
              ? 'may not  '
              : 'must ' +
                'contain a certification with a box checked with an X, like this:\n\n' +
                '**Certification**\n' +
                '- [X] I certify that <!-- Check the box to certify: [X] -->\n' +
                '- I have read the [contributing guidelines](\n' +
                '  https://github.com/nodepa/seedling/blob/main/.github/CONTRIBUTING.md)\n' +
                "- I license these contributions to the public under Seedling's\n" +
                '  [LICENSE](https://github.com/nodepa/seedling/blob/main/LICENSE.md)\n' +
                '  and have the rights to do so.\n\n',
          ];
        },
        // # **Motivation - Why is this change necessary?**
        // Because
        'body-motivation': function ({ body }, when = 'always') {
          const negated = when == 'never';
          const includesMotivation = body.includes('Because ');
          return [
            negated ? !includesMotivation : includesMotivation,
            'body ' + negated
              ? 'may not  '
              : 'must ' +
                'contain a line of motivation explaining the rationale for the commit by answering "Why is this change necessary?", starting with "Because "\n',
          ];
        },
        // # **Impact - How will this commit address the need?**
        // this commit will:
        // - add
        'body-impact': function ({ body }, when = 'always') {
          const negated = when == 'never';
          const includesImpact = body
            .toLowerCase()
            .includes('this commit will');
          return [
            negated ? !includesImpact : includesImpact,
            'body ' + negated
              ? 'may not  '
              : 'must ' +
                'contain a line of impact explaining the result of the commit by answering "How will this commit address the need?", starting with "this commit will "\n',
          ];
        },
      },
    },
  ],
};
