import React, { useState } from 'react';
import './ProfileBody.css';

// Import các sub-component
import MyRecipes from './my_recipes';
import MyBlogs from './my_blogs';
import MyCollections from './my_collections';
import UpdateProfile from './update_profile';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('recipes'); // 'recipes', 'blogs', 'collections'
  const [showEditModal, setShowEditModal] = useState(false);

  // State thông tin user (Dữ liệu giả)
  const [userProfile, setUserProfile] = useState({
    name: 'Nguyễn Văn',
    email: 'nguyenvan@example.com',
    phone: '0912345678',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=80',
    stats: {
      recipes: 24,
      blogs: 12,
      followers: 347,
      following: 56
    }
  });

  // Hàm xử lý cập nhật profile từ Modal
  const handleUpdateProfile = (newData) => {
    setUserProfile(prev => ({
        ...prev,
        ...newData
    }));
    alert("Đã cập nhật thông tin thành công!");
    setShowEditModal(false);
  };

  return (
    <div className="profile-body-container">
      <div className="container">
        
        {/* --- 1. HEADER PROFILE --- */}
        <div className="profile-header">
            <div className="profile-info">
                <div className="profile-avatar">
                    <img src={userProfile.avatar} alt={userProfile.name} className="profile-avatar-img" />
                    <button className="avatar-edit-btn" onClick={() => setShowEditModal(true)}>
                        <i className="fas fa-camera"></i>
                    </button>
                </div>
                <div className="profile-details">
                    <h1 className="profile-name">{userProfile.name}</h1>
                    <div className="profile-stats">
                        <div className="stat-item">
                            <span className="stat-number">{userProfile.stats.recipes}</span>
                            <span className="stat-label">Công thức</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{userProfile.stats.blogs}</span>
                            <span className="stat-label">Blog</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{userProfile.stats.followers}</span>
                            <span className="stat-label">Người theo dõi</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{userProfile.stats.following}</span>
                            <span className="stat-label">Đang theo dõi</span>
                        </div>
                    </div>
                    <div className="profile-actions">
                        <button className="btn btn-primary" onClick={() => setShowEditModal(true)}>
                            <i className="fas fa-edit"></i> Chỉnh sửa hồ sơ
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* --- 2. TABS NAVIGATION --- */}
        <div className="profile-tabs">
            <div className="tabs-header">
                <button 
                    className={`tab-btn ${activeTab === 'recipes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('recipes')}
                >
                    <i className="fas fa-utensils"></i> Công thức
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'blogs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('blogs')}
                >
                    <i className="fas fa-pencil-alt"></i> Blog
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'collections' ? 'active' : ''}`}
                    onClick={() => setActiveTab('collections')}
                >
                    <i className="fas fa-bookmark"></i> Bộ sưu tập
                </button>
            </div>

            {/* --- 3. TAB CONTENT --- */}
            <div className="tab-content">
                {activeTab === 'recipes' && <MyRecipes />}
                {activeTab === 'blogs' && <MyBlogs />}
                {activeTab === 'collections' && <MyCollections />}
            </div>
        </div>

        {/* --- 4. MODAL EDIT PROFILE --- */}
        <UpdateProfile 
            isOpen={showEditModal} 
            onClose={() => setShowEditModal(false)}
            userProfile={userProfile}
            onSave={handleUpdateProfile}
        />

      </div>
    </div>
  );
};

export default Profile;