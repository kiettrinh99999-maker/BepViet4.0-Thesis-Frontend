import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CreateRecipe.css';
import { useAuth } from '../../contexts/Authen';
import { useNavigate } from 'react-router-dom';
const CreateRecipe = () => {
  const { api } = useAuth();
  const [regions_data, setRegionData] = useState(null);
  const [events_data, setEventData] = useState(null);
  const [difficult_data, setDiffData] = useState(null);
  const [ingredients_data, setIngredientsData] = useState(null);
  const [categories_data, setCategoriesData] = useState([]);
 const navigate = useNavigate();
  // Lấy cấu hình chung
  useEffect(() => {
    fetch(api + 'get-event-region')
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          console.log("Dữ liệu API:", res.data);
          setRegionData(res.data.regions || []);
          setEventData(res.data.events || []);
          setDiffData(res.data.difficulties || []);
          setCategoriesData(res.data.recipe_category || []);
          setIngredientsData(res.data.ingredients || []);
        }
      })
      .catch((err) => console.error(err));
  }, [api]);

  // --- STATE ---
  const [formData, setFormData] = useState({
    name: '', 
    description: '', 
    time: '', 
    serving: '',
    recipe_category_id: '',
    region_id: '',
    difficulty_id: '',
    event_id: '',
    mainImage: null, 
    mainImagePreview: null,
  });

  const [ingredients, setIngredients] = useState([
    { id: 1, name: '', quantity: '', unit: 'Gram', image: null, imagePreview: null }
  ]);

  const [steps, setSteps] = useState([
    {
      id: 1,
      description: '',
      mediaType: 'image',
      images: [],
      videoUrl: ''
    }
  ]);

  // --- HANDLERS ẢNH BÌA ---
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, mainImage: file, mainImagePreview: URL.createObjectURL(file) });
  };
  const removeMainImage = (e) => {
    e.stopPropagation();
    setFormData({ ...formData, mainImage: null, mainImagePreview: null });
  };

  // --- HANDLERS NGUYÊN LIỆU ---
  const handleIngredientChange = (id, field, value) => {
    setIngredients(ingredients.map(ing => {
      if (ing.id === id) {
        let updatedIng = { ...ing, [field]: value };

        if (field === 'name') {
          const existing = ingredients_data?.find(
            item => item.name.toLowerCase() === value.toLowerCase()
          );
          updatedIng.ingredient_id = existing ? existing.id : null;
        }
        return updatedIng;
      }
      return ing;
    }));
  };
  const handleIngredientImage = (id, e) => {
    const file = e.target.files[0];
    if (file) setIngredients(ingredients.map(ing => ing.id === id ? { ...ing, image: file, imagePreview: URL.createObjectURL(file) } : ing));
  };
  const removeIngredientImage = (id) => {
    setIngredients(ingredients.map(ing => ing.id === id ? { ...ing, image: null, imagePreview: null } : ing));
  };
  const addIngredient = () => setIngredients([...ingredients, { id: Date.now(), name: '', quantity: '', unit: 'Gram', image: null, imagePreview: null }]);
  const removeIngredient = (id) => { if (ingredients.length > 1) setIngredients(ingredients.filter(ing => ing.id !== id)); };

  // --- HANDLERS CÁC BƯỚC ---
  const handleStepChange = (id, value) => {
    setSteps(steps.map(step => step.id === id ? { ...step, description: value } : step));
  };
  const handleStepMediaTypeChange = (id, type) => {
    setSteps(steps.map(step => step.id === id ? { ...step, mediaType: type } : step));
  };
  const handleStepVideoChange = (id, value) => {
    setSteps(steps.map(step => step.id === id ? { ...step, videoUrl: value } : step));
  };
  const handleAddStepImage = (stepId, e) => {
    const file = e.target.files[0];
    if (file) {
      const newImage = { id: Date.now(), file: file, preview: URL.createObjectURL(file) };
      setSteps(steps.map(step => step.id === stepId ? { ...step, images: [...step.images, newImage] } : step));
    }
  };
  const removeStepImage = (stepId, imgId) => {
    setSteps(steps.map(step => step.id === stepId ? { ...step, images: step.images.filter(img => img.id !== imgId) } : step));
  };
  const addStep = () => setSteps([...steps, { id: Date.now(), description: '', mediaType: 'image', images: [], videoUrl: '' }]);
  const removeStep = (id) => { if (steps.length > 1) setSteps(steps.filter(step => step.id !== id)); };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.name);
    data.append('description', formData.description);
    data.append('cooking_time', formData.time);
    data.append('serving', formData.serving);
    data.append('region_id', formData.region_id || "");
    data.append('difficulty_id', formData.difficulty_id || "");
    data.append('event_id', formData.event_id || "");
    data.append('recipe_category_id', formData.recipe_category_id);

    if (formData.mainImage) {
      data.append('image', formData.mainImage);
    }

    ingredients.forEach((ing, index) => {
      data.append(`ingredients[${index}][name]`, ing.name);
      data.append(`ingredients[${index}][quantity]`, ing.quantity);
      data.append(`ingredients[${index}][unit]`, ing.unit);
      if (ing.image) {
        data.append(`ingredients[${index}][image]`, ing.image);
      }
    });

    steps.forEach((step, index) => {
      data.append(`steps[${index}][step_name]`, step.description);
      if (step.images && step.images.length > 0) {
        step.images.forEach((imgObj) => {
          data.append(`steps[${index}][images][]`, imgObj.file);
        });
      }
      if (step.videoUrl) {
        data.append(`steps[${index}][video_url]`, step.videoUrl);
      }
    });

    try {
      const response = await fetch(`${api}recipes`, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      const result = await response.json();
      if (response.ok && result.success) {
        alert("Đăng công thức thành công!");
         navigate('/cong-thuc', { 
       state: { refresh: true } 
  });
      } else {
        console.error("Lỗi Validation:", result.errors);
        alert("Có lỗi xảy ra: " + (result.message || "Vui lòng kiểm tra lại dữ liệu"));
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Không thể kết nối đến máy chủ");
    }
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
                <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Ví dụ: Phở bò" required />
              </div>
              <div className="form-group">
                <label className="form-label required">Mô tả ngắn</label>
                <textarea className="form-control" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Giới thiệu món ăn" required></textarea>
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

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Vùng miền</label>
                  <select className="form-control" value={formData.region_id} onChange={e => setFormData({ ...formData, region_id: e.target.value })}>
                    <option value="">-- Chọn vùng miền --</option>
                    {regions_data?.map(region => (<option key={region.id} value={region.id}>{region.name}</option>))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Độ khó</label>
                  <select className="form-control" value={formData.difficulty_id} onChange={e => setFormData({ ...formData, difficulty_id: e.target.value })}>
                    <option value="">-- Chọn độ khó --</option>
                    {difficult_data?.map(diff => (<option key={diff.id} value={diff.id}>{diff.name}</option>))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Thời gian (phút)</label>
                  <input type="number" className="form-control" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Số lượng người ăn</label>
                  <input type="number" className="form-control" value={formData.serving} onChange={e => setFormData({ ...formData, serving: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Sự kiện</label>
                  <select className="form-control" value={formData.event_id} onChange={e => setFormData({ ...formData, event_id: e.target.value })}>
                    <option value="">-- Chọn sự kiện --</option>
                    {events_data?.map(event => (<option key={event.id} value={event.id}>{event.name}</option>))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label required">Danh mục món ăn</label>
                  <select className="form-control" value={formData.recipe_category_id} onChange={e => setFormData({ ...formData, recipe_category_id: e.target.value })} required>
                    <option value="">-- Chọn danh mục --</option>
                    {categories_data?.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                  </select>
                </div>
              </div>
            </div>

            {/* 2. NGUYÊN LIỆU */}
            <div className="form-section">
              <h2 className="section-title"><i className="fas fa-carrot"></i> Nguyên Liệu</h2>
              {/* Datalist gợi ý cho Tên và Đơn vị */}
              <datalist id="ingredient-list">
                {ingredients_data?.map((item) => (<option key={item.id} value={item.name} />))}
              </datalist>
              <datalist id="unit-list">
                <option value="Gram" /><option value="Ml" /><option value="Cái" /><option value="Thìa cà phê" /><option value="Thìa canh" /><option value="Quả" /><option value="Bát" />
              </datalist>

              {ingredients.map(ing => (
                <div className="ingredient-item" key={ing.id}>
                  <div className="ingredient-input">
                    <label className="form-label required">Tên</label>
                    <input type="text" className="form-control" list="ingredient-list" value={ing.name} onChange={e => handleIngredientChange(ing.id, 'name', e.target.value)} required />
                  </div>
                  <div className="quantity-input">
                    <label className="form-label required">SL</label>
                    <input type="number" className="form-control" value={ing.quantity} onChange={e => handleIngredientChange(ing.id, 'quantity', e.target.value)} required />
                  </div>
                  <div className="unit-select">
                    <label className="form-label required">Đơn vị</label>
                    {/* SỬA ĐỔI: Sử dụng input list để người dùng có thể nhập tự do */}
                    <input type="text" className="form-control" list="unit-list" value={ing.unit} onChange={e => handleIngredientChange(ing.id, 'unit', e.target.value)} placeholder="Nhập đơn vị..." required />
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

            {/* 3. CÁC BƯỚC THỰC HIỆN */}
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
                      <textarea className="step-desc-input" placeholder={`Mô tả chi tiết bước ${index + 1}...`} value={step.description} onChange={(e) => handleStepChange(step.id, e.target.value)} required></textarea>
                    </div>
                    <div className="step-media-wrapper">
                      <div className="media-tabs">
                        <div className={`media-tab ${step.mediaType === 'image' ? 'active' : ''}`} onClick={() => handleStepMediaTypeChange(step.id, 'image')}><i className="fas fa-images"></i> Ảnh</div>
                        <div className={`media-tab ${step.mediaType === 'video' ? 'active' : ''}`} onClick={() => handleStepMediaTypeChange(step.id, 'video')}><i className="fas fa-video"></i> Video</div>
                      </div>
                      {step.mediaType === 'image' ? (
                        <div className="step-images-list">
                          {step.images.map((img) => (
                            <div className="step-img-item" key={img.id}>
                              <img src={img.preview} alt="Step" />
                              <button type="button" className="btn-remove-img" onClick={() => removeStepImage(step.id, img.id)}><i className="fas fa-times"></i></button>
                            </div>
                          ))}
                          <div className="step-upload-box" onClick={() => document.getElementById(`stepMoreImg-${step.id}`).click()}>
                            <input type="file" id={`stepMoreImg-${step.id}`} hidden accept="image/*" onChange={(e) => handleAddStepImage(step.id, e)} />
                            <i className="fas fa-plus"></i><span>Thêm ảnh</span>
                          </div>
                        </div>
                      ) : (
                        <div className="step-video-box">
                          <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Link Video</label>
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