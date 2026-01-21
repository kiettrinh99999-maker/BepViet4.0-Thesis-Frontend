import React from 'react';

const MyBlogs = () => {
  // Mock Data
  const blogsList = [
    {
      id: 1,
      title: "Hành trình của Phở: Từ gánh hàng rong đến thương hiệu quốc gia",
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
      category: "LỊCH SỬ ẨM THỰC",
      excerpt: "Phở không chỉ là món ăn mà còn là biểu tượng văn hóa Việt Nam. Bài viết khám phá lịch sử...",
      date: "12/07/2023"
    },
    {
      id: 2,
      title: "Sài Gòn về đêm: Hành trình khám phá ẩm thực đường phố",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
      category: "TRẢI NGHIỆM ẨM THỰC",
      excerpt: "Từ những quán hủ tiếu mở cửa đến 2h sáng đến những xe bánh mì thịt nướng giữa đêm khuya...",
      date: "05/07/2023"
    }
  ];

  return (
    <div className="tab-pane active fade-in">
        <div className="section-header">
            <h2 className="section-title">Bài blog đã viết ({blogsList.length})</h2>
            <button className="btn btn-primary"><i className="fas fa-plus"></i> Viết bài mới</button>
        </div>
        <div className="blog-posts-grid">
            {blogsList.map(blog => (
                <article className="blog-post-card" key={blog.id}>
                    <div className="blog-image">
                        <div className="blog-category">{blog.category}</div>
                        <img src={blog.image} alt={blog.title} />
                    </div>
                    <div className="blog-content">
                        <h3 className="blog-title">{blog.title}</h3>
                        <p className="blog-excerpt">{blog.excerpt}</p>
                        <div className="blog-meta">
                            <div className="blog-author">
                                <span style={{fontWeight: 600}}>Nguyễn Văn</span>
                            </div>
                            <div className="blog-date">
                                <i className="far fa-calendar"></i> {blog.date}
                            </div>
                        </div>
                        <div className="blog-actions">
                            <button className="action-btn edit" onClick={() => alert('Sửa blog: ' + blog.title)}>
                                <i className="far fa-edit"></i> Chỉnh sửa
                            </button>
                            <button className="action-btn delete" onClick={() => alert('Đã xóa blog!')}>
                                <i className="far fa-trash-alt"></i> Xóa
                            </button>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    </div>
  );
};

export default MyBlogs;