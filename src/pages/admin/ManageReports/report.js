import React, { useState } from 'react';
import './Report.css';

const ReportContent = () => {
  // Dữ liệu mẫu
  const [reports] = useState([
    {
      id: 1,
      recipe: { name: 'Bánh mì Sài Gòn', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=100', difficulty: 'Trung bình' },
      reporter: { name: 'Nguyễn Thị Mai', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      reason: 'Sao chép nội dung không ghi nguồn',
      date: '2023-11-15',
      author: { name: 'Trần Văn B', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
      status: 'pending'
    },
    {
      id: 2,
      recipe: { name: 'Phở Bò Hà Nội', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100', difficulty: 'Khó' },
      reporter: { name: 'Lê Văn C', avatar: 'https://randomuser.me/api/portraits/men/67.jpg' },
      reason: 'Hình ảnh không đúng thực tế',
      date: '2023-11-14',
      author: { name: 'Phạm Văn D', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
      status: 'pending'
    },
    {
      id: 3,
      recipe: { name: 'Gỏi Cuốn Tôm Thịt', image: 'https://images.unsplash.com/photo-1552465011-b4e30bf7349d?w=100', difficulty: 'Dễ' },
      reporter: { name: 'Trần Thị E', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
      reason: 'Nội dung spam, quảng cáo',
      date: '2023-11-13',
      author: { name: 'Hoàng Thị F', avatar: 'https://randomuser.me/api/portraits/women/32.jpg' },
      status: 'reviewed'
    },
    {
      id: 4,
      recipe: { name: 'Bánh Xèo Miền Tây', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=100', difficulty: 'Trung bình' },
      reporter: { name: 'Ngô Văn G', avatar: 'https://randomuser.me/api/portraits/men/11.jpg' },
      reason: 'Ngôn từ không phù hợp',
      date: '2023-11-12',
      author: { name: 'Lý Văn H', avatar: 'https://randomuser.me/api/portraits/men/88.jpg' },
      status: 'dismissed'
    }
  ]);

  const renderStatus = (status) => {
    switch (status) {
      case 'pending': return <span className="badge badge-pending">Chờ xử lý</span>;
      case 'reviewed': return <span className="badge badge-reviewed">Đã xử lý</span>;
      case 'dismissed': return <span className="badge badge-dismissed">Đã bỏ qua</span>;
      default: return null;
    }
  };

  return (
    <div className="report-main-content">
      
      {/* 1. Page Title */}
      <div className="page-header-content">
        <div className="page-title">
          <h2>Quản Lý Báo Cáo Vi Phạm</h2>
        </div>
      </div>

      {/* 2. Filter Section (CHỈ CÒN 2 BỘ LỌC) */}
      <div className="filter-box">
        <div className="filter-row">
          <div className="filter-item">
            <label>Trạng thái</label>
            <select defaultValue="all">
              <option value="all">Tất cả</option>
              <option value="pending">Chờ xử lý</option>
              <option value="reviewed">Đã xem xét</option>
              <option value="dismissed">Đã bỏ qua</option>
            </select>
          </div>
          
          <div className="filter-item">
            <label>Ngày báo cáo</label>
            <input type="date" />
          </div>

          <div className="filter-actions">
            <button className="btn-filter btn-apply"><i className="fas fa-filter"></i> Áp dụng</button>
            <button className="btn-filter btn-reset"><i className="fas fa-sync-alt"></i></button>
          </div>
        </div>
      </div>

      {/* 3. Table Section */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{width: '25%'}}>Công thức</th>
                <th style={{width: '15%'}}>Người báo cáo</th>
                <th style={{width: '20%'}}>Lý do</th>
                <th style={{width: '10%'}}>Ngày</th>
                <th style={{width: '15%'}}>Tác giả</th>
                <th style={{width: '10%'}}>Trạng thái</th>
                <th style={{width: '5%'}}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="info-group">
                      <img src={item.recipe.image} alt="Recipe" className="info-img" />
                      <div className="info-text">
                        <h4>{item.recipe.name}</h4>
                        <p>{item.recipe.difficulty}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="user-group">
                      <img src={item.reporter.avatar} alt="User" className="user-avatar" />
                      <span className="user-name">{item.reporter.name}</span>
                    </div>
                  </td>
                  <td>
                    <p style={{fontSize:'0.9rem', lineHeight:'1.4'}}>{item.reason}</p>
                  </td>
                  <td>{item.date}</td>
                  <td>
                    <div className="user-group">
                      <img src={item.author.avatar} alt="Author" className="user-avatar" />
                      <span className="user-name">{item.author.name}</span>
                    </div>
                  </td>
                  <td>{renderStatus(item.status)}</td>
                  <td>
                    <div className="action-group">
                      <button className="btn-icon btn-view" title="Xem chi tiết"><i className="fas fa-eye"></i></button>
                      {item.status === 'pending' && (
                        <>
                          <button className="btn-icon btn-check" title="Xác nhận vi phạm"><i className="fas fa-check"></i></button>
                          <button className="btn-icon btn-trash" title="Bỏ qua báo cáo"><i className="fas fa-times"></i></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination (Đã căn giữa) */}
        <div className="pagination-container">
          <div className="pagination">
            <button className="page-link">Trước</button>
            <button className="page-link active">1</button>
            <button className="page-link">2</button>
            <button className="page-link">3</button>
            <button className="page-link">Tiếp</button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ReportContent;