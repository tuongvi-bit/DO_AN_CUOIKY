import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import defaultAvatarImg from '../assets/avatar-staff.jpg'; 

// --- DỮ LIỆU MẪU BÀI VIẾT CHỜ DUYỆT ---
const mockPendingPosts = [
    { 
        id: 1, 
        title: "Cảnh báo: Phát hiện ca bệnh Tay Chân Miệng", 
        author: "Lê Thị Mai", 
        date: "12/11/2025", 
        status: "pending",
        content: "Nội dung cảnh báo về bệnh tay chân miệng... <p>Cần rửa tay thường xuyên.</p>",
        image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400",
        schedule: "now"
    },
    { 
        id: 2, 
        title: "Hướng dẫn sơ cứu khi bị bỏng", 
        author: "Lê Thị Mai", 
        date: "11/11/2025", 
        status: "pending",
        content: "Các bước sơ cứu khi bị bỏng nước sôi... <ol><li>Làm mát vết bỏng</li><li>Che chắn vết thương</li></ol>",
        image: "https://images.unsplash.com/photo-1632053009663-e3c35870b240?w=400",
        schedule: "15/11/2025 08:00" 
    },
    { 
        id: 3, 
        title: "Thực đơn dinh dưỡng tháng 11", 
        author: "Nguyễn Văn Y Tá", 
        date: "10/11/2025", 
        status: "pending",
        content: "Chi tiết thực đơn...",
        image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400",
        schedule: "now"
    }
];

// --- DỮ LIỆU MẪU HỌC SINH ---
const initialStudents = [
    { id: 'HS001', name: 'Nguyễn Văn An', class: '6A1', dob: '10/05/2013', status: 'Bình thường', gender: 'Nam', parent: 'Nguyễn Văn Ba', phone: '0901111001', address: 'Phú Gia' },
    { id: 'HS002', name: 'Lê Thị Bích', class: '7A2', dob: '22/08/2012', status: 'Cận thị nhẹ', gender: 'Nữ', parent: 'Lê Văn C', phone: '0902222002', address: 'Tân Lập' },
    { id: 'HS003', name: 'Trần Hoàng Cường', class: '8A1', dob: '01/02/2011', status: 'Thừa cân', gender: 'Nam', parent: 'Trần Thị D', phone: '0903333003', address: 'Hòa An' },
    { id: 'HS004', name: 'Phạm Thu Dung', class: '6A1', dob: '15/11/2013', status: 'Bình thường', gender: 'Nữ', parent: 'Phạm Văn E', phone: '0904444004', address: 'Bình Minh' },
    { id: 'HS005', name: 'Hoàng Văn Em', class: '9A3', dob: '05/05/2010', status: 'Sâu răng', gender: 'Nam', parent: 'Hoàng Thị F', phone: '0905555005', address: 'Hương Sơn' },
];

// --- DỮ LIỆU MẪU CÁN BỘ ---
const initialStaffs = [
    { id: 'CBYT001', name: 'LÊ THỊ MAI', position: 'Y sĩ', email: 'maile@truong.edu.vn', status: 'active', dob: '22/03/1988', gender: 'Nữ', phone: '0905001122', degree: 'Đại học Y Dược Huế' },
    { id: 'CBYT002', name: 'NGUYỄN THỊ LAN', position: 'Y tá', email: 'lann@truong.edu.vn', status: 'active', dob: '15/06/1990', gender: 'Nữ', phone: '0905123456', degree: 'Cao đẳng Y tế' },
    { id: 'CBYT003', name: 'TRẦN VĂN HÙNG', position: 'Bác sĩ', email: 'hungtv@truong.edu.vn', status: 'locked', dob: '02/09/1985', gender: 'Nam', phone: '0905987654', degree: 'Thạc sĩ Y khoa' },
    { id: 'CBYT004', name: 'PHẠM VĂN DŨNG', position: 'Y sĩ', email: 'dungpv@truong.edu.vn', status: 'active', dob: '12/12/1989', gender: 'Nam', phone: '0905111222', degree: 'Trung cấp Y' },
    { id: 'CBYT005', name: 'LÊ THỊ HỒNG', position: 'Y tá', email: 'honglt@truong.edu.vn', status: 'active', dob: '05/05/1992', gender: 'Nữ', phone: '0905333444', degree: 'Cao đẳng Điều dưỡng' },
    { id: 'CBYT006', name: 'NGUYỄN VĂN TÁM', position: 'Bác sĩ', email: 'tamnv@truong.edu.vn', status: 'active', dob: '10/10/1980', gender: 'Nam', phone: '0905666777', degree: 'Bác sĩ Chuyên khoa I' },
];

const medicalPositions = ['Y sĩ', 'Y tá', 'Bác sĩ', 'Dược sĩ', 'Điều dưỡng'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending'); 
  const [adminInfo, setAdminInfo] = useState({ name: 'PHẠM THỊ THANH', role: 'Ban Giám Hiệu' });
  const [avatar, setAvatar] = useState(defaultAvatarImg);

  // --- STATE TAB DUYỆT BÀI ---
  const [posts, setPosts] = useState(mockPendingPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('Tác giả');
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);
  const [viewingPost, setViewingPost] = useState(null);

  // --- STATE TAB HỌC SINH ---
  const [students, setStudents] = useState(initialStudents);
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('Khối');
  const [selectedClass, setSelectedClass] = useState('Lớp');
  const [showGradeDropdown, setShowGradeDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [expandedId, setExpandedId] = useState(null); 
  const [editingId, setEditingId] = useState(null);   
  const [editFormData, setEditFormData] = useState({}); 

  // --- STATE TAB CÁN BỘ ---
  const [staffs, setStaffs] = useState(initialStaffs);
  const [staffSearch, setStaffSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('Vai trò');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [viewingStaff, setViewingStaff] = useState(null); 
  const [isEditingStaff, setIsEditingStaff] = useState(false); 
  const [staffFormData, setStaffFormData] = useState({});

  // --- DROPDOWNS ---
  const authors = ['Tất cả', 'Lê Thị Mai', 'Nguyễn Văn Y Tá', 'Trần Văn Bác Sĩ'];
  const grades = ['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9'];
  const classes = ['6A1', '6A2', '7A1', '7A2', '8A1', '9A1'];
  const roles = ['Tất cả', ...medicalPositions];
  
  const authorRef = useRef(null);
  const gradeRef = useRef(null);
  const classRef = useRef(null);
  const roleRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
        if (authorRef.current && !authorRef.current.contains(event.target)) setShowAuthorDropdown(false);
        if (gradeRef.current && !gradeRef.current.contains(event.target)) setShowGradeDropdown(false);
        if (classRef.current && !classRef.current.contains(event.target)) setShowClassDropdown(false);
        if (roleRef.current && !roleRef.current.contains(event.target)) setShowRoleDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LOGIC DUYỆT BÀI ---
  const handleApprove = (post) => {
      const newPosts = posts.filter(p => p.id !== post.id);
      setPosts(newPosts);
      setViewingPost(null);
      alert(`Đã DUYỆT bài viết: "${post.title}".`);
  };
  const handleReject = (post) => {
      const reason = prompt("Nhập lý do từ chối:");
      if (reason) {
          const newPosts = posts.filter(p => p.id !== post.id);
          setPosts(newPosts);
          setViewingPost(null);
          alert(`Đã TỪ CHỐI bài viết.`);
      }
  };

  // --- LOGIC HỌC SINH ---
  const toggleExpand = (id) => { if (expandedId === id) { setExpandedId(null); } else { setExpandedId(id); setEditingId(null); } };
  const handleEditClick = (student) => { setEditingId(student.id); setEditFormData(student); setExpandedId(null); };
  const handleEditFormChange = (e) => { setEditFormData({ ...editFormData, [e.target.name]: e.target.value }); };
  const handleSaveClick = () => {
      const newStudents = students.map((s) => (s.id === editingId ? editFormData : s));
      setStudents(newStudents);
      setEditingId(null);
      alert("Đã cập nhật thông tin học sinh!");
  };
  const handleCancelClick = () => { setEditingId(null); };
  const handleAddStudent = () => { alert("Chức năng Thêm hồ sơ đang phát triển!"); };
  const handleExportExcel = () => { alert("Đang xuất dữ liệu ra file Excel..."); };

  // --- LOGIC CÁN BỘ ---
  const handleToggleLock = (staffId) => {
      const newStaffs = staffs.map(staff => {
          if (staff.id === staffId) {
              const newStatus = staff.status === 'active' ? 'locked' : 'active';
              return { ...staff, status: newStatus };
          }
          return staff;
      });
      setStaffs(newStaffs);
  };
  const handleOpenStaffModal = (staff, mode = 'view') => {
      setViewingStaff(staff);
      setStaffFormData(staff);
      setIsEditingStaff(mode === 'edit');
  };
  const handleStaffFormChange = (e) => { setStaffFormData({ ...staffFormData, [e.target.name]: e.target.value }); };
  const handleSaveStaff = () => {
      const newStaffs = staffs.map(s => s.id === viewingStaff.id ? staffFormData : s);
      setStaffs(newStaffs);
      setIsEditingStaff(false); 
      alert(`Đã cập nhật thông tin cán bộ ${staffFormData.name}`);
  };
  const handleAddStaff = () => { alert("Chức năng thêm cán bộ đang phát triển"); };

  // --- RENDER TAB 1: DUYỆT BÀI ---
  const renderPendingPosts = () => (
      <div className="dashboard-body admin-pending-layout">
          <h2 className="section-title-blue">BÀI VIẾT CHỜ DUYỆT</h2>
          <div className="toolbar-container">
              <div className="search-box-large">
                  <input type="text" placeholder="Tìm bài viết..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="filter-group">
                  <div className="dropdown-custom" ref={authorRef} onClick={() => setShowAuthorDropdown(!showAuthorDropdown)}>
                      <span>{selectedAuthor}</span> <span className="arrow">▼</span>
                      {showAuthorDropdown && (<div className="dropdown-list">{authors.map((auth, idx) => (<div key={idx} className="dropdown-option" onClick={() => setSelectedAuthor(auth)}>{auth}</div>))}</div>)}
                  </div>
              </div>
          </div>
          <div className="post-list-container">
              <div className="post-list-header">
                  <div className="col-title">TIÊU ĐỀ</div><div className="col-author">TÁC GIẢ</div><div className="col-date">NGÀY GỬI</div><div className="col-action">HÀNH ĐỘNG</div>
              </div>
              <div className="post-list-body">
                  {posts.filter(p => (selectedAuthor === 'Tác giả' || selectedAuthor === 'Tất cả' || p.author === selectedAuthor) && p.title.toLowerCase().includes(searchTerm.toLowerCase())).map(post => (
                      <div key={post.id} className="post-item">
                          <div className="col-title font-bold">{post.title}</div>
                          <div className="col-author font-bold">{post.author}</div>
                          <div className="col-date font-bold">{post.date}</div>
                          <div className="col-action actions-column">
                              <button className="btn-action-small view" onClick={() => setViewingPost(post)}>Xem</button>
                              <button className="btn-action-small approve" onClick={() => handleApprove(post)}>Duyệt</button>
                              <button className="btn-action-small reject" onClick={() => handleReject(post)}>Từ chối</button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
          {viewingPost && (
              <div className="modal-overlay" onClick={() => setViewingPost(null)}>
                  <div className="modal-content post-detail-modal" onClick={(e) => e.stopPropagation()}>
                      <span className="close-modal" onClick={() => setViewingPost(null)}>&times;</span>
                      <div className="post-detail-header"><h2>{viewingPost.title}</h2></div>
                      <div className="post-detail-body"><div className="post-content-html" dangerouslySetInnerHTML={{ __html: viewingPost.content }}></div></div>
                      <div className="post-detail-footer">
                          <button className="btn-modal-action reject" onClick={() => handleReject(viewingPost)}>TỪ CHỐI</button>
                          <button className="btn-modal-action approve" onClick={() => handleApprove(viewingPost)}>DUYỆT BÀI</button>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );

  // --- RENDER TAB 2: HỌC SINH ---
  const renderStudentManagement = () => (
      <div className="dashboard-body student-manage-layout">
          <h2 className="section-title-blue">QUẢN LÍ THÔNG TIN HỌC SINH</h2>
          
          <div className="toolbar-container">
              <div className="search-box-large">
                  <input type="text" placeholder="Tìm kiếm theo tên, lớp, ..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} />
              </div>
              <div className="filter-group">
                  <div className="dropdown-custom" ref={gradeRef} onClick={() => setShowGradeDropdown(!showGradeDropdown)}>
                      <span>{selectedGrade}</span> <span className="arrow">▼</span>
                      {showGradeDropdown && (<div className="dropdown-list"><div className="dropdown-option" onClick={() => setSelectedGrade('Tất cả')}>Tất cả</div>{grades.map((gr, idx) => (<div key={idx} className="dropdown-option" onClick={() => setSelectedGrade(gr)}>{gr}</div>))}</div>)}
                  </div>
                  <div className="dropdown-custom" ref={classRef} onClick={() => setShowClassDropdown(!showClassDropdown)}>
                      <span>{selectedClass}</span> <span className="arrow">▼</span>
                      {showClassDropdown && (<div className="dropdown-list"><div className="dropdown-option" onClick={() => setSelectedClass('Tất cả')}>Tất cả</div>{classes.map((cls, idx) => (<div key={idx} className="dropdown-option" onClick={() => setSelectedClass(cls)}>{cls}</div>))}</div>)}
                  </div>
              </div>
          </div>

          <div className="big-actions-container">
              <button className="btn-big-action btn-add" onClick={handleAddStudent}>Thêm hồ sơ</button>
              <button className="btn-big-action btn-export" onClick={handleExportExcel}>Xuất Excel</button>
          </div>

          <div className="table-wrapper scrollable-table">
              <table className="student-table">
                  <thead><tr><th>MÃ HS</th><th>HỌ TÊN</th><th>LỚP</th><th>NGÀY SINH</th><th>TÌNH TRẠNG</th><th>HÀNH ĐỘNG</th></tr></thead>
                  <tbody>
                      {students.map((student) => (
                          <React.Fragment key={student.id}>
                              <tr key={student.id}>
                                  <td>{student.id}</td>
                                  <td className="text-left">{editingId === student.id ? <input type="text" name="name" value={editFormData.name} onChange={handleEditFormChange} className="table-input" /> : student.name}</td>
                                  <td>{student.class}</td>
                                  <td>{student.dob}</td>
                                  <td className="status-cell">{student.status}</td>
                                  <td className="actions-cell">
                                      {editingId === student.id ? (
                                          <><span className="icon-btn save" onClick={handleSaveClick}>💾</span><span className="icon-btn cancel" onClick={handleCancelClick}>❌</span></>
                                      ) : (
                                          <><span className="icon-btn view" onClick={() => toggleExpand(student.id)}>👁️</span><span className="icon-btn edit" onClick={() => handleEditClick(student)}>✏️</span><span className="icon-btn print">🖨️</span></>
                                      )}
                                  </td>
                              </tr>
                              {expandedId === student.id && (<tr className="detail-row"><td colSpan="6"><div className="detail-content">Chi tiết thông tin...</div></td></tr>)}
                          </React.Fragment>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  );

  // --- RENDER TAB 3: CÁN BỘ ---
  const renderStaffManagement = () => (
      <div className="dashboard-body staff-manage-layout">
          <h2 className="section-title-blue">QUẢN LÍ THÔNG TIN CÁN BỘ</h2>
          
          <div className="toolbar-container">
              <div className="search-box-large">
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm theo tên, email, ..." 
                    value={staffSearch}
                    onChange={(e) => setStaffSearch(e.target.value)}
                  />
              </div>
              <div className="filter-group">
                  <div className="dropdown-custom" ref={roleRef} onClick={() => setShowRoleDropdown(!showRoleDropdown)}>
                      <span>{selectedRole}</span> <span className="arrow">▼</span>
                      {showRoleDropdown && (
                          <div className="dropdown-list">
                              <div className="dropdown-option" onClick={() => setSelectedRole('Tất cả')}>Tất cả</div>
                              {roles.map((r, idx) => (<div key={idx} className="dropdown-option" onClick={() => setSelectedRole(r)}>{r}</div>))}
                          </div>
                      )}
                  </div>
              </div>
          </div>

          <div className="big-actions-container">
              <button className="btn-big-action btn-add-staff" onClick={handleAddStaff}>Thêm cán bộ</button>
          </div>

          {/* BẢNG CÓ SCROLL */}
          <div className="table-wrapper scrollable-table">
              <table className="student-table"> 
                  <thead>
                      <tr>
                          <th>MÃ CÁN BỘ</th>
                          <th>HỌ TÊN</th>
                          <th>CHỨC VỤ</th>
                          <th>EMAIL</th>
                          <th>TRẠNG THÁI</th>
                          <th>HÀNH ĐỘNG</th>
                      </tr>
                  </thead>
                  <tbody>
                      {staffs.filter(s => 
                          (selectedRole === 'Vai trò' || selectedRole === 'Tất cả' || s.position === selectedRole) &&
                          (s.name.toLowerCase().includes(staffSearch.toLowerCase()) || s.email.toLowerCase().includes(staffSearch.toLowerCase()))
                      ).map((staff) => (
                          <tr key={staff.id}>
                              <td><strong>{staff.id}</strong></td>
                              <td className="text-left font-bold">{staff.name}</td>
                              <td>{staff.position}</td>
                              <td>{staff.email}</td>
                              <td>
                                  <span className={`status-badge ${staff.status}`}>
                                      {staff.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                                  </span>
                              </td>
                              <td className="actions-cell">
                                  <span className="icon-btn view" title="Xem chi tiết" onClick={() => handleOpenStaffModal(staff, 'view')}>👁️</span>
                                  <span className="icon-btn edit" title="Chỉnh sửa" onClick={() => handleOpenStaffModal(staff, 'edit')}>✏️</span>
                                  {/* ICON KHÓA */}
                                  <span 
                                    className={`icon-btn ${staff.status === 'active' ? 'lock' : 'unlock'}`} 
                                    title={staff.status === 'active' ? "Bấm để Khóa" : "Bấm để Mở khóa"}
                                    onClick={() => handleToggleLock(staff.id)}
                                  >
                                      {staff.status === 'active' ? '🔓' : '🔒'}
                                  </span>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>

          {/* MODAL XEM/SỬA CÁN BỘ */}
          {viewingStaff && (
              <div className="modal-overlay" onClick={() => setViewingStaff(null)}>
                  <div className="modal-content staff-modal" onClick={(e) => e.stopPropagation()}>
                      <span className="close-modal" onClick={() => setViewingStaff(null)}>&times;</span>
                      <h2 className="modal-title">{isEditingStaff ? "CHỈNH SỬA THÔNG TIN" : "THÔNG TIN CÁN BỘ"}</h2>
                      
                      <div className="modal-form-grid">
                          <div className="form-group">
                              <label>Họ và Tên</label>
                              <input type="text" name="name" value={staffFormData.name} onChange={handleStaffFormChange} disabled={!isEditingStaff} className="modal-input" />
                          </div>
                          <div className="form-group">
                              <label>Mã Cán bộ</label>
                              <input type="text" value={staffFormData.id} disabled className="modal-input disabled" />
                          </div>
                          <div className="form-group">
                              <label>Chức vụ</label>
                              {isEditingStaff ? (
                                  <select name="position" value={staffFormData.position} onChange={handleStaffFormChange} className="modal-input">
                                      {medicalPositions.map((pos, idx) => (
                                          <option key={idx} value={pos}>{pos}</option>
                                      ))}
                                  </select>
                              ) : (
                                  <input type="text" value={staffFormData.position} disabled className="modal-input" />
                              )}
                          </div>
                          <div className="form-group">
                              <label>Email</label>
                              <input type="text" name="email" value={staffFormData.email} onChange={handleStaffFormChange} disabled={!isEditingStaff} className="modal-input" />
                          </div>
                          <div className="form-group">
                              <label>Bằng cấp</label>
                              <input type="text" name="degree" value={staffFormData.degree} onChange={handleStaffFormChange} disabled={!isEditingStaff} className="modal-input" />
                          </div>
                          <div className="form-group">
                              <label>Số điện thoại</label>
                              <input type="text" name="phone" value={staffFormData.phone} onChange={handleStaffFormChange} disabled={!isEditingStaff} className="modal-input" />
                          </div>
                      </div>

                      <div className="modal-footer">
                          {isEditingStaff ? (
                              <button className="btn-modal-action approve" onClick={handleSaveStaff}>LƯU</button>
                          ) : (
                              <button className="btn-modal-action view" onClick={() => setIsEditingStaff(true)}>CHỈNH SỬA</button>
                          )}
                          <button className="btn-modal-action reject" onClick={() => setViewingStaff(null)}>ĐÓNG</button>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        {/* CLICK VÀO LOGO QUAY VỀ TRANG CHỦ */}
        <div className="sidebar-logo" style={{cursor: 'pointer'}} onClick={() => navigate('/')}>EduCare</div>
        
        <div className={`menu-item ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>Chờ duyệt</div>
        <div className={`menu-item ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>Thông tin học sinh</div>
        <div className={`menu-item ${activeTab === 'staff' ? 'active' : ''}`} onClick={() => setActiveTab('staff')}>Thông tin cán bộ</div>
      </div>
      <div className="main-content">
        <div className="dashboard-header">
           <div className="user-profile-mini">
              <span>{adminInfo.name}</span>
              <img src={avatar} alt="mini-avatar" className="mini-avatar" />
           </div>
        </div>
        {activeTab === 'pending' && renderPendingPosts()}
        {activeTab === 'students' && renderStudentManagement()}
        {activeTab === 'staff' && renderStaffManagement()}
      </div>
    </div>
  );
};

export default AdminDashboard;