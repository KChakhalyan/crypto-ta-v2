export async function fetcher<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, options);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  try {
    return await res.json();
  } catch (e) {
    throw new Error(`Invalid JSON from ${url}: ${e}`);
  }
}
