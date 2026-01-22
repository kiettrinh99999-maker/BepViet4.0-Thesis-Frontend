import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/Authen";
import QuestionItem from "../../components/Forums/QuestionItem";
import './forum.css';

export default function ForumPage(){
  const [questions, setQuestions] = useState(null);
  const [totalAnswers, setTotalAnswers] = useState(null);
  const [page, setPage] = useState(1);
  const { user, api } = useAuth();

  useEffect(() => {
    // Gọi API lấy danh sách question theo page
    fetch(`${api}questions?page=${page}`)
      .then(res => res.json())
      .then(res => {
        setQuestions(res.data);
      });
  }, [page, api]);

  
  useEffect(() => {
    // Gọi API lấy tổng số answer
    fetch(api + "answers")
      .then(res => res.json())
      .then(res => {
        setTotalAnswers(res.data.total);
      });
  }, [api]);
  
  //Nếu chưa fetch xong sẽ hiển thị thông báo đang tải
  if (questions === null || totalAnswers === null) {
    return <h4 className="text-center mt-5">Đang tải...</h4>;
  }

    return (
    <div className="container">

      {/* Login Notice */}
      {!user && (
        <div className="login-notice">
          <i className="fas fa-info-circle"></i>
          Tài khoản chưa đăng nhập. Vui lòng <strong>Đăng nhập</strong> để đặt câu hỏi
          và tham gia thảo luận.
        </div>
      )}

      {/* Forum Header */}
      <div className="forum-header">
        <h1 className="forum-title">Diễn Đàn Hỏi Đáp</h1>
        <p className="forum-description">
          Nơi trao đổi, thảo luận và giải đáp mọi thắc mắc về ẩm thực Việt Nam.
        </p>

        <div className="forum-stats">
          <div className="stat-item">
            <i className="fas fa-question-circle"></i>
            <span>{questions.total} câu hỏi</span>
          </div>
          <div className="stat-item">
            <i className="fas fa-comments"></i>
            <span>{totalAnswers} trả lời</span>
          </div>
        </div>
      </div>

      {/* Ask Question Form (giữ UI, chưa gắn submit) */}
      <div className="ask-question-form">
        <h3 className="form-title">Đặt Câu Hỏi Mới</h3>
        <form>
          <div className="form-group">
            <label>Tiêu đề câu hỏi</label>
            <input type="text" placeholder="Nhập tiêu đề..." />
          </div>
          <div className="form-group">
            <label>Nội dung câu hỏi</label>
            <textarea placeholder="Mô tả chi tiết..." />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">
                Ảnh minh họa (tuỳ chọn)
            </label>

            <input
                type="file"
                className="form-control"
                accept="image/*"
                
            />
            </div>
          <button type="button" className="btn btn-primary">
            <i className="fas fa-paper-plane"></i> Đăng Câu Hỏi
          </button>
        </form>
      </div>

      {/* Questions List */}
    <div className="questions-list">
        {questions.data.map(q => (
            <QuestionItem
                key={q.id}
                question={q}
            />
        ))}
    </div>

      {/* Pagination (HTML giữ nguyên, chỉ đổi logic) */}
      <div className="pagination">

        <button
          className={`pagination-btn ${questions.current_page === 1 ? "disabled" : ""}`}
          onClick={() => setPage(page - 1)}
          disabled={questions.current_page === 1}
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        {Array.from({ length: questions.last_page }, (_, i) => {
          const pageNumber = i + 1;
          return (
            <button
              key={i}
              className={`pagination-btn ${
                questions.current_page === pageNumber ? "active" : ""
              }`}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          className={`pagination-btn ${
            questions.current_page === questions.last_page ? "disabled" : ""
          }`}
          onClick={() => setPage(page + 1)}
          disabled={questions.current_page === questions.last_page}
        >
          <i className="fas fa-chevron-right"></i>
        </button>

      </div>
    </div>
  );
}