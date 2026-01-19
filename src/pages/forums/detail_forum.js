import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/Authen";
import { useParams, useNavigate } from "react-router";
import AnswerItem from "../../components/AnswerItem";

export default function ForumDetailPage(){
    const {id} = useParams();
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState(null);
    const navigate = useNavigate();
    const {user, api} = useAuth();
    useEffect(() => {
        fetch(`${api}questions/${id}`)
            .then(res => res.json())
            .then(res => {
                setQuestion(res.data);
            });
    }, [api, id]);
    useEffect(() => {
        fetch(`${api}questions/${id}/answers`)
            .then(res => res.json())
            .then(res => {
                setAnswers(res.data);
            });
    }, [api, id]);
    if (question === null || answers === null) {
        return <h4 className="text-center mt-5">Đang tải...</h4>;
    }
    return (
        <div className="container-fluid p-0">
            {/* Login Notice */}
            {!user && (
                <div className="alert alert-warning d-flex align-items-center mb-4">
                    <i className="fas fa-info-circle me-2"></i>
                    <div>
                        Tài khoản chưa đăng nhập. Vui lòng <strong>Đăng nhập</strong> để đặt câu hỏi và tham gia thảo luận.
                    </div>
                </div>
            )}
            <div className="container py-4">
            {/* Back Link */}
                <button className="btn btn-link text-decoration-none d-inline-flex align-items-center text-danger p-0 mb-3" onClick={() => navigate("/dien-dan")}>
                    <i className="fas fa-arrow-left me-2"></i>
                    Quay lại diễn đàn
                </button>

            {/* Question Detail */}
            <div className="card border-0 shadow mb-4">
                <div className="card-body">
                {/* Question Header */}
                <div className="border-bottom pb-3 mb-3">
                    <h1 className="h2 fw-bold text-danger mb-3">{question.title}</h1>
                    
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                    {/* Author Info */}
                    <div className="d-flex align-items-center mb-2 mb-md-0">
                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                        <i className="fas fa-user text-danger"></i>
                        </div>
                        <div>
                        <div className="fw-medium">{question.user.username}</div>
                        <small className="text-muted">{question.created_at}</small>
                        </div>
                        <button className="btn btn-danger btn-sm ms-3 d-flex align-items-center">
                            <i className="fas fa-user-plus me-1"></i>
                            Theo dõi
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="d-flex text-muted">
                        <div className="d-flex align-items-center me-3">
                        <i className="fas fa-comment text-danger me-1"></i>
                        <span>{question.answers_count} trả lời</span>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Question Content */}
                <div className="mb-4">
                    <p className="mb-3">{question.description}</p>
                    <img 
                    src="https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                    alt={question.title}
                    className="img-fluid rounded mb-3"
                    style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
                    />
                </div>
                </div>
            </div>

            {/* Answers Section */}
            <div className="card border-0 shadow mb-4">
                <div className="card-body">
                    <h2 className="h4 fw-bold text-danger mb-4 border-bottom pb-2">
                        Câu trả lời
                        <span className="text-muted fw-normal ms-2">
                            ({question.answers_count} bình luận)
                        </span>
                    </h2>

                    {answers.map(answer => (
                        <AnswerItem key={answer.id} answer={answer} />
                    ))}
                </div>
            </div>

            {/* Answer Form */}
            <div className="card border-0 shadow">
                <div className="card-body">
                <h3 className="h5 fw-bold text-danger mb-3">Trả lời câu hỏi này</h3>
                <div className="mb-3">
                    <textarea 
                    className="form-control" 
                    rows="6" 
                    placeholder="Nhập câu trả lời của bạn tại đây..."
                    ></textarea>
                </div>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-danger d-flex align-items-center">
                    <i className="fas fa-paper-plane me-2"></i>
                    Gửi câu trả lời
                    </button>
                </div>
                </div>
            </div>
            </div>
        </div>
    );
}