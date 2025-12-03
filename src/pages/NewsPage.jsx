import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import './PublicPages.css';

const mockNews = [
  { id: 1, title: "Lễ ra quân chiến dịch 'Trường học an toàn'", image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400", likes: 1250, date: "12/11/2025" },
  { id: 2, title: "Hội thảo: Dinh dưỡng hợp lý cho tuổi dậy thì", image: "https://nutrihome.vn/wp-content/uploads/2020/02/thap-dinh-duong-tre-day-thi.jpg", likes: 980, date: "10/11/2025" },
  { id: 3, title: "Gương sáng: Bác sĩ học đường tận tâm", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400", likes: 850, date: "09/11/2025" },
  { id: 4, title: "Hướng dẫn phòng chống cong vẹo cột sống", image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400", likes: 720, date: "05/11/2025" },
];

const NewsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="public-page-container">
      <TopBar />
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/')}>❮ Trang chủ</button>
        <h1>TIN NỔI BẬT</h1>
      </div>

      <div className="content-wrapper news-content">
        <div className="news-grid">
          {mockNews.map(news => (
            <div key={news.id} className="news-card">
              <div className="news-img-wrapper">
                <img src={news.image} alt={news.title} />
                <span className="news-date">{news.date}</span>
              </div>
              <div className="news-info">
                <h3>{news.title}</h3>
                <div className="news-meta">
                  <span>❤️ {news.likes} yêu thích</span>
                  <button className="btn-read-more">Xem chi tiết</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;