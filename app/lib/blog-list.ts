/** A blog post as the list page needs it; `date` is `YYYY-MM-DD`. */
export interface BlogListItem {
  readonly url: string;
  readonly title: string;
  readonly description: string;
  readonly date: string;
  readonly tags: readonly string[];
}

export interface BlogYear {
  readonly year: string;
  readonly posts: readonly BlogListItem[];
}

export interface BlogTag {
  readonly tag: string;
  readonly count: number;
}

/**
 * Groups posts by year, keeping the order they come in. The input is already
 * newest first (`blogPosts`), so the years come out newest first too.
 */
export const groupByYear = (posts: readonly BlogListItem[]): BlogYear[] => {
  const years = new Map<string, BlogListItem[]>();
  for (const post of posts) {
    const year = post.date.slice(0, 4);
    const items = years.get(year);
    if (items) items.push(post);
    else years.set(year, [post]);
  }
  return [...years].map(([year, items]) => ({ year, posts: items }));
};

/** Every tag with its post count, most used first, ties in name order. */
export const tagCounts = (posts: readonly BlogListItem[]): BlogTag[] => {
  const counts = new Map<string, number>();
  for (const tag of posts.flatMap((post) => post.tags)) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
};

/** `null` means no filter. */
export const filterByTag = (posts: readonly BlogListItem[], tag: string | null): readonly BlogListItem[] =>
  tag === null ? posts : posts.filter((post) => post.tags.includes(tag));
