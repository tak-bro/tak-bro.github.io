// Checks the guides in content/docs: the Korean page has no plain `-다` ending (scripts/korean-tone.mjs),
// and the Korean and English pages draw the same number of diagrams (components named `…Diagram`), at
// least `--min` (default 1).
// Usage: node scripts/check-guides.mjs [slug…] [--min N]   — no slug checks every guide.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { plainEndings, proseOf } from './korean-tone.mjs';
import { parseGuideArgs } from './lib/guide-args.mjs';

const DOCS = join(import.meta.dirname, '..', 'content', 'docs');
/** The introduction lists the guides; it has no flow to draw. */
const NO_DIAGRAM = new Set(['index']);

const { slugs: named, min } = parseGuideArgs(process.argv.slice(2));
const slugs = named.length > 0 ? named : (await readdir(DOCS)).filter((f) => /^[^.]+\.mdx$/.test(f)).map((f) => f.slice(0, -4)).sort();

const diagrams = (mdx) => (mdx.match(/<[A-Z]\w*Diagram\b/g) ?? []).length;
const fails = [];

for (const slug of slugs) {
  const ko = await readFile(join(DOCS, `${slug}.mdx`), 'utf8');
  const en = await readFile(join(DOCS, `${slug}.en.mdx`), 'utf8');
  const plain = plainEndings(proseOf(ko));
  const [nKo, nEn] = [diagrams(ko), diagrams(en)];
  const floor = NO_DIAGRAM.has(slug) ? 0 : min;
  console.log(`${slug}: plain ${plain.length} · diagrams ko ${nKo} en ${nEn}`);
  for (const line of plain.slice(0, 5)) console.log(`  plain: ${line}`);
  if (plain.length) fails.push(`${slug} plain ${plain.length}`);
  if (nKo !== nEn) fails.push(`${slug} diagrams ko ${nKo} ≠ en ${nEn}`);
  if (nKo < floor) fails.push(`${slug} diagrams ${nKo} < ${floor}`);
}

console.log(fails.length === 0 ? 'guides: ok' : `guides: fail — ${fails.join(' · ')}`);
process.exit(fails.length === 0 ? 0 : 1);
