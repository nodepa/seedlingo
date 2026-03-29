/**
 * Minimal Vuex type shim for the editor.
 *
 * The editor does not use Vuex at runtime — the fake store is provided via
 * Vue's inject() mechanism in plugins/ionic.client.ts. However, several
 * app/src components (compiled in the editor context via the @/ alias) import
 * `useStore` from 'vuex'. Vuex's package.json "exports" field omits a "types"
 * condition, so TypeScript's bundler moduleResolution cannot find the real
 * declarations through the normal exports map.
 *
 * This shim declares just enough of the Vuex API surface that those components
 * use, so `nuxi typecheck` passes without requiring the real Vuex types or
 * modifying the app source.
 */
declare module 'vuex' {
  export interface Store<S = unknown> {
    state: S;
    dispatch(type: string, payload?: unknown): Promise<unknown>;
    commit(type: string, payload?: unknown): void;
  }

  export function useStore<S = unknown>(): Store<S>;

  export function createStore<S>(options: unknown): Store<S>;
}
