// Small helper to mimic a network client reading bundled JSON.
// Swapping to a real HTTP client later is a matter of replacing this module.
export async function loadFromJson<T>(payload: unknown): Promise<T> {
  const latencyMs = getRandomLatency();
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(clone(payload) as T), latencyMs);
  });
}

// Minimal persistence stub to emulate saving JSON locally (in-memory here).
// When replacing with real API, swap this for a POST/PUT.
export async function saveToJson(_file: string, payload: unknown): Promise<void> {
  const latencyMs = getRandomLatency();
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      // noop: in this mock we just pretend to persist
      clone(payload);
      resolve();
    }, latencyMs);
  });
}

function getRandomLatency(): number {
  // Simulate network latency between 500ms and 1500ms
  const min = 500;
  const max = 1500;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fallback for environments without structuredClone (older RN runtimes).
function clone<T>(value: T): T {
  try {
    // @ts-ignore structuredClone may exist at runtime
    if (typeof structuredClone === "function") {
      // @ts-ignore
      return structuredClone(value);
    }
  } catch {
    // ignore
  }
  return JSON.parse(JSON.stringify(value));
}
