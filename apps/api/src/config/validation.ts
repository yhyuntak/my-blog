import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Node environment
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // Server port
  PORT: Joi.number().default(60000),

  // Database
  DATABASE_URL: Joi.string().required().messages({
    'any.required': 'DATABASE_URL is required. Please set it in your .env file.',
    'string.empty': 'DATABASE_URL cannot be empty.',
  }),

  // JWT
  JWT_SECRET: Joi.string().min(32).required().messages({
    'any.required':
      'JWT_SECRET is required. Please set it in your .env file.',
    'string.min':
      'JWT_SECRET must be at least 32 characters long for security.',
  }),

  // CORS - Frontend URL (production only)
  FRONTEND_URL: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required().messages({
      'any.required':
        'FRONTEND_URL is required in production. Please set it in your .env file.',
    }),
    otherwise: Joi.optional(),
  }),
});
