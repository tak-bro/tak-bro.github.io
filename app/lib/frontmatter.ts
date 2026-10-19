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

/** A blog post: the date orders the list and stands in for git's lastModified. */
export const blogFrontmatterSchema = frontmatterSchema.extend({
  date: z.iso.date(),
  tags: z.array(text).min(1),
});

/** A project page: the screenshot heads its card on /projects. */
export const projectFrontmatterSchema = frontmatterSchema.extend({
  date: z.iso.date(),
  type: text,
  screenshot: text.startsWith('/'),
  links: z.array(z.object({ title: text, url: z.url() })).optional(),
});
