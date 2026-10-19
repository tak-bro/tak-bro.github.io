import { readdir } from 'node:fs/promises';

const TRANSLATION = 'en';

// [source suffix, translation suffix]: Korean files carry no locale suffix.
const PAIRS = [
  ['.mdx', `.${TRANSLATION}.mdx`],
  ['meta.json', `meta.${TRANSLATION}.json`],
] as const;

const counterpart = (file: string): string | undefined => {
  for (const [source, translation] of PAIRS) {
    if (file.endsWith(translation)) return `${file.slice(0, -translation.length)}${source}`;
  }
  for (const [source, translation] of PAIRS) {
    if (file.endsWith(source)) return `${file.slice(0, -source.length)}${translation}`;
  }

  return undefined;
};

/** Every content file whose other-language counterpart is missing, one line each. */
export const localeParityGaps = async (dir: string): Promise<string[]> => {
  const files = new Set(await readdir(dir, { recursive: true }));

  return [...files]
    .flatMap((file) => {
      const other = counterpart(file);

      return other && !files.has(other) ? [`${other} is missing (for ${file})`] : [];
    })
    .sort();
};
