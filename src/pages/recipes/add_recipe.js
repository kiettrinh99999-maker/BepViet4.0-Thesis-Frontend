import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CreateRecipe.css';

const CreateRecipe = () => {
  // --- STATE ---
  const [formData, setFormData] = useState({
    name: '', description: '', category: '', difficulty: '',
    time: '', cuisine: '', occasion: '', serving: '',
    mainImage: null, mainImagePreview: null
  });

  const [ingredients, setIngredients] = useState([
    { id: 1, name: '', quantity: '', unit: '', image: null, imagePreview: null }
  ]);

  // State các bước (Mỗi bước có mảng images riêng)
  const [steps, setSteps] = useState([
    { 
      id: 1, 
      description: '', 
      mediaType: 'image', // 'image' hoặc 'video'
      images: [],         // Mảng chứa các ảnh: { id, file, preview }
      videoUrl: '' 
    }
  ]);

  // --- HANDLERS ẢNH BÌA ---
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({...formData, mainImage: file, mainImagePreview: URL.createObjectURL(file)});
  };
  const removeMainImage = (e) => {
    e.stopPropagation();
    setFormData({...formData, mainImage: null, mainImagePreview: null});
  };

  // --- HANDLERS NGUYÊN LIỆU ---
  const handleIngredientChange = (id, field, value) => {
    setIngredients(ingredients.map(ing => ing.id === id ? { ...ing, [field]: value } : ing));
  };
  const handleIngredientImage = (id, e) => {
    const file = e.target.files[0];
    if (file) setIngredients(ingredients.map(ing => ing.id === id ? { ...ing, image: file, imagePreview: URL.createObjectURL(file) } : ing));
  };
  const removeIngredientImage = (id) => {
    setIngredients(ingredients.map(ing => ing.id === id ? { ...ing, image: null, imagePreview: null } : ing));
  };
  const addIngredient = () => setIngredients([...ingredients, { id: Date.now(), name: '', quantity: '', unit: '', image: null, imagePreview: null }]);
  const removeIngredient = (id) => { if(ingredients.length > 1) setIngredients(ingredients.filter(ing => ing.id !== id)); };

  // --- HANDLERS CÁC BƯỚC (QUAN TRỌNG) ---
  const handleStepChange = (id, value) => {
    setSteps(steps.map(step => step.id === id ? { ...step, description: value } : step));
  };

  const handleStepMediaTypeChange = (id, type) => {
    setSteps(steps.map(step => step.id === id ? { ...step, mediaType: type } : step));
  };

  const handleStepVideoChange = (id, value) => {
    setSteps(steps.map(step => step.id === id ? { ...step, videoUrl: value } : step));
  };

  // Thêm ảnh mới vào mảng images của bước
  const handleAddStepImage = (stepId, e) => {
    const file = e.target.files[0];
    if (file) {
      const newImage = {
        id: Date.now(),
        file: file,
        preview: URL.createObjectURL(file)
      };
      // Tìm bước và thêm ảnh vào mảng images
      setSteps(steps.map(step => {
        if (step.id === stepId) {
          return { ...step, images: [...step.images, newImage] };
        }
        return step;
      }));
    }
  };

  // Xóa 1 ảnh cụ thể trong bước
  const removeStepImage = (stepId, imgId) => {
    setSteps(steps.map(step => {
      if (step.id === stepId) {
        return { ...step, images: step.images.filter(img => img.id !== imgId) };
      }
      return step;
    }));
  };

  const addStep = () => setSteps([...steps, { id: Date.now(), description: '', mediaType: 'image', images: [], videoUrl: '' }]);
  const removeStep = (id) => { if(steps.length > 1) setSteps(steps.filter(step => step.id !== id)); };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data:", { formData, ingredients, steps });
    alert("Thành công! Kiểm tra console.");
  };

  return (
    <div className="create-recipe-wrapper">
      <div className="container">
        
        <Link to="/recipes" className="back-link">
          <i className="fas fa-arrow-left"></i> Quay lại danh sách
        </Link>

        <h1 className="page-title">Tạo Công Thức Mới</h1>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            
            {/* 1. THÔNG TIN CƠ BẢN */}
            <div className="form-section">
              <h2 className="section-title"><i className="fas fa-info-circle"></i> Thông Tin Cơ Bản</h2>
              <div className="form-group">
                <label className="form-label required">Tên món ăn</label>
                <input type="text" className="form-control" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} placeholder="Ví dụ: Phở bò" required />
              </div>
              <div className="form-group">
                <label className="form-label required">Mô tả ngắn</label>
                <textarea className="form-control" value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} placeholder="Giới thiệu món ăn" required></textarea>
              </div>
              <div className="form-group">
                <label className="form-label required">Ảnh chính</label>
                <div className="image-upload" onClick={() => document.getElementById('mainImgInput').click()}>
                  <input type="file" id="mainImgInput" hidden accept="image/*" onChange={handleMainImageChange} />
                  {formData.mainImagePreview ? (
                    <>
                      <img src={formData.mainImagePreview} alt="Main" className="main-image-preview" />
                      <button type="button" className="remove-main-img" onClick={removeMainImage}><i className="fas fa-times"></i></button>
                    </>
                  ) : (
                    <>
                      <div className="upload-icon"><i className="fas fa-cloud-upload-alt"></i></div>
                      <div className="upload-text">Chọn ảnh bìa</div>
                    </>
                  )}
                </div>
              </div>
              {/* Select Groups */}
              <div className="form-row">
                 <div className="form-group"><label className="form-label">Danh mục</label><select className="form-control" value={formData.category} onChange={e=>setFormData({...formData, category:e.target.value})}><option>Món mặn</option><option>Món chay</option></select></div>
                 <div className="form-group"><label className="form-label">Độ khó</label><select className="form-control" value={formData.difficulty} onChange={e=>setFormData({...formData, difficulty:e.target.value})}><option>Dễ</option><option>Khó</option></select></div>
                 <div className="form-group"><label className="form-label">Thời gian (phút)</label><input type="number" className="form-control" value={formData.time} onChange={e=>setFormData({...formData, time:e.target.value})} /></div>
              </div>
            </div>

            {/* 2. NGUYÊN LIỆU */}
            <div className="form-section">
              <h2 className="section-title"><i className="fas fa-carrot"></i> Nguyên Liệu</h2>
              {ingredients.map(ing => (
                <div className="ingredient-item" key={ing.id}>
                  <div className="ingredient-input">
                    <label className="form-label required">Tên</label>
                    <input type="text" className="form-control" value={ing.name} onChange={e=>handleIngredientChange(ing.id, 'name', e.target.value)} required />
                  </div>
                  <div className="quantity-input">
                    <label className="form-label required">SL</label>
                    <input type="number" className="form-control" value={ing.quantity} onChange={e=>handleIngredientChange(ing.id, 'quantity', e.target.value)} required />
                  </div>
                  <div className="unit-select">
                    <label className="form-label required">Đơn vị</label>
                    <select className="form-control" value={ing.unit} onChange={e=>handleIngredientChange(ing.id, 'unit', e.target.value)}><option>Gram</option><option>Ml</option></select>
                  </div>
                  <div className="ingredient-image-section">
                    <label className="form-label">Ảnh</label>
                    {ing.imagePreview ? (
                      <div className="ingredient-image-preview-box">
                        <img src={ing.imagePreview} alt="Ing" />
                        <button type="button" className="remove-ingredient-image" onClick={() => removeIngredientImage(ing.id)}><i className="fas fa-times"></i></button>
                      </div>
                    ) : (
                      <div className="ingredient-image-upload" onClick={() => document.getElementById(`ingImg-${ing.id}`).click()}>
                        <i className="fas fa-camera"></i>
                        <input type="file" id={`ingImg-${ing.id}`} hidden accept="image/*" onChange={(e) => handleIngredientImage(ing.id, e)} />
                      </div>
                    )}
                  </div>
                  <button type="button" className="remove-ingredient" onClick={() => removeIngredient(ing.id)}><i className="fas fa-trash"></i></button>
                </div>
              ))}
              <button type="button" className="add-ingredient-btn" onClick={addIngredient}>+ Thêm nguyên liệu</button>
            </div>

            {/* 3. CÁC BƯỚC THỰC HIỆN (FINAL LOGIC) */}
            <div className="form-section">
              <h2 className="section-title"><i className="fas fa-list-ol"></i> Các Bước Thực Hiện</h2>
              
              {steps.map((step, index) => (
                <div className="step-item" key={step.id}>
                  <div className="step-top-header">
                    <span className="step-badge">Bước {index + 1}</span>
                    <button type="button" className="btn-remove-step" onClick={() => removeStep(step.id)}><i className="fas fa-trash-alt"></i></button>
                  </div>

                  <div className="step-body-grid">
                    <div>
                      <textarea 
                        className="step-desc-input" 
                        placeholder={`Mô tả chi tiết bước ${index + 1}...`}
                        value={step.description}
                        onChange={(e) => handleStepChange(step.id, e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <div className="step-media-wrapper">
                      <div className="media-tabs">
                        <div className={`media-tab ${step.mediaType === 'image' ? 'active' : ''}`} onClick={() => handleStepMediaTypeChange(step.id, 'image')}>
                          <i className="fas fa-images"></i> Ảnh
                        </div>
                        <div className={`media-tab ${step.mediaType === 'video' ? 'active' : ''}`} onClick={() => handleStepMediaTypeChange(step.id, 'video')}>
                          <i className="fas fa-video"></i> Video
                        </div>
                      </div>

                      {step.mediaType === 'image' ? (
                        <div className="step-images-list">
                          {/* List ảnh đã có */}
                          {step.images.map((img) => (
                            <div className="step-img-item" key={img.id}>
                              <img src={img.preview} alt="Step" />
                              <button type="button" className="btn-remove-img" onClick={() => removeStepImage(step.id, img.id)}>
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          ))}
                          
                          {/* Nút thêm ảnh (Luôn nằm cuối -> Tạo hiệu ứng: có ảnh 1 mới hiện nút thêm tiếp) */}
                          <div className="step-upload-box" onClick={() => document.getElementById(`stepMoreImg-${step.id}`).click()}>
                            <input type="file" id={`stepMoreImg-${step.id}`} hidden accept="image/*" onChange={(e) => handleAddStepImage(step.id, e)} />
                            <i className="fas fa-plus"></i>
                            <span>Thêm ảnh</span>
                          </div>
                        </div>
                      ) : (
                        <div className="step-video-box">
                          <label style={{fontSize:'0.9rem', fontWeight:'600'}}>Link Video</label>
                          <input type="text" placeholder="https://..." value={step.videoUrl} onChange={(e) => handleStepVideoChange(step.id, e.target.value)} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" className="add-ingredient-btn" onClick={addStep}>+ Thêm bước</button>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel">Hủy</button>
              <button type="submit" className="btn-submit">Đăng công thức</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipe;