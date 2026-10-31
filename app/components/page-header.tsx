import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';

/** The one accent button: the page's primary action. */
export const primaryButton =
  'home-press inline-flex items-center gap-2 rounded-sm bg-brand px-4 py-2.5 text-[15px] font-semibold text-fd-background hover:bg-fd-foreground';

/** The top of every page outside the home and the docs: a way back, the title, one line under it. */
export const PageHeader = ({
  back,
  title,
  description,
  children,
}: {
  back?: { readonly to: string; readonly label: string };
  title: string;
  description: string;
  children?: ReactNode;
}) => (
  <header className="flex flex-col gap-4">
    {back ? (
      <Link to={back.to} className="home-link w-fit text-[15px] font-medium text-fd-muted-foreground hover:text-fd-foreground">
        <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden />
        <span>{back.label}</span>
      </Link>
    ) : null}
    <h1 className="text-[clamp(2rem,3.5vw,2.75rem)] leading-[1.15] font-semibold tracking-tight break-keep">{title}</h1>
    <p className="max-w-[48ch] text-[17px] leading-relaxed text-fd-muted-foreground break-keep">{description}</p>
    {children}
  </header>
);
