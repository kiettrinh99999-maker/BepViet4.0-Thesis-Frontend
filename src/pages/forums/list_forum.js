import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/Authen";
import QuestionItem from "../../components/Forums/QuestionItem";
import './forum.css';

export default function ForumPage(){
  const [questions, setQuestions] = useState(null);
  const [totalAnswers, setTotalAnswers] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
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

  async function handleSubmit(){
    if (!user) {
      alert("Vui lòng đăng nhập để đặt câu hỏi");
      return;
    }

    if (!title.trim() || !description.trim()) {
      alert("Vui lòng nhập đầy đủ tiêu đề và nội dung");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await fetch(`${api}questions`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        alert("Có lỗi xảy ra");
        return;
      }

      // Reset form
      setTitle("");
      setDescription("");
      setImageFile(null);

      //reload trang
      //window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Không thể kết nối server");
    } finally {
      setLoading(false);
    }
  };

  
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

      {/* Ask Question Form */}
      <div className="ask-question-form">
        <h3 className="form-title">Đặt Câu Hỏi Mới</h3>
        <form>
          <div className="form-group">
            <label>Tiêu đề câu hỏi</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tiêu đề..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Nội dung câu hỏi</label>
            <textarea
              className="form-control"
              placeholder="Mô tả chi tiết..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label fw-semibold">
              Ảnh minh họa (tuỳ chọn)
            </label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>
          <button
            type="button"
            className="btn btn-danger px-2 py-2" style={{ width: "auto" }}
            onClick={handleSubmit}
            disabled={loading || !user}
          >
            <i className="fas fa-paper-plane"></i>{" "}
            {loading ? "Đang gửi..." : "Đăng Câu Hỏi"}
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