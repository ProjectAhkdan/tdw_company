export function withAuthHeader(headers: HeadersInit = {}, token?: string): HeadersInit {
  if (!token) return headers;
  return { ...headers, Authorization: `Bearer ${token}` };
}

export function handleApiError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan yang tidak diketahui";
}

export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}


