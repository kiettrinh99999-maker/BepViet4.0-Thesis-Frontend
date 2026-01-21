import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PlusCircle, Funnel, ChevronLeft, ChevronRight, Filter as FilterIcon, ArrowCounterclockwise } from 'react-bootstrap-icons';
import FoodCard from '../../components/Recipe/FoodCard';
import { recipeService } from '../../services/recipeService';
import './recipe.css'

// Helper maps
const regionMap = {
  1: 'Miền Bắc',
  2: 'Miền Trung',
  3: 'Miền Nam',
  4: 'Miền Nam'
};

const difficultyMap = {
  1: 'Dễ',
  2: 'Trung bình',
  3: 'Khó'
};

const getRegionName = (regionId) => regionMap[regionId] || 'Không xác định';
const getDifficultyName = (difficultyId) => difficultyMap[difficultyId] || 'Trung bình';

// Placeholder images
const getPlaceholderImage = (title) => {
  const placeholders = {
    'phở': 'https://images.unsplash.com/photo-1644073514976-f4ee4c375ca9?q=80&w=600&auto=format&fit=crop',
    'bánh': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop',
    'cơm': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop',
    'gà': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=600&auto=format&fit=crop',
    'tôm': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=600&auto=format&fit=crop',
    'cá': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=600&auto=format&fit=crop',
    'nước': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=600&auto=format&fit=crop',
  };

  if (title) {
    const lowerTitle = title.toLowerCase();
    for (const [key, url] of Object.entries(placeholders)) {
      if (lowerTitle.includes(key)) {
        return url;
      }
    }
  }
  return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop';
};

const ListRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!(user && token));
  }, []);

  // Fetch recipes from API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {
          page: currentPage,
          per_page: 9
        };

        const response = await recipeService.getAll(params);
        console.log('API Response:', response);
        
        // Extract recipes from response
        let recipeData = [];
        if (response?.data?.data && Array.isArray(response.data.data)) {
          recipeData = response.data.data;
        } else if (Array.isArray(response?.data)) {
          recipeData = response.data;
        } else if (Array.isArray(response)) {
          recipeData = response;
        }
        
        console.log('Recipes loaded:', recipeData);
        setRecipes(recipeData);
      } catch (err) {
        console.error('Failed to fetch recipes:', err);
        setError('Không thể tải danh sách công thức. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [currentPage]);

  return (
    <div className="list-recipe-page">

      {/* --- PHẦN 1: HERO SECTION --- */}
      <section className="hero">
        <div className="container">
          <h1>Công Thức Ẩm Thực Việt</h1>
          <p>Khám phá hơn 500+ công thức nấu ăn đặc sắc từ ba miền Bắc - Trung - Nam</p>
          <div className="hero-tagline">
            <span>Miền Bắc</span>
            <span>Miền Trung</span>
            <span>Miền Nam</span>
          </div>
        </div>
      </section>

      {/* --- PHẦN 2: NÚT THÊM MÓN --- */}
      <section className="add-recipe-section">
        <div className="container">
          <button className="btn-add-recipe">
            <PlusCircle size={18} /> Thêm Công Thức Mới
           </button>
        </div>
      </section>

      <div className="container">
        {/* --- PHẦN 3: BỘ LỌC (FILTER) --- */}
        <section className="filter-section px-4">
          <div className="filter-container">
            
            {/* Nhóm lọc: Khu vực */}
            <div className="filter-group">
              <label className="filter-label">Khu vực</label>
              <select className="filter-select">
                <option value="all">Tất cả miền</option>
                <option value="bac">Miền Bắc</option>
                <option value="trung">Miền Trung</option>
                <option value="nam">Miền Nam</option>
              </select>
            </div>

            {/* Nhóm lọc: Phân loại */}
            <div className="filter-group">
              <label className="filter-label">Phân loại</label>
              <select className="filter-select">
                <option value="all">Tất cả loại món</option>
                <option value="sang">Ăn sáng</option>
                <option value="chinh">Món chính</option>
                <option value="vat">Ăn vặt</option>
              </select>
            </div>

            {/* Nhóm lọc: Độ khó */}
            <div className="filter-group">
              <label className="filter-label">Độ khó</label>
              <select className="filter-select">
                <option value="all">Tất cả</option>
                <option value="de">Dễ</option>
                <option value="tb">Trung bình</option>
                <option value="kho">Khó</option>
              </select>
            </div>

            {/* Nhóm lọc: Sắp xếp */}
            <div className="filter-group">
              <label className="filter-label">Sắp xếp</label>
              <select className="filter-select">
                <option value="newest">Mới nhất</option>
                <option value="popular">Phổ biến nhất</option>
                <option value="time">Thời gian nấu</option>
              </select>
            </div>

            {/* Nút bấm */}
            <div className="filter-buttons">
              <button className="filter-btn apply">
                <FilterIcon className="me-1"/> Lọc
              </button>
              <button className="filter-btn reset">
                <ArrowCounterclockwise className="me-1"/> Đặt lại
              </button>
            </div>

          </div>
        </section>

        {/* --- PHẦN 4: DANH SÁCH MÓN ĂN (GRID) --- */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3 text-secondary">
              {isLoggedIn ? 'Đang tải công thức yêu thích...' : 'Đang tải danh sách công thức mới nhất...'}
            </p>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : recipes.length === 0 ? (
          <div className="alert alert-info" role="alert">
            Không tìm thấy công thức nào.
          </div>
        ) : (
          <>
            <div className="mb-3 text-secondary">
              {isLoggedIn ? '📌 Những công thức phù hợp với sở thích của bạn' : '🆕 Công thức mới nhất'}
            </div>
            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
              {recipes.map((item) => {
                const imageUrl = item.image_path 
                  ? `http://127.0.0.1:8000${item.image_path}` 
                  : getPlaceholderImage(item.title);
                
                const regionName = item.region?.name || getRegionName(item.region_id) || 'CHƯA XÁC ĐỊNH';
                const difficultyName = item.difficulty?.name || getDifficultyName(item.difficulty_id) || 'Trung bình';
                
                return (
                  <div className="col" key={item.id}>
                    <FoodCard 
                      image={imageUrl}
                      tag={regionName}
                      title={item.title}
                      description={item.description}
                      time={`${item.cooking_time || '--'} phút`}
                      level={difficultyName}
                      reviewCount={item.review_count || '0'}
                    />
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* --- PHẦN 5: PHÂN TRANG (PAGINATION) --- */}
        {!loading && recipes.length > 0 && (
          <div className="pagination-container">
            <button 
              className="pagination-btn"
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft />
            </button>
            <button className="pagination-btn active">
              {currentPage}
            </button>
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ListRecipe;