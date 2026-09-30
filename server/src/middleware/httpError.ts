export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

export const notFound = (msg = 'Not found') => new HttpError(404, msg)
export const badRequest = (msg = 'Bad request') => new HttpError(400, msg)
