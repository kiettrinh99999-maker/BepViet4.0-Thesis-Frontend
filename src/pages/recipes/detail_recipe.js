import React, { useState } from 'react';
import './RecipeDetail.css';

// --- COMPONENT CON: ITEM BÌNH LUẬN (ĐỆ QUY) ---
const CommentItem = ({ comment }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes || 0);

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className="comment-item">
      <div className="comment-main">
        <div className="comment-avatar">
          {comment.avatar ? <img src={comment.avatar} alt="user" /> : <i className="fas fa-user"></i>}
        </div>
        <div className="comment-content">
          <div className="comment-header">
            <div>
              <span className="comment-author">{comment.user}</span>
              <span className="comment-time">{comment.time}</span>
            </div>
            {/* Hiển thị Rating nếu có */}
            {comment.rating && (
              <div style={{color: '#ffb74d'}}>
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fas fa-star ${i < comment.rating ? '' : 'fa-regular'}`} style={{fontSize:'0.8rem'}}></i>
                ))}
              </div>
            )}
          </div>
          
          <div className="comment-text">{comment.content}</div>
          
          <div className="comment-actions">
            <button className="comment-action" onClick={toggleLike} style={{color: liked ? '#d32f2f' : ''}}>
              <i className="fas fa-thumbs-up"></i> {likeCount > 0 ? likeCount : 'Thích'}
            </button>
            <button className="comment-action" onClick={() => setIsReplying(!isReplying)}>
              <i className="fas fa-reply"></i> Trả lời
            </button>
            {/* Nút REPORT bình luận */}
            <button className="comment-action">
              <i className="fas fa-flag"></i> Báo cáo
            </button>
          </div>

          {/* Form Reply */}
          {isReplying && (
            <div className="reply-form">
              <input type="text" placeholder={`Trả lời ${comment.user}...`} style={{flex:1, padding:'8px', borderRadius:'4px', border:'1px solid #ddd'}} />
              <button className="btn btn-primary" style={{padding:'5px 15px', fontSize:'0.8rem'}}>Gửi</button>
            </div>
          )}
        </div>
      </div>

      {/* Đệ quy Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="replies-section">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

// --- COMPONENT CHÍNH ---
const RecipeDetail = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [userRating, setUserRating] = useState(0);

  // Dữ liệu mẫu
  const recipe = {
    title: "Phở Bò Hà Nội",
    category: "Món Nước",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80",
    date: "20/01/2024",
    // Thông tin Tác giả
    author: {
      name: "Bếp Trưởng Tú",
      avatar: "https://placehold.co/100?text=Tu", // Link avatar
      isVerified: true
    },
    stats: { prep: "30 phút", cook: "8 giờ", serves: "4 người", cal: "450 kcal" },
    ingredients: [
      { name: "Xương ống bò", quantity: "1 kg", img: "https://placehold.co/50" },
      { name: "Thịt bò thăn", quantity: "500g", img: "https://placehold.co/50" },
      { name: "Bánh phở", quantity: "1 kg", img: "https://placehold.co/50" }
    ],
    // Dữ liệu Steps hỗ trợ NHIỀU ẢNH (medias array)
    steps: [
      { 
        id: 1, 
        time: "15 phút", 
        content: "Sơ chế xương bò: Rửa sạch xương, luộc sơ qua nước sôi khoảng 5 phút để loại bỏ bọt bẩn và mùi hôi, sau đó rửa sạch lại bằng nước lạnh.", 
        medias: [
          { type: 'image', url: 'https://placehold.co/600x400?text=Buoc+1.1+Rua+Xuong' },
          { type: 'image', url: 'https://placehold.co/600x400?text=Buoc+1.2+Chan+Nuoc+Soi' }
        ]
      },
      { 
        id: 2, 
        time: "60 phút", 
        content: "Ninh nước dùng: Cho xương vào nồi áp suất cùng gừng nướng, hành tím nướng, thảo quả, quế, hồi. Ninh lửa nhỏ để nước trong và ngọt.", 
        medias: [
          { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' }, // Video
          { type: 'image', url: 'https://placehold.co/600x400?text=Buoc+2+Ninh+Xuong' }
        ]
      },
      {
        id: 3, 
        time: "10 phút",
        content: "Hoàn thiện: Chần bánh phở, xếp thịt bò tái lên trên. Chan nước dùng nóng hổi ngập bánh phở, rắc thêm hành lá và thưởng thức.",
        medias: [] // Không có ảnh vẫn chạy tốt
      }
    ],
    comments: [
      {
        id: 1, user: "Nguyễn Văn A", avatar: null, time: "2 giờ trước", rating: 5, content: "Nước dùng rất ngọt, công thức chuẩn!", likes: 10,
        replies: [
          { id: 11, user: "Bếp Trưởng Tú", avatar: "https://placehold.co/100?text=Tu", time: "1 giờ trước", content: "Cảm ơn bạn đã ủng hộ!", likes: 2, replies: [] }
        ]
      }
    ]
  };

  return (
    <div className="recipe-detail-container">
      {/* Back Link */}
      <div className="back-link" onClick={() => window.history.back()}>
        <i className="fas fa-arrow-left"></i> Quay lại
      </div>

      <div className="recipe-detail-card">
        <img src={recipe.image} className="recipe-cover-image" alt="cover" />
        
        <div className="recipe-content-container">
          {/* Header & Author */}
          <div className="recipe-header">
            <span className="recipe-category">{recipe.category}</span>
            <h1 className="recipe-title">{recipe.title}</h1>
            
            <div className="recipe-meta">
              <div className="recipe-author">
                <div className="author-avatar">
                   <img src={recipe.author.avatar} alt="Author" />
                </div>
                <div className="author-info">
                  <span className="author-name">{recipe.author.name} <i className="fas fa-check-circle" style={{color:'#2196f3', fontSize:'0.8rem'}}></i></span>
                  <span className="recipe-date">Đăng ngày: {recipe.date}</span>
                </div>
                
                {/* --- NÚT FOLLOW (THEO DÕI) --- */}
                <button 
                  className={`btn-follow ${isFollowing ? 'following' : ''}`}
                  onClick={() => setIsFollowing(!isFollowing)}
                >
                  {isFollowing ? (
                    <><i className="fas fa-check"></i> Đang theo dõi</>
                  ) : (
                    <><i className="fas fa-plus"></i> Theo dõi</>
                  )}
                </button>
              </div>

              <div className="recipe-rating">
                <i className="fas fa-star" style={{color: '#ffb74d'}}></i> 4.9 (120 đánh giá)
              </div>
            </div>
            
            <div className="recipe-stats">
               <div className="stat-item"><i className="fas fa-clock stat-icon"></i><span className="stat-value">{recipe.stats.prep}</span><span className="stat-label">Chuẩn bị</span></div>
               <div className="stat-item"><i className="fas fa-fire stat-icon"></i><span className="stat-value">{recipe.stats.cook}</span><span className="stat-label">Nấu</span></div>
               <div className="stat-item"><i className="fas fa-user-friends stat-icon"></i><span className="stat-value">{recipe.stats.serves}</span><span className="stat-label">Khẩu phần</span></div>
               <div className="stat-item"><i className="fas fa-utensils stat-icon"></i><span className="stat-value">{recipe.stats.cal}</span><span className="stat-label">Calo</span></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="recipe-actions-section">
             <button className={`recipe-action-btn save ${isSaved ? 'saved' : ''}`} onClick={() => setIsSaved(!isSaved)}>
                <i className={`fas ${isSaved ? 'fa-check' : 'fa-bookmark'}`}></i> {isSaved ? 'Đã lưu' : 'Lưu công thức'}
             </button>
             <button className="recipe-action-btn plan"><i className="fas fa-calendar-plus"></i> Lên kế hoạch</button>
             
             {/* --- NÚT BÁO CÁO (REPORT) --- */}
             <button className="recipe-action-btn report" onClick={() => alert("Đã mở form báo cáo!")}>
                <i className="fas fa-flag"></i> Báo lỗi
             </button>
          </div>

          {/* Ingredients */}
          <div className="recipe-section">
            <h3 className="section-title">Nguyên liệu</h3>
            <div className="ingredients-list">
              {recipe.ingredients.map((item, i) => (
                <div className="ingredient-item" key={i}>
                  <div className="ingredient-image"><img src={item.img} alt={item.name} /></div>
                  <div><div className="ingredient-name">{item.name}</div><div className="ingredient-quantity">{item.quantity}</div></div>
                </div>
              ))}
            </div>
          </div>

          {/* Steps với HỖ TRỢ NHIỀU ẢNH */}
          <div className="recipe-section">
            <h3 className="section-title">Cách làm</h3>
            <div className="steps-list">
              {recipe.steps.map(step => (
                <div key={step.id} className="step-item">
                  <div className="step-header">
                    <span className="step-number">Bước {step.id}</span>
                    <span className="step-time"><i className="far fa-clock"></i> {step.time}</span>
                  </div>
                  <div className="step-content">
                    <p>{step.content}</p>
                    
                    {/* Render Mảng Media (Grid) */}
                    {step.medias && step.medias.length > 0 && (
                      <div className="step-media-grid">
                        {step.medias.map((media, idx) => (
                          <div className="media-item" key={idx}>
                            {media.type === 'video' ? (
                              <video controls src={media.url}></video>
                            ) : (
                              <img src={media.url} alt={`Step ${step.id} - ${idx}`} />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="comments-section">
            <h3 className="section-title" style={{marginTop:0}}>Bình luận</h3>
            
            <div className="comment-form">
               <div className="rating-stars">
                 {[1,2,3,4,5].map(star => (
                   <i key={star} className={`fas fa-star ${star <= userRating ? 'active' : ''}`} onClick={()=>setUserRating(star)}></i>
                 ))}
               </div>
               <textarea placeholder="Viết bình luận của bạn..."></textarea>
               <div style={{textAlign:'right'}}>
                 <button className="btn btn-primary">Gửi đánh giá</button>
               </div>
            </div>

            <div>
              {recipe.comments.map(comment => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;