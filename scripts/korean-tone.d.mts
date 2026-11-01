/** The prose of an MDX file: code, comments and URLs removed; a JSX tag becomes its `label`/`alt` text. */
export declare const proseOf: (mdx: string) => string;
/** Each sentence or line of `text` that ends in the plain `-다` form, trimmed. */
export declare const plainEndings: (text: string) => string[];
