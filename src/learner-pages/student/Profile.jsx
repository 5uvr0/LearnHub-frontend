// src/student-pages/StudentProfilePage.jsx
import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import useStudentApi from "../../learner-hooks/useStudentApi";
import StudentCard from "../../components/learner/cards/StudentCard.jsx";

const studentId = 1;

const StudentProfilePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getStudentById } = useStudentApi();
    const [student, setStudent] = useState(null);


    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const result = await getStudentById(studentId);
                setStudent(result);

            } catch (err) {
                console.error("Failed to load student", err);
                setError("Failed to load Student");

            } finally {
                setLoading(false);
            }
        };

        fetchStudent();

    }, [studentId, getStudentById]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!student) return <p>No student found</p>;

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
