const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware'); // Cần import middleware

// GET /api/students/profile
// Route này yêu cầu đăng nhập (JWT)
router.get('/profile', authMiddleware, studentController.getStudentProfile);

module.exports = router;