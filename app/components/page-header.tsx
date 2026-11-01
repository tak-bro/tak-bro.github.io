import type { ReactNode } from 'react';

/** The one accent button: the page's primary action. */
export const primaryButton =
  'home-press inline-flex items-center gap-2 rounded-sm bg-brand px-4 py-2.5 text-[15px] font-semibold text-fd-background hover:bg-fd-foreground';

/** The top of every page outside the home and the docs: the title and one line under it. */
export const PageHeader = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) => (
  <header className="flex flex-col gap-4">
    <h1 className="text-[clamp(2rem,3.5vw,2.75rem)] leading-[1.15] font-semibold tracking-tight break-keep">{title}</h1>
    <p className="max-w-[48ch] text-[17px] leading-relaxed text-fd-muted-foreground break-keep">{description}</p>
    {children}
  </header>
);
