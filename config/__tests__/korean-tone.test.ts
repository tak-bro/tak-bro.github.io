import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { plainEndings, proseOf } from '../../scripts/korean-tone.mjs';

describe('plainEndings', () => {
  it('passes 해요체, 습니다체 and noun-phrase endings', () => {
    expect(plainEndings('훅이 막아요. 규칙은 부탁입니다. 설치 스크립트가 붙입니다!\n## 동작 원리\n- 설정 파일의 차이')).toEqual([]);
  });

  it('catches the plain form in sentences, headings, list items and table cells', () => {
    expect(plainEndings('규칙은 부탁하고, 훅은 막는다. 다음 줄이에요.')).toEqual(['규칙은 부탁하고, 훅은 막는다']);
    expect(plainEndings('### 레포 하나를 세 하네스가 읽는다')).toEqual(['레포 하나를 세 하네스가 읽는다']);
    expect(plainEndings('- 없는 것만 붙인다')).toEqual(['없는 것만 붙인다']);
    expect(plainEndings('| `a` | 처음 한 번 복사한다 |')).toEqual(['처음 한 번 복사한다']);
  });

  // `니다` alone is not 습니다체: only a syllable closed by ㅂ before it is.
  it('catches 아니다 and 다니다, which end in 니다 without being polite', () => {
    expect(plainEndings('그건 버그가 아니다. 학교에 다니다. 버그가 아닙니다. 됩니다.')).toEqual(['그건 버그가 아니다', '학교에 다니다']);
  });

  it('reads an ending through closing quotes, brackets and emphasis', () => {
    expect(plainEndings('"막는다."')).toEqual(['"막는다']);
    expect(plainEndings('(훅이 막는다)')).toEqual(['(훅이 막는다']);
    expect(plainEndings('**훅이 막는다**')).toEqual(['**훅이 막는다']);
  });
});

describe('proseOf', () => {
  it('drops frontmatter, code fences, inline code, JSX and links before the tone is read', () => {
    const mdx = [
      '---',
      'title: 막는다',
      '---',
      '```sh',
      'echo 막는다',
      '```',
      '`막는다` 를 봐요.',
      '<HarnessRepoDiagram />',
      '<include lang="sh">../snippets/a.sh</include>',
      '[링크](https://example.com/막는다)',
    ].join('\n');
    expect(plainEndings(proseOf(mdx))).toEqual([]);
  });

  // A screen reader speaks these, so they keep the page's tone; a file title in `meta` is not prose.
  it('reads the label and alt text of a JSX tag, and drops MDX comments', () => {
    const mdx = ['<HerdrDemo label="사이드바를 접는다." />', '<include meta=\'title="막는다"\'>a.sh</include>', '{/* 바꾸지 않는다 */}', '<img alt="화면을 연다" />'].join('\n');
    expect(plainEndings(proseOf(mdx))).toEqual(['사이드바를 접는다', '화면을 연다']);
  });
});

describe('Korean guides', async () => {
  const docs = join(import.meta.dirname, '../../content/docs');
  const slugs = (await readdir(docs)).filter((file) => /^[^.]+\.mdx$/.test(file)).map((file) => file.slice(0, -4));

  it.each(slugs)('%s ends no sentence in the plain form', async (slug) => {
    expect(plainEndings(proseOf(await readFile(join(docs, `${slug}.mdx`), 'utf8')))).toEqual([]);
  });
});
