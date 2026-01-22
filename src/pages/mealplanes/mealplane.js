import React, { useState, useMemo } from 'react';
import './mealplan.css';

const MealPlan = () => {
  // Dữ liệu mẫu
  const [recipes] = useState([
    { id: 'r1', name: 'Phở Bò Hà Nội', region: 'Miền Bắc', tags: ['phở'] },
    { id: 'r2', name: 'Bún Bò Huế', region: 'Miền Trung', tags: ['bún'] },
    { id: 'r3', name: 'Cơm Tấm Sườn', region: 'Miền Nam', tags: ['cơm'] },
    { id: 'r4', name: 'Bánh Mì Chảo', region: 'Miền Nam', tags: ['bánh'] },
    { id: 'r5', name: 'Nem Rán', region: 'Miền Bắc', tags: ['món mặn'] },
    { id: 'r6', name: 'Canh Chua Cá', region: 'Miền Tây', tags: ['canh'] },
    { id: 'r7', name: 'Mì Quảng', region: 'Miền Trung', tags: ['mì'] },
  ]);

  const [plan, setPlan] = useState({
    't2_breakfast': { id: 'r1', name: 'Phở Bò Hà Nội', region: 'Miền Bắc' },
    't3_lunch': { id: 'r3', name: 'Cơm Tấm Sườn', region: 'Miền Nam' },
    't4_dinner': { id: 'r6', name: 'Canh Chua Cá', region: 'Miền Tây' },
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);

  // LOGIC THỐNG KÊ (Tính toán số liệu)
  const stats = useMemo(() => {
    const meals = Object.values(plan);
    const totalMeals = meals.length;
    
    // Đếm số món theo từng vùng miền
    const regionCounts = { 'Miền Bắc': 0, 'Miền Trung': 0, 'Miền Nam': 0, 'Miền Tây': 0 };
    meals.forEach(meal => {
      if (regionCounts[meal.region] !== undefined) {
        regionCounts[meal.region]++;
      }
    });

    return { totalMeals, regionCounts };
  }, [plan]);

  // Cấu hình Grid
  const days = [
    { key: 't2', label: 'Thứ 2' }, { key: 't3', label: 'Thứ 3' }, { key: 't4', label: 'Thứ 4' },
    { key: 't5', label: 'Thứ 5' }, { key: 't6', label: 'Thứ 6' }, { key: 't7', label: 'Thứ 7' }, { key: 'cn', label: 'CN' }
  ];
  const mealTypes = [
    { key: 'breakfast', label: 'Sáng' }, { key: 'lunch', label: 'Trưa' },
    { key: 'dinner', label: 'Tối' }, { key: 'snack', label: 'Phụ' }
  ];

  // Logic lọc và kéo thả
  const filteredRecipes = recipes.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!regionFilter || r.region === regionFilter) &&
    (!activeTag || r.tags.some(t => t.includes(activeTag)))
  );

  const handleDragStart = (e, item, source, currentKey) => {
    setDraggedItem({ ...item, source, currentKey });
    e.dataTransfer.effectAllowed = "move";
  };
  
  const handleDrop = (e, targetKey) => {
    e.preventDefault();
    if (!draggedItem) return;
    const newPlan = { ...plan };
    const newItem = { ...draggedItem }; 
    
    if (draggedItem.source === 'sidebar') {
      newPlan[targetKey] = newItem;
    } else if (draggedItem.source === 'grid') {
      const oldKey = draggedItem.currentKey;
      const targetItem = newPlan[targetKey];
      newPlan[targetKey] = newItem;
      if (targetItem) newPlan[oldKey] = targetItem;
      else delete newPlan[oldKey];
    }
    setPlan(newPlan);
    setDraggedItem(null);
  };

  return (
    <div className="meal-plan-container">
      <div className="container"> {/* Thêm div container bao ngoài */}
        <h1 className="page-title">Kế Hoạch Bữa Ăn</h1>
        <div className="drag-instructions">
          <i className="fas fa-hand-point-up"></i>
          <p><strong>Hướng dẫn:</strong> Kéo món từ thư viện vào lịch để lên thực đơn.</p>
        </div>

        <div className="meal-plan-controls">
           <div className="week-navigation">
              <button className="week-btn"><i className="fas fa-chevron-left"></i></button>
              <div className="current-week">Tuần 25, 17-23/06/2024</div>
              <button className="week-btn"><i className="fas fa-chevron-right"></i></button>
           </div>
           <button className="action-btn" onClick={() => {if(window.confirm('Xóa hết?')) setPlan({})}}>
             <i className="fas fa-trash"></i> Xóa kế hoạch
           </button>
        </div>

        <div className="meal-plan-layout">
          {/* SIDEBAR */}
          <aside className="recipe-sidebar">
            <div className="sidebar-header">
               <h2><i className="fas fa-book"></i> Thư viện</h2>
            </div>
            
            <select className="filter-dropdown" value={regionFilter} onChange={e => setRegionFilter(e.target.value)}>
              <option value="">Tất cả khu vực</option>
              <option value="Miền Bắc">Miền Bắc</option>
              <option value="Miền Trung">Miền Trung</option>
              <option value="Miền Nam">Miền Nam</option>
            </select>

            <div className="sidebar-search">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Tìm món..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
            </div>

            <div className="quick-tags">
              {['phở', 'bún', 'cơm'].map(t => (
                <span key={t} className={`quick-tag ${activeTag===t?'active':''}`} onClick={()=>setActiveTag(activeTag===t?'':t)}>{t}</span>
              ))}
            </div>

            <div className="palette-recipes">
              {filteredRecipes.map(r => (
                <div key={r.id} className="palette-recipe" draggable onDragStart={(e) => handleDragStart(e, r, 'sidebar')}>
                   <div className="palette-recipe-title">{r.name}</div>
                   <div className="palette-recipe-region">{r.region}</div>
                </div>
              ))}
            </div>
          </aside>

          {/* GRID */}
          <div className="meal-plan-grid">
            <div className="grid-header"></div>
            {days.map(d => <div key={d.key} className="grid-header">{d.label}</div>)}
            
            {mealTypes.map(type => (
              <React.Fragment key={type.key}>
                <div className="time-header">{type.label}</div>
                {days.map(day => {
                  const cellKey = `${day.key}_${type.key}`;
                  const meal = plan[cellKey];
                  return (
                    <div 
                      key={cellKey} 
                      className={`meal-cell ${!meal ? 'empty' : ''}`}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => handleDrop(e, cellKey)}
                    >
                      {meal ? (
                        <div className="meal-content" draggable onDragStart={(e) => handleDragStart(e, meal, 'grid', cellKey)}>
                          <div className="meal-recipe">{meal.name}</div>
                          <div className="meal-region">{meal.region}</div>
                          <div className="meal-actions">
                            <div className="meal-action-btn" onClick={() => {
                              const newPlan = {...plan}; delete newPlan[cellKey]; setPlan(newPlan);
                            }}>
                              <i className="fas fa-trash-alt"></i>
                            </div>
                          </div>
                        </div>
                      ) : (<i className="fas fa-plus"></i>)}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* PHẦN THỐNG KÊ (Chuẩn theo file HTML) */}
        <div className="nutrition-summary">
          <h3><i className="fas fa-chart-pie"></i> Thống kê bữa ăn</h3>
          <div className="nutrition-stats">
            
            {/* Thẻ 1: Tổng số bữa */}
            <div className="nutrition-stat">
              <div className="nutrition-stat-label">Tổng số bữa</div>
              <div className="nutrition-stat-value success">{stats.totalMeals}</div>
            </div>

            {/* Thẻ 2,3,4: Thống kê vùng miền */}
            <div className="nutrition-stat">
              <div className="nutrition-stat-label">Đa dạng vùng miềns</div>
              <div className="nutrition-stat-value">{stats.regionCounts['Miền Bắc']}/4</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MealPlan;