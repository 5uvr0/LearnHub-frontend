// src/pages/LectureDetailsPage.jsx

import React, { useEffect } from 'react';
import {Container, Spinner, Alert, Card, ListGroup, Badge} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import MarkdownRenderer from '../components/course/common/MarkdownRender'; // Corrected import
import texts from '../i18n/texts';
import useContentApi from '../course-hooks/useContentApi';

const LectureDetailsPage = () => {
    const { releaseId: contentReleaseIdParam } = useParams();
    const contentReleaseId = parseInt(contentReleaseIdParam);

    const { data: lecture, loading, error, getContentReleaseById } = useContentApi();

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
                    <span className="visually-hidden">Loading lecture details...</span>
                </Spinner>
                <p className="mt-3">Loading lecture details...</p>
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

    if (!lecture || lecture?.type !== 'LECTURE') {
        return (
            <Container className="py-5">
                <Alert variant="warning">{texts.alerts?.contentNotFound}</Alert>
            </Container>
        );
    }

    return (
        <section className="lecture-details-page py-5">
            <Container>
                <h2 className="mb-4 fw-bold text-primary text-center">
                    {texts.sections?.lectureDetails}: {lecture?.title}
                    {lecture?.releaseNum !== 0 ? (
                        <Badge bg="success"
                               className="me-2 mb-md-2 ms-2">{texts?.sections.published}</Badge>
                    ) : (
                        <Badge bg="danger"
                               className="me-2 mb-md-2">{texts?.sections.draft}</Badge>
                    )}
                </h2>

                <Card className="shadow-sm border-0 rounded-4 p-4">
                    <Card.Body>
                        <Card.Title className="fw-bold text-secondary mb-3 d-flex align-items-center">
                            <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                            {lecture?.title} (Version: {lecture?.releaseNum})
                        </Card.Title>
                        <hr />
                        <ListGroup variant="flush">
                            {lecture?.description && (
                                <ListGroup.Item>
                                    <strong>Description:</strong> <MarkdownRenderer markdownText={lecture.description} className="d-inline" />
                                </ListGroup.Item>
                            )}
                            {lecture?.videoUrl && (
                                <ListGroup.Item>
                                    <strong>Video URL:</strong> <a href={lecture.videoUrl} target="_blank" rel="noopener noreferrer">{lecture.videoUrl} <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" /></a>
                                </ListGroup.Item>
                            )}
                            {lecture?.resourceLink && (
                                <ListGroup.Item>
                                    <strong>Resource Link:</strong> <a href={lecture.resourceLink} target="_blank" rel="noopener noreferrer">{lecture.resourceLink} <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" /></a>
                                </ListGroup.Item>
                            )}
                            <ListGroup.Item>
                                <strong>Content ID:</strong> {lecture?.contentId}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Release ID:</strong> {lecture?.id}
                            </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>
            </Container>
        </section>
    );
};

export default LectureDetailsPage;