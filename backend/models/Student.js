const { pool } = require('../config/db');

const SORTABLE_COLUMNS = new Set([
  'id', 'student_id', 'full_name', 'email', 'course', 'year', 'status', 'join_date', 'created_at',
]);

const Student = {
  /**
   * Returns a paginated, searchable, filterable list of students.
   * Search matches student_id, full_name, email, phone, course, college.
   * Filters: course, year, internship, status.
   */
  async findAll({ search = '', course, year, internship, status, page = 1, limit = 10, sortBy = 'created_at', sortDir = 'DESC' }) {
    const conditions = [];
    const params = {};

    if (search) {
      conditions.push(`(
        student_id LIKE :search OR
        full_name LIKE :search OR
        email LIKE :search OR
        phone LIKE :search OR
        course LIKE :search OR
        college LIKE :search
      )`);
      params.search = `%${search}%`;
    }
    if (course) {
      conditions.push('course = :course');
      params.course = course;
    }
    if (year) {
      conditions.push('year = :year');
      params.year = year;
    }
    if (internship) {
      conditions.push('internship LIKE :internship');
      params.internship = `%${internship}%`;
    }
    if (status) {
      conditions.push('status = :status');
      params.status = status;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const safeSortBy = SORTABLE_COLUMNS.has(sortBy) ? sortBy : 'created_at';
    const safeSortDir = sortDir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const offset = (Math.max(1, Number(page)) - 1) * Number(limit);

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM students ${whereClause}`,
      params
    );
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `SELECT * FROM students ${whereClause} ORDER BY ${safeSortBy} ${safeSortDir} LIMIT :limit OFFSET :offset`,
      { ...params, limit: Number(limit), offset }
    );

    return {
      data: rows,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.max(1, Math.ceil(total / Number(limit))),
      },
    };
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM students WHERE id = :id LIMIT 1', { id });
    return rows[0] || null;
  },

  async findByStudentId(studentId) {
    const [rows] = await pool.query('SELECT * FROM students WHERE student_id = :studentId LIMIT 1', { studentId });
    return rows[0] || null;
  },

  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM students WHERE email = :email LIMIT 1', { email });
    return rows[0] || null;
  },

  async create(data) {
    const [result] = await pool.query(
      `INSERT INTO students
        (student_id, full_name, email, phone, college, course, year, internship, join_date, status)
       VALUES
        (:student_id, :full_name, :email, :phone, :college, :course, :year, :internship, :join_date, :status)`,
      data
    );
    return result.insertId;
  },

  async update(id, data) {
    const [result] = await pool.query(
      `UPDATE students SET
        student_id = :student_id,
        full_name = :full_name,
        email = :email,
        phone = :phone,
        college = :college,
        course = :course,
        year = :year,
        internship = :internship,
        join_date = :join_date,
        status = :status
       WHERE id = :id`,
      { ...data, id }
    );
    return result.affectedRows > 0;
  },

  async remove(id) {
    const [result] = await pool.query('DELETE FROM students WHERE id = :id', { id });
    return result.affectedRows > 0;
  },

  async getStats() {
    const [[totalRow]] = await pool.query('SELECT COUNT(*) AS total FROM students');
    const [[activeRow]] = await pool.query("SELECT COUNT(*) AS active FROM students WHERE status = 'Active'");
    const [recent] = await pool.query('SELECT * FROM students ORDER BY created_at DESC LIMIT 5');
    return { total: totalRow.total, active: activeRow.active, recent };
  },
};

module.exports = Student;
