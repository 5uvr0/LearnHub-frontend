// src/student-pages/EditStudentPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStudentApi from "../../learner-hooks/useStudentApi";

const studentId = 1; // later can be dynamic from auth/session

const EditStudentPage = () => {
    const navigate = useNavigate();
    const { getStudentById, updateStudent } = useStudentApi();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [student, setStudent] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const result = await getStudentById(studentId);
                setStudent(result);
                setFormData({
                    name: result.name || "",
                    email: result.email || "",
                    phone: result.phone || "",
                });
            } catch (err) {
                console.error("Failed to load student", err);
                setError("Failed to load Student");
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [studentId, getStudentById]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateStudent(studentId, formData);
            navigate("/student/profile"); // back to profile after save
        } catch (err) {
            console.error("Failed to update student", err);
            setError("Failed to update Student");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!student) return <p>No student found</p>;

    return (
        <div className="container py-5">
            <h1 className="text-3xl font-bold mb-4 text-center text-primary">
                Edit Student Profile
            </h1>

            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="d-flex justify-content-between">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate("/student/profile")}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditStudentPage;
