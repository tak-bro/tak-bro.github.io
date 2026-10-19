import { pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

const text = z.string().trim().min(1);

/**
 * `title` and `description` are required: they are the page's `<title>`, its
 * search snippet, its share card and its llms.txt line. A file without them
 * would publish with none of those and nothing else would fail.
 */
export const frontmatterSchema = pageSchema.extend({
  title: text,
  description: text,
});
