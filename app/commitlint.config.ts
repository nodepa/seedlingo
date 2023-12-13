// Commit template from .gitmessage:
// feat: Add feature (use imperative mood)
// # └── chore|content|docs|feat|fix|refactor|revert|style|test ──────────┤

// # **Motivation - Why is this change necessary?**
// Because

// # **Impact - How will this commit address the need?**
// this commit will:
// - add

// # **Context - Additional information** <!-- Optional section -->

// # **Issues - What issues are involved?**
// Resolves #123

// **Certification**
// - [ ] I certify that <!-- Check the box to certify: [X] -->
// - I have read the [contributing guidelines](
//   https://github.com/nodepa/seedling/blob/main/.github/CONTRIBUTING.md)
// - I license these contributions to the public under Seedling's [LICENSE](
//   https://github.com/nodepa/seedling/blob/main/LICENSE.md)
//   and have the rights to do so.

// # Signed-off-by: Name/username <email>

// # ─── END OF COMMIT MESSAGE ───────────────────────────────────wrap<=72┘
export default {
  helpUrl:
    'Commit message guidelines are found\n    ' +
    "in the root folder's .gitmessage file, and at\n    " +
    'https://github.com/nodepa/seedling/blob/main/.gitmessage',
  rules: {
    'header-max-length': [2, 'always', 72],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'chore',
        'content',
        'docs',
        'feat',
        'fix',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'scope-enum': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-case': [2, 'always', ['lower-case', 'sentence-case']],
    'subject-exclamation-mark': [2, 'never', '.'],
    'subject-full-stop': [2, 'never', '.'],
    'body-max-line-length': [2, 'always', 72],
    'body-leading-blank': [2, 'always'],
    'body-motivation-section-explaining-why': [1, 'always'], // 1 means warning
    'body-impact-section-explaining-how': [1, 'always'], // 1 means warning
    'body-certification-section': [2, 'always'],
    'footer-max-line-length': [2, 'always', 72],
    'footer-leading-blank': [2, 'always'],
    'signed-off-by': [2, 'always'],
    'trailer-exists': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'body-leading-blank': (
          { body, raw }: { body: string; raw: string },
          when: string,
        ) => {
          if (!body) {
            return [true];
          }
          const negated = when === 'never';
          const lines = raw.split(/(?:\r?\n)/).slice(1);
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
            'body ' +
              (negated ? 'may not ' : 'must ') +
              'have leading blank line',
          ];
        },
        // # **Motivation - Why is this change necessary?**
        // Because
        'body-motivation-section-explaining-why': function (
          { body }: { body: string },
          when = 'always',
        ) {
          const negated = when == 'never';
          const includesMotivation = `${body}`.match(/^[Bb]ecause.*\n/) != null;
          return [
            negated ? !includesMotivation : includesMotivation,
            'body ' +
              (negated ? 'may not ' : 'should ') +
              'contain a motivation section explaining the rationale.\n    ' +
              'Answer "Why is this change necessary?". Start with "Because "  ',
          ];
        },
        // # **Impact - How will this commit address the need?**
        // this commit will:
        // - add
        'body-impact-section-explaining-how': function (
          { body }: { body: string },
          when = 'always',
        ) {
          const negated = when == 'never';
          const includesImpact = `${body}`
            .toLowerCase()
            .includes('this commit will');
          return [
            negated ? !includesImpact : includesImpact,
            'body ' +
              (negated ? 'may not ' : 'should ') +
              'contain an impact section explaining the consequence.\n    ' +
              'Answer "How will this commit address the need?". Start with "this commit will "  ',
          ];
        },
        'body-certification-section': function (
          { body, footer }: { body: string; footer: string },
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
            'body ' +
              (negated ? 'may not ' : 'must ') +
              'contain a certification with a box checked with an X, like this:\n' +
              '**Certification**\n' +
              '- [X] I certify that <!-- Check the box to certify: [X] -->\n' +
              '- I have read the [contributing guidelines](\n' +
              '  https://github.com/nodepa/seedling/blob/main/.github/CONTRIBUTING.md)\n' +
              "- I license these contributions to the public under Seedling's\n" +
              '  [LICENSE](https://github.com/nodepa/seedling/blob/main/LICENSE.md)\n' +
              '  and have the rights to do so.  ',
          ];
        },
      },
    },
  ],
};
