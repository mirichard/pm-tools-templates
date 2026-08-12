import React from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

type Props = { markdown: string };

export function MarkdownPreview({ markdown }: Props) {
  const html = React.useMemo(() => DOMPurify.sanitize(String(marked.parse(markdown || ''))), [markdown]);
  return (
    <div aria-live="polite" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
