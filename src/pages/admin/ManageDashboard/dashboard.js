import React, { useState, useEffect } from 'react';
import './DashboardBody.css'; 

const DashboardBody = () => {
  // Mặc định chọn năm hiện tại
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  
  const [dashboardData, setDashboardData] = useState({
    stats: { total_recipes: 0, total_users: 0, total_blogs: 0, pending_recipes: 0 },
    chart: { data: [], label: '' },
    // Thêm state mảng năm (mặc định rỗng)
    available_years: [] 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Gọi API
        const response = await fetch(`http://localhost:8000/api/admin/dashboard?year=${selectedYear}`);
        if (!response.ok) throw new Error('Lỗi kết nối');
        
        const result = await response.json();
        if (result.success) {
          setDashboardData(result.data);
          
          // Logic phụ: Nếu năm đang chọn không nằm trong danh sách năm có dữ liệu 
          // (VD: Năm mới sang nhưng chưa có data), thì tự động set về năm mới nhất có data
          if (result.data.available_years.length > 0 && !result.data.available_years.includes(parseInt(selectedYear))) {
             setSelectedYear(result.data.available_years[0]); // Bỏ comment dòng này nếu muốn tự nhảy năm
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  const chartValues = dashboardData.chart.data || [];
  const maxVal = Math.max(...chartValues, 5);
  const MAX_HEIGHT = Math.ceil(maxVal * 1.2);

  return (
    <div className="dashboard-body">
      <h1 className="page-title">Dashboard Thống Kê</h1>

      {/* 1. CARDS - Giữ nguyên */}
      <div className="stats-cards">
        <StatCard icon="fa-utensils" color="red" value={dashboardData.stats.total_recipes} label="Công thức món ăn" />
        <StatCard icon="fa-user-check" color="orange" value={dashboardData.stats.total_users} label="Sô người dùng" />
        <StatCard icon="fa-blog" color="green" value={dashboardData.stats.total_blogs} label="Bài viết Blog" />
        <StatCard icon="fa-clock" color="blue" value={dashboardData.stats.pending_recipes} label="Công thức chờ duyệt" />
      </div>

      {/* 2. BIỂU ĐỒ */}
      <div className="chart-section" style={{ minHeight: '450px' }}>
        <div className="section-header">
          <h3 className="section-title">Số người ({selectedYear})</h3>
          
          {/* SELECT NĂM ĐỘNG */}
          <div className="year-selector">
            <label>Năm: </label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              {/* Nếu có danh sách năm từ API thì map ra, nếu chưa có thì hiện năm hiện tại */}
              {dashboardData.available_years.length > 0 ? (
                dashboardData.available_years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))
              ) : (
                <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
              )}
            </select>
          </div>
        </div>
        
        <div className="chart-container" style={{ paddingBottom: '20px' }}>
           {/* Logic vẽ biểu đồ giữ nguyên */}
          <div className="chart-lines">
            {[100, 75, 50, 25, 0].map(p => (
              <div key={p} className="chart-line">
                <span>{Math.round((MAX_HEIGHT * p) / 100)}</span>
              </div>
            ))}
          </div>
          
          <div className="chart-bars">
            {chartValues.map((val, idx) => (
              <div key={idx} className={`chart-bar bar-${idx + 1}`} 
                   style={{ height: `${(val / MAX_HEIGHT) * 100}%` }}>
                {val > 0 && <div className="chart-bar-value">{val}</div>}
                <div className="chart-bar-label" style={{ bottom: '-20px', fontSize: '0.8rem', fontWeight: '500' }}>
                    T{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, color, value, label }) => (
  <div className="stat-card">
    <div className={`stat-icon icon-${color}`}><i className={`fas ${icon}`}></i></div>
    <div className="stat-info">
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  </div>
);

export default DashboardBody;