import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Nhận thêm prop `styles`
const MyRecipes = ({ recipes, store, api, onDeleteSuccess, styles,token }) => {
  const navigate = useNavigate();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Xóa công thức "${title}"?`)) return;
    setIsDeleting(true);
    try {
        const response = await fetch(`${api}auth/profile/recipes/${id}`, { 
            method: 'DELETE', 
            headers: { 
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}` 
            } 
        });
        const result = await response.json();
        if (response.ok && result.success) { alert('Đã xóa thành công!'); onDeleteSuccess(id); } 
        else { alert(result.message|| 'Lỗi khi xóa'); }
    } catch (error) { console.error("Lỗi:", error); } finally { setIsDeleting(false); }
  };

  const renderStars = (score) => {
    const num = parseFloat(score) || 0;
    return Array(5).fill(0).map((_, i) => <i key={i} className={i < Math.round(num) ? "fas fa-star" : "far fa-star"} style={{color:'#ffb74d'}}></i>);
  };

  if (!recipes || recipes.length === 0) {
      return (
        <div className={`${styles.tabContent} ${styles.fadeIn} ${styles.emptyState}`}>
            <p className={styles.textMuted}>Chưa có công thức nào.</p>
            <button onClick={() => navigate('/tao-cong-thuc')} className={styles.btnPrimary}><i className="fas fa-plus"></i> Thêm ngay</button>
        </div>
      );
  }

  return (
    
    <div className={`${styles.tabContent} ${styles.fadeIn}`}>
        <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Công thức ({recipes.length})</h2>
            <button  onClick={() => navigate('/tao-cong-thuc')} className={styles.btnPrimary}><i className="fas fa-plus"></i> Thêm</button>
        </div>
        
        <div className={styles.gridContainer}>
            {recipes.map(recipe => {
                const imageUrl = recipe.image_path ? `${store}/${recipe.image_path}` : '/logo512.png';
                const diffName = recipe.difficulty?.name || (recipe.difficulty_id===1?'Dễ':recipe.difficulty_id===3?'Khó':'TB');
                const diffClass = recipe.difficulty_id===1 ? styles.difficultyEasy : recipe.difficulty_id===3 ? styles.difficultyHard : styles.difficultyMedium;

                return (
                    <div className={styles.card} key={recipe.id}>
                        <div className={`${styles.cardImage} ${styles.ratio169}`}>
                            <div className={styles.cardTag}>{recipe.recipe_category?.name || 'Món ngon'}</div>
                            <img src={imageUrl} alt={recipe.title} onError={(e)=>{e.target.onerror=null;e.target.src='/logo512.png'}} />
                        </div>
                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>{recipe.title}</h3>
                            <p className={styles.cardDescription}>{recipe.description}</p>
                            <div className={styles.cardMeta}>
                                <div><i className="far fa-clock"></i> {recipe.cooking_time || 30}p</div>
                                <div className={`${styles.difficulty} ${diffClass}`}>{diffName}</div>
                            </div>
                            <div className={styles.rating}>
                                <div className={styles.stars}>{renderStars(recipe.rates_avg_score)}</div>
                                <div className={styles.ratingCount}>{recipe.rates_count || 0} đánh giá</div>
                            </div>
                            <div className={styles.cardActions}>
                                <button className={`${styles.actionBtn} ${styles.btnEdit}`} onClick={()=>alert('Sửa')}><i className="far fa-edit"></i> Sửa</button>
                                <button className={`${styles.actionBtn} ${styles.btnDelete}`} onClick={()=>handleDelete(recipe.id, recipe.title)} disabled={isDeleting}><i className="far fa-trash-alt"></i> Xóa</button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};
export default MyRecipes;