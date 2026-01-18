import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Modal, Badge, InputGroup } from 'react-bootstrap';
import { FaSearch, FaCartPlus, FaTrash, FaCheckSquare, FaPrint, FaTimes, FaUtensils, FaArrowRight } from 'react-icons/fa';
import { FaSquare } from 'react-icons/fa6'; // Icon ô vuông trống
import './Shopping.css'

// Dữ liệu mẫu (Lấy từ script cũ của bạn)
const RECIPE_DATA = {
  "pho-bo": {
    name: "Phở bò tái nạm gầu gân bò viên đặc biệt",
    region: "Miền Bắc",
    ingredients: [
      { name: "Bánh phở", quantity: "500g", image: "https://images.unsplash.com/photo-1559314809-2b99056a8c4a?w=100" },
      { name: "Thịt bò tái", quantity: "200g", image: "https://images.unsplash.com/photo-1613478954751-274737d6e6a3?w=100" },
      { name: "Xương bò", quantity: "1kg", image: "https://images.unsplash.com/photo-1615937651188-80b4f85e783a?w=100" },
      { name: "Hành tây", quantity: "2 củ", image: "https://images.unsplash.com/photo-1618375682229-873b8852377c?w=100" },
    ]
  },
  "com-tam": {
    name: "Cơm tấm sườn nướng mật ong",
    region: "Miền Nam",
    ingredients: [
      { name: "Gạo tấm", quantity: "500g", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100" },
      { name: "Sườn heo", quantity: "800g", image: "https://images.unsplash.com/photo-1544025162-d76690b67f61?w=100" },
      { name: "Mật ong", quantity: "50ml", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=100" },
    ]
  }
};

const ShoppingList = () => {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [shoppingList, setShoppingList] = useState([]);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Xử lý tìm kiếm công thức
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }
    const results = Object.keys(RECIPE_DATA)
      .filter(key => RECIPE_DATA[key].name.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(key => ({ id: key, ...RECIPE_DATA[key] }));
    setSearchResults(results);
  }, [searchTerm]);

  // Chọn công thức
  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setSearchTerm(''); // Xóa ô tìm kiếm cho gọn
    setSearchResults([]);
  };

  // Thêm 1 nguyên liệu vào danh sách
  const addToShoppingList = (ingredient, recipeName) => {
    const newItem = {
      id: Date.now() + Math.random(),
      ...ingredient,
      source: recipeName,
      checked: false
    };
    setShoppingList(prev => [...prev, newItem]);
  };

  // Thêm tất cả nguyên liệu
  const addAllIngredients = () => {
    if (!selectedRecipe) return;
    const newItems = selectedRecipe.ingredients.map(ing => ({
      id: Date.now() + Math.random(), // ID tạm
      ...ing,
      source: selectedRecipe.name,
      checked: false
    }));
    setShoppingList(prev => [...prev, ...newItems]);
  };

  // Xử lý Check/Uncheck item
  const toggleCheckItem = (id) => {
    setShoppingList(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  // Xóa item
  const removeItem = (id) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  };

  // Các chức năng Toolbar
  const clearList = () => setShoppingList([]);
  const checkAll = () => setShoppingList(prev => prev.map(item => ({ ...item, checked: true })));
  const uncheckAll = () => setShoppingList(prev => prev.map(item => ({ ...item, checked: false })));

  return (
    <div className="shopping-page py-4">
      <Container>
        {/* Header Title */}
        <div className="text-center mb-5">
          <h1 className="font-playfair display-4 fw-bold text-danger">Shopping List</h1>
          <p className="text-muted">Chọn công thức và tạo danh sách mua sắm dễ dàng</p>
        </div>

        <Row>
          {/* CỘT TRÁI: Tìm kiếm & Chọn nguyên liệu */}
          <Col lg={6} className="mb-4">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <h4 className="font-playfair mb-4 text-danger">
                  <FaSearch className="me-2" /> Tìm công thức
                </h4>
                
                {/* Search Box */}
                <div className="position-relative mb-4">
                  <InputGroup>
                    <InputGroup.Text className="bg-white"><FaSearch /></InputGroup.Text>
                    <Form.Control
                      placeholder="Nhập tên món (vd: Phở, Cơm tấm...)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                  
                  {/* Dropdown kết quả tìm kiếm */}
                  {searchResults.length > 0 && (
                    <ListGroup className="position-absolute w-100 shadow mt-1" style={{ zIndex: 10 }}>
                      {searchResults.map(recipe => (
                        <ListGroup.Item 
                          key={recipe.id} 
                          action 
                          onClick={() => handleSelectRecipe(recipe)}
                        >
                          {recipe.name} <Badge bg="light" text="dark" className="float-end">{recipe.region}</Badge>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </div>

                {/* Khu vực hiển thị công thức đã chọn */}
                {selectedRecipe ? (
                  <div className="animate__animated animate__fadeIn">
                    <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
                      <h5 className="mb-0 text-danger font-playfair">{selectedRecipe.name}</h5>
                      <Button variant="link" size="sm" className="text-muted text-decoration-none" onClick={() => setSelectedRecipe(null)}>
                        <FaTimes /> Đóng
                      </Button>
                    </div>

                    <div className="custom-scroll pe-2">
                      {selectedRecipe.ingredients.map((ing, idx) => (
                        <div key={idx} className="ingredient-item d-flex align-items-center p-2 mb-2 rounded bg-white">
                          <img src={ing.image} alt={ing.name} className="rounded me-3" style={{width: '50px', height: '50px', objectFit: 'cover'}} />
                          <div className="flex-grow-1">
                            <div className="fw-bold">{ing.name}</div>
                            <small className="text-danger fw-bold">{ing.quantity}</small>
                          </div>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            className="rounded-circle" 
                            onClick={() => addToShoppingList(ing, selectedRecipe.name)}
                          >
                            <FaCartPlus />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <Button className="btn-custom-primary w-100 mt-3" onClick={addAllIngredients}>
                      <FaCartPlus className="me-2" /> Thêm tất cả vào danh sách
                    </Button>
                  </div>
                ) : (
                    // Trạng thái chưa chọn công thức
                    <div className="text-center text-muted py-5 opacity-50">
                        <FaUtensils size={40} className="mb-3" />
                        <p>Hãy tìm và chọn một công thức để xem nguyên liệu</p>
                    </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* CỘT PHẢI: Danh sách mua sắm */}
          <Col lg={6} className="mb-4">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="d-flex flex-column">
                <h4 className="font-playfair mb-3 text-danger">
                   <FaCartPlus className="me-2" /> Danh sách cần mua ({shoppingList.filter(i => !i.checked).length})
                </h4>

                {/* Toolbar buttons */}
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <Button variant="outline-secondary" size="sm" onClick={checkAll}><FaCheckSquare /> Chọn hết</Button>
                  <Button variant="outline-secondary" size="sm" onClick={uncheckAll}><FaSquare /> Bỏ chọn</Button>
                  <Button variant="outline-danger" size="sm" onClick={clearList}><FaTrash /> Xóa hết</Button>
                  <Button className="btn-custom-primary ms-auto" size="sm" onClick={() => setShowPrintModal(true)}>
                    <FaPrint /> In DS
                  </Button>
                </div>

                {/* List Items */}
                <div className="flex-grow-1 custom-scroll p-2 border rounded bg-light">
                  {shoppingList.length === 0 ? (
                    <div className="text-center text-muted h-100 d-flex flex-column justify-content-center align-items-center">
                      <FaCartPlus size={40} className="mb-3 opacity-25" />
                      <p>Danh sách trống</p>
                    </div>
                  ) : (
                    shoppingList.map((item) => (
                      <div key={item.id} className={`shopping-item d-flex align-items-center p-2 mb-2 rounded bg-white shadow-sm ${item.checked ? 'checked' : ''}`}>
                        <div className="me-3 cursor-pointer" onClick={() => toggleCheckItem(item.id)} style={{cursor: 'pointer'}}>
                          {item.checked ? <FaCheckSquare className="text-success fs-5" /> : <FaSquare className="text-muted fs-5" />}
                        </div>
                        <img src={item.image} alt="" className="rounded me-3" style={{width: '40px', height: '40px', objectFit: 'cover'}} />
                        <div className="flex-grow-1">
                          <div className="fw-bold item-name">{item.name}</div>
                          <div className="small text-muted">{item.source}</div>
                        </div>
                        <div className="fw-bold text-danger me-3">{item.quantity}</div>
                        <Button variant="link" className="text-danger p-0" onClick={() => removeItem(item.id)}>
                          <FaTimes />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal In Danh Sách */}
      <Modal show={showPrintModal} onHide={() => setShowPrintModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="font-playfair text-danger">Xem trước khi in</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="text-center mb-4">
            <h2 className="font-playfair text-danger">Bếp Việt 4.0</h2>
            <p className="text-muted">Danh sách mua sắm ngày {new Date().toLocaleDateString('vi-VN')}</p>
          </div>
          
          <h5 className="border-bottom pb-2 mb-3 text-danger">Cần mua</h5>
          <ListGroup variant="flush" className="mb-4">
            {shoppingList.filter(i => !i.checked).map(item => (
               <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center px-0">
                  <span>
                    <FaSquare className="me-2 text-muted"/> {item.name} <span className="text-muted small">({item.source})</span>
                  </span>
                  <span className="fw-bold">{item.quantity}</span>
               </ListGroup.Item>
            ))}
            {shoppingList.filter(i => !i.checked).length === 0 && <p className="text-muted fst-italic">Không có mục nào.</p>}
          </ListGroup>

          <h5 className="border-bottom pb-2 mb-3 text-success">Đã mua / Đã có</h5>
          <ListGroup variant="flush">
            {shoppingList.filter(i => i.checked).map(item => (
               <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center px-0 text-muted" style={{textDecoration: 'line-through'}}>
                  <span>
                    <FaCheckSquare className="me-2"/> {item.name}
                  </span>
                  <span>{item.quantity}</span>
               </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPrintModal(false)}>Đóng</Button>
          <Button variant="danger" onClick={() => window.print()}><FaPrint className="me-2"/> In ngay</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ShoppingList;