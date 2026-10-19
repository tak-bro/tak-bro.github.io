import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

const run = promisify(execFile);

const SCRIPT = fileURLToPath(new URL('../../scripts/import-jekyll.mjs', import.meta.url));

const post = (title: string, body: string) =>
  ['---', 'layout: post', `title: ${title}`, 'description: >', `  ${title} 설명`, 'hide_image: true', '---', '', body, ''].join('\n');

const WIF = '5KSyntheticTestKeyNotARea1Wa11etKeySyntheticTestKey';
const WALLET = 'PW5SyntheticWa11etPasswordForTestsSyntheticWa11etPass';

/**
 * The Jekyll posts come from a private repo into a public one and must compile as
 * MDX. The script runs as shipped against a fixture source tree.
 */
describe('import-jekyll', () => {
  let dir: string | undefined;

  const setup = async (files: Record<string, string>) => {
    dir = await mkdtemp(join(tmpdir(), 'site-import-'));
    for (const [path, body] of Object.entries(files)) {
      await mkdir(join(dir, 'src', path, '..'), { recursive: true });
      await writeFile(join(dir, 'src', path), body);
    }
    const out = join(dir, 'site');
    await mkdir(join(out, 'content/blog'), { recursive: true });
    await writeFile(join(out, 'content/blog/stale.mdx'), 'previous run');

    const importPosts = () =>
      run(process.execPath, [SCRIPT, join(dir!, 'src'), '--out', out])
        .then(({ stdout }) => ({ code: 0, output: stdout }))
        .catch((error: { code?: number; stdout?: string; stderr?: string }) => ({
          code: error.code ?? 1,
          output: `${error.stdout ?? ''}${error.stderr ?? ''}`,
        }));
    const blogFiles = async () => (await readdir(join(out, 'content/blog'))).sort();
    const read = (slug: string) => readFile(join(out, 'content/blog', `${slug}.mdx`), 'utf8');
    const readProject = (name: string) => readFile(join(out, 'content/projects', `${name}.mdx`), 'utf8');

    return { importPosts, blogFiles, read, readProject, out };
  };

  afterEach(async () => {
    if (dir) await rm(dir, { recursive: true, force: true });
    dir = undefined;
  });

  it('takes date and slug from the file name and the tag from the folder', async () => {
    const { importPosts, blogFiles, read } = await setup({
      'swift/_posts/2015-03-19-basic-swift01.md': post('스위프트 기초', '본문'),
      'java/_posts/2015-03-07-advanced-java01.md': post('자바 심화', '본문'),
    });

    expect((await importPosts()).code).toBe(0);
    expect(await blogFiles()).toEqual(['advanced-java01.mdx', 'basic-swift01.mdx']);
    const mdx = await read('basic-swift01');
    expect(mdx).toContain('title: "스위프트 기초"');
    expect(mdx).toContain('description: "스위프트 기초 설명"');
    expect(mdx).toContain('date: "2015-03-19"');
    expect(mdx).toContain('tags: ["swift"]');
    expect(mdx).not.toContain('layout');
    expect(mdx).not.toContain('hide_image');
  });

  it('leaves code fences and inline code byte for byte', async () => {
    const code = ['```swift', 'let x = { (a: Int) -> Int in a }', 'var list: Array<String> = []', '{:target="_blank"}', '```'].join('\n');
    const { importPosts, read } = await setup({
      'swift/_posts/2015-03-20-closures.md': post('클로저', `${code}\n\n\`Array<T>\` 와 \`{ }\` 는 그대로`),
    });

    expect((await importPosts()).code).toBe(0);
    const mdx = await read('closures');
    expect(mdx).toContain(code);
    expect(mdx).toContain('`Array<T>` 와 `{ }` 는 그대로');
  });

  it('turns Jekyll-only syntax outside code into valid MDX', async () => {
    const body = [
      '[링크](https://example.com){:target="_blank"}',
      '줄바꿈<br>두 번<br/>',
      '제네릭 List<String> 과 <eoslib/eos.hpp> 그리고 {중괄호}',
      '중간 ```eosc wallet list``` 명령',
      '```c++',
      'int main() {}',
      '```',
      '안내 <https://example.com/a>',
      '**NOTE**',
      '{:.lead}',
    ].join('\n');
    const { importPosts, read } = await setup({ 'etc/_posts/2015-03-08-syntax.md': post('구문', body) });

    expect((await importPosts()).code).toBe(0);
    const mdx = await read('syntax');
    expect(mdx).toContain('[링크](https://example.com)\n');
    expect(mdx).toContain('줄바꿈<br />두 번<br />');
    expect(mdx).toContain('제네릭 List&lt;String> 과 &lt;eoslib/eos.hpp> 그리고 \\{중괄호\\}');
    expect(mdx).toContain('중간 `eosc wallet list` 명령');
    expect(mdx).toContain('```cpp\nint main() {}\n```');
    expect(mdx).toContain('안내 [https://example.com/a](https://example.com/a)');
    expect(mdx).not.toContain('{:');
  });

  it('rewrites links to old post URLs to the flat /blog/<slug> form', async () => {
    const { importPosts, read } = await setup({
      'blockchain/_posts/2018-02-07-eos-tutorial.md': post('EOS', '[새 글](/blog/blockchain/2018-09-05-new-eos-tutorial/)'),
      'blockchain/_posts/2018-09-05-new-eos-tutorial.md': post('새 EOS', '본문'),
    });

    expect((await importPosts()).code).toBe(0);
    expect(await read('eos-tutorial')).toContain('[새 글](/blog/new-eos-tutorial)');
  });

  it('masks keys, wallet passwords, home paths, and the company scope', async () => {
    const body = [
      '```bash',
      `$ cleos wallet import ${WIF}`,
      `$ cleos wallet unlock --password ${WALLET}`,
      'cd /Users/tak/workspace/eos/build',
      '```',
      "import { X } from '@lemoncloud/components';",
      'Public key: EOSSyntheticPub1icKeyForTestsSyntheticPub1icKeyForTes',
      `Private key: ${WIF}`,
    ].join('\n');
    const { importPosts, read } = await setup({ 'blockchain/_posts/2018-09-05-keys.md': post('키', body) });

    expect((await importPosts()).code).toBe(0);
    const mdx = await read('keys');
    expect(mdx).not.toContain(WIF);
    expect(mdx).not.toContain(WALLET);
    expect(mdx).toContain('cleos wallet import <private-key>');
    expect(mdx).toContain('--password <wallet-password>');
    expect(mdx).toContain('cd ~/workspace/eos/build');
    expect(mdx).toContain('@my-org/components');
    expect(mdx).toContain('EOSSyntheticPub1icKeyForTestsSyntheticPub1icKeyForTes');
    // In prose the placeholder must be escaped, or MDX parses it as a JSX tag.
    expect(mdx).toContain('Private key: &lt;private-key>');
  });

  it('remaps body headings to consecutive levels starting at h2', async () => {
    const body = ['# 제목', '본문', '#### 깊은 절', '```bash', '# comment', '```', '## 중간'].join('\n');
    const { importPosts, read } = await setup({ 'etc/_posts/2015-03-08-heads.md': post('헤딩', body) });

    expect((await importPosts()).code).toBe(0);
    const mdx = await read('heads');
    expect(mdx).toMatch(/^## 제목$/m);
    expect(mdx).toMatch(/^#### 깊은 절$/m);
    expect(mdx).toMatch(/^### 중간$/m);
    expect(mdx).toContain('```bash\n# comment\n```');
  });

  it('writes nothing when the image stage fails the sensitive scan', async () => {
    const { importPosts, blogFiles } = await setup({
      'etc/_posts/2015-03-08-svg.md': post('SVG', '![d](/assets/img/blog/d.svg)'),
      'assets/img/blog/d.svg': '<svg><text>louis-lemon</text></svg>',
    });

    const result = await importPosts();

    expect(result.code).toBe(1);
    expect(await blogFiles()).toEqual(['stale.mdx']);
    await expect(readdir(join(dir!, 'site/public/assets/img'))).rejects.toThrow();
  });

  it('refuses a source root without posts', async () => {
    const { importPosts, blogFiles } = await setup({ 'README.md': 'not a blog' });

    const result = await importPosts();

    expect(result.code).toBe(1);
    expect(result.output).toContain('no posts');
    expect(await blogFiles()).toEqual(['stale.mdx']);
  });

  it('writes nothing and exits 1 when two posts share a slug', async () => {
    const { importPosts, blogFiles } = await setup({
      'swift/_posts/2015-03-19-intro.md': post('A', '본문'),
      'java/_posts/2015-03-07-intro.md': post('B', '본문'),
    });

    const result = await importPosts();

    expect(result.code).toBe(1);
    expect(result.output).toContain('intro');
    expect(await blogFiles()).toEqual(['stale.mdx']);
  });

  it('writes nothing and exits 1 when a post still matches a sensitive pattern', async () => {
    const { importPosts, blogFiles } = await setup({
      'etc/_posts/2015-03-08-leak.md': post('유출', 'louis-lemon 계정'),
    });

    const result = await importPosts();

    expect(result.code).toBe(1);
    expect(result.output).toContain('leak.mdx');
    expect(await blogFiles()).toEqual(['stale.mdx']);
  });

  it('copies referenced images to public/ and drops images the source lacks', async () => {
    const { importPosts, read } = await setup({
      'etc/_posts/2015-03-08-pics.md': post('그림', '![topology](/assets/img/blog/topology.gif)\n\n![](/images/gone.png)\n\n![패킷](/images/packet.png)'),
      'assets/img/blog/topology.gif': 'GIF89a',
      'assets/img/blog/unused.png': 'not referenced',
    });

    expect((await importPosts()).code).toBe(0);
    const mdx = await read('pics');
    expect(mdx).toContain('![topology](/assets/img/blog/topology.gif)');
    expect(mdx).not.toContain('/images/');
    expect(mdx).toContain('패킷');
    await expect(readFile(join(dir!, 'site/public/assets/img/blog/topology.gif'), 'utf8')).resolves.toBe('GIF89a');
    await expect(readFile(join(dir!, 'site/public/assets/img/blog/unused.png'))).rejects.toThrow();
  });

  it('imports _projects with an ISO date, links, a screenshot, and video embeds', async () => {
    const { importPosts, readProject, out } = await setup({
      'swift/_posts/2015-03-19-basic-swift01.md': post('스위프트 기초', '본문'),
      '_projects/buzzler.md': [
        '---',
        'layout: project',
        'title: Buzzler',
        'date: 15 Apr 2018',
        'type: side',
        'screenshot: /assets/img/projects/buzzler/01.png',
        'links:',
        '  - title: Github',
        '    url: https://github.com/tak-bro/Buzzler',
        '  - title: Demo',
        '    url: https://example.com/demo ',
        'caption: 캡션',
        'description: >',
        '    블록체인 SNS',
        '---',
        '',
        '**NOTE**: Side Project',
        '{:.lead}',
        '',
        '<div class="videoWrapper">',
        '    <iframe width="560" height="349" src="https://drive.google.com/file/d/X/preview" frameborder="0" allowfullscreen></iframe>',
        '</div>',
        '',
      ].join('\n'),
      'assets/img/projects/buzzler/01.png': 'png',
    });

    expect((await importPosts()).code).toBe(0);
    const mdx = await readProject('buzzler');
    expect(mdx).toContain('title: "Buzzler"');
    expect(mdx).toContain('description: "블록체인 SNS"');
    expect(mdx).toContain('date: "2018-04-15"');
    expect(mdx).toContain('type: "side"');
    expect(mdx).toContain('screenshot: "/assets/img/projects/buzzler/01.png"');
    expect(mdx).toContain('links: [{"title":"Github","url":"https://github.com/tak-bro/Buzzler"},{"title":"Demo","url":"https://example.com/demo"}]');
    expect(mdx).toMatch(/^\*\*NOTE\*\*: Side Project$/m);
    expect(mdx).toContain('<VideoEmbed src="https://drive.google.com/file/d/X/preview" title="Buzzler" />');
    expect(mdx).not.toMatch(/videoWrapper|iframe|\{:/);
    await expect(readFile(join(out, 'public/assets/img/projects/buzzler/01.png'), 'utf8')).resolves.toBe('png');
  });

  it('refuses a project date it cannot read', async () => {
    const { importPosts } = await setup({
      'swift/_posts/2015-03-19-basic-swift01.md': post('스위프트 기초', '본문'),
      '_projects/odd.md': ['---', 'title: Odd', 'date: sometime', 'type: side', 'description: x', '---', ''].join('\n'),
    });

    const result = await importPosts();
    expect(result.code).toBe(1);
    expect(result.output).toContain('odd.md');
  });

  it('refuses a project whose screenshot the source lacks', async () => {
    const { importPosts } = await setup({
      'swift/_posts/2015-03-19-basic-swift01.md': post('스위프트 기초', '본문'),
      '_projects/bare.md': [
        '---',
        'title: Bare',
        'date: 1 Jan 2016',
        'type: side',
        'screenshot: /assets/img/projects/bare/01.png',
        'description: x',
        '---',
        '',
      ].join('\n'),
    });

    const result = await importPosts();
    expect(result.code).toBe(1);
    expect(result.output).toContain('screenshot /assets/img/projects/bare/01.png is missing');
  });

  it('produces identical output when run twice', async () => {
    const { importPosts, read } = await setup({
      'etc/_posts/2015-03-08-same.md': post('같음', '<br>{x} `a<b>`'),
    });

    await importPosts();
    const first = await read('same');
    await importPosts();

    expect(await read('same')).toBe(first);
  });
});
