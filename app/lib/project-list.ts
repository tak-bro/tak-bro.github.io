/** The project type the list shows; older side projects (`side`) keep their URLs but leave the list. */
const LISTED_TYPE = 'agent';

export const listedProjects = <Page extends { readonly data: { readonly type: string } }>(pages: readonly Page[]): Page[] =>
  pages.filter((page) => page.data.type === LISTED_TYPE);
