---
prev: /get-started/get-started.md
next: /content/replace-content.md
---

# Content

The Seedlingo app fetches content from the `content/` folder.
The content consist of

- a root config file named `ContentSpec.json`
  that contains a specification that Seedlingo uses
  to identify the rest of the content
- a word-list describing words and their corresponding media,
  like icons, pictures and audio
- media files
- lesson specifications that describe
  which exercise templates to include in a lesson,
  and which words to practice with which exercise types
- audio files giving the users instructions about how to interact and progress

If you want to deploy Seedlingo with your own content,
follow the [Replace default content](replace-content.md)-guide.
The content must be formatted according to the [Content specification](content-spec.md).
