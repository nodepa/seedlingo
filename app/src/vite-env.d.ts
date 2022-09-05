/// <reference types="vite/client" />
/// <reference types="vitest" />
/// <reference types="vite-plugin-pwa/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare const __AWS_JOB_ID__: string
declare const __AWS_BRANCH__: string
