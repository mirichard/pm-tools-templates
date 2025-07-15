# Developer Guide: Recommendation System

## Introduction
This guide provides an overview of the recommendation system implemented in the Template Selector module, and explains how to extend and customize its behavior to suit new requirements.

## Architecture Overview

- **Input Capture:** User responses collected via the Guided Navigation Wizard component.
- **Scoring Engine:** A configurable algorithm that assigns weights to various criteria (e.g., methodology, complexity, team size).
- **Template Metadata:** Each template in the system carries metadata fields that correspond to scoring criteria.
- **Recommendation Output:** The top-N templates sorted by score, returned to the UI.

## File Structure

```
src/
 ├─ components/
 │   ├─ Wizard/
 │   │   └─ GuidedWizard.tsx
 │   ├─ TemplateSelector.tsx
 │   └─ RecommendationEngine.ts
 └─ types/
     └─ recommendation.ts
```

- **RecommendationEngine.ts**: Core scoring algorithm and API.
- **recommendation.ts**: Type definitions for `Criteria`, `TemplateMetadata`, `ScoreConfig`.

## Core Algorithm

1. **Load Config:** Read `scoreConfig` object defining criteria weights and thresholds.
2. **Normalize Inputs:** Map raw user answers to normalized criterion values (e.g., numeric scale).
3. **Compute Scores:** For each template, compute a weighted sum of match scores:
   ```ts
   score = sum(weight_i * similarity(userValue_i, templateValue_i));
   ```
4. **Rank Templates:** Sort templates in descending order of score.
5. **Return Top Results:** Return the highest-scoring templates (configurable count).

## Customizing Recommendation Criteria

- Open `scoreConfig` in `RecommendationEngine.ts`.
- Each entry:
  ```ts
  interface ScoreConfig {
    criterionKey: string;        // Matches a field in TemplateMetadata
    weight: number;             // Relative importance (sum of all weights normalized to 1)
    similarityFunction?: (a, b) => number; // Optional custom similarity
  }
  ```
- To adjust importance, modify `weight`. To disable a criterion, set its weight to 0.

## Extending the System

### Adding a New Criterion
1. Update `TemplateMetadata` in `types/recommendation.ts` to include the new field.
2. In data source (e.g., `templates.json`), add metadata values for each template.
3. Add an entry in `scoreConfig`:
   ```ts
   { criterionKey: 'newCriterion', weight: 0.1 }
   ```
4. (Optional) Provide a custom `similarityFunction` if matching logic is non-trivial.

### Modifying Similarity Logic
- By default, the engine uses basic equality or distance functions.
- To override, assign `similarityFunction: yourFunction` in the criterion config.
- Ensure your function returns a normalized score (0 to 1).

### Integrating with Backend Services
- Extract `RecommendationEngine` method calls to a service endpoint if needed.
- Ensure you serialize user inputs and template metadata in the API contract.

## Testing

- **Unit Tests**: Write tests for each similarity function and scoring scenario in `__tests__/RecommendationEngine.test.ts`.
- **Integration Tests**: Simulate full user flows in Jest/React Testing Library:
  - Wizard answers → call recommendation → verify expected templates.

## Performance and Caching

- The engine is lightweight and runs client-side. For large template catalogs:
  - Consider memoizing results for repeated criteria sets.
  - Profile using Chrome DevTools or React Profiler.

## Logging and Analytics

- Hook into the analytics service in `TemplateSelector.tsx`:
  ```ts
  analytics.track('recommendation_shown', { criteria, resultsCount });
  ```

## Best Practices

- Keep `scoreConfig` weights updated as user feedback arrives.
- Document any new criteria in this guide.
- Maintain a consistent scale (0–1) across similarity functions.

## Troubleshooting

- Unexpected rankings:
  1. Check metadata completeness.
  2. Verify weight normalization (sum to 1).
  3. Unit-test individual similarity outputs.

## Further Reading

- Articles on recommender systems:
  - _Recommender Systems Handbook_
  - Mozilla Developer Network: Fuzzy matching techniques

