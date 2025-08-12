// src/components/modals/ContentPublishModal.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner, ListGroup, Badge, Card } from 'react-bootstrap';
import CustomButton from '../common/CustomButton';
import MarkdownRenderer from '../common/MarkdownRender'; // Corrected import
import texts from '../../i18n/texts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faBookOpen, faQuestionCircle, faClipboardList, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash'; // For deep comparison
import MDEditor from '@uiw/react-md-editor';

// Helper to get content type icon and variant
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

// NEW HELPER FUNCTION: Compare current form data against published content
const areContentDetailsModified = (currentFormData, publishedContent, contentType) => {
    if (!publishedContent) return true; // If no published content, it's always considered new/modified

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
            // Note: Questions are not editable in this modal, so this checks if the initial loaded quiz questions differ.
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
            return false; // If type is unknown, and title didn't change, assume not modified
    }
};


const ContentPublishModal = ({ show, onHide, contentToPublish, parentContent, onConfirmPublish, isLoading }) => {
    const [isAlreadyPublished, setIsAlreadyPublished] = useState(false);
    const [isContentModified, setIsContentModified] = useState(false); // Whether current release differs from published

    // Form states for editable fields
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoUrl: '',
        resourceLink: '',
        questions: [], // Include questions for quiz comparison
    });

    // Effect to initialize formData and determine isAlreadyPublished status
    useEffect(() => {
        // console.log("useffect");
        if (contentToPublish) {
            setFormData({
                title: contentToPublish?.title || '',
                description: contentToPublish?.description || '',
                videoUrl: contentToPublish?.videoUrl || '',
                resourceLink: contentToPublish?.resourceLink || '',
                questions: contentToPublish?.questions || [], // Initialize quiz questions
            });

            const isCurrent = parentContent?.currentContentRelease?.id === contentToPublish?.id;

            // console.log(JSON.stringify(contentToPublish));

            if (contentToPublish.releaseNum === 0) {
                setIsAlreadyPublished(false);
            } else {
                setIsAlreadyPublished(true);
            }

        } else {
            setFormData({ title: '', description: '', videoUrl: '', resourceLink: '', questions: [] });
            setIsAlreadyPublished(false);
        }
    }, [contentToPublish, parentContent]);

    // Effect to determine isContentModified based on formData and isAlreadyPublished
    useEffect(() => {
        if (isAlreadyPublished && parentContent?.currentContentRelease) {
            // Compare current form data with the actual published content
            setIsContentModified(areContentDetailsModified(formData, parentContent.currentContentRelease, contentToPublish?.type));
        } else {
            // If not currently published, it's always considered modified (i.e., a new version to publish)
            setIsContentModified(true);
        }
    }, [formData, isAlreadyPublished, parentContent, contentToPublish?.type]); // Dependencies include formData

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // isContentModified will be re-calculated by the useEffect above
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
        }
        // Quiz questions are not editable in this modal, so they are not part of formData.
        // If they were, they would be added to payloadToSend here.

        onConfirmPublish?.(payloadToSend, isAlreadyPublished && isContentModified);
    };

    if (!contentToPublish) {
        return null; // Don't show modal if no content is selected
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

                <Form>
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

                            {(contentToPublish?.type === 'LECTURE' || contentToPublish?.type === 'SUBMISSION') && (
                                <ListGroup.Item>
                                    <Form.Group controlId="publishDescription">
                                        <Form.Label><strong>Description:</strong></Form.Label>

                                        {/* The rich text editor component */}
                                        <MDEditor
                                            value={formData.description}
                                            onChange={value => handleChange({ target: { name: 'description', value } })}
                                            // The editor is disabled if the content type is a Quiz
                                            disabled={isQuiz}
                                        />

                                        {/* The live preview section remains the same */}
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

                            {isQuiz && contentToPublish?.questions && contentToPublish.questions.length > 0 && (
                                <ListGroup.Item>
                                    <strong>Quiz Questions:</strong> {contentToPublish.questions.length}
                                    <ListGroup className="mt-2">
                                        {contentToPublish.questions.map((q, idx) => (
                                            <ListGroup.Item key={q?.id || idx}>
                                                <p className="mb-1"><strong>Q{idx + 1}:</strong> {q?.questionText}</p>
                                                {q?.options?.length > 0 && (
                                                    <ul className="list-unstyled ms-3">
                                                        {q.options.map((opt, optIdx) => (
                                                            <li key={opt?.id || optIdx}>
                                                                {opt?.correct ? <FontAwesomeIcon icon={faInfoCircle} className="text-success me-1" /> : <FontAwesomeIcon icon={faInfoCircle} className="text-muted me-1" />}
                                                                {opt?.optionText}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
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