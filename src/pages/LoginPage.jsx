import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import TopBar from '../components/layout/TopBar';
import './Auth.css'; 
import logo from '../assets/logo.png'; 

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    // Logic giả lập chuyển hướng dựa trên URL đăng nhập
    if (location.pathname.includes('staff')) {
        navigate('/staff/dashboard');
    } else if (location.pathname.includes('admin')) {
        navigate('/admin/dashboard'); // Chuyển đến trang Admin
    } else {
        navigate('/student/dashboard'); // Mặc định là học sinh
    }
  };

  // ... (Phần render giữ nguyên như cũ)
  return (
    <div className="auth-container">
      <TopBar />
      <div className="auth-overlay">
        <img src={logo} alt="Logo" className="auth-logo" />
        <h2 className="auth-slogan">EduCare - Vì sức khỏe học đường</h2>
        <div className="auth-form-box">
          <div className="input-group">
            <input type="text" name="username" placeholder="Tên đăng nhập" className="auth-input" onChange={handleChange} />
          </div>
          <div className="input-group">
            <input type="password" name="password" placeholder="Mật khẩu" className="auth-input" onChange={handleChange} />
          </div>
          <span className="forgot-link" onClick={() => navigate('/forgot-password')}>Quên mật khẩu</span>
          <button className="btn-auth" onClick={handleLogin}>Đăng nhập</button>
          <div className="social-login">
            <p>Đăng nhập bằng</p>
            <div className="social-icons-container">
              <span className="social-icon-btn email" title="Email">📧</span>
              <span className="social-icon-btn fb" title="Facebook">f</span>
              <span className="social-icon-btn tw" title="Twitter">t</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
