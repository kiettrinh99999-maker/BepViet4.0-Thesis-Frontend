import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/Authen';
import './ManageUser.css';

const ManageUser = () => {
    const { api, token } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- 1. LẤY DỮ LIỆU TỪ API ---
    const fetchUsers = async () => {
        try {
            setLoading(true);
            // Gọi route: GET /api/auth/manage-users
            const response = await fetch(`${api}auth/manage-users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const result = await response.json();
            
            if (result.success) {
                setUsers(result.data); 
            } else {
                console.error("Lỗi:", result.message);
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [api, token]);

    // --- 2. XỬ LÝ KHÓA / MỞ KHÓA ---
    const handleToggleStatus = async (id, currentStatus) => {
        const action = currentStatus === 'active' ? 'KHÓA' : 'MỞ KHÓA';
        if (!window.confirm(`Bạn có chắc chắn muốn ${action} tài khoản này?`)) return;

        try {
            // Gọi route: PATCH /api/auth/users/{id}/toggle-status
            const response = await fetch(`${api}auth/users/${id}/toggle-status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();

            if (response.ok && result.success) {
                // Cập nhật giao diện ngay lập tức
                setUsers(users.map(user => 
                    user.id === id ? { ...user, status: result.data.status } : user
                ));
                alert(result.message);
            } else {
                alert(result.message || 'Lỗi xử lý');
            }
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Lỗi kết nối server");
        }
    };

    // Helper: Xử lý link ảnh
    const getAvatarUrl = (path) => {
        if (!path) return null;
        return path.startsWith('http') ? path : `${api.replace('/api/', '/storage/')}${path}`;
    };

    if (loading) return <div className="manage-user-container" style={{textAlign:'center', paddingTop:'50px'}}>Đang tải dữ liệu...</div>;

    return (
        <div className="manage-user-container">
            {/* Tiêu đề đơn giản */}
            <div className="page-title">
                <h1>Quản Lý Người Dùng <span>(Tổng: {users.length})</span></h1>
            </div>

            {/* Bảng dữ liệu */}
            <div className="table-container">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th style={{width: '40%'}}>Thông tin người dùng</th>
                            <th style={{width: '15%'}}>Vai trò</th>
                            <th style={{width: '15%'}}>Ngày tham gia</th>
                            <th style={{width: '15%'}}>Trạng thái</th>
                            <th style={{width: '15%', textAlign: 'right'}}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map(user => {
                                const displayName = user.profile?.name || user.username;
                                const displayPhone = user.profile?.phone || '---';
                                const avatarUrl = getAvatarUrl(user.profile?.image_path);

                                return (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="user-cell">
                                                {avatarUrl ? (
                                                    <img src={avatarUrl} alt={displayName} className="user-avatar" />
                                                ) : (
                                                    <div className="user-avatar">{displayName.charAt(0).toUpperCase()}</div>
                                                )}
                                                <div className="user-details">
                                                    <h4>{displayName}</h4>
                                                    <p>{user.email}</p>
                                                    <p style={{fontSize: '0.8rem', color: '#999'}}>{displayPhone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                                                {user.role === 'admin' ? 'Quản trị' : 'Thành viên'}
                                            </span>
                                        </td>
                                        <td>{new Date(user.created_at).toLocaleDateString('vi-VN')}</td>
                                        <td>
                                            <span className={`badge ${user.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                                                {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                                            </span>
                                        </td>
                                        <td style={{textAlign: 'right'}}>
                                            <button 
                                                className={`action-btn ${user.status === 'active' ? 'btn-lock' : 'btn-unlock'}`}
                                                onClick={() => handleToggleStatus(user.id, user.status)}
                                            >
                                                {user.status === 'active' ? (
                                                    <><i className="fas fa-lock"></i> Khóa</>
                                                ) : (
                                                    <><i className="fas fa-unlock"></i> Mở</>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" style={{textAlign: 'center', padding: '30px'}}>Không có dữ liệu</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUser;