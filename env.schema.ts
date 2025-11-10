import * as Joi from '@hapi/joi';

export const envSchema = Joi.object({
  PORT: Joi.string().required(),
  PG_HOST: Joi.string().required(),
}).unknown(true);
