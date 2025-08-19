// src/components/modals/ContentPublishModal.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, ListGroup, Badge, Card, InputGroup } from 'react-bootstrap';
import CustomButton from '../../common/CustomButton.jsx';
import MarkdownRenderer from '../../common/MarkdownRender.jsx';
import texts from '../../../i18n/texts.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faBookOpen, faQuestionCircle, faClipboardList, faInfoCircle, faPlus, faEdit, faTrash, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import MDEditor from '@uiw/react-md-editor';

// Helper to get content type info
const getContentTypeInfo = (content) => {
    let icon = faInfoCircle;
    let typeLabel = "Content";
    let variant = "secondary";

    const contentType = content?.type;

    switch (contentType) {
        case "LECTURE":
            icon = faBookOpen;
            typeLabel = "Lecture";
            variant = "info";
            break;
        case "QUIZ":
            icon = faQuestionCircle;
            typeLabel = "Quiz";
            variant = "warning";
            break;
        case "SUBMISSION":
            icon = faClipboardList;
            typeLabel = "Submission";
            variant = "success";
            break;
        default:
            icon = faInfoCircle;
            typeLabel = "Unknown";
            variant = "secondary";
    }
    return { icon, typeLabel, variant };
};


// NEW/RE-ADDED HELPER FUNCTION: Compare current form data against published content
const areContentDetailsModified = (currentFormData, publishedContent, contentType) => {
    // If no published content, it's a new version, so it's always considered modified
    if (!publishedContent) {
        return true;
    }

    // Always compare title
    if (currentFormData.title !== publishedContent.title) {
        return true;
    }

    switch (contentType) {
        case "LECTURE":
            return (
                currentFormData.description !== publishedContent.description ||
                currentFormData.videoUrl !== publishedContent.videoUrl ||
                currentFormData.resourceLink !== publishedContent.resourceLink
            );
        case "SUBMISSION":
            return (
                currentFormData.description !== publishedContent.description ||
                currentFormData.resourceLink !== publishedContent.resourceLink
            );
        case "QUIZ":
            // For Quiz, compare the questions array deeply.
            // This is crucial as questions/options are now edited inside the modal.
            return !_.isEqual(
                currentFormData.questions?.map(q => ({
                    questionText: q?.questionText,
                    options: q?.options?.map(o => ({ optionText: o?.optionText, correct: o?.correct }))
                })),
                publishedContent.questions?.map(q => ({
                    questionText: q?.questionText,
                    options: q?.options?.map(o => ({ optionText: o?.optionText, correct: o?.correct }))
                }))
            );
        default:
            return false;
    }
};


const ContentPublishModal = ({ show, onHide, contentToPublish, parentContent, onConfirmPublish, isLoading }) => {
    const [isAlreadyPublished, setIsAlreadyPublished] = useState(false);
    const [isContentModified, setIsContentModified] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoUrl: '',
        resourceLink: '',
        questions: [],
    });

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
        if (contentToPublish) {
            setFormData({
                title: contentToPublish?.title || '',
                description: contentToPublish?.description || '',
                videoUrl: contentToPublish?.videoUrl || '',
                resourceLink: contentToPublish?.resourceLink || '',
                questions: contentToPublish?.questions || [],
            });
            setIsAlreadyPublished(contentToPublish.releaseNum > 0);
        } else {
            setFormData({ title: '', description: '', videoUrl: '', resourceLink: '', questions: [] });
            setIsAlreadyPublished(false);
        }
    }, [contentToPublish, parentContent]);

    useEffect(() => {
        if (isAlreadyPublished && parentContent?.currentContentRelease) {
            setIsContentModified(areContentDetailsModified(formData, parentContent.currentContentRelease, contentToPublish?.type));
        } else {
            setIsContentModified(true);
        }
    }, [formData, isAlreadyPublished, parentContent, contentToPublish?.type]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddQuestion = () => {
        if (newQuestionText.trim()) {
            const newQuestion = {
                id: `temp-${Date.now()}`,
                questionText: newQuestionText,
                options: [],
            };
            setFormData(prev => ({ ...prev, questions: [...prev.questions, newQuestion] }));
            setNewQuestionText('');
        }
    };

    const handleUpdateQuestionText = () => {
        if (editQuestionText.trim() && editQuestionId) {
            setFormData(prev => ({
                ...prev,
                questions: prev.questions.map(q =>
                    q.id === editQuestionId ? { ...q, questionText: editQuestionText } : q
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
                    q.id === addOptionQuestionId ? { ...q, options: [...(q.options || []), newOption] } : q
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
                                opt.id === editOptionData.id ? { ...opt, optionText: editOptionText, correct: editOptionIsCorrect } : opt
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
                    q.id === questionId ? { ...q, options: q.options.filter(opt => opt.id !== optionId) } : q
                )
            }));
        }
    };

    const handlePublish = () => {
        if (isAlreadyPublished && !isContentModified) {
            alert(texts.alerts?.contentAlreadyPublished);
            onHide();
            return;
        }

        const payloadToSend = {
            id: contentToPublish?.id,
            title: formData.title,
            orderIndex: contentToPublish?.orderIndex,
            moduleId: contentToPublish?.moduleId,
            type: contentToPublish?.type,
        };

        if (contentToPublish?.type === 'LECTURE' || contentToPublish?.type === 'SUBMISSION') {
            payloadToSend.description = formData.description;
            payloadToSend.resourceLink = formData.resourceLink;
            if (contentToPublish?.type === 'LECTURE') {
                payloadToSend.videoUrl = formData.videoUrl;
            }
        } else if (contentToPublish?.type === 'QUIZ') {
            // Filter out temporary IDs before sending to backend
            const finalQuestions = formData.questions.map(q => ({
                ...q,
                id: typeof q.id === 'string' && q.id.startsWith('temp-') ? null : q.id,
                options: q.options.map(o => ({
                    ...o,
                    id: typeof o.id === 'string' && o.id.startsWith('temp-') ? null : o.id,
                }))
            }));
            payloadToSend.questions = finalQuestions;
            console.log(finalQuestions);
        }

        onConfirmPublish?.(payloadToSend);
    };

    if (!contentToPublish) {
        return null;
    }

    const { icon, typeLabel, variant } = getContentTypeInfo(contentToPublish);
    const isQuiz = contentToPublish?.type === 'QUIZ';

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{texts.sections?.publishContentModalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert variant={isAlreadyPublished ? (isContentModified ? "warning" : "info") : "primary"}>
                    {isAlreadyPublished ?
                        (isContentModified ? "This is the currently published version, but changes were detected. Publishing will update it." : "This content release is already the currently published version and no changes were detected.") :
                        `You are about to publish version ${contentToPublish?.releaseNum || 'N/A'} of "${contentToPublish?.title}".`}
                </Alert>

                <Form onSubmit={(e) => e.preventDefault()}> {/* Use a single Form for the whole modal */}
                    <Card className="mb-3 shadow-sm border-0 rounded-4">
                        <Card.Header className="fw-bold d-flex align-items-center">
                            <FontAwesomeIcon icon={icon} className="me-3 text-muted" size="lg" />
                            <h5 className="mb-0">{contentToPublish?.title} <Badge bg={variant} className="ms-2">{typeLabel}</Badge></h5>
                        </Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <strong>Release Number:</strong> {contentToPublish?.releaseNum || 'N/A'}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Form.Group controlId="publishTitle">
                                    <Form.Label><strong>Title:</strong></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        disabled={isQuiz}
                                    />
                                </Form.Group>
                            </ListGroup.Item>

                            {/* ... (Other content type fields) */}
                            {(contentToPublish?.type === 'LECTURE' || contentToPublish?.type === 'SUBMISSION') && (
                                <ListGroup.Item>
                                    <Form.Group controlId="publishDescription">
                                        <Form.Label><strong>Description:</strong></Form.Label>
                                        <MDEditor
                                            value={formData.description}
                                            onChange={value => handleChange({ target: { name: 'description', value } })}
                                            disabled={isQuiz}
                                        />
                                        <div className="text-muted small mt-1">
                                            <MarkdownRenderer markdownText={formData.description} className="border p-2 rounded" />
                                        </div>
                                    </Form.Group>
                                </ListGroup.Item>
                            )}

                            {contentToPublish?.type === 'LECTURE' && (
                                <>
                                    <ListGroup.Item>
                                        <Form.Group controlId="publishVideoUrl">
                                            <Form.Label><strong>Video URL:</strong></Form.Label>
                                            <Form.Control
                                                type="url"
                                                name="videoUrl"
                                                value={formData.videoUrl}
                                                onChange={handleChange}
                                                disabled={isQuiz}
                                            />
                                        </Form.Group>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Form.Group controlId="publishResourceLink">
                                            <Form.Label><strong>Resource Link:</strong></Form.Label>
                                            <Form.Control
                                                type="url"
                                                name="resourceLink"
                                                value={formData.resourceLink}
                                                onChange={handleChange}
                                                disabled={isQuiz}
                                            />
                                        </Form.Group>
                                    </ListGroup.Item>
                                </>
                            )}
                            {contentToPublish?.type === 'SUBMISSION' && (
                                <ListGroup.Item>
                                    <Form.Group controlId="publishResourceLink">
                                        <Form.Label><strong>Resource Link:</strong></Form.Label>
                                        <Form.Control
                                            type="url"
                                            name="resourceLink"
                                            value={formData.resourceLink}
                                            onChange={handleChange}
                                            disabled={isQuiz}
                                        />
                                    </Form.Group>
                                </ListGroup.Item>
                            )}
                            {isQuiz && (
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
                                                                <CustomButton variant="outline-primary" size="sm" icon={faEdit} className="me-2" onClick={() => { setEditQuestionId(question.id); setEditQuestionText(question.questionText); }}>
                                                                    Edit
                                                                </CustomButton>
                                                                <CustomButton variant="outline-danger" size="sm" icon={faTrash} onClick={() => handleDeleteQuestion(question.id)}>
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
                                                                    <CustomButton variant="primary" onClick={handleUpdateQuestionText}>Save</CustomButton>
                                                                    <CustomButton variant="secondary" onClick={() => setEditQuestionId(null)}>Cancel</CustomButton>
                                                                </InputGroup>
                                                            </div>
                                                        )}
                                                        <h6 className="text-muted mt-3">Options</h6>
                                                        <ListGroup className="ms-3">
                                                            {(question.options || []).map((opt, optIndex) => (
                                                                <ListGroup.Item key={opt.id} className="d-flex justify-content-between align-items-center py-2 px-3 bg-light-subtle">
                                                                    <span>
                                                                        {opt.optionText}
                                                                        {opt.correct && <FontAwesomeIcon icon={faCheckCircle} className="ms-2 text-success" />}
                                                                        {!opt.correct && <FontAwesomeIcon icon={faTimesCircle} className="ms-2 text-danger" />}
                                                                    </span>
                                                                    <div>
                                                                        <CustomButton variant="outline-primary" size="sm" icon={faEdit} className="me-2" onClick={() => { setEditOptionData({ id: opt.id, questionId: question.id }); setEditOptionText(opt.optionText); setEditOptionIsCorrect(opt.correct); }}>
                                                                            Edit
                                                                        </CustomButton>
                                                                        <CustomButton variant="outline-danger" size="sm" icon={faTrash} onClick={() => handleDeleteOption(question.id, opt.id)}>
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
                                                                    <CustomButton variant="primary" onClick={handleUpdateOption}>Save</CustomButton>
                                                                    <CustomButton variant="secondary" onClick={() => setEditOptionData(null)}>Cancel</CustomButton>
                                                                </InputGroup>
                                                            </div>
                                                        )}
                                                        <div className="text-end mt-3">
                                                            <CustomButton variant="info" size="sm" icon={faPlus} onClick={() => setAddOptionQuestionId(question.id)}>
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
                                                                    <CustomButton variant="primary" onClick={handleAddOption}>Add</CustomButton>
                                                                    <CustomButton variant="secondary" onClick={() => setAddOptionQuestionId(null)}>Cancel</CustomButton>
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
                        </ListGroup>
                    </Card>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <CustomButton
                    variant="success"
                    onClick={handlePublish}
                    isLoading={isLoading}
                    disabled={isAlreadyPublished && !isContentModified}
                >
                    {isAlreadyPublished ? texts.buttons?.publishNewVersion : texts.buttons?.publish}
                </CustomButton>
            </Modal.Footer>
        </Modal>
    );
};

export default ContentPublishModal;