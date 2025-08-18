// src/student-pages/EditStudentPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStudentApi from "../../learner-hooks/useStudentApi";

const EditStudentPage = () => {
    const { data: student, getStudentById, updateStudent, loading, error } = useStudentApi();
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    const studentId = localStorage.getItem("studentId");

    useEffect(() => {
        if (studentId) {
            getStudentById(studentId).then((res) => setFormData(res));
        }
    }, [studentId, getStudentById]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateStudent(studentId, formData);
        navigate("/student/profile");
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="firstName"
                    value={formData.firstName || ""}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    name="lastName"
                    value={formData.lastName || ""}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    placeholder="Address"
                    className="w-full border px-3 py-2 rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditStudentPage;
