import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Authen';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const {  login, isAuthenticated, user, api } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        remember: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [id]: type === 'checkbox' ? checked : value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage({ type: '', content: '' });

        setLoading(true);
        try {
            const response = await fetch(api + 'auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    login: formData.username,
                    password: formData.password,
                })
            });

            const result = await response.json();
            if (response.ok) {
                setMessage({ type: 'success', content: 'Đăng nhập thành công!' });
                login(result.data.user, result.data.access_token);
                setTimeout(() => navigate('/'), 1000);
            } else {
                setMessage({ type: 'error', content: result.message || 'Sai tên đăng nhập hoặc mật khẩu.' });
            }

        } catch (error) {
            setMessage({ type: 'error', content: 'Lỗi kết nối máy chủ.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper-page">
            {/* 1. Nút Quay lại (Đã thêm lại) */}
            <div className="back-to-home">
                <Link to="/" className="back-link">
                    <i className="fas fa-arrow-left"></i> Trang chủ
                </Link>
            </div>

            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="login-logo">
                            <div className="login-logo-icon">
                                <i className="fas fa-utensils"></i>
                            </div>
                            Bếp Việt 4.0
                        </div>
                        <div className="login-subtitle">Tinh hoa ẩm thực Việt Nam</div>
                    </div>

                    <div className="login-body">
                        <h1 className="login-title">Đăng Nhập</h1>

                        {message.content && (
                            <div className={`form-message ${message.type}`}>
                                <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                                {' '}{message.content}
                            </div>
                        )}

                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="username">Tài khoản</label>
                                <input
                                    type="text"
                                    id="username"
                                    className="form-input"
                                    placeholder="Email hoặc tên đăng nhập"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="password">Mật khẩu</label>
                                <div className="password-container">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        className="form-input"
                                        placeholder="Nhập mật khẩu"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                            </div>

                            <div className="form-options">
                                <div className="remember-me">

                                </div>
                                <Link to="/forgot-password" class="forgot-password">Quên mật khẩu?</Link>
                            </div>

                            <button type="submit" className="btn btn-login" disabled={loading}>
                                {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-sign-in-alt"></i>}
                                {loading ? ' Đang xử lý...' : ' Đăng Nhập'}
                            </button>

                            <div className="login-divider">
                                <span>Hoặc</span>
                            </div>

                            <button type="button" className="btn btn-google">
                                <i className="fab fa-google google-icon"></i> Google
                            </button>
                        </form>

                        <div className="register-link">
                            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                        </div>
                    </div>

                    {/* 2. Footer (Đã thêm lại) */}
                    <div className="login-footer">
                        <p>© 2028 Bếp Việt 4.0 - Câu lạc bộ ẩm thực Việt Nam</p>
                        <p>Hotline: 1900 1234 | Email: contact@bepviet40.vn</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;