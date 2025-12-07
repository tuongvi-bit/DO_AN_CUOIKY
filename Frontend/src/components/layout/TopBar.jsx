import React from 'react';

const TopBar = () => {
  // CSS nội tuyến đơn giản cho thanh này
  const styles = {
    container: {
      backgroundColor: '#2c3e50', // Màu xanh đậm
      color: 'white',
      padding: '8px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '14px',
    },
    infoGroup: {
      display: 'flex',
      gap: '20px',
    },
    icon: {
      marginRight: '5px',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.infoGroup}>
        <span>📞 0896467817</span>
        <span>📍 97 Man Thiện, Hiệp Phú, Thủ Đức</span>
        <span>✉️ info@EduCare.com</span>
      </div>
      <div style={styles.infoGroup}>
        {/* Social Icons giả lập */}
        <span>Youtube ▶️</span>
        <span>Facebook f</span>
        <span>Linkedin in</span>
      </div>
    </div>
  );
};

export default TopBar;