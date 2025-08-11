// src/pages/ContentVersionsPage.jsx

import React, { useEffect, useState } from 'react';
import { Container, Spinner, Alert, ListGroup, Badge, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// ADD THESE MISSING IMPORTS: faFileVideo, faQuestionCircle, faClipboardList
import { faCloudUploadAlt, faEdit, faTrash, faExternalLinkAlt, faInfoCircle, faFileVideo, faQuestionCircle, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import CustomButton from '../components/common/CustomButton';
import ContentForm from '../components/forms/ContentForm';
import texts from '../i18n/texts';
import useContentApi from '../hooks/useContentApi';

// Helper to determine icon and type label (duplicated from ContentListItem for self-containment)
const getContentInfo = (content) => {
    let icon = faInfoCircle;
    let typeLabel = "Content";
    let variant = "secondary";

    const contentType = content?.type || content?.contentType;

    switch (contentType) {
        case "LECTURE":
        case "LectureCatalogDTO":
            icon = faFileVideo;
            typeLabel = "Lecture";
            variant = "info";
            break;
        case "QUIZ":
        case "QuizCatalogDTO":
            icon = faQuestionCircle;
            typeLabel = "Quiz";
            variant = "warning";
            break;
        case "SUBMISSION":
        case "SubmissionCatalogueDTO":
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


const ContentVersionsPage = () => {
    const { contentId: contentIdParam } = useParams();
    const contentId = parseInt(contentIdParam);
    const navigate = useNavigate();

    const { data: contentVersions, loading, error, getAllContentReleasesForContent, publishContentRelease, deleteContentRelease, editContentMetadata, getContentReleaseById } = useContentApi();

    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingRelease, setEditingRelease] = useState(null);

    useEffect(() => {
        if (isNaN(contentId)) {
            console.error("Invalid content ID provided in URL for versions page.");
            return;
        }
        getAllContentReleasesForContent?.(contentId);
    }, [contentId, refreshTrigger, getAllContentReleasesForContent]);

    const handlePublishRelease = async (releaseId, releaseTitle) => {
        if (window.confirm(texts.courseCard?.confirmPublish?.(`"${releaseTitle}"`))) {
            try {
                // Fetch full details of the specific release to ensure payload is complete
                const fullReleaseDetails = await getContentReleaseById?.(releaseId);
                if (!fullReleaseDetails) throw new Error("Could not retrieve content details for publishing.");

                const payload = {
                    id: releaseId,
                    title: fullReleaseDetails?.title,
                    orderIndex: fullReleaseDetails?.orderIndex,
                    moduleId: fullReleaseDetails?.moduleId, // Module ID of the parent content
                    type: fullReleaseDetails?.type,
                    ...(fullReleaseDetails?.description && { description: fullReleaseDetails.description }),
                    ...(fullReleaseDetails?.videoUrl && { videoUrl: fullReleaseDetails.videoUrl }),
                    ...(fullReleaseDetails?.resourceLink && { resourceLink: fullReleaseDetails.resourceLink }),
                    ...(fullReleaseDetails?.questions && { questions: fullReleaseDetails.questions }),
                };

                await publishContentRelease?.(releaseId, payload);
                alert(texts.alerts?.contentPublishedSuccess);
                setRefreshTrigger(prev => prev + 1);
            } catch (err) {
                alert(texts.alerts?.apiError?.(error?.message || err?.message));
            }
        }
    };

    const handleDeleteRelease = async (releaseId, releaseTitle) => {
        if (window.confirm(texts.courseCard?.confirmDelete?.(`"${releaseTitle}"`))) {
            try {
                await deleteContentRelease?.(releaseId);
                alert(texts.alerts?.contentDeletedSuccess);
                setRefreshTrigger(prev => prev + 1);
            } catch (err) {
                alert(texts.alerts?.apiError?.(error?.message || err?.message));
            }
        }
    };

    const handleEditRelease = async (release) => {
        setEditingRelease(release);
        setShowEditModal(true);
    };

    const handleEditFormSubmit = async (formData) => {
        try {
            await editContentMetadata?.(editingRelease?.id, formData);
            alert(texts.alerts?.contentUpdatedSuccess);
            setShowEditModal(false);
            setEditingRelease(null);
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            alert(texts.alerts?.apiError?.(error?.message || err?.message));
        }
    };


    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading content versions...</span>
                </Spinner>
                <p className="mt-3">Loading content versions...</p>
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

    if (!contentVersions || contentVersions?.length === 0) {
        return (
            <Container className="py-5">
                <Alert variant="info" className="text-center">No versions found for this content (ID: {contentId}).</Alert>
            </Container>
        );
    }

    // Find the current published version to highlight it
    const currentPublishedReleaseId = contentVersions?.find(v => v?.currentContentRelease)?.id;


    return (
        <section className="content-versions-page py-5">
            <Container>
                <h2 className="mb-4 fw-bold text-primary text-center">
                    {texts.sections?.contentVersions}: {contentVersions?.[0]?.title || `Content ID: ${contentId}`}
                </h2>
                <p className="text-center text-muted">Showing all releases for Content ID: {contentId}</p>

                <ListGroup className="mt-4">
                    {contentVersions
                        ?.sort((a, b) => (b?.releaseNum || 0) - (a?.releaseNum || 0)) // Sort by release number, newest first
                        ?.map((release) => {
                            const { icon, typeLabel, variant } = getContentInfo(release);
                            const isCurrent = release?.id === currentPublishedReleaseId; // Check if this is the currently published release

                            return (
                                <ListGroup.Item
                                    key={release?.id}
                                    className={`d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 p-3 shadow-sm rounded-3 ${isCurrent ? 'border-success border-3' : ''}`}
                                >
                                    <div className="d-flex align-items-center flex-grow-1 mb-2 mb-md-0">
                                        <FontAwesomeIcon icon={icon} className="me-3 text-muted" size="lg" />
                                        <div>
                                            <strong className="text-dark">Version {release?.releaseNum}</strong> - {release?.title}
                                            <Badge bg={variant} className="ms-2">{typeLabel}</Badge>
                                            {isCurrent && <Badge bg="success" className="ms-2">Published</Badge>}
                                            <br />
                                            {release?.id && <small className="text-muted">Release ID: {release.id}</small>}
                                            {release?.description && <small className="d-block text-muted">{release.description}</small>}
                                            {release?.videoUrl && <small className="d-block text-muted">Video: <a href={release.videoUrl} target="_blank" rel="noopener noreferrer">Watch <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" /></a></small>}
                                            {release?.resourceLink && <small className="d-block text-muted">Resource: <a href={release.resourceLink} target="_blank" rel="noopener noreferrer">Download <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" /></a></small>}
                                            {/* For Quiz, you might list question count or a link to manage questions */}
                                        </div>
                                    </div>
                                    <div className="d-flex flex-row flex-md-column align-items-md-end">
                                        {!isCurrent && (
                                            <CustomButton
                                                variant="outline-success"
                                                size="sm"
                                                icon={faCloudUploadAlt}
                                                className="me-2 mb-md-2"
                                                onClick={() => handlePublishRelease(release?.id, release?.title)}
                                            >
                                                Publish
                                            </CustomButton>
                                        )}
                                        <CustomButton
                                            variant="outline-primary"
                                            size="sm"
                                            icon={faEdit}
                                            className="me-2 mb-md-2"
                                            onClick={() => handleEditRelease(release)}
                                        >
                                            Edit
                                        </CustomButton>
                                        <CustomButton
                                            variant="outline-danger"
                                            size="sm"
                                            icon={faTrash}
                                            onClick={() => handleDeleteRelease(release?.id, release?.title)}
                                        >
                                            Delete
                                        </CustomButton>
                                    </div>
                                </ListGroup.Item>
                            );
                        })}
                </ListGroup>
            </Container>

            {/* Edit Release Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Content Release: {editingRelease?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ContentForm
                        initialData={editingRelease || {}}
                        onSubmit={handleEditFormSubmit}
                        isEditMode={true} // Always edit mode here
                        isLoading={loading} // Use loading state of API calls
                        moduleId={editingRelease?.moduleId} // Pass the module ID for context
                    />
                </Modal.Body>
            </Modal>
        </section>
    );
};

export default ContentVersionsPage;