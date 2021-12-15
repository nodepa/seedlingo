---
layout: single
title: Content
permalink: /content/
toc: false
---

The Seedling app fetches content from the `seedling/content` folder. The content consist of

- a root `ContentPack.json` specification instructing Seedling where to find the rest of the content
- a word-list describing words and their corresponding media like icons, pictures and audio
- media files
- a lesson specification describing units of exercises and which words to practice with the given exercise type in the given lesson
- audio files used to instruct the users

If you want to deploy Seedling with your own content, follow the [Replace
default content](replace-content)-guide. The content must be made available and
be formatted according to the [Content Specification](content-spec).
