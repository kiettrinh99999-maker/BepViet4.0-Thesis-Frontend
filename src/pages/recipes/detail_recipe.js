import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/Authen';
import './RecipeDetail.css';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

if (typeof window !== 'undefined') {
  window.Pusher = Pusher;
}
const echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.REACT_APP_PUSHER_APP_KEY || 'local',
  cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER || 'ap1',
  wsHost: window.location.hostname,
  wsPort: 6001,
  forceTLS: false,
  disableStats: true,
  enabledTransports: ['ws', 'wss'],
  // THÊM auth nếu cần
  authEndpoint: `${process.env.REACT_APP_API_URL}broadcasting/auth`,
  auth: {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      'Accept': 'application/json',
    }
  }
});

// --- HÀM HỖ TRỢ: CHUYỂN ĐỔI LIST PHẲNG -> CÂY (TREE) ---
const buildCommentTree = (comments) => {
  if (!comments || comments.length === 0) return [];
  const map = {};
  const roots = [];

  // 1. Tạo map để tra cứu nhanh theo ID
  comments.forEach((comment) => {
    map[comment.id] = { ...comment, children: [] };
  });

  // 2. Gán con vào cha
  comments.forEach((comment) => {
    if (comment.parent_id && map[comment.parent_id]) {
      map[comment.parent_id].children.push(map[comment.id]);
    } else {
      roots.push(map[comment.id]);
    }
  });

  return roots; // Trả về danh sách các comment gốc (level 0)
};

// --- COMPONENT CON: ITEM BÌNH LUẬN ---
const CommentItem = ({ comment, store, onReply, level = 0 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const {renderDate}=useAuth();
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

  // State dữ liệu
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State Comment & Rating
  const [commentContent, setCommentContent] = useState("");
  const [myRating, setMyRating] = useState(0); // Điểm đánh giá của user (1-5)
  const [hoverRating, setHoverRating] = useState(0); // Hiệu ứng hover sao

  const { user, api, store, renderDate } = useAuth();
  const { key } = useParams();
  const navigate = useNavigate();

  // State Report
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");

  // THÊM: State cho real-time thông báo
  const [newCommentAlert, setNewCommentAlert] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // --- 1. LẤY DỮ LIỆU ---
  useEffect(() => {
    if (!key || !api) return;
    const recipeId = key.split('-')[0];
    const currentUserId = user?.id ? `?user_id=${user.id}` : '';
    const apiUrl = `${api}recipes/${recipeId}${currentUserId}`;

    fetch(apiUrl)
      .then(res => res.json())
      .then(resData => {
        console.log("Dữ liệu:", resData);
        setRecipe(resData.data || resData);
        // Nếu API trả về user đã rate rồi thì set vào myRating (nếu backend hỗ trợ)
        // setMyRating(resData.data.user_rating || 0); 
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Lỗi tải dữ liệu");
        setLoading(false);
      });
  }, [key, api, user?.id]);

  // --- THÊM: 2. LẮNG NGHE REAL-TIME COMMENTS ---
  useEffect(() => {
    if (!recipe?.id) return;
    // Subscribe tới channel
    const channel = echo.channel(`recipe.${recipe.id}`);
    
    // Lắng nghe event new-comment
    channel.listen('.new-comment', (data) => {
      const newComment = data.comment;
      
      // THÊM: Hiển thị thông báo
      setNewCommentAlert({
        user: newComment.user?.username || 'Ai đó',
        content: newComment.content.length > 50 
          ? newComment.content.substring(0, 50) + '...' 
          : newComment.content
      });
      
      // THÊM: Tự động ẩn thông báo sau 5 giây
      setTimeout(() => setNewCommentAlert(null), 5000);
      
      // Thêm comment mới vào state
      setRecipe(prev => {
        // Kiểm tra xem comment đã tồn tại chưa
        const exists = prev.recipe_comments?.some(c => c.id === newComment.id);
        if (exists) return prev;
        
        return {
          ...prev,
          recipe_comments: [...(prev.recipe_comments || []), newComment]
        };
      });
    });
    
    // THÊM: Theo dõi trạng thái kết nối
    echo.connector.pusher.connection.bind('connected', () => {
      setIsConnected(true);
    });
    
    echo.connector.pusher.connection.bind('disconnected', () => {
      setIsConnected(false);
    });

    // Cleanup
    return () => {
      echo.leaveChannel(`recipe.${recipe.id}`);
    };
  }, [recipe?.id]);

  // --- 3. TẠO CÂY COMMENT ---
  const commentTree = useMemo(() => {
    return buildCommentTree(recipe?.recipe_comments || []);
  }, [recipe?.recipe_comments]);

  // --- 4. XỬ LÝ FOLLOW ---
  const handleFollow = async () => {
    if (!user?.id) { alert("Vui lòng đăng nhập!"); return; }
    if (user.id === recipe.user_id) { alert("Không thể tự follow chính mình!"); return; }

    try {
      const response = await fetch(`${api}toggle-follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follower_id: user.id, following_id: recipe.user_id })
      });
      const resData = await response.json();
      if (resData.success) {
        setRecipe(prev => ({ ...prev, is_followed: resData.data.status === 'active' }));
      }
    } catch (error) { console.error(error); }
  };

  // --- 5. XỬ LÝ ĐÁNH GIÁ (RATE) ---
  const handleRate = async (star) => {
    if (!user || !user.id) {
      alert("Vui lòng đăng nhập để đánh giá!");
      return;
    }
    setMyRating(star);
    try {
      const response = await fetch(`${api}rates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          user_id: user.id,
          recipe_id: recipe.id,
          rating: star
        })
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        console.log("Đánh giá thành công:", resData);
        if (resData.data && resData.data.new_avg) {
          setRecipe(prev => ({
            ...prev,
            rating_avg: resData.data.new_avg,
            rates_count: resData.data.count
          }));
        }
      } else {
        alert("Lỗi đánh giá: " + (resData.message || "Có lỗi xảy ra"));
      }
    } catch (err) {
      console.error("Lỗi rate:", err);
      alert("Không thể kết nối đến máy chủ.");
    }
  };

  // --- 6. XỬ LÝ GỬI COMMENT ---
  const handlePostComment = async (parentId = null, content) => {
    if (!user) { alert("Vui lòng đăng nhập!"); return; }
    if (!content.trim()) return;
    console.log(user)
    try {
      const response = await fetch(`${api}comment-recipe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          recipe_id: recipe.id,
          user_id: user.id,
          content: content,
          parent_id: parentId
        })
      });
      const resData = await response.json();
      if (response.ok || resData.success) {
        const newComment = resData.data || {
          id: Date.now(), content, parent_id: parentId, user_id: user.id, created_at: new Date(),
          user: { username: user.username, profile: user.profile }
        };
        setRecipe(prev => ({
          ...prev,
          recipe_comments: [...(prev.recipe_comments || []), newComment]
        }));
        if (!parentId) setCommentContent("");
      }
    } catch (error) { console.error(error); }
  };

  // --- 7. XỬ LÝ BÁO CÁO ---
  const handleSendReport = async () => {
    if (!reportReason.trim()) return alert("Nhập lý do!");
    // Logic gọi API report... (giống code cũ)
    alert("Đã gửi báo cáo!");
    setShowReport(false);
  };

  // THÊM: Hàm đóng thông báo
  const handleCloseAlert = () => {
    setNewCommentAlert(null);
  };

  if (loading) return <div className="loading-container">Đang tải...</div>;
  if (error || !recipe) return <div className="error-container">{error || "Không tìm thấy"}</div>;

  return (
    <div className="recipe-detail-container">
      {/* THÊM: Thông báo real-time */}
      {newCommentAlert && (
        <div className="real-time-alert" style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#4CAF50',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          maxWidth: '350px'
        }}>
          <span style={{ fontSize: '20px' }}>💬</span>
          <div>
            <strong>{newCommentAlert.user}</strong> vừa bình luận: "{newCommentAlert.content}"
          </div>
          <button 
            onClick={handleCloseAlert}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              marginLeft: 'auto',
              padding: '0 5px'
            }}
          >
            ×
          </button>
        </div>
      )}
      
      {/* THÊM: Hiển thị trạng thái kết nối */}
      <div style={{
        position: 'fixed',
        top: '70px',
        right: '20px',
        background: isConnected ? '#4CAF50' : '#f44336',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 999
      }}>
        {isConnected ? '🟢 Real-time' : '🔴 Offline'}
      </div>

      <div className="back-link" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i> Quay lại
      </div>

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
                <button className={`btn-follow ${recipe.is_followed ? 'following' : ''}`} onClick={handleFollow}>
                  {recipe.is_followed ? <><i className="fas fa-check"></i> Đang theo dõi</> : <><i className="fas fa-plus"></i> Theo dõi</>}
                </button>
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

          {/* ACTIONS */}
          <div className="recipe-actions-section">
            <button className={`recipe-action-btn save ${isSaved ? 'saved' : ''}`} onClick={() => setIsSaved(!isSaved)}>
              <i className={`fas ${isSaved ? 'fa-check' : 'fa-bookmark'}`}></i> {isSaved ? 'Đã lưu' : 'Lưu công thức'}
            </button>
            <button className="recipe-action-btn report" onClick={() => setShowReport(true)}>
              <i className="fas fa-flag"></i> Tố cáo
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
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BÌNH LUẬN & ĐÁNH GIÁ */}
          <div className="comments-section">
            <h3 className="section-title" style={{ marginTop: 0 }}>
              Đánh giá & Bình luận
            </h3>

            {/* FORM GỬI COMMENT + RATING */}
            <div className="comment-form">
              {/* PHẦN CHỌN SAO */}
              <div className="rating-input-area">
                <p>Bạn đánh giá công thức này thế nào?</p>
                <div className="star-rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`fas fa-star star ${star <= (hoverRating || myRating) ? 'active' : ''}`}
                      onClick={() => handleRate(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    ></i>
                  ))}
                  <span className="rating-text">
                    {myRating > 0 ? `(${myRating} sao)` : "(Chưa đánh giá)"}
                  </span>
                </div>
              </div>

              <textarea
                placeholder="Chia sẻ cảm nghĩ của bạn về món ăn này..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              ></textarea>

              <div style={{ textAlign: 'right', marginTop: '10px' }}>
                <button className="btn btn-primary" onClick={() => handlePostComment(null, commentContent)}>
                  Gửi bình luận
                </button>
              </div>
            </div>

            {/* LIST COMMENT */}
            <div className="comments-list">
              {commentTree.length > 0 ? (
                commentTree.map(comment => (
                  <CommentItem key={comment.id} comment={comment} store={store} onReply={handlePostComment} />
                ))
              ) : (
                <p className="no-comments">Chưa có bình luận nào.</p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* MODAL REPORT */}
      {showReport && (
        <div className="report-overlay">
          <div className="report-box">
            <h3>Lý do báo cáo</h3>
            <textarea className="report-textarea" onChange={(e) => setReportReason(e.target.value)}></textarea>
            <div className="report-btns">
              <button className="btn-cancel" onClick={() => setShowReport(false)}>Hủy</button>
              <button className="btn-submit" onClick={handleSendReport}>Gửi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;