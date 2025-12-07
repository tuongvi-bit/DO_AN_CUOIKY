const pool = require('../db');
// Đã loại bỏ const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key';
const TABLE_NAME = 'taikhoan'; // <-- ĐÃ KHẮC PHỤC: Sử dụng tên bảng chính xác

// --- HÀM ĐĂNG NHẬP (LOGIN) ---
const login = async (req, res) => {
    const { loginId, password } = req.body; 

    if (!loginId || !password) {
        return res.status(400).json({ error: 'Vui lòng nhập Tên đăng nhập và Mật khẩu.' });
    }

    try {
        // 1. Tìm người dùng bằng Tên đăng nhập
        // Tên cột phải khớp chính xác: TenDangNhap
        const [users] = await pool.query(`SELECT * FROM ${TABLE_NAME} WHERE TenDangNhap = ?`, [loginId]);
        const user = users[0];

        if (!user) {
            return res.status(401).json({ error: 'Tài khoản không tồn tại.' });
        }

        // 2. So sánh mật khẩu (Văn bản thuần)
        // Tên cột Mật khẩu phải khớp chính xác: MatKhau
        if (password !== user.MatKhau) { 
            return res.status(401).json({ error: 'Mật khẩu không đúng.' });
        }

        // 3. Tạo JSON Web Token (JWT)
        const payload = {
            id: user.MaTaiKhoan, 
            username: user.TenDangNhap,
            role: user.VaiTro 
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        // 4. Trả về token cho client
        res.status(200).json({ 
            message: 'Đăng nhập thành công',
            token: token,
            username: user.TenDangNhap,
            role: payload.role
        });

    } catch (err) {
        // Log lỗi chi tiết để kiểm tra các lỗi SQL khác (nếu có)
        console.error('LỖI ĐĂNG NHẬP (Chi tiết):', err.stack);
        res.status(500).json({ 
            error: 'Lỗi server. Vui lòng kiểm tra logs server.' 
        }); 
    }
};

module.exports = {
    login
};