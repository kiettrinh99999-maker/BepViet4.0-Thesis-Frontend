import { useState } from "react";
import { useAuth } from "../../contexts/Authen";
export default function AnswerItem({ answer }) {
    const [showReply, setShowReply] = useState(false);
    const { renderDate } = useAuth();
    return (
        <div className="mb-4">
            <div className="d-flex mb-2">
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3"
                     style={{ width: 40, height: 40, flexShrink: 0 }}>
                    <i className="fas fa-user text-danger"></i>
                </div>

                <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-1">
                        <span className="fw-medium me-2">
                            {answer.user.username}
                        </span>
                        <small className="text-muted">
                            {renderDate(answer.created_at)}
                        </small>
                    </div>

                    <p className="mb-2">{answer.content}</p>

                    <button className="btn btn-link p-0 text-decoration-none" onClick={() => setShowReply(!showReply)}>
                        <i className="far fa-comment me-1"></i> Trả lời
                    </button>
                </div>
            </div>

            {/* Form để answer */}
            {showReply && (
                <div className="ms-5 mb-3">
                    <textarea className="form-control mb-2" rows="3"
                        placeholder="Viết phản hồi..." />
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => setShowReply(false)}>
                            Hủy
                        </button>
                        <button className="btn btn-danger btn-sm">
                            Gửi
                        </button>
                    </div>
                </div>
            )}

            {/* Hiển thị reply con (đệ quy) */}
            {answer.answers_recursive.length > 0 && (
                <div className="ms-5 ps-4 border-start">
                    {answer.answers_recursive.map(reply => (
                        <AnswerItem key={reply.id} answer={reply} />
                    ))}
                </div>
            )}
        </div>
    );
}