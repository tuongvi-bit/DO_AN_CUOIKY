import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import axios from 'axios'; // Import axios để gọi API
import TopBar from '../components/layout/TopBar';
import './Auth.css'; 
import logo from '../assets/logo.png'; 

// Địa chỉ Backend mà chúng ta đã thiết lập thành công
const API_BASE_URL = 'http://localhost:4000/api'; 

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ loginId: '', password: '' }); // Đổi username thành loginId
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- HÀM PHÂN TÍCH VÀ CHUYỂN HƯỚNG ---
    const redirectToDashboard = (role) => {
        if (role === 'Admin' || role === 'BanGiamHieu') { 
            navigate('/admin/dashboard'); // <-- CHUYỂN ĐẾN ADMIN/BGH DASHBOARD
        } else if (role === 'CanBoYTe' || role === 'Staff') { 
            navigate('/staff/dashboard'); 
        } else if (role === 'HocSinh') {
            navigate('/student/dashboard');
        } else {
            setError("Đăng nhập thành công nhưng vai trò không xác định.");
            navigate('/');
        }
    };
    
    // --- HÀM ĐĂNG NHẬP CHÍNH ---
    const handleLogin = async (e) => {
        e.preventDefault(); 

        // Kiểm tra dữ liệu đầu vào cơ bản
        if (!formData.loginId || !formData.password) {
            setError("Vui lòng nhập đầy đủ tên đăng nhập/email và mật khẩu.");
            return;
        }

        setError('');
        setLoading(true);

        try {
            // 1. Gọi API Đăng nhập (POST /auth/login)
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                loginId: formData.loginId,
                password: formData.password
            });

            // 2. Xử lý thành công
            const { token, username, role } = response.data;

            // LƯU TOKEN và VAI TRÒ vào BỘ NHỚ CỤC BỘ (LOCAL STORAGE)
            localStorage.setItem('userToken', token); 
            localStorage.setItem('username', username);
            localStorage.setItem('userRole', role); // Lưu vai trò

            setLoading(false);
            
            // 3. CHUYỂN HƯỚNG DỰA TRÊN VAI TRÒ
            redirectToDashboard(role); 

        } catch (err) {
            // 4. Xử lý lỗi (400, 401, 500)
            const errorMessage = err.response?.data?.error || "Lỗi kết nối hoặc server không phản hồi.";
            setError(errorMessage);
            setLoading(false);
            console.error('Lỗi Đăng nhập:', err);
        }
    };

    return (
        <div className="auth-container">
            <TopBar />
            <div className="auth-overlay">
                <img src={logo} alt="Logo" className="auth-logo" />
                <h2 className="auth-slogan">EduCare - Vì sức khỏe học đường</h2>
                <form className="auth-form-box" onSubmit={handleLogin}>
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                    <div className="input-group">
                        <input 
                            type="text" 
                            name="loginId" 
                            placeholder="Tên đăng nhập / Email" 
                            className="auth-input" 
                            onChange={handleChange} 
                            value={formData.loginId}
                            disabled={loading}
                        />
                    </div>
                    <div className="input-group">
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Mật khẩu" 
                            className="auth-input" 
                            onChange={handleChange} 
                            value={formData.password}
                            disabled={loading}
                        />
                    </div>
                    <span className="forgot-link" onClick={() => navigate('/forgot-password')}>Quên mật khẩu</span>
                    <button 
                        className="btn-auth" 
                        type="submit" 
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                    
                    {/* Phần đăng nhập mạng xã hội giữ nguyên */}
                    <div className="social-login">
                        <p>Đăng nhập bằng</p>
                        <div className="social-icons-container">
                            <span className="social-icon-btn email" title="Email">📧</span>
                            <span className="social-icon-btn fb" title="Facebook">f</span>
                            <span className="social-icon-btn tw" title="Twitter">t</span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;