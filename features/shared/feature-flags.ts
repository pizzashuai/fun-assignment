/**
 * Lightweight feature flag system driven by the NEXT_PUBLIC_FEATURE_FLAGS
 * environment variable. Set it to a comma-separated list of flag names, e.g.:
 *
 *   NEXT_PUBLIC_FEATURE_FLAGS=betaChart,opsBanner
 *
 * In a real product you would swap this for a proper flag service
 * (LaunchDarkly, GrowthBook, Unleash, etc.).
 */

const raw = process.env.NEXT_PUBLIC_FEATURE_FLAGS ?? "";
const enabledFlags = new Set(
  raw
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean)
);

export function isFeatureEnabled(name: string): boolean {
  return enabledFlags.has(name);
}
