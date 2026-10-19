import { createFromSource } from 'fumadocs-core/search/server';
import { source } from '../lib';

const server = createFromSource(source);

// staticGET (not GET) — the index is emitted as a file at build time so the
// site needs no server runtime. See react-router.config.ts prerender list.
export const loader = () => server.staticGET();
