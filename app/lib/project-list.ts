/** The project type the list shows; older side projects (`side`) keep their URLs but leave the list. */
const LISTED_TYPE = 'agent';

export const listedProjects = <Project extends { readonly type: string }>(projects: readonly Project[]): Project[] =>
  projects.filter((project) => project.type === LISTED_TYPE);
