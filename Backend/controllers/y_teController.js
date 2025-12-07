const pool = require('../db');

const CAN_BO_TABLE = 'canboyte'; 
const STUDENT_PROFILE_TABLE = 'hocsinh'; 
const HEALTH_RECORD_TABLE = 'lichkham'; 

// Hàm mới: LẤY TẤT CẢ HỌC SINH (CHỈ DÀNH CHO ADMIN/STAFF)
const getAllStudentsList = async (req, res) => {
    // Lấy thông tin người dùng từ JWT (đã được giải mã bởi authMiddleware)
    const userRole = req.user.role; 

    // --- KIỂM TRA QUYỀN TRUY CẬP ---
    if (userRole !== 'Admin' && userRole !== 'BanGiamHieu' && userRole !== 'CanBoYTe') {
        // Nếu không có quyền quản lý, trả về lỗi 403 Forbidden
        return res.status(403).json({ error: 'Truy cập bị từ chối. Bạn không có đủ quyền hạn để xem danh sách học sinh.' });
    }
    // -----------------------------

    try {
        const [rows] = await pool.query(
            `SELECT MaHS, HoTen, Lop, NgaySinh, GioiTinh, SoDienThoaiPH, DiaChi FROM ${STUDENT_PROFILE_TABLE}`
        );
        
        res.status(200).json(rows);
    } catch (err) {
        console.error('LỖI API LẤY DANH SÁCH HỌC SINH:', err.stack);
        res.status(500).json({ error: 'Lỗi server khi tải danh sách học sinh.' });
    }
};


// --- GET Hồ sơ cá nhân của Cán bộ Y tế đang đăng nhập (Giữ nguyên) ---
const getStaffProfile = async (req, res) => {
    const maTaiKhoan = req.user.id; 

    try {
        const [profileRows] = await pool.query(
            `SELECT MaCBYT, HoTen, NgaySinh, GioiTinh, ChucVu, SoDienThoai, Email, TrinhDo FROM ${CAN_BO_TABLE} WHERE MaTaiKhoan = ?`,
            [maTaiKhoan]
        );
        const staffProfile = profileRows[0];

        if (!staffProfile) {
            return res.status(404).json({ error: 'Không tìm thấy hồ sơ cán bộ y tế liên kết.' });
        }
        
        res.status(200).json({
            message: 'Tải hồ sơ cán bộ y tế thành công',
            profile: {
                MaCBYT: staffProfile.MaCBYT,
                HoTen: staffProfile.HoTen,
                NgaySinh: staffProfile.NgaySinh, 
                GioiTinh: staffProfile.GioiTinh,
                ChucVu: staffProfile.ChucVu,
                SoDienThoai: staffProfile.SoDienThoai,
                Email: staffProfile.Email,
                TrinhDo: staffProfile.TrinhDo
            }
        });

    } catch (err) {
        console.error('LỖI API LẤY HỒ SƠ CÁN BỘ Y TẾ (Chi tiết):', err.stack);
        res.status(500).json({ 
            error: 'Lỗi server khi truy vấn hồ sơ cán bộ y tế.' 
        });
    }
};

module.exports = {
    getStaffProfile, 
    getAllStudentsList,
};