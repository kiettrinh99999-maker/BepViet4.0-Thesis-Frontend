import React, { useState, useRef } from 'react';
import './ConfigBody.css'; // File CSS ở bước 2

const ConfigBody = () => {
  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    siteName: 'Khám phá Ẩm thực Việt Nam',
    phone: '+84 123 456 789',
    email: 'contact@amthucviet.com',
    copyright: '© 2023 Khám phá Ẩm thực Việt Nam. Tất cả các quyền được bảo lưu.'
  });

  // State quản lý ảnh
  const [currentLogo] = useState('https://via.placeholder.com/250x120/2c3e50/ffffff?text=Ẩm+thực+Việt');
  const [newLogoPreview, setNewLogoPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Xử lý khi nhập liệu text
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý khi chọn ảnh mới (Preview)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewLogoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý Reset form
  const handleReset = () => {
    setFormData({
      siteName: 'Khám phá Ẩm thực Việt Nam',
      phone: '+84 123 456 789',
      email: 'contact@amthucviet.com',
      copyright: '© 2023 Khám phá Ẩm thực Việt Nam. Tất cả các quyền được bảo lưu.'
    });
    setNewLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input file
    alert('Đã đặt lại tất cả cấu hình về mặc định');
  };

  // Xử lý Lưu cấu hình
  const handleSave = () => {
    // Demo hiển thị thông báo (Sau này bạn sẽ thay bằng API call)
    let message = `Đã lưu cấu hình website:\n\n` +
                  `Tên website: ${formData.siteName}\n` +
                  `Số điện thoại: ${formData.phone}\n` +
                  `Email: ${formData.email}\n` +
                  `Bản quyền: ${formData.copyright}`;
    
    if (newLogoPreview) {
      message += `\n(Đã cập nhật logo mới)`;
    }
    
    alert(message);
  };

  // Trigger click input file ẩn khi bấm nút custom
  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="config-body">
      <h1 className="page-title">Cấu Hình Website</h1>

      <div className="website-config">
        <h3 className="config-title">Cấu hình thông tin website</h3>
        
        <form className="config-form" onSubmit={(e) => e.preventDefault()}>
          {/* Tên website */}
          <div className="form-group">
            <label className="form-label">Tên website *</label>
            <input 
              type="text" 
              name="siteName"
              className="form-control" 
              value={formData.siteName}
              onChange={handleChange}
              required 
            />
            <span className="form-help">Tên website sẽ hiển thị trên tab trình duyệt và các vị trí khác</span>
          </div>
          
          {/* Logo website */}
          <div className="form-group">
            <label className="form-label">Logo website</label>
            
            {/* Logo hiện tại */}
            <div className="current-image">
              <h4>Logo hiện tại:</h4>
              <img src={currentLogo} alt="Current Logo" className="image-preview" />
            </div>
            
            {/* Upload Logo mới */}
            <div className="image-upload-container">
              <div className="file-input-container">
                <button type="button" className="file-input-btn" onClick={triggerFileUpload}>
                  <i className="fas fa-upload"></i>
                  Chọn hình ảnh mới
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="file-input" 
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }} // Ẩn input gốc đi
                />
              </div>
              
              {/* Preview Logo mới (Chỉ hiện khi có ảnh) */}
              {newLogoPreview && (
                <div className="preview-section-img active">
                  <h4>Logo mới:</h4>
                  <img src={newLogoPreview} alt="New Logo Preview" className="new-image-preview" />
                </div>
              )}
            </div>
            <span className="form-help">Kích thước đề xuất: 250x120px, định dạng: PNG, JPG, SVG</span>
          </div>
          
          {/* Contact Information Row */}
          <div className="form-row-grid">
            {/* Số điện thoại */}
            <div className="form-group">
              <label className="form-label">Số điện thoại *</label>
              <input 
                type="tel" 
                name="phone"
                className="form-control" 
                value={formData.phone}
                onChange={handleChange}
                required 
              />
              <span className="form-help">Số điện thoại hỗ trợ khách hàng</span>
            </div>
            
            {/* Email liên hệ */}
            <div className="form-group">
              <label className="form-label">Email liên hệ *</label>
              <input 
                type="email" 
                name="email"
                className="form-control" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
              <span className="form-help">Email nhận thông tin liên hệ từ người dùng</span>
            </div>
          </div>
          
          {/* Bản quyền (Copyright) */}
          <div className="form-group">
            <label className="form-label">Bản quyền (Copyright) *</label>
            <input 
              type="text" 
              name="copyright"
              className="form-control" 
              value={formData.copyright}
              onChange={handleChange}
              required 
            />
            <span className="form-help">Thông tin bản quyền hiển thị ở cuối trang</span>
          </div>
          
          {/* Form Buttons */}
          <div className="form-buttons">
            <button type="button" className="btn btn-primary" onClick={handleSave}>Lưu cấu hình</button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>Đặt lại</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigBody;