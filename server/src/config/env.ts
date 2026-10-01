function required(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  get isProduction() {
    return this.nodeEnv === 'production'
  },
  // Swap to `required('DATABASE_URL')` once you add a database —
  // then a missing value crashes at boot instead of at 3am.
  databaseUrl: process.env.DATABASE_URL,
  anthropicApiKey: required('ANTHROPIC_API_KEY'),
} as const
