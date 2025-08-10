import React from 'react';
import { marked } from 'marked';

// marked v12: headerIds is supported; mangle no longer used in types
marked.use({ headerIds: true } as any);

type Props = { markdown: string };

export function MarkdownPreview({ markdown }: Props) {
  const html = React.useMemo(() => marked.parse(markdown || ''), [markdown]);
  return (
    <div aria-live="polite" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
