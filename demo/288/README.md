# Demo 288 – One-command run

Run the demo (build + static preview at http://127.0.0.1:5179):

```
cd demo/288
./run-demo.sh
```

Automated checks:
```
npx playwright install --with-deps chromium
npm run test:a11y
npm run test:uat
```

# Demo: Epic 288 – Template Customization Web Interface (MVP)

How to run
- Build: `npm install && npm run build`
- Preview: `npm run preview` (serves at http://127.0.0.1:5179)

Automated checks
- Accessibility: `npx playwright install --with-deps chromium && npm run test:a11y`
- UAT: `npx playwright install --with-deps chromium && npm run test:uat`

What’s included
- 5 editors (Charter, Risk, Stakeholder, Sprint, Executive)
- Schema-driven forms, validation, completion %, live Markdown preview
- Download Markdown, basic versioning and diff
- Accessibility baseline (labels, skip link, focus outlines)
