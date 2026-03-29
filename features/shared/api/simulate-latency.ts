/** Simulate a small server-side latency to mirror real API behavior. */
export async function simulateLatency(ms = 120) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
