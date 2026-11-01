import { useState, type ComponentProps, type MouseEvent } from 'react';
import { LanguageSelect, LanguageSelectText } from 'fumadocs-ui/layouts/shared/slots/language-select';

/**
 * fumadocs' language menu, closed the moment a language is picked. Its popover is uncontrolled (no `open` prop) and
 * survives the client-side navigation, so a click on a menu item remounts it. Keying on the locale instead would wait
 * for the navigation's data request. React bubbles the portalled menu's clicks up to this wrapper.
 */
const LanguageSelectRoot = (props: ComponentProps<typeof LanguageSelect>) => {
  const [generation, setGeneration] = useState(0);
  const onClick = (event: MouseEvent) => {
    if ((event.target as Element).closest('[data-radix-popper-content-wrapper] button')) setGeneration((n) => n + 1);
  };

  return (
    <span className="contents" onClick={onClick}>
      <LanguageSelect key={generation} {...props} />
    </span>
  );
};

export const languageSelectSlot = { root: LanguageSelectRoot, text: LanguageSelectText };
