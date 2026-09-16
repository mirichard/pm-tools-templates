/**
 * #1111: confidence-based readiness rollup for generated NFR candidates.
 *
 * Deterministic threshold rollup, not a model call: every candidate already carries a real
 * per-assignment confidence value (see src/nfr-classifier.js), so there is nothing further to
 * ask an LLM to judge. This mirrors Phase 0's (src/ambiguity-detector.js) three-tier
 * READY / NEEDS CLARIFICATION / NOT READY labels and terms, but not its computation mechanism --
 * Phase 0's readinessScore is model-generated because it judges free-text ambiguity.
 *
 * No default threshold is baked in here beyond DEFAULT_CONFIDENCE_THRESHOLD, and no `inquirer`
 * or other I/O happens in this module: this is a pure function so it stays usable from
 * NFRGenerator.run() (which existing tests call directly, with no interactive-prompt mock) and
 * from index.js's interactive gate alike, without either accidentally hanging on stdin.
 *
 * Default threshold: 0.75. No calibration data ties Almonte et al.'s aggregate 80.4%
 * exact-match / 11.3% mismatch figures (arXiv:2503.15248, cited in README.md) to a specific
 * per-assignment confidence-score cutoff -- that would require correlating the model's
 * self-reported confidence against actual correctness, which doesn't exist. Almonte's finding
 * is the documented reason a review gate exists at all, not what number the gate should use.
 * 0.75 is deliberately not 0.8, to avoid even a visual echo of Almonte's 80.4% headline figure
 * that could mislead a reader into assuming a derivation that isn't there. This is an
 * unresearched, conservative default, user-configurable via --confidence-threshold.
 */
const DEFAULT_CONFIDENCE_THRESHOLD = 0.75;

/**
 * @param {Array<{confidence: number}>} candidates - generateCandidates()'s `generation.candidates`
 * @param {number} threshold - 0-1, typically options.confidenceThreshold
 * @returns {{threshold: number, total: number, accepted: number, review: number,
 *   readinessLabel: 'READY'|'NEEDS CLARIFICATION'|'NOT READY', belowThreshold: Array}}
 */
function computeConfidenceSummary(candidates, threshold) {
  const total = candidates.length;
  const belowThreshold = candidates.filter((candidate) => candidate.confidence < threshold);
  const review = belowThreshold.length;
  const accepted = total - review;
  const readinessLabel = review === 0 ? 'READY' : review === total ? 'NOT READY' : 'NEEDS CLARIFICATION';
  return { threshold, total, accepted, review, readinessLabel, belowThreshold };
}

module.exports = { computeConfidenceSummary, DEFAULT_CONFIDENCE_THRESHOLD };
