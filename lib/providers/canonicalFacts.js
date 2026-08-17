export const confidenceForSources = (sources = []) => {
  const known = sources.filter((source) => typeof source.value === 'boolean');
  if (!known.length) return 'unknown';
  const values = new Set(known.map((source) => source.value));
  if (values.size > 1) return 'disputed';
  return new Set(known.map((source) => source.provider)).size > 1 ? 'verified' : 'single-source';
};

export const mergeBooleanFact = (sources = [], override = null) => {
  const normalizedSources = sources.filter((source) => typeof source?.value === 'boolean');
  const providerConfidence = confidenceForSources(normalizedSources);
  const providerValues = new Set(normalizedSources.map((source) => source.value));
  const providerValue = providerValues.size === 1 ? normalizedSources[0].value : null;

  if (override && typeof override.value === 'boolean') {
    return {
      value: override.value,
      sources: [...normalizedSources, {
        provider: 'curated',
        id: override.sourceId,
        value: override.value,
        reason: override.reason,
      }],
      confidence: 'verified',
      providerConfidence,
      providerConflict: providerConfidence === 'disputed',
      overridden: true,
    };
  }

  return {
    value: providerValue,
    sources: normalizedSources,
    confidence: providerConfidence,
    providerConflict: providerConfidence === 'disputed',
    overridden: false,
  };
};

