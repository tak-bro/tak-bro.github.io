import { describe, expect, it } from 'vitest';
import { listedProjects } from '../project-list';
import { projectPages } from '../source';

const project = (name: string, type: string) => ({ name, type });

describe('listedProjects', () => {
  it('keeps only the agent-side projects, in the given order', () => {
    const all = [project('hwip', 'agent'), project('audiga', 'side'), project('aicommit2', 'agent')];
    expect(listedProjects(all).map((item) => item.name)).toEqual(['hwip', 'aicommit2']);
  });

  it('lists the five harness projects and none of the older side projects', () => {
    const names = listedProjects(projectPages().map((page) => ({ name: page.slugs[0], type: page.data.type }))).map((item) => item.name);
    expect([...names].sort()).toEqual(['agent-config', 'aicommit2', 'hwip', 'pi-statusline', 'tak-cc-statusline']);
  });
});
