// src/components/course/modals/InstructorEditModal.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import CustomButton from '../../common/CustomButton.jsx';
import texts from '../../../i18n/texts';

const InstructorEditModal = ({ show, onHide, instructor, onSave, isLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        bio: ''
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (instructor) {
            setFormData({
                name: instructor.name || '',
                email: instructor.email || '',
                phone: instructor.phone || '',
                bio: instructor.bio || ''
            });
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
        // Add more validation rules as needed
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSave(formData);
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
                    <Form.Group className="mb-3" controlId="editBio">
                        <Form.Label>Biography</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="bio"
                            value={formData.bio}
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