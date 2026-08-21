const express = require('express');
const { login, logout, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { loginRules, handleValidation } = require('../middleware/validators');

const router = express.Router();

router.post('/login', loginRules, handleValidation, login);
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);

module.exports = router;
