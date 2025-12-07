const pool = require('../db');

// --- ĐÃ SỬA: ĐỊNH NGHĨA TÊN BẢNG CHÍNH XÁC ---
// Dựa trên hình ảnh MySQL Workbench
const Y_TE_TABLE = 'canboyte';    // Tên bảng Cán bộ Y tế
const BGH_TABLE = 'bangiamhieu';  // Tên bảng Ban Giám Hiệu


const getDashboardData = async (req, res) => {
    const userRole = req.user.role; 

    try {
        // LƯU Ý: Tên cột (HoTen, ChucVu, SoDienThoai) phải khớp chính xác chữ hoa/thường
        
        // 1. Lấy danh sách cán bộ y tế
        const [yTeRows] = await pool.query(`
            SELECT MaCBYT, HoTen, ChucVu, SoDienThoai, Email 
            FROM ${Y_TE_TABLE}
        `);

        // 2. Lấy danh sách ban giám hiệu
        const [bghRows] = await pool.query(`
            SELECT MaBGH, HoTen, ChucVu, SoDienThoai, Email
            FROM ${BGH_TABLE}
        `);
        
        // 3. Trả về dữ liệu tổng hợp
        res.status(200).json({
            user_info: req.user,
            y_te_list: yTeRows,
            bgh_list: bghRows,
            message: `Dữ liệu tổng hợp đã sẵn sàng cho vai trò: ${userRole}`
        });

    } catch (err) {
        // Log lỗi chi tiết để kiểm tra các lỗi SQL khác (ví dụ: Tên Cột sai)
        console.error('LỖI KHI LẤY DỮ LIỆU TỔNG HỢP (SQL Error):', err.stack);
        res.status(500).json({ 
            error: 'Lỗi server khi truy vấn dữ liệu dashboard. Vui lòng kiểm tra logs server để xem lỗi tên cột.' 
        });
    }
};

module.exports = { getDashboardData };