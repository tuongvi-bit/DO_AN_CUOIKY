// server.js

// Tải biến môi trường từ file .env (ví dụ: PORT, CORS_ORIGIN, JWT_SECRET)
require('dotenv').config();

const express = require('express');
const cors = require('cors');
// Import file db.js để khởi tạo kết nối database khi server khởi động
require('./db'); 

// --- 1. IMPORT CÁC FILE ROUTES (ĐỊNH TUYẾN) ---
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const bghRoutes = require('./routes/bgh');    // Route cho Ban Giám Hiệu
const yTeRoutes = require('./routes/y_te');  // Route cho Cán bộ Y tế
const dataRoutes = require('./routes/data');
const postRoutes = require('./routes/postRoutes');

const app = express();
const PORT = process.env.PORT || 4000; 

// --- 2. MIDDLEWARES ---
// Cho phép Express xử lý JSON body từ request
app.use(express.json());

// Thiết lập CORS (Cho phép frontend truy cập)
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
// --- 3. ĐỊNH NGHĨA TẤT CẢ ROUTES ---
// Gắn các router vào đường dẫn cơ sở (base paths)

// Tuyến đường xác thực (Đăng ký, Đăng nhập)
app.use('/api/auth', authRoutes); 

// Tuyến đường cho sinh viên
app.use('/api/students', studentRoutes);

// Tuyến đường cho Ban Giám Hiệu
app.use('/api/bgh', bghRoutes); 

// Tuyến đường cho Cán bộ Y tế
app.use('/api/y_te', yTeRoutes); 

// ❗ Tích hợp Route: Mọi request đến '/api/posts' sẽ được xử lý bởi postRoutes
app.use('/api/posts', postRoutes); 
// Route cơ bản để kiểm tra server
app.get('/', (req, res) => res.send('Backend yte_hocduong is running and ready.'));
app.use('/api/data', dataRoutes);
// --- 4. KHỞI ĐỘNG SERVER ---
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});