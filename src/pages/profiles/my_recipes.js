import React from 'react';

const MyRecipes = () => {
  // Dữ liệu giả (Mock Data)
  const recipesList = [
    {
      id: 1,
      title: "Phở bò Hà Nội truyền thống",
      image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80",
      tag: "MIỀN BẮC - NGÀY THƯỜNG",
      desc: "Món phở truyền thống với nước dùng trong, thơm ngon từ xương bò hầm nhiều giờ.",
      time: "2 giờ 30 phút",
      difficulty: "Trung bình",
      difficultyClass: "difficulty-medium",
      ratingCount: 315
    },
    {
      id: 2,
      title: "Bún bò Huế cay nồng",
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
      tag: "MIỀN TRUNG - NGÀY THƯỜNG",
      desc: "Bún bò Huế với nước dùng đậm đà, thơm mùi sả, cay nồng đặc trưng.",
      time: "2 giờ",
      difficulty: "Trung bình",
      difficultyClass: "difficulty-medium",
      ratingCount: 287
    },
    {
      id: 3,
      title: "Cơm tấm sườn nướng Sài Gòn",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
      tag: "MIỀN NAM - NGÀY THƯỜNG",
      desc: "Công thức cơm tấm sườn nướng đúng chất Sài Gòn, với nước mắm chua ngọt.",
      time: "1 giờ 15 phút",
      difficulty: "Dễ",
      difficultyClass: "difficulty-easy",
      ratingCount: 421
    },
    {
      id: 4,
      title: "Bánh cuốn Thanh Trì Hà Nội",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
      tag: "MIỀN BẮC - NGÀY THƯỜNG",
      desc: "Bánh cuốn mỏng tang, trong suốt với nhân thịt thơm ngon.",
      time: "40 phút",
      difficulty: "Trung bình",
      difficultyClass: "difficulty-medium",
      ratingCount: 198
    }
  ];

  const handleDelete = (title) => {
    if(window.confirm(`Bạn có chắc muốn xóa công thức "${title}"?`)) {
        alert("Đã xóa thành công!");
    }
  };

  return (
    <div className="tab-pane active fade-in">
        <div className="section-header">
            <h2 className="section-title">Công thức đã đăng ({recipesList.length})</h2>
            <button className="btn btn-primary"><i className="fas fa-plus"></i> Thêm công thức</button>
        </div>
        <div className="recipes-grid">
            {recipesList.map(recipe => (
                <div className="recipe-card" key={recipe.id}>
                    <div className="recipe-image">
                        <div className="recipe-tag">{recipe.tag}</div>
                        <img src={recipe.image} alt={recipe.title} />
                    </div>
                    <div className="recipe-content">
                        <h3 className="recipe-title">{recipe.title}</h3>
                        <p className="recipe-description">{recipe.desc}</p>
                        <div className="recipe-meta">
                            <div className="recipe-time">
                                <i className="far fa-clock"></i> {recipe.time}
                            </div>
                            <div className={`recipe-difficulty ${recipe.difficultyClass}`}>
                                {recipe.difficulty}
                            </div>
                        </div>
                        <div className="recipe-rating">
                            <div className="stars">
                                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star-half-alt"></i>
                            </div>
                            <div className="rating-count">{recipe.ratingCount} đánh giá</div>
                        </div>
                        <div className="recipe-actions">
                            <button className="action-btn edit" onClick={() => alert('Sửa: ' + recipe.title)}>
                                <i className="far fa-edit"></i> Chỉnh sửa
                            </button>
                            <button className="action-btn delete" onClick={() => handleDelete(recipe.title)}>
                                <i className="far fa-trash-alt"></i> Xóa
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default MyRecipes;