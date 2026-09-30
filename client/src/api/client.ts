const BASE_URL = '/api'

class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/JSON', ...init?.headers },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}) as { message?: string })
    throw new ApiError(res.status, body.message ?? `Request failed (${res.status})`)
  }

  return res.status === 204 ? (undefined as T) : (res.json() as Promise<T>)
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  delete: (path: string) => request<void>(path, { method: 'DELETE' }),
}
