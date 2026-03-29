/**
 * Next.js instrumentation hook — runs once when the server starts.
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 *
 * Plug in your observability SDK here. Example (Sentry):
 *
 *   import * as Sentry from "@sentry/nextjs";
 *   Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0.2 });
 *
 * Example (OpenTelemetry via @vercel/otel):
 *
 *   import { registerOTel } from "@vercel/otel";
 *   registerOTel({ serviceName: "analytics-dashboard" });
 */
export async function register() {
  // No-op stub: replace with Sentry.init / registerOTel / etc. when ready.
  if (process.env.NODE_ENV === "production") {
    // production-only initialisation would go here
  }
}

/**
 * Optional: capture server-side request errors and forward to Sentry.
 *
 * export function onRequestError(
 *   err: Error,
 *   request: { path: string; method: string },
 *   context: { routeType: string }
 * ) {
 *   Sentry.captureRequestError(err, request, context);
 * }
 */
