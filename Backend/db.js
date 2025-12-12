// db.js (Đã sửa lỗi cú pháp)
require('dotenv').config();
// Sử dụng thư viện mysql2/promise
const mysql = require('mysql2/promise'); 

// Thiết lập cấu hình kết nối database
const pool = mysql.createPool({
    
    user: "root", 
    host: "localhost", 
    database: "yte_hocduong", 
    password: '130613', 
    port: 3306,
    
    // Cài đặt nâng cao cho MySQL Pool
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Kiểm tra kết nối khi ứng dụng khởi động
pool.getConnection()
    .then(connection => {
        console.log('✅ Đã kết nối thành công tới Database MySQL: yte_hocduong');
        connection.release(); 
    })
    .catch(err => {
        console.error('❌ Lỗi kết nối Database MySQL (yte_hocduong):', err.stack);
    });

// Xuất đối tượng Pool
module.exports = pool;
