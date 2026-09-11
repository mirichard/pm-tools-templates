const { listLibraryOverlays } = require('./nfr-library');

function listOverlays() {
  return listLibraryOverlays();
}

// Preserve #1112's name-selection API; callers opt in to content via loadNFRLibrary.
function selectOverlay(name = 'neutral') {
  if (listOverlays().some((entry) => entry.name === name)) return name;
  throw new Error(`Unknown NFR overlay: ${name}. Run generate-nfr --list-overlays.`);
}

module.exports = { listOverlays, selectOverlay };
