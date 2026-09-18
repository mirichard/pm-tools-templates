# Template Accessibility Checklist

Purpose: Help authors and users ensure templates are usable by everyone and meet common accessibility expectations in documents and web-rendered Markdown.

Core principles
- Perceivable: Information and UI components must be presentable to users in ways they can perceive
- Operable: Users must be able to operate the interface
- Understandable: Information and operation must be understandable
- Robust: Content must be interpreted reliably by a wide variety of user agents and assistive technologies

Checklist (apply to Markdown, Word, Excel, PowerPoint, and PDFs as relevant)
1) Structure and headings
- Use a single H1 title, followed by hierarchical headings (H2/H3) without skipping levels
- Use built‑in heading styles (Word/PPT) so screen readers can navigate
- Avoid using bold text in place of true headings

2) Text alternatives
- Provide meaningful alt text for images and diagrams
- If an image is purely decorative, mark it as decorative (empty alt in HTML/MD or appropriate property in Office)
- Prefer text or data tables over screenshots when feasible

3) Color and contrast
- Ensure sufficient contrast (target ≥4.5:1 for normal text, ≥3:1 for large text)
- Do not rely on color alone to convey meaning (add labels, patterns, or text)

4) Links and references
- Use descriptive link text (e.g., “Status Report Template”) instead of “click here”
- Prefer relative links within the repo and link to canonical locations

5) Tables and data
- Add header rows for tables; use simple table structures where possible
- Include captions or a brief description of table purpose when helpful
- In Excel, label sheets clearly; freeze header rows; avoid merged cells in data tables

6) Language and readability
- Write in plain language; avoid unexplained acronyms
- Keep sentences concise; use lists for steps and checklists

7) Forms and inputs
- Label required fields and provide examples/placeholders
- Provide clear instructions for completing the template

8) Multimedia (if applicable)
- Provide captions or transcripts for embedded audio/video
- Avoid auto‑play; let the user control playback

9) Keyboard and assistive tech
- Ensure no interaction requires a mouse exclusively
- In PowerPoint, follow reading order; in Markdown/HTML, ensure logical DOM order

10) Document properties and export
- Set document title and language; include author and version where applicable
- When exporting to PDF, use tagged PDFs to preserve structure

Quick author workflow
- Author with structure-first approach (true headings, lists, tables)
- Run an accessibility checker:
  - Word/PowerPoint: Review > Check Accessibility
  - PDF: Acrobat Pro > Accessibility Check (if available)
  - Markdown: Use linters or preview with a screen reader spot-check
- Address issues and re‑run checks before publishing

References
- WCAG 2.1 Quick Reference: https://www.w3.org/WAI/WCAG21/quickref/
- Microsoft Office Accessibility: https://support.microsoft.com/accessibility
- PDF/UA basics: https://www.pdfa.org/resource/pdfua-in-a-nutshell/

Maintenance note
- Treat accessibility fixes like quality bugs: track, fix, and prevent regressions
- Prefer canonical links and consistent naming to reduce wayfinding barriers

