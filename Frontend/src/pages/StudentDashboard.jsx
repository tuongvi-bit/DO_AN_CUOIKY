import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import './StudentDashboard.css';
import defaultAvatarImg from '../assets/avatar-default.jpg';

const API_BASE_URL = 'http://localhost:4000/api'; 

// --- DỮ LIỆU MẪU CỐ ĐỊNH (KHÔNG THAY ĐỔI THEO HS) ---
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
const initialInteractions = { 'v1': { likes: 15, dislikes: 2 }, 'v3': { likes: 8, dislikes: 0 }, 'p1': { likes: 20, dislikes: 1 }, };
const initialUserStatus = { 'v1': 'like', };
const coreHealthInfo = { bloodType: "O+", history: "Hen suyễn, Dị ứng (Đậu phộng)", specialNote: "Cần lưu ý khi vận động mạnh" };
const vaccinations = [ "Uốn ván - Cập nhật 05/2022", "Cúm mùa - Cập nhật 09/2023", "Sởi - Quai bị - Rubella - Cập nhật 01/2021" ];
// --- END MOCK DATA ---

// Hàm chuyển đổi định dạng ngày (YYYY-MM-DDTHH:mm:ss.sssZ -> DD/MM/YYYY)
const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
        // Kiểm tra xem ngày tháng có hợp lệ không
        if (isNaN(date.getTime())) return isoString; 
        
        // Lấy ngày, tháng, năm và thêm số 0 vào trước (pad) nếu cần
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    } catch (e) {
        return isoString; // Trả về chuỗi gốc nếu có lỗi
    }
};

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile'); 
    
    // Lấy thông tin từ localStorage
    const storedUsername = localStorage.getItem('username') || 'Học Sinh';
    const storedRole = localStorage.getItem('userRole') || 'Học Sinh';
    const token = localStorage.getItem('userToken');

    // --- STATES CHO DỮ LIỆU THỰC TẾ ---
    const [studentInfo, setStudentInfo] = useState({
        name: storedUsername, 
        id: '', 
        dob: '',
        gender: '',
        class: '',
        parentName: 'Phụ huynh', // Tên phụ huynh không có trong DB, giữ mặc định hiển thị
        parentPhone: '',
        address: ''
    });
    const [healthRecords, setHealthRecords] = useState([]); // <-- State chứa lịch sử khám thực tế

    const [loading, setLoading] = useState(true); 
    const [apiError, setApiError] = useState(''); 
    const [avatar, setAvatar] = useState(defaultAvatarImg);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [tags, setTags] = useState(['Văn bản', 'Video']);
    const [showFilter, setShowFilter] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null); 
    
    // ... (States cho Thư viện) ...
    const [viewingMedia, setViewingMedia] = useState(null); 
    const [mediaInteractions, setMediaInteractions] = useState(initialInteractions); 
    const [userInteractions, setUserInteractions] = useState(initialUserStatus); 
    const [trendingMediaIds, setTrendingMediaIds] = useState([]); 

    const filterOptions = ["Video", "Ảnh", "Poster", "Bài viết"];
    const filterRef = useRef(null);
    
    // --- HÀM LOGOUT TẬP TRUNG ---
    const handleLogout = () => {
        localStorage.clear();
        navigate('/'); 
    };

    // --- HÀM GỌI API & KIỂM TRA XÁC THỰC (CHẠY KHI COMPONENT LOAD) ---
    const fetchStudentData = async () => {
        if (!token) {
            handleLogout();
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            // --- GỌI API LẤY HỒ SƠ CÁ NHÂN ---
            const profileResponse = await axios.get(`${API_BASE_URL}/students/profile`, config);
            const data = profileResponse.data;
            const profile = data.profile; 
            const records = data.healthRecords; 

            // 1. Cập nhật thông tin cá nhân (Profile)
            // LƯU Ý: ĐÃ DÙNG formatDate() CHO NGÀY SINH VÀ NGÀY KHÁM
            setStudentInfo({
                name: profile.HoTen || storedUsername, 
                id: profile.MaHS || '',
                dob: formatDate(profile.NgaySinh), // <-- ĐÃ SỬA: CHUYỂN ĐỔI ĐỊNH DẠNG NGÀY SINH
                gender: profile.GioiTinh || '',
                class: profile.Lop || '', 
                parentName: studentInfo.parentName, 
                parentPhone: profile.SoDTPhuHuynh || '',
                address: profile.DiaChi || ''
            });

            // 2. Cập nhật Lịch sử khám thực tế
            setHealthRecords(records || []); 
            
            setLoading(false);

        } catch (err) {
            setLoading(false);
            
            // Xử lý lỗi 401/403 (Token không hợp lệ hoặc hết hạn)
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                 alert("Phiên làm việc hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.");
                 handleLogout();
            } else {
                 setApiError("Không thể tải dữ liệu: Lỗi server khi truy vấn hồ sơ.");
                 console.error("Lỗi tải Profile:", err.response?.data || err);
            }
        }
    };

    useEffect(() => {
        // Chỉ chạy khi token có
        if (token) {
            fetchStudentData(); 
        } else {
            handleLogout();
        }
    }, [token]);


    // ... (các useEffect và hàm khác giữ nguyên) ...
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
        if (!mediaInteractions[media.id]) {
            setMediaInteractions({ ...mediaInteractions, [media.id]: { likes: 0, dislikes: 0 } });
        }
    };

    const handleCloseMedia = () => { setViewingMedia(null); };

    // LOGIC TƯƠNG TÁC 
    const handleInteraction = (mediaId, type) => {
        const currentStatus = userInteractions[mediaId]; 
        const currentCounts = mediaInteractions[mediaId] || { likes: 0, dislikes: 0 };

        let newCounts = { ...currentCounts };
        let newStatus = currentStatus;

        // Trường hợp 1: Bấm vào nút đã chọn -> Hủy chọn (Toggle off)
        if (currentStatus === type) { 
            newStatus = null; 
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
                newCounts.likes++; 	
                newCounts.dislikes--; 	
            } else {
                newCounts.dislikes++; 	
                newCounts.likes--; 	
            }
        }

        // Cập nhật State
        setMediaInteractions({ ...mediaInteractions, [mediaId]: newCounts });
        setUserInteractions({ ...userInteractions, [mediaId]: newStatus });
    };


    // --- LOGIC HEALTH RECORD (SỬ DỤNG DỮ LIỆU THỰC TẾ) ---
    const handleViewRecord = (record) => { setSelectedRecord(record); };
    const closeRecordModal = () => { setSelectedRecord(null); };
    const handleDownload = (record) => {
        const link = document.createElement("a");
        const dateStr = formatDate(record.NgayKham) || new Date().toLocaleDateString(); // <-- ĐÃ SỬA: DÙNG formatDate()
        link.href = "data:text/plain;charset=utf-8," + encodeURIComponent("Phiếu khám ngày " + dateStr + "\nKết quả: " + (record.PhanLoaiSK || "Chi tiết trong file"));
        link.download = `Phieu_Kham_${dateStr.replace(/\//g, "-")}.txt`; 
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
    };

    // --- RENDER COMPONENT CON ---
    const InfoRow = ({ label, name, value }) => (
        <div className="info-row"><span className="info-label">{label}:</span>{isEditing ? <input type="text" name={name} value={value} onChange={handleInfoChange} className="edit-input" /> : <span>{value}</span>}</div>
    );

    const renderProfile = () => (
        <div className="dashboard-body profile-layout">
            {apiError && <div style={{ color: 'red', textAlign: 'center', padding: '10px' }}>{apiError}</div>} {/* Hiển thị lỗi API */}
            <div className="avatar-section-centered">
                <div className="avatar-wrapper"><img src={avatar} alt="Avatar" className="big-avatar" /><input type="file" id="avatar-upload" hidden accept="image/*" onChange={handleImageChange} /><label htmlFor="avatar-upload" className="camera-icon">📷</label></div>
            </div>
            <div className="profile-content-container">
                <div className="info-box">
                    <InfoRow label="Họ và tên" name="name" value={studentInfo.name} />
                    <InfoRow label="Mã số HS" name="id" value={studentInfo.id} />
                    <InfoRow label="Ngày sinh" name="dob" value={studentInfo.dob} />
                    <InfoRow label="Giới tính" name="gender" value={studentInfo.gender} />
                    <InfoRow label="Lớp" name="class" value={studentInfo.class} />
                    <div className="info-heading">THÔNG TIN PHỤ HUYNH:</div>
                    <InfoRow label="Họ và Tên" name="parentName" value={studentInfo.parentName} />
                    <InfoRow label="Số điện thoại" name="parentPhone" value={studentInfo.parentPhone} />
                    <InfoRow label="Địa chỉ" name="address" value={studentInfo.address} />
                </div>
                <div className="action-buttons-side">
                    <button className="btn-action" onClick={handleUpdateClick}>{isEditing ? "Lưu thông tin" : "Cập nhật thông tin"}</button>
                    <button className="btn-action" onClick={() => navigate('/forgot-password')}>Đổi mật khẩu</button>
                    <button className="btn-action logout" onClick={handleLogout}>Đăng xuất</button> 
                </div>
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

            /* MODAL XEM CHI TIẾT MEDIA */
            {viewingMedia && (
                <div className="modal-overlay" onClick={handleCloseMedia}>
                    <div className="modal-content media-modal centered-modal" onClick={(e) => e.stopPropagation()}>
                        <span className="close-modal" onClick={handleCloseMedia}>&times;</span>
                        
                        <div className="media-modal-header">
                            <h2>{viewingMedia.title}</h2>
                            {trendingMediaIds.includes(viewingMedia.id) && <span className="trending-badge-large">🔥 Nổi bật</span>}
                        </div>

                        /* Nội dung Media: Căn giữa và phóng to */
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

                        /* Thanh tương tác Like/Dislike (Căn giữa) */
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
                    <thead><tr><th>STT</th><th>NGÀY KHÁM</th><th>PHÂN LOẠI SỨC KHỎẺ</th><th>CHI TIẾT</th><th>TẢI XUỐNG</th></tr></thead>
                    <tbody>
                        {healthRecords.map((record, index) => (
                            <tr key={record.MaHS + index}>
                                <td>{index + 1}</td>
                                <td>{formatDate(record.NgayKham)}</td> {/* <-- ĐÃ SỬA: Dùng formatDate */}
                                <td className={record.PhanLoaiSK === 'BÌNH THƯỜNG' ? 'status-normal' : 'status-warning'}>{record.PhanLoaiSK || 'N/A'}</td>
                                <td><button className="btn-table btn-view" onClick={() => handleViewRecord(record)}>XEM</button></td>
                                <td><button className="btn-table btn-download" onClick={() => handleDownload(record)}>TẢI</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedRecord && (
                <div className="modal-overlay" onClick={closeRecordModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-modal" onClick={closeRecordModal}>&times;</span>
                        <h2 className="modal-title">GIẤY KHÁM SỨC KHỎẺ</h2>
                        <p className="modal-subtitle">Ngày khám: {formatDate(selectedRecord.NgayKham)}</p> {/* <-- ĐÃ SỬA: Dùng formatDate */}
                        <div className="modal-body">
                            <div className="health-detail-row"><span>Chiều cao:</span> <strong>{selectedRecord.ChieuCao}</strong></div>
                            <div className="health-detail-row"><span>Cân nặng:</span> <strong>{selectedRecord.CanNang}</strong></div>
                            <div className="health-detail-row"><span>Phân loại:</span> <strong>{selectedRecord.PhanLoaiSK}</strong></div>
                            <div className="separator"></div>
                            <div className="health-detail-row"><span>Loại bệnh (Chẩn đoán):</span> <strong>{selectedRecord.LoaiBenh || 'Không'}</strong></div>
                            <div className="separator"></div>
                            <div className="health-note"><strong>Lời dặn của Bác sĩ:</strong><p>{selectedRecord.LoiDanBS || 'Không có'}</p></div>
                        </div>
                        <div className="modal-footer"><button className="btn-modal-close" onClick={closeRecordModal}>Đóng</button></div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderHealthBook = () => {
        const latestRecord = healthRecords[0];
        return (
            <div className="dashboard-body health-book-layout">
                <h2 className="section-title-blue">THÔNG TIN CỐT LÕI</h2>
                <div className="health-card core-info"><p><strong>Nhóm máu:</strong> {coreHealthInfo.bloodType}</p><p><strong>Tiền sử bệnh lý:</strong> {coreHealthInfo.history}</p><p><strong>Ghi chú đặc biệt:</strong> {coreHealthInfo.specialNote}</p></div>
                <h2 className="section-title-blue">KẾT QUẢ KHÁM GẦN NHẤT</h2>
                <div className="health-card latest-result">
                    {latestRecord ? (
                        <>
                            <p className="latest-title">Kết quả khám gần nhất ({formatDate(latestRecord.NgayKham)})</p> {/* <-- ĐÃ SỬA: Dùng formatDate */}
                            <p><strong>Ngày khám:</strong> {formatDate(latestRecord.NgayKham)}</p> {/* <-- ĐÃ SỬA: Dùng formatDate */}
                            <p><strong>Phân loại SK:</strong> {latestRecord.PhanLoaiSK}</p>
                            <div className="btn-center-wrapper"><button className="btn-action btn-download-large" onClick={() => handleDownload(latestRecord)}>TẢI XUỐNG</button></div>
                        </>
                    ) : (
                        <p className="text-center">Chưa có dữ liệu khám gần nhất.</p>
                    )}
                </div>
                <h2 className="section-title-blue">TIÊM CHỦNG</h2>
                <div className="health-card vaccination"><p className="latest-title">Tiêu đề: Lịch sử Tiêm chủng</p><ul className="vaccine-list">{vaccinations.map((vac, index) => (<li key={index}>{vac}</li>))}</ul></div>
            </div>
        );
    };

    if (loading) {
        return <div className="dashboard-container centered-loading">Đang tải dữ liệu và xác thực...</div>;
    }
    
    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <div className="sidebar-logo" style={{cursor: 'pointer'}} onClick={() => navigate('/')}>EduCare</div>
                <div className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Thông tin cá nhân</div>
                <div className={`menu-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => setActiveTab('library')}>Thư viện</div>
                <div className={`menu-item ${activeTab === 'health' ? 'active' : ''}`} onClick={() => setActiveTab('health')}>Lịch sử khám</div> {/* Đổi tên tab */}
                <div className={`menu-item ${activeTab === 'healthBook' ? 'active' : ''}`} onClick={() => setActiveTab('healthBook')}>Sổ sức khỏe</div>
            </div>
            <div className="main-content">
                <div className="dashboard-header">
                    <div className="user-profile-mini">
                        <span>{studentInfo.name} ({storedRole})</span> 
                        <img src={avatar} alt="mini-avatar" className="mini-avatar" />
                    </div>
                </div>
                {activeTab === 'profile' && renderProfile()}
                {activeTab === 'library' && renderLibrary()}
                {activeTab === 'health' && renderHealthRecords()}
                {activeTab === 'healthBook' && renderHealthBook()}
            </div>
        </div>
    );
};

export default StudentDashboard;