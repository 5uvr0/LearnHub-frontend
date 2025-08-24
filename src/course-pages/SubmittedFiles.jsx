// src/pages/SubmittedFiles.jsx

import React, { useEffect, useState } from 'react';
import { Container, Spinner, Alert, Card, ListGroup, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faDownload, faCheckCircle, faTimesCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import CustomButton from '../components/common/CustomButton';
import texts from '../i18n/texts';
import useEnrollmentApi from '../course-hooks/useEnrollmentApi';
import useContentApi from '../course-hooks/useContentApi';

const SubmittedFilesPage = () => {
    // Remove courseId from useParams
    const { contentId: contentIdParam } = useParams();
    const contentId = parseInt(contentIdParam);
    const navigate = useNavigate();

    const {
        data: submissions,
        loading: loadingSubmissions,
        error: submissionsError,
        getLatestSubmissionsForContent,
        markSubmissionAsResolved,
        downloadSubmissionFile
    } = useEnrollmentApi();

    const {
        data: course,
        loading: loadingContent,
        error: contentError,
        getCourse
    } = useContentApi();

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        if (isNaN(contentId)) {
            console.error("Invalid content ID provided in URL.");
            return;
        }
        getCourse?.(contentId);
    }, [contentId, refreshTrigger, getCourse]);

    // NEW: useEffect to fetch submissions after content details are loaded
    useEffect(() => {
        if (course && contentId) {
            getLatestSubmissionsForContent?.(course.id, contentId);
        }
    }, [course, refreshTrigger, getLatestSubmissionsForContent]);


    const handleMarkAsResolved = async (submissionId, studentName) => {
        if (window.confirm(`Mark submission by ${studentName} as resolved?`)) {
            try {
                await markSubmissionAsResolved?.(submissionId);
                alert(`Submission by ${studentName} marked as resolved!`);
                setRefreshTrigger(prev => prev + 1);
            } catch (err) {
                alert(texts.alerts?.apiError?.(err?.message || 'Failed to mark submission as resolved.'));
            }
        }
    };

    const handleDownloadFile = async (submissionId, fileName) => {
        try {
            alert(`Initiating download for: ${fileName} (Submission ID: ${submissionId})`);
            // await downloadSubmissionFile?.(submissionId);
        } catch (err) {
            alert(texts.alerts?.apiError?.(err?.message || 'Failed to download file.'));
        }
    };

    const isLoading = loadingSubmissions || loadingContent;
    const hasError = submissionsError || contentError;

    if (isLoading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading data...</span>
                </Spinner>
                <p className="mt-3">Loading submitted files...</p>
            </Container>
        );
    }

    if (hasError) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{texts.alerts?.apiError?.(submissionsError?.message || contentError?.message)}</Alert>
            </Container>
        );
    }

    return (
        <section className="submitted-files-page py-5">
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <CustomButton variant="secondary" icon={faArrowLeft} onClick={() => navigate(-1)}>
                        Back
                    </CustomButton>
                    <h2 className="mb-0 fw-bold text-primary text-center flex-grow-1">
                        Submissions for "{submissions?.title || 'Submission'}"
                    </h2>
                </div>

                {submissions && submissions.length > 0 ? (
                    <ListGroup className="g-3">
                        {submissions.map((submission) => (
                            <ListGroup.Item key={submission?.id} className="mb-3 p-3 shadow-sm rounded-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5 className="mb-0 d-flex align-items-center">
                                        <FontAwesomeIcon icon={faFileAlt} className="me-2 text-info" />
                                        Submission by {submission?.studentName || 'N/A'}
                                    </h5>
                                    <div>
                                        <Badge bg={submission?.resolved ? 'success' : 'warning'} className="me-2">
                                            {submission?.resolved ? 'Resolved' : 'Pending'}
                                        </Badge>
                                        <CustomButton
                                            variant="outline-primary"
                                            size="sm"
                                            icon={faDownload}
                                            className="me-2"
                                            onClick={() => handleDownloadFile(submission?.id, submission?.fileName || 'file')}
                                        >
                                            Download
                                        </CustomButton>
                                        {!submission?.resolved && (
                                            <CustomButton
                                                variant="outline-success"
                                                size="sm"
                                                icon={faCheckCircle}
                                                onClick={() => handleMarkAsResolved(submission?.id, submission?.studentName)}
                                            >
                                                Mark as Resolved
                                            </CustomButton>
                                        )}
                                    </div>
                                </div>
                                <p className="text-muted mb-1">
                                    Submitted On: {new Date(submission?.submissionDate).toLocaleString()}
                                </p>
                                <p className="text-muted mb-0">
                                    File: {submission?.fileName || 'N/A'}
                                </p>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <Alert variant="info" className="text-center">
                        No submissions found for this content.
                    </Alert>
                )}
            </Container>
        </section>
    );
};

export default SubmittedFilesPage;