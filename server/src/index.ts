import app from './app.js'
import { env } from './config/env.js'

const server = app.listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port} [${env.nodeEnv}]`)
})

// Let the platform stop us cleanly: finish in-flight requests, then exit.
for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => {
    console.log(`${signal} received, shutting down`)
    server.close(() => process.exit(0))
  })
}
