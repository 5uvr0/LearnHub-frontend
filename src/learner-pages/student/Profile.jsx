// src/student-pages/StudentProfilePage.jsx
import { useNavigate } from "react-router-dom";
import StudentCard from "../../components/learner/cards/StudentCard.jsx";
import useCurrentStudent from "../../learner-hooks/useCurrentStudent";

const StudentProfilePage = () => {
    const navigate = useNavigate();
    const { student, loading, error } = useCurrentStudent();

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center py-4">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <span className="ms-2 fw-semibold">Loading student data...</span>
        </div>
    );

    if (error) return (
        <div className="alert alert-danger" role="alert">
            <strong>Error:</strong> {error}
        </div>
    );

    if (!student) return (
        <div className="alert alert-warning" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            No student found
        </div>
    );

    return (
        <div className="container py-5">
            <h1 className="text-3xl font-bold mb-4 text-center text-primary">Student Profile</h1>
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6 d-flex">
                    <StudentCard
                        student={student}
                        onDashboard={() => navigate("/student/dashboard")}
                        onCourses={() => navigate("/student/courses")}
                        onEdit={() => navigate("/student/profile/edit")}
                    />
                </div>
            </div>
        </div>
    );
};

export default StudentProfilePage;
