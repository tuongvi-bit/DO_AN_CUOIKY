import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentLibrary.css';

// ======================================================
// KHU VỰC DỮ LIỆU (THÊM / SỬA / XÓA TẠI ĐÂY)
// ======================================================

const DATA_VIDEOS = [
  {
    id: 1,
    title: "Hướng dẫn 6 bước rửa tay đúng cách",
    desc: "Bộ Y Tế khuyến cáo",
    thumb: "https://img.freepik.com/free-photo/person-washing-hands-soap_23-2148766185.jpg",
    category: "Vệ sinh",
  },
  {
    id: 2,
    title: "Cách đánh răng chuẩn nha khoa",
    desc: "Bảo vệ nụ cười xinh",
    thumb: "https://img.freepik.com/free-photo/father-teaching-son-how-brush-teeth_23-2149179512.jpg",
    category: "Răng miệng",
  },
  {
    id: 3,
    title: "Phòng chống sốt xuất huyết tại nhà",
    desc: "Diệt muỗi, lăng quăng",
    thumb: "https://img.freepik.com/free-vector/mosquito-bite-prevention-infographic_1308-44445.jpg",
    category: "Dịch bệnh",
  },
  {
    id: 4,
    title: "Bài tập mắt cho học sinh",
    desc: "Chống cận thị học đường",
    thumb: "https://img.freepik.com/free-photo/little-girl-doing-eye-test_23-2148968603.jpg",
    category: "Mắt",
  }
];

const DATA_POSTERS = [
  {
    id: 1,
    title: "Tháp dinh dưỡng cân đối",
    thumb: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400",
  },
  {
    id: 2,
    title: "Thông điệp 5K phòng chống dịch",
    thumb: "https://img.freepik.com/free-vector/gradient-medical-infographic-template_23-2149079717.jpg",
  },
  {
    id: 3,
    title: "Lịch tiêm chủng mở rộng",
    thumb: "https://nutrihome.vn/wp-content/uploads/2025/03/lich-tiem-chung-cho-tre-em-tu-0-12-tuoi-01.jpg",
  },
];

// ======================================================

const StudentLibrary = () => {
  const navigate = useNavigate();

  // State tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'video', 'image', 'text'

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Hàm lọc dữ liệu dựa trên Search Term
  const filteredVideos = DATA_VIDEOS.filter(item => 
    item.title.toLowerCase().includes(searchTerm)
  );

  const filteredPosters = DATA_POSTERS.filter(item => 
    item.title.toLowerCase().includes(searchTerm)
  );

  // Logic hiển thị theo Tag
  const showVideos = activeFilter === 'all' || activeFilter === 'video';
  const showPosters = activeFilter === 'all' || activeFilter === 'image';

  return (
    <div className="library-container">
      {/* --- SIDEBAR --- */}
      <div className="sidebar">
        <div className="sidebar-logo">EduCare</div>
        {/* Nút 1: Chuyển về Dashboard */}
        <div className="menu-item" onClick={() => navigate('/student/dashboard')}>
            Thông tin cá nhân
        </div>
        {/* Nút 2: Trang hiện tại (Active) */}
        <div className="menu-item active">Thư viện</div> 
        <div className="menu-item">Lịch khám định kỳ</div>
        <div className="menu-item">Sổ sức khỏe</div>
      </div>

      {/* --- NỘI DUNG CHÍNH --- */}
      <div className="library-content">
        {/* Header */}
        <div className="library-header">
           <div style={{fontWeight: 'bold', color: '#2c3e50'}}>Nguyễn Văn An</div>
        </div>

        {/* --- KHU VỰC TÌM KIẾM & LỌC --- */}
        <div className="search-filter-container">
            <div className="search-box-wrapper">
                <input 
                    type="text" 
                    placeholder="Hướng dẫn các bước rửa tay..." 
                    className="search-input"
                    onChange={handleSearch}
                />
                <button className="btn-search">Tìm kiếm</button>
            </div>

            <div className="filter-tags-wrapper">
                <button className="filter-btn-main">Lọc ⌄</button>
                
                {/* Tag Văn bản (Giả lập) */}
                <div 
                    className={`tag-item ${activeFilter === 'text' ? 'active' : ''}`}
                    onClick={() => setActiveFilter(activeFilter === 'text' ? 'all' : 'text')}
                >
                    Văn bản <span className="close-tag">✕</span>
                </div>

                {/* Tag Video */}
                <div 
                    className={`tag-item ${activeFilter === 'video' ? 'active' : ''}`}
                    onClick={() => setActiveFilter(activeFilter === 'video' ? 'all' : 'video')}
                >
                    Video <span className="close-tag">✕</span>
                </div>

                {/* Tag Hình ảnh */}
                <div 
                    className={`tag-item ${activeFilter === 'image' ? 'active' : ''}`}
                    onClick={() => setActiveFilter(activeFilter === 'image' ? 'all' : 'image')}
                >
                    Hình ảnh <span className="close-tag">✕</span>
                </div>
            </div>
        </div>

        {/* --- DANH SÁCH VIDEO --- */}
        {showVideos && (
            <>
                <h2 className="section-title">Video mới nhất</h2>
                <div className="media-grid">
                    {filteredVideos.map((video) => (
                        <div key={video.id} className="media-card">
                            <div style={{position: 'relative'}}>
                                <img src={video.thumb} alt={video.title} className="media-thumb" />
                                <div className="play-icon-overlay">▶</div>
                            </div>
                            <div className="media-info">
                                <div className="media-title">{video.title}</div>
                                <div className="media-desc">{video.desc}</div>
                            </div>
                        </div>
                    ))}
                    {filteredVideos.length === 0 && <p style={{paddingLeft:40, color: '#777'}}>Không tìm thấy video nào.</p>}
                </div>
            </>
        )}

        {/* --- DANH SÁCH POSTER --- */}
        {showPosters && (
            <>
                <h2 className="section-title">Poster nổi bật</h2>
                <div className="media-grid">
                    {filteredPosters.map((poster) => (
                        <div key={poster.id} className="media-card">
                            <img src={poster.thumb} alt={poster.title} className="media-thumb" style={{height: '250px'}} />
                            <div className="media-info">
                                <div className="media-title">{poster.title}</div>
                            </div>
                        </div>
                    ))}
                    {filteredPosters.length === 0 && <p style={{paddingLeft:40, color: '#777'}}>Không tìm thấy poster nào.</p>}
                </div>
            </>
        )}

      </div>
    </div>
  );
};

export default StudentLibrary;