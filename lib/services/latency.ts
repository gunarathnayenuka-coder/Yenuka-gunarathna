/**
 * Simulates network latency for mock service calls so loading states can be
 * exercised during development. Swap the body of each service function for a
 * real `fetch()` against the backend API once it exists — callers already
 * treat every service function as async, so no call sites need to change.
 */
export function simulateLatency(ms = 0): Promise<void> {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}
