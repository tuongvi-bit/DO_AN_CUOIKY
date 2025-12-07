import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import './SupportPage.css';
import logo from '../assets/logo.png'; // Import logo

const SupportPage = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // State lưu danh sách tin nhắn
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Chào bạn! Cảm ơn bạn đã liên hệ với EduCare.', time: '08:00' },
    { id: 2, sender: 'bot', text: 'Chúng tôi có thể giúp gì cho sức khỏe của bạn hôm nay?', time: '08:00' }
  ]);

  const [inputValue, setInputValue] = useState('');

  // Tự động cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Hàm gửi tin nhắn
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // 1. Thêm tin nhắn của người dùng
    const newUserMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue('');

    // 2. Giả lập Bot trả lời sau 1 giây
    setTimeout(() => {
      const botReply = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Cảm ơn thông tin của bạn. Nhân viên y tế sẽ phản hồi trong giây lát. Vui lòng giữ máy!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1000);
  };

  return (
    <div className="support-page-container">
      <TopBar />
      
      <div className="chat-layout">
        {/* SIDEBAR TRÁI: Thông tin Hotline */}
        <div className="chat-sidebar">
            <div className="sidebar-header">
                <button className="btn-back-chat" onClick={() => navigate('/')}>❮ Trang chủ</button>
            </div>
            <div className="hotline-info">
                <div className="hotline-avatar">
                    {/* Thay ảnh đại diện bằng logo */}
                    <img src={logo} alt="Support Logo" style={{ objectFit: 'contain', padding: '5px', backgroundColor: 'white' }} />
                    <span className="online-status"></span>
                </div>
                <h2>Tổng đài EduCare</h2>
                <p className="hotline-number">Hotline: <strong>0896467817</strong></p>
                <p className="status-text">Luôn sẵn sàng hỗ trợ 24/7</p>
            </div>
            <div className="faq-section">
                <h3>Câu hỏi thường gặp</h3>
                <ul>
                    <li>Làm sao để đặt lịch khám?</li>
                    <li>Quên mật khẩu phải làm sao?</li>
                    <li>Quy trình sơ cứu cơ bản?</li>
                </ul>
            </div>
        </div>

        {/* KHUNG CHAT CHÍNH */}
        <div className="chat-window">
            <div className="chat-header">
                <div className="chat-contact-info">
                    {/* Thay ảnh đại diện bằng logo */}
                    <img src={logo} alt="Support Logo" style={{ objectFit: 'contain', backgroundColor: 'white', border: '1px solid #eee' }} />
                    <div>
                        <h3>Tư vấn viên Y tế</h3>
                        <span>Đang hoạt động</span>
                    </div>
                </div>
                <div className="chat-actions">
                    <button title="Gọi điện">📞</button>
                    {/* Đã bỏ nút Video call */}
                </div>
            </div>

            <div className="chat-messages">
                <div className="date-divider"><span>Hôm nay</span></div>
                
                {messages.map((msg) => (
                    <div key={msg.id} className={`message-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}>
                        {msg.sender === 'bot' && (
                            // Thay ảnh đại diện bot bằng logo
                            <img src={logo} alt="Bot Logo" className="msg-avatar" style={{ objectFit: 'contain', backgroundColor: 'white', border: '1px solid #eee' }} />
                        )}
                        <div className={`message-bubble ${msg.sender}`}>
                            <p>{msg.text}</p>
                            <span className="msg-time">{msg.time}</span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={handleSendMessage}>
                <button type="button" className="btn-attach">📎</button>
                <input 
                    type="text" 
                    placeholder="Nhập nội dung cần tư vấn..." 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button type="submit" className="btn-send">➤</button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;