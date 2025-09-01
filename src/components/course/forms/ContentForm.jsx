// src/components/forms/ContentForm.jsx

import React, {useEffect, useState} from 'react';
import {Alert, Form, InputGroup, ListGroup} from 'react-bootstrap';
import CustomButton from '../../common/CustomButton.jsx';
import texts from '../../../i18n/texts.js';
import MDEditor from '@uiw/react-md-editor';
import {faCheckCircle, faEdit, faPlus, faTimesCircle, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"; // Import the MDEditor component

const ContentForm = ({initialData = {}, onSubmit, isEditMode = false, isLoading = false, moduleId}) => {
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

    const [newQuestionText, setNewQuestionText] = useState('');
    const [editQuestionId, setEditQuestionId] = useState(null);
    const [editQuestionText, setEditQuestionText] = useState('');

    const [addOptionQuestionId, setAddOptionQuestionId] = useState(null);
    const [newOptionText, setNewOptionText] = useState('');
    const [newOptionIsCorrect, setNewOptionIsCorrect] = useState(false);
    const [editOptionData, setEditOptionData] = useState(null);
    const [editOptionText, setEditOptionText] = useState('');
    const [editOptionIsCorrect, setEditOptionIsCorrect] = useState(false);

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
        const {name, value} = e.target;
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

    const handleAddQuestion = () => {
        if (newQuestionText.trim()) {
            const newQuestion = {
                id: `temp-${Date.now()}`,
                questionText: newQuestionText,
                options: [],
            };
            setFormData(prev => ({...prev, questions: [...prev.questions, newQuestion]}));
            setNewQuestionText('');
        }
    };

    const handleUpdateQuestionText = () => {
        if (editQuestionText.trim() && editQuestionId) {
            setFormData(prev => ({
                ...prev,
                questions: prev.questions.map(q =>
                    q.id === editQuestionId ? {...q, questionText: editQuestionText} : q
                )
            }));
            setEditQuestionId(null);
            setEditQuestionText('');
        }
    };

    const handleDeleteQuestion = (questionId) => {
        if (window.confirm("Are you sure you want to delete this question?")) {
            setFormData(prev => ({
                ...prev,
                questions: prev.questions.filter(q => q.id !== questionId)
            }));
        }
    };

    const handleAddOption = (e) => {
        e.preventDefault();
        if (newOptionText.trim() && addOptionQuestionId) {
            const newOption = {
                id: `temp-opt-${Date.now()}`,
                optionText: newOptionText,
                correct: newOptionIsCorrect,
            };
            setFormData(prev => ({
                ...prev,
                questions: prev.questions.map(q =>
                    q.id === addOptionQuestionId ? {...q, options: [...(q.options || []), newOption]} : q
                )
            }));
            setNewOptionText('');
            setNewOptionIsCorrect(false);
            setAddOptionQuestionId(null);
        }
    };

    const handleUpdateOption = () => {
        if (editOptionText.trim() && editOptionData) {
            setFormData(prev => ({
                ...prev,
                questions: prev.questions.map(q =>
                    q.id === editOptionData.questionId ?
                        {
                            ...q,
                            options: q.options.map(opt =>
                                opt.id === editOptionData.id ? {
                                    ...opt,
                                    optionText: editOptionText,
                                    correct: editOptionIsCorrect
                                } : opt
                            )
                        } : q
                )
            }));
            setEditOptionData(null);
            setEditOptionText('');
            setEditOptionIsCorrect(false);
        }
    };

    const handleDeleteOption = (questionId, optionId) => {
        if (window.confirm("Are you sure you want to delete this option?")) {
            setFormData(prev => ({
                ...prev,
                questions: prev.questions.map(q =>
                    q.id === questionId ? {...q, options: q.options.filter(opt => opt.id !== optionId)} : q
                )
            }));
        }
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

        console.log("Form data");
        console.log(formData);

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
                // Filter out temporary IDs before sending to backend
                const finalQuestions = formData.questions.map(q => ({
                    ...q,
                    id: typeof q.id === 'string' && q.id.startsWith('temp-') ? null : q.id,
                    options: (q.options || []).map(o => ({
                        ...o,
                        id: typeof o.id === 'string' && o.id.startsWith('temp-') ? null : o.id,
                    }))
                }));

                // This is where you assign the processed questions to the payload
                payload.questions = finalQuestions;

                // Corrected console.log to show the object content correctly
                console.log("final questions:", payload.questions);

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
                <ListGroup.Item>
                    <div className="mb-3">
                        <h5 className="mb-3 text-secondary">Quiz Questions</h5>
                        {formData.questions?.length > 0 ? (
                            <ListGroup>
                                {formData.questions.map((question, qIndex) => (
                                    <ListGroup.Item key={question.id} className="mb-2">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="mb-0">Q{qIndex + 1}: {question.questionText}</h6>
                                            <div>
                                                <CustomButton variant="outline-primary" size="sm" icon={faEdit}
                                                              className="me-2" onClick={() => {
                                                    setEditQuestionId(question.id);
                                                    setEditQuestionText(question.questionText);
                                                }}>
                                                    Edit
                                                </CustomButton>
                                                <CustomButton variant="outline-danger" size="sm" icon={faTrash}
                                                              onClick={() => handleDeleteQuestion(question.id)}>
                                                    Delete
                                                </CustomButton>
                                            </div>
                                        </div>
                                        {editQuestionId === question.id && (
                                            <div className="my-2">
                                                <InputGroup>
                                                    <Form.Control
                                                        type="text"
                                                        value={editQuestionText}
                                                        onChange={(e) => setEditQuestionText(e.target.value)}
                                                    />
                                                    <CustomButton variant="primary"
                                                                  onClick={handleUpdateQuestionText}>Save</CustomButton>
                                                    <CustomButton variant="secondary"
                                                                  onClick={() => setEditQuestionId(null)}>Cancel</CustomButton>
                                                </InputGroup>
                                            </div>
                                        )}
                                        <h6 className="text-muted mt-3">Options</h6>
                                        <ListGroup className="ms-3">
                                            {(question.options || []).map((opt, optIndex) => (
                                                <ListGroup.Item key={opt.id}
                                                                className="d-flex justify-content-between align-items-center py-2 px-3 bg-light-subtle">
                                                                    <span>
                                                                        {opt.optionText}
                                                                        {opt.correct &&
                                                                            <FontAwesomeIcon icon={faCheckCircle}
                                                                                             className="ms-2 text-success"/>}
                                                                        {!opt.correct &&
                                                                            <FontAwesomeIcon icon={faTimesCircle}
                                                                                             className="ms-2 text-danger"/>}
                                                                    </span>
                                                    <div>
                                                        <CustomButton variant="outline-primary" size="sm" icon={faEdit}
                                                                      className="me-2" onClick={() => {
                                                            setEditOptionData({id: opt.id, questionId: question.id});
                                                            setEditOptionText(opt.optionText);
                                                            setEditOptionIsCorrect(opt.correct);
                                                        }}>
                                                            Edit
                                                        </CustomButton>
                                                        <CustomButton variant="outline-danger" size="sm" icon={faTrash}
                                                                      onClick={() => handleDeleteOption(question.id, opt.id)}>
                                                            Delete
                                                        </CustomButton>
                                                    </div>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                        {editOptionData?.id && editOptionData?.questionId === question.id && (
                                            <div className="mt-2">
                                                <InputGroup>
                                                    <Form.Control
                                                        type="text"
                                                        value={editOptionText}
                                                        onChange={(e) => setEditOptionText(e.target.value)}
                                                    />
                                                    <InputGroup.Checkbox
                                                        checked={editOptionIsCorrect}
                                                        onChange={(e) => setEditOptionIsCorrect(e.target.checked)}
                                                    />
                                                    <CustomButton variant="primary"
                                                                  onClick={handleUpdateOption}>Save</CustomButton>
                                                    <CustomButton variant="secondary"
                                                                  onClick={() => setEditOptionData(null)}>Cancel</CustomButton>
                                                </InputGroup>
                                            </div>
                                        )}
                                        <div className="text-end mt-3">
                                            <CustomButton variant="info" size="sm" icon={faPlus}
                                                          onClick={() => setAddOptionQuestionId(question.id)}>
                                                Add Option
                                            </CustomButton>
                                        </div>
                                        {addOptionQuestionId === question.id && (
                                            <div className="mt-2">
                                                <InputGroup>
                                                    <Form.Control
                                                        type="text"
                                                        value={newOptionText}
                                                        onChange={(e) => setNewOptionText(e.target.value)}
                                                        placeholder="Enter new option"
                                                    />
                                                    <InputGroup.Checkbox
                                                        checked={newOptionIsCorrect}
                                                        onChange={(e) => setNewOptionIsCorrect(e.target.checked)}
                                                    />
                                                    <CustomButton variant="primary"
                                                                  onClick={handleAddOption}>Add</CustomButton>
                                                    <CustomButton variant="secondary"
                                                                  onClick={() => setAddOptionQuestionId(null)}>Cancel</CustomButton>
                                                </InputGroup>
                                            </div>
                                        )}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        ) : (
                            <Alert variant="info" className="text-center">No questions added yet.</Alert>
                        )}
                        <div className="mt-4">
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    value={newQuestionText}
                                    onChange={(e) => setNewQuestionText(e.target.value)}
                                    placeholder="Enter new question text"
                                />
                                <CustomButton variant="primary" onClick={handleAddQuestion} icon={faPlus}>
                                    Add Question
                                </CustomButton>
                            </InputGroup>
                        </div>
                    </div>
                </ListGroup.Item>
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