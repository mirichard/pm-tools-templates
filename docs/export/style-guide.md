# Export Style Guide (MVP)

Goal: Produce clean, readable exports for Markdown, DOCX, and PDF with consistent headings, spacing, and typography.

Typography
- Font: Sans-serif (system default) for MD/PDF; DOCX will use Calibri/Arial fallback.
- Headings: Incremental sizes H1–H3, bold, consistent spacing.
- Body: 11–12pt equivalent, 1.3–1.4 line height.

Spacing
- Heading top margin: 16–24px depending on level.
- Paragraph spacing: 8–12px.
- Lists: 16px left indent; tight spacing.

Tables
- Minimal borders; alternating row background optional for readability.

Colors
- Neutral grayscale for headings/borders; ensure 4.5:1 contrast.

Pandoc defaults
- See export/pandoc/defaults.yaml for DOCX/PDF defaults.

PDF generation
- Prefer Pandoc via LaTeX or wkhtmltopdf pathway. For MVP, use Pandoc defaults with minimal customizations.

Accessibility
- Use semantic headings; avoid color-only distinctions; ensure table headers.

Future
- Replace with branded styles when design assets are available.
