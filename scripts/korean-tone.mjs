// The Korean pages speak in 해요체 (formal statements in 습니다체); a sentence or line that ends in the
// plain `-다` form is the one shape they must not take. Headings, list items and table cells count too.
// A noun-phrase ending ("…의 차이", "확인") passes.

/** Endings that look plain but are not a sentence ending: none yet. Each entry needs its reason. */
const ALLOWED = new Set([]);

/** Attributes whose text a reader hears or sees: a screen reader reads `label` and `alt`. */
const SPOKEN_ATTRIBUTE = /\b(?:label|alt)="([^"]*)"/g;

/**
 * The prose of an MDX file: frontmatter, code, MDX comments, import/export lines and URLs removed. A JSX tag
 * is replaced by the text of its spoken attributes, one per line, so an aria label is held to the same tone.
 */
export const proseOf = (mdx) =>
  mdx
    .replace(/^---\n[\s\S]*?\n---\n/, '')
    .replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1[^\n]*$/gm, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/^(import|export)\s.*$/gm, '')
    .replace(/<\/?[A-Za-z][^>]*>/g, (tag) => [...tag.matchAll(SPOKEN_ATTRIBUTE)].map(([, text]) => `\n${text}\n`).join(''))
    .replace(/`[^`\n]*`/g, 'CODE')
    .replace(/\]\([^)\s]*\)/g, ']')
    .replace(/https?:\/\/\S+/g, '');

/** `…ㅂ니다` (습니다, 합니다, 입니다, 됩니다) is 습니다체; `아니다`, `다니다` are plain. */
const isPolite = (part) => {
  const before = part.at(-3);
  return part.endsWith('니다') && before !== undefined && (before.charCodeAt(0) - 0xac00) % 28 === 17;
};

/** Each sentence or line of `text` that ends in the plain `-다` form, trimmed. */
export const plainEndings = (text) =>
  text
    .split(/\n|\|/)
    .flatMap((line) => line.split(/(?<=[.!?])\s+/))
    .map((part) =>
      part
        .replace(/^\s*(#+\s+|[-*]\s+|\d+\.\s+|>\s*)/, '')
        .replace(/[\s.!?:;,"'’”)\]*_~]+$/u, '')
        .trim(),
    )
    .filter((part) => part.endsWith('다') && !isPolite(part) && !ALLOWED.has(part));
