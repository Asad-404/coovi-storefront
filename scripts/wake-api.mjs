// Runs before `next build` on Vercel. The API on Render's free plan sleeps after ~15 quiet minutes, and a
// build that reaches it asleep can save fewer product pages or default shop settings. This only ever
// waits: it always exits successfully, so a down API never blocks a deploy by itself.
const WAIT_MS = 90_000;
const RETRY_MS = 5_000;

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function wake() {
  const deadline = Date.now() + WAIT_MS;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${apiUrl}/products?limit=1`, { signal: AbortSignal.timeout(deadline - Date.now()) });
      if (res.ok) {
        console.log("wake-api: the API is awake");
        return;
      }
    } catch {
      // Still waking up, or the deadline passed; the loop decides which
    }
    await new Promise((resolve) => setTimeout(resolve, RETRY_MS));
  }
  console.warn(`wake-api: no answer after ${WAIT_MS / 1000} seconds, building anyway`);
}

if (process.env.VERCEL && apiUrl) await wake();
