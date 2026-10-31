import { TOC, TOCPopover, TOCProvider, type TOCPopoverProps, type TOCProps } from 'fumadocs-ui/layouts/docs/page/slots/toc';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { i18n, tocLabel } from '../lib';

// The table of contents as a named nav: fumadocs renders it in a bare div. On a phone its popover
// draws a <header>, which is a second banner unless a <nav> element (not a role) contains it;
// `contents` keeps the popover a direct grid item of the page layout, and it hides where the TOC shows.
const NamedTOC = (props: TOCProps) => (
  <TOC {...props} container={{ ...props.container, role: 'navigation', 'aria-labelledby': 'toc-title' }} />
);

const NamedTOCPopover = (props: TOCPopoverProps) => {
  const { locale = i18n.defaultLanguage } = useI18n();
  return (
    <nav aria-label={tocLabel(locale)} className="contents xl:hidden">
      <TOCPopover {...props} />
    </nav>
  );
};

export const docsTocSlots = { provider: TOCProvider, main: NamedTOC, popover: NamedTOCPopover };
