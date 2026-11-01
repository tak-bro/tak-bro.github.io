import { APP_NAME } from '../lib/shared';

// The "tak" wordmark: the letters hang from one line (source: the logo kit's kit2.py).
// Letters take the text colour; the line takes the brand tone, so it follows light and dark mode.
export function TakLogo({ className }: { readonly className?: string }) {
  return (
    <svg viewBox="8 48 326 160" className={className} role="img" aria-label={APP_NAME}>
      <path
        fill="currentColor"
        d="M32 48h28v160H32zm128 58h28v102h-28zm52-58h28v160h-28zm28 108 44-44h39.6L240 195.6zm22-16h32.3l39.3 68h-32.3z"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M92 158a48 48 0 1 0 96 0 48 48 0 1 0-96 0m28 0a20 20 0 1 0 40 0 20 20 0 1 0-40 0"
      />
      <path fill="var(--color-brand)" d="M8 84h232v28H8z" />
    </svg>
  );
}
