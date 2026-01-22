import React, { useRef, useState, useEffect } from 'react';
import styles from './ProfileBody.module.css'; // Import Module CSS
import { useAuth } from '../../contexts/Authen';

const UpdateProfile = ({ isOpen, onClose, userProfile, onSave,token }) => {
  const { api } = useAuth(); // Lấy api từ Context
  const fileInputRef = useRef(null);
  
  // State quản lý form
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // Lưu file gốc để gửi lên server
  const [isSaving, setIsSaving] = useState(false);

  // Cập nhật state khi userProfile thay đổi (khi mở modal)
  useEffect(() => {
    if (userProfile && isOpen) {
        setFormData({
            name: userProfile.name || '',
            phone: userProfile.phone || '',
            email: userProfile.email || ''
        });
        setAvatarPreview(userProfile.avatar);
        setSelectedFile(null); // Reset file khi mở lại modal
    }
  }, [userProfile, isOpen]);

  if (!isOpen) return null;

  // Xử lý khi chọn ảnh từ máy tính
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Lưu file để gửi API
      
      // Tạo URL ảo để xem trước ảnh ngay lập tức
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Xử lý Submit Form lên Server
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
        // Sử dụng FormData để gửi được cả Text và File
        const data = new FormData();
        data.append('name', formData.name);
        data.append('phone', formData.phone);
        
        if (selectedFile) {
            data.append('avatar', selectedFile);
        }

        // Gọi API: POST /api/profile (Hoặc PUT tùy backend của bạn)
        // Lưu ý: Không cần set Content-Type header, fetch tự động set multipart/form-data
        const response = await fetch(`${api}auth/profile/update`, {
            method: 'POST', 
            headers: { 'Authorization': `Bearer ${token}` },
            body: data, 
        });

        const result = await response.json();

        if (result.success) {
            // Gọi hàm onSave của cha để cập nhật giao diện Profile bên ngoài ngay lập tức
            onSave({
                name: formData.name,
                phone: formData.phone,
                avatar: avatarPreview // Cập nhật ảnh hiển thị bằng ảnh vừa chọn
            });
            onClose(); // Đóng modal
        } else {
            alert(result.message || 'Cập nhật thất bại');
        }
    } catch (error) {
        console.error("Lỗi cập nhật:", error);
        alert('Lỗi kết nối server');
    } finally {
        setIsSaving(false);
    }
  };

  return (
    // Sử dụng class từ Module CSS
    <div className={styles.modalOverlay} onClick={(e) => e.target.className === styles.modalOverlay && onClose()}>
        <div className={styles.modal}>
            <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Chỉnh sửa thông tin cá nhân</h2>
                <button className={styles.modalClose} onClick={onClose}>&times;</button>
            </div>
            
            <div className={styles.modalBody}>
                <form onSubmit={handleSubmit}>
                    
                    {/* --- KHU VỰC ẢNH ĐẠI DIỆN (GIỐNG MẪU) --- */}
                    <div className={styles.avatarUploadWrapper}>
                        <div className={styles.avatarPreviewCircle}>
                            <img 
                                src={avatarPreview || '/logo512.png'} 
                                alt="Avatar Preview" 
                                className={styles.avatarPreviewImg} 
                                onError={(e)=>{e.target.onerror=null;e.target.src='/logo512.png'}} 
                            />
                        </div>
                        
                        {/* Nút bấm kích hoạt input file */}
                        <button type="button" className={styles.btnChangeAvatar} onClick={() => fileInputRef.current.click()}>
                            <i className="fas fa-camera"></i> Thay đổi ảnh đại diện
                        </button>
                        
                        {/* Input file ẩn */}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            style={{display: 'none'}} 
                            onChange={handleAvatarChange} 
                            accept="image/*"
                        />
                    </div>

                    {/* --- FORM NHẬP LIỆU --- */}
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Họ và tên</label>
                        <input 
                            type="text" 
                            className={styles.formControl} 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required 
                            placeholder="Nhập họ tên của bạn"
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Số điện thoại</label>
                        <input 
                            type="tel" 
                            className={styles.formControl} 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="Nhập số điện thoại"
                        />
                    </div>
                    

                    {/* Footer Actions */}
                    <div className={styles.modalFooter}>
                        <button type="button" className={styles.btnOutline} onClick={onClose}>Hủy bỏ</button>
                        <button type="submit" className={styles.btnPrimary} disabled={isSaving}>
                            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};

export default UpdateProfile;