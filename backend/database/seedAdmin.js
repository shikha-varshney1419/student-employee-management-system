/**
 * Seeds a default admin account so you can log in for the first time.
 * Run with: npm run seed   (from the backend/ directory)
 *
 * Safe to re-run: it checks for an existing admin with the same email
 * before inserting, so it won't create duplicates.
 */
const bcrypt = require('bcrypt');
const { pool, testConnection } = require('../config/db');
const config = require('../config/config');

async function seedAdmin() {
  await testConnection();

  const { username, email, password } = config.defaultAdmin;

  const [existing] = await pool.query(
    'SELECT id FROM admins WHERE email = :email LIMIT 1',
    { email }
  );

  if (existing.length > 0) {
    console.log(`[seed] Admin with email "${email}" already exists. Skipping.`);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query(
    'INSERT INTO admins (username, email, password) VALUES (:username, :email, :password)',
    { username, email, password: hashedPassword }
  );

  console.log('[seed] Default admin created successfully:');
  console.log(`       email:    ${email}`);
  console.log(`       password: ${password}`);
  console.log('[seed] Please log in and change this password in a real deployment.');
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error('[seed] Failed to seed admin:', err);
  process.exit(1);
});
