import React from 'react';
import { Clock, StarFill, Bookmark, Eye, Star } from 'react-bootstrap-icons';

const FoodCard = ({ 
  image, 
  tag, 
  title, 
  description, 
  time, 
  level,
  reviewCount,
  rating,  
  onClick 
}) => {

  // Xử lý logic hiển thị sao: Làm tròn điểm để tô màu (Ví dụ 4.5 -> 5 sao, 4.2 -> 4 sao)
  const starScore = Math.round(Number(rating) || 0);

  return (
    <div className="d-flex justify-content-center mt-3">
      <div className="card shadow-sm border-0 rounded-4" style={{ width: '400px' }}>
        
        {/* Phần hình ảnh */}
        <div className="position-relative" onClick={onClick} style={{cursor: 'pointer'}}>
          <img 
            src={image} 
            className="card-img-top rounded-top-4" 
            alt={title} 
            style={{ height: '220px', objectFit: 'cover' }}
          />
          
          <span 
            className="position-absolute top-0 start-0 badge bg-danger m-3 py-2 px-3 rounded-pill shadow-sm"
            style={{ fontSize: '0.8rem', fontWeight: '500' }}
          >
            {tag}
          </span>
        </div>

        {/* Phần nội dung */}
        <div className="card-body p-3">
          
          <h5 
            className="card-title fw-bold text-dark mb-2" 
            onClick={onClick} 
            style={{cursor: 'pointer'}}
          >
            {title}
          </h5>

          <p className="card-text text-secondary small text-truncate">
            {description}
          </p>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="text-secondary small d-flex align-items-center">
              <Clock className="me-2" /> {time}
            </div>
            <span 
              className="badge rounded-pill px-3 py-2" 
              style={{ backgroundColor: '#e6f4ea', color: '#1e7e34', fontWeight: 'normal' }}
            >
              {level}
            </span>
          </div>

          {/* --- PHẦN ĐÁNH GIÁ SAO (ĐÃ SỬA) --- */}
          <div className="d-flex align-items-center mb-4">
            <div className="d-flex me-2">
              {[...Array(5)].map((_, i) => {
                 // Nếu index nhỏ hơn điểm đánh giá thì màu vàng, ngược lại màu xám nhạt
                 return (
                    <StarFill 
                        key={i} 
                        size={16} 
                        className={i < starScore ? "text-warning" : "text-black-50"} 
                    />
                 );
              })}
            </div>
            
            {/* Hiển thị số điểm cụ thể và số lượt đánh giá */}
            <span className="text-secondary small">
                <span className="fw-bold text-dark me-1">{rating > 0 ? rating : 0}</span>
                ({reviewCount} đánh giá)
            </span>
          </div>

          {/* Nút bấm */}
          <div className="d-flex gap-2">
<button className="btn btn-danger flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2">
              <Bookmark /> <span>Lưu</span>
            </button>
            
            {/* Gắn sự kiện onClick vào nút Xem chi tiết */}
            <button 
                className="btn btn-outline-danger flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2"
                onClick={onClick}
            >
              <Eye /> <span>Xem chi tiết</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FoodCard;