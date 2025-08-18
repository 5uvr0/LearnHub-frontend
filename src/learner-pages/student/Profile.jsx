// src/student-pages/StudentProfilePage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStudentApi from "../../learner-hooks/useStudentApi";

const StudentProfilePage = () => {
    const { data: student, loading, error, getStudentById } = useStudentApi();
    const navigate = useNavigate();

    const studentId = 1

    useEffect(() => {
        if (studentId) {
            getStudentById(studentId);
        }
    }, [studentId, getStudentById]);

    if (loading) return <p>Loading...</p>;

    if (error) return <p>Error: {error.message}</p>;

    if (!student) return <p>No student found</p>;

    return (
        <div className="p-6 max-w-2xl mx-auto">

            <h1 className="text-2xl font-bold mb-4">Student Profile</h1>

            <div className="space-y-2">
                <p><strong>Name:</strong> {student.firstName} {student.lastName}</p>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Phone:</strong> {student.phone}</p>
                <p><strong>Gender:</strong> {student.gender}</p>
                <p><strong>DOB:</strong> {student.dateOfBirth}</p>
                <p><strong>Address:</strong> {student.address}</p>
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => navigate("/student/dashboard")}
                >
                    Go to Dashboard
                </button>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => navigate("/student/courses")}
                >
                    Enrolled Courses
                </button>
                <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                    onClick={() => navigate("/student/profile/edit")}
                >
                    Edit Profile
                </button>

            </div>
        </div>
    );
};

export default StudentProfilePage;
