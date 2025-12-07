import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import './PublicPages.css'; // Assumes you have created this CSS file as discussed before

const healthTips = [
  { id: 1, title: "UỐNG ĐỦ NƯỚC MỖI NGÀY", content: "Nước giúp duy trì nhiệt độ cơ thể, vận chuyển dinh dưỡng và oxy đến các tế bào. Hãy uống ít nhất 2 lít nước mỗi ngày!", icon: "💧", color: "#3498db" },
  { id: 2, title: "QUY TẮC 20-20-20 CHO MẮT", content: "Để tránh mỏi mắt: Cứ 20 phút nhìn màn hình, hãy nhìn xa 20 feet (6m) trong vòng 20 giây.", icon: "👁️", color: "#2ecc71" },
  { id: 3, title: "RỬA TAY ĐÚNG CÁCH", content: "Rửa tay thường xuyên bằng xà phòng dưới vòi nước chảy ít nhất 30 giây để loại bỏ vi khuẩn và virus.", icon: "🧼", color: "#e74c3c" },
  { id: 4, title: "NGỦ ĐỦ GIẤC", content: "Giấc ngủ giúp phục hồi năng lượng và phát triển trí não. Học sinh cần ngủ từ 8-9 tiếng mỗi đêm.", icon: "😴", color: "#9b59b6" },
  { id: 5, title: "ĂN SÁNG ĐẦY ĐỦ", content: "Bữa sáng cung cấp năng lượng cho cả ngày học tập. Đừng bao giờ bỏ bữa sáng nhé!", icon: "🍳", color: "#f1c40f" },
];

const HealthTipsPage = () => {
  const navigate = useNavigate();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Tự động đổi tip sau mỗi 5 giây (5000ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % healthTips.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, []);

  const tip = healthTips[currentTipIndex];

  return (
    <div className="public-page-container">
      <TopBar />
      <div className="page-header" style={{backgroundColor: tip.color}}>
        <button className="btn-back" onClick={() => navigate('/')}>❮ Trang chủ</button>
        <h1>CẨM NANG SỨC KHỎE</h1>
      </div>

      <div className="content-wrapper tips-content">
        <div className="tip-display-card fade-in" style={{borderColor: tip.color}}>
          <div className="tip-icon-large">{tip.icon}</div>
          <h2 style={{color: tip.color}}>{tip.title}</h2>
          <p>{tip.content}</p>
          
          <div className="progress-dots">
            {healthTips.map((_, idx) => (
              <span key={idx} className={`dot ${idx === currentTipIndex ? 'active' : ''}`} style={{backgroundColor: idx === currentTipIndex ? tip.color : '#ddd'}}></span>
            ))}
          </div>
        </div>

        <div className="tips-list">
            <h3>Danh sách các mẹo khác:</h3>
            <ul>
                {healthTips.map((t, idx) => (
                    <li key={t.id} onClick={() => setCurrentTipIndex(idx)} style={{cursor: 'pointer'}}>
                        {t.icon} {t.title}
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default HealthTipsPage;