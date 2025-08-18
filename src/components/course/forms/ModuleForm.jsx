// src/components/forms/ModuleForm.jsx

import React, { useState, useEffect } from 'react';
import { Form, Alert } from 'react-bootstrap';
import CustomButton from '../common/CustomButton.jsx';
import texts from '../../../i18n/texts.js';

const ModuleForm = ({ initialData = {}, onSubmit, isEditMode = false, isLoading = false }) => {
    const [formData, setFormData] = useState({
        title: initialData.title || '',
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (isEditMode && initialData) {
            setFormData({
                title: initialData.title || '',
            });
        } else if (!isEditMode) {
            // Clear form for new module
            setFormData({ title: '' });
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
            [name]: '',
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.title.trim()) errors.title = 'Module title is required.';
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
            <h5 className="mb-4 text-primary">{isEditMode ? texts.forms.updateModule : texts.forms.addModule}</h5>

            <Form.Group className="mb-3" controlId="moduleTitle">
                <Form.Label>{texts.forms.moduleTitle}</Form.Label>
                <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    isInvalid={!!formErrors.title}
                    placeholder="e.g., Introduction to CSS"
                />
                <Form.Control.Feedback type="invalid">{formErrors.title}</Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid">
                <CustomButton
                    variant="primary"
                    type="submit"
                    isLoading={isLoading}
                >
                    {isEditMode ? texts.forms.updateModule : texts.forms.addModule}
                </CustomButton>
            </div>
        </Form>
    );
};

export default ModuleForm;