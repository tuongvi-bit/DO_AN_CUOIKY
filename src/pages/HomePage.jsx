import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import './HomePage.css'; 
import logo from '../assets/logo.png'; 

const HomePage = () => {
  const navigate = useNavigate();

  // Hàm điều hướng chung
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="homepage-container">
      {/* 1. Thanh TopBar (SĐT, Email...) */}
      <TopBar />

      {/* 2. Thanh Brand (Tên thương hiệu) */}
      <div className="brand-bar">
        <h1 className="brand-text">EduCare</h1>
      </div>

      {/* 3. Phần Hero (Hình nền + Logo + Nút phân quyền) */}
      <div className="hero-section">
        <div className="hero-content">
          <img src={logo} alt="EduCare Logo" className="hero-logo" />
          <h2 className="slogan">EduCare - Vì sức khỏe học đường</h2>
          
          <div className="role-buttons">
            {/* Các nút đăng nhập theo vai trò */}
            <button className="btn-role" onClick={() => handleNavigation('/login/staff')}>
              Cán bộ y tế
            </button>
            <button className="btn-role" onClick={() => handleNavigation('/login/admin')}>
              Ban giám hiệu
            </button>
            <button className="btn-role" onClick={() => handleNavigation('/login/student')}>
              Học sinh
            </button>
          </div>
        </div>
      </div>

      {/* 4. Footer Navigation (Menu chức năng công cộng) */}
      <div className="footer-nav">
        {/* Nút 1: Giới thiệu -> Trang AboutPage */}
        <div className="nav-item" onClick={() => handleNavigation('/about')}>
          <h3>Giới thiệu</h3>
        </div>
        
        {/* Nút 2: Tin nổi bật -> Trang NewsPage */}
        <div className="nav-item" onClick={() => handleNavigation('/news')}>
          <h3>Tin nổi bật</h3>
        </div>
        
        {/* Nút 3: Cẩm nang -> Trang HealthTipsPage */}
        <div className="nav-item" onClick={() => handleNavigation('/health-tips')}>
          <h3>Cẩm nang <br/> sức khỏe</h3>
        </div>
        
        {/* Nút 4: Hỗ trợ -> Trang Support */}
        <div className="nav-item" onClick={() => handleNavigation('/support')}>
          <h3>Hỗ trợ</h3>
        </div>
      </div>
    </div>
  );
};

export default HomePage;