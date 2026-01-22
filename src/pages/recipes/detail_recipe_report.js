import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/Authen';
import './RecipeDetail.css';

// --- HÀM HỖ TRỢ: CHUYỂN ĐỔI LIST PHẲNG -> CÂY (TREE) ---
const buildCommentTree = (comments) => {
    if (!comments || comments.length === 0) return [];
    const map = {};
    const roots = [];
    return roots; // Trả về danh sách các comment gốc (level 0)
};

// --- COMPONENT CON: ITEM BÌNH LUẬN ---
const CommentItem = ({ comment, store, onReply, level = 0 }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const { renderDate } = useAuth();
    const userAvatar = comment.user?.profile?.image_path
        ? `${store}${comment.user.profile.image_path}`
        : "https://via.placeholder.com/50";
    const userName = comment.user?.profile?.name || comment.user?.username || "Người dùng ẩn danh";

    const handleSubmitReply = () => {
        if (!replyContent.trim()) return;
        onReply(comment.id, replyContent);
        setReplyContent("");
        setIsReplying(false);
    };

    return (
        <div className={`comment-wrapper level-${level}`}>
            <div className="comment-item">
                <div className="comment-main">
                    <div className="comment-avatar">
                        <img src={userAvatar} alt={userName} />
                    </div>
                    <div className="comment-content">
                        <div className="comment-header">
                            <div>
                                <span className="comment-author">{userName}</span>
                                <span className="comment-time">
                                    {renderDate(comment.created_at)}
                                </span>
                            </div>
                        </div>

                        <div className="comment-text">{comment.content}</div>

                        <div className="comment-actions">
                            <button className="comment-action" onClick={() => setIsReplying(!isReplying)}>
                                <i className="fas fa-reply"></i> Trả lời
                            </button>
                        </div>

                        {/* Form trả lời */}
                        {isReplying && (
                            <div className="reply-form">
                                <input
                                    type="text"
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder={`Trả lời ${userName}...`}
                                    autoFocus
                                />
                                <button className="btn btn-primary btn-sm" onClick={handleSubmitReply}>Gửi</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Đệ quy render comment con */}
            {comment.children && comment.children.length > 0 && (
                <div className="replies-list">
                    {comment.children.map(child => (
                        <CommentItem
                            key={child.id}
                            comment={child}
                            store={store}
                            onReply={onReply}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// --- COMPONENT CHÍNH ---
const RecipeDetail = () => {
    const [isSaved, setIsSaved] = useState(false);
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data_content, setData] = useState(null)
    const { user, api, store, renderDate } = useAuth();
    const navigate = useNavigate();
    const handleStatus = async (id_, action) => {
        const status = action;
        try {
            const response = await fetch(`${api}admin/report/${id_}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            console.log('Response status:', response.status)
            navigate('/admin/report')
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    // --- 1. LẤY DỮ LIỆU ---
    useEffect(() => {
        if (!id) return;
        const apiUrl = api + 'admin/report/' + id

        fetch(apiUrl)
            .then(res => res.json())
            .then(resData => {
                console.log("Dữ liệu:", resData.data);
                setRecipe(resData.data.recipe || resData);
                setData(resData.data)
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Lỗi tải dữ liệu");
                setLoading(false);
            });
    }, [api, user?.id]);

    if (loading) return <div className="loading-container">Đang tải...</div>;
    if (error || !recipe) return <div className="error-container">{error || "Không tìm thấy"}</div>;
    console.log(data_content)
    return (
        <div className="recipe-detail-container">
            <div className="recipe-detail-card">
                <img
                    src={recipe.image_path ? `${store}${recipe.image_path}` : "https://via.placeholder.com/800x400"}
                    className="recipe-cover-image" alt="cover"
                />
                <div className="recipe-content-container">
                    {/* HEADER INFO */}
                    <div className="recipe-header">
                        <span className="recipe-category">{recipe.region?.name || "Món Ngon"}</span>
                        <h1 className="recipe-title">{recipe.title}</h1>

                        <div className="recipe-meta">
                            <div className="recipe-author">
                                <div className="author-avatar">
                                    <img src={recipe.user?.profile?.image_path ? (store + recipe.user.profile.image_path) : "https://via.placeholder.com/50"} alt="Author" />
                                </div>
                                <div className="author-info">
                                    <span className="author-name">{recipe.user?.profile?.name || "Đầu bếp"}</span>
                                    <span className="recipe-date">{renderDate(recipe.created_at)}</span>
                                </div>
                            </div>
                        </div>

                        {/* THÔNG SỐ (STATS) */}
                        <div className="recipe-stats">
                            <div className="stat-item"><i className="fas fa-clock"></i> <span>{recipe.cooking_time || 30}p</span></div>
                            <div className="stat-item"><i className="fas fa-fire"></i> <span>{recipe.difficulty?.name || "TB"}</span></div>
                            <div className="stat-item"><i className="fas fa-utensils"></i> <span>{recipe.serves || 2} người</span></div>
                            <div className="stat-item">
                                <i className="fas fa-star" style={{ color: '#ffb74d' }}></i>
                                <span>{recipe.rating_avg ? parseFloat(recipe.rating_avg).toFixed(1) : "0.0"} ({recipe.rates_count || 0})</span>
                            </div>
                        </div>
                    </div>
                    <h1>Lý do: {data_content.content}</h1>

                    <div className="recipe-actions-section">

                        <button className={`recipe-action-btn save`} onClick={() => handleStatus(data_content.id, "dismissed")}>
                            Hủy
                        </button>
                        <button className="recipe-action-btn report" onClick={() => handleStatus(data_content.id, "reviewed")}>
                            Xác nhận
                        </button>
                    </div>

                    {/* MÔ TẢ */}
                    <div className="recipe-description-text">
                        {recipe?.description || "Chưa có mô tả."}
                    </div>

                    {/* NGUYÊN LIỆU */}
                    <div className="recipe-section">
                        <h3 className="section-title">Nguyên liệu</h3>
                        <div className="ingredients-list">
                            {recipe.ingredients?.map((item, i) => (
                                <div className="ingredient-item" key={i}>
                                    <div className="ingredient-image">
                                        <img src={store + item.image_path} onError={(e) => e.target.src = "https://via.placeholder.com/50"} alt="" />
                                    </div>
                                    <div>
                                        <div className="ingredient-name">{item.name}</div>
                                        <div className="ingredient-quantity">{item.pivot.quantity} {item.pivot.unit}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CÁCH LÀM */}
                    <div className="recipe-section">
                        <h3 className="section-title">Cách làm</h3>
                        <div className="steps-list">
                            {recipe.steps?.map((step, index) => (
                                <div key={index} className="step-item">
                                    <div className="step-header"><span className="step-number">Bước {index + 1}</span></div>
                                    <div className="step-content">
                                        <p>{step.step_name || step.description}</p>
                                        {step.step_images?.length > 0 && (
                                            <div className="step-media-grid">
                                                {step.step_images.map((img, idx) => (
                                                    <div className="media-item" key={idx}>
                                                        <img src={`${store}${img.image_path}`} alt={`Step ${index + 1}`} />
                                                        {console.log(img.image_path)}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;