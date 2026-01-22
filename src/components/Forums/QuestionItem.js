import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/Authen";

export default function QuestionItem({ question }) {
const navigate = useNavigate();
const { renderDate } = useAuth();
  return (
    <div
      className="list-group-item py-4 cursor-pointer"
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/dien-dan/cau-hoi/${question.id}`)}
    >

      {/* Title */}
      <h5 className="fw-semibold mb-2">
        <a href="#" className="text-decoration-none text-dark">
          {question.title}
        </a>
      </h5>

      {/* Content */}
      <p className="text-muted mb-3">
        {question.description}
      </p>

      {/* Footer */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div className="d-flex align-items-center gap-2">
          <div
            className="bg-light rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 40, height: 40 }}
          >
            <i className="fas fa-user text-danger"></i>
          </div>
          <div>
            <div className="fw-semibold">{question.user.username}</div>
            <small className="text-muted">{renderDate(question.created_at)}</small>
          </div>
        </div>

        <div className="text-muted">
          <i className="fas fa-comment me-1 text-danger"></i>
          {question.answers_count} bình luận
        </div>
      </div>

    </div>
  );
}
