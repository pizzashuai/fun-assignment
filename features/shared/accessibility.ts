/** Returns a visually-hidden span style string for screen-reader-only text. */
export const srOnly =
  "absolute w-px h-px p-0 -m-px overflow-hidden clip-[rect(0,0,0,0)] whitespace-nowrap border-0";

/** Generates a consistent id for a form control and its label. */
export function labelId(base: string) {
  return {
    labelFor: `${base}-control`,
    controlId: `${base}-control`,
  };
}
