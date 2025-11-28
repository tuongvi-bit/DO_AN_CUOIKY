import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './StaffDashboard.css';
import defaultAvatarImg from '../assets/avatar-staff.jpg'; 

const initialStudents = [
    { id: 'HS001', name: 'Nguyễn Văn An', class: '6A1', dob: '10/05/2013', status: 'Bình thường', gender: 'Nam', parent: 'Nguyễn Văn Ba', phone: '0901111001', address: 'Phú Gia' },
    { id: 'HS002', name: 'Lê Thị Bích', class: '7A2', dob: '22/08/2012', status: 'Cận thị nhẹ', gender: 'Nữ', parent: 'Lê Văn C', phone: '0902222002', address: 'Tân Lập' },
    { id: 'HS003', name: 'Trần Hoàng Cường', class: '8A1', dob: '01/02/2011', status: 'Thừa cân', gender: 'Nam', parent: 'Trần Thị D', phone: '0903333003', address: 'Hòa An' },
    { id: 'HS004', name: 'Phạm Thu Dung', class: '6A1', dob: '15/11/2013', status: 'Bình thường', gender: 'Nữ', parent: 'Phạm Văn E', phone: '0904444004', address: 'Bình Minh' },
    { id: 'HS005', name: 'Hoàng Văn Em', class: '9A3', dob: '05/05/2010', status: 'Sâu răng', gender: 'Nam', parent: 'Hoàng Thị F', phone: '0905555005', address: 'Hương Sơn' },
];

const mockTemplates = [
    { id: 1, src: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400", title: "Phòng chống COVID-19" },
    { id: 2, src: "https://images.unsplash.com/photo-1632053009663-e3c35870b240?w=400", title: "Lịch tiêm chủng" },
    { id: 3, src: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400", title: "Tháp dinh dưỡng HS" },
    { id: 4, src: "https://images.unsplash.com/photo-1589820296156-2454bb8a4d50?w=400", title: "Bảo vệ mắt học đường" },
    { id: 5, src: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400", title: "Thể dục thể thao" },
    { id: 6, src: "https://images.unsplash.com/photo-1545869357-194396b72049?w=400", title: "Phòng chống đuối nước" },
    { id: 7, src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400", title: "Sốt xuất huyết" },
    { id: 8, src: "https://images.unsplash.com/photo-1555685812-4b943f3e99a4?w=400", title: "Quy trình rửa tay" },
    { id: 9, src: "https://images.unsplash.com/photo-1584036561566-b93a90a6b262?w=400", title: "Cúm mùa" },
    { id: 10, src: "https://images.unsplash.com/photo-1586942593568-29361efcd571?w=400", title: "Đeo khẩu trang" },
];

const initialCalendarEvents = [
    { id: 1, title: "Biểu hiện sốt xuất huyết", date: 27, month: 11, year: 2025, status: "rejected" }, 
    { id: 2, title: "6 bước rửa tay", date: 29, month: 11, year: 2025, status: "pending" }, 
    { id: 3, title: "Cách đeo khẩu trang", date: 29, month: 11, year: 2025, status: "approved" }, 
    { id: 4, title: "Ngày hội sức khỏe", date: 30, month: 11, year: 2025, status: "approved" }, 
    { id: 5, title: "Hãy là người tiêu dùng thông thái", date: 30, month: 11, year: 2025, status: "draft" }, 
    { id: 6, title: "Chọn nước uống sạch", date: 4, month: 12, year: 2025, status: "rejected" },
    { id: 7, title: "Kiểm định thực phẩm", date: 5, month: 12, year: 2025, status: "draft" }
];

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile'); 
  const [staffInfo, setStaffInfo] = useState({
    name: 'LÊ THỊ MAI',
    dob: '22/03/1988',
    gender: 'Nữ',
    phone: '0905001122',
    email: 'mai.le@truong.edu.vn',
    position: 'Y sĩ học đường',
    degree: 'Đại học Y Dược Huế'
  });
  const [avatar, setAvatar] = useState(defaultAvatarImg);
  const [isEditing, setIsEditing] = useState(false);
  const [students, setStudents] = useState(initialStudents); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('Khối');
  const [selectedClass, setSelectedClass] = useState('Lớp');
  const [showGradeDropdown, setShowGradeDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [expandedId, setExpandedId] = useState(null); 
  const [editingId, setEditingId] = useState(null);   
  const [editFormData, setEditFormData] = useState({}); 
  const [postMediaTab, setPostMediaTab] = useState('template'); 
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [postContent, setPostContent] = useState({ title: '', body: '', seoTitle: '', metaDesc: '', scheduleOption: 'now', scheduleDate: '' });
  const [currentMonth, setCurrentMonth] = useState(11);
  const [currentYear, setCurrentYear] = useState(2025);
  const [calendarEvents, setCalendarEvents] = useState(initialCalendarEvents);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const editorRef = useRef(null);
  const grades = ['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9'];
  const classes = ['6A1', '6A2', '7A1', '7A2', '8A1', '9A1'];
  
  const gradeRef = useRef(null);
  const classRef = useRef(null);
  const monthPickerRef = useRef(null);
  const yearPickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
        if (gradeRef.current && !gradeRef.current.contains(event.target)) setShowGradeDropdown(false);
        if (classRef.current && !classRef.current.contains(event.target)) setShowClassDropdown(false);
        if (monthPickerRef.current && !monthPickerRef.current.contains(event.target)) setShowMonthPicker(false);
        if (yearPickerRef.current && !yearPickerRef.current.contains(event.target)) setShowYearPicker(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageChange = (e) => { const file = e.target.files[0]; if (file) setAvatar(URL.createObjectURL(file)); };
  const handleInfoChange = (e) => { setStaffInfo({ ...staffInfo, [e.target.name]: e.target.value }); };
  const handleUpdateClick = () => { if (isEditing) { alert("Đã lưu thông tin cán bộ!"); setIsEditing(false); } else { setIsEditing(true); } };
  const toggleExpand = (id) => { if (expandedId === id) { setExpandedId(null); } else { setExpandedId(id); setEditingId(null); } };
  const handleEditClick = (student) => { setEditingId(student.id); setEditFormData(student); setExpandedId(null); };
  const handleEditFormChange = (e) => { setEditFormData({ ...editFormData, [e.target.name]: e.target.value }); };
  const handleSaveClick = () => { const newStudents = students.map((s) => (s.id === editingId ? editFormData : s)); setStudents(newStudents); setEditingId(null); alert(`Đã cập nhật thông tin học sinh ${editFormData.name}`); };
  const handleCancelClick = () => { setEditingId(null); };
  const handleAddStudent = () => { alert("Chức năng Thêm hồ sơ đang phát triển!"); };
  const handleExportExcel = () => { alert("Đang xuất dữ liệu ra file Excel..."); };
  const handleEditorCommand = (command, value = null) => { document.execCommand(command, false, value); if (editorRef.current) editorRef.current.focus(); };
  const handleEditorInput = (e) => { setPostContent({ ...postContent, body: e.target.innerHTML }); };
  const handlePostChange = (e) => { setPostContent({ ...postContent, [e.target.name]: e.target.value }); };
  const handlePostSubmit = (type) => {
      if (type === 'draft') alert("Đã lưu bản nháp thành công!");
      if (type === 'publish') {
          const content = editorRef.current ? editorRef.current.innerHTML : '';
          console.log("Nội dung bài viết:", content);
          alert("Đã gửi bài viết đi phê duyệt!");
      }
  };

  const InfoRow = ({ label, name, value, editable = true }) => (
    <div className="info-row">
        <span className="info-label">{label}:</span>
        {isEditing && editable ? <input type="text" name={name} value={value} onChange={handleInfoChange} className="edit-input" /> : <span>{value}</span>}
    </div>
  );

  const renderProfile = () => (
    <div className="dashboard-body profile-layout">
      <div className="avatar-section-centered">
        <div className="avatar-wrapper">
          <img src={avatar} alt="Avatar" className="big-avatar" />
          <input type="file" id="avatar-upload" hidden accept="image/*" onChange={handleImageChange} />
          <label htmlFor="avatar-upload" className="camera-icon">📷</label>
        </div>
      </div>
      <div className="profile-content-container">
        <div className="info-box staff-info-box">
          <div className="info-group">
            <div className="info-heading">THÔNG TIN CÁ NHÂN <span className="icon-edit" title="Sửa">✏️</span></div>
            <InfoRow label="Họ và tên" name="name" value={staffInfo.name} />
            <InfoRow label="Ngày sinh" name="dob" value={staffInfo.dob} />
            <InfoRow label="Giới tính" name="gender" value={staffInfo.gender} />
          </div>
          <div className="info-group">
            <div className="info-heading">THÔNG TIN LIÊN HỆ <span className="icon-edit" title="Sửa">✏️</span></div>
            <InfoRow label="Số điện thoại" name="phone" value={staffInfo.phone} />
            <InfoRow label="Email" name="email" value={staffInfo.email} />
          </div>
          <div className="info-group">
            <div className="info-heading">THÔNG TIN CHUYÊN MÔN <span className="icon-view" title="Xem">👁️</span></div>
            <InfoRow label="Chức vụ" name="position" value={staffInfo.position} editable={false} />
            <InfoRow label="Bằng cấp" name="degree" value={staffInfo.degree} editable={false} />
          </div>
        </div>
        <div className="action-buttons-side">
          <button className="btn-action" onClick={handleUpdateClick}>{isEditing ? "Lưu thông tin" : "Cập nhật thông tin"}</button>
          <button className="btn-action" onClick={() => navigate('/forgot-password')}>Đổi mật khẩu</button>
          <button className="btn-action logout" onClick={() => navigate('/')}>Đăng xuất</button>
        </div>
      </div>
    </div>
  );

  const renderStudentManagement = () => (
      <div className="dashboard-body student-manage-layout">
          <h2 className="section-title-blue">QUẢN LÍ THÔNG TIN HỌC SINH</h2>
          <div className="toolbar-container">
              <div className="search-box-large"><input type="text" placeholder="Tìm kiếm theo tên, lớp, ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
              <div className="filter-group">
                  <div className="dropdown-custom" ref={classRef} onClick={() => setShowClassDropdown(!showClassDropdown)}><span>{selectedClass}</span> <span className="arrow">▼</span>{showClassDropdown && (<div className="dropdown-list"><div className="dropdown-option" onClick={() => setSelectedClass('Tất cả')}>Tất cả</div>{classes.map((cls, idx) => (<div key={idx} className="dropdown-option" onClick={() => setSelectedClass(cls)}>{cls}</div>))}</div>)}</div>
                  <div className="dropdown-custom" ref={gradeRef} onClick={() => setShowGradeDropdown(!showGradeDropdown)}><span>{selectedGrade}</span> <span className="arrow">▼</span>{showGradeDropdown && (<div className="dropdown-list"><div className="dropdown-option" onClick={() => setSelectedGrade('Tất cả')}>Tất cả</div>{grades.map((gr, idx) => (<div key={idx} className="dropdown-option" onClick={() => setSelectedGrade(gr)}>{gr}</div>))}</div>)}</div>
              </div>
          </div>
          <div className="big-actions-container"><button className="btn-big-action btn-add" onClick={handleAddStudent}>Thêm hồ sơ</button><button className="btn-big-action btn-export" onClick={handleExportExcel}>Xuất Excel</button></div>
          <div className="table-wrapper">
              <table className="student-table">
                  <thead><tr><th>MÃ HS</th><th>HỌ TÊN</th><th>LỚP</th><th>NGÀY SINH</th><th>TÌNH TRẠNG</th><th>HÀNH ĐỘNG</th></tr></thead>
                  <tbody>
                      {students.map((student) => (
                          <React.Fragment key={student.id}>
                              <tr className={expandedId === student.id ? 'active-row' : ''}>
                                  <td><strong>{student.id}</strong></td>
                                  <td className="text-left">{editingId === student.id ? <input type="text" name="name" value={editFormData.name} onChange={handleEditFormChange} className="table-input" /> : <span className="font-bold">{student.name}</span>}</td>
                                  <td>{editingId === student.id ? <input type="text" name="class" value={editFormData.class} onChange={handleEditFormChange} className="table-input center" /> : <strong>{student.class}</strong>}</td>
                                  <td>{editingId === student.id ? <input type="text" name="dob" value={editFormData.dob} onChange={handleEditFormChange} className="table-input center" /> : <strong>{student.dob}</strong>}</td>
                                  <td>{editingId === student.id ? <input type="text" name="status" value={editFormData.status} onChange={handleEditFormChange} className="table-input center" /> : <span className="status-cell">{student.status}</span>}</td>
                                  <td className="actions-cell">{editingId === student.id ? (<><span className="icon-btn save" title="Lưu" onClick={handleSaveClick}>💾</span><span className="icon-btn cancel" title="Hủy" onClick={handleCancelClick}>❌</span></>) : (<><span className="icon-btn view" onClick={() => toggleExpand(student.id)}>{expandedId === student.id ? '🙈' : '👁️'}</span><span className="icon-btn edit" onClick={() => handleEditClick(student)}>✏️</span><span className="icon-btn print" onClick={() => alert("Đang in hồ sơ...")}>🖨️</span></>)}</td>
                              </tr>
                              {expandedId === student.id && (<tr className="detail-row"><td colSpan="6"><div className="detail-content"><div className="detail-grid"><div className="detail-item"><strong>Giới tính:</strong> {student.gender}</div><div className="detail-item"><strong>Phụ huynh:</strong> {student.parent}</div><div className="detail-item"><strong>SĐT LH:</strong> {student.phone}</div><div className="detail-item"><strong>Địa chỉ:</strong> {student.address}</div><div className="detail-item full-width"><strong>Ghi chú sức khỏe:</strong> Tiền sử bệnh lý bình thường. Cần theo dõi thêm về thị lực.</div></div></div></td></tr>)}
                          </React.Fragment>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  );

  const renderCreatePost = () => (
      <div className="dashboard-body create-post-layout">
          <h2 className="section-title-blue">TẠO BÀI VIẾT MỚI</h2>
          <div className="post-step">
              <div className="step-header"><span className="step-number">1</span> Hình ảnh/ Video/ Poster</div>
              <div className="media-tabs"><div className={`media-tab ${postMediaTab === 'template' ? 'active' : ''}`} onClick={() => setPostMediaTab('template')}>MẪU POSTER</div><div className={`media-tab ${postMediaTab === 'upload' ? 'active' : ''}`} onClick={() => setPostMediaTab('upload')}>TẢI LÊN</div></div>
              <div className="media-content-area">
                  {postMediaTab === 'template' ? (<div className="template-slider">{mockTemplates.map(tpl => (<div key={tpl.id} className={`template-item ${selectedTemplate === tpl.id ? 'selected' : ''}`} onClick={() => setSelectedTemplate(tpl.id)}><img src={tpl.src} alt={tpl.title} /><div className="template-title-overlay">{tpl.title}</div>{selectedTemplate === tpl.id && <div className="selected-overlay">✓</div>}</div>))}<div className="template-item load-more"><span className="plus-icon">+</span><span>Tải thêm</span></div></div>) : (<div className="upload-area"><p>Kéo thả ảnh vào đây hoặc bấm để tải lên</p><input type="file" accept="image/*,video/*" /></div>)}
              </div>
          </div>
          <div className="post-step">
              <div className="step-header"><span className="step-number">2</span> Soạn thảo nội dung</div>
              <div className="form-group"><label>Tiêu đề bài viết (*)</label><input type="text" name="title" placeholder="Ví dụ: Cách phòng chống bệnh sốt xuất huyết..." value={postContent.title} onChange={handlePostChange} className="form-input" /></div>
              <div className="form-group"><label>Nội dung bài viết (*)</label><div className="editor-container"><div className="editor-toolbar"><button className="editor-btn" onClick={() => handleEditorCommand('justifyLeft')}>≡</button><button className="editor-btn" onClick={() => handleEditorCommand('justifyCenter')}>≣</button><button className="editor-btn" onClick={() => handleEditorCommand('justifyRight')}>⫸</button><span className="separator">|</span><button className="editor-btn font-bold" onClick={() => handleEditorCommand('bold')}>B</button><button className="editor-btn font-italic" onClick={() => handleEditorCommand('italic')}>I</button><button className="editor-btn font-underline" onClick={() => handleEditorCommand('underline')}>U</button><button className="editor-btn" onClick={() => handleEditorCommand('insertUnorderedList')}>●</button><span className="separator">|</span><button className="editor-btn" onClick={() => { const url = prompt("URL:"); if (url) handleEditorCommand('createLink', url); }}>🔗</button></div><div ref={editorRef} className="editor-content" contentEditable={true} onInput={handleEditorInput} suppressContentEditableWarning={true}></div></div></div>
          </div>
          <div className="post-step"><div className="step-header"><span className="step-number">3</span> Tối ưu SEO</div><div className="form-group"><label>Tiêu đề SEO</label><input type="text" name="seoTitle" className="form-input" value={postContent.seoTitle} onChange={handlePostChange} /></div><div className="form-group"><label>Mô tả META</label><textarea name="metaDesc" className="form-textarea-small" value={postContent.metaDesc} onChange={handlePostChange}></textarea></div></div>
          <div className="post-step"><div className="step-header"><span className="step-number">4</span> Xuất bản/ Phân loại</div><div className="publish-options"><div className="schedule-row"><label className="radio-label"><input type="radio" name="scheduleOption" value="now" checked={postContent.scheduleOption === 'now'} onChange={handlePostChange} /><span>Đăng ngay sau khi được duyệt</span></label><label className="radio-label"><input type="radio" name="scheduleOption" value="schedule" checked={postContent.scheduleOption === 'schedule'} onChange={handlePostChange} /><span>Hẹn lịch đăng</span></label><input type="datetime-local" name="scheduleDate" className="date-picker" disabled={postContent.scheduleOption !== 'schedule'} value={postContent.scheduleDate} onChange={handlePostChange} /></div><div className="publish-status"><strong>Hành động:</strong> <br/>Trạng thái: <span>Bản nháp</span></div><div className="publish-buttons"><button className="btn-publish draft" onClick={() => handlePostSubmit('draft')}>LƯU NHÁP</button><button className="btn-publish submit" onClick={() => handlePostSubmit('publish')}>GỬI PHÊ DUYỆT</button></div></div></div>
      </div>
  );

  const renderCalendar = () => {
      const daysInMonth = 30; const startDay = 6; const calendarDays = [];
      for (let i = 0; i < startDay; i++) { calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>); }
      const handleDateClick = (day) => { if (selectedDate === day) setSelectedDate(null); else setSelectedDate(day); };
      for (let day = 1; day <= daysInMonth; day++) {
          const eventsToday = calendarEvents.filter(ev => ev.date === day && ev.month === currentMonth && ev.year === currentYear);
          const isSelected = selectedDate === day;
          calendarDays.push(<div key={day} className={`calendar-day ${isSelected ? 'selected-day' : ''}`} onClick={() => handleDateClick(day)} title={`Ngày ${day}`}><span className="day-number">{day}</span><div className="events-list">{eventsToday.map(ev => (<div key={ev.id} className={`event-badge ${ev.status}`} title={ev.title}>{ev.title}</div>))}</div></div>);
      }
      return (
          <div className="dashboard-body calendar-layout">
              <h2 className="section-title-blue">LỊCH NỘI DUNG</h2>
              <div className="calendar-header">
                  <button className="btn-nav" onClick={() => setCurrentMonth(currentMonth > 1 ? currentMonth - 1 : 12)}>❮</button>
                  <div className="current-time">
                      <div className="calendar-selector" ref={monthPickerRef}><div className="month-pill" onClick={() => setShowMonthPicker(!showMonthPicker)}>Tháng {currentMonth}</div>{showMonthPicker && (<div className="calendar-dropdown">{Array.from({ length: 12 }, (_, i) => i + 1).map(m => (<div key={m} className={`calendar-option ${m === currentMonth ? 'selected' : ''}`} onClick={() => { setCurrentMonth(m); setShowMonthPicker(false); }}>Tháng {m}</div>))}</div>)}</div>
                      <div className="calendar-selector" ref={yearPickerRef}><div className="year-pill" onClick={() => setShowYearPicker(!showYearPicker)}>{currentYear}</div>{showYearPicker && (<div className="calendar-dropdown">{[currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map(y => (<div key={y} className={`calendar-option ${y === currentYear ? 'selected' : ''}`} onClick={() => { setCurrentYear(y); setShowYearPicker(false); }}>{y}</div>))}</div>)}</div>
                  </div>
                  <button className="btn-nav" onClick={() => setCurrentMonth(currentMonth < 12 ? currentMonth + 1 : 1)}>❯</button>
              </div>
              <div className="calendar-legend"><div className="legend-item"><span className="dot draft"></span> Nháp</div><div className="legend-item"><span className="dot pending"></span> Chờ duyệt</div><div className="legend-item"><span className="dot rejected"></span> Đã từ chối</div><div className="legend-item"><span className="dot approved"></span> Đã duyệt</div><button className="btn-add-event" onClick={() => setActiveTab('createPost')}>+</button></div>
              <div className="calendar-grid"><div className="day-name">CN</div><div className="day-name">T2</div><div className="day-name">T3</div><div className="day-name">T4</div><div className="day-name">T5</div><div className="day-name">T6</div><div className="day-name">T7</div>{calendarDays}</div>
          </div>
      );
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-logo" style={{cursor: 'pointer'}} onClick={() => navigate('/')}>EduCare</div>
        <div className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Thông tin cá nhân</div>
        <div className={`menu-item ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>Thông tin học sinh</div>
        <div className={`menu-item ${activeTab === 'createPost' ? 'active' : ''}`} onClick={() => setActiveTab('createPost')}>Tạo bài viết</div>
        <div className={`menu-item ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>Lịch nội dung 90 ngày</div>
      </div>
      <div className="main-content">
        <div className="dashboard-header"><div className="user-profile-mini"><span>{staffInfo.name}</span><img src={avatar} alt="mini-avatar" className="mini-avatar" /></div></div>
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'students' && renderStudentManagement()}
        {activeTab === 'createPost' && renderCreatePost()}
        {activeTab === 'calendar' && renderCalendar()}
      </div>
    </div>
  );
};

export default StaffDashboard;