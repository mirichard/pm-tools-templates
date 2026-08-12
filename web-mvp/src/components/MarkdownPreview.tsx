import React from 'react';
import ReactMarkdown from 'react-markdown';

type Props = { markdown: string };

export function MarkdownPreview({ markdown }: Props) {
  return (
    <div aria-live="polite"><ReactMarkdown>{markdown || ''}</ReactMarkdown></div>
  );
}
