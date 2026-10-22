export async function apiRequest(url, { body, ...options } = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  const result =
    response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      window.dispatchEvent(new Event("kashflow:session-expired"));
    }
    throw new Error(result?.error ?? "The request could not be completed.");
  }

  return result;
}
