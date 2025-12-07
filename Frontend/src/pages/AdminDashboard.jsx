import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // <-- ĐÃ THÊM: Import Axios
import './AdminDashboard.css';
import defaultAvatarImg from '../assets/avatar-staff.jpg';




const API_BASE_URL = 'http://localhost:4000/api'; // Địa chỉ Backend




// --- DỮ LIỆU MẪU BÀI VIẾT CHỜ DUYỆT ---
const mockPendingPosts = [
    {
        id: 1,
        title: "Cảnh báo: Phát hiện ca bệnh Tay Chân Miệng",
        author: "Lê Thị Mai",
        date: "12/11/2025",
        status: "pending",
        content: `
            <p><strong>Tình hình dịch bệnh:</strong> Hiện nay, tại một số lớp học đã ghi nhận các trường hợp nghi nhiễm Tay Chân Miệng. Đây là bệnh truyền nhiễm cấp tính, có khả năng lây lan nhanh.</p>
            <p><strong>Triệu chứng nhận biết:</strong></p>
            <ul>
                <li>Sốt nhẹ hoặc sốt cao.</li>
                <li>Mệt mỏi, đau họng, biếng ăn.</li>
                <li>Tổn thương ở da: Rát đỏ, mụn nước ở các vị trí đặc biệt như họng, quanh miệng, lòng bàn tay, lòng bàn chân, mông, đầu gối...</li>
            </ul>
            <p><strong>Biện pháp phòng ngừa bắt buộc:</strong></p>
            <p>1. Rửa tay thường xuyên bằng xà phòng dưới vòi nước chảy nhiều lần trong ngày (cả người lớn và trẻ em), đặc biệt trước khi chế biến thức ăn, trước khi ăn/cho trẻ ăn, trước khi bế ẵm trẻ, sau khi đi vệ sinh.</p>
            <p>2. Thực hiện tốt vệ sinh ăn uống: ăn chín, uống chín; vật dụng ăn uống phải đảm bảo được rửa sạch sẽ trước khi sử dụng (tốt nhất là ngâm tráng nước sôi).</p>
            <p>3. Thường xuyên lau sạch các bề mặt, dụng cụ tiếp xúc hàng ngày như đồ chơi, dụng cụ học tập, tay nắm cửa, tay vịn cầu thang, mặt bàn/ghế, sàn nhà bằng xà phòng hoặc các chất tẩy rửa thông thường.</p>
            <p>4. Không cho trẻ tiếp xúc với người bệnh hoặc nghi ngờ mắc bệnh.</p>
            <p><em>Nhà trường đề nghị các bậc phụ huynh phối hợp chặt chẽ để bảo vệ sức khỏe cho con em mình.</em></p>
        `,
        image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400",
        schedule: "now"
    },
    {
        id: 2,
        title: "Hướng dẫn sơ cứu khi bị bỏng",
        author: "Lê Thị Mai",
        date: "11/11/2025",
        status: "pending",
        content: `
            <p>Bỏng là tai nạn thường gặp ở lứa tuổi học đường. Việc sơ cứu đúng cách giúp giảm thiểu tổn thương và sẹo sau này.</p>
            <h3>Các bước sơ cứu cơ bản:</h3>
            <ol>
                <li><strong>Loại bỏ tác nhân gây bỏng:</strong> Nhanh chóng đưa nạn nhân ra khỏi nguồn gây bỏng (nước sôi, lửa, hóa chất...).</li>
                <li><strong>Làm mát vết bỏng:</strong> Ngâm vùng bị bỏng vào nước mát sạch (nhiệt độ khoảng 16-20 độ C) trong khoảng 15-20 phút. Tuyệt đối không dùng nước đá lạnh trực tiếp vì có thể gây bỏng lạnh.</li>
                <li><strong>Che phủ vết bỏng:</strong> Dùng gạc sạch hoặc vải sạch che phủ nhẹ nhàng lên vết bỏng để tránh nhiễm trùng. Không băng quá chặt.</li>
                <li><strong>Đến cơ sở y tế:</strong> Nếu vết bỏng rộng, sâu, hoặc ở các vị trí nguy hiểm (mặt, tay, bộ phận sinh dục), cần đưa nạn nhân đến ngay phòng y tế hoặc bệnh viện gần nhất.</li>
            </ol>
            <p><strong>NHỮNG ĐIỀU KHÔNG NÊN LÀM:</strong></p>
            <ul>
                <li>Không bôi kem đánh răng, mỡ trăn, nước mắm hay các bài thuốc dân gian lên vết bỏng.</li>
                <li>Không làm vỡ các bọng nước.</li>
            </ul>
        `,
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
    { id: '21', name: 'Nguyễn Văn An', class: '6A1', dob: '12/05/2010', status: 'Bình thường', gender: 'Nam', parent: 'Nguyễn Văn Ba', phone: '0901111001', address: 'Phú Gia' },
    { id: '22', name: 'Trần Thị Hoa', class: '6A2', dob: '18/02/2011', status: 'Cận thị nhẹ', gender: 'Nữ', parent: 'Lê Văn C', phone: '0902222002', address: 'Phú Gia' },
    { id: '23', name: 'Lê Văn Minh', class: '7B1', dob: '10/09/2010', status: 'Thừa cân', gender: 'Nam', parent: 'Trần Thị D', phone: '0903333003', address: 'Hòa An' },
    { id: '24', name: 'Phạm Ngọc Hà', class: '6A1', dob: '14/01/2011', status: 'Bình thường', gender: 'Nữ', parent: 'Phạm Văn E', phone: '0904444004', address: 'Bình Minh' },
    { id: '25', name: 'Đoàn Hữu Đức', class: '7C2', dob: '07/12/2010', status: 'Sâu răng', gender: 'Nam', parent: 'Hoàng Thị F', phone: '0905555005', address: 'Hương Sơn' },
    { id: '26', name: 'Ngô Mai Phương', class: '6A2', dob: '20/04/2011', status: 'Bình thường', gender: 'Nam', parent: 'Lý Văn G', phone: '0906666006', address: 'Phú Gia' },
    { id: '27', name: 'Võ Hoàng Nam', class: '7B2', dob: '30/07/2010' , status: 'Bình thường', gender: 'Nữ', parent: 'Trần Văn H', phone: '0907777007', address: 'Tân Lập' },
    { id: '28', name: 'Trần Minh Quân', class: '6A3', dob: '18/05/2011', status: 'Bình thường', gender: 'Nam', parent: 'Nguyễn Văn Ba', phone: '0901111001', address: 'Phú Gia' },
    { id: '29', name: 'Nguyễn Hồng Ngọc', class: '7B3', dob: '25/06/2010', status: 'Cận thị nhẹ', gender: 'Nữ', parent: 'Lê Văn C', phone: '0902222002', address: 'Phú Gia' },
    { id: '30', name: 'Đinh Gia Bảo', class: '7C1', dob: '02/10/2010', status: 'Thừa cân', gender: 'Nam', parent: 'Trần Thị D', phone: '0903333003', address: 'Hòa An' },
    { id: '31', name: 'Bùi Huy Hoàng', class: '6A1', dob: '12/11/2010', status: 'Bình thường', gender: 'Nữ', parent: 'Phạm Văn E', phone: '0904444004', address: 'Bình Minh' },
    { id: '32', name: 'Phan Thị Thảo', class: '7B1', dob: '09/03/2011', status: 'Sâu răng', gender: 'Nam', parent: 'Hoàng Thị F', phone: '0905555005', address: 'Hương Sơn' },
    { id: '33', name: 'Nguyễn Nhật Long', class: '7C2', dob: '23/08/2010', status: 'Bình thường', gender: 'Nam', parent: 'Lý Văn G', phone: '0906666006', address: 'Phú Gia' },
    { id: '34', name: 'Tạ Gia Linh', class: '6A2', dob: '15/05/2011', status: 'Bình thường', gender: 'Nữ', parent: 'Trần Văn H', phone: '0907777007', address: 'Tân Lập' },
    { id: '35', name: 'Phan Văn Tài', class: '7B3', dob: '14/09/2010', status: 'Bình thường', gender: 'Nam', parent: 'Nguyễn Văn Ba', phone: '0901111001', address: 'Phú Gia' },
    { id: '36', name: 'Huỳnh Mỹ Duyên', class: '6A1', dob: '02/01/2011', status: 'Cận thị nhẹ', gender: 'Nữ', parent: 'Lê Văn C', phone: '0902222002', address: 'Phú Gia' },
    { id: '37', name: 'Lương Gia Hân', class: '7C1', dob: '19/12/2010', status: 'Thừa cân', gender: 'Nam', parent: 'Trần Thị D', phone: '0903333003', address: 'Hòa An' },
    { id: '38', name: 'Trần Tuấn Kiệt', class: '7B2', dob: '29/03/2010', status: 'Bình thường', gender: 'Nữ', parent: 'Phạm Văn E', phone: '0904444004', address: 'Bình Minh' },
    { id: '39', name: 'Đỗ Thanh Vân', class: '6A3', dob: '22/02/2011', status: 'Sâu răng', gender: 'Nam', parent: 'Hoàng Thị F', phone: '0905555005', address: 'Hương Sơn' },
    { id: '40', name: 'Nguyễn Văn Tín', class: '7B1', dob: '05/08/2010', status: 'Bình thường', gender: 'Nam', parent: 'Lý Văn G', phone: '0906666006', address: 'Phú Gia' },
   
];




// --- DỮ LIỆU MẪU CÁN BỘ ---
const initialStaffs = [
    { id: '1', name: 'LÊ THỊ MAI', position: 'Y sĩ ', email: 'maile@truong.edu.vn', status: 'active', dob: '22/03/1988', gender: 'Nữ', phone: '0905001122', degree: 'Đại học Y Dược Huế' },
    { id: '2', name: 'NGUYỄN VĂN LỘC', position: 'Điều dưỡng', email: 'loc.nguyen@truong.edu.vn', status: 'active', dob: '15/07/1985', gender: 'Nam', phone: '0905123456', degree: 'Cao đẳng Y tế' },
    { id: '3', name: 'TRẦN THỊ HẠNH', position: 'Bác sĩ', email: 'hạnh.tran@truong.edu.vn', status: 'locked', dob: '02/09/1985', gender: 'Nam', phone: '0905987654', degree: 'Thạc sĩ Y khoa' },
    { id: '4', name: 'PHẠM QUỐC DŨNG', position: 'Y sĩ', email: 'dung.pham@truong.edu.vn', status: 'active', dob: '12/12/1989', gender: 'Nam', phone: '0905111222', degree: 'Đại học Y Hà Nội' },
    { id: '5', name: 'NGÔ THỊ THỦY', position: 'Y tá', email: 'thuy.ngo@truong.edu.vn', status: 'active', dob: '05/05/1992', gender: 'Nữ', phone: '0905333444', degree: 'Đại học Y Dược Huế' },
];




const medicalPositions = ['Y sĩ', 'Y tá', 'Bác sĩ', 'Dược sĩ', 'Điều dưỡng'];




const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('pending');
   
    // Lấy thông tin từ localStorage (Username/Role Ban Giám Hiệu)
    const storedUsername = localStorage.getItem('username') || 'Quản trị viên';
    const storedRole = localStorage.getItem('userRole') || 'Admin';




    const [adminInfo, setAdminInfo] = useState({ name: storedUsername, role: storedRole });
    const [avatar, setAvatar] = useState(defaultAvatarImg);
    const [loading, setLoading] = useState(true); // Trạng thái tải




    // --- LOGIC AUTHENTICATION VÀ TẢI DỮ LIỆU ---
    const handleLogout = () => {
        localStorage.clear();
        navigate('/'); // Chuyển về trang đăng nhập
    };




    const fetchAdminData = async () => {
        const token = localStorage.getItem('userToken');




        // 1. KIỂM TRA BẢO MẬT VÀ QUYỀN (Nếu không có token hoặc không phải admin, đá ra)
        if (!token || (storedRole !== 'Admin' && storedRole !== 'BanGiamHieu')) {
            // console.error("Access denied: Token or Role missing/invalid."); // Dòng Debug
            handleLogout();
            return;
        }




        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
           
            // NOTE: Gọi API Dashboard để kiểm tra token hợp lệ và lấy dữ liệu quản lý
            const response = await axios.get(`${API_BASE_URL}/data/dashboard`, config);
           
            // TẠM THỜI: Cập nhật tên từ Backend (nếu Backend có API trả về tên BGH)
            // setAdminInfo({ name: response.data.user_info.username, role: storedRole });
           
            console.log('API Dashboard phản hồi thành công:', response.data); // Dòng Debug




            setLoading(false);




        } catch (err) {
            setLoading(false);
           
            // LỖI QUAN TRỌNG NHẤT: BÁO LỖI VÀ CHUYỂN HƯỚNG
            if (err.response) {
                console.error("LỖI API:", err.response.status, err.response.data); // <-- Dòng Debug
            } else {
                 console.error("Lỗi mạng/máy chủ:", err);
            }
           
            // Xử lý lỗi xác thực (401/403)
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                 alert("Phiên làm việc hết hạn hoặc không có quyền truy cập.");
                 handleLogout();
            } else {
                 // Hiển thị lỗi API trên giao diện (nếu là lỗi 500)
            }
        }
    };




    useEffect(() => {
        fetchAdminData();
    }, []);
   
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
    const [staffSearch, setSearchStaff] = useState('');
    const [selectedRole, setSelectedRole] = useState('Vai trò');
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);
    const [viewingStaff, setViewingStaff] = useState(null);
    const [isEditingStaff, setIsEditingStaff] = useState(false);
    const [staffFormData, setStaffFormData] = useState({});




    // --- DATA CHO DROPDOWNS ---
    const authors = ['Tất cả', 'Lê Thị Mai', 'Nguyễn Văn Y Tá', 'Trần Văn Bác Sĩ'];
    const roles = ['Tất cả', ...medicalPositions];
   
    const grades = ['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9'];
    const allClasses = ['6A1', '6A2', '7A1', '7A2', '8A1', '8A2', '9A1', '9A2', '9A3'];




    const availableClasses = (selectedGrade === 'Khối' || selectedGrade === 'Tất cả')
        ? allClasses
        : allClasses.filter(cls => cls.startsWith(selectedGrade.replace('Khối ', '')));




    // --- REFS ---
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
                    {posts.length === 0 && <div className="empty-message">Không có bài viết nào chờ duyệt.</div>}
                </div>
            </div>
            {viewingPost && (
                <div className="modal-overlay" onClick={() => setViewingPost(null)}>
                    <div className="modal-content post-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <span className="close-modal" onClick={() => setViewingPost(null)}>&times;</span>
                        <div className="post-detail-header"><h2>{viewingPost.title}</h2></div>
                       
                        {/* KHUNG NỘI DUNG CÓ CUỘN */}
                        <div className="post-detail-body">
                            {viewingPost.image && <img src={viewingPost.image} alt="Cover" className="post-cover-img" />}
                            <div className="post-content-html" dangerouslySetInnerHTML={{ __html: viewingPost.content }}></div>
                        </div>




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
    const renderStudentManagement = () => {
        const filteredStudents = students.filter(student => {
            const matchName = student.name.toLowerCase().includes(studentSearch.toLowerCase()) || student.class.toLowerCase().includes(studentSearch.toLowerCase());
            const matchGrade = (selectedGrade === 'Khối' || selectedGrade === 'Tất cả') ? true : student.class.startsWith(selectedGrade.replace('Khối ', ''));
            const matchClass = (selectedClass === 'Lớp' || selectedClass === 'Tất cả') ? true : student.class === selectedClass;
            return matchName && matchGrade && matchClass;
        });




        return (
            <div className="dashboard-body student-manage-layout">
                <h2 className="section-title-blue">QUẢN LÍ THÔNG TIN HỌC SINH</h2>
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
                <div className="big-actions-container"><button className="btn-big-action btn-add" onClick={handleAddStudent}>Thêm hồ sơ</button><button className="btn-big-action btn-export" onClick={handleExportExcel}>Xuất Excel</button></div>
                <div className="table-wrapper scrollable-table">
                    <table className="student-table">
                        <thead><tr><th>MÃ HS</th><th>HỌ TÊN</th><th>LỚP</th><th>NGÀY SINH</th><th>TÌNH TRẠNG</th><th>HÀNH ĐỘNG</th></tr></thead>
                        <tbody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <React.Fragment key={student.id}>
                                        <tr key={student.id}>
                                            <td>{student.id}</td>
                                            <td className="text-left">{editingId === student.id ? <input type="text" name="name" value={editFormData.name} onChange={handleEditFormChange} className="table-input" /> : student.name}</td>
                                            <td>{student.class}</td>
                                            <td>{student.dob}</td>
                                            <td className="status-cell">{student.status}</td>
                                            <td className="actions-cell">
                                                {editingId === student.id ? (<><span className="icon-btn save" onClick={handleSaveClick}>💾</span><span className="icon-btn cancel" onClick={handleCancelClick}>❌</span></>) : (<><span className="icon-btn view" onClick={() => toggleExpand(student.id)}>👁️</span><span className="icon-btn edit" onClick={() => handleEditClick(student)}>✏️</span><span className="icon-btn print">🖨️</span></>)}
                                            </td>
                                        </tr>
                                        {expandedId === student.id && (<tr className="detail-row"><td colSpan="6"><div className="detail-content">Chi tiết thông tin...</div></td></tr>)}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Không tìm thấy học sinh nào.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };




    // --- RENDER TAB 3: CÁN BỘ ---
    const renderStaffManagement = () => (
        <div className="dashboard-body staff-manage-layout">
            <h2 className="section-title-blue">QUẢN LÍ THÔNG TIN CÁN BỘ</h2>
            <div className="toolbar-container">
                <div className="search-box-large">
                    <input type="text" placeholder="Tìm kiếm theo tên, email, ..." value={staffSearch} onChange={(e) => setSearchStaff(e.target.value)} />
                </div>
                <div className="filter-group">
                    <div className="dropdown-custom" ref={roleRef} onClick={() => setShowRoleDropdown(!showRoleDropdown)}>
                        <span>{selectedRole}</span> <span className="arrow">▼</span>
                        {showRoleDropdown && (<div className="dropdown-list"><div className="dropdown-option" onClick={() => setSelectedRole('Tất cả')}>Tất cả</div>{roles.map((r, idx) => (<div key={idx} className="dropdown-option" onClick={() => setSelectedRole(r)}>{r}</div>))}</div>)}
                    </div>
                </div>
            </div>
            <div className="big-actions-container"><button className="btn-big-action btn-add-staff" onClick={handleAddStaff}>Thêm cán bộ</button></div>
            <div className="table-wrapper scrollable-table">
                <table className="student-table">
                    <thead><tr><th>MÃ CÁN BỘ</th><th>HỌ TÊN</th><th>CHỨC VỤ</th><th>EMAIL</th><th>TRẠNG THÁI</th><th>HÀNH ĐỘNG</th></tr></thead>
                    <tbody>
                        {staffs.filter(s => (selectedRole === 'Vai trò' || selectedRole === 'Tất cả' || s.position === selectedRole) && (s.name.toLowerCase().includes(staffSearch.toLowerCase()) || s.email.toLowerCase().includes(staffSearch.toLowerCase()))).map((staff) => (
                            <tr key={staff.id}>
                                <td><strong>{staff.id}</strong></td>
                                <td className="text-left font-bold">{staff.name}</td>
                                <td>{staff.position}</td>
                                <td>{staff.email}</td>
                                <td><span className={`status-badge ${staff.status}`}>{staff.status === 'active' ? 'Hoạt động' : 'Đã khóa'}</span></td>
                                <td className="actions-cell">
                                    <span className="icon-btn view" title="Xem chi tiết" onClick={() => handleOpenStaffModal(staff, 'view')}>👁️</span>
                                    <span className="icon-btn edit" title="Chỉnh sửa" onClick={() => handleOpenStaffModal(staff, 'edit')}>✏️</span>
                                    <span className={`icon-btn ${staff.status === 'active' ? 'lock' : 'unlock'}`} title={staff.status === 'active' ? "Bấm để Khóa" : "Bấm để Mở khóa"} onClick={() => handleToggleLock(staff.id)}>{staff.status === 'active' ? '🔓' : '🔒'}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {viewingStaff && (
                <div className="modal-overlay" onClick={() => setViewingStaff(null)}>
                    <div className="modal-content staff-modal" onClick={(e) => e.stopPropagation()}>
                        <span className="close-modal" onClick={() => setViewingStaff(null)}>&times;</span>
                        <h2 className="modal-title">{isEditingStaff ? "CHỈNH SỬA THÔNG TIN" : "THÔNG TIN CÁN BỘ"}</h2>
                        <div className="modal-form-grid">
                            <div className="form-group"><label>Họ và Tên</label><input type="text" name="name" value={staffFormData.name} onChange={handleStaffFormChange} disabled={!isEditingStaff} className="modal-input" /></div>
                            <div className="form-group"><label>Mã Cán bộ</label><input type="text" value={staffFormData.id} disabled className="modal-input disabled" /></div>
                            <div className="form-group"><label>Chức vụ</label>{isEditingStaff ? (<select name="position" value={staffFormData.position} onChange={handleStaffFormChange} className="modal-input">{medicalPositions.map((pos, idx) => (<option key={idx} value={pos}>{pos}</option>))}</select>) : (<input type="text" value={staffFormData.position} disabled className="modal-input" />)}</div>
                            <div className="form-group"><label>Email</label><input type="text" name="email" value={staffFormData.email} onChange={handleStaffFormChange} disabled={!isEditingStaff} className="modal-input" /></div>
                            <div className="form-group"><label>Bằng cấp</label><input type="text" name="degree" value={staffFormData.degree} onChange={handleStaffFormChange} disabled={!isEditingStaff} className="modal-input" /></div>
                            <div className="form-group"><label>Số điện thoại</label><input type="text" name="phone" value={staffFormData.phone} onChange={handleStaffFormChange} disabled={!isEditingStaff} className="modal-input" /></div>
                        </div>
                        <div className="modal-footer">{isEditingStaff ? (<button className="btn-modal-action approve" onClick={handleSaveStaff}>LƯU</button>) : (<button className="btn-modal-action view" onClick={() => setIsEditingStaff(true)}>CHỈNH SỬA</button>)}<button className="btn-modal-action reject" onClick={() => setViewingStaff(null)}>ĐÓNG</button></div>
                    </div>
                </div>
            )}
        </div>
    );




    if (loading) {
        return <div className="dashboard-container centered-loading">Đang tải dữ liệu và xác thực...</div>;
    }
   
    return (
        <div className="dashboard-container">
            <div className="sidebar">
                {/* CẬP NHẬT: Thêm sự kiện onClick cho logo */}
                <div className="sidebar-logo" style={{cursor: 'pointer'}} onClick={() => navigate('/')}>EduCare</div>
               
                <div className={`menu-item ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>Chờ duyệt ({posts.length})</div>
                <div className={`menu-item ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>Thông tin học sinh</div>
                <div className={`menu-item ${activeTab === 'staff' ? 'active' : ''}`} onClick={() => setActiveTab('staff')}>Thông tin cán bộ</div>
                <div className="menu-item logout-btn" onClick={handleLogout}>Đăng xuất</div> {/* <-- ĐÃ THÊM: Nút đăng xuất */}
            </div>
            <div className="main-content">
                <div className="dashboard-header">
                    <div className="user-profile-mini">
                        <span>{adminInfo.name} ({adminInfo.role})</span>
                        <img src={avatar} alt="mini-avatar" className="mini-avatar" />
                    </div>
                </div>
                {activeTab === 'pending' && renderPendingPosts()}
                {activeTab === 'students' && renderStudentManagement()}
                {activeTab === 'staff' && renderStaffManagement()}
            </div>
            {viewingPost && <div className="overlay-spacer"></div>}
        </div>
    );
};




export default AdminDashboard;





