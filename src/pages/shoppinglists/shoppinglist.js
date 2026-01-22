import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/Authen'; // Import Context từ file Authen.js bạn gửi trước đó
import './Shopping.css'; 

const ShoppingList = () => {
    // 1. Lấy context Auth
    const { api, token, store } = useAuth();

    // 2. State
    const [shoppingList, setShoppingList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null); // Lưu công thức đang chọn để kéo thả
    const [isDragOver, setIsDragOver] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // 3. Load danh sách Shopping List từ API khi vào trang
    useEffect(() => {
        fetchShoppingList();
    }, [api, token]);

    const fetchShoppingList = async () => {
        try {
            const response = await fetch(`${api}shopping-list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) {
                setShoppingList(result.data);
            }
        } catch (error) {
            console.error("Lỗi tải danh sách:", error);
        }
    };

    // 4. Tìm kiếm công thức (Gọi API recipes)
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length < 2) {
                setSearchResults([]);
                return;
            }
            try {
                // Gọi API tìm kiếm recipe
                const response = await fetch(`${api}recipes?keyword=${searchQuery}`, {
                     headers: { 'Authorization': `Bearer ${token}` }
                });
                const result = await response.json();
                if (result.success) {
                    setSearchResults(result.data); // API trả về mảng recipes
                }
            } catch (error) {
                console.error("Lỗi tìm kiếm:", error);
            }
        }, 500); // Debounce 500ms để đỡ gọi API liên tục

        return () => clearTimeout(timer);
    }, [searchQuery, api, token]);

    // 5. Chọn công thức để hiển thị nguyên liệu
    const handleSelectRecipe = async (recipeId) => {
        try {
            // Gọi API lấy chi tiết recipe (kèm ingredients)
            const response = await fetch(`${api}recipes/${recipeId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) {
                setSelectedRecipe(result.data);
                setSearchQuery('');
                setSearchResults([]);
            }
        } catch (error) {
            console.error("Lỗi lấy chi tiết công thức:", error);
        }
    };

    // 6. Thêm nguyên liệu vào DB (Gọi API)
    const addToShoppingList = async (ingredient, sourceName) => {
        // Kiểm tra trùng lặp trên client cho nhanh (hoặc để server lo)
        const exists = shoppingList.find(item => item.name === ingredient.name && item.source === sourceName);
        if (exists) {
            alert(`${ingredient.name} đã có trong danh sách`);
            return;
        }

        try {
            const response = await fetch(`${api}shopping-list`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: ingredient.name,
                    quantity: ingredient.quantity,
                    image: ingredient.image, // URL ảnh hoặc path
                    source: sourceName,      // Tên món ăn nguồn
                    checked: false
                })
            });
            const result = await response.json();
            if (result.success) {
                // Cập nhật state UI ngay lập tức
                setShoppingList(prev => [...prev, result.data]);
                // alert(`Đã thêm ${ingredient.name}`);
            }
        } catch (error) {
            console.error("Lỗi thêm món:", error);
        }
    };

    // 7. Thêm TẤT CẢ nguyên liệu của món đang chọn
    const handleAddAll = async () => {
        if (!selectedRecipe) return;
        
        setIsLoading(true);
        // Cách đơn giản: Lặp và gọi API (Hoặc backend nên có endpoint add-bulk)
        let count = 0;
        for (const ing of selectedRecipe.ingredients) {
            const exists = shoppingList.find(item => item.name === ing.name);
            if (!exists) {
                await addToShoppingList(ing, selectedRecipe.name);
                count++;
            }
        }
        setIsLoading(false);
        if(count > 0) alert(`Đã thêm ${count} nguyên liệu!`);
    };

    // 8. Update Check/Uncheck (Gọi API PUT)
    const toggleItemCheck = async (id, currentState) => {
        // Optimistic Update (Cập nhật giao diện trước cho mượt)
        const updatedList = shoppingList.map(item => 
            item.id === id ? { ...item, checked: !currentState } : item
        );
        setShoppingList(updatedList);

        try {
            await fetch(`${api}shopping-list/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ checked: !currentState })
            });
        } catch (error) {
            console.error("Lỗi update:", error);
            // Revert nếu lỗi (nếu cần thiết)
        }
    };

    // 9. Xóa món (Gọi API DELETE)
    const removeItem = async (id) => {
        if(!window.confirm("Xóa món này?")) return;

        try {
            const response = await fetch(`${api}shopping-list/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setShoppingList(prev => prev.filter(item => item.id !== id));
            }
        } catch (error) {
            console.error("Lỗi xóa:", error);
        }
    };

    // 10. Xóa tất cả
    const clearList = async () => {
        if (shoppingList.length === 0) return;
        if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ danh sách?')) return;

        try {
            // Giả sử có API clear-all, nếu không thì phải lặp xóa từng cái
            await fetch(`${api}shopping-list/clear`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setShoppingList([]);
        } catch (error) {
            console.error("Lỗi xóa tất cả:", error);
        }
    };

    // --- LOGIC KÉO THẢ (DRAG & DROP) ---
    const handleDragStart = (e, type, data) => {
        e.dataTransfer.setData('application/json', JSON.stringify({ type, ...data }));
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);

        const rawData = e.dataTransfer.getData('application/json');
        if (!rawData) return;
        
        const data = JSON.parse(rawData);

        if (data.type === 'ingredient') {
            // Kéo từ công thức bên trái sang
            // Data chứa recipeIndex và ingredientIndex -> nhưng giờ ta dùng selectedRecipe
            // Vì selectedRecipe là state, ta lấy trực tiếp từ đó
            const ingredient = selectedRecipe.ingredients[data.index];
            addToShoppingList(ingredient, selectedRecipe.name);
        } 
    };

    // --- LOGIC IN ẤN ---
    const handlePrint = () => {
        const printContent = document.getElementById('print-modal-content').innerHTML;
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Print Shopping List</title>');
        // CSS inline đơn giản để in ra đẹp
        printWindow.document.write(`
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .print-header { text-align: center; border-bottom: 2px solid #d32f2f; margin-bottom: 20px; }
                .print-logo { color: #d32f2f; font-size: 24px; font-weight: bold; }
                .print-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed #ccc; }
                .print-item img { display: none; } /* Ẩn ảnh khi in cho tiết kiệm mực */
                .print-item-name { font-weight: bold; }
                .checked { text-decoration: line-through; color: #999; }
                .print-actions, .print-modal-close { display: none; }
            </style>
        `);
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
    };

    // Helper: Xử lý đường dẫn ảnh (có thể từ store hoặc link ngoài)
    const getImageUrl = (path) => {
        if (!path) return 'https://via.placeholder.com/50';
        if (path.startsWith('http')) return path;
        return `${store}${path}`; // store lấy từ useAuth
    };

    return (
        <div className="container">
            <h1 className="page-title">Shopping List</h1>
            <p className="page-subtitle">Kéo thả nguyên liệu vào danh sách mua sắm của bạn</p>

            <div className="shopping-list-container">
                
                {/* --- CỘT TRÁI: TÌM KIẾM & CÔNG THỨC --- */}
                <section className="recipe-search-section">
                    <h2 className="section-heading"><i className="fas fa-search"></i> Tìm công thức</h2>
                    
                    <div className="recipe-search">
                        <div className="search-container">
                            <input 
                                type="text" 
                                className="search-input" 
                                placeholder="Nhập tên món (ví dụ: Phở bò...)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {/* Kết quả tìm kiếm Dropdown */}
                            {searchResults.length > 0 && (
                                <div className="search-results" style={{display: 'block'}}>
                                    {searchResults.map((recipe) => (
                                        <div key={recipe.id} className="search-result-item" onClick={() => handleSelectRecipe(recipe.id)}>
                                            <div className="result-name">{recipe.name}</div>
                                            {/* Giả sử API trả về region trong recipe */}
                                            <div className="result-region">{recipe.region?.name || 'Món ngon'}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Hiển thị chi tiết công thức đã chọn */}
                    {selectedRecipe && (
                        <div className="selected-recipe">
                            <div className="selected-recipe-header">
                                <h3 className="selected-recipe-title">{selectedRecipe.name}</h3>
                                <button className="clear-recipe" onClick={() => setSelectedRecipe(null)}>
                                    <i className="fas fa-times"></i> Xóa
                                </button>
                            </div>
                            
                            <div className="ingredients-container">
                                {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 ? (
                                    selectedRecipe.ingredients.map((ing, idx) => (
                                        <div 
                                            key={idx} 
                                            className="ingredient-draggable"
                                            draggable="true"
                                            // Truyền index để handleDrop biết lấy item nào trong mảng selectedRecipe.ingredients
                                            onDragStart={(e) => handleDragStart(e, 'ingredient', { index: idx })}
                                        >
                                            <div className="ingredient-image">
                                                <img src={getImageUrl(ing.image)} alt={ing.name} />
                                            </div>
                                            <div className="ingredient-info">
                                                <div className="ingredient-name">{ing.name}</div>
                                                <div className="ingredient-quantity">{ing.quantity} {ing.unit}</div>
                                            </div>
                                            <div className="ingredient-drag-icon">
                                                <i className="fas fa-grip-vertical"></i>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Không có thông tin nguyên liệu.</p>
                                )}
                            </div>

                            <button className="add-to-list-btn" onClick={handleAddAll} disabled={isLoading}>
                                <i className="fas fa-cart-plus"></i> {isLoading ? 'Đang thêm...' : 'Thêm tất cả vào danh sách'}
                            </button>
                        </div>
                    )}
                </section>

                {/* --- CỘT PHẢI: SHOPPING LIST --- */}
                <section className="shopping-list-section">
                    <h2 className="section-heading"><i className="fas fa-shopping-cart"></i> Danh sách mua sắm</h2>
                    
                    <div className="list-controls">
                        <button className="control-btn" onClick={clearList}>
                            <i className="fas fa-trash"></i> Xóa tất cả
                        </button>
                        {/* Các nút Chọn tất cả/Bỏ chọn cần gọi API Update hàng loạt, ở đây làm tạm UI */}
                        <button className="control-btn primary" onClick={() => setShowPrintModal(true)}>
                            <i className="fas fa-print"></i> In danh sách
                        </button>
                    </div>

                    <div 
                        className={`shopping-list-container-drop ${isDragOver ? 'drag-over' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {shoppingList.length === 0 ? (
                            <div className="empty-list-message">
                                <i className="fas fa-shopping-basket"></i>
                                <h3>Danh sách trống</h3>
                                <p>Kéo thả nguyên liệu từ bên trái vào đây</p>
                            </div>
                        ) : (
                            <ul className="shopping-list-items">
                                {shoppingList.map((item) => (
                                    <li key={item.id} className={`shopping-list-item ${item.checked ? 'checked' : ''}`}>
                                        <div className="item-drag-handle"><i className="fas fa-grip-vertical"></i></div>
                                        <input 
                                            type="checkbox" 
                                            className="item-checkbox" 
                                            checked={item.checked} 
                                            onChange={() => toggleItemCheck(item.id, item.checked)}
                                        />
                                        <div className="item-image">
                                            <img src={getImageUrl(item.image)} alt={item.name} />
                                        </div>
                                        <div className="item-details">
                                            <div className={`item-name ${item.checked ? 'checked' : ''}`}>{item.name}</div>
                                            <div className="item-source">Từ: {item.source}</div>
                                        </div>
                                        <div className="item-quantity">{item.quantity}</div>
                                        <button className="item-remove" onClick={() => removeItem(item.id)}>
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        
                        {/* Chỉ hiện hướng dẫn drop khi có item hoặc khi kéo qua */}
                        <div className="drop-here-text" style={{display: 'block'}}>
                            <i className="fas fa-arrow-down"></i>
                            <p>Thả nguyên liệu vào đây</p>
                        </div>
                    </div>
                </section>
            </div>

            {/* --- MODAL IN --- */}
            {showPrintModal && (
                <div className="print-modal" style={{display: 'flex'}}>
                    <div className="print-modal-content" id="print-modal-content">
                        <button className="print-modal-close" onClick={() => setShowPrintModal(false)}>&times;</button>
                        
                        <div className="print-header">
                            <div className="print-logo">Bếp Việt 4.0</div>
                            <p>{new Date().toLocaleDateString('vi-VN')}</p>
                        </div>

                        <div className="print-section">
                            <h3>Cần mua ({shoppingList.filter(i => !i.checked).length})</h3>
                            {shoppingList.filter(i => !i.checked).map((item) => (
                                <div key={item.id} className="print-item">
                                    <div className="print-item-info">
                                        <div className="print-item-name">{item.name}</div>
                                        <small>{item.source}</small>
                                    </div>
                                    <div className="print-item-quantity">{item.quantity}</div>
                                </div>
                            ))}
                        </div>

                        <div className="print-section">
                            <h3>Đã mua ({shoppingList.filter(i => i.checked).length})</h3>
                            {shoppingList.filter(i => i.checked).map((item) => (
                                <div key={item.id} className="print-item checked">
                                    <div className="print-item-info">
                                        <div className="print-item-name checked">{item.name}</div>
                                        <small>{item.source}</small>
                                    </div>
                                    <div className="print-item-quantity">{item.quantity}</div>
                                </div>
                            ))}
                        </div>

                        <div className="print-actions">
                            <button className="print-btn secondary" onClick={() => setShowPrintModal(false)}>Đóng</button>
                            <button className="print-btn primary" onClick={handlePrint}>In ngay</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShoppingList;