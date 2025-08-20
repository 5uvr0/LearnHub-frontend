import React, { useState, useEffect } from 'react';
import { Modal, Form } from 'react-bootstrap';
import CustomButton from '../../common/CustomButton.jsx';
import texts from '../../../i18n/texts';

const InstructorEditModal = ({ show, onHide, instructor, onSave, isLoading }) => {
    // Initialize formData with all fields expected by the PATCH API
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '', // Keep phone if your backend uses it, otherwise remove
        dateOfBirth: '', // Added from PATCH body
        imageUrl: ''     // Added from PATCH body
    });
    const [originalData, setOriginalData] = useState({});
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (instructor) {
            const initialData = {
                name: instructor.name || '',
                email: instructor.email || '',
                // Ensure dateOfBirth is formatted correctly for input type="date"
                dateOfBirth: instructor.dateOfBirth ? new Date(instructor.dateOfBirth).toISOString().split('T')[0] : '',
                imageUrl: instructor.imageUrl || ''
            };
            setFormData(initialData);
            setOriginalData(initialData); // Store original data for comparison
        }
    }, [instructor]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFormErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Name is required.';
        if (!formData.email.trim()) errors.email = 'Email is required.';
        // Add more validation rules as needed, e.g., for dateOfBirth format
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Create a new object containing only the changed fields
            const changedData = {};
            // The API expects 'id' in the body even for PATCH for some reason based on your screenshot
            // However, typical PATCH only sends changed fields.
            // If the backend strictly needs ID, you might include it, but it's often not required for PATCH
            // changedData.id = instructor.id; // Only if backend explicitly requires ID in PATCH body

            for (const key in formData) {
                // Check if the current value is different from the original value
                if (formData[key] !== originalData[key]) {
                    changedData[key] = formData[key];
                }
            }

            // If nothing has changed, just hide the modal and do nothing else
            if (Object.keys(changedData).length === 0) {
                onHide();
                return;
            }

            onSave(changedData); // Send only the changed fields for a PATCH request
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Instructor Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="editName">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            isInvalid={!!formErrors.name}
                            maxLength={50}
                        />
                        <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="editEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            isInvalid={!!formErrors.email}
                            maxLength={50}
                        />
                        <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="editPhone">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            maxLength={20}
                        />
                    </Form.Group>

                    {/* New Fields from PATCH request body screenshot */}
                    <Form.Group className="mb-3" controlId="editDateOfBirth">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            isInvalid={!!formErrors.dateOfBirth}
                        />
                        <Form.Control.Feedback type="invalid">{formErrors.dateOfBirth}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="editImageUrl">
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control
                            type="url" // Use type="url" for image URLs
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <div className="d-grid gap-2">
                        <CustomButton variant="primary" type="submit" isLoading={isLoading}>
                            Save Changes
                        </CustomButton>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default InstructorEditModal;