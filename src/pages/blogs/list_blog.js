import React, { useState, useEffect } from 'react';
import BlogCard from '../../components/Blogs/BlogCard'; 
import './blog.css'; 
import { useAuth } from '../../contexts/Authen'; 

const BlogPage = () => {
  const { api, store } = useAuth(); 

  // --- STATE ---
  const [categories, setCategories] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  
  // State quản lý Filter & Pagination Server-side
  const [activeCategoryId, setActiveCategoryId] = useState('all'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Lưu tổng số trang từ server
  
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA (Gọi lại mỗi khi page hoặc category thay đổi) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Gọi danh mục (Chỉ gọi 1 lần nếu muốn tối ưu, nhưng để đây cũng ko sao)
        // Lưu ý: Bạn có thể tách cái này ra useEffect riêng chỉ chạy 1 lần []
        if (categories.length === 0) {
            const catRes = await fetch(`${api}blog-categories`); 
            const catData = await catRes.json();
            if (catData.success) {
                setCategories([{ id: 'all', name: 'Tất cả' }, ...catData.data]);
            }
        }

        // 2. Gọi bài viết với tham số page và category_id
        // URL sẽ dạng: .../api/blogs?page=1&category_id=2
        let url = `${api}blogs?page=${currentPage}`;
        if (activeCategoryId !== 'all') {
            url += `&category_id=${activeCategoryId}`;
        }

        const blogRes = await fetch(url); 
        const blogData = await blogRes.json();

        if (blogData.success) {
            setBlogPosts(blogData.data); // Set dữ liệu bài viết
            setTotalPages(blogData.pagination.last_page); // Set tổng số trang từ server
        }

      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api, currentPage, activeCategoryId]); // <--- QUAN TRỌNG: Thêm dependencies vào đây

  // --- HANDLERS ---

  // Khi chọn danh mục: Reset về trang 1 và set ID danh mục mới
  const handleCategoryChange = (id) => {
      setActiveCategoryId(id);
      setCurrentPage(1); // Luôn quay về trang 1 khi lọc mới
  };

  // Khi chọn trang: Set trang mới (useEffect sẽ tự chạy lại API)
  const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
      // Cuộn lên đầu blog section cho trải nghiệm tốt hơn
      document.querySelector('.blog-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper format dữ liệu
  const formatPostData = (post) => {
      let imageUrl = 'https://via.placeholder.com/800x600?text=No+Image';
      if (post.image_path) {
          imageUrl = post.image_path.startsWith('http') ? post.image_path : `${store}${post.image_path}`;
      }
      
      return {
          ...post,
          image: imageUrl,
          description: post.description,
          category: post.blog_category?.name || 'Chung',
          author: post.user?.profile?.name || post.user?.username || 'Admin',
          authorInitials: (post.user?.profile?.name || 'A').charAt(0).toUpperCase(),
          date: new Date(post.created_at).toLocaleDateString('vi-VN')
      };
  };

  return (
    <div className="blog-page-body">
      
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
            <h1>Blog Ẩm Thực Việt</h1>
            <p>Khám phá những câu chuyện, trải nghiệm và kiến thức đặc biệt về ẩm thực ba miền</p>
        </div>
      </section>

      {/* Nút Thêm Blog Mới */}
      <section className="add-blog-section">
        <div className="container">
            <div className="add-blog-container">
                <button className="btn-add-blog" onClick={() => alert('Chức năng đang phát triển')}>
                    <i className="fas fa-plus-circle"></i>
                    Thêm Blog Mới
                </button>
            </div>
        </div>
      </section>

      {/* Danh mục Blog */}
      <section className="categories-section">
        <div className="container">
            <div className="categories-container">
                {categories.map((cat) => (
                    <button 
                        key={cat.id} 
                        className={`category-btn ${activeCategoryId === cat.id ? 'active' : ''}`}
                        onClick={() => handleCategoryChange(cat.id)}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="blog-section">
        <div className="container">
            <h2 className="section-title1" >
                {activeCategoryId === 'all' ? 'Bài Viết Mới Nhất' : `Chuyên mục: ${categories.find(c => c.id === activeCategoryId)?.name}`}
            </h2>
            
            {loading ? (
                <div style={{textAlign: 'center', padding: '20px'}}>Đang tải dữ liệu...</div>
            ) : (
                <>
                    <div className="blog-grid">
                        {blogPosts.length > 0 ? (
                            blogPosts.map(post => (
                                <BlogCard key={post.id} post={formatPostData(post)} />
                            ))
                        ) : (
                            <p style={{textAlign: 'center', gridColumn: '1/-1', color: '#666', padding: '20px'}}>
                                Chưa có bài viết nào trong danh mục này.
                            </p>
                        )}
                    </div>

                    {/* Phân trang - Sử dụng dữ liệu từ Server (totalPages) */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            {/* Nút Previous */}
                            <button 
                                className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>

                            {/* Render số trang */}
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNum = index + 1;
                                return (
                                    <button
                                        key={pageNum}
                                        className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                                        onClick={() => handlePageChange(pageNum)}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            {/* Nút Next */}
                            <button 
                                className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;