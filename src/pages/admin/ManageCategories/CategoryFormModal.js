import React, { useState, useEffect } from 'react';
import './manage_category.css'; // Dùng chung CSS

const CategoryFormModal = ({ isOpen, onClose, onSubmit, initialData, isSaving, title }) => {
    // State của form
    const [formData, setFormData] = useState({
        name: '',
        status: 'active'
    });

    // Reset hoặc fill dữ liệu khi mở modal
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // Chế độ Sửa
                setFormData({
                    name: initialData.name || '',
                    status: initialData.status || 'active'
                });
            } else {
                // Chế độ Thêm mới
                setFormData({ name: '', status: 'active' });
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {/* Input Tên */}
                        <div className="form-group">
                            <label>Tên danh mục <span className="text-danger">*</span></label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="Nhập tên..."
                                required
                            />
                        </div>

                        {/* Select Trạng thái */}
                        <div className="form-group">
                            <label>Trạng thái</label>
                            <select 
                                className="form-control"
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="active">Đang hoạt động</option>
                                <option value="inactive">Ngừng hoạt động</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
                        <button type="submit" className="btn-save" disabled={isSaving}>
                            {isSaving ? 'Đang lưu...' : 'Lưu lại'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryFormModal;