import * as Joi from 'joi';

export const validationSchema = Joi.object({
  APP_PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),

  JWT_SECRET: Joi.string().min(16).required(),
  JWT_ACCESS_TOKEN_EXPIRATION: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().min(16).required(),
  JWT_REFRESH_TOKEN_EXPIRATION: Joi.string().required(),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SCHEMA: Joi.string().required(),

  ROLE_ADMIN: Joi.string().required(),
  ROLE_USER: Joi.string().required(),
  ROLE_VENDEDOR: Joi.string().required(),
  ROLE_SUPERADMIN: Joi.string().required(),

  CORS_ORIGINS: Joi.string().required(),
});
