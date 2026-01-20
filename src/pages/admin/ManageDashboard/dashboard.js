import React, { useState, useMemo } from 'react';
import './DashboardBody.css'; // File CSS ở bước 2

const DashboardBody = () => {
  const [selectedYear, setSelectedYear] = useState('2023');

  // Dữ liệu mẫu (Lấy từ script cũ của bạn)
  const yearData = useMemo(() => ({
    '2023': [42850, 35200, 38500, 46100, 50800, 54500, 58200, 62800, 51300, 47600, 43900, 40200],
    '2022': [38500, 31200, 34500, 42100, 46800, 49500, 53200, 57800, 46300, 41600, 38900, 35200],
    '2021': [32500, 28200, 29500, 36100, 39800, 42500, 46200, 49800, 38300, 34600, 31900, 29200],
    '2020': [28500, 23200, 25500, 30100, 32800, 35500, 39200, 42800, 31300, 27600, 24900, 22200]
  }), []);

  // Lấy data theo năm, mặc định là 2023
  const currentData = yearData[selectedYear] || yearData['2023'];
  const MAX_VALUE = 80000; // Giá trị trần để tính % chiều cao

  return (
    <div className="dashboard-body">
      <h1 className="page-title">Dashboard Thống Kê</h1>
      
      {/* 1. KHỐI THỐNG KÊ (Stats Cards) */}
      <div className="stats-cards">
        <StatCard icon="fa-utensils" color="red" value="1,248" label="Công thức món ăn" />
        <StatCard icon="fa-user-check" color="orange" value="5,623" label="Người dùng đăng ký" />
        <StatCard icon="fa-blog" color="green" value="287" label="Số blog" />
        <StatCard icon="fa-clock" color="blue" value="48" label="Công thức chờ duyệt" />
      </div>
      
      {/* 2. KHỐI BIỂU ĐỒ (Chart Section) */}
      <div className="chart-section">
        <div className="section-header">
          <h3 className="section-title">Lượt truy cập (12 tháng gần nhất)</h3>
          <div className="year-selector">
            <label htmlFor="yearSelect">Năm: </label>
            <select 
              id="yearSelect" 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
            </select>
          </div>
        </div>
        
        <div className="chart-container">
          {/* Các dòng kẻ ngang (Background lines) */}
          <div className="chart-lines">
            {[80, 70, 60, 50, 40].map(val => (
              <div key={val} className="chart-line"><span>{val},000</span></div>
            ))}
          </div>
          
          {/* Các cột biểu đồ (Bars) */}
          <div className="chart-bars">
            {currentData.map((value, index) => {
              const heightPercent = (value / MAX_VALUE) * 100;
              return (
                <div key={index} className={`chart-bar bar-${index + 1}`} style={{ height: `${heightPercent}%` }}>
                  <div className="chart-bar-value">{value.toLocaleString()}</div>
                  <div className="chart-bar-label">T{index + 1}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Component con hiển thị từng thẻ Card nhỏ
const StatCard = ({ icon, color, value, label }) => (
  <div className="stat-card">
    <div className={`stat-icon icon-${color}`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <div className="stat-info">
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  </div>
);

export default DashboardBody;