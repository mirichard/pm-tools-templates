import React from 'react';
import { marked } from 'marked';

marked.use({ mangle: false, headerIds: true });

type Props = { markdown: string };

export function MarkdownPreview({ markdown }: Props) {
  const html = React.useMemo(() => marked.parse(markdown || ''), [markdown]);
  return (
    <div aria-live="polite" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
