import { jsonLdScript, type JsonLd as Data } from '../lib/structured-data';

/** A JSON-LD block; the escaping lives here so no caller can skip it. */
export const JsonLd = ({ data }: { readonly data: Data }) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(data) }} />
);
