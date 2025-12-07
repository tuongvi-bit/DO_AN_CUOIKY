const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Tuyến đường Đăng nhập
// POST /api/auth/login
router.post('/login', authController.login);

// LƯU Ý: Tuyến đường /register đã được loại bỏ.

module.exports = router;