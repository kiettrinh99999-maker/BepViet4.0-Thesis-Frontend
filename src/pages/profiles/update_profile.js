import React, { useRef, useState } from 'react';

const UpdateProfile = ({ isOpen, onClose, userProfile, onSave }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: userProfile.name,
    phone: userProfile.phone,
    email: userProfile.email
  });
  const [avatarPreview, setAvatarPreview] = useState(userProfile.avatar);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Gọi hàm lưu ở cha và truyền data mới lên
    onSave({ ...formData, avatar: avatarPreview });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="custom-modal-overlay" onClick={(e) => e.target.className === 'custom-modal-overlay' && onClose()}>
        <div className="custom-modal">
            <div className="custom-modal-header">
                <h2 className="custom-modal-title">Chỉnh sửa hồ sơ</h2>
                <button className="custom-modal-close" onClick={onClose}>&times;</button>
            </div>
            <div className="custom-modal-body">
                <form onSubmit={handleSubmit}>
                    <div className="avatar-upload">
                        <div className="avatar-preview">
                            <img src={avatarPreview} alt="Preview" />
                        </div>
                        <button type="button" className="btn btn-outline" onClick={() => fileInputRef.current.click()}>
                            <i className="fas fa-camera"></i> Thay ảnh
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            style={{display: 'none'}} 
                            onChange={handleAvatarChange} 
                            accept="image/*"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Họ và tên *</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Số điện thoại *</label>
                        <input 
                            type="tel" 
                            className="form-control" 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email (Không thể sửa)</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            value={formData.email}
                            disabled 
                            style={{backgroundColor: '#f5f5f5'}}
                        />
                    </div>
                    <div className="custom-modal-footer">
                        <button type="button" className="btn btn-outline" onClick={onClose}>Hủy</button>
                        <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};

export default UpdateProfile;