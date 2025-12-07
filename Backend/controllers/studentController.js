const pool = require('../db');

// --- ĐÃ KHẮC PHỤC LỖI CHÍNH TẢ ---
const STUDENT_PROFILE_TABLE = 'hocsinh'; 
const HEALTH_RECORD_TABLE = 'lichkham'; // <-- ĐÃ SỬA: lichkham (chữ 'ch' thay vì 'ck')

const getStudentProfile = async (req, res) => {
    // Lấy ID tài khoản từ token JWT
    const maTaiKhoan = req.user.id; 

    try {
        // 1. Lấy thông tin cá nhân học sinh từ bảng 'hocsinh'
        const [profileRows] = await pool.query(
            `SELECT MaHS, HoTen, NgaySinh, GioiTinh, Lop, DiaChi, SoDienThoaiPH FROM ${STUDENT_PROFILE_TABLE} WHERE MaTaiKhoan = ?`,
            [maTaiKhoan]
        );
        const studentProfile = profileRows[0];

        if (!studentProfile) {
            return res.status(404).json({ error: 'Không tìm thấy hồ sơ học sinh liên kết với tài khoản này.' });
        }
        
        const maHS = studentProfile.MaHS; 

        // 2. Lấy Lịch sử Khám bệnh từ bảng 'lichkham'
        const [records] = await pool.query(
            `SELECT MaLichKham, NgayKham, DiaDiem, MaCBYT, MaHS FROM ${HEALTH_RECORD_TABLE} WHERE MaHS = ? ORDER BY NgayKham DESC`,
            [maHS]
        );

        // 3. Trả về dữ liệu tổng hợp
        res.status(200).json({
            message: 'Tải hồ sơ học sinh thành công',
            profile: {
                // Tên thuộc tính trả về cho Frontend
                HoTen: studentProfile.HoTen, 
                MaHS: studentProfile.MaHS,
                NgaySinh: studentProfile.NgaySinh,
                GioiTinh: studentProfile.GioiTinh,
                Lop: studentProfile.Lop,
                DiaChi: studentProfile.DiaChi,
                SoDTPhuHuynh: studentProfile.SoDienThoaiPH
            },
            healthRecords: records
        });

    } catch (err) {
        // Log lỗi chi tiết để kiểm tra TÊN CỘT SQL (nếu lỗi 500 tiếp theo xảy ra)
        console.error('LỖI API LẤY HỒ SƠ HỌC SINH (Chi tiết):', err.stack);
        res.status(500).json({ 
            error: 'Lỗi server khi truy vấn hồ sơ. Vui lòng kiểm tra logs để xem lỗi tên cột.' 
        });
    }
};

module.exports = {
    getStudentProfile,
};