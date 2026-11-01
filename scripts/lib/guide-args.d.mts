/** `[slug…] [--min N]` → the slugs named (empty = every guide) and the diagram floor (default 1). */
export declare const parseGuideArgs: (argv: readonly string[]) => { slugs: string[]; min: number };
