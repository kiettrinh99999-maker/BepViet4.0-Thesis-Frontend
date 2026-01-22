import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/Authen';
import './Admin.css';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { api, login } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Sử dụng endpoint login giống user (hoặc endpoint riêng cho admin nếu backend có)
            const response = await fetch(`${api}auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    login: formData.username,
                    password: formData.password
                })
            });

            const result = await response.json();

            if (response.ok) {
                const user = result.data.user;
                if (user.role === 'admin' || user.is_admin === 1) { 
                    if(login) login(user, result.data.access_token);
                    else localStorage.setItem('token', result.data.access_token);
                    navigate('/admin'); 
                } else {
                    setError('Tài khoản này không có quyền truy cập trang quản trị.');
                    setLoading(false);
                }
            } else {
                setError(result.message || 'Tài khoản hoặc mật khẩu không đúng.');
            }

        } catch (err) {
            setError('Lỗi kết nối máy chủ. Vui lòng thử lại.');
        } finally {
            if(!error) setLoading(false);
        }
    };

    return (
        <div className="admin-login-body">
            <div className="admin-login-container">
                <div className="admin-login-header">
                    <div className="admin-logo">
                        <i className="fas fa-user-shield"></i>
                    </div>
                    <div className="admin-title">Quản Trị Viên</div>
                    <div className="admin-subtitle">Hệ thống quản lý Bếp Việt 4.0</div>
                </div>

                <form className="admin-login-form" onSubmit={handleLogin}>
                    <div className="admin-form-group">
                        <label className="admin-form-label">Tài khoản</label>
                        <div className="admin-input-group">
                            <i className="fas fa-user admin-input-icon"></i>
                            <input
                                type="text"
                                name="username"
                                className="admin-form-input"
                                placeholder="Nhập tên đăng nhập hoặc email"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="admin-form-group">
                        <label className="admin-form-label">Mật khẩu</label>
                        <div className="admin-input-group">
                            <i className="fas fa-lock admin-input-icon"></i>
                            <input
                                type="password"
                                name="password"
                                className="admin-form-input"
                                placeholder="Nhập mật khẩu"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="admin-form-options">
                        <label className="admin-checkbox-container">
                            <input type="checkbox" />
                            <span className="admin-checkmark"></span>
                            Ghi nhớ đăng nhập
                        </label>
                        <a href="#" className="admin-forgot-password">Quên mật khẩu?</a>
                    </div>

                    {error && (
                        <div className="admin-error-message show">
                            <i className="fas fa-exclamation-circle"></i> {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="admin-login-btn" 
                        disabled={loading}
                        style={loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                    >
                        {loading ? (
                            <span><i className="fas fa-spinner fa-spin"></i> Đang xử lý...</span>
                        ) : (
                            <span>Đăng Nhập <i className="fas fa-arrow-right"></i></span>
                        )}
                    </button>
                </form>

                <div className="admin-login-footer">
                    <p>&copy; 2026 Bếp Việt 4.0 - Admin Panel</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;