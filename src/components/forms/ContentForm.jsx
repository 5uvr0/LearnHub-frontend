// src/components/forms/ContentForm.jsx

import React, { useState, useEffect } from 'react';
import { Form, Alert, Row, Col } from 'react-bootstrap';
import CustomButton from '../common/CustomButton';
import texts from '../../i18n/texts';
import MDEditor from '@uiw/react-md-editor'; // Import the MDEditor component

const ContentForm = ({ initialData = {}, onSubmit, isEditMode = false, isLoading = false, moduleId }) => {
    const [contentType, setContentType] = useState(initialData.type || '');
    const [formData, setFormData] = useState({
        title: initialData.title || '',
        orderIndex: initialData.orderIndex !== undefined ? initialData.orderIndex : '',
        description: initialData.description || '',
        videoUrl: initialData.videoUrl || '',
        resourceLink: initialData.resourceLink || '',
        questions: initialData.questions || [],
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (isEditMode && initialData) {
            setContentType(initialData.type || '');
            setFormData({
                title: initialData.title || '',
                orderIndex: initialData.orderIndex !== undefined ? initialData.orderIndex : '',
                description: initialData.description || '',
                videoUrl: initialData.videoUrl || '',
                resourceLink: initialData.resourceLink || '',
                questions: initialData.questions || [],
            });
        } else if (!isEditMode) {
            // Clear form for new content
            setContentType('');
            setFormData({
                title: '',
                orderIndex: '',
                description: '',
                videoUrl: '',
                resourceLink: '',
                questions: [],
            });
        }
    }, [initialData, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'orderIndex' ? (value === '' ? '' : parseInt(value)) : value,
        }));
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    // New handler for the MDEditor component
    const handleDescriptionChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            description: value,
        }));
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            description: '',
        }));
    };

    const handleContentTypeChange = (e) => {
        const newType = e.target.value;
        setContentType(newType);
        setFormData(prevData => ({
            ...prevData,
            description: '', videoUrl: '', resourceLink: '', questions: [],
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.title.trim()) errors.title = 'Content title is required.';
        if (formData.orderIndex === '' || isNaN(formData.orderIndex) || formData.orderIndex < 0) {
            errors.orderIndex = 'Order index must be a non-negative number.';
        }
        if (!contentType) errors.type = texts.alerts.contentFormSelectType;

        // Add validation for description for applicable content types
        if ((contentType === 'LECTURE' || contentType === 'SUBMISSION') && !formData.description.trim()) {
            errors.description = 'Description is required.';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const payload = {
                title: formData.title,
                orderIndex: formData.orderIndex,
                moduleId: moduleId,
                type: contentType,
            };

            if (contentType === 'LECTURE') {
                payload.description = formData.description;
                payload.videoUrl = formData.videoUrl;
                payload.resourceLink = formData.resourceLink;
            } else if (contentType === 'QUIZ') {
                payload.questions = formData.questions;
            } else if (contentType === 'SUBMISSION') {
                payload.description = formData.description;
                payload.resourceLink = formData.resourceLink;
            }
            onSubmit(payload);
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="p-4 border rounded-4 shadow-sm bg-light">
            <h5 className="mb-4 text-primary">{isEditMode ? texts.forms.updateContent : texts.forms.addContent}</h5>

            <Form.Group className="mb-3" controlId="contentTitle">
                <Form.Label>{texts.forms.contentTitle}</Form.Label>
                <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    isInvalid={!!formErrors.title}
                    placeholder="e.g., Variables in JavaScript"
                />
                <Form.Control.Feedback type="invalid">{formErrors.title}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="contentOrderIndex">
                <Form.Label>{texts.forms.contentOrderIndex}</Form.Label>
                <Form.Control
                    type="number"
                    name="orderIndex"
                    value={formData.orderIndex}
                    onChange={handleChange}
                    isInvalid={!!formErrors.orderIndex}
                    min="0"
                />
                <Form.Control.Feedback type="invalid">{formErrors.orderIndex}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="contentType">
                <Form.Label>{texts.forms.contentType}</Form.Label>
                <Form.Select
                    name="type"
                    value={contentType}
                    onChange={handleContentTypeChange}
                    isInvalid={!!formErrors.type}
                    disabled={isEditMode}
                >
                    <option value="">Select content type...</option>
                    <option value="LECTURE">Lecture</option>
                    <option value="QUIZ">Quiz</option>
                    <option value="SUBMISSION">Submission</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{formErrors.type}</Form.Control.Feedback>
            </Form.Group>

            {contentType === 'LECTURE' && (
                <>
                    <Form.Group className="mb-3" controlId="lectureDescription">
                        <Form.Label>{texts.forms.lectureDescription}</Form.Label>
                        {/* Replace the textarea with MDEditor */}
                        <MDEditor
                            value={formData.description}
                            onChange={handleDescriptionChange}
                        />
                        {/* Custom feedback styling */}
                        <div className="invalid-feedback d-block">{formErrors.description}</div>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="lectureVideoUrl">
                        <Form.Label>{texts.forms.lectureVideoUrl}</Form.Label>
                        <Form.Control
                            type="url"
                            name="videoUrl"
                            value={formData.videoUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/video.mp4"
                        />
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="lectureResourceLink">
                        <Form.Label>{texts.forms.lectureResourceLink}</Form.Label>
                        <Form.Control
                            type="url"
                            name="resourceLink"
                            value={formData.resourceLink}
                            onChange={handleChange}
                            placeholder="https://example.com/notes.pdf"
                        />
                    </Form.Group>
                </>
            )}

            {contentType === 'QUIZ' && (
                <Alert variant="info" className="mb-4">
                    Quiz question management is not yet implemented in this form. You would add a sub-form here.
                </Alert>
            )}

            {contentType === 'SUBMISSION' && (
                <>
                    <Form.Group className="mb-3" controlId="submissionDescription">
                        <Form.Label>{texts.forms.submissionDescription}</Form.Label>
                        {/* Replace the textarea with MDEditor */}
                        <MDEditor
                            value={formData.description}
                            onChange={handleDescriptionChange}
                        />
                        {/* Custom feedback styling */}
                        <div className="invalid-feedback d-block">{formErrors.description}</div>
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="submissionResourceLink">
                        <Form.Label>{texts.forms.submissionResourceLink}</Form.Label>
                        <Form.Control
                            type="url"
                            name="resourceLink"
                            value={formData.resourceLink}
                            onChange={handleChange}
                            placeholder="https://example.com/assignment_details.pdf"
                        />
                    </Form.Group>
                </>
            )}

            <div className="d-grid">
                <CustomButton
                    variant="primary"
                    type="submit"
                    isLoading={isLoading}
                >
                    {isEditMode ? texts.forms.updateContent : texts.forms.addContent}
                </CustomButton>
            </div>
        </Form>
    );
};

export default ContentForm;