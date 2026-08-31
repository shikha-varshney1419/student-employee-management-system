const mysql = require('mysql2/promise');
const config = require('./config');

/**
 * A shared connection pool. Using a pool (instead of a single connection)
 * lets Express handle many concurrent requests without exhausting MySQL
 * connections or blocking on a single socket.
 */
const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
    ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true,
});

/**
 * Simple helper to verify the DB is reachable at startup.
 * Fails fast with a clear message instead of the server silently
 * accepting requests it can never fulfill.
 */
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    // eslint-disable-next-line no-console
    console.log(`[db] Connected to MySQL database "${config.db.database}" at ${config.db.host}:${config.db.port}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[db] Failed to connect to MySQL:', err.message);
    // eslint-disable-next-line no-console
    console.error('[db] Make sure MySQL is running and backend/.env is configured correctly.');
    process.exit(1);
  }
}

module.exports = { pool, testConnection };
