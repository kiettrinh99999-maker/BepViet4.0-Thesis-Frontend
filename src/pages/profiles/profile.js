import React, { useState, useEffect } from 'react';
import styles from './ProfileBody.module.css'; // Import Module CSS
import { useAuth } from '../../contexts/Authen';
import MyRecipes from './my_recipes';
import MyBlogs from './my_blogs';
import MyCollections from './my_collections';
import UpdateProfile from './update_profile';
const Profile = () => {
  const { token,api, store } = useAuth();
  const [activeTab, setActiveTab] = useState('recipes');
  const [showEditModal, setShowEditModal] = useState(false);
  const [myRecipes, setMyRecipes] = useState([]);
  const [myBlogs, setMyBlogs] = useState([]);
  const [myCollections, setMyCollections] = useState([]);
  const [userProfile, setUserProfile] = useState({
    name: 'Đang tải...',
    email: '',
    phone: '',
    avatar: '/images.png',
    stats: { recipes_count: 0, blogs_count: 0, followers_count: 0, following_count: 0 }
  });

  const fetchProfile = async () => {
      try {
        const response = await fetch(`${api}auth/profile`, {
            headers: { 'Accept': 'application/json','Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.success) {
            const data = result.data;
            setUserProfile({
                name: data.name,
                email: data.email,
                phone: data.phone,
                avatar: data.avatar ? `${store}/${data.avatar}` : '/images.png',
                stats: data.stats
            });
            setMyRecipes(data.recipes || []);
            setMyBlogs(data.blogs || []);
            setMyCollections(data.collections || []);
        }
      } catch (error) { console.error("Lỗi:", error); }
  };

  useEffect(() => { fetchProfile(); }, [api, store]);

  const handleUpdateProfile = (newData) => {
    setUserProfile(prev => ({ ...prev, ...newData }));
    fetchProfile();
    alert("Đã cập nhật thông tin thành công!");
    setShowEditModal(false);
  };

  const handleRemoveRecipe = (deletedId) => {
    setMyRecipes(prev => prev.filter(item => item.id !== deletedId));
    setUserProfile(prev => ({...prev, stats: {...prev.stats, recipes_count: prev.stats.recipes_count - 1}}));
  };

  const handleRemoveBlog = (deletedId) => {
    setMyBlogs(prev => prev.filter(item => item.id !== deletedId));
    setUserProfile(prev => ({...prev, stats: {...prev.stats, blogs_count: prev.stats.blogs_count - 1}}));
  };

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.container}>
        
        {/* HEADER */}
        <div className={styles.profileHeader}>
            <div className={styles.profileInfo}>
                <div className={styles.profileAvatar}>
                    <img src={userProfile.avatar} alt={userProfile.name} className={styles.profileAvatarImg} onError={(e) => { e.target.onerror = null; e.target.src = '/logo512.png'; }} />
                    <button className={styles.avatarEditBtn} onClick={() => setShowEditModal(true)}>
                        <i className="fas fa-camera"></i>
                    </button>   
                </div>
                <div className={styles.profileDetails}>
                    <h1 className={styles.profileName}>{userProfile.name}</h1>
                    <div className={styles.profileStats}>
                        <div className={styles.statItem}><span className={styles.statNumber}>{userProfile.stats.recipes_count}</span><span className={styles.statLabel}>Công thức</span></div>
                        <div className={styles.statItem}><span className={styles.statNumber}>{userProfile.stats.blogs_count}</span><span className={styles.statLabel}>Blog</span></div>
                        <div className={styles.statItem}><span className={styles.statNumber}>{userProfile.stats.followers_count}</span><span className={styles.statLabel}>Người theo dõi</span></div>
                        <div className={styles.statItem}><span className={styles.statNumber}>{userProfile.stats.following_count}</span><span className={styles.statLabel}>Đang theo dõi</span></div>
                    </div>
                    <div className={styles.profileActions}>
                        <button className={styles.btnPrimary} onClick={() => setShowEditModal(true)}>
                            <i className="fas fa-edit"></i> Chỉnh sửa hồ sơ
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* TABS */}
        <div className={styles.profileTabs}>
            <div className={styles.tabsHeader}>
                <button className={`${styles.tabBtn} ${activeTab === 'recipes' ? styles.active : ''}`} onClick={() => setActiveTab('recipes')}><i className="fas fa-utensils"></i> Công thức</button>
                <button className={`${styles.tabBtn} ${activeTab === 'blogs' ? styles.active : ''}`} onClick={() => setActiveTab('blogs')}><i className="fas fa-pencil-alt"></i> Blog</button>
                <button className={`${styles.tabBtn} ${activeTab === 'collections' ? styles.active : ''}`} onClick={() => setActiveTab('collections')}><i className="fas fa-bookmark"></i> Bộ sưu tập</button>
            </div>

            <div className={styles.tabContent}>
                {/* Truyền styles xuống con để chúng dùng chung Module CSS */}
                {activeTab === 'recipes' && <MyRecipes styles={styles} recipes={myRecipes} store={store} api={api} token = {token} onDeleteSuccess={handleRemoveRecipe} />}
                {activeTab === 'blogs' && <MyBlogs styles={styles} blogs={myBlogs} store={store} api={api} token = {token} onDeleteSuccess={handleRemoveBlog} />}
                {activeTab === 'collections' && <MyCollections styles={styles} collections={myCollections} token = {token} store={store} api={api} onRefreshProfile={fetchProfile} />}
            </div>
        </div>

        <UpdateProfile isOpen={showEditModal} onClose={() => setShowEditModal(false)} userProfile={userProfile} token = {token} onSave={handleUpdateProfile} />
      </div>
    </div>
  );
};

export default Profile;