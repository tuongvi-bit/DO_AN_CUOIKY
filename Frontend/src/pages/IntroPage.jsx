import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import './IntroPage.css';

// --- DỮ LIỆU MẪU TIN NỔI BẬT ---
const mockNews = [
  { id: 1, title: "Lễ ra quân chiến dịch 'Trường học an toàn'", image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400", likes: 1250 },
  { id: 2, title: "Hội thảo: Dinh dưỡng hợp lý cho tuổi dậy thì", image: "https://images.unsplash.com/photo-1544531320-94a2dc9ded22?w=400", likes: 980 },
  { id: 3, title: "Gương sáng: Bác sĩ học đường tận tâm", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400", likes: 850 },
];

// --- DỮ LIỆU MẪU CẨM NANG SỨC KHỎE ---
const healthTips = [
  { id: 1, title: "Uống đủ nước", content: "Hãy uống ít nhất 2 lít nước mỗi ngày để cơ thể luôn khỏe mạnh và làn da tươi tắn.", icon: "💧" },
  { id: 2, title: "Bảo vệ mắt", content: "Áp dụng quy tắc 20-20-20: Cứ 20 phút nhìn màn hình, hãy nhìn xa 20 feet (6m) trong 20 giây.", icon: "👁️" },
  { id: 3, title: "Rửa tay đúng cách", content: "Rửa tay thường xuyên bằng xà phòng trong ít nhất 20 giây để phòng ngừa vi khuẩn.", icon: "🧼" },
  { id: 4, title: "Ngủ đủ giấc", content: "Học sinh cần ngủ từ 8-9 tiếng mỗi đêm để đảm bảo sự phát triển trí não.", icon: "😴" },
];

const IntroPage = () => {
  const navigate = useNavigate();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Logic đổi tip sức khỏe (Để demo tôi để 5 giây đổi 1 lần, thực tế sửa 5000 thành 5 * 60 * 60 * 1000)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % healthTips.length);
    }, 5000); // 5000ms = 5 giây
    return () => clearInterval(interval);
  }, []);

  const currentTip = healthTips[currentTipIndex];

  return (
    <div className="intro-container">
      <TopBar />
      
      {/* Header với nút quay lại */}
      <div className="intro-header">
        <button className="btn-back" onClick={() => navigate('/')}>❮ Trang chủ</button>
        <h1>GIỚI THIỆU EDUCARE</h1>
      </div>

      <div className="intro-content-wrapper">
        
        {/* MỤC 1: GIỚI THIỆU CHUNG */}
        <section className="intro-section about-section">
          <div className="about-grid">
            <div className="about-text">
              <h2>Về Chúng Tôi</h2>
              <p>
                <strong>EduCare</strong> là nền tảng Y tế học đường số hóa tiên phong, được xây dựng với sứ mệnh kiến tạo một môi trường giáo dục an toàn và khỏe mạnh toàn diện.
              </p>
              <p>
                Chúng tôi kết nối chặt chẽ giữa <strong>Nhà trường - Gia đình - Cán bộ y tế</strong> để theo dõi, chăm sóc và bảo vệ sức khỏe cho từng em học sinh. Với EduCare, hồ sơ sức khỏe được số hóa, lịch tiêm chủng được nhắc nhở tự động, và kiến thức y khoa chính thống luôn sẵn sàng ngay trên thiết bị của bạn.
              </p>
            </div>
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600" alt="Học sinh và bác sĩ" />
            </div>
          </div>
        </section>

        {/* MỤC 2: TIN NỔI BẬT (HOẠT ĐỘNG OFFLINE) */}
        <section className="intro-section news-section">
          <h2 className="section-title">Tin Nổi Bật <span className="badge">Hot</span></h2>
          <div className="news-grid">
            {mockNews.map(news => (
              <div key={news.id} className="news-card">
                <img src={news.image} alt={news.title} />
                <div className="news-info">
                  <h3>{news.title}</h3>
                  <div className="news-meta">
                    <span>❤️ {news.likes} yêu thích</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MỤC 3: CẨM NANG SỨC KHỎE (TỰ ĐỘNG ĐỔI) */}
        <section className="intro-section tips-section">
          <h2 className="section-title">Cẩm Nang Sức Khỏe Hôm Nay</h2>
          <div className="tip-card fade-in">
            <div className="tip-icon">{currentTip.icon}</div>
            <div className="tip-content">
              <h3>{currentTip.title}</h3>
              <p>{currentTip.content}</p>
            </div>
          </div>
          <p className="tip-note">* Mẹo sức khỏe sẽ được cập nhật tự động định kỳ.</p>
        </section>

        {/* MỤC 4: HỖ TRỢ (CHUYỂN TRANG) */}
        <section className="intro-section support-section">
          <div className="support-banner">
            <h2>Bạn cần tư vấn sức khỏe trực tiếp?</h2>
            <p>Đội ngũ bác sĩ chuyên khoa của chúng tôi luôn sẵn sàng lắng nghe và giải đáp.</p>
            <button className="btn-chat" onClick={() => navigate('/support')}>
              💬 Nhắn tin với Hotline
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default IntroPage;