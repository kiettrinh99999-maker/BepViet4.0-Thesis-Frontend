import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Clock, StarFill, Bookmark, Eye } from 'react-bootstrap-icons';

const FoodCard = ({ 
  image, 
  tag, 
  title, 
  description, 
  time, 
  level, 
  reviewCount 
}) => {
  const [imageError, setImageError] = useState(false);

  const defaultImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop';
  const displayImage = imageError ? defaultImage : (image || defaultImage);

  return (
    <div className="d-flex justify-content-center mt-3">
      <div className="card shadow-sm border-0 rounded-4" style={{ width: '400px' }}>
        
        <div className="position-relative">
          <img 
            src={displayImage} 
            className="card-img-top rounded-top-4" 
            alt={title} 
            style={{ height: '220px', objectFit: 'cover' }}
            onError={() => setImageError(true)}
            loading="lazy"
          />
          
          {/* Badge màu đỏ - Thay bằng prop tag */}
          <span 
            className="position-absolute top-0 start-0 badge bg-danger m-3 py-2 px-3 rounded-pill shadow-sm"
            style={{ fontSize: '0.8rem', fontWeight: '500' }}
          >
            {tag}
          </span>
        </div>

        {/* Phần nội dung bên dưới */}
        <div className="card-body p-3">
          
          {/* Tên món ăn - Thay bằng prop title */}
          <h5 className="card-title fw-bold text-dark mb-2">
            {title}
          </h5>

          {/* Mô tả ngắn - Thay bằng prop description */}
          <p className="card-text text-secondary small text-truncate">
            {description}
          </p>

          {/* Thông tin thời gian và độ khó */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="text-secondary small d-flex align-items-center">
              {/* Thời gian - Thay bằng prop time */}
              <Clock className="me-2" /> {time}
            </div>
            {/* Độ khó - Thay bằng prop level */}
            <span 
              className="badge rounded-pill px-3 py-2" 
              style={{ backgroundColor: '#e6f4ea', color: '#1e7e34', fontWeight: 'normal' }}
            >
              {level}
            </span>
          </div>
          {/* Đánh giá sao */}
          <div className="d-flex align-items-center mb-4">
            <div className="d-flex text-warning me-2">
              {[...Array(5)].map((_, i) => (
                <StarFill key={i} size={16} />
              ))}
            </div>
            {/* Lượt đánh giá - Thay bằng prop reviewCount */}
            <span className="text-secondary small">{reviewCount} Lượt đánh giá</span>
          </div>

          {/* Nút bấm (Buttons) - Giữ nguyên */}
          <div className="d-flex gap-2">
            <button className="btn btn-danger flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2">
              <Bookmark /> <span>Lưu công thức</span>
            </button>
            
            <button className="btn btn-outline-danger flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2">
              <Eye /> <span>Xem chi tiết</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FoodCard;