require('dotenv').config();

/**
 * Centralized, validated application configuration.
 * Throws early and loudly if a required environment variable is missing,
 * instead of failing mysteriously later at request time.
 */
const required = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    // eslint-disable-next-line no-console
    console.warn(
      `[config] Warning: environment variable ${key} is not set. ` +
      `Copy .env.example to .env and fill in real values.`
    );
  }
}

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sms_db',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'insecure_dev_secret_change_me',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },

  defaultAdmin: {
    username: process.env.DEFAULT_ADMIN_USERNAME,
    email: process.env.DEFAULT_ADMIN_EMAIL,
    password: process.env.DEFAULT_ADMIN_PASSWORD,
  },
};
