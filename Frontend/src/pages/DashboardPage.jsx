import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:4000/api'; 

const DashboardPage = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const username = localStorage.getItem('username');
    const role = localStorage.getItem('userRole');

    // Hàm gọi API dữ liệu bảo mật
    const fetchDashboardData = async () => {
        const token = localStorage.getItem('userToken');

        // 1. Kiểm tra Token
        if (!token) {
            navigate('/'); // Quay về trang đăng nhập nếu không có token
            return;
        }

        try {
            // 2. GỌI API VÀ GỬI TOKEN TRONG HEADER AUTHORIZATION
            const response = await axios.get(`${API_BASE_URL}/data/dashboard`, {
                headers: {
                    Authorization: `Bearer ${token}` // Đây là phần quan trọng nhất
                }
            });

            // 3. Xử lý thành công
            setDashboardData(response.data);
            setLoading(false);

        } catch (err) {
            setLoading(false);
            
            // Xử lý lỗi xác thực (401/403)
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                localStorage.removeItem('userToken');
                localStorage.removeItem('userRole');
                setError("Phiên làm việc hết hạn. Vui lòng đăng nhập lại.");
                navigate('/'); 
            } else {
                setError("Không thể tải dữ liệu: Lỗi server.");
                console.error("Lỗi tải Dashboard:", err);
            }
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Hiển thị trạng thái tải
    if (loading) {
        return <div className="dashboard-container">Đang tải dữ liệu...</div>;
    }

    // Hiển thị trạng thái lỗi
    if (error) {
        return <div className="dashboard-container" style={{ color: 'red' }}>{error}</div>;
    }

    // Hiển thị dữ liệu thành công
    return (
        <div className="dashboard-container p-8">
            <h1 className="text-2xl font-bold mb-4">Chào mừng {username} ({role})</h1>
            <p className="mb-6">{dashboardData.message}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* HIỂN THỊ BAN GIÁM HIỆU */}
                <div className="bg-white p-4 shadow-lg rounded-lg">
                    <h2 className="text-xl font-semibold mb-3 border-b pb-2">Thông tin Ban Giám Hiệu</h2>
                    {dashboardData.bgh_list && dashboardData.bgh_list.length > 0 ? (
                        <ul className="list-disc pl-5">
                            {dashboardData.bgh_list.map((item, index) => (
                                <li key={index}>
                                    {item.HoTen} - {item.ChucVu} (SĐT: {item.SoDienThoai})
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Chưa có dữ liệu Ban Giám Hiệu.</p>
                    )}
                </div>

                {/* HIỂN THỊ CÁN BỘ Y TẾ */}
                <div className="bg-white p-4 shadow-lg rounded-lg">
                    <h2 className="text-xl font-semibold mb-3 border-b pb-2">Thông tin Cán bộ Y tế</h2>
                    {dashboardData.y_te_list && dashboardData.y_te_list.length > 0 ? (
                        <ul className="list-disc pl-5">
                            {dashboardData.y_te_list.map((item, index) => (
                                <li key={index}>
                                    {item.HoTen} - {item.ChucVu} (SĐT: {item.SoDienThoai})
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Chưa có dữ liệu Cán bộ Y tế.</p>
                    )}
                </div>
            </div>
            <button 
                onClick={() => {
                    localStorage.clear();
                    navigate('/');
                }}
                className="mt-8 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
                Đăng xuất
            </button>
        </div>
    );
};

export default DashboardPage;