const pageUrl = process.env.PAGES_URL;
if (!pageUrl) throw new Error('PAGES_URL is required.');

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchWithRetry(url, attempts = 20) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) return response;
      lastError = new Error(`${url} returned HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    if (attempt < attempts) await delay(3_000);
  }
  throw lastError;
}

const response = await fetchWithRetry(new URL(`?deployment=${Date.now()}`, pageUrl));
const html = await response.text();
if (!html.includes('id="scene-canvas"')) {
  throw new Error('The deployed document is not the cape demo.');
}

const assetReferences = [...html.matchAll(/(?:src|href)="([^"]*\/assets\/[^"]+)"/g)]
  .map((match) => match[1]);
if (assetReferences.length < 2) {
  throw new Error('The deployed document is missing its JavaScript or CSS assets.');
}

await Promise.all(assetReferences.map(async (reference) => {
  const assetResponse = await fetchWithRetry(new URL(reference, pageUrl), 5);
  await assetResponse.body?.cancel();
}));

console.log(`GitHub Pages smoke test: PASS (${assetReferences.length} assets)`);
