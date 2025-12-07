const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // 1. Lấy token từ header Authorization
    // Header sẽ có dạng: Authorization: Bearer <token_jwt>
    const authHeader = req.headers.authorization;
    
    // Kiểm tra xem header có tồn tại và bắt đầu bằng 'Bearer ' không
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Truy cập bị từ chối. Vui lòng đăng nhập.' });
    }

    const token = authHeader.split(' ')[1]; // Lấy phần token sau "Bearer "

    try {
        // 2. Xác minh (Verify) token bằng JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_default_secret_key');
        
        // 3. Gán thông tin người dùng vào request
        req.user = decoded; 
        
        next(); // Cho phép chuyển sang Controller tiếp theo
    } catch (err) {
        // Lỗi nếu token không hợp lệ (hết hạn, bị thay đổi)
        return res.status(403).json({ error: 'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.' });
    }
};

module.exports = authMiddleware;