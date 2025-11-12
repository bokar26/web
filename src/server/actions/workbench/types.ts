/**
 * Discriminated union return type for all workbench server actions
 */
export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }

