import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/Authen';
import './RecipeDetail.css';

// --- COMPONENT CON: ITEM BÌNH LUẬN ---
const CommentItem = ({ comment, store }) => {
  const [isReplying, setIsReplying] = useState(false);
  const userAvatar = comment.user?.profile?.image_path
    ? `${store}${comment.user.profile.image_path}`
    : "https://via.placeholder.com/50";
  const userName = comment.user?.profile?.name || comment.user?.username || "Người dùng ẩn danh";

  return (
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
                {new Date(comment.created_at).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>

          <div className="comment-text">{comment.content}</div>

          <div className="comment-actions">
            <button className="comment-action" onClick={() => setIsReplying(!isReplying)}>
              <i className="fas fa-reply"></i> Trả lời
            </button>
          </div>

          {isReplying && (
            <div className="reply-form" style={{ display: 'flex', marginTop: '10px' }}>
              <input type="text" placeholder={`Trả lời ${userName}...`} style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
              <button className="btn btn-primary" style={{ padding: '5px 15px', fontSize: '0.8rem', marginLeft: '10px' }}>Gửi</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH ---
const RecipeDetail = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [userRating, setUserRating] = useState(0);

  // State quản lý dữ liệu và trạng thái tải
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(null);

  const { user, api, store, renderDate } = useAuth();
  const { key } = useParams();
  const navigate = useNavigate();
  //Report
  // Quản lý việc đóng/mở cái "cục" báo cáo và nội dung
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const handleSendReport = async () => {
    if (!reportReason.trim()) {
      alert("Vui lòng nhập nội dung báo cáo!");
      return;
    }

    try {
      const response = await fetch(`${api}admin/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: reportReason,  
          user_id: user?.id,      
          recipe_id: recipe?.id,  
          status: 'pending'      
        })
      });

      const resData = await response.json();

      if (response.ok) {
        alert("Báo cáo của bạn đã được gửi thành công!");
        setShowReport(false); 
        setReportReason(""); 
      } else {
        alert("Lỗi: " + (resData.message || "Không thể gửi báo cáo"));
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
      alert("Không thể kết nối tới máy chủ.");
    }
  };
  //Hàm xử lý follow
  const handleFollow = async () => {
    if (!user?.id) {
      alert("Vui lòng đăng nhập để theo dõi đầu bếp!");
      return;
    }
    if (user.id === recipe.user_id) {
      alert("Bạn không thể tự theo dõi chính mình.");
      return;
    }

    try {
      const response = await fetch(`${api}toggle-follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          follower_id: user.id,
          following_id: recipe.user_id
        })
      });

      const resData = await response.json();

      if (resData.success) {
        const newStatus = resData.data.status === 'active';
        setRecipe(prev => ({
          ...prev,
          is_followed: newStatus
        }));
      } else {
        alert(resData.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API follow:", error);
    }
  };

  // Lấy dữ liệu
  useEffect(() => {
    if (!key || !api) {
      console.log("Chưa có slug hoặc api, đang chờ...");
      return;
    }
    const currentUserId = user?.id ? `?user_id=${user.id}` : '';
    console.log("Bắt đầu fetch dữ liệu cho slug:", key);
    
    // Mock data cho demo
    const mockRecipes = [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop",
        image_path: null,
        tag: "MIỀN NAM",
        title: "Cơm tấm sườn nướng mật ong",
        description: "Cơm tấm với sườn nướng mật ong thơm ngon, trứng ốp la...",
        cooking_time: "1h 15p",
        difficulty: "Dễ",
        rating: 4.5,
        reviewCount: "30581",
        user: { id: 1, username: "chef_nam" },
        region: { name: "Miền Nam" }
      },
      {
        id: 2,
        image: "https://static.vinwonders.com/production/pho-bo-ha-noi-1.jpg",
        image_path: null,
        tag: "HÀ NỘI",
        title: "Phở bò tái nạm gia truyền",
        description: "Nước dùng ngọt thanh từ xương hầm 24h, bánh phở tươi...",
        cooking_time: "2h 30p",
        difficulty: "TB",
        rating: 4.8,
        reviewCount: "12400",
        user: { id: 2, username: "chef_ha_noi" },
        region: { name: "Hà Nội" }
      },
      {
        id: 3,
        image: "https://cdn.tgdd.vn/2020/05/CookProduct/1200-1200x676-46.jpg",
        image_path: null,
        tag: "MIỀN TÂY",
        title: "Bánh xèo miền Tây giòn rụm",
        description: "Vỏ bánh vàng ươm giòn rụm, nhân tôm thịt đầy đặn...",
        cooking_time: "45p",
        difficulty: "Dễ",
        rating: 4.2,
        reviewCount: "8200",
        user: { id: 3, username: "chef_tay" },
        region: { name: "Miền Tây" }
      }
    ];

    const mockRecipe = mockRecipes.find(r => r.id === parseInt(key));
    
    if (mockRecipe) {
      setRecipe(mockRecipe);
      setLoading(false);
    } else {
      // Nếu không có mock data, gọi API thực
      fetch(api + 'recipes/' + key + "/" + currentUserId)
        .then(res => res.json())
        .then(resData => {
          console.log("Dữ liệu nhận về:", resData);
          setRecipe(resData.data || resData);
          setLoading(false);
        })
        .catch(err => {
          console.error("Lỗi fetch:", err);
          setError("Lỗi tải dữ liệu");
          setLoading(false);
        });
    }

  }, [key]);

  // --- MÀN HÌNH LOADING ---
  if (loading) {
    return (
      <div className="recipe-detail-container" style={{ textAlign: 'center', padding: '50px' }}>
        <div className="spinner-border text-primary" role="status"></div>
        <p>Đang tải công thức...</p>
      </div>
    );
  }

  // --- MÀN HÌNH LỖI ---
  if (error || !recipe) {
    return (
      <div className="recipe-detail-container" style={{ textAlign: 'center', padding: '50px' }}>
        <h3>{error || "Không tìm thấy dữ liệu"}</h3>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }
  console.log(recipe)
  // --- MÀN HÌNH CHÍNH (Đã có dữ liệu recipe) ---
  return (
    <div className="recipe-detail-container">
      <div className="back-link" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i> Quay lại
      </div>

      <div className="recipe-detail-card">
        {/* Ảnh bìa */}
        {recipe && (
          <img
            src={recipe.image_path ? `${store || ''}${recipe.image_path}` : (recipe.image || "https://via.placeholder.com/800x400")}
            className="recipe-cover-image"
            alt="cover"
          />
        )}

        <div className="recipe-content-container">
          {/* Header */}
          <div className="recipe-header">
            {/* Sử dụng optional chaining (?.) đề phòng dữ liệu thiếu */}
            <span className="recipe-category">{recipe.region?.name || "Món Việt"}</span>
            <h1 className="recipe-title">{recipe.title}</h1>

            <div className="recipe-meta">
              <div className="recipe-author">
                <div className="author-avatar">
                  <img src={recipe.user?.profile?.image_path ? `${store || ''}${recipe.user.profile.image_path}` : "https://via.placeholder.com/50"} alt="Author" />
                </div>
                <div className="author-info">
                  <span className="author-name">
                    {recipe.user?.profile?.name || recipe.user?.username || "Đầu bếp ẩn danh"}
                  </span>
                  <span className="recipe-date">{renderDate ? renderDate(recipe.created_at) : new Date(recipe.created_at).toLocaleDateString('vi-VN')}</span>
                </div>

                <button
                  className={`btn-follow ${recipe.is_followed ? 'following' : ''}`}
                  onClick={handleFollow}
                >
                  {recipe.is_followed ? <><i className="fas fa-check"></i> Đang theo dõi</> : <><i className="fas fa-plus"></i> Theo dõi</>}
                </button>
              </div>

            </div>

            <div className="recipe-stats">
              {/* Dữ liệu backend trả về có thể là cooking_time, prep_time... hãy map cho đúng */}
              <div className="stat-item"><i className="fas fa-clock stat-icon"></i><span className="stat-value">{recipe.cooking_time || 30}p</span><span className="stat-label">Thời gian</span></div>
              <div className="stat-item"><i className="fas fa-fire stat-icon"></i><span className="stat-value">{recipe.difficulty?.name || recipe.difficulty || "TB"}</span><span className="stat-label">Độ khó</span></div>
              <div className="stat-item"><i className="fas fa-user-friends stat-icon"></i><span className="stat-value">{recipe.serves || 2}</span><span className="stat-label">Khẩu phần</span></div>
              <div className="stat-item">
                <i className="fas fa-star stat-icon" style={{ color: '#ffb74d' }}></i>
                <span className="stat-value">
                  {recipe.rating_avg ? parseFloat(recipe.rating_avg).toFixed(1) : (recipe.rating ? parseFloat(recipe.rating).toFixed(1) : "0.0")}
                </span>
                <div className="stat-label">
                  {(recipe.rates_count || recipe.reviewCount) > 0 ? `${recipe.rates_count || recipe.reviewCount} đánh giá` : "Chưa có sao"}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="recipe-actions-section">
            <button className={`recipe-action-btn save ${isSaved ? 'saved' : ''}`} onClick={() => setIsSaved(!isSaved)}>
              <i className={`fas ${isSaved ? 'fa-check' : 'fa-bookmark'}`}></i> {isSaved ? 'Đã lưu' : 'Lưu công thức'}
            </button>
            <button className="recipe-action-btn plan"><i className="fas fa-calendar-plus"></i> Lên kế hoạch</button>
            <button className="recipe-action-btn report" onClick={() => setShowReport(true)}>
              <i className="fas fa-flag"></i> Tố cáo
            </button>
          </div>

          {/* Phần Mô tả công thức */}
          <div className="recipe-description-section" style={{ marginTop: '20px' }}>
            <div
              className="recipe-description-text"
              style={{ fontSize: 'calc(100% + 3px)', lineHeight: '1.6' }}
            >
              {/* Sử dụng optional chaining để tránh lỗi nếu recipe.description bị null */}
              {recipe?.description || "Chưa có mô tả cho công thức này."}
            </div>
          </div>

          {/* Ingredients */}
          <div className="recipe-section">
            <h3 className="section-title">Nguyên liệu</h3>
            <div className="ingredients-list">
              {recipe.ingredients && recipe.ingredients.map((item, i) => (
                <div className="ingredient-item" key={i}>
                  {/* Nếu backend không có ảnh nguyên liệu thì dùng ảnh mặc định */}
                  <div className="ingredient-image">
                    {console.log(store + item.image_path)}
                    <img src={store + item.image_path} alt={item.name} />
                  </div>
                  <div>
                    <div className="ingredient-name">{item.name}</div>
                    <div className="ingredient-quantity">{item.pivot.quantity} {item.pivot.unit}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="recipe-section">
            <h3 className="section-title">Cách làm</h3>
            <div className="steps-list">
              {recipe.steps && recipe.steps.map((step, index) => (
                <div key={step.id || index} className="step-item">
                  <div className="step-header">
                    <span className="step-number">Bước {index + 1}</span>
                    {/* Nếu step không có time, ẩn đi
                    {step.time && <span className="step-time"><i className="far fa-clock"></i> {step.time}</span>} */}
                  </div>
                  <div className="step-content">
                    <p>{step.step_name || step.description}</p>

                    {/* Render ảnh của bước (backend trả về step_images) */}
                    {step.step_images && step.step_images.length > 0 && (
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

          {/* Comments Section */}
          {/* Comments Section */}
          <div className="comments-section">
            <h3 className="section-title" style={{ marginTop: 0 }}>
              Bình luận ({recipe.recipe_comments?.length || 0})
            </h3>

            {/* Form gửi bình luận mới */}
            <div className="comment-form">
              <textarea placeholder="Chia sẻ cảm nghĩ của bạn về món ăn này..."></textarea>
              <div style={{ textAlign: 'right', marginTop: '10px' }}>
                <button className="btn btn-primary">Gửi bình luận</button>
              </div>
            </div>

            {/* Danh sách bình luận thực tế từ API */}
            <div className="comments-list">
              {recipe.recipe_comments && recipe.recipe_comments.length > 0 ? (
                recipe.recipe_comments.map(comment => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    store={store} // Truyền store xuống để xử lý ảnh
                  />
                ))
              ) : (
                <p style={{ color: '#777', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
                  Chưa có bình luận nào. Hãy là người đầu tiên!
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
      {/* Cái cục báo cáo hiện lên */}
      {showReport && (
        <div className="report-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center',
          alignItems: 'center', zIndex: 9999
        }}>
          <div className="report-box" style={{
            background: 'white', padding: '20px', borderRadius: '10px', width: '350px'
          }}>
            <h3 style={{ marginTop: 0 }}>Lý do báo cáo</h3>
            <textarea
              style={{ width: '100%', height: '100px', marginBottom: '10px', padding: '10px' }}
              placeholder="Nhập lý do tại đây..."
              onChange={(e) => setReportReason(e.target.value)}
            ></textarea>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowReport(false)} style={{ padding: '5px 15px' }}>Hủy</button>
              <button
                onClick={() => {
                  handleSendReport()
                  setShowReport(false);
                }}
                style={{ padding: '5px 15px', background: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                Gửi báo cáo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;