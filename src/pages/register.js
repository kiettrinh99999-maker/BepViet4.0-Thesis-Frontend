import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import { useAuth } from '../contexts/Authen';

const Register = () => {
  const navigate = useNavigate();
  const {api}=useAuth();

  // State quản lý
  const [formData, setFormData] = useState({
    username: '', 
    email: '', 
    password: '', 
    password_confirmation: '',
    region_id: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passStrength, setPassStrength] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- HÀM KIỂM TRA ĐỘ MẠNH MẬT KHẨU ---
  const checkStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score < 2) return 'weak';
    if (score < 4) return 'medium';
    return 'strong';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') setPassStrength(checkStrength(value));
    if (error) setError('');
  };

  // --- XỬ LÝ ĐĂNG KÝ FORM ---
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.password_confirmation) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    setError('');

    try {
        console.log(formData)
      const response = await fetch(`${api}auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        // Xử lý lỗi từ server
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join(', ');
          setError(errorMessages);
        } else {
          setError(result.message || 'Đăng ký thất bại');
        }
        return;
      }

      if (result.success) {
        // Đăng ký thành công
        alert('Đăng ký thành công!');
        
        // Lưu token nếu có
        if (result.data?.access_token) {
          localStorage.setItem('auth_token', result.data.access_token);
        }
        
        // Chuyển đến trang login
        navigate('/login');
      }

    } catch (err) {
      console.error('Register error:', err);
      setError('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  // --- XỬ LÝ ĐĂNG KÝ GOOGLE ---
  const handleGoogleRegister = () => {
    window.location.href = `${api}auth/google`;
  };

  return (
    <div className="register-wrapper">
      <div className="back-to-home">
        <Link to="/" className="back-link"><i className="fas fa-arrow-left"></i> Trang chủ</Link>
      </div>

      <div className="register-card">
        <div className="register-header">
          <div className="register-logo">
            <div className="register-logo-icon"><i className="fas fa-utensils"></i></div>
            Bếp Việt 4.0
          </div>
          <p style={{marginTop: '5px', opacity: 0.9}}>Khám phá – Chia sẻ – Gìn giữ tinh hoa</p>
        </div>

        <div className="register-body">
          <form onSubmit={handleRegister}>
            <h2 className="register-title">Đăng Ký Tài Khoản</h2>
            
            {error && (
              <div className="alert alert-error">
                <i className="fas fa-exclamation-circle"></i> {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label required">Tên người dùng</label>
              <input 
                type="text" 
                name="username" 
                className="form-input" 
                required 
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Email</label>
              <input 
                type="email" 
                name="email" 
                className="form-input" 
                required 
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Mật khẩu</label>
              <div className="password-container">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  className="form-input" 
                  required 
                  value={formData.password}
                  onChange={handleChange}
                />
                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              {formData.password && (
                <div className="password-strength">
                  <span>Độ mạnh:</span>
                  <div className="strength-bar">
                    <div className={`strength-fill ${passStrength}`}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label required">Xác nhận mật khẩu</label>
              <div className="password-container">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="password_confirmation" 
                  className="form-input" 
                  required 
                  value={formData.password_confirmation}
                  onChange={handleChange}
                />
                <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-register" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Đang xử lý...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus"></i> Đăng Ký
                </>
              )}
            </button>

            <div className="register-divider"><span>Hoặc đăng ký với</span></div>

            <button type="button" className="btn btn-google" onClick={handleGoogleRegister}>
              <i className="fab fa-google" style={{color: '#DB4437'}}></i> Google
            </button>

            <div style={{textAlign: 'center', marginTop: '20px'}}>
              Đã có tài khoản? <Link to="/login" style={{color: '#d32f2f'}}>Đăng nhập</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;