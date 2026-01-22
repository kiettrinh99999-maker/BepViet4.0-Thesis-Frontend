import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/Authen';
import './Shopping.css';

const ShoppingList = () => {
    const { api, token, store } = useAuth();

    const [shoppingList, setShoppingList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchRecipes = async (keyword = '') => {
        try {
            let url = `${api}recipes`;
            if (keyword && keyword.length >= 2) {
                url = `${api}recipes?keyword=${encodeURIComponent(keyword)}`;
            }
            const response = await fetch(url);
            const result = await response.json();
            if (result.success) {
                const recipesData = result.data;
                setSearchResults(recipesData.data);
            }
        } catch (error) {
            console.error("Lỗi tìm kiếm:", error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchRecipes(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSelectRecipe = async (recipeId) => {
        try {
            const response = await fetch(`${api}recipes/${recipeId}`);
            const result = await response.json();
            if (result.success) {
                const recipeDetail = result.data;
                setSelectedRecipe(recipeDetail);
                setSearchQuery('');
                setSearchResults([]);
            }
        } catch (error) {
            console.error("Lỗi lấy chi tiết công thức:", error);
        }
    };

    // ==========================================
    // LOGIC THÊM LOCAL (KHÔNG GỌI API SHOPPING)
    // ==========================================
    const addToShoppingList = (ingredient, sourceName) => {
        const exists = shoppingList.find(
            item => item.name === ingredient.name && item.source === sourceName
        );
        if (exists) return;

        // Tạo item mới trực tiếp vào state
        const newItem = {
            id: Date.now() + Math.random(), // Tạo ID duy nhất để React render list
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit || '',
            image: ingredient.image,
            source: sourceName,
            checked: false
        };

        setShoppingList(prev => [...prev, newItem]);
    };

    const handleAddAll = () => {
        if (!selectedRecipe) return;
        setIsLoading(true);

        const newItems = [];
        selectedRecipe.ingredients.forEach(ing => {
            const exists = shoppingList.find(item => item.name === ing.name && item.source === selectedRecipe.name);
            if (!exists) {
                newItems.push({
                    id: Date.now() + Math.random() + Math.random(),
                    name: ing.name,
                    quantity: ing.quantity,
                    unit: ing.unit || '',
                    image: ing.image,
                    source: selectedRecipe.name,
                    checked: false
                });
            }
        });

        if (newItems.length > 0) {
            setShoppingList(prev => [...prev, ...newItems]);
            alert(`Đã thêm ${newItems.length} nguyên liệu!`);
        }
        setIsLoading(false);
    };

    const toggleCheck = (id) => {
        setShoppingList(prev => prev.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const removeItem = (id) => {
        setShoppingList(prev => prev.filter(item => item.id !== id));
    };

    const clearList = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ danh sách tạm thời này?')) {
            setShoppingList([]);
        }
    };

    // =========================
    // DRAG & DROP
    // =========================
    const handleDragStart = (e, type, data) => {
        e.dataTransfer.setData('application/json', JSON.stringify({ type, ...data }));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => setIsDragOver(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);

        const rawData = e.dataTransfer.getData('application/json');
        if (!rawData) return;

        const data = JSON.parse(rawData);
        if (data.type === 'ingredient') {
            const ingredient = selectedRecipe.ingredients[data.index];
            addToShoppingList(ingredient, selectedRecipe.name);
        }
    };

    // =========================
    // PRINT & UTILS
    // =========================
    const handlePrint = () => {
        const content = document.getElementById('print-modal-content').innerHTML;
        const w = window.open('', '', 'height=600,width=800');
        w.document.write(`<html><head><title>In danh sách</title></head><body>${content}</body></html>`);
        w.document.close();
        setTimeout(() => w.print(), 500);
    };

    const getImageUrl = (path) => {
        if (!path) return 'https://via.placeholder.com/50';
        if (path.startsWith('http')) return path;
        return `${store}${path}`;
    };
    console.log(searchResults)
    return (
        <div className="container">
            <h1 className="page-title">Shopping List</h1>
            <p className="page-subtitle">Kéo thả nguyên liệu vào danh sách mua sắm của bạn</p>

            <div className="shopping-list-container">
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
                            {searchResults.length > 0 && (
                                <div className="search-results" style={{ display: 'block' }}>
                                    {searchResults.map((recipe) => (
                                        <div
                                            key={recipe.id}
                                            className="search-result-item"
                                            onClick={() => handleSelectRecipe(recipe.id)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '10px' }} // Đảm bảo ảnh và chữ nằm hàng ngang
                                        >
                                            {/* THÊM ẢNH Ở ĐÂY */}
                                            <div className="result-image" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                                                <img
                                                    src={store+recipe.image}
                                                    alt={recipe.title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                                                />
                                            </div>

                                            <div className="result-info">
                                                <div className="result-name" style={{ fontWeight: 'bold' }}>{recipe.title}</div>
                                                <div className="result-region" style={{ fontSize: '0.85em', color: '#666' }}>
                                                    {recipe.region?.title || 'Món ngon'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {selectedRecipe && (
                        <div className="selected-recipe">
                            <div className="selected-recipe-header">
                                <h3 className="selected-recipe-title">{selectedRecipe.name}</h3>
                                <button className="clear-recipe" onClick={() => setSelectedRecipe(null)}>
                                    <i className="fas fa-times"></i> Xóa
                                </button>
                            </div>
                            <div className="ingredients-container">
                                {selectedRecipe.ingredients?.map((ing, idx) => (
                                    <div
                                        key={idx}
                                        className="ingredient-draggable"
                                        draggable="true"
                                        onDragStart={(e) => handleDragStart(e, 'ingredient', { index: idx })}
                                    >
                                        <div className="ingredient-image">
                                            <img src={store+ing.image} alt={ing.name} />
                                        </div>
                                        <div className="ingredient-info">
                                            <div className="ingredient-name">{ing.name}</div>
                                            <div className="ingredient-quantity">{ing.pivot.quantity} {ing.pivot.unit}</div>
                                        </div>
                                        <div className="ingredient-drag-icon">
                                            <i className="fas fa-grip-vertical"></i>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="add-to-list-btn" onClick={handleAddAll} disabled={isLoading}>
                                <i className="fas fa-cart-plus"></i> {isLoading ? 'Đang thêm...' : 'Thêm tất cả vào danh sách'}
                            </button>
                        </div>
                    )}
                </section>

                <section className="shopping-list-section">
                    <h2 className="section-heading"><i className="fas fa-shopping-cart"></i> Danh sách mua sắm</h2>
                    <div className="list-controls">
                        <button className="control-btn" onClick={clearList}>
                            <i className="fas fa-trash"></i> Xóa tất cả
                        </button>
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
                                            onChange={() => toggleCheck(item.id)}
                                        />
                                        <div className="item-image">
                                            <img src={getImageUrl(item.image)} alt={item.name} />
                                        </div>
                                        <div className="item-details">
                                            <div className={`item-name ${item.checked ? 'checked' : ''}`}>{item.name}</div>
                                            <div className="item-source">Từ: {item.source}</div>
                                        </div>
                                        <div className="item-quantity">{item.quantity} {item.unit}</div>
                                        <button className="item-remove" onClick={() => removeItem(item.id)}>
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="drop-here-text" style={{ display: isDragOver ? 'block' : 'none' }}>
                            <i className="fas fa-arrow-down"></i>
                            <p>Thả nguyên liệu vào đây</p>
                        </div>
                    </div>
                </section>
            </div>

            {showPrintModal && (
                <div className="print-modal" style={{ display: 'flex' }}>
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
