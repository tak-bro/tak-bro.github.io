import { readdir } from 'node:fs/promises';

// Build-time only, which is why it sits outside app/: react-router.config.ts
// runs it in Node, and re-exporting it from app/lib's barrel would drag
// node:fs/promises into the client bundle and break the build.
//
// `fs/promises.glob` exists on Node 22 but not in @types/node 20, which
// package.json pins.
export const listMdxFiles = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { recursive: true });

  return entries
    .map((entry) => entry.split('\\').join('/'))
    .filter((entry) => entry.endsWith('.mdx'))
    .sort();
};
