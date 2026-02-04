export default () => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3002,
  grpc: {
    host: process.env.GRPC_HOST || '0.0.0.0',
    port: process.env.GRPC_PORT || '5002',
  },
  auth: {
    secret: process.env.ILIACHALLENGE,
    secretInternal: process.env.ILIACHALLENGE_INTERNAL,
  },
  postgres: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5433,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
      poolSize: parseInt(process.env.DB_POOL_SIZE, 10) || 20,
      retryAttempts: parseInt(process.env.DB_RETRY_ATTEMPTS, 10) || 3,
      retryDelay: parseInt(process.env.DB_RETRY_DELAY, 10) || 1000,
    },
  },
});
