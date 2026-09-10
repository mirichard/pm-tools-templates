/** Selection metadata only. Curated overlay content/registration belongs to #1115. */
const OVERLAY_REGISTRY = Object.freeze({});

function listOverlays() {
  return [
    { name: 'neutral', label: 'neutral core (default)' },
    ...Object.entries(OVERLAY_REGISTRY).map(([name, entry]) => ({ name, label: entry.label })),
  ];
}

function selectOverlay(name = 'neutral') {
  if (name === 'neutral') return 'neutral';
  if (Object.prototype.hasOwnProperty.call(OVERLAY_REGISTRY, name)) return name;
  throw new Error(`Unknown NFR overlay: ${name}. Run generate-nfr --list-overlays. Only neutral core is available until #1115 supplies overlay content.`);
}

module.exports = { listOverlays, selectOverlay };
