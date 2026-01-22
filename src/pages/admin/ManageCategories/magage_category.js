import { useState } from 'react';
import './manage_category.css';

export default function CategoryManagement(){
  const [activeTab, setActiveTab] = useState('meal');
  
  // Dữ liệu mẫu cho các danh mục
  const categoriesData = {
    region: [
      { id: 1, name: 'Miền Bắc', status: 'active' },
      { id: 2, name: 'Miền Trung', status: 'active' },
      { id: 3, name: 'Miền Nam', status: 'active' }
    ],
    event: [
      { id: 1, name: 'Tết Nguyên Đán', status: 'active' },
      { id: 2, name: 'Trung thu', status: 'active' },
      { id: 3, name: 'Ngày thường', status: 'active' }
    ],
    blog: [
      { id: 1, name: 'Trải nghiệm ẩm thực', status: 'active' },
      { id: 2, name: 'Lịch sử ẩm thực', status: 'active' }
    ],
    meal: [
      { id: 1, name: 'Bữa sáng', status: 'active' },
      { id: 2, name: 'Bữa trưa', status: 'active' },
      { id: 3, name: 'Bữa tối', status: 'active' }
    ]
  };

  // Tên hiển thị của các tab
  const tabNames = {
    region: 'Vùng miền',
    event: 'Sự kiện',
    blog: 'Danh mục blog',
    meal: 'Danh mục bữa ăn'
  };

  // Icon cho các tab
  const tabIcons = {
    region: 'fas fa-map-marker-alt',
    event: 'fas fa-calendar-alt',
    blog: 'fas fa-blog',
    meal: 'fas fa-utensils'
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleAddCategory = () => {
    const tabName = tabNames[activeTab];
    alert(`Mở form thêm ${tabName.toLowerCase()} mới`);
  };

  const handleEditCategory = (categoryName) => {
    alert(`Chỉnh sửa: ${categoryName}`);
  };

  const handleDeleteCategory = (categoryName) => {
    // if (confirm(`Bạn có chắc muốn xóa: "${categoryName}"?`)) {
    //   alert(`Đã xóa: ${categoryName}`);
    // }
  };

  const getStatusBadgeClass = (status) => {
    return status === 'active' 
      ? 'subcategory-status status-active' 
      : 'subcategory-status status-inactive';
  };

  const getStatusText = (status) => {
    return status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động';
  };

  const renderCategoryTable = () => {
    const categories = categoriesData[activeTab];
    
    return (
      <table className="subcategories-table">
        <thead>
          <tr>
            <th style={{ width: '300px' }}>Tên {tabNames[activeTab].toLowerCase()}</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>
                <div className="subcategory-name">
                  <h4>{category.name}</h4>
                </div>
              </td>
              <td>
                <span className={getStatusBadgeClass(category.status)}>
                  {getStatusText(category.status)}
                </span>
              </td>
              <td>
                <div className="table-actions">
                  <button 
                    className="table-action-btn btn-edit"
                    onClick={() => handleEditCategory(category.name)}
                  >
                    <i className="fas fa-edit"></i>
                    Sửa
                  </button>
                  <button 
                    className="table-action-btn btn-delete"
                    onClick={() => handleDeleteCategory(category.name)}
                  >
                    <i className="fas fa-trash"></i>
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="category-management-container">
      <h1 className="category-page-title">Quản Lý Danh Mục</h1>
      
      {/* Main Categories Tabs */}
      <div className="main-categories-tabs">
        <div className="tabs-header">
          {Object.keys(tabNames).map((tabId) => (
            <button 
              key={tabId}
              className={`tab-btn ${activeTab === tabId ? 'active' : ''}`}
              onClick={() => handleTabClick(tabId)}
            >
              <i className={tabIcons[tabId]}></i>
              {tabNames[tabId]}
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        <div className="subcategories-container active">
          <div className="subcategories-header">
            <h3 className="subcategories-title">Danh sách {tabNames[activeTab].toLowerCase()}</h3>
            <button 
              className="add-subcategory-btn"
              onClick={handleAddCategory}
            >
              <i className="fas fa-plus"></i>
              Thêm {tabNames[activeTab].toLowerCase()} mới
            </button>
          </div>
          
          <div className="subcategories-table-container">
            {renderCategoryTable()}
          </div>
        </div>
      </div>
    </div>
  );
};