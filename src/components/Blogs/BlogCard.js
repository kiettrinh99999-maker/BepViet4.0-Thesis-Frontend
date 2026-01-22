import React from 'react';

const BlogCard = ({ post }) => {
  // Hàm cắt chuỗi nếu quá dài
  const truncate = (str, n) => {
      return (str && str.length > n) ? str.substr(0, n - 1) + '...' : str;
  };


  return (
    <article className="blog-card">
      {/* Để cả card có thể click được, bạn có thể bọc Link ở đây nếu muốn chuyển trang */}
      <div className="blog-image">
        <div className="blog-category">{post.category}</div>
        <img 
            src={post.image} 
            alt={post.title} 
        />
      </div>
      <div className="blog-content">
        <h3 className="blog-title" title={post.title}>{post.title}</h3>
        
        <p className="blog-excerpt">
            {post.description ? truncate(post.description, 100) : 'Chưa có mô tả cho bài viết này.'}
        </p>
        
        <div className="blog-meta">
          <div className="blog-author">
            <div className="author-avatar">{post.authorInitials}</div>
            <span>{post.author}</span>
          </div>
          <div className="blog-date">
            <i className="far fa-calendar"></i>
            <span>{post.date}</span>
          </div>
        </div>
        
        {/* ĐÃ XÓA NÚT ĐỌC THÊM TẠI ĐÂY */}
      </div>
    </article>
  );
};

export default BlogCard;