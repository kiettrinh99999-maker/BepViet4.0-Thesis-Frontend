import React, { useState, useRef, useEffect } from 'react';
import './ConfigBody.css';
import { useAuth } from '../../../contexts/Authen';
const ConfigBody = () => {
  // 1. State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    phone: '',
    email: '',
    copyright: ''
  });
  
  const [loading, setLoading] = useState(false);

  // State quản lý ảnh
  const [currentLogo, setCurrentLogo] = useState('');
  const [newLogoPreview, setNewLogoPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);
  const { api, store } = useAuth();

  // 2. FETCH DATA: Lấy cấu hình khi load trang (Dùng FETCH)
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${api}config`);
        
        if (!response.ok) throw new Error('Lỗi kết nối server');
        
        const result = await response.json();

        // Kiểm tra cấu trúc response trả về từ API Laravel của bạn
        if (result.success && result.data && result.data.data.length > 0) {
          const config = result.data.data[0];
          
          setFormData({
            id: config.id,
            name: config.name,
            phone: config.phone,
            email: config.email,
            copyright: config.copyright
          });
          
          // Set logo hiện tại
          if (config.image_path) {
             // Xử lý trường hợp DB lưu full URL hoặc relative path
             const imgUrl = config.image_path.startsWith('http') 
                ? config.image_path 
                : `${store}/${config.image_path.replace(/^\//, '')}`; // Bỏ dấu / đầu nếu có
             setCurrentLogo(imgUrl);
          }
        }
      } catch (error) {
        console.error("Lỗi tải cấu hình:", error);
      }
    };
    fetchConfig();
  }, []);

  // Xử lý nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Xử lý chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewLogoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 3. LƯU CẤU HÌNH (Dùng FETCH)
  const handleSave = async () => {
    if (!formData.id) {
        alert("Chưa tải được thông tin cấu hình!");
        return;
    }

    setLoading(true);
    
    // Tạo FormData
    const dataToSend = new FormData();
    dataToSend.append('name', formData.name);
    dataToSend.append('phone', formData.phone);
    dataToSend.append('email', formData.email);
    dataToSend.append('copyright', formData.copyright);
    
    // Nếu có file mới thì gửi, không thì thôi
    if (selectedFile) {
        dataToSend.append('image', selectedFile);
    }

    // Giả lập PUT bằng POST vì HTML Form không hỗ trợ PUT trực tiếp khi upload file
    dataToSend.append('_method', 'PUT');

    try {
      const response = await fetch(`${api}config/${formData.id}`, {
        method: 'POST',
        body: dataToSend,
        // LƯU Ý: KHÔNG set Content-Type header ở đây để browser tự xử lý boundary
        headers: {
            'Accept': 'application/json',
            // 'Authorization': `Bearer ${token}` // Bỏ comment nếu có token
        }
      });
      const result = await response.json();

      // Nếu server trả về lỗi 422 (Validate fail)
      if (response.status === 422) {
          // Laravel trả về cấu trúc lỗi: { message: "...", errors: { email: [...], name: [...] } }
          // Hoặc cấu trúc BaseCRUDController: { success: false, message: "...", errors: [...] }
          
          let errorMsg = result.message || 'Dữ liệu không hợp lệ';
          
          // Nếu có danh sách lỗi chi tiết (errors object)
          if (result.errors) {
              // Gộp các lỗi lại thành chuỗi dễ đọc
              const detailErrors = Object.values(result.errors).flat().join('\n- ');
              errorMsg += `:\n- ${detailErrors}`;
          }
          
          alert(errorMsg); // Hiển thị lỗi cụ thể cho người dùng thấy
          return; // Dừng hàm
      }

      if (!response.ok) {
         throw new Error(`Lỗi HTTP: ${response.status}`);
      }
    

    //   const result = await response.json();

      if (result.success) {
        alert('Đã lưu cấu hình thành công!');
        
        // Cập nhật lại giao diện sau khi lưu
        if (result.data.image_path) {
            // Cập nhật logo mới ngay lập tức
            const newImgPath = result.data.image_path.startsWith('http') 
                ? result.data.image_path 
                : `${store}/${result.data.image_path.replace(/^\//, '')}`;
            
            setCurrentLogo(newImgPath);
            setNewLogoPreview(null);
            setSelectedFile(null);
            
            // Reset input file để có thể chọn lại file khác nếu muốn
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
      } else {
        alert(result.message || 'Có lỗi xảy ra khi lưu');
      }

    } catch (error) {
      console.error("Lỗi lưu cấu hình:", error);
      alert('Lưu thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if(window.confirm("Bạn có muốn tải lại trang để hủy các thay đổi?")) {
        window.location.reload();
    }
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
              name="name"
              className="form-control" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          
          {/* Logo website */}
          <div className="form-group">
            <label className="form-label">Logo website</label>
            
            <div className="current-image">
              <h4>Logo hiện tại:</h4>
              {currentLogo ? (
                  <img src={currentLogo} alt="Current Logo" className="image-preview" />
              ) : <p className="text-muted">Chưa có logo</p>}
            </div>
            
            <div className="image-upload-container">
              <div className="file-input-container">
                <button type="button" className="file-input-btn" onClick={() => fileInputRef.current.click()}>
                  <i className="fas fa-upload"></i>
                  Chọn hình ảnh mới
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="file-input" 
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </div>
              
              {newLogoPreview && (
                <div className="preview-section-img active">
                  <h4>Logo mới:</h4>
                  <img src={newLogoPreview} alt="Preview" className="new-image-preview" />
                </div>
              )}
            </div>
          </div>
          
          {/* Thông tin liên hệ */}
          <div className="form-row-grid">
            <div className="form-group">
              <label className="form-label">Số điện thoại *</label>
              <input 
                type="tel" 
                name="phone"
                className="form-control" 
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email liên hệ *</label>
              <input 
                type="email" 
                name="email"
                className="form-control" 
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {/* Copyright */}
          <div className="form-group">
            <label className="form-label">Bản quyền *</label>
            <input 
              type="text" 
              name="copyright"
              className="form-control" 
              value={formData.copyright}
              onChange={handleChange}
            />
          </div>
          
          {/* Buttons */}
          <div className="form-buttons">
            <button type="button" className="btn btn-primary" onClick={handleSave} disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu cấu hình'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>Đặt lại</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigBody;