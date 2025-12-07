import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import defaultAvatarImg from '../assets/avatar-default.jpg';

// --- DỮ LIỆU MẪU (MOCK DATA) ---
const mockVideos = [
  { id: 'v1', title: "Quy trình rửa tay 6 bước chuẩn Bộ Y Tế", thumbnail: "https://vinmec-prod.s3.amazonaws.com/images/20190322_111259_170239_Quy-Trinh-Rua-Tay-1.max-1800x1800.png", type: 'video' },
  { id: 'v2', title: "Hướng dẫn chải răng đúng cách", thumbnail: "https://www.colgate.com.vn/oral-health/brushing-and-flossing/how-to-brush-your-teeth-properly-a-quick-guide-0213/_jcr_content/root/container/contentdrawer/initial-content-parsys/image_4.coreimg.85.1024.jpeg/1726666168886/tooth-brushing-procedure.jpeg", type: 'video' },
  { id: 'v3', title: "Phòng chống sốt xuất huyết tại nhà", thumbnail: "https://www.congtydietmoi.com.vn/wp-content/uploads/phong-tranh-sot-xuat-huyet.jpg", type: 'video' },
  { id: 'v4', title: "Bài tập thể dục giữa giờ", thumbnail: "https://baobinhduong.vn/image/fckeditor/upload/2023/20231217/images/TD1.jpg", type: 'video' },
  { id: 'v5', title: "Sơ cứu khi bị chảy máu cam", thumbnail: "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/7/30/photo-1690725771412-1690725771725455867544.jpg", type: 'video' },
];

const mockPosters = [
  { id: 'p1', title: "5K - Chung sống an toàn với dịch bệnh", image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400", type: 'poster' },
  { id: 'p2', title: "Lịch tiêm chủng mở rộng", image: "https://36care.com/wp-content/uploads/2021/07/thuc-hien-tiem-chung-mo-rong-tai-36care-thanh-hoa.jpg", type: 'poster' },
  { id: 'p3', title: "Tháp dinh dưỡng cho học sinh", image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400", type: 'poster' },
  { id: 'p4', title: "Bảo vệ mắt học đường", image: "https://images2.thanhnien.vn/528068263637045248/2023/8/30/1-thuoc-nho-mat-shutterstock-16933699944581313681593.jpg", type: 'poster' },
];

// Dữ liệu tương tác mẫu (số lượng like/dislike)
const initialInteractions = {
    'v1': { likes: 15, dislikes: 2 },
    'v3': { likes: 8, dislikes: 0 },
    'p1': { likes: 20, dislikes: 1 },
};

// Dữ liệu trạng thái của người dùng hiện tại (đã like hay dislike cái nào chưa)
// null = chưa tương tác, 'like' = đã like, 'dislike' = đã dislike
const initialUserStatus = {
    'v1': 'like', // Ví dụ người dùng đã like video 1
};

const mockHealthRecords = [
    { id: 1, stt: 1, year: "2024 - 2025", semester: "Học kỳ I", date: "10/01/2025", status: "THỪA CÂN", summary: "Sức khỏe tốt, Cận thị nhẹ.", detail: { height: "152cm", weight: "50kg", bmi: "21.6 (Hơi cao)", eyes: "9/10 - 10/10", teeth: "Sâu răng hàm", ent: "Viêm họng nhẹ", internal: "Nhịp tim nhanh", doctorNote: "Hạn chế đồ ngọt, tập thể dục." }},
    { id: 2, stt: 2, year: "2024 - 2025", semester: "Đầu năm", date: "10/10/2024", status: "BÌNH THƯỜNG", summary: "Phát triển bình thường.", detail: { height: "150cm", weight: "42kg", bmi: "18.6", eyes: "10/10", teeth: "Tốt", ent: "Tốt", internal: "Tốt", doctorNote: "Phát triển tốt." }},
    { id: 3, stt: 3, year: "2023 - 2024", semester: "Cuối năm", date: "15/05/2024", status: "BÌNH THƯỜNG", summary: "Sức khỏe ổn định.", detail: { height: "148cm", weight: "40kg", bmi: "18.2", eyes: "10/10", teeth: "Tốt", ent: "Tốt", internal: "Tốt", doctorNote: "Sức khỏe ổn định." }},
];

const coreHealthInfo = {
    bloodType: "O+",
    history: "Hen suyễn, Dị ứng (Đậu phộng)",
    specialNote: "Cần lưu ý khi vận động mạnh"
};

const vaccinations = [
    "Uốn ván - Cập nhật 05/2022",
    "Cúm mùa - Cập nhật 09/2023",
    "Sởi - Quai bị - Rubella - Cập nhật 01/2021"
];

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile'); 
  const [studentInfo, setStudentInfo] = useState({
    name: 'NGUYỄN VĂN AN',
    id: '123xxx',
    dob: '12/05/2010',
    gender: 'Nam',
    class: '6A1',
    parentName: 'Nguyễn Văn Ba',
    parentPhone: '0901111001',
    address: 'Phú Gia'
  });
  const [avatar, setAvatar] = useState(defaultAvatarImg);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState(['Văn bản', 'Video']);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null); 
  
  // --- NEW STATE FOR LIBRARY INTERACTIONS ---
  const [viewingMedia, setViewingMedia] = useState(null); // Media đang xem chi tiết
  const [mediaInteractions, setMediaInteractions] = useState(initialInteractions); // Tổng số like/dislike
  const [userInteractions, setUserInteractions] = useState(initialUserStatus); // Trạng thái của user hiện tại
  const [trendingMediaIds, setTrendingMediaIds] = useState([]); 

  const filterOptions = ["Video", "Ảnh", "Poster", "Bài viết"];
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Effect để cập nhật danh sách trending khi mediaInteractions thay đổi
  useEffect(() => {
    const trending = Object.keys(mediaInteractions).filter(id => mediaInteractions[id].likes >= 10);
    setTrendingMediaIds(trending);
  }, [mediaInteractions]);

  // --- LOGIC PROFILE ---
  const handleImageChange = (e) => { const file = e.target.files[0]; if (file) setAvatar(URL.createObjectURL(file)); };
  const handleInfoChange = (e) => { setStudentInfo({ ...studentInfo, [e.target.name]: e.target.value }); };
  const handleUpdateClick = () => { if (isEditing) { alert("Đã lưu thông tin mới!"); setIsEditing(false); } else { setIsEditing(true); } };

  // --- LOGIC LIBRARY ---
  const removeTag = (tagToRemove) => { setTags(tags.filter(tag => tag !== tagToRemove)); };
  const addTag = (newTag) => { if (!tags.includes(newTag)) { setTags([...tags, newTag]); } setShowFilter(false); };

  const handleOpenMedia = (media) => {
      setViewingMedia(media);
      // Khởi tạo tương tác nếu chưa có
      if (!mediaInteractions[media.id]) {
          setMediaInteractions({ ...mediaInteractions, [media.id]: { likes: 0, dislikes: 0 } });
      }
  };

  const handleCloseMedia = () => { setViewingMedia(null); };

  // LOGIC TƯƠNG TÁC (CẬP NHẬT: CHỈ CHỌN 1 TRONG 2)
  const handleInteraction = (mediaId, type) => {
      const currentStatus = userInteractions[mediaId]; // Trạng thái hiện tại: 'like', 'dislike' hoặc undefined
      const currentCounts = mediaInteractions[mediaId] || { likes: 0, dislikes: 0 };

      let newCounts = { ...currentCounts };
      let newStatus = currentStatus;

      // Trường hợp 1: Bấm vào nút đã chọn -> Hủy chọn (Toggle off)
      if (currentStatus === type) { // type là 'like' hoặc 'dislike' (chú ý logic bên dưới dùng 'likes'/'dislikes' số nhiều cho count)
          newStatus = null; // Xóa trạng thái
          // Giảm số lượng tương ứng
          if (type === 'like') newCounts.likes--;
          if (type === 'dislike') newCounts.dislikes--;
      } 
      // Trường hợp 2: Chưa chọn gì -> Chọn mới
      else if (!currentStatus) {
          newStatus = type;
          if (type === 'like') newCounts.likes++;
          if (type === 'dislike') newCounts.dislikes++;
      }
      // Trường hợp 3: Đổi từ Like sang Dislike hoặc ngược lại
      else {
          newStatus = type;
          if (type === 'like') {
              newCounts.likes++;     // Tăng like
              newCounts.dislikes--;  // Giảm dislike cũ
          } else {
              newCounts.dislikes++;  // Tăng dislike
              newCounts.likes--;     // Giảm like cũ
          }
      }

      // Cập nhật State
      setMediaInteractions({ ...mediaInteractions, [mediaId]: newCounts });
      setUserInteractions({ ...userInteractions, [mediaId]: newStatus });
  };


  // --- LOGIC HEALTH RECORD ---
  const handleViewRecord = (record) => { setSelectedRecord(record); };
  const closeRecordModal = () => { setSelectedRecord(null); };
  const handleDownload = (record) => {
      const link = document.createElement("a");
      const dateStr = record.date || new Date().toLocaleDateString();
      link.href = "data:text/plain;charset=utf-8," + encodeURIComponent("Phiếu khám ngày " + dateStr + "\nKết quả: " + (record.status || "Chi tiết trong file"));
      link.download = `Phieu_Kham_${dateStr.replace(/\//g, "-")}.txt`; 
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  // --- RENDER COMPONENT CON ---
  const InfoRow = ({ label, name, value }) => (
    <div className="info-row"><span className="info-label">{label}:</span>{isEditing ? <input type="text" name={name} value={value} onChange={handleInfoChange} className="edit-input" /> : <span>{value}</span>}</div>
  );

  const renderProfile = () => (
    <div className="dashboard-body profile-layout">
      <div className="avatar-section-centered">
        <div className="avatar-wrapper"><img src={avatar} alt="Avatar" className="big-avatar" /><input type="file" id="avatar-upload" hidden accept="image/*" onChange={handleImageChange} /><label htmlFor="avatar-upload" className="camera-icon">📷</label></div>
      </div>
      <div className="profile-content-container">
        <div className="info-box">
          <InfoRow label="Họ và tên" name="name" value={studentInfo.name} /><InfoRow label="Mã số HS" name="id" value={studentInfo.id} /><InfoRow label="Ngày sinh" name="dob" value={studentInfo.dob} /><InfoRow label="Giới tính" name="gender" value={studentInfo.gender} /><InfoRow label="Lớp" name="class" value={studentInfo.class} />
          <div className="info-heading">THÔNG TIN PHỤ HUYNH:</div>
          <InfoRow label="Họ và Tên" name="parentName" value={studentInfo.parentName} /><InfoRow label="Số điện thoại" name="parentPhone" value={studentInfo.parentPhone} /><InfoRow label="Địa chỉ" name="address" value={studentInfo.address} />
        </div>
        <div className="action-buttons-side"><button className="btn-action" onClick={handleUpdateClick}>{isEditing ? "Lưu thông tin" : "Cập nhật thông tin"}</button><button className="btn-action" onClick={() => navigate('/forgot-password')}>Đổi mật khẩu</button><button className="btn-action logout" onClick={() => navigate('/')}>Đăng xuất</button></div>
      </div>
    </div>
  );

  const renderLibrary = () => (
    <div className="dashboard-body library-layout">
      <div className="library-controls">
        <div className="search-bar"><input type="text" placeholder="Hướng dẫn các bước rửa tay..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /><button className="btn-search">Tìm kiếm</button></div>
        <div className="filter-bar">
          <div className="dropdown-filter" ref={filterRef} onClick={() => setShowFilter(!showFilter)}><span>Lọc</span> <span className="arrow">▼</span>{showFilter && (<div className="dropdown-menu">{filterOptions.map((option, index) => (<div key={index} className="dropdown-item" onClick={(e) => { e.stopPropagation(); addTag(option); }}>{option}</div>))}</div>)}</div>
          <div className="tags-container">{tags.map((tag, index) => (<div key={index} className="tag-chip">{tag}<span className="close-tag" onClick={() => removeTag(tag)}>✕</span></div>))}</div>
        </div>
      </div>

      <div className="library-section">
        <h3 className="section-title">Video mới nhất</h3>
        <div className="horizontal-scroll">
          {mockVideos.map(video => (
            <div key={video.id} className="media-card video-card" onClick={() => handleOpenMedia(video)}>
              <div className="thumbnail-wrapper"><img src={video.thumbnail} alt={video.title} /><div className="play-icon">▶</div></div>
              <p className="media-title">
                  {trendingMediaIds.includes(video.id) && <span className="trending-icon">🔥</span>}
                  {video.title}
              </p>
            </div>
          ))}
          <div className="see-more-card"><span>Xem thêm ➜</span></div>
        </div>
      </div>

      <div className="library-section">
        <h3 className="section-title">Poster nổi bật</h3>
        <div className="horizontal-scroll">
          {mockPosters.map(poster => (
            <div key={poster.id} className="media-card poster-card" onClick={() => handleOpenMedia(poster)}>
              <img src={poster.image} alt={poster.title} /><div className="poster-overlay"><p>{poster.title}</p></div>
              {trendingMediaIds.includes(poster.id) && <div className="trending-badge">🔥 Nổi bật</div>}
            </div>
          ))}
          <div className="see-more-card"><span>Xem thêm ➜</span></div>
        </div>
      </div>

      {/* MODAL XEM CHI TIẾT MEDIA (CẬP NHẬT UI) */}
      {viewingMedia && (
          <div className="modal-overlay" onClick={handleCloseMedia}>
              <div className="modal-content media-modal centered-modal" onClick={(e) => e.stopPropagation()}>
                  <span className="close-modal" onClick={handleCloseMedia}>&times;</span>
                  
                  <div className="media-modal-header">
                      <h2>{viewingMedia.title}</h2>
                      {trendingMediaIds.includes(viewingMedia.id) && <span className="trending-badge-large">🔥 Nổi bật</span>}
                  </div>

                  {/* Nội dung Media: Căn giữa và phóng to */}
                  <div className="media-modal-body centered-content">
                      {viewingMedia.type === 'video' ? (
                          <div className="video-container large-view">
                              <img src={viewingMedia.thumbnail.replace('mqdefault', 'maxresdefault')} alt={viewingMedia.title} className="media-full" />
                              <div className="fake-play-button large">▶</div>
                          </div>
                      ) : (
                          <img src={viewingMedia.image} alt={viewingMedia.title} className="media-full poster-full large-view" />
                      )}
                  </div>

                  {/* Thanh tương tác Like/Dislike (Căn giữa) */}
                  <div className="media-interaction-bar centered-bar">
                      <button 
                          className={`btn-interact like ${userInteractions[viewingMedia.id] === 'like' ? 'active' : ''}`} 
                          onClick={() => handleInteraction(viewingMedia.id, 'like')}
                      >
                          👍 <span>{mediaInteractions[viewingMedia.id]?.likes || 0}</span>
                      </button>
                      
                      <button 
                          className={`btn-interact dislike ${userInteractions[viewingMedia.id] === 'dislike' ? 'active' : ''}`} 
                          onClick={() => handleInteraction(viewingMedia.id, 'dislike')}
                      >
                          👎 <span>{mediaInteractions[viewingMedia.id]?.dislikes || 0}</span>
                      </button>
                  </div>

                  <div className="modal-footer"><button className="btn-modal-close" onClick={handleCloseMedia}>Đóng</button></div>
              </div>
          </div>
      )}
    </div>
  );

  const renderHealthRecords = () => (
      <div className="dashboard-body health-layout">
          <div className="upcoming-exam-box">
              <h2 className="exam-title">ĐỢT KHÁM SẮP TỚI</h2>
              <div className="exam-content">
                  <p><strong>Tiêu đề:</strong> Thông báo: Khám sức khỏe định kỳ Học kỳ II, Năm học 2024-2025</p>
                  <p><strong>Thời gian:</strong> Thứ Sáu, 15/03/2025</p>
                  <p><strong>Địa điểm:</strong> Phòng Y tế</p>
                  <p className="exam-note"><em>Lưu ý: Học sinh vui lòng mang theo thẻ BHYT.</em></p>
              </div>
          </div>
          <h2 className="table-title">LỊCH SỬ KHÁM</h2>
          <div className="table-container-scroll">
              <table className="health-table">
                  <thead><tr><th>STT</th><th>NĂM HỌC</th><th>NGÀY KHÁM</th><th>PHÂN LOẠI SỨC KHỎE</th><th>CHI TIẾT</th><th>TẢI XUỐNG</th></tr></thead>
                  <tbody>{mockHealthRecords.map((record) => (<tr key={record.id}><td>{record.stt}</td><td>{record.year}</td><td>{record.date}</td><td className={record.status === 'BÌNH THƯỜNG' ? 'status-normal' : 'status-warning'}>{record.status}</td><td><button className="btn-table btn-view" onClick={() => handleViewRecord(record)}>XEM</button></td><td><button className="btn-table btn-download" onClick={() => handleDownload(record)}>TẢI</button></td></tr>))}</tbody>
              </table>
          </div>
          {selectedRecord && (
              <div className="modal-overlay" onClick={closeRecordModal}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}><span className="close-modal" onClick={closeRecordModal}>&times;</span><h2 className="modal-title">GIẤY KHÁM SỨC KHỎE</h2><p className="modal-subtitle">Ngày khám: {selectedRecord.date}</p><div className="modal-body"><div className="health-detail-row"><span>Chiều cao:</span> <strong>{selectedRecord.detail.height}</strong></div><div className="health-detail-row"><span>Cân nặng:</span> <strong>{selectedRecord.detail.weight}</strong></div><div className="health-detail-row"><span>BMI:</span> <strong>{selectedRecord.detail.bmi}</strong></div><div className="separator"></div><div className="health-detail-row"><span>Mắt:</span> <strong>{selectedRecord.detail.eyes}</strong></div><div className="health-detail-row"><span>Răng:</span> <strong>{selectedRecord.detail.teeth}</strong></div><div className="health-detail-row"><span>TMH:</span> <strong>{selectedRecord.detail.ent}</strong></div><div className="health-detail-row"><span>Nội khoa:</span> <strong>{selectedRecord.detail.internal}</strong></div><div className="separator"></div><div className="health-note"><strong>Lời dặn:</strong><p>{selectedRecord.detail.doctorNote}</p></div></div><div className="modal-footer"><button className="btn-modal-close" onClick={closeRecordModal}>Đóng</button></div></div>
              </div>
          )}
      </div>
  );

  const renderHealthBook = () => {
    const latestRecord = mockHealthRecords[0];
    return (
        <div className="dashboard-body health-book-layout">
            <h2 className="section-title-blue">THÔNG TIN CỐT LÕI</h2>
            <div className="health-card core-info"><p><strong>Nhóm máu:</strong> {coreHealthInfo.bloodType}</p><p><strong>Tiền sử bệnh lý:</strong> {coreHealthInfo.history}</p><p><strong>Ghi chú đặc biệt:</strong> {coreHealthInfo.specialNote}</p></div>
            <h2 className="section-title-blue">KẾT QUẢ KHÁM GẦN NHẤT</h2>
            <div className="health-card latest-result"><p className="latest-title">Tiêu đề: Kết quả khám {latestRecord.semester}, Năm học {latestRecord.year}</p><p><strong>Ngày khám:</strong> {latestRecord.date}</p><p><strong>Kết luận của Bác sĩ:</strong> {latestRecord.summary}</p><div className="btn-center-wrapper"><button className="btn-action btn-download-large" onClick={() => handleDownload(latestRecord)}>TẢI XUỐNG</button></div></div>
            <h2 className="section-title-blue">TIÊM CHỦNG</h2>
            <div className="health-card vaccination"><p className="latest-title">Tiêu đề: Lịch sử Tiêm chủng</p><ul className="vaccine-list">{vaccinations.map((vac, index) => (<li key={index}>{vac}</li>))}</ul></div>
        </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-logo" style={{cursor: 'pointer'}} onClick={() => navigate('/')}>EduCare</div>
        <div className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Thông tin cá nhân</div>
        <div className={`menu-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => setActiveTab('library')}>Thư viện</div>
        <div className={`menu-item ${activeTab === 'health' ? 'active' : ''}`} onClick={() => setActiveTab('health')}>Lịch khám định kỳ</div>
        <div className={`menu-item ${activeTab === 'healthBook' ? 'active' : ''}`} onClick={() => setActiveTab('healthBook')}>Sổ sức khỏe</div>
      </div>
      <div className="main-content">
        <div className="dashboard-header"><div className="user-profile-mini"><span>{studentInfo.name}</span><img src={avatar} alt="mini-avatar" className="mini-avatar" /></div></div>
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'library' && renderLibrary()}
        {activeTab === 'health' && renderHealthRecords()}
        {activeTab === 'healthBook' && renderHealthBook()}
      </div>
    </div>
  );
};

export default StudentDashboard;