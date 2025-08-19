// src/components/modals/ContentEditModal.jsx

import React, {useEffect, useState} from 'react';
import {Alert, Badge, Button, Card, Form, ListGroup, Modal} from 'react-bootstrap';
import CustomButton from '../../common/CustomButton.jsx';
import MarkdownRenderer from '../../common/MarkdownRender.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBookOpen, faClipboardList, faInfoCircle, faQuestionCircle} from '@fortawesome/free-solid-svg-icons';
import MDEditor from '@uiw/react-md-editor';

// Helper to get content type info (can be shared with ContentPublishModal)
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
    return {icon, typeLabel, variant};
};


const ContentEditModal = ({show, onHide, contentToEdit, onSaveDraft, onPublish, isLoading}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoUrl: '',
        resourceLink: '',
    });

    useEffect(() => {
        if (contentToEdit) {
            setFormData({
                title: contentToEdit?.title || '',
                description: contentToEdit?.description || '',
                videoUrl: contentToEdit?.videoUrl || '',
                resourceLink: contentToEdit?.resourceLink || '',
            });
        }
    }, [contentToEdit]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSaveDraft = () => {
        if (!formData.title.trim()) {
            alert('Title is required to save the draft.');
            return;
        }

        const payload = {
            id: contentToEdit?.id,
            title: formData.title,
            description: formData.description,
            videoUrl: formData.videoUrl,
            resourceLink: formData.resourceLink,
        };

        onSaveDraft?.(payload);
    };

    const handlePublish = () => {
        onPublish?.(contentToEdit?.id);
    };

    if (!contentToEdit) {
        return null;
    }

    const {icon, typeLabel, variant} = getContentTypeInfo(contentToEdit);
    const isQuiz = contentToEdit?.type === 'QUIZ';

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit Content Draft</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert variant="info">
                    You are editing the latest draft of this content. Saving changes here will not affect the published
                    version.
                </Alert>
                <Form>
                    <Card className="mb-3 shadow-sm border-0 rounded-4">
                        <Card.Header className="fw-bold d-flex align-items-center">
                            <FontAwesomeIcon icon={icon} className="me-3 text-muted" size="lg"/>
                            <h5 className="mb-0">{contentToEdit?.title} <Badge bg={variant}
                                                                               className="ms-2">{typeLabel}</Badge></h5>
                        </Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <strong>Content ID:</strong> {contentToEdit?.id || 'N/A'}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Form.Group controlId="editTitle">
                                    <Form.Label><strong>Title:</strong></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </Form.Group>
                            </ListGroup.Item>

                            {(contentToEdit?.type === 'LECTURE' || contentToEdit?.type === 'SUBMISSION') && (
                                <ListGroup.Item>
                                    <Form.Group controlId="editDescription">
                                        <Form.Label><strong>Description:</strong></Form.Label>
                                        <MDEditor
                                            value={formData.description}
                                            onChange={value => handleChange({target: {name: 'description', value}})}
                                            disabled={isLoading}
                                        />
                                        <div className="text-muted small mt-1">
                                            <MarkdownRenderer markdownText={formData.description}
                                                              className="border p-2 rounded"/>
                                        </div>
                                    </Form.Group>
                                </ListGroup.Item>
                            )}

                            {contentToEdit?.type === 'LECTURE' && (
                                <>
                                    <ListGroup.Item>
                                        <Form.Group controlId="editVideoUrl">
                                            <Form.Label><strong>Video URL:</strong></Form.Label>
                                            <Form.Control
                                                type="url"
                                                name="videoUrl"
                                                value={formData.videoUrl}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                            />
                                        </Form.Group>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Form.Group controlId="editResourceLink">
                                            <Form.Label><strong>Resource Link:</strong></Form.Label>
                                            <Form.Control
                                                type="url"
                                                name="resourceLink"
                                                value={formData.resourceLink}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                            />
                                        </Form.Group>
                                    </ListGroup.Item>
                                </>
                            )}
                            {contentToEdit?.type === 'SUBMISSION' && (
                                <ListGroup.Item>
                                    <Form.Group controlId="editResourceLink">
                                        <Form.Label><strong>Resource Link:</strong></Form.Label>
                                        <Form.Control
                                            type="url"
                                            name="resourceLink"
                                            value={formData.resourceLink}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                        />
                                    </Form.Group>
                                </ListGroup.Item>
                            )}

                            {isQuiz && (
                                <ListGroup.Item>
                                    <Alert variant="info" className="text-center my-2">
                                        Quiz questions and options are managed in the dedicated Quiz Configurator page.
                                    </Alert>
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
                    variant="primary"
                    onClick={handleSaveDraft}
                    isLoading={isLoading}
                >
                    Save Draft
                </CustomButton>
                <CustomButton
                    variant="success"
                    onClick={handlePublish}
                    isLoading={isLoading}
                >
                    Publish
                </CustomButton>
            </Modal.Footer>
        </Modal>
    );
};

export default ContentEditModal;