const { pool } = require('../config/db');

const Admin = {
  /**
   * Finds an admin by email OR username, so the login field can accept either.
   */
  async findByEmailOrUsername(identifier) {
    const [rows] = await pool.query(
      'SELECT id, username, email, password, created_at FROM admins WHERE email = :identifier OR username = :identifier LIMIT 1',
      { identifier }
    );
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, username, email, created_at FROM admins WHERE id = :id LIMIT 1',
      { id }
    );
    return rows[0] || null;
  },

  async create({ username, email, hashedPassword }) {
    const [result] = await pool.query(
      'INSERT INTO admins (username, email, password) VALUES (:username, :email, :password)',
      { username, email, password: hashedPassword }
    );
    return result.insertId;
  },
};

module.exports = Admin;
