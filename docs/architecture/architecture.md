---
---

# Architecture

Seedlingo is built using the [VueJS](https://vuejs.org) web framework
to build a client-side single page application (SPA)
with progressive web app (PWA) functionality.
The web app is then wrapped using [Ionic Framework](https://ionicframework.com)
to create a native Android app presenting Seedlingo fully offline in a WebView.

The main code entrypoint for Seedlingo is src/main.ts.

## src/main.ts

Standard VueJS setup- and entrypoint.

Mounts App.vue inside the public/index.html's `<div id="app" />` with `app.mount('#app')`.

## src/App.vue

Lays out the `AppHeader` section with logo and title,
`BottomNavigationBar` in the footer containing
`HomeButton`, `ContinueButton` and `ToggleInstructionsButton`,
and an `ion-content` section that is handled by the router (`ion-router-outlet`).
src/common/router/index.ts lists all routes
and defines src/views/HomeView.vue as the base route.

## src/views/HomeView.vue

Displays src/Lessons/components/LessonsMenu.vue and src/FooterLinks/components/FooterLinks.vue

## src/Lessons/components/LessonsMenu.vue

Lists all the lessons as specified in the content folder
using `Content.LessonsMeta`,
which returns an array of objects with name, icon and audio for each lesson.
Each lesson is wired with a `router-link` of the pattern `/lesson/:id`,
e.g. /lesson/4 directs links of that pattern to src/views/ExerciseSession.vue

## src/views/ExerciseSession.vue

`ExerciseSession` presents one of the exercise components
MatchingExercise.vue, MultipleChoiceExercise.vue or ClozeExercise.vue
based on the `exercise`/`exerciseItems` generated
by src/Lessons/ExerciseProvider.ts.
When `ExerciseSession` is made available in the page/mounted,
`getExercise()` is used to identify the correct lesson
specified by the `/lesson/:id` route param in the browser's address bar.
The number from the path is taken to represent the current lesson number,
and `ExerciseProvider.getExerciseFromLesson(index)` is asked
to generate an exercise from that lesson.

## src/Lessons/ExerciseProvider.ts

`getExerciseFromLesson(index)` uses `Content.LessonSpec` to get all lessons
and verify that the requested lesson exists,
then generates an exercise of random type from the lesson
using `GenerateExerciseOfType[ExerciseType].bind(this)(lesson)`
(where ExerciseType is randomly picked from types available in the lesson),
which executes the relevant
`generate[Matching|MultipleChoice|ExplanationMatching|ExplanationMultipleChoice|SingleCloze|MultiCloze]Exercise(lesson)`.
I.e. for `generateMultipleChoiceExercise`,
a random exercise specification from the lesson is selected,
then 4 random word references from that exercise are selected,
then the actual word specifications referenced are fetched,
before `createMultipleChoiceExerciseFromWords(selectedWords)` is called,
generating four presentable word-objects from the four words.
Then one of the four words are selected randomly to be the correct option
and the exercise object is expanded to account for that.
The correct option's symbol(i.e. icon) is fetched from the passed in lesson data
and stored for display as `iconToMatch`.
The `exercise` object is returned to `ExerciseSession`,
and `ExerciseSession` sets its dynamic component
according to the exercise type from `ExerciseProvider`,
and passes the exercise object along
to e.g. `MultipleChoiceExercise.vue` as a prop (`exercise-prop`).

## src/MultipleChoice/components/MultipleChoiceExercise.vue

`MultipleChoiceSession` takes the `exerciseProp` and wires up the correct option's audio
to auto-play on page-load (`onMounted)` or re-load (through `watch()`).
In the `<template>`,
the first `<ion-row>` contains an `ExerciseButton` (custom `ion-button`)
that displays the correct option's icon using an `<ion-icon>` element.
The second `<ion-row>` displays (by text) the 4 words
that may match the icon and pronunciation of the audio.

## src/Lessons/Content.ts

Content starts off by importing some content related data types,
icons wrapped in javascript,
then all the .mp3.audio files in the content folder,
then all the .json files in the content folder.

`Content.ContentSpec` holds ContentSpec.json
extracted from the collection of imported .json-files.

`Content.WordListSpec` holds the `wordSpecFile` specified in ContentSpec.json.

`Content.getWord()` fetches one specified word object from the `wordListSpec`.

`Content.LessonsMeta` holds a generated collection of objects
necessary to populate the home page menu of lessons,
and also used for basic review of all new words in a lesson.

`Content.LessonSpecs` extracts all the .json-files specified
as `lessonSpecFile` in ContentSpec.json.

`Content.getAudioPath()` returns an audio object
that can be inlined in the html as an audio element's src.
A specific audio file's data is extracted from the collection of '.mp3.audio' files imported earlier.

## content/ContentSpec.json

The content is configured through the content-folder's ContentSpec.json.
A full specification is found in the [content specification](/content/content-spec.md).
Basically, ContentSpec.json specifies where to find
the top-level instructions audio files,
all the lesson specification files,
and the word specification file.
The content/Lesson??.json files contain specifications of lessons
as collections of exercises.
Data file sources (audio, pictures) are generally specified in the `wordSpecFile`,
but explanation exercises also specify
audio/picture/video/symbol for the explanation itself.
