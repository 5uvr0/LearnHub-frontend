// src/pages/SubmissionDetailsPage.jsx

import React, { useEffect } from 'react';
import { Container, Spinner, Alert, Card, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import MarkdownRenderer from '../components/common/MarkdownRender'; // Corrected import
import texts from '../i18n/texts';
import useContentApi from '../course-hooks/useContentApi';

const SubmissionDetailsPage = () => {
    const { releaseId: contentReleaseIdParam } = useParams();
    const contentReleaseId = parseInt(contentReleaseIdParam);

    const { data: submission, loading, error, getContentReleaseById } = useContentApi();

    useEffect(() => {
        if (isNaN(contentReleaseId)) {
            console.error("Invalid content release ID provided in URL.");
            return;
        }
        getContentReleaseById?.(contentReleaseId);
    }, [contentReleaseId, getContentReleaseById]);

    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading submission details...</span>
                </Spinner>
                <p className="mt-3">Loading submission details...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{texts.alerts?.apiError?.(error?.message)}</Alert>
            </Container>
        );
    }

    if (!submission || submission?.type !== 'SUBMISSION') {
        return (
            <Container className="py-5">
                <Alert variant="warning">{texts.alerts?.contentNotFound}</Alert>
            </Container>
        );
    }

    return (
        <section className="submission-details-page py-5">
            <Container>
                <h2 className="mb-4 fw-bold text-primary text-center">
                    {texts.sections?.submissionDetails}: {submission?.title}
                </h2>

                <Card className="shadow-sm border-0 rounded-4 p-4">
                    <Card.Body>
                        <Card.Title className="fw-bold text-secondary mb-3 d-flex align-items-center">
                            <FontAwesomeIcon icon={faClipboardList} className="me-2" />
                            {submission?.title} (Version: {submission?.releaseNum || 'N/A'})
                        </Card.Title>
                        <hr />
                        <ListGroup variant="flush">
                            {submission?.description && (
                                <ListGroup.Item>
                                    <strong>Description:</strong> <MarkdownRenderer markdownText={submission.description} className="d-inline" />
                                </ListGroup.Item>
                            )}
                            {submission?.resourceLink && (
                                <ListGroup.Item>
                                    <strong>Resource Link:</strong> <a href={submission.resourceLink} target="_blank" rel="noopener noreferrer">{submission.resourceLink} <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" /></a>
                                </ListGroup.Item>
                            )}
                            <ListGroup.Item>
                                <strong>Content ID:</strong> {submission?.contentId}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Release ID:</strong> {submission?.id}
                            </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>
            </Container>
        </section>
    );
};

export default SubmissionDetailsPage;