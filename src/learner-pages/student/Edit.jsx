// src/student-pages/EditStudentPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStudentApi from "../../learner-hooks/useStudentApi";
import useCurrentStudent from "../../learner-hooks/useCurrentStudent";

const EditStudentPage = () => {
    const navigate = useNavigate();
    const { updateStudent, loading, error } = useStudentApi();
    const { student } = useCurrentStudent();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        gender: "",
        dateOfBirth: "",
        phone: "",
        address: "",
        imageUrl: "",
        email: "", // read-only
    });

    const [fieldErrors, setFieldErrors] = useState({}); // field-level errors

    useEffect(() => {
        if (student) {
            setFormData({
                firstName: student.firstName || "",
                lastName: student.lastName || "",
                gender: student.gender || "",
                dateOfBirth: student.dateOfBirth || "",
                phone: student.phone || "",
                address: student.address || "",
                imageUrl: student.imageUrl || "",
                email: student.email || "",
            });
        }
    }, [student]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!student) return;

        setFieldErrors({}); // clear previous errors

        try {
            const updatedStudent = await updateStudent(student.id, formData);

            // If API returns a student, success
            if (updatedStudent) {
                alert("Student updated successfully!");
                navigate("/student/profile");
            }
        } catch (err) {
            // Axios / useApi errors are thrown here
            console.error("Failed to update student", err);

            if (err?.details) {
                // Backend returned field-level validation errors
                setFieldErrors(err.details);
            } else {
                alert("Failed to update student: " + (err.message || err));
            }
        }
    };

    return (
        <div className="container py-5">
            <h1 className="text-3xl font-bold mb-4 text-center text-primary">
                Edit Student Profile
            </h1>

            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <form onSubmit={handleSubmit} className="card p-4 shadow-sm">

                        {/* First Name */}
                        <div className="mb-3">
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`form-control ${fieldErrors.firstName ? 'is-invalid' : ''}`}
                                required
                            />
                            {fieldErrors.firstName && (
                                <div className="invalid-feedback">{fieldErrors.firstName}</div>
                            )}
                        </div>

                        {/* Last Name */}
                        <div className="mb-3">
                            <label className="form-label">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`form-control ${fieldErrors.lastName ? 'is-invalid' : ''}`}
                                required
                            />
                            {fieldErrors.lastName && (
                                <div className="invalid-feedback">{fieldErrors.lastName}</div>
                            )}
                        </div>

                        {/* Gender */}
                        <div className="mb-3">
                            <label className="form-label">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className={`form-select ${fieldErrors.gender ? 'is-invalid' : ''}`}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                            {fieldErrors.gender && (
                                <div className="invalid-feedback">{fieldErrors.gender}</div>
                            )}
                        </div>

                        {/* Date of Birth */}
                        <div className="mb-3">
                            <label className="form-label">Date of Birth</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className={`form-control ${fieldErrors.dateOfBirth ? 'is-invalid' : ''}`}
                            />
                            {fieldErrors.dateOfBirth && (
                                <div className="invalid-feedback">{fieldErrors.dateOfBirth}</div>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="mb-3">
                            <label className="form-label">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`form-control ${fieldErrors.phone ? 'is-invalid' : ''}`}
                            />
                            {fieldErrors.phone && (
                                <div className="invalid-feedback">{fieldErrors.phone}</div>
                            )}
                        </div>

                        {/* Address */}
                        <div className="mb-3">
                            <label className="form-label">Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className={`form-control ${fieldErrors.address ? 'is-invalid' : ''}`}
                                rows="3"
                            />
                            {fieldErrors.address && (
                                <div className="invalid-feedback">{fieldErrors.address}</div>
                            )}
                        </div>

                        {/* Profile Image URL */}
                        <div className="mb-3">
                            <label className="form-label">Profile Image URL</label>
                            <input
                                type="text"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                className={`form-control ${fieldErrors.imageUrl ? 'is-invalid' : ''}`}
                            />
                            {fieldErrors.imageUrl && (
                                <div className="invalid-feedback">{fieldErrors.imageUrl}</div>
                            )}
                        </div>

                        {/* Email */}
                        <div className="mb-3">
                            <label className="form-label">Email (cannot change)</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                className="form-control"
                                disabled
                            />
                        </div>

                        {/* Buttons */}
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
