// src/components/content/ContentListItem.jsx

import React, {useState} from 'react';
import {Alert, Badge, Button, Collapse, ListGroup} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faAngleDown,
    faAngleUp,
    faClipboardList,
    faCloudUploadAlt,
    faCodeBranch,
    faEdit,
    faExternalLinkAlt,
    faEye,
    faFileVideo,
    faInfoCircle,
    faPlusCircle,
    faQuestionCircle,
    faTasks,
    faTrash
} from '@fortawesome/free-solid-svg-icons'; // Import faEye
import CustomButton from '../common/CustomButton.jsx';
import texts from '../../../i18n/texts.js';
import MarkdownRenderer from '../common/MarkdownRender.jsx'; // Corrected import

// Helper to determine icon and type label based on content type (from DTO or CatalogDTO)
const getContentInfo = (content) => {
    let icon = faInfoCircle;
    let typeLabel = "Content";
    let variant = "secondary";

    // Prioritize ContentDTO's currentContentRelease type if available (teacher view)
    // Otherwise, use the type directly from the content object (student view or specific release)
    const contentType = content?.currentContentRelease?.type || content?.type;

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
    return {icon, typeLabel, variant};
};


const ContentListItem = ({
                             content,
                             isTeacherView = false,
                             onEditContent,
                             onDeleteContent,
                             onPublishContent,
                             onViewContentVersions,
                             onManageQuiz,
                             onViewContentDetails
                         }) => { // NEW: onViewContentDetails
    const [open, setOpen] = useState(false);
    const {icon, typeLabel, variant} = getContentInfo(content || {});

    const isParentContentDTO = isTeacherView && content?.contentReleases !== undefined;

    if (!content) {
        return (
            <ListGroup.Item className="d-flex justify-content-center py-3">
                <Alert variant="secondary" className="mb-0">Content data missing.</Alert>
            </ListGroup.Item>
        );
    }

    const currentReleaseForDisplay = isTeacherView ? content?.currentContentRelease : content;

    return (
        <ListGroup.Item className="shadow-sm rounded-3 mb-2 p-3">
            <div className="d-flex justify-content-between align-items-center w-100">
                <div className="d-flex align-items-center flex-grow-1">
                    <FontAwesomeIcon icon={icon} className="me-3 text-muted" size="lg"/>
                    <div>
                        <h5 className="mb-0">
                            {content?.title} <Badge bg={variant} className="ms-2">{typeLabel}</Badge>
                        </h5>
                        {!isTeacherView && currentReleaseForDisplay?.description && (
                            <MarkdownRenderer markdownText={currentReleaseForDisplay.description}
                                              className="text-muted mb-0 mt-1"/>
                        )}
                        {isTeacherView && (
                            <small className="text-muted">
                                Content ID: {content?.id} | Current
                                Release: {content?.currentContentRelease?.releaseNum || 'N/A'}
                                {content?.currentContentRelease && content.currentContentRelease?.id && (
                                    <span className="ms-2">(Release ID: {content.currentContentRelease.id})</span>
                                )}
                            </small>
                        )}
                    </div>
                </div>

                {isTeacherView && isParentContentDTO && (
                    <div className="d-flex align-items-center flex-wrap justify-content-end">
                        <CustomButton variant="outline-primary" size="sm" icon={faEdit} className="mb-1 me-2"
                                      onClick={() => onEditContent?.(content, false)}>Edit Metadata</CustomButton>
                        <CustomButton variant="outline-info" size="sm" icon={faCodeBranch} className="mb-1 me-2"
                                      onClick={() => onViewContentVersions?.(content?.id, content?.title)}>View
                            Versions</CustomButton>
                        {content?.type === 'QUIZ' && (
                            <CustomButton variant="outline-warning" size="sm" icon={faTasks} className="mb-1 me-2"
                                          onClick={() => onManageQuiz?.(content?.id, content?.title)}>Manage
                                Quiz</CustomButton>
                        )}
                        <CustomButton variant="outline-danger" size="sm" icon={faTrash} className="mb-1 me-2"
                                      onClick={() => onDeleteContent?.(content?.id, content?.title)}>Delete
                            Content</CustomButton>
                        <Button
                            variant="link"
                            onClick={() => setOpen(!open)}
                            aria-controls={`content-releases-${content?.id}`}
                            aria-expanded={open}
                            className="ms-2 text-decoration-none"
                        >
                            <FontAwesomeIcon icon={open ? faAngleUp : faAngleDown}/>
                        </Button>
                    </div>
                )}
            </div>

            {isTeacherView && isParentContentDTO && (
                <Collapse in={open}>
                    <div id={`content-releases-${content?.id}`} className="mt-3 border-top pt-3">
                        <h6 className="text-secondary">{texts.sections?.allContentReleases}</h6>
                        {content?.contentReleases && content.contentReleases?.length > 0 ? (
                            <ListGroup className="ms-3 border rounded-3 overflow-hidden">
                                {content.contentReleases
                                    ?.sort((a, b) => (b?.releaseNum || 0) - (a?.releaseNum || 0))
                                    ?.map((release) => (
                                        <ListGroup.Item key={release?.id}
                                                        className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center bg-light-subtle py-2 px-3">
                                            <div>
                                                <strong
                                                    className="text-dark">Version {release?.releaseNum}</strong> - {release?.title} (<Badge
                                                bg={getContentInfo(release).variant}>{release?.type}</Badge>)
                                                <br/>
                                                {release?.id &&
                                                    <small className="text-muted">Release ID: {release.id}</small>}
                                                {release?.description && <small className="d-block text-muted"
                                                                                dangerouslySetInnerHTML={{__html: release.description}}></small>}
                                                {release?.videoUrl && <small className="d-block text-muted">Video: <a
                                                    href={release.videoUrl} target="_blank"
                                                    rel="noopener noreferrer">Watch <FontAwesomeIcon
                                                    icon={faExternalLinkAlt} size="xs"/></a></small>}
                                                {release?.resourceLink &&
                                                    <small className="d-block text-muted">Resource: <a
                                                        href={release.resourceLink} target="_blank"
                                                        rel="noopener noreferrer">Download <FontAwesomeIcon
                                                        icon={faExternalLinkAlt} size="xs"/></a></small>}
                                            </div>
                                            <div
                                                className="d-flex flex-row flex-md-column align-items-md-end mt-2 mt-md-0">
                                                {/* Check if this release is the current published one */}
                                                {content?.currentContentRelease?.id === release?.id ? (
                                                    <Badge bg="success"
                                                           className="me-2 mb-md-2">{texts?.sections.published}</Badge>
                                                ) : (
                                                    <Badge bg="danger"
                                                           className="me-2 mb-md-2">{texts?.sections.draft}</Badge>
                                                )}
                                                {/* View Details Button */}
                                                <CustomButton variant="outline-info" size="sm" icon={faEye}
                                                              className="me-2 mb-md-2"
                                                              onClick={() => onViewContentDetails?.(release?.id, release?.type)}>
                                                    {texts.sections?.viewContentDetails}
                                                </CustomButton>
                                                {/* Publish Button */}
                                                <CustomButton variant="outline-success" size="sm"
                                                              icon={faCloudUploadAlt} className="me-2 mb-md-2"
                                                              onClick={() => onPublishContent?.(release?.id, release, content?.id)}>
                                                    {content?.currentContentRelease?.id === release?.id ? texts?.buttons?.publishNewVersion : texts?.buttons?.publish}
                                                </CustomButton>
                                                <CustomButton variant="outline-primary" size="sm" icon={faEdit}
                                                              className="me-2 mb-md-2"
                                                              onClick={() => onEditContent?.(release, true)}>Edit
                                                    Release</CustomButton>
                                                <CustomButton variant="outline-danger" size="sm" icon={faTrash}
                                                              onClick={() => onDeleteContent?.(release?.id, release?.title, true)}>Delete
                                                    Release</CustomButton>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                            </ListGroup>
                        ) : (
                            <p className="text-muted text-center">No content releases found for this content.</p>
                        )}
                        <div className="text-end mt-3">
                            <CustomButton variant="success" size="sm" icon={faPlusCircle}
                                          onClick={() => onEditContent?.(null, true, content?.id)}>Add New
                                Release</CustomButton>
                        </div>
                    </div>
                </Collapse>
            )}

            {/* Student View (collapsed content details) */}
            {!isTeacherView && currentReleaseForDisplay && (
                <div className="mt-2">
                    {currentReleaseForDisplay?.description && (
                        <p className="mb-1"
                           dangerouslySetInnerHTML={{__html: currentReleaseForDisplay.description}}></p>
                    )}
                    {currentReleaseForDisplay?.videoUrl && (
                        <p className="mb-1">Video: <a href={currentReleaseForDisplay.videoUrl} target="_blank"
                                                      rel="noopener noreferrer">Watch <FontAwesomeIcon
                            icon={faExternalLinkAlt} size="xs"/></a></p>
                    )}
                    {currentReleaseForDisplay?.resourceLink && (
                        <p className="mb-1">Resource: <a href={currentReleaseForDisplay.resourceLink} target="_blank"
                                                         rel="noopener noreferrer">Download <FontAwesomeIcon
                            icon={faExternalLinkAlt} size="xs"/></a></p>
                    )}
                </div>
            )}
        </ListGroup.Item>
    );
};

export default ContentListItem;