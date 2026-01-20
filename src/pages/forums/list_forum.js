import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/Authen";
import QuestionItem from "../../components/Forums/QuestionItem";

export default function ForumPage() {
  const [questions, setQuestions] = useState(null);
  const [totalAnswers, setTotalAnswers] = useState(null);
  const [page, setPage] = useState(1);
  const {user, api} = useAuth();
  
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
    <div className="container my-4">

      {/* Login notice */}
      {!user && (
        <div className="alert alert-warning d-flex align-items-center mb-4">
          <i className="fas fa-info-circle me-2"></i>
          <div>
            Tài khoản chưa đăng nhập. Vui lòng <strong>Đăng nhập</strong> để đặt câu
            hỏi và tham gia thảo luận.
          </div>
        </div>
      )}
      {/* Forum header */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h1 className="text-danger fw-bold mb-2">
            Diễn Đàn Hỏi Đáp
          </h1>

          <p className="text-muted mb-3">
            Nơi trao đổi, thảo luận và giải đáp mọi thắc mắc về ẩm thực Việt Nam.
            Hãy đặt câu hỏi và chia sẻ kiến thức của bạn!
          </p>

          <div className="d-flex flex-wrap gap-3">
            <div className="d-flex align-items-center bg-light rounded-pill px-3 py-2">
              <i className="fas fa-question-circle text-danger me-2"></i>
              <span>{questions.total} câu hỏi</span>
            </div>

            <div className="d-flex align-items-center bg-light rounded-pill px-3 py-2">
              <i className="fas fa-comments text-danger me-2"></i>
              <span>{totalAnswers} trả lời</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ask question form */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="text-danger mb-3">Đặt Câu Hỏi Mới</h5>

          <form>
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Tiêu đề câu hỏi
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Ví dụ: Làm thế nào để phở có nước dùng trong?"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Nội dung câu hỏi
              </label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Mô tả chi tiết câu hỏi của bạn..."
              ></textarea>
            </div>

            <button type="submit" className="btn btn-danger">
              <i className="fas fa-paper-plane me-1"></i>
              Đăng Câu Hỏi
            </button>
          </form>
        </div>
      </div>

      {/* Questions list */}
      <div className="card shadow-sm mb-4">
        <div className="list-group list-group-flush">
          {questions.data.map(q => (
            <QuestionItem key={q.id} question={q} />
          ))}
        </div>
      </div>

      {/* Pagination */}
<nav className="d-flex justify-content-center mt-4">
  <ul className="pagination gap-2">

    {/* Previous */}
    <li className="page-item">
      <button
        className="btn btn-outline-danger"
        disabled={questions.current_page === 1}
        onClick={() => setPage(page - 1)}
      >
        &laquo;
      </button>
    </li>

    {/* Page numbers */}
    {Array.from({ length: questions.last_page }, (_, i) => {
      const pageNumber = i + 1;
      const isActive = questions.current_page === pageNumber;

      return (
        <li key={i} className="page-item">
          <button
            className={`btn ${
              isActive ? "btn-danger text-white" : "btn-outline-danger"
            }`}
            onClick={() => setPage(pageNumber)}
          >
            {pageNumber}
          </button>
        </li>
      );
    })}

    {/* Next */}
    <li className="page-item">
      <button
        className="btn btn-outline-danger"
        disabled={questions.current_page === questions.last_page}
        onClick={() => setPage(page + 1)}
      >
        &raquo;
      </button>
    </li>

  </ul>
</nav>



    </div>
  );
}