const { pool } = require('../config/db');

const SORTABLE_COLUMNS = new Set([
  'id', 'employee_id', 'full_name', 'email', 'department', 'designation', 'status', 'join_date', 'created_at',
]);

const Employee = {
  /**
   * Returns a paginated, searchable, filterable list of employees.
   * Search matches employee_id, full_name, email, department, designation.
   * Filters: department, employee_type, status.
   */
  async findAll({ search = '', department, employeeType, status, page = 1, limit = 10, sortBy = 'created_at', sortDir = 'DESC' }) {
    const conditions = [];
    const params = {};

    if (search) {
      conditions.push(`(
        employee_id LIKE :search OR
        full_name LIKE :search OR
        email LIKE :search OR
        department LIKE :search OR
        designation LIKE :search
      )`);
      params.search = `%${search}%`;
    }
    if (department) {
      conditions.push('department = :department');
      params.department = department;
    }
    if (employeeType) {
      conditions.push('employee_type = :employeeType');
      params.employeeType = employeeType;
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
      `SELECT COUNT(*) AS total FROM employees ${whereClause}`,
      params
    );
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `SELECT * FROM employees ${whereClause} ORDER BY ${safeSortBy} ${safeSortDir} LIMIT :limit OFFSET :offset`,
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
    const [rows] = await pool.query('SELECT * FROM employees WHERE id = :id LIMIT 1', { id });
    return rows[0] || null;
  },

  async findByEmployeeId(employeeId) {
    const [rows] = await pool.query('SELECT * FROM employees WHERE employee_id = :employeeId LIMIT 1', { employeeId });
    return rows[0] || null;
  },

  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM employees WHERE email = :email LIMIT 1', { email });
    return rows[0] || null;
  },

  async create(data) {
    const [result] = await pool.query(
      `INSERT INTO employees
        (employee_id, full_name, email, phone, department, designation, join_date, employee_type, status)
       VALUES
        (:employee_id, :full_name, :email, :phone, :department, :designation, :join_date, :employee_type, :status)`,
      data
    );
    return result.insertId;
  },

  async update(id, data) {
    const [result] = await pool.query(
      `UPDATE employees SET
        employee_id = :employee_id,
        full_name = :full_name,
        email = :email,
        phone = :phone,
        department = :department,
        designation = :designation,
        join_date = :join_date,
        employee_type = :employee_type,
        status = :status
       WHERE id = :id`,
      { ...data, id }
    );
    return result.affectedRows > 0;
  },

  async remove(id) {
    const [result] = await pool.query('DELETE FROM employees WHERE id = :id', { id });
    return result.affectedRows > 0;
  },

  async getStats() {
    const [[totalRow]] = await pool.query('SELECT COUNT(*) AS total FROM employees');
    const [[activeRow]] = await pool.query("SELECT COUNT(*) AS active FROM employees WHERE status = 'Active'");
    const [recent] = await pool.query('SELECT * FROM employees ORDER BY created_at DESC LIMIT 5');
    return { total: totalRow.total, active: activeRow.active, recent };
  },
};

module.exports = Employee;
