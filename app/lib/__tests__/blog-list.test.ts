import { describe, expect, it } from 'vitest';
import { filterByTag, groupByYear, listedPosts, tagCounts, type BlogListItem } from '../blog-list';

const post = (date: string, tags: string[]): BlogListItem => ({
  url: `/blog/${date}`,
  title: date,
  description: '',
  date,
  tags,
});

const posts = [
  post('2021-03-10', ['javascript']),
  post('2021-02-10', ['javascript']),
  post('2019-10-07', ['swift', 'etc']),
  post('2015-06-01', ['swift']),
];

describe('groupByYear', () => {
  it('groups newest-first posts into newest-first years', () => {
    expect(groupByYear(posts).map((group) => [group.year, group.posts.length])).toEqual([
      ['2021', 2],
      ['2019', 1],
      ['2015', 1],
    ]);
  });
});

describe('tagCounts', () => {
  it('orders tags by use, then by name', () => {
    expect(tagCounts(posts)).toEqual([
      { tag: 'javascript', count: 2 },
      { tag: 'swift', count: 2 },
      { tag: 'etc', count: 1 },
    ]);
  });
});

describe('filterByTag', () => {
  it('keeps every post with no tag selected', () => {
    expect(filterByTag(posts, null)).toHaveLength(4);
  });

  it('keeps only posts carrying the tag', () => {
    expect(filterByTag(posts, 'swift').map((item) => item.date)).toEqual(['2019-10-07', '2015-06-01']);
  });
});

describe('listedPosts', () => {
  it('drops posts from before 2026 and keeps the rest in order', () => {
    expect(listedPosts([post('2026-11-02', ['agents']), post('2026-01-01', ['agents']), ...posts]).map((item) => item.date)).toEqual([
      '2026-11-02',
      '2026-01-01',
    ]);
  });
});
