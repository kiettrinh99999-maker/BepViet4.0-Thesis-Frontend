import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/Authen';
import { useNavigate } from 'react-router-dom';
import './CreateBlog.css';

const CreateBlog = () => {
    const { api, token } = useAuth(); // api: 'http://127.0.0.1:8000/api/'
    const navigate = useNavigate();

    // State Form
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    
    // State Ảnh
    const [image, setImage] = useState(null); 
    const [imagePreview, setImagePreview] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    
    // State UI
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const fileInputRef = useRef(null);

    // --- 1. Load danh mục từ API ---
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Gọi đúng route: api/categories-blog
                const response = await fetch(`${api}categories-blog`);
                const result = await response.json();
                
                if (result.success && result.data.length > 0) {
                    setCategories(result.data);
                    setCategoryId(result.data[0].id); // Mặc định chọn cái đầu tiên
                }
            } catch (error) {
                console.error("Lỗi tải danh mục:", error);
            }
        };
        fetchCategories();
    }, [api]);

    // --- 2. Xử lý ảnh ---
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        processFile(file);
    };

    const processFile = (file) => {
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            alert('Ảnh quá lớn! Vui lòng chọn ảnh dưới 5MB.');
            return;
        }
        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file định dạng ảnh!');
            return;
        }
        setImage(file);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // --- 3. Hàm Đăng Blog ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim()) { alert('Vui lòng nhập tiêu đề!'); return; }
        if (!content.trim()) { alert('Vui lòng nhập nội dung!'); return; }
        if (!categoryId) { alert('Vui lòng chọn danh mục!'); return; }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('blog_category_id', categoryId);
        // Lưu nội dung vào 'description' để khớp với Backend và DB
        formData.append('description', content); 

        if (image) {
            formData.append('image', image);
        }

        try {
            // Gọi đúng route: api/auth/add-blog
            const response = await fetch(`${api}auth/add-blog`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}` 
                    // Không set Content-Type
                },
                body: formData
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setShowSuccess(true);
            } else {
                alert(result.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error("Lỗi đăng bài:", error);
            alert("Không thể kết nối đến server.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        removeImage();
        setShowSuccess(false);
        window.scrollTo(0, 0);
    };

    return (
        <div className="container">
            <div className="create-blog-container">
                <a href="/blog" className="back-link">
                    <i className="fas fa-arrow-left"></i> Quay lại danh sách blog
                </a>

                <h1 className="page-title">Viết Blog Mới</h1>
                
                <div className="blog-form-container">
                    <form onSubmit={handleSubmit}>
                        
                        {/* Tiêu đề */}
                        <div className="form-section">
                            <h2 className="form-section-title"><i className="fas fa-heading"></i> Tiêu đề</h2>
                            <div className="form-group">
                                <label className="form-label required">Tiêu đề bài viết</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Nhập tiêu đề hấp dẫn..." 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required 
                                />
                            </div>
                        </div>

                        {/* Danh mục */}
                        <div className="form-section">
                            <h2 className="form-section-title"><i className="fas fa-tag"></i> Danh mục</h2>
                            <div className="form-group">
                                <label className="form-label required">Chọn chủ đề</label>
                                {categories.length > 0 ? (
                                    <div className="category-grid">
                                        {categories.map(cat => (
                                            <div className="category-option" key={cat.id}>
                                                <input 
                                                    type="radio" 
                                                    id={`cat-${cat.id}`} 
                                                    name="category" 
                                                    value={cat.id}
                                                    checked={parseInt(categoryId) === cat.id}
                                                    onChange={(e) => setCategoryId(cat.id)}
                                                />
                                                <label htmlFor={`cat-${cat.id}`} className="category-label">
                                                    <h4>{cat.name}</h4>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>Đang tải danh mục...</p>
                                )}
                            </div>
                        </div>

                        {/* Nội dung */}
                        <div className="form-section">
                            <h2 className="form-section-title"><i className="fas fa-edit"></i> Nội dung</h2>
                            <div className="form-group">
                                <label className="form-label required">Nội dung chi tiết</label>
                                <textarea 
                                    className="form-control content-textarea"
                                    placeholder="Chia sẻ câu chuyện ẩm thực của bạn..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                        </div>

                        {/* Ảnh bìa */}
                        <div className="form-section">
                            <h2 className="form-section-title"><i className="fas fa-image"></i> Ảnh bìa</h2>
                            <div className="form-group">
                                {!imagePreview ? (
                                    <div 
                                        className={`image-upload-section ${isDragOver ? 'drag-over' : ''}`}
                                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                                        onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
                                        onDrop={(e) => { 
                                            e.preventDefault(); 
                                            setIsDragOver(false); 
                                            processFile(e.dataTransfer.files[0]); 
                                        }}
                                    >
                                        <div className="image-upload-icon"><i className="fas fa-cloud-upload-alt"></i></div>
                                        <div className="image-upload-text">Kéo thả ảnh hoặc click để chọn</div>
                                        <input 
                                            type="file" 
                                            id="imageUpload" 
                                            accept="image/*" 
                                            style={{display: 'none'}} 
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                        />
                                        <button type="button" className="btn btn-secondary" onClick={() => fileInputRef.current.click()}>
                                            Chọn ảnh
                                        </button>
                                    </div>
                                ) : (
                                    <div className="image-preview-container">
                                        <div className="image-preview">
                                            <img src={imagePreview} alt="Preview" />
                                        </div>
                                        <button type="button" className="btn btn-secondary" onClick={removeImage} style={{marginTop: '15px'}}>
                                            <i className="fas fa-trash"></i> Xóa ảnh
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <span><i className="fas fa-spinner fa-spin"></i> Đang xử lý...</span>
                                ) : (
                                    <span><i className="fas fa-paper-plane"></i> Đăng bài ngay</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="modal-overlay">
                    <div className="modal-content success-modal-content">
                        <div className="success-icon"><i className="fas fa-check-circle"></i></div>
                        <h2>Thành công!</h2>
                        <p style={{marginBottom: '20px'}}>Bài viết của bạn đã được đăng.</p>
                        <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
                            <button className="btn btn-secondary" onClick={resetForm}>
                                Viết bài khác
                            </button>
                            <button className="btn btn-primary" onClick={() => navigate('/blog')}>
                                Xem bài viết
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateBlog;