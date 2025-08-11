// src/components/forms/CourseForm.jsx

import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import CustomButton from '../common/CustomButton';
import useInstructorApi from '../../hooks/useInstructorApi';
import texts from '../../i18n/texts';

const CourseForm = ({ initialData = {}, onSubmit, isEditMode = false }) => {
    const [formData, setFormData] = useState({
        name: initialData.name || '',
        description: initialData.description || '',
        instructorId: initialData.instructorId || '',
    });
    const [formErrors, setFormErrors] = useState({});

    const { data: instructors, loading: loadingInstructors, error: instructorsError, getAllInstructors } = useInstructorApi();

    useEffect(() => {
        getAllInstructors();
    }, []);

    useEffect(() => {
        if (isEditMode && initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                instructorId: initialData.instructorId || '',
            });
        }
    }, [initialData, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '', // Clear error on change
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Course name is required.';
        if (!formData.description.trim()) errors.description = 'Course description is required.';
        if (!formData.instructorId) errors.instructorId = 'Instructor is required.';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="p-4 border rounded-4 shadow-sm bg-light">
            <h4 className="mb-4 text-primary">{isEditMode ? texts.sections.editCourse : texts.sections.createCourse}</h4>

            {instructorsError && <Alert variant="danger">{texts.alerts.apiError(instructorsError)}</Alert>}

            <Form.Group className="mb-3" controlId="courseName">
                <Form.Label>{texts.forms.courseName}</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    isInvalid={!!formErrors.name}
                    placeholder="e.g., Introduction to React"
                />
                <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="courseDescription">
                <Form.Label>{texts.forms.courseDescription}</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    isInvalid={!!formErrors.description}
                    placeholder="A brief description of the course..."
                />
                <Form.Control.Feedback type="invalid">{formErrors.description}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="instructorId">
                <Form.Label>{texts.forms.selectInstructor}</Form.Label>
                <Form.Select
                    name="instructorId"
                    value={formData.instructorId}
                    onChange={handleChange}
                    isInvalid={!!formErrors.instructorId}
                    disabled={loadingInstructors}
                >
                    <option value="">{texts.forms.selectInstructor}...</option>
                    {loadingInstructors ? (
                        <option disabled>Loading instructors...</option>
                    ) : (
                        instructors && instructors.map((instructor) => (
                            <option key={instructor.id} value={instructor.id}>
                                {instructor.name} ({instructor.email})
                            </option>
                        ))
                    )}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{formErrors.instructorId}</Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid">
                <CustomButton
                    variant="primary"
                    type="submit"
                    isLoading={loadingInstructors} // Use loading state of API calls if button triggers them
                >
                    {isEditMode ? texts.forms.updateCourse : texts.forms.addCourse}
                </CustomButton>
            </div>
        </Form>
    );
};

export default CourseForm;