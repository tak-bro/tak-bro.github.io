import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { i18n } from './i18n';
import { APP_NAME } from './shared';

// Passing the config (not just `true`) is what puts the language switcher in the
// layout chrome; without it /en is reachable by URL only. The active locale comes
// from the i18n provider in root.tsx, so it is not a parameter here.
export const baseOptions = (): BaseLayoutProps => ({
  nav: {
    title: (
      <>
        <span className="font-semibold">{APP_NAME}</span>
      </>
    ),
  },
  links: [{ text: 'GitHub', url: 'https://github.com/tak-bro', external: true }],
  i18n,
});
