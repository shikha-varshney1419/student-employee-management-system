const express = require('express');
const {
  getStudents,
  getStudentStats,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { studentRules, handleValidation } = require('../middleware/validators');

const router = express.Router();

// All student routes require an authenticated admin.
router.use(protect);

router.get('/stats', getStudentStats); // must come before /:id
router.get('/', getStudents);
router.get('/:id', getStudentById);
router.post('/', studentRules, handleValidation, createStudent);
router.put('/:id', studentRules, handleValidation, updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;
