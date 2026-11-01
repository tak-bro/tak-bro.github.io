import { describe, expect, it } from 'vitest';
import { guideLd, jsonLdScript, personLd } from '../structured-data';

const graph = (data: Record<string, unknown>) => data['@graph'] as Record<string, unknown>[];

describe('structured data', () => {
  it('names the person with the profiles a name search should reach', () => {
    expect(personLd()).toMatchObject({
      '@type': 'Person',
      name: 'Tak',
      alternateName: ['Hyungtak Jin', '진형탁'],
      sameAs: ['https://www.linkedin.com/in/hyungtak/', 'https://github.com/tak-bro'],
    });
  });

  it('places a guide under the guides index, at its canonical URL', () => {
    const data = guideLd({ title: '원칙', description: 'd', lang: 'ko', path: '/docs/principles' });
    const [article, breadcrumb] = graph(data);
    expect(article).toMatchObject({ '@type': 'TechArticle', headline: '원칙', url: 'https://docs.example.test/docs/principles/' });
    expect(breadcrumb).toMatchObject({ '@type': 'BreadcrumbList' });
    expect(breadcrumb.itemListElement).toHaveLength(2);
  });

  it('gives the index no breadcrumb', () => {
    expect(graph(guideLd({ title: '소개', description: 'd', lang: 'ko', path: '/docs' }))).toHaveLength(1);
  });

  it('cannot close its script tag', () => {
    expect(jsonLdScript({ name: '</script><b>' })).not.toContain('</script>');
  });
});
