/** The prose of an MDX file: frontmatter, code, JSX tags, import/export lines and URLs removed. */
export declare const proseOf: (mdx: string) => string;
/** Each sentence or line of `text` that ends in the plain `-다` form, trimmed. */
export declare const plainEndings: (text: string) => string[];
