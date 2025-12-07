const pool = require('../db'); // Import kết nối MySQL từ db.js

// Tên bảng CSDL chính xác của bạn
const TABLE_NAME = 'bangiamhieu'; 
const PRIMARY_KEY = 'MaBGH'; // Khóa chính thực tế

// --- HÀM MỚI: LẤY HỒ SƠ CÁ NHÂN BAN GIÁM HIỆU ---
const getAdminProfile = async (req, res) => {
    // Lấy ID tài khoản từ token JWT (MaTaiKhoan)
    const maTaiKhoan = req.user.id; 

    try {
        // 1. Lấy thông tin cá nhân Ban Giám Hiệu
        const [profileRows] = await pool.query(
            // Truy vấn các cột cần thiết (HoTen, ChucVu, SoDienThoai, Email)
            `SELECT MaBGH, HoTen, ChucVu, SoDienThoai, Email FROM ${TABLE_NAME} WHERE MaTaiKhoan = ?`,
            [maTaiKhoan]
        );
        const adminProfile = profileRows[0];

        if (!adminProfile) {
            // Trường hợp 404: Không tìm thấy hồ sơ liên kết
            return res.status(404).json({ error: 'Không tìm thấy hồ sơ Ban Giám Hiệu liên kết.' });
        }
        
        // Trả về dữ liệu
        res.status(200).json({
            message: 'Tải hồ sơ Ban Giám Hiệu thành công',
            profile: {
                MaBGH: adminProfile.MaBGH,
                HoTen: adminProfile.HoTen,
                ChucVu: adminProfile.ChucVu,
                SoDienThoai: adminProfile.SoDienThoai,
                Email: adminProfile.Email
            }
        });

    } catch (err) {
        console.error('LỖI API LẤY HỒ SƠ BAN GIÁM HIỆU (Chi tiết):', err.stack);
        res.status(500).json({ error: 'Lỗi server khi truy vấn hồ sơ Ban Giám Hiệu.' });
    }
};


// --- 1. LẤY TẤT CẢ BAN GIÁM HIỆU (READ ALL) ---
const getAllBGH = async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT MaBGH, HoTen, ChucVu, SoDienThoai, Email FROM ${TABLE_NAME}`);
        res.status(200).json(rows);
    } catch (err) {
        console.error(`Lỗi khi lấy dữ liệu ${TABLE_NAME}:`, err.stack);
        res.status(500).json({ error: 'Lỗi server khi truy vấn danh sách Ban Giám Hiệu.' });
    }
};

// --- 2. TẠO THÀNH VIÊN BAN GIÁM HIỆU MỚI (CREATE) ---
const createBGH = async (req, res) => {
    // Lấy dữ liệu từ request body
    const { HoTen, ChucVu, SoDienThoai, Email, MaTaiKhoan } = req.body; 
    
    // ĐÃ SỬA LỖI: Kiểm tra bằng HoTen và ChucVu
    if (!HoTen || !ChucVu) {
        return res.status(400).json({ error: 'Họ tên và chức vụ không được để trống.' });
    }

    // Câu lệnh INSERT
    const sql = `INSERT INTO ${TABLE_NAME} (HoTen, ChucVu, SoDienThoai, Email, MaTaiKhoan) VALUES (?, ?, ?, ?, ?)`;
    const values = [HoTen, ChucVu, SoDienThoai, Email, MaTaiKhoan]; // ĐÃ SỬA: Dùng HoTen, ChucVu...
    
    try {
        const [result] = await pool.execute(sql, values);
        res.status(201).json({ 
            message: 'Thêm thành viên BGH thành công.',
            id: result.insertId 
        });
    } catch (err) {
        console.error(`Lỗi khi thêm dữ liệu ${TABLE_NAME}:`, err.stack);
        res.status(400).json({ error: 'Không thể thêm dữ liệu. Kiểm tra lại thông tin.' });
    }
};

// --- 3. LẤY THÀNH VIÊN THEO ID (READ ONE) ---
const getBGHById = async (req, res) => {
    const { id } = req.params; 
    try {
        // Sử dụng PRIMARY_KEY (MaBGH)
        const [rows] = await pool.query(`SELECT * FROM ${TABLE_NAME} WHERE ${PRIMARY_KEY} = ?`, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy thành viên Ban Giám Hiệu.' });
        }
        res.status(200).json(rows[0]); 
    } catch (err) {
        console.error(`Lỗi khi lấy dữ liệu ${TABLE_NAME} theo ID:`, err.stack);
        res.status(500).json({ error: 'Lỗi server khi truy vấn dữ liệu.' });
    }
};

// --- 4. CẬP NHẬT THÔNG TIN (UPDATE) ---
const updateBGH = async (req, res) => {
    const { id } = req.params;
    const { HoTen, ChucVu, SoDienThoai, Email } = req.body;
    
    let updateFields = [];
    let updateValues = [];

    // Tên cột phải khớp chính xác
    if (HoTen) { updateFields.push('HoTen = ?'); updateValues.push(HoTen); }
    if (ChucVu) { updateFields.push('ChucVu = ?'); updateValues.push(ChucVu); }
    if (SoDienThoai) { updateFields.push('SoDienThoai = ?'); updateValues.push(SoDienThoai); }
    if (Email) { updateFields.push('Email = ?'); updateValues.push(Email); }

    if (updateFields.length === 0) {
        return res.status(400).json({ error: 'Không có dữ liệu nào được cung cấp để cập nhật.' });
    }

    // Sử dụng PRIMARY_KEY (MaBGH)
    const sql = `UPDATE ${TABLE_NAME} SET ${updateFields.join(', ')} WHERE ${PRIMARY_KEY} = ?`;
    updateValues.push(id); 

    try {
        const [result] = await pool.execute(sql, updateValues);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy thành viên Ban Giám Hiệu để cập nhật.' });
        }
        res.status(200).json({ message: 'Cập nhật thành công.' });
    } catch (err) {
        console.error(`Lỗi khi cập nhật dữ liệu ${TABLE_NAME}:`, err.stack);
        res.status(500).json({ error: 'Lỗi server khi cập nhật dữ liệu.' });
    }
};

// --- 5. XÓA THÀNH VIÊN (DELETE) ---
const deleteBGH = async (req, res) => {
    const { id } = req.params;
    try {
        // Sử dụng PRIMARY_KEY (MaBGH)
        const [result] = await pool.execute(`DELETE FROM ${TABLE_NAME} WHERE ${PRIMARY_KEY} = ?`, [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy thành viên Ban Giám Hiệu để xóa.' });
        }
        res.status(200).json({ message: 'Xóa thành công.' });
    } catch (err) {
        console.error(`Lỗi khi xóa dữ liệu ${TABLE_NAME}:`, err.stack);
        res.status(500).json({ error: 'Lỗi server khi xóa dữ liệu.' });
    }
};

module.exports = {
    getAdminProfile,
    getAllBGH,
    createBGH,
    getBGHById,
    updateBGH,
    deleteBGH
};