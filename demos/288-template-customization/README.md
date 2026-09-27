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

## User workflow

1. Choose one of the five templates and complete the labeled fields. Fields marked
   with an asterisk are required; validation describes missing or invalid values.
   Risk probability is a decimal from 0 to 1 (for example, 0.4 means 40%).
2. Review the live preview. Switching templates keeps each draft during this visit.
   Changes made after displaying a saved-version comparison return to the current preview.
3. Enter a version name and select **Save Version** before leaving or reloading.
   To reopen, select the same template and choose its named version under **Load**.
   Loading over unsaved changes requires confirmation.
4. Select **Download Markdown** to save the current template document. Incomplete
   or invalid entries remain exportable for recovery and are labeled **DRAFT** in
   the downloaded document; this is not a validated or approved project plan.

Versions are local to this browser and site origin, not an account or server.
Clearing browser data, changing devices or using a different site address will
not restore them. Keep downloaded backups. Browser exit warnings are best effort,
particularly on mobile; an unsaved draft is not durable storage.

If saving fails, the app retains the draft and offers recovery guidance. Unreadable
or malformed stored versions are not silently replaced. Download the current draft,
then restore storage access or repair the stored data and select **Retry**. There
is no destructive automatic reset.

## Acceptance checks

`npm run test:uat` covers all five editors, download contents, reload/restore,
template isolation, draft switching, list types, invalid stored records, and storage
read/write failures. `npm run test:a11y` covers initial, validation, narrow-screen,
keyboard and storage-error states. These automated checks supplement maintainer
user acceptance; they do not establish full assistive-technology compatibility.
