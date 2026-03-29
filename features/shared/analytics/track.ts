/**
 * Thin product analytics abstraction.
 *
 * Replace the `console.debug` implementation below with your analytics
 * provider of choice (Segment, PostHog, Amplitude, Mixpanel, etc.):
 *
 *   analytics.track(event, properties);   // Segment
 *   posthog.capture(event, properties);   // PostHog
 *
 * Set NEXT_PUBLIC_ANALYTICS_DEBUG=true to see events logged in the browser
 * console during development and staging, without enabling them in production.
 */

const debug =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true";

export function track(
  event: string,
  properties?: Record<string, unknown>
): void {
  if (debug) {
    console.debug("[analytics]", event, properties ?? {});
  }
  // TODO: forward to analytics provider:
  // analytics.track(event, properties);
}
