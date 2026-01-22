import { useState, useEffect } from 'react';
import './manage_category.css';
import { useAuth } from '../../../contexts/Authen';
import CategoryFormModal from './CategoryFormModal';

export default function CategoryManagement() {
  const { api } = useAuth();
  
  // State quản lý dữ liệu và UI
  const [activeTab, setActiveTab] = useState('region');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // State cho Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Cấu hình Mapping
  const apiEndpoints = {
    region: 'regions',
    event: 'events',
    blog: 'blog-categories',
    meal: 'recipe-categories'
  };

  const tabNames = {
    region: 'Vùng miền',
    event: 'Sự kiện',
    blog: 'Danh mục blog',
    meal: 'Danh mục bữa ăn'
  };

  const tabIcons = {
    region: 'fas fa-map-marker-alt',
    event: 'fas fa-calendar-alt',
    blog: 'fas fa-blog',
    meal: 'fas fa-utensils'
  };

  // 1. Lấy danh sách
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const endpoint = apiEndpoints[activeTab];
      const response = await fetch(`${api}${endpoint}`);
      const result = await response.json();
      
      if (response.ok && result.success) {
        setCategories(result.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [activeTab, api]);

  // 2. Xử lý Mở Modal
  const openCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // 3. Xử lý Lưu (Thêm mới hoặc Cập nhật)
  const handleSave = async (formData) => {
    setIsSaving(true);
    const endpoint = apiEndpoints[activeTab];
    let url = `${api}${endpoint}`;
    let method = 'POST';

    if (editingItem) {
        url = `${api}${endpoint}/${editingItem.id}`;
        method = 'PUT';
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert(editingItem ? "Cập nhật thành công!" : "Thêm mới thành công!");
            setIsModalOpen(false);
            fetchCategories();
        } else {
            alert(result.message || "Có lỗi xảy ra");
        }
    } catch (error) {
        console.error("Lỗi lưu:", error);
        alert("Lỗi kết nối server");
    } finally {
        setIsSaving(false);
    }
  };


  // --- RENDER ---
  return (
    <div className="category-management-container">
      <h1 className="category-page-title">Quản Lý Danh Mục</h1>
      
      <div className="main-categories-tabs">
        <div className="tabs-header">
          {Object.keys(tabNames).map((tabId) => (
            <button 
              key={tabId}
              className={`tab-btn ${activeTab === tabId ? 'active' : ''}`}
              onClick={() => setActiveTab(tabId)}
            >
              <i className={tabIcons[tabId]}></i> {tabNames[tabId]}
            </button>
          ))}
        </div>
        
        <div className="subcategories-container active">
          <div className="subcategories-header">
            <h3 className="subcategories-title">Danh sách {tabNames[activeTab]}</h3>
            <button className="add-subcategory-btn" onClick={openCreateModal}>
              <i className="fas fa-plus"></i> Thêm mới
            </button>
          </div>
          
          <div className="subcategories-table-container">
            {isLoading ? (
                <div className="text-center p-4">Đang tải...</div>
            ) : (
                <table className="subcategories-table">
                    <thead>
                    <tr>
                        <th style={{width:'300px'}}>Tên</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.length > 0 ? categories.map((item) => (
                        <tr key={item.id}>
                        <td><div className="subcategory-name"><h4>{item.name}</h4></div></td>
                        <td>
                            <span className={`subcategory-status ${item.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                                {item.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                            </span>
                        </td>
                        <td>
                            <div className="table-actions">
                                <button className="table-action-btn btn-edit" onClick={() => openEditModal(item)}>
                                    <i className="fas fa-edit"></i> Sửa
                                </button>
                            </div>
                        </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="3" className="text-center p-4">Chưa có dữ liệu</td></tr>
                    )}
                    </tbody>
                </table>
            )}
          </div>
        </div>
      </div>

      <CategoryFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        initialData={editingItem}
        isSaving={isSaving}
        title={editingItem ? `Sửa ${tabNames[activeTab]}` : `Thêm ${tabNames[activeTab]} Mới`}
      />
    </div>
  );
};