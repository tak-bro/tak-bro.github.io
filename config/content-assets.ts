import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { listMdxFiles } from './content-files';

// How content refers to a local image: markdown images and quoted `src` attributes.
const IMAGE_REFS = [/!\[[^\]]*]\((\/[^)\s]+)/g, /\bsrc=["'](\/[^"']+)["']/g];

const isFile = async (path: string): Promise<boolean> => (await stat(path).catch(() => undefined))?.isFile() ?? false;

// A malformed escape is reported as a missing file rather than thrown.
const decode = (url: string): string | undefined => {
  try {
    return decodeURI(url);
  } catch {
    return undefined;
  }
};

/** Every `<page>: <url>` whose local image is missing under publicDir, sorted. */
export const missingAssets = async (contentDir: string, publicDir: string): Promise<string[]> => {
  const missing: string[] = [];

  for (const file of await listMdxFiles(contentDir)) {
    const prose = (await readFile(join(contentDir, file), 'utf8')).replace(/^```[\s\S]*?^```/gm, '');
    const urls = new Set(IMAGE_REFS.flatMap((pattern) => [...prose.matchAll(pattern)].map((match) => match[1])));

    for (const url of urls) {
      const path = decode(url);
      if (!path || !(await isFile(join(publicDir, path)))) missing.push(`${file}: ${url}`);
    }
  }

  return missing.sort();
};
