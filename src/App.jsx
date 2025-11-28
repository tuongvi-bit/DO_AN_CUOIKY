import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import các trang
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ForgotPassword from './pages/ForgotPassword';

// Import các trang công cộng
import AboutPage from './pages/AboutPage';
import NewsPage from './pages/NewsPage';
import HealthTipsPage from './pages/HealthTipsPage';
import SupportPage from './pages/SupportPage'; // Import trang mới

// Import Dashboard
import StudentDashboard from './pages/StudentDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        <Route path="/about" element={<AboutPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/health-tips" element={<HealthTipsPage />} />
        
        {/* Cập nhật route này */}
        <Route path="/support" element={<SupportPage />} />

        {/* Các route khác giữ nguyên */}
        <Route path="/login/student" element={<LoginPage />} />
        <Route path="/login/staff" element={<LoginPage />} />
        <Route path="/login/admin" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;