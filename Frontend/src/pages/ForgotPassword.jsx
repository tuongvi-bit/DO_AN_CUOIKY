import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import './Auth.css'; // Dùng lại CSS cũ -> Tiết kiệm thời gian
import logo from '../assets/logo.png'; 

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    newPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Dữ liệu Reset Pass gửi Backend:", formData);
    alert("Đã gửi yêu cầu đổi mật khẩu! Quay lại trang đăng nhập...");
    navigate('/login/student'); // Giả sử đổi xong thì về trang login
  };

  return (
    <div className="auth-container">
      <TopBar />
      <div className="auth-overlay">
        
        <img src={logo} alt="Logo" className="auth-logo" />
        <h2 className="auth-slogan">EduCare - Vì sức khỏe học đường</h2>

        <div className="auth-form-box">
          {/* Tái sử dụng class input-group và auth-input */}
          <div className="input-group">
            <input 
              type="text" 
              name="fullname"
              placeholder="Họ và tên" 
              className="auth-input"
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <input 
              type="tel" 
              name="phone"
              placeholder="Số điện thoại" 
              className="auth-input"
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <input 
              type="password" 
              name="newPassword"
              placeholder="Mật khẩu mới" 
              className="auth-input"
              onChange={handleChange}
            />
          </div>

          <button className="btn-auth" onClick={handleSubmit}>
            Xác nhận
          </button>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;