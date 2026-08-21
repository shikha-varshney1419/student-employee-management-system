const express = require('express');
const {
  getEmployees,
  getEmployeeStats,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const { employeeRules, handleValidation } = require('../middleware/validators');

const router = express.Router();

// All employee routes require an authenticated admin.
router.use(protect);

router.get('/stats', getEmployeeStats); // must come before /:id
router.get('/', getEmployees);
router.get('/:id', getEmployeeById);
router.post('/', employeeRules, handleValidation, createEmployee);
router.put('/:id', employeeRules, handleValidation, updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;
