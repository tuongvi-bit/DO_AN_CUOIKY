const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController'); 

// 🚨 ĐƯỜNG DẪN CẦN CHỈNH SỬA
// Vì file authMiddleware.js nằm trong thư mục middleware ngang hàng với routes/
// Chúng ta cần đi ra ngoài (..) rồi vào lại middleware/
const authMiddleware = require('../middleware/authMiddleware'); // <--- SỬA ĐƯỜNG DẪN NÀY

// 1. Route POST cho việc gửi bài viết (đã khắc phục lỗi 404 trước đó)
router.post('/submit', authMiddleware, postController.submitPost); 

// Lưu ý: Nếu prefix API của bạn là /api/y_te, thì route này cần được đăng ký là:
// router.post('/posts/submit', authMiddleware, postController.submitPost);

module.exports = router;