// Stub for app/src/Content/Content.ts
// The real Content class bundles ~7 MB of base64 audio via import.meta.glob
// over the content/ folder. The editor doesn't need that — it fetches word
// data from DynamoDB. This stub satisfies the one import that
// MultipleChoiceExercise.vue makes (getInstructionsAudio), without pulling in
// any static content.
export default class Content {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getInstructionsAudio(key: string): string {
    return '';
  }
}
