export default () => ({
  app: {
    port: parseInt(process.env.APP_PORT ?? '3000', 10),
    env: process.env.NODE_ENV,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpiration: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
  },
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    schema: process.env.DB_SCHEMA,
  },
  cors: {
    origins: process.env.CORS_ORIGINS?.split(',') || [],
  },
});
