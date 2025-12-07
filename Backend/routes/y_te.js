const express = require('express');
const router = express.Router();
const yTeController = require('../controllers/y_teController'); 
const authMiddleware = require('../middleware/authMiddleware'); // <-- Module bảo vệ
const postController = require('../controllers/postController');
// GET /api/y_te/profile (Lấy hồ sơ cá nhân của Cán bộ Y tế đang đăng nhập)
router.get('/profile', authMiddleware, yTeController.getStaffProfile);

// GET /api/y_te/students/list (Lấy danh sách tất cả học sinh để quản lý)
// Route này được bảo vệ, chỉ Staff/Admin mới được truy cập
router.get('/students/list', authMiddleware, yTeController.getAllStudentsList); // <-- ĐÃ THÊM
router.post('/posts/submit', authMiddleware, postController.submitPost);
module.exports = router;