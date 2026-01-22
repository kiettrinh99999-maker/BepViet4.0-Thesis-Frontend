import React, { useState } from 'react';

const MyCollections = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'

  const collectionsList = [
    { id: 1, title: "Ẩm thực Miền Bắc", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80", count: "12 công thức" },
    { id: 2, title: "Đặc sản Miền Trung", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80", count: "8 công thức" },
    { id: 3, title: "Hương vị Miền Nam", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80", count: "15 công thức" },
    { id: 4, title: "Thực đơn chay", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80", count: "10 công thức" }
  ];

  const handleSave = (e) => {
    e.preventDefault();
    alert(modalMode === 'create' ? "Đã tạo bộ sưu tập mới" : "Đã cập nhật bộ sưu tập");
    setShowModal(false);
  }

  return (
    <div className="tab-pane active fade-in">
        <div className="section-header">
            <h2 className="section-title">Bộ sưu tập đã lưu ({collectionsList.length})</h2>
            <button className="btn btn-primary" onClick={() => { setModalMode('create'); setShowModal(true); }}>
                <i className="fas fa-plus"></i> Tạo bộ sưu tập
            </button>
        </div>
        
        <div className="collection-grid">
            {collectionsList.map(col => (
                <div className="collection-card" key={col.id} onClick={() => alert('Mở: ' + col.title)}>
                    <div className="collection-image">
                        <img src={col.image} alt={col.title} />
                    </div>
                    <div className="collection-content">
                        <h3 className="collection-title">{col.title}</h3>
                        <p className="collection-count">{col.count}</p>
                        <div className="collection-actions">
                            <button className="action-btn edit" onClick={(e) => { e.stopPropagation(); setModalMode('edit'); setShowModal(true); }}>
                                <i className="far fa-edit"></i> Sửa
                            </button>
                            <button className="action-btn delete" onClick={(e) => { e.stopPropagation(); alert('Đã xóa!'); }}>
                                <i className="far fa-trash-alt"></i> Xóa
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Modal Tạo/Sửa Bộ Sưu Tập */}
        {showModal && (
            <div className="custom-modal-overlay" onClick={(e) => e.target.className === 'custom-modal-overlay' && setShowModal(false)}>
                <div className="custom-modal">
                    <div className="custom-modal-header">
                        <h2 className="custom-modal-title">{modalMode === 'create' ? 'Tạo bộ sưu tập' : 'Sửa bộ sưu tập'}</h2>
                        <button className="custom-modal-close" onClick={() => setShowModal(false)}>&times;</button>
                    </div>
                    <div className="custom-modal-body">
                        <form onSubmit={handleSave}>
                            <div className="form-group" style={{textAlign: 'center', border: '2px dashed #e0e0e0', padding: 20, marginBottom: 20}}>
                                <i className="fas fa-image" style={{fontSize: '2rem', color: '#ccc'}}></i>
                                <p style={{color: '#666'}}>Tải ảnh bìa lên</p>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tên bộ sưu tập *</label>
                                <input type="text" className="form-control" placeholder="Ví dụ: Món ăn yêu thích" required />
                            </div>
                            <div className="custom-modal-footer">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Hủy</button>
                                <button type="submit" className="btn btn-primary">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default MyCollections;