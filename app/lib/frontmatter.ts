import { pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

const text = z.string().trim().min(1);

/**
 * `title` and `description` are required: they are the page's `<title>`, its
 * search snippet, its share card and its llms.txt line. A file without them
 * would publish with none of those and nothing else would fail. `seoTitle` is the `<title>` alone, with
 * the topic words a short sidebar title leaves out. A description over 160 characters is cut off in a
 * search snippet, so the build fails on one.
 */
export const frontmatterSchema = pageSchema.extend({
  title: text,
  seoTitle: text,
  description: text.max(160),
});
