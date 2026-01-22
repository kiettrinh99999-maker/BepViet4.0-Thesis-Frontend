import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MyCollections = ({ collections, store, api, onRefreshProfile, styles,token }) => {
    const navigate = useNavigate();

    // --- STATE QUẢN LÝ ---
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    
    const [modalMode, setModalMode] = useState('create');
    const [editingId, setEditingId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const [formData, setFormData] = useState({ name: '', image: null });
    const [previewImage, setPreviewImage] = useState(null);

    const [currentCollection, setCurrentCollection] = useState(null);
    const [detailRecipes, setDetailRecipes] = useState([]);

    // --- LOGIC XEM CHI TIẾT ---
    const handleViewDetail = async (id) => {
        try {
            const response = await fetch(`${api}auth/collections/${id}`,{
                 method: 'GET',
                headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
            const result = await response.json();
            if (result.success) {
                setCurrentCollection(result.data);
                setDetailRecipes(result.data.recipes || []);
                setShowDetailModal(true);
            } else {
                alert(result.message);
            }
        } catch (error) { console.error("Lỗi tải chi tiết:", error); }
    };

    // --- LOGIC XÓA MÓN KHỎI BST ---
    const handleRemoveRecipeFromCollection = async (e, recipeId) => {
        e.stopPropagation();
        if (!window.confirm("Bạn có chắc muốn xóa món này khỏi bộ sưu tập?")) return;

        try {
            const response = await fetch(`${api}auth/collections/${currentCollection.id}/remove-recipe`, {
               method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}` // <--- THÊM TOKEN
                },
                body: JSON.stringify({ recipe_id: recipeId })
            });
            const result = await response.json();
            
            if (result.success) {
                handleViewDetail(currentCollection.id); 
                if (onRefreshProfile) onRefreshProfile(); 
            } else {
                alert(result.message);
            }
        } catch (error) { console.error("Lỗi xóa món:", error); }
    };

    const handleGoToRecipes = () => { navigate('/tao-cong-thuc'); };
    const goToRecipeDetail = (recipeId) => { navigate(`/recipes/${recipeId}`); };

    // --- CRUD COLLECTION ---
    const handleDeleteCollection = async (id, name) => {
        // [ĐÃ SỬA] Xóa dòng e.stopPropagation() ở đây vì đã xử lý ở onClick
        if (!window.confirm(`Xóa bộ sưu tập "${name}"?`)) return;
        
        setIsDeleting(true);
        try {
            const response = await fetch(`${api}auth/collections/${id}`, { 
                method: 'DELETE', 
                headers: { 
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}` // <--- THÊM TOKEN
                }
            });
            const result = await response.json();
            if (response.ok && result.success) {
                alert('Đã xóa thành công!');
                if (onRefreshProfile) onRefreshProfile(); 
            } else { alert(result.message); }
        } catch (error) { console.error("Lỗi:", error); } 
        finally { setIsDeleting(false); }
    };

    const handleSaveCollection = async (e) => {
        e.preventDefault();
        if(!formData.name.trim()) { alert("Nhập tên bộ sưu tập"); return; }
        setIsSaving(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            if (formData.image) data.append('image', formData.image);
            let url = `${api}auth/collections`;
            
            // --- LOGIC XỬ LÝ SỬA (UPDATE) ---
            if (modalMode === 'edit') {
                url = `${api}auth/collections/${editingId}`;
                // [QUAN TRỌNG] Thêm dòng này để giả lập PUT khi gửi file
                data.append('_method', 'PUT'); 
            }
            const response = await fetch(url, { 
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}` // <--- THÊM TOKEN
                    // Không set Content-Type khi dùng FormData
                },
                 body: data
              });
            const result = await response.json();
            if (result.success) {
                alert(modalMode === 'create' ? "Tạo thành công!" : "Cập nhật thành công!");
                setShowModal(false);
                if (onRefreshProfile) onRefreshProfile();
            } else { alert(result.message); }
        } catch (error) { console.error("Lỗi:", error); } 
        finally { setIsSaving(false); }
    };

    const handleOpenCreate = () => { setModalMode('create'); setEditingId(null); setFormData({ name: '', image: null }); setPreviewImage(null); setShowModal(true); };
    
    const handleOpenEdit = (col) => { 
        setModalMode('edit'); setEditingId(col.id); 
        setFormData({ name: col.name, image: null }); 
        setPreviewImage(col.image_path ? `${store}/${col.image_path}` : '/logo512.png'); 
        setShowModal(true); 
    };
    
    const handleFileChange = (e) => { 
        const file = e.target.files[0]; 
        if (file) { 
            setFormData({ ...formData, image: file }); 
            setPreviewImage(URL.createObjectURL(file)); 
        } 
    };

    const renderMiniStars = (score) => {
        const num = parseFloat(score) || 0;
        return Array(5).fill(0).map((_, i) => <i key={i} className={i < Math.round(num) ? "fas fa-star" : "far fa-star"} style={{color: '#ffb74d', fontSize: '0.8rem'}}></i>);
    };

    if (!collections || collections.length === 0) {
        return (
            <div className={`${styles.tabContent} ${styles.fadeIn} ${styles.emptyState}`}>
                <p className={styles.textMuted}>Bạn chưa tạo bộ sưu tập nào.</p>
                <button className={styles.btnPrimary} onClick={handleOpenCreate}><i className="fas fa-plus"></i> Tạo ngay</button>
                {showModal && renderModal()}
            </div>
        );
    }

    return (
        <div className={`${styles.tabContent} ${styles.fadeIn}`}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Bộ sưu tập ({collections.length})</h2>
                <button className={styles.btnPrimary} onClick={handleOpenCreate}><i className="fas fa-plus"></i> Tạo mới</button>
            </div>
            
            <div className={styles.gridContainer}>
                {collections.map(col => {
                    const imageUrl = col.image_path ? `${store}/${col.image_path}` : '/logo512.png'; 
                    return (
                        <div className={styles.card} key={col.id} onClick={() => handleViewDetail(col.id)}>
                            <div className={`${styles.cardImage} ${styles.ratio43}`}>
                                <img src={imageUrl} alt={col.name} onError={(e) => {e.target.onerror = null; e.target.src='/logo512.png'}} />
                            </div>
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle}>{col.name}</h3>
                                <p className={styles.statLabel}><i className="fas fa-utensils"></i> {col.recipes_count || 0} công thức</p>
                                <div className={styles.cardActions}>
                                    <button className={`${styles.actionBtn} ${styles.btnEdit}`} onClick={(e) => { e.stopPropagation(); handleOpenEdit(col); }}><i className="far fa-edit"></i> Sửa</button>
                                    <button className={`${styles.actionBtn} ${styles.btnDelete}`} onClick={(e) => { e.stopPropagation(); handleDeleteCollection(col.id, col.name); }} disabled={isDeleting}><i className="far fa-trash-alt"></i> Xóa</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showModal && renderModal()}
            {showDetailModal && renderDetailModal()}
        </div>
    );

    function renderModal() {
        return (
            <div className={styles.modalOverlay} onClick={(e) => e.target.className === styles.modalOverlay && setShowModal(false)}>
                <div className={styles.modal}>
                    <div className={styles.modalHeader}>
                        <h2 className={styles.modalTitle}>{modalMode === 'create' ? 'Tạo mới' : 'Sửa'}</h2>
                        <button className={styles.modalClose} onClick={() => setShowModal(false)}>&times;</button>
                    </div>
                    <div className={styles.modalBody}>
                        <form onSubmit={handleSaveCollection}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Ảnh bìa</label>
                                <label htmlFor="colUpload" style={{cursor:'pointer', width:'100%'}}>
                                    {previewImage ? 
                                        <div className={styles.avatarPreview}><img src={previewImage} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="Preview"/></div> : 
                                        <div className={styles.uploadPlaceholder}><i className="fas fa-image" style={{fontSize:'2rem', color:'#ccc'}}></i><p>Chọn ảnh</p></div>
                                    }
                                </label>
                                <input id="colUpload" type="file" onChange={handleFileChange} style={{display:'none'}} accept="image/*" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Tên bộ sưu tập</label>
                                <input type="text" className={styles.formControl} required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.btnOutline} onClick={() => setShowModal(false)}>Hủy</button>
                                <button type="submit" className={styles.btnPrimary} disabled={isSaving}>{isSaving ? 'Lưu...' : 'Lưu'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    function renderDetailModal() {
        return (
            <div className={styles.modalOverlay} onClick={(e) => e.target.className === styles.modalOverlay && setShowDetailModal(false)}>
                <div className={styles.modal} style={{ maxWidth: '900px', width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                    <div className={styles.modalHeader}>
                        <h2 className={styles.modalTitle} style={{fontSize: '1.5rem'}}>{currentCollection?.name}</h2>
                        <button className={styles.modalClose} onClick={() => setShowDetailModal(false)}>&times;</button>
                    </div>
                    
                    <div className={styles.modalBody} style={{ flex: 1, overflowY: 'auto' }}>
                        <div className={styles.detailSubHeader}>
                            <h4 className={styles.detailSubTitle}>Công thức trong bộ sưu tập</h4>
                            <button className={styles.btnAddRecipe} onClick={handleGoToRecipes}>
                                <i className="fas fa-plus"></i> Thêm công thức
                            </button>
                        </div>

                        <div className={styles.detailGrid}>
                            {detailRecipes.length === 0 ? (
                                <p className={styles.textMuted} style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
                                    Chưa có món ăn nào. Hãy nhấn "Thêm công thức" để khám phá!
                                </p>
                            ) : (
                                detailRecipes.map(recipe => {
                                    const difficultyName = recipe.difficulty?.name || 'Trung bình';
                                    let diffClass = styles.difficultyMedium;
                                    if(recipe.difficulty_id === 1) diffClass = styles.difficultyEasy;
                                    if(recipe.difficulty_id === 3) diffClass = styles.difficultyHard;

                                    const avgScore = recipe.rates_avg_score || 0;
                                    const countRate = recipe.rates_count || 0;

                                    return (
                                        <div 
                                            key={recipe.id} 
                                            className={styles.miniCard}
                                            onClick={() => goToRecipeDetail(recipe.id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <img 
                                                src={recipe.image_path ? `${store}/${recipe.image_path}` : '/logo512.png'} 
                                                alt={recipe.title}
                                                className={styles.miniCardImg}
                                                onError={(e) => {e.target.onerror = null; e.target.src='/logo512.png'}}
                                            />
                                            <div className={styles.miniCardBody}>
                                                <h5 className={styles.miniCardTitle} title={recipe.title}>{recipe.title}</h5>
                                                <div className={styles.miniCardMeta}>
                                                    <span><i className="far fa-clock"></i> {recipe.cooking_time || 30}p</span>
                                                    <span className={`${styles.difficulty} ${diffClass}`} style={{fontSize: '0.7rem', padding: '2px 8px'}}>{difficultyName}</span>
                                                </div>
                                                <div className={styles.miniCardFooter}>
                                                    <div className={styles.miniRating}>
                                                        {renderMiniStars(avgScore)}
                                                        <span style={{marginLeft: '5px'}}>({countRate} đánh giá)</span>
                                                    </div>
                                                    <button 
                                                        className={styles.btnRemoveMini} 
                                                        onClick={(e) => handleRemoveRecipeFromCollection(e, recipe.id)}
                                                        title="Xóa khỏi BST"
                                                    >
                                                        <i className="fas fa-times"></i> Xóa
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className={styles.modalFooter}>
                        <button type="button" className={styles.btnOutline} onClick={() => setShowDetailModal(false)}>Đóng</button>
                    </div>
                </div>
            </div>
        );
    }
};

export default MyCollections;