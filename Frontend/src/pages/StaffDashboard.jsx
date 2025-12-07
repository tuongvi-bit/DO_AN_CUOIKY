import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StaffDashboard.css';
import defaultAvatarImg from '../assets/avatar-staff.jpg';


const API_BASE_URL = 'http://localhost:4000/api';


// Hàm chuyển đổi định dạng ngày (cho Ngày sinh)
const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return isoString;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    } catch (e) {
        return isoString;
    }
};


// --- DỮ LIỆU MẪU (MOCK DATA) ---
const mockPendingPosts = [
    { id: 1, title: "Cảnh báo: Phát hiện ca bệnh Tay Chân Miệng", author: "Lê Thị Mai", date: "12/11/2025", status: "pending", content: "...", image: "...", schedule: "now" },
    { id: 2, title: "Hướng dẫn sơ cứu khi bị bỏng", author: "Lê Thị Mai", date: "11/11/2025", status: "pending", content: "...", image: "...", schedule: "15/11/2025 08:00" },
    { id: 3, title: "Thực đơn dinh dưỡng tháng 11", author: "Nguyễn Văn Y Tá", date: "10/11/2025", status: "pending", content: "Chi tiết thực đơn...", image: "...", schedule: "now" }
];


const initialStudents = [
    { id: 'HS001', name: 'Nguyễn Văn An', class: '6A1', dob: '10/05/2013', status: 'Bình thường', gender: 'Nam', parent: 'Nguyễn Văn Ba', phone: '0901111001', address: 'Phú Gia' },
    { id: 'HS002', name: 'Lê Thị Bích', class: '7A2', dob: '22/08/2012', status: 'Cận thị nhẹ', gender: 'Nữ', parent: 'Lê Văn C', phone: '0902222002', address: 'Tân Lập' },
    { id: 'HS003', name: 'Trần Hoàng Cường', class: '8A1', dob: '01/02/2011', status: 'Thừa cân', gender: 'Nam', parent: 'Trần Thị D', phone: '0903333003', address: 'Hòa An' },
    { id: 'HS004', name: 'Phạm Thu Dung', class: '6A1', dob: '15/11/2013', status: 'Bình thường', gender: 'Nữ', parent: 'Phạm Văn E', phone: '0904444004', address: 'Bình Minh' },
    { id: 'HS005', name: 'Hoàng Văn Em', class: '9A3', dob: '05/05/2010', status: 'Sâu răng', gender: 'Nam', parent: 'Hoàng Thị F', phone: '0905555005', address: 'Hương Sơn' },
    { id: 'HS006', name: 'Lý Văn F', class: '6A2', dob: '12/12/2013', status: 'Bình thường', gender: 'Nam', parent: 'Lý Văn G', phone: '0906666006', address: 'Phú Gia' },
    { id: 'HS007', name: 'Trần Thị G', class: '9A1', dob: '01/01/2010', status: 'Bình thường', gender: 'Nữ', parent: 'Trần Văn H', phone: '0907777007', address: 'Tân Lập' },
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

// Dữ liệu mẫu cho Create Post
const mockTemplates = [
    { id: 1, title: "Sơ cứu bỏng", src: "https://benhvienhuulung.vn/images/upload/S%C6%A1%20c%E1%BB%A9u%20b%E1%BB%8Fng.png" },
    { id: 2, title: "Rửa tay đúng cách", src: "https://vinmec-prod.s3.amazonaws.com/images/20190322_111259_170239_Quy-Trinh-Rua-Tay-1.max-1800x1800.png" },
    { id: 3, title: "Dinh dưỡng", src: "https://monngonvn.vn/wp-content/uploads/2020/05/th%C3%A1p-dinh-d%C6%B0%E1%BB%A1ng.png" },
];


const medicalPositions = ['Y sĩ', 'Y tá', 'Bác sĩ', 'Dược sĩ', 'Điều dưỡng'];
const grades = ['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9'];
const allClasses = ['6A1', '6A2', '6A3', '6A4', '7A1', '7A2', '7A3', '8A1', '8A2', '8A3', '9A1', '9A2', '9A3'];


const StaffDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    
    // Lấy thông tin từ localStorage
    const token = localStorage.getItem('userToken');
    const storedUsername = localStorage.getItem('username') || 'Cán bộ';
    const storedRole = localStorage.getItem('userRole') || 'Staff';


    // --- STATE CHO PROFILE CÁN BỘ Y TẾ THỰC TẾ ---
    const [staffProfile, setStaffProfile] = useState({
        name: storedUsername,
        role: storedRole,
        dob: '',
        gender: '',
        phone: '',
        email: '',
        position: '',
        degree: ''
    });
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState('');
    const [avatar, setAvatar] = useState(defaultAvatarImg);
    const [isEditing, setIsEditing] = useState(false);
    
    // --- STATE QUẢN LÝ HỌC SINH (Dùng dữ liệu thực tế) ---
    const [students, setStudents] = useState([]); // <-- State chứa data học sinh từ API
    const [posts, setPosts] = useState(mockPendingPosts);
    const [staffs, setStaffs] = useState(initialStudents); // Dữ liệu cán bộ khác (mock)
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAuthor, setSelectedAuthor] = useState('Tác giả');
    const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);
    const [viewingPost, setViewingPost] = useState(null);
    const [studentSearch, setStudentSearch] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('Khối');
    const [selectedClass, setSelectedClass] = useState('Lớp');
    const [showGradeDropdown, setShowGradeDropdown] = useState(false);
    const [showClassDropdown, setShowClassDropdown] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const [editingId, setEditingId] = useState(null);  
    const [editFormData, setEditFormData] = useState({});
    const [staffSearch, setSearchStaff] = useState('');
    const [selectedRole, setSelectedRole] = useState('Vai trò');
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);
    const [viewingStaff, setViewingStaff] = useState(null);
    const [isEditingStaff, setIsEditingStaff] = useState(false);
    const [staffFormData, setStaffFormData] = useState({});
    
    // --- STATE CHO LỊCH ---
    const [currentMonth, setCurrentMonth] = useState(11);
    const [currentYear, setCurrentYear] = useState(2025);
    const [calendarEvents, setCalendarEvents] = useState(initialCalendarEvents);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);

    // --- STATE CHO CREATE POST ---
    const [postMediaTab, setPostMediaTab] = useState('template');
    const [selectedTemplate, setSelectedTemplate] = useState(mockTemplates[0].id); // Chọn template đầu tiên làm mặc định
    const [postContent, setPostContent] = useState({
        title: '',
        content: '', // Nội dung từ editor
        seoTitle: '',
        metaDesc: '',
        scheduleOption: 'now',
        scheduleDate: ''
    });


    // --- REFS ---
    const editorRef = useRef(null);
    const authorRef = useRef(null);
    const gradeRef = useRef(null);
    const classRef = useRef(null);
    const roleRef = useRef(null);
    const monthPickerRef = useRef(null);
    const yearPickerRef = useRef(null);




    // --- HÀM LOGOUT TẬP TRUNG ---
    const handleLogout = () => {
        localStorage.clear();
        navigate('/'); // Chuyển về trang đăng nhập
    };


    // --- HÀM TẢI DANH SÁCH HỌC SINH ---
    const fetchStudentsData = async (token) => {
        try {
            // API để lấy danh sách học sinh
            const studentsResponse = await axios.get(`${API_BASE_URL}/y_te/students/list`, { headers: { Authorization: `Bearer ${token}` } });
            
            const formattedStudents = studentsResponse.data.map(s => ({
                id: s.MaHS,
                name: s.HoTen,
                class: s.Lop,
                dob: formatDate(s.NgaySinh),
                status: s.TrangThaiSK || 'Bình thường',
                gender: s.GioiTinh,
                parent: 'Phụ huynh',
                phone: s.SoDienThoaiPH,
                address: s.DiaChi
            }));
            
            setStudents(formattedStudents);
            
        } catch (err) {
            console.error("Lỗi tải danh sách học sinh:", err);
            setApiError("Không thể tải danh sách học sinh.");
        }
    };


    // --- HÀM TẢI HỒ SƠ CÁN BỘ Y TẾ ---
    const fetchStaffProfile = async () => {
        const token = localStorage.getItem('userToken');
        const role = localStorage.getItem('userRole');


        // 1. KIỂM TRA TOKEN & QUYỀN
        if (!token || (role !== 'Admin' && role !== 'BanGiamHieu' && role !== 'CanBoYTe')) {
            handleLogout();
            return;
        }


        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            // 2. GỌI API LẤY HỒ SƠ CÁ NHÂN CÁN BỘ Y TẾ
            const profileResponse = await axios.get(`${API_BASE_URL}/y_te/profile`, config);
            const data = profileResponse.data.profile;


            // 3. CẬP NHẬT STATE VỚI DỮ LIỆU THỰC TẾ
            setStaffProfile({
                name: data.HoTen || storedUsername,
                role: storedRole,
                dob: formatDate(data.NgaySinh) || '',
                gender: data.GioiTinh || '',
                phone: data.SoDienThoai || '',
                email: data.Email || '',
                position: data.ChucVu || 'Y sĩ',
                degree: data.TrinhDo || ''
            });
            
            // 4. TẢI DỮ LIỆU HỌC SINH CHO TAB QUẢN LÝ
            await fetchStudentsData(token);
            
            setLoading(false);


        } catch (err) {
            setLoading(false);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                 alert("Phiên làm việc hết hạn hoặc không có quyền truy cập.");
                 handleLogout();
            } else if (err.response && err.response.status === 404) {
                 setApiError("Hồ sơ cán bộ chưa được liên kết.");
            }
             else {
                 setApiError("Lỗi server không xác định khi tải hồ sơ.");
                 console.error("Lỗi tải dữ liệu Staff:", err);
            }
        }
    };


    useEffect(() => {
        fetchStaffProfile();
    }, [token]);




    // --- Các logic không liên quan đến API giữ nguyên ---
    const availableClasses = (selectedGrade === 'Khối' || selectedGrade === 'Tất cả')
        ? allClasses
        : allClasses.filter(cls => cls.startsWith(selectedGrade.replace('Khối ', '')));


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (authorRef.current && !authorRef.current.contains(event.target)) setShowAuthorDropdown(false);
            if (gradeRef.current && !gradeRef.current.contains(event.target)) setShowGradeDropdown(false);
            if (classRef.current && !classRef.current.contains(event.target)) setShowClassDropdown(false);
            if (roleRef.current && !roleRef.current.contains(event.target)) setShowRoleDropdown(false);
            if (monthPickerRef.current && !monthPickerRef.current.contains(event.target)) setShowMonthPicker(false);
            if (yearPickerRef.current && !yearPickerRef.current.contains(event.target)) setShowYearPicker(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);




    // --- LOGIC CHỨC NĂNG CHUNG ---
    const handleImageChange = (e) => { const file = e.target.files[0]; if (file) setAvatar(URL.createObjectURL(file)); };
    const handleInfoChange = (e) => { setStaffProfile({ ...staffProfile, [e.target.name]: e.target.value }); };
    const handleUpdateClick = () => { if (isEditing) { alert("Đã lưu thông tin cán bộ!"); setIsEditing(false); } else { setIsEditing(true); } };
    const handleApprove = (post) => { const newPosts = posts.filter(p => p.id !== post.id); setPosts(newPosts); setViewingPost(null); alert(`Đã DUYỆT bài viết: "${post.title}".`); };
    const handleReject = (post) => { const reason = prompt("Nhập lý do từ chối:"); if (reason) { const newPosts = posts.filter(p => p.id !== post.id); setPosts(newPosts); setViewingPost(null); alert(`Đã TỪ CHỐI bài viết.`); } };
    const toggleExpand = (id) => { if (expandedId === id) { setExpandedId(null); } else { setExpandedId(id); setEditingId(null); } };
    const handleEditClick = (student) => { setEditingId(student.id); setEditFormData(student); setExpandedId(null); };
    const handleEditFormChange = (e) => { setEditFormData({ ...editFormData, [e.target.name]: e.target.value }); };
    const handleSaveClick = () => { const newStudents = students.map((s) => (s.id === editingId ? editFormData : s)); setStudents(newStudents); setEditingId(null); alert("Đã cập nhật thông tin học sinh!"); };
    const handleCancelClick = () => { setEditingId(null); };
    const handleAddStudent = () => { alert("Chức năng Thêm hồ sơ đang phát triển!"); };
    const handleExportExcel = () => { alert("Đang xuất dữ liệu ra file Excel..."); };
    const handleToggleLock = (staffId) => { const newStaffs = staffs.map(staff => { if (staff.id === staffId) { const newStatus = staff.status === 'active' ? 'locked' : 'active'; return { ...staff, status: newStatus }; } return staff; }); setStaffs(newStaffs); };
    const handleOpenStaffModal = (staff, mode = 'view') => { setViewingStaff(staff); setStaffFormData(staff); setIsEditingStaff(mode === 'edit'); };
    const handleStaffFormChange = (e) => { setStaffFormData({ ...staffFormData, [e.target.name]: e.target.value }); };
    const handleSaveStaff = () => { const newStaffs = staffs.map(s => s.id === viewingStaff.id ? staffFormData : s); setStaffs(newStaffs); setIsEditingStaff(false); alert(`Đã cập nhật thông tin cán bộ ${staffFormData.name}`); };
    const handleAddStaff = () => { alert("Chức năng thêm cán bộ đang phát triển"); };
    
    // --- LOGIC CHO CREATE POST ---
const handlePostChange = (e) => {
        const { name, value } = e.target;
        setPostContent(prev => ({ ...prev, [name]: value }));
    };

    const handleEditorCommand = (command, value = null) => {
        if (editorRef.current) {
            document.execCommand(command, false, value);
            // Bắt buộc phải focus lại để người dùng tiếp tục gõ
            editorRef.current.focus(); 
            // Cập nhật state sau khi command được thực thi
            setPostContent(prev => ({ 
                ...prev, 
                content: editorRef.current.innerHTML 
            }));
        }
    };

    const handleEditorInput = () => {
        // Cập nhật state nội dung khi người dùng gõ
        setPostContent(prev => ({ 
            ...prev, 
            content: editorRef.current.innerHTML 
        }));
    };
    // ... (các khai báo state và hàm khác giữ nguyên)

const handlePostSubmit = async (action) => {
        // 1. Kiểm tra validation cơ bản
        if (!postContent.title || !postContent.content) {
            alert("Tiêu đề và Nội dung bài viết không được để trống!");
            return;
        }

        const token = localStorage.getItem('userToken');
        if (!token) {
            alert("Lỗi: Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
            // Giả định handleLogout sẽ được gọi để xử lý
            return; 
        }

    // 2. Định nghĩa trạng thái bài viết và API URL
        const postStatus = action === 'draft' ? 'draft' : 'pending';
        const apiUrl = `${API_BASE_URL}/posts/submit`;

    // 3. Chuẩn bị dữ liệu gửi đi (Payload)
        const selectedTemplateSrc = mockTemplates.find(t => t.id === selectedTemplate)?.src;
        const dataToSend = {
            title: postContent.title,
            content: postContent.content,
            // Giả định API Backend có thể lấy thông tin tác giả từ token
            // authorId: localStorage.getItem('userId'), 
            image: postMediaTab === 'template' ? selectedTemplateSrc : null,
            
            status: postStatus, // 'draft' hoặc 'pending'
            scheduleOption: postContent.scheduleOption,
            scheduleDate: postContent.scheduleOption === 'schedule' ? postContent.scheduleDate : null,
            
            // Thông tin SEO
            seoTitle: postContent.seoTitle,
            metaDesc: postContent.metaDesc,
        };

    // 4. Xử lý hành động gửi
        if (action === 'draft') {
            alert("Đã lưu bài viết dưới dạng Bản nháp (chưa gửi lên server).");
            // Trong thực tế, bạn sẽ cần thêm logic lưu nháp local hoặc server ở đây.
            console.log("Dữ liệu nháp:", dataToSend);
            return;
        }

        // Hành động 'publish' (GỬI PHÊ DUYỆT)
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            console.log("Đang gửi bài viết:", dataToSend);
            
            // **Bổ sung: Lỗi 404/Not Found là phổ biến nếu API endpoint sai.**
            // Đảm bảo API /posts/submit hoạt động với phương thức POST.
            const response = await axios.post(apiUrl, dataToSend, config);

        // 5. Xử lý thành công
            alert(`✅ Gửi bài viết thành công! Bài viết "${postContent.title}" đã được gửi chờ Ban Giám hiệu phê duyệt. (API Response: ${response.status})`);

            // Reset form sau khi gửi
            setPostContent({
                title: '',
                content: '',
                seoTitle: '',
                metaDesc: '',
                scheduleOption: 'now',
                scheduleDate: ''
            });
            if (editorRef.current) editorRef.current.innerHTML = '';
            setSelectedTemplate(mockTemplates[0].id);
            
            // Chuyển tab để người dùng có thể xem lịch/lịch sử
            setActiveTab('calendar'); 

        } catch (error) {
            console.error("Lỗi khi gửi bài viết:", error);
            let errorMessage = "LỖI: Không thể gửi bài viết. Vui lòng kiểm tra server hoặc API endpoint.";
            
            if (error.response) {
                // Log chi tiết response lỗi từ server để dễ debug
                console.error("Server Error Response:", error.response.data);
                errorMessage += ` Chi tiết: ${error.response.data.message || 'Lỗi không xác định từ server.'} (Status: ${error.response.status})`;
            } else if (error.request) {
                errorMessage = "LỖI: Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng hoặc API server.";
            }
            
            alert(errorMessage);
        }
    };


    // --- RENDER COMPONENT CON ---
    const InfoRow = ({ label, name, value, editable = true }) => (
        <div className="info-row">
            <span className="info-label">{label}:</span>
            {isEditing && editable ? <input type="text" name={name} value={value} onChange={handleInfoChange} className="edit-input" /> : <span>{value}</span>}
        </div>
    );
    
    const renderProfile = () => (
        <div className="dashboard-body profile-layout">
            {apiError && <div style={{ color: 'red', textAlign: 'center', padding: '10px' }}>{apiError}</div>}
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
                        <InfoRow label="Họ và tên" name="name" value={staffProfile.name} />
                        <InfoRow label="Ngày sinh" name="dob" value={staffProfile.dob} />
                        <InfoRow label="Giới tính" name="gender" value={staffProfile.gender} />
                    </div>
                    <div className="info-group">
                        <div className="info-heading">THÔNG TIN LIÊN HỆ <span className="icon-edit" title="Sửa">✏️</span></div>
                        <InfoRow label="Số điện thoại" name="phone" value={staffProfile.phone} />
                        <InfoRow label="Email" name="email" value={staffProfile.email} />
                    </div>
                    <div className="info-group">
                        <div className="info-heading">THÔNG TIN CHUYÊN MÔN <span className="icon-view" title="Xem">👁️</span></div>
                        <InfoRow label="Chức vụ" name="position" value={staffProfile.position} editable={false} />
                        <InfoRow label="Bằng cấp" name="degree" value={staffProfile.degree} editable={false} />
                    </div>
                </div>
                <div className="action-buttons-side">
                    <button className="btn-action" onClick={handleUpdateClick}>{isEditing ? "Lưu thông tin" : "Cập nhật thông tin"}</button>
                    <button className="btn-action" onClick={() => navigate('/forgot-password')}>Đổi mật khẩu</button>
                    <button className="btn-action logout" onClick={handleLogout}>Đăng xuất</button>
                </div>
            </div>
        </div>
    );


    const renderPendingPosts = () => (
        <div className="dashboard-body admin-pending-layout">
            <h2 className="section-title-blue">BÀI VIẾT CHỜ DUYỆT (Đã ẩn)</h2>
            <p>Tab này đã bị ẩn theo yêu cầu của bạn.</p>
        </div>
    );


    const renderStudentManagement = () => {
        const filteredStudents = students.filter(student => { // SỬ DỤNG DỮ LIỆU TỪ STATE 'students'
            const matchName = student.name.toLowerCase().includes(studentSearch.toLowerCase()) || student.class.toLowerCase().includes(studentSearch.toLowerCase());
            const matchGrade = (selectedGrade === 'Khối' || selectedGrade === 'Tất cả') ? true : student.class.startsWith(selectedGrade.replace('Khối ', ''));
            const matchClass = (selectedClass === 'Lớp' || selectedClass === 'Tất cả') ? true : student.class === selectedClass;
            return matchName && matchGrade && matchClass;
        });


        return (
            <div className="dashboard-body student-manage-layout">
                <h2 className="section-title-blue">QUẢN LÍ THÔNG TIN HỌC SINH</h2>
                {apiError && <div style={{ color: 'red', textAlign: 'center', padding: '10px' }}>{apiError}</div>}
                
                <div className="toolbar-container">
                    <div className="search-box-large"><input type="text" placeholder="Tìm kiếm theo tên, lớp, ..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} /></div>
                    <div className="filter-group">
                        <div className="dropdown-custom" ref={gradeRef} onClick={() => setShowGradeDropdown(!showGradeDropdown)}>
                            <span>{selectedGrade}</span> <span className="arrow">▼</span>
                            {showGradeDropdown && (<div className="dropdown-list"><div className="dropdown-option" onClick={() => { setSelectedGrade('Tất cả'); setSelectedClass('Tất cả'); }}>Tất cả</div>{grades.map((gr, idx) => (<div key={idx} className="dropdown-option" onClick={() => { setSelectedGrade(gr); setSelectedClass('Tất cả'); }}>{gr}</div>))}</div>)}
                        </div>
                        <div className="dropdown-custom" ref={classRef} onClick={() => setShowClassDropdown(!showClassDropdown)}>
                            <span>{selectedClass}</span> <span className="arrow">▼</span>
                            {showClassDropdown && (<div className="dropdown-list"><div className="dropdown-option" onClick={() => setSelectedClass('Tất cả')}>Tất cả</div>{availableClasses.map((cls, idx) => (<div key={idx} className="dropdown-option" onClick={() => setSelectedClass(cls)}>{cls}</div>))}</div>)}
                        </div>
                    </div>
                </div>
                
        
                <div className="table-wrapper scrollable-table">
                    <table className="student-table">
                        <thead><tr><th>MÃ HS</th><th>HỌ TÊN</th><th>LỚP</th><th>NGÀY SINH</th><th>TÌNH TRẠNG</th><th>HÀNH ĐỘNG</th></tr></thead>
                        <tbody>
                            {/* Dùng students từ API */}
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <React.Fragment key={student.id}>
                                        <tr key={student.id}>
                                            <td><strong>{student.id}</strong></td>
                                            <td className="text-left"><span className="font-bold">{student.name}</span></td>
                                            <td><strong>{student.class}</strong></td>
                                            <td><strong>{student.dob}</strong></td>
                                            <td><span className="status-cell">{student.status}</span></td>
                                            <td className="actions-cell">
                                                <span className="icon-btn view" onClick={() => toggleExpand(student.id)}>{expandedId === student.id ? '🙈' : '👁️'}</span>
                                                <span className="icon-btn edit" onClick={() => handleEditClick(student)}>✏️</span>
                                                <span className="icon-btn print" onClick={() => alert("Đang in hồ sơ...")}>🖨️</span>
                                            </td>
                                        </tr>
                                        {expandedId === student.id && (<tr className="detail-row"><td colSpan="6"><div className="detail-content"><div className="detail-grid"><div className="detail-item"><strong>Giới tính:</strong> {student.gender}</div><div className="detail-item"><strong>Phụ huynh:</strong> {student.parent}</div><div className="detail-item"><strong>SĐT LH:</strong> {student.phone}</div><div className="detail-item"><strong>Địa chỉ:</strong> {student.address}</div><div className="detail-item full-width"><strong>Ghi chú sức khỏe:</strong> Tiền sử bệnh lý bình thường. Cần theo dõi thêm về thị lực.</div></div></div></td></tr>)}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Không tìm thấy học sinh nào phù hợp.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };


    const renderStaffManagement = () => (
        <div className="dashboard-body staff-manage-layout">
            <h2 className="section-title-blue">QUẢN LÍ THÔNG TIN CÁN BỘ</h2>
            {/* ... (Code Render Staff Management đã được lược bỏ theo yêu cầu của bạn) ... */}
        </div>
    );
    
    // --- RENDER CREATE POST (ĐÃ KHẮC PHỤC LỖI) ---
    const renderCreatePost = () => (
        <div className="dashboard-body create-post-layout">
            <h2 className="section-title-blue">TẠO BÀI VIẾT MỚI</h2>
            <div className="post-step">
                <div className="step-header"><span className="step-number">1</span> Hình ảnh/ Video/ Poster</div>
                <div className="media-tabs">
                    <div className={`media-tab ${postMediaTab === 'template' ? 'active' : ''}`} onClick={() => setPostMediaTab('template')}>MẪU POSTER</div>
                    <div className={`media-tab ${postMediaTab === 'upload' ? 'active' : ''}`} onClick={() => setPostMediaTab('upload')}>TẢI LÊN</div>
                </div>
                <div className="media-content-area">
                    {postMediaTab === 'template' ? (
                        <div className="template-slider">
                            {mockTemplates.map(tpl => (
                                <div 
                                    key={tpl.id} 
                                    className={`template-item ${selectedTemplate === tpl.id ? 'selected' : ''}`} 
                                    onClick={() => setSelectedTemplate(tpl.id)}
                                >
                                    <img src={tpl.src} alt={tpl.title} />
                                    <div className="template-title-overlay">{tpl.title}</div>
                                    {selectedTemplate === tpl.id && <div className="selected-overlay">✓</div>}
                                </div>
                            ))}
                            <div className="template-item load-more">
                                <span className="plus-icon">+</span>
                                <span>Tải thêm</span>
                            </div>
                        </div>
                    ) : (
                        <div className="upload-area">
                            <p>Kéo thả ảnh vào đây hoặc bấm để tải lên</p>
                            <input type="file" accept="image/*,video/*" />
                        </div>
                    )}
                </div>
            </div>
            <div className="post-step">
                <div className="step-header"><span className="step-number">2</span> Soạn thảo nội dung</div>
                <div className="form-group">
                    <label>Tiêu đề bài viết (*)</label>
                    <input 
                        type="text" 
                        name="title" 
                        placeholder="Ví dụ: Cách phòng chống bệnh sốt xuất huyết..." 
                        value={postContent.title} 
                        onChange={handlePostChange} 
                        className="form-input" 
                    />
                </div>
                <div className="form-group">
                    <label>Nội dung bài viết (*)</label>
                    <div className="editor-container">
                        <div className="editor-toolbar">
                            <button className="editor-btn" onClick={() => handleEditorCommand('justifyLeft')}>≡</button>
                            <button className="editor-btn" onClick={() => handleEditorCommand('justifyCenter')}>≣</button>
                            <button className="editor-btn" onClick={() => handleEditorCommand('justifyRight')}>⫸</button>
                            <span className="separator">|</span>
                            <button className="editor-btn font-bold" onClick={() => handleEditorCommand('bold')}>B</button>
                            <button className="editor-btn font-italic" onClick={() => handleEditorCommand('italic')}>I</button>
                            <button className="editor-btn font-underline" onClick={() => handleEditorCommand('underline')}>U</button>
                            <button className="editor-btn" onClick={() => handleEditorCommand('insertUnorderedList')}>●</button>
                            <span className="separator">|</span>
                            <button className="editor-btn" onClick={() => { const url = prompt("URL:"); if (url) handleEditorCommand('createLink', url); }}>🔗</button>
                        </div>
                        <div 
                            ref={editorRef} 
                            className="editor-content" 
                            contentEditable={true} 
                            onInput={handleEditorInput} 
                            dangerouslySetInnerHTML={{ __html: postContent.content }}
                            suppressContentEditableWarning={true}
                        ></div>
                    </div>
                </div>
            </div>
            <div className="post-step">
                <div className="step-header"><span className="step-number">3</span> Tối ưu </div>
                <div className="form-group">
                    <label>Tiêu đề </label>
                    <input type="text" name="seoTitle" className="form-input" value={postContent.seoTitle} onChange={handlePostChange} />
                </div>
                <div className="form-group">
                    <label>Mô tả </label>
                    <textarea name="metaDesc" className="form-textarea-small" value={postContent.metaDesc} onChange={handlePostChange}></textarea>
                </div>
            </div>
            <div className="post-step">
                <div className="step-header"><span className="step-number">4</span> Xuất bản/ Phân loại</div>
                <div className="publish-options">
                    <div className="schedule-row">
                        <label className="radio-label">
                            <input type="radio" name="scheduleOption" value="now" checked={postContent.scheduleOption === 'now'} onChange={handlePostChange} />
                            <span>Đăng ngay sau khi được duyệt</span>
                        </label>
                        <label className="radio-label">
                            <input type="radio" name="scheduleOption" value="schedule" checked={postContent.scheduleOption === 'schedule'} onChange={handlePostChange} />
                            <span>Hẹn lịch đăng</span>
                        </label>
                        <input 
                            type="datetime-local" 
                            name="scheduleDate" 
                            className="date-picker" 
                            disabled={postContent.scheduleOption !== 'schedule'} 
                            value={postContent.scheduleDate} 
                            onChange={handlePostChange} 
                        />
                    </div>
                    <div className="publish-status">
                        <strong>Hành động:</strong> <br/>
                        Trạng thái: <span>Bản nháp</span>
                    </div>
                    <div className="publish-buttons">
                        <button className="btn-publish draft" onClick={() => handlePostSubmit('draft')}>LƯU NHÁP</button>
                        <button className="btn-publish submit" onClick={() => handlePostSubmit('publish')}>GỬI PHÊ DUYỆT</button>
                    </div>
                </div>
            </div>
        </div>
    );

    // --- RENDER CALENDAR (ĐÃ KHẮC PHỤC LỖI) ---
    const renderCalendar = () => {
        // Hàm tính số ngày trong tháng (Giả định đơn giản cho tháng 11, 12/2025)
        const getDaysInMonth = (month, year) => {
            if (month === 11) return 30; // Nov 2025
            if (month === 12) return 31; // Dec 2025
            return new Date(year, month, 0).getDate();
        };

        // Hàm tính thứ bắt đầu của tháng (Tháng 11/2025 bắt đầu từ thứ Bảy)
        const getStartDayOfWeek = (month, year) => {
            // Lấy thứ trong tuần (0=CN, 1=T2, ..., 6=T7)
            const date = new Date(year, month - 1, 1);
            const dayIndex = date.getDay();
            // Điều chỉnh để T2=1, ..., T7=6, CN=7 (hoặc 0 nếu dùng 7 cột)
            return (dayIndex === 0) ? 6 : dayIndex - 1; // 0=T2, 6=CN (nếu dùng 7 cột)
        };

        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const startDayOfWeek = getStartDayOfWeek(currentMonth, currentYear); // 0=T2, 6=CN

        const calendarDays = [];
        
        // Thêm ô trống đầu tháng
        for (let i = 0; i < startDayOfWeek; i++) { 
            calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>); 
        }

        // Tạo các ô ngày
        const handleDateClick = (day) => { if (selectedDate === day) setSelectedDate(null); else setSelectedDate(day); };
        for (let day = 1; day <= daysInMonth; day++) {
            const eventsToday = calendarEvents.filter(ev => ev.date === day && ev.month === currentMonth && ev.year === currentYear);
            const isSelected = selectedDate === day;
            calendarDays.push(
                <div 
                    key={day} 
                    className={`calendar-day ${isSelected ? 'selected-day' : ''}`} 
                    onClick={() => handleDateClick(day)} 
                    title={`Ngày ${day}`}
                >
                    <span className="day-number">{day}</span>
                    <div className="events-list">
                        {eventsToday.map(ev => (
                            <div key={ev.id} className={`event-badge ${ev.status}`} title={ev.title}>{ev.title}</div>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className="dashboard-body calendar-layout">
                <h2 className="section-title-blue">LỊCH NỘI DUNG</h2>
                <div className="calendar-header">
                    <button className="btn-nav" onClick={() => setCurrentMonth(currentMonth > 1 ? currentMonth - 1 : 12)}>❮</button>
                    <div className="current-time">
                        <div className="calendar-selector" ref={monthPickerRef}>
                            <div className="month-pill" onClick={() => setShowMonthPicker(!showMonthPicker)}>Tháng {currentMonth}</div>
                            {showMonthPicker && (
                                <div className="calendar-dropdown">
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                        <div key={m} className={`calendar-option ${m === currentMonth ? 'selected' : ''}`} onClick={() => { setCurrentMonth(m); setShowMonthPicker(false); }}>Tháng {m}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="calendar-selector" ref={yearPickerRef}>
                            <div className="year-pill" onClick={() => setShowYearPicker(!showYearPicker)}>{currentYear}</div>
                            {showYearPicker && (
                                <div className="calendar-dropdown">
                                    {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map(y => (
                                        <div key={y} className={`calendar-option ${y === currentYear ? 'selected' : ''}`} onClick={() => { setCurrentYear(y); setShowYearPicker(false); }}>{y}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <button className="btn-nav" onClick={() => setCurrentMonth(currentMonth < 12 ? currentMonth + 1 : 1)}>❯</button>
                </div>
                <div className="calendar-legend">
                    <div className="legend-item"><span className="dot draft"></span> Nháp</div>
                    <div className="legend-item"><span className="dot pending"></span> Chờ duyệt</div>
                    <div className="legend-item"><span className="dot rejected"></span> Đã từ chối</div>
                    <div className="legend-item"><span className="dot approved"></span> Đã duyệt</div>
                    <button className="btn-add-event" onClick={() => setActiveTab('createPost')}>+</button>
                </div>
                {/* Header ngày trong tuần */}
                <div className="calendar-grid">
                    <div className="day-name">T2</div><div className="day-name">T3</div><div className="day-name">T4</div><div className="day-name">T5</div><div className="day-name">T6</div><div className="day-name">T7</div><div className="day-name">CN</div>
                    {calendarDays}
                </div>
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
                <div className={`menu-item ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>Thông tin học sinh</div>
                <div className={`menu-item ${activeTab === 'createPost' ? 'active' : ''}`} onClick={() => setActiveTab('createPost')}>Tạo bài viết</div>
                <div className={`menu-item ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>Lịch nội dung 90 ngày</div>
            </div>
            <div className="main-content">
                <div className="dashboard-header">
                    <div className="user-profile-mini">
                        {/* Đã sửa staffInfo.name thành staffProfile.name */}
                        <span>{staffProfile.name} ({staffProfile.role})</span> 
                        <img src={avatar} alt="mini-avatar" className="mini-avatar" />
                    </div>
                </div>
                {activeTab === 'profile' && renderProfile()}
                {activeTab === 'students' && renderStudentManagement()}
                {activeTab === 'createPost' && renderCreatePost()}
                {activeTab === 'calendar' && renderCalendar()}
            </div>
        </div>
    );
};


export default StaffDashboard;