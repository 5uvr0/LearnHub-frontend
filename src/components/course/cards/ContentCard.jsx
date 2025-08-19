// src/components/course/content/ContentCard.jsx

import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import CustomButton from '../../common/CustomButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faQuestionCircle, faClipboardList, faEdit, faEye } from '@fortawesome/free-solid-svg-icons'; // Import relevant icons

const getContentTypeInfo = (content) => {
    let icon = faEye;
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
            icon = faEye;
            typeLabel = "Unknown";
            variant = "secondary";
    }
    return { icon, typeLabel, variant };
};

const ContentCard = ({ content, onEditContent, onManageQuiz, onViewContentDetails }) => {
    if (!content) {
        return (
            <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden text-center p-3">
                <Card.Body>
                    <p className="text-muted">Content data missing.</p>
                </Card.Body>
            </Card>
        );
    }

    const { icon, typeLabel, variant } = getContentTypeInfo(content);

    return (
        <Card className="h-100 shadow-sm border-0 rounded-4">
            <Card.Body className="d-flex flex-column">
                <div className="d-flex align-items-center mb-2">
                    <FontAwesomeIcon icon={icon} className={`me-2 text-${variant}`} />
                    <Card.Title className="fw-bold mb-0">{content?.title}</Card.Title>
                    <Badge bg={variant} className="ms-2">{typeLabel}</Badge>
                </div>
                <Card.Subtitle className="mb-2 text-muted">
                    Module ID: {content?.moduleId || 'N/A'} | Order: {content?.orderIndex}
                </Card.Subtitle>
                {/* You can add a description summary here if content.description is available and relevant */}
                <Card.Text className="text-secondary flex-grow-1">
                    {content?.description ? `${content.description.substring(0, 100)}...` : 'No description provided.'}
                </Card.Text>
                <div className="d-flex flex-wrap justify-content-between align-items-center mt-3">
                    {content.type === 'QUIZ' ? (
                        <CustomButton
                            variant="info"
                            size="sm"
                            icon={faEdit}
                            className="mb-2 me-2"
                            onClick={() => onManageQuiz?.(content?.id)}
                        >
                            Manage Quiz
                        </CustomButton>
                    ) : (
                        <CustomButton
                            variant="warning"
                            size="sm"
                            icon={faEdit}
                            className="mb-2 me-2"
                            onClick={() => onEditContent?.(content?.id)}
                        >
                            Edit Content
                        </CustomButton>
                    )}
                    <CustomButton
                        variant="outline-secondary"
                        size="sm"
                        icon={faEye}
                        className="mb-2"
                        onClick={() => onViewContentDetails?.(content?.id, content?.type)}
                    >
                        View Details
                    </CustomButton>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ContentCard;