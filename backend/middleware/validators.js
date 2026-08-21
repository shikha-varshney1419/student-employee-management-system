const { body, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Runs after any of the validation chains below. Collects all field
 * errors into a single 422 response instead of failing on the first one,
 * so the frontend can show every problem at once.
 */
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    return next(new ApiError(422, 'Validation failed.', formatted));
  }
  next();
}

const loginRules = [
  body('identifier').trim().notEmpty().withMessage('Email or username is required.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

const studentRules = [
  body('student_id').trim().notEmpty().withMessage('Student ID is required.'),
  body('full_name').trim().notEmpty().withMessage('Full name is required.')
    .isLength({ min: 2, max: 150 }).withMessage('Full name must be 2-150 characters.'),
  body('email').trim().notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('A valid email is required.'),
  body('phone').trim().notEmpty().withMessage('Phone number is required.')
    .matches(/^[0-9+\-\s()]{7,20}$/).withMessage('Enter a valid phone number.'),
  body('college').trim().notEmpty().withMessage('College is required.'),
  body('course').trim().isIn(['BCA', 'B.Tech', 'MCA', 'MBA', 'Other']).withMessage('Invalid course selected.'),
  body('year').trim().notEmpty().withMessage('Year is required.'),
  body('join_date').notEmpty().withMessage('Join date is required.')
    .isISO8601().withMessage('Join date must be a valid date.'),
  body('status').trim().isIn(['Active', 'Inactive']).withMessage('Invalid status selected.'),
  body('internship').optional({ checkFalsy: true }).trim(),
];

const employeeRules = [
  body('employee_id').trim().notEmpty().withMessage('Employee ID is required.'),
  body('full_name').trim().notEmpty().withMessage('Full name is required.')
    .isLength({ min: 2, max: 150 }).withMessage('Full name must be 2-150 characters.'),
  body('email').trim().notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('A valid email is required.'),
  body('phone').trim().notEmpty().withMessage('Phone number is required.')
    .matches(/^[0-9+\-\s()]{7,20}$/).withMessage('Enter a valid phone number.'),
  body('department').trim().notEmpty().withMessage('Department is required.'),
  body('designation').trim().notEmpty().withMessage('Designation is required.'),
  body('join_date').notEmpty().withMessage('Join date is required.')
    .isISO8601().withMessage('Join date must be a valid date.'),
  body('employee_type').trim().isIn(['Full Time', 'Part Time', 'Intern', 'Contract']).withMessage('Invalid employee type.'),
  body('status').trim().isIn(['Active', 'Inactive']).withMessage('Invalid status selected.'),
];

module.exports = { handleValidation, loginRules, studentRules, employeeRules };
