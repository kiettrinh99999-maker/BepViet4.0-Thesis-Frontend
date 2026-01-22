import React from 'react';

const BlogCard = ({ post }) => {
  // Destructuring dữ liệu từ props post
  const { category, title, excerpt, author, authorInitials, date, image } = post;

  return (
    <article className="blog-card">
      <div className="blog-image">
        <div className="blog-category">{category}</div>
        <img src={image} alt={title} />
      </div>
      <div className="blog-content">
        <h3 className="blog-title">{title}</h3>
        <p className="blog-excerpt">{excerpt}</p>
        
        <div className="blog-meta">
          <div className="blog-author">
            <div className="author-avatar">{authorInitials}</div>
            <span>{author}</span>
          </div>
          <div className="blog-date">
            <i className="far fa-calendar"></i>
            <span>{date}</span>
          </div>
        </div>
        
        <div className="blog-actions">
           <button className="action-btn view">
              <i className="far fa-eye"></i> Đọc thêm
           </button>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;