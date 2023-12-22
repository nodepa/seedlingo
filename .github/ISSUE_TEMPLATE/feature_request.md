---
name: Feature request
about: Suggest an idea
title: 'feat: 马丽 achieves a goal (keep short, use present tense)'
labels: ''
assignees: ''
---
- [ ] I did all of the following:
  <!-- Check the box by putting an X between the brackets: [X] -->
  - consider getting feedback on the idea in the [discussions](
      https://github.com/nodepa/seedlingo/discussions/categories/ideas)
  - search for duplicate or closed [issues](
      https://github.com/nodepa/seedlingo/issues?q=is%3Aissue)
  - read the feature request [contributing guidelines](
      https://github.com/nodepa/seedlingo/blob/main/.github/CONTRIBUTING.md)

Feel free to treat this template as guidance and deviate where necessary.

## Summary

Present the desired benefit to users with the behaviour you expect to see.
Explain how it differs from current behaviour or what needs to change.

## Story

Describe, step by step, how the user takes advantage of this new feature.

```example
马丽:

1. returns to the home screen
2. taps the same lesson again
3. sees the same exercise she just left
```

## Motivation

[Optional] Add more details on the motivation for this improvement.

What is the expected outcome? What use cases does it support?
Why are we doing this? Why would this enhancement be useful to most users?

```example
Without this new feature,
returning to a lesson seeing a different exercise
makes it feel like she missed a valuable exercise.
```

## Suggested implementation actions

[Optional] List broad implementation steps needed to achieve the suggested outcome,
and why specific considerations should be made.

```example
- [ ] create a generated-exercise cache per lesson
- [ ] invalidate cache if older than 1 hour
- [ ] show exercise from cache or generate new

If it is more than 1 hour since the cache entry was generated,
马丽 is unlikely to expect to see or even remember the previous exercise.
```

## Describe alternatives you've considered

[Optional] A clear and concise description of alternative solutions considered.

```example
Prevent going back to home screen or otherwise leave exercise until done.
```

## Additional context

[Optional] Add any other context or screenshots about the feature request here.

```example
I've made a mockup prototype: marvelapp.com/my-same-exercise-mockup
```
