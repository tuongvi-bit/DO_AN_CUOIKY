import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import './PublicPages.css'; // Dùng chung CSS cho các trang công cộng để đồng bộ

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="public-page-container">
      <TopBar />
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/')}>❮ Trang chủ</button>
        <h1>VỀ EDUCARE</h1>
      </div>

      <div className="content-wrapper about-content">
        <div className="about-hero">
          <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800" alt="Đội ngũ y tế" className="hero-image" />
          <div className="hero-text">
            <h2>Sứ mệnh của chúng tôi</h2>
            <p>EduCare ra đời với mong muốn kiến tạo một môi trường học đường an toàn, nơi sức khỏe của mỗi học sinh được theo dõi, chăm sóc và bảo vệ một cách toàn diện nhất.</p>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👩‍⚕️</div>
            <h3>Kết nối Y tế</h3>
            <p>Cầu nối trực tiếp giữa Phụ huynh, Nhà trường và Cán bộ Y tế chuyên trách.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Theo dõi Sức khỏe</h3>
            <p>Hồ sơ sức khỏe điện tử giúp theo dõi quá trình phát triển của trẻ qua từng năm học.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Phòng bệnh chủ động</h3>
            <p>Cập nhật nhanh chóng các thông tin dịch bệnh và biện pháp phòng ngừa kịp thời.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;