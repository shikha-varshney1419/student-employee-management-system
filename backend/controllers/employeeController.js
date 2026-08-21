const Employee = require('../models/Employee');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * GET /api/employees
 * Query params: search, department, employeeType, status, page, limit, sortBy, sortDir
 */
const getEmployees = asyncHandler(async (req, res) => {
  const { search, department, employeeType, status, page, limit, sortBy, sortDir } = req.query;

  const result = await Employee.findAll({
    search,
    department,
    employeeType,
    status,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
    sortBy,
    sortDir,
  });

  res.status(200).json({ success: true, ...result });
});

/**
 * GET /api/employees/stats
 */
const getEmployeeStats = asyncHandler(async (req, res) => {
  const stats = await Employee.getStats();
  res.status(200).json({ success: true, ...stats });
});

/**
 * GET /api/employees/:id
 */
const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) throw new ApiError(404, 'Employee not found.');
  res.status(200).json({ success: true, data: employee });
});

/**
 * POST /api/employees
 */
const createEmployee = asyncHandler(async (req, res) => {
  const payload = normalizeEmployeePayload(req.body);

  const existingById = await Employee.findByEmployeeId(payload.employee_id);
  if (existingById) throw new ApiError(409, 'An employee with this Employee ID already exists.');

  const existingByEmail = await Employee.findByEmail(payload.email);
  if (existingByEmail) throw new ApiError(409, 'An employee with this email already exists.');

  const insertId = await Employee.create(payload);
  const created = await Employee.findById(insertId);

  res.status(201).json({ success: true, message: 'Employee created successfully.', data: created });
});

/**
 * PUT /api/employees/:id
 */
const updateEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await Employee.findById(id);
  if (!existing) throw new ApiError(404, 'Employee not found.');

  const payload = normalizeEmployeePayload(req.body);

  if (payload.employee_id !== existing.employee_id) {
    const dup = await Employee.findByEmployeeId(payload.employee_id);
    if (dup) throw new ApiError(409, 'An employee with this Employee ID already exists.');
  }
  if (payload.email !== existing.email) {
    const dup = await Employee.findByEmail(payload.email);
    if (dup) throw new ApiError(409, 'An employee with this email already exists.');
  }

  await Employee.update(id, payload);
  const updated = await Employee.findById(id);

  res.status(200).json({ success: true, message: 'Employee updated successfully.', data: updated });
});

/**
 * DELETE /api/employees/:id
 */
const deleteEmployee = asyncHandler(async (req, res) => {
  const existing = await Employee.findById(req.params.id);
  if (!existing) throw new ApiError(404, 'Employee not found.');

  await Employee.remove(req.params.id);
  res.status(200).json({ success: true, message: 'Employee deleted successfully.' });
});

function normalizeEmployeePayload(body) {
  return {
    employee_id: body.employee_id.trim(),
    full_name: body.full_name.trim(),
    email: body.email.trim().toLowerCase(),
    phone: body.phone.trim(),
    department: body.department.trim(),
    designation: body.designation.trim(),
    join_date: body.join_date,
    employee_type: body.employee_type,
    status: body.status,
  };
}

module.exports = {
  getEmployees,
  getEmployeeStats,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
