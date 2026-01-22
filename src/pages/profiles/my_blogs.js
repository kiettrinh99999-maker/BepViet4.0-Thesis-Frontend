import React, { useState } from 'react';

// Nhận thêm prop `styles`
const MyBlogs = ({ blogs, store, api, onDeleteSuccess, styles }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Xóa bài viết "${title}"?`)) return;
    setIsDeleting(true);
    try {
        const response = await fetch(`${api}blogs/${id}`, { method: 'DELETE', headers: { 'Accept': 'application/json' } });
        const result = await response.json();
        if (response.ok && result.success) { alert('Đã xóa!'); onDeleteSuccess(id); } 
        else { alert(result.message); }
    } catch (error) { console.error("Lỗi:", error); } finally { setIsDeleting(false); }
  };

  const formatDate = (str) => str ? new Date(str).toLocaleDateString('vi-VN') : '';

  if (!blogs || blogs.length === 0) {
      return (
        <div className={`${styles.tabContent} ${styles.fadeIn} ${styles.emptyState}`}>
            <p className={styles.textMuted}>Chưa có bài blog nào.</p>
            <button className={styles.btnPrimary}><i className="fas fa-plus"></i> Viết bài</button>
        </div>
      );
  }
  return (
    <div className={`${styles.tabContent} ${styles.fadeIn}`}>
        <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Blog ({blogs.length})</h2>
            <button className={styles.btnPrimary}><i className="fas fa-plus"></i> Viết bài</button>
        </div>
        <div className={styles.gridContainer}>
            {blogs.map(blog => {
                const imageUrl = blog.image_path ? `${store}${blog.image_path}` : '/logo512.png';
                const userAvatar = blog.user?.profile?.image_path ? `${store}${blog.user.profile.image_path}` : '/logo192.png';
                
                return (
                    <article className={styles.card} key={blog.id}>
                        <div className={`${styles.cardImage} ${styles.ratio169}`}>
                            <div className={styles.cardTag}>{blog.blog_category?.name || 'Blog'}</div>
                            <img src={imageUrl} alt={blog.title} onError={(e)=>{e.target.onerror=null;e.target.src='/logo512.png'}} />
                        </div>
                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>{blog.title}</h3>
                            <p className={styles.cardDescription}>{blog.description}</p>
                            <div className={styles.cardMeta}>
                                <div style={{display:'flex', alignItems:'center'}}>
                                    <img src={userAvatar} alt="Au" 
                                    onError={(e)=>{e.target.onerror=null;e.target.src='/logo512.png'}}
                                    style={{width:24, height:24, borderRadius:'50%', marginRight:8, objectFit:'cover'}} />
                                    <span>{blog.user?.profile?.name}</span>
                                </div>
                                <div><i className="far fa-calendar"></i> {formatDate(blog.created_at)}</div>
                            </div>
                            <div className={styles.cardActions}>
                                <button className={`${styles.actionBtn} ${styles.btnEdit}`} onClick={()=>alert('Sửa')}><i className="far fa-edit"></i> Sửa</button>
                                <button className={`${styles.actionBtn} ${styles.btnDelete}`} onClick={()=>handleDelete(blog.id, blog.title)} disabled={isDeleting}><i className="far fa-trash-alt"></i> Xóa</button>
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    </div>
  );
};
export default MyBlogs;