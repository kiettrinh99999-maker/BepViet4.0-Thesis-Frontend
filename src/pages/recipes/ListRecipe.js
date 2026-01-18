import React, { useState, useEffect } from 'react';
import './ListRecipe.css';

const ListRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filters
  const [filters, setFilters] = useState({
    region: 'all',
    occasion: 'all',
    difficulty: 'all',
    time: 'all'
  });

  // Fetch recipes from API
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/recipes');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      
      let recipeList = [];
      if (responseData.data) {
        if (responseData.data.data && Array.isArray(responseData.data.data)) {
          recipeList = responseData.data.data;
        } else if (Array.isArray(responseData.data)) {
          recipeList = responseData.data;
        }
      }
      
      setRecipes(recipeList);
      setFilteredRecipes(recipeList);
      setError(null);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError(error.message);
      setRecipes([]);
      setFilteredRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = recipes;

    if (filters.region !== 'all') {
      filtered = filtered.filter(recipe => recipe.region === filters.region);
    }

    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(recipe => recipe.difficulty === filters.difficulty);
    }

    if (filters.time !== 'all') {
      const cookingTime = recipe => recipe.cooking_time;
      if (filters.time === 'quick') {
        filtered = filtered.filter(r => cookingTime(r) < 30);
      } else if (filters.time === 'medium') {
        filtered = filtered.filter(r => cookingTime(r) >= 30 && cookingTime(r) <= 60);
      } else if (filters.time === 'long') {
        filtered = filtered.filter(r => cookingTime(r) > 60);
      }
    }

    setFilteredRecipes(filtered);
    setCurrentPage(1);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      region: 'all',
      occasion: 'all',
      difficulty: 'all',
      time: 'all'
    });
    setFilteredRecipes(recipes);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);

  // Difficulty badge
  const getDifficultyClass = (difficulty) => {
    const difficultyMap = {
      'easy': 'difficulty-easy',
      'medium': 'difficulty-medium',
      'hard': 'difficulty-hard'
    };
    return difficultyMap[difficulty] || 'difficulty-easy';
  };

  const getDifficultyText = (difficulty) => {
    const difficultyMap = {
      'easy': 'Dễ',
      'medium': 'Trung bình',
      'hard': 'Khó'
    };
    return difficultyMap[difficulty] || 'Dễ';
  };

  // Render stars
  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<i key={i} className="fas fa-star"></i>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<i key={i} className="fas fa-star-half-alt"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star"></i>);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="recipes-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Đang tải công thức...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recipes-container">
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <p>Lỗi: {error}</p>
          <button onClick={fetchRecipes} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recipes-page">
      {/* Hero Section */}
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

      {/* Filter Section */}
      <section className="filter-section">
        <div className="container">
          <div className="filter-container">
            <div className="filter-group">
              <label className="filter-label">Khu vực</label>
              <select 
                className="filter-select" 
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value })}
              >
                <option value="all">Tất cả khu vực</option>
                <option value="north">Miền Bắc</option>
                <option value="central">Miền Trung</option>
                <option value="south">Miền Nam</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Độ khó</label>
              <select 
                className="filter-select"
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              >
                <option value="all">Tất cả độ khó</option>
                <option value="easy">Dễ</option>
                <option value="medium">Trung bình</option>
                <option value="hard">Khó</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Thời gian</label>
              <select 
                className="filter-select"
                value={filters.time}
                onChange={(e) => setFilters({ ...filters, time: e.target.value })}
              >
                <option value="all">Tất cả thời gian</option>
                <option value="quick">Dưới 30 phút</option>
                <option value="medium">30-60 phút</option>
                <option value="long">Trên 60 phút</option>
              </select>
            </div>

            <div className="filter-buttons">
              <button className="filter-btn" onClick={applyFilters}>Áp dụng bộ lọc</button>
              <button className="filter-btn reset" onClick={resetFilters}>Đặt lại</button>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Grid Section */}
      <section className="recipe-section">
        <div className="container">
          <h2 className="section-title">Danh Sách Công Thức ({filteredRecipes.length})</h2>
          
          {currentRecipes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Không tìm thấy công thức phù hợp với bộ lọc</p>
            </div>
          ) : (
            <>
              <div className="recipes-grid">
                {currentRecipes.map((recipe) => (
                  <div key={recipe.id} className="recipe-card">
                    <div className="recipe-image">
                      <div className="recipe-tag">{recipe.region || 'MIỀN BẮC'}</div>
                      <img 
                        src={recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60'} 
                        alt={recipe.title}
                      />
                    </div>
                    <div className="recipe-content">
                      <h3 className="recipe-title">{recipe.title}</h3>
                      <p className="recipe-description">{recipe.description}</p>

                      <div className="recipe-meta">
                        <div className="recipe-time">
                          <i className="far fa-clock"></i> {recipe.cooking_time || 30} phút
                        </div>
                        <div className={`recipe-difficulty ${getDifficultyClass(recipe.difficulty)}`}>
                          {getDifficultyText(recipe.difficulty)}
                        </div>
                      </div>

                      <div className="recipe-rating">
                        <div className="stars">
                          {renderStars(recipe.rating || 4.5)}
                        </div>
                        <div className="rating-count">{recipe.rating_count || 0} đánh giá</div>
                      </div>

                      <div className="recipe-actions">
                        <button className="action-btn save">
                          <i className="far fa-bookmark"></i> Lưu công thức
                        </button>
                        <button className="action-btn view">
                          <i className="far fa-eye"></i> Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          className={`pagination-btn ${currentPage === pageNumber ? 'active' : ''}`}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                      return <span key={pageNumber} className="pagination-ellipsis">...</span>;
                    }
                    return null;
                  })}

                  <button 
                    className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                    onClick={() => setCurrentPage(currentPage + 1)}
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

export default ListRecipe;
