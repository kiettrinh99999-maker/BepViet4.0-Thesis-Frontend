import { useState } from "react";
import { useAuth } from "../../contexts/Authen";
export default function AnswerItem({ answer, onReload }) {
    const [showReply, setShowReply] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [loading, setLoading] = useState(false);
    const {user, api, renderDate } = useAuth();
    async function handleReplySubmit() {
        if (!user) {
            alert("Vui lòng đăng nhập để trả lời");
            return;
        }

        if (!replyContent.trim()) {
            alert("Vui lòng nhập nội dung phản hồi");
            return;
        }

        setLoading(true);

        try {
            //Gửi request POST để tạo answer con mới
            const res = await fetch(`${api}answers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: replyContent,
                    question_id: answer.question_id,
                    parent_id: answer.id,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(data);
                alert("Gửi phản hồi thất bại");
                return;
            }

            setReplyContent("");
            setShowReply(false);

            onReload();

        } catch (err) {
            console.error(err);
            alert("Không thể kết nối server");
        } finally {
            setLoading(false);
        }
    }
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

                    <button className="comment-action" onClick={() => setShowReply(!showReply)}>
                        <i className="far fa-comment me-1"></i> Trả lời
                    </button>
                </div>
            </div>

            {/* Form để answer */}
            {showReply && (
                <div className="ms-5 mb-3">
                    <textarea className="form-control mb-2" rows="3" placeholder="Viết phản hồi..." 
                        value={replyContent} onChange={(e) => setReplyContent(e.target.value)}/>
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-outline-secondary btn-sm me-2 px-2 py-1" onClick={() => setShowReply(false)} style={{ width: "auto" }}>
                            Hủy
                        </button>
                        <button className="btn btn-danger btn-sm  px-2 py-1" style={{ width: "auto" }}  onClick={handleReplySubmit}>
                            {loading ? "Đang gửi..." : "Gửi"}
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