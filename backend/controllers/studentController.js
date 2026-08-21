const Student = require('../models/Student');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * GET /api/students
 * Query params: search, course, year, internship, status, page, limit, sortBy, sortDir
 */
const getStudents = asyncHandler(async (req, res) => {
  const { search, course, year, internship, status, page, limit, sortBy, sortDir } = req.query;

  const result = await Student.findAll({
    search,
    course,
    year,
    internship,
    status,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
    sortBy,
    sortDir,
  });

  res.status(200).json({ success: true, ...result });
});

/**
 * GET /api/students/stats
 * Returns dashboard-ready aggregate figures. Placed above /:id in routes
 * so "stats" is never mistaken for an id.
 */
const getStudentStats = asyncHandler(async (req, res) => {
  const stats = await Student.getStats();
  res.status(200).json({ success: true, ...stats });
});

/**
 * GET /api/students/:id
 */
const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) throw new ApiError(404, 'Student not found.');
  res.status(200).json({ success: true, data: student });
});

/**
 * POST /api/students
 */
const createStudent = asyncHandler(async (req, res) => {
  const payload = normalizeStudentPayload(req.body);

  const existingById = await Student.findByStudentId(payload.student_id);
  if (existingById) throw new ApiError(409, 'A student with this Student ID already exists.');

  const existingByEmail = await Student.findByEmail(payload.email);
  if (existingByEmail) throw new ApiError(409, 'A student with this email already exists.');

  const insertId = await Student.create(payload);
  const created = await Student.findById(insertId);

  res.status(201).json({ success: true, message: 'Student created successfully.', data: created });
});

/**
 * PUT /api/students/:id
 */
const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await Student.findById(id);
  if (!existing) throw new ApiError(404, 'Student not found.');

  const payload = normalizeStudentPayload(req.body);

  if (payload.student_id !== existing.student_id) {
    const dup = await Student.findByStudentId(payload.student_id);
    if (dup) throw new ApiError(409, 'A student with this Student ID already exists.');
  }
  if (payload.email !== existing.email) {
    const dup = await Student.findByEmail(payload.email);
    if (dup) throw new ApiError(409, 'A student with this email already exists.');
  }

  await Student.update(id, payload);
  const updated = await Student.findById(id);

  res.status(200).json({ success: true, message: 'Student updated successfully.', data: updated });
});

/**
 * DELETE /api/students/:id
 */
const deleteStudent = asyncHandler(async (req, res) => {
  const existing = await Student.findById(req.params.id);
  if (!existing) throw new ApiError(404, 'Student not found.');

  await Student.remove(req.params.id);
  res.status(200).json({ success: true, message: 'Student deleted successfully.' });
});

function normalizeStudentPayload(body) {
  return {
    student_id: body.student_id.trim(),
    full_name: body.full_name.trim(),
    email: body.email.trim().toLowerCase(),
    phone: body.phone.trim(),
    college: body.college.trim(),
    course: body.course,
    year: body.year.trim(),
    internship: body.internship ? body.internship.trim() : null,
    join_date: body.join_date,
    status: body.status,
  };
}

module.exports = {
  getStudents,
  getStudentStats,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
